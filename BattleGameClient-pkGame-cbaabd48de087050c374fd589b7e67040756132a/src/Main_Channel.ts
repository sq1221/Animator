//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main_Channel extends egret.DisplayObjectContainer {

    private loadingView: LoadingUI_GameSLL;
    private euiLayer: eui.UILayer;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //初始化服务器
        var serverUrl = "http://pklist_channel.egret.com/platforms/index.php";
        ProxyHttp.init(serverUrl, Platform.curPlatformID);

        //loading容器层
        this.euiLayer = new eui.UILayer();
        this.euiLayer.percentWidth = 100;
        this.euiLayer.percentHeight = 100;
        this.stage.addChild(this.euiLayer);

        //设置加载进度界面
        this.loadingView = new LoadingUI_GameSLL();
        this.loadingView.bottom = 0;
        this.euiLayer.addChild(this.loadingView);

        //初始化Resource资源加载库
        var gameResPath = "resource/";
        App.ResourceUtils.addConfig(gameResPath + "default_wanba.res.json", gameResPath);
        App.ResourceUtils.addConfig(gameResPath + Common.getGameResConfig(), gameResPath);
        App.ResourceUtils.loadConfig(this.onConfigComplete, this);
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        App.ResourceUtils.loadGroup("preload", this.onResourceLoadComplete, this.onResourceProgress, this, this.onResourceError);
    }

    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(groupName: string): void {
        if (groupName == "preload") {

            //解析龙骨动画
            let dbConfig = RES.getRes("dbAssetConfig_json");
            AssetManager.loadDBAnimation(dbConfig.db["0"]);

            //EasyLoading初始化
            EasyLoading.init();

            //配置文件初始化
            DataCenter.instance.initConfig(RES.getRes("gameConfig_json"));

            //进行平台登录
            this.startPlatformLogin();
        }
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(itemsLoaded: number, itemsTotal: number): void {
        this.loadingView.setBaseProgress(itemsLoaded, itemsTotal);
    }

    /**
     * 资源加载失败
     */
    private onResourceError(): void {
        this.showErrorMsg_Loading("基础资源加载失败");
    }

    //开始平台登录
    private startPlatformLogin(): void {
        //添加消息监听
        this.initMessage();

        //进行平台登录
        this.platformLogin();
    }

    //消息接听初始化
    private initMessage(): void {
        //Socket连接成功消息
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, this.connectSocketSuccess, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, this.connectSocketClose, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, this.connectSocketError, this);
        // ErrCode处理
        App.MessageCenter.addListener(Proto.ID_error_notice_s2c, this.errorS2C, this);
        App.MessageCenter.addListener(Proto.ID_game_join_s2c, this.joinServerS2C, this);
        App.MessageCenter.addListener(Proto.ID_game_otherUserJoin_notice_s2c, this.otherUserJoinS2C, this);
        App.MessageCenter.addListener(Proto.ID_platform_login_s2c, this.platformLoginS2C, this);
    }

    //平台数据初始化
    private platformLogin(): void {
        this.loadingView.setProgressText("获取平台用户数据...");
        //根据平台用户数据进行登录
        Platform.curPlatform.login((success) => {
            if (!success) {
                this.loadingView.setProgressText("获取平台用户数据失败...");
                return;
            }

            //获取要连接的服务器
            this.loadingView.setProgressText("获取服务器地址...");
            var roomId = Platform.curPlatform.platformData.roomId;
            ProxyHttp.getGameServer(roomId, (data) => {
                this.connectServer(data.data);
            })
        })
    }

    //连接服务器
    private connectServer(connectorServer: any): void {
        //Socket初始化，并进行连接
        if (!connectorServer.hasOwnProperty("useSSL")) {
            connectorServer.useSSL = true;
        }
        ProxySocket.init(connectorServer.host, connectorServer.port, connectorServer.useSSL);
        Common.ServerIndex = connectorServer.sindex;
        this.loadingView.setProgressText("开始传送...");
    }

    //连接关闭
    private connectSocketClose() {
        var errMsg: string = "与服务器断开连接";
        if (Game.getInstance().isInit) {
            Common.showErrorMsg_Game(errMsg);
        } else {
            this.showErrorMsg_Loading(errMsg);
        }
    }

    //连接失败
    private connectSocketError() {
        this.showErrorMsg_Loading("服务器连接失败");
    }

    //连接Socket服务器成功，进行登录
    private connectSocketSuccess(): void {
        this.loadingView.setProgressText("努力传送中...");
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
            //chatId设置
            App.CurrChatId = Common.createChatId([user.id, otherUser.id]);
        }

        //开启游戏加载
        this.loadingView.startGameLoad();

        //统计
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
    }

    // ErrCode处理
    private errorS2C(data: error_notice_s2c): void {
        // ERR_SYSTEM_PARAM = 2000 //参数错误

        // ERR_ROOM_NotExists      = 3002 //房间不存在
        // ERR_ROOM_NoState        = 3004 //房间状态不对
        // ERR_ROOM_NoUser         = 3006 //用户不存在

        // ERR_JOIN_ROOM_NotExists = 3007 //房间不存在或已经过期

        // ERR_PlatformLoginFail = 4001 //平台登录失败

        if (data.errorCode == 1999) {
            //系统错误，服务器未启动
            App.Socket.close();
        }
        else if (data.errorCode == 4001) {
            //平台登录失败
            this.showErrorMsg_Loading("平台登录失败...");
        }
        else if (data.errorCode == 3007) {
            //加入房间时，房间不存在或已过期
            this.showErrorMsg_Loading("房间不存在或已过期...");
        }
        else if (data.errorCode == 3008) {
            // 3008错误码处理
            egret.ExternalInterface.call('callNativeGameError', '1');
        }
    }

    //错误信息显示
    private showErrorMsg_Loading(msg: string): void {
        //显示信息
        msg = msg + "(" + Common.ServerIndex + ")";
        this.loadingView.setProgressText(msg);
        //返回平台
        App.TimerManager.doTimer(2000, 1, () => {
            Platform.curPlatform.gameOver(1);
        }, this);
    }
}


