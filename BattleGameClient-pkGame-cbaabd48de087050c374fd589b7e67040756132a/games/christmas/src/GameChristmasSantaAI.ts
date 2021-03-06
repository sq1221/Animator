/**
 * 电脑人
 */
class GameChristmasSantaAI extends egret.DisplayObjectContainer {

    // 鹿皇大战游戏主类
    public gameChristmasMainView: GameChristmasMainView;
    // 机器人的方向
    public robotAiDirection: number = 2;
    // 循环播放相应动作
    public intervalIdRobotAiKey: number = 0;
    // 圣诞出现之后循环播放相应动作
    public intervalSantaComeoutIdRobotAiKey: number = 0;
    // 记录机器人被嘲讽
    public robotBeMakeFun: boolean = false;
    // 记录机器人未被发现
    public robotNoBeFound: boolean = false;

    // settimeOut
    private actionTimeout: number = 0;
    // 机器人等级
    public static robotAiLv: number = 3;


    public constructor(gameInstance: GameChristmasMainView, robotDirection: number) {
        super();
        // 游戏主类
        this.gameChristmasMainView = gameInstance;
        // 机器人方向
        this.robotAiDirection = robotDirection;
    }

    // 电脑人 攻击
    public robotThrowSnowBall(): void {
        // 电脑人分数
        this.gameChristmasMainView.gameChristmasModel.otherScore++;
        this.gameChristmasMainView.playerScoreLab2.text = this.gameChristmasMainView.gameChristmasModel.otherScore + "";
        // 是否达到目标分数
        this.gameChristmasMainView.arriveScore();
        // 扔雪球
        this.gameChristmasMainView.playerThrowSnowBall(this.robotAiDirection);
    }

    // 电脑人 嘲讽
    public robotMakeFun(): void {
        // 减分数
        this.gameChristmasMainView.gameChristmasModel.myScore -= 2;
        if (this.gameChristmasMainView.gameChristmasModel.myScore <= 0) {
            this.gameChristmasMainView.gameChristmasModel.myScore = 0;
        }
        this.gameChristmasMainView.playerScoreLab1.text = this.gameChristmasMainView.gameChristmasModel.myScore + "";
        // 嘲讽
        this.gameChristmasMainView.playerMakeFun(this.robotAiDirection);
        // 紫色熊播放被发现
        this.gameChristmasMainView.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
        // 棕色熊播放嘲讽
        this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
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
    public clearsantaComeoutThrowBall(): void {
        egret.clearInterval(this.intervalSantaComeoutIdRobotAiKey);
    }
    // 圣诞老人预警之后
    public santaComeoutThrowBall(): void {
        this.intervalSantaComeoutIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 200 + Math.ceil(Math.random() * 50));
    }

    // clearSantaComeout
    public clearSetTimeoutExample(): void {
        egret.clearInterval(this.intervalIdRobotAiKey);
    }
    // 随机间隔播放动画
    public SetTimeoutExample(): void {
        this.intervalIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 140 + (5 - GameChristmasSantaAI.robotAiLv) * 60);
    }

    private myDelayedFunction(): void {

        // 机器人被嘲讽状态
        if (this.robotBeMakeFun == true) {
            // 棕色熊播放被发现
            this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
            return;
        }

        // 笑，并没有被发现
        if (this.gameChristmasMainView.xiaoIsPlay && this.robotNoBeFound) {
            return;
        }

        // santa出现
        if (this.gameChristmasMainView.xiaoIsPlay && !this.robotNoBeFound) {
            // 50%的犯错
            let robotError = Math.ceil(Math.random() * 10);
            if (robotError > 5 + GameChristmasSantaAI.robotAiLv) {
                // 笑播放完成   
                this.gameChristmasMainView.xiaoIsPlay = false;
                // 机器人被嘲讽
                this.robotBeMakeFun = true;
                // 棕色熊播放被发现
                this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                // 播放Santa发现动画
                if (!this.gameChristmasMainView.nuIsPlay) {
                    this.gameChristmasMainView.santaPlayNuAmiFun();
                }
                // 设置玩家的按钮状态
                this.gameChristmasMainView.btnsVisibleOrTouchEnabled(false, true);
            } else {
                // 机器人未被发现
                this.robotNoBeFound = true;
                // 棕色熊播放被发现
                this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
            return;
        }
        // 玩家被发现 开始嘲讽
        if (this.gameChristmasMainView.nuIsPlay && this.gameChristmasMainView.oneselfBeFound) {
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