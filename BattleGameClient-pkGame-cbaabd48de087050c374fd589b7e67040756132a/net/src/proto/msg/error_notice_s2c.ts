/**
 * Created by yangsong on 16/1/24.
 */
class error_notice_s2c {
	public msgId:number = 1999;
	public errorCode:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'uint32', this.errorCode);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.errorCode = Msg.decode(buff, 'uint32');
	
    }
}
