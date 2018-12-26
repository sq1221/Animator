// TypeScript file
class GameResultView_Wanba extends StateEui {

    private gameOverResultData: any;// 游戏结算结果
    private gameCallBackFun: Function = null;// 回调函数

    public constructor() {
        super(GameResultXiaoMiViewSkin);
    }

    public init(): void {
        super.init();
    }

    public show(callBackFun: Function = null): void {
        super.show();
        // 是否有游戏内部结算结果
        this.gameCallBackFun = callBackFun || null;
        //战斗结果
        this.gameOverResultData = DataCenter.instance.room.gameResult;
        // 是否有内部结算
        if (this.gameCallBackFun) {
            // 回调事件
            this.gameCallBackFun();
            this.close();
            return;
        }
        // 游戏结算通知小米平台前端
        egret.setTimeout(() => {
            if (this.gameOverResultData.winUserId == "") {
                Platform.curPlatform.gameOver(2);
            }
            else if (this.gameOverResultData.winUserId == DataCenter.instance.user.id) {
                Platform.curPlatform.gameOver(3);
            }
            else {
                Platform.curPlatform.gameOver(1);
            }
            this.close();
        }, this, 1000);
    }

    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
    }

    public dispose(): void {
        super.dispose();
    }
}