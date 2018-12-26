module AnimalChess {
	export class AIController {
		public constructor() {
		}
		private _round: RoundType;
		contronType: ChessType;
		private selfChessesGrid: ChessGrid[];
		private comptitorChessesGrid: ChessGrid[];
		private isAttack = false;
		set round(value: RoundType) {
			this._round = value;
			if (value === RoundType.self) {
				App.TimerManager.doTimer(1000, 1, this.aicontrol, this);
				GameAnimalChessView.instance.chessboardController.hideSelfChesses();
			}
		}

		private aicontrol = () => {
			if (!GameAnimalChessView.instance) {
				return;
			}
			let chessboardController = GameAnimalChessView.instance.chessboardController;
			let userController = GameAnimalChessView.instance.userController;
			let chesses = chessboardController.chessboardMap;
			this.selfChessesGrid = [];
			this.comptitorChessesGrid = [];
			/** 找到所有自己控制，显示的棋子格 */
			for (let i in chesses) {
				if (chesses[i].chess && chesses[i].chess.type === this.contronType && chesses[i].chess.isVisible) {
					this.selfChessesGrid.push(chesses[i]);
				}
				if (chesses[i].chess && chesses[i].chess.type !== this.contronType && chesses[i].chess.isVisible) {
					this.comptitorChessesGrid.push(chesses[i]);
				}
				chesses[i]["scan"] = false
			}
			if (this.selfChessesGrid.length < this.comptitorChessesGrid.length) {
				this.isAttack = false;
			} else {
				this.isAttack = true;
			}

			/** 看看能不能吃临近对方的棋子 */
			for (let chessGrid of this.selfChessesGrid) {
				let walkGrids = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
				/**周围可以走 */
				if (walkGrids.length > 0) {
					for (let targetGrid of walkGrids) {
						/**存在对方棋子,吃*/
						if (targetGrid.chess && targetGrid.chess.type !== this.contronType && targetGrid.chess.isVisible) {
							if (!this.isAttack && chessboardController.gradeCompare(chessGrid.chess, targetGrid.chess) === 1) {
								chessboardController.move(chessGrid.position.x, chessGrid.position.y, targetGrid.position.x, targetGrid.position.y, false);
								App.TimerManager.doTimer(550, 1, this.setUserData, this);
								return;
							}
							if (this.isAttack && chessboardController.gradeCompare(chessGrid.chess, targetGrid.chess) !== 2) {
								chessboardController.move(chessGrid.position.x, chessGrid.position.y, targetGrid.position.x, targetGrid.position.y, false);
								App.TimerManager.doTimer(550, 1, this.setUserData, this);
								return;
							}
						}
					}
				}
			}

			/**能不能吃远处的棋子 */
			let walkablesDis = {};
			let numbers: number[] = []
			for (let chessGrid of this.selfChessesGrid) {
				let walkables = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
				/**周围可以走 */
				if (walkables.length > 0) {
					for (let walkable of walkables) {
						/**不存在对方棋子,看周围*/
						this.currentChess = chessGrid;
						let targetChessGrid = this.seeAround(walkable);
						if (targetChessGrid) {
							walkablesDis[this.dis] = { start: chessGrid, end: targetChessGrid };
							numbers.push(this.dis);
						}
						this.restoreGrids();
					}
				}
			}

			numbers.sort((x, y) => {
				return x - y;
			});

			for (let n of numbers) {
				//存在吃的过去吃
				let startChessGrid = walkablesDis[n].start;
				let targetChessGrid = walkablesDis[n].end;
				if (targetChessGrid.position.x > startChessGrid.position.x) {
					let id = chessboardController.getId(startChessGrid.position.x + 1, startChessGrid.position.y);
					if (!chessboardController.chessboardMap[id].chess) {
						chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x + 1, startChessGrid.position.y, false);
						App.TimerManager.doTimer(550, 1, this.setUserData, this);
						return;
					}
				}
				if (targetChessGrid.position.x < startChessGrid.position.x) {
					let id = chessboardController.getId(startChessGrid.position.x - 1, startChessGrid.position.y);
					if (!chessboardController.chessboardMap[id].chess) {
						chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x - 1, startChessGrid.position.y, false);
						App.TimerManager.doTimer(550, 1, this.setUserData, this);
						return;
					}
				}
				if (targetChessGrid.position.y > startChessGrid.position.y) {
					let id = chessboardController.getId(startChessGrid.position.x, startChessGrid.position.y + 1);
					if (!chessboardController.chessboardMap[id].chess) {
						chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x, startChessGrid.position.y + 1, false);
						App.TimerManager.doTimer(550, 1, this.setUserData, this);
						return;
					}
				}
				if (targetChessGrid.position.y < startChessGrid.position.y) {
					let id = chessboardController.getId(startChessGrid.position.x, startChessGrid.position.y - 1);
					if (!chessboardController.chessboardMap[id].chess) {
						chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x, startChessGrid.position.y - 1, false);
						App.TimerManager.doTimer(550, 1, this.setUserData, this);
						return;
					}
				}
			}
			/**没有自己显示的棋子，或者有显示的棋子但是不能移动 */
			let hideChesses: ChessGrid[] = []
			/** 没有掀开的棋子数组 ，掀开棋子*/
			for (let i in chesses) {
				if (chesses[i].chess && !chesses[i].chess.isVisible) {
					hideChesses.push(chesses[i]);
				}
			}
			if (hideChesses.length > 0) {
				let random = Math.floor(Math.random() * hideChesses.length);
				chessboardController.displayGrid(hideChesses[random].position.x, hideChesses[random].position.y, false);
				App.TimerManager.doTimer(550, 1, this.setUserData, this);
				return;
			}

			/**没有可以吃的了也不能掀开棋子，随机走一步 */
			for (let chessGrid of this.selfChessesGrid) {
				let walkables = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
				/**周围可以走 */
				let random = Math.floor(Math.random() * walkables.length);
				let endChessGrid = walkables[random];
				chessboardController.move(chessGrid.position.x, chessGrid.position.y, endChessGrid.position.x, endChessGrid.position.y, false);
				App.TimerManager.doTimer(550, 1, this.setUserData, this);
				return;
			}
		}
		private setUserData = () => {
			let result = GameAnimalChessView.instance.chessboardController.getChessNumber();
			if (result.isAllDisplay)
				if (result.RED == 0 || result.BLUE == 0)
					return;
			this._round = RoundType.competitor;
			GameAnimalChessView.instance.userController.currentRound = RoundType.self;
			GameAnimalChessView.instance.chessboardController.showSelfChesses();
		}
		private currentChess: ChessGrid;
		private dis: number = 0;//距离多少有能吃的棋子
		//看周围有没有能吃的
		seeAround = (chessGrid: ChessGrid): ChessGrid => {
			let chessboardController = GameAnimalChessView.instance.chessboardController;
			let userController = GameAnimalChessView.instance.userController;
			let walkables = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
			chessGrid["scan"] = true;
			/**周围可以走 */
			if (walkables.length > 0) {
				for (let walkable of walkables) {
					/**存在对方棋子,吃*/
					if (walkable.chess && this.currentChess.chess && walkable.chess.type !== this.contronType && walkable.chess.isVisible) {
						if (!this.isAttack && chessboardController.gradeCompare(this.currentChess.chess, walkable.chess) === 1) {
							this.dis++;
							return walkable;
						}
						if (this.isAttack && chessboardController.gradeCompare(this.currentChess.chess, walkable.chess) !== 2) {
							this.dis++;
							return walkable;
						}
					}
				}
			}
			for (let walkable of walkables) {
				/**不存在对方棋子*/
				if (!walkable["scan"]) {
					this.dis++;
					return this.seeAround(walkable);
				}
			}
		}
		restoreGrids() {
			let chessboardMap = GameAnimalChessView.instance.chessboardController.chessboardMap;
			for (let id in chessboardMap) {
				chessboardMap[id]["scan"] = false;
			}
		}
		dispose = () => {
			App.TimerManager.remove(this.setUserData, this);
		}
	}
}