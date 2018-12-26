/**
 * Created by yangsong on 16/1/24.
 */
class platform_login_c2s {
	public msgId:number = 2001;
	public gameId:number = 0;
	public platformId:number = 0;
	public platformData:string = '';


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'ushort', this.gameId);
		Msg.encode(buff, 'ushort', this.platformId);
		Msg.encode(buff, 'string', this.platformData);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.gameId = Msg.decode(buff, 'ushort');
		this.platformId = Msg.decode(buff, 'ushort');
		this.platformData = Msg.decode(buff, 'string');
	
    }
}
