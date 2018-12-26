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
var GameRhythmKingEventClass = (function () {
    function GameRhythmKingEventClass() {
    }
    GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS = "choose";
    GameRhythmKingEventClass.EVEVT_READY = "ready";
    GameRhythmKingEventClass.EVENT_PER = "per";
    GameRhythmKingEventClass.EVENT_NOR = "nor";
    GameRhythmKingEventClass.EVENT_GOOD = "good";
    GameRhythmKingEventClass.EVENT_LOSE = "lose";
    GameRhythmKingEventClass.EVENT_MUSIC_END = "end";
    GameRhythmKingEventClass.rkMessagerCenter = function (event) {
        if (GameRhythmKingLogic.isOffline == true) {
            return;
        }
        switch (event) {
            case GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS + "|" + GameRhythmKingLogic.randomChoose(), 1);
                break;
            case GameRhythmKingEventClass.EVEVT_READY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVEVT_READY);
                break;
            case GameRhythmKingEventClass.EVENT_PER:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_PER);
                break;
            case GameRhythmKingEventClass.EVENT_NOR:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_NOR);
                break;
            case GameRhythmKingEventClass.EVENT_GOOD:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_GOOD);
                break;
            case GameRhythmKingEventClass.EVENT_LOSE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_LOSE);
                break;
            case GameRhythmKingEventClass.EVENT_MUSIC_END:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_MUSIC_END);
                break;
        }
    };
    GameRhythmKingEventClass.dispose = function () {
    };
    return GameRhythmKingEventClass;
}());
__reflect(GameRhythmKingEventClass.prototype, "GameRhythmKingEventClass");
var GameRhythmKingItemClass = (function () {
    function GameRhythmKingItemClass() {
    }
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    GameRhythmKingItemClass.backGroundMusicPlayer = new SoundEffects();
    GameRhythmKingItemClass.runningSec = -180;
    GameRhythmKingItemClass.speedSupplement = 180; // 60 hexadecimal
    GameRhythmKingItemClass.settingsIndex = 0;
    GameRhythmKingItemClass.usingSetting = [];
    GameRhythmKingItemClass.pointYou = new egret.TextField();
    GameRhythmKingItemClass.pointOther = new egret.TextField();
    GameRhythmKingItemClass.pointYouNumber = 0;
    GameRhythmKingItemClass.pointOtherNumber = 0;
    GameRhythmKingItemClass.comboYou = 0;
    GameRhythmKingItemClass.comboOther = 0;
    GameRhythmKingItemClass.recycleArray = [];
    GameRhythmKingItemClass.blockArray = [];
    GameRhythmKingItemClass.blockOtherArray = [];
    GameRhythmKingItemClass.blockYouHeight = 0;
    GameRhythmKingItemClass.blockOtherHeight = 0;
    GameRhythmKingItemClass.blockItemSettingsArray = [];
    GameRhythmKingItemClass.blockItemSettingsOtherArray = [];
    GameRhythmKingItemClass.comboYouText = new egret.BitmapText();
    GameRhythmKingItemClass.comboOtherText = new egret.BitmapText();
    GameRhythmKingItemClass.rhythmSumPast = 1;
    GameRhythmKingItemClass.rhythmSumNum = 0;
    GameRhythmKingItemClass.rhythmYouPast = 1;
    GameRhythmKingItemClass.rhythmOtherPast = 1;
    GameRhythmKingItemClass.readyState = [0, 0];
    GameRhythmKingItemClass.gameOverState = [0, 0];
    GameRhythmKingItemClass.stars = [];
    GameRhythmKingItemClass.gameLevel = 0;
    GameRhythmKingItemClass.highestYouCombo = 0;
    GameRhythmKingItemClass.highestOtherCombo = 0;
    GameRhythmKingItemClass.perNumYou = 0;
    GameRhythmKingItemClass.perNumOther = 0;
    GameRhythmKingItemClass.goodNumYou = 0;
    GameRhythmKingItemClass.goodNumOther = 0;
    GameRhythmKingItemClass.norNumYou = 0;
    GameRhythmKingItemClass.norNumOther = 0;
    GameRhythmKingItemClass.resultYouText = [];
    GameRhythmKingItemClass.resultOtherText = [];
    GameRhythmKingItemClass.AiRandom = 0;
    GameRhythmKingItemClass.rippleArray = [];
    GameRhythmKingItemClass.dispose = function () {
        GameRhythmKingItemClass.backGroundLeft = undefined;
        GameRhythmKingItemClass.backGroundRight = undefined;
        GameRhythmKingItemClass.backGroundLeft_ = undefined;
        GameRhythmKingItemClass.backGroundRight_ = undefined;
        GameRhythmKingItemClass.otherBtn = undefined;
        GameRhythmKingItemClass.multiple = undefined;
        GameRhythmKingItemClass.backGroundMusicPlayer = undefined;
        GameRhythmKingItemClass.runningSec = -300;
        GameRhythmKingItemClass.speedSupplement = 300;
        GameRhythmKingItemClass.settingsIndex = 0;
        GameRhythmKingItemClass.usingSetting = [];
        GameRhythmKingItemClass.rkLine = undefined;
        GameRhythmKingItemClass.rkLineMask = undefined;
        GameRhythmKingItemClass.blockBack = undefined;
        GameRhythmKingItemClass.blockFront = undefined;
        GameRhythmKingItemClass.you = undefined;
        GameRhythmKingItemClass.pointBoardYou = undefined;
        GameRhythmKingItemClass.pointBoardOther = undefined;
        GameRhythmKingItemClass.pointYou = new egret.TextField();
        GameRhythmKingItemClass.pointOther = new egret.TextField();
        GameRhythmKingItemClass.roadBatholith = undefined;
        GameRhythmKingItemClass.pointYouNumber = 0;
        GameRhythmKingItemClass.pointOtherNumber = 0;
        GameRhythmKingItemClass.comboYou = 0;
        GameRhythmKingItemClass.comboOther = 0;
        GameRhythmKingItemClass.roadBeatCenter = undefined;
        GameRhythmKingItemClass.comboType = undefined;
        GameRhythmKingItemClass.comboOtherType = undefined;
        GameRhythmKingItemClass.tapTimeStamp = undefined;
        GameRhythmKingItemClass.judgeItem = undefined;
        GameRhythmKingItemClass.recycleArray = [];
        GameRhythmKingItemClass.blockArray = [];
        GameRhythmKingItemClass.blockOtherArray = [];
        GameRhythmKingItemClass.blockYouHeight = 0;
        GameRhythmKingItemClass.blockOtherHeight = 0;
        GameRhythmKingItemClass.blockItemSettingsArray = [];
        GameRhythmKingItemClass.blockItemSettingsOtherArray = [];
        GameRhythmKingItemClass.comboYouImage = undefined;
        GameRhythmKingItemClass.comboOtherImage = undefined;
        GameRhythmKingItemClass.comboYouText = new egret.BitmapText();
        GameRhythmKingItemClass.comboOtherText = new egret.BitmapText();
        GameRhythmKingItemClass.headIcoYou = undefined;
        GameRhythmKingItemClass.headIcoOther = undefined;
        GameRhythmKingItemClass.sideFold = undefined;
        GameRhythmKingItemClass.sideProgress = undefined;
        GameRhythmKingItemClass.rhythmSumPast = 1;
        GameRhythmKingItemClass.rhythmSumNum = 0;
        GameRhythmKingItemClass.rhythmYouPast = 1;
        GameRhythmKingItemClass.rhythmOtherPast = 1;
        GameRhythmKingItemClass.otherRoleAvatar = undefined;
        GameRhythmKingItemClass.myRoleAvatar = undefined;
        GameRhythmKingItemClass.keyPressSoundEffect = undefined;
        GameRhythmKingItemClass.gameReady = undefined;
        GameRhythmKingItemClass.choice = undefined;
        GameRhythmKingItemClass.readyState = [0, 0];
        GameRhythmKingItemClass.jumpRoleYou = undefined;
        GameRhythmKingItemClass.jumpRoleOther = undefined;
        GameRhythmKingItemClass.sparkLeft = undefined;
        GameRhythmKingItemClass.sparkRight = undefined;
        GameRhythmKingItemClass.gameOverState = [0, 0];
        GameRhythmKingItemClass.alaphaMask = undefined;
        GameRhythmKingItemClass.bottomSide = undefined;
        GameRhythmKingItemClass.waitingSceneMask = undefined;
        GameRhythmKingItemClass.waitingText = undefined;
        GameRhythmKingItemClass.starBoard = undefined;
        GameRhythmKingItemClass.stars = [];
        GameRhythmKingItemClass.gameLevel = 0;
        GameRhythmKingItemClass.whiteFont = undefined;
        GameRhythmKingItemClass.highestYouCombo = 0;
        GameRhythmKingItemClass.highestOtherCombo = 0;
        GameRhythmKingItemClass.perNumYou = 0;
        GameRhythmKingItemClass.perNumOther = 0;
        GameRhythmKingItemClass.goodNumYou = 0;
        GameRhythmKingItemClass.goodNumOther = 0;
        GameRhythmKingItemClass.norNumYou = 0;
        GameRhythmKingItemClass.norNumOther = 0;
        GameRhythmKingItemClass.musicPlaying = undefined;
        GameRhythmKingItemClass.resultYouBoard = undefined;
        GameRhythmKingItemClass.resultOtherBoard = undefined;
        GameRhythmKingItemClass.resultYouText = [];
        GameRhythmKingItemClass.resultOtherText = [];
        GameRhythmKingItemClass.sunShineYou = undefined;
        GameRhythmKingItemClass.sunShineOther = undefined;
        GameRhythmKingItemClass.loseBlockYou = undefined;
        GameRhythmKingItemClass.loseBlockOther = undefined;
        GameRhythmKingItemClass.AiRandom = 0;
        GameRhythmKingItemClass.rippleArray = [];
        GameRhythmKingItemClass.topSide = undefined;
    };
    return GameRhythmKingItemClass;
}());
__reflect(GameRhythmKingItemClass.prototype, "GameRhythmKingItemClass");
/**
 * 层级
 * 0 —— 背景
 * 1 —— blockFront
 * 2 —— rkLine
 * 3 —— rhythm beat
 * 4 —— blockBack
 */ 
var GameRhythmKingLogic = (function () {
    function GameRhythmKingLogic() {
    }
    GameRhythmKingLogic.gameOver = function (result) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    GameRhythmKingLogic.isOffline = false;
    GameRhythmKingLogic.animationItem = [];
    GameRhythmKingLogic.itemCache = [];
    /**
     * shifting manager
     */
    GameRhythmKingLogic.shiftingManager = function (type) {
        var num;
        switch (type) {
            case "perfect":
                num = Math.random() * 2;
                num = parseInt(num.toString(), 10);
                break;
            case "good":
                num = Math.random() * 4 + 2;
                num = parseInt(num.toString(), 10);
                break;
            case "normal":
                num = Math.random() * 6 + 6;
                num = parseInt(num.toString(), 10);
                break;
        }
        var plus_minus = Math.random();
        if (plus_minus > 0.5) {
            num *= -1;
        }
        return num;
    };
    /**
     * background y manager
     */
    GameRhythmKingLogic.backgroundYManager = function (isYou) {
        var tw;
        var tw_;
        switch (isYou) {
            case true:
                tw = egret.Tween.get(GameRhythmKingItemClass.backGroundLeft);
                tw.to({ y: (GameRhythmKingItemClass.backGroundLeft.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw.call(function () {
                    tw = null;
                });
                tw_ = egret.Tween.get(GameRhythmKingItemClass.backGroundLeft_);
                tw_.to({ y: (GameRhythmKingItemClass.backGroundLeft_.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw_.call(function () {
                    tw_ = null;
                });
                break;
            case false:
                tw = egret.Tween.get(GameRhythmKingItemClass.backGroundRight);
                tw.to({ y: (GameRhythmKingItemClass.backGroundRight.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw.call(function () {
                    tw = null;
                });
                tw_ = egret.Tween.get(GameRhythmKingItemClass.backGroundRight_);
                tw_.to({ y: (GameRhythmKingItemClass.backGroundRight_.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw_.call(function () {
                    tw_ = null;
                });
                break;
        }
    };
    /**
     * game display manager
     */
    GameRhythmKingLogic.displayManager = function (mode, who) {
        var hideOther = function () {
            App.TimerManager.doTimer(200, 1, function () {
                GameRhythmKingItemClass.comboOtherType.alpha = 0;
            }, GameRhythmKingLogic);
        };
        var setPointImg = function (lose) {
            if (GameRhythmKingLogic.setTimeOut) {
                clearTimeout(GameRhythmKingLogic.setTimeOut);
            }
            if (!lose) {
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetX = 50;
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetY = 50;
                GameRhythmKingItemClass.roadBeatCenter.texture = AssetManager.getBitmap("RK_road_beatCenterBEAT_png", true, true).texture;
            }
            GameRhythmKingLogic.setTimeOut = setTimeout(function () {
                GameRhythmKingItemClass.roadBeatCenter.texture = AssetManager.getBitmap("RK_road_beatCenter_png", true, true).texture;
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetX = 36;
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetY = 36;
                GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_normal_jpg", true, true).texture;
                GameRhythmKingItemClass.comboType.alpha = 0;
            }, 200);
        };
        switch (who) {
            case 0:
                GameRhythmKingItemClass.comboType.x = 147.5;
                GameRhythmKingItemClass.comboType.y = 1136 - GameRhythmKingItemClass.blockYouHeight + 80;
                switch (mode) {
                    case "normal":
                        GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_white_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_normal_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg();
                        GameRhythmKingLogic.backgroundYManager(true);
                        break;
                    case "perfect":
                        GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_yellow_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_perfect_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg();
                        GameRhythmKingLogic.backgroundYManager(true);
                        break;
                    case "good":
                        GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_red_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_pointgood_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg();
                        GameRhythmKingLogic.backgroundYManager(true);
                        break;
                    case "lose":
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_miss_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg(1);
                }
                break;
            case 1:
                GameRhythmKingItemClass.comboOtherType.x = 492.5;
                GameRhythmKingItemClass.comboOtherType.y = 1136 - GameRhythmKingItemClass.blockOtherHeight + 80;
                switch (mode) {
                    case "normal":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_normal_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        GameRhythmKingLogic.backgroundYManager(false);
                        hideOther();
                        break;
                    case "perfect":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_perfect_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        GameRhythmKingLogic.backgroundYManager(false);
                        hideOther();
                        break;
                    case "good":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_pointgood_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        GameRhythmKingLogic.backgroundYManager(false);
                        hideOther();
                        break;
                    case "lose":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_miss_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        hideOther();
                }
                break;
        }
    };
    /**
     * block height switcher
     */
    GameRhythmKingLogic.blockHeightSwitcher = function (itemHeight) {
        switch (itemHeight) {
            case 132:
                return 43;
            case 110:
                return 21;
            case 99:
                return 10;
        }
    };
    /**
     *
     */
    GameRhythmKingLogic.sunShineOtherManager = function () {
        if (GameRhythmKingLogic.sunShineOtherTO) {
            clearTimeout(GameRhythmKingLogic.sunShineOtherTO);
        }
        GameRhythmKingLogic.sunShineOtherTO = setTimeout(function () {
            GameRhythmKingItemClass.sunShineOther.alpha = 0;
        }, 200);
        GameRhythmKingItemClass.sunShineOther.alpha = 1;
    };
    /**
     * tap function
     */
    GameRhythmKingLogic.tap = function () {
        if (GameRhythmKingLogic.sunShineYouTO) {
            clearTimeout(GameRhythmKingLogic.sunShineYouTO);
        }
        GameRhythmKingLogic.sunShineYouTO = setTimeout(function () {
            GameRhythmKingItemClass.sunShineYou.alpha = 0;
        }, 200);
        GameRhythmKingItemClass.sunShineYou.alpha = 1;
        GameRhythmKingItemClass.tapTimeStamp = GameRhythmKingItemClass.runningSec;
        GameRhythmKingItemClass.keyPressSoundEffect.play("RK_keyPress_mp3", true);
        // // console.log("press", GameRhythmKingItemClass.runningSec);
    };
    /**
     * rhythm point sum progress
     */
    GameRhythmKingLogic.rhythmSumManager = function () {
        GameRhythmKingItemClass.sideProgress.scaleY = (GameRhythmKingItemClass.rhythmSumPast / GameRhythmKingItemClass.rhythmSumNum);
        GameRhythmKingItemClass.otherRoleAvatar.armature.y = 1100 - (GameRhythmKingItemClass.rhythmOtherPast / GameRhythmKingItemClass.rhythmSumNum * 944);
        GameRhythmKingItemClass.myRoleAvatar.armature.y = 1100 - (GameRhythmKingItemClass.rhythmYouPast / GameRhythmKingItemClass.rhythmSumNum * 944);
    };
    GameRhythmKingLogic.AITick = function () {
        GameRhythmKingItemClass.AiRandom = Math.random();
        if (GameRhythmKingItemClass.AiRandom >= 0 && GameRhythmKingItemClass.AiRandom <= 0.3) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.rhythmOtherPast += 1;
            GameRhythmKingItemClass.comboOther = 0;
            GameRhythmKingItemClass.norNumOther += 1;
            GameRhythmKingItemClass.pointOtherNumber += (10 + GameRhythmKingItemClass.comboOther);
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "normal"]);
        }
        else if (GameRhythmKingItemClass.AiRandom > 0.3 && GameRhythmKingItemClass.AiRandom <= 0.6) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.comboOther = 0;
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingLogic.displayManager("lose", 1);
            GameRhythmKingMainScene.loseBlockManager(1);
        }
        else if (GameRhythmKingItemClass.AiRandom > 0.6 && GameRhythmKingItemClass.AiRandom <= 0.9) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.rhythmOtherPast += 1;
            GameRhythmKingItemClass.comboOther += 1;
            if (GameRhythmKingItemClass.comboOther > GameRhythmKingItemClass.highestOtherCombo) {
                GameRhythmKingItemClass.highestOtherCombo = GameRhythmKingItemClass.comboOther;
            }
            GameRhythmKingItemClass.goodNumOther += 1;
            GameRhythmKingItemClass.pointOtherNumber += (20 + GameRhythmKingItemClass.comboOther);
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "good"]);
        }
        else if (GameRhythmKingItemClass.AiRandom > 0.9 && GameRhythmKingItemClass.AiRandom <= 1) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.rhythmOtherPast += 1;
            GameRhythmKingItemClass.comboOther += 1;
            if (GameRhythmKingItemClass.comboOther > GameRhythmKingItemClass.highestOtherCombo) {
                GameRhythmKingItemClass.highestOtherCombo = GameRhythmKingItemClass.comboOther;
            }
            GameRhythmKingItemClass.perNumOther += 1;
            GameRhythmKingItemClass.pointOtherNumber += (30 + GameRhythmKingItemClass.comboOther);
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "perfect"]);
        }
    };
    /**
     * compare tick
     */
    GameRhythmKingLogic.compareTick = function () {
        if (GameRhythmKingItemClass.tapTimeStamp != undefined && GameRhythmKingItemClass.judgeItem != undefined) {
            var D_value = GameRhythmKingItemClass.judgeItem - GameRhythmKingItemClass.tapTimeStamp;
            if (D_value >= 0 && D_value <= 5) {
                // // console.log("perfect!", "combo:" + GameRhythmKingItemClass.comboYou, GameRhythmKingItemClass.tapTimeStamp, GameRhythmKingItemClass.judgeItem);
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                GameRhythmKingItemClass.judgeItem = undefined;
                GameRhythmKingItemClass.rhythmYouPast += 1;
                GameRhythmKingItemClass.comboYou += 1;
                if (GameRhythmKingItemClass.comboYou > GameRhythmKingItemClass.highestYouCombo) {
                    GameRhythmKingItemClass.highestYouCombo = GameRhythmKingItemClass.comboYou;
                }
                GameRhythmKingItemClass.perNumYou += 1;
                GameRhythmKingItemClass.pointYouNumber += (30 + GameRhythmKingItemClass.comboYou);
                GameRhythmKingItemClass.pointYou.text = GameRhythmKingItemClass.pointYouNumber.toString();
                GameRhythmKingItemClass.blockItemSettingsArray.push([0, "perfect"]);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_PER);
                GameRhythmKingItemClass.rippleArray.push("per");
            }
            else if (D_value > 0 && D_value <= 10) {
                // // console.log("good!", "combo:" + GameRhythmKingItemClass.comboYou, GameRhythmKingItemClass.tapTimeStamp, GameRhythmKingItemClass.judgeItem);
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                GameRhythmKingItemClass.judgeItem = undefined;
                GameRhythmKingItemClass.rhythmYouPast += 1;
                GameRhythmKingItemClass.comboYou += 1;
                if (GameRhythmKingItemClass.comboYou > GameRhythmKingItemClass.highestYouCombo) {
                    GameRhythmKingItemClass.highestYouCombo = GameRhythmKingItemClass.comboYou;
                }
                GameRhythmKingItemClass.goodNumYou += 1;
                GameRhythmKingItemClass.pointYouNumber += (20 + GameRhythmKingItemClass.comboYou);
                GameRhythmKingItemClass.pointYou.text = GameRhythmKingItemClass.pointYouNumber.toString();
                GameRhythmKingItemClass.blockItemSettingsArray.push([0, "good"]);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_GOOD);
                GameRhythmKingItemClass.rippleArray.push("good");
            }
            else if (D_value > 0 && D_value <= 14) {
                // // console.log("normal!", "combo:" + GameRhythmKingItemClass.comboYou, GameRhythmKingItemClass.tapTimeStamp, GameRhythmKingItemClass.judgeItem);
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                GameRhythmKingItemClass.judgeItem = undefined;
                GameRhythmKingItemClass.rhythmYouPast += 1;
                GameRhythmKingItemClass.comboYou = 0;
                GameRhythmKingItemClass.norNumYou += 1;
                GameRhythmKingItemClass.pointYouNumber += (10 + GameRhythmKingItemClass.comboYou);
                GameRhythmKingItemClass.pointYou.text = GameRhythmKingItemClass.pointYouNumber.toString();
                GameRhythmKingItemClass.blockItemSettingsArray.push([0, "normal"]);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_NOR);
                GameRhythmKingItemClass.rippleArray.push("nor");
            }
            else {
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                // // console.log("lose!");
                GameRhythmKingItemClass.comboYou = 0;
                GameRhythmKingLogic.displayManager("lose", 0);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_LOSE);
                GameRhythmKingMainScene.loseBlockManager(0);
            }
        }
        return false;
    };
    /**
     * random choice
     */
    GameRhythmKingLogic.randomChoose = function () {
        var ran = Math.random();
        if (ran > 0 && ran <= 0.333) {
            return 0;
        }
        else if (ran > 0.333 && ran <= 0.666) {
            return 1;
        }
        else if (ran > 0.666 && ran < 1) {
            return 2;
        }
    };
    /**
     * settings switcher
     */
    GameRhythmKingLogic.settingSwitcher = function (num) {
        switch (num) {
            case 0:
                GameRhythmKingItemClass.usingSetting = GameRhythmKingSettingsClass.settings1[1];
                GameRhythmKingItemClass.gameLevel = GameRhythmKingSettingsClass.settings1[0];
                GameRhythmKingItemClass.rhythmSumNum = GameRhythmKingItemClass.usingSetting.length;
                GameRhythmKingItemClass.musicPlaying = "RK_music_1_mp3";
                break;
            case 1:
                GameRhythmKingItemClass.usingSetting = GameRhythmKingSettingsClass.settings2[1];
                GameRhythmKingItemClass.gameLevel = GameRhythmKingSettingsClass.settings2[0];
                GameRhythmKingItemClass.rhythmSumNum = GameRhythmKingItemClass.usingSetting.length;
                GameRhythmKingItemClass.musicPlaying = "RK_music_2_mp3";
                break;
            case 2:
                GameRhythmKingItemClass.usingSetting = GameRhythmKingSettingsClass.settings3[1];
                GameRhythmKingItemClass.gameLevel = GameRhythmKingSettingsClass.settings3[0];
                GameRhythmKingItemClass.rhythmSumNum = GameRhythmKingItemClass.usingSetting.length;
                GameRhythmKingItemClass.musicPlaying = "RK_music_3_mp3";
                break;
        }
        // console.log(GameRhythmKingItemClass.gameLevel);
    };
    /**
     * animation manager
     */
    GameRhythmKingLogic.animationManager = function (item, startPos, endPos, fpsTimeInterval, callback) {
        var timeInterval = fpsTimeInterval / 60 * 1000;
        var endTime = GameRhythmKingLogic.nowTime + timeInterval;
        var xSpeed = (endPos[0] - startPos[0]) / timeInterval;
        var ySpeed = (endPos[1] - startPos[1]) / timeInterval;
        GameRhythmKingLogic.animationItem.push([item, timeInterval, (GameRhythmKingLogic.nowTime), endTime, xSpeed, ySpeed, startPos, callback]);
    };
    /**
     * animation tick
     */
    GameRhythmKingLogic.animationTick = function (sec) {
        GameRhythmKingLogic.nowTime = sec;
        if (GameRhythmKingLogic.animationItem.length > 0) {
            GameRhythmKingLogic.animationItem.forEach(function (element) {
                var item = element[0];
                var timeInterval = element[1];
                var startTime = element[2];
                var endTime = element[3];
                var xSpeed = element[4];
                var ySpeed = element[5];
                var startPos = element[6];
                var callback = element[7];
                if (sec >= endTime) {
                    if (callback) {
                        callback();
                    }
                    GameRhythmKingLogic.itemCache.push(item);
                    item.alpha = 0;
                    GameRhythmKingLogic.animationItem.shift();
                }
                else {
                    item.x = startPos[0] + xSpeed * (sec - startTime);
                    item.y = startPos[1] + ySpeed * (sec - startTime);
                }
            });
        }
        return true;
    };
    GameRhythmKingLogic.dispose = function () {
        GameRhythmKingLogic.isOffline = false;
        GameRhythmKingLogic.setTimeOut = undefined;
        GameRhythmKingLogic.animationItem = [];
        GameRhythmKingLogic.itemCache = [];
        GameRhythmKingLogic.nowTime = undefined;
    };
    return GameRhythmKingLogic;
}());
__reflect(GameRhythmKingLogic.prototype, "GameRhythmKingLogic");
var GameRhythmKingMainScene = (function (_super) {
    __extends(GameRhythmKingMainScene, _super);
    function GameRhythmKingMainScene() {
        var _this = _super.call(this) || this;
        _this.youRoleRotation = 0;
        _this.otherRoleRotation = 0;
        _this.pointRecycleManager = function () {
            if (GameRhythmKingItemClass.recycleArray.length > 30) {
                GameRhythmKingItemClass.recycleArray.forEach(function (element) {
                    _this.removeChild(element);
                });
            }
            GameRhythmKingItemClass.recycleArray = [];
        };
        _this.blockTickManager = function () {
            if (GameRhythmKingItemClass.blockItemSettingsArray.length > 0) {
                _this.blockManager(GameRhythmKingItemClass.blockItemSettingsArray[GameRhythmKingItemClass.blockItemSettingsArray.length - 1][0], GameRhythmKingItemClass.blockItemSettingsArray[GameRhythmKingItemClass.blockItemSettingsArray.length - 1][1]);
            }
            if (GameRhythmKingItemClass.blockItemSettingsOtherArray.length > 0) {
                _this.blockManager(GameRhythmKingItemClass.blockItemSettingsOtherArray[GameRhythmKingItemClass.blockItemSettingsOtherArray.length - 1][0], GameRhythmKingItemClass.blockItemSettingsOtherArray[GameRhythmKingItemClass.blockItemSettingsOtherArray.length - 1][1]);
            }
        };
        _this.addBlock = function (item, who, height, type) {
            var ending = 0;
            switch (who) {
                case 0:
                    item.x = 147.5 + GameRhythmKingLogic.shiftingManager(type);
                    GameRhythmKingItemClass.blockYouHeight += height;
                    ending = 1136 - GameRhythmKingItemClass.blockYouHeight;
                    item.y = 300;
                    GameRhythmKingItemClass.blockArray.push(item);
                    break;
                case 1:
                    item.x = 492.5 + GameRhythmKingLogic.shiftingManager(type);
                    GameRhythmKingItemClass.blockOtherHeight += height;
                    ending = 1136 - GameRhythmKingItemClass.blockOtherHeight;
                    item.y = 300;
                    GameRhythmKingItemClass.blockOtherArray.push(item);
                    break;
            }
            _this.addChild(item);
            // 显示节奏评价，层级问题必须放在此处。
            if (GameRhythmKingItemClass.blockItemSettingsArray.length > 0) {
                GameRhythmKingLogic.displayManager(GameRhythmKingItemClass.blockItemSettingsArray[0][1], 0);
                _this.setChildIndex(GameRhythmKingItemClass.comboType, _this.numChildren + 1);
                _this.scoreEffectManager(GameRhythmKingItemClass.blockItemSettingsArray[0][1], 0);
            }
            if (GameRhythmKingItemClass.blockItemSettingsOtherArray.length > 0) {
                GameRhythmKingLogic.displayManager(GameRhythmKingItemClass.blockItemSettingsOtherArray[0][1], 1);
                _this.setChildIndex(GameRhythmKingItemClass.comboOtherType, _this.numChildren + 1);
                _this.scoreEffectManager(GameRhythmKingItemClass.blockItemSettingsOtherArray[0][1], 1);
            }
            switch (who) {
                case 0:
                    if (_this.youRoleRotation >= 3) {
                        _this.youRoleRotation = 0;
                    }
                    var r = void 0;
                    r = _this.rotationManager(_this.youRoleRotation);
                    _this.youRoleRotation += 1;
                    _this.setChildIndex(GameRhythmKingItemClass.jumpRoleYou.armature, _this.numChildren + 4);
                    egret.Tween.removeTweens(GameRhythmKingItemClass.jumpRoleYou.armature);
                    var twRoleYou = egret.Tween.get(GameRhythmKingItemClass.jumpRoleYou.armature);
                    twRoleYou.to({ y: (GameRhythmKingItemClass.jumpRoleYou.armature.y - 40) }, 20);
                    twRoleYou.to({ y: (1136 - GameRhythmKingItemClass.blockYouHeight + 40 + 2 * GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockArray[1])), rotation: r }, 30);
                    break;
                case 1:
                    if (_this.otherRoleRotation >= 3) {
                        _this.otherRoleRotation = 0;
                    }
                    var _r = void 0;
                    _r = _this.rotationManager(_this.otherRoleRotation);
                    _this.otherRoleRotation += 1;
                    _this.setChildIndex(GameRhythmKingItemClass.jumpRoleOther.armature, _this.numChildren + 4);
                    egret.Tween.removeTweens(GameRhythmKingItemClass.jumpRoleOther.armature);
                    var twRoleOther = egret.Tween.get(GameRhythmKingItemClass.jumpRoleOther.armature);
                    twRoleOther.to({ y: (GameRhythmKingItemClass.jumpRoleOther.armature.y - 40) }, 20);
                    twRoleOther.to({ y: (1136 - GameRhythmKingItemClass.blockOtherHeight + 40 + 2 * GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockOtherArray[1])), rotation: _r }, 30);
                    break;
            }
            var tw = egret.Tween.get(item);
            tw.to({ y: ending }, 100);
            switch (who) {
                case 0:
                    App.TimerManager.doTimer(30, 1, function () {
                        GameRhythmKingItemClass.sparkLeft.x = 147.5;
                        GameRhythmKingItemClass.sparkLeft.y = ending + GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockArray[1]);
                        GameRhythmKingItemClass.sparkLeft.alpha = 1;
                        App.TimerManager.doTimer(65, 1, function () {
                            GameRhythmKingItemClass.sparkLeft.alpha = 0;
                        }, _this);
                    }, _this);
                    break;
                case 1:
                    App.TimerManager.doTimer(30, 1, function () {
                        GameRhythmKingItemClass.sparkRight.x = 492.5;
                        GameRhythmKingItemClass.sparkRight.y = ending + GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockOtherArray[1]);
                        GameRhythmKingItemClass.sparkRight.alpha = 1;
                        App.TimerManager.doTimer(65, 1, function () {
                            GameRhythmKingItemClass.sparkRight.alpha = 0;
                        }, _this);
                    }, _this);
                    break;
            }
            tw.call(function () {
                switch (who) {
                    case 0:
                        if (GameRhythmKingItemClass.blockYouHeight > 400) {
                            GameRhythmKingItemClass.blockArray.forEach(function (element) {
                                var tw = egret.Tween.get(element);
                                tw.to({ y: (element.y + GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockArray[0].height)) }, 50);
                            });
                            switch (GameRhythmKingItemClass.blockArray[0].height) {
                                case 132:
                                    GameRhythmKingItemClass.blockYouHeight -= 43;
                                    break;
                                case 110:
                                    GameRhythmKingItemClass.blockYouHeight -= 21;
                                    break;
                                case 99:
                                    GameRhythmKingItemClass.blockYouHeight -= 10;
                                    break;
                            }
                            GameRhythmKingItemClass.jumpRoleYou.armature.y += GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockArray[0].height);
                            _this.removeChild(GameRhythmKingItemClass.blockArray[0]);
                            GameRhythmKingItemClass.blockArray.shift();
                        }
                        // // console.log(GameRhythmKingItemClass.blockYouHeight, 1136 - GameRhythmKingItemClass.blockYouHeight);
                        break;
                    case 1:
                        if (GameRhythmKingItemClass.blockOtherHeight > 400) {
                            GameRhythmKingItemClass.blockOtherArray.forEach(function (element) {
                                var tw = egret.Tween.get(element);
                                tw.to({ y: (element.y + GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockOtherArray[0].height)) }, 50);
                            });
                            switch (GameRhythmKingItemClass.blockOtherArray[0].height) {
                                case 132:
                                    GameRhythmKingItemClass.blockOtherHeight -= 43;
                                    break;
                                case 110:
                                    GameRhythmKingItemClass.blockOtherHeight -= 21;
                                    break;
                                case 99:
                                    GameRhythmKingItemClass.blockOtherHeight -= 10;
                                    break;
                            }
                            GameRhythmKingItemClass.jumpRoleOther.armature.y += GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockOtherArray[0].height);
                            _this.removeChild(GameRhythmKingItemClass.blockOtherArray[0]);
                            GameRhythmKingItemClass.blockOtherArray.shift();
                        }
                        break;
                }
                // // console.log("arrived!")
            });
        };
        _this.rotationManager = function (num) {
            var rotation = 0;
            switch (num) {
                case 0:
                    rotation = 15;
                    break;
                case 1:
                    rotation = 0;
                    break;
                case 2:
                    rotation = 345;
                    break;
            }
            return rotation;
        };
        _this.blockManager = function (who, type) {
            var block = new egret.Bitmap();
            var blockEffectiveHeight = 0;
            switch (type) {
                case "perfect":
                    block = AssetManager.getBitmap("RK_block_perfect_png", true, false);
                    blockEffectiveHeight = 43;
                    break;
                case "good":
                    block = AssetManager.getBitmap("RK_block_sliver_png", true, false);
                    blockEffectiveHeight = 21;
                    break;
                case "normal":
                    block = AssetManager.getBitmap("RK_block_normal_png", true, false);
                    blockEffectiveHeight = 10;
                    break;
            }
            // block.anchorOffsetY = block.height;
            switch (who) {
                case 0:// yourself
                    _this.addBlock(block, 0, blockEffectiveHeight, type);
                    GameRhythmKingItemClass.blockItemSettingsArray.shift();
                    break;
                case 1:// other
                    _this.addBlock(block, 1, blockEffectiveHeight, type);
                    GameRhythmKingItemClass.blockItemSettingsOtherArray.shift();
                    break;
            }
        };
        /**
         * game progress manager
         */
        _this.gameProgressManager = function () {
            if (GameRhythmKingItemClass.usingSetting.length <= GameRhythmKingItemClass.rhythmSumPast) {
                // // console.log(GameRhythmKingItemClass.usingSetting.length, GameRhythmKingItemClass.rhythmSumPast);
                egret.startTick(_this.endTick, _this);
                App.TimerManager.doTimer(1000, 1, function () {
                    GameRhythmKingItemClass.gameOverState[0] = 1;
                    egret.stopTick(_this.tickLogic, _this);
                }, _this);
                //xxx
                if (GameRhythmKingLogic.isOffline == false) {
                    GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_MUSIC_END);
                }
                else {
                    GameRhythmKingItemClass.gameOverState[1] = 1;
                }
            }
        };
        /**
         * Ripple effect manager
         */
        _this.rippleEffectManager = function () {
            if (GameRhythmKingItemClass.rippleArray.length > 0) {
                var rippleImg_1;
                var rippleTw_1;
                switch (GameRhythmKingItemClass.rippleArray[0]) {
                    default:
                        GameRhythmKingItemClass.rippleArray.shift();
                        rippleImg_1 = AssetManager.getBitmap("RK_road_beatCenterRipple_png", true, true);
                        rippleImg_1.x = 320;
                        rippleImg_1.y = 865;
                        rippleImg_1.alpha = 1;
                        _this.addChild(rippleImg_1);
                        rippleTw_1 = egret.Tween.get(rippleImg_1);
                        rippleTw_1.to({ scaleX: 3, scaleY: 3, alpha: 0 }, 1000);
                        rippleTw_1.call(function () {
                            _this.removeChild(rippleImg_1);
                            rippleImg_1 = null;
                            rippleTw_1 = null;
                        });
                        break;
                }
            }
        };
        /**
         * tick logic
         */
        _this.tickLogic = function (sec) {
            if (GameRhythmKingItemClass.runningSec == 0) {
                GameRhythmKingItemClass.backGroundMusicPlayer.play(GameRhythmKingItemClass.musicPlaying);
            }
            _this.judgePool();
            _this.itemMaker();
            _this.pointRecycleManager();
            GameRhythmKingLogic.compareTick();
            _this.blockTickManager();
            _this.comboTextManager();
            GameRhythmKingLogic.rhythmSumManager();
            _this.rippleEffectManager();
            _this.setChildIndex(GameRhythmKingItemClass.bottomSide, _this.numChildren);
            _this.setChildIndex(GameRhythmKingItemClass.alaphaMask, _this.numChildren + 2);
            if (_this.getChildByName("backBtn")) {
                _this.setChildIndex(_this.getChildByName("backBtn"), _this.numChildren + 3);
            }
            GameRhythmKingItemClass.runningSec += 1;
            _this.gameProgressManager();
            return true;
        };
        /**
         * judge pool
         */
        _this.judgePool = function () {
            GameRhythmKingItemClass.usingSetting.forEach(function (element) {
                if (GameRhythmKingItemClass.runningSec == (element - 15)) {
                    GameRhythmKingItemClass.judgeItem = element;
                }
            });
        };
        /**
         * recycle point
         */
        _this.pointRecycle = function () {
            if (GameRhythmKingLogic.itemCache.length > 30) {
                GameRhythmKingLogic.itemCache.forEach(function (element) {
                    _this.removeChild(element);
                });
                GameRhythmKingLogic.itemCache = [];
            }
        };
        /**
         * Rhythm items maker
         */
        _this.itemMaker = function () {
            GameRhythmKingItemClass.usingSetting.forEach(function (element) {
                if (element == (GameRhythmKingItemClass.runningSec + GameRhythmKingItemClass.speedSupplement)) {
                    var items = AssetManager.getBitmap("RK_beat_png", true, true);
                    items.x = 320;
                    items.y = 0;
                    _this.addChildAt(items, 9);
                    GameRhythmKingLogic.animationManager(items, [items.x, items.y], [items.x, 875], GameRhythmKingItemClass.speedSupplement, function () {
                        if (GameRhythmKingLogic.isOffline == true) {
                            GameRhythmKingLogic.AITick();
                        }
                        _this.pointRecycle();
                        GameRhythmKingItemClass.rhythmSumPast += 1;
                    });
                }
            });
        };
        /**
         * score effect manager
         */
        _this.scoreEffectManager = function (mode, who) {
            var scoreImg;
            // // console.log(mode);
            switch (who) {
                case 0:
                    switch (mode) {
                        case "normal":
                            scoreImg = AssetManager.getBitmap("RK_point10_png", true, false);
                            break;
                        case "perfect":
                            scoreImg = AssetManager.getBitmap("RK_point30_png", true, false);
                            break;
                        case "good":
                            scoreImg = AssetManager.getBitmap("RK_point20_png", true, false);
                            break;
                        case "lose":
                            break;
                    }
                    scoreImg.x = 138.5;
                    scoreImg.y = 230;
                    break;
                case 1:
                    switch (mode) {
                        case "normal":
                            scoreImg = AssetManager.getBitmap("RK_point10_png", true, false);
                            break;
                        case "perfect":
                            scoreImg = AssetManager.getBitmap("RK_point30_png", true, false);
                            break;
                        case "good":
                            scoreImg = AssetManager.getBitmap("RK_point20_png", true, false);
                            break;
                        case "lose":
                            break;
                    }
                    scoreImg.x = 500;
                    scoreImg.y = 230;
                    break;
            }
            _this.addChild(scoreImg);
            var tw = egret.Tween.get(scoreImg);
            tw.to({ scaleX: 1.3, scaleY: 1.3 }, 200);
            tw.to({ scaleX: 1, scaleY: 1 }, 300);
            tw.to({ y: 150, alpha: 0.1, scaleX: 0.8, scaleY: 0.8 }, 1000);
            tw.call(function () {
                _this.removeChild(scoreImg);
            });
        };
        /**
         * combo text manager
         */
        _this.comboTextManager = function () {
            if (GameRhythmKingItemClass.comboYou >= 2) {
                GameRhythmKingItemClass.comboYouText.alpha = 1;
                GameRhythmKingItemClass.comboYouImage.alpha = 1;
                GameRhythmKingItemClass.comboYouText.text = GameRhythmKingItemClass.comboYou.toString();
            }
            else if (GameRhythmKingItemClass.comboYou < 2) {
                GameRhythmKingItemClass.comboYouText.alpha = 0;
                GameRhythmKingItemClass.comboYouImage.alpha = 0;
            }
            if (GameRhythmKingItemClass.comboOther >= 2) {
                GameRhythmKingItemClass.comboOtherText.alpha = 1;
                GameRhythmKingItemClass.comboOtherImage.alpha = 1;
                GameRhythmKingItemClass.comboOtherText.text = GameRhythmKingItemClass.comboOther.toString();
            }
            else if (GameRhythmKingItemClass.comboOther < 2) {
                GameRhythmKingItemClass.comboOtherText.alpha = 0;
                GameRhythmKingItemClass.comboOtherImage.alpha = 0;
            }
        };
        _this.bitmapText = function (font) {
            GameRhythmKingItemClass.comboYouText.font = font;
            GameRhythmKingItemClass.comboYouText.text = "0";
            GameRhythmKingItemClass.comboYouText.textAlign = egret.HorizontalAlign.CENTER;
            GameRhythmKingItemClass.comboYouText.x = 135;
            GameRhythmKingItemClass.comboYouText.y = 112;
            GameRhythmKingItemClass.comboYouText.letterSpacing = -30;
            GameRhythmKingItemClass.comboYouText.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.comboYouText);
            GameRhythmKingItemClass.comboOtherText.font = font;
            GameRhythmKingItemClass.comboOtherText.text = "0";
            GameRhythmKingItemClass.comboOtherText.textAlign = egret.HorizontalAlign.CENTER;
            GameRhythmKingItemClass.comboOtherText.x = 509;
            GameRhythmKingItemClass.comboOtherText.y = 112;
            GameRhythmKingItemClass.comboOtherText.letterSpacing = -30;
            GameRhythmKingItemClass.comboOtherText.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.comboOtherText);
        };
        _this.whitebitmapText = function (font) {
            GameRhythmKingItemClass.whiteFont = font;
        };
        /**
         * message deal
         */
        _this.messageDeal = function (data) {
            // // console.log(App.CurrChatId);
            var cmdString;
            cmdString = data.event.split("|");
            if (cmdString[0] == GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS) {
                if (App.CurrChatId.split("_")[0] == data.userId) {
                    GameRhythmKingItemClass.choice = parseInt(cmdString[1]);
                    // console.log("get settings : " + cmdString[1]);
                }
            }
            else {
                if (data.userId == DataCenter.instance.user.id) {
                    return;
                }
                switch (cmdString[0]) {
                    case GameRhythmKingEventClass.EVEVT_READY:
                        GameRhythmKingItemClass.readyState[1] = 1;
                        break;
                    case GameRhythmKingEventClass.EVENT_PER:
                        GameRhythmKingLogic.sunShineOtherManager();
                        GameRhythmKingItemClass.rhythmOtherPast += 1;
                        GameRhythmKingItemClass.comboOther += 1;
                        if (GameRhythmKingItemClass.comboOther > GameRhythmKingItemClass.highestOtherCombo) {
                            GameRhythmKingItemClass.highestOtherCombo = GameRhythmKingItemClass.comboOther;
                        }
                        GameRhythmKingItemClass.perNumOther += 1;
                        GameRhythmKingItemClass.pointOtherNumber += (30 + GameRhythmKingItemClass.comboOther);
                        GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
                        GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "perfect"]);
                        break;
                    case GameRhythmKingEventClass.EVENT_GOOD:
                        GameRhythmKingLogic.sunShineOtherManager();
                        GameRhythmKingItemClass.rhythmOtherPast += 1;
                        GameRhythmKingItemClass.comboOther += 1;
                        if (GameRhythmKingItemClass.comboOther > GameRhythmKingItemClass.highestOtherCombo) {
                            GameRhythmKingItemClass.highestOtherCombo = GameRhythmKingItemClass.comboOther;
                        }
                        GameRhythmKingItemClass.goodNumOther += 1;
                        GameRhythmKingItemClass.pointOtherNumber += (20 + GameRhythmKingItemClass.comboOther);
                        GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
                        GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "good"]);
                        break;
                    case GameRhythmKingEventClass.EVENT_NOR:
                        GameRhythmKingLogic.sunShineOtherManager();
                        GameRhythmKingItemClass.rhythmOtherPast += 1;
                        GameRhythmKingItemClass.comboOther = 0;
                        GameRhythmKingItemClass.norNumOther += 1;
                        GameRhythmKingItemClass.pointOtherNumber += (10 + GameRhythmKingItemClass.comboOther);
                        GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
                        GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "normal"]);
                        break;
                    case GameRhythmKingEventClass.EVENT_LOSE:
                        GameRhythmKingLogic.sunShineOtherManager();
                        GameRhythmKingItemClass.comboOther = 0;
                        GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
                        GameRhythmKingLogic.displayManager("lose", 1);
                        GameRhythmKingMainScene.loseBlockManager(1);
                        break;
                    case GameRhythmKingEventClass.EVENT_MUSIC_END:
                        GameRhythmKingItemClass.gameOverState[1] = 1;
                        break;
                }
            }
        };
        _this.readyTick = function () {
            // console.log(GameRhythmKingLogic.isOffline);
            if (GameRhythmKingLogic.isOffline == false) {
                // console.log("ready state: " + GameRhythmKingItemClass.readyState[0], GameRhythmKingItemClass.readyState[1]);
                if (GameRhythmKingItemClass.usingSetting.length > 0 && GameRhythmKingItemClass.gameLevel != 0 && GameRhythmKingItemClass.rhythmSumNum != 0) {
                    // console.log("time to go!");
                    App.TimerManager.doTimer(1000, 1, function () {
                        _this.waitingSceneManager("remove");
                    }, _this);
                    egret.stopTick(_this.readyTick, _this);
                    return false;
                }
                if (GameRhythmKingItemClass.readyState[0] == 1 && GameRhythmKingItemClass.readyState[1] == 1) {
                    GameRhythmKingLogic.settingSwitcher(GameRhythmKingItemClass.choice);
                    // GameRhythmKingLogic.settingSwitcher(2);
                }
            }
            else if (GameRhythmKingLogic.isOffline == true) {
                egret.stopTick(_this.readyTick, _this);
                GameRhythmKingLogic.settingSwitcher(GameRhythmKingLogic.randomChoose());
                App.TimerManager.doTimer(2500, 1, function () {
                    _this.waitingSceneManager("remove");
                }, _this);
            }
            return false;
        };
        _this.endTick = function () {
            if (GameRhythmKingLogic.isOffline == true) {
                GameRhythmKingItemClass.gameOverState[1] = 1;
            }
            // console.log(GameRhythmKingItemClass.gameOverState[0], GameRhythmKingItemClass.gameOverState[1]);
            if (GameRhythmKingItemClass.gameOverState[0] == 1 && GameRhythmKingItemClass.gameOverState[1] == 1) {
                // console.log("both side has go end!");
                egret.stopTick(_this.endTick, _this);
                App.TimerManager.doTimer(500, 1, function () {
                    _this.showResult();
                }, _this);
            }
            return false;
        };
        _this.showResult = function () {
            _this.addChild(GameRhythmKingItemClass.waitingSceneMask);
            _this.setChildIndex(GameRhythmKingItemClass.waitingSceneMask, _this.numChildren);
            GameRhythmKingItemClass.waitingSceneMask.alpha = 0.9;
            _this.removeChild(GameRhythmKingItemClass.alaphaMask);
            GameRhythmKingItemClass.resultYouBoard = AssetManager.getBitmap("RK_resultBlock_png", true, true);
            GameRhythmKingItemClass.resultYouBoard.x = 135;
            GameRhythmKingItemClass.resultYouBoard.y = 665;
            _this.addChild(GameRhythmKingItemClass.resultYouBoard);
            GameRhythmKingItemClass.resultOtherBoard = AssetManager.getBitmap("RK_resultBlock_png", true, true);
            GameRhythmKingItemClass.resultOtherBoard.x = 505;
            GameRhythmKingItemClass.resultOtherBoard.y = 665;
            _this.addChild(GameRhythmKingItemClass.resultOtherBoard);
            var youScore = new egret.BitmapText();
            youScore.font = GameRhythmKingItemClass.whiteFont;
            youScore.text = GameRhythmKingItemClass.pointYouNumber.toString();
            youScore.textAlign = egret.HorizontalAlign.RIGHT;
            youScore.letterSpacing = -10;
            youScore.x = 135;
            youScore.y = 495;
            _this.addChild(youScore);
            GameRhythmKingItemClass.resultYouText.push(youScore);
            var youCombo = new egret.BitmapText();
            youCombo.font = GameRhythmKingItemClass.whiteFont;
            youCombo.text = GameRhythmKingItemClass.highestYouCombo.toString();
            youCombo.textAlign = egret.HorizontalAlign.RIGHT;
            youCombo.letterSpacing = -10;
            youCombo.x = 135;
            youCombo.y = 571;
            _this.addChild(youCombo);
            GameRhythmKingItemClass.resultYouText.push(youCombo);
            var youPer = new egret.BitmapText();
            youPer.font = GameRhythmKingItemClass.whiteFont;
            youPer.text = GameRhythmKingItemClass.perNumYou.toString();
            youPer.textAlign = egret.HorizontalAlign.RIGHT;
            youPer.letterSpacing = -10;
            youPer.x = 135;
            youPer.y = 643;
            _this.addChild(youPer);
            GameRhythmKingItemClass.resultYouText.push(youPer);
            var youGood = new egret.BitmapText();
            youGood.font = GameRhythmKingItemClass.whiteFont;
            youGood.text = GameRhythmKingItemClass.goodNumYou.toString();
            youGood.textAlign = egret.HorizontalAlign.RIGHT;
            youGood.letterSpacing = -10;
            youGood.x = 135;
            youGood.y = 721;
            _this.addChild(youGood);
            GameRhythmKingItemClass.resultYouText.push(youGood);
            var youNor = new egret.BitmapText();
            youNor.font = GameRhythmKingItemClass.whiteFont;
            youNor.text = GameRhythmKingItemClass.norNumYou.toString();
            youNor.textAlign = egret.HorizontalAlign.RIGHT;
            youNor.letterSpacing = -10;
            youNor.x = 135;
            youNor.y = 794;
            _this.addChild(youNor);
            GameRhythmKingItemClass.resultYouText.push(youNor);
            var otherScore = new egret.BitmapText();
            otherScore.font = GameRhythmKingItemClass.whiteFont;
            otherScore.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            otherScore.textAlign = egret.HorizontalAlign.RIGHT;
            otherScore.letterSpacing = -10;
            otherScore.x = 505;
            otherScore.y = 495;
            _this.addChild(otherScore);
            GameRhythmKingItemClass.resultYouText.push(otherScore);
            var otherCombo = new egret.BitmapText();
            otherCombo.font = GameRhythmKingItemClass.whiteFont;
            otherCombo.text = GameRhythmKingItemClass.highestOtherCombo.toString();
            otherCombo.textAlign = egret.HorizontalAlign.RIGHT;
            otherCombo.letterSpacing = -10;
            otherCombo.x = 505;
            otherCombo.y = 571;
            _this.addChild(otherCombo);
            GameRhythmKingItemClass.resultYouText.push(otherCombo);
            var otherPer = new egret.BitmapText();
            otherPer.font = GameRhythmKingItemClass.whiteFont;
            otherPer.text = GameRhythmKingItemClass.perNumOther.toString();
            otherPer.textAlign = egret.HorizontalAlign.RIGHT;
            otherPer.letterSpacing = -10;
            otherPer.x = 505;
            otherPer.y = 643;
            _this.addChild(otherPer);
            GameRhythmKingItemClass.resultYouText.push(otherPer);
            var otherGood = new egret.BitmapText();
            otherGood.font = GameRhythmKingItemClass.whiteFont;
            otherGood.text = GameRhythmKingItemClass.goodNumOther.toString();
            otherGood.textAlign = egret.HorizontalAlign.RIGHT;
            otherGood.letterSpacing = -10;
            otherGood.x = 505;
            otherGood.y = 721;
            _this.addChild(otherGood);
            GameRhythmKingItemClass.resultYouText.push(otherGood);
            var otherNor = new egret.BitmapText();
            otherNor.font = GameRhythmKingItemClass.whiteFont;
            otherNor.text = GameRhythmKingItemClass.norNumOther.toString();
            otherNor.textAlign = egret.HorizontalAlign.RIGHT;
            otherNor.letterSpacing = -10;
            otherNor.x = 505;
            otherNor.y = 794;
            _this.addChild(otherNor);
            GameRhythmKingItemClass.resultYouText.push(otherNor);
            var result = _this.rankCalculator();
            var rankYou = new egret.Bitmap();
            var rankOther = new egret.Bitmap();
            switch (result[0]) {
                case 1:
                    rankYou = AssetManager.getBitmap("RK_rankA_png", true, true);
                    break;
                case 2:
                    rankYou = AssetManager.getBitmap("RK_rankS_png", true, true);
                    break;
                case 3:
                    rankYou = AssetManager.getBitmap("RK_rankSS_png", true, true);
                    break;
                case 4:
                    rankYou = AssetManager.getBitmap("RK_rankSSS_png", true, true);
                    break;
            }
            switch (result[1]) {
                case 1:
                    rankOther = AssetManager.getBitmap("RK_rankA_png", true, true);
                    break;
                case 2:
                    rankOther = AssetManager.getBitmap("RK_rankS_png", true, true);
                    break;
                case 3:
                    rankOther = AssetManager.getBitmap("RK_rankSS_png", true, true);
                    break;
                case 4:
                    rankOther = AssetManager.getBitmap("RK_rankSSS_png", true, true);
                    break;
            }
            rankYou.x = 135;
            rankYou.y = 215;
            rankYou.alpha = 0;
            _this.addChild(rankYou);
            rankOther.x = 505;
            rankOther.y = 215;
            rankOther.alpha = 0;
            _this.addChild(rankOther);
            var tw = egret.Tween.get(rankYou);
            tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
            tw.to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.elasticInOut);
            var _tw = egret.Tween.get(rankOther);
            _tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
            _tw.to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.elasticInOut);
            _tw.call(function () {
                App.TimerManager.doTimer(2000, 1, function () {
                    if (GameRhythmKingItemClass.pointYouNumber > GameRhythmKingItemClass.pointOtherNumber) {
                        GameRhythmKingLogic.gameOver(3);
                    }
                    else if (GameRhythmKingItemClass.pointYouNumber < GameRhythmKingItemClass.pointOtherNumber) {
                        GameRhythmKingLogic.gameOver(1);
                    }
                    else {
                        GameRhythmKingLogic.gameOver(1);
                    }
                }, _this);
            });
        };
        _this.rankCalculator = function () {
            var result = [0, 0];
            var percentYou = (GameRhythmKingItemClass.goodNumYou + GameRhythmKingItemClass.perNumYou) / (GameRhythmKingItemClass.rhythmSumNum - 1);
            if (percentYou <= 0.5) {
                result[0] = 1;
            }
            else if (percentYou > 0.5 && percentYou <= 0.7) {
                result[0] = 2;
            }
            else if (percentYou > 0.7 && percentYou <= 0.9) {
                result[0] = 3;
            }
            else if (percentYou > 0.9) {
                result[0] = 4;
            }
            var percentOther = (GameRhythmKingItemClass.goodNumOther + GameRhythmKingItemClass.perNumOther) / (GameRhythmKingItemClass.rhythmSumNum - 1);
            if (percentOther <= 0.5) {
                result[1] = 1;
            }
            else if (percentOther > 0.5 && percentOther <= 0.7) {
                result[1] = 2;
            }
            else if (percentOther > 0.7 && percentOther <= 0.9) {
                result[1] = 3;
            }
            else if (percentOther > 0.9) {
                result[1] = 4;
            }
            return result;
        };
        /**
         * result deal
         */
        _this.resultDeal = function (data) {
            // console.log(data);
            egret.stopTick(_this.endTick, _this);
            egret.stopTick(_this.readyTick, _this);
            egret.stopTick(_this.tickLogic, _this);
            egret.stopTick(GameRhythmKingLogic.animationTick, _this);
            egret.stopTick(GameRhythmKingLogic.compareTick, _this);
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            // 发送游戏结果
            _this.popup("GameResult", null);
        };
        _this.waitingSceneManager = function (type) {
            switch (type) {
                case "add":
                    GameRhythmKingItemClass.waitingSceneMask = new egret.Shape();
                    GameRhythmKingItemClass.waitingSceneMask.graphics.beginFill(0x000000, 0.9);
                    GameRhythmKingItemClass.waitingSceneMask.graphics.drawRect(0, 0, 640, 1136);
                    GameRhythmKingItemClass.waitingSceneMask.graphics.endFill();
                    _this.addChild(GameRhythmKingItemClass.waitingSceneMask);
                    GameRhythmKingItemClass.waitingText = AssetManager.getBitmap("RK_waiting_png", true, true);
                    GameRhythmKingItemClass.waitingText.x = 320;
                    GameRhythmKingItemClass.waitingText.y = 800;
                    _this.addChild(GameRhythmKingItemClass.waitingText);
                    var soundTips = AssetManager.getBitmap("RK_soundTips_png", true, false);
                    soundTips.x = 320;
                    soundTips.y = 280;
                    soundTips.name = "soundTips";
                    _this.addChild(soundTips);
                    break;
                case "remove":
                    if (GameRhythmKingItemClass.waitingSceneMask) {
                        switch (GameRhythmKingItemClass.gameLevel) {
                            case 1:
                                var star = AssetManager.getBitmap("RK_stars_png", true, true);
                                star.x = 320;
                                star.y = 490;
                                GameRhythmKingItemClass.stars[0] = star;
                                _this.addChild(star);
                                break;
                            case 2:
                                var star2_1 = AssetManager.getBitmap("RK_stars_png", true, true);
                                star2_1.x = 260;
                                star2_1.y = 490;
                                GameRhythmKingItemClass.stars[0] = star2_1;
                                _this.addChild(star2_1);
                                var star2_2 = AssetManager.getBitmap("RK_stars_png", true, true);
                                star2_2.x = 380;
                                star2_2.y = 490;
                                GameRhythmKingItemClass.stars[1] = star2_2;
                                _this.addChild(star2_2);
                                break;
                            case 3:
                                var star3_1 = AssetManager.getBitmap("RK_stars_png", true, true);
                                star3_1.x = 213;
                                star3_1.y = 490;
                                GameRhythmKingItemClass.stars[0] = star3_1;
                                _this.addChild(star3_1);
                                var star3_2 = AssetManager.getBitmap("RK_stars_png", true, true);
                                star3_2.x = 320;
                                star3_2.y = 490;
                                GameRhythmKingItemClass.stars[1] = star3_2;
                                _this.addChild(star3_2);
                                var star3_3 = AssetManager.getBitmap("RK_stars_png", true, true);
                                star3_3.x = 426;
                                star3_3.y = 490;
                                GameRhythmKingItemClass.stars[2] = star3_3;
                                _this.addChild(star3_3);
                                break;
                        }
                        var waitingTextTw = egret.Tween.get(GameRhythmKingItemClass.waitingText);
                        waitingTextTw.to({ alpha: 0 }, 500);
                        var soundTipsTw = egret.Tween.get(_this.getChildByName("soundTips"));
                        soundTipsTw.to({ alpha: 0 }, 500);
                        GameRhythmKingItemClass.starBoard = AssetManager.getBitmap("RK_startBoard_png", true, true);
                        GameRhythmKingItemClass.starBoard.x = 320;
                        GameRhythmKingItemClass.starBoard.y = 490;
                        GameRhythmKingItemClass.starBoard.alpha = 0;
                        _this.addChild(GameRhythmKingItemClass.starBoard);
                        var starBoardTw = egret.Tween.get(GameRhythmKingItemClass.starBoard);
                        starBoardTw.to({ alpha: 1 }, 300);
                        starBoardTw.call(function () {
                            GameRhythmKingItemClass.stars.forEach(function (element) {
                                _this.addChild(element);
                            });
                        });
                        var maskTw = egret.Tween.get(GameRhythmKingItemClass.waitingSceneMask);
                        maskTw.to({ alpha: 0 }, 3000);
                        maskTw.call(function () {
                            GameRhythmKingItemClass.stars.forEach(function (element) {
                                _this.removeChild(element);
                            });
                            _this.removeChild(GameRhythmKingItemClass.starBoard);
                            _this.removeChild(GameRhythmKingItemClass.waitingSceneMask);
                            GameRhythmKingItemClass.gameReady.play();
                            _this.addChild(GameRhythmKingItemClass.gameReady);
                        });
                    }
                    break;
            }
        };
        _this.gameStart = function () {
            //游戏内事件返回
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, _this.messageDeal, _this);
            //结果返回
            App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, _this.resultDeal, _this);
            egret.startTick(_this.readyTick, _this);
            GameRhythmKingItemClass.backGroundLeft = AssetManager.getBitmap("RK_dynamicBackGround_jpg", false, false);
            GameRhythmKingItemClass.backGroundLeft.x = 0;
            GameRhythmKingItemClass.backGroundLeft.y = -863;
            GameRhythmKingItemClass.backGroundLeft.anchorOffsetX = 0;
            GameRhythmKingItemClass.backGroundLeft.anchorOffsetY = 0;
            _this.addChildAt(GameRhythmKingItemClass.backGroundLeft, 0);
            GameRhythmKingItemClass.backGroundRight = AssetManager.getBitmap("RK_dynamicBackGround_jpg", false, false);
            GameRhythmKingItemClass.backGroundRight.x = 320;
            GameRhythmKingItemClass.backGroundRight.y = -863;
            GameRhythmKingItemClass.backGroundRight.anchorOffsetX = 0;
            GameRhythmKingItemClass.backGroundRight.anchorOffsetY = 0;
            _this.addChildAt(GameRhythmKingItemClass.backGroundRight, 1);
            GameRhythmKingItemClass.backGroundLeft_ = AssetManager.getBitmap("RK_dynamicBackGround__jpg", false, false);
            GameRhythmKingItemClass.backGroundLeft_.x = 0;
            GameRhythmKingItemClass.backGroundLeft_.y = -2863;
            GameRhythmKingItemClass.backGroundLeft_.anchorOffsetX = 0;
            GameRhythmKingItemClass.backGroundLeft_.anchorOffsetY = 0;
            _this.addChildAt(GameRhythmKingItemClass.backGroundLeft_, 2);
            GameRhythmKingItemClass.backGroundRight_ = AssetManager.getBitmap("RK_dynamicBackGround__jpg", false, false);
            GameRhythmKingItemClass.backGroundRight_.x = 320;
            GameRhythmKingItemClass.backGroundRight_.y = -2863;
            GameRhythmKingItemClass.backGroundRight_.anchorOffsetX = 0;
            GameRhythmKingItemClass.backGroundRight_.anchorOffsetY = 0;
            _this.addChildAt(GameRhythmKingItemClass.backGroundRight_, 3);
            GameRhythmKingItemClass.sunShineYou = AssetManager.getBitmap("RK_sunShine_png", true, false);
            GameRhythmKingItemClass.sunShineYou.x = 135;
            GameRhythmKingItemClass.sunShineYou.y = 547;
            GameRhythmKingItemClass.sunShineYou.alpha = 0;
            _this.addChildAt(GameRhythmKingItemClass.sunShineYou, 4);
            GameRhythmKingItemClass.sunShineOther = AssetManager.getBitmap("RK_sunShine_png", true, false);
            GameRhythmKingItemClass.sunShineOther.x = 505;
            GameRhythmKingItemClass.sunShineOther.y = 547;
            GameRhythmKingItemClass.sunShineOther.alpha = 0;
            _this.addChildAt(GameRhythmKingItemClass.sunShineOther, 5);
            GameRhythmKingItemClass.rkLine = AssetManager.getBitmap("RK_road_normal_jpg", true, false);
            GameRhythmKingItemClass.rkLine.x = 320;
            GameRhythmKingItemClass.rkLine.y = 0;
            _this.addChildAt(GameRhythmKingItemClass.rkLine, 6);
            GameRhythmKingItemClass.rkLineMask = AssetManager.getBitmap("RK_road_normal_jpg", true, false);
            GameRhythmKingItemClass.rkLineMask.x = 320;
            GameRhythmKingItemClass.rkLineMask.y = 0;
            _this.addChildAt(GameRhythmKingItemClass.rkLineMask, 7);
            GameRhythmKingItemClass.pointBoardYou = AssetManager.getBitmap("RK_pointBoard_blue_png", false, false);
            GameRhythmKingItemClass.pointBoardYou.x = 36;
            GameRhythmKingItemClass.pointBoardYou.y = 23;
            _this.addChild(GameRhythmKingItemClass.pointBoardYou);
            GameRhythmKingItemClass.pointBoardOther = AssetManager.getBitmap("RK_pointBoard_red_png", false, false);
            GameRhythmKingItemClass.pointBoardOther.x = 398;
            GameRhythmKingItemClass.pointBoardOther.y = 23;
            _this.addChild(GameRhythmKingItemClass.pointBoardOther);
            GameRhythmKingItemClass.you = AssetManager.getBitmap("RK_you_png", false, false);
            GameRhythmKingItemClass.you.x = 22;
            GameRhythmKingItemClass.you.y = 16;
            _this.addChild(GameRhythmKingItemClass.you);
            GameRhythmKingItemClass.roadBatholith = AssetManager.getBitmap("RK_road_batholith_jpg", true, true);
            GameRhythmKingItemClass.roadBatholith.x = 320;
            GameRhythmKingItemClass.roadBatholith.y = 1027;
            _this.addChild(GameRhythmKingItemClass.roadBatholith);
            GameRhythmKingItemClass.roadBatholith.touchEnabled = true;
            GameRhythmKingItemClass.roadBeatCenter = AssetManager.getBitmap("RK_road_beatCenter_png", true, true);
            GameRhythmKingItemClass.roadBeatCenter.x = 320;
            GameRhythmKingItemClass.roadBeatCenter.y = 865;
            _this.addChildAt(GameRhythmKingItemClass.roadBeatCenter, 8);
            GameRhythmKingItemClass.pointYou.text = "0";
            GameRhythmKingItemClass.pointYou.type = egret.TextFieldType.DYNAMIC;
            GameRhythmKingItemClass.pointYou.textAlign = egret.HorizontalAlign.CENTER;
            GameRhythmKingItemClass.pointYou.x = 138.5;
            GameRhythmKingItemClass.pointYou.y = 52.5;
            GameRhythmKingItemClass.pointYou.anchorOffsetX = 67.5;
            GameRhythmKingItemClass.pointYou.anchorOffsetY = 17.5;
            GameRhythmKingItemClass.pointYou.width = 135;
            GameRhythmKingItemClass.pointYou.height = 48;
            GameRhythmKingItemClass.pointYou.size = 48;
            _this.addChild(GameRhythmKingItemClass.pointYou);
            GameRhythmKingItemClass.pointOther.text = "0";
            GameRhythmKingItemClass.pointOther.type = egret.TextFieldType.DYNAMIC;
            GameRhythmKingItemClass.pointOther.textAlign = egret.HorizontalAlign.CENTER;
            GameRhythmKingItemClass.pointOther.x = 500;
            GameRhythmKingItemClass.pointOther.y = 52.5;
            GameRhythmKingItemClass.pointOther.anchorOffsetX = 67.5;
            GameRhythmKingItemClass.pointOther.anchorOffsetY = 17.5;
            GameRhythmKingItemClass.pointOther.width = 135;
            GameRhythmKingItemClass.pointOther.height = 48;
            GameRhythmKingItemClass.pointOther.size = 48;
            _this.addChild(GameRhythmKingItemClass.pointOther);
            GameRhythmKingItemClass.comboType = AssetManager.getBitmap("RK_perfect_png", true, true);
            GameRhythmKingItemClass.comboType.x = 320;
            GameRhythmKingItemClass.comboType.y = 990;
            GameRhythmKingItemClass.comboType.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.comboType);
            GameRhythmKingItemClass.comboOtherType = AssetManager.getBitmap("RK_perfect_png", true, true);
            GameRhythmKingItemClass.comboOtherType.x = 320;
            GameRhythmKingItemClass.comboOtherType.y = 990;
            GameRhythmKingItemClass.comboOtherType.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.comboOtherType);
            GameRhythmKingItemClass.comboYouImage = AssetManager.getBitmap("RK_combo_png", true, true);
            GameRhythmKingItemClass.comboYouImage.x = 80;
            GameRhythmKingItemClass.comboYouImage.y = 170;
            GameRhythmKingItemClass.comboYouImage.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.comboYouImage);
            GameRhythmKingItemClass.comboOtherImage = AssetManager.getBitmap("RK_combo_png", true, true);
            GameRhythmKingItemClass.comboOtherImage.x = 450;
            GameRhythmKingItemClass.comboOtherImage.y = 170;
            GameRhythmKingItemClass.comboOtherImage.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.comboOtherImage);
            GameRhythmKingItemClass.sideFold = AssetManager.getBitmap("RK_progress_gray_png", false, false);
            GameRhythmKingItemClass.sideFold.anchorOffsetY = 944;
            GameRhythmKingItemClass.sideFold.x = 621;
            GameRhythmKingItemClass.sideFold.y = 1100;
            _this.addChild(GameRhythmKingItemClass.sideFold);
            GameRhythmKingItemClass.sideProgress = AssetManager.getBitmap("RK_progress_yellow_png", false, false);
            GameRhythmKingItemClass.sideProgress.anchorOffsetY = 944;
            GameRhythmKingItemClass.sideProgress.x = 621;
            GameRhythmKingItemClass.sideProgress.y = 1100;
            GameRhythmKingItemClass.sideProgress.scaleY = 0.001;
            _this.addChild(GameRhythmKingItemClass.sideProgress);
            var playData = DataCenter.instance.room.player;
            GameRhythmKingItemClass.otherRoleAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "toukuang");
            GameRhythmKingItemClass.otherRoleAvatar.armature.scaleX = 0.4;
            GameRhythmKingItemClass.otherRoleAvatar.armature.scaleY = 0.4;
            GameRhythmKingItemClass.otherRoleAvatar.armature.x = 610;
            GameRhythmKingItemClass.otherRoleAvatar.armature.y = 1100;
            _this.addChild(GameRhythmKingItemClass.otherRoleAvatar.armature);
            var myData = DataCenter.instance.user;
            GameRhythmKingItemClass.myRoleAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "toukuang");
            GameRhythmKingItemClass.myRoleAvatar.armature.scaleX = 0.4;
            GameRhythmKingItemClass.myRoleAvatar.armature.scaleY = 0.4;
            GameRhythmKingItemClass.myRoleAvatar.armature.x = 610;
            GameRhythmKingItemClass.myRoleAvatar.armature.y = 1100;
            _this.addChild(GameRhythmKingItemClass.myRoleAvatar.armature);
            GameRhythmKingItemClass.jumpRoleYou = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "dbxiaoren00_game7");
            GameRhythmKingItemClass.jumpRoleYou.armature.x = 147.5;
            GameRhythmKingItemClass.jumpRoleYou.armature.y = 1120;
            _this.addChild(GameRhythmKingItemClass.jumpRoleYou.armature);
            GameRhythmKingItemClass.jumpRoleOther = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "dbxiaoren00_game7");
            GameRhythmKingItemClass.jumpRoleOther.armature.x = 492.5;
            GameRhythmKingItemClass.jumpRoleOther.armature.y = 1120;
            _this.addChild(GameRhythmKingItemClass.jumpRoleOther.armature);
            GameRhythmKingItemClass.sparkLeft = AssetManager.getBitmap("RK_pat_1_png", true, false);
            GameRhythmKingItemClass.sparkLeft.alpha = 0;
            GameRhythmKingItemClass.sparkLeft.anchorOffsetY = 100;
            _this.addChild(GameRhythmKingItemClass.sparkLeft);
            GameRhythmKingItemClass.sparkRight = AssetManager.getBitmap("RK_pat_2_png", true, false);
            GameRhythmKingItemClass.sparkRight.alpha = 0;
            GameRhythmKingItemClass.sparkRight.anchorOffsetY = 100;
            _this.addChild(GameRhythmKingItemClass.sparkRight);
            GameRhythmKingItemClass.alaphaMask = AssetManager.getBitmap("RK_alphaMask_png", false, false);
            GameRhythmKingItemClass.alaphaMask.x = 0;
            GameRhythmKingItemClass.alaphaMask.y = 0;
            GameRhythmKingItemClass.alaphaMask.alpha = 0.1;
            _this.addChild(GameRhythmKingItemClass.alaphaMask);
            GameRhythmKingItemClass.alaphaMask.touchEnabled = true;
            GameRhythmKingItemClass.alaphaMask.addEventListener("touchTap", GameRhythmKingLogic.tap, _this);
            GameRhythmKingItemClass.bottomSide = AssetManager.getBitmap("RK_bottomSide_png", false, false);
            GameRhythmKingItemClass.bottomSide.x = 0;
            GameRhythmKingItemClass.bottomSide.y = 1136;
            GameRhythmKingItemClass.bottomSide.alpha = 1;
            _this.addChild(GameRhythmKingItemClass.bottomSide);
            GameRhythmKingItemClass.topSide = AssetManager.getBitmap("RK_bottomSide_png", false, false);
            GameRhythmKingItemClass.topSide.anchorOffsetY = 300;
            GameRhythmKingItemClass.topSide.x = 0;
            GameRhythmKingItemClass.topSide.y = 0;
            GameRhythmKingItemClass.topSide.alpha = 1;
            _this.addChild(GameRhythmKingItemClass.topSide);
            GameRhythmKingItemClass.loseBlockYou = AssetManager.getBitmap("RK_block_miss_png", true, true);
            GameRhythmKingItemClass.loseBlockYou.x = 147.5;
            GameRhythmKingItemClass.loseBlockYou.y = 300;
            GameRhythmKingItemClass.loseBlockYou.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.loseBlockYou);
            GameRhythmKingItemClass.loseBlockOther = AssetManager.getBitmap("RK_block_miss_png", true, true);
            GameRhythmKingItemClass.loseBlockOther.x = 492.5;
            GameRhythmKingItemClass.loseBlockOther.y = 300;
            GameRhythmKingItemClass.loseBlockOther.alpha = 0;
            _this.addChild(GameRhythmKingItemClass.loseBlockOther);
            _this.waitingSceneManager("add");
            RES.getResByUrl("resource/assets/games/game_RhythmKing/RK_comboFont.fnt", _this.bitmapText, _this, RES.ResourceItem.TYPE_FONT);
            RES.getResByUrl("resource/assets/games/game_RhythmKing/RK_whiteFont.fnt", _this.whitebitmapText, _this, RES.ResourceItem.TYPE_FONT);
            GameRhythmKingItemClass.keyPressSoundEffect = new SoundEffects();
            GameRhythmKingItemClass.keyPressSoundEffect.setVolume(0.3);
            if (_this.stage.stageHeight < 1136) {
                GameRhythmKingItemClass.multiple = (_this.stage.stageHeight / 1136);
                _this.scaleX = GameRhythmKingItemClass.multiple;
                _this.scaleY = GameRhythmKingItemClass.multiple;
                var nowWidth = 640 * GameRhythmKingItemClass.multiple;
                _this.x = (640 - nowWidth) / 2;
            }
            else if (_this.stage.stageHeight > 1136) {
                _this.y = (_this.stage.stageHeight - 1136) / 2;
            }
            GameRhythmKingItemClass.gameReady = new GameReady(function () {
                GameRhythmKingItemClass.backGroundMusicPlayer = new SoundEffects();
                GameRhythmKingItemClass.backGroundMusicPlayer.setVolume(1);
                egret.startTick(_this.tickLogic, _this);
                egret.startTick(GameRhythmKingLogic.compareTick, _this);
                egret.startTick(GameRhythmKingLogic.animationTick, _this);
                // console.log("start!");
                var block = AssetManager.getBitmap("RK_block_normal_png", true, false);
                var _block = AssetManager.getBitmap("RK_block_normal_png", true, false);
                _this.addBlock(block, 0, 43, "perfect");
                _this.addBlock(_block, 1, 43, "perfect");
                // 小米平台去掉退出按钮
                if (!App.IsXiaoMi && !App.IsWanba) {
                    var returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
                    returnToLastButton.y = 19;
                    returnToLastButton.name = "backBtn";
                    _this.addChild(returnToLastButton);
                    returnToLastButton.touchEnabled = true;
                    returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        _this.popup("GameSureLeave");
                    }, _this);
                }
            });
            GameRhythmKingItemClass.gameReady.x = 300;
            GameRhythmKingItemClass.gameReady.y = App.GameHeight / 2;
            GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS);
            GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVEVT_READY);
            GameRhythmKingItemClass.readyState[0] = 1;
        };
        return _this;
    }
    GameRhythmKingMainScene.prototype.init = function () {
        _super.prototype.init.call(this);
        GameRhythmKingEventClass.dispose();
        GameRhythmKingItemClass.dispose();
        GameRhythmKingLogic.dispose();
        GameRhythmKingSettingsClass.dispose();
        if (DataCenter.instance.room.IsAI) {
            GameRhythmKingLogic.isOffline = true;
        }
        this.gameStart();
        App.SoundManager.stopBg();
        // App.SoundManager.playBg("PR_music_normal_mp3");
    };
    GameRhythmKingMainScene.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        App.TimerManager.removeAll(this);
        egret.stopTick(this.endTick, this);
        egret.stopTick(this.readyTick, this);
        egret.stopTick(this.tickLogic, this);
        egret.stopTick(GameRhythmKingLogic.animationTick, this);
        egret.stopTick(GameRhythmKingLogic.compareTick, this);
        if (GameRhythmKingItemClass.backGroundMusicPlayer) {
            GameRhythmKingItemClass.backGroundMusicPlayer.stopSound(GameRhythmKingItemClass.musicPlaying);
        }
        if (GameRhythmKingItemClass.alaphaMask) {
            GameRhythmKingItemClass.alaphaMask.removeEventListener("touchTap", GameRhythmKingLogic.tap, this);
        }
        GameRhythmKingEventClass.dispose();
        GameRhythmKingItemClass.dispose();
        GameRhythmKingLogic.dispose();
        GameRhythmKingSettingsClass.dispose();
    };
    GameRhythmKingMainScene.effectiveHeight = function (type) {
        var blockEffectiveHeight = 0;
        switch (type) {
            case "perfect":
                blockEffectiveHeight = 43;
                break;
            case "good":
                blockEffectiveHeight = 21;
                break;
            case "normal":
                blockEffectiveHeight = 10;
                break;
        }
        return blockEffectiveHeight;
    };
    GameRhythmKingMainScene.loseBlockManager = function (who) {
        var tw;
        switch (who) {
            case 0:
                egret.Tween.removeTweens(GameRhythmKingItemClass.loseBlockYou);
                GameRhythmKingItemClass.loseBlockYou.y = 300;
                tw = egret.Tween.get(GameRhythmKingItemClass.loseBlockYou);
                GameRhythmKingItemClass.loseBlockYou.alpha = 1;
                break;
            case 1:
                egret.Tween.removeTweens(GameRhythmKingItemClass.loseBlockOther);
                GameRhythmKingItemClass.loseBlockOther.y = 300;
                tw = egret.Tween.get(GameRhythmKingItemClass.loseBlockOther);
                GameRhythmKingItemClass.loseBlockOther.alpha = 1;
                break;
        }
        tw.to({ y: 1136 - GameRhythmKingItemClass.blockYouHeight + 40 + 2 * GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockArray[1]) - 118 }, 100);
        tw.call(function () {
            switch (who) {
                case 0:
                    GameRhythmKingItemClass.loseBlockYou.alpha = 0;
                    GameRhythmKingItemClass.loseBlockYou.y = 300;
                    break;
                case 1:
                    GameRhythmKingItemClass.loseBlockOther.alpha = 0;
                    GameRhythmKingItemClass.loseBlockOther.y = 300;
                    break;
            }
        });
    };
    return GameRhythmKingMainScene;
}(State));
__reflect(GameRhythmKingMainScene.prototype, "GameRhythmKingMainScene");
var GameRhythmKingSettingsClass = (function () {
    function GameRhythmKingSettingsClass() {
    }
    GameRhythmKingSettingsClass.settings1 = [2, [32, 57, 86, 152, 181, 216, 286, 316, 350, 383, 419, 453, 475, 519, 549, 621, 652, 688, 721, 751, 783, 809, 887, 920, 953, 988, 1020, 1088, 1121, 1154, 1178, 1221, 1253, 1276, 1287, 1316, 1352, 1383, 1418, 1451, 1478, 1518, 1549, 1567, 1616, 1653, 1679, 1703, 1749, 1785, 1809, 1850, 1877, 1919, 1951, 1988, 2019, 2052, 2084, 2117, 2152, 2185, 2218, 2253, 2287, 2321, 2351, 2384]];
    GameRhythmKingSettingsClass.settings2 = [2, [47, 79, 96, 121, 136, 149, 165, 177, 194, 248, 299, 315, 359, 373, 386, 402, 414, 429, 489, 520, 565, 579, 603, 638, 690, 704, 718, 733, 762, 794, 820, 831, 852, 863, 889, 922, 943, 954, 971, 983, 1013, 1042, 1059, 1071, 1086, 1097, 1128, 1145, 1176, 1189, 1205, 1218, 1246, 1265, 1297, 1308, 1329, 1364, 1399]];
    GameRhythmKingSettingsClass.settings3 = [3, [78, 108, 134, 158, 199, 212, 225, 252, 276, 302, 324, 347, 394, 406, 418, 443, 470, 494, 517, 541, 564, 589, 601, 613, 636, 661, 685, 708, 731, 755, 781, 795, 806, 828, 855, 879, 900, 924, 947, 973, 984, 997, 1022, 1045, 1069, 1092, 1116, 1139, 1165, 1178, 1189, 1212, 1239, 1263, 1286, 1309, 1333, 1357, 1368, 1382, 1405, 1431, 1455, 1477, 1501, 1524, 1547, 1560, 1571, 1595, 1621, 1644, 1669, 1692, 1703, 1715, 1725, 1738, 1763, 1791, 1812, 1835, 1861, 1887, 1908, 1931, 1955, 1981, 2005, 2027, 2050, 2074, 2085, 2096, 2107, 2120, 2131, 2169, 2197, 2223, 2245, 2268, 2291, 2313, 2339, 2365, 2390, 2412, 2436, 2461, 2480, 2499, 2518, 2530, 2559, 2581, 2606, 2628, 2653, 2671, 2702, 2727, 2749, 2773, 2796, 2821, 2844, 2869, 2893, 2916, 2941, 2965, 2987, 3012, 3038, 3062, 3086, 3110, 3132, 3156, 3182, 3207, 3228, 3252, 3277, 3303, 3327, 3351, 3375, 3397, 3421, 3433, 3444, 3456, 3468, 3492, 3517, 3541, 3563, 3586, 3612, 3637, 3657, 3684, 3708, 3732, 3756, 3780, 3802, 3814, 3826, 3837, 3850, 3875, 3901, 3925, 3949, 3973, 3997, 4021, 4044, 4068, 4092, 4117, 4138, 4164, 4190, 4212, 4236, 4261, 4285, 4308, 4320, 4355, 4382, 4405, 4424, 4455, 4479, 4502, 4515, 4533, 4552, 4575, 4596]];
    GameRhythmKingSettingsClass.dispose = function () {
    };
    return GameRhythmKingSettingsClass;
}());
__reflect(GameRhythmKingSettingsClass.prototype, "GameRhythmKingSettingsClass");
