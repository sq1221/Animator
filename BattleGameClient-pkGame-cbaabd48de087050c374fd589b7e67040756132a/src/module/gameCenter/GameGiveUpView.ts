class GameGiveUpView extends StateEui {
    public btn_cancel: eui.Button;
    public btn_sure: eui.Button;
    private GiveUpGroup: eui.Group;
    public constructor() {
        super(GameGiveUp);
    }

    public init(): void {
        super.init();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuit, this);
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
    }

    public show(): void {
        super.show();
        this.GiveUpGroup.scaleX = this.GiveUpGroup.scaleY = 0.3;
        egret.Tween.get(this.GiveUpGroup).to({ scaleX: 1, scaleY: 1 }, 360, egret.Ease.bounceOut);
    }

    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
        // 监听离开游戏
        App.MessageCenter.addListener(EventMessage.gameCloseGiveUp, () => {
            this.close();
        }, this);
    }
    public dispose(): void {
        super.dispose();
    }

    public onCancel() {
        this.close();
    }

    private onQuit(e): void {
        this.close();
        App.MessageCenter.dispatch(EventMessage.GameGiveUp);
    }
}