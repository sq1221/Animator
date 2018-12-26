/**
 * Created by yangsong on 16/1/24.
 */
class game_result_c2s {
	public msgId:number = 3007;
	public roomId:string = '';
	public result:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.roomId);
		Msg.encode(buff, 'byte', this.result);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.roomId = Msg.decode(buff, 'string');
		this.result = Msg.decode(buff, 'byte');
	
    }
}
