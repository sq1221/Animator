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
var GameMasterMindEvent = (function () {
    function GameMasterMindEvent() {
    }
    GameMasterMindEvent.EVENT_GAMEREADY = "ready";
    GameMasterMindEvent.EVENT_ANSWER = "answer";
    GameMasterMindEvent.EVENT_RESULT = "result";
    GameMasterMindEvent.MMMessagerCenter = function (msg) {
        if (DataCenter.instance.room.IsAI) {
            return;
        }
        switch (msg) {
            case GameMasterMindEvent.EVENT_GAMEREADY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameMasterMindEvent.EVENT_GAMEREADY);
                break;
            case GameMasterMindEvent.EVENT_ANSWER:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameMasterMindEvent.EVENT_ANSWER + "|" + GameMasterMindItemClass.chooseIndex + "|" + GameMasterMindItemClass.youTimeText.text);
                break;
            case GameMasterMindEvent.EVENT_RESULT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameMasterMindEvent.EVENT_GAMEREADY);
                break;
        }
    };
    return GameMasterMindEvent;
}());
__reflect(GameMasterMindEvent.prototype, "GameMasterMindEvent");
var GameMasterMindItemClass = (function () {
    function GameMasterMindItemClass() {
    }
    GameMasterMindItemClass.readyState = [0, 0];
    GameMasterMindItemClass.isOffline = false;
    GameMasterMindItemClass.Question = [];
    GameMasterMindItemClass.correctAnswerIndex = -1;
    GameMasterMindItemClass.chooseIndex = -1;
    GameMasterMindItemClass.otherChooseIndex = -1;
    GameMasterMindItemClass.QuestionOrder = 0;
    GameMasterMindItemClass.youTime = 0;
    GameMasterMindItemClass.otherTime = 0;
    GameMasterMindItemClass.youScore = 0;
    GameMasterMindItemClass.otherScore = 0;
    GameMasterMindItemClass.youCombo = 0;
    GameMasterMindItemClass.otherCombo = 0;
    GameMasterMindItemClass.youComboState = false;
    GameMasterMindItemClass.otherComboState = false;
    GameMasterMindItemClass.hasShowLeftTimeUsed = false;
    GameMasterMindItemClass.hasShowRightTimeUsed = false;
    GameMasterMindItemClass.dispose = function () {
        GameMasterMindItemClass.readyState = [0, 0];
        GameMasterMindItemClass.multiple = undefined;
        GameMasterMindItemClass.backGround = undefined;
        GameMasterMindItemClass.btn1 = undefined;
        GameMasterMindItemClass.btn2 = undefined;
        GameMasterMindItemClass.btn3 = undefined;
        GameMasterMindItemClass.btn4 = undefined;
        GameMasterMindItemClass.clock = undefined;
        GameMasterMindItemClass.fireLine = undefined;
        GameMasterMindItemClass.fireLineLeft = undefined;
        GameMasterMindItemClass.fireLineMask = undefined;
        GameMasterMindItemClass.fireLineLeftMask = undefined;
        GameMasterMindItemClass.scoreBoard = undefined;
        GameMasterMindItemClass.rightTips = undefined;
        GameMasterMindItemClass.wrongTips = undefined;
        GameMasterMindItemClass.questionBoard = undefined;
        GameMasterMindItemClass.youRole = undefined;
        GameMasterMindItemClass.otherRole = undefined;
        GameMasterMindItemClass.leftTimeUsed = undefined;
        GameMasterMindItemClass.rightTimeUsed = undefined;
        GameMasterMindItemClass.greetNormalBtn = undefined;
        GameMasterMindItemClass.loadingTips = undefined;
        GameMasterMindItemClass.isOffline = false;
        GameMasterMindItemClass.soundEffect = undefined;
        GameMasterMindItemClass.questionText = undefined;
        GameMasterMindItemClass.btn1Text = undefined;
        GameMasterMindItemClass.btn2Text = undefined;
        GameMasterMindItemClass.btn3Text = undefined;
        GameMasterMindItemClass.btn4Text = undefined;
        GameMasterMindItemClass.countdownText = undefined;
        GameMasterMindItemClass.Question = [];
        GameMasterMindItemClass.correctAnswerIndex = -1;
        GameMasterMindItemClass.chooseIndex = 0;
        GameMasterMindItemClass.otherChooseIndex = 0;
        GameMasterMindItemClass.QuestionOrder = 0;
        GameMasterMindItemClass.youMark = undefined;
        GameMasterMindItemClass.otherMark = undefined;
        GameMasterMindItemClass.youTime = 0;
        GameMasterMindItemClass.otherTime = 0;
        GameMasterMindItemClass.typeStr = undefined;
        GameMasterMindItemClass.turnsText = undefined;
        GameMasterMindItemClass.youTimeText = undefined;
        GameMasterMindItemClass.otherTimeText = undefined;
        GameMasterMindItemClass.youScore = 0;
        GameMasterMindItemClass.otherScore = 0;
        GameMasterMindItemClass.youScoreText = undefined;
        GameMasterMindItemClass.otherScoreText = undefined;
        GameMasterMindItemClass.reportIcon = undefined;
        GameMasterMindItemClass.leftDesk = undefined;
        GameMasterMindItemClass.rightDesk = undefined;
        GameMasterMindItemClass.nameLeftBoard = undefined;
        GameMasterMindItemClass.nameRightBoard = undefined;
        GameMasterMindItemClass.littleLeftMark = undefined;
        GameMasterMindItemClass.littleRightMark = undefined;
        GameMasterMindItemClass.timeUsedLeftBoard = undefined;
        GameMasterMindItemClass.timeUsedRightBoard = undefined;
        GameMasterMindItemClass.answerMask = undefined;
        GameMasterMindItemClass.littlePurple = undefined;
        GameMasterMindItemClass.spareType = undefined;
        GameMasterMindItemClass.leftCombo = undefined;
        GameMasterMindItemClass.rightCombo = undefined;
        GameMasterMindItemClass.youCombo = 0;
        GameMasterMindItemClass.otherCombo = 0;
        GameMasterMindItemClass.youComboText = undefined;
        GameMasterMindItemClass.otherComboText = undefined;
        GameMasterMindItemClass.youComboState = false;
        GameMasterMindItemClass.otherComboState = false;
        GameMasterMindItemClass.hasShowLeftTimeUsed = false;
        GameMasterMindItemClass.hasShowRightTimeUsed = false;
    };
    return GameMasterMindItemClass;
}());
__reflect(GameMasterMindItemClass.prototype, "GameMasterMindItemClass");
var GameMasterMindLogic = (function () {
    function GameMasterMindLogic() {
    }
    GameMasterMindLogic.gameOver = function (result) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    GameMasterMindLogic.btn1Press = function () {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 0;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn1.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn1Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    };
    GameMasterMindLogic.btn2Press = function () {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 1;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn2.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn2Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    };
    GameMasterMindLogic.btn3Press = function () {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 2;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn3.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn3Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    };
    GameMasterMindLogic.btn4Press = function () {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 3;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn4.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn4Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    };
    GameMasterMindLogic.numToFont = function () {
        switch (GameMasterMindItemClass.QuestionOrder) {
            case 1:
                return "二";
            case 2:
                return "三";
            case 3:
                return "四";
            case 4:
                return "五";
            case 5:
                return "六";
            case 6:
                return "七";
            case 7:
                return "八";
            case 8:
                return "九";
        }
    };
    GameMasterMindLogic.tableSwitcher = function () {
        GameMasterMindItemClass.typeStr.alpha = 1;
        switch (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["type"]) {
            case "lishi":
                GameMasterMindItemClass.typeStr.text = "历史";
                GameMasterMindItemClass.spareType.text = "历史";
                break;
            case "dongman":
                GameMasterMindItemClass.typeStr.text = "动漫";
                GameMasterMindItemClass.spareType.text = "动漫";
                break;
            case "wenhua":
                GameMasterMindItemClass.typeStr.text = "文化";
                GameMasterMindItemClass.spareType.text = "文化";
                break;
            case "richang":
                GameMasterMindItemClass.typeStr.text = "日常";
                GameMasterMindItemClass.spareType.text = "日常";
                break;
            case "dianying":
                GameMasterMindItemClass.typeStr.text = "电影";
                GameMasterMindItemClass.spareType.text = "电影";
                break;
            case "youxi":
                GameMasterMindItemClass.typeStr.text = "游戏";
                GameMasterMindItemClass.spareType.text = "游戏";
                break;
            case "renwu":
                GameMasterMindItemClass.typeStr.text = "人物";
                GameMasterMindItemClass.spareType.text = "人物";
                break;
            case "ziran":
                GameMasterMindItemClass.typeStr.text = "自然";
                GameMasterMindItemClass.spareType.text = "自然";
                break;
            case "mingzhu":
                GameMasterMindItemClass.typeStr.text = "名著";
                GameMasterMindItemClass.spareType.text = "名著";
                break;
            case "dili":
                GameMasterMindItemClass.typeStr.text = "地理";
                GameMasterMindItemClass.spareType.text = "地理";
                break;
            case "yinyue":
                GameMasterMindItemClass.typeStr.text = "音乐";
                GameMasterMindItemClass.spareType.text = "音乐";
                break;
            case "kexue":
                GameMasterMindItemClass.typeStr.text = "科学";
                GameMasterMindItemClass.spareType.text = "科学";
                break;
        }
    };
    GameMasterMindLogic.AI = function () {
        var random = Math.random();
        switch (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"].length) {
            case 2:
                if (random < 0.5) {
                    GameMasterMindItemClass.otherChooseIndex = 1;
                }
                else {
                    GameMasterMindItemClass.otherChooseIndex = 0;
                }
                break;
            case 3:
                if (random < 0.333) {
                    GameMasterMindItemClass.otherChooseIndex = 1;
                }
                else if (random >= 0.333 && random < 0.666) {
                    GameMasterMindItemClass.otherChooseIndex = 0;
                }
                else if (random >= 0.666) {
                    GameMasterMindItemClass.otherChooseIndex = 2;
                }
                break;
            case 4:
                if (random < 0.25) {
                    GameMasterMindItemClass.otherChooseIndex = 1;
                }
                else if (random >= 0.25 && random < 0.5) {
                    GameMasterMindItemClass.otherChooseIndex = 0;
                }
                else if (random >= 0.5 && random < 0.75) {
                    GameMasterMindItemClass.otherChooseIndex = 2;
                }
                else if (random >= 0.75) {
                    GameMasterMindItemClass.otherChooseIndex = 3;
                }
                break;
        }
        // GameMasterMindItemClass.otherChooseIndex = GameMasterMindItemClass.correctAnswerIndex;
        var time = (random * 8000 + 4500);
        App.TimerManager.doTimer(time, 1, function () {
            egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
            egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
            GameMasterMindItemClass.readyState[1] = 1;
            console.log("DO!");
            if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                GameMasterMindItemClass.otherScore += GameMasterMindLogic.scoreManager(parseInt((time / 1000).toString()));
            }
            GameMasterMindMainScene.showRightTimeUsed(false);
        }, GameMasterMindLogic);
    };
    GameMasterMindLogic.fontSizeManager = function (font) {
        if (font == undefined || GameMasterMindItemClass.Question == undefined || GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"] == undefined) {
            return;
        }
        switch (font) {
            case GameMasterMindItemClass.btn1Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][0] == undefined) {
                    return;
                }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][0].length > 10) {
                    GameMasterMindItemClass.btn1Text.size = 30;
                }
                else {
                    GameMasterMindItemClass.btn1Text.size = 36;
                }
                break;
            case GameMasterMindItemClass.btn2Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1] == undefined) {
                    return;
                }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1].length > 10) {
                    GameMasterMindItemClass.btn2Text.size = 30;
                }
                else {
                    GameMasterMindItemClass.btn2Text.size = 36;
                }
                break;
            case GameMasterMindItemClass.btn3Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2] == undefined) {
                    return;
                }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2].length > 10) {
                    GameMasterMindItemClass.btn3Text.size = 30;
                }
                else {
                    GameMasterMindItemClass.btn3Text.size = 36;
                }
                break;
            case GameMasterMindItemClass.btn4Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][3] == undefined) {
                    return;
                }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][3].length > 10) {
                    GameMasterMindItemClass.btn4Text.size = 30;
                }
                else {
                    GameMasterMindItemClass.btn4Text.size = 36;
                }
                break;
        }
    };
    GameMasterMindLogic.refresh = function () {
        GameMasterMindItemClass.correctAnswerIndex = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["correctAnswerIndex"];
        GameMasterMindItemClass.questionText.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["title"];
        GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn1Text);
        GameMasterMindItemClass.btn1Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][0];
        switch (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"].length) {
            case 2:
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn2Text);
                GameMasterMindItemClass.btn2Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1];
                break;
            case 3:
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn2Text);
                GameMasterMindItemClass.btn2Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1];
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn3Text);
                GameMasterMindItemClass.btn3Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2];
                break;
            case 4:
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn2Text);
                GameMasterMindItemClass.btn2Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1];
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn3Text);
                GameMasterMindItemClass.btn3Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2];
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn4Text);
                GameMasterMindItemClass.btn4Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][3];
                break;
        }
    };
    GameMasterMindLogic.scoreManager = function (num) {
        var score = 30 - num;
        if (GameMasterMindItemClass.QuestionOrder == 9) {
            console.log("double score!");
            return (score * 2);
        }
        else {
            return score;
        }
    };
    return GameMasterMindLogic;
}());
__reflect(GameMasterMindLogic.prototype, "GameMasterMindLogic");
var GameMasterMindMainScene = (function (_super) {
    __extends(GameMasterMindMainScene, _super);
    function GameMasterMindMainScene() {
        var _this = _super.call(this) || this;
        _this.loadingType = 0;
        _this.showHasReport = function () {
            var imgReport = AssetManager.getBitmap("MM_hasReport_png", true, false);
            imgReport.x = 320;
            imgReport.y = 512;
            imgReport.alpha = 0;
            _this.addChild(imgReport);
            var tw = egret.Tween.get(imgReport);
            tw.to({ alpha: 1 }, 200);
            tw.to({ alpha: 1 }, 300);
            tw.to({ alpha: 0 }, 200);
            tw.call(function () {
                App.DisplayUtils.removeFromParent(imgReport);
            });
        };
        /**
         * ready tick
         */
        _this.readyTick = function () {
            if (GameMasterMindItemClass.isOffline == false) {
                console.log("ready state: " + GameMasterMindItemClass.readyState[0], GameMasterMindItemClass.readyState[1]);
                if (GameMasterMindItemClass.readyState[0] == 1 && GameMasterMindItemClass.readyState[1] == 1) {
                    GameMasterMindItemClass.readyState[0] = 0;
                    GameMasterMindItemClass.readyState[1] = 0;
                    egret.stopTick(_this.readyTick, _this);
                    App.TimerManager.doTimer(1000, 1, function () {
                        // App.DisplayUtils.removeFromParent(GameMasterMindItemClass.loadingTips);
                        GameMasterMindItemClass.loadingTips.alpha = 0;
                        _this.switchToReady(function () {
                            App.TimerManager.doTimer(3000, 1, function () {
                                _this.switchToAnswer(function () {
                                    egret.startTick(_this.mainTick, _this);
                                    egret.startTick(_this.answerTick, _this);
                                    egret.startTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
                                    egret.startTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                                });
                            }, _this);
                        });
                    }, _this);
                    return false;
                }
                if (GameMasterMindItemClass.Question.length > 0) {
                    GameMasterMindItemClass.readyState[0] = 1;
                    return false;
                }
            }
            else if (GameMasterMindItemClass.isOffline == true) {
                egret.stopTick(_this.readyTick, _this);
                App.TimerManager.doTimer(2500, 1, function () {
                    // App.DisplayUtils.removeFromParent(GameMasterMindItemClass.loadingTips);
                    GameMasterMindItemClass.loadingTips.alpha = 0;
                    _this.switchToReady(function () {
                        App.TimerManager.doTimer(3000, 1, function () {
                            _this.switchToAnswer(function () {
                                egret.startTick(_this.mainTick, _this);
                                egret.startTick(_this.answerTick, _this);
                                egret.startTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
                                egret.startTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                            });
                        }, _this);
                    });
                }, _this);
            }
            return false;
        };
        /**
         * game message duel
         */
        _this.messageDuel = function (data) {
            if (data.userId == DataCenter.instance.user.id) {
                return;
            }
            var cmdString;
            cmdString = data.event.split("|");
            switch (cmdString[0]) {
                case GameMasterMindEvent.EVENT_GAMEREADY:
                    GameMasterMindItemClass.readyState[1] = 1;
                    break;
                case GameMasterMindEvent.EVENT_ANSWER:
                    egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                    GameMasterMindItemClass.otherChooseIndex = parseInt(cmdString[1]);
                    if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                        GameMasterMindItemClass.otherScore += GameMasterMindLogic.scoreManager(parseInt(cmdString[2]));
                    }
                    egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
                    GameMasterMindItemClass.readyState[1] = 1;
                    GameMasterMindMainScene.showRightTimeUsed(false);
                    break;
                case "sendExpress":
                    _this.addQiPaoCartoon(cmdString[1], 2);
                    break;
            }
        };
        /**
         * game result manager
         */
        _this.resultDuel = function (data) {
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            // 发送游戏结果
            _this.popup("GameResult", null);
        };
        /**
         * loading effect
         */
        _this.loadingEffect = function () {
            var tw = egret.Tween.get(GameMasterMindItemClass.loadingTips);
            GameMasterMindItemClass.loadingTips.alpha = 0;
            GameMasterMindItemClass.loadingTips.text = "正在等待玩家";
            tw.to({ alpha: 1 }, 300);
        };
        /**
         * change game state to answer
         */
        _this.switchToAnswer = function (callback) {
            GameMasterMindItemClass.soundEffect.play("MM_nextEffect_mp3", true);
            GameMasterMindItemClass.loadingTips.alpha = 0;
            GameMasterMindLogic.refresh();
            if (GameMasterMindItemClass.isOffline == true) {
                GameMasterMindLogic.AI();
            }
            var b3 = 0;
            var b4 = 0;
            switch (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"].length) {
                case 3:
                    b3 = 1;
                    break;
                case 4:
                    b3 = 1;
                    b4 = 1;
                    break;
            }
            _this.tweemManager(GameMasterMindItemClass.questionBoard, [320, 397], 300, 1, true, function () {
                GameMasterMindItemClass.reportIcon.alpha = 1;
                GameMasterMindItemClass.reportIcon.touchEnabled = true;
            });
            _this.tweemManager(GameMasterMindItemClass.btn1, [320, 619.5], 300, 1, true);
            _this.tweemManager(GameMasterMindItemClass.btn2, [320, 730.5], 300, 1, true);
            _this.tweemManager(GameMasterMindItemClass.btn3, [320, 842.5], 300, b3, true);
            _this.tweemManager(GameMasterMindItemClass.btn4, [320, 954.5], 300, b4, true, callback);
            _this.tweemManager(GameMasterMindItemClass.questionText, [320, 397], 300, 1);
            _this.tweemManager(GameMasterMindItemClass.spareType, [320, 631], 300, 0);
            _this.tweemManager(GameMasterMindItemClass.littlePurple, [320, 610], 300, 0);
            _this.tweemManager(GameMasterMindItemClass.btn1Text, [320, 619.5], 300, 1);
            _this.tweemManager(GameMasterMindItemClass.btn2Text, [320, 730.5], 300, 1);
            _this.tweemManager(GameMasterMindItemClass.btn3Text, [320, 842.5], 300, b3);
            _this.tweemManager(GameMasterMindItemClass.btn4Text, [320, 954.5], 300, b4);
        };
        /**
         * change game state to ready
         */
        _this.switchToReady = function (callback) {
            GameMasterMindItemClass.littleLeftMark.alpha = 0;
            GameMasterMindItemClass.littleRightMark.alpha = 0;
            GameMasterMindItemClass.reportIcon.alpha = 0;
            GameMasterMindItemClass.reportIcon.touchEnabled = false;
            if (GameMasterMindItemClass.QuestionOrder < 10) {
                GameMasterMindLogic.tableSwitcher();
            }
            else {
                GameMasterMindItemClass.questionText.text = "";
            }
            GameMasterMindItemClass.turnsText.alpha = 1;
            GameMasterMindItemClass.turnsText.text = (GameMasterMindItemClass.QuestionOrder + 1).toString() + "/10";
            GameMasterMindItemClass.youTime = 0;
            GameMasterMindItemClass.otherTime = 0;
            GameMasterMindItemClass.youMark.alpha = 0;
            GameMasterMindItemClass.otherMark.alpha = 0;
            GameMasterMindItemClass.chooseIndex = -1;
            GameMasterMindItemClass.otherChooseIndex = -1;
            GameMasterMindItemClass.readyState = [0, 0];
            GameMasterMindItemClass.btn1Text.textColor = 0x4c407b;
            GameMasterMindItemClass.btn2Text.textColor = 0x4c407b;
            GameMasterMindItemClass.btn3Text.textColor = 0x4c407b;
            GameMasterMindItemClass.btn4Text.textColor = 0x4c407b;
            GameMasterMindItemClass.youScoreText.text = GameMasterMindItemClass.youScore.toString();
            GameMasterMindItemClass.youScoreText.scaleX = 3;
            GameMasterMindItemClass.youScoreText.scaleY = 3;
            var tw = egret.Tween.get(GameMasterMindItemClass.youScoreText);
            tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1500, egret.Ease.elasticInOut);
            tw.call(function () {
                tw = null;
            });
            GameMasterMindItemClass.otherScoreText.scaleX = 3;
            GameMasterMindItemClass.otherScoreText.scaleY = 3;
            GameMasterMindItemClass.otherScoreText.text = GameMasterMindItemClass.otherScore.toString();
            var _tw = egret.Tween.get(GameMasterMindItemClass.otherScoreText);
            _tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1500, egret.Ease.elasticInOut);
            _tw.call(function () {
                _tw = null;
            });
            if (GameMasterMindItemClass.QuestionOrder <= 8 && GameMasterMindItemClass.QuestionOrder > 0) {
                GameMasterMindItemClass.questionText.text = "第" + GameMasterMindLogic.numToFont() + "题";
            }
            else if (GameMasterMindItemClass.QuestionOrder == 9) {
                GameMasterMindItemClass.questionText.text = "最后一题";
            }
            else if (GameMasterMindItemClass.QuestionOrder == 0) {
                GameMasterMindItemClass.questionText.text = "开始答题";
            }
            GameMasterMindItemClass.btn1.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;
            GameMasterMindItemClass.btn2.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;
            GameMasterMindItemClass.btn3.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;
            GameMasterMindItemClass.btn4.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;
            GameMasterMindItemClass.questionBoard.touchEnabled = false;
            GameMasterMindItemClass.btn1.touchEnabled = false;
            GameMasterMindItemClass.btn2.touchEnabled = false;
            GameMasterMindItemClass.btn3.touchEnabled = false;
            GameMasterMindItemClass.btn4.touchEnabled = false;
            _this.tweemManager(GameMasterMindItemClass.questionBoard, [320, 580], 300);
            _this.tweemManager(GameMasterMindItemClass.btn1, [320, 580], 300);
            _this.tweemManager(GameMasterMindItemClass.btn2, [320, 580], 300);
            _this.tweemManager(GameMasterMindItemClass.btn3, [320, 580], 300);
            _this.tweemManager(GameMasterMindItemClass.btn4, [320, 580], 300);
            _this.tweemManager(GameMasterMindItemClass.questionText, [320, 580], 300, 1);
            if (GameMasterMindItemClass.QuestionOrder <= 9) {
                _this.tweemManager(GameMasterMindItemClass.spareType, [320, 631], 300, 1);
                _this.tweemManager(GameMasterMindItemClass.littlePurple, [320, 610], 300, 1);
            }
            _this.tweemManager(GameMasterMindItemClass.btn1Text, [320, 580], 300, 0);
            _this.tweemManager(GameMasterMindItemClass.btn2Text, [320, 580], 300, 0);
            _this.tweemManager(GameMasterMindItemClass.btn3Text, [320, 580], 300, 0);
            _this.tweemManager(GameMasterMindItemClass.btn4Text, [320, 580], 300, 0, false, function () {
                if (GameMasterMindItemClass.QuestionOrder == 9) {
                    var doubleText_1 = AssetManager.getBitmap("MM_double_png", false, false);
                    doubleText_1.x = 378;
                    doubleText_1.y = 518;
                    doubleText_1.anchorOffsetX = 64;
                    doubleText_1.anchorOffsetY = 10;
                    doubleText_1.alpha = 0;
                    _this.addChild(doubleText_1);
                    var tw_1 = egret.Tween.get(doubleText_1);
                    tw_1.to({ alpha: 1 }, 200);
                    tw_1.to({ alpha: 1 }, 1000);
                    tw_1.to({ alpha: 0 }, 200);
                    tw_1.call(function () {
                        App.DisplayUtils.removeFromParent(doubleText_1);
                    });
                }
                if (callback) {
                    callback();
                }
            });
        };
        /**
         * Tween manager
         */
        _this.tweemManager = function (item, postion, time, alpha, touchEnabled, callback) {
            if (alpha === void 0) { alpha = 1; }
            if (touchEnabled === void 0) { touchEnabled = false; }
            var tw = egret.Tween.get(item);
            tw.to({ x: postion[0], y: postion[1], alpha: alpha }, time, egret.Ease.elasticInOut);
            tw.call(function () {
                item.touchEnabled = touchEnabled;
                if (callback) {
                    callback();
                }
            });
        };
        _this.animationManager = function (type) {
            switch (type) {
                case "start":
                    GameMasterMindItemClass.fireLineLeftMask.scaleY = 1;
                    GameMasterMindItemClass.fireLineMask.scaleY = 1;
                    egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
                    egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
                    var tw = egret.Tween.get(GameMasterMindItemClass.fireLineLeft);
                    tw.to({ scaleY: 0 }, 15000);
                    var _tw = egret.Tween.get(GameMasterMindItemClass.fireLine);
                    _tw.to({ scaleY: 0 }, 15000);
                    GameMasterMindItemClass.countdownText.text = "16";
                    GameMasterMindItemClass.countdownText.alpha = 1;
                    break;
                case "end":
                    _this.judge();
                    App.TimerManager.doTimer(3000, 1, function () {
                        if (GameMasterMindItemClass.QuestionOrder <= 9) {
                            _this.switchToReady(function () {
                                App.TimerManager.doTimer(1500, 1, function () {
                                    GameMasterMindMainScene.showLeftTimeUsed(true);
                                    GameMasterMindMainScene.showRightTimeUsed(true);
                                    if (GameMasterMindItemClass.youComboState == true) {
                                        var _youComboTW_1 = egret.Tween.get(GameMasterMindItemClass.leftCombo);
                                        _youComboTW_1.to({ x: -157 }, 300);
                                        _youComboTW_1.call(function () {
                                            _youComboTW_1 = null;
                                        });
                                        var youComboTextTW_1 = egret.Tween.get(GameMasterMindItemClass.youComboText);
                                        youComboTextTW_1.to({ x: -42, alpha: 0 }, 300);
                                        youComboTextTW_1.call(function () {
                                            GameMasterMindItemClass.youComboState = false;
                                            youComboTextTW_1 = null;
                                        });
                                    }
                                    if (GameMasterMindItemClass.otherComboState == true) {
                                        var _otherComboTW_1 = egret.Tween.get(GameMasterMindItemClass.rightCombo);
                                        _otherComboTW_1.to({ x: 640 }, 300);
                                        _otherComboTW_1.call(function () {
                                            _otherComboTW_1 = null;
                                        });
                                        var otherComboTextTW_1 = egret.Tween.get(GameMasterMindItemClass.otherComboText);
                                        otherComboTextTW_1.to({ x: 772, alpha: 0 }, 300);
                                        otherComboTextTW_1.call(function () {
                                            GameMasterMindItemClass.otherComboState = false;
                                            otherComboTextTW_1 = null;
                                        });
                                    }
                                    _this.switchToAnswer(function () {
                                        GameMasterMindItemClass.answerMask.touchEnabled = false;
                                        GameMasterMindMainScene.runningSec = 0;
                                        egret.startTick(_this.mainTick, _this);
                                        egret.startTick(_this.answerTick, _this);
                                        egret.startTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
                                        egret.startTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                                    });
                                }, _this);
                            });
                        }
                        else {
                            console.log("it's game over!");
                            _this.switchToReady(function () {
                                GameMasterMindMainScene.showLeftTimeUsed(true);
                                GameMasterMindMainScene.showRightTimeUsed(true);
                                var resultArray = ["resultText", "dot", "leftScoreResult", "rightScoreResult"];
                                if (GameMasterMindItemClass.youScore >= GameMasterMindItemClass.otherScore) {
                                    console.log("你赢了!");
                                    _this.getChildByName("resultText").texture = AssetManager.getBitmap("MM_win_png", true, true).texture;
                                    _this.getChildByName("leftScoreResult").texture = AssetManager.getBitmap("MM_winBG_png", true, true).texture;
                                    _this.getChildByName("rightScoreResult").texture = AssetManager.getBitmap("MM_loseBG_png", true, true).texture;
                                }
                                else {
                                    console.log("你输了!");
                                    _this.getChildByName("resultText").texture = AssetManager.getBitmap("MM_lose_png", true, true).texture;
                                    _this.getChildByName("leftScoreResult").texture = AssetManager.getBitmap("MM_loseBG_png", true, true).texture;
                                    _this.getChildByName("rightScoreResult").texture = AssetManager.getBitmap("MM_winBG_png", true, true).texture;
                                }
                                resultArray.forEach(function (element) {
                                    var tw = egret.Tween.get(_this.getChildByName(element));
                                    tw.to({ alpha: 1, scaleY: 1, scaleX: 1 }, 1000, egret.Ease.elasticInOut);
                                });
                                _this.setChildIndex(GameMasterMindItemClass.youScoreText, _this.numChildren + 1);
                                _this.setChildIndex(GameMasterMindItemClass.otherScoreText, _this.numChildren + 2);
                                var tw = egret.Tween.get(GameMasterMindItemClass.youScoreText);
                                tw.to({ x: 180, y: 618, scaleY: 1.5, scaleX: 1.5 }, 1000, egret.Ease.elasticInOut);
                                var _tw = egret.Tween.get(GameMasterMindItemClass.otherScoreText);
                                _tw.to({ x: 460, y: 618, scaleY: 1.5, scaleX: 1.5 }, 1000, egret.Ease.elasticInOut);
                            });
                            App.TimerManager.doTimer(1300, 1, function () {
                                if (GameMasterMindItemClass.youScore >= GameMasterMindItemClass.otherScore) {
                                    GameMasterMindLogic.gameOver(3);
                                }
                                else {
                                    GameMasterMindLogic.gameOver(1);
                                }
                            }, _this);
                        }
                    }, _this);
                    GameMasterMindItemClass.QuestionOrder += 1;
                    break;
            }
        };
        _this.symbolPosManager = function (who, where, what) {
            if (where == -1) {
                return;
            }
            var pos = [0, 0];
            switch (where) {
                case 0:
                    pos[1] = 615.5;
                    break;
                case 1:
                    pos[1] = 726.5;
                    break;
                case 2:
                    pos[1] = 837.5;
                    break;
                case 3:
                    pos[1] = 951.5;
                    break;
            }
            switch (who) {
                case 0:
                    pos[0] = 95.5;
                    GameMasterMindItemClass.youMark.alpha = 1;
                    switch (what) {
                        case true:
                            GameMasterMindItemClass.youMark.texture = AssetManager.getBitmap("MM_Right_png", true, true).texture;
                            break;
                        case false:
                            GameMasterMindItemClass.youMark.texture = AssetManager.getBitmap("MM_Wrong_png", true, true).texture;
                            break;
                    }
                    GameMasterMindItemClass.youMark.x = pos[0];
                    GameMasterMindItemClass.youMark.y = pos[1];
                    GameMasterMindItemClass.youMark.scaleX = 0.2;
                    GameMasterMindItemClass.youMark.scaleY = 0.2;
                    var tw_2 = egret.Tween.get(GameMasterMindItemClass.youMark);
                    tw_2.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.elasticInOut);
                    tw_2.call(function () {
                        tw_2 = null;
                    });
                    break;
                case 1:
                    pos[0] = 543.5;
                    switch (what) {
                        case true:
                            GameMasterMindItemClass.otherMark.texture = AssetManager.getBitmap("MM_Right_png", true, true).texture;
                            break;
                        case false:
                            GameMasterMindItemClass.otherMark.texture = AssetManager.getBitmap("MM_Wrong_png", true, true).texture;
                            break;
                    }
                    GameMasterMindItemClass.otherMark.x = pos[0];
                    GameMasterMindItemClass.otherMark.y = pos[1];
                    GameMasterMindItemClass.otherMark.scaleX = 0.2;
                    GameMasterMindItemClass.otherMark.scaleY = 0.2;
                    var _tw_1 = egret.Tween.get(GameMasterMindItemClass.otherMark);
                    _tw_1.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.elasticInOut);
                    _tw_1.call(function () {
                        _tw_1 = null;
                    });
                    break;
            }
        };
        _this.judge = function () {
            var youScoreText = new egret.TextField;
            youScoreText.width = 200;
            youScoreText.height = 40;
            youScoreText.anchorOffsetX = 100;
            youScoreText.anchorOffsetY = 20;
            youScoreText.alpha = 0;
            youScoreText.fontFamily = "Arial";
            youScoreText.x = 216;
            youScoreText.y = 275;
            youScoreText.size = 50;
            youScoreText.textAlign = egret.HorizontalAlign.CENTER;
            youScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
            if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                youScoreText.text = "+ " + GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text)).toString();
                youScoreText.textColor = 0x33cc00;
            }
            else {
                youScoreText.text = "+ 0";
                youScoreText.textColor = 0xff0000;
            }
            _this.addChild(youScoreText);
            var youScoreTextTw = egret.Tween.get(youScoreText);
            youScoreTextTw.to({ alpha: 1 }, 300);
            youScoreTextTw.to({ alpha: 1 }, 1900);
            youScoreTextTw.to({ y: 225, scaleX: 0, scaleY: 0, alpha: 0 }, 500);
            youScoreTextTw.call(function () {
                youScoreTextTw = null;
                App.DisplayUtils.removeFromParent(youScoreText);
                var tw = egret.Tween.get(GameMasterMindItemClass.fireLine);
                tw.to({ scaleY: 1 }, 700);
                var _tw = egret.Tween.get(GameMasterMindItemClass.fireLineLeft);
                _tw.to({ scaleY: 1 }, 700);
            });
            var otherScoreText = new egret.TextField;
            otherScoreText.width = 200;
            otherScoreText.height = 40;
            otherScoreText.anchorOffsetX = 100;
            otherScoreText.anchorOffsetY = 20;
            otherScoreText.alpha = 0;
            otherScoreText.fontFamily = "Arial";
            otherScoreText.x = 424;
            otherScoreText.y = 275;
            otherScoreText.size = 50;
            otherScoreText.textAlign = egret.HorizontalAlign.CENTER;
            otherScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
            if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                otherScoreText.text = "+ " + GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.otherTimeText.text)).toString();
                otherScoreText.textColor = 0x33cc00;
            }
            else {
                otherScoreText.text = "+ 0";
                otherScoreText.textColor = 0xff0000;
            }
            _this.addChild(otherScoreText);
            var otherScoreTextTw = egret.Tween.get(otherScoreText);
            otherScoreTextTw.to({ alpha: 1 }, 300);
            otherScoreTextTw.to({ alpha: 1 }, 1900);
            otherScoreTextTw.to({ y: 225, scaleX: 0, scaleY: 0, alpha: 0 }, 500);
            otherScoreTextTw.call(function () {
                youScoreTextTw = null;
                App.DisplayUtils.removeFromParent(otherScoreText);
            });
            egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
            egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
            egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
            egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
            var goGreen = GameMasterMindItemClass.correctAnswerIndex;
            switch (goGreen) {
                case 0:
                    GameMasterMindItemClass.btn1.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                    GameMasterMindItemClass.btn1Text.textColor = 0xffffff;
                    break;
                case 1:
                    GameMasterMindItemClass.btn2.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                    GameMasterMindItemClass.btn2Text.textColor = 0xffffff;
                    break;
                case 2:
                    GameMasterMindItemClass.btn3.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                    GameMasterMindItemClass.btn3Text.textColor = 0xffffff;
                    break;
                case 3:
                    GameMasterMindItemClass.btn4.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                    GameMasterMindItemClass.btn4Text.textColor = 0xffffff;
                    break;
            }
            if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                _this.symbolPosManager(0, GameMasterMindItemClass.chooseIndex, true);
                GameMasterMindItemClass.littleLeftMark.alpha = 1;
                GameMasterMindItemClass.littleLeftMark.texture = AssetManager.getBitmap("MM_littleRight_png", true, true).texture;
                GameMasterMindItemClass.soundEffect.play("MM_rightEffect_mp3", true);
                GameMasterMindItemClass.youRole.armature.play("winl", 1);
                GameMasterMindItemClass.youCombo += 1;
            }
            else {
                _this.symbolPosManager(0, GameMasterMindItemClass.chooseIndex, false);
                GameMasterMindItemClass.littleLeftMark.alpha = 1;
                GameMasterMindItemClass.littleLeftMark.texture = AssetManager.getBitmap("MM_littleWrong_png", true, true).texture;
                if (GameMasterMindItemClass.chooseIndex != -1) {
                    _this.getChildByName("btn" + (GameMasterMindItemClass.chooseIndex + 1).toString()).texture = AssetManager.getBitmap("MM_BtnRed_png", true, true).texture;
                    _this.getChildByName("btn" + (GameMasterMindItemClass.chooseIndex + 1).toString() + "Text").textColor = 0xffffff;
                }
                GameMasterMindItemClass.soundEffect.play("MM_wrongEffect_mp3", true);
                GameMasterMindItemClass.youRole.armature.play("beizha", 1);
                GameMasterMindItemClass.youCombo = 0;
            }
            if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                _this.symbolPosManager(1, GameMasterMindItemClass.otherChooseIndex, true);
                GameMasterMindItemClass.littleRightMark.alpha = 1;
                GameMasterMindItemClass.littleRightMark.texture = AssetManager.getBitmap("MM_littleRight_png", true, true).texture;
                GameMasterMindItemClass.otherRole.armature.play("winl", 1);
                GameMasterMindItemClass.otherCombo += 1;
            }
            else {
                _this.symbolPosManager(1, GameMasterMindItemClass.otherChooseIndex, false);
                GameMasterMindItemClass.littleRightMark.alpha = 1;
                GameMasterMindItemClass.littleRightMark.texture = AssetManager.getBitmap("MM_littleWrong_png", true, true).texture;
                if (GameMasterMindItemClass.otherChooseIndex != -1) {
                    _this.getChildByName("btn" + (GameMasterMindItemClass.otherChooseIndex + 1).toString()).texture = AssetManager.getBitmap("MM_BtnRed_png", true, true).texture;
                    _this.getChildByName("btn" + (GameMasterMindItemClass.otherChooseIndex + 1).toString() + "Text").textColor = 0xffffff;
                }
                GameMasterMindItemClass.otherRole.armature.play("beizha", 1);
                GameMasterMindItemClass.otherCombo = 0;
            }
            console.log("Combo : " + [GameMasterMindItemClass.youCombo, GameMasterMindItemClass.otherCombo]);
            if (GameMasterMindItemClass.youCombo > 1) {
                GameMasterMindItemClass.youComboText.text = GameMasterMindItemClass.youCombo.toString();
                var youComboTW_1 = egret.Tween.get(GameMasterMindItemClass.leftCombo);
                youComboTW_1.to({ x: 0 }, 300);
                youComboTW_1.call(function () {
                    youComboTW_1 = null;
                });
                var youComboTextTW_2 = egret.Tween.get(GameMasterMindItemClass.youComboText);
                youComboTextTW_2.to({ x: 115, alpha: 1 }, 300);
                youComboTextTW_2.call(function () {
                    GameMasterMindItemClass.youComboState = true;
                    youComboTextTW_2 = null;
                });
            }
            if (GameMasterMindItemClass.otherCombo > 1) {
                GameMasterMindItemClass.otherComboText.text = GameMasterMindItemClass.otherCombo.toString();
                var otherComboTW_1 = egret.Tween.get(GameMasterMindItemClass.rightCombo);
                otherComboTW_1.to({ x: 483 }, 300);
                otherComboTW_1.call(function () {
                    otherComboTW_1 = null;
                });
                var otherComboTextTW_2 = egret.Tween.get(GameMasterMindItemClass.otherComboText);
                otherComboTextTW_2.to({ x: 615, alpha: 1 }, 300);
                otherComboTextTW_2.call(function () {
                    GameMasterMindItemClass.otherComboState = true;
                    otherComboTextTW_2 = null;
                });
            }
        };
        _this.mainTick = function () {
            if (GameMasterMindMainScene.runningSec == 0) {
                _this.animationManager("start");
            }
            if (GameMasterMindMainScene.runningSec % 60 == 0) {
                GameMasterMindItemClass.countdownText.text = (parseInt(GameMasterMindItemClass.countdownText.text) - 1).toString();
            }
            if (GameMasterMindMainScene.runningSec == 900) {
                egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
                egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
                egret.stopTick(_this.mainTick, _this);
                GameMasterMindMainScene.runningSec = 0;
                _this.animationManager("end");
                return;
            }
            GameMasterMindMainScene.runningSec += 1;
            return true;
        };
        _this.answerTick = function () {
            if (GameMasterMindItemClass.readyState[0] == 1 && GameMasterMindItemClass.readyState[1] == 1) {
                GameMasterMindItemClass.readyState[0] = 0;
                GameMasterMindItemClass.readyState[1] = 0;
                egret.stopTick(_this.mainTick, _this);
                egret.stopTick(_this.answerTick, _this);
                egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
                egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
                egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
                GameMasterMindItemClass.fireLineLeftMask.scaleY = 1;
                GameMasterMindItemClass.fireLineMask.scaleY = 1;
                _this.animationManager("end");
            }
            return false;
        };
        _this.getSType = function (who) {
            var SexIcon = 0;
            var getIcon = function (sexType) {
                switch (sexType) {
                    case 1:
                        SexIcon = 1;
                        break;
                    case 2:
                        SexIcon = 2;
                        break;
                }
            };
            switch (who) {
                case 0:
                    getIcon(DataCenter.instance.user.sex);
                    break;
                case 1:
                    getIcon(DataCenter.instance.room.player.sex);
                    break;
            }
            switch (SexIcon) {
                case 1:
                    return AssetManager.getBitmap("img_boy_png", false, false);
                case 2:
                    return AssetManager.getBitmap("img_gril_png", false, false);
            }
        };
        _this.showPersonalInformation = function () {
            // 打开玩家信息页
            _this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.user });
        };
        _this.showOtherPersonalInformation = function () {
            // 打开玩家信息页
            _this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.room.player });
        };
        _this.showGreeting = function () {
            App.GameExpressType = 2;
            _this.popup("GameExpress");
        };
        _this.report = function () {
            _this.getChildByName("reportIcon").alpha = 0;
            GameMasterMindItemClass.reportIcon.touchEnabled = false;
            App.MessageCenter.dispatch(EventMessage.AddErrQuestionC2S, GameMasterMindItemClass.questionText.text, function () {
                console.log("HAS REPORT!");
                _this.showHasReport();
            });
        };
        _this.gameInit = function () {
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, _this.messageDuel, _this);
            App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, _this.resultDuel, _this);
            App.MessageCenter.addListener(EventMessage.GameSendExpress, _this.addQiPaoCartoon, _this);
            GameMasterMindItemClass.backGround = AssetManager.getBitmap("MM_backGround_png", false, false);
            GameMasterMindItemClass.backGround.x = 0;
            GameMasterMindItemClass.backGround.y = 0;
            _this.addChild(GameMasterMindItemClass.backGround);
            GameMasterMindItemClass.btn1 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
            GameMasterMindItemClass.btn1.x = 320;
            GameMasterMindItemClass.btn1.y = 580;
            GameMasterMindItemClass.btn1.name = "btn1";
            GameMasterMindItemClass.btn1.addEventListener("touchTap", GameMasterMindLogic.btn1Press, _this);
            _this.addChild(GameMasterMindItemClass.btn1);
            GameMasterMindItemClass.btn1Text = new egret.TextField();
            GameMasterMindItemClass.btn1Text.width = 520;
            GameMasterMindItemClass.btn1Text.height = 36;
            GameMasterMindItemClass.btn1Text.anchorOffsetX = 260;
            GameMasterMindItemClass.btn1Text.anchorOffsetY = 18;
            GameMasterMindItemClass.btn1Text.fontFamily = "Arial";
            GameMasterMindItemClass.btn1Text.textColor = 0x4c407b;
            GameMasterMindItemClass.btn1Text.size = 36;
            GameMasterMindItemClass.btn1Text.x = 320;
            GameMasterMindItemClass.btn1Text.y = 580;
            GameMasterMindItemClass.btn1Text.alpha = 0;
            GameMasterMindItemClass.btn1Text.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.btn1Text.verticalAlign = egret.VerticalAlign.MIDDLE;
            GameMasterMindItemClass.btn1Text.name = "btn1Text";
            _this.addChild(GameMasterMindItemClass.btn1Text);
            GameMasterMindItemClass.btn2 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
            GameMasterMindItemClass.btn2.x = 320;
            GameMasterMindItemClass.btn2.y = 580;
            GameMasterMindItemClass.btn2.name = "btn2";
            GameMasterMindItemClass.btn2.addEventListener("touchTap", GameMasterMindLogic.btn2Press, _this);
            _this.addChild(GameMasterMindItemClass.btn2);
            GameMasterMindItemClass.btn2Text = new egret.TextField();
            GameMasterMindItemClass.btn2Text.width = 520;
            GameMasterMindItemClass.btn2Text.height = 36;
            GameMasterMindItemClass.btn2Text.anchorOffsetX = 260;
            GameMasterMindItemClass.btn2Text.anchorOffsetY = 18;
            GameMasterMindItemClass.btn2Text.fontFamily = "Arial";
            GameMasterMindItemClass.btn2Text.textColor = 0x4c407b;
            GameMasterMindItemClass.btn2Text.size = 36;
            GameMasterMindItemClass.btn2Text.x = 320;
            GameMasterMindItemClass.btn2Text.y = 580;
            GameMasterMindItemClass.btn2Text.alpha = 0;
            GameMasterMindItemClass.btn2Text.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.btn2Text.verticalAlign = egret.VerticalAlign.MIDDLE;
            GameMasterMindItemClass.btn2Text.name = "btn2Text";
            _this.addChild(GameMasterMindItemClass.btn2Text);
            GameMasterMindItemClass.btn3 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
            GameMasterMindItemClass.btn3.x = 320;
            GameMasterMindItemClass.btn3.y = 580;
            GameMasterMindItemClass.btn3.name = "btn3";
            GameMasterMindItemClass.btn3.addEventListener("touchTap", GameMasterMindLogic.btn3Press, _this);
            _this.addChild(GameMasterMindItemClass.btn3);
            GameMasterMindItemClass.btn3Text = new egret.TextField();
            GameMasterMindItemClass.btn3Text.width = 520;
            GameMasterMindItemClass.btn3Text.height = 36;
            GameMasterMindItemClass.btn3Text.anchorOffsetX = 260;
            GameMasterMindItemClass.btn3Text.anchorOffsetY = 18;
            GameMasterMindItemClass.btn3Text.fontFamily = "Arial";
            GameMasterMindItemClass.btn3Text.textColor = 0x4c407b;
            GameMasterMindItemClass.btn3Text.size = 36;
            GameMasterMindItemClass.btn3Text.x = 320;
            GameMasterMindItemClass.btn3Text.y = 580;
            GameMasterMindItemClass.btn3Text.alpha = 0;
            GameMasterMindItemClass.btn3Text.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.btn3Text.verticalAlign = egret.VerticalAlign.MIDDLE;
            GameMasterMindItemClass.btn3Text.name = "btn3Text";
            _this.addChild(GameMasterMindItemClass.btn3Text);
            GameMasterMindItemClass.btn4 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
            GameMasterMindItemClass.btn4.x = 320;
            GameMasterMindItemClass.btn4.y = 580;
            GameMasterMindItemClass.btn4.name = "btn4";
            GameMasterMindItemClass.btn4.addEventListener("touchTap", GameMasterMindLogic.btn4Press, _this);
            _this.addChild(GameMasterMindItemClass.btn4);
            GameMasterMindItemClass.btn4Text = new egret.TextField();
            GameMasterMindItemClass.btn4Text.width = 520;
            GameMasterMindItemClass.btn4Text.height = 36;
            GameMasterMindItemClass.btn4Text.anchorOffsetX = 260;
            GameMasterMindItemClass.btn4Text.anchorOffsetY = 18;
            GameMasterMindItemClass.btn4Text.fontFamily = "Arial";
            GameMasterMindItemClass.btn4Text.textColor = 0x4c407b;
            GameMasterMindItemClass.btn4Text.size = 36;
            GameMasterMindItemClass.btn4Text.x = 320;
            GameMasterMindItemClass.btn4Text.y = 580;
            GameMasterMindItemClass.btn4Text.alpha = 0;
            GameMasterMindItemClass.btn4Text.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.btn4Text.verticalAlign = egret.VerticalAlign.MIDDLE;
            GameMasterMindItemClass.btn4Text.name = "btn4Text";
            _this.addChild(GameMasterMindItemClass.btn4Text);
            GameMasterMindItemClass.questionBoard = AssetManager.getBitmap("MM_questionBoard_png", true, true);
            GameMasterMindItemClass.questionBoard.x = 320;
            GameMasterMindItemClass.questionBoard.y = 580;
            _this.addChild(GameMasterMindItemClass.questionBoard);
            GameMasterMindItemClass.questionText = new egret.TextField();
            GameMasterMindItemClass.questionText.width = 510;
            GameMasterMindItemClass.questionText.height = 279;
            GameMasterMindItemClass.questionText.anchorOffsetX = 255;
            GameMasterMindItemClass.questionText.anchorOffsetY = 139.5;
            GameMasterMindItemClass.questionText.fontFamily = "Arial";
            GameMasterMindItemClass.questionText.textColor = 0x4c407b;
            GameMasterMindItemClass.questionText.size = 36;
            GameMasterMindItemClass.questionText.lineSpacing = 22;
            GameMasterMindItemClass.questionText.x = 320;
            GameMasterMindItemClass.questionText.y = 580;
            GameMasterMindItemClass.questionText.alpha = 0;
            GameMasterMindItemClass.questionText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.questionText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.questionText);
            GameMasterMindItemClass.scoreBoard = AssetManager.getBitmap("MM_scoreBoard_png", true, true);
            GameMasterMindItemClass.scoreBoard.x = 320;
            GameMasterMindItemClass.scoreBoard.y = 223;
            _this.addChild(GameMasterMindItemClass.scoreBoard);
            GameMasterMindItemClass.clock = AssetManager.getBitmap("MM_Clock_png", true, true);
            GameMasterMindItemClass.clock.x = 320;
            GameMasterMindItemClass.clock.y = 223;
            _this.addChild(GameMasterMindItemClass.clock);
            GameMasterMindItemClass.countdownText = new egret.TextField();
            GameMasterMindItemClass.countdownText.height = 40;
            GameMasterMindItemClass.countdownText.width = 82;
            GameMasterMindItemClass.countdownText.size = 40;
            GameMasterMindItemClass.countdownText.fontFamily = "Arial";
            GameMasterMindItemClass.countdownText.anchorOffsetX = 41;
            GameMasterMindItemClass.countdownText.anchorOffsetY = 20;
            GameMasterMindItemClass.countdownText.textColor = 0x4c3a57;
            GameMasterMindItemClass.countdownText.alpha = 0;
            GameMasterMindItemClass.countdownText.bold = true;
            GameMasterMindItemClass.countdownText.x = 320;
            GameMasterMindItemClass.countdownText.y = 227;
            GameMasterMindItemClass.countdownText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.countdownText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.countdownText);
            var playData = DataCenter.instance.room.player;
            GameMasterMindItemClass.otherRole = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "dbxiaoren00_game8");
            GameMasterMindItemClass.otherRole.armature.x = 420;
            GameMasterMindItemClass.otherRole.armature.y = 180;
            GameMasterMindItemClass.otherRole.armature.scaleX = 0.8;
            GameMasterMindItemClass.otherRole.armature.scaleY = 0.8;
            GameMasterMindItemClass.otherRole.armature.play("zhengchang", 0);
            _this.addChild(GameMasterMindItemClass.otherRole.armature);
            GameMasterMindItemClass.otherRole.armature.touchEnabled = true;
            GameMasterMindItemClass.otherRole.armature.addEventListener("touchTap", _this.showOtherPersonalInformation, _this);
            var myData = DataCenter.instance.user;
            GameMasterMindItemClass.youRole = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "dbxiaoren00_game8");
            GameMasterMindItemClass.youRole.armature.x = 212;
            GameMasterMindItemClass.youRole.armature.y = 180;
            GameMasterMindItemClass.youRole.armature.scaleX = 0.8;
            GameMasterMindItemClass.youRole.armature.scaleY = 0.8;
            GameMasterMindItemClass.youRole.armature.play("zhengchang", 0);
            _this.addChild(GameMasterMindItemClass.youRole.armature);
            GameMasterMindItemClass.youRole.armature.touchEnabled = true;
            GameMasterMindItemClass.youRole.armature.addEventListener("touchTap", _this.showPersonalInformation, _this);
            GameMasterMindItemClass.fireLineLeftMask = AssetManager.getBitmap("MM_timeLineBlack_png", false, false);
            GameMasterMindItemClass.fireLineLeftMask.x = 25;
            GameMasterMindItemClass.fireLineLeftMask.y = 246;
            _this.addChild(GameMasterMindItemClass.fireLineLeftMask);
            GameMasterMindItemClass.fireLineLeft = AssetManager.getBitmap("MM_timeLineOrange_png", false, false);
            GameMasterMindItemClass.fireLineLeft.x = 25;
            GameMasterMindItemClass.fireLineLeft.y = 246;
            _this.addChild(GameMasterMindItemClass.fireLineLeft);
            GameMasterMindItemClass.fireLineMask = AssetManager.getBitmap("MM_timeLineBlack_png", false, false);
            GameMasterMindItemClass.fireLineMask.x = 600;
            GameMasterMindItemClass.fireLineMask.y = 246;
            _this.addChild(GameMasterMindItemClass.fireLineMask);
            GameMasterMindItemClass.fireLine = AssetManager.getBitmap("MM_timeLineOrange_png", false, false);
            GameMasterMindItemClass.fireLine.x = 600;
            GameMasterMindItemClass.fireLine.y = 246;
            _this.addChild(GameMasterMindItemClass.fireLine);
            GameMasterMindItemClass.greetNormalBtn = AssetManager.getBitmap("MM_greet_png", true, false);
            GameMasterMindItemClass.greetNormalBtn.x = 320;
            GameMasterMindItemClass.greetNormalBtn.y = 1035;
            GameMasterMindItemClass.greetNormalBtn.touchEnabled = true;
            GameMasterMindItemClass.greetNormalBtn.addEventListener("touchTap", _this.showGreeting, _this);
            _this.addChild(GameMasterMindItemClass.greetNormalBtn);
            GameMasterMindItemClass.loadingTips = new egret.TextField();
            GameMasterMindItemClass.loadingTips.name = "loadingTips";
            GameMasterMindItemClass.loadingTips.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.loadingTips.size = 50;
            GameMasterMindItemClass.loadingTips.fontFamily = "Arial";
            GameMasterMindItemClass.loadingTips.textColor = 0x4c407b;
            GameMasterMindItemClass.loadingTips.width = 500;
            GameMasterMindItemClass.loadingTips.height = 50;
            GameMasterMindItemClass.loadingTips.anchorOffsetX = 250;
            GameMasterMindItemClass.loadingTips.anchorOffsetY = 25;
            GameMasterMindItemClass.loadingTips.x = 320;
            GameMasterMindItemClass.loadingTips.y = 580;
            _this.addChild(GameMasterMindItemClass.loadingTips);
            GameMasterMindItemClass.youMark = AssetManager.getBitmap("MM_Right_png", true, true);
            GameMasterMindItemClass.youMark.width = 100;
            GameMasterMindItemClass.youMark.height = 100;
            GameMasterMindItemClass.youMark.x = 333;
            GameMasterMindItemClass.youMark.y = 333;
            GameMasterMindItemClass.youMark.alpha = 0;
            _this.addChild(GameMasterMindItemClass.youMark);
            GameMasterMindItemClass.otherMark = AssetManager.getBitmap("MM_Right_png", true, true);
            GameMasterMindItemClass.otherMark.width = 100;
            GameMasterMindItemClass.otherMark.height = 100;
            GameMasterMindItemClass.otherMark.x = 333;
            GameMasterMindItemClass.otherMark.y = 333;
            GameMasterMindItemClass.otherMark.alpha = 0;
            _this.addChild(GameMasterMindItemClass.otherMark);
            GameMasterMindItemClass.typeStr = new egret.TextField();
            GameMasterMindItemClass.typeStr.width = 110;
            GameMasterMindItemClass.typeStr.height = 30;
            GameMasterMindItemClass.typeStr.anchorOffsetX = 55;
            GameMasterMindItemClass.typeStr.anchorOffsetY = 15;
            GameMasterMindItemClass.typeStr.textColor = 0xffffff;
            GameMasterMindItemClass.typeStr.alpha = 0;
            GameMasterMindItemClass.typeStr.fontFamily = "Arial";
            GameMasterMindItemClass.typeStr.x = 86;
            GameMasterMindItemClass.typeStr.y = 1048;
            GameMasterMindItemClass.typeStr.bold = true;
            GameMasterMindItemClass.typeStr.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.typeStr.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.typeStr);
            GameMasterMindItemClass.turnsText = new egret.TextField();
            GameMasterMindItemClass.turnsText.width = 110;
            GameMasterMindItemClass.turnsText.height = 30;
            GameMasterMindItemClass.turnsText.anchorOffsetX = 55;
            GameMasterMindItemClass.turnsText.anchorOffsetY = 15;
            GameMasterMindItemClass.turnsText.textColor = 0xffffff;
            GameMasterMindItemClass.turnsText.alpha = 0;
            GameMasterMindItemClass.turnsText.fontFamily = "Arial";
            GameMasterMindItemClass.turnsText.x = 565;
            GameMasterMindItemClass.turnsText.y = 1048;
            GameMasterMindItemClass.turnsText.bold = true;
            GameMasterMindItemClass.turnsText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.turnsText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.turnsText);
            GameMasterMindItemClass.reportIcon = AssetManager.getBitmap("MM_Report_png", false, false);
            GameMasterMindItemClass.reportIcon.x = 538;
            GameMasterMindItemClass.reportIcon.y = 261;
            GameMasterMindItemClass.reportIcon.alpha = 0;
            GameMasterMindItemClass.reportIcon.scaleX = 0.8;
            GameMasterMindItemClass.reportIcon.scaleY = 0.8;
            GameMasterMindItemClass.reportIcon.name = "reportIcon";
            GameMasterMindItemClass.reportIcon.addEventListener("touchTap", _this.report, _this);
            _this.addChild(GameMasterMindItemClass.reportIcon);
            GameMasterMindItemClass.nameLeftBoard = AssetManager.getBitmap("MM_nameBoard_png", false, false);
            GameMasterMindItemClass.nameLeftBoard.x = 224;
            GameMasterMindItemClass.nameLeftBoard.y = 151;
            GameMasterMindItemClass.nameLeftBoard.skewY = 180;
            _this.addChild(GameMasterMindItemClass.nameLeftBoard);
            GameMasterMindItemClass.nameRightBoard = AssetManager.getBitmap("MM_nameBoard_png", false, false);
            GameMasterMindItemClass.nameRightBoard.x = 418;
            GameMasterMindItemClass.nameRightBoard.y = 151;
            _this.addChild(GameMasterMindItemClass.nameRightBoard);
            GameMasterMindItemClass.leftDesk = AssetManager.getBitmap("MM_desk_png", true, true);
            GameMasterMindItemClass.leftDesk.x = 217;
            GameMasterMindItemClass.leftDesk.y = 173.5;
            _this.addChild(GameMasterMindItemClass.leftDesk);
            GameMasterMindItemClass.rightDesk = AssetManager.getBitmap("MM_desk_png", true, true);
            GameMasterMindItemClass.rightDesk.x = 426;
            GameMasterMindItemClass.rightDesk.y = 173.5;
            _this.addChild(GameMasterMindItemClass.rightDesk);
            GameMasterMindItemClass.youScoreText = new egret.TextField();
            GameMasterMindItemClass.youScoreText.width = 200;
            GameMasterMindItemClass.youScoreText.height = 36;
            GameMasterMindItemClass.youScoreText.anchorOffsetX = 100;
            GameMasterMindItemClass.youScoreText.anchorOffsetY = 18;
            GameMasterMindItemClass.youScoreText.textColor = 0xffffff;
            GameMasterMindItemClass.youScoreText.alpha = 0;
            GameMasterMindItemClass.youScoreText.fontFamily = "Arial";
            GameMasterMindItemClass.youScoreText.x = 216;
            GameMasterMindItemClass.youScoreText.y = 225;
            GameMasterMindItemClass.youScoreText.size = 36;
            GameMasterMindItemClass.youScoreText.bold = true;
            GameMasterMindItemClass.youScoreText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.youScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.youScoreText);
            GameMasterMindItemClass.otherScoreText = new egret.TextField();
            GameMasterMindItemClass.otherScoreText.width = 200;
            GameMasterMindItemClass.otherScoreText.height = 36;
            GameMasterMindItemClass.otherScoreText.anchorOffsetX = 100;
            GameMasterMindItemClass.otherScoreText.anchorOffsetY = 18;
            GameMasterMindItemClass.otherScoreText.textColor = 0xffffff;
            GameMasterMindItemClass.otherScoreText.alpha = 0;
            GameMasterMindItemClass.otherScoreText.fontFamily = "Arial";
            GameMasterMindItemClass.otherScoreText.x = 424;
            GameMasterMindItemClass.otherScoreText.y = 225;
            GameMasterMindItemClass.otherScoreText.size = 36;
            GameMasterMindItemClass.otherScoreText.bold = true;
            GameMasterMindItemClass.otherScoreText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.otherScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.otherScoreText);
            GameMasterMindItemClass.littleLeftMark = AssetManager.getBitmap("MM_littleRight_png", true, true);
            GameMasterMindItemClass.littleLeftMark.x = 217;
            GameMasterMindItemClass.littleLeftMark.y = 177;
            GameMasterMindItemClass.littleLeftMark.alpha = 0;
            _this.addChild(GameMasterMindItemClass.littleLeftMark);
            GameMasterMindItemClass.littleRightMark = AssetManager.getBitmap("MM_littleRight_png", true, true);
            GameMasterMindItemClass.littleRightMark.x = 426;
            GameMasterMindItemClass.littleRightMark.y = 177;
            GameMasterMindItemClass.littleRightMark.alpha = 0;
            _this.addChild(GameMasterMindItemClass.littleRightMark);
            var leftSexTypeIcon = _this.getSType(0);
            leftSexTypeIcon.x = 142;
            leftSexTypeIcon.y = 161;
            _this.addChild(leftSexTypeIcon);
            var rightSexTypeIcon = _this.getSType(1);
            rightSexTypeIcon.x = 478;
            rightSexTypeIcon.y = 161;
            _this.addChild(rightSexTypeIcon);
            var leftName = new egret.TextField();
            leftName.width = 240;
            leftName.height = 30;
            leftName.anchorOffsetX = 240;
            leftName.x = 130;
            leftName.y = 158;
            leftName.textColor = 0xffffff;
            leftName.textAlign = egret.HorizontalAlign.RIGHT;
            leftName.verticalAlign = egret.VerticalAlign.MIDDLE;
            leftName.text = DataCenter.instance.user.name;
            _this.addChild(leftName);
            var rightName = new egret.TextField();
            rightName.width = 240;
            rightName.height = 30;
            rightName.x = 512;
            rightName.y = 158;
            rightName.textColor = 0xffffff;
            rightName.textAlign = egret.HorizontalAlign.LEFT;
            rightName.verticalAlign = egret.VerticalAlign.MIDDLE;
            rightName.text = DataCenter.instance.room.player.name;
            _this.addChild(rightName);
            GameMasterMindItemClass.timeUsedLeftBoard = AssetManager.getBitmap("MM_timeUsedBoard_png", false, false);
            GameMasterMindItemClass.timeUsedLeftBoard.x = 130 - 132;
            GameMasterMindItemClass.timeUsedLeftBoard.y = 191;
            GameMasterMindItemClass.timeUsedLeftBoard.skewY = 180;
            _this.addChild(GameMasterMindItemClass.timeUsedLeftBoard);
            GameMasterMindItemClass.timeUsedRightBoard = AssetManager.getBitmap("MM_timeUsedBoard_png", false, false);
            GameMasterMindItemClass.timeUsedRightBoard.x = 510 + 132;
            GameMasterMindItemClass.timeUsedRightBoard.y = 191;
            _this.addChild(GameMasterMindItemClass.timeUsedRightBoard);
            GameMasterMindItemClass.leftTimeUsed = AssetManager.getBitmap("MM_timeUsed_png", false, false);
            GameMasterMindItemClass.leftTimeUsed.x = 11 - 132;
            GameMasterMindItemClass.leftTimeUsed.y = 198;
            _this.addChild(GameMasterMindItemClass.leftTimeUsed);
            GameMasterMindItemClass.rightTimeUsed = AssetManager.getBitmap("MM_timeUsed_png", false, false);
            GameMasterMindItemClass.rightTimeUsed.x = 527 + 132;
            GameMasterMindItemClass.rightTimeUsed.y = 198;
            _this.addChild(GameMasterMindItemClass.rightTimeUsed);
            GameMasterMindItemClass.youTimeText = new egret.TextField();
            GameMasterMindItemClass.youTimeText.width = 60;
            GameMasterMindItemClass.youTimeText.height = 30;
            GameMasterMindItemClass.youTimeText.anchorOffsetX = 30;
            GameMasterMindItemClass.youTimeText.anchorOffsetY = 15;
            GameMasterMindItemClass.youTimeText.textColor = 0x4c407b;
            GameMasterMindItemClass.youTimeText.alpha = 0;
            GameMasterMindItemClass.youTimeText.fontFamily = "Arial";
            GameMasterMindItemClass.youTimeText.x = 71 - 132;
            GameMasterMindItemClass.youTimeText.y = 213;
            GameMasterMindItemClass.youTimeText.size = 24;
            GameMasterMindItemClass.youTimeText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.youTimeText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.youTimeText);
            GameMasterMindItemClass.otherTimeText = new egret.TextField();
            GameMasterMindItemClass.otherTimeText.width = 60;
            GameMasterMindItemClass.otherTimeText.height = 30;
            GameMasterMindItemClass.otherTimeText.anchorOffsetX = 30;
            GameMasterMindItemClass.otherTimeText.anchorOffsetY = 15;
            GameMasterMindItemClass.otherTimeText.textColor = 0x4c407b;
            GameMasterMindItemClass.otherTimeText.alpha = 0;
            GameMasterMindItemClass.otherTimeText.fontFamily = "Arial";
            GameMasterMindItemClass.otherTimeText.x = 587 + 132;
            GameMasterMindItemClass.otherTimeText.y = 213;
            GameMasterMindItemClass.otherTimeText.size = 24;
            GameMasterMindItemClass.otherTimeText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.otherTimeText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.otherTimeText);
            GameMasterMindItemClass.leftCombo = AssetManager.getBitmap("MM_leftCombo_png", false, false);
            GameMasterMindItemClass.leftCombo.x = 0 - 157;
            GameMasterMindItemClass.leftCombo.y = 126;
            _this.addChild(GameMasterMindItemClass.leftCombo);
            GameMasterMindItemClass.youComboText = new egret.TextField();
            GameMasterMindItemClass.youComboText.width = 48;
            GameMasterMindItemClass.youComboText.height = 24;
            GameMasterMindItemClass.youComboText.anchorOffsetX = 24;
            GameMasterMindItemClass.youComboText.anchorOffsetY = 12;
            GameMasterMindItemClass.youComboText.textColor = 0xffffff;
            GameMasterMindItemClass.youComboText.alpha = 0;
            GameMasterMindItemClass.youComboText.fontFamily = "Arial";
            GameMasterMindItemClass.youComboText.x = -42;
            GameMasterMindItemClass.youComboText.y = 140;
            GameMasterMindItemClass.youComboText.size = 24;
            GameMasterMindItemClass.youComboText.bold = true;
            GameMasterMindItemClass.youComboText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.youComboText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.youComboText);
            GameMasterMindItemClass.rightCombo = AssetManager.getBitmap("MM_rightCombo_png", false, false);
            GameMasterMindItemClass.rightCombo.x = 483 + 157;
            GameMasterMindItemClass.rightCombo.y = 126;
            _this.addChild(GameMasterMindItemClass.rightCombo);
            GameMasterMindItemClass.otherComboText = new egret.TextField();
            GameMasterMindItemClass.otherComboText.width = 48;
            GameMasterMindItemClass.otherComboText.height = 24;
            GameMasterMindItemClass.otherComboText.anchorOffsetX = 24;
            GameMasterMindItemClass.otherComboText.anchorOffsetY = 12;
            GameMasterMindItemClass.otherComboText.textColor = 0xffffff;
            GameMasterMindItemClass.otherComboText.alpha = 0;
            GameMasterMindItemClass.otherComboText.fontFamily = "Arial";
            GameMasterMindItemClass.otherComboText.x = 772;
            GameMasterMindItemClass.otherComboText.y = 140;
            GameMasterMindItemClass.otherComboText.size = 24;
            GameMasterMindItemClass.otherComboText.bold = true;
            GameMasterMindItemClass.otherComboText.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.otherComboText.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.otherComboText);
            GameMasterMindItemClass.littlePurple = AssetManager.getBitmap("MM_littlePurple_png", true, false);
            GameMasterMindItemClass.littlePurple.x = 320;
            GameMasterMindItemClass.littlePurple.y = 610;
            GameMasterMindItemClass.littlePurple.alpha = 0;
            _this.addChild(GameMasterMindItemClass.littlePurple);
            GameMasterMindItemClass.spareType = new egret.TextField();
            GameMasterMindItemClass.spareType.width = 110;
            GameMasterMindItemClass.spareType.height = 30;
            GameMasterMindItemClass.spareType.anchorOffsetX = 55;
            GameMasterMindItemClass.spareType.anchorOffsetY = 15;
            GameMasterMindItemClass.spareType.textColor = 0xffffff;
            GameMasterMindItemClass.spareType.alpha = 0;
            GameMasterMindItemClass.spareType.fontFamily = "Arial";
            GameMasterMindItemClass.spareType.x = 320;
            GameMasterMindItemClass.spareType.y = 631;
            GameMasterMindItemClass.spareType.bold = true;
            GameMasterMindItemClass.spareType.textAlign = egret.HorizontalAlign.CENTER;
            GameMasterMindItemClass.spareType.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(GameMasterMindItemClass.spareType);
            var sideMask = AssetManager.getBitmap("MM_sideMask_png", false, false);
            sideMask.x = -300;
            sideMask.y = 0;
            _this.addChild(sideMask);
            var _sideMask = AssetManager.getBitmap("MM_sideMask_png", false, false);
            _sideMask.x = 640;
            _sideMask.y = 0;
            _this.addChild(_sideMask);
            GameMasterMindItemClass.answerMask = AssetManager.getBitmap("MM_answerMask_png", false, false);
            GameMasterMindItemClass.answerMask.alpha = 0;
            GameMasterMindItemClass.answerMask.x = 52;
            GameMasterMindItemClass.answerMask.y = 566;
            GameMasterMindItemClass.answerMask.touchEnabled = false;
            GameMasterMindItemClass.answerMask.addEventListener("touchTap", _this.showHasChoose, _this);
            _this.addChild(GameMasterMindItemClass.answerMask);
            var resultText = AssetManager.getBitmap("MM_win_png", true, false);
            resultText.x = 320;
            resultText.y = 510;
            resultText.alpha = 0;
            resultText.name = "resultText";
            resultText.scaleX = 3;
            resultText.scaleY = 3;
            _this.addChild(resultText);
            var dot = AssetManager.getBitmap("MM_dot_png", true, false);
            dot.x = 320;
            dot.y = 605;
            dot.alpha = 0;
            dot.name = "dot";
            dot.scaleX = 3;
            dot.scaleY = 3;
            _this.addChild(dot);
            var leftScoreResult = AssetManager.getBitmap("MM_winBG_png", true, true);
            leftScoreResult.y = 617;
            leftScoreResult.x = 180;
            leftScoreResult.alpha = 0;
            leftScoreResult.name = "leftScoreResult";
            leftScoreResult.scaleX = 3;
            leftScoreResult.scaleY = 3;
            _this.addChild(leftScoreResult);
            var rightScoreResult = AssetManager.getBitmap("MM_loseBG_png", true, true);
            rightScoreResult.x = 460;
            rightScoreResult.y = 617;
            rightScoreResult.alpha = 0;
            rightScoreResult.name = "rightScoreResult";
            rightScoreResult.scaleX = 3;
            rightScoreResult.scaleY = 3;
            _this.addChild(rightScoreResult);
            GameMasterMindItemClass.soundEffect = new SoundEffects();
            GameMasterMindItemClass.soundEffect.setVolume(1);
            _this.loadingEffect();
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
            App.MessageCenter.dispatch(EventMessage.GetQuestionsC2S, function (data) {
                GameMasterMindItemClass.Question = data;
                GameMasterMindItemClass.readyState[0] = 1;
                egret.startTick(_this.readyTick, _this);
                GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_GAMEREADY);
            });
            if (GameMasterMindItemClass.isOffline == true) {
                App.TimerManager.doTimer((Math.random() * 5), 1, function () {
                    GameMasterMindItemClass.readyState = [1, 1];
                }, _this);
            }
            if (_this.stage.stageHeight < 1136) {
                GameMasterMindItemClass.multiple = (_this.stage.stageHeight / 1136);
                _this.scaleX = GameMasterMindItemClass.multiple;
                _this.scaleY = GameMasterMindItemClass.multiple;
                var nowWidth = 640 * GameMasterMindItemClass.multiple;
                _this.x = (640 - nowWidth) / 2;
            }
            else if (_this.stage.stageHeight > 1136) {
                _this.y = (_this.stage.stageHeight - 1136) / 2;
            }
        };
        return _this;
    }
    GameMasterMindMainScene.prototype.init = function () {
        _super.prototype.init.call(this);
        this.loadingType = 0;
        GameMasterMindMainScene.runningSec = 0;
        GameMasterMindItemClass.dispose();
        App.SoundManager.stopBg();
        App.SoundManager.playBg("BG_mp3");
        if (DataCenter.instance.room.IsAI) {
            GameMasterMindItemClass.isOffline = true;
        }
        this.gameInit();
    };
    GameMasterMindMainScene.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        //通知表情页关闭
        App.MessageCenter.dispatch(EventMessage.gameCloseExpress);
        egret.Tween.removeAllTweens();
        egret.stopTick(this.readyTick, this);
        egret.stopTick(this.mainTick, this);
        egret.stopTick(this.answerTick, this);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.youRole.armature.removeEventListener("touchTap", this.showPersonalInformation, this);
        GameMasterMindItemClass.otherRole.armature.removeEventListener("touchTap", this.showOtherPersonalInformation, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.messageDuel, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.resultDuel, this);
        GameMasterMindItemClass.btn1.removeEventListener("touchTap", GameMasterMindLogic.btn1Press, this);
        GameMasterMindItemClass.btn2.removeEventListener("touchTap", GameMasterMindLogic.btn2Press, this);
        GameMasterMindItemClass.btn3.removeEventListener("touchTap", GameMasterMindLogic.btn3Press, this);
        GameMasterMindItemClass.btn4.removeEventListener("touchTap", GameMasterMindLogic.btn4Press, this);
        GameMasterMindItemClass.greetNormalBtn.removeEventListener("touchTap", this.showGreeting, this);
        GameMasterMindItemClass.reportIcon.removeEventListener("touchTap", this.report, this);
        GameMasterMindItemClass.answerMask.removeEventListener("touchTap", this.showHasChoose, this);
        GameMasterMindItemClass.dispose();
        App.TimerManager.removeAll(GameMasterMindLogic);
        App.TimerManager.removeAll(this);
    };
    GameMasterMindMainScene.prototype.addQiPaoCartoon = function (data, type) {
        if (type === void 0) { type = 1; }
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(120, 130);
        this.addChild(qiPao);
        if (type == 2) {
            if (data.indexOf("express4") == -1) {
                qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 90, App.GameWidth - 70);
            }
            else {
                qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 165, App.GameWidth - 145);
            }
            qiPao.setSouce(data, true, 1);
        }
        else {
            qiPao.setSouce(data, false, 1);
            if (data.indexOf("express4") == -1) {
                qiPao.x = App.RandomUtils.limitInteger(70, 90);
            }
            else {
                qiPao.x = App.RandomUtils.limitInteger(145, 165);
            }
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
        if (data.indexOf("express4") == -1) {
            qiPao.onPlay();
        }
        else {
            if (type == 1) {
                qiPao.img_1.scaleX = -1;
                qiPao.onPlay(1);
            }
            else {
                // qiPao.img_2.scaleX = -1;
                qiPao.onPlay(2);
            }
        }
    };
    //添加Ai的表情
    GameMasterMindMainScene.prototype.AddAIexpress = function () {
        var ArrPress = [
            "4_1", "4_2", "4_3", "4_4", "4_5", "4_6", "4_7", "4_8", "4_9", "4_10",
            "5_1", "5_2", "5_3", "5_4",
            "6_1", "6_6", "6_3", "6_4"
        ];
        var num = App.RandomUtils.limitInteger(0, 17);
        var str = "express" + ArrPress[num] + "_png";
        this.addQiPaoCartoon(str, 2);
    };
    GameMasterMindMainScene.prototype.showHasChoose = function () {
        var Shape = AssetManager.getBitmap("MM_hasAnswer_png", false, false);
        Shape.x = 198;
        Shape.y = 512;
        Shape.alpha = 0;
        this.addChild(Shape);
        var tw = egret.Tween.get(Shape);
        tw.to({ alpha: 1 }, 200);
        tw.to({ alpha: 1 }, 300);
        tw.to({ alpha: 0 }, 200);
        tw.call(function () {
            App.DisplayUtils.removeFromParent(Shape);
        });
    };
    GameMasterMindMainScene.runningSec = 0;
    GameMasterMindMainScene.youTimer = function () {
        GameMasterMindItemClass.youTime += 1;
        if (GameMasterMindItemClass.youTimeText) {
            GameMasterMindItemClass.youTimeText.alpha = 1;
            GameMasterMindItemClass.youTimeText.text = parseInt((GameMasterMindItemClass.youTime / 60).toString()).toString();
            switch (GameMasterMindItemClass.youTime) {
                case 600:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 660:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 720:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 780:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 840:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
            }
        }
        return false;
    };
    GameMasterMindMainScene.otherTimer = function () {
        GameMasterMindItemClass.otherTime += 1;
        if (GameMasterMindItemClass.otherTimeText) {
            GameMasterMindItemClass.otherTimeText.alpha = 1;
            GameMasterMindItemClass.otherTimeText.text = parseInt((GameMasterMindItemClass.otherTime / 60).toString()).toString();
        }
        return false;
    };
    GameMasterMindMainScene.showLeftTimeUsed = function (hideOrShow) {
        if (hideOrShow === void 0) { hideOrShow = false; }
        var leftArray = [GameMasterMindItemClass.timeUsedLeftBoard, GameMasterMindItemClass.leftTimeUsed, GameMasterMindItemClass.youTimeText];
        switch (hideOrShow) {
            case false:
                GameMasterMindItemClass.hasShowLeftTimeUsed = true;
                leftArray.forEach(function (element) {
                    var tw = egret.Tween.get(element);
                    tw.to({ x: (element.x + 132) }, 300);
                    tw.call(function () {
                        tw = null;
                    });
                });
                break;
            case true:
                if (GameMasterMindItemClass.hasShowLeftTimeUsed == true) {
                    GameMasterMindItemClass.hasShowLeftTimeUsed = false;
                    leftArray.forEach(function (element) {
                        var tw = egret.Tween.get(element);
                        tw.to({ x: (element.x - 132) }, 300);
                        tw.call(function () {
                            tw = null;
                        });
                    });
                }
                break;
        }
    };
    GameMasterMindMainScene.showRightTimeUsed = function (hideOrShow) {
        if (hideOrShow === void 0) { hideOrShow = false; }
        var rightArray = [GameMasterMindItemClass.timeUsedRightBoard, GameMasterMindItemClass.rightTimeUsed, GameMasterMindItemClass.otherTimeText];
        switch (hideOrShow) {
            case false:
                GameMasterMindItemClass.hasShowRightTimeUsed = true;
                rightArray.forEach(function (element) {
                    var tw = egret.Tween.get(element);
                    tw.to({ x: (element.x - 132) }, 300);
                    tw.call(function () {
                        tw = null;
                    });
                });
                break;
            case true:
                if (GameMasterMindItemClass.hasShowRightTimeUsed == true) {
                    GameMasterMindItemClass.hasShowRightTimeUsed = false;
                    rightArray.forEach(function (element) {
                        var tw = egret.Tween.get(element);
                        tw.to({ x: (element.x + 132) }, 300);
                        tw.call(function () {
                            tw = null;
                        });
                    });
                }
                break;
        }
    };
    return GameMasterMindMainScene;
}(State));
__reflect(GameMasterMindMainScene.prototype, "GameMasterMindMainScene");
