/**
 * 翻翻乐model
 */

class GameTwiceJoyModel {

    public static CARD_MATCH_SUCCESS: string = "CARD_MATCH_SUCCESS";// 消除成功
    public static SEND_EXPRESS: string = "SEND_EXPRESS";// 发送表情

    public static random: Function;// 随机种子函数
    public twiceMapData: number[] = [];// 地图数据

    public static resultScore: number = 12;// 优先配对成功总数
    public myScore: number = 0;// 我的分数
    public otherScore: number = 0;// 对方分数


    public constructor() {
        // 初始化分数
        this.myScore = 0;
        this.otherScore = 0;
    }

    // 地图初始化
    public mapInit() {
        // 清空上一次地图数据
        this.twiceMapData.splice(0);
        this.twiceMapData = [];

        // 临时地图数据
        let mapData = [];
        // 取8个
        let twiceTypeNum: number[] = [1, 5, 2, 6, 3, 7, 4, 8];// 地图类型
        for (var i: number = 0; i < 8; i++) {
            let index = Math.floor(GameTwiceJoyModel.random() * twiceTypeNum.length);
            // 地图数据
            mapData.push(twiceTypeNum[index]);
            mapData.push(twiceTypeNum[index]);
            // 清除已经取出的
            twiceTypeNum.splice(index, 1);
        }
        // 取4个
        let twiceTypeNum2: number[] = [1, 5, 2, 6, 3, 7, 4, 8];// 地图类型
        for (var m: number = 0; m < 4; m++) {
            let index = Math.floor(GameTwiceJoyModel.random() * twiceTypeNum2.length);
            // 地图数据
            mapData.push(twiceTypeNum2[index]);
            mapData.push(twiceTypeNum2[index]);
            // 清除已经取出的
            twiceTypeNum2.splice(index, 1);
        }
        // 最终地图数据
        for (var n: number = 0; n < 24; n++) {
            let index = Math.floor(GameTwiceJoyModel.random() * mapData.length);
            // 地图数据
            this.twiceMapData.push(mapData[index]);
            mapData.splice(index, 1);
        }
    }
}