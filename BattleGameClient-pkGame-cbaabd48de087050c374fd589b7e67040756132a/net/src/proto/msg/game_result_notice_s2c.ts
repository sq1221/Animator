/**
 * Created by yangsong on 16/1/24.
 */
class game_result_notice_s2c {
	public msgId:number = 3008;
	public winUserId:string = '';
	public userExitFlag:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'ushort', this.msgId);
		Msg.encode(buff, 'string', this.winUserId);
		Msg.encode(buff, 'byte', this.userExitFlag);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.msgId = Msg.decode(buff, 'ushort');
		this.winUserId = Msg.decode(buff, 'string');
		this.userExitFlag = Msg.decode(buff, 'byte');
	
    }
}
