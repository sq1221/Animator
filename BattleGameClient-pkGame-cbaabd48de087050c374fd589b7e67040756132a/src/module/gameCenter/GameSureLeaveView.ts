// TypeScript file
class GameSureLeaveView extends StateEui {
    public btn_cancel: eui.Button;
    public btn_sure: eui.Button;
    public constructor() {
        super(GameSureLeaveSkin);
    }

    public init(): void {
        super.init();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuit, this);
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
    }

    public show(): void {
        super.show();
    }

    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
        //收到发送游戏结果
        App.MessageCenter.addListener(EventMessage.SendGameResultC2S, this.onCancel, this);
    }

    public dispose(): void {
        super.dispose();
    }

    public onCancel() {
        this.close();
    }

    private onQuit(e): void {
        this.close();
        // 背景音乐停止
        App.SoundManager.stopBg();

        // 发送退出游戏事件
        App.MessageCenter.dispatch(EventMessage.GameLeave);

        // 退出游戏 socket是否连接
        if (!App.Socket.isConnecting()) {
            Game.getInstance().leaveGame();
        } else {
            ProxySocket.exitGame(App.CurrRoomId);
        }
    }
}