/**
 * 电脑人
 */
class DormitoryWarSantaAI extends egret.DisplayObjectContainer {

    // 暴走同桌游戏主类
    public gameChristmasMainView: DormitoryWarMainView;
    // 机器人的方向
    public robotAiDirection: number = 2;
    // 循环播放相应动作
    public intervalIdRobotAiKey: number = 0;
    // 老师出现之后循环播放相应动作
    public intervalSantaComeoutIdRobotAiKey: number = 0;
    // 记录机器人被嘲讽
    public robotBeMakeFun: boolean = false;
    // 记录机器人未被发现
    public robotNoBeFound: boolean = false;

    // settimeOut
    private actionTimeout: number = 0;
    // 机器人等级
    public static robotAiLv: number = 3;


    public constructor(gameInstance: DormitoryWarMainView, robotDirection: number) {
        super();
        // 游戏主类
        this.gameChristmasMainView = gameInstance;
        // 机器人方向
        this.robotAiDirection = robotDirection;
    }

    // 电脑人 攻击
    public robotThrowSnowBall(): void {
        // 电脑人分数
        this.gameChristmasMainView.dormitoryWarModel.otherScore++;
        this.gameChristmasMainView.playerScoreLab2.text = this.gameChristmasMainView.dormitoryWarModel.otherScore + "";
        // 是否达到目标分数
        this.gameChristmasMainView.arriveScore();
        // 攻击
        this.gameChristmasMainView.playerHitOther(this.robotAiDirection);
    }

    // 电脑人 嘲讽
    public robotMakeFun(): void {
        // 减分数
        this.gameChristmasMainView.dormitoryWarModel.myScore -= 2;
        if (this.gameChristmasMainView.dormitoryWarModel.myScore <= 0) {
            this.gameChristmasMainView.dormitoryWarModel.myScore = 0;
        }
        this.gameChristmasMainView.playerScoreLab1.text = this.gameChristmasMainView.dormitoryWarModel.myScore + "";
        // 嘲讽
        this.gameChristmasMainView.playerMakeFun(this.robotAiDirection);
        // 紫色熊播放被发现
        this.gameChristmasMainView.leftStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
        // 棕色熊播放嘲讽
        this.gameChristmasMainView.rightStudentAmiPlay(DormitoryWarModel.STATUS_MAKEFUN);
    }

    // 发送游戏结果
    public sendGameResult(): void {
        this.gameChristmasMainView.popup("GameResult");
    }

    //=====循环播放动画=====
    public randomPlayRobotAction(): void {
        this.SetTimeoutExample();
    }

    // clearSantaComeout
    public clearsantaComeoutHit(): void {
        egret.clearInterval(this.intervalSantaComeoutIdRobotAiKey);
    }
    // 预警之后
    public santaComeoutHit(): void {
        this.intervalSantaComeoutIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 200 + Math.ceil(Math.random() * 50));
    }

    // clearSantaComeout
    public clearSetTimeoutExample(): void {
        egret.clearInterval(this.intervalIdRobotAiKey);
    }
    // 随机间隔播放动画
    public SetTimeoutExample(): void {
        this.intervalIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 140 + (5 - DormitoryWarSantaAI.robotAiLv) * 60);
    }

    private myDelayedFunction(): void {

        // 机器人被嘲讽状态
        if (this.robotBeMakeFun == true) {
            // console.log("==状态==机器人  被嘲讽  状态");
            return;
        }

        // 笑，并没有被发现
        if (this.gameChristmasMainView.xiaoIsPlay && this.robotNoBeFound) {
            // console.log("==状态==机器人 笑，并没有被发现  状态");
            return;
        }

        // santa出现
        if (this.gameChristmasMainView.xiaoIsPlay && !this.robotNoBeFound) {
            // 40%-的犯错
            let robotError = Math.ceil(Math.random() * 10);
            if (robotError > 5 + DormitoryWarSantaAI.robotAiLv) {
                // 机器人被嘲讽
                this.robotBeMakeFun = true;
            } else {
                // 机器人未被发现
                this.robotNoBeFound = true;
            }
            return;
        }
        // 玩家被发现 开始嘲讽
        if (this.gameChristmasMainView.nuIsPlay && this.gameChristmasMainView.oneselfBeFound) {
            // console.log("==状态==机器人 嘲讽玩家  状态");
            this.robotMakeFun();
            return;
        }
        // 捣蛋
        this.robotThrowSnowBall();
    }

    // 清楚数据
    public clearData(): void {
        // 清楚循环播放动画
        egret.clearInterval(this.intervalIdRobotAiKey);
        egret.clearInterval(this.intervalSantaComeoutIdRobotAiKey);
    }
}