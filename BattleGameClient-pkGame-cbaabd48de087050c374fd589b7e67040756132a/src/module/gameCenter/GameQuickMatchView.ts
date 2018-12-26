/** 
 * 游戏匹配
*/
class GameQuickMatchView extends StateEui {

    public cancelMatchBtn: eui.Button;// 取消匹配

    public img_head: eui.Image;
    public img_flash: eui.Image;
    public img_s: eui.Image;
    public img_v: eui.Image;
    public user1SexImg: eui.Image;// 玩家自己性别图标
    public user2SexImg: eui.Image;// 匹配到的玩家性别图标 
    public user1NameLab: eui.Label;// 玩家自己名字
    public user2NameLab: eui.Label;// 匹配到的玩家的名字
    public head_1: eui.Image;
    public head_2: eui.Image;
    public load1_bg: eui.Image;
    public load1: eui.Image;
    public load2_bg: eui.Image;
    public load2: eui.Image;
    public lb_time: eui.Label;
    public img_time: eui.Image;
    public lb_watingFriend: eui.Label;
    public searchCircle1: eui.Image;
    public searchCircle2: eui.Image;
    public searchCircle3: eui.Image;
    public lb_persentage1: eui.Label;
    public lb_persentage2: eui.Label;
    public searchGroup: eui.Group;// 匹配面板group
    public searchSuccessGroup: eui.Group;// 匹配成功group
    public user1: eui.Group;
    public user2: eui.Group;
    public gp_vs: eui.Group;
    public gp_bg: eui.Group;
    public enterMatchTwGroup: eui.Group;// 
    public playerMatchingDbGroup: eui.Group;// 匹配动画DB

    private gp_bg_Rect: number = 160;// 背景块大小

    private playerMatchingDb: DBArmature;// 匹配中。。Db动画
    private waitingDb: DBArmature;// 匹配中。。Db动画
    private num_timer: number = 60;//匹配需要用时

    private roleAvatar1: RoleAvatar;//玩家1
    private roleAvatar2: RoleAvatar;//玩家2

    private cleartimeOutSearch1Id: number;// 清楚搜索动画1
    private cleartimeOutSearch2Id: number;// 清楚搜索动画2
    private cleartimeOutSearch3Id: number;// 清楚搜索动画3

    public constructor() {
        super(GameQuickMatchSkin);
    }

    public init(): void {
        super.init();
        // 取消
        this.cancelMatchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
        // 加载匹配动画
        this.addMatchIngDb();
        // 添加自身玩家DB
        this.onAddPerson();
        // 设置玩家自身属性
        this.userSelfProperty();
    }

    public show(): void {
        super.show();

        // 初始化状态
        this.onClear();

        // 填充屏幕
        this.onFullscreen();

        // 刚进入页面动画
        this.onEnterMatchTween();

        //匹配动画
        this.playerMatchingDb.visible = true;
        this.playerMatchingDb.play("pipei", 0);
        this.lb_watingFriend.visible = false;
        //匹配波纹
        this.searchTween();
        //开启匹配倒计时显示
        this.startMatchingTime();
        this.isOpenSuccess = false;
    }

    // 进入匹配页动画
    private onEnterMatchTween() {
        this.enterMatchTwGroup.scaleX = this.enterMatchTwGroup.scaleY = 0.8;
        egret.Tween.get(this.enterMatchTwGroup).to({ scaleX: 1, scaleY: 1 }, 680, egret.Ease.bounceOut);
    }

    // 搜索波纹动画
    private searchTween(): void {
        let self = this;
        // 搜索动画
        function searchAmiOne() {
            self.searchCircle1.alpha = 1;
            self.searchCircle1.width = 154
            self.searchCircle1.height = 77;
            egret.Tween.get(self.searchCircle1)
                .to({ width: 480, height: 240, x: self.verticalCenter, y: self.horizontalCenter, alpha: 0 }, 2100).call(searchAmiOne);
        }
        function searchAmiTwo() {
            self.searchCircle2.alpha = 1;
            self.searchCircle2.width = 154
            self.searchCircle2.height = 77;
            egret.Tween.get(self.searchCircle2)
                .to({ width: 480, height: 240, x: self.verticalCenter, y: self.horizontalCenter, alpha: 0 }, 2100).call(searchAmiTwo);
        }
        function searchAmiThree() {
            self.searchCircle3.alpha = 1;
            self.searchCircle3.width = 154
            self.searchCircle3.height = 77;
            egret.Tween.get(self.searchCircle3)
                .to({ width: 480, height: 240, x: self.verticalCenter, y: self.horizontalCenter, alpha: 0 }, 2100).call(searchAmiThree);
        }
        this.cleartimeOutSearch1Id = egret.setTimeout(searchAmiOne, this, 0);
        this.cleartimeOutSearch2Id = egret.setTimeout(searchAmiTwo, this, 700);
        this.cleartimeOutSearch3Id = egret.setTimeout(searchAmiThree, this, 1400);
    }

    //根据时间刷新
    private ontimerUpdateUI() {
        if (this.num_timer > 0) {
            this.num_timer--;
            this.lb_time.text = this.num_timer + "";
        } else {

        }
    }

    //开启匹配倒计时显示
    private startMatchingTime(): void {
        this.showMatchingTime();
        this.num_timer = 60;
        this.ontimerUpdateUI();
        App.TimerManager.doTimer(1000, 0, this.ontimerUpdateUI, this);
    }

    //显示匹配倒计时
    private showMatchingTime(): void {
        this.lb_time.visible = true;
        this.img_time.visible = true;
    }

    //隐藏匹配倒计时
    private hideMatchingTime(): void {
        this.lb_time.visible = false;
        this.img_time.visible = false;
    }

    //停止匹配倒计时显示
    private stopMatchingTime(): void {
        App.TimerManager.remove(this.ontimerUpdateUI, this);
    }

    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
        // ErrCode处理
        App.MessageCenter.addListener(Proto.ID_error_notice_s2c, this.errorS2C, this);
        // 进入游戏成功
        App.MessageCenter.addListener(Proto.ID_game_join_s2c, this.joinServerS2C, this);
        // 其他用户进入游戏
        App.MessageCenter.addListener(Proto.ID_game_otherUserJoin_notice_s2c, this.otherUserJoinS2C, this);
        // 平台登录成功
        App.MessageCenter.addListener(Proto.ID_platform_login_s2c, this.platformLoginS2C, this);
        // 请求匹配返回
        App.MessageCenter.addListener(Proto.ID_game_matching_notice_s2c, this.startMatchingS2C, this);
        // 取消匹配返回
        App.MessageCenter.addListener(Proto.ID_game_cancelMatching_s2c, this.stopMatchingS2C, this);
        // 游戏开启通知
        App.MessageCenter.addListener(Proto.ID_game_start_notice_s2c, this.startGameS2C, this);
        // 收到loadProgress通知
        App.MessageCenter.addListener(Proto.ID_game_loadProgress_notice_s2c, this.loadProgressS2C, this);
        // 结果返回
        App.MessageCenter.addListener(Proto.ID_game_result_notice_s2c, this.onGameResultS2C, this);
    }

    //请求匹配返回
    private startMatchingS2C(data: game_matching_notice_s2c): void {
        //匹配玩家的平台数据
        let platformData = Platform.curPlatform.platformData;
        platformData.otherUserId = data.otherUserId;
        platformData.otherUserName = data.otherUserName;
        platformData.otherUserPic = data.otherUserPic;
        platformData.otherUserSex = data.otherUserSex;
        platformData.isAi = data.isAi;
        platformData.aiLevel = data.aiLevel;
        platformData.roomId = data.roomId;

        if (egret.getOption("testAiLevel") != "") {
            platformData.aiLevel = parseInt(egret.getOption("testAiLevel"));
        }

        //roomId
        App.CurrRoomId = data.roomId;

        //关闭匹配服务器链接
        ProxySocket.stop();
        //停止匹配倒计时显示
        this.stopMatchingTime();
        //匹配动画
        this.onSuccessSeach(data.roomId);
    }

    //取消匹配返回
    private stopMatchingS2C(data: game_cancelMatching_s2c): void {
        // 断开socket
        ProxySocket.stop();
        // 返回匹配页
        this.next("gameChangeMatch");
    }

    //消息接听初始化
    private initMessage(): void {
        //Socket连接成功消息
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, this.connectSocketSuccess, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, this.connectSocketClose, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, this.connectSocketError, this);
    }

    //开始连接游戏服务器
    private startConnectGameServer(roomId: string): void {
        ProxyHttp.getGameServer(roomId, (data) => {
            //消息监听
            this.initMessage();

            //连接服务器
            var connectorServer = data.data;
            if (!connectorServer.hasOwnProperty("useSSL")) {
                connectorServer.useSSL = true;
            }
            ProxySocket.init(connectorServer.host, connectorServer.port, connectorServer.useSSL);

            Common.ServerIndex = connectorServer.sindex;
        })
    }

    //连接关闭
    private connectSocketClose() {
        var errMsg: string = RES.getRes("errorCode_json")["6001"];
        Common.showErrorMsg_Game(errMsg);
    }

    //连接失败
    private connectSocketError() {
        var errMsg: string = RES.getRes("errorCode_json")["6002"];
        Common.showErrorMsg_Game(errMsg);
    }

    //连接Socket服务器成功，进行登录
    private connectSocketSuccess(): void {
        //开启ping
        ProxySocket.startPing();
        //平台登录
        ProxySocket.platformLogin(App.CurrGameId, Platform.curPlatformID, Platform.curPlatform.platformData);
    }

    //平台登录返回
    private platformLoginS2C(data: platform_login_s2c): void {
        //进入游戏
        ProxySocket.joinGame(App.CurrRoomId);
    }
    //请求服务器进入游戏返回
    private joinServerS2C(data: game_join_s2c): void {
        //生成自己的数据
        var user: User = new User(data.myUser.userId.toString());
        user.name = data.myUser.userName;
        user.imgUrl = data.myUser.userPic;
        user.sex = data.myUser.userSex;
        user.curAvatarType = 1;
        user.uuid = data.myUser.uuid;
        DataCenter.instance.user = user;

        // Ai设置
        App.CurrGameIsAi = data.isAi == 1;
        App.CurrGameAiLevel = data.aiLevel;

        //生成房间数据
        if (data.otherUser.userId != "") {
            //创建房间数据
            var otherUser = new User(data.otherUser.userId.toString());
            otherUser.name = data.otherUser.userName;
            otherUser.imgUrl = data.otherUser.userPic;
            otherUser.sex = data.otherUser.userSex;
            otherUser.curAvatarType = 2;
            DataCenter.instance.room = new RoomVO(App.CurrRoomId, App.CurrGameId, otherUser, App.CurrGameIsAi);
            //更新对方进度
            this.setProgress(this.lb_persentage2, data.otherUser.userProgress);
            //chatId设置
            App.CurrChatId = Common.createChatId([user.id, otherUser.id]);

            this.refeshFacebook(data);
        }
        //加载资源
        this.loadGameSource();

        //统计
        if (App.IsFaceBook)
            Statistics.loginSccess();
    }

    //其他用户进入游戏
    private otherUserJoinS2C(data: game_otherUserJoin_notice_s2c): void {
        //创建房间数据
        var otherUser = new User(data.otherUser.userId.toString());
        otherUser.name = data.otherUser.userName;
        otherUser.imgUrl = data.otherUser.userPic;
        otherUser.sex = data.otherUser.userSex;
        otherUser.curAvatarType = 2;
        DataCenter.instance.room = new RoomVO(App.CurrRoomId, App.CurrGameId, otherUser, App.CurrGameIsAi);
        //chatId设置
        var user = DataCenter.instance.user;
        App.CurrChatId = Common.createChatId([user.id, otherUser.id]);
        this.onSuccessSeach(App.CurrRoomId);
        this.refeshFacebook(data);
    }
    private refeshFacebook(data) {
        //匹配玩家的平台数据
        let platformData = Platform.curPlatform.platformData;
        platformData.otherUserId = data.otherUser.userId;
        platformData.otherUserName = data.otherUser.userName;
        platformData.otherUserPic = data.otherUser.userPic;
        platformData.otherUserSex = data.otherUser.userSex;
        platformData.isAi = data.isAi;
        platformData.aiLevel = data.aiLevel;
        platformData.roomId = App.CurrRoomId;
        // 加载匹配成功后的玩家
        this.onAddPerson2();
        // 匹配到的玩家数据显示
        this.userMatchSuccProperty();
    }
    //游戏开启通知
    private startGameS2C(data: game_start_notice_s2c): void {
        this.runGame();
        //加载完成统计log
        if (App.IsFaceBook)
            Statistics.loadingEnd();
    }

    //正常进入游戏
    private runGame(): void {
        Game.getInstance().joinGame(App.CurrGameId);
        App.MessageCenter.removeAll(this);
    }

    //收到loadProgress通知
    private loadProgressS2C(data: game_loadProgress_notice_s2c): void {
        //进度显示
        if (data.userId.toString() == DataCenter.instance.user.id) {
            this.setProgress(this.lb_persentage1, data.progress);
        } else {
            this.setProgress(this.lb_persentage2, data.progress);
        }
    }

    //游戏结果返回
    private onGameResultS2C(data: game_result_notice_s2c): void {
        //统计
        if (App.IsFaceBook) {
            Statistics.gameEnd();
            Statistics.reportResult(data.winUserId);
        }
        //弹出胜负结果
        DataCenter.instance.room.gameResult = data;
        this.popup("GameResult");
        //销毁游戏资源
        Game.getInstance().destoryGameRes(App.CurrGameId);
    }


    // ErrCode处理
    private errorS2C(data: error_notice_s2c): void {
        if (data.errorCode == 4001) {
            //平台登录失败
            Common.showErrorMsg_Game(RES.getRes("errorCode_json")["4001"]);
        }
        else if (data.errorCode == 5001) {
            //匹配失败
            // Common.showErrorMsg_Game(RES.getRes("errorCode_json")["5001"]);
        }
        else if (data.errorCode == 3007) {
            //加入房间时，房间不存在或已过期
            Common.showErrorMsg_Game(RES.getRes("errorCode_json")["3007"]);
        }
    }

    public tick(advancedTime: number): void {
        super.tick(advancedTime);
    }

    public dispose(): void {
        super.dispose();
        this.onClear();
        if (this.roleAvatar2) {
            this.roleAvatar2.dispose();
            this.roleAvatar2 = null;
        }
    }
    static isInvite = false;
    // 取消匹配
    public onCancel() {
        if (GameQuickMatchView.isInvite) {
            this.next("gameChangeMatch");
            GameQuickMatchView.isInvite = false;
            ProxySocket.stop();
            return;
        }
        if (!App.Socket.isConnecting || GameQuickMatchView.isInvite) {
            // 返回到开始匹配页
            this.next("gameChangeMatch");
        } else {
            // 匹配取消
            ProxySocket.stopMatching(Platform.curPlatform.platformData.userId);
        }
    }

    /**
     * 排除网卡传过来的有两次
     */
    isOpenSuccess = false;
    //匹配成功
    public onSuccessSeach(roomId: string) {
        if (this.isOpenSuccess) return;
        var self = this;
        this.isOpenSuccess = true;
        // 禁用取消按钮
        this.cancelMatchBtn.currentState = "disabled";
        this.cancelMatchBtn.touchEnabled = false;

        // 加载匹配成功后的玩家
        this.onAddPerson2();
        // 匹配到的玩家数据显示
        this.userMatchSuccProperty();
        // 播放匹配成功声音
        App.SoundManager.playEffect("successSearchSound_mp3");

        // 大面板状态
        this.enterMatchTwGroup.scaleX = this.enterMatchTwGroup.scaleY = 1;
        // 隐藏搜索匹配界面
        let searchGroupTw = egret.Tween.get(self.searchGroup);
        searchGroupTw.to({ scaleX: 0, scaleY: 0 }, 200, egret.Ease.sineIn).call(succSearchFun);

        // 匹配成功界面落下显示
        function succSearchFun() {
            // X:36 Y:458
            self.searchSuccessGroup.y = -160;
            self.searchSuccessGroup.visible = true;
            let succSearch = egret.Tween.get(self.searchSuccessGroup);
            succSearch.to({ y: App.GameHeight / 2 - 160 }, 400, egret.Ease.bounceOut);
        }

        //进入游戏，或会话
        let tw1 = egret.Tween.get(this.user1);
        let tw2 = egret.Tween.get(this.user2);

        tw1.to({ x: 20, y: 370 }, 200);
        tw2.to({ "alpha": 1 }, 200).to({ x: App.GameWidth - 220, y: 370 }, 300).call(fun1)
        this.roleAvatar1.armature.play("zhaodaoren");

        function fun1() {
            self.img_flash.scaleX = self.img_flash.scaleY = 0;
            self.img_flash.visible = true;
            let twf = egret.Tween.get(self.img_flash);
            twf.to({ scaleX: 0.6, scaleY: 0.6 }, 200, egret.Ease.sineOut).call(fun2);
        }

        function fun2() {
            self.img_v.x = 200
            self.img_v.y = -70
            self.img_v.visible = true;
            self.img_s.x = 410;
            self.img_s.y = 1200;
            self.img_s.visible = true;

            let twv = egret.Tween.get(self.img_v);
            let tws = egret.Tween.get(self.img_s);
            twv.to({ x: 290, y: 554 }, 300, egret.Ease.sineInOut)
            tws.to({ x: 350, y: 595 }, 300, egret.Ease.sineInOut).wait(400).call(fun3)
        }

        function fun3() {
            self.lb_persentage1.visible = true;
            self.lb_persentage2.visible = true;
            self.load1.width = 0;
            self.load1.visible = true;
            self.load2.width = 0;
            self.load2.visible = true;
            self.load1_bg.visible = true;
            self.load2_bg.visible = true;

            //进度显示还原
            self.setProgress(self.lb_persentage1, 0);
            self.setProgress(self.lb_persentage2, 0);

            //连接游戏服务器， 进入游戏
            self.startConnectGameServer(roomId);
        }
    }

    /**
     *  资源加载处理区域
     */
    private setProgress(label: eui.Label, progressNum: number): void {
        label.text = progressNum + "%";
        if (label == this.lb_persentage1) {
            this.load1.width = Math.floor(progressNum / 100 * this.load1_bg.width);
        }
        else {
            this.load2.width = Math.floor(progressNum / 100 * this.load2_bg.width);
        }
    }

    // 加载资源
    private loadGameSource(): void {
        var config: any = DataCenter.instance.getGameConfig(App.CurrGameId);
        var gameRes = config.res;
        App.ResourceUtils.loadGroup(gameRes, this.onCompleteHandler, this.onProgressHandler, this, this.onErrorHandler);
    }

    // 资源加载失败
    private onErrorHandler(): void {
        var errMsg: string = RES.getRes("errorCode_json")["7001"];
        GamePopView.Popup(Game.getInstance().stateManager.curState, errMsg, () => {
            Platform.curPlatform.gameOver(1);
        });
    }

    private onCompleteHandler(): void {
        //解析龙骨动画
        let dbConfig = RES.getRes("dbAssetConfig_json");
        AssetManager.loadDBAnimation(dbConfig.db[App.CurrGameId.toString()]);
        //发送资源加载完成
        ProxySocket.sendLoadProgress(App.CurrRoomId, 100);
        //加载完成统计log
        if (App.IsFaceBook)
            Statistics.loadingEndOne();
    }

    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onProgressHandler(itemsLoaded: number, itemsTotal: number): void {
        var progressNum: number = Math.ceil(itemsLoaded / itemsTotal * 100);
        progressNum = Math.min(progressNum, 99);
        //发送LoadProgress
        ProxySocket.sendLoadProgress(App.CurrRoomId, progressNum);
    }

    //填充屏幕
    public onFullscreen() {
        if (this.gp_bg.numChildren > 0) {
            return;
        }
        // 背景填充
        var num_x: number = Math.ceil(App.GameWidth / this.gp_bg_Rect);
        var num_y: number = Math.ceil(App.GameHeight / this.gp_bg_Rect);
        for (var i = 0; i < num_x; ++i) {
            for (var j = 0; j < num_y; ++j) {
                var img = new eui.Image();
                img.source = "bg_round_png";
                this.gp_bg.addChild(img);
                img.x = i * this.gp_bg_Rect;
                img.y = j * this.gp_bg_Rect;
            }
        }
    }

    //离开页面后重置页面
    private onClear() {
        var self = this;
        self.lb_persentage1.visible = false;
        self.lb_persentage2.visible = false;
        self.load1.visible = false;
        self.load1.width = 0;
        self.load2.visible = false;
        self.load2.width = 0;
        self.load1_bg.visible = false;
        self.load2_bg.visible = false;
        self.user1.x = 220;
        self.user1.y = 370;
        self.user2.alpha = 0;
        self.user2.x = 581;
        self.user2.y = 46;

        // 初始化闪电的缩放
        egret.Tween.removeTweens(self.img_flash);
        self.img_flash.scaleX = self.img_flash.scaleY = 0;
        self.img_flash.visible = false;

        egret.Tween.removeTweens(self.img_v);
        self.img_v.x = 200
        self.img_v.y = -70
        self.img_v.visible = false;
        egret.Tween.removeTweens(self.img_s);
        self.img_s.x = 410;
        self.img_s.y = 1200;
        self.img_s.visible = false;

        self.lb_time.text = "";

        // 形象移除
        // self.user1.removeChildren();
        self.user2.removeChildren();

        // 匹配动画
        // self.playerMatchingDbGroup.removeChildren();

        // 匹配界面
        self.searchGroup.visible = true;
        self.searchGroup.scaleX = self.searchGroup.scaleY = 1;
        // 匹配成功界面显示
        egret.Tween.removeTweens(self.searchSuccessGroup);
        self.searchSuccessGroup.visible = false;
        self.searchSuccessGroup.y = -160;

        // 清楚搜索缓动动画
        egret.clearTimeout(self.cleartimeOutSearch1Id);
        egret.clearTimeout(self.cleartimeOutSearch2Id);
        egret.clearTimeout(self.cleartimeOutSearch3Id);
        egret.Tween.removeTweens(self.searchCircle1);
        egret.Tween.removeTweens(self.searchCircle2);
        egret.Tween.removeTweens(self.searchCircle3);

        for (var i: number = 1; i < 4; i++) {
            self["searchCircle" + i].alpha = 1;
            self["searchCircle" + i].width = 154
            self["searchCircle" + i].height = 77;
        }
        // 取消按钮 可用
        self.cancelMatchBtn.currentState = "up";
        self.cancelMatchBtn.touchEnabled = true;
    }

    // 玩家自己
    private onAddPerson() {
        let myData = Platform.curPlatform.platformData;
        this.roleAvatar1 = new RoleAvatar(1, myData.userPic);
        this.roleAvatar1.armature.play("zhaoren");
        this.roleAvatar1.armature.x = this.user1.width * 0.5;
        this.roleAvatar1.armature.y = this.user1.height;
        this.roleAvatar1.armature.scaleX = this.roleAvatar1.armature.scaleY = 0.8;
        this.user1.addChild(this.roleAvatar1.armature);
    }

    // 玩家自身属性设置
    private userSelfProperty(): void {
        let platformData = Platform.curPlatform.platformData;
        // 性别
        this.user1SexImg.source = GameCenterGetSexIcon.getSexIconSource(platformData.userSex);
        // 名字
        this.user1NameLab.text = platformData.userName;
    }

    // 匹配到的玩家
    private onAddPerson2() {
        let platformData = Platform.curPlatform.platformData;
        this.roleAvatar2 = new RoleAvatar(2, platformData.otherUserPic);
        this.roleAvatar2.armature.play("zhaodaoren");
        this.roleAvatar2.armature.x = this.user2.width * 0.5;
        this.roleAvatar2.armature.y = this.user2.height;
        this.roleAvatar2.armature.scaleX = this.roleAvatar2.armature.scaleY = 0.8;
        this.user2.addChild(this.roleAvatar2.armature);
    }

    // 匹配到的玩家属性设置
    private userMatchSuccProperty(): void {
        let platformData = Platform.curPlatform.platformData;
        // 性别
        this.user2SexImg.source = GameCenterGetSexIcon.getSexIconSource(platformData.otherUserSex);
        // 名字
        this.user2NameLab.text = platformData.otherUserName;
    }

    // 创建动画资源加载到舞台
    private addMatchIngDb = () => {
        // 取消按钮 可用
        this.cancelMatchBtn.currentState = "up";
        this.cancelMatchBtn.touchEnabled = true;
        /** 屏蔽等待动画 */
        if (this.waitingDb) {
            this.waitingDb.stop();
            this.waitingDb.visible = false;
        }
        // 匹配动画
        this.playerMatchingDb = AssetManager.getQuickDBArmature("pipeiDB");
        // 添加到舞台
        this.playerMatchingDb.x = 0;
        this.playerMatchingDb.y = 0;
        this.playerMatchingDbGroup.addChild(this.playerMatchingDb);
        this.playerMatchingDb.play("pipei", 0);
    }
    //暂停匹配动画，改为播放等待动画
    private playWaitDB = () => {
        this.cancelMatchBtn.currentState = "up";
        this.cancelMatchBtn.touchEnabled = true;
        if (this.playerMatchingDb) {
            this.playerMatchingDb.stop();
            this.playerMatchingDb.visible = false;
        }
        this.waitingDb = AssetManager.getQuickDBArmature("wait");
        this.waitingDb.x = 0;
        this.waitingDb.y = 0;
        this.playerMatchingDbGroup.addChild(this.waitingDb);
        this.waitingDb.play("wait", 0);
    }
}