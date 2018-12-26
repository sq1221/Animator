/**
 * Created by yangsong on 16/1/24.
 */
class game_event_c2s {
	public msgId:number = 3009;
	public roomId:string = '';
	public sendType:number = 0;
	public event:string = '';


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.roomId);
		Msg.encode(buff, 'byte', this.sendType);
		Msg.encode(buff, 'string', this.event);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.roomId = Msg.decode(buff, 'string');
		this.sendType = Msg.decode(buff, 'byte');
		this.event = Msg.decode(buff, 'string');
	
    }
}
