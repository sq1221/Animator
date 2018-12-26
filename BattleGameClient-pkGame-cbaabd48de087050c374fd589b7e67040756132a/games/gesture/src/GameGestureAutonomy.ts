class GameGestureAutonomy {
    public constructor() {
    }

    private get successRate(): number {
        let num: number;
        switch (App.CurrGameAiLevel) {
            case 1:
                num = 0.66;
                break;
            case 2:
                num = 0.72;
                break;
            case 3:
                num = 0.78;
                break;
            case 4:
                num = 0.84;
                break;
            case 5:
                num = 0.9;
                break;
        }

        return num;
    }

    private autonomyTick = (): boolean => {

        return false;
    }

    public start = () => {
        App.TimerManager.doTimer
        egret.startTick(this.autonomyTick, this);
    }

    public stop = () => {
        egret.stopTick(this.autonomyTick, this);
    }

    public addItem = (time: number) => {
        let item = new simulateItem();
        let tw = egret.Tween.get(item);
        tw.to({ y: 960 }, time)
        let probability = Math.random();
        if (probability > 0 && probability <= this.successRate) {
            tw.call(() => {

            });
        } else {
            tw.call(() => {
                GameGestureItemClass.rightHealthCtrlor.subtractHealth();
            });
        }

    }
}

class simulateItem {
    private needJudge = true;
    public y: number = 0;

    public constructor() {

    }

    public startJudge = () => {
        this.needJudge = true;
        App.TimerManager.doFrame(1, 0, this.judgeTick, this);
    }

    public judgeTick = () => {
        if (GameGestureItemClass.otherlowest < this.y) {
            GameGestureItemClass.otherlowest = this.y;
        }
    }
}