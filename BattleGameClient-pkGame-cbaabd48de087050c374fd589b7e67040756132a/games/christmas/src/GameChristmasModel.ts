/**
 * 驯鹿大战
*/

class GameChristmasModel extends egret.DisplayObjectContainer {

    public static EVENT_THROW_SNOWBALL: string = "EVENT_THROW_SNOWBALL";// 扔雪球
    public static EVENT_MAKEFUN: string = "EVENT_MAKEFUN";// 嘲笑
    public static EVENT_GET_SNOWBALL: string = "EVENT_GET_SNOWBALL";// 被扔雪球
    public static EVENT_GET_MAKEFUN: string = "EVENT_GET_MAKEFUN";// 被嘲笑

    public static EVENT_BE_FOUND: string = "EVENT_BE_FOUND";// 被发现

    public static EVENT_GAME_START: string = "EVENT_GAME_START";
    public static EVENT_GAME_OVER: string = "EVENT_GAME_OVER";
    public static EVENT_WIN: string = "EVENT_WIN";
    public static EVENT_LOSE: string = "EVENT_WIN";

    public static STATUS_BEATING: string = "beating";// 被打
    public static STATUS_ISSCOLDED: string = "isScolded";// 被发现
    public static STATUS_MAKEFUN: string = "makeFun";// 嘲讽
    public static STATUS_SWEEPFLOOR: string = "sweepFloor";// 扫雪
    public static STATUS_THROW_SNOWBALL: string = "throwSnowBall";// 扔雪球

    public static GET_HOST_PC: string = "GET_HOST_PC";// 获取主机
    public static GAMEOVER_AND_STEPSCORE: string = "GAMEOVER_AND_STEPSCORE";// 游戏结束并同步分数

    public static resultScore: number = 150;// 设置优先达到分数获胜值
    public myScore: number = 0;// 我的分数
    public otherScore: number = 0;// 对方分数


    public constructor() {
        super();
        // 初始化数据
        this.myScore = 0;
        this.otherScore = 0;
    }
}