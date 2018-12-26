/**
 * Created by yangsong on 16/1/24.
 */
class game_loadProgress_c2s {
	public msgId:number = 3001;
	public roomId:string = '';
	public progress:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.roomId);
		Msg.encode(buff, 'ushort', this.progress);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.roomId = Msg.decode(buff, 'string');
		this.progress = Msg.decode(buff, 'ushort');
	
    }
}
