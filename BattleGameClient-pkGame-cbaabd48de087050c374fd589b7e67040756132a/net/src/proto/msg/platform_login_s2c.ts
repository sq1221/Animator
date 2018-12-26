/**
 * Created by yangsong on 16/1/24.
 */
class platform_login_s2c {
	public msgId:number = 2002;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
	
    }
}
