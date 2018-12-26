/**
 * Created by egret on 15-7-15.
 */
class ProxySocket {
    /**
     * 初始化
     */
    public static init(host: string, port: any, useSSL: boolean): void {
        console.log("Socket.init: ", host, port, useSSL)
        App.Socket.initServer(host, port, useSSL, new ByteArrayMsgByProto(), false);

        function testClose(): void {
            // App.TimerManager.doTimer(10000, 1, () => {
            //     if(DataCenter.instance.user.name == "yangsong"){
            //         App.Socket.close();
            //     }
            // }, this)
        }
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, function (): void {
            console.log("SOCKET_CONNECT");
            testClose();
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_RECONNECT, function (): void {
            console.log("SOCKET_RECONNECT");
            testClose();
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_START_RECONNECT, function (): void {
            console.log("SOCKET_START_RECONNECT");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, function (): void {
            console.log("SOCKET_CLOSE");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_DATA, function (): void {
            console.log("SOCKET_DATA");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, function (): void {
            console.log("SOCKET_NOCONNECT");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_DEBUG_INFO, function (): void {
            console.log("SOCKET_DEBUG_INFO");
        }, this);

        App.Socket.connect();
    }

    //停止
    public static stop(): void {
        App.Socket["removeEvents"]();
        App.Socket.close();
        Socket["_instance"] = null;

        App.MessageCenter.removeAll(this);
        App.TimerManager.removeAll(this);
    }

    // 开启ping
    public static startPing(): void {
        App.TimerManager.doTimer(3000, 0, this.ping, this);
    }

    // 停止ping
    public static stopPing(): void {
        App.TimerManager.remove(this.ping, this);
    }


    //------------------------------------以下为业务逻辑代码--------------------------------------//
    //开始匹配
    public static startMatching(gameId: number, userId: string, userName: string, userPic: string, userSex: number): void {
        var sendMsg = new game_matching_c2s();
        sendMsg.gameId = gameId;
        sendMsg.userId = userId;
        sendMsg.userName = userName;
        sendMsg.userPic = userPic;
        sendMsg.userSex = userSex;
        App.Socket.send(sendMsg);
    }

    //取消匹配
    public static stopMatching(userId: string): void {
        var sendMsg = new game_cancelMatching_c2s();
        sendMsg.userId = userId;
        App.Socket.send(sendMsg);
    }

    //进入游戏
    public static joinGame(roomId: string): void {
        var sendMsg = new game_join_c2s();
        sendMsg.roomId = roomId;
        App.Socket.send(sendMsg);
    }

    //发送loading数据
    public static sendLoadProgress(roomId: string, progressNum: number): void {
        var sendMsg = new game_loadProgress_c2s();
        sendMsg.roomId = roomId;
        sendMsg.progress = progressNum;
        App.Socket.send(sendMsg);
    }

    //发送游戏内消息(sendType 1: 发送两人，2：发送另外一人)
    public static sendGameEvent(roomId: string, event: string, sendType: number = 2): void {
        var sendMsg = new game_event_c2s();
        sendMsg.roomId = roomId;
        sendMsg.sendType = sendType;
        sendMsg.event = event;
        App.Socket.send(sendMsg);
    }

    //发送游戏结果(赢的人发)
    public static sendGameResult(roomId: string, result: number): void {
        var sendMsg = new game_result_c2s();
        sendMsg.roomId = roomId;
        sendMsg.result = result;
        App.Socket.send(sendMsg);
    }

    //退出游戏
    public static exitGame(roomId: string): void {
        var sendMsg = new game_exit_c2s();
        sendMsg.roomId = roomId;
        App.Socket.send(sendMsg);
    }

    //ping
    public static ping(): void {
        var sendMsg = new client_ping_c2s();
        App.Socket.send(sendMsg);
    }

    //平台登录
    public static platformLogin(gameId: number, platformId: number, platformData: any): void {
        var sendMsg = new platform_login_c2s();
        sendMsg.gameId = gameId;
        sendMsg.platformId = platformId;
        sendMsg.platformData = JSON.stringify(platformData);
        App.Socket.send(sendMsg);
    }
}