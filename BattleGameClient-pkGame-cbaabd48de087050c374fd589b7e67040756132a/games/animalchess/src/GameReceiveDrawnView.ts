class GameReceiveDrawnView extends EuiComponent {
    public btn_refuse: eui.Button;
    public btn_agree: eui.Button;
    DrawnGroup: eui.Group;

    waitDrawnAnswer: eui.Image;
    drawnRefuseAnswer: eui.Image;

    chijiLogo: eui.Image;
    drawnLogo: eui.Image;
    failureLogo: eui.Image;


    public constructor() {
        super(GameAnimalChessReceiveDrawn);
    }

    showDrawnGroup = () => {
        this.hide();
        this.visible = true;
        this.DrawnGroup.visible = true;
    }

    showWaitDrawnAnswer = () => {
        this.hide();
        this.visible = true;
        this.waitDrawnAnswer.visible = true;
    }
    showDrawnRefuseAnswer = () => {
        this.hide();
        this.visible = true;
        this.drawnRefuseAnswer.visible = true;
    }
    showchiji = (delayTime: number) => {
        this.hide();
        this.visible = true;
        this.chijiLogo.visible = true;
        this.chijiLogo.scaleX = this.chijiLogo.scaleY = 1.2;
        egret.Tween.get(this.chijiLogo).to({ scaleX: 1, scaleY: 1 }, delayTime / 4, egret.Ease.bounceOut).wait(delayTime / 4 * 3);
    }
    showDrawn = (delayTime: number) => {
        this.hide();
        this.visible = true;
        this.drawnLogo.visible = true;
        this.drawnLogo.scaleX = this.drawnLogo.scaleY = 1.2;
        egret.Tween.get(this.drawnLogo).to({ scaleX: 1, scaleY: 1 }, delayTime / 4, egret.Ease.bounceOut).wait(delayTime / 4 * 3)
    }
    showFailure = (delayTime: number) => {
        this.hide();
        this.visible = true;
        this.failureLogo.visible = true;
        this.failureLogo.scaleX = this.failureLogo.scaleY = 1.2;
        egret.Tween.get(this.failureLogo).to({ scaleX: 1, scaleY: 1 }, delayTime / 4, egret.Ease.bounceOut).wait(delayTime / 4 * 3)
    }
    hide = () => {
        this.failureLogo.visible = this.drawnLogo.visible = this.chijiLogo.visible = this.drawnRefuseAnswer.visible = this.DrawnGroup.visible = this.waitDrawnAnswer.visible = false;
        this.visible = false;
    }
}