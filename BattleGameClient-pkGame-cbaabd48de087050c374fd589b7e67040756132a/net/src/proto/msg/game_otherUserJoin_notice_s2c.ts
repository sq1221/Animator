/**
 * Created by yangsong on 16/1/24.
 */
class game_otherUserJoin_notice_s2c {
	public msgId:number = 3104;
	public otherUser:userInfo = new userInfo();


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'userInfo', this.otherUser);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.otherUser = Msg.decode(buff, userInfo);
	
    }
}
