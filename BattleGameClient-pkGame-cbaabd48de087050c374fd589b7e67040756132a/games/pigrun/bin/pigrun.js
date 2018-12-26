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
var GamePigRunEventClass = (function () {
    function GamePigRunEventClass() {
    }
    GamePigRunEventClass.EVENT_OTHER_DO = "otherdo";
    GamePigRunEventClass.EVENT_TIMEOUT = "timeout";
    GamePigRunEventClass.EVENT_OTHER_IS_RED = "otherRed";
    GamePigRunEventClass.EVENT_OTHER_IS_BLUE = "otherBlue";
    GamePigRunEventClass.EVENT_OTHER_IS_YELLOW = "otherYellow";
    GamePigRunEventClass.EVENT_YOU_WIN = "youWin";
    GamePigRunEventClass.EVENT_YOU_LOSE = "youLose";
    GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY = "initColor";
    GamePigRunEventClass.EVENT_OTHER_WIN = "otherWin";
    GamePigRunEventClass.EVENT_STOP_GAME = "stop";
    GamePigRunEventClass.EVENT_READY = "ready";
    GamePigRunEventClass.EVENT_REDBTN = "rbtn";
    GamePigRunEventClass.EVENT_BLUEBTN = "bbtn";
    GamePigRunEventClass.EVENT_DEATHBTN = "dbtn";
    GamePigRunEventClass.EVENT_NEWTURN = "newturn";
    return GamePigRunEventClass;
}());
__reflect(GamePigRunEventClass.prototype, "GamePigRunEventClass");
var GamePigRunLogic = (function (_super) {
    __extends(GamePigRunLogic, _super);
    function GamePigRunLogic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GamePigRunLogic.gameOver = function (result) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    GamePigRunLogic.orderNum = -1;
    GamePigRunLogic.otherOrderNum = 8;
    GamePigRunLogic.colorSettings = [];
    GamePigRunLogic.colorOtherSettings = [];
    GamePigRunLogic.wrongSwitcher = false;
    GamePigRunLogic.gameModeisDeathMode = false;
    GamePigRunLogic.isOffline = false;
    GamePigRunLogic.colorArray = [];
    /**
     * Local Message Center
     */
    GamePigRunLogic.localMessageCenter = function (event) {
        if (GamePigRunLogic.isOffline == true) {
            return;
        }
        switch (event) {
            case GamePigRunEventClass.EVENT_OTHER_DO:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_DO);
                break;
            case GamePigRunEventClass.EVENT_TIMEOUT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_TIMEOUT);
                break;
            case GamePigRunEventClass.EVENT_OTHER_IS_RED:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_IS_RED);
                break;
            case GamePigRunEventClass.EVENT_OTHER_IS_BLUE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_IS_BLUE);
                break;
            case GamePigRunEventClass.EVENT_YOU_WIN:
                GamePigRunLogic.gameOver(3);
                break;
            case GamePigRunEventClass.EVENT_YOU_LOSE:
                GamePigRunLogic.gameOver(1);
                break;
            case GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY:
                var cmdString_1 = GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY;
                GamePigRunLogic.colorSettings.forEach(function (element) {
                    cmdString_1 += ("|" + element);
                });
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, cmdString_1);
                break;
            case GamePigRunEventClass.EVENT_OTHER_WIN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_WIN);
                break;
            case GamePigRunEventClass.EVENT_STOP_GAME:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_STOP_GAME + "|" + GamePigRunMainScene.result);
                break;
            case GamePigRunEventClass.EVENT_READY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_READY, 1);
                break;
            case GamePigRunEventClass.EVENT_REDBTN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_REDBTN, 1);
                break;
            case GamePigRunEventClass.EVENT_BLUEBTN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_BLUEBTN, 1);
                break;
            case GamePigRunEventClass.EVENT_DEATHBTN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_DEATHBTN, 1);
                break;
            case GamePigRunEventClass.EVENT_NEWTURN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_NEWTURN + "|" + GamePigRunMainScene.gameTurns.toString());
                break;
        }
    };
    /**
     * Base Num Manager
     */
    GamePigRunLogic.baseNumManager = function (num) {
        // console.log("baseNumManager : " + num);
        if (num == 15) {
            num = 0;
        }
        else {
            num += 1;
        }
        return num;
    };
    /**
     * 数值自动管理
     */
    GamePigRunLogic.numManager = function () {
        return GamePigRunLogic.orderNum = GamePigRunLogic.baseNumManager(GamePigRunLogic.orderNum);
    };
    /**
     * 对方数值自动管理
     */
    GamePigRunLogic.otherNumManager = function () {
        return GamePigRunLogic.otherOrderNum = GamePigRunLogic.baseNumManager(GamePigRunLogic.otherOrderNum);
    };
    /**
     * Base Color Manager
     */
    GamePigRunLogic.baseColorManager = function (color, type) {
        if (type != undefined) {
            return color;
        }
        else {
            GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[GamePigRunLogic.orderNum];
        }
    };
    /**
     * 随机数返回一个颜色，red，blue
     */
    GamePigRunLogic.returnColor = function (type) {
        var random = Math.random();
        var color;
        if (GamePigRunLogic.colorArray.length > 3) {
            GamePigRunLogic.colorArray.shift();
        }
        if (0.5 > random && random >= 0) {
            color = "red";
            GamePigRunLogic.colorArray.push("red");
        }
        else if (1 >= random && random > 0.5) {
            color = "blue";
            GamePigRunLogic.colorArray.push("blue");
        }
        if (GamePigRunLogic.colorArray.length > 2) {
            if (GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 3] === GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 2] && GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 2] === GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 1]) {
                switch (color) {
                    case "red":
                        GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 1] = "blue";
                        return GamePigRunLogic.baseColorManager("blue", type);
                    case "blue":
                        GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 1] = "red";
                        return GamePigRunLogic.baseColorManager("red", type);
                }
            }
        }
        return GamePigRunLogic.baseColorManager(color, type);
    };
    /**
     * get color setting(s),if type is not undefined than return a Array of color
     */
    GamePigRunLogic.getColor = function (type) {
        if (type != undefined) {
            switch (GamePigRunLogic.isOffline) {
                case true:
                    for (var i = 0; i < 16; i++) {
                        GamePigRunLogic.colorSettings.push(GamePigRunLogic.returnColor("init"));
                    }
                    GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[0];
                    return GamePigRunLogic.colorSettings[0];
                case false:
                    for (var i = 0; i < 8; i++) {
                        GamePigRunLogic.colorSettings.push(GamePigRunLogic.returnColor("init"));
                    }
                    GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[0];
                    GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY);
                    var upperColor = GamePigRunLogic.colorSettings[0].replace(GamePigRunLogic.colorSettings[0], GamePigRunLogic.colorSettings[0].toUpperCase());
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "other" + upperColor);
                    return GamePigRunLogic.colorSettings[0];
            }
        }
        else {
            return GamePigRunLogic.returnColor();
        }
    };
    /**
     * 根据输入的 color：string 来返回需要加载的资源
     */
    GamePigRunLogic.switchColor = function (color, isBorder) {
        var colorRes;
        if (isBorder) {
            switch (color) {
                case "red":
                    colorRes = "PR_redBorder_png";
                    break;
                case "blue":
                    colorRes = "PR_blueBorder_png";
                    break;
                case "glary":
                    colorRes = "PR_glaryBorder_png";
                    break;
            }
            // console.log(colorRes);
            return colorRes;
        }
        else {
            switch (color) {
                case "red":
                    colorRes = "PR_redAngle_png";
                    break;
                case "blue":
                    colorRes = "PR_blueAngle_png";
                    break;
                case "glary":
                    colorRes = "PR_glaryAngle_png";
                    break;
            }
            // console.log(colorRes);
            return colorRes;
        }
    };
    /**
     * 改变输入的item的颜色
     */
    GamePigRunLogic.changeColor = function (item, color, isBorder) {
        if (isBorder != undefined) {
            item.texture = RES.getRes(GamePigRunLogic.switchColor(color, isBorder));
        }
        else {
            item.texture = RES.getRes(GamePigRunLogic.switchColor(color));
        }
    };
    /**
     * 改变场景中part的颜色和位置
     */
    GamePigRunLogic.partExhibition = function (item, color, rotation, reset) {
        if (color != undefined) {
            GamePigRunLogic.changeColor(item, color);
        }
        if (reset && reset == true) {
            item.rotation = GamePigRunMainScene.partRotation[rotation];
        }
        else {
            egret.Tween.removeTweens(item);
            var tw = egret.Tween.get(item);
            switch (item) {
                case GamePigRunMainScene.part_you:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    tw.call(function () {
                        item.rotation = GamePigRunMainScene.youTarget;
                    });
                    break;
                case GamePigRunMainScene.part_other:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    if (GamePigRunLogic.isOffline == false) {
                        tw.call(function () {
                            item.rotation = GamePigRunMainScene.target;
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    };
    /**
     * 改变场景中role的角度
     */
    GamePigRunLogic.roleExhibition = function (item, pos, reset) {
        if (pos == -1) {
            pos = 15;
        }
        if (reset && reset == true) {
            item.rotation = GamePigRunMainScene.partRotation[pos];
        }
        else {
            egret.Tween.removeTweens(item);
            var tw = egret.Tween.get(item);
            switch (item) {
                case GamePigRunMainScene.role_you:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    tw.call(function () {
                        item.rotation = GamePigRunMainScene.youTarget;
                    });
                    break;
                case GamePigRunMainScene.role_other:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    if (GamePigRunLogic.isOffline == false) {
                        tw.call(function () {
                            item.rotation = GamePigRunMainScene.target;
                        });
                    }
                    break;
                default:
                    break;
            }
            switch (item.name) {
                case "role_you":
                    GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[GamePigRunLogic.orderNum];
                    // console.log(GamePigRunMainScene.roleYouRotation);
                    break;
                case "role_other":
                    GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[GamePigRunLogic.orderNum];
                    // console.log(GamePigRunMainScene.roleOtherRotation);
                    break;
            }
        }
    };
    /**
     * 游戏结果判断
     */
    GamePigRunLogic.gameJudge = function () {
        if (GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === 1 || GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === -15) {
            GamePigRunLogic.whoWillWin = "other";
        }
        else if (GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === -1 || GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === 15) {
            GamePigRunLogic.whoWillWin = "you";
        }
        else if (GamePigRunLogic.orderNum === GamePigRunLogic.otherOrderNum) {
            switch (GamePigRunLogic.whoWillWin) {
                case "you":
                    GamePigRunMainScene.result = "you";
                    break;
                case "other":
                    GamePigRunMainScene.result = "other";
                    break;
            }
        }
    };
    return GamePigRunLogic;
}(egret.DisplayObjectContainer));
__reflect(GamePigRunLogic.prototype, "GamePigRunLogic");
var GamePigRunMainScene = (function (_super) {
    __extends(GamePigRunMainScene, _super);
    function GamePigRunMainScene() {
        var _this = _super.call(this) || this;
        _this.readyState = [0, 0];
        _this.randomTime = 4;
        _this.reset = function () {
            console.log("RESET");
            // egret.stopTick(this.circleLogic, this);
            if (GamePigRunMainScene.role_you) {
                GamePigRunMainScene.role_you.stop();
            }
            if (GamePigRunMainScene.role_other) {
                GamePigRunMainScene.role_other.stop();
            }
            GamePigRunMainScene.result = undefined;
            GamePigRunLogic.logicLocalColor = undefined;
            GamePigRunLogic.keyPress = undefined;
            GamePigRunLogic.orderNum = -1;
            GamePigRunLogic.otherOrderNum = 8;
            GamePigRunLogic.whoWillWin = undefined;
            GamePigRunLogic.colorSettings = [];
            GamePigRunLogic.wrongSwitcher = false;
            GamePigRunLogic.colorOtherSettings = [];
            GamePigRunMainScene.borderRotation = undefined;
            GamePigRunMainScene.ai = 0;
        };
        _this.twManager = function (name) {
            switch (name) {
                case "koText":
                    var tw_koText = egret.Tween.get(GamePigRunMainScene.koText);
                    GamePigRunMainScene.koText.alpha = 1;
                    tw_koText.to({ scaleX: 1, scaleY: 1 }, 300);
                    break;
                case "resultText":
                    var tw_resultText = egret.Tween.get(GamePigRunMainScene.resultText);
                    GamePigRunMainScene.resultText.alpha = 1;
                    tw_resultText.to({ x: GamePigRunMainScene.resultText.x - 200 }, 100);
                    tw_resultText.to({ x: GamePigRunMainScene.resultText.x + 200 }, 100);
                    tw_resultText.to({ x: GamePigRunMainScene.resultText.x - 100 }, 100);
                    tw_resultText.to({ x: GamePigRunMainScene.resultText.x + 100 }, 100);
                    tw_resultText.to({ x: GamePigRunMainScene.resultText.x }, 100);
                    break;
                case "roundText":
                    GamePigRunMainScene.roundText.alpha = 1;
                    var tw_roundText = egret.Tween.get(GamePigRunMainScene.roundText);
                    tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation + 40 }, 100);
                    tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation - 40 }, 100);
                    tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation + 20 }, 100);
                    tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation - 20 }, 100);
                    tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation }, 100);
                    break;
            }
        };
        /**
         * AI
         */
        _this.artificial = function () {
            GamePigRunMainScene.ai += 1;
            var random = Math.random();
            switch (GamePigRunLogic.gameModeisDeathMode) {
                case true:
                    switch (App.CurrGameAiLevel) {
                        case 1:
                            if (0.04 >= random && random >= 0) {
                                _this.otherDo();
                            }
                            break;
                        case 2:
                            if (0.06 >= random && random >= 0) {
                                _this.otherDo();
                            }
                            break;
                        case 3:
                            if (0.08 >= random && random >= 0) {
                                _this.otherDo();
                            }
                            break;
                        case 4:
                            if (GamePigRunMainScene.ai == _this.randomTime) {
                                _this.otherDo();
                                _this.randomTime = 4 + Math.round(2 * Math.random() + 0.1);
                                GamePigRunMainScene.ai = 0;
                            }
                            break;
                        case 5:
                            if (GamePigRunMainScene.ai == _this.randomTime) {
                                _this.otherDo();
                                _this.randomTime = 2 + Math.round(1 * Math.random() - 0.1);
                                GamePigRunMainScene.ai = 0;
                            }
                            break;
                    }
                    break;
                case false:
                    switch (App.CurrGameAiLevel) {
                        case 1:
                            if (GamePigRunMainScene.ai == 20) {
                                if (0.4 >= random && random >= 0) {
                                    _this.otherDo();
                                }
                                GamePigRunMainScene.ai = 0;
                            }
                            break;
                        case 2:
                            if (GamePigRunMainScene.ai == 20) {
                                if (0.6 >= random && random >= 0) {
                                    _this.otherDo();
                                }
                                GamePigRunMainScene.ai = 0;
                            }
                            break;
                        case 3:
                            if (GamePigRunMainScene.ai == 20) {
                                if (0.8 >= random && random >= 0) {
                                    _this.otherDo();
                                }
                                GamePigRunMainScene.ai = 0;
                            }
                            break;
                        case 4:
                            if (GamePigRunMainScene.ai == 16) {
                                if (0.85 >= random && random >= 0) {
                                    _this.otherDo();
                                    GamePigRunMainScene.ai = 0;
                                }
                                else {
                                    GamePigRunMainScene.ai = 8;
                                }
                            }
                            break;
                        case 5:
                            if (GamePigRunMainScene.ai == 10) {
                                if (0.98 >= random && random >= 0) {
                                    _this.otherDo();
                                    GamePigRunMainScene.ai = 0;
                                }
                                else {
                                    GamePigRunMainScene.ai = 7;
                                }
                            }
                            break;
                    }
                    break;
            }
            switch (GamePigRunLogic.colorSettings[GamePigRunLogic.otherOrderNum]) {
                case "red":
                    GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "red");
                    break;
                case "blue":
                    GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "blue");
                    break;
                case "yellow":
                    GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "yellow");
                    break;
            }
            if (GamePigRunMainScene.ai == 20) {
                GamePigRunMainScene.ai = 0;
            }
        };
        /**
         * 获胜逻辑
         */
        _this.win = function () {
            GamePigRunMainScene.youTarget = 0;
            GamePigRunMainScene.target = -180;
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_NEWTURN);
            }
            GamePigRunMainScene.btnDeath.touchEnabled = false;
            GamePigRunMainScene.btnBlue.touchEnabled = false;
            GamePigRunMainScene.btnRed.touchEnabled = false;
            console.log("你赢了！");
            _this.resultEffectManager();
            _this.addHeadIco();
            GamePigRunMainScene.running = false;
            GamePigRunMainScene.mark_you += 1;
            if (GamePigRunMainScene.mark_you == 2) {
                _this.twManager("koText");
                GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_win_png").texture;
                GamePigRunMainScene.volume_you.play("PR_music_ko_mp3", true);
                _this.twManager("resultText");
                _this.resultEffectManager();
                if (GamePigRunLogic.isOffline == false) {
                    GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_STOP_GAME);
                    App.TimerManager.doTimer(300, 1, function () {
                        GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_YOU_WIN);
                    }, _this);
                }
                else {
                    GamePigRunLogic.gameOver(3);
                }
                return;
            }
            _this.reset();
            GamePigRunMainScene.koText.alpha = 0;
            GamePigRunMainScene.resultText.alpha = 0;
            GamePigRunMainScene.roundText.alpha = 0;
            App.TimerManager.doTimer(1000, 1, function () {
                App.TimerManager.doTimer(750, 1, function () {
                    GamePigRunMainScene.role_other.play("zhuli1", 0);
                    GamePigRunMainScene.role_you.play("zhuli2", 0);
                    GamePigRunLogic.roleExhibition(_this.getChildByName("role_you"), 0, true);
                    GamePigRunLogic.roleExhibition(_this.getChildByName("role_other"), 8, true);
                    _this.gameStartManager();
                }, _this);
                CircleMask.hide(function () {
                    CircleMask.show(function () { });
                });
            }, _this);
        };
        /**
         * 失败逻辑
         */
        _this.lose = function () {
            // if (GamePigRunLogic.isOffline == false) {
            //     GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_STOP_GAME);
            // }
            _this.resultEffectManager();
            GamePigRunMainScene.youTarget = 0;
            GamePigRunMainScene.target = -180;
            GamePigRunMainScene.btnDeath.touchEnabled = false;
            GamePigRunMainScene.btnBlue.touchEnabled = false;
            GamePigRunMainScene.btnRed.touchEnabled = false;
            console.log("你输了！");
            _this.addHeadIco();
            GamePigRunMainScene.running = false;
            GamePigRunMainScene.mark_other += 1;
            if (GamePigRunMainScene.mark_other == 2) {
                _this.twManager("koText");
                GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_lose_png").texture;
                GamePigRunMainScene.volume_you.play("PR_music_ko_mp3", true);
                _this.twManager("resultText");
                _this.resultEffectManager();
                if (GamePigRunLogic.isOffline == false) {
                    GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_YOU_LOSE);
                }
                else {
                    GamePigRunLogic.gameOver(1);
                }
                return;
            }
            _this.reset();
            GamePigRunMainScene.koText.alpha = 0;
            GamePigRunMainScene.resultText.alpha = 0;
            GamePigRunMainScene.roundText.alpha = 0;
            App.TimerManager.doTimer(1000, 1, function () {
                App.TimerManager.doTimer(750, 1, function () {
                    GamePigRunMainScene.role_other.play("zhuli1", 0);
                    GamePigRunMainScene.role_you.play("zhuli2", 0);
                    GamePigRunLogic.roleExhibition(_this.getChildByName("role_you"), 0, true);
                    GamePigRunLogic.roleExhibition(_this.getChildByName("role_other"), 8, true);
                    _this.gameStartManager();
                }, _this);
                CircleMask.hide(function () {
                    CircleMask.show(function () { });
                });
            }, _this);
        };
        /**
         * step manger
         */
        _this.colorStepManager = function (finalSet) {
            if (finalSet === void 0) { finalSet = false; }
            if (finalSet == false) {
                if (GamePigRunLogic.gameModeisDeathMode == true) {
                    GamePigRunMainScene.role_you.alpha = 0;
                }
                var num = GamePigRunLogic.numManager();
                var upperColor = GamePigRunLogic.colorSettings[num].replace(GamePigRunLogic.colorSettings[num][0], GamePigRunLogic.colorSettings[num][0].toUpperCase());
                if (GamePigRunLogic.isOffline == false) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "other" + upperColor);
                }
                GamePigRunMainScene.volume_you.play("PR_music_running_mp3", true);
                // 播放龙骨动画
                switch (GamePigRunLogic.gameModeisDeathMode) {
                    case true:
                        GamePigRunMainScene.role_you.play("lanbaozou", 1);
                        App.TimerManager.doTimer(370, 1, function () {
                            GamePigRunMainScene.role_you.stop();
                            GamePigRunMainScene.role_you.play("baozouli2", 0);
                        }, _this);
                        break;
                    case false:
                        GamePigRunMainScene.role_you.play("lantiao", 1);
                        App.TimerManager.doTimer(400, 1, function () {
                            GamePigRunMainScene.role_you.stop();
                            GamePigRunMainScene.role_you.play("zhuli2", 0);
                        }, _this);
                        break;
                }
                GamePigRunLogic.partExhibition(_this.getChildByName("part_you"), GamePigRunLogic.colorSettings[num], num);
                GamePigRunLogic.roleExhibition(_this.getChildByName("role_you"), num);
                GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[num];
                GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[num];
            }
            else if (finalSet == true) {
                GamePigRunLogic.partExhibition(_this.getChildByName("part_you"), undefined, GamePigRunLogic.orderNum);
                GamePigRunLogic.roleExhibition(_this.getChildByName("role_you"), GamePigRunLogic.orderNum);
                GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[GamePigRunLogic.orderNum];
                GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[GamePigRunLogic.orderNum];
            }
        };
        /**
         * press wrong button deal
         */
        _this.wrongPressDeal = function () {
            if (GamePigRunLogic.wrongSwitcher == false) {
                switch (GamePigRunLogic.logicLocalColor) {
                    case "blue":
                        GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_blueAngle_blin_png", true, false).texture;
                        break;
                    case "red":
                        GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_redAngle_blin_png", true, false).texture;
                        break;
                }
                _this.getChildByName("btnRed").touchEnabled = false;
                _this.getChildByName("btnBlue").touchEnabled = false;
                if (GamePigRunMainScene.btnRed && GamePigRunMainScene.btnBlue) {
                    GamePigRunMainScene.btnRed.stop();
                    GamePigRunMainScene.btnRed.play("btnRedWrong", 0);
                    GamePigRunMainScene.btnBlue.stop();
                    GamePigRunMainScene.btnBlue.play("btnBlueWrong", 0);
                }
                GamePigRunLogic.wrongSwitcher = true;
                App.TimerManager.doTimer(500, 1, function () {
                    switch (GamePigRunLogic.logicLocalColor) {
                        case "blue":
                            GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_blueAngle_png", true, false).texture;
                            break;
                        case "red":
                            GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_redAngle_png", true, false).texture;
                            break;
                    }
                    _this.getChildByName("btnRed").touchEnabled = true;
                    _this.getChildByName("btnBlue").touchEnabled = true;
                    if (GamePigRunMainScene.btnRed && GamePigRunMainScene.btnBlue) {
                        GamePigRunMainScene.btnRed.stop();
                        GamePigRunMainScene.btnRed.play("btnRedNormal", 0);
                        GamePigRunMainScene.btnBlue.stop();
                        GamePigRunMainScene.btnBlue.play("btnBlueNormal", 0);
                    }
                    GamePigRunLogic.wrongSwitcher = false;
                    GamePigRunMainScene.keyState = 0;
                }, _this);
            }
        };
        /**
         * 循环逻辑
         */
        _this.circleLogic = function () {
            if (GamePigRunMainScene.running == false) {
                egret.stopTick(_this.circleLogic, _this);
                console.log("Tick has stoped!");
                return;
            }
            switch (GamePigRunMainScene.tipsSwitcher) {
                case 0:
                    break;
                case 1:
                    GamePigRunMainScene.tipsCover.alpha = 0;
                    GamePigRunMainScene.tipsCover.stop();
                    GamePigRunMainScene.tipsSwitcher = 2;
                    break;
                case 2:
                    break;
            }
            switch (GamePigRunLogic.gameModeisDeathMode) {
                case true:
                    if (_this.getChildByName("basicCircleBorder").rotation == 360) {
                        _this.getChildByName("basicCircleBorder").rotation = 0;
                    }
                    else {
                        _this.getChildByName("basicCircleBorder").rotation += 3;
                    }
                    _this.getChildByName("role_you").alpha = 1;
                    _this.getChildByName("role_other").alpha = 1;
                    if (GamePigRunMainScene.result == undefined) {
                        GamePigRunMainScene.borderRotation = _this.getChildByName("basicCircleBorder").rotation;
                        _this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation + GamePigRunMainScene.borderRotation;
                        _this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation + GamePigRunMainScene.borderRotation;
                    }
                    if (GamePigRunLogic.keyPress != undefined) {
                        GamePigRunLogic.keyPress = undefined;
                        GamePigRunMainScene.particleManager("death", 0.5);
                        GamePigRunMainScene.volume_global.play("PR_pressRight_mp3", true);
                        _this.colorStepManager();
                        if (GamePigRunLogic.isOffline == false) {
                            GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_OTHER_DO);
                        }
                    }
                    break;
                case false:
                    break;
            }
            if (GamePigRunLogic.isOffline == true) {
                _this.artificial();
            }
            return true;
        };
        _this.gameResultCheck = function () {
            GamePigRunLogic.gameJudge();
            if (GamePigRunMainScene.result == "you") {
                _this.win();
                GamePigRunMainScene.volume_global.play("PR_pound_mp3", true);
                // egret.stopTick(this.circleLogic, this);
            }
            if (GamePigRunMainScene.result == "other") {
                _this.lose();
                GamePigRunMainScene.volume_global.play("PR_bePounded_mp3", true);
                // egret.stopTick(this.circleLogic, this);
            }
        };
        /**
         * init all color border
         */
        _this.initColorBorder = function () {
            for (var i = 0; i < 16; i++) {
                GamePigRunLogic.changeColor(_this.getChildByName("step" + i.toString()), GamePigRunLogic.colorSettings[i], "true");
            }
        };
        _this.initNormalColor = function () {
            for (var i = 0; i < 16; i++) {
                GamePigRunLogic.changeColor(_this.getChildByName("step" + i.toString()), "glary", "true");
            }
            GamePigRunLogic.changeColor(GamePigRunMainScene.part_you, "glary");
            GamePigRunLogic.changeColor(GamePigRunMainScene.part_other, "glary");
        };
        /**
         * 对方成功完成一次逻辑
         */
        _this.otherDo = function () {
            if (GamePigRunLogic.gameModeisDeathMode == true) {
                _this.getChildByName("role_other").alpha = 0;
            }
            var num = GamePigRunLogic.otherNumManager();
            GamePigRunMainScene.volume_other.play("PR_music_running_mp3", true);
            // 播放龙骨动画
            switch (GamePigRunLogic.gameModeisDeathMode) {
                case true:
                    GamePigRunMainScene.role_other.play("fenbaozou", 1);
                    App.TimerManager.doTimer(370, 1, function () {
                        GamePigRunMainScene.role_other.stop();
                        GamePigRunMainScene.role_other.play("baozouli1", 0);
                    }, _this);
                    break;
                case false:
                    GamePigRunMainScene.role_other.play("fentiao", 1);
                    App.TimerManager.doTimer(400, 1, function () {
                        GamePigRunMainScene.role_other.stop();
                        GamePigRunMainScene.role_other.play("zhuli1", 0);
                    }, _this);
                    break;
            }
            GamePigRunLogic.partExhibition(_this.getChildByName("part_other"), undefined, num);
            GamePigRunLogic.roleExhibition(_this.getChildByName("role_other"), num);
            GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[num];
        };
        /**
         * game result effect manager
         */
        _this.resultEffectManager = function () {
            egret.Tween.removeTweens(GamePigRunMainScene.role_you);
            egret.Tween.removeTweens(GamePigRunMainScene.role_other);
            egret.Tween.removeTweens(GamePigRunMainScene.part_you);
            egret.Tween.removeTweens(GamePigRunMainScene.part_other);
            GamePigRunMainScene.part_you.alpha = 0;
            GamePigRunMainScene.part_other.alpha = 0;
            GamePigRunMainScene.role_you.alpha = 1;
            GamePigRunMainScene.role_other.alpha = 1;
            GamePigRunMainScene.running = false;
            _this.getChildByName("part_you").alpha = 0;
            _this.getChildByName("part_other").alpha = 0;
            switch (GamePigRunMainScene.result) {
                case "you":
                    if (GamePigRunLogic.gameModeisDeathMode == false) {
                        _this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation + 22.5;
                        _this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation;
                    }
                    else if (GamePigRunLogic.gameModeisDeathMode == true) {
                        _this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation + 22.5 + GamePigRunMainScene.borderRotation;
                        _this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation + GamePigRunMainScene.borderRotation;
                    }
                    GamePigRunMainScene.role_you.stop();
                    GamePigRunMainScene.role_other.stop();
                    GamePigRunMainScene.role_you.play("ding2", 0);
                    App.TimerManager.doTimer(300, 1, function () {
                        GamePigRunMainScene.role_you.stop();
                        GamePigRunMainScene.role_you.play("lanbaozou", 0);
                    }, _this);
                    GamePigRunMainScene.role_other.play("zhuang1", 0);
                    break;
                case "other":
                    if (GamePigRunLogic.gameModeisDeathMode == false) {
                        _this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation + 22.5;
                        _this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation;
                    }
                    else if (GamePigRunLogic.gameModeisDeathMode == true) {
                        _this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation + 22.5 + GamePigRunMainScene.borderRotation;
                        _this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation + GamePigRunMainScene.borderRotation;
                    }
                    GamePigRunMainScene.role_you.stop();
                    GamePigRunMainScene.role_other.stop();
                    GamePigRunMainScene.role_you.play("zhuang2", 0);
                    GamePigRunMainScene.role_other.play("ding1", 0);
                    App.TimerManager.doTimer(300, 1, function () {
                        GamePigRunMainScene.role_other.stop();
                        GamePigRunMainScene.role_other.play("fenbaozou", 0);
                    }, _this);
                    break;
            }
        };
        /**
         * 结果处理
         */
        _this.resultDuel = function (data) {
            var resultPageFun = function () {
                switch (GamePigRunLogic.whoWillWin) {
                    case "you":
                        break;
                    case "other":
                        GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_lose_png").texture;
                        GamePigRunMainScene.resultText.alpha = 1;
                        GamePigRunMainScene.koText.alpha = 1;
                        GamePigRunMainScene.volume_you.play("PR_music_ko_mp3", true);
                        break;
                }
                if (App.IsFaceBook) {
                    App.MessageCenter.dispatch("showInterstitialAd");
                }
                App.TimerManager.doTimer(3100, 1, function () {
                    _this.popup("GameResult", null);
                }, _this);
            };
            egret.stopTick(_this.readyTick, _this);
            egret.stopTick(_this.circleLogic, _this);
            GamePigRunMainScene.btnBlue.touchEnabled = false;
            GamePigRunMainScene.btnRed.touchEnabled = false;
            GamePigRunMainScene.btnDeath.touchEnabled = false;
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            // 发送游戏结果
            _this.popup("GameResult", resultPageFun);
        };
        /**
         * 信息处理
         */
        _this.messageDuel = function (data) {
            // if (data.userId == DataCenter.instance.user.id) {
            //     return;
            // }
            var cmdString;
            cmdString = data.event.split("|");
            switch (cmdString[0]) {
                case GamePigRunEventClass.EVENT_OTHER_DO:
                    GamePigRunMainScene.target -= 22.5;
                    _this.otherDo();
                    break;
                case GamePigRunEventClass.EVENT_TIMEOUT:
                    break;
                case GamePigRunEventClass.EVENT_OTHER_IS_RED:
                    GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "red");
                    break;
                case GamePigRunEventClass.EVENT_OTHER_IS_BLUE:
                    GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "blue");
                    break;
                case GamePigRunEventClass.EVENT_OTHER_IS_YELLOW:
                    GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "yellow");
                    break;
                case GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY:
                    for (var i = 1; i < 9; i++) {
                        GamePigRunLogic.colorOtherSettings.push(cmdString[i]);
                    }
                    break;
                case GamePigRunEventClass.EVENT_STOP_GAME:
                    egret.stopTick(_this.circleLogic, _this);
                    GamePigRunMainScene.btnBlue.touchEnabled = false;
                    GamePigRunMainScene.btnRed.touchEnabled = false;
                    GamePigRunMainScene.btnDeath.touchEnabled = false;
                    switch (cmdString[1]) {
                        case "you":
                            GamePigRunMainScene.result = "other";
                            break;
                        case "other":
                            GamePigRunMainScene.result = "you";
                            break;
                    }
                    GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_lose_png").texture;
                    _this.twManager("resultText");
                    _this.resultEffectManager();
                    break;
                case GamePigRunEventClass.EVENT_READY:
                    if (data.userId == DataCenter.instance.user.id) {
                        _this.readyState[0] = 1;
                    }
                    else if (data.userId == DataCenter.instance.room.player.id) {
                        _this.readyState[1] = 1;
                    }
                    break;
                case GamePigRunEventClass.EVENT_REDBTN:
                    if (data.userId == DataCenter.instance.user.id) {
                        GamePigRunMainScene.redBtnPress();
                    }
                    break;
                case GamePigRunEventClass.EVENT_BLUEBTN:
                    if (data.userId == DataCenter.instance.user.id) {
                        GamePigRunMainScene.blueBtnPress();
                    }
                    break;
                case GamePigRunEventClass.EVENT_DEATHBTN:
                    if (data.userId == DataCenter.instance.user.id) {
                        GamePigRunMainScene.deathBtnPress();
                    }
                    break;
                case GamePigRunEventClass.EVENT_NEWTURN:
                    if (parseInt(cmdString[1]) == GamePigRunMainScene.gameTurns) {
                        GamePigRunMainScene.running == false;
                        egret.stopTick(_this.circleLogic, _this);
                        _this.lose();
                        GamePigRunMainScene.volume_global.play("PR_bePounded_mp3", true);
                        GamePigRunMainScene.result = undefined;
                    }
                    break;
            }
        };
        _this.remoteRedBtnPress = function () {
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_REDBTN);
            }
            else {
                GamePigRunMainScene.redBtnPress();
            }
        };
        _this.remoteBlueBtnPress = function () {
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_BLUEBTN);
            }
            else {
                GamePigRunMainScene.blueBtnPress();
            }
        };
        _this.remoteDeathBtnPress = function () {
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_DEATHBTN);
            }
            else {
                GamePigRunMainScene.deathBtnPress();
            }
            GamePigRunMainScene.instance.gameResultCheck();
        };
        _this.readyTick = function () {
            if (_this.readyState[0] == 1 && _this.readyState[1] == 1 && GamePigRunLogic.colorOtherSettings.length > 0) {
                _this.readyState[0] == 0;
                _this.readyState[1] == 0;
                egret.stopTick(_this.readyTick, _this);
                console.log("ready go!");
                App.TimerManager.doTimer(1000, 1, function () {
                    GamePigRunMainScene.readyIMG.play();
                    _this.addChild(GamePigRunMainScene.readyIMG);
                    _this.getChildByName("roundText").alpha = 0;
                }, _this);
            }
            return false;
        };
        _this.gameStartManager = function () {
            GamePigRunLogic.logicLocalColor = undefined;
            GamePigRunLogic.keyPress = undefined;
            GamePigRunMainScene.btnBlue.touchEnabled = false;
            GamePigRunMainScene.btnRed.touchEnabled = false;
            GamePigRunMainScene.btnDeath.touchEnabled = false;
            GamePigRunMainScene.part_you.alpha = 1;
            GamePigRunMainScene.part_other.alpha = 1;
            var num = GamePigRunLogic.numManager();
            var color = GamePigRunLogic.getColor("array");
            _this.initNormalColor();
            GamePigRunMainScene.role_other.play("zhuli1", 0);
            GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];
            GamePigRunMainScene.role_you.play("zhuli2", 0);
            GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];
            GamePigRunMainScene.koText.alpha = 0;
            var tw = egret.Tween.get(GamePigRunMainScene.koText);
            tw.to({ scaleX: 0.1, scaleY: 0.1 }, 50);
            GamePigRunMainScene.gameTurns += 1;
            if (GamePigRunMainScene.gameTurns == 3) {
                GamePigRunMainScene.tipsCover.alpha = 1;
                GamePigRunMainScene.tipsSwitcher = 0;
                GamePigRunMainScene.tipsCover.play("Prompt2", 0);
                GamePigRunLogic.gameModeisDeathMode = true;
                _this.getChildByName("backGround").texture = AssetManager.getBitmap("PR_OverCharge_jpg", false, false).texture;
                var tw_btnRed = egret.Tween.get(GamePigRunMainScene.btnRed);
                tw_btnRed.to({ alpha: 0, y: GamePigRunMainScene.btnRed.y + 200 }, 500);
                var tw_btnBlue = egret.Tween.get(GamePigRunMainScene.btnBlue);
                tw_btnBlue.to({ alpha: 0, y: GamePigRunMainScene.btnBlue.y + 200 }, 500);
                var tw_btnDeath = egret.Tween.get(GamePigRunMainScene.btnDeath);
                tw_btnDeath.to({ alpha: 1, y: 1010 }, 500, egret.Ease.elasticOut);
                GamePigRunLogic.gameModeisDeathMode = true;
                _this.getChildByName("rainbowCircleBorder").alpha = 1;
                _this.getChildByName("basicCircleBorder").texture = AssetManager.getBitmap("PR_rainbowBorder_png", false, false).texture;
                var needHide = ["part_you", "part_other", "step0", "step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9", "step10", "step11", "step12", "step13", "step14", "step15"];
                needHide.forEach(function (element) {
                    _this.getChildByName(element).alpha = 0;
                });
            }
            GamePigRunMainScene.roundText.texture = AssetManager.getBitmap("PR_round" + GamePigRunMainScene.gameTurns.toString() + "_png").texture;
            if (GamePigRunMainScene.gameTurns == 3) {
                GamePigRunMainScene.roundText.anchorOffsetX = 135.5;
                GamePigRunMainScene.roundText.anchorOffsetY = 102.5;
            }
            GamePigRunLogic.partExhibition(GamePigRunMainScene.part_you, undefined, num, true);
            GamePigRunLogic.roleExhibition(_this.getChildByName("role_you"), num, true);
            GamePigRunLogic.partExhibition(GamePigRunMainScene.part_other, undefined, 8, true);
            GamePigRunLogic.roleExhibition(_this.getChildByName("role_other"), 8, true);
            GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];
            GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];
            _this.twManager("roundText");
            GamePigRunMainScene.volume_global.play("PR_music_round_mp3", true);
            GamePigRunMainScene.running = true;
            GamePigRunMainScene.readyIMG = new GameReady(function () {
                switch (GamePigRunLogic.colorSettings[GamePigRunLogic.otherOrderNum]) {
                    case "red":
                        GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "red");
                        break;
                    case "blue":
                        GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "blue");
                        break;
                    case "yellow":
                        GamePigRunLogic.changeColor(_this.getChildByName("part_other"), "yellow");
                        break;
                }
                App.TimerManager.doTimer(1000, 1, function () {
                    egret.startTick(_this.circleLogic, _this);
                }, _this);
                GamePigRunMainScene.btnBlue.touchEnabled = true;
                GamePigRunMainScene.btnRed.touchEnabled = true;
                if (GamePigRunMainScene.gameTurns == 3) {
                    GamePigRunMainScene.btnDeath.touchEnabled = true;
                }
                GamePigRunLogic.colorOtherSettings.forEach(function (element) {
                    GamePigRunLogic.colorSettings.push(element);
                });
                GamePigRunLogic.partExhibition(GamePigRunMainScene.part_you, color, num, true);
                GamePigRunLogic.roleExhibition(_this.getChildByName("role_you"), num, true);
                GamePigRunLogic.partExhibition(GamePigRunMainScene.part_other, GamePigRunLogic.colorOtherSettings[0], 8, true);
                GamePigRunLogic.roleExhibition(_this.getChildByName("role_other"), 8, true);
                GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];
                GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];
                _this.initColorBorder();
            });
            GamePigRunMainScene.readyIMG.x = 300;
            GamePigRunMainScene.readyIMG.y = App.GameHeight / 2;
            if (GamePigRunLogic.isOffline == true) {
                App.TimerManager.doTimer(2000, 1, function () {
                    GamePigRunMainScene.readyIMG.play();
                    _this.addChild(GamePigRunMainScene.readyIMG);
                    _this.getChildByName("roundText").alpha = 0;
                }, _this);
            }
            else {
                egret.startTick(_this.readyTick, _this);
                App.TimerManager.doTimer(1000, 1, function () {
                    GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_READY);
                }, _this);
            }
        };
        _this.pauseCallback = function () {
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
            _this.next("gameChangeMatch");
        };
        _this.addHeadIco = function () {
            var x, y;
            switch (GamePigRunMainScene.gameTurns) {
                case 1:
                    x = 180;
                    y = 170;
                    break;
                case 2:
                    x = 320;
                    y = 170;
                    break;
                case 3:
                    x = 460;
                    y = 170;
                    break;
            }
            switch (GamePigRunMainScene.result) {
                case "you":
                    var myRoleAvatar = void 0;
                    var myData = DataCenter.instance.user;
                    myRoleAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "toukuang");
                    myRoleAvatar.armature.width = 170;
                    myRoleAvatar.armature.height = 170;
                    myRoleAvatar.armature.x = x;
                    myRoleAvatar.armature.y = y;
                    myRoleAvatar.armature.alpha = 0;
                    _this.addChild(myRoleAvatar.armature);
                    GamePigRunMainScene.boomSmoke.x = x;
                    GamePigRunMainScene.boomSmoke.y = y - 40;
                    GamePigRunMainScene.boomSmoke.scaleX = 1.5;
                    GamePigRunMainScene.boomSmoke.scaleY = 1.5;
                    var tw = egret.Tween.get(myRoleAvatar.armature);
                    App.TimerManager.doTimer(700, 1, function () {
                        GamePigRunMainScene.boomSmoke.stop();
                        GamePigRunMainScene.boomSmoke.play("boom", 1);
                    }, _this);
                    tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
                    tw.to({ scaleX: 0.8, scaleY: 0.8 }, 1000, egret.Ease.elasticInOut);
                    break;
                case "other":
                case undefined:
                    var otherRoleAvatar = void 0;
                    var playData = DataCenter.instance.room.player;
                    otherRoleAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "toukuang");
                    otherRoleAvatar.armature.width = 170;
                    otherRoleAvatar.armature.height = 170;
                    otherRoleAvatar.armature.x = x;
                    otherRoleAvatar.armature.y = y;
                    otherRoleAvatar.armature.alpha = 0;
                    _this.addChild(otherRoleAvatar.armature);
                    GamePigRunMainScene.boomSmoke.x = x;
                    GamePigRunMainScene.boomSmoke.y = y - 40;
                    GamePigRunMainScene.boomSmoke.scaleX = 1.5;
                    GamePigRunMainScene.boomSmoke.scaleY = 1.5;
                    var _tw = egret.Tween.get(otherRoleAvatar.armature);
                    App.TimerManager.doTimer(700, 1, function () {
                        GamePigRunMainScene.boomSmoke.stop();
                        GamePigRunMainScene.boomSmoke.play("boom", 1);
                    }, _this);
                    _tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
                    _tw.to({ scaleX: 0.8, scaleY: 0.8 }, 1000, egret.Ease.elasticInOut);
                    break;
            }
        };
        _this.gameStart = function () {
            var backGround = AssetManager.getBitmap("PR_backGround_jpg", false, false);
            backGround.height = 1136;
            backGround.width = 640;
            backGround.x = 0;
            backGround.y = 0;
            backGround.name = "backGround";
            _this.addChild(backGround);
            var step0 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step0.x = 319.5;
            step0.y = 526;
            step0.anchorOffsetY = 0;
            step0.name = "step0";
            step0.rotation = GamePigRunMainScene.partRotation[0];
            _this.addChild(step0);
            var step1 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step1.x = 319.5;
            step1.y = 526;
            step1.anchorOffsetY = 0;
            step1.name = "step1";
            step1.rotation = GamePigRunMainScene.partRotation[1];
            _this.addChild(step1);
            var step2 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step2.x = 319.5;
            step2.y = 526;
            step2.anchorOffsetY = 0;
            step2.name = "step2";
            step2.rotation = GamePigRunMainScene.partRotation[2];
            _this.addChild(step2);
            var step3 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step3.x = 319.5;
            step3.y = 526;
            step3.anchorOffsetY = 0;
            step3.name = "step3";
            step3.rotation = GamePigRunMainScene.partRotation[3];
            _this.addChild(step3);
            var step4 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step4.x = 319.5;
            step4.y = 526;
            step4.anchorOffsetY = 0;
            step4.name = "step4";
            step4.rotation = GamePigRunMainScene.partRotation[4];
            _this.addChild(step4);
            var step5 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step5.x = 319.5;
            step5.y = 526;
            step5.anchorOffsetY = 0;
            step5.name = "step5";
            step5.rotation = GamePigRunMainScene.partRotation[5];
            _this.addChild(step5);
            var step6 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step6.x = 319.5;
            step6.y = 526;
            step6.anchorOffsetY = 0;
            step6.name = "step6";
            step6.rotation = GamePigRunMainScene.partRotation[6];
            _this.addChild(step6);
            var step7 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step7.x = 319.5;
            step7.y = 526;
            step7.anchorOffsetY = 0;
            step7.name = "step7";
            step7.rotation = GamePigRunMainScene.partRotation[7];
            _this.addChild(step7);
            var step8 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step8.x = 319.5;
            step8.y = 526;
            step8.anchorOffsetY = 0;
            step8.name = "step8";
            step8.rotation = GamePigRunMainScene.partRotation[8];
            _this.addChild(step8);
            var step9 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step9.x = 319.5;
            step9.y = 526;
            step9.anchorOffsetY = 0;
            step9.name = "step9";
            step9.rotation = GamePigRunMainScene.partRotation[9];
            _this.addChild(step9);
            var step10 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step10.x = 319.5;
            step10.y = 526;
            step10.anchorOffsetY = 0;
            step10.name = "step10";
            step10.rotation = GamePigRunMainScene.partRotation[10];
            _this.addChild(step10);
            var step11 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step11.x = 319.5;
            step11.y = 526;
            step11.anchorOffsetY = 0;
            step11.name = "step11";
            step11.rotation = GamePigRunMainScene.partRotation[11];
            _this.addChild(step11);
            var step12 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step12.x = 319.5;
            step12.y = 526;
            step12.anchorOffsetY = 0;
            step12.name = "step12";
            step12.rotation = GamePigRunMainScene.partRotation[12];
            _this.addChild(step12);
            var step13 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step13.x = 319.5;
            step13.y = 526;
            step13.anchorOffsetY = 0;
            step13.name = "step13";
            step13.rotation = GamePigRunMainScene.partRotation[13];
            _this.addChild(step13);
            var step14 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step14.x = 319.5;
            step14.y = 526;
            step14.anchorOffsetY = 0;
            step14.name = "step14";
            step14.rotation = GamePigRunMainScene.partRotation[14];
            _this.addChild(step14);
            var step15 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
            step15.x = 319.5;
            step15.y = 526;
            step15.anchorOffsetY = 0;
            step15.name = "step15";
            step15.rotation = GamePigRunMainScene.partRotation[15];
            _this.addChild(step15);
            var rainbowCircleBorder = AssetManager.getBitmap("PR_rainbowBorder__png", true, true);
            rainbowCircleBorder.x = 321;
            rainbowCircleBorder.y = 525.5;
            rainbowCircleBorder.alpha = 0;
            rainbowCircleBorder.name = "rainbowCircleBorder";
            _this.addChild(rainbowCircleBorder);
            var basicCircleBorder = AssetManager.getBitmap("PR_circleBorder_png", false, false);
            basicCircleBorder.anchorOffsetX = 302;
            basicCircleBorder.anchorOffsetY = 302;
            basicCircleBorder.x = 321;
            basicCircleBorder.y = 525.5;
            basicCircleBorder.name = "basicCircleBorder";
            _this.addChild(basicCircleBorder);
            GamePigRunMainScene.btnRed = AssetManager.getDBArmature("PR_btnRedDB");
            GamePigRunMainScene.btnRed.timeScale = 2;
            GamePigRunMainScene.btnRed.x = 195;
            GamePigRunMainScene.btnRed.y = 1010;
            GamePigRunMainScene.btnRed.name = "btnRed";
            GamePigRunMainScene.btnRed.touchEnabled = false;
            _this.addChild(GamePigRunMainScene.btnRed);
            GamePigRunMainScene.btnRed.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.remoteRedBtnPress, _this);
            GamePigRunMainScene.btnRed.timeScale = 2;
            GamePigRunMainScene.btnRed.play("btnRedNormal", 0);
            GamePigRunMainScene.btnBlue = AssetManager.getDBArmature("PR_btnBlueDB");
            GamePigRunMainScene.btnBlue.timeScale = 2;
            GamePigRunMainScene.btnBlue.x = 428;
            GamePigRunMainScene.btnBlue.y = 1010;
            GamePigRunMainScene.btnBlue.name = "btnBlue";
            GamePigRunMainScene.btnBlue.touchEnabled = false;
            _this.addChild(GamePigRunMainScene.btnBlue);
            GamePigRunMainScene.btnBlue.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.remoteBlueBtnPress, _this);
            GamePigRunMainScene.btnBlue.timeScale = 2;
            GamePigRunMainScene.btnBlue.play("btnBlueNormal", 0);
            GamePigRunMainScene.btnDeath = AssetManager.getDBArmature("PR_btnDeathDB");
            GamePigRunMainScene.btnDeath.timeScale = 4;
            GamePigRunMainScene.btnDeath.x = 320;
            GamePigRunMainScene.btnDeath.y = 1210;
            GamePigRunMainScene.btnDeath.alpha = 0;
            GamePigRunMainScene.btnDeath.name = "btnDeath";
            _this.addChild(GamePigRunMainScene.btnDeath);
            GamePigRunMainScene.btnDeath.touchEnabled = false;
            GamePigRunMainScene.btnDeath.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.remoteDeathBtnPress, _this);
            GamePigRunMainScene.btnDeath.timeScale = 3;
            GamePigRunMainScene.btnDeath.play("btnDeathNormal", 0);
            GamePigRunMainScene.part_you = AssetManager.getBitmap("PR_glaryAngle_png", true, false);
            GamePigRunMainScene.part_you.x = 320;
            GamePigRunMainScene.part_you.y = 526;
            GamePigRunMainScene.part_you.anchorOffsetY = 0;
            GamePigRunMainScene.part_you.name = "part_you";
            GamePigRunMainScene.part_you.rotation = GamePigRunMainScene.partRotation[0];
            _this.addChild(GamePigRunMainScene.part_you);
            GamePigRunMainScene.part_other = AssetManager.getBitmap("PR_glaryAngle_png", true, false);
            GamePigRunMainScene.part_other.x = 320;
            GamePigRunMainScene.part_other.y = 526;
            GamePigRunMainScene.part_other.anchorOffsetY = 0;
            GamePigRunMainScene.part_other.name = "part_other";
            GamePigRunMainScene.part_other.rotation = GamePigRunMainScene.partRotation[8];
            _this.addChild(GamePigRunMainScene.part_other);
            GamePigRunMainScene.role_you = AssetManager.getDBArmature("Armature");
            GamePigRunMainScene.role_you.timeScale = 2;
            GamePigRunMainScene.role_you.x = 320;
            GamePigRunMainScene.role_you.y = 526;
            GamePigRunMainScene.role_you.anchorOffsetX = 64;
            GamePigRunMainScene.role_you.anchorOffsetY = 0;
            GamePigRunMainScene.role_you.rotation = GamePigRunMainScene.partRotation[0];
            GamePigRunMainScene.role_you.name = "role_you";
            _this.addChild(GamePigRunMainScene.role_you);
            GamePigRunMainScene.role_you.play("zhuli2", 0);
            GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];
            GamePigRunMainScene.role_other = AssetManager.getDBArmature("Armature");
            GamePigRunMainScene.role_other.timeScale = 2;
            GamePigRunMainScene.role_other.x = 320;
            GamePigRunMainScene.role_other.y = 526;
            GamePigRunMainScene.role_other.anchorOffsetX = 64;
            GamePigRunMainScene.role_other.anchorOffsetY = 0;
            GamePigRunMainScene.role_other.rotation = GamePigRunMainScene.partRotation[8];
            GamePigRunMainScene.role_other.name = "role_other";
            _this.addChild(GamePigRunMainScene.role_other);
            GamePigRunMainScene.role_other.play("zhuli1", 0);
            GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];
            var particleSmokeTexture = RES.getRes("PR_smoke_png");
            var particleSmokeConfig = RES.getRes("PR_smoke_json");
            GamePigRunMainScene.particleSmoke = new particle.GravityParticleSystem(particleSmokeTexture, particleSmokeConfig);
            _this.addChild(GamePigRunMainScene.particleSmoke);
            var particleStarsTexture = RES.getRes("PR_stars_png");
            var particleStarsConfig = RES.getRes("PR_stars_json");
            GamePigRunMainScene.particleStars = new particle.GravityParticleSystem(particleStarsTexture, particleStarsConfig);
            _this.addChild(GamePigRunMainScene.particleStars);
            if (!GamePigRunMainScene.role_you) {
                console.error("============> GamePigRunMainScene.role_you: " + GamePigRunMainScene.role_you);
            }
            if (!GamePigRunMainScene.role_other) {
                console.error("============> GamePigRunMainScene.role_other: " + GamePigRunMainScene.role_other);
            }
            var myRoleAvatar;
            var myData = DataCenter.instance.user;
            myRoleAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl);
            if (!myRoleAvatar.armature) {
                console.error("============> myRoleAvatar.armature: " + myRoleAvatar.armature);
            }
            GamePigRunMainScene.role_you["_armature"].getSlot("ren").childArmature = myRoleAvatar.armature["_armature"];
            var otherRoleAvatar;
            var playData = DataCenter.instance.room.player;
            otherRoleAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl);
            if (!otherRoleAvatar.armature) {
                console.error("============> otherRoleAvatar.armature: " + otherRoleAvatar.armature);
            }
            GamePigRunMainScene.role_other["_armature"].getSlot("ren").childArmature = otherRoleAvatar.armature["_armature"];
            // 小米平台去掉退出按钮
            if (!App.IsXiaoMi && !App.IsWanba) {
                var returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
                returnToLastButton.y = 19;
                _this.addChild(returnToLastButton);
                returnToLastButton.touchEnabled = true;
                returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    _this.popup("GameSureLeave");
                }, _this);
            }
            GamePigRunMainScene.roundText = AssetManager.getBitmap("PR_round1_png", true, true);
            GamePigRunMainScene.roundText.x = 320;
            GamePigRunMainScene.roundText.y = 522;
            GamePigRunMainScene.roundText.name = "roundText";
            _this.addChild(GamePigRunMainScene.roundText);
            GamePigRunMainScene.tipsCover = AssetManager.getDBArmature("pigD");
            GamePigRunMainScene.tipsCover.x = 312;
            GamePigRunMainScene.tipsCover.y = 1145;
            GamePigRunMainScene.tipsCover.name = "tipsCover";
            _this.addChild(GamePigRunMainScene.tipsCover);
            GamePigRunMainScene.tipsCover.play("Prompt1", 0);
            GamePigRunMainScene.resultText = AssetManager.getBitmap("PR_win_png", true, false);
            GamePigRunMainScene.resultText.width = 231;
            GamePigRunMainScene.resultText.height = 73;
            GamePigRunMainScene.resultText.x = 320;
            GamePigRunMainScene.resultText.y = 812;
            GamePigRunMainScene.resultText.alpha = 0;
            GamePigRunMainScene.resultText.name = "resultText";
            _this.addChild(GamePigRunMainScene.resultText);
            GamePigRunMainScene.koText = AssetManager.getBitmap("PR_KO_png", true, true);
            GamePigRunMainScene.koText.width = 452;
            GamePigRunMainScene.koText.height = 282;
            GamePigRunMainScene.koText.x = 320;
            GamePigRunMainScene.koText.y = 525;
            GamePigRunMainScene.koText.alpha = 0;
            GamePigRunMainScene.koText.name = "koText";
            _this.addChild(GamePigRunMainScene.koText);
            GamePigRunMainScene.boomSmoke = AssetManager.getDBArmature("boom");
            GamePigRunMainScene.boomSmoke.x = 0;
            GamePigRunMainScene.boomSmoke.y = 0;
            GamePigRunMainScene.boomSmoke.name = "boom";
            _this.addChild(GamePigRunMainScene.boomSmoke);
            GamePigRunMainScene.volume_you = new SoundEffects();
            GamePigRunMainScene.volume_you.setVolume(0.7);
            GamePigRunMainScene.volume_other = new SoundEffects();
            GamePigRunMainScene.volume_other.setVolume(0.7);
            GamePigRunMainScene.volume_global = new SoundEffects();
            GamePigRunMainScene.volume_global.setVolume(0.7);
            _this.initNormalColor();
            //游戏内事件返回
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, _this.messageDuel, _this);
            //结果返回
            App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, _this.resultDuel, _this);
            App.MessageCenter.addListener(EventMessage.pauseMessage, _this.pauseCallback, _this);
            if (_this.stage.stageHeight < 1136) {
                GamePigRunMainScene.multiple = (_this.stage.stageHeight / 1136);
                _this.scaleX = GamePigRunMainScene.multiple;
                _this.scaleY = GamePigRunMainScene.multiple;
                var nowWidth = 640 * GamePigRunMainScene.multiple;
                _this.x = (640 - nowWidth) / 2;
            }
            else if (_this.stage.stageHeight > 1136) {
                _this.y = (_this.stage.stageHeight - 1136) / 2;
            }
            _this.gameStartManager();
        };
        if (DataCenter.instance.room.IsAI) {
            GamePigRunLogic.isOffline = true;
        }
        GamePigRunMainScene.instance = _this;
        egret.lifecycle.onPause = function () {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GamePigRunMainScene.volume_global) {
                GamePigRunMainScene.volume_global.setVolume(0);
            }
            if (GamePigRunMainScene.volume_other) {
                GamePigRunMainScene.volume_other.setVolume(0);
            }
            if (GamePigRunMainScene.volume_you) {
                GamePigRunMainScene.volume_you.setVolume(0);
            }
        };
        egret.lifecycle.onResume = function () {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GamePigRunMainScene.volume_global) {
                GamePigRunMainScene.volume_global.setVolume(0.7);
            }
            if (GamePigRunMainScene.volume_other) {
                GamePigRunMainScene.volume_other.setVolume(0.7);
            }
            if (GamePigRunMainScene.volume_you) {
                GamePigRunMainScene.volume_you.setVolume(0.7);
            }
        };
        return _this;
    }
    GamePigRunMainScene.prototype.init = function () {
        if (DataCenter.instance.room.IsAI) {
            GamePigRunLogic.isOffline = true;
        }
        try {
            this.gameStart();
        }
        catch (err) {
            egret.error(err);
        }
        App.SoundManager.stopBg();
        App.SoundManager.playBg("PR_music_normal_mp3");
        // App.CurrGameAiLevel = 5;
        // console.log("AI LEVEL:", App.CurrGameAiLevel);
    };
    GamePigRunMainScene.prototype.dispose = function () {
        egret.stopTick(this.circleLogic, this);
        egret.stopTick(this.readyTick, this);
        if (GamePigRunMainScene.role_you) {
            GamePigRunMainScene.role_you.stop();
        }
        if (GamePigRunMainScene.role_other) {
            GamePigRunMainScene.role_other.stop();
        }
        if (GamePigRunMainScene.tipsCover) {
            GamePigRunMainScene.tipsCover.stop();
        }
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.messageDuel, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.resultDuel, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
        this.getChildByName("btnRed").removeEventListener(egret.TouchEvent.TOUCH_TAP, GamePigRunMainScene.redBtnPress, this);
        this.getChildByName("btnBlue").removeEventListener(egret.TouchEvent.TOUCH_TAP, GamePigRunMainScene.blueBtnPress, this);
        App.SoundManager.stopBg();
        this.getChildByName("btnRed").touchEnabled = false;
        this.getChildByName("btnBlue").touchEnabled = false;
        this.getChildByName("btnDeath").touchEnabled = false;
        GamePigRunMainScene.result = undefined;
        GamePigRunLogic.logicLocalColor = undefined;
        GamePigRunLogic.keyPress = undefined;
        GamePigRunLogic.orderNum = -1;
        GamePigRunLogic.otherOrderNum = 8;
        GamePigRunLogic.whoWillWin = undefined;
        GamePigRunLogic.colorSettings = [];
        GamePigRunLogic.wrongSwitcher = false;
        GamePigRunLogic.gameModeisDeathMode = false;
        GamePigRunLogic.isOffline = false;
        GamePigRunLogic.colorOtherSettings = [];
        GamePigRunMainScene.borderRotation = undefined;
        GamePigRunMainScene.roleYouRotation = undefined;
        GamePigRunMainScene.roleOtherRotation = undefined;
        GamePigRunMainScene.multiple = undefined;
        GamePigRunMainScene.volume_you = undefined;
        GamePigRunMainScene.volume_other = undefined;
        GamePigRunMainScene.volume_global = undefined;
        GamePigRunMainScene.btnRed = undefined;
        GamePigRunMainScene.btnBlue = undefined;
        GamePigRunMainScene.btnDeath = undefined;
        GamePigRunMainScene.gameTurns = 0;
        GamePigRunMainScene.tipsSwitcher = 0;
        GamePigRunMainScene.mark_you = 0;
        GamePigRunMainScene.mark_other = 0;
        GamePigRunMainScene.roundText = undefined;
        GamePigRunMainScene.resultText = undefined;
        GamePigRunMainScene.koText = undefined;
        GamePigRunMainScene.hasInDeathMode = false;
        GamePigRunMainScene.scenceMask = undefined;
        GamePigRunMainScene.effectTimer = undefined;
        GamePigRunMainScene.effectCounter = 0;
        GamePigRunMainScene.part_you = undefined;
        GamePigRunMainScene.part_other = undefined;
        GamePigRunMainScene.boomSmoke = undefined;
        GamePigRunMainScene.ai = 0;
        GamePigRunMainScene.tipsCover = undefined;
        GamePigRunMainScene.target = -180;
        GamePigRunMainScene.youTarget = 0;
        if (GamePigRunMainScene.readyIMG) {
            GamePigRunMainScene.readyIMG.dispose();
            GamePigRunMainScene.readyIMG = undefined;
        }
        GamePigRunMainScene.instance = null;
        GamePigRunMainScene.keyState = 0;
        App.TimerManager.removeAll(this);
    };
    GamePigRunMainScene.partRotation = [0, -22.5, -45, -67.5, -90, -112.5, -135, -157.5, -180, -202.5, -225, -247.5, -270, -292.5, -315, -337.5];
    GamePigRunMainScene.running = true;
    GamePigRunMainScene.gameTurns = 0;
    GamePigRunMainScene.tipsSwitcher = 0;
    GamePigRunMainScene.mark_you = 0;
    GamePigRunMainScene.mark_other = 0;
    GamePigRunMainScene.hasInDeathMode = false;
    GamePigRunMainScene.effectCounter = 0;
    GamePigRunMainScene.ai = 0;
    GamePigRunMainScene.target = -180;
    GamePigRunMainScene.youTarget = 0;
    GamePigRunMainScene.keyState = 0;
    /**
     * particle playing Manager,
     */
    GamePigRunMainScene.particleManager = function (what, time) {
        var PositionX;
        var PositionY;
        var pos = GamePigRunLogic.keyPress;
        switch (pos) {
            case "blue":
                PositionX = 520;
                PositionY = 980;
                break;
            case "yellow":
                PositionX = 310;
                PositionY = 980;
                break;
            case "red":
                PositionX = 100;
                PositionY = 980;
                break;
            case "death":
                PositionX = 310;
                PositionY = 980;
                break;
        }
        switch (what) {
            case "smoke":
                GamePigRunMainScene.particleSmoke.emitterX = PositionX;
                GamePigRunMainScene.particleSmoke.emitterY = PositionY;
                GamePigRunMainScene.particleSmoke.start(time);
                break;
            case "stars":
                GamePigRunMainScene.particleStars.emitterX = PositionX;
                GamePigRunMainScene.particleStars.emitterY = PositionY;
                GamePigRunMainScene.particleStars.start(time);
                break;
            case "death":
                GamePigRunMainScene.particleStars.emitterX = PositionX;
                GamePigRunMainScene.particleStars.emitterY = PositionY;
                GamePigRunMainScene.particleStars.start(time);
                break;
        }
    };
    GamePigRunMainScene.handlePress = function () {
        if (GamePigRunLogic.logicLocalColor != undefined && GamePigRunLogic.logicLocalColor == GamePigRunLogic.keyPress) {
            GamePigRunMainScene.youTarget -= 22.5;
            GamePigRunMainScene.particleManager("stars", 0.5);
            GamePigRunMainScene.volume_global.play("PR_pressRight_mp3", true);
            GamePigRunLogic.logicLocalColor = undefined;
            GamePigRunLogic.keyPress = undefined;
            GamePigRunMainScene.instance.colorStepManager();
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_OTHER_DO);
            }
            GamePigRunMainScene.keyState = 0;
        }
        else if (GamePigRunLogic.keyPress != undefined && GamePigRunLogic.logicLocalColor != GamePigRunLogic.keyPress) {
            GamePigRunMainScene.particleManager("smoke", 0.3);
            GamePigRunMainScene.volume_global.play("PR_pressWrong_mp3", true);
            GamePigRunLogic.keyPress = undefined;
            GamePigRunMainScene.instance.wrongPressDeal();
        }
    };
    /**
     * 红按钮被按下
     */
    GamePigRunMainScene.redBtnPress = function () {
        if (GamePigRunMainScene.tipsSwitcher == 0) {
            GamePigRunMainScene.tipsSwitcher = 1;
        }
        ;
        if (GamePigRunMainScene.keyState == 1) {
            return;
        }
        GamePigRunMainScene.keyState = 1;
        GamePigRunLogic.keyPress = "red";
        GamePigRunMainScene.handlePress();
        GamePigRunMainScene.instance.gameResultCheck();
        if (GamePigRunLogic.keyPress != undefined && GamePigRunLogic.logicLocalColor != GamePigRunLogic.keyPress) {
            return;
        }
        else {
            if (GamePigRunMainScene.btnRed) {
                GamePigRunMainScene.btnRed.stop();
                GamePigRunMainScene.btnRed.play("btnRedPress", 1);
                App.TimerManager.doTimer(35, 1, function () {
                    if (GamePigRunMainScene.btnRed) {
                        GamePigRunMainScene.btnRed.stop();
                        if (GamePigRunLogic.wrongSwitcher == false) {
                            GamePigRunMainScene.btnRed.play("btnRedNormal", 0);
                        }
                        else {
                            GamePigRunMainScene.btnRed.play("btnRedeWrong", 0);
                        }
                    }
                }, GamePigRunMainScene);
            }
            GamePigRunMainScene.btnRed.touchEnabled = false;
            App.TimerManager.doTimer(50, 1, function () {
                GamePigRunMainScene.btnRed.touchEnabled = true;
            }, GamePigRunMainScene);
        }
    };
    /**
     * 蓝按钮被按下
     */
    GamePigRunMainScene.blueBtnPress = function () {
        if (GamePigRunMainScene.tipsSwitcher == 0) {
            GamePigRunMainScene.tipsSwitcher = 1;
        }
        ;
        if (GamePigRunMainScene.keyState == 1) {
            return;
        }
        GamePigRunMainScene.keyState = 1;
        GamePigRunLogic.keyPress = "blue";
        GamePigRunMainScene.handlePress();
        GamePigRunMainScene.instance.gameResultCheck();
        if (GamePigRunLogic.keyPress != undefined && GamePigRunLogic.logicLocalColor != GamePigRunLogic.keyPress) {
            return;
        }
        else {
            if (GamePigRunMainScene.btnBlue) {
                GamePigRunMainScene.btnBlue.stop();
                GamePigRunMainScene.btnBlue.play("btnBluePress", 1);
                App.TimerManager.doTimer(35, 1, function () {
                    if (GamePigRunMainScene.btnBlue) {
                        GamePigRunMainScene.btnBlue.stop();
                        if (GamePigRunLogic.wrongSwitcher == false) {
                            GamePigRunMainScene.btnBlue.play("btnBlueNormal", 0);
                        }
                        else {
                            GamePigRunMainScene.btnBlue.play("btnBlueWrong", 0);
                        }
                    }
                }, GamePigRunMainScene);
            }
            GamePigRunMainScene.btnBlue.touchEnabled = false;
            App.TimerManager.doTimer(50, 1, function () {
                GamePigRunMainScene.btnBlue.touchEnabled = true;
            }, GamePigRunMainScene);
        }
    };
    /**
     * Death button keyPress
     */
    GamePigRunMainScene.deathBtnPress = function () {
        if (GamePigRunMainScene.tipsSwitcher == 0) {
            GamePigRunMainScene.tipsSwitcher = 1;
        }
        ;
        GamePigRunLogic.keyPress = "death";
        if (GamePigRunMainScene.btnDeath) {
            GamePigRunMainScene.btnDeath.stop();
            GamePigRunMainScene.btnDeath.play("btnDeathPress", 1);
            App.TimerManager.doTimer(110, 1, function () {
                if (GamePigRunMainScene.btnDeath) {
                    GamePigRunMainScene.btnDeath.stop();
                    GamePigRunMainScene.btnDeath.play("btnDeathNormal", 0);
                }
            }, GamePigRunMainScene);
        }
    };
    return GamePigRunMainScene;
}(State));
__reflect(GamePigRunMainScene.prototype, "GamePigRunMainScene");
