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
var GameBangEventClass = (function () {
    function GameBangEventClass() {
    }
    GameBangEventClass.EVENT_READY = "ready";
    GameBangEventClass.EVENT_SENDSETTINGS = "sendSettings";
    GameBangEventClass.EVENT_SHOOT = "shoot";
    GameBangEventClass.EVENT_ISHOOT = "ishoot";
    GameBangEventClass.EVENT_RESULT = "result";
    /**
     * manager 4 local game message
     */
    GameBangEventClass.messageCenter = function (msg) {
        if (GameBangItemClass.isOffline == true) {
            return;
        }
        switch (msg) {
            case GameBangEventClass.EVENT_READY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_READY + "|" + new Date().getTime(), 1);
                break;
            case GameBangEventClass.EVENT_SENDSETTINGS:
                if (GameBangItemClass.isHost == true) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_SENDSETTINGS + "|" + GameBangLogic.makeSettings() + "|" + new Date().getTime(), 1);
                }
                else {
                    console.log("you are not the host,do not send settings.");
                }
                break;
            case GameBangEventClass.EVENT_SHOOT:
                var youTime = GameBangItemClass.restSec;
                GameBangItemClass.youShootSec = youTime;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_SHOOT + "|" + youTime.toString());
                break;
            case GameBangEventClass.EVENT_ISHOOT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_ISHOOT, 1);
                break;
            case GameBangEventClass.EVENT_RESULT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_RESULT + "|" + GameBangItemClass.youHealth.toString() + "|" + GameBangItemClass.otherHealth.toString());
                break;
            default:
                console.log("illegal message!");
                break;
        }
    };
    return GameBangEventClass;
}());
__reflect(GameBangEventClass.prototype, "GameBangEventClass");
var GameBangItemClass = (function (_super) {
    __extends(GameBangItemClass, _super);
    function GameBangItemClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameBangItemClass.isOffline = false;
    GameBangItemClass.turnNum = 1;
    GameBangItemClass.readyState = [0, 0];
    GameBangItemClass.youHealth = 5;
    GameBangItemClass.otherHealth = 5;
    GameBangItemClass.multiple = 1;
    GameBangItemClass.tipsState = [0, 0, 0, 0];
    GameBangItemClass.isHost = false;
    GameBangItemClass.restSec = 300;
    GameBangItemClass.gameSettings = [];
    GameBangItemClass.reference = false;
    GameBangItemClass.turnState = [0, 0]; // 0-null 1-win 2-lose
    // [0]杏、[1]蓝莓、[2]樱桃、[3]石榴、[4]葡萄、[5]桑仁
    GameBangItemClass.fruitItem = ["apricot", "blueberry", "cherry", "granada", "grape", "mulberry"];
    GameBangItemClass.AICanShoot = true;
    GameBangItemClass.youShootSec = -1;
    GameBangItemClass.otherShootSec = -1;
    GameBangItemClass.endArray = [];
    GameBangItemClass.tipsPosArray = [
        [
            [-210, 274], [10, 274]
        ], [
            [-210, 618], [10, 618]
        ], [
            [686, 274], [466, 274]
        ], [
            [686, 618], [466, 618]
        ]
    ];
    GameBangItemClass.tipsRolePosArray = [
        [
            [-220, 333], [0, 333]
        ], [
            [-220, 671], [0, 671]
        ], [
            [640, 333], [418, 333]
        ], [
            [640, 671], [418, 671]
        ]
    ];
    GameBangItemClass.dispose = function () {
        GameBangItemClass.backGround = undefined;
        GameBangItemClass.youRole = undefined;
        GameBangItemClass.otherRole = undefined;
        GameBangItemClass.btnBang = undefined;
        GameBangItemClass.isOffline = false;
        GameBangItemClass.turnNum = 1;
        GameBangItemClass.readyState = [0, 0];
        GameBangItemClass.youHealth = 5;
        GameBangItemClass.youHealthBoard = undefined;
        GameBangItemClass.otherHealth = 5;
        GameBangItemClass.otherHealthBoard = undefined;
        GameBangItemClass.multiple = 1;
        GameBangItemClass.pkBorder = undefined;
        GameBangItemClass.headIcoLeft = undefined;
        GameBangItemClass.headIcoRight = undefined;
        GameBangItemClass.btnBackGround = undefined;
        GameBangItemClass.bangTip = undefined;
        GameBangItemClass.tipsRole_ul = undefined;
        GameBangItemClass.tipsRole_bl = undefined;
        GameBangItemClass.tipsRole_ur = undefined;
        GameBangItemClass.tipsRole_br = undefined;
        GameBangItemClass.tipsText_ul = undefined;
        GameBangItemClass.tipsText_bl = undefined;
        GameBangItemClass.tipsText_ur = undefined;
        GameBangItemClass.tipsText_br = undefined;
        GameBangItemClass.isHost = false;
        GameBangItemClass.restSec = 300;
        GameBangItemClass.youSmoke = undefined;
        GameBangItemClass.otherSmoke = undefined;
        GameBangItemClass.otherSoundEffect = undefined;
        GameBangItemClass.youSoundEffect = undefined;
        GameBangItemClass.backGroundSoundEffect = undefined;
        GameBangItemClass.gameSettings = [];
        GameBangItemClass.tipsState = [0, 0, 0, 0];
        GameBangItemClass.reference = false;
        GameBangItemClass.turnState = [0, 0];
        GameBangItemClass.AITimer = undefined;
        GameBangItemClass.thirdSoundEffect = undefined;
        GameBangItemClass.AICanShoot = true;
        GameBangItemClass.img5s = undefined;
        GameBangItemClass.fireLightL = undefined;
        GameBangItemClass.fireLightR = undefined;
        GameBangItemClass.youShootSec = -1;
        GameBangItemClass.otherShootSec = -1;
        GameBangItemClass.endArray = [];
    };
    return GameBangItemClass;
}(State));
__reflect(GameBangItemClass.prototype, "GameBangItemClass");
var GameBangLogic = (function (_super) {
    __extends(GameBangLogic, _super);
    function GameBangLogic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameBangLogic.gameOver = function (result) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    /**
     * reset the role
     */
    GameBangLogic.resetRole = function () {
        GameBangItemClass.otherRole.texture = AssetManager.getBitmap("BA_otherRole_png").texture;
        GameBangItemClass.youRole.texture = AssetManager.getBitmap("BA_youRole_png").texture;
    };
    /**
     * enable/disenable btnBang
     */
    GameBangLogic.btnBangManager = function (canUse) {
        switch (canUse) {
            case true:
                GameBangItemClass.btnBang.touchEnabled = true;
                break;
            case false:
                GameBangItemClass.btnBang.touchEnabled = false;
                break;
            default:
                console.log("illegal canUse!");
                break;
        }
    };
    /**
     * when a turn has gone end,dispose
     */
    GameBangLogic.turnDispose = function () {
        GameBangLogic.resetRole();
        GameBangItemClass.restSec = 300;
        GameBangItemClass.gameSettings = [];
        GameBangItemClass.tipsState = [0, 0, 0, 0];
        GameBangItemClass.reference = false;
        GameBangItemClass.turnState = [0, 0];
        GameBangItemClass.readyState = [0, 0];
        GameBangItemClass.btnBang.texture = AssetManager.getBitmap("BA_btnBang_png").texture;
    };
    GameBangLogic.resetTips = function () {
        var twArray = [
            GameBangItemClass.tipsRole_ul,
            GameBangItemClass.tipsRole_bl,
            GameBangItemClass.tipsRole_ur,
            GameBangItemClass.tipsRole_br,
            GameBangItemClass.tipsText_ul,
            GameBangItemClass.tipsText_bl,
            GameBangItemClass.tipsText_ur,
            GameBangItemClass.tipsText_br
        ];
        try {
            twArray.forEach(function (element) {
                egret.Tween.removeTweens(element);
                element.alpha = 0;
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    /**
     * manager 4 shooting tips
     * pos:1-ul 2-bl 3-ur 4-br
     * item:1-bang 2-deng 3-deng
     */
    GameBangLogic.showShootingTips = function (pos, item) {
        if (item == 0) {
            GameBangItemClass.reference = true;
        }
        var itemSettings = ["Bang", "Deng", "Boom", "Dang"];
        var tipsTextPos = [];
        var tipsRolePos = [];
        var isLeft = false;
        var aspect = "";
        var twItem;
        var _twItem;
        var soundName;
        GameBangItemClass.tipsState[pos] = 1;
        switch (pos) {
            case 0:
                tipsTextPos = GameBangItemClass.tipsPosArray[0];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[0];
                twItem = GameBangItemClass.tipsText_ul;
                _twItem = GameBangItemClass.tipsRole_ul;
                isLeft = true;
                break;
            case 1:
                tipsTextPos = GameBangItemClass.tipsPosArray[1];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[1];
                twItem = GameBangItemClass.tipsText_bl;
                _twItem = GameBangItemClass.tipsRole_bl;
                isLeft = true;
                break;
            case 2:
                tipsTextPos = GameBangItemClass.tipsPosArray[2];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[2];
                twItem = GameBangItemClass.tipsText_ur;
                _twItem = GameBangItemClass.tipsRole_ur;
                isLeft = false;
                break;
            case 3:
                tipsTextPos = GameBangItemClass.tipsPosArray[3];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[3];
                twItem = GameBangItemClass.tipsText_br;
                _twItem = GameBangItemClass.tipsRole_br;
                isLeft = false;
                break;
            default:
                console.log("illegal pos! num: " + pos);
                break;
        }
        try {
            twItem.alpha = 1;
            _twItem.alpha = 1;
            egret.Tween.removeTweens(twItem);
            egret.Tween.removeTweens(_twItem);
            twItem.x = tipsTextPos[0][0];
            twItem.y = tipsTextPos[0][1];
            _twItem.x = tipsRolePos[0][0];
            _twItem.y = tipsRolePos[0][1];
        }
        catch (error) {
            console.log(error);
        }
        switch (isLeft) {
            case false:
                aspect = "R";
                break;
            case true:
                aspect = "L";
                break;
            default:
                console.log("illegal aspect!");
                break;
        }
        switch (item) {
            case 0:
                GameBangItemClass.reference = true;
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_BANG_png", false, false).texture;
                soundName = "BA_bang_mp3";
                break;
            case 1:
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_DENG_png", false, false).texture;
                soundName = "BA_deng_mp3";
                break;
            case 2:
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_BOOM_png", false, false).texture;
                soundName = "BA_boom_mp3";
                break;
            case 3:
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_DANG_png", false, false).texture;
                soundName = "BA_dang_mp3";
                break;
            default:
                console.log("illegal item!");
                break;
        }
        var tw = egret.Tween.get(twItem);
        tw.to({ x: tipsTextPos[1][0], y: tipsTextPos[1][1] }, 250);
        tw.to({ x: tipsTextPos[1][0], y: tipsTextPos[1][1] }, 800);
        tw.to({ x: tipsTextPos[0][0], y: tipsTextPos[0][1] }, 250);
        tw.call(function () {
            tw = null;
        });
        var _tw = egret.Tween.get(_twItem);
        GameBangItemClass.youSoundEffect.play(soundName, true);
        _tw.to({ x: tipsRolePos[1][0], y: tipsRolePos[1][1] }, 250);
        // _tw.call(() => {
        //     GameBangItemClass.youSoundEffect.play(soundName, true);
        // });
        _tw.to({ x: tipsRolePos[1][0], y: tipsRolePos[1][1] }, 800);
        _tw.to({ x: tipsRolePos[0][0], y: tipsRolePos[0][1] }, 250);
        _tw.call(function () {
            GameBangItemClass.tipsState[pos] = 0;
            if (item == 0) {
                GameBangItemClass.reference = false;
            }
            _tw = null;
        });
    };
    /**
     * whether is the host
     */
    GameBangLogic.isHost = function () {
        if (GameBangItemClass.isOffline == true) {
            GameBangItemClass.isHost = true;
        }
        else {
            var str = App.CurrChatId.split("_");
            if (DataCenter.instance.user.id.toString() == str[0]) {
                GameBangItemClass.isHost = true;
            }
            else {
                GameBangItemClass.isHost = false;
            }
        }
    };
    /**
     * tips Pos manager
     */
    GameBangLogic.tipPosManager = function () {
        var temp = GameBangItemClass.tipsState;
        var array = [];
        for (var index = 0; index < temp.length; index++) {
            var element = temp[index];
            if (element == 0) {
                array.push(index);
            }
        }
        var random = App.RandomUtils.limitInteger(0, array.length - 1);
        return array[random];
    };
    /**
     * make game settings
     */
    GameBangLogic.makeSettings = function () {
        var settings = [
            [0, 1],
            [0, 1],
            [0, 1],
            [0, 1]
        ];
        var firstStep = Math.random();
        if (firstStep > 0 && firstStep <= 0.25) {
            settings[0][1] = 0;
        }
        else if (firstStep > 0.2 && firstStep <= 0.5) {
            settings[1][1] = 0;
        }
        else if (firstStep > 0.4 && firstStep <= 0.75) {
            settings[2][1] = 0;
        }
        else if (firstStep > 0.6 && firstStep <= 1) {
            settings[3][1] = 0;
        }
        for (var index = 0; index < 4; index++) {
            settings[index][0] = (index + 1) * 60 + App.RandomUtils.limitInteger(1, 59);
            if (settings[index][1] != 0) {
                settings[index][1] = App.RandomUtils.limitInteger(1, 3);
            }
        }
        var str = "";
        for (var index = 0; index < 4; index++) {
            for (var i = 0; i < 2; i++) {
                str += (settings[index][i] + "#");
            }
        }
        str = str.slice(0, str.length - 1);
        return str;
    };
    /**
     * decode settings
     */
    GameBangLogic.decodeSettings = function (settings) {
        var settingsArray = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ];
        var array = settings.split("#");
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            if (index % 2 == 0) {
                settingsArray[index / 2][0] = parseInt(element);
            }
            else {
                settingsArray[(index - 1) / 2][1] = parseInt(element);
            }
        }
        console.log("has get settings...");
        GameBangItemClass.gameSettings = settingsArray;
        console.log(settingsArray);
    };
    /**
     * random choose a fruit type
     */
    GameBangLogic.randomFruit = function () {
        var item = App.RandomUtils.randomArray(GameBangItemClass.fruitItem);
        var _item = App.RandomUtils.randomArray(GameBangItemClass.fruitItem);
        GameBangItemClass.youFruit.texture = AssetManager.getBitmap("BA_fruit_" + _item + "_png").texture;
        GameBangItemClass.otherFruit.texture = AssetManager.getBitmap("BA_fruit_" + item + "_png").texture;
        GameBangItemClass.youFruitBoom.texture = AssetManager.getBitmap("BA_boom_" + _item + "_png").texture;
        GameBangItemClass.otherFruitBoom.texture = AssetManager.getBitmap("BA_boom_" + item + "_png").texture;
    };
    /**
     * fruit animation manager
     */
    GameBangLogic.fruitEffectManager = function (who) {
        switch (who) {
            case 0:
                GameBangItemClass.youFruit.alpha = 0;
                GameBangItemClass.youFruitBoom.scaleX = 0.01;
                GameBangItemClass.youFruitBoom.scaleY = 0.01;
                GameBangItemClass.youFruitBoom.alpha = 1;
                var tw = egret.Tween.get(GameBangItemClass.youFruitBoom);
                tw.to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.quadOut);
                App.TimerManager.doTimer(2500, 1, function () {
                    GameBangItemClass.youFruitBoom.alpha = 0;
                    GameBangItemClass.youFruitBoom.scaleX = 1;
                    GameBangItemClass.youFruitBoom.scaleY = 1;
                }, GameBangLogic);
                break;
            case 1:
                GameBangItemClass.otherFruit.alpha = 0;
                GameBangItemClass.otherFruitBoom.scaleX = 0.01;
                GameBangItemClass.otherFruitBoom.scaleY = 0.01;
                GameBangItemClass.otherFruitBoom.alpha = 1;
                var _tw = egret.Tween.get(GameBangItemClass.otherFruitBoom);
                _tw.to({ scaleX: 0.5, scaleY: 0.5 }, 300, egret.Ease.quadOut);
                App.TimerManager.doTimer(2500, 1, function () {
                    GameBangItemClass.otherFruitBoom.alpha = 0;
                    GameBangItemClass.otherFruitBoom.scaleX = 0.5;
                    GameBangItemClass.otherFruitBoom.scaleY = 0.5;
                }, GameBangLogic);
                break;
            default:
                console.log("illegal fruit effect num!");
                break;
        }
    };
    /**
     * random bullet hole
     */
    GameBangLogic.randomBulletHole = function () {
        var randomArea = App.RandomUtils.limitInteger(0, 2);
        var x, y;
        switch (randomArea) {
            case 0:
                x = App.RandomUtils.limitInteger(0, 150);
                y = App.RandomUtils.limitInteger(455, 845);
                break;
            case 1:
                x = App.RandomUtils.limitInteger(490, 640);
                y = App.RandomUtils.limitInteger(455, 845);
                break;
            case 2:
                x = App.RandomUtils.limitInteger(215, 425);
                y = App.RandomUtils.limitInteger(470, 535);
                break;
            default:
                console.log("illegal randomArea!");
                break;
        }
        var bulletHole = AssetManager.getBitmap("BA_groundHole_png", true, true);
        bulletHole.x = x;
        bulletHole.y = y;
        GameBangMainScene.instance.addChildAt(bulletHole, 2);
    };
    return GameBangLogic;
}(State));
__reflect(GameBangLogic.prototype, "GameBangLogic");
var GameBangMainScene = (function (_super) {
    __extends(GameBangMainScene, _super);
    function GameBangMainScene() {
        var _this = _super.call(this) || this;
        _this._announcement = new egret.DisplayObjectContainer();
        _this.hasRun = false;
        /**
         * shockEffect manager
         */
        _this.shockEffect = function (staticItem, interval, time, pxRange, fastenPxRange, effectX, effectY, loopEffect, resetPos) {
            if (effectX === void 0) { effectX = true; }
            if (effectY === void 0) { effectY = true; }
            if (loopEffect === void 0) { loopEffect = false; }
            if (resetPos === void 0) { resetPos = true; }
            var orX = staticItem.x;
            var orY = staticItem.y;
            var symbol = [-1, 1];
            var xSymbol = App.RandomUtils.randomArray(symbol);
            var ySymbol = App.RandomUtils.randomArray(symbol);
            var _pxXRange = App.RandomUtils.limitInteger(0, pxRange);
            var _pxYRange = App.RandomUtils.limitInteger(0, pxRange);
            var tw = egret.Tween.get(staticItem, { loop: true });
            var xNum, yNum;
            App.TimerManager.doTimer(time, 1, function () {
                egret.Tween.removeTweens(staticItem);
                staticItem.x = orX;
                staticItem.y = orY;
            }, _this);
            var ifEffect = function () {
                switch (loopEffect) {
                    case true:
                        if (xSymbol == 1) {
                            xSymbol = -1;
                        }
                        else {
                            xSymbol = 1;
                        }
                        if (ySymbol == 1) {
                            ySymbol = -1;
                        }
                        else {
                            ySymbol = 1;
                        }
                        break;
                    case false:
                        xSymbol = App.RandomUtils.randomArray(symbol);
                        ySymbol = App.RandomUtils.randomArray(symbol);
                        break;
                }
                if (effectX == true) {
                    xNum = (orX + xSymbol * fastenPxRange + xSymbol * _pxXRange);
                }
                else {
                    xNum = orX;
                }
                if (effectY == true) {
                    yNum = (orY + xSymbol * fastenPxRange + ySymbol * _pxYRange);
                }
                else {
                    yNum = orY;
                }
            };
            ifEffect();
            tw.to({ x: xNum, y: yNum }, interval);
            tw.call(function () {
                if (resetPos == true) {
                    staticItem.x = orX;
                    staticItem.y = orY;
                }
                _pxXRange = App.RandomUtils.limitInteger(0, pxRange);
                _pxYRange = App.RandomUtils.limitInteger(0, pxRange);
                ifEffect();
            });
        };
        /**
         * turn manager
         */
        _this.turnManager = function () {
            App.TimerManager.remove(_this.otherShootJudge, _this);
            if (_this.screen) {
                _this.screen.alpha = 0;
            }
            GameBangItemClass.fireLightL.alpha = 0;
            GameBangItemClass.fireLightR.alpha = 0;
            GameBangItemClass.youFruit.alpha = 0;
            GameBangItemClass.otherFruit.alpha = 0;
            GameBangItemClass.youFruitBoom.alpha = 0;
            GameBangItemClass.otherFruitBoom.alpha = 0;
            if (_this.screen) {
                _this.screen.alpha = 0;
            }
            App.SoundManager.stopBg();
            App.SoundManager.playBg("BA_bgm_w8ToShoot_mp3");
            if (GameBangItemClass.turnNum == 1) {
                _this.firstStartEffectManager(function () {
                    _this.betweenFieldEffectManager(function () {
                        GameBangLogic.randomFruit();
                        GameBangItemClass.youFruit.alpha = 1;
                        GameBangItemClass.otherFruit.alpha = 1;
                        egret.startTick(_this.mainTick, _this);
                        if (GameBangItemClass.isOffline == true) {
                            GameBangItemClass.AICanShoot = true;
                            if (App.CurrGameAiLevel < 4) {
                                App.TimerManager.doTimer(500 + (Math.random() * 3500), 1, _this.otherShootJudge, _this);
                            }
                        }
                        GameBangItemClass.btnBang.touchEnabled = true;
                    });
                });
            }
            else {
                _this.betweenFieldEffectManager(function () {
                    GameBangLogic.randomFruit();
                    GameBangItemClass.youFruit.alpha = 1;
                    GameBangItemClass.otherFruit.alpha = 1;
                    egret.startTick(_this.mainTick, _this);
                    if (GameBangItemClass.isOffline == true) {
                        GameBangItemClass.AICanShoot = true;
                        if (App.CurrGameAiLevel < 4) {
                            App.TimerManager.doTimer(500 + (Math.random() * 3500), 1, _this.otherShootJudge, _this);
                        }
                    }
                    GameBangItemClass.btnBang.touchEnabled = true;
                });
            }
            GameBangItemClass.readyState = [0, 0];
            console.log("第" + GameBangItemClass.turnNum.toString() + "回合开始！");
            var healthArray = ["youHealth_1", "youHealth_2", "youHealth_3", "youHealth_4", "youHealth_5", "otherHealth_1", "otherHealth_2", "otherHealth_3", "otherHealth_4", "otherHealth_5", "btnBang"];
            healthArray.forEach(function (element) {
                _this.getChildByName(element).alpha = 1;
            });
        };
        /**
         * shoot result deal
         */
        _this.shootResultDeal = function () {
            App.TimerManager.remove(_this.shootResultDeal, _this);
            var rightTime;
            GameBangItemClass.gameSettings.forEach(function (element) {
                if (element[1] == 0) {
                    rightTime = element[0];
                }
            });
            var youDvalue = GameBangItemClass.youShootSec - rightTime;
            var otherDvalue = GameBangItemClass.otherShootSec - rightTime;
            if (GameBangItemClass.youShootSec == -1) {
                // other win
                _this.otherShootJudge(false, true);
            }
            else if (GameBangItemClass.otherShootSec == -1) {
                // you win
                _this.shoot(true);
            }
            else {
                console.log("rightTime :" + rightTime.toString() + ", youDvalue :" + youDvalue.toString() + ", otherDvalue :" + otherDvalue.toString());
                if (youDvalue > otherDvalue) {
                    // other win
                    _this.otherShootJudge(false, true);
                }
                else if (youDvalue < otherDvalue) {
                    // you win
                    _this.shoot(true);
                }
                else {
                    if (parseInt(DataCenter.instance.user.id.toString()) > parseInt(DataCenter.instance.room.player.id.toString())) {
                        _this.shoot(true);
                    }
                    else {
                        _this.otherShootJudge(false, true);
                    }
                }
            }
            _this.hasRun = false;
        };
        _this.remoteShoot = function () {
            if (GameBangItemClass.isOffline == false) {
                GameBangEventClass.messageCenter(GameBangEventClass.EVENT_ISHOOT);
            }
            else {
                _this.preShoot();
            }
        };
        /**
         * btn "bang" callback pretreatment
         */
        _this.preShoot = function () {
            GameBangItemClass.btnBang.touchEnabled = false;
            console.log("you shoot in :" + GameBangItemClass.restSec.toString());
            GameBangEventClass.messageCenter(GameBangEventClass.EVENT_SHOOT);
            switch (GameBangItemClass.reference) {
                case true:
                    if (_this.hasRun == false) {
                        _this.hasRun = true;
                        App.TimerManager.doTimer(200, 1, function () {
                            _this.shootResultDeal();
                        }, _this);
                    }
                    break;
                case false:
                    _this.shoot();
                    break;
                default:
                    break;
            }
        };
        /**
         * btn "bang" callback
         */
        _this.shoot = function (bool) {
            if (bool === void 0) { bool = false; }
            GameBangItemClass.btnBang.texture = AssetManager.getBitmap("BA_btnBangPressed_png").texture;
            GameBangItemClass.btnBang.touchEnabled = false;
            console.log(GameBangItemClass.reference);
            App.SoundManager.playEffect("BA_gunEffect_mp3", true);
            GameBangItemClass.youRole.texture = AssetManager.getBitmap("BA_youRoleS_png").texture;
            if (GameBangItemClass.reference == true || bool == true) {
                // you hit other sucessful            
                if (GameBangItemClass.isOffline == true) {
                    App.TimerManager.remove(_this.otherShootJudge, _this);
                }
                GameBangItemClass.AICanShoot = false;
                App.SoundManager.stopBg();
                GameBangItemClass.youSoundEffect.play("BA_bgm_hitedOther_mp3", true);
                GameBangItemClass.thirdSoundEffect.play("BA_happyAndHitOther_mp3", true);
                GameBangItemClass.otherSoundEffect.play("BA_beHit_mp3", true);
                GameBangLogic.fruitEffectManager(1);
                _this.fireSmokeEffectManager(0);
                _this.shootEffectManager(0);
                if (GameBangItemClass.otherHealth >= 1) {
                    GameBangItemClass.otherHealth -= 1;
                    _this.healthEffectManager(1, GameBangItemClass.otherHealth, 1);
                }
                GameBangItemClass.turnState[0] = 1;
                _this.shockEffect(GameBangItemClass.otherRole, 10, 1000, 10, 5);
                egret.stopTick(_this.mainTick, _this);
                App.TimerManager.doTimer(3000, 1, function () {
                    _this.turnEnd();
                }, _this);
            }
            else {
                // you have not hit other sucessful
                GameBangItemClass.thirdSoundEffect.play("BA_happyAndHitOther_mp3", true);
                _this.fireSmokeEffectManager(0);
                _this.shootEffectManager(1, 0);
                GameBangItemClass.turnState[0] = 2;
                GameBangLogic.randomBulletHole();
            }
        };
        /**
         * other shoot judge pretreatment
         */
        _this.preOtherShootJudge = function (num) {
            console.log("other shoot in :" + num.toString());
            GameBangItemClass.otherShootSec = num;
            GameBangItemClass.btnBang.touchEnabled = false;
            if (_this.hasRun == false) {
                _this.hasRun = true;
                App.TimerManager.doTimer(200, 1, function () {
                    _this.shootResultDeal();
                }, _this);
            }
        };
        /**
         * other shoot judge
         */
        _this.otherShootJudge = function (n, bool) {
            if (n === void 0) { n = false; }
            if (bool === void 0) { bool = false; }
            if (GameBangItemClass.isOffline == true && GameBangItemClass.AICanShoot == false) {
                return;
            }
            GameBangItemClass.fireLightL.alpha = 1;
            GameBangItemClass.fireLightR.alpha = 1;
            App.TimerManager.doTimer(300, 1, function () {
                GameBangItemClass.fireLightL.alpha = 0;
                GameBangItemClass.fireLightR.alpha = 0;
            }, _this);
            GameBangItemClass.AICanShoot = false;
            var shootCrooked = function () {
                // other have not hit you sucessful
                GameBangItemClass.thirdSoundEffect.play("BA_happyNoHit_mp3", true);
                _this.shootScreen();
                _this.fireSmokeEffectManager(1);
                _this.shootEffectManager(0, 1);
                GameBangItemClass.turnState[1] = 2;
                GameBangLogic.randomBulletHole();
            };
            App.SoundManager.playEffect("BA_gunEffect_mp3", true);
            // if (GameBangItemClass.isOffline == true && n == true) {
            //     GameBangItemClass.otherRole.texture = AssetManager.getBitmap("BA_otherRoleS_png").texture;
            //     shootCrooked();
            //     return;
            // }
            GameBangItemClass.otherRole.texture = AssetManager.getBitmap("BA_otherRoleS_png").texture;
            if (GameBangItemClass.reference == true || bool == true) {
                // other hit other sucessful
                GameBangItemClass.btnBang.touchEnabled = false;
                App.SoundManager.stopBg();
                App.SoundManager.playBg("BA_bgm_hited_mp3");
                GameBangItemClass.youSoundEffect.play("BA_beHit_mp3");
                _this.fireSmokeEffectManager(1);
                _this.shootEffectManager(1);
                GameBangLogic.fruitEffectManager(0);
                if (GameBangItemClass.youHealth >= 1) {
                    GameBangItemClass.youHealth -= 1;
                    _this.healthEffectManager(0, GameBangItemClass.youHealth, 1);
                }
                GameBangItemClass.turnState[1] = 1;
                _this.shockEffect(GameBangItemClass.youRole, 10, 1000, 10, 5);
                egret.stopTick(_this.mainTick, _this);
                App.TimerManager.doTimer(3000, 1, function () {
                    _this.turnEnd();
                }, _this);
            }
            else {
                // other have not hit you sucessful
                shootCrooked();
            }
        };
        /**
         * ready tick
         */
        _this.readyTick = function () {
            switch (GameBangItemClass.isOffline) {
                case false:
                    if (GameBangItemClass.readyState[0] == 1 && GameBangItemClass.readyState[1] == 1) {
                        GameBangItemClass.readyState = [0, 0];
                        console.log("send settings!");
                        GameBangEventClass.messageCenter(GameBangEventClass.EVENT_SENDSETTINGS);
                        return false;
                    }
                    if (GameBangItemClass.gameSettings.length > 0) {
                        egret.stopTick(_this.readyTick, _this);
                        App.TimerManager.doTimer(1500, 1, _this.turnManager, _this);
                    }
                    break;
                case true:
                    if (GameBangItemClass.gameSettings.length > 0) {
                        egret.stopTick(_this.readyTick, _this);
                        App.TimerManager.doTimer((1000 + 2000 * Math.random()), 1, _this.turnManager, _this);
                    }
                    else {
                        GameBangLogic.decodeSettings(GameBangLogic.makeSettings());
                    }
                    return false;
            }
            return false;
        };
        /**
         * function 4 is offline or not callback
         */
        _this.isOfflineCallback = function (yesCallback, noCallback) {
            switch (GameBangItemClass.isOffline) {
                case false:
                    if (noCallback) {
                        noCallback();
                    }
                    break;
                case true:
                    if (yesCallback) {
                        yesCallback();
                    }
                    break;
            }
        };
        _this.AI = function () {
            var shootTime;
            var random = Math.random();
            var setRightTime = function () {
                App.TimerManager.remove(_this.otherShootJudge, _this);
                App.TimerManager.doTimer((550 + Math.round(Math.random() * 500)), 1, _this.otherShootJudge, _this);
                console.log("shooooooot!");
            };
            switch (App.CurrGameAiLevel) {
                case 1:
                    if (random <= 0.2) {
                        setRightTime();
                    }
                    break;
                case 2:
                    if (random <= 0.4) {
                        setRightTime();
                    }
                    break;
                case 3:
                    if (random <= 0.6) {
                        setRightTime();
                    }
                    break;
                case 4:
                    if (random <= 0.85) {
                        App.TimerManager.remove(_this.otherShootJudge, _this);
                        App.TimerManager.doTimer((350 + Math.round(Math.random() * 450)), 1, _this.otherShootJudge, _this);
                    }
                    break;
                case 5:
                    if (random <= 1) {
                        App.TimerManager.remove(_this.otherShootJudge, _this);
                        App.TimerManager.doTimer((200 + Math.round(Math.random() * 100)), 1, _this.otherShootJudge, _this);
                    }
                    break;
            }
        };
        /**
         * the main tick
         */
        _this.mainTick = function () {
            if (GameBangItemClass.restSec > 0) {
                GameBangItemClass.gameSettings.forEach(function (element) {
                    if (element[0] == GameBangItemClass.restSec) {
                        GameBangLogic.showShootingTips(GameBangLogic.tipPosManager(), element[1]);
                        if (element[1] == 0) {
                            GameBangItemClass.reference = true;
                            if (GameBangItemClass.isOffline == true) {
                                _this.AI();
                            }
                        }
                    }
                });
                GameBangItemClass.restSec -= 1;
            }
            if (GameBangItemClass.restSec == 0) {
                egret.stopTick(_this.mainTick, _this);
                GameBangItemClass.btnBang.touchEnabled = false;
                if (GameBangItemClass.turnState[0] == 0 && GameBangItemClass.turnState[1] == 0) {
                    // show
                    GameBangItemClass.img5s.alpha = 1;
                    App.TimerManager.doTimer(1600, 1, function () {
                        GameBangItemClass.img5s.alpha = 0;
                    }, _this);
                }
                console.log("turn end!");
                _this.turnEnd();
            }
            return true;
        };
        /**
         * other do not hit you effect
         */
        _this.shootScreen = function () {
            GameBangItemClass.youSoundEffect.play("BA_noHit_mp3", true);
            _this.screen = new egret.DisplayObjectContainer();
            if (_this.screen && _this.screen.alpha == 0) {
                _this.screen.getChildByName("screenBreaker").x = App.RandomUtils.limitInteger(200, 490);
                _this.screen.getChildByName("screenBreaker").y = App.RandomUtils.limitInteger(200, 900);
                _this.screen.alpha = 1;
            }
            else {
                var backMask = AssetManager.getBitmap("BA_whiteMask_png", false, false);
                backMask.x = 0;
                backMask.y = 0;
                backMask.alpha = 0.2;
                _this.screen.addChild(backMask);
                var screenBreaker = AssetManager.getBitmap("BA_notBeHit_png", true, true);
                screenBreaker.name = "screenBreaker";
                screenBreaker.x = App.RandomUtils.limitInteger(200, 490);
                screenBreaker.y = App.RandomUtils.limitInteger(200, 900);
                _this.screen.addChild(screenBreaker);
                _this.addChild(_this.screen);
            }
            var tw = egret.Tween.get(screen);
            tw.to({ alpha: 1 }, 800);
            tw.to({ alpha: 0 }, 800);
            tw.call(function () {
                _this.screen.alpha = 0;
                tw = null;
            });
        };
        /**
         * manager 4 message received
         */
        _this.messageManager = function (data) {
            var cmdString;
            cmdString = data.event.split("|");
            switch (cmdString[0]) {
                case GameBangEventClass.EVENT_READY:
                    switch (data.userId.toString()) {
                        case DataCenter.instance.user.id.toString():
                            GameBangItemClass.readyState[0] = 1;
                            break;
                        case DataCenter.instance.room.player.id.toString():
                            GameBangItemClass.readyState[1] = 1;
                            break;
                    }
                    break;
                case GameBangEventClass.EVENT_SENDSETTINGS:
                    GameBangLogic.decodeSettings(cmdString[1]);
                    break;
                case GameBangEventClass.EVENT_SHOOT:
                    if (GameBangItemClass.reference == false) {
                        _this.otherShootJudge();
                    }
                    else {
                        _this.preOtherShootJudge(parseInt(cmdString[1]));
                    }
                    break;
                case GameBangEventClass.EVENT_ISHOOT:
                    if (data.userId == DataCenter.instance.user.id) {
                        _this.preShoot();
                    }
                    break;
                case GameBangEventClass.EVENT_RESULT:
                    GameBangItemClass.endArray[1] = [parseInt(cmdString[2]), parseInt(cmdString[1])];
                    break;
            }
        };
        _this.endTick = function () {
            if (GameBangItemClass.endArray[0] == undefined || GameBangItemClass.endArray[1] == undefined) {
                return false;
            }
            if (GameBangItemClass.endArray[0][1] != undefined && GameBangItemClass.endArray[0][0] != undefined && GameBangItemClass.endArray[1][1] != undefined && GameBangItemClass.endArray[1][0] != undefined) {
                egret.stopTick(_this.endTick, _this);
                var _youHealth = void 0, _otherHealth = void 0;
                if (GameBangItemClass.endArray[0][0] > GameBangItemClass.endArray[1][0]) {
                    _youHealth = GameBangItemClass.endArray[1][0];
                }
                else if (GameBangItemClass.endArray[0][0] < GameBangItemClass.endArray[1][0]) {
                    _youHealth = GameBangItemClass.endArray[0][0];
                }
                if (GameBangItemClass.endArray[0][1] > GameBangItemClass.endArray[1][1]) {
                    _otherHealth = GameBangItemClass.endArray[1][1];
                }
                else if (GameBangItemClass.endArray[0][1] < GameBangItemClass.endArray[1][1]) {
                    _otherHealth = GameBangItemClass.endArray[0][1];
                }
                if (GameBangItemClass.youHealth != _youHealth && _youHealth != undefined) {
                    GameBangItemClass.youHealth = _youHealth;
                    for (var index = 0; index < GameBangItemClass.youHealth; index++) {
                        var n = void 0;
                        n = index + 1;
                        _this.getChildByName("youHealth_" + n).texture = AssetManager.getBitmap("BA_health_png", true, true).texture;
                    }
                    var rest = 5 - GameBangItemClass.youHealth;
                    for (var index = 0; index < rest; index++) {
                        var num = 6 - rest;
                        _this.getChildByName("youHealth_" + num).texture = AssetManager.getBitmap("BA_healthGray_png", true, true).texture;
                    }
                }
                if (GameBangItemClass.otherHealth != _otherHealth && _otherHealth != undefined) {
                    GameBangItemClass.otherHealth = _otherHealth;
                    for (var i = 0; i < GameBangItemClass.otherHealth; i++) {
                        var n = void 0;
                        n = i + 1;
                        _this.getChildByName("otherHealth_" + n).texture = AssetManager.getBitmap("BA_health_png", true, true).texture;
                    }
                    var rest = 5 - GameBangItemClass.otherHealth;
                    for (var index = 0; index < rest; index++) {
                        var num = 6 - rest;
                        _this.getChildByName("otherHealth_" + num).texture = AssetManager.getBitmap("BA_healthGray_png", true, true).texture;
                    }
                }
                _this.localResultManager();
                GameBangItemClass.endArray = [];
            }
            return false;
        };
        _this.localResultManager = function () {
            if (GameBangItemClass.youHealth == 0 || GameBangItemClass.otherHealth == 0) {
                if (_this.expressionTimer) {
                    egret.clearTimeout(_this.expressionTimer);
                }
                App.TimerManager.remove(_this.otherShootJudge, _this);
                egret.stopTick(_this.mainTick, _this);
                egret.stopTick(_this.readyTick, _this);
                var youWin = function () {
                    egret.stopTick(_this.mainTick, _this);
                    var winLight = AssetManager.getBitmap("BA_winLight_png");
                    winLight.x = 320;
                    winLight.y = 420;
                    _this.addChild(winLight);
                    var winIMG = AssetManager.getBitmap("BA_win_png", false, false);
                    winIMG.x = 0;
                    winIMG.y = 0;
                    _this.addChild(winIMG);
                    var tw = egret.Tween.get(winLight, { loop: true });
                    tw.to({ rotation: 180 }, 2000);
                    tw.to({ rotation: 360 }, 2000);
                    App.SoundManager.playEffect("BA_win_mp3");
                    App.TimerManager.doTimer(3000, 1, function () {
                        egret.Tween.removeAllTweens();
                    }, _this);
                    App.TimerManager.doTimer(4000, 1, function () {
                        GameBangLogic.gameOver(3);
                    }, _this);
                };
                var otherWin = function () {
                    egret.stopTick(_this.mainTick, _this);
                    var loseIMG = AssetManager.getBitmap("BA_lose_png", false, false);
                    loseIMG.x = 0;
                    loseIMG.y = 0;
                    _this.addChild(loseIMG);
                    App.SoundManager.playEffect("BA_lose_mp3");
                    App.TimerManager.doTimer(3000, 1, function () {
                        egret.Tween.removeAllTweens();
                    }, _this);
                    App.TimerManager.doTimer(4000, 1, function () {
                        GameBangLogic.gameOver(1);
                    }, _this);
                };
                if (GameBangItemClass.youHealth == 0) {
                    otherWin();
                }
                else if (GameBangItemClass.youHealth == 0 && GameBangItemClass.otherHealth == 0) {
                    if (GameBangItemClass.isHost == true) {
                        youWin();
                    }
                    else {
                        otherWin();
                    }
                }
                else if (GameBangItemClass.otherHealth == 0) {
                    youWin();
                }
            }
            else {
                App.TimerManager.doTimer(1000, 1, function () {
                    egret.startTick(_this.readyTick, _this);
                    GameBangEventClass.messageCenter(GameBangEventClass.EVENT_READY);
                }, _this);
            }
        };
        /**
         * turn end
         */
        _this.turnEnd = function () {
            GameBangItemClass.AICanShoot = true;
            egret.stopTick(_this.mainTick, _this);
            GameBangLogic.turnDispose();
            GameBangLogic.resetTips();
            GameBangItemClass.youShootSec = -1;
            GameBangItemClass.otherShootSec = -1;
            GameBangItemClass.turnNum += 1;
            if (GameBangItemClass.isOffline == false) {
                egret.startTick(_this.endTick, _this);
                GameBangEventClass.messageCenter(GameBangEventClass.EVENT_RESULT);
                GameBangItemClass.endArray[0] = [GameBangItemClass.youHealth, GameBangItemClass.otherHealth];
            }
            else {
                _this.localResultManager();
            }
        };
        /**
         * fire & smoke effect manager
         */
        _this.fireSmokeEffectManager = function (smokeOwner, fire) {
            if (fire === void 0) { fire = 2; }
            switch (smokeOwner) {
                case 0:
                    var tw_1 = egret.Tween.get(GameBangItemClass.youSmoke);
                    tw_1.to({ alpha: 1, scaleX: 0.6, scaleY: 0.6 }, 300);
                    tw_1.to({ alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 300);
                    tw_1.to({ alpha: 0, scaleX: 1.8, scaleY: 1.8 }, 300);
                    tw_1.call(function () {
                        GameBangItemClass.youSmoke.alpha = 0;
                        GameBangItemClass.youSmoke.scaleY = 0.01;
                        GameBangItemClass.youSmoke.scaleX = 0.01;
                        tw_1 = null;
                    });
                    break;
                case 1:
                    var _tw_1 = egret.Tween.get(GameBangItemClass.otherSmoke);
                    _tw_1.to({ alpha: 1, scaleX: 0.6, scaleY: 0.6 }, 300);
                    _tw_1.to({ alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 300);
                    _tw_1.to({ alpha: 0, scaleX: 1.8, scaleY: 1.8 }, 300);
                    _tw_1.call(function () {
                        GameBangItemClass.otherSmoke.alpha = 0;
                        GameBangItemClass.otherSmoke.scaleY = 0.01;
                        GameBangItemClass.otherSmoke.scaleX = 0.01;
                        _tw_1 = null;
                    });
                    break;
            }
            switch (fire) {
                case 0:// you boom
                    GameBangItemClass.youFruitBoom.alpha = 1;
                    App.TimerManager.doTimer(2500, 1, function () {
                        GameBangItemClass.youFruitBoom.alpha = 0;
                    }, _this);
                    break;
                case 1:// other boom
                    GameBangItemClass.otherFruitBoom.alpha = 1;
                    App.TimerManager.doTimer(2500, 1, function () {
                        GameBangItemClass.otherFruitBoom.alpha = 0;
                        _this.expression.alpha = 0;
                    }, _this);
                    break;
                case 2:
                    // pass
                    break;
                default:
                    console.log("illegal fire num!");
                    break;
            }
        };
        /**
         * shoot effect manager
         *
         * mode,0:other be hit,1:other happy
         */
        _this.shootEffectManager = function (mode, sweatMode) {
            if (sweatMode === void 0) { sweatMode = 2; }
            var remove = function () {
                if (_this.expressionTimer) {
                    egret.clearTimeout(_this.expressionTimer);
                }
                if (_this.expression) {
                    _this.expression.alpha = 0;
                }
            };
            switch (mode) {
                case 0:
                    remove();
                    _this.expression = AssetManager.getBitmap("BA_otherBeHit_png", false, false);
                    _this.expression.x = 290;
                    _this.expression.y = 338;
                    break;
                case 1:
                    remove();
                    _this.expression = AssetManager.getBitmap("BA_otherHappy_png", false, false);
                    _this.expression.x = 287;
                    _this.expression.y = 338;
                    break;
            }
            if (_this.expression && _this.expression.alpha == 0) {
                _this.expression.alpha = 1;
            }
            else {
                _this.addChild(_this.expression);
            }
            if (mode == 1) {
                _this.shockEffect(_this.expression, 150, 1000, 0, 4, false, true, true, false);
            }
            _this.expressionTimer = egret.setTimeout(function () {
                _this.expression.alpha = 0;
                if (mode == 0) {
                    GameBangItemClass.otherFruitBoom.alpha = 0;
                }
            }, _this, 2500);
            var resetSweat = function (item) {
                if (_this.getChildByName(item)) {
                    var i = _this.getChildByName(item);
                    egret.Tween.removeTweens(i);
                    i.alpha = 0;
                }
            };
            switch (sweatMode) {
                case 1:
                    resetSweat("otherSweat");
                    _this.otherSweat = AssetManager.getBitmap("BA_otherSweat_png", false, false);
                    _this.otherSweat.x = 350;
                    _this.otherSweat.y = 312;
                    _this.otherSweat.alpha = 0.8;
                    _this.otherSweat.name = "otherSweat";
                    if (_this.otherSweat && _this.otherSweat.alpha == 0) {
                        _this.otherSweat.alpha = 1;
                    }
                    else {
                        _this.addChild(_this.otherSweat);
                    }
                    var tw_2 = egret.Tween.get(_this.otherSweat);
                    tw_2.to({ y: 332 }, 500);
                    tw_2.to({ y: 332 }, 1200);
                    tw_2.call(function () {
                        _this.otherSweat.alpha = 0;
                        tw_2 = null;
                    });
                    break;
                case 0:
                    resetSweat("youSweat");
                    _this.youSweat = AssetManager.getBitmap("BA_youSweat_png", false, false);
                    _this.youSweat.x = 384;
                    _this.youSweat.y = 690;
                    _this.youSweat.alpha = 0.8;
                    _this.youSweat.name = "youSweat";
                    if (_this.youSweat && _this.youSweat.alpha == 0) {
                        _this.youSweat.alpha = 1;
                    }
                    else {
                        _this.addChild(_this.youSweat);
                    }
                    var _tw_2 = egret.Tween.get(_this.youSweat);
                    _tw_2.to({ y: 720 }, 500);
                    _tw_2.to({ y: 720 }, 1200);
                    _tw_2.call(function () {
                        _this.youSweat.alpha = 0;
                        _tw_2 = null;
                    });
                    break;
                case 2:
                    break;
            }
        };
        /**
         * health effect manager
         *
         * who,0:you,1:other
         *
         * what,-> health num
         */
        _this.healthEffectManager = function (who, what, how) {
            var itemName = "";
            switch (who) {
                case 0:
                    itemName += "you";
                    break;
                case 1:
                    itemName += "other";
                    break;
            }
            itemName += "Health_";
            itemName += (what + 1).toString();
            var item = _this.getChildByName(itemName);
            var tw = egret.Tween.get(item);
            switch (how) {
                case 1:
                    tw.to({ alpha: 0, scaleX: 2, scaleY: 2 }, 500);
                    tw.call(function () {
                        item.texture = AssetManager.getBitmap("BA_healthGray_png", true, true).texture;
                    });
                    tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 500);
                    tw.call(function () {
                        tw = null;
                    });
                    break;
                case 2:
                    item.texture = AssetManager.getBitmap("BA_health_png", true, true).texture;
                    break;
            }
        };
        /**
         * first join animation manager
         */
        _this.firstStartEffectManager = function (callback) {
            var tw = egret.Tween.get(_this.blackMask);
            var _tw = egret.Tween.get(_this.gameTips);
            var __tw = egret.Tween.get(GameBangItemClass.bangTip);
            tw.to({ alpha: 0 }, 1000);
            _tw.to({ alpha: 0 }, 1000);
            __tw.to({ y: 1097 }, 1000);
            __tw.call(function () {
                if (callback) {
                    callback();
                }
            });
        };
        /**
         * between field effect manager
         */
        _this.betweenFieldEffectManager = function (callback) {
            if (_this.readyImg && _this.readyImg.alpha == 0) {
                _this.readyImg.alpha = 1;
                _this.readyImg.y = 530;
                _this.readyImg.x = -87;
            }
            else {
                _this.readyImg = AssetManager.getBitmap("BA_ready_png", true, true);
                _this.readyImg.y = 530;
                _this.readyImg.x = -87;
                _this.addChild(_this.readyImg);
            }
            if (_this.reloadingImg && _this.reloadingImg.alpha == 0) {
                _this.reloadingImg.alpha = 1;
                _this.reloadingImg.y = 530;
                _this.reloadingImg.x = -87;
            }
            else {
                _this.reloadingImg = AssetManager.getBitmap("BA_reloading_png", true, true);
                _this.reloadingImg.y = 530;
                _this.reloadingImg.x = -87;
                _this.addChild(_this.reloadingImg);
            }
            if (_this._announcement && _this._announcement.alpha == 0) {
                _this._announcement.x = -640;
                _this._announcement.y = 0;
                _this._announcement.alpha = 1;
            }
            else {
                _this._announcement.width = 640;
                _this._announcement.height = 1136;
                _this._announcement.x = -640;
                _this._announcement.y = 0;
                _this.addChild(_this._announcement);
            }
            if (_this.announcement && _this.announcement.alpha == 0) {
                _this.announcement.x = 0;
                _this.announcement.y = 0;
                _this.announcement.alpha = 1;
            }
            else {
                _this.announcement = AssetManager.getBitmap("BA_announcement_png", false, false);
                _this.announcement.x = 0;
                _this.announcement.y = 0;
                _this._announcement.addChild(_this.announcement);
            }
            if (_this.N && _this.N.alpha == 0) {
                _this.N.alpha = 1;
                _this.N.x = 320;
                _this.N.y = 568;
            }
            else {
                _this.N = AssetManager.getBitmap("BA_N_png", true, true);
                _this.N.x = 320;
                _this.N.y = 568;
                _this._announcement.addChild(_this.N);
            }
            if (_this.turnText && _this.turnText.alpha == 0) {
                _this.turnText.x = 282;
                _this.turnText.y = 575;
                _this.turnText.alpha = 1;
                _this.turnText.text = GameBangItemClass.turnNum.toString();
            }
            else {
                _this.turnText = new egret.BitmapText();
                _this.turnText.font = RES.getRes("BA_font_fnt");
                _this.turnText.x = 282;
                _this.turnText.y = 575;
                _this.turnText.width = 102;
                _this.turnText.height = 82;
                _this.turnText.anchorOffsetX = 51;
                _this.turnText.anchorOffsetY = 41;
                _this.turnText.textAlign = egret.HorizontalAlign.CENTER;
                _this.turnText.text = GameBangItemClass.turnNum.toString();
                _this._announcement.addChild(_this.turnText);
            }
            _this.setChildIndex(_this.readyImg, _this.numChildren);
            _this.setChildIndex(_this.reloadingImg, _this.numChildren);
            _this.setChildIndex(_this._announcement, _this.numChildren);
            _this.setChildIndex(GameBangItemClass.uBorder, _this.numChildren + 1);
            _this.setChildIndex(GameBangItemClass.bBorder, _this.numChildren + 1);
            _this.setChildIndex(GameBangItemClass.ulBorder, _this.numChildren + 1);
            _this.setChildIndex(GameBangItemClass.urBorder, _this.numChildren + 1);
            var tw_announcement = egret.Tween.get(_this._announcement);
            tw_announcement.to({ x: 0 }, 300);
            tw_announcement.to({ x: 0 }, 900);
            tw_announcement.to({ x: -640 }, 300);
            tw_announcement.call(function () {
                var tw = egret.Tween.get(_this.readyImg);
                tw.to({ x: 220 }, 200);
                tw.call(function () {
                    GameBangItemClass.youSoundEffect.play("BA_ready_mp3", true);
                });
                tw.to({ x: 420 }, 800);
                tw.to({ x: 727 }, 200);
                tw.call(function () {
                    var _tw = egret.Tween.get(_this.reloadingImg);
                    _tw.to({ x: 220 }, 200);
                    _tw.call(function () {
                        GameBangItemClass.youSoundEffect.play("BA_reload_mp3", true);
                    });
                    _tw.to({ x: 420 }, 800);
                    _tw.call(function () {
                        var tw_youRole = egret.Tween.get(GameBangItemClass.youRole);
                        tw_youRole.to({ scaleX: 1, scaleY: 1 }, 100);
                        tw_youRole.to({ scaleX: 1, scaleY: 1 }, 100);
                        tw_youRole.call(function () {
                            tw_youRole = null;
                        });
                        var tw_otherRole = egret.Tween.get(GameBangItemClass.otherRole);
                        tw_otherRole.to({ scaleX: 1, scaleY: 1 }, 100);
                        tw_otherRole.to({ scaleX: 1, scaleY: 1 }, 100);
                        tw_otherRole.call(function () {
                            tw_otherRole = null;
                        });
                    });
                    _tw.to({ x: 727 }, 200);
                    _tw.call(function () {
                        if (callback) {
                            callback();
                        }
                        _tw = null;
                        _this.reloadingImg.alpha = 0;
                        _this._announcement.alpha = 0;
                        _this.setChildIndex(_this._announcement, 1);
                    });
                    _this.readyImg.alpha = 0;
                    tw = null;
                });
            });
        };
        /**
         * deal of result
         */
        _this.resultDeal = function (data) {
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            // 发送游戏结果
            _this.popup("GameResult", null);
        };
        /**
         * scene init
         */
        _this.gameStart = function () {
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, _this.messageManager, _this);
            App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, _this.resultDeal, _this);
            GameBangItemClass.backGround = AssetManager.getBitmap("BA_backGround_jpg", false, false);
            GameBangItemClass.backGround.x = 0;
            GameBangItemClass.backGround.y = 0;
            GameBangItemClass.backGround.width = 640;
            GameBangItemClass.backGround.height = 1136;
            _this.addChildAt(GameBangItemClass.backGround, 1);
            GameBangItemClass.headIcoLeft = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 84, 84);
            GameBangItemClass.headIcoLeft.x = 188;
            GameBangItemClass.headIcoLeft.y = 19;
            _this.addChild(GameBangItemClass.headIcoLeft);
            GameBangItemClass.headIcoRight = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 84, 84);
            GameBangItemClass.headIcoRight.x = 366;
            GameBangItemClass.headIcoRight.y = 19;
            _this.addChild(GameBangItemClass.headIcoRight);
            GameBangItemClass.pkBorder = AssetManager.getBitmap("BA_headIcoBorder_png", true, false);
            GameBangItemClass.pkBorder.x = 320;
            GameBangItemClass.pkBorder.y = 18;
            _this.addChild(GameBangItemClass.pkBorder);
            GameBangItemClass.otherSmoke = AssetManager.getBitmap("BA_otherSmoke_png", true, true);
            GameBangItemClass.otherSmoke.x = 320;
            GameBangItemClass.otherSmoke.y = 373.5;
            GameBangItemClass.otherSmoke.scaleX = 0.01;
            GameBangItemClass.otherSmoke.scaleY = 0.01;
            GameBangItemClass.otherSmoke.alpha = 0;
            _this.addChild(GameBangItemClass.otherSmoke);
            GameBangItemClass.otherFruit = AssetManager.getBitmap("BA_fruit_blueberry_png", false, false);
            GameBangItemClass.otherFruit.x = 291;
            GameBangItemClass.otherFruit.y = 222;
            GameBangItemClass.otherFruit.scaleX = 0.5;
            GameBangItemClass.otherFruit.scaleY = 0.5;
            GameBangItemClass.otherFruit.alpha = 0;
            _this.addChild(GameBangItemClass.otherFruit);
            GameBangItemClass.otherRole = AssetManager.getBitmap("BA_otherRole_png", true, false);
            GameBangItemClass.otherRole.x = 320;
            GameBangItemClass.otherRole.y = 266;
            _this.addChild(GameBangItemClass.otherRole);
            GameBangItemClass.fireLightL = AssetManager.getBitmap("BA_fireLight_png", false, false);
            GameBangItemClass.fireLightL.x = 243;
            GameBangItemClass.fireLightL.y = 375;
            GameBangItemClass.fireLightL.alpha = 0;
            _this.addChild(GameBangItemClass.fireLightL);
            GameBangItemClass.fireLightR = AssetManager.getBitmap("BA_fireLight_png", false, false);
            GameBangItemClass.fireLightR.x = 348;
            GameBangItemClass.fireLightR.y = 375;
            GameBangItemClass.fireLightR.alpha = 0;
            _this.addChild(GameBangItemClass.fireLightR);
            GameBangItemClass.youSmoke = AssetManager.getBitmap("BA_youSmoke_png", true, true);
            GameBangItemClass.youSmoke.x = 320;
            GameBangItemClass.youSmoke.y = 703;
            GameBangItemClass.youSmoke.scaleX = 0.01;
            GameBangItemClass.youSmoke.scaleY = 0.01;
            GameBangItemClass.youSmoke.alpha = 0;
            _this.addChild(GameBangItemClass.youSmoke);
            GameBangItemClass.youRole = AssetManager.getBitmap("BA_youRole_png", true, false);
            GameBangItemClass.youRole.x = 320;
            GameBangItemClass.youRole.y = 632;
            _this.addChild(GameBangItemClass.youRole);
            GameBangItemClass.btnBackGround = AssetManager.getBitmap("BA_btnBackGround_png", false, false);
            GameBangItemClass.btnBackGround.x = 0;
            GameBangItemClass.btnBackGround.y = 0;
            _this.addChild(GameBangItemClass.btnBackGround);
            GameBangItemClass.otherHealthBoard = AssetManager.getBitmap("BA_healthBoard_png", true, false);
            GameBangItemClass.otherHealthBoard.x = 320;
            GameBangItemClass.otherHealthBoard.y = 147;
            _this.addChild(GameBangItemClass.otherHealthBoard);
            GameBangItemClass.youHealthBoard = AssetManager.getBitmap("BA_healthBoard_png", true, false);
            GameBangItemClass.youHealthBoard.x = 320;
            GameBangItemClass.youHealthBoard.y = 852;
            _this.addChild(GameBangItemClass.youHealthBoard);
            GameBangItemClass.btnBang = AssetManager.getBitmap("BA_btnBang_png", true, false);
            GameBangItemClass.btnBang.x = 320;
            GameBangItemClass.btnBang.y = 950;
            GameBangItemClass.btnBang.name = "btnBang";
            GameBangItemClass.btnBang.touchEnabled = false;
            GameBangItemClass.btnBang.alpha = 0;
            switch (GameBangItemClass.isOffline) {
                case false:
                    GameBangItemClass.btnBang.addEventListener("touchTap", _this.preShoot, _this);
                    break;
                case true:
                    GameBangItemClass.btnBang.addEventListener("touchTap", _this.shoot, _this);
                    break;
                default:
                    break;
            }
            _this.addChild(GameBangItemClass.btnBang);
            _this.youHealth_1 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.youHealth_1.x = 219.5;
            _this.youHealth_1.y = 874.5;
            _this.youHealth_1.name = "youHealth_1";
            _this.youHealth_1.alpha = 0;
            _this.addChild(_this.youHealth_1);
            _this.youHealth_2 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.youHealth_2.x = 269.5;
            _this.youHealth_2.y = 874.5;
            _this.youHealth_2.name = "youHealth_2";
            _this.youHealth_2.alpha = 0;
            _this.addChild(_this.youHealth_2);
            _this.youHealth_3 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.youHealth_3.x = 320.5;
            _this.youHealth_3.y = 874.5;
            _this.youHealth_3.name = "youHealth_3";
            _this.youHealth_3.alpha = 0;
            _this.addChild(_this.youHealth_3);
            _this.youHealth_4 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.youHealth_4.x = 370.5;
            _this.youHealth_4.y = 874.5;
            _this.youHealth_4.name = "youHealth_4";
            _this.youHealth_4.alpha = 0;
            _this.addChild(_this.youHealth_4);
            _this.youHealth_5 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.youHealth_5.x = 421.5;
            _this.youHealth_5.y = 874.5;
            _this.youHealth_5.name = "youHealth_5";
            _this.youHealth_5.alpha = 0;
            _this.addChild(_this.youHealth_5);
            _this.otherHealth_1 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.otherHealth_1.x = 219.5;
            _this.otherHealth_1.y = 169.5;
            _this.otherHealth_1.name = "otherHealth_1";
            _this.otherHealth_1.alpha = 0;
            _this.addChild(_this.otherHealth_1);
            _this.otherHealth_2 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.otherHealth_2.x = 269.5;
            _this.otherHealth_2.y = 169.5;
            _this.otherHealth_2.name = "otherHealth_2";
            _this.otherHealth_2.alpha = 0;
            _this.addChild(_this.otherHealth_2);
            _this.otherHealth_3 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.otherHealth_3.x = 320.5;
            _this.otherHealth_3.y = 169.5;
            _this.otherHealth_3.name = "otherHealth_3";
            _this.otherHealth_3.alpha = 0;
            _this.addChild(_this.otherHealth_3);
            _this.otherHealth_4 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.otherHealth_4.x = 370.5;
            _this.otherHealth_4.y = 169.5;
            _this.otherHealth_4.name = "otherHealth_4";
            _this.otherHealth_4.alpha = 0;
            _this.addChild(_this.otherHealth_4);
            _this.otherHealth_5 = AssetManager.getBitmap("BA_health_png", true, true);
            _this.otherHealth_5.x = 421.5;
            _this.otherHealth_5.y = 169.5;
            _this.otherHealth_5.name = "otherHealth_5";
            _this.otherHealth_5.alpha = 0;
            _this.addChild(_this.otherHealth_5);
            GameBangItemClass.tipsText_ul = AssetManager.getBitmap("BA_L_DANG_png", false, false);
            GameBangItemClass.tipsText_ul.x = GameBangItemClass.tipsPosArray[0][0][0];
            GameBangItemClass.tipsText_ul.y = GameBangItemClass.tipsPosArray[0][0][1];
            _this.addChild(GameBangItemClass.tipsText_ul);
            GameBangItemClass.tipsRole_ul = AssetManager.getBitmap("BA_L_Role_png", false, false);
            GameBangItemClass.tipsRole_ul.x = GameBangItemClass.tipsRolePosArray[0][0][0];
            GameBangItemClass.tipsRole_ul.y = GameBangItemClass.tipsRolePosArray[0][0][1];
            _this.addChild(GameBangItemClass.tipsRole_ul);
            GameBangItemClass.tipsText_bl = AssetManager.getBitmap("BA_L_DANG_png", false, false);
            GameBangItemClass.tipsText_bl.x = GameBangItemClass.tipsPosArray[1][0][0];
            GameBangItemClass.tipsText_bl.y = GameBangItemClass.tipsPosArray[1][0][1];
            _this.addChild(GameBangItemClass.tipsText_bl);
            GameBangItemClass.tipsRole_bl = AssetManager.getBitmap("BA_L_Role_png", false, false);
            GameBangItemClass.tipsRole_bl.x = GameBangItemClass.tipsRolePosArray[1][0][0];
            GameBangItemClass.tipsRole_bl.y = GameBangItemClass.tipsRolePosArray[1][0][1];
            _this.addChild(GameBangItemClass.tipsRole_bl);
            GameBangItemClass.tipsText_ur = AssetManager.getBitmap("BA_R_DANG_png", false, false);
            GameBangItemClass.tipsText_ur.x = GameBangItemClass.tipsPosArray[2][0][0];
            GameBangItemClass.tipsText_ur.y = GameBangItemClass.tipsPosArray[2][0][1];
            _this.addChild(GameBangItemClass.tipsText_ur);
            GameBangItemClass.tipsRole_ur = AssetManager.getBitmap("BA_R_Role_png", false, false);
            GameBangItemClass.tipsRole_ur.x = GameBangItemClass.tipsRolePosArray[2][0][0];
            GameBangItemClass.tipsRole_ur.y = GameBangItemClass.tipsRolePosArray[2][0][1];
            _this.addChild(GameBangItemClass.tipsRole_ur);
            GameBangItemClass.tipsText_br = AssetManager.getBitmap("BA_R_DANG_png", false, false);
            GameBangItemClass.tipsText_br.x = GameBangItemClass.tipsPosArray[3][0][0];
            GameBangItemClass.tipsText_br.y = GameBangItemClass.tipsPosArray[3][0][1];
            _this.addChild(GameBangItemClass.tipsText_br);
            GameBangItemClass.tipsRole_br = AssetManager.getBitmap("BA_R_Role_png", false, false);
            GameBangItemClass.tipsRole_br.x = GameBangItemClass.tipsRolePosArray[3][0][0];
            GameBangItemClass.tipsRole_br.y = GameBangItemClass.tipsRolePosArray[3][0][1];
            _this.addChild(GameBangItemClass.tipsRole_br);
            GameBangItemClass.youFruit = AssetManager.getBitmap("BA_fruit_blueberry_png", false, false);
            GameBangItemClass.youFruit.x = 256;
            GameBangItemClass.youFruit.y = 560;
            GameBangItemClass.youFruit.alpha = 0;
            _this.addChild(GameBangItemClass.youFruit);
            GameBangItemClass.youFruitBoom = AssetManager.getBitmap("BA_boom_blueberry_png");
            GameBangItemClass.youFruitBoom.x = 320;
            GameBangItemClass.youFruitBoom.y = 794;
            GameBangItemClass.youFruitBoom.alpha = 0;
            _this.addChild(GameBangItemClass.youFruitBoom);
            GameBangItemClass.otherFruitBoom = AssetManager.getBitmap("BA_boom_blueberry_png");
            GameBangItemClass.otherFruitBoom.x = 320;
            GameBangItemClass.otherFruitBoom.y = 390;
            GameBangItemClass.otherFruitBoom.scaleX = 0.5;
            GameBangItemClass.otherFruitBoom.scaleY = 0.5;
            GameBangItemClass.otherFruitBoom.alpha = 0;
            _this.addChild(GameBangItemClass.otherFruitBoom);
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
            _this.blackMask = AssetManager.getBitmap("BA_blackMask_png", false, false);
            _this.blackMask.x = 0;
            _this.blackMask.y = 0;
            _this.blackMask.alpha = 0.8;
            _this.blackMask.name = "blackMask";
            _this.addChild(_this.blackMask);
            _this.gameTips = AssetManager.getBitmap("BA_gameTips_png", true, false);
            _this.gameTips.x = 320;
            _this.gameTips.y = 80;
            _this.gameTips.name = "gameTips";
            _this.addChild(_this.gameTips);
            GameBangItemClass.bangTip = AssetManager.getBitmap("BA_bangTip_jpg", true, false);
            GameBangItemClass.bangTip.x = 320;
            GameBangItemClass.bangTip.y = 1010;
            _this.addChild(GameBangItemClass.bangTip);
            GameBangItemClass.uBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
            GameBangItemClass.uBorder.x = 0;
            GameBangItemClass.uBorder.y = -1136;
            _this.addChild(GameBangItemClass.uBorder);
            GameBangItemClass.bBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
            GameBangItemClass.bBorder.x = 0;
            GameBangItemClass.bBorder.y = 1136;
            _this.addChild(GameBangItemClass.bBorder);
            GameBangItemClass.ulBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
            GameBangItemClass.ulBorder.x = -640;
            GameBangItemClass.ulBorder.y = 0;
            _this.addChild(GameBangItemClass.ulBorder);
            GameBangItemClass.urBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
            GameBangItemClass.urBorder.x = 640;
            GameBangItemClass.urBorder.y = 0;
            _this.addChild(GameBangItemClass.urBorder);
            GameBangItemClass.img5s = AssetManager.getBitmap("BA_5s_png");
            GameBangItemClass.img5s.x = 320;
            GameBangItemClass.img5s.y = 550;
            GameBangItemClass.img5s.alpha = 0;
            _this.addChild(GameBangItemClass.img5s);
            GameBangItemClass.youSoundEffect = new SoundEffects();
            GameBangItemClass.youSoundEffect.setVolume(1);
            GameBangItemClass.otherSoundEffect = new SoundEffects();
            GameBangItemClass.otherSoundEffect.setVolume(1);
            GameBangItemClass.thirdSoundEffect = new SoundEffects();
            GameBangItemClass.thirdSoundEffect.setVolume(1);
            GameBangItemClass.backGroundSoundEffect = new SoundBg();
            GameBangItemClass.backGroundSoundEffect.setVolume(1);
            if (_this.stage.stageHeight < 1136) {
                GameBangItemClass.multiple = (_this.stage.stageHeight / 1136);
                _this.scaleX = GameBangItemClass.multiple;
                _this.scaleY = GameBangItemClass.multiple;
                var nowWidth = 640 * GameBangItemClass.multiple;
                _this.x = (640 - nowWidth) / 2;
            }
            else if (_this.stage.stageHeight > 1136) {
                _this.y = (_this.stage.stageHeight - 1136) / 2;
            }
            egret.startTick(_this.readyTick, _this);
            switch (GameBangItemClass.isOffline) {
                case true:
                    break;
                case false:
                    App.TimerManager.doTimer(500, 1, function () {
                        GameBangEventClass.messageCenter(GameBangEventClass.EVENT_READY);
                    }, _this);
                    break;
            }
        };
        GameBangMainScene.instance = _this;
        return _this;
    }
    GameBangMainScene.prototype.init = function () {
        _super.prototype.init.call(this);
        GameBangItemClass.dispose();
        if (DataCenter.instance.room.IsAI) {
            GameBangItemClass.isOffline = true;
        }
        GameBangLogic.isHost();
        App.SoundManager.stopBg();
        App.SoundManager.playBg("BA_bgm_w8ToShoot_mp3");
        egret.lifecycle.onPause = function () {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GameBangItemClass.backGroundSoundEffect) {
                GameBangItemClass.backGroundSoundEffect.setVolume(0);
            }
            if (GameBangItemClass.otherSoundEffect) {
                GameBangItemClass.otherSoundEffect.setVolume(0);
            }
            if (GameBangItemClass.thirdSoundEffect) {
                GameBangItemClass.thirdSoundEffect.setVolume(0);
            }
            if (GameBangItemClass.youSoundEffect) {
                GameBangItemClass.youSoundEffect.setVolume(0);
            }
        };
        egret.lifecycle.onResume = function () {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GameBangItemClass.backGroundSoundEffect) {
                GameBangItemClass.backGroundSoundEffect.setVolume(1);
            }
            if (GameBangItemClass.otherSoundEffect) {
                GameBangItemClass.otherSoundEffect.setVolume(1);
            }
            if (GameBangItemClass.thirdSoundEffect) {
                GameBangItemClass.thirdSoundEffect.setVolume(1);
            }
            if (GameBangItemClass.youSoundEffect) {
                GameBangItemClass.youSoundEffect.setVolume(1);
            }
        };
        this.gameStart();
    };
    GameBangMainScene.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (GameBangItemClass.btnBang) {
            GameBangItemClass.btnBang.removeEventListener("touchTap", this.shoot, this);
        }
        GameBangItemClass.dispose();
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.messageManager, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.resultDeal, this);
        if (this.expressionTimer) {
            egret.clearTimeout(this.expressionTimer);
        }
        App.TimerManager.remove(this.otherShootJudge, this);
        egret.stopTick(this.mainTick, this);
        egret.stopTick(this.readyTick, this);
        egret.Tween.removeAllTweens();
    };
    return GameBangMainScene;
}(State));
__reflect(GameBangMainScene.prototype, "GameBangMainScene");
