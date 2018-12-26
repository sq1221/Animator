/**
 * Created by yangsong on 16/1/24.
 */
class game_loadProgress_notice_s2c {
	public msgId:number = 3002;
	public userId:string = '';
	public progress:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.userId);
		Msg.encode(buff, 'ushort', this.progress);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.userId = Msg.decode(buff, 'string');
		this.progress = Msg.decode(buff, 'ushort');
	
    }
}
