/**
 * Created by yangsong on 16/1/24.
 */
class game_cancelMatching_c2s {
	public msgId:number = 3017;
	public userId:string = '';


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.userId);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.userId = Msg.decode(buff, 'string');
	
    }
}
