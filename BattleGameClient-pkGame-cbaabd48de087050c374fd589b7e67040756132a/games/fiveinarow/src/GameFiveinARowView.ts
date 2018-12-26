class GameFiveinARowView extends State {
    private container: egret.DisplayObjectContainer;//总容器

    private GameContainer: egret.DisplayObjectContainer;//游戏层
    private bg: egret.Bitmap;
    private bg_chess: egret.Bitmap;//棋盘背景
    private img_Chess: egret.Bitmap;
    public static GAME_WIDTH: number = 640;
    public static GAME_HEIGHT: number = 1136;
    public static LINE_DISTANCE: number = 42; // 14*42 = 588   15*42 = 630
    public static volume_global: SoundEffects;
    //起始的x
    public num_beginX: number = 0;
    //起始的y
    public num_beginY: number = 329;

    //隐形的矩形
    public num_YIN_X: number = 0;
    public num_YIM_Y: number = 0;
    public num_YIN_W: number = 0;
    public num_YIM_H: number = 0;
    //收集棋盘上的点
    public Obj_Pot: any = {};
    //收集棋盘上的棋子
    public Obj_Chess: any = {};
    //自己控制子的顔色
    public SELF_TYPE: number = 1;// 1黑子 2白子
    //自己控制子的顔色
    public ENENY_TYPE: number = 2;// 1黑子 2白子
    //隱形的棋子
    private ShadowChess: ChessmanShadow = null;
    //横向
    private numSelfSuccess_1 = 0;
    //纵向
    private numSelfSuccess_2 = 0;
    //斜向
    private numSelfSuccess_3 = 0;
    //反斜向
    private numSelfSuccess_4 = 0;
    //人工智能 AI
    private AIObj: AIChessFive;
    //Eui的背景
    private BaseComment: GameFiveExpressView;//游戏基础背景
    //是否是自己的回合
    private isSelfRound: boolean = false;
    //是否是点击有效区
    private isEffectLoction: boolean = false;
    //
    private num_time: number = 45; //45s倒计时
    private num_sum: number = 1;//求和；（发送求和的限制，每回合一次）
    private str_whoRound: string = "";
    private isGameOver: boolean = false;
    private selfIsWin: boolean = false;//自己是否赢了
    private numChess: number = 0;//棋子总数
    public static AILEVEL: number = 0; //取价值点

    private chessboardArr: Array<any> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]





    public constructor() {
        super();
        //声音管理
        GameFiveinARowView.volume_global = new SoundEffects();
        //设置音量
        GameFiveinARowView.volume_global.setVolume(1);


        egret.lifecycle.onPause = () => {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GameFiveinARowView.volume_global) {
                GameFiveinARowView.volume_global.setVolume(0);
            }

        }

        egret.lifecycle.onResume = () => {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GameFiveinARowView.volume_global) {
                GameFiveinARowView.volume_global.setVolume(1);
            }
        }
    }

    public init(): void {
        super.init();

        this.ArrMessage = RES.getRes("FiveinARowMessage_json")["ArrMessage"];
        //添加背景
        this.container = new egret.DisplayObjectContainer();
        this.addChild(this.container);
        //適配
        var a = App.GameWidth / GameFiveinARowView.GAME_WIDTH;
        var b = App.GameHeight / GameFiveinARowView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.container.scaleX = this.container.scaleY = c;
        this.container.x = (App.GameWidth - GameFiveinARowView.GAME_WIDTH * c) * 0.5;
        this.container.y = (App.GameHeight - GameFiveinARowView.GAME_HEIGHT * c) * 0.5;

        //添加游戏层
        this.GameContainer = new egret.DisplayObjectContainer();
        this.GameContainer.width = this.container.width;
        this.GameContainer.height = this.container.height;
        this.container.addChild(this.GameContainer);

        this.BaseComment = new GameFiveExpressView();
        this.addChild(this.BaseComment);
        this.BaseComment.width = App.GameWidth;
        this.BaseComment.height = App.GameHeight;
        //適配游戏区
        if (App.GameHeight < GameFiveinARowView.GAME_HEIGHT) {
            this.BaseComment.gp_game.scaleX = App.GameHeight / GameFiveinARowView.GAME_HEIGHT;
            this.BaseComment.gp_game.scaleY = App.GameHeight / GameFiveinARowView.GAME_HEIGHT
        }

        let user = DataCenter.instance.user;
        this.BaseComment.lb_name1.text = user.name;
        this.BaseComment.img_sex1.source = GameCenterGetSexIcon.getSexIconSource(user.sex)
        var playerHead1 = new RoleHeadImage(user.imgUrl);
        //playerHead1.width =  playerHead1.height = 82;
        // playerHead1.anchorOffsetX = playerHead1.width / 2;
        // playerHead1.anchorOffsetY = playerHead1.height / 2;
        playerHead1.scaleX = playerHead1.scaleY = 0.85;
        this.BaseComment.playerAvatarGroup1.addChild(playerHead1);

        //playerHead1.ma = playerHead1.scaleX = 3;


        let enumy = DataCenter.instance.room.player;
        this.BaseComment.lb_name2.text = enumy.name;
        this.BaseComment.img_sex2.source = GameCenterGetSexIcon.getSexIconSource(enumy.sex)
        var playerHead2 = new RoleHeadImage(enumy.imgUrl);
        // playerHead2.anchorOffsetX = playerHead2.width / 2;
        // playerHead2.anchorOffsetY = playerHead2.height / 2;
        playerHead2.scaleX = playerHead2.scaleY = 0.85;
        this.BaseComment.playerAvatarGroup2.addChild(playerHead2);
        // playerHead2.width =  playerHead2.height = 82;

        // playerHead2.scaleX = playerHead2.scaleX = 3;

        this.onDraw();

        for (var i = 1; i <= 6; ++i) {
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendMessage, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onExpressBegin, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onExpressCancel, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onExpressCancel, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_END, this.onExpressCancel, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onExpressBegin, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onExpressCancel, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onExpressCancel, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_END, this.onExpressCancel, this);
        }



        // this.BaseComment.touchEnabled = true;
        // this.BaseComment.touchChildren = true;
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onbegin, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);

        this.BaseComment.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBackBtnHandler, this);
        // 小米平台去掉退出按钮
        if (App.IsXiaoMi || App.IsWanba) {
            this.BaseComment.btn_return.visible = false;
            this.BaseComment.btn_return.touchEnabled = false;
        }
        this.BaseComment.btn_sum.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSum, this);
        this.BaseComment.btn_lose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLose, this);

        this.BaseComment.btn_sumYes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgreeSum, this);
        this.BaseComment.btn_sumNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefuseSum, this);
        this.BaseComment.btn_loseYes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgreeLose, this);


        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
        this.AIObj = new AIChessFive();
    }
    pauseCallback = () => {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
        this.next("gameChangeMatch");
    }
    // 弹出游戏结果画面
    private onGameResult(data: any): void {
        this.stop();

        DataCenter.instance.room.gameResult = data;
        this.popup("GameResult");
    }

    private stop(): void {

    }
    //画棋盘  1.收集棋盘上的点 2.放置隐形的容器接收移动事件
    private onDraw() {
        this.num_beginX = Math.floor((App.GameWidth - 588) / 2);

        // this.img_Chess.x = this.num_beginX - 1;
        // this.img_Chess.y = this.num_beginY - 1;

        this.num_YIN_X = this.num_beginX - GameFiveinARowView.LINE_DISTANCE / 2;
        this.num_YIM_Y = this.num_beginY + GameFiveinARowView.LINE_DISTANCE * 2;

        this.num_YIN_W = this.num_YIN_X + 630;
        this.num_YIM_H = this.num_YIM_Y + 630;


        //纵向
        // for (var i = 0; i < 15; ++i) {
        //     var shp: egret.Shape = new egret.Shape();

        //     var num: number = 2;
        //     if (i == 0 || i == 14) {
        //         num = 3;
        //     }
        //     shp.graphics.beginFill(0xff0000, 1);

        //     shp.graphics.drawRect(0, 0, 588, num);

        //     shp.x = this.num_beginX;
        //     shp.y = i * GameFiveinARowView.LINE_DISTANCE + this.num_beginY;


        //     shp.graphics.endFill();
        //     this.BaseComment.addChild(shp);
        // }
        // //横向
        // for (var j = 0; j < 15; ++j) {
        //     var shp: egret.Shape = new egret.Shape();
        //     var num: number = 2;
        //     if (j == 0 || j == 14) {
        //         num = 3;
        //     }
        //     shp.graphics.beginFill(0xff0000, 1);
        //     shp.graphics.drawRect(0, 0, num, 588);
        //     shp.graphics.endFill();
        //     this.BaseComment.addChild(shp);

        //     shp.y = this.num_beginY;
        //     shp.x = j * GameFiveinARowView.LINE_DISTANCE + this.num_beginX;
        // }
        //收集点
        this.onCollectPot();
    }
    //开始
    private onbegin(e: egret.TouchEvent) {
        //console.log("表情：", this.isExpress);
        if (!this.isSelfRound || this.isGameOver || this.isExpress) {
            return;
        }

        if (this.BaseComment.gp_sum.visible == true || this.BaseComment.gp_lose.visible == true) {
            return;
        }

        //如果在有效区域内
        if (this.onJudceEffect(e.stageX, e.stageY)) {
            this.isEffectLoction = true;
            var initX: number = Math.floor((e.stageX - this.num_YIN_X) / GameFiveinARowView.LINE_DISTANCE);
            var initY: number = Math.floor((e.stageY - this.num_YIM_Y) / GameFiveinARowView.LINE_DISTANCE);
            if (initX > 14) {
                initX = 14;
            }

            if (initY > 14) {
                initY = 14;
            }
            this.ShadowChess.x = this.Obj_Pot["" + initX + "_" + initY][0];
            this.ShadowChess.y = this.Obj_Pot["" + initX + "_" + initY][1];
            this.ShadowChess.INIT_X = initX;
            this.ShadowChess.INIT_Y = initY;
            this.ShadowChess.visible = true;
        }
    }
    //移动
    private onMove(e: egret.TouchEvent) {
        if (!this.isEffectLoction || !this.isSelfRound || this.isGameOver || this.isExpress) {
            return;
        }

        if (this.onJudceEffect(e.stageX, e.stageY)) {
            //取整来进行棋子跳动
            var initX: number = Math.floor((e.stageX - this.num_YIN_X) / GameFiveinARowView.LINE_DISTANCE);
            var initY: number = Math.floor((e.stageY - this.num_YIM_Y) / GameFiveinARowView.LINE_DISTANCE);
            if (initX > 14) {
                initX = 14;
            }
            if (initY > 14) {
                initY = 14;
            }
            this.ShadowChess.x = this.Obj_Pot["" + initX + "_" + initY][0];
            this.ShadowChess.y = this.Obj_Pot["" + initX + "_" + initY][1];
            this.ShadowChess.INIT_X = initX;
            this.ShadowChess.INIT_Y = initY;
            this.ShadowChess.visible = true;
            //console.log("移动的坐标：", initX, initY)
        }
        else {
            this.ShadowChess.visible = false;
        }
    }
    //结束
    private onEnd(e: egret.TouchEvent) {
        //console.log("结束的坐标：", e.stageX, e.stageY);
        if (!this.isEffectLoction || !this.isSelfRound || this.isGameOver || this.isExpress) {
            return;
        }
        //若果影子存在
        if (this.ShadowChess.visible) {
            this.ShadowChess.visible = false;
            if (this.chessboardArr[this.ShadowChess.INIT_X][this.ShadowChess.INIT_Y] == 0) {
                var myChess = new ChessmanFive(this.SELF_TYPE);
                myChess.x = this.Obj_Pot["" + this.ShadowChess.INIT_X + "_" + this.ShadowChess.INIT_Y][0];
                myChess.y = this.Obj_Pot["" + this.ShadowChess.INIT_X + "_" + this.ShadowChess.INIT_Y][1];
                this.BaseComment.img_red.visible = true;
                this.BaseComment.img_red.x = myChess.x;
                this.BaseComment.img_red.y = myChess.y;
                this.BaseComment.gp_chess.addChild(myChess);
                // var str = "down_chess_mp3"
                // App.SoundManager.playEffect(str);
                GameFiveinARowView.volume_global.play("down_chess_mp3", true);
                this.Obj_Chess["" + this.ShadowChess.INIT_X + "_" + this.ShadowChess.INIT_Y] = myChess;
                this.onChessNumber();
                //估值追踪系统

                // if (this.AIObj.Decision_X != -1) {
                //     this.AIObj.InitValueX = this.AIObj.Decision_X;
                //     this.AIObj.InitValueY = this.AIObj.Decision_Y;
                // }
                // else {
                this.AIObj.InitValueX = this.ShadowChess.INIT_X;
                this.AIObj.InitValueY = this.ShadowChess.INIT_Y;
                //}



                this.chessboardArr[this.ShadowChess.INIT_X][this.ShadowChess.INIT_Y] = this.SELF_TYPE;
                //console.log("添加棋子成功");
                this.isSelfRound = false;
                this.onStatusChange();
                this.onJudceSuccess(this.ShadowChess.INIT_X, this.ShadowChess.INIT_Y);

            }
        }
    }
    //坐标点是否有效
    private onJudceEffect(num_x: number, num_y: number): boolean {
        var numX: number = num_x;
        var numY: number = num_y;
        if (numX >= this.num_YIN_X && numX <= this.num_YIN_W) {
            //-30防止与下排按钮冲突
            if (numY >= this.num_YIM_Y && numY <= this.num_YIM_H - 30) {
                return true;
            }
        }
        return false;

    }
    //判断是否五子连珠
    private onJudceSuccess(num_x: number, num_y: number) {
        //横向
        this.numSelfSuccess_1 = 1;
        //纵向
        this.numSelfSuccess_2 = 1;
        //斜向
        this.numSelfSuccess_3 = 1;
        //反斜向
        this.numSelfSuccess_4 = 1;

        this.onJudce(num_x, num_y)

        var type: number = 0;

        if (this.numSelfSuccess_1 >= 5) {
            type = 1;
            //console.log("!!!!!!!!!横向5子");
        }

        if (this.numSelfSuccess_2 >= 5) {
            type = 2;
            //console.log("纵向5子~~~~~~~~~~~~~~~~~`");
        }

        if (this.numSelfSuccess_3 >= 5) {
            type = 3;
            //console.log("斜向5子~~~~~~~~~~~~~~~~~`");
        }

        if (this.numSelfSuccess_4 >= 5) {
            type = 4;
            //console.log("反斜向5子~`");
        }

        //通知对方自己的操作，如果自己赢了通知赢了
        if (!DataCenter.instance.room.IsAI) {
            var str = "sendOperation|" + num_x + "|" + num_y + "|" + type
            //ProxySocket.sendGameEvent(App.CurrRoomId, str);
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
        }
        else {
            if (type == 0 && !this.isGameOver) {
                this.AIObj.ChessArr = this.chessboardArr;
                this.AIObj.onJudce();

                App.TimerManager.doTimer(3000, 1, () => {
                    this.onAddEnemy(this.AIObj.Decision_X, this.AIObj.Decision_Y, this.AIObj.AIWin);

                }, this)
            }
        }
        // //测试AI的代码
        // if (DataCenter.instance.room.selfIsMaster) {
        //     this.AIObj.ChessArr = this.chessboardArr;
        //     this.AIObj.onJudce();
        // }


        // //暂时注释
        // this.BaseComment.touchEnabled = false;
        // this.BaseComment.touchChildren = false;
        //自己赢了 
        if (type > 0) {
            //自己赢了
            this.selfIsWin = true;
            this.onFiveSuccessCartoon(num_x, num_y, type)
            App.TimerManager.doTimer(4500, 1, () => {
                this.gameOver(3);

            }, this)
        }
        //AI赢了
        else if (this.AIObj.AIWin > 0) {
            App.TimerManager.doTimer(7500, 1, () => {
                this.gameOver(1);

            }, this)
        }

    }
    public gameOver(result: number): void {

        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    //4向判定
    private onJudce(INIT_X: number, INIT_Y: number) {

        //左面
        for (var i = 1; i < 5; i++) {
            var num1: number = INIT_X - i;
            if (num1 < 0) {
                break;
            }
            if (this.chessboardArr[num1][INIT_Y] == this.SELF_TYPE) {

                this.numSelfSuccess_1++;
            }
            else {
                break;
            }
        }
        //右面
        for (var i = 1; i < 5; i++) {
            var num2: number = INIT_X + i;
            if (num2 > 14) {
                break;
            }
            if (this.chessboardArr[num2][INIT_Y] == this.SELF_TYPE) {

                this.numSelfSuccess_1++;
            }
            else {
                break;
            }
        }

        //上面
        for (var i = 1; i < 5; i++) {
            var num3: number = INIT_Y - i;
            if (num3 < 0) {
                break;
            }
            if (this.chessboardArr[INIT_X][num3] == this.SELF_TYPE) {

                this.numSelfSuccess_2++;
            }
            else {
                break;
            }
        }
        //下面
        for (var i = 1; i < 5; i++) {
            var num4: number = INIT_Y + i;
            if (num4 > 14) {
                break;
            }
            if (this.chessboardArr[INIT_X][num4] == this.SELF_TYPE) {

                this.numSelfSuccess_2++;
            }
            else {
                break;
            }
        }
        //斜向
        for (var i = 1; i < 5; i++) {
            var num5: number = INIT_X - i;
            var num6: number = INIT_Y - i;

            if (num5 < 0 || num6 < 0) {
                break;
            }
            if (this.chessboardArr[num5][num6] == this.SELF_TYPE) {
                this.numSelfSuccess_3++;
            }
            else {
                break;
            }
        }

        for (var i = 1; i < 5; i++) {
            var num7: number = INIT_X + i;
            var num8: number = INIT_Y + i;

            if (num7 > 14 || num8 > 14) {
                break;
            }
            if (this.chessboardArr[num7][num8] == this.SELF_TYPE) {
                this.numSelfSuccess_3++;
            }
            else {
                break;
            }
        }
        //反斜向
        for (var i = 1; i < 5; i++) {
            var num9: number = INIT_X - i;
            var num10: number = INIT_Y + i;

            if (num9 < 0 || num10 > 14) {
                break;
            }
            if (this.chessboardArr[num9][num10] == this.SELF_TYPE) {
                this.numSelfSuccess_4++;
            }
            else {
                break;
            }
        }

        for (var i = 1; i < 5; i++) {
            var num11: number = INIT_X + i;
            var num12: number = INIT_Y - i;

            if (num11 > 14 || num12 < 0) {
                break;
            }
            if (this.chessboardArr[num11][num12] == this.SELF_TYPE) {
                this.numSelfSuccess_4++;
            }
            else {
                break;
            }
        }
    }

    public onCollectPot() {
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                var data = [0, 0];
                data[0] = i * 42 + 26;
                data[1] = j * 42 + this.num_beginY;
                this.Obj_Pot["" + i + "_" + j] = data;
            }
        }
    }

    public show() {
        super.show();
        if (DataCenter.instance.room.selfIsMaster) {
            // this.BaseComment.touchEnabled = true;
            // this.BaseComment.touchChildren = true;
            this.SELF_TYPE = 1;
            this.ENENY_TYPE = 2;
            this.onTipsShow(0);//你是先手
            this.isSelfRound = true;
        }
        else {
            // this.BaseComment.touchEnabled = false;
            // this.BaseComment.touchChildren = false;
            this.SELF_TYPE = 2;
            this.ENENY_TYPE = 1;
            this.onTipsShow(1);//对方先手
            this.isSelfRound = false;
        }
        //旗盒
        this.BaseComment.img_Chesstype1.source = "img_he" + this.SELF_TYPE + "_png";
        this.BaseComment.img_Chesstype2.source = "img_he" + this.ENENY_TYPE + "_png";
        //头部初始状态
        this.onStatusChange();


        //实例化隐形棋
        this.ShadowChess = new ChessmanShadow(this.SELF_TYPE);
        this.ShadowChess.visible = false;
        this.BaseComment.gp_red.addChild(this.ShadowChess);
        //停掉背景音效
        App.SoundManager.stopBg();
        App.SoundManager.playBg("bg_fiveMusic_mp3");
    }
    //网络事件
    private onGameEvent(data: any) {
        let parseData = (data: string): string[] => {
            let splitChar = data.split("|");
            return splitChar;
        }
        let datas = parseData(data.event);
        switch (datas[0]) {
            case "sendOperation":
                this.onAddEnemy(datas[1], datas[2], datas[3]);
                break;
            case "sendExpress":
                this.addQiPaoCartoon(datas[1], 2);
                break;
            case "giveUp":
                this.isGameOver = true;
                // var str = "five_win_mp3"
                // App.SoundManager.playEffect(str);
                GameFiveinARowView.volume_global.play("five_win_mp3", true);
                this.onTipsShow(3);
                App.TimerManager.doTimer(3000, 1, () => {
                    this.gameOver(3);
                }, this)
                break;

            case "SumShow":
                this.BaseComment.gp_sum.visible = true;
                this.BaseComment.numTimeRefuseSum = 5;
                break;

            case "AGreeSum":
                //和棋--
                this.onTipsShow(6);
                this.isGameOver = true;
                this.onTipsShow(2);
                App.TimerManager.doTimer(3000, 1, () => {
                    this.gameOver(2);
                }, this)
                break;
            case "RefuseSum":
                this.onTipsShow(5);
                break;
            default:
                break;
        }
    }
    //添加敌方棋子
    private onAddEnemy(data1, data2, data3) {
        var myChess = new ChessmanFive(this.ENENY_TYPE);
        myChess.x = this.Obj_Pot["" + data1 + "_" + data2][0];
        myChess.y = this.Obj_Pot["" + data1 + "_" + data2][1];

        this.BaseComment.img_red.visible = true;
        this.BaseComment.img_red.x = myChess.x;
        this.BaseComment.img_red.y = myChess.y;
        this.BaseComment.gp_chess.addChild(myChess);
        // var str = "down_chess_mp3"
        // App.SoundManager.playEffect(str);
        GameFiveinARowView.volume_global.play("down_chess_mp3", true);
        this.Obj_Chess["" + data1 + "_" + data2] = myChess;
        this.onChessNumber();
        this.chessboardArr[data1][data2] = this.ENENY_TYPE;
        if (data3 == 0) {
            // this.BaseComment.touchEnabled = true;
            // this.BaseComment.touchChildren = true;

            this.isSelfRound = true;
            this.onStatusChange();

        } else {
            // this.BaseComment.touchEnabled = false;
            // this.BaseComment.touchChildren = false;
            this.onFiveSuccessCartoon(Number(data1), Number(data2), Number(data3));
        }
    }
    //统计棋子的数量
    private onChessNumber() {
        this.numChess++;

        if (this.numChess >= 225) {
            //和棋--
            this.isGameOver = true;
            this.onTipsShow(2);
            App.TimerManager.doTimer(3000, 1, () => {
                this.gameOver(2);
            }, this)
        }
    }

    // 请求游戏返回
    private goBackBtnHandler(): void {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    }
    //求和
    private onSum() {
        if (this.isGameOver) {
            return;
        }
        if (this.num_sum == 1) {
            this.num_sum--;
            this.onTipsShow(4);
            //发送求和
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "SumShow");
            }
            else {
                App.TimerManager.doTimer(2000, 1, () => {
                    this.onTipsShow(5);
                }, this)
            }
        }

    }
    //认输
    private onLose() {
        if (this.isGameOver) {
            return;
        }
        this.BaseComment.gp_lose.visible = true;
    }
    //同意求和
    private onAgreeSum() {
        //发送同意求和
        this.BaseComment.gp_sum.visible = false;

        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "AGreeSum");

        //和棋--
        this.isGameOver = true;
        this.onTipsShow(2);

        App.TimerManager.doTimer(3000, 1, () => {
            this.gameOver(2);
        }, this)

    }
    //同意认输
    private onAgreeLose() {
        //发送认输
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "giveUp");
        }
        else {
            this.gameOver(1);
        }
        this.isGameOver = true;
        // var str = "five_lose_mp3"
        // App.SoundManager.playEffect(str);
        GameFiveinARowView.volume_global.play("five_lose_mp3", true);
        this.BaseComment.gp_lose.visible = false;
    }
    //拒绝求和
    private onRefuseSum() {
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "RefuseSum");
    }

    //提示五子连珠动画
    private onFiveSuccessCartoon(num_X: number, num_Y: number, type: number) {
        this.isGameOver = true;
        if (this.selfIsWin) {
            // var str = "five_win_mp3"
            // App.SoundManager.playEffect(str);
            GameFiveinARowView.volume_global.play("five_win_mp3", true);
        }
        else {
            // var str = "five_lose_mp3"
            // App.SoundManager.playEffect(str);
            GameFiveinARowView.volume_global.play("five_lose_mp3", true);
        }
        this.BaseComment.gp_lose.visible = false;
        this.BaseComment.gp_sum.visible = false;
        var img: eui.Image;
        var strTemp = "11111" || "22222";
        if (type > 2) {
            img = this.BaseComment.img_aperture_2;
        }
        else {
            img = this.BaseComment.img_aperture_1;
        }

        if (type % 2 == 0) {
            img.rotation = 90;
        }
        var posiition: number;
        var str1: string = "";
        var des_x: number = num_X;
        var des_y: number = num_Y;

        switch (type) {
            case 1:
                //横向
                for (var i = 0; i < 11; ++i) {
                    for (var j = 0; j < 15; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i + k][j];
                        }
                        if (str == "11111" || str == "22222") {
                            //拿到框的中点
                            des_x = i + 2;

                            des_y = j;
                        }
                    }
                }
                break;
            case 2:
                //纵向
                for (var i = 0; i < 15; ++i) {
                    for (var j = 0; j < 11; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i][j + k];
                        }
                        if (str == "11111" || str == "22222") {
                            des_x = i;

                            des_y = j + 2;
                        }
                    }
                }
                break;
            case 3:
                //斜向
                for (var i = 0; i < 11; ++i) {
                    for (var j = 0; j < 11; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i + k][j + k];
                        }
                        if (str == "11111" || str == "22222") {
                            des_x = i + 2;

                            des_y = j + 2;
                        }
                    }
                }
                break;
            case 4:
                //反斜向
                for (var i = 4; i < 15; ++i) {
                    for (var j = 0; j < 11; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i - k][j + k];
                        }
                        if (str == "11111" || str == "22222") {
                            des_x = i - 2;

                            des_y = j + 2;
                        }
                    }
                }
                break;
        }

        img.x = this.Obj_Pot["" + des_x + "_" + des_y][1];
        img.y = this.Obj_Pot["" + des_x + "_" + des_y][0];
        img.visible = true;
        egret.Tween.get(img).to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 1500).call(() => { })
    }
    //局内的消息提示
    private ArrMessage: string[];
    //信息提示
    private onTipsShow(type: number) {
        this.BaseComment.lb_tip.text = "";
        this.BaseComment.gp_tipMessage.alpha = 1;
        this.BaseComment.lb_tip.text = this.ArrMessage[type];
        if (type == 3 || type == 4 || type == 5 || type == 6)
            this.BaseComment.lb_tip.size = 23;
        else
            this.BaseComment.lb_tip.size = 30;
        egret.Tween.get(this.BaseComment.gp_tipMessage).wait(1000).to({ alpha: 0 }, 500).call(() => {
            App.TimerManager.doTimer(1000, 0, this.onTimerUpdate, this);
        })

    }
    //
    private addQiPaoCartoon(data, type: number = 1) {
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(120, 130);
        this.addChild(qiPao);
        if (type == 2) {

            qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 165, App.GameWidth - 145);

            qiPao.setSouce(data, true, 1);
        }
        else {
            qiPao.setSouce(data, false, 1);

            qiPao.x = App.RandomUtils.limitInteger(145, 165);


            if (!DataCenter.instance.room.IsAI) {
                var str = "sendExpress|" + data
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
            // qiPao.img_2.scaleX = -1;
            qiPao.onPlay(2);
        }
    }

    //添加Ai的表情
    private AddAIexpress() {
        var num: number = App.RandomUtils.limitInteger(1, 6);

        var str: string = "Express_five" + num + "_png";

        this.addQiPaoCartoon(str, 2);
    }
    //点击表情
    public onSendMessage(e: egret.TouchEvent) {
        var time1 = egret.getTimer();

        if (time1 - DataCenter.instance.SendExpressTime > 500) {
            DataCenter.instance.SendExpressTime = time1;
            var str: string = "Express_five" + e.target.name + "_png"
            this.addQiPaoCartoon(str, 1);
        }
    }
    private isExpress: boolean = false;
    //开始点击表情
    private onExpressBegin() {
        this.isExpress = true;
    }

    //完成点击表情
    private onExpressCancel() {
        this.isExpress = false;
    }


    public dispose(): void {
        super.dispose();
        App.TimerManager.remove(this.onTimerUpdate, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
    }

    //状态转化
    private onStatusChange() {
        this.num_time = 45;

        if (this.isSelfRound) {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "你的回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Your turn " + this.num_time + "s";
                    break;
            }
            this.num_sum = 1;


            if (this.SELF_TYPE == 2) {
                this.BaseComment.lb_time.textColor = 0x5a5a5a;
                this.BaseComment.bg_wait.source = "chess_row2_png";
            }
            else {
                this.BaseComment.lb_time.textColor = 0xffffff;
                this.BaseComment.bg_wait.source = "chess_row1_png";
            }
            this.BaseComment.bg_wait.horizontalCenter = -23
            this.BaseComment.bg_wait.scaleX = -1;
        }
        else {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "对手回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Opponent turn " + this.num_time + "s";
                    break;
            }
            if (this.ENENY_TYPE == 2) {
                this.BaseComment.lb_time.textColor = 0x5a5a5a;
                this.BaseComment.bg_wait.source = "chess_row2_png";
            }
            else {
                this.BaseComment.lb_time.textColor = 0xffffff;
                this.BaseComment.bg_wait.source = "chess_row1_png";
            }
            this.BaseComment.bg_wait.horizontalCenter = 23;
            this.BaseComment.bg_wait.scaleX = 1;
        }


    }
    //每秒刷新
    private onTimerUpdate() {
        if (this.isGameOver) {
            App.TimerManager.remove(this.onTimerUpdate, this);
            return;
        }
        if (this.num_time > 0) {
            this.num_time--;
            if (this.num_time <= 10) {
                // var str = "time_Fivelast_mp3"
                // App.SoundManager.playEffect(str);
                GameFiveinARowView.volume_global.play("time_Fivelast_mp3", true);
            }
            //自动拒绝求和
            if (this.BaseComment.gp_sum.visible == true) {
                this.BaseComment.numTimeRefuseSum--;

                if (this.BaseComment.numTimeRefuseSum > 0) {
                    switch (App.Language) {
                        case LanguageType.Ch:
                            this.BaseComment.btn_sumNo["label"] = "拒绝(" + this.BaseComment.numTimeRefuseSum + "秒)";
                            break;
                        case LanguageType.En:
                            this.BaseComment.btn_sumNo["label"] = "refuse(" + this.BaseComment.numTimeRefuseSum + "s)";
                            break;
                    }
                }
                else {
                    //自动拒绝求和
                    this.onRefuseSum();
                    this.BaseComment.gp_sum.visible = false;
                }
            }
        }
        else {
            if (this.isSelfRound) {
                if (!DataCenter.instance.room.IsAI) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "giveUp");
                }
                this.isGameOver = true;
                this.onTipsShow(7);
                App.TimerManager.doTimer(2000, 1, () => {
                    this.gameOver(1);
                }, this)
            }
            //超时
            return;
        }
        if (this.isSelfRound) {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "你的回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Your turn " + this.num_time + "s";
                    break;
            }
        }
        else {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "对手回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Opponent turn " + this.num_time + "s";
                    break;
            }
        }
    }
}