class GameBlockoutView extends State {
    //Eui的背景
    private BaseComment: GameBlockoutBg;//游戏基础背景
    public static GAME_WIDTH: number = 640;
    public static GAME_HEIGHT: number = 1136;
    public static GAME_BLOCK_CLOUR: number = 1;//物块的颜色
    public dict_move: any = {};//移动的按钮
    public dict_Block: any = {};//
    public numChange: number = 0;
    public numRectWidth: number = 58;//设置Button内的小物块宽高


    //浮云的值
    public num_FuYunX: number;
    public num_FuYunY: number;

    //当前物块的类型
    public onMomentType: number;
    //生成图形的初始坐标
    public initX: number;
    public initY: number;
    //三个button的状态
    private isLayoutButton_1: boolean = false;
    private isLayoutButton_2: boolean = false;
    private isLayoutButton_3: boolean = false;
    //三个button的name
    private num_name_1: number = 0;
    private num_name_2: number = 0;
    private num_name_3: number = 0;
    private isGameOver: boolean = false;
    private isAddBlocking: boolean = false;//是不是添加物块的过程中

    private numSelfLife: number = 300;//自己生命值
    private numEnumyLife: number = 300;//敌方生命值

    public ArrNeedRandomChoose = [0, 0, 0,
        -1, -1,
        -2, -2,
        - 3, -4,
        1, 1,
        2, 2, 3, 4,
        5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10]//,11,12,13,14

    public Arr_location = [
        [118, 1018],
        [320, 1018],
        [522, 1018]
    ]
    //统计哪些点可以放用于放石块
    public Can_DotArr = [];

    private str_H1: string = "";
    private str_H2: string = "";
    private str_H3: string = "";
    private str_H4: string = "";
    private str_H5: string = "";
    private str_H6: string = "";
    private str_H7: string = "";
    private str_H8: string = "";
    private str_H9: string = "";
    private str_H0: string = "";

    private str_V1: string = "";
    private str_V2: string = "";
    private str_V3: string = "";
    private str_V4: string = "";
    private str_V5: string = "";
    private str_V6: string = "";
    private str_V7: string = "";
    private str_V8: string = "";
    private str_V9: string = "";
    private str_V0: string = "";

    private num_ReduceToEnumy: number = 0;//消除后对对方的攻击点数

    private RectBoardArr: Array<any> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    //倒计时数
    private numTime = 20;

    public constructor() {
        super();
    }

    public init(): void {
        super.init();
        this.BaseComment = new GameBlockoutBg();
        this.addChild(this.BaseComment);
        this.BaseComment.width = App.GameWidth;
        this.BaseComment.height = App.GameHeight;
        //適配游戏区
        if (App.GameHeight < GameBlockoutView.GAME_HEIGHT) {
            this.BaseComment.gp_game.scaleX = App.GameHeight / GameBlockoutView.GAME_HEIGHT;
            this.BaseComment.gp_game.scaleY = App.GameHeight / GameBlockoutView.GAME_HEIGHT;
        }

        let user = DataCenter.instance.user;
        this.BaseComment.lb_name1.text = user.name;
        var playerHead1 = new RoleHeadImage(user.imgUrl);
        playerHead1.scaleX = playerHead1.scaleY = 0.70;
        this.BaseComment.playerAvatarGroup1.addChild(playerHead1);
        let enumy = DataCenter.instance.room.player;
        this.BaseComment.lb_name2.text = enumy.name;
        var playerHead2 = new RoleHeadImage(enumy.imgUrl);
        playerHead2.scaleX = playerHead2.scaleY = 0.70;
        this.BaseComment.playerAvatarGroup2.addChild(playerHead2);

        for (var i = 1; i <= 3; ++i) {
            this.BaseComment["btn_select" + i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBeginButton, this);
        }

        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onbegin, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onEnd, this);
        this.BaseComment.gp_red1.mask = new egret.Rectangle(0, 0, 130, 9);
        this.BaseComment.gp_red2.mask = new egret.Rectangle(0, 0, 130, 9);
        //设置底部按钮
        this.onReSetButton();
        //停掉背景音效
        App.SoundManager.stopBg();
        App.SoundManager.playBg("bg_blockmusic_mp3");

        //初始化
        for (var i = 0; i < 10; ++i) {
            for (var j = 0; j < 10; ++j) {
                this.dict_Block[i + "_" + j] = null;
            }
        }
        //
        this.onReadyGo();
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
    }

    // 弹出游戏结果画面
    private onGameResult(data: any): void {
        DataCenter.instance.room.gameResult = data;
        this.popup("GameResult");
    }

    private onGameEvent(data: any) {
        let parseData = (data: string): string[] => {
            let splitChar = data.split("|");
            return splitChar;
        }
        let datas = parseData(data.event);
        switch (datas[0]) {
            case "sendOperation":
                var num = Number(datas[1])
                this.onAttackSelf(num);
                break;
            case "EnumyReduceHeart":
                this.onGameTip(9);//对手血量为0（补）
                this.numEnumyLife -= 100;
                this.onSetHeartEnumy()
                break;
            //对手无路可走
            case "gameEnumyFail":
                this.onGameTip(3);
                this.numEnumyLife = 0;
                this.onSetHeartEnumy()
                break;
        }
    }
    //Ready Go
    private onReadyGo() {
        this.BaseComment.img_start1.visible = true;
        var str = "readygo_mp3"
        App.SoundManager.playEffect(str);

        egret.Tween.get(this.BaseComment.img_start2).wait(700).call(() => {
            this.BaseComment.img_start1.visible = false;
        }).to({ scaleX: 1, scaleY: 1 }, 500).wait(500).call(() => {
            this.BaseComment.img_start2.visible = false;
            egret.Tween.removeTweens(this.BaseComment.img_start2);
            //如果是AI
            if (DataCenter.instance.room.IsAI) {
                App.TimerManager.doTimer(15000, 0, this.onAiAttack, this);
            }
            else {
                App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            }
        })
    }
    public show() {
        super.show();
        this.dict_move["move"] = {}

        egret.Tween.get(this).wait(1000).to({ alpha: 1 }, 500).call(() => {
            App.TimerManager.doTimer(1000, 0, this.onTimerUpdate, this);
        })
    }

    public onBeginButton(e: egret.TouchEvent) {
        //var numChange: number;
        if (this.isGameOver) {
            return;
        }
        switch (e.target) {
            case this.BaseComment.btn_select1:
                if (this.isLayoutButton_1) {
                    return;
                }
                this.numChange = 1;
                break;

            case this.BaseComment.btn_select2:
                if (this.isLayoutButton_2) {
                    return;
                }
                this.numChange = 2;
                break;

            case this.BaseComment.btn_select3:
                if (this.isLayoutButton_3) {
                    return;
                }
                this.numChange = 3;
                break;
        }
        // e.target.scaleX = e.target.scaleY

        this.BaseComment["btn_" + this.numChange].scaleX = this.BaseComment["btn_" + this.numChange].scaleY = 2;
        this.dict_move["move"] = this.BaseComment["btn_" + this.numChange];

        this.onMomentType = Number(e.target.name);
        this.onSetRectMove(e.target.name)

    }

    public onbegin(e: egret.TouchEvent) {
        if (this.numChange == 0 || this.isGameOver) {
            return;
        }

        this.BaseComment.gp_moveArr.x = this.dict_move["move"].x - this.BaseComment.gp_moveArr.width / 2;
        this.BaseComment.gp_moveArr.y = this.dict_move["move"].y - this.BaseComment.gp_moveArr.height / 2;
    }

    public onMove(e: egret.TouchEvent) {
        if (this.numChange == 0 || this.isGameOver) {
            return;
        }
        this.dict_move["move"].x = e.stageX;
        this.dict_move["move"].y = e.stageY - 100;
        this.num_FuYunX = e.stageX - this.BaseComment.gp_moveArr.width / 2 - 30;
        this.num_FuYunY = e.stageY - 100 - this.BaseComment.gp_moveArr.height / 2 - 300;
        this.BaseComment.gp_moveArr.x = e.stageX - this.BaseComment.gp_moveArr.width / 2;
        this.BaseComment.gp_moveArr.y = e.stageY - 100 - this.BaseComment.gp_moveArr.height / 2;
        //检测阴影不出界操作
        if (this.num_FuYunX > 0 && this.num_FuYunY > 0) {
            this.initX = Math.floor(this.num_FuYunX / this.numRectWidth);
            this.initY = Math.floor(this.num_FuYunY / this.numRectWidth)
            this.BaseComment.gp_yuPan.x = this.initX * this.numRectWidth;
            this.BaseComment.gp_yuPan.y = this.initY * this.numRectWidth;

            if (this.BaseComment.gp_yuPan.x + this.BaseComment.gp_yuPan.width <= 580 &&
                this.BaseComment.gp_yuPan.y + this.BaseComment.gp_yuPan.height <= 580) {
                //检测阴影不覆盖操作
                if (this.onCheckCanLay(this.onMomentType, this.initY, this.initX)) {
                    this.BaseComment.gp_yuPan.visible = true;
                }
                else {
                    this.BaseComment.gp_yuPan.visible = false;
                }
            }
            else {
                this.BaseComment.gp_yuPan.visible = false;
            }
        }
        else {
            this.BaseComment.gp_yuPan.visible = false;
        }
    }
    //检测阴影不覆盖操作 
    private onCheckCanLay(type: number, initX: number, initY: number): boolean {
        //单块
        if (type == 0) {
            if (this.RectBoardArr[initX][initY] != 0) {
                return false;
            }
        }
        //横摆
        else if (type < 0) {
            for (var i = 0; i < (-1 * type + 1); ++i) {
                if (this.RectBoardArr[initX][initY + i] != 0) {
                    return false;
                }
            }
        }
        //纵摆
        else if (type > 0 && type < 5) {
            for (var i = 0; i < type + 1; ++i) {
                if (this.RectBoardArr[initX + i][initY] != 0) {
                    return false;
                }
            }
        }
        //复合型
        else {
            var len = this.BaseComment["ArrBlock_" + type].length;
            for (var i = 0; i < len; ++i) {
                for (var j = 0; j < len; ++j) {
                    if (this.BaseComment["ArrBlock_" + type][i][j] == 1) {
                        if (this.RectBoardArr[initX + i][initY + j] != 0) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    public onEnd(e: egret.TouchEvent) {
        if (this.numChange == 0) {
            return;
        }

        var num = this.numChange - 1;
        //防止落子一瞬间，添加石块
        if (this.BaseComment.gp_yuPan.visible == true) {
            if (!this.onCheckCanLay(this.onMomentType, this.initY, this.initX)) {

                this.BaseComment.gp_yuPan.visible = false;
            }
        }



        //根据影子的存在与否 决定
        if (this.BaseComment.gp_yuPan.visible == false) {
            this.BaseComment.gp_moveArr.removeChildren();
            egret.Tween.get(this.dict_move["move"]).to({ scaleX: 1, scaleY: 1, x: this.Arr_location[num][0], y: this.Arr_location[num][1] }, 250).call(() => {

            })
            this.onGameTip(5);
        }
        else {
            this.isAddBlocking = true;
            this.numTime = 20;
            this.BaseComment.lb_time.text = "20s";
            this.BaseComment.img_time.width = 560;

            //放置成功操作
            //处理底部起来的
            this.dict_move["move"].x = this.Arr_location[num][0]
            this.dict_move["move"].y = this.Arr_location[num][1]
            //this.dict_move["move"].visible = false;
            this.dict_move["move"].scaleX = this.dict_move["move"].scaleY = 1;
            this["isLayoutButton_" + this.numChange] = true;//设置button不可点
            this.BaseComment["gp_add" + this.numChange].removeChildren();
            //处理浮动的
            egret.Tween.get(this.BaseComment.gp_moveArr).to({ x: this.BaseComment.gp_yuPan.x + 30, y: this.BaseComment.gp_yuPan.y + 300 }, 100).call(() => {
                this.isAddBlocking = false;
                //加物块
                this.onAddBlockOutToMap(this.onMomentType, this.initY, this.initX);
                //清空临时生成的移动物
                this.BaseComment.gp_moveArr.removeChildren();
                this.BaseComment.gp_yuPan.visible = false;

                if (this.isLayoutButton_1 && this.isLayoutButton_2 && this.isLayoutButton_3) {
                    this.onReSetButton(1);
                }
            })

        }
        //clear操作
        this.BaseComment.gp_yuPan.removeChildren();
        this.dict_move["move"] = {}
        this.numChange = 0;
    }

    //设置移动组合物块
    public onSetRectMove(num) {
        this.BaseComment.gp_moveArr.removeChildren();
        this.BaseComment.gp_yuPan.removeChildren();
        //单块
        if (num == 0) {
            //上
            var img = new eui.Image();
            img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
            this.BaseComment.gp_moveArr.addChild(img);
            img.width = img.height = this.numRectWidth;
            //下
            var imgYin = new eui.Image();
            imgYin.source = "img_block_ying_png";
            this.BaseComment.gp_yuPan.addChild(imgYin);
            imgYin.width = imgYin.height = this.numRectWidth;
        }
        //横摆
        else if (num < 0) {
            for (var i = 0; i < (-1 * num + 1); ++i) {
                var img = new eui.Image();
                img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                this.BaseComment.gp_moveArr.addChild(img);
                img.width = img.height = this.numRectWidth;
                img.x = i * this.numRectWidth
                //下
                var imgYin = new eui.Image();
                imgYin.source = "img_block_ying_png";
                this.BaseComment.gp_yuPan.addChild(imgYin);
                imgYin.width = imgYin.height = this.numRectWidth;
                imgYin.x = i * this.numRectWidth
            }
        }
        //纵摆
        else if (num > 0 && num < 5) {
            for (var i = 0; i < num + 1; ++i) {
                var img = new eui.Image();
                img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                this.BaseComment.gp_moveArr.addChild(img);
                img.width = img.height = this.numRectWidth;
                img.y = i * this.numRectWidth
                //下
                var imgYin = new eui.Image();
                imgYin.source = "img_block_ying_png";
                this.BaseComment.gp_yuPan.addChild(imgYin);
                imgYin.width = imgYin.height = this.numRectWidth;
                imgYin.y = i * this.numRectWidth
            }
        }
        //复合型(本质方块)
        else {
            var len = this.BaseComment["ArrBlock_" + num].length;
            for (var i = 0; i < len; ++i) {
                for (var j = 0; j < len; ++j) {
                    if (this.BaseComment["ArrBlock_" + num][j][i] == 1) {
                        var img = new eui.Image();
                        img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                        this.BaseComment.gp_moveArr.addChild(img);
                        img.width = img.height = this.numRectWidth;
                        img.x = i * this.numRectWidth
                        img.y = j * this.numRectWidth
                        console.log("添加物块", img.x, img.y, this.BaseComment["ArrBlock_" + num][i][j])
                        //下
                        var imgYin = new eui.Image();
                        imgYin.source = "img_block_ying_png";
                        this.BaseComment.gp_yuPan.addChild(imgYin);
                        imgYin.width = imgYin.height = this.numRectWidth;
                        imgYin.x = i * this.numRectWidth
                        imgYin.y = j * this.numRectWidth
                    }
                }
            }
        }
    }

    public dispose(): void {
        super.dispose();
        App.TimerManager.remove(this.onTimerUpdate, this);
        App.TimerManager.remove(this.onAiAttack, this);
    }

    //每秒刷新
    private onTimerUpdate() {
        if (this.isGameOver) {
            App.TimerManager.remove(this.onTimerUpdate, this);
            return;
        }

        this.numTime--;
        this.BaseComment.lb_time.text = this.numTime + "s";
        this.BaseComment.img_time.width = this.numTime * 28;
        if (this.numTime == 0) {
            var str = "timeOver_mp3"
            App.SoundManager.playEffect(str);
            this.numSelfLife -= 100;
            if (this.numSelfLife > 0) {
                this.numTime = 20;
                this.BaseComment.lb_time.text = this.numTime + "s"
                this.BaseComment.img_time.width = 560;
                //自己超时给自己加铁块
                if (!this.isAddBlocking) {
                    this.onAddIron();
                }
                else {
                    egret.Tween.get(this).to({ alpha: 1 }, 100).call(() => {
                        this.onAddIron();
                    })
                }
                this.onGameTip(1);//自己超时加铁块
            }
            else {
                this.onGameTip(8);//自己超时失败
            }
            //提示对手自己超时了
            if (!DataCenter.instance.room.IsAI) {
                var str = "EnumyReduceHeart";
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            //扣心
            this.onSetHeartSelf();
        }
    }
    //AI定时攻击
    private onAiAttack() {
        //游戏结束AI停止攻击
        if (this.isGameOver) {
            App.TimerManager.remove(this.onAiAttack, this);
            return;
        }

        this.onAttackSelf(2);
    }
    //攻击自己
    private onAttackSelf(_num: number) {
        var num_AIAttact = _num;
        var num1 = (this.numSelfLife % 100) / 10;
        this.numSelfLife -= num_AIAttact * 10;
        this.onScoreHitSelf(num_AIAttact);//设置自己的分数
        this.onSetbloodSelf();

        if (num1 != 0) {
            //console.log("两个数：", num1, num_AIAttact);
            if (num_AIAttact >= num1) {
                //给自己扣心
                this.onSetHeartSelf();

                if (this.numSelfLife > 0) {
                    this.onGameTip(2);
                    //给自己加铁块
                    if (!this.isAddBlocking) {
                        this.onAddIron();
                    }
                    else {
                        egret.Tween.get(this).to({ alpha: 1 }, 100).call(() => {
                            this.onAddIron();
                        })
                    }
                }
                else {
                    this.onGameTip(8);
                }
            }
        }
    }

    //添加物块到地图
    private onAddBlockOutToMap(type: number, initX: number, initY: number) {
        var str = "layoutBlock_mp3"
        App.SoundManager.playEffect(str);
        //单块
        if (type == 0) {
            //修改数据
            this.RectBoardArr[initX][initY] = 1;
            if (this.dict_Block[this.initX + "_" + this.initY] == null) {
                var img = new eui.Image();
                img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                this.BaseComment.gp_addGameRect.addChild(img);
                img.width = img.height = this.numRectWidth;
                img.x = this.initX * this.numRectWidth;
                img.y = this.initY * this.numRectWidth;
                this.dict_Block[this.initX + "_" + this.initY] = img;
            }
            else {
                this.dict_Block[this.initX + "_" + this.initY].visible = true;
            }
        }
        //横摆
        else if (type < 0) {
            for (var i = 0; i < (-1 * type + 1); ++i) {
                this.RectBoardArr[initX][initY + i] = 1;
                if (this.dict_Block[(i + this.initX) + "_" + this.initY] == null) {
                    var img = new eui.Image();
                    img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                    this.BaseComment.gp_addGameRect.addChild(img);
                    img.width = img.height = this.numRectWidth;
                    img.x = (i + this.initX) * this.numRectWidth
                    img.y = this.initY * this.numRectWidth;
                    this.dict_Block[(i + this.initX) + "_" + this.initY] = img;
                }
                else {
                    this.dict_Block[(i + this.initX) + "_" + this.initY].visible = true;
                }

            }
        }
        //纵摆
        else if (type > 0 && type < 5) {
            for (var i = 0; i < type + 1; ++i) {
                this.RectBoardArr[initX + i][initY] = 1;
                if (this.dict_Block[this.initX + "_" + (this.initY + i)] == null) {
                    var img = new eui.Image();
                    img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                    this.BaseComment.gp_addGameRect.addChild(img);
                    img.width = img.height = this.numRectWidth;
                    img.x = this.initX * this.numRectWidth
                    img.y = (i + this.initY) * this.numRectWidth;
                    this.dict_Block[this.initX + "_" + (this.initY + i)] = img;
                }
                else {
                    this.dict_Block[this.initX + "_" + (this.initY + i)].visible = true;
                }

            }
        }
        //复合型
        else {
            var len = this.BaseComment["ArrBlock_" + type].length;
            for (var i = 0; i < len; ++i) {
                for (var j = 0; j < len; ++j) {
                    if (this.BaseComment["ArrBlock_" + type][i][j] == 1) {
                        this.RectBoardArr[initX + i][initY + j] = 1;
                        if (this.dict_Block[(j + initY) + "_" + (initX + i)] == null) {
                            var img = new eui.Image();
                            img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                            this.BaseComment.gp_addGameRect.addChild(img);
                            img.width = img.height = this.numRectWidth;
                            img.x = (j + initY) * this.numRectWidth
                            img.y = (initX + i) * this.numRectWidth;
                            this.dict_Block[(j + initY) + "_" + (initX + i)] = img;
                        }
                        else {
                            this.dict_Block[(j + initY) + "_" + (initX + i)].visible = true;
                        }
                    }
                }
            }
        }

        //消物块
        this.onSelectMapArr();

        //判断接下来是否能走
        if (!this.onJudceAllRect()) {
            this.onGameTip(7);//无路可走
            console.log("无路可走，你输了！");

            this.numSelfLife = 0;
            this.onSetHeartSelf();
            if (!DataCenter.instance.room.IsAI) {
                var str = "gameEnumyFail";
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
        }
    }
    //消除物块到地图
    private onRemovedBlockOutToMap() {

    }
    //添加铁块
    private onAddIron() {
        this.Can_DotArr = [];
        for (var i = 0; i < 10; ++i) {
            for (var j = 0; j < 10; j++) {
                if (this.RectBoardArr[i][j] == 0) {
                    var arr = [i, j];
                    this.Can_DotArr.push(arr);
                }
            }
        }

        var random = App.RandomUtils.limitInteger(0, this.Can_DotArr.length - 1)
        var initY = this.Can_DotArr[random][1];
        var initX = this.Can_DotArr[random][0];



        //修改数据
        this.RectBoardArr[initX][initY] = 2;
        var img = new eui.Image();
        img.source = "img_tikuai_png";
        this.BaseComment.gp_addGameRect.addChild(img);
        img.width = img.height = this.numRectWidth;
        img.x = initY * this.numRectWidth - 1;
        img.y = initX * this.numRectWidth - 1;

        console.log("添加铁块：", random, "輸出", this.RectBoardArr, "DFSADF:", this.Can_DotArr)
    }

    //重置底部的按钮
    private onReSetButton(num: number = 0) {
        var num1 = this.ArrNeedRandomChoose[App.RandomUtils.limitInteger(0, this.ArrNeedRandomChoose.length - 1)];
        var num2 = this.ArrNeedRandomChoose[App.RandomUtils.limitInteger(0, this.ArrNeedRandomChoose.length - 1)];
        var num3 = this.ArrNeedRandomChoose[App.RandomUtils.limitInteger(0, this.ArrNeedRandomChoose.length - 1)];

        console.log(num1, num2, num3);
        this.num_name_1 = num1;
        this.num_name_2 = num2;
        this.num_name_3 = num3;
        //确保不能一上来直接死棋 
        if (num != 0) {
            if (!this.onJudce(num1) && !this.onJudce(num2) && !this.onJudce(num3)) {
                this.onReSetButton(1);
                return;
            }
        }

        var str = "setButton_mp3"
        App.SoundManager.playEffect(str);

        //console.log(this.onJudce(num1), this.onJudce(num2), this.onJudce(num3));

        this.BaseComment.onSetButton(num1, 1);
        this.BaseComment.onSetButton(num2, 2);
        this.BaseComment.onSetButton(num3, 3);
        this.isLayoutButton_1 = this.isLayoutButton_2 = this.isLayoutButton_3 = false;
    }
    //判断无路可走
    private onJudce(type: number): boolean {
        //单块
        if (type == 0) {
            return true;
        }
        //横摆
        else if (type < 0) {
            var numHave: number = -1 * type + 1;
            var str = "";
            for (var i = 0; i < numHave; ++i) {
                str += "0";
            }
            console.log("字符串横：", numHave, str);

            for (var i = 0; i < 10; i++) {
                if (this["str_H" + i].indexOf(str) != -1) {
                    return true;
                }
            }
        }
        //纵摆
        else if (type > 0 && type < 5) {
            var numHave: number = type + 1;
            var str = "";
            for (var i = 0; i < numHave; ++i) {
                str += "0";
            }
            console.log("字符串竖：", numHave, str);


            for (var i = 0; i < 10; i++) {
                if (this["str_V" + i].indexOf(str) != -1) {
                    return true;
                }
            }
        }
        //复合型
        else {
            var len = this.BaseComment["ArrBlock_" + type].length;

            for (var k = 0; k < 11 - len; k++) {
                for (var l = 0; l < 11 - len; l++) {
                    //假设存在空间
                    var isHave: boolean = true;
                    //如果不行立即否掉
                    for (var i = 0; i < len; ++i) {
                        for (var j = 0; j < len; ++j) {
                            if (this.BaseComment["ArrBlock_" + type][i][j] == 1) {
                                if (this.RectBoardArr[k + i][l + j] != 0) {
                                    isHave = false;
                                }
                            }
                        }
                    }
                    //没有否掉就是可以

                    if (isHave) {
                        console.log("DD:", k, l);
                        return true;
                    }

                }
            }
        }

        return false

    }
    //收集横竖
    private onSelectMapArr() {
        //重置消除点数
        this.num_ReduceToEnumy = 0;
        for (var i = 0; i < 10; i++) {
            this["str_H" + i] = "";
            this["str_V" + i] = "";
            for (var j = 0; j < 10; ++j) {
                this["str_H" + i] += this.RectBoardArr[i][j];
                this["str_V" + i] += this.RectBoardArr[j][i];
            }
            console.log("横:", this["str_H" + i])
            console.log("竖:", this["str_V" + i])
        }

        //console.log("物块集合：", this.dict_Block);

        //横向消除
        for (var i = 0; i < 10; ++i) {
            if (this["str_H" + i] == "1111111111") {
                this.num_ReduceToEnumy++;
                this["str_H" + i] = "0000000000";
                this.BaseComment.onPlayBoomEffect(i);
                for (var j = 0; j < 10; ++j) {
                    this.RectBoardArr[i][j] = 0;
                    if (this.dict_Block[j + "_" + i] != null) {
                        this.dict_Block[j + "_" + i].visible = false;
                    }
                    else {
                        console.log("空：", j + "_" + i)
                    }
                }
            }
        }
        //纵向消除
        for (var i = 0; i < 10; ++i) {
            if (this["str_V" + i] == "1111111111") {
                this.num_ReduceToEnumy++;
                this["str_V" + i] = "0000000000";
                this.BaseComment.onPlayBoomEffect(i, false);
                for (var j = 0; j < 10; ++j) {
                    this.RectBoardArr[j][i] = 0;
                    if (this.dict_Block[i + "_" + j] != null) {
                        this.dict_Block[i + "_" + j].visible = false;
                    }
                    else {
                        console.log("空：", i + "_" + j)
                    }
                }
            }
        }
        //如果有效除
        if (this.num_ReduceToEnumy > 0) {
            var num_temp: number = this.numEnumyLife;
            this.numEnumyLife -= this.num_ReduceToEnumy * 10;

            this.onScoreHitEnumy(this.num_ReduceToEnumy);
            this.onSetbloodEnumy();

            if (num_temp % 100 != 0) {
                var num = (num_temp % 100) / 10;
                if (this.num_ReduceToEnumy >= num) {
                    //给敌人扣心 
                    this.onSetHeartEnumy();
                    if (this.numEnumyLife > 0) {
                        //提示加给对手铁块
                        this.onGameTip(6);
                    }
                    else {
                        this.onGameTip(4);
                    }

                }
            }
            //通知对手减分
            if (!DataCenter.instance.room.IsAI) {
                var str = "sendOperation|" + this.num_ReduceToEnumy;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }

        }
    }
    //判断全局
    private onJudceAllRect(): boolean {
        console.log("DDDD:", this.num_name_1, this.num_name_2, this.num_name_3)
        if (this.isLayoutButton_1 &&
            this.isLayoutButton_2 &&
            this.isLayoutButton_3) {
            return true;
        }


        if (this.isLayoutButton_1 == false) {
            if (this.onJudce(this.num_name_1)) {
                return true;
            }
        }
        if (this.isLayoutButton_2 == false) {
            if (this.onJudce(this.num_name_2)) {
                return true;
            }
        }
        if (this.isLayoutButton_3 == false) {
            if (this.onJudce(this.num_name_3)) {
                return true;
            }
        }

        return false;
    }
    //设置自己血量
    private onSetbloodSelf() {
        if (this.numSelfLife <= 0) {
            this.numSelfLife = 0;
            //输了
            console.log("自己血量为零，输了！")
        }

        this.BaseComment.img_red1.left = 13 * (10 - (this.numSelfLife % 100) / 10);
        //整数关口扣心了 血条特殊加满
        if (this.numSelfLife > 0 && this.numSelfLife % 100 == 0) {
            this.BaseComment.img_red1.left = 0;
        }

    }
    //设置敌方血量
    private onSetbloodEnumy() {
        if (this.numEnumyLife <= 0) {
            this.numEnumyLife = 0;
            //赢了
            console.log("对方血量为零，赢了！")
        }
        this.BaseComment.img_red2.right = 13 * (10 - (this.numEnumyLife % 100) / 10);
        if (this.numEnumyLife > 0 && this.numEnumyLife % 100 == 0) {
            this.BaseComment.img_red2.right = 0;
        }
    }
    //分数打击自己
    private onScoreHitSelf(num: number) {
        this.BaseComment.lb_reduce1.scaleX = this.BaseComment.lb_reduce1.scaleY = 0;
        this.BaseComment.lb_reduce1.text = "-" + num * 10;
        egret.Tween.get(this.BaseComment.lb_reduce1).to({ scaleX: 1, scaleY: 1 }, 500).call(() => {
            this.BaseComment.lb_reduce1.text = ""
        })
    }
    //分数打击敌人
    private onScoreHitEnumy(num: number) {
        var str = "clearBlock_mp3"
        App.SoundManager.playEffect(str);
        this.BaseComment.lb_reduce2.scaleX = this.BaseComment.lb_reduce2.scaleY = 0;
        this.BaseComment.lb_reduce2.text = "-" + num * 10;
        egret.Tween.get(this.BaseComment.lb_reduce2).to({ scaleX: 1, scaleY: 1 }, 500).call(() => {
            this.BaseComment.lb_reduce2.text = ""
        })
    }
    //设置自己的心数
    private onSetHeartSelf() {
        if (this.numSelfLife > 0) {
            this.BaseComment.lb_life1.text = "" + Math.ceil(this.numSelfLife / 100);
        }
        else {
            this.BaseComment.lb_life1.text = "0";
            this.BaseComment.img_red1.visible = false;
            this.isGameOver = true;
            this.touchEnabled = false;
            this.touchChildren = false;
            this.onGameResultCartoon(2);
        }

    }
    //设置敌人的心数
    private onSetHeartEnumy() {
        if (this.numEnumyLife > 0) {
            this.BaseComment.lb_life2.text = "" + Math.ceil(this.numEnumyLife / 100);
        }
        else {
            this.BaseComment.lb_life2.text = "0";
            this.BaseComment.img_red2.visible = false;
            this.isGameOver = true;
            this.touchEnabled = false;
            this.touchChildren = false;
            this.onGameResultCartoon(1);
        }
    }
    //游戏中的提示
    private onGameTip(num: number) {
        var imgBg = new eui.Image();
        this.BaseComment.gp_game.addChild(imgBg);
        imgBg.source = "img_BlocktipsBg_png";
        imgBg.horizontalCenter = 0;
        imgBg.verticalCenter = 0;
        imgBg.touchEnabled = false;
        imgBg.scaleX = imgBg.scaleY = 0;


        var img = new eui.Image();
        this.BaseComment.gp_game.addChild(img);
        img.source = "lb_block" + num + "_png";
        img.horizontalCenter = 0;
        img.verticalCenter = 0;
        img.touchEnabled = false;
        img.scaleX = img.scaleY = 0;



        egret.Tween.get(imgBg).to({ scaleX: 1, scaleY: 1 }, 300).wait(750).call(() => {
            egret.Tween.removeTweens(imgBg);
            this.BaseComment.gp_game.removeChild(imgBg);
        })

        egret.Tween.get(img).to({ scaleX: 1, scaleY: 1 }, 300).wait(750).call(() => {
            egret.Tween.removeTweens(img);
            this.BaseComment.gp_game.removeChild(img);
        })

    }
    //游戏结果
    private onGameResultCartoon(num: number) {
        if (num == 1) {
            var str = "block_win_wav"
            App.SoundManager.playEffect(str);
        } else {
            var str = "blockLose_mp3"
            App.SoundManager.playEffect(str);
        }

        this.BaseComment.img_result.source = "img_blockResult" + num + "_png";
        egret.Tween.get(this.BaseComment.img_result).wait(1000).call(() => {
            this.BaseComment.rec_result.visible = true;
        }).to({ scaleX: 1, scaleY: 1 }, 500).wait(1500).call(() => {
            this.BaseComment.img_result.visible = false;
            this.BaseComment.rec_result.visible = false;
            if (num == 1) {
                this.gameOver(3);
            }
            else {
                this.gameOver(1);
            }
        })

    }
    //通知服务器游戏结束
    public gameOver(result: number): void {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }
}