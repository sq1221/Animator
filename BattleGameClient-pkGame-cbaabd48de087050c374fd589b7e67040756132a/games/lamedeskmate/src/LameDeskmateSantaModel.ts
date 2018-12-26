/**
 * 老师，校长随机检测数据
 */
class LameDeskmateSantaModel extends egret.DisplayObjectContainer {

    public static STATUS_TEACHER_YUJING: string = "teacheryujing";// 老师 预警
    public static STATUS_TEACHER_XIAO: string = "teacherxiao";// 老师 笑
    public static STATUS_TEACHER_NU: string = "teachernu";// 老师 怒

    public static STATUS_HEADMASTER_YUJING: string = "headmasteryujing";// 校长 预警
    public static STATUS_HEADMASTER_XIAO: string = "headmasterxiao";// 校长 笑
    public static STATUS_HEADMASTER_NU: string = "headmasternu";// 校长 怒

    public static TEACHERS_ACTION_STATUS1: number = 1;// 老师
    public static TEACHERS_ACTION_STATUS2: number = 2;// 校长

    public static TEACHERS_COMEOUT: string = "TEACHERS_COMEOUT";// 老师，校长开始出现
    public static TEACHERS_ACTION_END: string = "TEACHERS_ACTION_END";// 老师，校长动画结束

    // 随机预警动画 1代表老师 2代表校长 
    public checkActions: number[] = [1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1];


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