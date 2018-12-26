var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var AnimalChess;
(function (AnimalChess) {
    var AIController = (function () {
        function AIController() {
            var _this = this;
            this.isAttack = false;
            this.aicontrol = function () {
                if (!GameAnimalChessView.instance) {
                    return;
                }
                var chessboardController = GameAnimalChessView.instance.chessboardController;
                var userController = GameAnimalChessView.instance.userController;
                var chesses = chessboardController.chessboardMap;
                _this.selfChessesGrid = [];
                _this.comptitorChessesGrid = [];
                /** 找到所有自己控制，显示的棋子格 */
                for (var i in chesses) {
                    if (chesses[i].chess && chesses[i].chess.type === _this.contronType && chesses[i].chess.isVisible) {
                        _this.selfChessesGrid.push(chesses[i]);
                    }
                    if (chesses[i].chess && chesses[i].chess.type !== _this.contronType && chesses[i].chess.isVisible) {
                        _this.comptitorChessesGrid.push(chesses[i]);
                    }
                    chesses[i]["scan"] = false;
                }
                if (_this.selfChessesGrid.length < _this.comptitorChessesGrid.length) {
                    _this.isAttack = false;
                }
                else {
                    _this.isAttack = true;
                }
                /** 看看能不能吃临近对方的棋子 */
                for (var _i = 0, _a = _this.selfChessesGrid; _i < _a.length; _i++) {
                    var chessGrid = _a[_i];
                    var walkGrids = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
                    /**周围可以走 */
                    if (walkGrids.length > 0) {
                        for (var _b = 0, walkGrids_1 = walkGrids; _b < walkGrids_1.length; _b++) {
                            var targetGrid = walkGrids_1[_b];
                            /**存在对方棋子,吃*/
                            if (targetGrid.chess && targetGrid.chess.type !== _this.contronType && targetGrid.chess.isVisible) {
                                if (!_this.isAttack && chessboardController.gradeCompare(chessGrid.chess, targetGrid.chess) === 1) {
                                    chessboardController.move(chessGrid.position.x, chessGrid.position.y, targetGrid.position.x, targetGrid.position.y, false);
                                    App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                                    return;
                                }
                                if (_this.isAttack && chessboardController.gradeCompare(chessGrid.chess, targetGrid.chess) !== 2) {
                                    chessboardController.move(chessGrid.position.x, chessGrid.position.y, targetGrid.position.x, targetGrid.position.y, false);
                                    App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                                    return;
                                }
                            }
                        }
                    }
                }
                /**能不能吃远处的棋子 */
                var walkablesDis = {};
                var numbers = [];
                for (var _c = 0, _d = _this.selfChessesGrid; _c < _d.length; _c++) {
                    var chessGrid = _d[_c];
                    var walkables = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
                    /**周围可以走 */
                    if (walkables.length > 0) {
                        for (var _e = 0, walkables_1 = walkables; _e < walkables_1.length; _e++) {
                            var walkable = walkables_1[_e];
                            /**不存在对方棋子,看周围*/
                            _this.currentChess = chessGrid;
                            var targetChessGrid = _this.seeAround(walkable);
                            if (targetChessGrid) {
                                walkablesDis[_this.dis] = { start: chessGrid, end: targetChessGrid };
                                numbers.push(_this.dis);
                            }
                            _this.restoreGrids();
                        }
                    }
                }
                numbers.sort(function (x, y) {
                    return x - y;
                });
                for (var _f = 0, numbers_1 = numbers; _f < numbers_1.length; _f++) {
                    var n = numbers_1[_f];
                    //存在吃的过去吃
                    var startChessGrid = walkablesDis[n].start;
                    var targetChessGrid = walkablesDis[n].end;
                    if (targetChessGrid.position.x > startChessGrid.position.x) {
                        var id = chessboardController.getId(startChessGrid.position.x + 1, startChessGrid.position.y);
                        if (!chessboardController.chessboardMap[id].chess) {
                            chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x + 1, startChessGrid.position.y, false);
                            App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                            return;
                        }
                    }
                    if (targetChessGrid.position.x < startChessGrid.position.x) {
                        var id = chessboardController.getId(startChessGrid.position.x - 1, startChessGrid.position.y);
                        if (!chessboardController.chessboardMap[id].chess) {
                            chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x - 1, startChessGrid.position.y, false);
                            App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                            return;
                        }
                    }
                    if (targetChessGrid.position.y > startChessGrid.position.y) {
                        var id = chessboardController.getId(startChessGrid.position.x, startChessGrid.position.y + 1);
                        if (!chessboardController.chessboardMap[id].chess) {
                            chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x, startChessGrid.position.y + 1, false);
                            App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                            return;
                        }
                    }
                    if (targetChessGrid.position.y < startChessGrid.position.y) {
                        var id = chessboardController.getId(startChessGrid.position.x, startChessGrid.position.y - 1);
                        if (!chessboardController.chessboardMap[id].chess) {
                            chessboardController.move(startChessGrid.position.x, startChessGrid.position.y, startChessGrid.position.x, startChessGrid.position.y - 1, false);
                            App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                            return;
                        }
                    }
                }
                /**没有自己显示的棋子，或者有显示的棋子但是不能移动 */
                var hideChesses = [];
                /** 没有掀开的棋子数组 ，掀开棋子*/
                for (var i in chesses) {
                    if (chesses[i].chess && !chesses[i].chess.isVisible) {
                        hideChesses.push(chesses[i]);
                    }
                }
                if (hideChesses.length > 0) {
                    var random = Math.floor(Math.random() * hideChesses.length);
                    chessboardController.displayGrid(hideChesses[random].position.x, hideChesses[random].position.y, false);
                    App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                    return;
                }
                /**没有可以吃的了也不能掀开棋子，随机走一步 */
                for (var _g = 0, _h = _this.selfChessesGrid; _g < _h.length; _g++) {
                    var chessGrid = _h[_g];
                    var walkables = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
                    /**周围可以走 */
                    var random = Math.floor(Math.random() * walkables.length);
                    var endChessGrid = walkables[random];
                    chessboardController.move(chessGrid.position.x, chessGrid.position.y, endChessGrid.position.x, endChessGrid.position.y, false);
                    App.TimerManager.doTimer(550, 1, _this.setUserData, _this);
                    return;
                }
            };
            this.setUserData = function () {
                var result = GameAnimalChessView.instance.chessboardController.getChessNumber();
                if (result.isAllDisplay)
                    if (result.RED == 0 || result.BLUE == 0)
                        return;
                _this._round = AnimalChess.RoundType.competitor;
                GameAnimalChessView.instance.userController.currentRound = AnimalChess.RoundType.self;
                GameAnimalChessView.instance.chessboardController.showSelfChesses();
            };
            this.dis = 0; //距离多少有能吃的棋子
            //看周围有没有能吃的
            this.seeAround = function (chessGrid) {
                var chessboardController = GameAnimalChessView.instance.chessboardController;
                var userController = GameAnimalChessView.instance.userController;
                var walkables = chessboardController.getWalkableGrid(chessGrid.position.x, chessGrid.position.y);
                chessGrid["scan"] = true;
                /**周围可以走 */
                if (walkables.length > 0) {
                    for (var _i = 0, walkables_2 = walkables; _i < walkables_2.length; _i++) {
                        var walkable = walkables_2[_i];
                        /**存在对方棋子,吃*/
                        if (walkable.chess && _this.currentChess.chess && walkable.chess.type !== _this.contronType && walkable.chess.isVisible) {
                            if (!_this.isAttack && chessboardController.gradeCompare(_this.currentChess.chess, walkable.chess) === 1) {
                                _this.dis++;
                                return walkable;
                            }
                            if (_this.isAttack && chessboardController.gradeCompare(_this.currentChess.chess, walkable.chess) !== 2) {
                                _this.dis++;
                                return walkable;
                            }
                        }
                    }
                }
                for (var _a = 0, walkables_3 = walkables; _a < walkables_3.length; _a++) {
                    var walkable = walkables_3[_a];
                    /**不存在对方棋子*/
                    if (!walkable["scan"]) {
                        _this.dis++;
                        return _this.seeAround(walkable);
                    }
                }
            };
            this.dispose = function () {
                App.TimerManager.remove(_this.setUserData, _this);
            };
        }
        Object.defineProperty(AIController.prototype, "round", {
            set: function (value) {
                this._round = value;
                if (value === AnimalChess.RoundType.self) {
                    App.TimerManager.doTimer(1000, 1, this.aicontrol, this);
                    GameAnimalChessView.instance.chessboardController.hideSelfChesses();
                }
            },
            enumerable: true,
            configurable: true
        });
        AIController.prototype.restoreGrids = function () {
            var chessboardMap = GameAnimalChessView.instance.chessboardController.chessboardMap;
            for (var id in chessboardMap) {
                chessboardMap[id]["scan"] = false;
            }
        };
        return AIController;
    }());
    AnimalChess.AIController = AIController;
    __reflect(AIController.prototype, "AnimalChess.AIController");
})(AnimalChess || (AnimalChess = {}));
var AnimalChess;
(function (AnimalChess) {
    var ChessboardController = (function () {
        function ChessboardController() {
            var _this = this;
            /**动物种类数 */
            this.animalLength = 8;
            /**棋盘的宽高 */
            this.sideNum = 4;
            /** 上一手 */
            this.onOneHand = null;
            /**哪个动物在叫*/
            this.numSound = 0;
            /** 垃圾操作过多，检查牌面逻辑 ,并判断胜利*/
            this.checkChess = function () {
                var blueChesses = [];
                var redChesses = [];
                for (var i in _this.chessboardMap) {
                    if (_this.chessboardMap[i].chess) {
                        if (_this.chessboardMap[i].chess.type === AnimalChess.ChessType.RED) {
                            redChesses.push(_this.chessboardMap[i].chess.animalGrade);
                        }
                        else {
                            blueChesses.push(_this.chessboardMap[i].chess.animalGrade);
                        }
                    }
                }
                if (redChesses.length > blueChesses.length) {
                    _this.chessTypeWin(AnimalChess.ChessType.RED);
                    return;
                }
                else if (redChesses.length < blueChesses.length) {
                    _this.chessTypeWin(AnimalChess.ChessType.BLUE);
                }
                else {
                    redChesses.sort(function (x, y) {
                        return y - x;
                    });
                    blueChesses.sort(function (x, y) {
                        return y - x;
                    });
                    for (var i = 0; i < redChesses.length; i++) {
                        if (redChesses[i] > blueChesses[i]) {
                            _this.chessTypeWin(AnimalChess.ChessType.RED);
                        }
                        else if (redChesses[i] < blueChesses[i]) {
                            _this.chessTypeWin(AnimalChess.ChessType.BLUE);
                        }
                    }
                }
            };
            this.winByDisplay = function () {
                _this.win(_this._chessboardGrid[_this.winId].chess, _this._chessboardGrid[_this.winId].chess, _this._chessboardGrid[_this.winId]);
            };
        }
        /**棋盘初始化 */
        ChessboardController.prototype.chessboardInit = function () {
            //主机确定地图
            // if (DataCenter.instance.room.selfIsMaster) {
            var group = [
                { animalGrade: 0, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 1, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 2, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 3, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 4, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 5, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 6, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 7, type: AnimalChess.ChessType.RED, isVisible: false, position: null },
                { animalGrade: 0, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 1, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 2, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 3, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 4, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 5, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 6, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
                { animalGrade: 7, type: AnimalChess.ChessType.BLUE, isVisible: false, position: null },
            ];
            var checkerboard = {};
            var transformData = [];
            // let indexlist = [6, 11, 9, 15, 3, 0, 13, 10, 2, 14, 5, 12, 7, 1, 8, 4]
            for (var i = 0; i < this.sideNum; i++) {
                var _loop_1 = function (j) {
                    //j是X,i是y
                    var id = this_1.getId(j, i);
                    var index = Math.floor(GameAnimalChessView.random() * group.length);
                    //  console.log("3333333333333333:::::"+GameAnimalChessView.random() * group.length);
                    //  console.log("4444444444:::::"+ group.length);
                    //console.log("6666666666:::::"+ index);
                    //console.log("111111111111111:::::"+DataCenter.instance.room.IsAI)
                    //let index=0;
                    // let index = indexlist[id];
                    var gridData = group[index];
                    gridData.position = { x: j, y: i };
                    checkerboard[id] = new ChessGrid(gridData.position, gridData.type, gridData.animalGrade);
                    var data = {
                        id: id, position: gridData.position, type: gridData.type, animalGrade: gridData.animalGrade
                    };
                    transformData.push(data);
                    group.splice(index, 1);
                    checkerboard[id].x = checkerboard[id].position.x * 157.5 * GameAnimalChessView.scale;
                    checkerboard[id].y = checkerboard[id].position.y * 175 * GameAnimalChessView.scale;
                    checkerboard[id].touchEnabled = true;
                    checkerboard[id].addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        GameAnimalChessView.instance.userController.clickHandler(id);
                    }, this_1);
                    GameAnimalChessView.instance.gameLayer.addChild(checkerboard[id]);
                    if (DataCenter.instance.room.selfIsMaster)
                        checkerboard[id].chess.showVisibleBorder();
                };
                var this_1 = this;
                for (var j = 0; j < this.sideNum; j++) {
                    _loop_1(j);
                }
                this._chessboardGrid = checkerboard;
                if (DataCenter.instance.room.IsAI) {
                    this.AI = new AnimalChess.AIController();
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
        };
        ChessboardController.prototype.onGameEvent = function (data) {
            var parseData = function (data) {
                var splitChar = data.split("|");
                return splitChar;
            };
            var datas = parseData(data.event);
            switch (datas[0]) {
                case "nextRound":
                    if (datas[1] === "show") {
                        this.displayGrid(parseInt(datas[2]), parseInt(datas[3]), false);
                    }
                    if (datas[1] === "move") {
                        this.move(parseInt(datas[2]), parseInt(datas[3]), parseInt(datas[4]), parseInt(datas[5]), false);
                    }
                    GameAnimalChessView.instance.userController.currentRound = AnimalChess.RoundType.self;
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
        };
        /**根据xy得到棋盘中的位置,棋盘中的位置转换为数组中的位置 */
        ChessboardController.prototype.getId = function (x, y) {
            if (x < 0 || x > this.sideNum)
                return null;
            if (y < 0 || y >= this.sideNum)
                return null;
            var result = y * this.sideNum + x;
            return result;
        };
        /**
         *  判断给定的点是否可走，返回布尔值
         */
        ChessboardController.prototype.isGridWalkable = function (startID, endID, result) {
            if (endID === null)
                return false;
            var startGrid = this._chessboardGrid[startID];
            var endGrid = this._chessboardGrid[endID];
            if (!endGrid.chess) {
                if (result)
                    result.push(endGrid);
                return true;
            }
            if (endGrid && startGrid.type !== endGrid.chess.type && endGrid.chess.isVisible) {
                if (result)
                    result.push(endGrid);
                return true;
            }
            return false;
        };
        /**
         * 返回1 A吃B
         * 返回2 B吃A
         * 返回3 AB同归
         */
        ChessboardController.prototype.gradeCompare = function (A, B) {
            var result;
            if (A.animalGrade === AnimalChess.AnimalGrade.mouse && B.animalGrade === AnimalChess.AnimalGrade.elephant ||
                A.animalGrade === AnimalChess.AnimalGrade.elephant && B.animalGrade === AnimalChess.AnimalGrade.mouse) {
                this.numSound = 0;
                //老鼠与大象
                if (A.animalGrade === AnimalChess.AnimalGrade.mouse)
                    return 1;
                else
                    return 2;
            }
            else {
                //正常比较
                var difference = A.animalGrade - B.animalGrade;
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
        };
        /** 下一回合 */
        ChessboardController.prototype.sendNextRound = function (command, isWin) {
            if (isWin === void 0) { isWin = false; }
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "nextRound|" + command);
                this.hideSelfChesses();
            }
            else {
                if (!isWin)
                    this.AI.round = AnimalChess.RoundType.self;
            }
            /** 可以请求平局 */
            GameAnimalChessView.instance.userController.canDrawn = true;
        };
        ChessboardController.prototype.sendResult = function (isWin) {
            //console.log(DataCenter.instance.room.id + "号房发送结果为" + DataCenter.instance.user.id + ":" + isWin)
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, isWin);
        };
        /**遍历查询所剩棋子 */
        ChessboardController.prototype.getChessNumber = function () {
            var blue = 0;
            var red = 0;
            var isAllDisplay = true;
            for (var i in this.chessboardMap) {
                if (this.chessboardMap[i].chess) {
                    if (this.chessboardMap[i].chess.isVisible == false) {
                        isAllDisplay = false;
                    }
                    if (this.chessboardMap[i].chess.type === AnimalChess.ChessType.RED) {
                        red++;
                    }
                    else {
                        blue++;
                    }
                }
            }
            return { RED: red, BLUE: blue, isAllDisplay: isAllDisplay };
        };
        /**检测是否开启追击模式检测 */
        ChessboardController.prototype.checkOpenChase = function () {
            var numbers = this.getChessNumber();
            if (numbers.RED + numbers.BLUE <= 3 && GameAnimalChessView.instance.userController.wasteLimit === AnimalChess.UserController.normalLimit) {
                GameAnimalChessView.instance.userController.openChase();
                if (!DataCenter.instance.room.IsAI)
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "openChase");
            }
        };
        ChessboardController.prototype.chessTypeWin = function (color) {
            if (GameAnimalChessView.instance.userController.controlChess === color)
                this.sendResult(3);
            else
                this.sendResult(1);
        };
        /**显示可走位置 */
        ChessboardController.prototype.getWalkableGrid = function (x, y) {
            var midId = this.getId(x, y);
            var grid = this._chessboardGrid[midId];
            var pointId;
            var result = [];
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
        };
        ChessboardController.prototype.win = function (winChess, loseChess, endGrid) {
            var _this = this;
            var userController = GameAnimalChessView.instance.userController;
            var shengli = AssetManager.getDBArmature("shengliqipao");
            var dongwu = AssetManager.getBitmap(AnimalChess.AnimalGrade[winChess.animalGrade] + "_png");
            shengli.replaceSlot("dongwucao", dongwu);
            var point;
            var dis = endGrid.localToGlobal(loseChess.x, loseChess.y, point);
            shengli.x = dis.x;
            shengli.y = dis.y;
            GameAnimalChessView.instance.UILayer.addChild(shengli);
            shengli.play("shengliqibao");
            var targetX;
            var targetY;
            var target;
            if (winChess.type === userController.controlChess) {
                targetX = userController.comImg.x - 40 * GameAnimalChessView.scale;
                targetY = userController.comImg.y;
                target = userController.comImg;
                shengli.scaleX = -1;
            }
            else {
                targetX = userController.userImg.x + 40 * GameAnimalChessView.scale;
                targetY = userController.userImg.y;
                target = userController.userImg;
            }
            //动物移动
            egret.Tween.get(shengli).to({
                x: targetX, y: targetY
            }, 1000) //动物移动完成，开始击飞动画 
                .call(function () {
                target.play("shibaitanfei", 1);
                var shadow = AssetManager.getBitmap("shadow_png");
                if (winChess.type === userController.controlChess) {
                    shadow.x = targetX + target.width / 4;
                }
                else {
                    shadow.x = targetX - target.width / 4;
                }
                shadow.y = targetY;
                GameAnimalChessView.instance.UILayer.addChild(shadow);
                egret.Tween.get(target).to({
                    x: App.GameWidth / 2, y: 100
                }, 1000).call(function () {
                    if (winChess.type == userController.controlChess) {
                        userController.userImg.play("win1");
                    }
                    else {
                        userController.comImg.play("win2");
                    }
                    _this.chessTypeWin(winChess.type);
                });
            });
        };
        /**
         * 移动位置
         * 从x1,y1,移动到x2,y2
         * 若目标点有棋子，则进行对决判定
         * 棋盘会根据对决结果变化
        */
        ChessboardController.prototype.move = function (x1, y1, x2, y2, isSend) {
            var _this = this;
            if (isSend === void 0) { isSend = true; }
            var startID = this.getId(x1, y1);
            var endID = this.getId(x2, y2);
            var startGrid = this._chessboardGrid[startID];
            var endGrid = this._chessboardGrid[endID];
            this.onOneHand.visible = false;
            var isWin = false;
            var walkableGrids = this.getWalkableGrid(x1, y1);
            //播放棋子声
            var str = "animal_move_mp3";
            App.SoundManager.playEffect(str);
            //棋子由开始位置移动到结束位置，开始位置附为空，结束位置只能留下最多一个棋子
            if (endGrid.chess === undefined) {
                var chess_1 = startGrid.getCopyChess();
                startGrid.clear(true);
                chess_1.x = startGrid.x - endGrid.x;
                chess_1.y = startGrid.y - endGrid.y;
                endGrid.chessLayer.addChild(chess_1);
                egret.Tween.get(chess_1).to({ x: 0, y: 0 }, 300).call(function () {
                    endGrid.chess = chess_1;
                    _this.checkOpenChase();
                    if (isSend && !isWin) {
                        _this.sendNextRound("move|" + x1 + "|" + y1 + "|" + x2 + "|" + y2);
                    }
                });
                //记录垃圾操作
                GameAnimalChessView.instance.userController.wasteMove.push({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 } });
                GameAnimalChessView.instance.userController.chackWaste();
            }
            else {
                //需要比较
                var endTypeChesses_1 = [];
                var startTypeChesses_1 = [];
                for (var id in this.chessboardMap) {
                    var grid = this.chessboardMap[id];
                    if (grid.chess && endGrid.chess && grid.chess.type === endGrid.chess.type) {
                        endTypeChesses_1.push(grid);
                    }
                    if (grid.chess && startGrid.chess && grid.chess.type === startGrid.chess.type) {
                        startTypeChesses_1.push(grid);
                    }
                }
                var result = this.gradeCompare(startGrid.chess, endGrid.chess);
                var resultFunction_1;
                var chess_2 = startGrid.getCopyChess();
                startGrid.clear(true);
                chess_2.x = startGrid.x - endGrid.x;
                chess_2.y = startGrid.y - endGrid.y;
                endGrid.chessLayer.addChild(chess_2);
                var isAllOpen_1 = true;
                //有棋子没掀开
                for (var id in this.chessboardMap) {
                    if (this.chessboardMap[id].chess && !this.chessboardMap[id].chess.isVisible)
                        isAllOpen_1 = false;
                }
                switch (result) {
                    case 1:
                        //A吃B
                        resultFunction_1 = function (chess) {
                            GameAnimalChessView.instance.userController.onPlayExpress(chess);
                            if (endTypeChesses_1.length == 1 && isAllOpen_1) {
                                _this.win(chess, endGrid.chess, endGrid);
                                isWin = true;
                            }
                            endGrid.clear(true);
                            endGrid.chess = chess;
                        };
                        break;
                    case 2:
                        //自杀
                        resultFunction_1 = function (chess) {
                            GameAnimalChessView.instance.userController.onPlayExpress(endGrid.chess);
                            if (startTypeChesses_1.length == 1 && isAllOpen_1) {
                                _this.win(endGrid.chess, chess, endGrid);
                                isWin = true;
                            }
                            chess.destroy();
                        };
                        break;
                    case 3:
                        //AB同归
                        resultFunction_1 = function (chess) {
                            GameAnimalChessView.instance.userController.onPlayExpress(null);
                            if (endTypeChesses_1.length == 1 && isAllOpen_1) {
                                _this.win(chess, endGrid.chess, endGrid);
                                isWin = true;
                            }
                            else if (startTypeChesses_1.length == 1 && isAllOpen_1) {
                                _this.win(endGrid.chess, chess, endGrid);
                                isWin = true;
                            }
                            endGrid.clear(true);
                            if (!(isWin && startTypeChesses_1.length == 1 && endTypeChesses_1.length == 1)) {
                                chess.destroy();
                            }
                        };
                        break;
                }
                chess_2.dbArmature.play("chi", 1);
                egret.Tween.get(chess_2).to({ x: 0, y: 0 }, 500, egret.Ease.bounceOut)
                    .call(function () {
                    _this.moveAffect.x = endGrid.x + endGrid.chess.dbArmature.width / 2;
                    _this.moveAffect.y = endGrid.y + endGrid.chess.dbArmature.height / 2;
                    _this.moveAffect.play("chi", 1);
                    resultFunction_1(chess_2);
                    //播放叫声
                    var str = "animal_" + _this.numSound + "_mp3";
                    App.SoundManager.playEffect(str);
                    _this.checkOpenChase();
                    if (isSend) {
                        _this.sendNextRound("move|" + x1 + "|" + y1 + "|" + x2 + "|" + y2, isWin);
                    }
                });
                GameAnimalChessView.instance.userController.wasteMove = [];
            }
        };
        /**显示隐藏棋子 */
        ChessboardController.prototype.displayGrid = function (x, y, isSend) {
            var _this = this;
            if (isSend === void 0) { isSend = true; }
            var id = this.getId(x, y);
            //显示棋子
            var str = "animal_displayChess_mp3";
            App.SoundManager.playEffect(str);
            this._chessboardGrid[id].tap(function () {
                if (GameAnimalChessView.instance.userController.controlChess === undefined) {
                    GameAnimalChessView.instance.userController.controlChess = _this._chessboardGrid[id].chess.type;
                    if (DataCenter.instance.room.IsAI) {
                        if (_this._chessboardGrid[id].chess.type === AnimalChess.ChessType.BLUE)
                            _this.AI.contronType = AnimalChess.ChessType.RED;
                        else
                            _this.AI.contronType = AnimalChess.ChessType.BLUE;
                    }
                    else {
                        if (_this._chessboardGrid[id].chess.type === AnimalChess.ChessType.BLUE)
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "comcontrol|" + AnimalChess.ChessType.RED);
                        else
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "comcontrol|" + AnimalChess.ChessType.BLUE);
                    }
                }
                GameAnimalChessView.instance.userController.wasteMove = [];
                if (isSend)
                    _this.sendNextRound("show|" + x + "|" + y);
                //有棋子没掀开
                var numbers = _this.getChessNumber();
                if (numbers.isAllDisplay) {
                    if (numbers.RED == 0 || numbers.BLUE == 0) {
                        _this.winId = id;
                        App.TimerManager.doTimer(200, 1, _this.winByDisplay, _this);
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
        };
        Object.defineProperty(ChessboardController.prototype, "chessboardMap", {
            get: function () {
                return this._chessboardGrid;
            },
            enumerable: true,
            configurable: true
        });
        ChessboardController.prototype.showSelfChesses = function () {
            for (var id in this._chessboardGrid) {
                if (this._chessboardGrid[id].chess) {
                    var grids = this.getWalkableGrid(this._chessboardGrid[id].position.x, this._chessboardGrid[id].position.y);
                    if (grids.length > 0) {
                        this._chessboardGrid[id].chess.showBorder(GameAnimalChessView.instance.userController.controlChess);
                    }
                    //能掀开的
                    this._chessboardGrid[id].chess.showVisibleBorder();
                }
            }
        };
        ChessboardController.prototype.hideSelfChesses = function () {
            for (var id in this._chessboardGrid) {
                if (this._chessboardGrid[id].chess) {
                    this._chessboardGrid[id].chess.hiddenBorder();
                }
            }
        };
        ChessboardController.prototype.dispose = function () {
            App.TimerManager.remove(this.winByDisplay, this);
            App.MessageCenter.removeAll(this);
            if (DataCenter.instance.room.IsAI)
                this.AI.dispose();
        };
        return ChessboardController;
    }());
    AnimalChess.ChessboardController = ChessboardController;
    __reflect(ChessboardController.prototype, "AnimalChess.ChessboardController");
    var ChessGrid = (function (_super) {
        __extends(ChessGrid, _super);
        function ChessGrid(position, type, animalGrade) {
            var _this = _super.call(this) || this;
            /** 资源命名规范 自己的动物 elephant0.png  对手的动物 elephant1.png */
            _this.tap = function (callback) {
                _this._chess.tap(callback);
            };
            _this.clear = function (idDestroy) {
                if (_this._chess.parent == _this.chessLayer) {
                    _this.chessLayer.removeChild(_this._chess);
                    if (idDestroy)
                        _this._chess.destroy();
                    _this._chess = undefined;
                }
            };
            _this.getCopyChess = function () {
                return new Chess(_this._chess.type, _this._chess.animalGrade, true);
            };
            _this.chessLayer = new egret.DisplayObjectContainer();
            var spaceGrid = AssetManager.getBitmap("spaceGrid_png", false, false);
            _this.addChild(spaceGrid);
            spaceGrid.width *= GameAnimalChessView.scale;
            spaceGrid.height *= GameAnimalChessView.scale;
            _this.position = position;
            _this._chess = new Chess(type, animalGrade);
            _this.chessLayer.addChild(_this._chess);
            _this.addChild(_this.chessLayer);
            return _this;
        }
        Object.defineProperty(ChessGrid.prototype, "chess", {
            get: function () {
                return this._chess;
            },
            set: function (value) {
                this._chess = value;
                this.chessLayer.addChild(this._chess);
                this._chess.x = 0;
                this._chess.y = 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChessGrid.prototype, "type", {
            get: function () {
                if (!this._chess)
                    return null;
                return this._chess.type;
            },
            enumerable: true,
            configurable: true
        });
        return ChessGrid;
    }(egret.DisplayObjectContainer));
    AnimalChess.ChessGrid = ChessGrid;
    __reflect(ChessGrid.prototype, "AnimalChess.ChessGrid");
    var Chess = (function (_super) {
        __extends(Chess, _super);
        function Chess(type, animalGrade, show) {
            if (show === void 0) { show = false; }
            var _this = _super.call(this) || this;
            /** 资源命名规范 自己的动物 elephant0.png  对手的动物 elephant1.png */
            _this.tap = function (callback) {
                if (!_this.isVisible) {
                    _this.isVisible = true;
                    var playOver_1 = function () {
                        _this.dbArmature.removeDisplayEvent(dragonBones.EventObject.COMPLETE, playOver_1, _this);
                        _this.dbArmature.replaceSlot("Button", _this.bitmap);
                        callback();
                    };
                    _this.dbArmature.addDisplayEvent(dragonBones.EventObject.COMPLETE, playOver_1, _this);
                    _this.dbArmature.play("fanqi", 1);
                }
            };
            _this.destroy = function () {
                if (_this.parent)
                    _this.parent.removeChild(_this);
                _this.animalGrade = null;
                _this.isVisible = null;
                _this.bitmap = null;
            };
            _this.border = AssetManager.getBitmap("chessLuminous_png", false, false);
            _this.border.width *= GameAnimalChessView.scale;
            _this.border.height *= GameAnimalChessView.scale;
            _this.border.x = -15 * GameAnimalChessView.scale;
            _this.border.y = -11 * GameAnimalChessView.scale;
            _this.border.alpha = 0;
            _this.addChild(_this.border);
            _this.type = type;
            _this.isVisible = show;
            _this.animalGrade = animalGrade;
            _this.dbArmature = AssetManager.getDBArmature("qizi");
            _this.bitmap = AssetManager.getBitmap(AnimalChess.AnimalGrade[_this.animalGrade] + _this.type + "_png", false, false);
            _this.bitmap.width *= GameAnimalChessView.scale;
            _this.bitmap.height *= GameAnimalChessView.scale;
            _this.bitmap.anchorOffsetX = _this.bitmap.width / 2;
            _this.bitmap.anchorOffsetY = _this.bitmap.height / 2;
            if (_this.isVisible) {
                _this.dbArmature.replaceSlot("Button", _this.bitmap);
            }
            else {
                var space = AssetManager.getBitmap("space_png", false, false);
                space.width *= GameAnimalChessView.scale;
                space.height *= GameAnimalChessView.scale;
                space.anchorOffsetX = space.width / 2;
                space.anchorOffsetY = _this.bitmap.height / 2;
                _this.dbArmature.replaceSlot("Button", space);
            }
            _this.dbArmature.x = _this.dbArmature.width / 2;
            _this.dbArmature.y = _this.dbArmature.height / 2;
            _this.addChild(_this.dbArmature);
            return _this;
        }
        //显示自己棋子
        Chess.prototype.showBorder = function (type) {
            if (this.type === type) {
                this.border.alpha = 1;
            }
        };
        //显示可以翻牌的棋子
        Chess.prototype.showVisibleBorder = function () {
            if (!this.isVisible) {
                this.border.alpha = 1;
            }
        };
        Chess.prototype.hiddenBorder = function () {
            this.border.alpha = 0;
        };
        Object.defineProperty(Chess.prototype, "select", {
            //被选择状态
            set: function (value) {
                if (value)
                    this.dbArmature.scaleX = this.dbArmature.scaleY = 1.2;
                else
                    this.dbArmature.scaleX = this.dbArmature.scaleY = 1;
            },
            enumerable: true,
            configurable: true
        });
        return Chess;
    }(egret.DisplayObjectContainer));
    AnimalChess.Chess = Chess;
    __reflect(Chess.prototype, "AnimalChess.Chess");
})(AnimalChess || (AnimalChess = {}));
var GameAnimalChessView = (function (_super) {
    __extends(GameAnimalChessView, _super);
    function GameAnimalChessView() {
        var _this = _super.call(this) || this;
        _this.pauseCallback = function () {
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
            _this.next("gameChangeMatch");
        };
        _this.onGameResult = function (data) {
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            console.log(DataCenter.instance.room.id + "号房收到结果为" + DataCenter.instance.user.id + ":" + data.winUserId);
            var resultPageFun = function () {
                App.MessageCenter.dispatch(EventMessage.gameCloseGiveUp);
                var delayTime = 2000;
                if (data.winUserId == DataCenter.instance.user.id) {
                    _this.tipController.showChiji(delayTime);
                    //播放胜利声
                    var str = "animal_win_mp3";
                    App.SoundManager.playEffect(str);
                }
                else if (data.winUserId == DataCenter.instance.room.player.id) {
                    if (!_this.tipController.isGiveUp) {
                        _this.tipController.showFailure(delayTime);
                    }
                    else {
                        delayTime = 0;
                    }
                    //播放失败声
                    var str = "animal_lose_mp3";
                    App.SoundManager.playEffect(str);
                }
                else {
                    _this.tipController.showDrawn(delayTime);
                }
                _this.chiji.play("winjiazi", 0);
                App.SoundManager.stopBg();
                App.TimerManager.doTimer(delayTime, 1, function () {
                    DataCenter.instance.room.gameResult = data;
                    _this.popup("GameResult");
                    _this.over();
                }, _this);
            };
            // 发送游戏结果
            _this.popup("GameResult", resultPageFun);
        };
        _this.viewInit = function () {
            _this.initBackground();
            _this.gameLayer.width = 604 * GameAnimalChessView.scale;
            _this.gameLayer.height = 668 * GameAnimalChessView.scale;
            _this.gameLayer.anchorOffsetX = _this.gameLayer.width / 2;
            _this.gameLayer.anchorOffsetY = _this.gameLayer.height / 2;
            _this.gameLayer.x = App.GameWidth / 2;
            _this.gameLayer.y = _this.backgroundMain.y + _this.backgroundMain.height / 2;
            _this.addChild(_this.gameLayer);
            _this.UILayer.height = App.GameHeight;
            _this.UILayer.anchorOffsetY = _this.UILayer.height / 2;
            _this.UILayer.y = App.GameHeight / 2;
            _this.addChild(_this.UILayer);
            // 小米平台去掉退出按钮
            if (!App.IsXiaoMi && !App.IsWanba) {
                _this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
                _this.returnToLastButton.y = 19;
                _this.UILayer.addChild(_this.returnToLastButton);
                _this.returnToLastButton.touchEnabled = true;
                _this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    _this.popup("GameSureLeave");
                }, _this);
            }
            _this.chiji = AssetManager.getDBArmature("chiji");
            _this.chiji.scaleX = _this.chiji.scaleY = GameAnimalChessView.scale;
            _this.chiji.x = App.GameWidth / 2;
            _this.chiji.y = 150 * GameAnimalChessView.scale;
            _this.UILayer.addChild(_this.chiji);
            _this.chiji.play("dong", 0);
            var animalRank = AssetManager.getBitmap("animalRank_png");
            animalRank.width *= GameAnimalChessView.scale;
            animalRank.height *= GameAnimalChessView.scale;
            while (animalRank.width > App.GameWidth) {
                animalRank.width *= 0.95;
                animalRank.height *= 0.95;
            }
            animalRank.anchorOffsetX = animalRank.width / 2;
            animalRank.anchorOffsetY = animalRank.height / 2;
            animalRank.x = App.GameWidth / 2;
            animalRank.y = 947 * GameAnimalChessView.scale;
            _this.UILayer.addChild(animalRank);
            var black1 = AssetManager.getBitmap("animal_blackMask_png");
            black1.width = App.GameWidth;
            black1.height = (App.GameHeight - _this.backgroundMain.height) / 2;
            black1.anchorOffsetY = black1.height;
            black1.anchorOffsetX = black1.width / 2;
            black1.x = App.GameWidth / 2;
            black1.y = 0;
            _this.addChild(black1);
            var black2 = AssetManager.getBitmap("animal_blackMask_png");
            black2.width = App.GameWidth;
            black2.height = (App.GameHeight - _this.backgroundMain.height) / 2;
            black2.anchorOffsetY = black2.height;
            black2.anchorOffsetX = black2.width / 2;
            black2.x = App.GameWidth / 2;
            black2.y = App.GameHeight - (App.GameHeight - _this.backgroundMain.height) / 2;
            _this.addChild(black2);
        };
        _this.initBackground = function () {
            var backgroundTop = AssetManager.getBitmap("animalTop_png", false, false);
            backgroundTop.width = App.GameWidth;
            backgroundTop.anchorOffsetX = backgroundTop.width / 2;
            backgroundTop.x = App.GameWidth / 2;
            _this.addChild(backgroundTop);
            var backgroundTopLeft = AssetManager.getBitmap("animalTopLeft_png", false, false);
            backgroundTopLeft.x = 0;
            _this.addChild(backgroundTopLeft);
            var backgroundTopRight = AssetManager.getBitmap("animalTopRight_png", false, false);
            backgroundTopRight.x = App.GameWidth - backgroundTopRight.width;
            _this.addChild(backgroundTopRight);
            _this.backgroundMain = AssetManager.getBitmap("animalMain_png", false, false);
            if (App.GameHeight < _this.backgroundMain.height) {
                GameAnimalChessView.scale = App.GameHeight / _this.backgroundMain.height;
                _this.backgroundMain.height = App.GameHeight;
            }
            else
                GameAnimalChessView.scale = 1;
            _this.backgroundMain.width = App.GameWidth * GameAnimalChessView.scale;
            _this.backgroundMain.anchorOffsetX = _this.backgroundMain.width / 2;
            _this.backgroundMain.x = App.GameWidth / 2;
            var backgroundLeft = AssetManager.getBitmap("animalLeft_png", false, false);
            backgroundLeft.anchorOffsetX = backgroundLeft.width;
            backgroundLeft.x = (App.GameWidth - _this.backgroundMain.width) / 2;
            backgroundLeft.height = App.GameHeight;
            _this.addChild(backgroundLeft);
            var backgroundRight = AssetManager.getBitmap("animalRight_png", false, false);
            backgroundRight.x = App.GameWidth - (App.GameWidth - _this.backgroundMain.width) / 2;
            backgroundRight.height = App.GameHeight;
            _this.addChild(backgroundRight);
            _this.addChild(_this.backgroundMain);
            var board = AssetManager.getBitmap("animalBoard_png");
            board.width *= GameAnimalChessView.scale;
            board.height *= GameAnimalChessView.scale;
            board.anchorOffsetX = board.width;
            board.anchorOffsetY = board.height;
            board.x = App.GameWidth - 10;
            board.y = 150 * GameAnimalChessView.scale;
            _this.addChild(board);
        };
        _this.userController = new AnimalChess.UserController();
        _this.chessboardController = new AnimalChess.ChessboardController();
        _this.tipController = new AnimalChess.TipController();
        _this.gameLayer = new egret.DisplayObjectContainer();
        _this.UILayer = new egret.DisplayObjectContainer();
        GameAnimalChessView.instance = _this;
        return _this;
    }
    GameAnimalChessView.prototype.init = function () {
        _super.prototype.init.call(this);
        GameAnimalChessView.random = new Math["seedrandom"](DataCenter.instance.room.id.toString());
        this.viewInit();
        this.adapt();
        this.tipController.width = App.GameWidth;
        this.tipController.height = App.GameHeight;
        this.tipController.init();
        this.chessboardController.chessboardInit();
        this.userController.init();
        this.addChild(this.tipController);
        App.SoundManager.stopBg();
        var str = "animal_bg_mp3";
        App.SoundManager.playBg(str);
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.addListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this);
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
    };
    GameAnimalChessView.prototype.onGameEvent = function (data) {
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        switch (datas[0]) {
            case "sendExpress":
                this.addQiPaoCartoon(datas[1], 2);
                break;
        }
    };
    GameAnimalChessView.prototype.addQiPaoCartoon = function (data, type) {
        if (type === void 0) { type = 1; }
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(120, 130);
        this.addChild(qiPao);
        if (type == 2) {
            qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 105, App.GameWidth - 85);
            qiPao.setSouce(data, true);
        }
        else {
            qiPao.setSouce(data);
            qiPao.x = App.RandomUtils.limitInteger(85, 105);
            if (!DataCenter.instance.room.IsAI) {
                var str = "sendExpress|" + data;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            else {
                var num = App.RandomUtils.limitInteger(1, 5);
                if (num % 2 != 0) {
                    App.TimerManager.doTimer(1000 * num, 1, this.AddAIexpress, this);
                }
            }
        }
        qiPao.onPlay();
    };
    //添加Ai的表情
    GameAnimalChessView.prototype.AddAIexpress = function () {
        var ArrPress = [
            "1_1", "1_2", "1_3", "1_4", "1_5", "1_6",
            "2_1", "2_2", "2_3", "2_4",
            "3_1", "3_2", "3_3", "3_4"
        ];
        var num = App.RandomUtils.limitInteger(0, 13);
        var str = "express" + ArrPress[num] + "_png";
        this.addQiPaoCartoon(str, 2);
    };
    GameAnimalChessView.prototype.over = function () {
        this.userController.dispose();
        this.chessboardController.dispose();
        //通知UI更新
        App.MessageCenter.dispatch(EventMessage.gameCloseExpress);
        GameAnimalChessView.instance = null;
    };
    /**适配IphoneX */
    GameAnimalChessView.prototype.adapt = function () {
        if (App.GameHeight > this.backgroundMain.height)
            this.y = (App.GameHeight - this.backgroundMain.height) / 2;
    };
    GameAnimalChessView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.chessboardController.dispose();
        this.userController.dispose();
        this.tipController.dispose();
        App.TimerManager.removeAll(this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
    };
    return GameAnimalChessView;
}(State));
__reflect(GameAnimalChessView.prototype, "GameAnimalChessView");
var GameReceiveDrawnView = (function (_super) {
    __extends(GameReceiveDrawnView, _super);
    function GameReceiveDrawnView() {
        var _this = _super.call(this, GameAnimalChessReceiveDrawn) || this;
        _this.showDrawnGroup = function () {
            _this.hide();
            _this.visible = true;
            _this.DrawnGroup.visible = true;
        };
        _this.showWaitDrawnAnswer = function () {
            _this.hide();
            _this.visible = true;
            _this.waitDrawnAnswer.visible = true;
        };
        _this.showDrawnRefuseAnswer = function () {
            _this.hide();
            _this.visible = true;
            _this.drawnRefuseAnswer.visible = true;
        };
        _this.showchiji = function (delayTime) {
            _this.hide();
            _this.visible = true;
            _this.chijiLogo.visible = true;
            _this.chijiLogo.scaleX = _this.chijiLogo.scaleY = 1.2;
            egret.Tween.get(_this.chijiLogo).to({ scaleX: 1, scaleY: 1 }, delayTime / 4, egret.Ease.bounceOut).wait(delayTime / 4 * 3);
        };
        _this.showDrawn = function (delayTime) {
            _this.hide();
            _this.visible = true;
            _this.drawnLogo.visible = true;
            _this.drawnLogo.scaleX = _this.drawnLogo.scaleY = 1.2;
            egret.Tween.get(_this.drawnLogo).to({ scaleX: 1, scaleY: 1 }, delayTime / 4, egret.Ease.bounceOut).wait(delayTime / 4 * 3);
        };
        _this.showFailure = function (delayTime) {
            _this.hide();
            _this.visible = true;
            _this.failureLogo.visible = true;
            _this.failureLogo.scaleX = _this.failureLogo.scaleY = 1.2;
            egret.Tween.get(_this.failureLogo).to({ scaleX: 1, scaleY: 1 }, delayTime / 4, egret.Ease.bounceOut).wait(delayTime / 4 * 3);
        };
        _this.hide = function () {
            _this.failureLogo.visible = _this.drawnLogo.visible = _this.chijiLogo.visible = _this.drawnRefuseAnswer.visible = _this.DrawnGroup.visible = _this.waitDrawnAnswer.visible = false;
            _this.visible = false;
        };
        return _this;
    }
    return GameReceiveDrawnView;
}(EuiComponent));
__reflect(GameReceiveDrawnView.prototype, "GameReceiveDrawnView");
var AnimalChess;
(function (AnimalChess) {
    var TipController = (function (_super) {
        __extends(TipController, _super);
        function TipController() {
            var _this = _super.call(this) || this;
            _this.refuseListener = function () {
                _this.receiveDrawnView.hide();
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "refuseDrawn");
                App.TimerManager.remove(_this.drawnTime, _this);
            };
            _this.agreeListener = function () {
                _this.receiveDrawnView.hide();
                App.TimerManager.remove(_this.drawnTime, _this);
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "acceptDrawn");
                if (GameAnimalChessView.instance.chessboardController)
                    GameAnimalChessView.instance.chessboardController.sendResult(2);
                _this.receiveDrawnView.showDrawn(2000);
            };
            _this.isGiveUp = false;
            _this.drawnTime = function () {
                if (App.Language == LanguageType.Ch) {
                    _this.receiveDrawnView.btn_refuse.label = "拒绝(" + _this._drawntime + "s)";
                }
                else {
                    _this.receiveDrawnView.btn_refuse.label = "refuse(" + _this._drawntime + "s)";
                }
                _this._drawntime--;
                if (_this._drawntime < 0) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "refuseDrawn");
                    _this.receiveDrawnView.visible = false;
                    App.TimerManager.remove(_this.drawnTime, _this);
                    _this._drawntime = 5;
                }
            };
            return _this;
        }
        TipController.prototype.init = function () {
            this.competitorTip = AssetManager.getBitmap("competitorTip_png");
            this.competitorTip.x = App.GameWidth / 2;
            this.competitorTip.y = App.GameHeight / 2 - GameAnimalChessView.instance.y;
            this.competitorTip.alpha = 0;
            this.addChild(this.competitorTip);
            this.selfTip = AssetManager.getBitmap("selfTip_png");
            this.selfTip.x = App.GameWidth / 2;
            this.selfTip.y = App.GameHeight / 2 - GameAnimalChessView.instance.y;
            this.selfTip.alpha = 0;
            this.addChild(this.selfTip);
            this.giveUpTip = AssetManager.getBitmap("giveUpTitle_png");
            this.giveUpTip.x = App.GameWidth / 2;
            this.giveUpTip.y = App.GameHeight / 2 - 150 - GameAnimalChessView.instance.y;
            this.addChild(this.giveUpTip);
            this.giveUpTip.alpha = 0;
            this.receiveGiveUpTip = AssetManager.getBitmap("receiveGiveUpMessage_png");
            this.receiveGiveUpTip.x = App.GameWidth / 2;
            this.receiveGiveUpTip.y = App.GameHeight / 2 - 150 - GameAnimalChessView.instance.y;
            this.addChild(this.receiveGiveUpTip);
            this.receiveGiveUpTip.alpha = 0;
            App.MessageCenter.addListener(EventMessage.GameGiveUp, this.giveUp, this);
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            this.receiveDrawnView = new GameReceiveDrawnView();
            this.receiveDrawnView.hide();
            this.addChild(this.receiveDrawnView);
            this.receiveDrawnView.btn_refuse.touchEnabled = true;
            this.receiveDrawnView.btn_refuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.refuseListener, this);
            this.receiveDrawnView.btn_agree.touchEnabled = true;
            this.receiveDrawnView.btn_agree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.agreeListener, this);
        };
        TipController.prototype.giveUp = function () {
            var _this = this;
            this.isGiveUp = true;
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "giveUp");
            this.giveUpTip.alpha = 1;
            App.TimerManager.doTimer(1000, 1, function () {
                _this.giveUpTip.alpha = 0;
                if (GameAnimalChessView.instance.chessboardController)
                    GameAnimalChessView.instance.chessboardController.sendResult(1);
            }, this);
        };
        TipController.prototype.showWaitDrawn = function () {
            var _this = this;
            this.receiveDrawnView.showWaitDrawnAnswer();
            if (DataCenter.instance.room.IsAI) {
                var random = App.RandomUtils.limitInteger(0, 2);
                App.TimerManager.doTimer(random * 1000, 1, function () {
                    _this.receiveDrawnView.showDrawnRefuseAnswer();
                    App.TimerManager.doTimer(300, 1, _this.receiveDrawnView.hide, _this);
                }, this);
            }
        };
        TipController.prototype.onGameEvent = function (data) {
            var _this = this;
            var parseData = function (data) {
                var splitChar = data.split("|");
                return splitChar;
            };
            var datas = parseData(data.event);
            switch (datas[0]) {
                case "giveUp":
                    this.receiveGiveUpTip.alpha = 1;
                    App.TimerManager.doTimer(1000, 1, function () {
                        _this.receiveGiveUpTip.alpha = 0;
                        if (GameAnimalChessView.instance.chessboardController)
                            GameAnimalChessView.instance.chessboardController.sendResult(3);
                    }, this);
                    break;
                case "drawnRequest":
                    this.receiveDrawnView.showDrawnGroup();
                    this._drawntime = 5;
                    this.drawnTime();
                    App.TimerManager.doTimer(1000, 0, this.drawnTime, this);
                    break;
                case "refuseDrawn":
                    this.receiveDrawnView.showDrawnRefuseAnswer();
                    App.TimerManager.doTimer(300, 1, this.receiveDrawnView.hide, this);
                    break;
                case "acceptDrawn":
                    this.receiveDrawnView.hide();
                    if (GameAnimalChessView.instance.chessboardController)
                        GameAnimalChessView.instance.chessboardController.sendResult(2);
                    this.receiveDrawnView.showDrawn(2000);
                    break;
                default:
                    break;
            }
        };
        TipController.prototype.wasteTipShow = function (round) {
            var _this = this;
            var waste = AssetManager.getBitmap("waste" + round + "_png");
            waste.x = App.GameWidth / 2;
            waste.y = -100;
            this.addChild(waste);
            egret.Tween.get(waste).to({ y: 100 }, 500).call(function () {
                App.TimerManager.doTimer(1000, 1, function () {
                    if (waste.parent)
                        _this.removeChild(waste);
                }, _this);
            });
        };
        TipController.prototype.chaseShow = function () {
            var _this = this;
            var chase = AssetManager.getBitmap("chaseTip_png");
            chase.x = App.GameWidth / 2;
            chase.y = -100;
            this.addChild(chase);
            egret.Tween.get(chase).to({ y: 100 }, 500).call(function () {
                App.TimerManager.doTimer(1000, 1, function () {
                    if (chase.parent)
                        _this.removeChild(chase);
                }, _this);
            });
        };
        TipController.prototype.showComRoundTip = function () {
            egret.Tween.get(this.competitorTip).to({ alpha: 1 }, 300).wait(400).to({ alpha: 0 }, 300);
        };
        TipController.prototype.setCompetitorTip = function (chessType) {
            this.competitorTip.texture = AssetManager.getBitmap("competitorTip" + chessType + "_png").texture;
        };
        TipController.prototype.showSelfRoundTip = function () {
            egret.Tween.get(this.selfTip).to({ alpha: 1 }, 300).wait(400).to({ alpha: 0 }, 300);
        };
        TipController.prototype.setSelfTip = function (chessType) {
            this.selfTip.texture = AssetManager.getBitmap("selfTip" + chessType + "_png").texture;
        };
        TipController.prototype.showChiji = function (delayTime) {
            this.receiveDrawnView.showchiji(delayTime);
        };
        TipController.prototype.showFailure = function (delayTime) {
            this.receiveDrawnView.showFailure(delayTime);
        };
        TipController.prototype.showDrawn = function (delayTime) {
            this.receiveDrawnView.showDrawn(delayTime);
        };
        TipController.prototype.dispose = function () {
            App.TimerManager.removeAll(this);
            App.MessageCenter.removeListener(EventMessage.GameGiveUp, this.giveUp, this);
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            this.receiveDrawnView.btn_refuse.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.refuseListener, this);
            this.receiveDrawnView.btn_agree.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.agreeListener, this);
        };
        return TipController;
    }(egret.DisplayObjectContainer));
    AnimalChess.TipController = TipController;
    __reflect(TipController.prototype, "AnimalChess.TipController");
})(AnimalChess || (AnimalChess = {}));
var AnimalChess;
(function (AnimalChess) {
    /**玩家的数据结构，需要包括颜色 */
    var ChessType;
    (function (ChessType) {
        ChessType[ChessType["RED"] = 0] = "RED";
        ChessType[ChessType["BLUE"] = 1] = "BLUE";
    })(ChessType = AnimalChess.ChessType || (AnimalChess.ChessType = {}));
    var RoundType;
    (function (RoundType) {
        RoundType[RoundType["self"] = 0] = "self";
        RoundType[RoundType["competitor"] = 1] = "competitor";
    })(RoundType = AnimalChess.RoundType || (AnimalChess.RoundType = {}));
    var AnimalGrade;
    (function (AnimalGrade) {
        AnimalGrade[AnimalGrade["elephant"] = 7] = "elephant";
        AnimalGrade[AnimalGrade["lion"] = 6] = "lion";
        AnimalGrade[AnimalGrade["tiger"] = 5] = "tiger";
        AnimalGrade[AnimalGrade["leopard"] = 4] = "leopard";
        AnimalGrade[AnimalGrade["wolf"] = 3] = "wolf";
        AnimalGrade[AnimalGrade["dog"] = 2] = "dog";
        AnimalGrade[AnimalGrade["cat"] = 1] = "cat";
        AnimalGrade[AnimalGrade["mouse"] = 0] = "mouse";
    })(AnimalGrade = AnimalChess.AnimalGrade || (AnimalChess.AnimalGrade = {}));
})(AnimalChess || (AnimalChess = {}));
var AnimalChess;
(function (AnimalChess) {
    var UserConfig = (function () {
        function UserConfig() {
        }
        UserConfig.nameLength = 6;
        return UserConfig;
    }());
    __reflect(UserConfig.prototype, "UserConfig");
    var UserController = (function () {
        function UserController() {
            var _this = this;
            this.haveSet = false;
            this.time = 60;
            this.startTime = function (isSelf) {
                if (isSelf === void 0) { isSelf = true; }
                _this.isSelf = isSelf;
                _this.time = 60;
                App.TimerManager.doTimer(1000, 0, _this.spliceTime, _this);
            };
            this.spliceTime = function () {
                _this.time--;
                if (_this.time < 10)
                    _this.timeView.text = "0" + _this.time + "s";
                else
                    _this.timeView.text = _this.time + "s";
                if (_this.time <= 0) {
                    if (_this.isSelf) {
                        GameAnimalChessView.instance.chessboardController.sendResult(1);
                    }
                    else {
                        if (DataCenter.instance.room.IsAI) {
                            GameAnimalChessView.instance.chessboardController.sendResult(3);
                        }
                    }
                    _this.removeTime();
                }
            };
            this.removeTime = function () {
                App.TimerManager.remove(_this.spliceTime, _this);
            };
            this.userImgTap = function () {
                // 打开玩家信息页
                GameAnimalChessView.instance.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.user });
            };
            this.comImgTap = function () {
                // 打开玩家信息页
                GameAnimalChessView.instance.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.room.player });
            };
            this.canDrawn = true;
            this.giveUpListener = function () {
                GameAnimalChessView.instance.popup("GameGiveUp");
            };
            this.drawnListener = function () {
                if (_this.canDrawn) {
                    if (!DataCenter.instance.room.IsAI)
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "drawnRequest");
                    GameAnimalChessView.instance.tipController.showWaitDrawn();
                    _this.canDrawn = false;
                }
            };
            this.sideNum = 4;
            this.chackWaste = function () {
                if (!_this.isOpenChase) {
                    return;
                }
                if (_this.firstOpenChase) {
                    switch (_this.wasteLimit - _this.wasteMove.length) {
                        case 0:
                            GameAnimalChessView.instance.chessboardController.checkChess();
                            break;
                        case 6:
                        case 4:
                        case 2:
                            GameAnimalChessView.instance.tipController.wasteTipShow((_this.wasteLimit - _this.wasteMove.length) / 2);
                            break;
                        default:
                            return;
                    }
                }
                else {
                    switch (_this.wasteLimit - _this.wasteMove.length) {
                        case 0:
                            GameAnimalChessView.instance.chessboardController.checkChess();
                            break;
                        case 5:
                        case 3:
                        case 1:
                            GameAnimalChessView.instance.tipController.wasteTipShow((_this.wasteLimit - _this.wasteMove.length + 1) / 2);
                            break;
                        default:
                            return;
                    }
                }
            };
            this.openChase = function (isFirst) {
                if (isFirst === void 0) { isFirst = true; }
                _this.wasteLimit = UserController.chaseLimit;
                GameAnimalChessView.instance.tipController.chaseShow();
                _this.firstOpenChase = isFirst;
                _this.isOpenChase = true;
            };
            this.dispose = function () {
                _this.removeTime();
                _this.userNameBg = null;
                _this.comNameBg = null;
                _this.time = 60;
                App.TimerManager.remove(_this.spliceTime, _this);
                _this.userImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.userImgTap, _this);
                _this.comImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.comImgTap, _this);
                App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, _this.onGameEvent, _this);
                _this.helloButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.sayHello, _this);
                _this.giveUpButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.giveUpListener, _this);
                _this.drawnButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.drawnListener, _this);
            };
            this.isWalk = false;
            this.walkables = [];
            this.startGrid = null;
            this.wasteMove = [];
            this.wasteLimit = UserController.normalLimit;
        }
        Object.defineProperty(UserController.prototype, "controlChess", {
            get: function () {
                return this._controlChess;
            },
            set: function (value) {
                this._controlChess = value;
                if (value === AnimalChess.ChessType.RED) {
                    GameAnimalChessView.instance.tipController.setCompetitorTip(AnimalChess.ChessType.BLUE);
                    GameAnimalChessView.instance.tipController.setSelfTip(AnimalChess.ChessType.RED);
                }
                else {
                    GameAnimalChessView.instance.tipController.setCompetitorTip(AnimalChess.ChessType.RED);
                    GameAnimalChessView.instance.tipController.setSelfTip(AnimalChess.ChessType.BLUE);
                }
                if (this._currentRound === AnimalChess.RoundType.self) {
                    this.round.texture = AssetManager.getBitmap("selfRound" + value + "_png").texture;
                }
                else {
                    this.round.texture = AssetManager.getBitmap("competitorRound" + value + "_png").texture;
                }
                //如果当局没有设置 名字的背景
                if (this.haveSet == false) {
                    if (value === AnimalChess.ChessType.RED) {
                        this.comNameBg.texture = AssetManager.getBitmap("name_blue_png").texture;
                        this.userNameBg.texture = AssetManager.getBitmap("name_red_png").texture;
                        this.haveSet = true;
                    }
                    else if (value === AnimalChess.ChessType.BLUE) {
                        this.comNameBg.texture = AssetManager.getBitmap("name_red_png").texture;
                        this.userNameBg.texture = AssetManager.getBitmap("name_blue_png").texture;
                        this.haveSet = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        UserController.prototype.init = function () {
            this.initUserView();
            this.initCompetitorView();
            this.initGiveUpView();
            this.helloButton = AssetManager.getBitmap("helloButton_png");
            this.helloButton.width *= GameAnimalChessView.scale;
            this.helloButton.height *= GameAnimalChessView.scale;
            this.helloButton.anchorOffsetY = this.helloButton.height / 2;
            this.helloButton.anchorOffsetX = this.helloButton.width;
            this.helloButton.x = App.GameWidth - ((App.GameWidth - GameAnimalChessView.instance.backgroundMain.width) / 2 + 17);
            this.helloButton.y = 1048 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(this.helloButton);
            this.helloButton.touchEnabled = true;
            this.helloButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sayHello, this);
            //下一局
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        };
        /**
         * 开心 + 伤心
         * 伤心 + 开心
         * 伤心 + 伤心 表情播放
         * */
        UserController.prototype.onPlayExpress = function (winChess) {
            if (!winChess) {
                this.comImg.play("beichi", 1);
                this.userImg.play("beichi", 1);
                return;
            }
            var userController = GameAnimalChessView.instance.userController;
            if (winChess.type == userController.controlChess) {
                this.userImg.play("chi", 1);
                this.comImg.play("beichi", 1);
            }
            else {
                this.comImg.play("chi", 1);
                this.userImg.play("beichi", 1);
            }
        };
        UserController.prototype.onGameEvent = function (data) {
            switch (data.event) {
                case "openChase":
                    this.openChase(false);
                    break;
            }
        };
        UserController.prototype.initUserView = function () {
            var user = DataCenter.instance.user;
            this.userNameBg = AssetManager.getBitmap("animalNameBg_png");
            this.userNameBg.scaleX = -1;
            this.userNameBg.anchorOffsetX = this.userNameBg.width;
            this.userNameBg.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(this.userNameBg);
            var userName = new egret.TextField();
            userName.fontFamily = "Arial";
            userName.text = user.name;
            userName.size = 28;
            if (userName.text.length > UserConfig.nameLength)
                userName.size *= UserConfig.nameLength / userName.text.length;
            userName.anchorOffsetX = userName.measuredWidth;
            userName.x = 177;
            userName.anchorOffsetY = userName.measuredHeight / 2;
            userName.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(userName);
            var sexurl = GameCenterGetSexIcon.getSexIconSource(user.sex);
            var userSex = AssetManager.getBitmap(sexurl);
            userSex.y = 184 * GameAnimalChessView.scale;
            userSex.x = 196;
            GameAnimalChessView.instance.UILayer.addChild(userSex);
            this.userImg = new RoleAvatar(user.curAvatarType, user.imgUrl, "dbxiaoren00_game6").armature;
            this.userImg.scaleX = this.userImg.scaleY = 1;
            this.userImg.y = 145 * GameAnimalChessView.scale;
            this.userImg.x = 151;
            GameAnimalChessView.instance.UILayer.addChild(this.userImg);
            this.userImg.play("jing");
            this.userImg.touchEnabled = true;
            this.userImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.userImgTap, this);
        };
        UserController.prototype.initCompetitorView = function () {
            var competitor = DataCenter.instance.room.player;
            this.comNameBg = AssetManager.getBitmap("animalNameBg_png");
            this.comNameBg.anchorOffsetX = this.comNameBg.width;
            this.comNameBg.x = App.GameWidth;
            this.comNameBg.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(this.comNameBg);
            var comName = new egret.TextField();
            comName.fontFamily = "Arial";
            comName.text = DataCenter.instance.room.player.name;
            comName.size = 28;
            if (comName.text.length > UserConfig.nameLength)
                comName.size *= UserConfig.nameLength / comName.text.length;
            comName.anchorOffsetX = 0;
            comName.x = 465;
            comName.anchorOffsetY = comName.measuredHeight / 2;
            comName.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(comName);
            var sexurl = GameCenterGetSexIcon.getSexIconSource(competitor.sex);
            var comSex = AssetManager.getBitmap(sexurl);
            comSex.y = 184 * GameAnimalChessView.scale;
            comSex.x = 443;
            GameAnimalChessView.instance.UILayer.addChild(comSex);
            this.comImg = new RoleAvatar(competitor.curAvatarType, competitor.imgUrl, "dbxiaoren00_game6").armature;
            this.comImg.scaleX = this.comImg.scaleY = 1;
            this.comImg.y = 145 * GameAnimalChessView.scale;
            this.comImg.x = 476;
            GameAnimalChessView.instance.UILayer.addChild(this.comImg);
            this.comImg.play("jing");
            this.comImg.touchEnabled = true;
            this.comImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.comImgTap, this);
        };
        UserController.prototype.initGiveUpView = function () {
            var giveUpContainer = new egret.DisplayObjectContainer();
            var giveUpBg = AssetManager.getBitmap("giveUp_png", false, false);
            giveUpBg.width *= GameAnimalChessView.scale;
            giveUpBg.height *= GameAnimalChessView.scale;
            giveUpContainer.addChild(giveUpBg);
            this.timeView = new egret.TextField();
            this.timeView.text = this.time + "s";
            this.timeView.anchorOffsetX = this.timeView.measuredWidth / 2;
            this.timeView.anchorOffsetY = this.timeView.measuredHeight / 2;
            this.timeView.size = 32 * GameAnimalChessView.scale;
            this.timeView.fontFamily = "Arial";
            this.timeView.x = 54 * GameAnimalChessView.scale;
            this.timeView.y = 36 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.timeView);
            if (DataCenter.instance.room.selfIsMaster) {
                this.round = AssetManager.getBitmap("selfRound_png");
                this.currentRound = AnimalChess.RoundType.self;
            }
            else {
                this.round = AssetManager.getBitmap("competitorRound_png");
                this.currentRound = AnimalChess.RoundType.competitor;
            }
            this.round.width *= GameAnimalChessView.scale;
            this.round.height *= GameAnimalChessView.scale;
            this.round.anchorOffsetX = this.round.width / 2;
            this.round.anchorOffsetY = this.round.height / 2;
            this.round.x = 170 * GameAnimalChessView.scale;
            this.round.y = 24 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.round);
            this.giveUpButton = AssetManager.getBitmap("giveUpButton_png");
            this.giveUpButton.width *= GameAnimalChessView.scale;
            this.giveUpButton.height *= GameAnimalChessView.scale;
            this.giveUpButton.anchorOffsetX = this.giveUpButton.width / 2;
            this.giveUpButton.anchorOffsetY = this.giveUpButton.height / 2;
            this.giveUpButton.x = 310 * GameAnimalChessView.scale;
            this.giveUpButton.y = 40 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.giveUpButton);
            this.giveUpButton.touchEnabled = true;
            this.giveUpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.giveUpListener, this);
            this.drawnButton = AssetManager.getBitmap("drawnButton_png");
            this.drawnButton.width *= GameAnimalChessView.scale;
            this.drawnButton.height *= GameAnimalChessView.scale;
            this.drawnButton.anchorOffsetX = this.drawnButton.width / 2;
            this.drawnButton.anchorOffsetY = this.drawnButton.height / 2;
            this.drawnButton.x = 405 * GameAnimalChessView.scale;
            this.drawnButton.y = 40 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.drawnButton);
            this.drawnButton.touchEnabled = true;
            this.drawnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.drawnListener, this);
            giveUpContainer.anchorOffsetY = giveUpContainer.height / 2;
            giveUpContainer.y = 1048 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(giveUpContainer);
        };
        Object.defineProperty(UserController.prototype, "currentRound", {
            get: function () {
                return this._currentRound;
            },
            set: function (value) {
                this._currentRound = value;
                var controlChess;
                if (this.controlChess === undefined)
                    controlChess = "";
                else
                    controlChess = this.controlChess.toString();
                this.time = 60;
                this.timeView.text = "60s";
                if (this._currentRound === AnimalChess.RoundType.self) {
                    this.round.texture = AssetManager.getBitmap("selfRound" + controlChess + "_png").texture;
                    this.startTime();
                    GameAnimalChessView.instance.tipController.showSelfRoundTip();
                }
                else {
                    this.round.texture = AssetManager.getBitmap("competitorRound" + controlChess + "_png").texture;
                    GameAnimalChessView.instance.tipController.showComRoundTip();
                    this.removeTime();
                    this.startTime(false);
                }
            },
            enumerable: true,
            configurable: true
        });
        UserController.prototype.clickHandler = function (id) {
            if (this.currentRound === AnimalChess.RoundType.competitor) {
                GameAnimalChessView.instance.tipController.showComRoundTip();
                return;
            }
            var chessboardController = GameAnimalChessView.instance.chessboardController;
            var currentGrid = chessboardController.chessboardMap[id];
            if (this.isWalk == true && this.walkables.length > 0) {
                //正在走
                for (var i = 0; i < this.walkables.length; i++) {
                    if (currentGrid.position.x === this.walkables[i].position.x && currentGrid.position.y === this.walkables[i].position.y) {
                        //该点击点可走
                        this.currentRound = AnimalChess.RoundType.competitor;
                        this.startGrid.chess.select = false;
                        chessboardController.move(this.startGrid.position.x, this.startGrid.position.y, currentGrid.position.x, currentGrid.position.y);
                        this.isWalk = false;
                        this.walkables = [];
                        this.startGrid = null;
                        return;
                    }
                }
                this.isWalk = false;
                this.startGrid.chess.select = false;
                this.walkables = [];
                this.startGrid = null;
            }
            if (currentGrid.chess) {
                if (currentGrid.chess.isVisible === false) {
                    //显示棋子
                    this.currentRound = AnimalChess.RoundType.competitor;
                    chessboardController.displayGrid(currentGrid.position.x, currentGrid.position.y);
                    if (this.isWalk) {
                        this.isWalk = false;
                        this.walkables = [];
                        this.startGrid.chess.select = false;
                        this.startGrid = null;
                    }
                }
                else {
                    if (this.isWalk === false && this.walkables.length === 0 && this.controlChess === currentGrid.chess.type) {
                        //可以走
                        if (this.startGrid)
                            this.startGrid.chess.select = false;
                        this.walkables = chessboardController.getWalkableGrid(currentGrid.position.x, currentGrid.position.y);
                        if (this.walkables.length > 0) {
                            this.isWalk = true;
                            this.startGrid = currentGrid;
                            this.startGrid.chess.select = true;
                        }
                        return;
                    }
                }
            }
        };
        UserController.prototype.sayHello = function () {
            //打招呼功能在这里写
            App.GameExpressType = 1;
            GameAnimalChessView.instance.popup("GameExpress");
        };
        UserController.normalLimit = 40; //双方都计入，所以翻倍
        UserController.chaseLimit = 20; //双方都计入，所以翻倍
        return UserController;
    }());
    AnimalChess.UserController = UserController;
    __reflect(UserController.prototype, "AnimalChess.UserController");
})(AnimalChess || (AnimalChess = {}));
