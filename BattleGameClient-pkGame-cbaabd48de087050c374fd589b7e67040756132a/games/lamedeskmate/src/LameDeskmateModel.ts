/**
 * 互怼校园
*/

class LameDeskmateModel extends egret.DisplayObjectContainer {

    public static EVENT_HIT: string = "EVENT_HIT";// 攻击
    public static EVENT_BEHIT: string = "EVENT_BEHIT";// 被攻击
    public static EVENT_MAKEFUN: string = "EVENT_MAKEFUN";// 嘲笑
    public static EVENT_BE_FOUND: string = "EVENT_BE_FOUND";// 被发现

    public static STATUS_ISSCOLDED: string = "isScolded";// 被发现
    public static STATUS_MAKEFUN: string = "makeFun";// 嘲讽
    public static STATUS_DAIJI: string = "sweepFloor";// 静坐

    public static GET_HOST_PC: string = "GET_HOST_PC";// 获取主机

    public static resultScore: number = 1500;// 设置优先达到分数获胜值
    public myScore: number = 0;// 我的分数
    public otherScore: number = 0;// 对方分数


    public constructor() {
        super();
        // 初始化数据
        this.myScore = 0;
        this.otherScore = 0;
    }
}