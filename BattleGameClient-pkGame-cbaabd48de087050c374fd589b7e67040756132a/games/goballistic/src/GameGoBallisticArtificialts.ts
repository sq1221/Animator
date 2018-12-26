class GameGoBallisticArtificialts {
    public static instance: GameGoBallisticArtificialts;
    public clickInterval: number;
    public mistake: number;
    public walkSwitcher: boolean = true;
    public tauntSwitcher: boolean = false;
    public constructor() {
        GameGoBallisticArtificialts.instance = this;

        if (App.IsXiaoMi) {
            let conf = GameGoBallisticMainScene.instance.AiConf[App.CurrGameAiLevel];
            console.log(">>>>> conf: ", conf.n, conf.x, conf.m);
            this.clickInterval = App.RandomUtils.limitInteger(conf.n, conf.x);
            this.mistake = conf.m;
        } else {
            switch (App.CurrGameAiLevel) {
                case 1:
                    this.clickInterval = App.RandomUtils.limitInteger(200, 220);
                    this.mistake = 0.1;
                    break;
                case 2:
                    this.clickInterval = App.RandomUtils.limitInteger(180, 200);
                    this.mistake = 0.2;
                    break;
                case 3:
                    this.clickInterval = App.RandomUtils.limitInteger(160, 175);
                    this.mistake = 0.4;
                    break;
                case 4:
                    this.clickInterval = App.RandomUtils.limitInteger(130, 150);
                    this.mistake = 0.7;
                    break;
                case 5:
                    this.clickInterval = App.RandomUtils.limitInteger(100, 110);
                    this.mistake = 1;
                    break;
            }
        }
    }

    public walk = () => {
        if (GameGoBallisticItemClass.instance.isRuning == false || this.walkSwitcher == false) {
            return;
        }
        App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_WALK + "|l");
    }

    public taunt = () => {
        if (GameGoBallisticItemClass.instance.isRuning == false || this.tauntSwitcher == false) {
            return;
        }
        App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT + "|l");
    }
}