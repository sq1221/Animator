/**
 * Created by yangsong on 16/1/24.
 */
class game_event_notice_s2c {
	public msgId:number = 3010;
	public userId:string = '';
	public event:string = '';
	public trunNum:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.userId);
		Msg.encode(buff, 'string', this.event);
		Msg.encode(buff, 'uint32', this.trunNum);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.userId = Msg.decode(buff, 'string');
		this.event = Msg.decode(buff, 'string');
		this.trunNum = Msg.decode(buff, 'uint32');
	
    }
}
