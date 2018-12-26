/**
 * Created by yangsong on 15-3-25.
 */
class ByteArrayMsgByProto extends ByteArrayMsg {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 消息解析
     * @param msg
     */
    public decode(msg:any):any {
        msg.position = 0;
        if(msg.bytesAvailable == 0){
            console.log("收到空消息");
            return null;
        }
        var len = msg.readUnsignedShort();
        if (msg.bytesAvailable >= len) {
            var bytes:egret.ByteArray = new egret.ByteArray();
            msg.readBytes(bytes, 0, len);

            var msgObj = App.Proto.decode(bytes);
            var obj:any = {};
            obj.key = msgObj.msgId.toString();
            obj.body = msgObj;
            return obj;
        }
        return null;
    }

    /**
     * 消息封装
     * @param msg
     */
    public encode(msg:any):any {
        var msgBody = msg.encode();
        var len = msgBody.length;

        var sendMsg:egret.ByteArray = new egret.ByteArray();
        sendMsg.writeUnsignedShort(len);
        sendMsg.writeBytes(msgBody);
        return sendMsg;
    }
}