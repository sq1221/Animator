class GameGoBallisticMainScene extends StateEui {
    public static instance: GameGoBallisticMainScene;
    public Gob_btn_run: eui.Button;
    public Gob_btn_showoff: eui.Button;
    public random: Function;
    public constructor() {
        super(GameGoBallisticMainSkin);
        GameGoBallisticMainScene.instance = this;

        if (App.IsXiaoMi) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, (data: any) => {
                GameGoBallisticMainScene.instance.AiConf = data;
                new GameGoBallisticArtificialts();
            });
        } else {
            new GameGoBallisticArtificialts();
        }

        new GameGoBallisticItemClass();
        new GameGoBallisticEventClass();
        new GameGoBallisticLogic();

        if (DataCenter.instance.room.IsAI) {
            GameGoBallisticItemClass.instance.isOffline = true;
            App.MessageCenter.addListener("local", GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticMainScene.instance);
        }
    }

    public Gob_group_boss: eui.Group;
    public Gob_group_all: eui.Group;
    public Img_blackMask: eui.Image;
    public Img_light: eui.Image;
    public Img_result: eui.Image;
    public Gob_group_roles: eui.Group;
    public Img_stop: eui.Image;
    public Label_blueScore: eui.Label;
    public Label_redScore: eui.Label;
    public Img_isYou: eui.Image;
    public Gob_group_flyingItem: eui.Group;
    public Gob_group_blueHead: eui.Group;
    public Gob_group_redHead: eui.Group;

    public blackMask: egret.Bitmap;
    public w8img: egret.Bitmap;
    private rdy: GameReady;

    public AiConf = {};

    init() {
        super.init();
        GameGoBallisticItemClass.instance.isRuning = true;

        this.random = new Math["seedrandom"](DataCenter.instance.room.id.toString());

        this.gameInit();
        App.SoundManager.playBg("bgm_mp3");
    }

    dispose() {
        GameGoBallisticItemClass.instance.isRuning = false;
        GameGoBallisticLogic.instance.dispose();
        super.dispose();

        egret.stopTick(GameGoBallisticLogic.instance.readyTick, this);

        GameGoBallisticLogic.instance.dispose();

        App.TimerManager.removeAll(GameGoBallisticLogic.instance);
        App.TimerManager.removeAll(GameGoBallisticMainScene.instance);
        App.TimerManager.removeAll(GameGoBallisticLogic.instance);
        App.TimerManager.removeAll(GameGoBallisticArtificialts.instance);

        App.MessageCenter.removeAll(GameGoBallisticMainScene.instance);
        App.MessageCenter.removeAll(GameGoBallisticEventClass.instance);

        egret.Tween.removeAllTweens();
        GameGoBallisticItemClass.instance.roleBoss.stop();

        if (this.rdy) {
            this.rdy.dispose();
            this.rdy = undefined;
        }

        GameGoBallisticItemClass.instance = null;
        GameGoBallisticEventClass.instance = null;
        GameGoBallisticLogic.instance = null;

        App.SoundManager.stopBg();
    }

    public gameInit = () => {
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, GameGoBallisticEventClass.instance.resultDeal, GameGoBallisticEventClass.instance);

        GameGoBallisticItemClass.instance.roleBoss = AssetManager.getDBArmature("Gob_boss");
        GameGoBallisticItemClass.instance.roleBoss.x = 0.5 * GameGoBallisticItemClass.instance.roleBoss.width;
        GameGoBallisticItemClass.instance.roleBoss.y = 160;
        GameGoBallisticItemClass.instance.roleBoss.alpha = 0;
        this.Gob_group_boss.addChild(GameGoBallisticItemClass.instance.roleBoss);

        GameGoBallisticItemClass.instance.roleBlue = new Gob_role("Blue");
        this.Gob_group_roles.addChild(GameGoBallisticItemClass.instance.roleBlue);

        GameGoBallisticItemClass.instance.roleRed = new Gob_role("Red");
        this.Gob_group_roles.addChild(GameGoBallisticItemClass.instance.roleRed);

        this.Gob_btn_run.addEventListener("touchTap", GameGoBallisticLogic.instance.btnRunClick, GameGoBallisticMainScene.instance);
        this.Gob_btn_showoff.addEventListener("touchTap", GameGoBallisticLogic.instance.btnShowoffClick, GameGoBallisticMainScene.instance);

        this.w8img = AssetManager.getBitmap("Gob_w8_png", true, false);
        this.w8img.x = 320;
        this.w8img.y = 784;
        this.addChild(this.w8img);

        let headIcoLeft = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 67, 67);
        headIcoLeft.x = 0;
        headIcoLeft.y = 0;
        this.Gob_group_blueHead.addChild(headIcoLeft);

        let headIcoRight = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 67, 67);
        headIcoRight.x = 0;
        headIcoRight.y = 0;
        this.Gob_group_redHead.addChild(headIcoRight);

        this.Img_blackMask.visible = true;

        egret.startTick(GameGoBallisticLogic.instance.readyTick, GameGoBallisticMainScene.instance);
        GameGoBallisticEventClass.instance.messageCenter(GameGoBallisticEventClass.instance.GOB_EVENT_READY);

        if (this.stage.stageHeight < 1136) {
            GameGoBallisticItemClass.instance.multiple = (this.stage.stageHeight / 1136);
            this.scaleX = GameGoBallisticItemClass.instance.multiple;
            this.scaleY = GameGoBallisticItemClass.instance.multiple;
            let nowWidth = 640 * GameGoBallisticItemClass.instance.multiple;
            this.x = (640 - nowWidth) / 2;
        } else if (this.stage.stageHeight > 1136) {
            this.y = (this.stage.stageHeight - 1136) / 2;
        }

        let tw = egret.Tween.get(this.Img_isYou, { loop: true });
        tw.to({ y: 420 }, 600).to({ y: 390 }, 600);
        App.TimerManager.doTimer(3600, 1, () => {
            if (GameGoBallisticItemClass.instance.isRuning == false) {
                return;
            }
            egret.Tween.removeTweens(this.Img_isYou);
            this.Img_isYou.visible = false;
        }, GameGoBallisticMainScene.instance);
    }

    public gameRdy = () => {
        this.rdy = new GameReady(() => {
            this.gameStart();
        });

        this.Img_blackMask.visible = false;
        this.removeChild(GameGoBallisticMainScene.instance.w8img);

        this.rdy.x = 320;
        this.rdy.y = 568;
        this.rdy.play();
        this.Gob_group_all.addChild(this.rdy);
    }

    public gameStart = () => {
        GameGoBallisticItemClass.instance.roleBoss.alpha = 1;
        App.TimerManager.doTimer(1000, 0, GameGoBallisticLogic.instance.gamingTick, GameGoBallisticMainScene.instance);
        this.Gob_btn_run.visible = true;
        if (GameGoBallisticItemClass.instance.isOffline == true) {
            App.TimerManager.doTimer(GameGoBallisticArtificialts.instance.clickInterval, 0, GameGoBallisticArtificialts.instance.taunt, GameGoBallisticArtificialts.instance)
            App.TimerManager.doTimer(GameGoBallisticArtificialts.instance.clickInterval, 0, GameGoBallisticArtificialts.instance.walk, GameGoBallisticArtificialts.instance)
        }
    }

    public showResult = (isWin: number) => {
        this.Img_blackMask.visible = true;
        this.Img_light.visible = true;
        let tw = egret.Tween.get(this.Img_light, { loop: true });
        tw.to({ rotation: 180 }, 1500).to({ rotation: 360 }, 1500);

        switch (isWin) {
            case 3:
                this.Img_result.source = "Gob_win_png";
                GameGoBallisticItemClass.instance.roleBlue.win();
                break;
            case 1:
                this.Img_result.source = "Gob_lose_png";
                GameGoBallisticItemClass.instance.roleRed.win();
                break;
        }

        this.Img_result.visible = true;
    }
}