/**
 * 电脑人
 */
class GameTwiceJoyAI extends egret.DisplayObjectContainer {

    // 翻翻乐游戏主类
    public gameTwiceJoyMainView: GameTwiceJoyMainView;
    // 机器人等级
    public static robotAiLv: number = 3;
    public static robotSec: number = 0;

    // 5级AI
    public setTimeoutBool: boolean = false;// 随机间隔执行动作
    public intervalIdRobotAiKey: number = 0;
    public setTimeoutIdRobotAiKey: number = 0;

    public constructor(gameInstance: GameTwiceJoyMainView) {
        super();
        // 游戏主类
        this.gameTwiceJoyMainView = gameInstance;
    }

    // 检测分数
    public checkResultScore = (): void => {
        // 不超过最大分数
        if (this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore >= GameTwiceJoyModel.resultScore) {
            this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore = GameTwiceJoyModel.resultScore;
        }
        // 进度条移动
        this.gameTwiceJoyMainView.playerAvatarGroup2.right = this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
        this.gameTwiceJoyMainView.blueProgress.width = this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
        // 先到达分数者胜出
        this.gameTwiceJoyMainView.arriveScore();
    }

    // 根据等级切换不同状态下的Ai
    public robotAiStart(): void {
        // 根据等级
        // if (GameTwiceJoyAI.robotAiLv == 5) {
        //     this.aiWin();
        // } else if (GameTwiceJoyAI.robotAiLv == 4) {
        //     this.hardModel();
        // } else if (GameTwiceJoyAI.robotAiLv <= 3) {
        //     // 简单模式
        //     this.hardModel();
        // }
        // 小米AI方向
        var conf = GameTwiceJoyMainView.aiConf[GameTwiceJoyAI.robotAiLv + ""];
        GameTwiceJoyAI.robotSec = conf.s + Math.random() * conf.r;
        this.hardModel();
    }

    // 5级必赢模式
    public aiWin(): void {
        this.intervalIdRobotAiKey = egret.setInterval(() => {
            // 当前玩家分数
            let playerNowScore = this.gameTwiceJoyMainView.gameTwiceJoyModel.myScore;
            // 当前AI分数
            let aINowScore = this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore;

            // 让Ai保持领先
            if ((aINowScore - playerNowScore) <= 2 && playerNowScore > 0) {
                // 更新对方分数
                this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                // 检测结果
                this.checkResultScore();
            } else {
                if (this.setTimeoutBool) {
                    return;
                }
                // 加分
                this.setTimeoutBool = true;

                this.setTimeoutIdRobotAiKey = egret.setTimeout(() => {
                    // 加分
                    this.setTimeoutBool = false;
                    // 更新对方分数
                    this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                    // 检测结果
                    this.checkResultScore();
                }, this, 1800 + Math.random() * 3000);
            }
        }, this, 100);
    }

    // 4级 稳定输出 3级及以下
    public hardModel(): void {
        this.intervalIdRobotAiKey = egret.setInterval(() => {
            // 加分条件
            if (this.setTimeoutBool) {
                return;
            }
            this.setTimeoutBool = true;

            this.setTimeoutIdRobotAiKey = egret.setTimeout(() => {
                // 加分条件
                this.setTimeoutBool = false;
                // 对应等级
                // if (GameTwiceJoyAI.robotAiLv == 4) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                // } else if (GameTwiceJoyAI.robotAiLv == 3) {
                //     // 一定概率加分
                //     let isAddScore = Math.ceil(Math.random() * 10);
                //     //if (isAddScore >= 2) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                //     //}
                // } else if (GameTwiceJoyAI.robotAiLv == 2) {
                //     // 一定概率加分
                //     let isAddScore = Math.ceil(Math.random() * 10);
                //     // if (isAddScore >= 2) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                //     //}
                // } else if (GameTwiceJoyAI.robotAiLv == 1) {
                //     // 一定概率加分
                //     let isAddScore = Math.ceil(Math.random() * 10);
                //     //if (isAddScore >= 2) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                //     // }
                // }
                // 更新对方分数
                this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                // 检测结果                         
                this.checkResultScore();
            }, this, GameTwiceJoyAI.robotSec);
        }, this, 500);
    }

    // 清楚数据
    public clearData(): void {
        // 清除5级AI循环监听
        this.setTimeoutBool = false;
        egret.clearInterval(this.intervalIdRobotAiKey);
        egret.clearTimeout(this.setTimeoutIdRobotAiKey);
    }
}