/**
 * Created by yangsong on 16/1/24.
 */
class client_ping_c2s {
	public msgId:number = 1000;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
	
    }
}
