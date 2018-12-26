namespace GameLongJump {
    export class AiController {
        private _aiLevel: number;

        private comJump: Function;
        static successRound = 0.2;
        static comboRound = 0.6;
        static dropLimit = 3;
        /**警戒值 */
        static hardTo3 = 30;//最高级难度：AI分值领先30分时，AI将为3
        static hardTo4 = 20;//最高级难度：AI分值领先20分时，AI将为4
        static AIComboFlag = 15;//最高级难度：AI分值领先小于13分时候，AI开始combo，知道,2+4+6 1100MS,
        static easyToHard = 15;//3,4：AI分值领先小于5分时候，AI升级为最高等级

        private isHard = false;
        combo: number;
        private dropNum: number;
        constructor(comJump: Function) {
            this.comJump = comJump;
            this.combo = 0;
            this.aiLevel = App.CurrGameAiLevel;
            if (this.aiLevel === 5) {
                this.isHard = true;
            }
            this.dropNum = 0;
        }
        private set aiLevel(value: number) {
            this._aiLevel = value;
            switch (this._aiLevel) {
                case 1:
                    AiController.successRound = 0.3;
                    AiController.comboRound = 0.1;
                    AiController.dropLimit = 4;
                    break;
                case 2:
                    AiController.successRound = 0.5;
                    AiController.comboRound = 0.2;
                    AiController.dropLimit = 3;
                    break;
                case 3:
                    AiController.successRound = 0.75;
                    AiController.comboRound = 0.5;
                    AiController.dropLimit = 2;
                    break;
                case 4:
                    AiController.successRound = 0.95;
                    AiController.comboRound = 0.8;
                    AiController.dropLimit = 1;
                    break;
                case 5:
                    AiController.successRound = 1;
                    AiController.comboRound = 0;
                    AiController.dropLimit = 0;
                    break;
            }
        }
        private get aiLevel() {
            return this._aiLevel;
        }

        //跳一跳 combo逻辑
        private nextCombo(offset: number, edge: number) {
            let successEdge = edge * Math.random() * 0.3
            this.dropNum = 0
            return (offset + successEdge) / userConfig.jumpDis;
        }

        //跳一跳 成功非combo逻辑
        private nextSuccess(offset: number, edge: number) {
            let comboRand = Math.random() //combo波动
            if (comboRand <= AiController.comboRound) {
                return this.nextCombo(offset, edge);
            } else {
                return this.noCombo(offset, edge);
            }
        }

        //跳一跳 失败逻辑
        private nextFail(offset: number, edge: number) {
            let rnd = Math.random()
            let power: number;
            if (rnd > 0.5) {
                power = (offset + edge * (rnd + 1)) / userConfig.jumpDis
            } else {
                power = (offset - edge * (rnd + 1)) / userConfig.jumpDis
            }
            this.dropNum++;
            return power;
        }
        //跳一跳 成功非combo逻辑
        private noCombo(offset: number, edge: number) {
            let successEdge = edge * 0.3 + edge * Math.random() * 0.2
            this.dropNum = 0
            this.combo = 0
            return (offset + successEdge) / userConfig.jumpDis;
        }


        AItouch = () => {

            App.TimerManager.removeAll(this);
            let target = GameLongJumpView.instance.comController.target;
            if (!target) {
                return;
            }
            let offset = target.offsetFromLast;
            let random = Math.random();
            let power: number;
            let stateController = GameLongJumpView.instance.stateController;
            let userCombon = GameLongJumpView.instance.userController.combo;

            //计算结果
            if (this.aiLevel == 5) {
                if (userCombon > 0 || stateController.comScore - stateController.selfScore < AiController.AIComboFlag) { //玩家combo或者ai领先玩家不足10分ai开始combo
                    power = this.nextCombo(offset, target.offsetToEdge)
                } else {
                    power = this.nextSuccess(offset, target.offsetToEdge)
                }
            } else {
                let successRand = Math.random()  //跳成功波动
                if (this.dropNum > AiController.dropLimit || successRand <= AiController.successRound) { //超过掉落限制 必成功
                    power = this.nextSuccess(offset, target.offsetToEdge);
                } else {
                    power = this.nextFail(offset, target.offsetToEdge)
                }
            }
            if (this.isHard) {
                if (stateController.comScore - stateController.selfScore < AiController.easyToHard || userCombon > 0)
                    this.aiLevel = 5;
                else {
                    if (stateController.comScore - stateController.selfScore >= AiController.hardTo4)
                        this.aiLevel = 4;
                    else if (stateController.comScore - stateController.selfScore >= AiController.hardTo3)
                        this.aiLevel = 3;
                }
            }
            let Time = Math.ceil((power - userConfig.power) / userConfig.powerAdd) + 1;
            App.TimerManager.doTimer(100 * Time, 1, () => {
                GameLongJumpView.instance.comController.power = power;
                this.comJump();
            }, this)
        }
        dispose() {
            App.TimerManager.removeAll(this);
        }
    }
}