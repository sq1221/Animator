/**
 * 圣诞老人随机检测数据
 */
class GameChristmasSantaModel extends egret.DisplayObjectContainer {

    public static STATUS_YANCONG_YUJING: string = "yancongyujing";// 烟囱 预警
    public static STATUS_YANCONG_XIAO: string = "yancongxiao";// 烟囱 笑
    public static STATUS_YANCONG_NU: string = "yancongnu";// 烟囱 怒

    public static STATUS_MEN_YUJING: string = "menyujing";// 门 预警
    public static STATUS_MEN_XIAO: string = "menxiao";// 门 笑
    public static STATUS_MEN_NU: string = "mennu";// 门 怒

    public static STATUS_LIHE_YUJING: string = "liheyujing";// 礼盒 预警
    public static STATUS_LIHE_XIAO: string = "lihexiao";// 礼盒 笑
    public static STATUS_LIHE_NU: string = "lihenu";// 礼盒 怒

    public static SANTA_ACTION_STATUS1: number = 1;// 烟囱
    public static SANTA_ACTION_STATUS2: number = 2;// 门
    public static SANTA_ACTION_STATUS3: number = 3;// 礼物盒

    public static SANTA_COMEOUT: string = "SANTA_COMEOUT";// 圣诞老人开始出现
    public static SANTA_ACTION_END: string = "SANTA_ACTION_END";// 圣诞动画结束

    // 随机预警动画 1代表烟囱 2代表门 3代表礼盒
    public checkActions: number[] = [1, 2, 3, 2, 3, 1, 3, 2, 1, 1, 2, 3, 2, 3, 1, 3, 2, 1, 2, 3, 2, 3, 1, 3, 2, 1];


    public constructor() {
        super();
        this.arrRandomByIndex(this.checkActions, 0, this.checkActions.length);
    }

    public arrRandom(arr: number[]): void {
        arr.sort(elementSort);
        function elementSort(elment1: any, element2: any): number {
            return (Math.random() > 0.5) ? 1 : -1;
        }
    }
    public arrRandomByIndex(arr: number[], startIndex: number, endIndex: number): void {
        var arrTemp: number[] = arr.slice(startIndex, endIndex);
        this.arrRandom(arrTemp);
        for (var i = 0; i < arrTemp.length; i++) {
            arr[startIndex + i] = arrTemp[i];
        }
    }
}