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
// 青蛙过河人物骨骼动画
var FrogCharacter = (function (_super) {
    __extends(FrogCharacter, _super);
    function FrogCharacter() {
        var _this = _super.call(this) || this;
        _this.status = 0; //0等待 1~4过道 5成功登录  10为落水
        return _this;
    }
    FrogCharacter.prototype.init = function (user) {
        if (this.roleAvatar) {
            return;
        }
        this.roleAvatar = new RoleAvatar(user.curAvatarType, user.imgUrl, "dbxiaoren00_game1");
        this.armature = this.roleAvatar.armature;
        if (this.armature) {
            this.armature.scaleX = this.armature.scaleY = 0.6;
        }
        this.addChild(this.armature);
        this.validWidth = this.width;
        this.validHeight = Math.floor(GameLeonardFroG.IMPACT_parameter * this.height);
    };
    Object.defineProperty(FrogCharacter.prototype, "isEnemy", {
        get: function () {
            return this.scaleY == -1;
        },
        enumerable: true,
        configurable: true
    });
    FrogCharacter.prototype.dispose = function () {
        console.log("销毁了");
        egret.Tween.removeTweens(this);
        this.roleAvatar.dispose();
        this.roleAvatar = null;
        this.armature = null;
        this.currRect = null;
    };
    return FrogCharacter;
}(egret.DisplayObjectContainer));
__reflect(FrogCharacter.prototype, "FrogCharacter");
// 荷花和木头动画
var FrogEffect = (function (_super) {
    __extends(FrogEffect, _super);
    function FrogEffect(str) {
        var _this = _super.call(this) || this;
        _this.onAddEffect(str);
        return _this;
    }
    FrogEffect.prototype.onAddEffect = function (str) {
        this.armature = this.armature;
        this.armature.play(str);
        this.addChild(this.armature);
    };
    FrogEffect.prototype.dispose = function () {
        this.roleAvatar.dispose();
        this.roleAvatar = null;
        this.armature = null;
        this.currRect = null;
    };
    return FrogEffect;
}(egret.DisplayObjectContainer));
__reflect(FrogEffect.prototype, "FrogEffect");
// TypeScript file
var GameLeonardFroG = (function (_super) {
    __extends(GameLeonardFroG, _super);
    function GameLeonardFroG() {
        var _this = _super.call(this) || this;
        _this.numScore1 = 0; //玩家分数记录1
        _this.numScore2 = 0;
        _this.time = 60;
        _this.pauseCallback = function () {
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
            _this.next("gameChangeMatch");
        };
        //碰撞检测
        _this.rectangle1 = new egret.Rectangle();
        _this.rectangle2 = new egret.Rectangle();
        _this.checkFlag = 0;
        _this.tmpPoint = new egret.Point();
        _this.arrayPlay1 = [];
        _this.arrayPlay2 = [];
        return _this;
    }
    GameLeonardFroG.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        //添加背景
        this.container = new egret.DisplayObjectContainer();
        this.bg = App.DisplayUtils.createBitmap("bg_LeonardFrog_jpg");
        this.container.addChild(this.bg);
        this.addChild(this.container);
        //適配
        var a = App.GameWidth / GameLeonardFroG.GAME_WIDTH;
        var b = App.GameHeight / GameLeonardFroG.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.container.scaleX = this.container.scaleY = c;
        this.container.x = (App.GameWidth - GameLeonardFroG.GAME_WIDTH * c) * 0.5;
        this.container.y = (App.GameHeight - GameLeonardFroG.GAME_HEIGHT * c) * 0.5;
        //添加顶部区域
        this.containerTop = new egret.DisplayObjectContainer();
        this.container.addChild(this.containerTop);
        this.containerTop.x = 143;
        this.containerTop.y = 0;
        this.img1 = App.DisplayUtils.createBitmap("ti_png");
        this.img1.x = 0;
        this.img1.y = 38;
        this.containerTop.addChild(this.img1);
        //分数1
        this.img_red = App.DisplayUtils.createBitmap("p_red_png");
        this.containerTop.addChild(this.img_red);
        this.img_red.width = 172;
        this.img_red.x = 2;
        this.img_red.y = 40;
        this.img_red.mask = new egret.Rectangle(-172, 0, 172, 42);
        //分数2
        this.img_blue = App.DisplayUtils.createBitmap("p_blue_png");
        this.containerTop.addChild(this.img_blue);
        this.img_blue.width = 172;
        this.img_blue.x = 180;
        this.img_blue.y = 40;
        this.img_blue.mask = new egret.Rectangle(172, 0, 172, 42);
        //王冠
        this.img_diadema = App.DisplayUtils.createBitmap("img_diadema_frog_png");
        this.containerTop.addChild(this.img_diadema);
        this.img_diadema.x = 146;
        this.img_diadema.y = 0;
        //时间背景
        this.bg_time = App.DisplayUtils.createBitmap("bg_time_png");
        this.containerTop.addChild(this.bg_time);
        this.bg_time.x = 158;
        this.bg_time.y = 62;
        //时间
        this.bitmaptime = new egret.TextField();
        this.containerTop.addChild(this.bitmaptime);
        this.bitmaptime.text = "60";
        this.bitmaptime.textColor = 0x212121;
        this.bitmaptime.scaleX = this.bitmaptime.scaleY = 0.7;
        this.bitmaptime.fontFamily = "Arial";
        this.bitmaptime.x = 167;
        this.bitmaptime.y = 71;
        // //头像1
        var myData = DataCenter.instance.user;
        this.roleAvatar1 = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "toukuang");
        this.roleAvatar1.armature.play("jing");
        this.roleAvatar1.armature.x = this.containerTop.x;
        this.roleAvatar1.armature.y = this.containerTop.height * 0.8;
        this.roleAvatar1.armature.scaleX = this.roleAvatar1.armature.scaleY = 0.6;
        this.roleAvatar1.armature.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.roleAvatarPlayEnd, this);
        this.container.addChild(this.roleAvatar1.armature);
        // //头像2
        var playData = DataCenter.instance.room.player;
        this.roleAvatar2 = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "toukuang");
        this.roleAvatar2.armature.play("jing");
        this.roleAvatar2.armature.x = this.containerTop.x + this.containerTop.width;
        this.roleAvatar2.armature.y = this.containerTop.height * 0.8;
        this.roleAvatar2.armature.scaleX = this.roleAvatar2.armature.scaleY = 0.6;
        this.roleAvatar2.armature.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.roleAvatarPlayEnd, this);
        this.container.addChild(this.roleAvatar2.armature);
        //粒子ceng
        this.containerEffect = new egret.DisplayObjectContainer();
        this.containerEffect.x = 0;
        this.containerEffect.y = 0;
        this.container.addChild(this.containerEffect);
        this.containerEffect.mask = new egret.Rectangle(0, 0, GameLeonardFroG.GAME_WIDTH, GameLeonardFroG.GAME_HEIGHT);
        //添加游戏区间
        this.containerGame = new GameLeonardFrogMap();
        this.containerGame.x = 0;
        this.containerGame.y = 210;
        this.container.addChild(this.containerGame);
        this.containerGame.touchChildren = true;
        this.containerGame.touchEnabled = true;
        this.container.touchEnabled = true;
        this.container.touchChildren = true;
        this.containerGame.mask = new egret.Rectangle(0, 0, GameLeonardFroG.GAME_WIDTH, GameLeonardFroG.GAME_HEIGHT);
        //莲花
        this.addAllLotusDb();
        //角色层
        this.containerPeople = new egret.DisplayObjectContainer();
        this.container.addChild(this.containerPeople);
        //添加彩虹层
        this.containerheight = new egret.DisplayObjectContainer();
        this.containerheight.width = this.bg.width;
        this.containerheight.height = this.bg.height;
        this.container.addChild(this.containerheight);
        this.readyIMG = new GameReady(function () {
            _this.start();
        });
        this.readyIMG.x = 300;
        this.readyIMG.y = App.GameHeight / 2;
        this.container.addChild(this.readyIMG);
        //添加彩虹
        this.addAllRainbow();
        //返回
        this.goBack = App.DisplayUtils.createBitmap("goBack_png");
        this.container.addChild(this.goBack);
        this.goBack.x = 0;
        this.goBack.y = 20;
        // 返回按钮
        this.goBack.touchEnabled = true;
        this.goBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBackBtnHandler, this);
        // 小米平台去掉退出按钮
        if (App.IsXiaoMi || App.IsWanba) {
            this.goBack.visible = false;
            this.goBack.touchEnabled = false;
        }
        //跳跃
        this.btn_jump = App.DisplayUtils.createBitmap("beng_png");
        this.btn_jump.anchorOffsetX = this.btn_jump.width * 0.5;
        this.btn_jump.anchorOffsetY = this.btn_jump.height * 0.5;
        this.btn_jump.x = GameLeonardFroG.GAME_WIDTH - this.btn_jump.width + this.btn_jump.anchorOffsetX;
        this.btn_jump.y = GameLeonardFroG.GAME_HEIGHT - this.btn_jump.height - 10 + this.btn_jump.anchorOffsetY;
        this.container.addChild(this.btn_jump);
        App.ClickAnimation.register(this.btn_jump);
        this.btn_jump.touchEnabled = false;
        this.containerheight.touchEnabled = false;
        this.btn_jump.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJump, this);
        this.containerheight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJump, this);
        // 事件同步
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
    };
    GameLeonardFroG.prototype.roleAvatarPlayEnd = function (evt) {
        var armature = evt.currentTarget.parent;
        if (armature.currAction == "dong") {
            armature.play("jing");
        }
    };
    GameLeonardFroG.prototype.show = function () {
        _super.prototype.show.call(this);
        //创建方块和角色
        var tipDatas = this.containerGame.createSelfTips();
        if (DataCenter.instance.room.IsAI) {
            this.containerGame.createEnemyTips(tipDatas[0], tipDatas[1]);
            this.containerGame.tick(0);
            this.createAiEnemy();
            this.readyIMG.play();
        }
        else {
            var data = {
                key: "createRects",
                tips1Datas: tipDatas[0],
                tips2Datas: tipDatas[1],
            };
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
        this.onAddNewSelf();
        var str = "bg_frog_mp3";
        App.SoundManager.playBg(str);
    };
    // 请求游戏返回
    GameLeonardFroG.prototype.goBackBtnHandler = function () {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    };
    GameLeonardFroG.prototype.onGameEvent = function (data) {
        var eventData = JSON.parse(data.event);
        if (eventData.key == "createCharacter") {
            this.onAddNewEnemy(eventData.id, GameLeonardFroG.GAME_WIDTH - eventData.initX);
        }
        else if (eventData.key == "jump") {
            this.enemyJump();
        }
        else if (eventData.key == "createRects") {
            this.containerGame.createEnemyTips(eventData.tips1Datas, eventData.tips2Datas);
            this.containerGame.tick(0);
            this.readyIMG.play();
        }
        else if (eventData.key == "setScore") {
            this.enemyJumpSuccess();
        }
        else if (eventData.key == "intoWater") {
            this.enemyIntoWater(this.getEnemy(eventData.characterID));
        }
        else if (eventData.key == "BumpOut") {
            this.enemybumpOut(this.getEnemy(eventData.characterID));
        }
        else if (eventData.key == "setRect") {
            var player = this.getEnemy(eventData.characterID);
            var rect = GameLeonardFroG.Rects[eventData.rectID];
            player.currRect = rect;
        }
        else if (eventData.key == "timeOver") {
            console.log("时间到啦啦啦啦啦");
            this.bitmaptime.text = "00";
        }
    };
    GameLeonardFroG.prototype.getEnemy = function (id) {
        for (var i = 0, len = this.arrayPlay2.length; i < len; i++) {
            var player = this.arrayPlay2[i];
            if (player.id == id) {
                return player;
            }
        }
        return null;
    };
    GameLeonardFroG.prototype.timer = function () {
        this.time -= 1;
        if (this.time < 10) {
            this.bitmaptime.text = "0" + this.time.toString();
        }
        else {
            this.bitmaptime.text = this.time.toString();
        }
        if (this.time < 4 && this.time > 0) {
            var str = "time_common_mp3";
            App.SoundManager.playEffect(str);
        }
        else if (this.time == 0) {
            var str = "time_last_mp3";
            App.SoundManager.playEffect(str);
        }
        if (this.time == 0 || this.numScore1 == GameLeonardFroG.MAX_SCORE || this.numScore2 == GameLeonardFroG.MAX_SCORE) {
            //时间到
            if (!DataCenter.instance.room.IsAI) {
                var data = {
                    key: "timeOver",
                };
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
            }
            this.stop();
            var num = 1;
            if (this.numScore1 > this.numScore2) {
                num = 3;
            }
            else if (this.numScore1 < this.numScore2) {
                num = 1;
            }
            else if (this.numScore1 == this.numScore2) {
                num = 2;
            }
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, num);
        }
    };
    // 弹出游戏结果画面
    GameLeonardFroG.prototype.onGameResult = function (data) {
        this.stop();
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", null);
    };
    GameLeonardFroG.prototype.start = function () {
        this.isRuning = true;
        this.btn_jump.touchEnabled = true;
        this.containerheight.touchEnabled = true;
        App.TimerManager.doFrame(1, 0, this.run, this);
        App.TimerManager.doTimer(1000, 0, this.timer, this);
        if (DataCenter.instance.room.IsAI) {
            App.TimerManager.doTimer(1000, 0, this.enemyAi, this);
        }
    };
    GameLeonardFroG.prototype.stop = function () {
        if (!this.isRuning) {
            return;
        }
        this.isRuning = false;
        this.btn_jump.touchEnabled = false;
        this.containerheight.touchEnabled = false;
        App.TimerManager.remove(this.run, this);
        App.TimerManager.remove(this.timer, this);
        App.TimerManager.remove(this.enemyAi, this);
        App.SoundManager.stopBg();
    };
    GameLeonardFroG.prototype.enemyAi = function () {
        this.enemyJump();
    };
    GameLeonardFroG.prototype.createAiEnemy = function () {
        var id = ++GameLeonardFroG.Character_ID;
        var initX = App.RandomUtils.limitInteger(50, 350);
        this.onAddNewEnemy(id, GameLeonardFroG.GAME_WIDTH - initX);
    };
    GameLeonardFroG.prototype.run = function (advancedTime) {
        this.containerGame.tick(advancedTime);
        !this.selfJumpFlag && this.characterMove(advancedTime, true);
        !this.enemyJumpFlag && this.characterMove(advancedTime, false);
        this.onImpact();
    };
    GameLeonardFroG.prototype.onImpact = function () {
        this.checkFlag++;
        if (this.checkFlag == 10) {
            this.checkFlag = 0;
        }
        else {
            return;
        }
        var len1 = this.arrayPlay1.length;
        for (var i = len1 - 1; i >= 0; i--) {
            var player1 = this.arrayPlay1[i];
            if (player1.status == 0) {
                continue;
            }
            this.rectangle1.setTo(player1.x - player1.validWidth * 0.5, player1.y - player1.validHeight, player1.validWidth, player1.validHeight);
            var len2 = this.arrayPlay2.length;
            for (var j = len2 - 1; j >= 0; j--) {
                var player2 = this.arrayPlay2[j];
                if (player2.status == 5) {
                    continue;
                }
                this.rectangle2.setTo(player2.x - player2.validWidth * 0.5, player2.y, player2.validWidth, player2.validHeight);
                if (App.RectangleUtils.intersects(this.rectangle1, this.rectangle2)) {
                    if (this.enemyJumpFlag && this.selfJumpFlag) {
                        if (player1.startJumptime > player2.startJumptime) {
                            this.onBumpOut(player1);
                        }
                        else {
                            this.onBumpOut(player2);
                        }
                    }
                    else if (this.enemyJumpFlag && !this.selfJumpFlag) {
                        this.onBumpOut(player1);
                    }
                    else if (!this.enemyJumpFlag && this.selfJumpFlag) {
                        this.onBumpOut(player2);
                    }
                    break;
                }
            }
        }
    };
    GameLeonardFroG.prototype.characterMove = function (advancedTime, isMe) {
        var speed = GameLeonardFroG.MOVE_SPEED;
        var moveDis = speed * advancedTime;
        var players = isMe ? this.arrayPlay1 : this.arrayPlay2;
        for (var i = players.length - 1; i >= 0; i--) {
            var character = players[i];
            if (!character.currRect) {
                continue;
            }
            if (character.status % 2 == 0) {
                if (character.x > moveDis) {
                    character.x -= moveDis;
                }
            }
            else {
                if (GameLeonardFroG.GAME_WIDTH - character.x > moveDis) {
                    character.x += moveDis;
                }
            }
            if (!character.currRect.parent) {
                //掉水
                this.intoWater(character);
            }
        }
    };
    GameLeonardFroG.prototype.removeCharacter = function (character, isFallWater, particle) {
        if (isFallWater === void 0) { isFallWater = true; }
        if (particle === void 0) { particle = "fallintowater"; }
        egret.Tween.removeTweens(character);
        var self = this;
        if (isFallWater) {
            character.armature.play("fallintowater", 1);
            if (particle != "") {
                this.onParticleEffect(character.x, character.y, particle);
            }
        }
        else {
            if (character.isEnemy) {
                egret.Tween.get(character).to({ y: character.y - 150, alpha: 0 }, 350).call(Out);
            }
            else {
                egret.Tween.get(character).to({ y: character.y + 150, alpha: 0 }, 350).call(Out);
            }
        }
        function Out() {
            character.alpha = 1;
            self.recoveryCharacter(character);
            //自己在家被顶死，产生一个新的
            if (!character.isEnemy && character.status == 0) {
                self.onAddNewSelf();
            }
        }
        var arr = character.isEnemy ? this.arrayPlay2 : this.arrayPlay1;
        var index = arr.indexOf(character);
        arr.splice(index, 1);
    };
    GameLeonardFroG.prototype.enemyIntoWater = function (character) {
        this.removeCharacter(character);
    };
    //
    GameLeonardFroG.prototype.enemybumpOut = function (character) {
        this.removeCharacter(character, false);
    };
    //
    GameLeonardFroG.prototype.intoWater = function (character) {
        if (!DataCenter.instance.room.IsAI && character.isEnemy) {
            return;
        }
        //落水音效
        var numRound = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "fallWater_" + numRound + "_mp3";
        App.SoundManager.playEffect(str);
        this.removeCharacter(character);
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "intoWater",
                characterID: character.id
            };
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    };
    //被撞走
    GameLeonardFroG.prototype.onBumpOut = function (character) {
        if (!DataCenter.instance.room.IsAI && character.isEnemy) {
            return;
        }
        //
        var numRound = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "push_" + numRound + "_mp3";
        App.SoundManager.playEffect(str);
        this.removeCharacter(character, false);
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "BumpOut",
                characterID: character.id
            };
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    };
    GameLeonardFroG.prototype.onLand = function (character, hitRect) {
        if (!DataCenter.instance.room.IsAI && character.isEnemy) {
            return;
        }
        //落在方块上
        character.armature.play("down", 1);
        character.currRect = hitRect;
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "setRect",
                characterID: character.id,
                rectID: hitRect.id,
                offsetX: character.x - hitRect.x,
            };
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    };
    GameLeonardFroG.prototype.enemyJump = function () {
        var _this = this;
        //跳跃音效
        var numRound = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "jump_" + numRound + "_mp3";
        App.SoundManager.playEffect(str);
        this.enemyJumpFlag = true;
        var jumpTime = 250;
        var time1 = new Date();
        for (var i = 0; i < this.arrayPlay2.length; ++i) {
            var character = this.arrayPlay2[i];
            this.arrayPlay2[i].startJumptime = time1.getTime();
            character.status--;
            character.armature.play("jump", 1);
            egret.Tween.get(character).to({ y: character.y + 200 }, jumpTime).call(this.onJucde.bind(this, character));
        }
        egret.setTimeout(function () {
            _this.enemyJumpFlag = false;
            DataCenter.instance.room.IsAI && _this.createAiEnemy();
        }, this, jumpTime);
    };
    //点击跳跃
    GameLeonardFroG.prototype.onJump = function () {
        var _this = this;
        //跳跃音效
        var numRound = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "jump_" + numRound + "_mp3";
        App.SoundManager.playEffect(str);
        this.selfJumpFlag = true;
        this.btn_jump.touchEnabled = false;
        this.containerheight.touchEnabled = false;
        var jumpTime = 250;
        var time1 = new Date();
        for (var i = 0; i < this.arrayPlay1.length; ++i) {
            var character = this.arrayPlay1[i];
            this.arrayPlay1[i].startJumptime = time1.getTime();
            character.status++;
            character.armature.play("jump", 1);
            egret.Tween.get(character).to({ y: character.y - 200 }, jumpTime).call(this.onJucde.bind(this, character));
        }
        App.TimerManager.doTimer(jumpTime, 1, function () {
            _this.onAddNewSelf();
            _this.selfJumpFlag = false;
            _this.btn_jump.touchEnabled = true;
            _this.containerheight.touchEnabled = true;
        }, this);
        //发送服务器消息
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "jump"
            };
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    };
    GameLeonardFroG.prototype.enemyJumpSuccess = function () {
        var str = "jump_success_mp3";
        App.SoundManager.playEffect(str);
        this.numScore2++;
        this.numScore2 = Math.min(this.numScore2, GameLeonardFroG.MAX_SCORE);
        this.roleAvatar2.armature.play("dong", 1);
        var special = GameLeonardFroG.MAX_SCORE + 1;
        var _x = Math.floor((special - this.numScore2 - 1) / special * this.img_blue.width);
        egret.Tween.get(this.img_blue.mask).to({ x: _x }, 500);
    };
    GameLeonardFroG.prototype.selfJumpSuccess = function () {
        var str = "jump_success_mp3";
        App.SoundManager.playEffect(str);
        this.numScore1++;
        this.numScore1 = Math.min(this.numScore1, GameLeonardFroG.MAX_SCORE);
        this.roleAvatar1.armature.play("dong", 1);
        var special = GameLeonardFroG.MAX_SCORE + 1;
        var _x = Math.floor((this.numScore1 + 1) / special * this.img_red.width - this.img_red.width);
        egret.Tween.get(this.img_red.mask).to({ x: _x }, 500);
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "setScore"
            };
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    };
    GameLeonardFroG.prototype.onJucde = function (character) {
        // if (character) {
        //     character.scaleX = character.scaleY = 1;
        // }
        //检测是否跳成功
        if (character.isEnemy) {
            if (character.status == 0) {
                this.onParticleEffect(character.x, character.y, "win1");
                this.removeCharacter(character, true, "");
                DataCenter.instance.room.IsAI && this.enemyJumpSuccess();
                return;
            }
        }
        else {
            if (character.status == 5) {
                this.onParticleEffect(character.x, character.y, "win1");
                this.removeCharacter(character, true, "");
                this.selfJumpSuccess();
                return;
            }
        }
        //检测碰撞
        character.localToGlobal(0, 0, this.tmpPoint);
        var hitRect;
        if (character.status == 1) {
            hitRect = this.containerGame.tip1.hitTest(this.tmpPoint.x);
        }
        else if (character.status == 2) {
            hitRect = this.containerGame.tip2.hitTest(this.tmpPoint.x);
        }
        else if (character.status == 3) {
            hitRect = this.containerGame.tip3.hitTest(this.tmpPoint.x);
        }
        else if (character.status == 4) {
            hitRect = this.containerGame.tip4.hitTest(this.tmpPoint.x);
        }
        if (!hitRect) {
            //落水
            this.intoWater(character);
        }
        else {
            //落在方块上
            this.onLand(character, hitRect);
        }
    };
    GameLeonardFroG.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        // 事件同步
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
        var keys = Object.keys(GameLeonardFroG.Rects);
        while (keys.length) {
            var k = keys.pop();
            GameLeonardFroG.Rects[k] = null;
            delete GameLeonardFroG.Rects[k];
        }
        this.roleAvatar1.dispose();
        this.roleAvatar2.dispose();
        while (this.arrayPlay1.length) {
            var character = this.arrayPlay1.pop();
            this.recoveryCharacter(character);
        }
        while (this.arrayPlay2.length) {
            var character = this.arrayPlay2.pop();
            this.recoveryCharacter(character);
        }
        ObjectPool.clearClass("FrogCharacterSelf", "dispose");
        ObjectPool.clearClass("FrogCharacterEnemy", "dispose");
    };
    GameLeonardFroG.prototype.armaturePlayEnd = function (evt) {
        var armature = evt.currentTarget.parent;
        var character = armature.parent;
        if (armature.currAction == "fallintowater") {
            this.recoveryCharacter(character);
            //自己在家被顶死，产生一个新的
            if (!character.isEnemy && character.status == 0) {
                this.onAddNewSelf();
            }
        }
    };
    //回收Character
    GameLeonardFroG.prototype.recoveryCharacter = function (character) {
        character.armature.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.armaturePlayEnd, this);
        App.DisplayUtils.removeFromParent(character);
        ObjectPool.push(character);
    };
    //添加自己
    GameLeonardFroG.prototype.onAddNewSelf = function () {
        //防止因为冲撞同步原因，会产生多个的问题
        var len = this.arrayPlay1.length;
        if (len && this.arrayPlay1[len - 1].status == 0) {
            return;
        }
        var flog = ObjectPool.pop(FrogCharacter, "FrogCharacterSelf");
        flog.init(DataCenter.instance.user);
        flog.armature.play("newAnimation");
        flog.id = ++GameLeonardFroG.Character_ID;
        flog.x = App.RandomUtils.limitInteger(50, 350);
        flog.y = 1110;
        flog.status = 0;
        flog.currRect = null;
        flog.armature.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.armaturePlayEnd, this);
        this.onParticleEffect(flog.x, flog.y, "newParticle");
        this.containerPeople.addChild(flog);
        this.arrayPlay1.push(flog);
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "createCharacter",
                id: flog.id,
                initX: flog.x,
            };
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    };
    //添加敌人
    GameLeonardFroG.prototype.onAddNewEnemy = function (id, initX) {
        var flog = ObjectPool.pop(FrogCharacter, "FrogCharacterEnemy");
        flog.init(DataCenter.instance.room.player);
        flog.armature.play("newAnimation");
        flog.id = id;
        flog.x = initX;
        flog.y = 110;
        flog.scaleY = -1;
        flog.status = 5;
        flog.currRect = null;
        flog.armature.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.armaturePlayEnd, this);
        // this.onParticleEffect(flog.x, flog.y, "newParticle");
        this.containerPeople.addChild(flog);
        this.arrayPlay2.push(flog);
    };
    // 创建动画资源加载到舞台
    GameLeonardFroG.prototype.addAllLotusDb = function () {
        // 莲花
        this.flower1 = AssetManager.getQuickDBArmature("lotus");
        this.flower1.scaleX = this.flower1.scaleY = 0.6;
        this.flower1.x = 61;
        this.flower1.y = 245 + this.container.y;
        this.container.addChild(this.flower1);
        this.flower1.play("lotus", 0);
        this.flower2 = AssetManager.getQuickDBArmature("lotus");
        this.flower2.scaleX = this.flower2.scaleY = 0.7;
        this.flower2.x = 491;
        this.flower2.y = 409 + this.container.y;
        this.container.addChild(this.flower2);
        this.flower2.play("lotus");
        this.flower3 = AssetManager.getQuickDBArmature("lotus");
        this.flower3.x = 55;
        this.flower3.y = 815 + this.container.y;
        this.container.addChild(this.flower3);
        this.flower3.play("lotus");
    };
    GameLeonardFroG.prototype.addAllRainbow = function () {
        //彩虹
        var hong1 = App.DisplayUtils.createBitmap("caihong_png");
        this.containerheight.addChild(hong1);
        hong1.x = this.containerheight.width - hong1.width;
        hong1.y = 335;
        var hong2 = App.DisplayUtils.createBitmap("caihong_png");
        this.containerheight.addChild(hong2);
        //hong2.x = this.containerheight.width - hong2.width;
        hong2.scaleX = -1;
        hong2.x = hong2.width;
        hong2.y = 533;
        //透明的label
        var hong3 = App.DisplayUtils.createBitmap("");
        hong3.width = this.containerheight.width;
        hong3.height = this.containerheight.height;
        this.containerheight.addChild(hong3);
        hong3.x = 0;
        hong3.y = 0;
    };
    // 粒子效果
    GameLeonardFroG.prototype.onParticleEffect = function (_X, _Y, str) {
        var texture = RES.getRes(str + "_png");
        var config = RES.getRes(str + "_json");
        var particleXueHua = new particle.GravityParticleSystem(texture, config);
        particleXueHua.y = _Y;
        particleXueHua.x = _X;
        this.containerEffect.addChild(particleXueHua);
        particleXueHua.start(500);
    };
    GameLeonardFroG.MOVE_SPEED = 0.1;
    GameLeonardFroG.IMPACT_parameter = 0.75; //碰撞精确参数
    GameLeonardFroG.GAME_WIDTH = 640;
    GameLeonardFroG.GAME_HEIGHT = 1136;
    GameLeonardFroG.Rect_ID = 0;
    GameLeonardFroG.Character_ID = 0;
    GameLeonardFroG.MAX_SCORE = 12;
    GameLeonardFroG.Rects = {};
    return GameLeonardFroG;
}(State));
__reflect(GameLeonardFroG.prototype, "GameLeonardFroG");
//青蛙过河移动地图类
var GameLeonardFrogMap = (function (_super) {
    __extends(GameLeonardFrogMap, _super);
    function GameLeonardFrogMap() {
        var _this = _super.call(this) || this;
        _this.width = 640;
        _this.height = 800;
        return _this;
    }
    GameLeonardFrogMap.prototype.createSelfTips = function () {
        this.tip1 = new MoveTips(1);
        var tips1Datas = this.tip1.create();
        this.tip2 = new MoveTips(2);
        var tips2Datas = this.tip2.create();
        this.tip2.scaleX = -1;
        this.tip2.x = this.width;
        this.tip2.y = 400;
        this.tip1.y = 600;
        this.addChild(this.tip1);
        this.addChild(this.tip2);
        return [tips1Datas, tips2Datas];
    };
    GameLeonardFrogMap.prototype.createEnemyTips = function (tips1Datas, tips2Datas) {
        this.tip3 = new MoveTips(3);
        this.tip3.full(tips2Datas);
        this.tip4 = new MoveTips(4);
        this.tip4.full(tips1Datas);
        this.tip4.scaleX = -1;
        this.tip4.x = this.width;
        this.tip4.y = 0;
        this.tip3.y = 200;
        this.addChild(this.tip3);
        this.addChild(this.tip4);
    };
    GameLeonardFrogMap.prototype.tick = function (time) {
        this.tip1.tick(time);
        this.tip2.tick(time);
        this.tip3.tick(time);
        this.tip4.tick(time);
    };
    return GameLeonardFrogMap;
}(egret.DisplayObjectContainer));
__reflect(GameLeonardFrogMap.prototype, "GameLeonardFrogMap");
var MoveRect = (function (_super) {
    __extends(MoveRect, _super);
    function MoveRect(resId, space) {
        var _this = _super.call(this) || this;
        _this.space = space;
        _this.flower1 = AssetManager.getQuickDBArmature("lotus");
        _this.addChild(_this.flower1);
        _this.flower1.play("wood", 0);
        _this.img1 = App.DisplayUtils.createBitmap("kuai" + resId + "_png");
        _this.addChild(_this.img1);
        _this.flower1.x = 0;
        _this.flower1.y = _this.img1.height / 2;
        return _this;
    }
    MoveRect.prototype.hitTest = function (px) {
        if (!this.parent) {
            return false;
        }
        if (!this.tmpPoint) {
            this.tmpPoint = new egret.Point();
            this.tmpX = this.x;
            if (this.parent.scaleX == -1) {
                this.localToGlobal(this.img1.width, 0, this.tmpPoint);
            }
            else {
                this.localToGlobal(0, 0, this.tmpPoint);
            }
        }
        else {
            this.tmpPoint.x += (this.x - this.tmpX) * this.parent.scaleX;
            this.tmpX = this.x;
        }
        if (px > this.tmpPoint.x && px < this.tmpPoint.x + this.img1.width) {
            return true;
        }
        return false;
    };
    return MoveRect;
}(egret.DisplayObjectContainer));
__reflect(MoveRect.prototype, "MoveRect");
// TypeScript file
var MoveTips = (function (_super) {
    __extends(MoveTips, _super);
    function MoveTips(num) {
        var _this = _super.call(this) || this;
        _this.num = num;
        _this.tickNum = 0;
        _this.width = GameLeonardFroG.GAME_WIDTH;
        _this.height = 200;
        _this.rects = [];
        _this.tmpPoint = new egret.Point();
        return _this;
    }
    MoveTips.prototype.create = function () {
        var datas = [];
        var gameWidth = this.width;
        var useWidth = 0;
        var currX = gameWidth;
        while (useWidth < gameWidth * 1.5) {
            var resId = App.RandomUtils.limitInteger(1, 3);
            var space = App.RandomUtils.limitInteger(30, 100);
            //创建方块
            GameLeonardFroG.Rect_ID++;
            var rect = new MoveRect(resId, space);
            rect.id = DataCenter.instance.user.id + "_" + GameLeonardFroG.Rect_ID;
            currX -= rect.width;
            useWidth += rect.width;
            rect.x = currX;
            rect.y = (this.height - rect.height) * 0.5;
            this.rects.push(rect);
            GameLeonardFroG.Rects[rect.id] = rect;
            //计算间隔
            currX -= space;
            useWidth += space;
            //方块基本数据
            datas.push({
                id: rect.id,
                resId: resId,
                space: space
            });
        }
        this.rects = this.rects.reverse();
        this.rectsLen = this.rects.length;
        return datas;
    };
    MoveTips.prototype.full = function (datas) {
        var _this = this;
        var gameWidth = this.width;
        var currX = gameWidth;
        datas.forEach(function (data) {
            var resId = data.resId;
            var space = data.space;
            var rectId = data.id;
            //创建方块
            var rect = new MoveRect(resId, space);
            rect.id = rectId;
            currX -= rect.width;
            rect.x = currX;
            rect.y = (_this.height - rect.height) * 0.5;
            _this.rects.push(rect);
            GameLeonardFroG.Rects[rect.id] = rect;
            //计算间隔
            currX -= space;
        });
        this.rects = this.rects.reverse();
        this.rectsLen = this.rects.length;
    };
    MoveTips.prototype.tick = function (time) {
        var speed = GameLeonardFroG.MOVE_SPEED;
        var moveDis = speed * time;
        var gameWidth = this.width;
        var checkAddRemove = false;
        if (this.tickNum == 0) {
            checkAddRemove = true;
        }
        this.tickNum++;
        if (this.tickNum > 5) {
            this.tickNum = 0;
        }
        //处理所有方块的移动，是够添加到舞台
        for (var i = 0, len = this.rectsLen; i < len; i++) {
            var rect = this.rects[i];
            rect.x += moveDis;
            if (checkAddRemove) {
                if (rect.x + rect.width >= 0 && rect.x <= gameWidth) {
                    App.DisplayUtils.quickAddChild(this, rect);
                }
                else {
                    App.DisplayUtils.quickRemoveChild(rect);
                }
            }
        }
        //检测最后一个方块是否出屏幕
        var lastRect = this.rects[this.rectsLen - 1];
        if (lastRect.x > gameWidth) {
            var firstRect = this.rects[0];
            lastRect.x = firstRect.x - firstRect.space - lastRect.width;
            this.rects.pop();
            this.rects.splice(0, 0, lastRect);
        }
    };
    MoveTips.prototype.hitTest = function (px) {
        for (var i = 0, len = this.rectsLen; i < len; i++) {
            var rect = this.rects[i];
            if (rect.hitTest(px)) {
                return rect;
            }
        }
        return null;
    };
    return MoveTips;
}(egret.DisplayObjectContainer));
__reflect(MoveTips.prototype, "MoveTips");
