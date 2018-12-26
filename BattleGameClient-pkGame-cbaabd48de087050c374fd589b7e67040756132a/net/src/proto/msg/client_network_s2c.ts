/**
 * Created by yangsong on 16/1/24.
 */
class client_network_s2c {
	public msgId:number = 1002;
	public time:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'uint32', this.time);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.time = Msg.decode(buff, 'uint32');
	
    }
}
