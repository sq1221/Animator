namespace FindSomeThing {
    export class RoundController {
        private SelfScore1: eui.Image;
        private SelfScore2: eui.Image;
        private ComScore1: eui.Image;
        private ComScore2: eui.Image;
        constructor(SelfScore1: eui.Image, SelfScore2: eui.Image, ComScore1: eui.Image, ComScore2: eui.Image) {
            this.SelfScore1 = SelfScore1;
            this.SelfScore2 = SelfScore2;
            this.ComScore1 = ComScore1;
            this.ComScore2 = ComScore2;
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
        selfRound: number = 0;
        comRound: number = 0;

        currentRound: number = 1;
        round = {};
        winRound() {
            GameFindSomethingView.instance.stopTime();
            switch (App.Language) {
                case LanguageType.Ch:
                    GameFindSomethingView.instance.currentTitleView.text = `第${this.currentRound}局结束`;
                    break;
                case LanguageType.En:
                    GameFindSomethingView.instance.currentTitleView.text = `Round ${this.currentRound} Over`;
                    break;
            }
            this.currentRound++;
            let playCartoonOver = () => {
                this.selfRound++;
                if (this.selfRound >= 2)
                    this.sendResult(3);
                else
                    this.nextRound();
            }
            if (this.selfRound === 0) {
                this.SelfScore1.source = "FindSomethingScore_png";
                this.playWinCartoon(this.SelfScore1, playCartoonOver);
            } else {
                this.SelfScore2.source = "FindSomethingScore_png";
                this.playWinCartoon(this.SelfScore2, playCartoonOver);
            }
            App.SoundManager.playEffect("FindSomethingRoundWin_mp3", true);
        }
        private findSomethingScore: egret.Bitmap;
        private playWinCartoon = (target: eui.Image, callback?: Function) => {
            if (!this.findSomethingScore)
                this.findSomethingScore = AssetManager.getBitmap("FindSomethingScore_png");
            this.findSomethingScore.scaleX = this.findSomethingScore.scaleY = 1.2;
            this.findSomethingScore.y = target.y;
            this.findSomethingScore.x = target.x;
            this.findSomethingScore.anchorOffsetX = this.findSomethingScore.width * 0.5;
            this.findSomethingScore.anchorOffsetY = this.findSomethingScore.height * 0.5;
            GameFindSomethingView.instance.gp_bg.addChild(this.findSomethingScore);
            egret.Tween.get(this.findSomethingScore).to({ scaleX: 2, scaleY: 2 }, 300).to({ scaleX: 1, scaleY: 1 }, 200).wait(1000).call(() => {
                if (this.findSomethingScore.parent)
                    this.findSomethingScore.parent.removeChild(this.findSomethingScore);
                target.source = this.findSomethingScore.texture;
                if (callback)
                    callback();
            });
        }
        loseRound() {
            GameFindSomethingView.instance.stopTime();
            switch (App.Language) {
                case LanguageType.Ch:
                    GameFindSomethingView.instance.currentTitleView.text = `第${this.currentRound}局结束`;
                    break;
                case LanguageType.En:
                    GameFindSomethingView.instance.currentTitleView.text = `Round ${this.currentRound} Over`;
                    break;
            }
            this.currentRound++;
            let playCartoonOver = () => {
                this.comRound++;
                if (this.comRound >= 2)
                    this.sendResult(1);
                else
                    this.nextRound();
            }
            if (this.comRound === 0) {
                this.ComScore1.source = "FindSomethingScore_png";
                this.playWinCartoon(this.ComScore1, playCartoonOver);
            } else {
                this.ComScore2.source = "FindSomethingScore_png";
                this.playWinCartoon(this.ComScore2, playCartoonOver);
            }
        }

        nextRound() {
            GameFindSomethingView.instance.nextRound();
        }
        /** 发送输赢 */
        sendResult(isWin: number) {
            // console.log(DataCenter.instance.room.id + "号房发送结果为" + DataCenter.instance.user.id + ":" + isWin)
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, isWin);
        }
        private onGameEvent(data: any) {
            let parseData = (data: string): string[] => {
                let splitChar = data.split("|");
                return splitChar;
            }
            let datas = parseData(data.event);
            if (this.round[datas[1]] == undefined) {
                switch (datas[0]) {
                    case "roundWin":
                        if (data.userId === DataCenter.instance.user.id)
                            this.winRound();
                        else
                            this.loseRound();
                        this.round[datas[1]] = DataCenter.instance.user.name;
                        break;
                    case "roundLose":
                        if (data.userId === DataCenter.instance.user.id)
                            this.loseRound();
                        else
                            this.winRound();
                        this.round[datas[1]] = DataCenter.instance.room.player.name;
                        break;
                }
            }
        }
        dispose() {
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
    }
}