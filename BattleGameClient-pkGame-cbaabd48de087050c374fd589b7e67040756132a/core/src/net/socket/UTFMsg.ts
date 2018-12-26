/**
 * Created by yangsong on 15-2-11.
 */
class UTFMsg implements BaseMsg {
    /**
     * 构造函数
     */
    public constructor() {

    }

    /**
     * 接收消息处理
     * @param msg
     */
    public receive(socket:egret.WebSocket):void {
        var msg:string = socket.readUTF();
        var obj:any = this.decode(msg);
        if (obj) {
            if (DEBUG) {
                console.log("收到消息", obj);
            }
            // App.MessageCenter.dispatch(obj.key, obj.body);
            App.MessageCenter.dispatch(SocketConst.SOCKET_DATA, obj);
        }
    }

    /**
     * 发送消息处理
     * @param msg
     */
    public send(socket:egret.WebSocket, msg:any):void {
        if (DEBUG) {
            console.log("发送消息", msg);
        }
        var obj:any = this.encode(msg);
        if (obj) {
            socket.type = egret.WebSocket.TYPE_STRING;
            socket.writeUTF(obj);
        }
    }

    /**
     * 消息解析
     * @param msg
     */
    public decode(msg:any):any {
        Log.trace("decode需要子类重写，根据项目的协议结构解析");
        return null;
    }

    /**
     * 消息封装
     * @param msg
     */
    public encode(msg:any):any {
        Log.trace("encode需要子类重写，根据项目的协议结构解析");
        return null;
    }
}