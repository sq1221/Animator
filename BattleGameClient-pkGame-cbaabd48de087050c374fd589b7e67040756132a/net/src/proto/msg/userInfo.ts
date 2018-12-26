/**
 * Created by yangsong on 16/1/24.
 */
class userInfo {
	public uuid:string = '';
	public userId:string = '';
	public userName:string = '';
	public userPic:string = '';
	public userSex:number = 0;
	public userProgress:number = 0;


    public encode():egret.ByteArray{
        var buff = new egret.ByteArray();
    	Msg.encode(buff, 'string', this.uuid);
		Msg.encode(buff, 'string', this.userId);
		Msg.encode(buff, 'string', this.userName);
		Msg.encode(buff, 'string', this.userPic);
		Msg.encode(buff, 'byte', this.userSex);
		Msg.encode(buff, 'ushort', this.userProgress);
	
        return buff;
    }

    public decode(buff:egret.ByteArray):void{
    	this.uuid = Msg.decode(buff, 'string');
		this.userId = Msg.decode(buff, 'string');
		this.userName = Msg.decode(buff, 'string');
		this.userPic = Msg.decode(buff, 'string');
		this.userSex = Msg.decode(buff, 'byte');
		this.userProgress = Msg.decode(buff, 'ushort');
	
    }
}
