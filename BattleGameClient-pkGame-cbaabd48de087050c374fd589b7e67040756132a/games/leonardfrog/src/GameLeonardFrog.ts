// TypeScript file
class GameLeonardFroG extends State {
    public static MOVE_SPEED: number = 0.1;
    public static IMPACT_parameter: number = 0.75;//碰撞精确参数
    public static GAME_WIDTH: number = 640;
    public static GAME_HEIGHT: number = 1136;
    public static Rect_ID: number = 0;
    public static Character_ID: number = 0;
    public static MAX_SCORE: number = 12;

    public static Rects: any = {}

    private container: egret.DisplayObjectContainer;//总容器
    private containerTop: egret.DisplayObjectContainer;//上部分
    private containerPeople: egret.DisplayObjectContainer;//角色层
    private containerheight: egret.DisplayObjectContainer;//最上层(添加测彩虹）
    private containerEffect: egret.DisplayObjectContainer;//粒子层
    public flower1: DBArmature;//
    public flower2: DBArmature;//
    public flower3: DBArmature;//
    private containerGame: GameLeonardFrogMap;//游戏部分

    private bg: egret.Bitmap;
    private img1: egret.Bitmap;//标题
    private img_red: egret.Bitmap;//得分1
    private img_blue: egret.Bitmap;//得分2
    private img_diadema: egret.Bitmap;//王冠
    private bg_time: egret.Bitmap;//时间背景
    private bitmaptime: egret.TextField;
    private goBack: egret.Bitmap;
    private btn_jump: egret.Bitmap;

    private roleAvatar1: RoleAvatar;
    private roleAvatar2: RoleAvatar;

    private readyIMG: GameReady;

    private arrayPlay1: Array<any>;
    private arrayPlay2: Array<any>;
    private tmpForg: FrogCharacter;

    private numScore1 = 0;//玩家分数记录1
    private numScore2 = 0;

    private time: number = 60;

    private tmpPoint: egret.Point;

    private selfJumpFlag: boolean;
    private enemyJumpFlag: boolean;
    private particleXueHua: particle.ParticleSystem;// 雪花粒子
    private isRuning: boolean;

    public constructor() {
        super();
        this.tmpPoint = new egret.Point();
        this.arrayPlay1 = [];
        this.arrayPlay2 = [];
    }

    public init(): void {
        super.init();
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
        this.img_red.mask = new egret.Rectangle(-172, 0, 172, 42)
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
        this.container.addChild(this.roleAvatar2.armature)

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

        this.readyIMG = new GameReady(() => {
            this.start();
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
        if (App.IsXiaoMi || App.IsWanba ) {
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
    }
    pauseCallback = () => {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
        this.next("gameChangeMatch");
    }
    private roleAvatarPlayEnd(evt: dragonBones.AnimationEvent): void {
        var armature: DBArmature = <DBArmature>evt.currentTarget.parent;
        if (armature.currAction == "dong") {
            armature.play("jing");
        }
    }

    public show() {
        super.show();

        //创建方块和角色
        var tipDatas = this.containerGame.createSelfTips();
        if (DataCenter.instance.room.IsAI) {
            this.containerGame.createEnemyTips(tipDatas[0], tipDatas[1]);
            this.containerGame.tick(0);
            this.createAiEnemy();
            this.readyIMG.play();
        } else {
            var data = {
                key: "createRects",
                tips1Datas: tipDatas[0],
                tips2Datas: tipDatas[1],
            }
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
        this.onAddNewSelf();

        var str = "bg_frog_mp3"
        App.SoundManager.playBg(str);
    }

    // 请求游戏返回
    private goBackBtnHandler(): void {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    }

    private onGameEvent(data: any): void {
        var eventData: any = JSON.parse(data.event);
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
            var player: FrogCharacter = this.getEnemy(eventData.characterID);
            var rect: MoveRect = GameLeonardFroG.Rects[eventData.rectID];
            player.currRect = rect;
        }
        else if (eventData.key == "timeOver") {
            console.log("时间到啦啦啦啦啦");
            this.bitmaptime.text = "00";
        }
    }

    private getEnemy(id: number): FrogCharacter {
        for (var i = 0, len = this.arrayPlay2.length; i < len; i++) {
            var player = this.arrayPlay2[i];
            if (player.id == id) {
                return player;
            }
        }
        return null;
    }

    private timer(): void {
        this.time -= 1;
        if (this.time < 10) {
            this.bitmaptime.text = "0" + this.time.toString();
        } else {
            this.bitmaptime.text = this.time.toString();
        }
        if (this.time < 4 && this.time > 0) {
            var str = "time_common_mp3"
            App.SoundManager.playEffect(str);
        }
        else if (this.time == 0) {
            var str = "time_last_mp3"
            App.SoundManager.playEffect(str);
        }
        if (this.time == 0 || this.numScore1 == GameLeonardFroG.MAX_SCORE || this.numScore2 == GameLeonardFroG.MAX_SCORE) {
            //时间到
            if (!DataCenter.instance.room.IsAI) {
                let data = {
                    key: "timeOver",
                }
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
            }
            this.stop();
            var num: number = 1;
            if (this.numScore1 > this.numScore2) {
                num = 3
            }
            else if (this.numScore1 < this.numScore2) {
                num = 1
            }
            else if (this.numScore1 == this.numScore2) {
                num = 2;
            }
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, num);
        }
    }

    // 弹出游戏结果画面
    private onGameResult(data: any): void {
        this.stop();

        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", null);
    }

    private start(): void {
        this.isRuning = true;
        this.btn_jump.touchEnabled = true;
        this.containerheight.touchEnabled = true;
        App.TimerManager.doFrame(1, 0, this.run, this);
        App.TimerManager.doTimer(1000, 0, this.timer, this);
        if (DataCenter.instance.room.IsAI) {
            App.TimerManager.doTimer(1000, 0, this.enemyAi, this);
        }
    }

    private stop(): void {
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
    }

    private enemyAi(): void {
        this.enemyJump();
    }

    private createAiEnemy(): void {
        var id = ++GameLeonardFroG.Character_ID;
        var initX = App.RandomUtils.limitInteger(50, 350);
        this.onAddNewEnemy(id, GameLeonardFroG.GAME_WIDTH - initX);
    }

    private run(advancedTime: number): void {
        this.containerGame.tick(advancedTime);
        !this.selfJumpFlag && this.characterMove(advancedTime, true);
        !this.enemyJumpFlag && this.characterMove(advancedTime, false);
        this.onImpact();
    }

    //碰撞检测
    private rectangle1: egret.Rectangle = new egret.Rectangle();
    private rectangle2: egret.Rectangle = new egret.Rectangle();
    private checkFlag: number = 0;
    private onImpact() {
        this.checkFlag++;
        if (this.checkFlag == 10) {
            this.checkFlag = 0;
        } else {
            return;
        }

        var len1 = this.arrayPlay1.length;
        for (var i = len1 - 1; i >= 0; i--) {
            var player1 = this.arrayPlay1[i];
            if (player1.status == 0) {
                continue;
            }

            this.rectangle1.setTo(
                player1.x - player1.validWidth * 0.5,
                player1.y - player1.validHeight,
                player1.validWidth,
                player1.validHeight
            );

            var len2 = this.arrayPlay2.length;
            for (var j = len2 - 1; j >= 0; j--) {
                var player2 = this.arrayPlay2[j];
                if (player2.status == 5) {
                    continue;
                }

                this.rectangle2.setTo(
                    player2.x - player2.validWidth * 0.5,
                    player2.y,
                    player2.validWidth,
                    player2.validHeight
                );

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
    }

    private characterMove(advancedTime: number, isMe: boolean): void {
        var speed: number = GameLeonardFroG.MOVE_SPEED;
        var moveDis: number = speed * advancedTime;

        var players = isMe ? this.arrayPlay1 : this.arrayPlay2;
        for (var i = players.length - 1; i >= 0; i--) {
            var character: FrogCharacter = players[i];
            if (!character.currRect) {
                continue;
            }
            if (character.status % 2 == 0) {
                if (character.x > moveDis) {
                    character.x -= moveDis;
                }
            } else {
                if (GameLeonardFroG.GAME_WIDTH - character.x > moveDis) {
                    character.x += moveDis;
                }
            }

            if (!character.currRect.parent) {
                //掉水
                this.intoWater(character);
            }
        }
    }

    private removeCharacter(character: FrogCharacter, isFallWater: boolean = true, particle: string = "fallintowater"): void {
        egret.Tween.removeTweens(character);
        var self: any = this;
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
        var index: number = arr.indexOf(character);
        arr.splice(index, 1);
    }

    private enemyIntoWater(character: FrogCharacter): void {
        this.removeCharacter(character);
    }
    //
    private enemybumpOut(character: FrogCharacter): void {
        this.removeCharacter(character, false);
    }

    //
    private intoWater(character: FrogCharacter): void {
        if (!DataCenter.instance.room.IsAI && character.isEnemy) {
            return;
        }
        //落水音效
        var numRound: number = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "fallWater_" + numRound + "_mp3"
        App.SoundManager.playEffect(str);

        this.removeCharacter(character);
        if (!DataCenter.instance.room.IsAI) {
            let data = {
                key: "intoWater",
                characterID: character.id
            }
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    }
    //被撞走
    private onBumpOut(character: FrogCharacter): void {
        if (!DataCenter.instance.room.IsAI && character.isEnemy) {
            return;
        }
        //
        var numRound: number = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "push_" + numRound + "_mp3"
        App.SoundManager.playEffect(str);

        this.removeCharacter(character, false);
        if (!DataCenter.instance.room.IsAI) {
            let data = {
                key: "BumpOut",
                characterID: character.id
            }
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    }

    private onLand(character: FrogCharacter, hitRect: MoveRect): void {
        if (!DataCenter.instance.room.IsAI && character.isEnemy) {
            return;
        }

        //落在方块上
        character.armature.play("down", 1);
        character.currRect = hitRect;
        if (!DataCenter.instance.room.IsAI) {
            let data = {
                key: "setRect",
                characterID: character.id,
                rectID: hitRect.id,
                offsetX: character.x - hitRect.x,
            }
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    }

    private enemyJump() {
        //跳跃音效
        var numRound: number = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "jump_" + numRound + "_mp3"
        App.SoundManager.playEffect(str);
        this.enemyJumpFlag = true;
        var jumpTime = 250;
        var time1: Date = new Date();
        for (var i = 0; i < this.arrayPlay2.length; ++i) {
            var character: FrogCharacter = this.arrayPlay2[i];
            this.arrayPlay2[i].startJumptime = time1.getTime();
            character.status--;
            character.armature.play("jump", 1);
            egret.Tween.get(character).to({ y: character.y + 200 }, jumpTime).call(this.onJucde.bind(this, character));

        }

        egret.setTimeout(() => {
            this.enemyJumpFlag = false;
            DataCenter.instance.room.IsAI && this.createAiEnemy();
        }, this, jumpTime);
    }

    //点击跳跃

    private onJump() {
        //跳跃音效
        var numRound: number = App.RandomUtils.limitInteger(10, 100) % 2 + 1;
        var str = "jump_" + numRound + "_mp3"
        App.SoundManager.playEffect(str);
        this.selfJumpFlag = true;
        this.btn_jump.touchEnabled = false;
        this.containerheight.touchEnabled = false;
        var jumpTime = 250;
        var time1: Date = new Date();
        for (var i = 0; i < this.arrayPlay1.length; ++i) {
            var character: FrogCharacter = this.arrayPlay1[i];
            this.arrayPlay1[i].startJumptime = time1.getTime();
            character.status++;
            character.armature.play("jump", 1);
            egret.Tween.get(character).to({ y: character.y - 200 }, jumpTime).call(this.onJucde.bind(this, character));
        }
        App.TimerManager.doTimer(jumpTime, 1, () => {
            this.onAddNewSelf();
            this.selfJumpFlag = false;
            this.btn_jump.touchEnabled = true;
            this.containerheight.touchEnabled = true;
        }, this);

        //发送服务器消息
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "jump"
            }
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    }

    private enemyJumpSuccess(): void {
        var str = "jump_success_mp3"
        App.SoundManager.playEffect(str);
        this.numScore2++;
        this.numScore2 = Math.min(this.numScore2, GameLeonardFroG.MAX_SCORE);
        this.roleAvatar2.armature.play("dong", 1);
        var special: number = GameLeonardFroG.MAX_SCORE + 1;
        var _x = Math.floor((special - this.numScore2 - 1) / special * this.img_blue.width)
        egret.Tween.get(this.img_blue.mask).to({ x: _x }, 500);
    }

    private selfJumpSuccess(): void {
        var str = "jump_success_mp3"
        App.SoundManager.playEffect(str);
        this.numScore1++;
        this.numScore1 = Math.min(this.numScore1, GameLeonardFroG.MAX_SCORE);
        this.roleAvatar1.armature.play("dong", 1);
        var special: number = GameLeonardFroG.MAX_SCORE + 1;
        var _x = Math.floor((this.numScore1 + 1) / special * this.img_red.width - this.img_red.width)
        egret.Tween.get(this.img_red.mask).to({ x: _x }, 500);
        if (!DataCenter.instance.room.IsAI) {
            var data = {
                key: "setScore"
            }
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    }

    private onJucde(character: FrogCharacter) {
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
        var hitRect: MoveRect;
        if (character.status == 1) {
            hitRect = this.containerGame.tip1.hitTest(this.tmpPoint.x)
        }
        else if (character.status == 2) {
            hitRect = this.containerGame.tip2.hitTest(this.tmpPoint.x)
        }
        else if (character.status == 3) {
            hitRect = this.containerGame.tip3.hitTest(this.tmpPoint.x)
        }
        else if (character.status == 4) {
            hitRect = this.containerGame.tip4.hitTest(this.tmpPoint.x)
        }

        if (!hitRect) {
            //落水
            this.intoWater(character);
        } else {
            //落在方块上
            this.onLand(character, hitRect);
        }
    }

    public dispose(): void {
        super.dispose();
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
            var character: FrogCharacter = this.arrayPlay1.pop();
            this.recoveryCharacter(character);
        }

        while (this.arrayPlay2.length) {
            var character: FrogCharacter = this.arrayPlay2.pop();
            this.recoveryCharacter(character);
        }

        ObjectPool.clearClass("FrogCharacterSelf", "dispose");
        ObjectPool.clearClass("FrogCharacterEnemy", "dispose");
    }

    private armaturePlayEnd(evt: dragonBones.AnimationEvent): void {
        var armature: DBArmature = <DBArmature>evt.currentTarget.parent;
        var character: FrogCharacter = <FrogCharacter>armature.parent;
        if (armature.currAction == "fallintowater") {
            this.recoveryCharacter(character);

            //自己在家被顶死，产生一个新的
            if (!character.isEnemy && character.status == 0) {
                this.onAddNewSelf();
            }
        }
    }

    //回收Character
    private recoveryCharacter(character: FrogCharacter): void {
        character.armature.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.armaturePlayEnd, this);
        App.DisplayUtils.removeFromParent(character);
        ObjectPool.push(character);
    }

    //添加自己
    private onAddNewSelf() {
        //防止因为冲撞同步原因，会产生多个的问题
        var len: number = this.arrayPlay1.length;
        if (len && this.arrayPlay1[len - 1].status == 0) {
            return;
        }
        var flog: FrogCharacter = ObjectPool.pop(FrogCharacter, "FrogCharacterSelf");
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
            }
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, JSON.stringify(data));
        }
    }

    //添加敌人
    private onAddNewEnemy(id: number, initX: number) {
        var flog: FrogCharacter = ObjectPool.pop(FrogCharacter, "FrogCharacterEnemy");
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
    }

    // 创建动画资源加载到舞台
    private addAllLotusDb(): void {
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
    }

    private addAllRainbow(): void {
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
    }

    // 粒子效果
    private onParticleEffect(_X: number, _Y: number, str: string): void {
        var texture = RES.getRes(str + "_png");
        var config = RES.getRes(str + "_json");
        var particleXueHua = new particle.GravityParticleSystem(texture, config);
        particleXueHua.y = _Y;
        particleXueHua.x = _X;
        this.containerEffect.addChild(particleXueHua);
        particleXueHua.start(500);
    }
}