/**
 * Created by yangsong on 16/1/24.
 */
class game_matching_c2s {
	public msgId:number = 3013;
	public gameId:number = 0;
	public userId:string = '';
	public userName:string = '';
	public userPic:string = '';
	public userSex:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'ushort', this.gameId);
		Msg.encode(buff, 'string', this.userId);
		Msg.encode(buff, 'string', this.userName);
		Msg.encode(buff, 'string', this.userPic);
		Msg.encode(buff, 'byte', this.userSex);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.gameId = Msg.decode(buff, 'ushort');
		this.userId = Msg.decode(buff, 'string');
		this.userName = Msg.decode(buff, 'string');
		this.userPic = Msg.decode(buff, 'string');
		this.userSex = Msg.decode(buff, 'byte');
	
    }
}
