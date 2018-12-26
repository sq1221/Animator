class User extends egret.EventDispatcher{

    public static EVENT_LOAD_COMPLETE:string = "EVENT_LOAD_COMPLETE";

    public static STATUS_IDLE:number = 0;// 空闲状态
    public static STATUS_ROOM:number = 1; //在房间里等待匹配
    public static STATUS_MATCHING:number = 2; //在房间里匹配中
    public static STATUS_GAME_LOADING:number = 3; //游戏加载中
    public static STATUS_GAMING:number = 4; //正在游戏中
    public static STATUS_GAME_RESULT:number = 5; //游戏结算中

    public uuid:string;
    public id:string;
    public name:string = "";
    public sex:number = 0;
    public imgUrl:string = "";
    public country:string = "";
    public province:string = "";
    public city:string = "";
    public curAvatarType:number;
    public flowers:number;
    public money:number = 0;
    public exp:number = 0;
    public guide:number = 0;
    public constellatory:number = 0;
    public barrage_num:number = 0;


    public status:number = 0;
    public roomId:number = -1;
    public gameId:number = -1;

    constructor(id:string){
        super();
        this.id = id;
    }

}