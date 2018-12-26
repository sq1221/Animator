/**
 * Created by yangsong on 16/1/24.
 */
class game_trunNumNotice_s2c {
	public msgId:number = 3012;
	public trunNum:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'uint32', this.trunNum);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.trunNum = Msg.decode(buff, 'uint32');
	
    }
}
