/**
 * Created by yangsong on 16/1/24.
 */
class game_matching_notice_s2c {
	public msgId:number = 3016;
	public gameId:number = 0;
	public otherUserId:string = '';
	public otherUserName:string = '';
	public otherUserPic:string = '';
	public otherUserSex:number = 0;
	public isAi:number = 0;
	public aiLevel:number = 0;
	public roomId:string = '';


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'ushort', this.gameId);
		Msg.encode(buff, 'string', this.otherUserId);
		Msg.encode(buff, 'string', this.otherUserName);
		Msg.encode(buff, 'string', this.otherUserPic);
		Msg.encode(buff, 'byte', this.otherUserSex);
		Msg.encode(buff, 'byte', this.isAi);
		Msg.encode(buff, 'ushort', this.aiLevel);
		Msg.encode(buff, 'string', this.roomId);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.gameId = Msg.decode(buff, 'ushort');
		this.otherUserId = Msg.decode(buff, 'string');
		this.otherUserName = Msg.decode(buff, 'string');
		this.otherUserPic = Msg.decode(buff, 'string');
		this.otherUserSex = Msg.decode(buff, 'byte');
		this.isAi = Msg.decode(buff, 'byte');
		this.aiLevel = Msg.decode(buff, 'ushort');
		this.roomId = Msg.decode(buff, 'string');
	
    }
}
