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
/**
 * 贪吃维京人
 * by dingyafeng
 */
var GameGreedyPersonView = (function (_super) {
    __extends(GameGreedyPersonView, _super);
    function GameGreedyPersonView() {
        var _this = _super.call(this, GameGreedyPersonSkin) || this;
        _this.num_time_ChaoFeng = 3550; //嘲讽对手的时间
        _this.numFoodSelfeat = 0; //自己吃了多少
        _this.numFoodEnumyeat = 0; //敌人吃了多少
        _this.isGameOver = false;
        _this.numtime = 60;
        _this.isBossXing = false; //是不是Boss检查期间
        _this.Caught_Self = false; //自己被抓
        _this.Caught_Enumy = false; //敌人被抓
        /************需要初始同步给对面的数据**********/
        //食物
        _this.Arr_food = [];
        //食物相对中心偏移量
        _this.Arr_food_Shift = [];
        //自己的位置
        _this.onSelfLocation = 1;
        _this.onEnumyLocation = 2;
        //Boss检查第几次  0,1
        _this.num_BossChecktime = 0;
        //嘲讽的第几下
        _this.numChaoFengFrist = true;
        /*************************/
        _this.ImageYing = null;
        _this.numAiAttack = 0;
        _this.iswhoChaoFeng = false;
        return _this;
    }
    GameGreedyPersonView.prototype.init = function () {
        _super.prototype.init.call(this);
        // 播放背景音乐
        App.SoundManager.stopBg();
        App.SoundManager.playBg("bg_musicGreedy_mp3");
        //適配
        var a = App.GameWidth / GameGreedyPersonView.GAME_WIDTH;
        var b = App.GameHeight / GameGreedyPersonView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.containerGroup.scaleX = this.containerGroup.scaleY = c;
        this.containerGroup.x = (App.GameWidth - GameGreedyPersonView.GAME_WIDTH * c) * 0.5;
        this.containerGroup.y = (App.GameHeight - GameGreedyPersonView.GAME_HEIGHT * c) * 0.5;
        var user = DataCenter.instance.user;
        // this.BaseComment.lb_name1.text = user.name;
        var playerHead1 = new RoleHeadImage(user.imgUrl);
        playerHead1.scaleX = playerHead1.scaleY = 0.82;
        this.playerAvatarGroup1.addChild(playerHead1);
        var enumy = DataCenter.instance.room.player;
        // this.BaseComment.lb_name2.text = enumy.name;
        var playerHead2 = new RoleHeadImage(enumy.imgUrl);
        playerHead2.scaleX = playerHead2.scaleY = 0.82;
        this.playerAvatarGroup2.addChild(playerHead2);
        // 添加动画
        this.addAllDb();
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        //如果是主机
        if (DataCenter.instance.room.selfIsMaster || DataCenter.instance.room.IsAI) {
            this.onInitFood();
            if (!DataCenter.instance.room.IsAI) {
                //通知对方自己的食物摆放
                if (!DataCenter.instance.room.IsAI) {
                    var str = "food|";
                    for (var i = 0; i < this.Arr_food.length; ++i) {
                        str += this.Arr_food[i] + "|";
                    }
                    for (var i = 0; i < this.Arr_food_Shift.length; ++i) {
                        if (i < this.Arr_food_Shift.length - 1) {
                            str += this.Arr_food_Shift[i] + "|";
                        }
                        else {
                            str += this.Arr_food_Shift[i];
                        }
                    }
                    //ProxySocket.sendGameEvent(App.CurrRoomId, str);
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
                }
                //通知对方准备开始
                var str = "startGame";
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
            }
            else {
                //开始动画
                this.onReadyGo();
            }
        }
        else {
            this.onSelfLocation = 2;
            this.onEnumyLocation = 1;
            this.gp_you.right = 63;
        }
    };
    // 弹出游戏结果画面
    GameGreedyPersonView.prototype.onGameResult = function (data) {
        DataCenter.instance.room.gameResult = data;
        this.popup("GameResult");
    };
    //通知服务器游戏结束
    GameGreedyPersonView.prototype.gameOver = function (result) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    //网络事件
    GameGreedyPersonView.prototype.onGameEvent = function (data) {
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        switch (datas[0]) {
            case "food":
                //console.log("布置食物", datas[1], datas[2]);
                for (var i = 1; i < 15; ++i) {
                    var num = Number(datas[i]);
                    this.Arr_food.push(num);
                }
                for (var i = 15; i < 29; ++i) {
                    var num = Number(datas[i]);
                    this.Arr_food_Shift.push(num);
                }
                this.setFood();
                console.log("布置食物", this.Arr_food, this.Arr_food_Shift);
                break;
            case "startGame":
                //开始动画
                this.onReadyGo();
                break;
            case "Left_1":
                //自己进攻
                if (this.onSelfLocation == 1) {
                    this.onlefteat();
                }
                else {
                    this.onEnumylefteat();
                }
                break;
            case "Left_2":
                //自己进攻
                if (this.onSelfLocation == 2) {
                    this.onlefteat();
                }
                else {
                    this.onEnumylefteat();
                }
                break;
            case "Right_1":
                //自己进攻
                if (this.onSelfLocation == 1) {
                    this.onRighteat();
                }
                else {
                    this.onEnumyRighteat();
                }
                break;
            case "Right_2":
                //自己进攻
                if (this.onSelfLocation == 2) {
                    this.onRighteat();
                }
                else {
                    this.onEnumyRighteat();
                }
                break;
            case "noWake":
                this.onBossWillComming(10);
                break;
            case "iswake":
                this.onBossWillComming(0);
                break;
            case "CatchNO":
                if (this.num_BossChecktime == 0) {
                    this.onNoCatchany();
                    //一秒后决定Boss反应（主机再次启动检测）
                    if (this.onSelfLocation == 1) {
                        this.num_BossChecktime = 1;
                        App.TimerManager.doTimer(500, 1, this.onBossCheckAgain, this);
                    }
                }
                break;
            //再次没抓住
            case "CatchNOAgain":
                this.onReleaseDouble();
                break;
            //同时抓住2个人
            case "CatchDouble":
                this.onCatchDouble();
                this.onChangeButton(3);
                App.TimerManager.doTimer(750, 1, this.onReleaseDouble, this);
                break;
            case "CatchPlayer1":
                if (this.onSelfLocation == 1) {
                    this.onChangeButton(3);
                }
                else {
                    this.onChangeButton(1);
                }
                this.onCatchOne();
                App.TimerManager.doTimer(this.num_time_ChaoFeng, 1, this.onReleaseDouble, this);
                break;
            case "CatchPlayer2":
                if (this.onSelfLocation == 1) {
                    this.onChangeButton(1);
                }
                else {
                    this.onChangeButton(3);
                }
                this.onCatchTwo();
                App.TimerManager.doTimer(this.num_time_ChaoFeng, 1, this.onReleaseDouble, this);
                break;
            case "ChaoFeng1":
                if (this.onSelfLocation == 1) {
                    this.onAddFoodToSelf();
                }
                else {
                    this.onAddFoodToEnumy();
                }
                break;
            case "ChaoFeng2":
                if (this.onSelfLocation == 2) {
                    this.onAddFoodToSelf();
                }
                else {
                    this.onAddFoodToEnumy();
                }
                break;
        }
    };
    GameGreedyPersonView.prototype.onReadyGo = function () {
        var _this = this;
        this.img_start1.visible = true;
        // var str = "readygo_mp3"
        // App.SoundManager.playEffect(str);
        egret.Tween.get(this.img_start2).wait(700).call(function () {
            _this.img_start1.visible = false;
        }).to({ scaleX: 1, scaleY: 1 }, 500).wait(500).call(function () {
            _this.img_start2.visible = false;
            egret.Tween.removeTweens(_this.img_start2);
            App.TimerManager.doTimer(1000, 0, _this.onTimerUpdate, _this);
            // //如果是AI
            if (DataCenter.instance.room.IsAI) {
                App.TimerManager.doTimer(150, 0, _this.onAiAttack, _this);
                _this.chaofengBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onAddFoodToEnumy, _this);
                _this.btn_lefteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onlefteat, _this);
                _this.btn_righteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onRighteat, _this);
            }
            else {
                _this.chaofengBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onNoticeChaoFeng, _this);
                _this.btn_lefteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onNoticelefteat, _this);
                _this.btn_righteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onNoticeRighteat, _this);
            }
        });
    };
    //联机状态下左吃
    GameGreedyPersonView.prototype.onNoticelefteat = function () {
        if (this.isGameOver) {
            return;
        }
        var str = "Left_" + this.onSelfLocation;
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
    };
    //联机状态下左吃
    GameGreedyPersonView.prototype.onNoticeRighteat = function () {
        if (this.isGameOver) {
            return;
        }
        var str = "Right_" + this.onSelfLocation;
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
    };
    //每秒刷新
    GameGreedyPersonView.prototype.onTimerUpdate = function () {
        if (this.isGameOver) {
            App.TimerManager.remove(this.onTimerUpdate, this);
            return;
        }
        this.numtime--;
        if (this.numtime < 10) {
            this.lb_time1.text = "0" + this.numtime;
        }
        else {
            this.lb_time1.text = "" + this.numtime;
        }
        if (this.numtime % 7 == 0) {
            if (DataCenter.instance.room.IsAI) {
                var num = App.RandomUtils.limitInteger(1, 10);
                this.onBossWillComming(num);
            }
            else {
                //如果自己是主机
                if (DataCenter.instance.room.selfIsMaster) {
                    var num = App.RandomUtils.limitInteger(1, 10);
                    if (num <= 7) {
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "iswake", 1);
                    }
                    else {
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "noWake", 1);
                    }
                }
            }
        }
        //时间到
        if (this.numtime == 0) {
            this.isGameOver = true;
            if (this.numFoodSelfeat > this.numFoodEnumyeat) {
                ///你赢了
                this.onResult();
            }
            else if (this.numFoodSelfeat < this.numFoodEnumyeat) {
                ///你输了
                this.onResult(1);
            }
            else if (this.numFoodSelfeat == this.numFoodEnumyeat) {
                if (DataCenter.instance.room.selfIsMaster) {
                    ///你赢了
                    this.onResult();
                }
                else {
                    ///你输了
                    this.onResult(1);
                }
            }
        }
    };
    //嘲讽动画
    GameGreedyPersonView.prototype.onAddFoodCartoon = function (Obj) {
        var _this = this;
        var img = new eui.Image();
        img.source = Obj.source;
        img.anchorOffsetX = Obj.anchorOffsetX;
        img.anchorOffsetY = Obj.anchorOffsetY;
        img.horizontalCenter = Obj.horizontalCenter;
        img.bottom = Obj.bottom + 140;
        Obj.parent.addChild(img);
        egret.Tween.get(img).to({ bottom: Obj.bottom }, 50).call(function () {
            egret.Tween.removeTweens(_this.img_mark);
            Obj.parent.removeChild(img);
        });
    };
    GameGreedyPersonView.prototype.show = function () {
        _super.prototype.show.call(this);
    };
    //Boss出现预警
    GameGreedyPersonView.prototype.onBossWillComming = function (num) {
        var _this = this;
        egret.Tween.get(this.img_mark).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).call(function () {
            egret.Tween.removeTweens(_this.img_mark);
            //决定是否醒来
            if (num <= 7) {
                _this.onArrest();
            }
        });
    };
    //生成食物 
    GameGreedyPersonView.prototype.onInitFood = function () {
        if (DataCenter.instance.room.selfIsMaster) {
            for (var i = 0; i < 14; ++i) {
                var num = App.RandomUtils.limitInteger(1, 3);
                this.Arr_food.push(num);
                var num_shift = App.RandomUtils.limitInteger(-10, 10);
                this.Arr_food_Shift.push(num_shift);
            }
        }
        //设置食物
        this.setFood();
    };
    //设置食物
    GameGreedyPersonView.prototype.setFood = function () {
        for (var i = 0; i < 14; ++i) {
            if (i < 7) {
                this["food_1_" + (i + 1)].source = "greedy_food" + this.Arr_food[i] + "_png";
                this["food_1_" + (i + 1)].horizontalCenter = this.Arr_food_Shift[i];
                var anchor_X;
                var anchor_Y;
                switch (this.Arr_food[i]) {
                    case 1:
                        anchor_X = 97;
                        anchor_Y = 32.6;
                        break;
                    case 2:
                        anchor_X = 107.5;
                        anchor_Y = 30;
                        break;
                    case 3:
                        anchor_X = 104;
                        anchor_Y = 28;
                        break;
                }
                this["food_1_" + (i + 1)].anchorOffsetX = anchor_X;
                this["food_1_" + (i + 1)].anchorOffsetY = anchor_Y;
            }
            else {
                this["food_2_" + (i - 6)].source = "greedy_food" + this.Arr_food[i] + "_png";
                this["food_2_" + (i - 6)].horizontalCenter = this.Arr_food_Shift[i];
                var anchor_X;
                var anchor_Y;
                switch (this.Arr_food[i]) {
                    case 1:
                        anchor_X = 97;
                        anchor_Y = 32.6;
                        break;
                    case 2:
                        anchor_X = 107.5;
                        anchor_Y = 30;
                        break;
                    case 3:
                        anchor_X = 104;
                        anchor_Y = 28;
                        break;
                }
                this["food_2_" + (i - 6)].anchorOffsetX = anchor_X;
                this["food_2_" + (i - 6)].anchorOffsetY = anchor_Y;
            }
        }
    };
    //左手吃
    GameGreedyPersonView.prototype.onlefteat = function () {
        if (this.isGameOver) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Self = true;
            return;
        }
        var str = "speedy_eat1_mp3";
        App.SoundManager.playEffect(str);
        this.numFoodSelfeat++;
        this.onReduceFood();
        //this.dbBoss.play("c", 0);//睡眠
        if (this.onSelfLocation == 1) {
            this["arm_" + this.onSelfLocation].play("d", 1);
            this["person_" + this.onSelfLocation].play("d", 1);
        }
        else {
            this["person_" + this.onSelfLocation].play("c", 1);
            this["arm_" + this.onSelfLocation].play("c", 1);
        }
        this.onCheckWhoisWin();
    };
    //右手吃
    GameGreedyPersonView.prototype.onRighteat = function () {
        if (this.isGameOver) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Self = true;
            return;
        }
        var str = "speedy_eat2_mp3";
        App.SoundManager.playEffect(str);
        this.numFoodSelfeat++;
        this.onReduceFood();
        //this.dbBoss.play("d", 0);//睡眠
        if (this.onSelfLocation == 1) {
            this["person_" + this.onSelfLocation].play("c", 1);
            this["arm_" + this.onSelfLocation].play("c", 1);
        }
        else {
            this["person_" + this.onSelfLocation].play("d", 1);
            this["arm_" + this.onSelfLocation].play("d", 1);
        }
        this.onCheckWhoisWin();
    };
    GameGreedyPersonView.prototype.onAiAttack = function () {
        if (this.isGameOver || this.Caught_Enumy) {
            return;
        }
        //有一定概率被抓
        if (this.isBossXing) {
            if (this.numAiAttack % 10 > 3) {
                return;
            }
        }
        this.numAiAttack++;
        if (this.numAiAttack % 2 == 0) {
            this.onEnumylefteat();
        }
        else {
            this.onEnumyRighteat();
        }
    };
    //敌人左手吃
    GameGreedyPersonView.prototype.onEnumylefteat = function () {
        //如果敌人已经被抓
        if (this.Caught_Enumy) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Enumy = true;
            return;
        }
        var str = "speedy_eat1_mp3";
        App.SoundManager.playEffect(str);
        this.numFoodEnumyeat++;
        this.onReduceFood(1);
        //this.dbBoss.play("c", 0);//睡眠
        if (this.onEnumyLocation == 1) {
            this["arm_" + this.onEnumyLocation].play("d", 1);
            this["person_" + this.onEnumyLocation].play("d", 1);
        }
        else {
            this["person_" + this.onEnumyLocation].play("c", 1);
            this["arm_" + this.onEnumyLocation].play("c", 1);
        }
        this.onCheckWhoisWin();
    };
    //敌人右手吃
    GameGreedyPersonView.prototype.onEnumyRighteat = function () {
        //如果敌人已经被抓
        if (this.Caught_Enumy) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Enumy = true;
            return;
        }
        var str = "speedy_eat1_mp3";
        App.SoundManager.playEffect(str);
        this.numFoodEnumyeat++;
        this.onReduceFood(1);
        //this.dbBoss.play("d", 0);//睡眠
        if (this.onEnumyLocation == 1) {
            this["person_" + this.onEnumyLocation].play("c", 1);
            this["arm_" + this.onEnumyLocation].play("c", 1);
        }
        else {
            this["person_" + this.onEnumyLocation].play("d", 1);
            this["arm_" + this.onEnumyLocation].play("d", 1);
        }
        this.onCheckWhoisWin();
    };
    //检测游戏是否结束
    GameGreedyPersonView.prototype.onCheckWhoisWin = function () {
        if (this.numFoodEnumyeat == 140) {
            this.isGameOver = true;
            console.log("你输了");
            this.onResult(1);
        }
        else if (this.numFoodSelfeat == 140) {
            this.isGameOver = true;
            console.log("你赢了");
            this.onResult();
        }
        if (this.isGameOver) {
            this.touchEnabled = false;
            this.touchChildren = false;
        }
    };
    //减少食物的动画 0自己吃  1敌人吃
    GameGreedyPersonView.prototype.onReduceFood = function (num) {
        if (num === void 0) { num = 0; }
        // if (this.isGameOver) {
        //     return;
        // }
        if (num == 0) {
            if (this.numFoodSelfeat % 20 != 0) {
                var num_id = Math.floor(this.numFoodSelfeat / 20) + 1;
                var obj = this["food_" + this.onSelfLocation + "_" + num_id];
                if (obj)
                    this.onEatCartoon(obj);
            }
            else {
                this["food_" + this.onSelfLocation + "_" + (this.numFoodSelfeat / 20)].visible = false;
            }
        }
        else {
            console.log("敌人吃的食物数量:", this.numFoodEnumyeat);
            if (this.numFoodEnumyeat % 20 != 0) {
                var num_id = Math.floor(this.numFoodEnumyeat / 20) + 1;
                var obj = this["food_" + this.onEnumyLocation + "_" + num_id];
                if (obj)
                    this.onEatCartoon(obj);
            }
            else {
                //console.log("敌人吃的食物数量:", this.numFoodEnumyeat)
                this["food_" + this.onEnumyLocation + "_" + (this.numFoodEnumyeat / 20)].visible = false;
            }
        }
    };
    //吃食物
    GameGreedyPersonView.prototype.onEatCartoon = function (Obj) {
        egret.Tween.removeTweens(Obj);
        Obj.scaleX = 1;
        Obj.scaleY = 1;
        egret.Tween.get(Obj).to({ scaleX: 1.2, scaleY: 1.2 }, 100).to({ scaleX: 1, scaleY: 1 }, 100).call(function () {
            egret.Tween.removeTweens(Obj);
        });
    };
    //给敌人增加食物(嘲讽敌人)
    GameGreedyPersonView.prototype.onAddFoodToEnumy = function () {
        if (this.isGameOver) {
            return;
        }
        // //第一下最狠
        if (this.numChaoFengFrist) {
            this.numFoodEnumyeat = this.numFoodEnumyeat - this.numFoodEnumyeat % 20;
            this.numChaoFengFrist = false;
            this.iswhoChaoFeng = true;
        }
        this.numFoodEnumyeat -= 2;
        if (this.numFoodEnumyeat <= 0) {
            this.numFoodEnumyeat = 0;
            this["food_" + this.onEnumyLocation + "_" + 1].alpha = 1;
            //出牌子
            this.onShouTiShi(this.onSelfLocation);
            console.log("出牌子");
        }
        else {
            var numAdd = this.numFoodEnumyeat % 20;
            var num_Food_id = Math.floor(this.numFoodEnumyeat / 20) + 1;
            if (numAdd == 0) {
                this["food_" + this.onEnumyLocation + "_" + num_Food_id].alpha = 1;
            }
            else {
                this["food_" + this.onEnumyLocation + "_" + num_Food_id].visible = true;
                this["food_" + this.onEnumyLocation + "_" + num_Food_id].alpha = 0.5;
                this.onAddFoodCartoon(this["food_" + this.onEnumyLocation + "_" + num_Food_id]);
                this.ImageYing = this["food_" + this.onEnumyLocation + "_" + num_Food_id];
            }
        }
        console.log("嘲讽改变敌人食物数量：~~", this.numFoodEnumyeat);
    };
    //给自己添加食物（被嘲讽）
    GameGreedyPersonView.prototype.onAddFoodToSelf = function () {
        // //第一下最狠
        if (this.numChaoFengFrist) {
            this.numFoodSelfeat = this.numFoodSelfeat - this.numFoodSelfeat % 20;
            this.numChaoFengFrist = false;
            this.iswhoChaoFeng = false;
        }
        this.numFoodSelfeat -= 2;
        if (this.numFoodSelfeat <= 0) {
            this.numFoodSelfeat = 0;
            this["food_" + this.onSelfLocation + "_" + 1].alpha = 1;
            //出牌子
            console.log("出牌子");
            this.onShouTiShi(this.onEnumyLocation);
        }
        else {
            var numAdd = this.numFoodSelfeat % 20;
            var num_Food_id = Math.floor(this.numFoodSelfeat / 20) + 1;
            if (numAdd == 0) {
                this["food_" + this.onSelfLocation + "_" + num_Food_id].alpha = 1;
            }
            else {
                this["food_" + this.onSelfLocation + "_" + num_Food_id].visible = true;
                this["food_" + this.onSelfLocation + "_" + num_Food_id].alpha = 0.5;
                this.ImageYing = this["food_" + this.onSelfLocation + "_" + num_Food_id];
                this.onAddFoodCartoon(this["food_" + this.onSelfLocation + "_" + num_Food_id]);
            }
        }
        console.log("被嘲讽改变自己食物数量：~~", this.numFoodSelfeat);
    };
    //展示提示
    GameGreedyPersonView.prototype.onShouTiShi = function (num) {
        var _this = this;
        this["gp_Chao" + num].alpha = 1;
        egret.Tween.removeTweens(this["gp_Chao" + num]);
        egret.Tween.get(this["gp_Chao" + num]).to({ alpha: 0 }, 200).call(function () {
            egret.Tween.removeTweens(_this["gp_Chao" + num]);
        });
    };
    //联机状态下嘲讽
    GameGreedyPersonView.prototype.onNoticeChaoFeng = function () {
        if (this.isGameOver) {
            return;
        }
        var str = "ChaoFeng" + this.onEnumyLocation;
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
    };
    //抓人
    GameGreedyPersonView.prototype.onArrest = function () {
        this.dbBoss.play("b", 1);
        this.isBossXing = true;
        if (DataCenter.instance.room.selfIsMaster || DataCenter.instance.room.IsAI) {
            //一秒后决定Boss反应
            App.TimerManager.doTimer(500, 1, this.onBossReaction, this);
        }
        this.person_1.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate1, this);
        this.person_2.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate2, this);
    };
    //下一秒boss反应
    GameGreedyPersonView.prototype.onBossReaction = function () {
        //同时抓住
        if (this.Caught_Enumy && this.Caught_Self) {
            if (DataCenter.instance.room.IsAI) {
                this.onCatchDouble();
                this.onChangeButton(3);
                App.TimerManager.doTimer(750, 1, this.onReleaseDouble, this);
            }
            else {
                if (DataCenter.instance.room.selfIsMaster) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "CatchDouble", 1);
                }
            }
        }
        else if (!this.Caught_Enumy && this.Caught_Self) {
            if (DataCenter.instance.room.IsAI) {
                this.onCatchOne();
                this.onChangeButton(3);
                this.onAIChaoFeng(); //自己被AI嘲讽
                App.TimerManager.doTimer(this.num_time_ChaoFeng, 1, this.onReleaseDouble, this);
            }
            else {
                if (DataCenter.instance.room.selfIsMaster) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "CatchPlayer1", 1);
                }
            }
        }
        else if (this.Caught_Enumy && !this.Caught_Self) {
            if (DataCenter.instance.room.IsAI) {
                this.onCatchTwo();
                this.onChangeButton(1);
                App.TimerManager.doTimer(this.num_time_ChaoFeng, 1, this.onReleaseDouble, this);
            }
            else {
                if (DataCenter.instance.room.selfIsMaster) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "CatchPlayer2", 1);
                }
            }
        }
        else if (!this.Caught_Enumy && !this.Caught_Self) {
            if (DataCenter.instance.room.IsAI) {
                if (this.num_BossChecktime == 0) {
                    this.num_BossChecktime = 1;
                    this.onNoCatchany();
                    //一秒后决定Boss反应
                    App.TimerManager.doTimer(500, 1, this.onBossCheckAgain, this);
                }
                else {
                    this.onReleaseDouble();
                }
            }
            else {
                if (DataCenter.instance.room.selfIsMaster) {
                    if (this.num_BossChecktime == 0) {
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "CatchNO", 1);
                    }
                    else {
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "CatchNOAgain", 1);
                    }
                }
            }
        }
    };
    //AI嘲讽自己
    GameGreedyPersonView.prototype.onAIChaoFeng = function () {
        //AI嘲讽22下
        App.TimerManager.doTimer(160, 22, this.onAddFoodToSelf, this);
    };
    //boss笑笑继续考核
    GameGreedyPersonView.prototype.onBossCheckAgain = function () {
        this.onBossReaction();
    };
    //boss继续沉睡，并释放2个人
    GameGreedyPersonView.prototype.onReleaseDouble = function () {
        this.person_1.play("a", 0);
        this.person_2.play("a", 0);
        this.dbBoss.play("a", 0);
        this.Caught_Enumy = false;
        this.Caught_Self = false;
        this.isBossXing = false;
        //如果点击了嘲讽
        if (!this.numChaoFengFrist) {
            this.numChaoFengFrist = true;
            if (this.ImageYing) {
                if (this.ImageYing.alpha == 0.5) {
                    this.ImageYing.visible = false;
                }
            }
            if (this.iswhoChaoFeng) {
                if (this.numFoodEnumyeat % 20 != 0) {
                    this.numFoodEnumyeat = (Math.floor(this.numFoodEnumyeat / 20) + 1) * 20;
                }
                // var num_id: number = this.numFoodEnumyeat / 20;
                // if (this["food_" + this.onEnumyLocation + "_" + num_id].alpha == 0.5) {
                //     this["food_" + this.onEnumyLocation + "_" + num_id].visible = false;
                // }
            }
            else {
                if (this.numFoodSelfeat % 20 != 0) {
                    this.numFoodSelfeat = (Math.floor(this.numFoodSelfeat / 20) + 1) * 20;
                }
                // var num_id: number = this.numFoodSelfeat / 20;
                // if (this["food_" + this.onSelfLocation + "_" + num_id].alpha == 0.5) {
                //     this["food_" + this.onSelfLocation + "_" + num_id].visible = false;
                // }
            }
        }
        this.onChangeButton(2);
        console.log("开心》》", this.numFoodEnumyeat, this.numFoodSelfeat);
        this.num_BossChecktime = 0;
        this.person_1.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate1, this);
        this.person_2.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate2, this);
    };
    //抓玩家1
    GameGreedyPersonView.prototype.onCatchOne = function () {
        this.person_1.play("f", 0);
        this.person_2.play("e", 0);
        this.dbBoss.play("c", 0);
        var str = "speedy_ku_mp3";
        App.SoundManager.playEffect(str);
    };
    //抓玩家2
    GameGreedyPersonView.prototype.onCatchTwo = function () {
        this.person_1.play("e", 0);
        this.person_2.play("f", 0);
        this.dbBoss.play("d", 0);
        var str = "speedy_ku_mp3";
        App.SoundManager.playEffect(str);
    };
    //抓两个
    GameGreedyPersonView.prototype.onCatchDouble = function () {
        this.person_1.play("f", 0);
        this.person_2.play("f", 0);
        this.dbBoss.play("e", 0);
        var str = "speedy_ku_mp3";
        App.SoundManager.playEffect(str);
    };
    //没抓任何人
    GameGreedyPersonView.prototype.onNoCatchany = function () {
        this.person_1.play("b", 0);
        this.person_2.play("b", 0);
        this.dbBoss.play("b", 0);
    };
    //游戏结果提示
    GameGreedyPersonView.prototype.onResult = function (num) {
        var _this = this;
        if (num === void 0) { num = 0; }
        var img = new eui.Image();
        this.containerGroup.addChild(img);
        img.horizontalCenter = 0;
        img.verticalCenter = 0;
        if (num == 0) {
            img.source = "win_png";
        }
        else {
            img.source = "fail_png";
        }
        egret.Tween.get(img).to({ scaleX: 1.2, scaleY: 1.2 }, 500).to({ scaleX: 1, scaleY: 1 }, 1000).wait(1000).call(function () {
            egret.Tween.removeTweens(img);
            _this.containerGroup.removeChild(img);
            if (num == 0) {
                _this.gameOver(3);
            }
            else {
                _this.gameOver(1);
            }
        });
    };
    //嘲讽1
    GameGreedyPersonView.prototype.onChaoFengOne = function () {
    };
    //嘲讽2
    GameGreedyPersonView.prototype.onChaoFengTwo = function () {
    };
    //按钮 转化
    GameGreedyPersonView.prototype.onChangeButton = function (num) {
        if (num === void 0) { num = 2; }
        this.chaofengBtn.visible = false;
        this.btn_lefteat.visible = false;
        this.btn_righteat.visible = false;
        switch (num) {
            //只留嘲讽
            case 1:
                this.chaofengBtn.visible = true;
                break;
            //只留两个
            case 2:
                this.btn_lefteat.visible = true;
                this.btn_righteat.visible = true;
                break;
            //3个同时消失
            case 3:
                break;
        }
    };
    // 创建动画资源加载到舞台
    GameGreedyPersonView.prototype.addAllDb = function () {
        //boss
        this.dbBoss = AssetManager.getQuickDBArmature("boss");
        this.dbBoss.x = this.gp_boss.width / 2;
        this.dbBoss.y = 470;
        this.gp_boss.addChild(this.dbBoss);
        this.dbBoss.play("a", 0); //睡眠
        //人物左
        this.person_1 = AssetManager.getQuickDBArmature("left");
        this.person_1.x = this.gp_person1.width / 2;
        this.person_1.y = 250;
        this.gp_person1.addChild(this.person_1);
        this.person_1.play("a", 0);
        this.arm_1 = AssetManager.getQuickDBArmature("left_hand");
        this.arm_1.x = this.gp_arm1.width / 2;
        this.arm_1.y = 0;
        this.gp_arm1.addChild(this.arm_1);
        this.arm_1.play("a", 0);
        //人物右
        this.person_2 = AssetManager.getQuickDBArmature("right");
        this.person_2.x = this.gp_person2.width / 2;
        this.person_2.y = 250;
        this.gp_person2.addChild(this.person_2);
        this.person_2.play("a", 0);
        this.arm_2 = AssetManager.getQuickDBArmature("right_hand");
        this.arm_2.x = this.gp_arm2.width / 2;
        this.arm_2.y = 0;
        this.gp_arm2.addChild(this.arm_2);
        this.arm_2.play("a", 0);
        this.person_1.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate1, this);
        this.person_2.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate2, this);
    };
    GameGreedyPersonView.prototype.onPlayComplate1 = function () {
        this["person_" + 1].play("a", 1);
    };
    GameGreedyPersonView.prototype.onPlayComplate2 = function () {
        this["person_" + 2].play("a", 1);
    };
    GameGreedyPersonView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    GameGreedyPersonView.GAME_WIDTH = 640;
    GameGreedyPersonView.GAME_HEIGHT = 1136;
    return GameGreedyPersonView;
}(StateEui));
__reflect(GameGreedyPersonView.prototype, "GameGreedyPersonView");
