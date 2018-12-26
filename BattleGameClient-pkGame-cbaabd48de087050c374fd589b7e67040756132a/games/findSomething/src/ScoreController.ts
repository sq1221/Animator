namespace FindSomeThing {
    export class ScoreController {
        private SelfScore: eui.Label;
        private ComScore: eui.Label;
        constructor(SelfScore: eui.Label, ComScore: eui.Label) {
            this.SelfScore = SelfScore;
            this.ComScore = ComScore;
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
        private _selfRightNum: number = 0;
        private _comRightNum: number = 0;
        targetNum: number = 10;
        selfRight() {
            this._selfRightNum++;
            this.SelfScore.text = this._selfRightNum.toString();
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "score|" + this._selfRightNum);
                if (this._selfRightNum >= this.targetNum)
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundWin|" + GameFindSomethingView.instance.roundController.currentRound, 1);
            } else {
                if (this._selfRightNum >= this.targetNum) {
                    GameFindSomethingView.instance.aiController.dispose();
                    App.TimerManager.doFrame(1, 1, () => {
                        GameFindSomethingView.instance.roundController.winRound();
                    }, this)
                }
            }
        }
        comRight = () => {
            this._comRightNum++;
            this.ComScore.text = this._comRightNum.toString();
            if (this._comRightNum >= this.targetNum) {
                GameFindSomethingView.instance.isGameing = false;
                App.TimerManager.doFrame(1, 1, () => {
                    GameFindSomethingView.instance.roundController.loseRound();
                }, this)
                return false;
            }
            return true;
        }
        get selfRightNum() {
            return this._selfRightNum;
        }
        get comRightNum() {
            return this._comRightNum;
        }
        private onGameEvent(data: any) {
            let parseData = (data: string): string[] => {
                let splitChar = data.split("|");
                return splitChar;
            }
            let datas = parseData(data.event);
            switch (datas[0]) {
                case "score":
                    this.ComScore.text = datas[1];
                    this._comRightNum = parseInt(datas[1]);
                    if (this._comRightNum >= this.targetNum)
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundLose|" + GameFindSomethingView.instance.roundController.currentRound, 1);
                    break;
            }
        }
        nextRound = () => {
            this._selfRightNum = 0;
            this._comRightNum = 0;
            this.SelfScore.text = this._selfRightNum.toString();
            this.ComScore.text = this._comRightNum.toString();
        }
        roundOver = () => {
            if (!DataCenter.instance.room.IsAI) {
                if (this._selfRightNum >= this._comRightNum) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundWin|" + GameFindSomethingView.instance.roundController.currentRound, 1);
                } else {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundLose|" + GameFindSomethingView.instance.roundController.currentRound, 1);
                }
            } else {
                if (this._selfRightNum >= this._comRightNum) {
                    GameFindSomethingView.instance.roundController.winRound();
                } else {
                    GameFindSomethingView.instance.roundController.loseRound();
                }
            }
        }
        dispose() {
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
    }
}