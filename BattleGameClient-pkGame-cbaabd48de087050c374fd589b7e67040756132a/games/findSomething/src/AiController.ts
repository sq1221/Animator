namespace FindSomeThing {
    export class AiController {
        private currentTitle: string;
        private currentNum: number;
        private random: Function;
        constructor() {
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomTitle" + GameFindSomethingView.instance.roundController.currentRound);
            // App.CurrGameAiLevel = 1;
            if (App.IsXiaoMi) {
                this.totalTime = GameFindSomethingView.aiConf.s * 1000 + Math.floor(GameFindSomethingView.aiConf.r * Math.random());
                console.log(this.totalTime)
            } else {
                this.setTotalTime();
            }
            this.setFalseNum();
        }
        /**ms */
        private totalTime: number;
        private rightTime = 200;
        private falseTime = 1500;
        private setTotalTime() {
            //GameFindSomethingView.aiConf
            let baseTime = (13 - App.CurrGameAiLevel) * 2.5;
            let folatTime;
            let random = Math.random();
            if (App.CurrGameAiLevel > 1 && App.CurrGameAiLevel < 10) {
                folatTime = Math.round(random * 5);
            }
            else if (App.CurrGameAiLevel == 1) {
                folatTime = Math.round(random * 10);
            }
            else if (App.CurrGameAiLevel == 10) {
                folatTime = Math.round(random * 3);
                baseTime = 9;
            }
            this.totalTime = (baseTime + folatTime) * 1000;
        }
        private falseNum: number;
        private rightNum = 10;
        setFalseNum() {
            let fasleTotalTime = this.totalTime - this.rightTime * 10;
            if (fasleTotalTime < 0) {
                this.falseNum = 0;
            } else {
                this.falseNum = Math.floor(fasleTotalTime / this.falseTime);
            }
        }
        private get isRight() {
            if (this.falseNum <= 0) return 1;
            return this.rightNum / (this.falseNum + this.rightNum);
        }
        choose = () => {
            let random = Math.random();
            if (random < this.isRight) {
                this.aiRight();
            } else {
                this.aiWrong();
            }
        }

        nextRound = () => {
            App.TimerManager.removeAll(this);
            if (App.IsXiaoMi) {
                this.totalTime = GameFindSomethingView.aiConf.s * 1000 + Math.floor(GameFindSomethingView.aiConf.r * Math.random());
                console.log(this.totalTime)
            } else {
                this.setTotalTime();
            }
            this.setFalseNum();
            this.rightNum = 10;
        }
        aiRight = () => {
            App.TimerManager.doTimer(this.rightTime, 1, () => {
                if (this.currentNum > 0) {
                    this.currentNum--;
                }
                if (this.currentNum == 0) {
                    this.chooseTitle();
                }
                let isNext = GameFindSomethingView.instance.scoreController.comRight();
                this.rightNum--;
                if (isNext)
                    this.choose();
            }, this)
        }
        private wrongFlag: number;
        aiWrong = () => {
            if (this.wrongFlag) clearTimeout(this.wrongFlag);
            this.wrongFlag = setTimeout(this.choose, this.falseTime);
            this.falseNum--;
        }

        chooseTitle() {
            let titleList = GameFindSomethingView.instance.gameController.titleList;
            let titleMap = GameFindSomethingView.instance.gameController.titleMap;
            let index = Math.floor(this.random() * titleList.length);
            if (this.currentTitle === titleList[index]) {
                this.chooseTitle();
                return;
            }
            this.currentTitle = titleList[index];
            if (titleMap[this.currentTitle] < 3)
                this.currentNum = Math.ceil(this.random() * titleMap[this.currentTitle]);
            else
                this.currentNum = Math.ceil(this.random() * 3);
        }


        dispose = () => {
            App.TimerManager.removeAll(this);
            if (this.wrongFlag) clearTimeout(this.wrongFlag);
        }
    }
}