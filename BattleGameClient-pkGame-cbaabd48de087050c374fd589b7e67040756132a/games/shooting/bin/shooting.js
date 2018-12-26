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
var walkType;
(function (walkType) {
    walkType[walkType["left"] = 0] = "left";
    walkType[walkType["right"] = 1] = "right";
    walkType[walkType["stand"] = 2] = "stand";
})(walkType || (walkType = {}));
var UserConfig = (function () {
    function UserConfig() {
    }
    UserConfig.frameTime = 60;
    UserConfig.shieldLimit = 3; //盾牌最大数量
    UserConfig.shieldHP = 6; //盾牌血量
    UserConfig.bulletLimit = 9; //子弹最大数量
    UserConfig.bulletSpeed = 50; //子弹飞行速度
    UserConfig.reloadBullet = 2000; //换弹时间毫秒
    UserConfig.ItemSpeed = 10; //道具飞行速度
    UserConfig.walkSpeed = 8; //一帧走的像素数量
    UserConfig.scores = 3; //角色血量+比分设置
    UserConfig.splitRotation = 15;
    UserConfig.AITime = 250;
    UserConfig.ItemTime = 1500;
    return UserConfig;
}());
__reflect(UserConfig.prototype, "UserConfig");
var ItemType;
(function (ItemType) {
    ItemType[ItemType["common"] = 0] = "common";
    ItemType[ItemType["rocket"] = 1] = "rocket";
    ItemType[ItemType["split"] = 2] = "split";
    ItemType[ItemType["shield"] = 3] = "shield";
})(ItemType || (ItemType = {}));
var ShootingUserController = (function () {
    function ShootingUserController() {
        this.bulletView = new ShootingBulletController();
        this.userImage = new ShootingCharacter(DataCenter.instance.user);
        this.userImage.x = this.userImage.halfWidth;
        this.userImage.y = 800 * GameShootingView.instance.adaptScaleY;
        this.tempImage = new ShootingCharacter(DataCenter.instance.user, true);
        this.tempImage.x = this.userImage.x + App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.tempImage.name = "temp";
        GameShootingView.instance.basicLayer.addChild(this.userImage);
        GameShootingView.instance.basicLayer.addChild(this.tempImage);
        this.walk = walkType.stand;
        this.initRectAndPoint();
        App.TimerManager.doFrame(1, 0, this.frame, this);
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
    }
    ShootingUserController.prototype.initRectAndPoint = function () {
        this.userImagePoint = new egret.Point();
        this.tempImagePoint = new egret.Point();
        this.userImage.localToGlobal(0, 0, this.userImagePoint);
        this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        this.setRect();
    };
    ShootingUserController.prototype.setRect = function () {
        this.userImage.setRect(this.userImagePoint.x - this.userImage.halfWidth, this.userImagePoint.y - this.userImage.halfHeight, this.userImage.width, this.userImage.height);
        this.tempImage.setRect(this.tempImagePoint.x - this.tempImage.halfWidth, this.tempImagePoint.y - this.tempImage.halfHeight, this.tempImage.width, this.tempImage.height);
    };
    ShootingUserController.prototype.nextRound = function () {
        this.userImage.x = this.userImage.halfWidth;
        this.userImage.y = 800 * GameShootingView.instance.adaptScaleY;
        this.tempImage.x = this.userImage.x + App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.initRectAndPoint();
        this.walk = walkType.stand;
        this.bulletView.nextRound();
        this.userImage.nextRound();
    };
    ShootingUserController.prototype.setShield = function () {
        var shootingGame = GameShootingView.instance.shootingGame;
        if (shootingGame.isWuDi)
            return;
        if (GameShootingView.instance.controlLayer.shield > 0) {
            if (shootingGame.isOffLine)
                this.setSelfShield();
            else
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shield", 1);
        }
    };
    ShootingUserController.prototype.onGameEvent = function (data) {
        if (data.userId != DataCenter.instance.user.id) {
            return;
        }
        /**
         * "stand|123"
         * command：stand && parameter：123
         * */
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        switch (datas[0]) {
            case "fire":
                this.setSelfFire();
                break;
            case "shield":
                this.setSelfShield();
                break;
        }
    };
    /**服务器发回来开始开枪 */
    ShootingUserController.prototype.setSelfFire = function () {
        var bullet = ShootingBullet.createShootingBullet(this.userImage.paoPosition.x, this.userImage.paoPosition.y - 100 * GameShootingView.instance.adaptScaleY, 0);
        bullet.init("self", DirectionType.up);
        this.userImage.fire();
        this.bulletView.fire();
        App.SoundManager.playEffect("fire_mp3", true);
        if (this.bulletView.bulletLimit <= 0) {
            this.bulletView.reload();
        }
    };
    /**服务器发回来开始放盾牌 */
    ShootingUserController.prototype.setSelfShield = function () {
        var key = ShootingGetUID.getUID();
        var shield = new ShootingShield("self", key);
        App.SoundManager.playEffect("shootingSetWall_mp3", true);
        shield.x = this.userImage.x + 10;
        shield.y = this.userImage.y - 150 * GameShootingView.instance.adaptScaleY;
        shield.setRect(shield.x, shield.y);
        GameShootingView.instance.selfShields.addChild(shield);
        GameShootingView.instance.shootingGame.shields[key] = shield;
        GameShootingView.instance.controlLayer.shield--;
    };
    Object.defineProperty(ShootingUserController.prototype, "walk", {
        set: function (type) {
            if (this._walk == type) {
                return;
            }
            this._walk = type;
            if (this._walk == walkType.stand) {
                if (!GameShootingView.instance.shootingGame.isOffLine)
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, walkType[this._walk].toString() + "|" + this.userImage.name + "|" + this.userImage.x);
                this.tempImage.stand();
                this.userImage.stand();
            }
            else {
                if (!GameShootingView.instance.shootingGame.isOffLine)
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, walkType[this._walk].toString());
                if (this._walk == walkType.left) {
                    this.tempImage.walkLeft();
                    this.userImage.walkLeft();
                }
                else {
                    this.tempImage.walkRight();
                    this.userImage.walkRight();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ShootingUserController.prototype.startFire = function () {
        if (GameShootingView.instance.shootingGame.isWuDi)
            return;
        this.continueFire();
        App.TimerManager.doTimer(250, 0, this.continueFire, this);
    };
    ShootingUserController.prototype.stopFire = function () {
        App.TimerManager.remove(this.continueFire, this);
    };
    ShootingUserController.prototype.continueFire = function () {
        if (this.bulletView.bulletLimit <= 0) {
            this.bulletView.cannotFire();
            this.stopFire();
            return;
        }
        if (!GameShootingView.instance.shootingGame.isOffLine) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "fire", 1);
        }
        else {
            this.setSelfFire();
        }
    };
    ShootingUserController.prototype.frame = function (advancedTime) {
        if (GameShootingView.instance.shootingGame.isWuDi)
            return;
        var sppedX = UserConfig.walkSpeed * advancedTime / UserConfig.frameTime;
        switch (this._walk) {
            case walkType.left:
                this.setUserImageX(-sppedX);
                break;
            case walkType.right:
                this.setUserImageX(sppedX);
                break;
            case walkType.stand:
                break;
        }
    };
    ShootingUserController.prototype.setUserImageX = function (offset) {
        this.userImage.x += offset;
        this.tempImage.x += offset;
        this.userImagePoint.x += offset;
        this.tempImagePoint.x += offset;
        if (this.userImage.x < 0 && this.userImage.x > -this.userImage.halfWidth) {
            var s = this.tempImage;
            this.tempImage = this.userImage;
            this.userImage = s;
            this.swapPoints();
        }
        if (this.tempImage.x < -(App.GameWidth >> 1)) {
            this.tempImage.x = this.userImage.x + App.GameWidth;
            this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        }
        if (this.userImage.x > App.GameWidth && this.userImage.x - App.GameWidth < this.userImage.halfWidth) {
            var s = this.tempImage;
            this.tempImage = this.userImage;
            this.userImage = s;
            this.swapPoints();
        }
        if (this.tempImage.x > 3 * (App.GameWidth >> 1)) {
            this.tempImage.x = this.userImage.x - App.GameWidth;
            this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        }
        this.setRect();
    };
    ShootingUserController.prototype.swapPoints = function () {
        var x = this.userImagePoint.x;
        this.userImagePoint.x = this.tempImagePoint.x;
        this.tempImagePoint.x = x;
        var y = this.userImagePoint.y;
        this.userImagePoint.y = this.tempImagePoint.y;
        this.tempImagePoint.y = y;
    };
    ShootingUserController.prototype.dispose = function () {
        this.stopFire();
        App.TimerManager.remove(this.frame, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        this.bulletView.dispose();
    };
    return ShootingUserController;
}());
__reflect(ShootingUserController.prototype, "ShootingUserController");
var GameShooting = (function () {
    function GameShooting() {
        var _this = this;
        this.items = [];
        this.isOffLine = false;
        this.isWuDi = true;
        this.shields = {};
        this.bullets = [];
        this.pauseCallback = function () {
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
            GameShootingView.instance.next("gameChangeMatch");
        };
        this.startTime = function () {
            _this.itemController.play();
            _this.isWuDi = false;
            if (_this.isOffLine) {
                GameShootingAI.shieldLimit = UserConfig.shieldLimit;
                GameShootingAI.bulleteLimit = UserConfig.bulletLimit;
                _this.delayAi = setTimeout(function () {
                    _this.ai.play();
                    clearTimeout(_this.delayAi);
                    _this.delayAi = undefined;
                }, 100);
            }
        };
        this.onGameResult = function (data) {
            DataCenter.instance.room.gameResult = data;
            var resultPageFun = function () {
                if (data.winUserId == DataCenter.instance.user.id) {
                    GameShootingView.instance.resultWin();
                }
                else {
                    GameShootingView.instance.resultlose();
                }
                setTimeout(function () {
                    DataCenter.instance.room.gameResult = data;
                    GameShootingView.instance.popup("GameResult");
                    _this.dispose();
                }, 3000);
            };
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            // 发送游戏结果
            GameShootingView.instance.popup("GameResult", resultPageFun);
        };
        this.isWuDi = true;
        if (DataCenter.instance.room.IsAI) {
            this.isOffLine = true;
        }
        this.userID = DataCenter.instance.user.id.toString();
    }
    GameShooting.prototype.initObjects = function () {
        var arr = [];
        for (var i_1 = 0; i_1 < UserConfig.bulletLimit; i_1++) {
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
    };
    GameShooting.prototype.init = function () {
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
    };
    GameShooting.prototype.onGameEvent = function (data) {
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        switch (datas[0]) {
            case "nextRound":
                if (datas[1] == this.userID) {
                    this.scoreController.setUserScore(parseInt(datas[2]));
                    this.scoreController.setCompetitorScore(parseInt(datas[3]));
                }
                else {
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
    };
    GameShooting.prototype.nextRound = function () {
        this.competitorController.nextRound();
        this.userController.nextRound();
        this.clearGameItems();
        GameShootingView.instance.controlLayer.shield = UserConfig.shieldLimit;
        egret.Tween.get(GameShootingView.instance.roundBG).to({ alpha: 0 }, 100).call(function () {
            GameShootingView.instance.timeImg.play();
        });
    };
    //回掉中开启下一局
    GameShooting.prototype.stopThisRound = function (callback) {
        var _this = this;
        this.itemController.stop();
        if (this.isOffLine)
            this.ai.stop();
        if (callback) {
            this.stopthisRoundNumber = setTimeout(function () {
                egret.Tween.get(GameShootingView.instance.roundBG).to({ alpha: 0.9 }, 100).call(function () {
                    _this.clearGameItems();
                    callback();
                });
                clearTimeout(_this.stopthisRoundNumber);
                _this.stopthisRoundNumber = undefined;
            }, 200);
        }
        else {
            this.clearGameItems();
        }
    };
    GameShooting.prototype.initBgMusic = function () {
        App.SoundManager.playBg("ShootingBgMusic_mp3");
    };
    GameShooting.prototype.clearGameItems = function () {
        while (this.bullets.length) {
            var bullet = this.bullets[0];
            bullet.destroy();
        }
        for (var key in this.shields) {
            var shield = this.shields[key];
            shield.destroy();
        }
        this.shields = {};
        while (this.items.length) {
            var item = this.items[0];
            item.destroy();
        }
    };
    GameShooting.prototype.dispose = function () {
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
        this.clearGameItems();
        this.userController.dispose();
        this.itemController.dispose();
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
    };
    GameShooting.point = new egret.Point();
    return GameShooting;
}());
__reflect(GameShooting.prototype, "GameShooting");
var ShootingBulletController = (function (_super) {
    __extends(ShootingBulletController, _super);
    function ShootingBulletController() {
        var _this = _super.call(this) || this;
        _this.bulletlist = [];
        _this.stopBulletFlicker = function () {
            _this.cancelFlickerAndInterval();
            _this.alpha = 1;
            _this.recover();
        };
        _this.bulletReloadBar = new BulletReloadBar();
        _this.addChild(_this.bulletReloadBar);
        _this.bullets = new egret.DisplayObjectContainer();
        _this.addChild(_this.bullets);
        var x = 0;
        for (var i = 0; i < UserConfig.bulletLimit; i++) {
            var bullet = AssetManager.getBitmap("bullet1_png");
            bullet.scaleX = bullet.scaleY = 0.7;
            x += 40;
            bullet.x = x;
            _this.bullets.addChild(bullet);
            _this.bulletlist.push(bullet);
        }
        _this.index = UserConfig.bulletLimit - 1;
        _this.bulletLimit = UserConfig.bulletLimit;
        _this.x = 240;
        _this.y = 840 * GameShootingView.instance.adaptScaleY;
        GameShootingView.instance.basicLayer.addChildAt(_this, 10);
        return _this;
    }
    ShootingBulletController.prototype.fire = function () {
        if (this.index >= 0 && this.index < UserConfig.bulletLimit) {
            this.bulletlist[this.index].alpha = 0.3;
            this.index--;
            this.bulletLimit--;
        }
    };
    ShootingBulletController.prototype.cannotFire = function () {
        this.bulletReloadBar.flip();
    };
    ShootingBulletController.prototype.reload = function () {
        if (this.bulletFicker)
            return;
        if (!this.bulletFickerEffect)
            this.bulletFickerEffect = new EffectUtils();
        this.bulletFickerEffect.startFlicker(this.bullets, 500);
        this.bulletFicker = setInterval(this.stopBulletFlicker, UserConfig.reloadBullet);
    };
    ShootingBulletController.prototype.recover = function () {
        for (var _i = 0, _a = this.bulletlist; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.alpha = 1;
        }
        this.index = UserConfig.bulletLimit - 1;
        this.bulletLimit = UserConfig.bulletLimit;
    };
    ShootingBulletController.prototype.cancelFlickerAndInterval = function () {
        if (this.bulletFicker) {
            this.bulletFickerEffect.stopFlicker(this.bullets);
            clearInterval(this.bulletFicker);
            this.bulletFicker = undefined;
        }
    };
    ShootingBulletController.prototype.nextRound = function () {
        this.recover();
        this.cancelFlickerAndInterval();
        this.bulletReloadBar.nextRound();
    };
    ShootingBulletController.prototype.dispose = function () {
        for (var _i = 0, _a = this.bulletlist; _i < _a.length; _i++) {
            var bullet = _a[_i];
            this.bullets.removeChild(bullet);
        }
        this.bulletlist = [];
        this.cancelFlickerAndInterval();
        this.bulletReloadBar.dispose();
    };
    return ShootingBulletController;
}(egret.DisplayObjectContainer));
__reflect(ShootingBulletController.prototype, "ShootingBulletController");
var BulletReloadBar = (function (_super) {
    __extends(BulletReloadBar, _super);
    function BulletReloadBar() {
        var _this = _super.call(this) || this;
        _this.bar = AssetManager.getBitmap("bulletReloadOver_png", false, true);
        _this.addChild(_this.bar);
        _this.process = AssetManager.getBitmap("bulletReload_png", false, true);
        _this.addChild(_this.process);
        _this.process.alpha = 0;
        _this.barBorder = AssetManager.getBitmap("bulletBorderFlip_png", false, true);
        _this.addChildAt(_this.barBorder, 5);
        _this.barBorder.alpha = 0;
        _this.barMask = AssetManager.getBitmap("bulletReloadMask_png", false, true);
        _this.addChildAt(_this.barMask, 6);
        return _this;
    }
    BulletReloadBar.prototype.reload = function () {
        var _this = this;
        this.process.alpha = 1;
        var targetWidth = this.process.width;
        this.process.width = 1;
        egret.Tween.get(this.process).to({ width: targetWidth }, UserConfig.reloadBullet).call(function () {
            _this.process.alpha = 0;
        });
    };
    BulletReloadBar.prototype.flip = function () {
        egret.Tween.get(this.barBorder).to({ alpha: 1 }, 200).to({ alpha: 0 }, 100).to({ alpha: 1 }, 200).to({ alpha: 0 }, 100);
    };
    BulletReloadBar.prototype.nextRound = function () {
        egret.Tween.removeTweens(this.barBorder);
    };
    BulletReloadBar.prototype.dispose = function () {
        egret.Tween.removeTweens(this.barBorder);
    };
    return BulletReloadBar;
}(egret.DisplayObjectContainer));
__reflect(BulletReloadBar.prototype, "BulletReloadBar");
var ShootingComController = (function () {
    function ShootingComController() {
        var _this = this;
        this.setCompetitorShield = function () {
            var key = ShootingGetUID.getUID();
            App.SoundManager.playEffect("shootingSetWall_mp3", true);
            var shield = new ShootingShield("competitor", key);
            shield.x = _this.userImage.x + 10;
            shield.y = _this.userImage.y + 150 * GameShootingView.instance.adaptScaleY;
            shield.rotation = 180;
            shield.setRect(shield.x, shield.y);
            GameShootingView.instance.competitorshields.addChild(shield);
            GameShootingView.instance.shootingGame.shields[key] = shield;
        };
        this.walk = walkType.stand;
        this.userImage = new ShootingCharacter(DataCenter.instance.room.player);
        this.userImage.x = App.GameWidth - this.userImage.halfWidth;
        this.userImage.y = 100 * GameShootingView.instance.adaptScaleY;
        this.userImage.rotation = 180;
        this.tempImage = new ShootingCharacter(DataCenter.instance.room.player, true);
        this.tempImage.x = this.userImage.x - App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.tempImage.rotation = 180;
        this.tempImage.name = "temp";
        GameShootingView.instance.basicLayer.addChild(this.userImage);
        GameShootingView.instance.basicLayer.addChild(this.tempImage);
        this.initRectAndPoint();
        App.TimerManager.doFrame(1, 0, this.frame, this);
        //游戏内事件返回
        if (!GameShootingView.instance.shootingGame.isOffLine)
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
    }
    ShootingComController.prototype.initRectAndPoint = function () {
        this.userImagePoint = new egret.Point();
        this.tempImagePoint = new egret.Point();
        this.userImage.localToGlobal(0, 0, this.userImagePoint);
        this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        this.setRect();
    };
    ShootingComController.prototype.setRect = function () {
        this.userImage.setRect(this.userImagePoint.x - this.userImage.halfWidth, this.userImagePoint.y - this.userImage.halfHeight, this.userImage.width, this.userImage.height);
        this.tempImage.setRect(this.tempImagePoint.x - this.tempImage.halfWidth, this.tempImagePoint.y - this.tempImage.halfHeight, this.tempImage.width, this.tempImage.height);
    };
    ShootingComController.prototype.nextRound = function () {
        this.userImage.x = App.GameWidth - this.userImage.halfWidth;
        this.userImage.y = 100 * GameShootingView.instance.adaptScaleY;
        this.tempImage.x = this.userImage.x - App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.targetX = undefined;
        this.initRectAndPoint();
        this.userImage.nextRound();
    };
    /**接受网络传来的事件 */
    ShootingComController.prototype.onGameEvent = function (data) {
        if (data.userId == DataCenter.instance.user.id) {
            return;
        }
        /**
         * "stand|123"
         * command：stand && parameter：123
         * */
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        switch (datas[0]) {
            case "right":
                console.log("对手向左走了");
                this.walk = walkType.left;
                this.tempImage.walkLeft();
                this.userImage.walkLeft();
                break;
            case "left":
                console.log("对手向右走了");
                this.walk = walkType.right;
                this.tempImage.walkRight();
                this.userImage.walkRight();
                break;
            case "stand":
                console.log("对手不动了");
                this.walk = walkType.stand;
                var name_1 = datas[1];
                if (name_1 != this.userImage.name) {
                    var s = this.tempImage;
                    this.tempImage = this.userImage;
                    this.userImage = s;
                }
                this.targetX = App.GameWidth - parseInt(datas[2]);
                this.tempImage.stop();
                this.userImage.stop();
                this.tempImage.stand();
                this.userImage.stand();
                break;
            case "fire":
                console.log("对手开枪了");
                this.setCompetitorFire();
                break;
            case "shield":
                console.log("对手放盾牌了");
                this.setCompetitorShield();
                break;
        }
    };
    ShootingComController.prototype.frame = function (advancedTime) {
        if (GameShootingView.instance.shootingGame.isWuDi)
            return;
        var offset = UserConfig.walkSpeed * advancedTime / UserConfig.frameTime;
        switch (this.walk) {
            case walkType.left:
                this.setUserImageX(-offset);
                break;
            case walkType.right:
                this.setUserImageX(offset);
                break;
            case walkType.stand:
                if (!this.targetX)
                    return;
                if (this.targetX - this.userImage.x < UserConfig.walkSpeed && this.targetX - this.userImage.x > -UserConfig.walkSpeed) {
                    this.userImage.x = this.targetX;
                    if (this.targetX + App.GameWidth > App.GameWidth && this.targetX + App.GameWidth < 3 * (App.GameWidth >> 1))
                        this.tempImage.x = this.targetX + App.GameWidth;
                    else
                        this.tempImage.x = this.targetX - App.GameWidth;
                    this.targetX = undefined;
                    return;
                }
                offset = UserConfig.walkSpeed * advancedTime / UserConfig.frameTime;
                if (this.targetX - this.userImage.x > 0)
                    this.setUserImageX(offset, false);
                if (this.targetX - this.userImage.x < 0)
                    this.setUserImageX(-offset, false);
                break;
        }
    };
    ShootingComController.prototype.setCompetitorFire = function () {
        var bullet = ShootingBullet.createShootingBullet(this.userImage.paoPosition.x, this.userImage.paoPosition.y + 100 * GameShootingView.instance.adaptScaleY, 0);
        bullet.init("competitor", DirectionType.down);
        this.userImage.fire();
        App.SoundManager.playEffect("fire_mp3", true);
    };
    ShootingComController.prototype.setUserImageX = function (offset, isChange) {
        if (isChange === void 0) { isChange = true; }
        this.userImage.x += offset;
        this.tempImage.x += offset;
        this.userImagePoint.x += offset;
        this.tempImagePoint.x += offset;
        if (isChange) {
            if (this.userImage.x < 0 && this.userImage.x > -this.userImage.halfWidth) {
                var s = this.tempImage;
                this.tempImage = this.userImage;
                this.userImage = s;
                this.swapPoints();
            }
            if (this.userImage.x > App.GameWidth && this.userImage.x - App.GameWidth < this.userImage.halfWidth) {
                var s = this.tempImage;
                this.tempImage = this.userImage;
                this.userImage = s;
                this.swapPoints();
            }
        }
        if (this.tempImage.x < -(App.GameWidth >> 1)) {
            this.tempImage.x = this.userImage.x + App.GameWidth;
            this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        }
        if (this.tempImage.x > 3 * (App.GameWidth >> 1)) {
            this.tempImage.x = this.userImage.x - App.GameWidth;
            this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        }
        this.setRect();
    };
    ShootingComController.prototype.swapPoints = function () {
        var x = this.userImagePoint.x;
        this.userImagePoint.x = this.tempImagePoint.x;
        this.tempImagePoint.x = x;
        var y = this.userImagePoint.y;
        this.userImagePoint.y = this.tempImagePoint.y;
        this.tempImagePoint.y = y;
    };
    ShootingComController.prototype.dispose = function () {
        App.TimerManager.remove(this.frame, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
    };
    return ShootingComController;
}());
__reflect(ShootingComController.prototype, "ShootingComController");
var GameShootingAI = (function () {
    function GameShootingAI(cc) {
        var _this = this;
        this.stop = function () {
            App.TimerManager.remove(_this.aiControl, _this);
        };
        this.play = function () {
            App.TimerManager.doTimer(UserConfig.AITime, 0, _this.aiControl, _this);
        };
        this.competitorController = cc;
        GameShootingAI.shieldLimit = UserConfig.shieldLimit;
        GameShootingAI.bulleteLimit = UserConfig.bulletLimit;
    }
    GameShootingAI.prototype.aiControl = function () {
        if (GameShootingView.instance.shootingGame.isWuDi) {
            return;
        }
        if (GameShootingAI.bulleteLimit <= 0 && !GameShootingAI.isReload) {
            App.TimerManager.doTimer(UserConfig.reloadBullet, 1, function () {
                GameShootingAI.bulleteLimit = UserConfig.bulletLimit;
                GameShootingAI.isReload = false;
            }, this);
            GameShootingAI.isReload = true;
        }
        var random = Math.random();
        if (random < 0.6) {
            if (GameShootingAI.bulleteLimit > 0) {
                this.competitorController["setCompetitorFire"]();
                GameShootingAI.bulleteLimit--;
            }
        }
        if (random < 0.5 && GameShootingAI.shieldLimit > 0) {
            this.competitorController["setCompetitorShield"]();
            GameShootingAI.shieldLimit--;
        }
        if (random < 0.3) {
            this.competitorController["walk"] = walkType.right;
            return;
        }
        if (random < 0.6) {
            this.competitorController["walk"] = walkType.left;
            return;
        }
        if (random < 0.9) {
            this.competitorController["walk"] = walkType.stand;
            return;
        }
    };
    GameShootingAI.addAIItem = function () {
        var random = Math.random();
        var item;
        var direct;
        if (random < 0.2) {
            item = ObjectPool.pop(ShootingRocket, "ShootingRocket");
            direct = ShootingItemDirectionType.left;
        }
        else if (random < 0.4) {
            item = ObjectPool.pop(ShootingRocket, "ShootingRocket");
            direct = ShootingItemDirectionType.right;
        }
        else if (random < 0.6) {
            item = ObjectPool.pop(ShootingSplit, "ShootingSplit");
            direct = ShootingItemDirectionType.right;
        }
        else if (random < 0.8) {
            item = ObjectPool.pop(ShootingSplit, "ShootingSplit");
            direct = ShootingItemDirectionType.left;
        }
        else {
            return;
        }
        item.init(direct);
    };
    GameShootingAI.prototype.dipose = function () {
        this.stop();
    };
    GameShootingAI.isReload = false;
    return GameShootingAI;
}());
__reflect(GameShootingAI.prototype, "GameShootingAI");
var ShootingItemController = (function () {
    function ShootingItemController() {
        this.isMain = false;
        this.isMain = DataCenter.instance.room.selfIsMaster;
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.webListener, this);
    }
    ShootingItemController.prototype.play = function () {
        if (GameShootingView.instance.shootingGame.isOffLine) {
            App.TimerManager.doTimer(UserConfig.ItemTime, 0, GameShootingAI.addAIItem, GameShootingAI);
        }
        else {
            if (this.isMain) {
                App.TimerManager.doTimer(UserConfig.ItemTime, 0, this.addItem, this);
            }
        }
    };
    ShootingItemController.prototype.stop = function () {
        if (GameShootingView.instance.shootingGame.isOffLine) {
            App.TimerManager.remove(GameShootingAI.addAIItem, GameShootingAI);
        }
        else {
            if (this.isMain) {
                App.TimerManager.remove(this.addItem, this);
            }
        }
    };
    ShootingItemController.prototype.addItem = function () {
        var random = Math.random();
        if (random < 0.2) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|rocket|left", 1);
            return;
        }
        else if (random < 0.4) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|rocket|right", 1);
            return;
        }
        else if (random < 0.6) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|split|right", 1);
            return;
        }
        else if (random < 0.8) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|split|left", 1);
            return;
        }
    };
    ShootingItemController.prototype.webListener = function (data) {
        /**
         * "stand|123"
         * command：stand && parameter：123
         * */
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        var item;
        //自己是主机
        var direct;
        if (datas[0] == DataCenter.instance.user.id.toString()) {
            direct = ShootingItemDirectionType[datas[2]];
        }
        else {
            direct = ShootingItemDirectionType[datas[2]] == 0 ? 1 : 0;
        }
        switch (datas[1]) {
            case "rocket":
                item = ObjectPool.pop(ShootingRocket, "ShootingRocket");
                break;
            case "split":
                item = ObjectPool.pop(ShootingSplit, "ShootingSplit");
                break;
            default:
                return;
        }
        item.init(direct);
    };
    ShootingItemController.prototype.dispose = function () {
        this.stop();
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.webListener, this);
    };
    return ShootingItemController;
}());
__reflect(ShootingItemController.prototype, "ShootingItemController");
var ShootingScoreController = (function () {
    function ShootingScoreController() {
        this.userHPs = [];
        this.competitorHPs = [];
        this.selfHPContainer = new egret.DisplayObjectContainer();
        this.competitorContainer = new egret.DisplayObjectContainer();
        this.userScore = 0;
        this.competitorScore = 0;
        var offset = 0;
        for (var i = 0; i < UserConfig.scores; i++) {
            var hp = AssetManager.getQuickDBArmature("HP");
            offset += 50;
            hp.y = offset;
            this.selfHPContainer.addChild(hp);
            var a = { isDestroy: false, hp: hp };
            this.userHPs.push(a);
        }
        offset = 0;
        for (var i = 0; i < UserConfig.scores; i++) {
            var hp = AssetManager.getQuickDBArmature("HP");
            hp.rotation = 180;
            offset += 50;
            hp.y = offset;
            this.competitorContainer.addChild(hp);
            var b = { isDestroy: false, hp: hp };
            this.competitorHPs.push(b);
        }
        this.userIndex = UserConfig.scores - 1;
        this.competitorIndex = UserConfig.scores - 1;
        this.selfHPContainer.y = 500 * GameShootingView.instance.adaptScaleY;
        this.selfHPContainer.x = 30;
        GameShootingView.instance.controlLayer.addChild(this.selfHPContainer);
        this.competitorContainer.y = 200 * GameShootingView.instance.adaptScaleY;
        this.competitorContainer.x = App.GameWidth - 30;
        GameShootingView.instance.controlLayer.addChild(this.competitorContainer);
    }
    /**
     * 回掉包含音乐动画还有开启下一局需要参数
     */
    ShootingScoreController.prototype.win = function (next) {
        if (!this.competitorHPs[this.competitorIndex])
            return;
        this.userScore++;
        this.competitorHPs[this.competitorIndex].isDestroy = true;
        this.competitorHPs[this.competitorIndex].hp.play("destroy", 1);
        this.competitorIndex--;
        if (this.userScore >= UserConfig.scores) {
            next(false);
            GameShootingView.instance.resultWin();
            this.sendmessage(3);
        }
        else {
            next(true);
        }
    };
    ShootingScoreController.prototype.lose = function (next) {
        if (!this.userHPs[this.userIndex])
            return;
        this.competitorScore++;
        this.userHPs[this.userIndex].isDestroy = true;
        this.userHPs[this.userIndex].hp.play("destroy", 1);
        this.userIndex--;
        if (this.competitorScore >= UserConfig.scores) {
            next(false);
            GameShootingView.instance.resultlose();
            this.sendmessage(1);
        }
        else {
            next(true);
        }
    };
    ShootingScoreController.prototype.sendmessage = function (win) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, win);
    };
    ShootingScoreController.prototype.setUserScore = function (score) {
        if (score == this.userScore)
            return;
        if (score >= 0 && score <= UserConfig.scores) {
            var i = 1;
            for (; i <= score; i++) {
                if (!this.competitorHPs[UserConfig.scores - i].isDestroy) {
                    this.competitorHPs[UserConfig.scores - i].isDestroy = true;
                    this.competitorHPs[UserConfig.scores - i].hp.play("destroy", 1);
                }
            }
            i++;
            this.userIndex = UserConfig.scores - i;
            for (; i <= UserConfig.scores; i++) {
                this.competitorHPs[UserConfig.scores - i].isDestroy = false;
                this.competitorHPs[UserConfig.scores - i].hp.play("normal", 1);
            }
            this.userScore = score;
        }
    };
    ShootingScoreController.prototype.setCompetitorScore = function (score) {
        if (score == this.competitorScore)
            return;
        if (score > 0 && score < UserConfig.scores) {
            var i = 1;
            for (; i <= score; i++) {
                if (!this.userHPs[UserConfig.scores - i].isDestroy) {
                    this.userHPs[UserConfig.scores - i].isDestroy = true;
                    this.userHPs[UserConfig.scores - i].hp.play("destroy", 1);
                }
            }
            i++;
            this.competitorIndex = UserConfig.scores - i;
            for (; i <= UserConfig.scores; i++) {
                this.userHPs[UserConfig.scores - i].isDestroy = false;
                this.userHPs[UserConfig.scores - i].hp.play("normal", 1);
            }
            this.competitorScore = score;
        }
    };
    ShootingScoreController.prototype.dispose = function () {
        for (var _i = 0, _a = this.userHPs; _i < _a.length; _i++) {
            var HP = _a[_i];
            HP.isDestroy = false;
            HP.hp.parent.removeChild(HP.hp);
        }
        for (var _b = 0, _c = this.competitorHPs; _b < _c.length; _b++) {
            var HP = _c[_b];
            HP.isDestroy = false;
            HP.hp.parent.removeChild(HP.hp);
        }
        this.userHPs = [];
        this.competitorHPs = [];
        this.userScore = 0;
        this.competitorScore = 0;
        this.userIndex = 0;
        this.competitorIndex = 0;
    };
    return ShootingScoreController;
}());
__reflect(ShootingScoreController.prototype, "ShootingScoreController");
var GameShootingView = (function (_super) {
    __extends(GameShootingView, _super);
    function GameShootingView() {
        var _this = _super.call(this) || this;
        GameShootingView.instance = _this;
        _this.background = AssetManager.getBitmap("background_png", false, false);
        _this.adaptScaleY = App.GameHeight / _this.background.height;
        _this.background.height = App.GameHeight;
        //图层顺序添加
        _this.basicLayer = new egret.DisplayObjectContainer();
        _this.selfShields = new egret.DisplayObjectContainer();
        _this.bulletsLayer = new egret.DisplayObjectContainer();
        _this.competitorshields = new egret.DisplayObjectContainer();
        _this.controlLayer = new ControlLayer();
        _this.addChild(_this.basicLayer);
        _this.addChild(_this.competitorshields);
        _this.addChild(_this.bulletsLayer);
        _this.addChild(_this.selfShields);
        _this.addChild(_this.controlLayer);
        //回合结束黑屏
        _this.roundBG = new egret.Shape();
        _this.roundBG.alpha = 0;
        _this.roundBG.graphics.beginFill(0x000000);
        _this.roundBG.graphics.drawRect(0, 0, App.GameWidth, App.GameHeight);
        _this.roundBG.graphics.endFill();
        _this.addChild(_this.roundBG);
        _this.basicLayer.addChild(_this.background);
        _this.shootingGame = new GameShooting();
        _this.shootingGame.init();
        _this.timeImg = new GameReady(GameShootingView.instance.shootingGame.startTime);
        _this.timeImg.x = 300;
        _this.timeImg.y = App.GameHeight / 2;
        _this.basicLayer.addChild(_this.timeImg);
        _this.timeImg.play();
        _this.result = new gameResultInGame();
        _this.controlLayer.addChild(_this.result);
        return _this;
    }
    GameShootingView.prototype.resultWin = function () {
        this.result.win();
    };
    GameShootingView.prototype.resultlose = function () {
        this.result.lose();
    };
    GameShootingView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.timeImg.dispose();
        this.controlLayer.dispose();
        this.result.dispose();
        this.shootingGame.dispose();
    };
    return GameShootingView;
}(State));
__reflect(GameShootingView.prototype, "GameShootingView");
var ControlLayer = (function (_super) {
    __extends(ControlLayer, _super);
    function ControlLayer() {
        var _this = _super.call(this) || this;
        _this.onKeyDown = function (evt) {
            console.log(evt.keyCode);
            if (evt.keyCode == 65 || evt.keyCode == 37) {
                _this.leftButtonPress();
            }
            if (evt.keyCode == 68 || evt.keyCode == 39) {
                _this.rightButtonPress();
            }
            if (evt.keyCode == 87 || evt.keyCode == 38) {
                _this.fireButtonPress();
            }
            if (evt.keyCode == 83 || evt.keyCode == 40) {
                _this.shieldButtonTap();
            }
        };
        _this.onKeyUp = function (evt) {
            if (evt.keyCode == 65 || evt.keyCode == 37) {
                _this.directAreaRelease();
            }
            if (evt.keyCode == 68 || evt.keyCode == 39) {
                _this.directAreaRelease();
            }
            if (evt.keyCode == 87 || evt.keyCode == 38) {
                _this.fireButtonRelease();
            }
        };
        _this.leftButtonPress = function () {
            GameShootingView.instance.shootingGame.userController.walk = walkType.left;
            _this.directArea.addEventListener(egret.TouchEvent.TOUCH_END, _this.controlRelease, _this);
            _this.directArea.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.controlTouchMove, _this);
        };
        _this.rightButtonPress = function () {
            GameShootingView.instance.shootingGame.userController.walk = walkType.right;
            _this.directArea.addEventListener(egret.TouchEvent.TOUCH_END, _this.controlRelease, _this);
            _this.directArea.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.controlTouchMove, _this);
        };
        _this.controlPress = function () {
            _this.directArea.addEventListener(egret.TouchEvent.TOUCH_END, _this.controlRelease, _this);
            _this.directArea.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.controlTouchMove, _this);
        };
        _this.touchPoint = new egret.Point();
        _this.controlTouchMove = function (event) {
            _this.touchPoint.x = event.stageX;
            _this.touchPoint.y = event.stageY;
            if (_this.leftRect.containsPoint(_this.touchPoint)) {
                GameShootingView.instance.shootingGame.userController.walk = walkType.left;
                return;
            }
            if (_this.rightRect.containsPoint(_this.touchPoint)) {
                GameShootingView.instance.shootingGame.userController.walk = walkType.right;
                return;
            }
            if (!_this.directAreaRect.containsPoint(_this.touchPoint)) {
                _this.controlRelease();
                return;
            }
            GameShootingView.instance.shootingGame.userController.walk = walkType.stand;
        };
        _this.controlRelease = function () {
            _this.directArea.removeEventListener(egret.TouchEvent.TOUCH_END, _this.controlRelease, _this);
            _this.directArea.removeEventListener(egret.TouchEvent.TOUCH_MOVE, _this.controlTouchMove, _this);
            GameShootingView.instance.shootingGame.userController.walk = walkType.stand;
        };
        _this.addUIButton();
        return _this;
    }
    Object.defineProperty(ControlLayer.prototype, "shield", {
        get: function () {
            return this._shield;
        },
        set: function (value) {
            if (value >= 0 && value <= 3) {
                this._shield = value;
                this.shieldNumberImg.texture = AssetManager.getBitmap("D" + value + "_png").texture;
                if (value == 0)
                    this.shieldButton["_armature"].replaceSlot("shield", AssetManager.getBitmap("shieldGray_png"));
                else
                    this.shieldButton["_armature"].replaceSlot("shield", AssetManager.getBitmap("shield_png"));
            }
        },
        enumerable: true,
        configurable: true
    });
    ControlLayer.prototype.addUIButton = function () {
        this.directArea = new egret.DisplayObjectContainer();
        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba) {
            this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            this.returnToLastButton.y = 19;
            this.addChild(this.returnToLastButton);
            this.returnToLastButton.touchEnabled = true;
            this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                GameShootingView.instance.popup("GameSureLeave");
            }, this);
        }
        this.leftButton = new DBAnimButton(AssetManager.getQuickDBArmature("rightButton"));
        this.leftButton.scaleX = -1;
        this.directArea.addChild(this.leftButton);
        this.leftButton.x = 10;
        this.leftButton.y = 10;
        this.leftButton.touchEnabled = true;
        this.leftButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.leftButtonPress, this);
        this.rightButton = new DBAnimButton(AssetManager.getQuickDBArmature("rightButton"));
        this.directArea.addChild(this.rightButton);
        this.rightButton.x = 160;
        this.rightButton.y = 10;
        this.rightButton.touchEnabled = true;
        this.rightButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.rightButtonPress, this);
        this.directArea.x = 80;
        this.directArea.y = GameShootingView.instance.background.height - 100;
        this.addChild(this.directArea);
        this.touchEnabled = this.touchChildren = true;
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.controlPress, this);
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.directAreaRelease, this);
        var point;
        point = this.leftButton.localToGlobal(this.leftButton.width / 2 - 10, -this.leftButton.height / 2 + 10, point);
        this.leftRect = new egret.Rectangle(point.x, point.y, this.leftButton.width, this.leftButton.height);
        point = this.rightButton.localToGlobal(-this.rightButton.width / 2 - 10, -this.rightButton.height / 2 + 10, point);
        this.rightRect = new egret.Rectangle(point.x, point.y, this.rightButton.width, this.rightButton.height);
        this.directArea.height += 20;
        this.directArea.width += 20;
        point = this.directArea.localToGlobal(10, -this.directArea.height / 2 + 10, point);
        this.directAreaRect = new egret.Rectangle(point.x, point.y, this.directArea.width - 20, this.directArea.height - 20);
        this.shieldButton = new DBAnimButton(AssetManager.getQuickDBArmature("shieldButton"));
        this.shieldButton.x = 400;
        this.shieldButton.y = GameShootingView.instance.background.height - 100;
        this.addChild(this.shieldButton);
        this.shieldButton.touchEnabled = true;
        this.shieldButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shieldButtonTap, this);
        this.shieldNumberImg = AssetManager.getBitmap("D3_png");
        this.shieldNumberImg.x = this.shieldButton.x + this.shieldButton.width / 4;
        this.shieldNumberImg.y = this.shieldButton.y - this.shieldButton.height / 4;
        this.addChild(this.shieldNumberImg);
        this.fireButton = new DBAnimButton(AssetManager.getQuickDBArmature("fireButton"));
        this.fireButton.x = 550;
        this.fireButton.y = GameShootingView.instance.background.height - 100;
        this.addChild(this.fireButton);
        this.fireButton.touchEnabled = true;
        this.fireButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.fireButtonPress, this);
        this.fireButton.addEventListener(egret.TouchEvent.TOUCH_END, this.fireButtonRelease, this);
        this.fireButton.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.fireButtonRelease, this);
        this.shield = UserConfig.shieldLimit;
        this.boom = AssetManager.getQuickDBArmature("boom");
        this.boom.addDisplayEvent(dragonBones.EventObject.COMPLETE, this.boomOver, this);
        // document.addEventListener("keydown", this.onKeyDown);
        // document.addEventListener("keyup", this.onKeyUp);
    };
    ControlLayer.prototype.directAreaRelease = function () {
        GameShootingView.instance.shootingGame.userController.walk = walkType.stand;
    };
    ControlLayer.prototype.fireButtonPress = function () {
        GameShootingView.instance.shootingGame.userController.startFire();
    };
    ControlLayer.prototype.fireButtonRelease = function () {
        GameShootingView.instance.shootingGame.userController.stopFire();
    };
    ControlLayer.prototype.shieldButtonTap = function () {
        GameShootingView.instance.shootingGame.userController.setShield();
    };
    ControlLayer.prototype.dispose = function () {
        this.leftButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.leftButtonPress, this);
        this.rightButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.rightButtonPress, this);
        this.directArea.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.controlPress, this);
        this.fireButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.fireButtonPress, this);
        this.fireButton.removeEventListener(egret.TouchEvent.TOUCH_END, this.fireButtonRelease, this);
        this.fireButton.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.fireButtonRelease, this);
        this.directArea.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.directAreaRelease, this);
        this.shieldButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shieldButtonTap, this);
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keyup", this.onKeyUp);
        this.boom.dispose();
    };
    ControlLayer.prototype.boomPlay = function (x, y) {
        this.boom.x = x;
        this.boom.y = y;
        this.boom.play("boom", 1);
        App.DisplayUtils.quickAddChild(this, this.boom);
    };
    ControlLayer.prototype.boomOver = function () {
        App.DisplayUtils.quickRemoveChild(this.boom);
    };
    return ControlLayer;
}(egret.DisplayObjectContainer));
__reflect(ControlLayer.prototype, "ControlLayer");
var DirectionType;
(function (DirectionType) {
    DirectionType[DirectionType["up"] = 0] = "up";
    DirectionType[DirectionType["down"] = 1] = "down";
})(DirectionType || (DirectionType = {}));
var BulletType;
(function (BulletType) {
    BulletType[BulletType["common"] = 0] = "common";
    BulletType[BulletType["rocket"] = 1] = "rocket";
})(BulletType || (BulletType = {}));
var ShootingBullet = (function (_super) {
    __extends(ShootingBullet, _super);
    function ShootingBullet(bitmapUrl) {
        var _this = _super.call(this) || this;
        /**有可能存在延迟，标脏 */
        _this.isDestroy = false;
        _this.init = function (owner, direction, bullettype) {
            _this.isDestroy = false;
            _this._owner = owner;
            _this.direction = direction;
            if (!bullettype) {
                _this.type = BulletType.common;
            }
            else {
                _this.type = bullettype;
            }
            App.TimerManager.doFrame(5 / GameShootingView.instance.adaptScaleY, 0, _this.collisonFrame, _this);
            App.TimerManager.doFrame(1, 0, _this.transformFrame, _this);
        };
        _this.destroy = function (isPlay) {
            if (isPlay === void 0) { isPlay = false; }
            _this.isDestroy = true;
            App.TimerManager.remove(_this.collisonFrame, _this);
            App.TimerManager.remove(_this.transformFrame, _this);
            if (_this.delayNextRound) {
                clearTimeout(_this.delayNextRound);
                _this.delayNextRound = undefined;
            }
            if (isPlay) {
                if (_this.direction == DirectionType.up) {
                    _this.baozha.rotation = 180;
                    _this.baozha.y = -50;
                }
                else {
                    _this.baozha.y = 50;
                }
                _this.baozha.play("baozha", 1);
                _this.baozha.addDisplayEvent(dragonBones.EventObject.COMPLETE, _this.baozhaOver, _this);
                App.DisplayUtils.quickAddChild(_this, _this.baozha);
            }
            else {
                _this.removeFromParent();
            }
        };
        _this.baozhaOver = function () {
            _this.removeFromParent();
        };
        _this.collisonFrame = function (advancedTime) {
            if (_this.isDestroy) {
                return;
            }
            _this.rect_bullet.x = _this.globalPoint.x - _this.halfWidth;
            _this.rect_bullet.y = _this.globalPoint.y - _this.halfHeight;
            _this.collisonShields() || _this.collisonItems() || _this.collisonUser();
        };
        _this.transformFrame = function (advancedTime) {
            //子弹的运动控制
            if (_this.isDestroy) {
                return;
            }
            //子弹的运动
            var offsetX = _this.moveSpeed_x * advancedTime * GameShootingView.instance.adaptScaleY;
            var offsetY = _this.moveSpeed_y * advancedTime * GameShootingView.instance.adaptScaleY;
            switch (_this.direction) {
                case DirectionType.down:
                    _this.y += offsetY;
                    _this.x -= offsetX;
                    _this.globalPoint.x -= offsetX;
                    _this.globalPoint.y += offsetY;
                    if (_this.globalPoint.y > 760 / 1136 * App.GameHeight) {
                        _this.destroy(true);
                        return;
                    }
                    break;
                case DirectionType.up:
                    _this.y -= offsetY;
                    _this.x += offsetX;
                    _this.globalPoint.x += offsetX;
                    _this.globalPoint.y -= offsetY;
                    if (_this.globalPoint.y < 150 / 1136 * App.GameHeight) {
                        _this.destroy(true);
                        return;
                    }
                    break;
            }
        };
        _this.stopRoundAndNext = function () {
            var shootingGame = GameShootingView.instance.shootingGame;
            shootingGame.stopThisRound(function () {
                if (GameShootingView.instance.shootingGame.isOffLine)
                    _this.delayNextRound = setTimeout(function () {
                        shootingGame.nextRound();
                        clearTimeout(_this.delayNextRound);
                        _this.delayNextRound = undefined;
                    }, 100);
                else {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "nextRound|" + shootingGame.userID + "|" + shootingGame.scoreController.userScore + "|" + shootingGame.scoreController.competitorScore, 1);
                }
            });
        };
        _this.stopRound = function () {
            var shootingGame = GameShootingView.instance.shootingGame;
            shootingGame.stopThisRound();
        };
        _this.rect_bullet = new egret.Rectangle();
        _this.globalPoint = new egret.Point();
        //创建图片
        _this.bullet_img = AssetManager.getBitmap(bitmapUrl);
        App.DisplayUtils.quickAddChild(_this, _this.bullet_img);
        //效率优化
        _this.width = _this.width;
        _this.height = _this.height;
        _this.halfWidth = (_this.width >> 1);
        _this.halfHeight = (_this.height >> 1);
        //创建爆炸效果
        _this.baozha = AssetManager.getQuickDBArmature("game2_pao");
        return _this;
    }
    Object.defineProperty(ShootingBullet.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        enumerable: true,
        configurable: true
    });
    ShootingBullet.prototype.collisonShields = function () {
        //与盾牌碰撞
        var shootingGame = GameShootingView.instance.shootingGame;
        for (var key in shootingGame.shields) {
            var shield = shootingGame.shields[key];
            if (shield.owner != this.owner) {
                if (App.RectangleUtils.intersects(this.rect_bullet, shield.getRect())) {
                    if (this.type == BulletType.rocket) {
                        if (shootingGame.isOffLine) {
                            shield.destroy();
                        }
                        else {
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shieldDestroy|" + shield.uid, 1);
                        }
                        return true;
                    }
                    else {
                        shield.hit();
                        this.destroy(true);
                        return true;
                    }
                }
            }
        }
        return false;
    };
    ShootingBullet.prototype.collisonItems = function () {
        //与道具碰撞
        var shootingGame = GameShootingView.instance.shootingGame;
        for (var _i = 0, _a = shootingGame.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (App.RectangleUtils.intersects(this.rect_bullet, item.getRect())) {
                item.effect(this);
                return true;
            }
        }
        return false;
    };
    ShootingBullet.prototype.collisonUser = function () {
        var _this = this;
        //与角色碰撞
        var shootingGame = GameShootingView.instance.shootingGame;
        var userImage = this.owner == "competitor" ? shootingGame.userController.userImage : shootingGame.competitorController.userImage;
        if (App.RectangleUtils.intersects(this.rect_bullet, userImage.getRect())) {
            if (!shootingGame.isWuDi) {
                shootingGame.isWuDi = true;
                this.destroy(true);
                //音效+动画+判断下一局开不开启
                var next = function (isNext) {
                    var effectName = _this.owner == "competitor" ? "boom_self_mp3" : "boom_competitor_mp3";
                    App.SoundManager.playEffect(effectName, true);
                    userImage.stop();
                    if (isNext)
                        userImage.lose(_this.stopRoundAndNext);
                    else
                        userImage.lose(_this.stopRound);
                };
                if (this.owner == "competitor") {
                    shootingGame.scoreController.lose(next);
                }
                else {
                    shootingGame.scoreController.win(next);
                }
                return true;
            }
        }
        return false;
    };
    ShootingBullet.prototype.removeFromParent = function () {
        this.baozha.stop();
        this.baozha.removeDisplayEvent(dragonBones.EventObject.COMPLETE, this.baozhaOver, this);
        App.DisplayUtils.quickRemoveChild(this.baozha);
        App.DisplayUtils.quickRemoveChild(this);
        var index = GameShootingView.instance.shootingGame.bullets.indexOf(this);
        GameShootingView.instance.shootingGame.bullets.splice(index, 1);
        ObjectPool.push(this);
    };
    ShootingBullet.prototype.setRotation = function ($rotation) {
        this.rotation = $rotation;
        this.moveSpeed_x = UserConfig.bulletSpeed * Math.sin($rotation / 180 * Math.PI) / UserConfig.frameTime;
        this.moveSpeed_y = UserConfig.bulletSpeed * Math.cos($rotation / 180 * Math.PI) / UserConfig.frameTime;
    };
    ShootingBullet.createShootingBulletInit = function (bullet, $x, $y, $rotation) {
        bullet.x = $x;
        bullet.y = $y;
        bullet.setRotation($rotation);
        App.DisplayUtils.quickAddChild(GameShootingView.instance.bulletsLayer, bullet);
        GameShootingView.instance.shootingGame.bullets.push(bullet);
        bullet.localToGlobal(0, 0, bullet.globalPoint);
        bullet.rect_bullet.setTo(bullet.globalPoint.x - bullet.halfWidth, bullet.globalPoint.y - bullet.halfHeight, bullet.width, bullet.height);
    };
    ShootingBullet.popShootingBullet = function () {
        return ObjectPool.pop(ShootingBullet, "ShootingBullet", "bullet1_png");
    };
    ShootingBullet.popShootingBullet_rocket = function () {
        return ObjectPool.pop(ShootingBullet, "ShootingBullet_rocket", "rocket_png");
    };
    ShootingBullet.createShootingBullet = function ($x, $y, $rotation) {
        var newBullet = this.popShootingBullet();
        this.createShootingBulletInit(newBullet, $x, $y, $rotation);
        return newBullet;
    };
    ShootingBullet.createShootingBullet_rocket = function ($x, $y, $rotation) {
        var newBullet = this.popShootingBullet_rocket();
        this.createShootingBulletInit(newBullet, $x, $y, $rotation);
        return newBullet;
    };
    ShootingBullet.createShootingBulletByBullet = function (bullet, rotation) {
        var newBullet = this.createShootingBullet(bullet.x, bullet.y, rotation);
        newBullet.init(bullet.owner, bullet.direction);
        return newBullet;
    };
    ShootingBullet.createShootingBullet_rocketByBullet = function (bullet, rotation) {
        var newBullet = this.createShootingBullet_rocket(bullet.x, bullet.y, rotation);
        newBullet.init(bullet.owner, bullet.direction, BulletType.rocket);
        return newBullet;
    };
    return ShootingBullet;
}(egret.DisplayObjectContainer));
__reflect(ShootingBullet.prototype, "ShootingBullet");
var ShootingCharacter = (function (_super) {
    __extends(ShootingCharacter, _super);
    function ShootingCharacter(persondata, istemp, defaultAvatar) {
        if (istemp === void 0) { istemp = false; }
        if (defaultAvatar === void 0) { defaultAvatar = "game2_pao"; }
        var _this = _super.call(this) || this;
        _this.istemp = false;
        _this.userImage = AssetManager.getQuickDBArmature(defaultAvatar);
        _this.userImage.x = 30;
        _this.istemp = istemp;
        _this.personImg = new RoleAvatar(persondata.curAvatarType, persondata.imgUrl).armature;
        _this.personImg.scaleX = 0.8;
        _this.personImg.scaleY = 0.8;
        _this.personImg.play("home");
        _this.addChild(_this.personImg);
        _this.addChild(_this.userImage);
        _this.width = _this.width;
        _this.height = _this.height;
        _this.halfWidth = _this.width >> 1;
        _this.halfHeight = _this.height >> 1;
        _this._rect = new egret.Rectangle();
        _this._paoPosition = new egret.Point();
        return _this;
    }
    ShootingCharacter.prototype.setRect = function (x, y, width, height) {
        this._rect.x = x;
        this._rect.y = y;
        this._rect.width = width;
        this._rect.height = height;
    };
    ShootingCharacter.prototype.getRect = function () {
        return this._rect;
    };
    Object.defineProperty(ShootingCharacter.prototype, "paoPosition", {
        get: function () {
            this.localToGlobal(this.userImage.x, this.userImage.y, this._paoPosition);
            return this._paoPosition;
        },
        enumerable: true,
        configurable: true
    });
    ShootingCharacter.prototype.walkLeft = function () {
        this.userImage.play("zuo");
    };
    ShootingCharacter.prototype.walkRight = function () {
        this.userImage.play("you");
    };
    ShootingCharacter.prototype.stand = function () {
        this.userImage.stop();
        this.userImage.play("wz", 1);
    };
    ShootingCharacter.prototype.lose = function (callback) {
        var _this = this;
        this.userImage.play("over", 1);
        this.personImg.play("Loser1", 1);
        if (callback) {
            var call_1 = function () {
                _this.userImage.removeDisplayEvent(dragonBones.EventObject.COMPLETE, call_1, _this);
                callback();
            };
            this.userImage.addDisplayEvent(dragonBones.EventObject.COMPLETE, call_1, this);
        }
    };
    ShootingCharacter.prototype.nextRound = function () {
        this.userImage.play("wz", 1);
        this.personImg.play("home");
    };
    ShootingCharacter.prototype.fire = function () {
        this.userImage.play("paoshe", 1);
    };
    ShootingCharacter.prototype.stop = function () {
        this.userImage.stop();
        this.personImg.stop();
    };
    return ShootingCharacter;
}(egret.DisplayObjectContainer));
__reflect(ShootingCharacter.prototype, "ShootingCharacter");
var ShootingItemDirectionType;
(function (ShootingItemDirectionType) {
    ShootingItemDirectionType[ShootingItemDirectionType["left"] = 0] = "left";
    ShootingItemDirectionType[ShootingItemDirectionType["right"] = 1] = "right";
})(ShootingItemDirectionType || (ShootingItemDirectionType = {}));
var ShootingItem = (function (_super) {
    __extends(ShootingItem, _super);
    function ShootingItem() {
        var _this = _super.call(this) || this;
        _this._isDestroy = false;
        _this.frame = function (advancedTime) {
            if (_this._isDestroy) {
                return;
            }
            var speedX = UserConfig.ItemSpeed * advancedTime / UserConfig.frameTime;
            switch (_this._direction) {
                case ShootingItemDirectionType.left:
                    _this.x -= speedX;
                    _this._itemPoint.x -= speedX;
                    _this._rect.x -= speedX;
                    break;
                case ShootingItemDirectionType.right:
                    _this.x += speedX;
                    _this._itemPoint.x += speedX;
                    _this._rect.x += speedX;
                    break;
            }
            if (_this._itemPoint.x < -300 || _this._itemPoint.x > App.GameWidth + 300) {
                _this.destroy();
            }
        };
        _this._rect = new egret.Rectangle();
        _this._itemPoint = new egret.Point();
        return _this;
    }
    Object.defineProperty(ShootingItem.prototype, "itemType", {
        get: function () {
            return this._itemType;
        },
        enumerable: true,
        configurable: true
    });
    ShootingItem.prototype.init = function (itemDirection) {
        this._isDestroy = false;
        this._direction = itemDirection;
        switch (this._direction) {
            case ShootingItemDirectionType.left:
                this.x = App.GameWidth + 100;
                break;
            case ShootingItemDirectionType.right:
                this.x = -100;
                break;
        }
        this.y = 450 * GameShootingView.instance.adaptScaleY;
        App.DisplayUtils.quickAddChild(GameShootingView.instance.bulletsLayer, this);
        GameShootingView.instance.shootingGame.items.push(this);
        this.localToGlobal(0, 0, this._itemPoint);
        this._rect.setTo(this._itemPoint.x - (this.width >> 1), this._itemPoint.y - (this.height >> 1), this.width, this.height);
        App.TimerManager.doFrame(1, 0, this.frame, this);
    };
    ShootingItem.prototype.getRect = function () {
        return this._rect;
    };
    ShootingItem.prototype.destroy = function () {
        this._isDestroy = true;
        App.TimerManager.remove(this.frame, this);
        App.DisplayUtils.quickRemoveChild(this);
        var index = GameShootingView.instance.shootingGame.items.indexOf(this);
        GameShootingView.instance.shootingGame.items.splice(index, 1);
    };
    ShootingItem.prototype.effect = function (bullet) {
    };
    return ShootingItem;
}(egret.DisplayObjectContainer));
__reflect(ShootingItem.prototype, "ShootingItem", ["ShootingItemPort"]);
var ShootingRocket = (function (_super) {
    __extends(ShootingRocket, _super);
    function ShootingRocket() {
        var _this = _super.call(this) || this;
        var rocket = AssetManager.getBitmap("rocketButton_png");
        rocket.x = (rocket.width >> 1);
        rocket.y = (rocket.height >> 1);
        App.DisplayUtils.quickAddChild(_this, rocket);
        _this.width = _this.width;
        _this.height = _this.height;
        return _this;
    }
    ShootingRocket.prototype.init = function (itemDirection) {
        _super.prototype.init.call(this, itemDirection);
        this._itemType = ItemType.rocket;
    };
    ShootingRocket.prototype.effect = function (bullet) {
        this.destroy();
        GameShootingView.instance.controlLayer.boomPlay(bullet.x, bullet.y);
        ShootingBullet.createShootingBullet_rocketByBullet(bullet, bullet.rotation);
        App.SoundManager.playEffect("shootinggetItem_mp3", true);
    };
    return ShootingRocket;
}(ShootingItem));
__reflect(ShootingRocket.prototype, "ShootingRocket");
var ShootingSplit = (function (_super) {
    __extends(ShootingSplit, _super);
    function ShootingSplit() {
        var _this = _super.call(this) || this;
        var split = AssetManager.getBitmap("splitButton_png");
        split.x = (split.width >> 1);
        split.y = (split.height >> 1);
        App.DisplayUtils.quickAddChild(_this, split);
        _this.width = _this.width;
        _this.height = _this.height;
        return _this;
    }
    ShootingSplit.prototype.init = function (itemDirection) {
        _super.prototype.init.call(this, itemDirection);
        this._itemType = ItemType.split;
    };
    ShootingSplit.prototype.effect = function (bullet) {
        this.destroy();
        GameShootingView.instance.controlLayer.boomPlay(bullet.x, bullet.y);
        App.SoundManager.playEffect("shootinggetItem_mp3", true);
        var split01, split02, split03;
        switch (bullet.type) {
            case BulletType.common:
                split01 = ShootingBullet.createShootingBulletByBullet(bullet, 0);
                split02 = ShootingBullet.createShootingBulletByBullet(bullet, 45);
                split03 = ShootingBullet.createShootingBulletByBullet(bullet, -45);
                break;
            case BulletType.rocket:
                split01 = ShootingBullet.createShootingBullet_rocketByBullet(bullet, 0);
                split02 = ShootingBullet.createShootingBullet_rocketByBullet(bullet, 45);
                split03 = ShootingBullet.createShootingBullet_rocketByBullet(bullet, -45);
                break;
            default:
                return;
        }
    };
    return ShootingSplit;
}(ShootingItem));
__reflect(ShootingSplit.prototype, "ShootingSplit");
var ShootingShield = (function (_super) {
    __extends(ShootingShield, _super);
    function ShootingShield(owner, key) {
        var _this = _super.call(this) || this;
        _this._uid = key;
        _this._owner = owner;
        _this.hp = UserConfig.shieldHP;
        _this.shield_img = AssetManager.getBitmap("shield1_png");
        _this.addChild(_this.shield_img);
        _this._rect = new egret.Rectangle();
        _this._rect.width = _this.shield_img.width;
        _this._rect.height = _this.shield_img.height;
        return _this;
    }
    Object.defineProperty(ShootingShield.prototype, "uid", {
        get: function () {
            return this._uid;
        },
        enumerable: true,
        configurable: true
    });
    ShootingShield.prototype.setRect = function (x, y) {
        var point = GameShootingView.instance.localToGlobal(x, y, GameShooting.point);
        this._rect.x = point.x - (this.shield_img.width >> 1);
        this._rect.y = point.y - (this.shield_img.height >> 1);
    };
    ShootingShield.prototype.getRect = function () {
        return this._rect;
    };
    Object.defineProperty(ShootingShield.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        enumerable: true,
        configurable: true
    });
    ShootingShield.prototype.hit = function () {
        if (this.parent) {
            this.hp--;
            egret.Tween.get(this).to({ scaleY: 0.8 }, 100).to({ scaleY: 1 }, 100)
                .to({ scaleY: 0.9 }, 100).to({ scaleY: 1 }, 100);
            if (this.hp < 5) {
                this.shield_img.texture = RES.getRes("shield2_png");
            }
            if (this.hp < 3) {
                this.shield_img.texture = RES.getRes("shield3_png");
            }
            if (this.hp <= 0) {
                if (GameShootingView.instance.shootingGame.isOffLine)
                    this.destroy();
                else
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shieldDestroy|" + this.uid, 1);
            }
        }
    };
    ShootingShield.prototype.destroy = function () {
        this.parent.removeChild(this);
        var shootingGame = GameShootingView.instance.shootingGame;
        delete shootingGame.shields[this.uid];
        if (this._owner == "self") {
            GameShootingView.instance.controlLayer.shield++;
        }
        if (this._owner == "competitor" && shootingGame.isOffLine) {
            GameShootingAI.shieldLimit++;
        }
    };
    return ShootingShield;
}(egret.DisplayObjectContainer));
__reflect(ShootingShield.prototype, "ShootingShield");
var ShootingGetUID = (function () {
    function ShootingGetUID() {
    }
    ShootingGetUID.getUID = function () {
        this._UID++;
        return this._UID;
    };
    ShootingGetUID._UID = 0;
    return ShootingGetUID;
}());
__reflect(ShootingGetUID.prototype, "ShootingGetUID");
