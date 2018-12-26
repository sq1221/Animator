/**
 * 翻翻乐
 * by dingyafeng
 */
class GameTwiceJoyMainView extends StateEui {

    public static GAME_WIDTH: number = 640;
    public static GAME_HEIGHT: number = 1136;

    //----------eui---------
    public containerGroup: eui.Group;// 容器group

    public goBackBtn: eui.Button;// 返回

    public redProgress: eui.Image;// 红方进度条
    public playerAvatarGroup1: eui.Group;// 红方头像背景group
    public player1Avatar: eui.Group;// 红方头像group
    public player1SexImg: eui.Image;// 红方性别
    public player1NameLab: eui.Label;// 红方名字

    public blueProgress: eui.Image;// 蓝方进度条
    public playerAvatarGroup2: eui.Group;// 蓝方头像背景group
    public player2Avatar: eui.Group;// 蓝方头像group
    public player2SexImg: eui.Image;// 蓝方性别
    public player2NameLab: eui.Label;// 蓝方名字

    public cardsGroup: eui.Group;// 地图数据
    public cardEffectGroup: eui.Group;// 卡片效果group

    public btn_express1: eui.Button;// 表情1
    public btn_express2: eui.Button;// 表情2
    public btn_express3: eui.Button;// 表情3
    public btn_express4: eui.Button;// 表情4
    public btn_express5: eui.Button;// 表情5
    public btn_express6: eui.Button;// 表情6

    //-----------变量---------
    public static avatarMoveDistance: number = 206;// 头像移动距离
    private gameStartBool: boolean = false;// 游戏开始
    private clearTimeoutReadyId: number;// 延时0.8秒开始

    private myHeadImage: RoleHeadImage;// 我的img头像
    private otherHeadImage: RoleHeadImage;// 我的img头像

    private particleStars1: particle.GravityParticleSystem;// 星星
    private particleStars2: particle.GravityParticleSystem;// 星星

    public gameTwiceJoyModel: GameTwiceJoyModel;// 玩家游戏数据

    private cardsItemArr: any[] = [];// 存放所有的卡片对象
    private selectCardArr: any[] = [];// 记录点击的的卡片

    //------------Ai机器人----------
    public gameRobotAi: GameTwiceJoyAI;
    public static aiConf: any = {};

    //------------音效--------------
    public twiceJoyEffect: SoundEffects;
    public twiceJoyCommonEffect: SoundEffects;

    public constructor() {
        super(GameTwiceJoyMainSkin);
        // 记录游戏数据
        this.gameTwiceJoyModel = new GameTwiceJoyModel();
    }

    public init(): void {
        super.init();

        // 适配
        var a = App.GameWidth / GameTwiceJoyMainView.GAME_WIDTH;
        var b = App.GameHeight / GameTwiceJoyMainView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.containerGroup.scaleX = this.containerGroup.scaleY = c;
        this.containerGroup.x = (App.GameWidth - GameTwiceJoyMainView.GAME_WIDTH * c) * 0.5;
        this.containerGroup.y = (App.GameHeight - GameTwiceJoyMainView.GAME_HEIGHT * c) * 0.5;

        // 播放背景音乐
        App.SoundManager.stopBg();
        // 音效
        this.twiceJoyEffect = new SoundEffects();
        this.twiceJoyEffect.setVolume(1);
        this.twiceJoyCommonEffect = new SoundEffects();
        this.twiceJoyCommonEffect.setVolume(1);

        // 音乐切换后台监听
        egret.lifecycle.onPause = () => {
            if (this.twiceJoyEffect) {
                this.twiceJoyEffect.setVolume(0);
                // 背景音乐
                App.SoundManager.setBgOn(false);
                App.SoundManager.setEffectOn(false);
            }
            if (this.twiceJoyCommonEffect) {
                this.twiceJoyCommonEffect.setVolume(0);
            }
        }

        egret.lifecycle.onResume = () => {
            if (this.twiceJoyEffect) {
                this.twiceJoyEffect.setVolume(1);
                // 背景音乐
                App.SoundManager.setBgOn(true);
                App.SoundManager.setEffectOn(true);
            }
            if (this.twiceJoyCommonEffect) {
                this.twiceJoyCommonEffect.setVolume(1);
            }
        }

        // 获取随机种子函数
        GameTwiceJoyModel.random = new Math["seedrandom"](DataCenter.instance.room.id.toString());
        // 初始化地图
        this.gameTwiceJoyModel.mapInit();

        // 星星1
        let particleStarsTexture = RES.getRes("twice_stars_png");
        let particleStarsConfig = RES.getRes("twice_stars_json");
        this.particleStars1 = new particle.GravityParticleSystem(particleStarsTexture, particleStarsConfig);
        this.particleStars2 = new particle.GravityParticleSystem(particleStarsTexture, particleStarsConfig);
        this.cardEffectGroup.addChild(this.particleStars1);
        this.cardEffectGroup.addChild(this.particleStars2);

        // 加载地图数据
        for (var i: number = 1; i < 7; i++) {
            for (var j: number = 1; j < 5; j++) {
                // 当前索引
                var indexNum = (i - 1) * 4 + j;
                // 游戏Item
                let gameCardItem = new GameTwiceJoyCard();
                gameCardItem.anchorOffsetX = gameCardItem.anchorOffsetY = 67.5;
                gameCardItem.x = (j - 1) * 141 + 70.5;
                gameCardItem.y = (i - 1) * 141 + 70.5;
                gameCardItem.cardType = this.gameTwiceJoyModel.twiceMapData[indexNum - 1];
                gameCardItem.iconSource = "twiceIcon" + this.gameTwiceJoyModel.twiceMapData[indexNum - 1] + "_png";
                gameCardItem.cardPosId = indexNum;

                // 注册点击事件
                gameCardItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameCardItemClickHandle, this);

                // 放入数组管理(当前位置，数据)
                this.cardsItemArr.push({ cardType: gameCardItem.cardType, cardPosId: gameCardItem.cardPosId, cardItemData: gameCardItem });
                // 添加至 group
                this.cardsGroup.addChild(gameCardItem);
            }
        }

        // 返回按钮
        this.goBackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBackBtnHandler, this);
        // 小米平台去掉退出按钮
        if (App.IsXiaoMi || App.IsWanba) {
            // 无返回键
            this.goBackBtn.visible = false;
            this.goBackBtn.touchEnabled = false;
        }

        // 表情按钮
        for (var i = 1; i <= 6; ++i) {
            this["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendExpressMessage, this);
        }

        // 加载自己圆头像
        if (this.myHeadImage) {
            this.myHeadImage.dispose();
            this.myHeadImage = null;
        }
        this.myHeadImage = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 60, 60);
        // 加载对方圆头像
        if (this.otherHeadImage) {
            this.otherHeadImage.dispose();
            this.otherHeadImage = null;
        }
        this.otherHeadImage = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 60, 60);
    }

    public show(): void {
        super.show();
        // 游戏未开始
        this.gameStartBool = false;

        // 加载头像开始游戏
        this.playerAvatarAdd();

        // 开启电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 电脑人模式
            this.gameRobotAi = new GameTwiceJoyAI(this);
            // Ai等级
            GameTwiceJoyAI.robotAiLv = App.CurrGameAiLevel;
        }
    }

    // 设置头像，并开启游戏
    private playerAvatarAdd() {
        // 名称，性别
        let user = DataCenter.instance.user;
        this.player1NameLab.text = user.name;
        this.player1SexImg.source = GameCenterGetSexIcon.getSexIconSource(user.sex);
        let player = DataCenter.instance.room.player;
        this.player2NameLab.text = player.name;
        this.player2SexImg.source = GameCenterGetSexIcon.getSexIconSource(player.sex);
        // 加载头像,按钮位置设置
        this.player1Avatar.addChild(this.myHeadImage);
        this.myHeadImage.x = 0;
        this.myHeadImage.y = 0;
        this.player2Avatar.addChild(this.otherHeadImage);
        this.otherHeadImage.x = 0;
        this.otherHeadImage.y = 0;
        this.playerAvatarGroup1.left = this.playerAvatarGroup2.right = 0;
        // 机器人模式下获取服务器ai配置
        if (DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, (data: any) => {
                GameTwiceJoyMainView.aiConf = data;
                console.log(`IsXiaoMi${App.CurrGameAiLevel}   ${JSON.stringify(GameTwiceJoyMainView.aiConf)}`);
                // 游戏开始
                this.gameStart();
            });
        } else {
            // 游戏开始
            this.gameStart();
        }
    }

    // 播放开始游戏ready go
    private gameStart(): void {
        // 播放开始ready go
        function readyGoFun() {
            this.readyIMG = new GameReady(() => {
                // 播放背景音乐
                App.SoundManager.playBg("twiceJoy_bg_mp3");
                // 游戏开始
                this.gameStartBool = true;
                // Ai机器人
                if (DataCenter.instance.room.IsAI) {
                    // 开启机器人
                    if (this.gameRobotAi) {
                        this.gameRobotAi.robotAiStart();
                    }
                }
            });
            this.readyIMG.x = 300;
            this.readyIMG.y = App.GameHeight / 2;
            this.addChild(this.readyIMG);
            this.readyIMG.play();
        }
        // 延时播放
        this.clearTimeoutReadyId = egret.setTimeout(readyGoFun, this, 800);
    }

    // 注册服务器返回消息
    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
        // 接受消除成功消息
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        // 点击游戏离开
        App.MessageCenter.addListener(EventMessage.GameLeave, this.onGameleave, this);
    }
    private onGameEvent(data: any): void {
        var arrEventData = data.event.split("|");
        switch (arrEventData[0]) {
            case GameTwiceJoyModel.CARD_MATCH_SUCCESS:
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 更新自己分数
                    this.gameTwiceJoyModel.myScore++;
                    // 进度条移动
                    this.playerAvatarGroup1.left = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    this.redProgress.width = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    // 先到达分数者胜出
                    this.arriveScore();
                } else {
                    // 更新对方分数
                    this.gameTwiceJoyModel.otherScore++;
                    // 进度条移动
                    this.playerAvatarGroup2.right = this.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    this.blueProgress.width = this.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    // 先到达分数者胜出
                    this.arriveScore();
                }
                break;
            case GameTwiceJoyModel.SEND_EXPRESS:
                this.addQiPaoCartoon(arrEventData[1], 2);
                break;
        }
    }

    // 时间内先达到分数者获胜
    public arriveScore(): void {
        if (this.gameTwiceJoyModel.myScore >= GameTwiceJoyModel.resultScore) {
            //自己嬴
            this.sendResult(3);
            return;
        }
        if (this.gameTwiceJoyModel.otherScore >= GameTwiceJoyModel.resultScore) {
            //对方嬴
            this.sendResult(1);
        }
    }

    // 弹出游戏结果画面
    public onGameResult(data: any): void {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", null);
    }

    // 收到游戏离开
    private onGameleave() {
        this.clearData();
    }

    private clearData() {
        // 游戏停止
        this.gameStartBool = false;
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
            }
        }
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
    }

    public dispose(): void {
        super.dispose();
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi = null;
            }
        }
        // 清空地图数据
        this.cardsItemArr.splice(0);
        this.cardsItemArr = [];
        // 清空点击记录的数据
        this.selectCardArr.splice(0);
        this.selectCardArr = [];
        // 游戏停止
        this.gameStartBool = false;
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
        // 清楚地图数据
        this.cardsGroup.removeChildren();
        // 背景音乐
        App.SoundManager.stopBg();
        // 音效
        this.twiceJoyEffect.setVolume(0);
        this.twiceJoyCommonEffect.setVolume(0);
        this.twiceJoyEffect = null;
        this.twiceJoyCommonEffect = null;
    }

    // 点击自己头像
    private playerAvatarGroup1Handler() {
        // 点击
        this.twiceJoyCommonEffect && this.twiceJoyCommonEffect.play("mouseClickSound_mp3");

        // 信息
        let playerData: any;
        // 当前信息
        playerData = DataCenter.instance.user;
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    }
    // 点击对方头像
    private playerAvatarGroup2Handler() {
        // 点击
        this.twiceJoyCommonEffect && this.twiceJoyCommonEffect.play("mouseClickSound_mp3");

        // 信息
        let playerData: any;
        // 当前信息
        playerData = DataCenter.instance.room.player;
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    }

    // 点击卡片
    private gameCardItemClickHandle(event: egret.TouchEvent): void {
        // 游戏未开始的时候禁止点击
        if (!this.gameStartBool) {
            return;
        }

        // 当前卡片数据
        var item = <GameTwiceJoyCard>event.currentTarget;

        // 是否开启中
        if (item.isOpen) {
            return;
        } else {
            // 开启
            item.isOpen = true;
        }

        // 打开音效
        this.twiceJoyEffect && this.twiceJoyEffect.play("twiceJoy_open_mp3");

        // 检测点击后的结果
        this.cardMatchCheck(item, item.x, item.y);
    }

    // 配对
    private cardMatchCheck(currentItem: GameTwiceJoyCard, posX: number, poxY: number): void {

        // 上一对未匹配成功
        if (this.selectCardArr.length == 2) {
            // 再次隐藏 翻转效果
            for (var i: number = 0; i < this.cardsItemArr.length; i++) {
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[0]) {
                    // 关闭
                    this.cardsItemArr[i].cardItemData.isOpen = false;
                    this.cardsItemArr[i].cardItemData.cardClose();
                }
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[1]) {
                    // 关闭
                    this.cardsItemArr[i].cardItemData.isOpen = false;
                    this.cardsItemArr[i].cardItemData.cardClose();
                }
            }

            // 清空数据
            this.selectCardArr.splice(0);
            this.selectCardArr = [];
        }

        // 第一组数据
        if (this.selectCardArr.length == 0) {
            // 放入第一个 并打开
            this.selectCardArr.push(currentItem.cardPosId);
            currentItem.cardOpen();
        } else if (this.selectCardArr.length == 1) {
            // 关闭点击
            this.gameStartBool = false;
            // 放入第二个
            this.selectCardArr.push(currentItem.cardPosId);

            var card1: GameTwiceJoyCard;
            var card2: GameTwiceJoyCard;
            for (var i: number = 0; i < this.cardsItemArr.length; i++) {
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[0]) {
                    card1 = this.cardsItemArr[i].cardItemData;
                }
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[1]) {
                    card2 = this.cardsItemArr[i].cardItemData;
                }
            }

            // 是否可以消除
            if (card1.cardType == card2.cardType) {
                // 成功音效
                this.twiceJoyEffect && this.twiceJoyEffect.play("twiceJoy_matchSuccess_mp3");

                // 播放粒子效果
                this.particleManager(card1.x, card1.y, card2.x, card2.y);

                // 情况记录数组
                this.selectCardArr.splice(0);
                this.selectCardArr = [];

                // 清楚点击事件
                card1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameCardItemClickHandle, this);
                card2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameCardItemClickHandle, this);

                // 消除
                card1.cardMatchSuccess();
                card2.cardMatchSuccess();

                if (!DataCenter.instance.room.IsAI) {
                    // 向服务器发送 消除成功 消息
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameTwiceJoyModel.CARD_MATCH_SUCCESS, 1);
                } else {
                    // 更新自己分数
                    this.gameTwiceJoyModel.myScore++;
                    // 进度条移动
                    this.playerAvatarGroup1.left = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    this.redProgress.width = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    // 先到达分数者胜出
                    this.arriveScore();
                }
            } else {
                // 音效
                this.twiceJoyEffect && this.twiceJoyEffect.play("twiceJoy_matchFailed_mp3");
                // 翻转效果
                currentItem.cardOpen();
            }
            // 开启点击
            this.gameStartBool = true;
        }
    }

    // 添加表情气泡
    private addQiPaoCartoon(data, type: number = 1) {
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(100, 110);
        this.addChild(qiPao);

        if (type == 2) {
            qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 145, App.GameWidth - 125);
            qiPao.setSouce(data, true, 1);
        }
        else {
            qiPao.setSouce(data, false, 1);

            qiPao.x = App.RandomUtils.limitInteger(125, 145);

            if (!DataCenter.instance.room.IsAI) {
                var str = GameTwiceJoyModel.SEND_EXPRESS + "|" + data;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            else {
                var num: number = App.RandomUtils.limitInteger(1, 5);
                if (num % 2 != 0) {
                    App.TimerManager.doTimer(1000 * num, 1, this.AddAIexpress, this);
                }
            }
        }
        if (type == 1) {
            qiPao.img_1.scaleX = -1;
            qiPao.onPlay(1);
        }
        else {
            qiPao.onPlay(2);
        }
    }
    // 添加Ai的表情
    private AddAIexpress() {
        var num: number = App.RandomUtils.limitInteger(1, 6);

        var str: string = "Express_five" + num + "_png";

        this.addQiPaoCartoon(str, 2);
    }
    // 点击表情
    public onSendExpressMessage(e: egret.TouchEvent) {
        var time1 = egret.getTimer();

        if (time1 - DataCenter.instance.SendExpressTime > 500) {
            DataCenter.instance.SendExpressTime = time1;
            var str: string = "Express_five" + e.target.name + "_png"
            this.addQiPaoCartoon(str, 1);
        }
    }

    // 请求游戏返回
    private goBackBtnHandler(): void {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    }

    // 发送游戏结果
    private sendResult(result: number): void {
        // 被扔雪球，被嘲笑，被发现，当前santa动画播放状态
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 清楚数据
        this.clearData();
        // 发送结果
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    // 点击效果
    public particleManager = (posX1: number, poxY1: number, posX2: number, poxY2: number, particleType: string = "", time: number = 0.2) => {
        this.particleStars1.emitterX = posX1;
        this.particleStars1.emitterY = poxY1;
        this.particleStars1.start(100);
        this.particleStars2.emitterX = posX2;
        this.particleStars2.emitterY = poxY2;
        this.particleStars2.start(100);
    }
}