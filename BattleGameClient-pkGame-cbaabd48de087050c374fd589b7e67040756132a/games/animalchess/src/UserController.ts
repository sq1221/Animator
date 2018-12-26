namespace AnimalChess {
    class UserConfig {
        static nameLength = 6;
    }
    export class UserController {
        static normalLimit = 40;//双方都计入，所以翻倍
        static chaseLimit = 20;//双方都计入，所以翻倍
        public isWalk: boolean;
        public wasteLimit: number;
        public wasteMove: wasteMoveType[];
        private _controlChess: ChessType;
        private userNameBg: egret.Bitmap;
        private comNameBg: egret.Bitmap;
        private haveSet: boolean = false;
        get controlChess() {
            return this._controlChess;
        }
        set controlChess(value: ChessType) {
            this._controlChess = value;
            if (value === ChessType.RED) {
                GameAnimalChessView.instance.tipController.setCompetitorTip(ChessType.BLUE);
                GameAnimalChessView.instance.tipController.setSelfTip(ChessType.RED);
            }
            else {
                GameAnimalChessView.instance.tipController.setCompetitorTip(ChessType.RED);
                GameAnimalChessView.instance.tipController.setSelfTip(ChessType.BLUE);
            }

            if (this._currentRound === RoundType.self) {
                this.round.texture = AssetManager.getBitmap("selfRound" + value + "_png").texture;
            }
            else {
                this.round.texture = AssetManager.getBitmap("competitorRound" + value + "_png").texture;
            }

            //如果当局没有设置 名字的背景
            if (this.haveSet == false) {
                if (value === ChessType.RED) {
                    this.comNameBg.texture = AssetManager.getBitmap("name_blue_png").texture;
                    this.userNameBg.texture = AssetManager.getBitmap("name_red_png").texture;
                    this.haveSet = true;
                }
                else if (value === ChessType.BLUE) {
                    this.comNameBg.texture = AssetManager.getBitmap("name_red_png").texture;
                    this.userNameBg.texture = AssetManager.getBitmap("name_blue_png").texture;
                    this.haveSet = true;
                }
            }
        }
        constructor() {
            this.isWalk = false;
            this.walkables = [];
            this.startGrid = null;
            this.wasteMove = [];
            this.wasteLimit = UserController.normalLimit;
        }
        private round: egret.Bitmap;
        private time: number = 60;
        private timeView: egret.TextField;

        private isSelf: boolean;
        startTime = (isSelf = true) => {
            this.isSelf = isSelf;
            this.time = 60;
            App.TimerManager.doTimer(1000, 0, this.spliceTime, this);
        }
        private spliceTime = () => {
            this.time--;
            if (this.time < 10)
                this.timeView.text = "0" + this.time + "s";
            else
                this.timeView.text = this.time + "s";
            if (this.time <= 0) {
                if (this.isSelf) {
                    GameAnimalChessView.instance.chessboardController.sendResult(1);
                } else {
                    if (DataCenter.instance.room.IsAI) {
                        GameAnimalChessView.instance.chessboardController.sendResult(3);
                    }
                }
                this.removeTime();
            }
        }
        removeTime = () => {
            App.TimerManager.remove(this.spliceTime, this);
        }

        private helloButton: egret.Bitmap;
        init() {
            this.initUserView();
            this.initCompetitorView();
            this.initGiveUpView();
            this.helloButton = AssetManager.getBitmap("helloButton_png");
            this.helloButton.width *= GameAnimalChessView.scale;
            this.helloButton.height *= GameAnimalChessView.scale;
            this.helloButton.anchorOffsetY = this.helloButton.height / 2;
            this.helloButton.anchorOffsetX = this.helloButton.width;
            this.helloButton.x = App.GameWidth - ((App.GameWidth - GameAnimalChessView.instance.backgroundMain.width) / 2 + 17);
            this.helloButton.y = 1048 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(this.helloButton);
            this.helloButton.touchEnabled = true;
            this.helloButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sayHello, this);
            //下一局
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
        /**
         * 开心 + 伤心 
         * 伤心 + 开心 
         * 伤心 + 伤心 表情播放
         * */

        onPlayExpress(winChess: Chess) {
            if (!winChess) {
                this.comImg.play("beichi", 1);
                this.userImg.play("beichi", 1);
                return;
            }
            let userController = GameAnimalChessView.instance.userController;
            if (winChess.type == userController.controlChess) {
                this.userImg.play("chi", 1);
                this.comImg.play("beichi", 1);
            } else {
                this.comImg.play("chi", 1);
                this.userImg.play("beichi", 1);
            }
        }
        private onGameEvent(data: any) {
            switch (data.event) {
                case "openChase":
                    this.openChase(false);
                    break;
            }
        }
        private initUserView() {
            let user = DataCenter.instance.user;

            this.userNameBg = AssetManager.getBitmap("animalNameBg_png");
            this.userNameBg.scaleX = -1;
            this.userNameBg.anchorOffsetX = this.userNameBg.width;
            this.userNameBg.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(this.userNameBg);

            let userName = new egret.TextField();
            userName.fontFamily = "Arial";
            userName.text = user.name;
            userName.size = 28;
            if (userName.text.length > UserConfig.nameLength)
                userName.size *= UserConfig.nameLength / userName.text.length;
            userName.anchorOffsetX = userName.measuredWidth;
            userName.x = 177;
            userName.anchorOffsetY = userName.measuredHeight / 2;
            userName.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(userName);

            let sexurl: string = GameCenterGetSexIcon.getSexIconSource(user.sex);
            let userSex = AssetManager.getBitmap(sexurl);
            userSex.y = 184 * GameAnimalChessView.scale;
            userSex.x = 196;
            GameAnimalChessView.instance.UILayer.addChild(userSex);

            this.userImg = new RoleAvatar(user.curAvatarType, user.imgUrl, "dbxiaoren00_game6").armature;
            this.userImg.scaleX = this.userImg.scaleY = 1;
            this.userImg.y = 145 * GameAnimalChessView.scale;
            this.userImg.x = 151;
            GameAnimalChessView.instance.UILayer.addChild(this.userImg);
            this.userImg.play("jing")

            this.userImg.touchEnabled = true;
            this.userImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.userImgTap, this);
        }
        private userImgTap = () => {
            // 打开玩家信息页
            GameAnimalChessView.instance.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.user });
        }
        userImg: DBArmature;
        comImg: DBArmature;
        private initCompetitorView() {
            let competitor = DataCenter.instance.room.player;
            this.comNameBg = AssetManager.getBitmap("animalNameBg_png");
            this.comNameBg.anchorOffsetX = this.comNameBg.width;
            this.comNameBg.x = App.GameWidth;
            this.comNameBg.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(this.comNameBg);

            let comName = new egret.TextField();
            comName.fontFamily = "Arial";
            comName.text = DataCenter.instance.room.player.name;
            comName.size = 28;
            if (comName.text.length > UserConfig.nameLength)
                comName.size *= UserConfig.nameLength / comName.text.length;
            comName.anchorOffsetX = 0;
            comName.x = 465;
            comName.anchorOffsetY = comName.measuredHeight / 2;
            comName.y = 184 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(comName);

            let sexurl: string = GameCenterGetSexIcon.getSexIconSource(competitor.sex);
            let comSex = AssetManager.getBitmap(sexurl);
            comSex.y = 184 * GameAnimalChessView.scale;
            comSex.x = 443;
            GameAnimalChessView.instance.UILayer.addChild(comSex);

            this.comImg = new RoleAvatar(competitor.curAvatarType, competitor.imgUrl, "dbxiaoren00_game6").armature;
            this.comImg.scaleX = this.comImg.scaleY = 1;
            this.comImg.y = 145 * GameAnimalChessView.scale;
            this.comImg.x = 476;
            GameAnimalChessView.instance.UILayer.addChild(this.comImg);
            this.comImg.play("jing")

            this.comImg.touchEnabled = true;
            this.comImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.comImgTap, this);
        }
        private comImgTap = () => {
            // 打开玩家信息页
            GameAnimalChessView.instance.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.room.player });
        }
        canDrawn = true;
        private giveUpButton: egret.Bitmap;
        private giveUpListener = () => {
            GameAnimalChessView.instance.popup("GameGiveUp");
        }
        private drawnButton: egret.Bitmap;
        private drawnListener = () => {
            if (this.canDrawn) {
                if (!DataCenter.instance.room.IsAI)
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "drawnRequest");
                GameAnimalChessView.instance.tipController.showWaitDrawn();
                this.canDrawn = false;
            }
        }
        private initGiveUpView() {
            let giveUpContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            let giveUpBg = AssetManager.getBitmap("giveUp_png", false, false);
            giveUpBg.width *= GameAnimalChessView.scale;
            giveUpBg.height *= GameAnimalChessView.scale;
            giveUpContainer.addChild(giveUpBg);

            this.timeView = new egret.TextField();
            this.timeView.text = this.time + "s";
            this.timeView.anchorOffsetX = this.timeView.measuredWidth / 2;
            this.timeView.anchorOffsetY = this.timeView.measuredHeight / 2;
            this.timeView.size = 32 * GameAnimalChessView.scale;
            this.timeView.fontFamily = "Arial";
            this.timeView.x = 54 * GameAnimalChessView.scale;
            this.timeView.y = 36 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.timeView);

            if (DataCenter.instance.room.selfIsMaster) {
                this.round = AssetManager.getBitmap("selfRound_png");
                this.currentRound = RoundType.self;
            }
            else {
                this.round = AssetManager.getBitmap("competitorRound_png");
                this.currentRound = RoundType.competitor;
            }
            this.round.width *= GameAnimalChessView.scale;
            this.round.height *= GameAnimalChessView.scale;
            this.round.anchorOffsetX = this.round.width / 2;
            this.round.anchorOffsetY = this.round.height / 2;
            this.round.x = 170 * GameAnimalChessView.scale;
            this.round.y = 24 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.round);

            this.giveUpButton = AssetManager.getBitmap("giveUpButton_png");
            this.giveUpButton.width *= GameAnimalChessView.scale;
            this.giveUpButton.height *= GameAnimalChessView.scale;
            this.giveUpButton.anchorOffsetX = this.giveUpButton.width / 2;
            this.giveUpButton.anchorOffsetY = this.giveUpButton.height / 2;
            this.giveUpButton.x = 310 * GameAnimalChessView.scale;
            this.giveUpButton.y = 40 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.giveUpButton);
            this.giveUpButton.touchEnabled = true;
            this.giveUpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.giveUpListener, this);

            this.drawnButton = AssetManager.getBitmap("drawnButton_png");
            this.drawnButton.width *= GameAnimalChessView.scale;
            this.drawnButton.height *= GameAnimalChessView.scale;
            this.drawnButton.anchorOffsetX = this.drawnButton.width / 2;
            this.drawnButton.anchorOffsetY = this.drawnButton.height / 2;
            this.drawnButton.x = 405 * GameAnimalChessView.scale;
            this.drawnButton.y = 40 * GameAnimalChessView.scale;
            giveUpContainer.addChild(this.drawnButton);
            this.drawnButton.touchEnabled = true;
            this.drawnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.drawnListener, this);

            giveUpContainer.anchorOffsetY = giveUpContainer.height / 2;
            giveUpContainer.y = 1048 * GameAnimalChessView.scale;
            GameAnimalChessView.instance.UILayer.addChild(giveUpContainer);
        }
        private walkables: ChessGrid[];
        private startGrid: ChessGrid;
        public _currentRound: RoundType;
        public sideNum = 4;
        set currentRound(value: RoundType) {
            this._currentRound = value;
            let controlChess: string;
            if (this.controlChess === undefined) controlChess = "";
            else controlChess = this.controlChess.toString();

            this.time = 60;
            this.timeView.text = "60s";
            if (this._currentRound === RoundType.self) {
                this.round.texture = AssetManager.getBitmap("selfRound" + controlChess + "_png").texture;
                this.startTime();
                GameAnimalChessView.instance.tipController.showSelfRoundTip();
            }
            else {
                this.round.texture = AssetManager.getBitmap("competitorRound" + controlChess + "_png").texture;
                GameAnimalChessView.instance.tipController.showComRoundTip();
                this.removeTime();
                this.startTime(false);
            }
        }
        get currentRound() {
            return this._currentRound;
        }
        public clickHandler(id: number) {
            if (this.currentRound === RoundType.competitor) {
                GameAnimalChessView.instance.tipController.showComRoundTip();
                return;
            }
            let chessboardController = GameAnimalChessView.instance.chessboardController;
            let currentGrid = chessboardController.chessboardMap[id];

            if (this.isWalk == true && this.walkables.length > 0) {
                //正在走
                for (let i = 0; i < this.walkables.length; i++) {
                    if (currentGrid.position.x === this.walkables[i].position.x && currentGrid.position.y === this.walkables[i].position.y) {
                        //该点击点可走
                        this.currentRound = RoundType.competitor;
                        this.startGrid.chess.select = false;
                        chessboardController.move(this.startGrid.position.x, this.startGrid.position.y, currentGrid.position.x, currentGrid.position.y);
                        this.isWalk = false;
                        this.walkables = [];
                        this.startGrid = null;
                        return;
                    }
                }
                this.isWalk = false;
                this.startGrid.chess.select = false;
                this.walkables = [];
                this.startGrid = null;
            }
            if (currentGrid.chess) {
                if (currentGrid.chess.isVisible === false) {
                    //显示棋子
                    this.currentRound = RoundType.competitor;
                    chessboardController.displayGrid(currentGrid.position.x, currentGrid.position.y);
                    if (this.isWalk) {
                        this.isWalk = false;
                        this.walkables = [];
                        this.startGrid.chess.select = false;
                        this.startGrid = null;
                    }
                } else {
                    if (this.isWalk === false && this.walkables.length === 0 && this.controlChess === currentGrid.chess.type) {
                        //可以走
                        if (this.startGrid) this.startGrid.chess.select = false;
                        this.walkables = chessboardController.getWalkableGrid(currentGrid.position.x, currentGrid.position.y);
                        if (this.walkables.length > 0) {
                            this.isWalk = true;
                            this.startGrid = currentGrid;
                            this.startGrid.chess.select = true;
                        }
                        return;
                    }
                }
            }
        }

        chackWaste = () => {
            if (!this.isOpenChase) {
                return;
            }

            if (this.firstOpenChase) {//自己开启的
                switch (this.wasteLimit - this.wasteMove.length) {
                    case 0:
                        GameAnimalChessView.instance.chessboardController.checkChess();
                        break;
                    case 6:
                    case 4:
                    case 2:
                        GameAnimalChessView.instance.tipController.wasteTipShow((this.wasteLimit - this.wasteMove.length) / 2);
                        break;
                    default:
                        return;
                }
            } else {//对方开启的
                switch (this.wasteLimit - this.wasteMove.length) {
                    case 0:
                        GameAnimalChessView.instance.chessboardController.checkChess();
                        break;
                    case 5:
                    case 3:
                    case 1:
                        GameAnimalChessView.instance.tipController.wasteTipShow((this.wasteLimit - this.wasteMove.length + 1) / 2);
                        break;
                    default:
                        return;
                }
            }
        }
        //开启追击判定
        private firstOpenChase: boolean;
        private isOpenChase: boolean;
        openChase = (isFirst = true) => {
            this.wasteLimit = UserController.chaseLimit;
            GameAnimalChessView.instance.tipController.chaseShow()
            this.firstOpenChase = isFirst;
            this.isOpenChase = true;
        }
        sayHello() {
            //打招呼功能在这里写
            App.GameExpressType = 1;
            GameAnimalChessView.instance.popup("GameExpress");
        }
        dispose = () => {
            this.removeTime();
            this.userNameBg = null;
            this.comNameBg = null;
            this.time = 60;
            App.TimerManager.remove(this.spliceTime, this);
            this.userImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.userImgTap, this);
            this.comImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.comImgTap, this);
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            this.helloButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sayHello, this);
            this.giveUpButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.giveUpListener, this);
            this.drawnButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.drawnListener, this);
        }
    }
}