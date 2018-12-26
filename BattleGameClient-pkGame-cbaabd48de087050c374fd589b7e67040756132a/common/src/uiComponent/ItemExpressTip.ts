class ItemExpressTip extends EuiItemRenderer {

    private btn_1: eui.Button;
    private btn_2: eui.Button;
    private btn_3: eui.Button;
    private btn_4: eui.Button;
    private btn_5: eui.Button;
    private btn_6: eui.Button;
    private btn_7: eui.Button;
    private btn_8: eui.Button;
    private btn_10: eui.Button;
    private btn_9: eui.Button;

    private btn_11: eui.Button;
    private btn_12: eui.Button;
    private btn_13: eui.Button;
    private btn_14: eui.Button;
    private btn_15: eui.Button;
    private btn_16: eui.Button;
    private btn_17: eui.Button;
    private btn_18: eui.Button;
    private btn_20: eui.Button;
    private btn_19: eui.Button;

    private btn_21: eui.Button;
    private btn_22: eui.Button;
    private btn_23: eui.Button;
    private btn_24: eui.Button;

    private gp_1: eui.Group;
    private gp_2: eui.Group;
    private gp_3: eui.Group;
    private gp_4: eui.Group;
    private num_page: number;


    public constructor() {
        super(ItemExpressTipskin);

        for (var i = 1; i < 25; ++i) {
            this["btn_" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendMessage, this);
        }
    }

    public $onRemoveFromStage() {
        super.$onRemoveFromStage();
    }


    public dataChanged(): void {
        super.dataChanged();
        //布局类型
        var type = this.data[1];

        if (type == 1) {
            this.gp_1.visible = true;
            this.gp_2.visible = false;
            this.height = 130;
            for (var j = 7; j <= 10; ++j) {
                var num = j - 6;
                this["btn_" + j].img_express.source = "express" + this.data[0] + "_" + num + "_png"
            }
        }
        else if (type == 2) {
            this.height = 130;
            this.gp_1.visible = false;
            this.gp_2.visible = true;
            for (var i = 1; i <= 6; ++i) {
                this["btn_" + i].img_express.source = "express" + this.data[0] + "_" + i + "_png"
            }
        }
        else if (type == 3) {
            this.height = 228;
            this.gp_4.visible = false;
            this.gp_3.visible = true;
            for (var j = 11; j <= 20; ++j) {
                var num = j - 10;
                this["btn_" + j].img_express.source = "express" + this.data[0] + "_" + num + "_png"
            }
        }
        else if (type == 4) {
            this.height = 228;
            this.gp_3.visible = false;
            this.gp_4.visible = true;
            for (var j = 21; j <= 24; ++j) {
                var num = j - 20;
                this["btn_" + j].img_express.source = "express" + this.data[0] + "_" + num + "_png"
            }
        }
    }

    public onSendMessage(e: egret.TouchEvent) {

        var time1 = egret.getTimer();

        if (time1 - DataCenter.instance.SendExpressTime > 500) {
            DataCenter.instance.SendExpressTime = time1;
            var str: string = "express" + this.data[0] + "_" + e.target.name + "_png"
            App.MessageCenter.dispatch(EventMessage.GameSendExpress, str);
        }


    }
}