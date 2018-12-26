namespace AnimalChess {
    export class ChessboardController {
        /**棋盘数据，记录每个格子的内容，包括动物种类，颜色*/
        private _chessboardGrid: {
            [id: number]: ChessGrid
        };
        /**动物种类数 */
        private animalLength = 8
        /**棋盘的宽高 */
        sideNum = 4;
        /** 移动特效 */
        private moveAffect: DBArmature;
        /** 上一手 */
        public onOneHand: egret.Bitmap = null;
        /**哪个动物在叫*/
        public numSound: number = 0;
        AI: AIController;
        /**棋盘初始化 */
        chessboardInit() {

            //主机确定地图
            // if (DataCenter.instance.room.selfIsMaster) {
            let group: ChessJson[] = [
                { animalGrade: 0, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 1, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 2, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 3, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 4, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 5, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 6, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 7, type: ChessType.RED, isVisible: false, position: null },
                { animalGrade: 0, type: ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 1, type: ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 2, type: ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 3, type: ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 4, type: ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 5, type: ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 6, type: ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 7, type: ChessType.BLUE, isVisible: false, position: null },
            ]
            let checkerboard: { [id: number]: ChessGrid } = {};
            let transformData = [];
            // let indexlist = [6, 11, 9, 15, 3, 0, 13, 10, 2, 14, 5, 12, 7, 1, 8, 4]
            for (let i = 0; i < this.sideNum; i++) {
                for (let j = 0; j < this.sideNum; j++) {
                    //j是X,i是y
                    let id = this.getId(j, i);
                     let index = Math.floor(GameAnimalChessView.random() * group.length);

                    //  console.log("3333333333333333:::::"+GameAnimalChessView.random() * group.length);
                    //  console.log("4444444444:::::"+ group.length);
                    //console.log("6666666666:::::"+ index);
                    //console.log("111111111111111:::::"+DataCenter.instance.room.IsAI)
                    //let index=0;
                    // let index = indexlist[id];
                    let gridData = group[index];
                    gridData.position = { x: j, y: i };
                    checkerboard[id] = new ChessGrid(gridData.position, gridData.type, gridData.animalGrade);
                    let data = {
                        id: id, position: gridData.position, type: gridData.type, animalGrade: gridData.animalGrade
                    };
                    transformData.push(data);
                    group.splice(index, 1);

                    checkerboard[id].x = checkerboard[id].position.x * 157.5 * GameAnimalChessView.scale;
                    checkerboard[id].y = checkerboard[id].position.y * 175 * GameAnimalChessView.scale;
                    checkerboard[id].touchEnabled = true;
                    checkerboard[id].addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                        GameAnimalChessView.instance.userController.clickHandler(id)
                    }, this);
                    GameAnimalChessView.instance.gameLayer.addChild(checkerboard[id]);
                    if (DataCenter.instance.room.selfIsMaster)//提示边框
                        checkerboard[id].chess.showVisibleBorder();
                }
                this._chessboardGrid = checkerboard;
                
                if (DataCenter.instance.room.IsAI) {
                    this.AI = new AIController();
                }
                this.moveAffect = AssetManager.getDBArmature("yidong");
                this.moveAffect.x = -300;
                this.moveAffect.y = -300;
                GameAnimalChessView.instance.gameLayer.addChild(this.moveAffect);
            }
           
            if (!DataCenter.instance.room.IsAI) {
                //下一局
                App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            }

        }
        private onGameEvent(data: any) {
            let parseData = (data: string): string[] => {
                let splitChar = data.split("|");
                return splitChar;
            }
            let datas = parseData(data.event);
            switch (datas[0]) {
                case "nextRound":
                    if (datas[1] === "show") {
                        this.displayGrid(parseInt(datas[2]), parseInt(datas[3]), false);
                    }
                    if (datas[1] === "move") {
                        this.move(parseInt(datas[2]), parseInt(datas[3]), parseInt(datas[4]), parseInt(datas[5]), false);
                    }
                    GameAnimalChessView.instance.userController.currentRound = RoundType.self;
                    this.showSelfChesses();
                    /** 可以请求和局 */
                    GameAnimalChessView.instance.userController.canDrawn = true;
                    break;
                case "comcontrol":
                    if (GameAnimalChessView.instance.userController.controlChess === undefined) {
                        GameAnimalChessView.instance.userController.controlChess = parseInt(datas[1]);
                    }
                    break;

            }
        }

        /**根据xy得到棋盘中的位置,棋盘中的位置转换为数组中的位置 */
        public getId(x: number, y: number) {
            if (x < 0 || x > this.sideNum)
                return null;
            if (y < 0 || y >= this.sideNum)
                return null;
            let result = y * this.sideNum + x;
            return result;
        }
        /** 
         *  判断给定的点是否可走，返回布尔值
         */
        private isGridWalkable(startID: number, endID: number, result?: ChessGrid[]) {
            if (endID === null) return false;
            let startGrid = this._chessboardGrid[startID];
            let endGrid = this._chessboardGrid[endID];
            if (!endGrid.chess) {
                if (result) result.push(endGrid);
                return true;
            }
            if (endGrid && startGrid.type !== endGrid.chess.type && endGrid.chess.isVisible) {
                if (result) result.push(endGrid);
                return true;
            }
            return false;
        }
        /**
         * 返回1 A吃B
         * 返回2 B吃A
         * 返回3 AB同归
         */
        gradeCompare(A: Chess, B: Chess): number {
            let result: ChessGrid;
            if (A.animalGrade === AnimalGrade.mouse && B.animalGrade === AnimalGrade.elephant ||
                A.animalGrade === AnimalGrade.elephant && B.animalGrade === AnimalGrade.mouse) {
                this.numSound = 0;
                //老鼠与大象
                if (A.animalGrade === AnimalGrade.mouse)
                    return 1;
                else
                    return 2;
            } else {
                //正常比较
                let difference = A.animalGrade - B.animalGrade;
                if (difference > 0) {
                    this.numSound = A.animalGrade;
                    return 1;
                }

                else if (difference < 0) {
                    this.numSound = B.animalGrade;
                    return 2;
                }

                else if (difference === 0) {
                    this.numSound = A.animalGrade;
                    return 3;
                }
            }
        }
        /** 下一回合 */
        private sendNextRound(command?: string, isWin = false) {
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "nextRound|" + command);
                this.hideSelfChesses();
            } else {
                if (!isWin)
                    this.AI.round = RoundType.self;
            }
            /** 可以请求平局 */
            GameAnimalChessView.instance.userController.canDrawn = true;
        }

        sendResult(isWin: number) {
            //console.log(DataCenter.instance.room.id + "号房发送结果为" + DataCenter.instance.user.id + ":" + isWin)
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, isWin);
        }

        /**遍历查询所剩棋子 */
        getChessNumber(): chessNumer {
            let blue: number = 0;
            let red: number = 0;
            let isAllDisplay = true;
            for (let i in this.chessboardMap) {
                if (this.chessboardMap[i].chess) {
                    if (this.chessboardMap[i].chess.isVisible == false) {
                        isAllDisplay = false;
                    }
                    if (this.chessboardMap[i].chess.type === ChessType.RED) {
                        red++;
                    } else {
                        blue++;
                    }
                }
            }
            return { RED: red, BLUE: blue, isAllDisplay: isAllDisplay };
        }
        /**检测是否开启追击模式检测 */
        private checkOpenChase(): void {
            let numbers = this.getChessNumber();
            if (numbers.RED + numbers.BLUE <= 3 && GameAnimalChessView.instance.userController.wasteLimit === UserController.normalLimit) {
                GameAnimalChessView.instance.userController.openChase();
                if (!DataCenter.instance.room.IsAI)
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "openChase");
            }
        }
        chessTypeWin(color: ChessType) {
            if (GameAnimalChessView.instance.userController.controlChess === color)
                this.sendResult(3);
            else
                this.sendResult(1)
        }

        /** 垃圾操作过多，检查牌面逻辑 ,并判断胜利*/
        checkChess = () => {
            let blueChesses: number[] = [];
            let redChesses: number[] = [];
            for (let i in this.chessboardMap) {
                if (this.chessboardMap[i].chess) {
                    if (this.chessboardMap[i].chess.type === ChessType.RED) {
                        redChesses.push(this.chessboardMap[i].chess.animalGrade)
                    } else {
                        blueChesses.push(this.chessboardMap[i].chess.animalGrade)
                    }
                }
            }
            if (redChesses.length > blueChesses.length) {
                this.chessTypeWin(ChessType.RED)
                return;
            }
            else if (redChesses.length < blueChesses.length) {
                this.chessTypeWin(ChessType.BLUE)
            } else {
                redChesses.sort((x, y) => {
                    return y - x;
                });
                blueChesses.sort((x, y) => {
                    return y - x;
                });
                for (let i = 0; i < redChesses.length; i++) {
                    if (redChesses[i] > blueChesses[i]) {
                        this.chessTypeWin(ChessType.RED)
                    } else if (redChesses[i] < blueChesses[i]) {
                        this.chessTypeWin(ChessType.BLUE)
                    }
                }
            }
        }
        /**显示可走位置 */
        public getWalkableGrid(x: number, y: number) {
            let midId = this.getId(x, y);
            let grid = this._chessboardGrid[midId];
            let pointId: number;
            let result: ChessGrid[] = [];
            if ((x - 1) >= 0) {
                pointId = this.getId(x - 1, y);
                this.isGridWalkable(midId, pointId, result);
            }
            if ((x + 1) <= this.sideNum - 1) {
                pointId = this.getId(x + 1, y);
                this.isGridWalkable(midId, pointId, result);
            }
            if ((y - 1) >= 0) {
                pointId = this.getId(x, y - 1);
                this.isGridWalkable(midId, pointId, result);
            }
            if ((y + 1) <= this.sideNum - 1) {
                pointId = this.getId(x, y + 1);
                this.isGridWalkable(midId, pointId, result);
            }
            return result;
        }

        private win(winChess: Chess, loseChess: Chess, endGrid: ChessGrid): void {
            let userController = GameAnimalChessView.instance.userController;
            let shengli = AssetManager.getDBArmature("shengliqipao");
            let dongwu = AssetManager.getBitmap(AnimalGrade[winChess.animalGrade] + "_png");
            shengli.replaceSlot("dongwucao", dongwu);
            let point: egret.Point;
            let dis = endGrid.localToGlobal(loseChess.x, loseChess.y, point);
            shengli.x = dis.x;
            shengli.y = dis.y;
            GameAnimalChessView.instance.UILayer.addChild(shengli);
            shengli.play("shengliqibao");
            let targetX: number;
            let targetY: number;
            let target: DBArmature;
            if (winChess.type === userController.controlChess) {
                targetX = userController.comImg.x - 40 * GameAnimalChessView.scale;
                targetY = userController.comImg.y;
                target = userController.comImg;
                shengli.scaleX = -1;
            } else {
                targetX = userController.userImg.x + 40 * GameAnimalChessView.scale;
                targetY = userController.userImg.y;
                target = userController.userImg;
            }
            //动物移动
            egret.Tween.get(shengli).to({
                x: targetX, y: targetY
            }, 1000)//动物移动完成，开始击飞动画 
                .call(() => {
                    target.play("shibaitanfei", 1);
                    let shadow = AssetManager.getBitmap("shadow_png");
                    if (winChess.type === userController.controlChess) {
                        shadow.x = targetX + target.width / 4;
                    } else {
                        shadow.x = targetX - target.width / 4;
                    }
                    shadow.y = targetY;
                    GameAnimalChessView.instance.UILayer.addChild(shadow);
                    egret.Tween.get(target).to({
                        x: App.GameWidth / 2, y: 100
                    }, 1000).call(() => {
                        if (winChess.type == userController.controlChess) {
                            userController.userImg.play("win1");
                        }
                        else {
                            userController.comImg.play("win2");
                        }
                        this.chessTypeWin(winChess.type);
                    });
                });
        }

        /**
         * 移动位置 
         * 从x1,y1,移动到x2,y2
         * 若目标点有棋子，则进行对决判定
         * 棋盘会根据对决结果变化
        */
        public move(x1: number, y1: number, x2: number, y2: number, isSend = true) {

            let startID = this.getId(x1, y1);
            let endID = this.getId(x2, y2);
            let startGrid = this._chessboardGrid[startID];
            let endGrid = this._chessboardGrid[endID];
            this.onOneHand.visible = false;
            let isWin = false;
            let walkableGrids = this.getWalkableGrid(x1, y1);
            //播放棋子声
            var str = "animal_move_mp3"
            App.SoundManager.playEffect(str);
            //棋子由开始位置移动到结束位置，开始位置附为空，结束位置只能留下最多一个棋子
            if (endGrid.chess === undefined) {
                let chess = startGrid.getCopyChess();
                startGrid.clear(true);
                chess.x = startGrid.x - endGrid.x;
                chess.y = startGrid.y - endGrid.y;
                endGrid.chessLayer.addChild(chess);
                egret.Tween.get(chess).to({ x: 0, y: 0 }, 300).call(() => {
                    endGrid.chess = chess;
                    this.checkOpenChase();
                    if (isSend && !isWin) {
                        this.sendNextRound("move|" + x1 + "|" + y1 + "|" + x2 + "|" + y2);
                    }
                })
                //记录垃圾操作
                GameAnimalChessView.instance.userController.wasteMove.push({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 } });
                GameAnimalChessView.instance.userController.chackWaste();
            } else {
                //需要比较
                let endTypeChesses: ChessGrid[] = [];
                let startTypeChesses: ChessGrid[] = [];
                for (let id in this.chessboardMap) {
                    var grid = this.chessboardMap[id];
                    if (grid.chess && endGrid.chess && grid.chess.type === endGrid.chess.type) {
                        endTypeChesses.push(grid);
                    }
                    if (grid.chess && startGrid.chess && grid.chess.type === startGrid.chess.type) {
                        startTypeChesses.push(grid);
                    }
                }

                let result = this.gradeCompare(startGrid.chess, endGrid.chess);
                let resultFunction: Function;
                let chess = startGrid.getCopyChess();
                startGrid.clear(true);
                chess.x = startGrid.x - endGrid.x;
                chess.y = startGrid.y - endGrid.y;
                endGrid.chessLayer.addChild(chess);

                let isAllOpen = true;
                //有棋子没掀开
                for (let id in this.chessboardMap) {
                    if (this.chessboardMap[id].chess && !this.chessboardMap[id].chess.isVisible)
                        isAllOpen = false;
                }
                switch (result) {
                    case 1:
                        //A吃B
                        resultFunction = (chess: Chess) => {
                            GameAnimalChessView.instance.userController.onPlayExpress(chess);
                            if (endTypeChesses.length == 1 && isAllOpen) {
                                this.win(chess, endGrid.chess, endGrid);
                                isWin = true;
                            }
                            endGrid.clear(true);
                            endGrid.chess = chess;
                        }
                        break;
                    case 2:
                        //自杀
                        resultFunction = (chess: Chess) => {
                            GameAnimalChessView.instance.userController.onPlayExpress(endGrid.chess);
                            if (startTypeChesses.length == 1 && isAllOpen) {
                                this.win(endGrid.chess, chess, endGrid);
                                isWin = true;
                            }
                            chess.destroy();
                        }
                        break;
                    case 3:
                        //AB同归
                        resultFunction = (chess: Chess) => {
                            GameAnimalChessView.instance.userController.onPlayExpress(null);
                            if (endTypeChesses.length == 1 && isAllOpen) {
                                this.win(chess, endGrid.chess, endGrid);
                                isWin = true;
                            } else if (startTypeChesses.length == 1 && isAllOpen) {
                                this.win(endGrid.chess, chess, endGrid);
                                isWin = true;
                            }
                            endGrid.clear(true);
                            if (!(isWin && startTypeChesses.length == 1 && endTypeChesses.length == 1)) {
                                chess.destroy();
                            }
                        }
                        break;
                }
                chess.dbArmature.play("chi", 1);
                egret.Tween.get(chess).to({ x: 0, y: 0 }, 500, egret.Ease.bounceOut)
                    .call(() => {
                        this.moveAffect.x = endGrid.x + endGrid.chess.dbArmature.width / 2;
                        this.moveAffect.y = endGrid.y + endGrid.chess.dbArmature.height / 2;
                        this.moveAffect.play("chi", 1);
                        resultFunction(chess);
                        //播放叫声
                        var str = "animal_" + this.numSound + "_mp3"
                        App.SoundManager.playEffect(str);
                        this.checkOpenChase();
                        if (isSend) {
                            this.sendNextRound("move|" + x1 + "|" + y1 + "|" + x2 + "|" + y2, isWin);
                        }
                    })
                GameAnimalChessView.instance.userController.wasteMove = [];
            }
        }
        private winId: number;
        private winByDisplay = () => {
            this.win(this._chessboardGrid[this.winId].chess, this._chessboardGrid[this.winId].chess, this._chessboardGrid[this.winId]);
        }
        /**显示隐藏棋子 */
        public displayGrid(x: number, y: number, isSend = true) {
            let id = this.getId(x, y);
            //显示棋子
            var str = "animal_displayChess_mp3";
            App.SoundManager.playEffect(str);
            this._chessboardGrid[id].tap(() => {
                if (GameAnimalChessView.instance.userController.controlChess === undefined) {
                    GameAnimalChessView.instance.userController.controlChess = this._chessboardGrid[id].chess.type;
                    if (DataCenter.instance.room.IsAI) {
                        if (this._chessboardGrid[id].chess.type === ChessType.BLUE)
                            this.AI.contronType = ChessType.RED;
                        else
                            this.AI.contronType = ChessType.BLUE;
                    } else {
                        if (this._chessboardGrid[id].chess.type === ChessType.BLUE)
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "comcontrol|" + ChessType.RED);
                        else
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "comcontrol|" + ChessType.BLUE);
                    }
                }
                GameAnimalChessView.instance.userController.wasteMove = [];
                if (isSend)
                    this.sendNextRound("show|" + x + "|" + y);
                //有棋子没掀开
                let numbers = this.getChessNumber();
                if (numbers.isAllDisplay) {
                    if (numbers.RED == 0 || numbers.BLUE == 0) {
                        this.winId = id;
                        App.TimerManager.doTimer(200, 1, this.winByDisplay, this);
                    }
                }
            });
            //创建 
            if (this.onOneHand == null) {
                this.onOneHand = AssetManager.getBitmap("Ontheonehand_png");
                GameAnimalChessView.instance.gameLayer.addChild(this.onOneHand);
            }

            this.onOneHand.visible = true;
            this.onOneHand.x = this._chessboardGrid[id].x + 100;
            this.onOneHand.y = this._chessboardGrid[id].y + 10;
        }
        public get chessboardMap(): { [id: number]: ChessGrid } {
            return this._chessboardGrid;
        }
        showSelfChesses() {
            for (let id in this._chessboardGrid) {//遍历网格
                if (this._chessboardGrid[id].chess) {//遍历网格上存在的棋子,能走的
                    let grids = this.getWalkableGrid(this._chessboardGrid[id].position.x, this._chessboardGrid[id].position.y);
                    if (grids.length > 0) {
                        this._chessboardGrid[id].chess.showBorder(GameAnimalChessView.instance.userController.controlChess);
                    }
                    //能掀开的
                    this._chessboardGrid[id].chess.showVisibleBorder();
                }
            }
        }
        hideSelfChesses() {
            for (let id in this._chessboardGrid) {//遍历网格
                if (this._chessboardGrid[id].chess) {//遍历网格上存在的棋子
                    this._chessboardGrid[id].chess.hiddenBorder();
                }
            }
        }

        public dispose() {
            App.TimerManager.remove(this.winByDisplay, this);
            App.MessageCenter.removeAll(this);
            if (DataCenter.instance.room.IsAI)
                this.AI.dispose();
        }
    }

    export class ChessGrid extends egret.DisplayObjectContainer {
        position: { x: number, y: number };
        private _chess: Chess;
        chessLayer: egret.DisplayObjectContainer;
        get chess() {
            return this._chess;
        }
        set chess(value: Chess) {
            this._chess = value;
            this.chessLayer.addChild(this._chess)
            this._chess.x = 0;
            this._chess.y = 0;
        }
        constructor(position: { x: number, y: number }, type: ChessType, animalGrade: AnimalGrade) {
            super();
            this.chessLayer = new egret.DisplayObjectContainer();

            let spaceGrid = AssetManager.getBitmap("spaceGrid_png", false, false);
            this.addChild(spaceGrid);
            spaceGrid.width *= GameAnimalChessView.scale;
            spaceGrid.height *= GameAnimalChessView.scale;

            this.position = position;
            this._chess = new Chess(type, animalGrade);
            this.chessLayer.addChild(this._chess);

            this.addChild(this.chessLayer);
        }

        get type() {
            if (!this._chess) return null;
            return this._chess.type;
        }
        /** 资源命名规范 自己的动物 elephant0.png  对手的动物 elephant1.png */
        tap = (callback: Function) => {
            this._chess.tap(callback);
        }
        clear = (idDestroy: boolean) => {
            if (this._chess.parent == this.chessLayer) {
                this.chessLayer.removeChild(this._chess);
                if (idDestroy)
                    this._chess.destroy();
                this._chess = undefined;
            }
        }
        getCopyChess = () => {
            return new Chess(this._chess.type, this._chess.animalGrade, true);
        }
    }

    export class Chess extends egret.DisplayObjectContainer {
        type: ChessType;
        isVisible: boolean;
        animalGrade: AnimalGrade;
        dbArmature: DBArmature;
        border: egret.Bitmap;
        private bitmap: egret.Bitmap;
        constructor(type: ChessType, animalGrade: AnimalGrade, show = false) {
            super();
            this.border = AssetManager.getBitmap("chessLuminous_png", false, false);
            this.border.width *= GameAnimalChessView.scale;
            this.border.height *= GameAnimalChessView.scale;
            this.border.x = -15 * GameAnimalChessView.scale;
            this.border.y = -11 * GameAnimalChessView.scale;
            this.border.alpha = 0;
            this.addChild(this.border);

            this.type = type;
            this.isVisible = show;
            this.animalGrade = animalGrade;

            this.dbArmature = AssetManager.getDBArmature("qizi");
            this.bitmap = AssetManager.getBitmap(AnimalGrade[this.animalGrade] + this.type + "_png", false, false);
            this.bitmap.width *= GameAnimalChessView.scale;
            this.bitmap.height *= GameAnimalChessView.scale;
            this.bitmap.anchorOffsetX = this.bitmap.width / 2;
            this.bitmap.anchorOffsetY = this.bitmap.height / 2;
            if (this.isVisible) {
                this.dbArmature.replaceSlot("Button", this.bitmap);
            } else {
                let space = AssetManager.getBitmap("space_png", false, false);
                space.width *= GameAnimalChessView.scale;
                space.height *= GameAnimalChessView.scale;
                space.anchorOffsetX = space.width / 2;
                space.anchorOffsetY = this.bitmap.height / 2;
                this.dbArmature.replaceSlot("Button", space);
            }
            this.dbArmature.x = this.dbArmature.width / 2;
            this.dbArmature.y = this.dbArmature.height / 2;
            this.addChild(this.dbArmature);

        }
        /** 资源命名规范 自己的动物 elephant0.png  对手的动物 elephant1.png */
        tap = (callback: Function) => {
            if (!this.isVisible) {
                this.isVisible = true;
                let playOver = () => {
                    this.dbArmature.removeDisplayEvent(dragonBones.EventObject.COMPLETE, playOver, this)
                    this.dbArmature.replaceSlot("Button", this.bitmap);
                    callback();
                }
                this.dbArmature.addDisplayEvent(dragonBones.EventObject.COMPLETE, playOver, this);
                this.dbArmature.play("fanqi", 1);
            }
        }
        destroy = () => {
            if (this.parent)
                this.parent.removeChild(this);
            this.animalGrade = null;
            this.isVisible = null;
            this.bitmap = null;
        }
        //显示自己棋子
        showBorder(type: ChessType) {
            if (this.type === type) {
                this.border.alpha = 1;
            }
        }
        //显示可以翻牌的棋子
        showVisibleBorder() {
            if (!this.isVisible) {
                this.border.alpha = 1;
            }
        }
        hiddenBorder() {
            this.border.alpha = 0;
        }
        //被选择状态
        set select(value: boolean) {
            if (value)
                this.dbArmature.scaleX = this.dbArmature.scaleY = 1.2;
            else
                this.dbArmature.scaleX = this.dbArmature.scaleY = 1;
        }
    }
}