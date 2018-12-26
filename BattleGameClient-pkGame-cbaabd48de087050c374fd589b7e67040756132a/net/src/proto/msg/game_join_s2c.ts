/**
 * Created by yangsong on 16/1/24.
 */
class game_join_s2c {
	public msgId:number = 3102;
	public myUser:userInfo = new userInfo();
	public otherUser:userInfo = new userInfo();
	public isAi:number = 0;
	public aiLevel:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'userInfo', this.myUser);
		Msg.encode(buff, 'userInfo', this.otherUser);
		Msg.encode(buff, 'ushort', this.isAi);
		Msg.encode(buff, 'ushort', this.aiLevel);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.myUser = Msg.decode(buff, userInfo);
		this.otherUser = Msg.decode(buff, userInfo);
		this.isAi = Msg.decode(buff, 'ushort');
		this.aiLevel = Msg.decode(buff, 'ushort');
	
    }
}
