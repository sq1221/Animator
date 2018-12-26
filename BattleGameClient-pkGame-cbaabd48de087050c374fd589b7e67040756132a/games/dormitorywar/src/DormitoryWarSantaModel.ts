/**
 * 舍友1，舍友2，宿管 随机检测数据
 */
class DormitoryWarSantaModel extends egret.DisplayObjectContainer {

    public static STATUS_UPLEFTSTUDENT_YUJING: string = "upLeftDaiji";// 上铺左 预警
    public static STATUS_UPLEFTSTUDENT_XIAO: string = "upLeftYujing";// 上铺左 笑
    public static STATUS_UPLEFTSTUDENT_NU: string = "upLeftFound";// 上铺左 怒

    public static STATUS_UPRIGHTSTUDENT_YUJING: string = "upRightDaiji";// 上铺右 预警
    public static STATUS_UPRIGHTSTUDENT_XIAO: string = "upRightYujing";// 上铺右 笑
    public static STATUS_UPRIGHTSTUDENT_NU: string = "upRightFound";// 上铺右 怒

    public static STATUS_TEACHER_YUJING: string = "suGuanDaiji";// 宿管 预警
    public static STATUS_TEACHER_XIAO: string = "suGuanYujing";// 宿管 笑
    public static STATUS_TEACHER_LEFTNU: string = "suGuanLeftFound";// 宿管 左怒
    public static STATUS_TEACHER_RIGHTNU: string = "suGuanRightFound";// 宿管 右怒
    public static STATUS_TEACHER_ALLNU: string = "suGuanAllFound";// 宿管 双怒

    public static TEACHERS_ACTION_STATUS1: number = 1;// 上铺左
    public static TEACHERS_ACTION_STATUS2: number = 2;// 上铺右
    public static TEACHERS_ACTION_STATUS3: number = 3;// 宿管

    public static TEACHERS_COMEOUT: string = "TEACHERS_COMEOUT";// 老师，校长开始出现
    public static TEACHERS_ACTION_END: string = "TEACHERS_ACTION_END";// 老师，校长动画结束

    // 随机预警动画 1上铺左 2上铺右 3宿管
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