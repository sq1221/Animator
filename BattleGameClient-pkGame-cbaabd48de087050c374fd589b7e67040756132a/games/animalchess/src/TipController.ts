namespace AnimalChess {
    export class TipController extends egret.DisplayObjectContainer {
        constructor() {
            super();
        }
        private giveUpTip: egret.Bitmap;
        private receiveGiveUpTip: egret.Bitmap;

        receiveDrawnView: GameReceiveDrawnView
        init() {
            this.competitorTip = AssetManager.getBitmap("competitorTip_png");
            this.competitorTip.x = App.GameWidth / 2;
            this.competitorTip.y = App.GameHeight / 2 - GameAnimalChessView.instance.y;
            this.competitorTip.alpha = 0;
            this.addChild(this.competitorTip);

            this.selfTip = AssetManager.getBitmap("selfTip_png");
            this.selfTip.x = App.GameWidth / 2;
            this.selfTip.y = App.GameHeight / 2 - GameAnimalChessView.instance.y;
            this.selfTip.alpha = 0
            this.addChild(this.selfTip);


            this.giveUpTip = AssetManager.getBitmap("giveUpTitle_png");
            this.giveUpTip.x = App.GameWidth / 2;
            this.giveUpTip.y = App.GameHeight / 2 - 150 - GameAnimalChessView.instance.y;
            this.addChild(this.giveUpTip);
            this.giveUpTip.alpha = 0;

            this.receiveGiveUpTip = AssetManager.getBitmap("receiveGiveUpMessage_png");
            this.receiveGiveUpTip.x = App.GameWidth / 2;
            this.receiveGiveUpTip.y = App.GameHeight / 2 - 150 - GameAnimalChessView.instance.y;
            this.addChild(this.receiveGiveUpTip);
            this.receiveGiveUpTip.alpha = 0;

            App.MessageCenter.addListener(EventMessage.GameGiveUp, this.giveUp, this);

            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);

            this.receiveDrawnView = new GameReceiveDrawnView();

            this.receiveDrawnView.hide();
            this.addChild(this.receiveDrawnView);
            this.receiveDrawnView.btn_refuse.touchEnabled = true;
            this.receiveDrawnView.btn_refuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.refuseListener, this)
            this.receiveDrawnView.btn_agree.touchEnabled = true;
            this.receiveDrawnView.btn_agree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.agreeListener, this)
        }
        private refuseListener = () => {
            this.receiveDrawnView.hide();
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "refuseDrawn");
            App.TimerManager.remove(this.drawnTime, this);
        }
        private agreeListener = () => {
            this.receiveDrawnView.hide();
            App.TimerManager.remove(this.drawnTime, this);
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "acceptDrawn");
            if (GameAnimalChessView.instance.chessboardController)
                GameAnimalChessView.instance.chessboardController.sendResult(2);
            this.receiveDrawnView.showDrawn(2000);
        }

        isGiveUp: boolean = false;
        private giveUp() {
            this.isGiveUp = true;
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "giveUp");
            this.giveUpTip.alpha = 1;
            App.TimerManager.doTimer(1000, 1, () => {
                this.giveUpTip.alpha = 0;
                if (GameAnimalChessView.instance.chessboardController)
                    GameAnimalChessView.instance.chessboardController.sendResult(1);
            }, this)

        }
        private _drawntime: number;
        private drawnTime = () => {
            if (App.Language == LanguageType.Ch) {
                this.receiveDrawnView.btn_refuse.label = "拒绝(" + this._drawntime + "s)";
            } else {
                this.receiveDrawnView.btn_refuse.label = "refuse(" + this._drawntime + "s)";
            }
            this._drawntime--;
            if (this._drawntime < 0) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "refuseDrawn");
                this.receiveDrawnView.visible = false;
                App.TimerManager.remove(this.drawnTime, this);
                this._drawntime = 5;
            }
        }
        showWaitDrawn() {
            this.receiveDrawnView.showWaitDrawnAnswer();
            if (DataCenter.instance.room.IsAI) {
                let random = App.RandomUtils.limitInteger(0, 2);
                App.TimerManager.doTimer(random * 1000, 1, () => {
                    this.receiveDrawnView.showDrawnRefuseAnswer();
                    App.TimerManager.doTimer(300, 1, this.receiveDrawnView.hide, this)
                }, this)
            }
        }
        private onGameEvent(data: any) {
            let parseData = (data: string): string[] => {
                let splitChar = data.split("|");
                return splitChar;
            }
            let datas = parseData(data.event);
            switch (datas[0]) {
                case "giveUp":
                    this.receiveGiveUpTip.alpha = 1;
                    App.TimerManager.doTimer(1000, 1, () => {
                        this.receiveGiveUpTip.alpha = 0;
                        if (GameAnimalChessView.instance.chessboardController)
                            GameAnimalChessView.instance.chessboardController.sendResult(3);
                    }, this)
                    break;
                case "drawnRequest":
                    this.receiveDrawnView.showDrawnGroup();
                    this._drawntime = 5;
                    this.drawnTime();
                    App.TimerManager.doTimer(1000, 0, this.drawnTime, this);
                    break;
                case "refuseDrawn":
                    this.receiveDrawnView.showDrawnRefuseAnswer();
                    App.TimerManager.doTimer(300, 1, this.receiveDrawnView.hide, this)
                    break;
                case "acceptDrawn":
                    this.receiveDrawnView.hide();
                    if (GameAnimalChessView.instance.chessboardController)
                        GameAnimalChessView.instance.chessboardController.sendResult(2);
                    this.receiveDrawnView.showDrawn(2000);
                    break;
                default:
                    break;
            }
        }
        wasteTipShow(round: number) {
            let waste = AssetManager.getBitmap("waste" + round + "_png");
            waste.x = App.GameWidth / 2;
            waste.y = -100;
            this.addChild(waste);
            egret.Tween.get(waste).to({ y: 100 }, 500).call(() => {
                App.TimerManager.doTimer(1000, 1, () => {
                    if (waste.parent)
                        this.removeChild(waste);
                }, this)
            });
        }
        chaseShow() {
            let chase = AssetManager.getBitmap("chaseTip_png");
            chase.x = App.GameWidth / 2;
            chase.y = -100;
            this.addChild(chase);
            egret.Tween.get(chase).to({ y: 100 }, 500).call(() => {
                App.TimerManager.doTimer(1000, 1, () => {
                    if (chase.parent)
                        this.removeChild(chase);
                }, this)
            });
        }
        private competitorTip: egret.Bitmap
        showComRoundTip() {
            egret.Tween.get(this.competitorTip).to({ alpha: 1 }, 300).wait(400).to({ alpha: 0 }, 300);
        }
        setCompetitorTip(chessType: ChessType) {
            this.competitorTip.texture = AssetManager.getBitmap("competitorTip" + chessType + "_png").texture;
        }


        private selfTip: egret.Bitmap
        showSelfRoundTip() {
            egret.Tween.get(this.selfTip).to({ alpha: 1 }, 300).wait(400).to({ alpha: 0 }, 300);
        }
        setSelfTip(chessType: ChessType) {
            this.selfTip.texture = AssetManager.getBitmap("selfTip" + chessType + "_png").texture;
        }

        showChiji(delayTime: number) {
            this.receiveDrawnView.showchiji(delayTime);
        }
        showFailure(delayTime: number) {
            this.receiveDrawnView.showFailure(delayTime);
        }
        showDrawn(delayTime: number) {
            this.receiveDrawnView.showDrawn(delayTime);
        }
        dispose() {
            App.TimerManager.removeAll(this);
            App.MessageCenter.removeListener(EventMessage.GameGiveUp, this.giveUp, this);
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            this.receiveDrawnView.btn_refuse.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.refuseListener, this)
            this.receiveDrawnView.btn_agree.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.agreeListener, this)
        }
    }
}