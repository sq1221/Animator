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
var StateBG = (function (_super) {
    __extends(StateBG, _super);
    function StateBG() {
        return _super.call(this) || this;
    }
    StateBG.prototype.init = function () {
        this.stageWidth = App.GameWidth;
        this.stageHeight = App.GameHeight;
        this.halfStageWidth = this.stageWidth / 2;
        this.halfStageHeight = this.stageHeight / 2;
        //console.log("stage:", this.stageWidth, this.stageHeight);
    };
    Object.defineProperty(StateBG.prototype, "bg", {
        set: function (v) {
            this.background = AssetManager.getBitmap(v);
            if (this.background) {
                this.background.x = this.stageWidth / 2;
                this.background.y = this.stageHeight / 2;
                //this.background.y =  this.background.height / 2;
                this.addChild(this.background);
            }
        },
        enumerable: true,
        configurable: true
    });
    return StateBG;
}(State));
__reflect(StateBG.prototype, "StateBG");
var GameKingkong = (function (_super) {
    __extends(GameKingkong, _super);
    function GameKingkong() {
        var _this = _super.call(this) || this;
        _this._uiContainer = new egret.DisplayObjectContainer();
        _this._progress1 = new DBProgress(AssetManager.getDBArmature("progress1"));
        _this._progress2 = new DBProgress(AssetManager.getDBArmature("progress2"));
        return _this;
    }
    GameKingkong.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        this.bg = "bg_jpg";
        if (this.background.height > App.GameHeight) {
            this.background.height = App.GameHeight;
            this.background.anchorOffsetY = this.background.height / 2;
            this.background.y = App.GameHeight / 2;
        }
        var topBg = AssetManager.getBitmap("blackMask_png", false, false);
        topBg.width = topBg.height = App.GameWidth;
        topBg.anchorOffsetY = topBg.height;
        topBg.y = (App.GameHeight - this.background.height) / 2;
        var backBg = AssetManager.getBitmap("blackMask_png", false, false);
        backBg.width = backBg.height = App.GameWidth;
        backBg.y = App.GameHeight - (App.GameHeight - this.background.height) / 2;
        this._sceneLeft = new KingkongScene(this.background.width, this.background.height, true);
        this._sceneRight = new KingkongScene(this.background.width, this.background.height);
        App.SoundManager.playBg("kingkongBgMusic_mp3");
        if (!DataCenter.instance.room.IsAI) {
            this._sceneRight.mode = KingkongScene.MODE_NET;
        }
        else {
            this._sceneRight.mode = KingkongScene.MODE_AI;
        }
        this._sceneRight.self = false;
        this._sceneRight.scaleX = -1;
        this._sceneRight.scaleY = -1;
        this._sceneRight.x = this.background.width;
        this._sceneRight.y = this.background.height + (App.GameHeight - this.background.height) / 2;
        this._uiContainer.width = this.background.width;
        this._uiContainer.height = this.background.height;
        this._uiContainer.anchorOffsetY = this._uiContainer.height / 2;
        this._uiContainer.anchorOffsetX = this._uiContainer.width / 2;
        this._uiContainer.x = App.GameWidth / 2;
        this._uiContainer.y = App.GameHeight / 2;
        this._conBitmap = AssetManager.getBitmap("spaceBg_png", false, false);
        this._conBitmap.width = App.GameWidth;
        this._conBitmap.height = App.GameHeight;
        this.addChild(this._conBitmap);
        this._sceneLeft.y = (App.GameHeight - this.background.height) / 2;
        this.addChild(this._sceneRight);
        this.addChild(this._sceneLeft);
        this.addChild(this._uiContainer);
        this._progress1.x = this.background.width;
        this._progress1.y = this.background.height / 2;
        this._progress1.rotation = 90;
        this._progress2.x = this.background.width;
        this._progress2.y = this.background.height / 2;
        this._progress2.rotation = 90;
        this._uiContainer.addChild(this._progress2);
        this._uiContainer.addChild(this._progress1);
        var maskTop = AssetManager.getBitmap("mask_png");
        maskTop.anchorOffsetX = maskTop.width / 2;
        maskTop.anchorOffsetY = maskTop.height;
        maskTop.x = this._progress1.x - 5;
        maskTop.y = this._progress1.y - 280;
        this._uiContainer.addChild(maskTop);
        var maskBottom = AssetManager.getBitmap("mask_png");
        maskBottom.anchorOffsetX = maskBottom.width / 2;
        maskBottom.anchorOffsetY = 0;
        maskBottom.x = this._progress1.x - 5;
        maskBottom.y = this._progress1.y + 280;
        this._uiContainer.addChild(maskBottom);
        var winLine = AssetManager.getBitmap("winLine_jpg");
        winLine.anchorOffsetX = winLine.width / 2;
        winLine.anchorOffsetY = 0;
        winLine.x = this._progress1.x + 1;
        winLine.y = this._progress1.y - 270;
        this._uiContainer.addChild(winLine);
        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba) {
            this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            this.returnToLastButton.y = 19;
            this._uiContainer.addChild(this.returnToLastButton);
            this.returnToLastButton.touchEnabled = true;
            this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.popup("GameSureLeave");
            }, this);
        }
        this.addChild(topBg);
        this.addChild(backBg);
        this._conBitmap.touchEnabled = true;
        this._conBitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this._sceneLeft.addEventListener(Kingkong.EVENT_SHOOT, this.onLeftShoot, this);
        this._sceneRight.addEventListener(Kingkong.EVENT_SHOOT, this.onRightShoot, this);
        this._sceneLeft.addEventListener(Kingkong.EVENT_WIN, this.onLeftWin, this);
        this._sceneRight.addEventListener(Kingkong.EVENT_WIN, this.onRightWin, this);
        this._sceneLeft.addEventListener(Kingkong.EVENT_GAME_START, this.onGameStart, this);
        this._sceneLeft.addEventListener(Kingkong.EVENT_GAME_OVER, this.onGameOver, this);
        this._sceneRight.addEventListener(Kingkong.EVENT_GAME_OVER, this.onGameOver, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_BOOM, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_GET_BANANA, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_GET_BOOM, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_JUMP, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_SHOOT, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_SHOOT_GROUND, this.onMasterEvent, this);
        //游戏内事件返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
    };
    GameKingkong.prototype.onMasterEvent = function (e) {
        if (this._sceneRight.mode != KingkongScene.MODE_NET) {
            return;
        }
        var curDis = e.data;
        switch (e.type) {
            case KingkongScene.EVENT_BOOM:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "boom");
                break;
            case KingkongScene.EVENT_GET_BANANA:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "getBanana");
                break;
            case KingkongScene.EVENT_GET_BOOM:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "getBoom");
                break;
            case KingkongScene.EVENT_JUMP:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "jump");
                break;
            case KingkongScene.EVENT_SHOOT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shoot");
                break;
            case KingkongScene.EVENT_SHOOT_GROUND:
                break;
        }
    };
    GameKingkong.prototype.onGameEvent = function (data) {
        if (data.userId == DataCenter.instance.user.id) {
            return;
        }
        switch (data.event) {
            case "getBoom":
                this._sceneRight.kingkongGetBoom();
                break;
            case "getBanana":
                this._sceneRight.kingkongGetBanana();
                break;
            case "boom":
                this._sceneRight.kingkongHit();
                break;
            case "jump":
                this._sceneRight.kingkongJump();
                break;
            case "shoot":
                this._sceneRight.kingkongShoot();
                break;
        }
    };
    GameKingkong.prototype.stop = function () {
        if (this.isStop) {
            return;
        }
        this.isStop = true;
        this._progress1.progress = 0;
        this._progress2.progress = 0;
        this._sceneLeft.dispose();
        this._sceneRight.dispose();
    };
    GameKingkong.prototype.onGameOver = function (e) {
        this.stop();
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, this._win);
    };
    GameKingkong.prototype.onGameResult = function (data) {
        // 游戏结算数据
        DataCenter.instance.room.gameResult = data;
        // 打开结算面板
        this.popup("GameResult", null);
    };
    GameKingkong.prototype.onGameStart = function (e) {
        this._win = 1;
        this._sceneRight.startRun();
    };
    GameKingkong.prototype.onLeftWin = function (e) {
        this._win = 3;
        this._sceneRight.fail();
    };
    GameKingkong.prototype.onRightWin = function (e) {
        this._win = 1;
        this._sceneLeft.fail();
    };
    GameKingkong.prototype.onLeftShoot = function (e) {
        this._sceneLeft.fireBoom(this._sceneRight.addBoom);
    };
    GameKingkong.prototype.onRightShoot = function (e) {
        this._sceneRight.fireBoom(this._sceneLeft.addBoom);
    };
    GameKingkong.prototype.onTouchBegin = function (e) {
        if (e.stageX < this.background.width / 2) {
            if (e.stageY > this.background.height / 2) {
                //if(this._sceneLeft.mode == KingkongScene.MODE_MANUAL)
                {
                    this._sceneLeft.touchLeft();
                }
            }
            else {
                if (this._sceneRight.mode == KingkongScene.MODE_MANUAL) {
                    this._sceneRight.touchRight();
                }
            }
        }
        else {
            if (e.stageY > this.background.height / 2) {
                //if(this._sceneLeft.mode == KingkongScene.MODE_MANUAL)
                {
                    this._sceneLeft.touchRight();
                }
            }
            else {
                if (this._sceneRight.mode == KingkongScene.MODE_MANUAL) {
                    this._sceneRight.touchLeft();
                }
            }
        }
    };
    GameKingkong.prototype.tick = function (advancedTime) {
        if (this._sceneLeft.gameStart) {
            if (this._progress2) {
                this._progress2.progress = this._sceneLeft.progress;
            }
            if (this._progress1) {
                this._progress1.progress = this._sceneRight.progress;
            }
        }
    };
    GameKingkong.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._conBitmap.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this._sceneLeft.removeEventListener(Kingkong.EVENT_SHOOT, this.onLeftShoot, this);
        this._sceneRight.removeEventListener(Kingkong.EVENT_SHOOT, this.onRightShoot, this);
        this._sceneLeft.removeEventListener(Kingkong.EVENT_WIN, this.onLeftWin, this);
        this._sceneRight.removeEventListener(Kingkong.EVENT_WIN, this.onRightWin, this);
        this._sceneLeft.removeEventListener(Kingkong.EVENT_GAME_START, this.onGameStart, this);
        this._sceneRight.removeEventListener(Kingkong.EVENT_GAME_START, this.onGameStart, this);
        this._sceneLeft.dispose();
        this._sceneRight.dispose();
        ObjectPool.clearClass("KingkongItem");
    };
    return GameKingkong;
}(StateBG));
__reflect(GameKingkong.prototype, "GameKingkong");
var KingkongScene = (function (_super) {
    __extends(KingkongScene, _super);
    function KingkongScene(width, height, master, uiLayer) {
        if (master === void 0) { master = false; }
        if (uiLayer === void 0) { uiLayer = null; }
        var _this = _super.call(this) || this;
        _this._totalDistance = 35570;
        _this._curItemConfigs = [];
        _this._curItems = [];
        _this._kingkongPosMinY = 1521;
        _this._kingkongPosMaxY = 1900;
        _this._fastLastTime = 3; // 3second;
        _this.self = true;
        _this._kingkongOffsetY = 240;
        _this._curLevel = 1;
        _this._invincibleTime = 0;
        _this.progress = 0;
        _this.fireBoom = function (arrive) {
            var boom = ObjectPool.pop(KingkongItem, "KingkongItem");
            boom.type = KingkongItem.TYPE_FIRE_BOOM;
            boom.x = 0;
            if (!_this.master) {
                boom.y = _this.stageHeight - _this._kingkongOffsetY - 100;
                App.SoundManager.playEffect("renglei_mp3", true);
            }
            else {
                boom.y = _this.stageHeight - _this._kingkongOffsetY;
                App.SoundManager.playEffect("renglei2_mp3", true);
            }
            _this._itemContainer.addChild(boom);
            var tw = egret.Tween.get(boom);
            tw.to({ "x": -_this.stageWidth / 3, "scaleX": 2, "scaleY": 2, rotation: 90 }, 250);
            tw.to({ "x": -_this.stageWidth / 4 * 3, "scaleX": 1, "scaleY": 1, rotation: 180 }, 250);
            tw.call(function () {
                if (boom.parent)
                    boom.parent.removeChild(boom);
                arrive();
            });
        };
        _this.addBoom = function () {
            var boom = ObjectPool.pop(KingkongItem, "KingkongItem");
            boom.type = KingkongItem.TYPE_FIRE_BOOM;
            boom.x = 0;
            if (!_this.master) {
                boom.y = _this._kingkongOffsetY + 100;
            }
            else {
                boom.y = _this._kingkongOffsetY;
            }
            _this._itemContainer.addChild(boom);
            _this.addBoomComplete(boom);
        };
        _this.master = master;
        _this.stageWidth = width;
        _this.stageHeight = height;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdded, _this);
        _this._building = new Building();
        _this._kingkong = new Kingkong(master);
        if (!_this.master)
            _this._kingkongOffsetY -= 100;
        _this._itemContainer = new egret.DisplayObjectContainer();
        if (uiLayer) {
            _this._uiContainer = uiLayer;
        }
        else {
            _this._uiContainer = new egret.DisplayObjectContainer();
        }
        _this.btnJump = AssetManager.getDBArmature("tiaoyue");
        _this.btnShoot = AssetManager.getDBArmature("renglei");
        _this._tip = AssetManager.getDBArmature("tishi");
        var personData;
        if (_this.master)
            personData = DataCenter.instance.user;
        else
            personData = DataCenter.instance.room.player;
        _this._avatar = new RoleAvatar(personData.curAvatarType, personData.imgUrl, "dbxiaoren00_game1").armature;
        _this._chain = AssetManager.getBitmap("chain_png");
        return _this;
    }
    Object.defineProperty(KingkongScene.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (v) {
            this._mode = v;
            if (this._mode == KingkongScene.MODE_AI) {
                this.initAI(AIKingkong.AI_LEVEL_3);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KingkongScene.prototype, "gameStart", {
        get: function () {
            return this._gameStart;
        },
        enumerable: true,
        configurable: true
    });
    KingkongScene.prototype.addTip = function () {
        var _this = this;
        if (this._tip) {
            this._tip.play("tishi2", 0);
            this.tipFlag = setTimeout(function () {
                _this.removeTip();
            }, 2000);
            this._tip.x = this.btnJump.x;
            this._tip.y = this.btnJump.y;
            this._uiContainer.addChild(this._tip);
        }
    };
    KingkongScene.prototype.removeTip = function () {
        if (this._tip && this._tip.parent) {
            this._tip.stop();
            this._tip.parent.removeChild(this._tip);
            clearTimeout(this.tipFlag);
            this.tipFlag = undefined;
        }
    };
    KingkongScene.prototype.onAdded = function (e) {
        this.init();
    };
    KingkongScene.prototype.dispose = function () {
        App.TimerManager.remove(this.advanceTime, this);
        this.removeAllItems();
        this._itemContainer.removeChildren();
        if (this.tipFlag) {
            clearTimeout(this.tipFlag);
        }
    };
    KingkongScene.prototype.init = function () {
        //data//
        var levelConfig = RES.getRes("levelConfig_json").level[this._curLevel];
        this._curItemConfigs = levelConfig.concat();
        //////////ground/////////////////
        this._building.x = this.stageWidth;
        this._building.y = this.stageHeight;
        this.addChild(this._building);
        this._building.stop();
        //////////////avatar////////////////
        this._avatar.x = this.stageWidth / 2;
        this._avatar.y = this.stageHeight / 2 + 200;
        this._avatar.scaleX = this._avatar.scaleY = 0.7;
        this.addChild(this._avatar);
        this._chain.x = this._avatar.x;
        this._chain.y = this._avatar.y;
        this._chain.scaleX = this._chain.scaleY = 0.7;
        this.addChild(this._chain);
        ////////////////ui/////////////////////////
        this._uiContainer.x = 0;
        this._uiContainer.y = 0;
        this.addChild(this._uiContainer);
        this.btnJump.x = this.btnShoot.x = this.stageWidth * 0.5;
        this.btnJump.y = this.btnShoot.y = this.stageHeight - 40;
        this._uiContainer.addChild(this.btnJump);
        this._uiContainer.addChild(this.btnShoot);
        ///////////////items//////////////
        this.addChild(this._itemContainer);
        this._itemContainer.x = this.stageWidth - 60;
        this._itemContainer.y = 0;
        if (!this.master) {
            this.btnJump.visible = false;
            this.btnShoot.visible = false;
        }
        /////////////kingkong
        this._kingkong.x = this.stageWidth - 60;
        this._kingkong.y = this.stageHeight - this._kingkongOffsetY;
        this._kingkongPosY = this._kingkong.y;
        ////碰撞区域
        this._kingkongPosMaxY = this._kingkongPosY + Kingkong.LEG_LENGTH + KingkongItem.HALF_SIZE;
        this._kingkongPosMinY = this._kingkongPosY - Kingkong.LEG_LENGTH - KingkongItem.HALF_SIZE; //
        this.addChild(this._kingkong);
        this._kingkong.stand();
        this._totalDistance = this.configToD(this._curItemConfigs[this._curItemConfigs.length - 1].d) + this.stageHeight - this._kingkongOffsetY;
        // this.addChild(this._win);
        // this.startRun();
        if (this._mode == KingkongScene.MODE_AI) {
            this.initAI(AIKingkong.AI_LEVEL_3);
        }
        if (this.master) {
            this.preStart();
        }
        ///////////////////////////
        // var test:KingkongItem = new KingkongItem();
        // test.type = 4;
        // this._itemContainer.addChild(test);
        App.TimerManager.doTimer(1, 0, this.advanceTime, this);
    };
    KingkongScene.prototype.initAI = function (level) {
        if (this._mode == KingkongScene.MODE_AI) {
            if (this._ai == null) {
                this._ai = new AIKingkong();
                this._ai.addEventListener(Kingkong.EVENT_SHOOT, this.onAIShoot, this);
                this._ai.addEventListener(Kingkong.EVENT_JUMP, this.onAIJump, this);
            }
            this._ai.level = level;
            this._ai.kingkong = this._kingkong;
            this._ai.curItems = this._curItems;
        }
    };
    KingkongScene.prototype.onAIShoot = function (e) {
        this.touchLeft();
    };
    KingkongScene.prototype.onAIJump = function (e) {
        this.touchRight();
    };
    KingkongScene.prototype.advanceTime = function (advancedTime) {
        if (this._gameStart) {
            this._building.advanceTime(advancedTime);
            this._curTime += advancedTime;
            this._curDistance = this._building.curDistance;
            this.addItems();
            this.moveItems();
            this.removeItems();
            this.testHit();
            if (this._fast) {
                this.checkFast(advancedTime);
            }
            this.checkWin();
            // if (this.master && !KingkongScene.touched && this._curTime > KingkongScene.TIP_TIME && this._tip.parent == null) {
            //     this.addTip();
            // }
            this.progress = this._curDistance / this._totalDistance;
            if (this._mode == KingkongScene.MODE_AI) {
                this._ai.advanceTime(advancedTime);
            }
            if (this._invincibleTime > 0) {
                this._invincibleTime -= advancedTime;
            }
        }
        return true;
    };
    KingkongScene.prototype.checkWin = function () {
        if (this._curDistance > this._totalDistance) {
            this.win();
        }
    };
    KingkongScene.prototype.fail = function () {
        // this._avatar.play("lost", 1);
        this._kingkong.getBoom(false);
        this.btnShoot.play("renglei0", 1);
        this.removeTip();
        this.gameOver();
    };
    KingkongScene.prototype.win = function () {
        var _this = this;
        if (this.key) {
            this.key.x += this._itemContainer.x;
            this.key.y += this._itemContainer.y;
            this._uiContainer.addChild(this.key);
            var tw = egret.Tween.get(this.key);
            var targetOffX = (this._avatar.x) - this.key.x;
            var targetOffY = (this._avatar.y) - this.key.y;
            tw.to({ "x": this.key.x + targetOffX / 2, "y": this.key.y + targetOffY / 2, "scaleX": 2, "scaleY": 2 }, 500);
            tw.to({ "x": this.key.x + targetOffX, "y": this.key.y + targetOffY, "scaleX": 1, "scaleY": 1 }, 500);
            tw.call(function () {
                _this._avatar.play("win");
                _this._chain.alpha = 0;
                _this.key.x = 0;
                _this.removeItem(_this.key, 0);
                _this.key = null;
            });
            tw.wait(1000);
            tw.call(function () {
                _this.dispatchEvent(new egret.Event(Kingkong.EVENT_GAME_OVER));
            });
        }
        this._kingkong.getBoom(false);
        this.btnShoot.play("renglei0", 1);
        this.removeTip();
        //this.addChild(this._win);
        this.dispatchEvent(new egret.Event(Kingkong.EVENT_WIN));
        this.gameOver();
    };
    KingkongScene.prototype.gameOver = function () {
        this._curDistance = 0;
        this._fastLastTime = 0;
        this._building.curDistance = 0;
        this._curTime = 0;
        this._gameStart = false;
        this._building.stop();
        this._kingkong.stand();
        this.removeTip();
        if (this._mode == KingkongScene.MODE_AI) {
            this._ai.over();
        }
        if (this.tipFlag) {
            clearTimeout(this.tipFlag);
        }
    };
    KingkongScene.prototype.checkFast = function (advancedTime) {
        if (this._fastLastTime > 0) {
            this._fastLastTime -= advancedTime;
        }
        else {
            this.stopFast();
        }
    };
    KingkongScene.prototype.testHit = function () {
        var i;
        var len;
        var hit;
        var hitType;
        var hitItem;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            if (this._curItems[i].type === KingkongItem.TYPE_WIN)
                return;
            if (this._curItems[i].type != KingkongItem.TYPE_KEY && this._curItems[i].y > this._kingkongPosMinY) {
                if (this._curItems[i].y < this._kingkongPosMaxY) {
                    if (!this._kingkong.onAir() && !this._kingkong.invincible) {
                        hitItem = this._curItems[i];
                        hit = true;
                        hitType = this._curItems[i].type;
                        this.removeItem(hitItem, i);
                        break;
                    }
                }
            }
            else {
                break;
            }
        }
        if (hit) {
            if (this.mode != KingkongScene.MODE_NET) {
                switch (hitType) {
                    case KingkongItem.TYPE_BANANA:
                        this.kingkongGetBanana();
                        break;
                    case KingkongItem.TYPE_BOOM:
                        this.kingkongGetBoom();
                        break;
                    case KingkongItem.TYPE_FIRE_BOOM:
                        if (this._invincibleTime <= 0) {
                            this.kingkongHit();
                            this._invincibleTime = KingkongScene.INVINCIBLE_TIME;
                        }
                        break;
                }
            }
        }
    };
    KingkongScene.prototype.stopFast = function () {
        this._fast = false;
        this._building.runNormal();
        this._kingkong.runNormal();
    };
    KingkongScene.prototype.kingkongGetBanana = function () {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_GET_BANANA, false, false, this._curDistance));
        }
        this._fast = true;
        this._slow = false;
        App.SoundManager.playEffect("banana_mp3", true);
        this._fastLastTime = KingkongScene.FAST_TIME;
        this._building.runFast();
        this._kingkong.runFast();
        this._avatar.play("chi", 1);
    };
    KingkongScene.prototype.kingkongGetBoom = function () {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_GET_BOOM, false, false, this._curDistance));
        }
        this._kingkong.getBoom(true);
        this.btnShoot.play("renglei1", 1);
        // App.SoundManager.playEffect("getBomb_mp3", true);
        if (this.master && !this.tipFlag)
            this.addTip();
    };
    KingkongScene.prototype.kingkongRecover = function () {
        this._slow = false;
        this._fast = false;
        this._building.runNormal();
        this._kingkong.runNormal();
        this._kingkong.removeEventListener(Kingkong.EVENT_RECOVER, this.onKingkongRecover, this);
    };
    KingkongScene.prototype.onKingkongRecover = function (e) {
        this.kingkongRecover();
    };
    KingkongScene.prototype.kingkongHit = function () {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_BOOM, false, false, this._curDistance));
        }
        this._slow = true;
        this._fast = false;
        this._building.runSlow();
        this._kingkong.runSlow();
        this._kingkong.getBoom(false);
        this.removeTip();
        App.SoundManager.playEffect("kingkongBoom_mp3", true);
        this.btnShoot.play("renglei0", 1);
        this._kingkong.addEventListener(Kingkong.EVENT_RECOVER, this.onKingkongRecover, this);
        this._kingkong.playHit();
        this._avatar.play("zha", 1);
    };
    KingkongScene.prototype.disToConfig = function (d) {
        return (this._curDistance - d) / 100;
    };
    KingkongScene.prototype.configToD = function (d) {
        return d * 100;
    };
    KingkongScene.prototype.addBoomComplete = function (boom) {
        boom.pos = this.disToConfig(boom.y);
        if (!this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_SHOOT_GROUND, false, false, boom.pos));
        }
        this._lastAddedBoom = boom;
        var i;
        var len;
        var added;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            if (this._curItems[i].pos > boom.pos) {
                this._curItems.splice(i, 0, boom);
                added = true;
                break;
            }
        }
        if (!added) {
            this._curItems.push(boom);
        }
    };
    KingkongScene.prototype.addItems = function () {
        if (this._curItemConfigs.length > 0) {
            var t = this._curItemConfigs[0].d;
            var type = this._curItemConfigs[0].t;
            var d = this.configToD(t);
            while (d < this._curDistance) {
                this._curItemConfigs.shift();
                var p = ObjectPool.pop(KingkongItem, "KingkongItem");
                p.x = 0;
                p.type = type;
                p.pos = t;
                if (p.type == KingkongItem.TYPE_KEY) {
                    this.key = p;
                }
                this._itemContainer.addChild(p);
                this._curItems.push(p);
                if (this._curItemConfigs.length > 0) {
                    t = this._curItemConfigs[0].d;
                    type = this._curItemConfigs[0].t;
                    d = this.configToD(t);
                }
                else {
                    d = Number.MAX_VALUE;
                    break;
                }
            }
        }
    };
    KingkongScene.prototype.moveItems = function () {
        var i;
        var len;
        var p;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            p = this._curItems[i];
            p.y = this._curDistance - this.configToD(p.pos);
            // console.log(p.y, this._kingkong.y);
        }
    };
    KingkongScene.prototype.removeItem = function (item, index) {
        ObjectPool.push(item);
        this._curItems.splice(index, 1);
        if (item.parent) {
            item.parent.removeChild(item);
        }
    };
    KingkongScene.prototype.removeItems = function () {
        var i;
        var len;
        var p;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            p = this._curItems[i];
            if (p.y > this.stageHeight && p.type != KingkongItem.TYPE_KEY) {
                //console.log("remove ", p.hit, p.y);
                ObjectPool.push(p);
                this._curItems.splice(i, 1);
                i--;
                len--;
                if (p.parent) {
                    p.parent.removeChild(p);
                }
            }
        }
    };
    KingkongScene.prototype.removeAllItems = function () {
        var i;
        var len;
        var p;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            p = this._curItems[i];
            ObjectPool.push(p);
            this._curItems.splice(i, 1);
            i--;
            len--;
            if (p.parent) {
                p.parent.removeChild(p);
            }
        }
    };
    KingkongScene.prototype.touchLeft = function () {
        if (this._kingkong.hasBoom) {
            this.kingkongShoot();
        }
    };
    KingkongScene.prototype.touchRight = function () {
        if (this._kingkong.jumpEnable()) {
            this.kingkongJump();
        }
    };
    KingkongScene.prototype.kingkongJump = function () {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_JUMP, false, false, this._curDistance));
        }
        this._kingkong.jump();
        App.SoundManager.playEffect("kingkongjump_mp3", true);
        this.btnJump.play("tiaoyue", 1);
        KingkongScene.touched = true;
    };
    KingkongScene.prototype.kingkongShoot = function () {
        var _this = this;
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_SHOOT, false, false, this._curDistance));
        }
        var btnShootOver = function () {
            _this.btnShoot.removeDisplayEvent(dragonBones.EventObject.COMPLETE, btnShootOver, _this);
            _this.btnShoot.play("renglei0", 1);
        };
        this.btnShoot.addDisplayEvent(dragonBones.EventObject.COMPLETE, btnShootOver, this);
        this.btnShoot.play("renglei2", 1);
        this._kingkong.getBoom(false);
        this.removeTip();
        this.dispatchEvent(new egret.Event(Kingkong.EVENT_SHOOT));
        KingkongScene.touched = true;
    };
    KingkongScene.prototype.preStart = function () {
        var _this = this;
        var timeImg = new GameReady(function () {
            _this.startRun();
            _this.dispatchEvent(new egret.Event(Kingkong.EVENT_GAME_START));
        });
        timeImg.x = 300;
        timeImg.y = App.GameHeight / 2;
        this.addChild(timeImg);
        timeImg.play();
    };
    KingkongScene.prototype.startRun = function () {
        this._gameStart = true;
        this._curTime = 0;
        this.progress = 0;
        this._building.reset();
        this._kingkong.reset();
        this._invincibleTime = 0;
        this._curDistance = 0;
        if (this._avatar) {
            this._avatar.play("newAnimation");
        }
        this._building.run();
        this._kingkong.run();
        if (this._mode == KingkongScene.MODE_AI) {
            this._ai.start();
        }
    };
    KingkongScene.EVENT_SHOOT = "kingkongScene:EVENT_SHOOT";
    KingkongScene.EVENT_SHOOT_GROUND = "kingkongScene:EVENT_SHOOT_GROUND";
    KingkongScene.EVENT_JUMP = "kingkongScene:EVENT_JUMP";
    KingkongScene.EVENT_BOOM = "kingkongScene:EVENT_BOOM";
    KingkongScene.EVENT_GET_BOOM = "kingkongScene:EVENT_GET_BOOM";
    KingkongScene.EVENT_GET_BANANA = "kingkongScene:EVENT_GET_BANANA";
    KingkongScene.MODE_MANUAL = 0;
    KingkongScene.MODE_NET = 1;
    KingkongScene.MODE_AI = 2;
    KingkongScene.FAST_TIME = 3000;
    KingkongScene.INVINCIBLE_TIME = 1.1; //无敌时间；动画时间1秒
    return KingkongScene;
}(egret.DisplayObjectContainer));
__reflect(KingkongScene.prototype, "KingkongScene");
var AIKingkong = (function (_super) {
    __extends(AIKingkong, _super);
    function AIKingkong() {
        var _this = _super.call(this) || this;
        _this.level = 0;
        _this._nextRandomJumpTime = 3;
        _this._nextJumpTime = 0;
        _this._nextShootTime = 0;
        return _this;
    }
    Object.defineProperty(AIKingkong.prototype, "kingkong", {
        set: function (v) {
            this._kingkong = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AIKingkong.prototype, "curItems", {
        set: function (v) {
            this._curItems = v;
        },
        enumerable: true,
        configurable: true
    });
    AIKingkong.prototype.start = function () {
        if (this._kingkong && this._curItems) {
            this._running = true;
        }
    };
    AIKingkong.prototype.over = function () {
        this._running = false;
    };
    AIKingkong.prototype.advanceTime = function (advancedTime) {
        if (this._running) {
            if (this._kingkong.hasBoom) {
                this._nextShootTime -= advancedTime;
                if (this._nextShootTime < 0) {
                    if (this.kingkongCanShoot()) {
                        this.dispatchEvent(new egret.Event(Kingkong.EVENT_SHOOT));
                    }
                    this.resetNextShootTime();
                }
            }
            if (this._kingkong.jumpEnable()) {
                if (this.kingkongCanJump(advancedTime)) {
                    this.dispatchEvent(new egret.Event(Kingkong.EVENT_JUMP));
                }
                else {
                    this._nextRandomJumpTime -= advancedTime;
                    if (this._nextRandomJumpTime < 0) {
                        this._nextRandomJumpTime = Math.random() * AIKingkong.RANDOM_JUMP_TIME;
                        if (this.randomJump()) {
                            this.dispatchEvent(new egret.Event(Kingkong.EVENT_JUMP));
                        }
                    }
                }
            }
        }
    };
    AIKingkong.prototype.resetNextShootTime = function () {
        switch (this.level) {
            case AIKingkong.AI_LEVEL_0:
                this._nextShootTime = Math.random() * 1 + 1;
                break;
            case AIKingkong.AI_LEVEL_1:
                this._nextShootTime = Math.random() * 0.5 + 0.5;
                break;
            case AIKingkong.AI_LEVEL_2:
                this._nextShootTime = Math.random() * 0.5 + 0.2;
                break;
            case AIKingkong.AI_LEVEL_3:
                this._nextShootTime = Math.random() * 0.2;
                break;
            default:
                this._nextShootTime = 1;
        }
    };
    AIKingkong.prototype.kingkongCanShoot = function () {
        var random = Math.random();
        switch (this.level) {
            case AIKingkong.AI_LEVEL_0:
                if (random < 0.2) {
                    return true;
                }
                break;
            case AIKingkong.AI_LEVEL_1:
                if (random < 0.4) {
                    return true;
                }
                break;
            case AIKingkong.AI_LEVEL_2:
                if (random < 0.8) {
                    return true;
                }
                break;
            case AIKingkong.AI_LEVEL_3:
                if (random < 1.2) {
                    return true;
                }
                break;
            default:
                return true;
        }
        return false;
    };
    AIKingkong.prototype.kingkongCanJump = function (advancedTime) {
        if (this._curItems && this._curItems.length > 0) {
            var offY = this._kingkong.y - this._curItems[0].y;
            if (offY > AIKingkong.MIN_JUMP_DIS && offY < AIKingkong.MAX_JUMP_DIS) {
                this._nextJumpTime -= advancedTime;
                if (this._nextJumpTime < 0) {
                    var random = Math.random();
                    switch (this.level) {
                        case AIKingkong.AI_LEVEL_0:
                            this._nextJumpTime = Math.random() * 0.1 + 0.3;
                            if (random < 0.2) {
                                return true;
                            }
                            break;
                        case AIKingkong.AI_LEVEL_1:
                            this._nextJumpTime = Math.random() * 0.1 + 0.2;
                            if (random < 0.5) {
                                return true;
                            }
                            break;
                        case AIKingkong.AI_LEVEL_2:
                            this._nextJumpTime = Math.random() * 0.1 + 0.1;
                            if (random < 0.8) {
                                if (this._curItems[0].type == KingkongItem.TYPE_FIRE_BOOM) {
                                    return true;
                                }
                            }
                            break;
                        case AIKingkong.AI_LEVEL_3:
                            if (random < 1.2) {
                                if (this._curItems[0].type == KingkongItem.TYPE_FIRE_BOOM) {
                                    return true;
                                }
                            }
                            break;
                        default:
                            return true;
                    }
                }
            }
        }
        return false;
    };
    AIKingkong.prototype.randomJump = function () {
        var random = Math.random();
        switch (this.level) {
            case AIKingkong.AI_LEVEL_0:
                if (random > 0.2) {
                    return false;
                }
                break;
            case AIKingkong.AI_LEVEL_1:
                if (random < 0.4) {
                    return false;
                }
                break;
            case AIKingkong.AI_LEVEL_2:
                if (random < 0.8) {
                    return false;
                }
                break;
            case AIKingkong.AI_LEVEL_3:
                if (random < 1.2) {
                    return false;
                }
                break;
            default:
                return false;
        }
        return true;
    };
    AIKingkong.AI_LEVEL_0 = 0;
    AIKingkong.AI_LEVEL_1 = 1;
    AIKingkong.AI_LEVEL_2 = 2;
    AIKingkong.AI_LEVEL_3 = 3;
    AIKingkong.MAX_JUMP_DIS = 340;
    AIKingkong.MIN_JUMP_DIS = 100;
    AIKingkong.RANDOM_JUMP_TIME = 3;
    return AIKingkong;
}(egret.EventDispatcher));
__reflect(AIKingkong.prototype, "AIKingkong");
var Building = (function (_super) {
    __extends(Building, _super);
    function Building() {
        var _this = _super.call(this) || this;
        _this._offset = 1195;
        var name = "ground";
        _this.dbBuilding = AssetManager.getDBArmature(name);
        _this._bone = _this.dbBuilding.getBone("bone");
        _this.addChild(_this.dbBuilding);
        _this.stop();
        _this.reset();
        return _this;
    }
    Building.prototype.reset = function () {
        this._curD = this._bone.globalTransformMatrix.ty;
        this._lastD = this._curD;
        this.tickDistance = 0;
        this.curDistance = 0;
    };
    Building.prototype.advanceTime = function (advancedTime) {
        this._curD = this._bone.globalTransformMatrix.ty;
        this.tickDistance = this._curD - this._lastD;
        while (this.tickDistance < 0) {
            this.tickDistance += this._offset;
        }
        this._lastD = this._curD;
        this.curDistance += this.tickDistance;
        //console.log(this.tickDistance, this.curDistance);
    };
    Building.prototype.runNormal = function () {
        var tw = egret.Tween.get(this.dbBuilding);
        tw.to({ "timeScale": Building.NORMAL_SPEED }, 500);
        // this.armature.animation.timeScale = Building.NORMAL_SPEED;
    };
    Building.prototype.runFast = function () {
        var tw = egret.Tween.get(this.dbBuilding);
        tw.to({ "timeScale": Building.FAST_SPEED }, 500);
        //this.armature.animation.timeScale = Building.FAST_SPEED;
    };
    Building.prototype.runSlow = function () {
        this.dbBuilding.timeScale = 0;
    };
    Building.prototype.run = function () {
        this.dbBuilding.play("run");
        this.runSlow();
        this.runNormal();
        this.reset();
    };
    Building.prototype.stop = function () {
        this.dbBuilding.stop();
    };
    Building.NORMAL_SPEED = 2;
    Building.FAST_SPEED = 3;
    return Building;
}(egret.Sprite));
__reflect(Building.prototype, "Building");
var Kingkong = (function (_super) {
    __extends(Kingkong, _super);
    function Kingkong(master) {
        if (master === void 0) { master = false; }
        var _this = _super.call(this) || this;
        var name = "kingkong";
        var avatarName = master ? "kingkong" : "kingkongBlue";
        _this.dbKingkong = AssetManager.getDBArmature(avatarName);
        _this.dbKingkong.scaleX = _this.dbKingkong.scaleY = 1.2;
        _this._dust = AssetManager.getDBArmature("dust");
        if (_this._dust) {
            _this._dust.timeScale = 1.5;
        }
        _this._bananaPeel = AssetManager.getDBArmature("bananaPeel");
        //if(this._bananaPeel)
        {
            _this._bananaPeel.timeScale = 1.5;
            _this._bananaPeel.gotoAndStop("run");
        }
        //armatureDisplay.scaleX = armatureDisplay.scaleY = 0.5;
        // this.armature.animation.play("hit");
        _this.addChild(_this.dbKingkong);
        //armatureDisplay.scaleX = armatureDisplay.scaleY = 0.5;
        //armatureDisplay.rotation = -90;
        // this.boom = new KingBomb();
        // this._boomBone = this.kingArmature.getBone("boom");
        // this.addChild(this.boo)
        var boomSlot = _this.dbKingkong.getSlot("boom");
        if (boomSlot) {
            _this.boomArmature = boomSlot.childArmature;
        }
        _this.dbKingkong.replaceSlot("dust", _this._dust);
        _this.dbKingkong.replaceSlot("bananaPeel", _this._bananaPeel);
        return _this;
    }
    Kingkong.prototype.onAir = function () {
        if (this._status == Kingkong.STATUS_JUMP) {
            if (this._jumpState && this._jumpState.currentTime > 0.17 && this._jumpState.currentTime < 1.5) {
                return true;
            }
        }
        return false;
    };
    Kingkong.prototype.run = function () {
        this.invincible = false;
        this._status = Kingkong.STATUS_RUN;
        this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        if (this._fast) {
            this._speedTw = egret.Tween.get(this.dbKingkong);
            this._speedTw.to({ "timeScale": Kingkong.FAST_SPEED }, 500);
            //this.kingArmature.animation.timeScale = Kingkong.FAST_SPEED;
        }
        else if (this._slow) {
            this.dbKingkong.timeScale = Kingkong.SLOW_SPEED;
        }
        else {
            // this._speedTw = egret.Tween.get(this.kingArmature.animation);
            // this._speedTw.to({"timeScale":Kingkong.NORMAL_SPEED},500);
            this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        }
        this.dbKingkong.play("run", 0);
    };
    Kingkong.prototype.playHit = function () {
        if (this._speedTw) {
            egret.Tween.removeTweens(this.dbKingkong);
        }
        this.invincible = true;
        this._fast = false;
        this._status = Kingkong.STATUS_HIT;
        this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        this.dbKingkong.play("boom", 1);
        this.dbKingkong.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBoomComplete, this);
    };
    Kingkong.prototype.onBoomComplete = function (e) {
        this.dispatchEvent(new egret.Event(Kingkong.EVENT_RECOVER));
        this.run();
        this.dbKingkong.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBoomComplete, this);
    };
    Kingkong.prototype.jumpEnable = function () {
        return this._status == Kingkong.STATUS_RUN;
    };
    Kingkong.prototype.jump = function () {
        if (this._speedTw) {
            egret.Tween.removeTweens(this.dbKingkong);
        }
        this.invincible = false;
        this._status = Kingkong.STATUS_JUMP;
        this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        this._jumpState = this.dbKingkong.play("jump", 1);
        this.dbKingkong.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onJumpComplete, this);
        var boomType = Math.floor(Math.random() * 7) + 1;
        this._dust.play("boom" + boomType, 1);
    };
    Kingkong.prototype.runFast = function () {
        this._fast = true;
        this._slow = false;
        if (this._bananaPeel) {
            this._bananaPeel.play("run", 1);
        }
        if (this._status == Kingkong.STATUS_RUN) {
            this._speedTw = egret.Tween.get(this.dbKingkong);
            this._speedTw.to({ "timeScale": Kingkong.FAST_SPEED }, 500);
            // this.kingArmature.animation.timeScale = Kingkong.FAST_SPEED;
        }
    };
    Kingkong.prototype.runSlow = function () {
        this._slow = true;
        this._fast = false;
        if (this._status == Kingkong.STATUS_RUN) {
            this.dbKingkong.timeScale = Kingkong.SLOW_SPEED;
        }
    };
    Kingkong.prototype.runNormal = function () {
        this._fast = false;
        if (this._status == Kingkong.STATUS_RUN) {
            this._speedTw = egret.Tween.get(this.dbKingkong);
            this._speedTw.to({ "timeScale": Kingkong.NORMAL_SPEED }, 500);
            this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        }
    };
    Kingkong.prototype.onJumpComplete = function (e) {
        if (this._fast) {
            this.dbKingkong.timeScale = Kingkong.FAST_SPEED;
        }
        else if (this._slow) {
            this.dbKingkong.timeScale = Kingkong.SLOW_SPEED;
        }
        else {
            this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        }
        this.run();
        this.dbKingkong.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onJumpComplete, this);
    };
    Kingkong.prototype.stand = function () {
        this.invincible = true;
        this._status = Kingkong.STATUS_STAND;
        this.dbKingkong.gotoAndStop("stand");
    };
    Kingkong.prototype.getBoom = function (v) {
        this.hasBoom = v;
        if (this.boomArmature) {
            var anim = this.hasBoom ? "boom1" : "boom0";
            this.boomArmature.animation.gotoAndStop(anim);
        }
    };
    Kingkong.prototype.reset = function () {
        this._fast = false;
        this._slow = false;
        this.invincible = false;
    };
    Kingkong.EVENT_RECOVER = "EVENT_RECOVER";
    Kingkong.EVENT_SHOOT = "EVENT_SHOOT";
    Kingkong.EVENT_JUMP = "EVENT_JUMP";
    Kingkong.EVENT_WIN = "EVENT_WIN";
    Kingkong.EVENT_GAME_START = "EVENT_GAME_START";
    Kingkong.EVENT_GAME_OVER = "EVENT_GAME_OVER";
    Kingkong.STATUS_RUN = 0;
    Kingkong.STATUS_JUMP = 1;
    Kingkong.STATUS_HIT = 2;
    Kingkong.STATUS_STAND = 3;
    Kingkong.STATUS_OVER = 4;
    Kingkong.ARM_LENGTH = 84;
    Kingkong.LEG_LENGTH = 60;
    Kingkong.LENGTH = Kingkong.ARM_LENGTH + Kingkong.LEG_LENGTH;
    Kingkong.NORMAL_SPEED = 2;
    Kingkong.FAST_SPEED = 3;
    Kingkong.SLOW_SPEED = 1;
    return Kingkong;
}(egret.Sprite));
__reflect(Kingkong.prototype, "Kingkong");
var KingkongItem = (function (_super) {
    __extends(KingkongItem, _super);
    function KingkongItem() {
        var _this = _super.call(this) || this;
        var name = "kingkongItem";
        _this._item = AssetManager.getQuickDBArmature(name);
        _this._item.scaleX = _this._item.scaleY = 1.2;
        _this.addChild(_this._item);
        return _this;
    }
    KingkongItem.prototype.reDraw = function () {
        var color = 0xff0000;
        this._item.stop();
        switch (this._type) {
            case KingkongItem.TYPE_BANANA:
                color = 0xffff00;
                this._item.gotoAndStop("banana");
                break;
            case KingkongItem.TYPE_BOOM:
                color = 0;
                this._item.gotoAndStop("boom");
                break;
            case KingkongItem.TYPE_FIRE_BOOM:
                color = 0xff0000;
                this._item.play("fireBoom");
                break;
            case KingkongItem.TYPE_KEY:
                color = 0xff0000;
                this._item.gotoAndStop("key");
                break;
            case KingkongItem.TYPE_WIN:
                color = 0xff0000;
                this._item.gotoAndStop("qi");
                break;
            default:
                color = 0xffffff;
                this._item.stop();
                break;
        }
    };
    Object.defineProperty(KingkongItem.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (v) {
            this._type = v;
            this.reDraw();
        },
        enumerable: true,
        configurable: true
    });
    KingkongItem.TYPE_BANANA = 0;
    KingkongItem.TYPE_BOOM = 1;
    KingkongItem.TYPE_FIRE_BOOM = 2;
    KingkongItem.TYPE_KEY = 3;
    KingkongItem.TYPE_WIN = 4;
    KingkongItem.SIZE = 75;
    KingkongItem.HALF_SIZE = KingkongItem.SIZE / 2;
    return KingkongItem;
}(egret.Sprite));
__reflect(KingkongItem.prototype, "KingkongItem");
var ScoreData = (function () {
    function ScoreData() {
        this._curBestHit = 0;
        this._curGoodHit = 0;
        this._curMissHit = 0;
        this._curComboo = 0;
        this.maxBestHit = 0;
        this.maxGoodHit = 0;
        this.maxMissHit = 0;
        this.maxComboo = 0;
    }
    Object.defineProperty(ScoreData.prototype, "curBestHit", {
        get: function () {
            return this._curBestHit;
        },
        set: function (v) {
            this._curBestHit = v;
            if (this.maxBestHit < this._curBestHit) {
                this.maxBestHit = this._curBestHit;
            }
            this.curComboo++;
            console.log("cur best:", this._curBestHit);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreData.prototype, "curGoodHit", {
        get: function () {
            return this._curGoodHit;
        },
        set: function (v) {
            this._curGoodHit = v;
            if (this.maxGoodHit < this._curGoodHit) {
                this.maxGoodHit = this._curGoodHit;
            }
            this.curComboo++;
            console.log("cur good:", this._curGoodHit);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreData.prototype, "curMissHit", {
        get: function () {
            return this._curMissHit;
        },
        set: function (v) {
            this._curMissHit = v;
            if (this.maxMissHit < this._curMissHit) {
                this.maxMissHit = this._curMissHit;
            }
            this._curComboo = 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScoreData.prototype, "curComboo", {
        get: function () {
            return this._curComboo;
        },
        set: function (v) {
            this._curComboo = v;
            if (this.maxComboo < this._curComboo) {
                this.maxComboo = this._curComboo;
            }
            console.log("cur comboo:", this._curComboo);
        },
        enumerable: true,
        configurable: true
    });
    return ScoreData;
}());
__reflect(ScoreData.prototype, "ScoreData");
