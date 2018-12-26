/**
 * 贪吃维京人
 * by dingyafeng
 */
class GameGreedyPersonView extends StateEui {

    public static GAME_WIDTH: number = 640;
    public static GAME_HEIGHT: number = 1136;
    public containerGroup: eui.Group;
    public chaofengBtn: eui.Button;// 得瑟按钮
    public btn_lefteat: eui.Button;//左吃
    public btn_righteat: eui.Button;//右吃
    public gp_food1: eui.Group;
    public gp_food2: eui.Group;
    public gp_person1: eui.Group;
    public gp_arm1: eui.Group;
    public gp_person2: eui.Group;
    public gp_arm2: eui.Group;
    public img_mark: eui.Image;
    public img_start1: eui.Image;
    public img_start2: eui.Image;
    public food_1_1: eui.Image;
    public food_1_2: eui.Image;
    public food_1_3: eui.Image;
    public food_1_4: eui.Image;
    public food_1_5: eui.Image;
    public food_1_6: eui.Image;
    public food_1_7: eui.Image;

    public food_2_1: eui.Image;
    public food_2_2: eui.Image;
    public food_2_3: eui.Image;
    public food_2_4: eui.Image;
    public food_2_5: eui.Image;
    public food_2_6: eui.Image;
    public food_2_7: eui.Image;
    public gp_boss: eui.Group;
    public dbBoss: DBArmature;//BOSS
    public person_1: DBArmature;
    public person_2: DBArmature;
    public arm_1: DBArmature;
    public arm_2: DBArmature;
    public gp_you: eui.Group;
    private lb_time1: eui.Label;
    private lb_time2: eui.Label;
    public gp_Chao1: eui.Group;
    public gp_Chao2: eui.Group;
    private lb_chao1_1: eui.Label;
    private lb_chao1_2: eui.Label;
    private lb_chao2_1: eui.Label;
    private lb_chao2_2: eui.Label;
    private num_time_ChaoFeng: number = 3550;//嘲讽对手的时间
    public numFoodSelfeat: number = 0;//自己吃了多少
    public numFoodEnumyeat: number = 0;//敌人吃了多少
    private isGameOver: boolean = false;
    private numtime: number = 60;
    private isBossXing: boolean = false;//是不是Boss检查期间
    public Caught_Self: boolean = false;//自己被抓
    public Caught_Enumy: boolean = false;//敌人被抓
    public playerAvatarGroup1: eui.Group;
    public playerAvatarGroup2: eui.Group;

    /************需要初始同步给对面的数据**********/
    //食物
    public Arr_food: Array<any> = [];
    //食物相对中心偏移量
    public Arr_food_Shift: Array<any> = [];
    //自己的位置
    public onSelfLocation: number = 1;
    public onEnumyLocation: number = 2;
    //Boss检查第几次  0,1
    private num_BossChecktime: number = 0;
    //嘲讽的第几下
    private numChaoFengFrist: boolean = true;
    /*************************/
    private ImageYing: eui.Image = null;
    public constructor() {
        super(GameGreedyPersonSkin);
    }

    public init(): void {
        super.init();
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
        let user = DataCenter.instance.user;
        // this.BaseComment.lb_name1.text = user.name;
        var playerHead1 = new RoleHeadImage(user.imgUrl);
        playerHead1.scaleX = playerHead1.scaleY = 0.82;
        this.playerAvatarGroup1.addChild(playerHead1);
        let enumy = DataCenter.instance.room.player;
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
                            str += this.Arr_food_Shift[i]
                        }
                    }

                    //ProxySocket.sendGameEvent(App.CurrRoomId, str);
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
                }
                //通知对方准备开始
                var str = "startGame"
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
            }
            //如果遇到AI直接开始
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
    }
    // 弹出游戏结果画面
    private onGameResult(data: any): void {
        DataCenter.instance.room.gameResult = data;
        this.popup("GameResult");
    }
    //通知服务器游戏结束
    public gameOver(result: number): void {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    //网络事件
    private onGameEvent(data: any) {
        let parseData = (data: string): string[] => {
            let splitChar = data.split("|");
            return splitChar;
        }
        let datas = parseData(data.event);
        switch (datas[0]) {
            case "food":
                //console.log("布置食物", datas[1], datas[2]);
                for (var i = 1; i < 15; ++i) {
                    var num = Number(datas[i])
                    this.Arr_food.push(num);
                }
                for (var i = 15; i < 29; ++i) {
                    var num = Number(datas[i])
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
                //敌人进攻
                else {
                    this.onEnumylefteat();
                }

                break;
            case "Left_2":
                //自己进攻
                if (this.onSelfLocation == 2) {
                    this.onlefteat();
                }
                //敌人进攻
                else {
                    this.onEnumylefteat();
                }

                break;
            case "Right_1":
                //自己进攻
                if (this.onSelfLocation == 1) {
                    this.onRighteat();
                }
                //敌人进攻
                else {
                    this.onEnumyRighteat();
                }
                break;
            case "Right_2":
                //自己进攻
                if (this.onSelfLocation == 2) {
                    this.onRighteat();
                }
                //敌人进攻
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
    }

    private onReadyGo() {
        this.img_start1.visible = true;
        // var str = "readygo_mp3"
        // App.SoundManager.playEffect(str);

        egret.Tween.get(this.img_start2).wait(700).call(() => {
            this.img_start1.visible = false;
        }).to({ scaleX: 1, scaleY: 1 }, 500).wait(500).call(() => {
            this.img_start2.visible = false;
            egret.Tween.removeTweens(this.img_start2);

            App.TimerManager.doTimer(1000, 0, this.onTimerUpdate, this);
            // //如果是AI
            if (DataCenter.instance.room.IsAI) {
                App.TimerManager.doTimer(150, 0, this.onAiAttack, this);
                this.chaofengBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onAddFoodToEnumy, this);
                this.btn_lefteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onlefteat, this);
                this.btn_righteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRighteat, this);
            }
            else {
                this.chaofengBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNoticeChaoFeng, this);
                this.btn_lefteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNoticelefteat, this);
                this.btn_righteat.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNoticeRighteat, this);
            }
        })
    }
    //联机状态下左吃
    private onNoticelefteat() {
        if (this.isGameOver) {
            return;
        }
        var str: string = "Left_" + this.onSelfLocation;
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
    }

    //联机状态下左吃
    private onNoticeRighteat() {
        if (this.isGameOver) {
            return;
        }
        var str: string = "Right_" + this.onSelfLocation;
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
    }


    //每秒刷新
    private onTimerUpdate() {
        if (this.isGameOver) {
            App.TimerManager.remove(this.onTimerUpdate, this);
            return;
        }
        this.numtime--;

        if (this.numtime < 10) {
            this.lb_time1.text = "0" + this.numtime
        }
        else {
            this.lb_time1.text = "" + this.numtime
        }

        if (this.numtime % 7 == 0) {
            if (DataCenter.instance.room.IsAI) {
                var num: number = App.RandomUtils.limitInteger(1, 10);
                this.onBossWillComming(num);
            }
            else {
                //如果自己是主机
                if (DataCenter.instance.room.selfIsMaster) {
                    var num: number = App.RandomUtils.limitInteger(1, 10);
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
    }
    //嘲讽动画
    private onAddFoodCartoon(Obj: eui.Image) {
        var img = new eui.Image();
        img.source = Obj.source;
        img.anchorOffsetX = Obj.anchorOffsetX;
        img.anchorOffsetY = Obj.anchorOffsetY;
        img.horizontalCenter = Obj.horizontalCenter;
        img.bottom = Obj.bottom + 140;
        Obj.parent.addChild(img);

        egret.Tween.get(img).to({ bottom: Obj.bottom }, 50).call(() => {
            egret.Tween.removeTweens(this.img_mark);
            Obj.parent.removeChild(img);
        })
    }


    public show() {
        super.show();

    }
    //Boss出现预警
    private onBossWillComming(num) {
        egret.Tween.get(this.img_mark).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200).call(() => {
            egret.Tween.removeTweens(this.img_mark);
            //决定是否醒来
            if (num <= 7) {
                this.onArrest();
            }
        })
    }
    //生成食物 
    private onInitFood() {
        if (DataCenter.instance.room.selfIsMaster) {
            for (var i = 0; i < 14; ++i) {
                var num: number = App.RandomUtils.limitInteger(1, 3)
                this.Arr_food.push(num);
                var num_shift: number = App.RandomUtils.limitInteger(-10, 10)
                this.Arr_food_Shift.push(num_shift);
            }
        }
        //设置食物
        this.setFood();
    }
    //设置食物
    private setFood() {
        for (var i = 0; i < 14; ++i) {
            if (i < 7) {
                this["food_1_" + (i + 1)].source = "greedy_food" + this.Arr_food[i] + "_png";
                this["food_1_" + (i + 1)].horizontalCenter = this.Arr_food_Shift[i];

                var anchor_X: number;
                var anchor_Y: number;
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
                var anchor_X: number;
                var anchor_Y: number;
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

    }
    //左手吃
    private onlefteat() {
        if (this.isGameOver) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Self = true;
            return;
        }
        var str = "speedy_eat1_mp3"
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

    }
    //右手吃
    private onRighteat() {
        if (this.isGameOver) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Self = true;
            return;
        }
        var str = "speedy_eat2_mp3"
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
    }
    private numAiAttack: number = 0;
    private onAiAttack() {
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
    }
    //敌人左手吃
    private onEnumylefteat() {
        //如果敌人已经被抓
        if (this.Caught_Enumy) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Enumy = true;
            return;
        }
        var str = "speedy_eat1_mp3"
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

    }
    //敌人右手吃
    private onEnumyRighteat() {
        //如果敌人已经被抓
        if (this.Caught_Enumy) {
            return;
        }
        if (this.isBossXing) {
            this.Caught_Enumy = true;
            return;
        }
        var str = "speedy_eat1_mp3"
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
    }
    //检测游戏是否结束
    private onCheckWhoisWin() {
        if (this.numFoodEnumyeat == 140) {
            this.isGameOver = true;
            console.log("你输了")
            this.onResult(1);
        }
        else if (this.numFoodSelfeat == 140) {
            this.isGameOver = true;
            console.log("你赢了")
            this.onResult();
        }
        if (this.isGameOver) {
            this.touchEnabled = false;
            this.touchChildren = false;
        }

    }
    //减少食物的动画 0自己吃  1敌人吃
    private onReduceFood(num: number = 0) {
        // if (this.isGameOver) {
        //     return;
        // }
        if (num == 0) {
            if (this.numFoodSelfeat % 20 != 0) {
                var num_id = Math.floor(this.numFoodSelfeat / 20) + 1;
                var obj: any = this["food_" + this.onSelfLocation + "_" + num_id];
                if (obj)
                    this.onEatCartoon(obj);
            }
            else {
                this["food_" + this.onSelfLocation + "_" + (this.numFoodSelfeat / 20)].visible = false;
            }
        }
        else {
            console.log("敌人吃的食物数量:", this.numFoodEnumyeat)
            if (this.numFoodEnumyeat % 20 != 0) {
                var num_id = Math.floor(this.numFoodEnumyeat / 20) + 1;
                var obj: any = this["food_" + this.onEnumyLocation + "_" + num_id];
                if (obj)
                    this.onEatCartoon(obj);
            }
            else {
                //console.log("敌人吃的食物数量:", this.numFoodEnumyeat)
                this["food_" + this.onEnumyLocation + "_" + (this.numFoodEnumyeat / 20)].visible = false;
            }
        }

    }
    //吃食物
    private onEatCartoon(Obj: any) {
        egret.Tween.removeTweens(Obj);
        Obj.scaleX = 1;
        Obj.scaleY = 1;
        egret.Tween.get(Obj).to({ scaleX: 1.2, scaleY: 1.2 }, 100).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
            egret.Tween.removeTweens(Obj);
        })

    }
    private iswhoChaoFeng: boolean = false;
    //给敌人增加食物(嘲讽敌人)
    private onAddFoodToEnumy() {
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
            var numAdd: number = this.numFoodEnumyeat % 20;
            var num_Food_id: number = Math.floor(this.numFoodEnumyeat / 20) + 1;
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

        console.log("嘲讽改变敌人食物数量：~~", this.numFoodEnumyeat)
    }
    //给自己添加食物（被嘲讽）
    private onAddFoodToSelf() {
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
            var numAdd: number = this.numFoodSelfeat % 20;
            var num_Food_id: number = Math.floor(this.numFoodSelfeat / 20) + 1;
            if (numAdd == 0) {
                this["food_" + this.onSelfLocation + "_" + num_Food_id].alpha = 1;
            }
            else {

                this["food_" + this.onSelfLocation + "_" + num_Food_id].visible = true;
                this["food_" + this.onSelfLocation + "_" + num_Food_id].alpha = 0.5;
                this.ImageYing = this["food_" + this.onSelfLocation + "_" + num_Food_id]
                this.onAddFoodCartoon(this["food_" + this.onSelfLocation + "_" + num_Food_id]);
            }
        }

        console.log("被嘲讽改变自己食物数量：~~", this.numFoodSelfeat)

    }
    //展示提示
    private onShouTiShi(num: number) {
        this["gp_Chao" + num].alpha = 1;
        egret.Tween.removeTweens(this["gp_Chao" + num]);
        egret.Tween.get(this["gp_Chao" + num]).to({ alpha: 0 }, 200).call(() => {
            egret.Tween.removeTweens(this["gp_Chao" + num]);
        })
    }
    //联机状态下嘲讽
    private onNoticeChaoFeng() {
        if (this.isGameOver) {
            return;
        }
        var str: string = "ChaoFeng" + this.onEnumyLocation;
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str, 1);
    }
    //抓人
    private onArrest() {
        this.dbBoss.play("b", 1);
        this.isBossXing = true;
        if (DataCenter.instance.room.selfIsMaster || DataCenter.instance.room.IsAI) {
            //一秒后决定Boss反应
            App.TimerManager.doTimer(500, 1, this.onBossReaction, this);
        }
        this.person_1.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate1, this);
        this.person_2.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayComplate2, this);
    }
    //下一秒boss反应
    private onBossReaction() {
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
        //抓到自己
        else if (!this.Caught_Enumy && this.Caught_Self) {
            if (DataCenter.instance.room.IsAI) {
                this.onCatchOne();
                this.onChangeButton(3);
                this.onAIChaoFeng();//自己被AI嘲讽
                App.TimerManager.doTimer(this.num_time_ChaoFeng, 1, this.onReleaseDouble, this);
            }
            else {
                if (DataCenter.instance.room.selfIsMaster) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "CatchPlayer1", 1);
                }
            }


        }
        //抓到敌人
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
        //都没抓到
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
                    } else {
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "CatchNOAgain", 1);
                    }
                }
            }


        }
    }
    //AI嘲讽自己
    private onAIChaoFeng() {
        //AI嘲讽22下
        App.TimerManager.doTimer(160, 22, this.onAddFoodToSelf, this);
    }
    //boss笑笑继续考核
    private onBossCheckAgain() {
        this.onBossReaction();
    }


    //boss继续沉睡，并释放2个人
    private onReleaseDouble() {
        this.person_1.play("a", 0)
        this.person_2.play("a", 0)
        this.dbBoss.play("a", 0)
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

    }

    //抓玩家1
    private onCatchOne() {
        this.person_1.play("f", 0);
        this.person_2.play("e", 0);
        this.dbBoss.play("c", 0);
        var str = "speedy_ku_mp3"
        App.SoundManager.playEffect(str);
    }
    //抓玩家2
    private onCatchTwo() {
        this.person_1.play("e", 0);
        this.person_2.play("f", 0);
        this.dbBoss.play("d", 0);
        var str = "speedy_ku_mp3"
        App.SoundManager.playEffect(str);

    }
    //抓两个
    private onCatchDouble() {
        this.person_1.play("f", 0);
        this.person_2.play("f", 0);
        this.dbBoss.play("e", 0);
        var str = "speedy_ku_mp3"
        App.SoundManager.playEffect(str);

    }
    //没抓任何人
    private onNoCatchany() {
        this.person_1.play("b", 0);
        this.person_2.play("b", 0);
        this.dbBoss.play("b", 0);

    }
    //游戏结果提示
    private onResult(num: number = 0) {
        var img = new eui.Image();
        this.containerGroup.addChild(img)
        img.horizontalCenter = 0;
        img.verticalCenter = 0;
        if (num == 0) {
            img.source = "win_png"
        }
        else {
            img.source = "fail_png"
        }

        egret.Tween.get(img).to({ scaleX: 1.2, scaleY: 1.2 }, 500).to({ scaleX: 1, scaleY: 1 }, 1000).wait(1000).call(() => {
            egret.Tween.removeTweens(img);
            this.containerGroup.removeChild(img);
            if (num == 0) {
                this.gameOver(3);
            }
            else {
                this.gameOver(1);
            }
        })

    }
    //嘲讽1
    private onChaoFengOne() {

    }
    //嘲讽2
    private onChaoFengTwo() {

    }
    //按钮 转化
    private onChangeButton(num: number = 2) {
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




    }

    // 创建动画资源加载到舞台
    private addAllDb(): void {
        //boss
        this.dbBoss = AssetManager.getQuickDBArmature("boss");
        this.dbBoss.x = this.gp_boss.width / 2;
        this.dbBoss.y = 470;
        this.gp_boss.addChild(this.dbBoss);
        this.dbBoss.play("a", 0);//睡眠
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

    }

    private onPlayComplate1() {
        this["person_" + 1].play("a", 1);
    }

    private onPlayComplate2() {
        this["person_" + 2].play("a", 1);
    }

    public dispose(): void {
        super.dispose();
    }

}
