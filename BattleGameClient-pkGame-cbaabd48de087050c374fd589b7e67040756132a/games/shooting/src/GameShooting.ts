class GameShooting {
	userController: ShootingUserController;
	competitorController: ShootingComController;
	private itemController: ShootingItemController;
	scoreController: ShootingScoreController;
	private ai: GameShootingAI;
	items: ShootingItem[] = [];
	isOffLine = false;
	isWuDi = true;
	userID: string;
	shields = {};
	bullets: ShootingBullet[] = [];
	static point: egret.Point = new egret.Point();
	public constructor() {
		this.isWuDi = true;
		if (DataCenter.instance.room.IsAI) {
			this.isOffLine = true;
		}
		this.userID = DataCenter.instance.user.id.toString();
	}

	private initObjects(): void {
		let arr = [];
		for (let i = 0; i < UserConfig.bulletLimit; i++) {
			arr.push(ShootingBullet.popShootingBullet());
		}
		while (arr.length) {
			ObjectPool.push(arr.pop());
		}

		for (var i = 0; i < 5; i++) {
			arr.push(ShootingBullet.popShootingBullet_rocket());
			arr.push(ObjectPool.pop(ShootingRocket, "ShootingRocket"));
			arr.push(ObjectPool.pop(ShootingSplit, "ShootingSplit"));
		}
		while (arr.length) {
			ObjectPool.push(arr.pop());
		}
	}

	init() {
		//对象的提前创建
		this.initObjects();

		/**注册相关控制组件 */
		this.competitorController = new ShootingComController();
		this.itemController = new ShootingItemController();
		this.userController = new ShootingUserController();
		this.scoreController = new ShootingScoreController();
		if (this.isOffLine)
			this.ai = new GameShootingAI(this.competitorController);
		/**注册UI控制按钮 */
		//结果返回
		App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
		//下一局 
		App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);

		App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
		//增加背景音乐
		this.initBgMusic();
	}
	pauseCallback = () => {
		App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
		GameShootingView.instance.next("gameChangeMatch");
	}
	private onGameEvent(data: any) {

		let parseData = (data: string): string[] => {
			let splitChar = data.split("|");
			return splitChar;
		}
		let datas = parseData(data.event);
		switch (datas[0]) {
			case "nextRound":
				if (datas[1] == this.userID) {
					this.scoreController.setUserScore(parseInt(datas[2]));
					this.scoreController.setCompetitorScore(parseInt(datas[3]));
				} else {
					this.scoreController.setCompetitorScore(parseInt(datas[2]));
					this.scoreController.setUserScore(parseInt(datas[3]));
				}
				this.nextRound();
				break;
			case "shieldDestroy":
				if (this.shields[datas[1]]) {
					this.shields[datas[1]].destroy();
				}
				break;
			default:
				break;
		}
	}
	nextRound() {
		this.competitorController.nextRound();
		this.userController.nextRound();
		this.clearGameItems();
		GameShootingView.instance.controlLayer.shield = UserConfig.shieldLimit;
		egret.Tween.get(GameShootingView.instance.roundBG).to({ alpha: 0 }, 100).call(() => {
			GameShootingView.instance.timeImg.play();
		});
	}
	private stopthisRoundNumber: number;
	//回掉中开启下一局
	stopThisRound(callback?: Function) {
		this.itemController.stop();
		if (this.isOffLine)
			this.ai.stop();
		if (callback) {//开始下一局
			this.stopthisRoundNumber = setTimeout(() => {
				egret.Tween.get(GameShootingView.instance.roundBG).to({ alpha: 0.9 }, 100).call(() => {
					this.clearGameItems();
					callback();
				});
				clearTimeout(this.stopthisRoundNumber);
				this.stopthisRoundNumber = undefined;
			}, 200);
		} else {//不开始下一局
			this.clearGameItems();
		}
	}
	private initBgMusic(): void {
		App.SoundManager.playBg("ShootingBgMusic_mp3");
	}
	private delayAi: number;
	startTime = () => {
		this.itemController.play();
		this.isWuDi = false;
		if (this.isOffLine) {
			GameShootingAI.shieldLimit = UserConfig.shieldLimit;
			GameShootingAI.bulleteLimit = UserConfig.bulletLimit;
			this.delayAi = setTimeout(() => {
				this.ai.play();
				clearTimeout(this.delayAi);
				this.delayAi = undefined;
			}, 100);
		}
	}
	clearGameItems() {
		while (this.bullets.length) {
			var bullet = this.bullets[0];
			bullet.destroy();
		}

		for (let key in this.shields) {
			var shield = this.shields[key];
			shield.destroy();
		}
		this.shields = {};

		while (this.items.length) {
			var item = this.items[0];
			item.destroy();
		}
	}
	onGameResult = (data: any): void => {
		DataCenter.instance.room.gameResult = data;
		let resultPageFun = () => {
			if (data.winUserId == DataCenter.instance.user.id) {
				GameShootingView.instance.resultWin();
			} else {
				GameShootingView.instance.resultlose();
			}
			setTimeout(() => {
				DataCenter.instance.room.gameResult = data;
				GameShootingView.instance.popup("GameResult");
				this.dispose();
			}, 3000)
		}
		// 弹出结果面板
		DataCenter.instance.room.gameResult = data;
		// 发送游戏结果
		GameShootingView.instance.popup("GameResult", resultPageFun);
	}
	public dispose(): void {
		App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
		App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
		App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);

		this.clearGameItems();
		this.userController.dispose()
		this.itemController.dispose()
		this.competitorController.dispose();
		this.scoreController.dispose();

		/**去掉有可能存在的延迟函数 */
		if (this.delayAi) {
			clearTimeout(this.delayAi);
			this.delayAi = undefined;
		}
		if (this.stopthisRoundNumber) {
			clearTimeout(this.stopthisRoundNumber);
			this.stopthisRoundNumber = undefined;
		}
		if (this.isOffLine) {
			this.ai.dipose();
		}
		ObjectPool.clearClass("ShootingBullet");
		ObjectPool.clearClass("ShootingBullet_rocket");
		ObjectPool.clearClass("ShootingSplit");
		ObjectPool.clearClass("ShootingRocket");
	}
}

