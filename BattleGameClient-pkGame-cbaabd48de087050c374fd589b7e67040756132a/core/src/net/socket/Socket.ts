/**
 * Created by yangsong on 2014/11/25.
 * Socket类
 */
class Socket extends BaseClass {

    private _needReconnect: boolean = true;

    private _isConnected: boolean;
    private _host: string;
    private _port: any;
    private _useSSL: boolean;
    private _socket: egret.WebSocket;
    private _msg: BaseMsg;
    private _isConnecting: boolean;


    /**
     * 添加事件监听
     */
    private addEvents() {
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    }

    /**
     * 移除事件监听
     */
    private removeEvents(): void {
        this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    }

    /**
     * 服务器连接成功
     */
    private onSocketOpen(): void {
        this._isConnecting = true;
        if (this._isConnected) {
            App.MessageCenter.dispatch(SocketConst.SOCKET_RECONNECT);
        } else {
            App.MessageCenter.dispatch(SocketConst.SOCKET_CONNECT);
        }
        this._isConnected = true;
    }


    /**
     * 服务器断开连接
     */
    private onSocketClose(): void {
        if (this._needReconnect) {
            this.reconnect();
        } else {
            this.removeEvents();
            App.MessageCenter.dispatch(SocketConst.SOCKET_CLOSE);
        }
        this._isConnecting = false;
    }

    /**
     * 服务器连接错误
     */
    private onSocketError(): void {
        if (this._needReconnect) {
            this.reconnect();
        } else {
            this.removeEvents();
            App.MessageCenter.dispatch(SocketConst.SOCKET_NOCONNECT);
        }
        this._isConnecting = false;
    }

    /**
     * 收到服务器消息
     * @param e
     */
    private onReceiveMessage(e: egret.Event): void {
        this._msg.receive(this._socket);
    }

    /**
     * 初始化服务区地址
     * @param host IP
     * @param port 端口
     * @param msg 消息发送接受处理类
     */
    public initServer(host: string, port: any, useSSL: boolean, msg: BaseMsg, needReconnect: boolean = true): void {
        this._host = host;
        this._port = port;
        this._useSSL = useSSL;
        this._msg = msg;
        this._needReconnect = needReconnect;
    }

    /**
     * 开始Socket连接
     */
    public connect(): void {
        //防止socket的重复创建，容错处理
        if (this._isConnecting) {
            this.close();
        }

        this._socket = new egret.WebSocket();
        if (this._msg instanceof ByteArrayMsg) {
            this._socket.type = egret.WebSocket.TYPE_BINARY;
        }
        // console.log("WebSocket: " + this._host + ":" + this._port);
        this.addEvents();
        if (this._useSSL) {
            this._socket.connectByUrl("wss://" + this._host + ":" + this._port);
        } else {
            this._socket.connectByUrl("ws://" + this._host + ":" + this._port);
        }
    }

    /**
     * 重新连接
     */
    public reconnect(): void {
        App.TimerManager.remove(this.connect, this);

        App.MessageCenter.dispatch(SocketConst.SOCKET_START_RECONNECT);
        App.TimerManager.doTimer(1000, 1, this.connect, this);
    }

    /**
     * 发送消息到服务器
     * @param msg
     */
    public send(msg: any): void {
        if (!this._isConnecting) {
            console.log('socket尚未连接！');
            return;
        }
        this._msg.send(this._socket, msg);
    }

    /**
     * 关闭Socket连接
     */
    public close(): void {
        this._socket.close();
    }

    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
    public isConnecting(): boolean {
        return this._isConnecting;
    }

    /**
     * Socket是否已经连接过
     * @returns {boolean}
     */
    public isConnected(): boolean {
        return this._isConnected;
    }

    /**
     * Debug信息
     * @param str
     */
    private debugInfo(str: String): void {
        App.MessageCenter.dispatch(SocketConst.SOCKET_DEBUG_INFO, str);
    }

}