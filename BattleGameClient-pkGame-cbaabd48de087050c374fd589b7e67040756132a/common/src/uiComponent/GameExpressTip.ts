// TypeScript file
class GameExpressTip extends StateEui {
    public list: eui.List;
    public gp_bg: eui.Group;
    public lb_bg: eui.Label;
    public img_bg: eui.Image;
    private arrayCollection1: eui.ArrayCollection;//列表
    private numMomentPage = 1;//当前页
    private startPot: number;
    private EndPot: number;
    private Scroller1: eui.Scroller;
    public gp_express: eui.Group;
    public gp_pot: eui.Group;


    public pot_1: eui.Image;
    public pot_2: eui.Image;
    public pot_3: eui.Image;
    //斗兽棋表情
    private sourceArr1: Array<any> = [
        [1, 2],
        [2, 1],
        [3, 1]
    ];

    //智多星
    private sourceArr2: Array<any> = [
        [4, 3],
        [5, 4],
        [6, 4]
    ];

    public constructor() {
        super(GameExpressSkin);
    }

    public init(): void {
        super.init();
        this.lb_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuit, this);

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onbegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
    }

    public show(): void {
        super.show();
        this.arrayCollection1 = new eui.ArrayCollection([]);
        this.list.itemRenderer = ItemExpressTip;
        this.list.dataProvider = this.arrayCollection1;


        this.setGameType();
    }

    private onbegin(e: egret.TouchEvent) {
        this.startPot = e.stageX;
    }

    private onEnd(e: egret.TouchEvent) {
        this.Scroller1.stopAnimation();

        this.EndPot = e.stageX;
        var pianyi: number = Math.floor(this.startPot - this.EndPot);
        //右滑
        if (pianyi > 100 && this.numMomentPage != this.sourceArr1.length) {
            // this["pot_" + this.numMomentPage].alpha = 0.4;
            this.numMomentPage++;
        }
        //右滑
        else if (pianyi < -100 && this.numMomentPage != 1) {
            // this["pot_" + this.numMomentPage].alpha = 0.4;
            this.numMomentPage--;
        }
        var change_Pot: number = 0;
        if (pianyi != 0) {
            this.pot_1.alpha = 0.4;
            this.pot_2.alpha = 0.4;
            this.pot_3.alpha = 0.4;
            //this.Scroller1.scrollPolicyH = "OFF";
            change_Pot = this.numMomentPage;
            egret.Tween.get(this.list).to({
                scrollH: (this.numMomentPage - 1) * 606
            }, 300).call(() => {
                this["pot_" + this.numMomentPage].alpha = 1;
               // this.Scroller1.scrollPolicyH = "ON";
            })
        }
    }

    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
        // 监听离开游戏
        App.MessageCenter.addListener(EventMessage.gameCloseExpress, this.onQuit, this);
    }


    public dispose(): void {
        super.dispose();
    }

    public onCancel() {
        this.close();
    }

    private onQuit(e): void {
        egret.Tween.removeTweens(this.list);
        this.close();
    }

    private setGameType() {
        var type = App.GameExpressType;
        if (type == 1) {
            this.list.height = 130;
            this.Scroller1.height = 130;
            this.gp_pot.bottom = 36;
            this.gp_express.bottom = 106;
            this.Scroller1.bottom = 72;
            this.pot_1.source = "pot_write_png";
            this.pot_2.source = "pot_write_png";
            this.pot_3.source = "pot_write_png";

        }
        else if (type == 2) {
            this.list.height = 228;
            this.Scroller1.height = 228;
            this.gp_pot.bottom = 8;
            this.gp_express.bottom = 136;
            this.Scroller1.bottom = 42;
            this.pot_1.source = "pot_zi_png";
            this.pot_2.source = "pot_zi_png";
            this.pot_3.source = "pot_zi_png";
        }


        this.img_bg.source = "express_kuang" + type + "_png";
        this.arrayCollection1.replaceAll(this["sourceArr" + type]);

    }
}