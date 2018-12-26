/**
 * Created by yangsong on 16/1/24.
 */
class game_exit_c2s {
	public msgId:number = 3005;
	public roomId:string = '';


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.roomId);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.roomId = Msg.decode(buff, 'string');
	
    }
}
