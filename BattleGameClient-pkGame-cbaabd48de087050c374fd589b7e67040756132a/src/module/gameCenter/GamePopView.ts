// TypeScript file
class GamePopView extends StateEui {

    public static Popup(state:IState, msg:string, callBack:Function = null):void{
        state.popup("gamePopup", {
            msg: msg,
            callBack: callBack
        });
    }

    public lbl_msg: eui.Label;
    public btn_sure: eui.Button;
    private callBack:Function;

    public constructor() {
        super(GamePopSkin);
    }

    public init(): void {
        super.init();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    public show(param:any): void {
        super.show();

        this.lbl_msg.text = param.msg;
        this.callBack = param.callBack;
    }

    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
    }

    public dispose(): void {
        super.dispose();
    }

    public onClick():void{
        this.close();
        if(this.callBack){
            this.callBack();
            this.callBack = null;
        }
    }
}