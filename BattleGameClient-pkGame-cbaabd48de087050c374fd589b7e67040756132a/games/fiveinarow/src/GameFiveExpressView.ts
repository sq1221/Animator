// TypeScript file
class GameFiveExpressView extends EuiComponent {
    public gp_game: eui.Group;
    public gp_red: eui.Group;
    public gp_sum: eui.Group;
    public gp_lose: eui.Group;
    public gp_chess: eui.Group;
    public gp_tipMessage: eui.Group;
    public btn_return: eui.Button;
    public btn_sum: eui.Button;
    public btn_lose: eui.Button;
    public btn_express1: eui.Button;
    public btn_express2: eui.Button;
    public btn_express3: eui.Button;
    public btn_express4: eui.Button;
    public btn_express5: eui.Button;
    public btn_express6: eui.Button;

    public btn_sumNo: eui.Button;
    public btn_sumYes: eui.Button;
    public btn_loseNo: eui.Button;
    public btn_loseYes: eui.Button;

    public img_head_1: eui.Image;
    public img_head_2: eui.Image;
    public img_sex1: eui.Image;
    public img_sex2: eui.Image;
    public img_Chesstype1: eui.Image;
    public img_Chesstype2: eui.Image;
    public img_aperture_1: eui.Image;
    public img_aperture_2: eui.Image;
    public bg_wait: eui.Image;

    public img_red: eui.Image;

    public lb_name1: eui.Label;
    public lb_name2: eui.Label;
    public lb_time: eui.Label;
    public lb_tip: eui.Label;
    public lb_untouch: eui.Label;
    public numTimeRefuseSum: number = 5;//五秒后自动同意
    public playerHead1: RoleHeadImage;// 头像
    public playerHead2: RoleHeadImage;// 头像
    public playerAvatarGroup1: eui.Group;
    public playerAvatarGroup2: eui.Group;

    public lb_lose: eui.Label;
    public lb_loseDescribe: eui.Label;
    public lb_sum: eui.Label;
    public lb_sumDescribe: eui.Label;

    public constructor() {
        super(GameFiveExpressSkin);
        this.btn_sumNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelSum, this);
        this.btn_loseNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelLose, this);

        let ArrMessage = RES.getRes("FiveinARowMessage_json")["euiMessage"];
        this.lb_sum.text = ArrMessage["1001"];
        this.lb_sumDescribe.text = ArrMessage["1002"];
        this.lb_lose.text = ArrMessage["1003"];
        this.lb_loseDescribe.text = ArrMessage["1004"];
        this.btn_loseYes["label"] = ArrMessage["1005"];
        this.btn_loseNo["label"] = ArrMessage["1006"];
        this.btn_sumYes["label"] = ArrMessage["1007"];
        
        switch (App.Language) {
            case LanguageType.En:
                this.lb_sumDescribe.size = 18;
                this.lb_loseDescribe.size = 24;
                break;
        }

    }
    //取消求和
    public onCancelSum() {
        this.gp_sum.visible = false;
        switch (App.Language) {
            case LanguageType.Ch:
                this.btn_sumNo["label"] = "拒绝(5秒)";
                break;
            case LanguageType.En:
                this.btn_sumNo["label"] = "refuse(5s)";
                break;
        }


    }

    //取消认输 
    public onCancelLose() {
        this.gp_lose.visible = false;
    }
}