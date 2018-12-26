namespace FindSomeThing {
    export class GameController {
        currentTitle: string;
        currentNum: number;
        private targetNum: number;
        titleMap: {} = {}
        titleList: string[] = [];
        private random: Function;
        private itemConfigTip: {};
        //乌云
        private leftCloud: eui.Group;
        private rightCloud: eui.Group;
        //提示
        private btn_tip: eui.Image;
        private tipTitle: eui.Image;
        /** 10s后没有选对，提示功能闪烁 */
        static TipTime = 10000;

        constructor(leftCloud: eui.Group, rightCloud: eui.Group, btn_tip: eui.Image, tipTitle: eui.Image) {
            this.itemConfigTip = RES.getRes("ItemConfig_json")["tip"];
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomTitle" + GameFindSomethingView.instance.roundController.currentRound);

            this.leftCloud = leftCloud;
            this.rightCloud = rightCloud;
            this.tipTitle = tipTitle;

            this.btn_tip = btn_tip;
            this.btn_tip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTip, this);
            this.effect = new EffectUtils();
            this.tipEffect = new EffectUtils();
            this.targetNum = GameFindSomethingView.instance.scoreController.targetNum;
        }
        /**   添加题库信息 */
        pushTitle = (titles: string[]) => {
            for (let title of titles) {
                if (this.titleMap[title])
                    this.titleMap[title]++;
                else {
                    this.titleMap[title] = 1;
                    this.titleList.push(title);
                }
            }
        }

        chooseTitle() {
            if (this.targetNum == 0) {
                GameFindSomethingView.instance.currentTitleView.text = `第${GameFindSomethingView.instance.roundController.currentRound}局结束`
                return;
            }
            let index = Math.floor(this.random() * this.titleList.length);
            if (this.currentTitle === this.titleList[index]) {
                this.chooseTitle();
                return;
            }
            this.currentTitle = this.titleList[index];
            if (this.titleMap[this.currentTitle] < 3)
                this.currentNum = Math.ceil(this.random() * this.titleMap[this.currentTitle]);
            else
                this.currentNum = Math.ceil(this.random() * 3);
            if (this.targetNum < this.currentNum)
                this.currentNum = this.targetNum;
            this.targetNum -= this.currentNum;
            GameFindSomethingView.instance.currentTitleView.text = this.itemConfigTip[this.currentTitle] + "X" + this.currentNum;
        }
        private tipEffect: EffectUtils;
        private tipFlag: number;
        delayTipTitle = () => {
            this.clearDelayTipTitle();
            this.tipFlag = setTimeout(this.tipTitleFicker, GameController.TipTime);
        }
        private clearDelayTipTitle = () => {
            if (this.tipFlag) {
                clearTimeout(this.tipFlag);
                this.tipFlag = undefined;
            }
        }
        private isTipFicking: boolean;
        private tipTitleFicker = () => {
            this.isTipFicking = true;
            this.tipEffect.startFlicker(this.tipTitle, 500);
        }
        private tipTitleStop = () => {
            this.isTipFicking = false;
            this.tipEffect.stopFlicker(this.tipTitle);
            this.tipTitle.alpha = 1;
        }
        tapRight(titles: string[]) {
            for (let title of titles) {
                if (this.titleMap[title] > 1)
                    this.titleMap[title]--;
                else {
                    delete this.titleMap[title]
                    let index = this.titleList.indexOf(title);
                    this.titleList.splice(index, 1);
                }
            }
            if (this.currentNum > 0) {
                this.currentNum--;
                GameFindSomethingView.instance.currentTitleView.text = this.itemConfigTip[this.currentTitle] + "X" + this.currentNum;
            }
            if (this.currentNum == 0) {
                this.chooseTitle();
            }
            App.SoundManager.playEffect("FindSomethingRight_mp3", true);
            GameFindSomethingView.instance.scoreController.selfRight();
            if (this.tipNum > 0) {
                this.tipTitleStop();
                this.delayTipTitle();
            }
        }
        tapFalse() {
            App.SoundManager.playEffect("FingSomethingFalse_mp3", true);
            egret.Tween.get(this.leftCloud).to({ x: 320 }, 400).wait(700).to({ x: -1 }, 400);
            egret.Tween.get(this.rightCloud).to({ x: 320 }, 400).wait(700).to({ x: 641 }, 400);
        }
        private effect: EffectUtils;
        private tipItem: FindSomeThing.Item;
        private isItemFlick = false;
        tipNum = 3;
        stopFicker = (item: FindSomeThing.Item) => {
            if (this.isItemFlick) {
                this.effect.stopFlicker(this.tipItem["img"]);
                this.isItemFlick = false;
                if (item == this.tipItem)
                    this.tipItem["img"].alpha = 0.5;
                else
                    this.tipItem["img"].alpha = 1;
            }
        }
        private showTip = () => {
            if (!GameFindSomethingView.instance.isGameing || this.isItemFlick) return;
            this.tipNum--;
            if (this.tipNum < 0) return;
            if (this.tipNum > 0) {
                this.tipTitleStop();
                this.delayTipTitle();
            } else {
                this.clearDelayTipTitle();
                this.tipTitleStop();
            }
            let GameScrollerGroup = GameFindSomethingView.instance.GameScrollerGroup;
            this.btn_tip.source = "FindSometingTip" + this.tipNum + "_png";
            App.SoundManager.playEffect("FindSomethingTip_mp3", true);
            this.tipItem = GameFindSomethingView.instance.itemController.getItem(this.currentTitle);
            let target = this.tipItem.x - GameScrollerGroup.width / 2;
            if (target < 0)
                target = 0;
            if (target > 1800 - GameScrollerGroup.width)
                target = 1800 - GameScrollerGroup.width;
            this.effect.startFlicker(this.tipItem["img"], 400);
            this.isItemFlick = true;
            //向右滚 ,scroller to right
            if (target > GameScrollerGroup.scrollH) {
                let time = Math.floor((target - GameScrollerGroup.scrollH) / GameFindSomethingView.scrollerSpeed);
                if (time == 0) return;
                App.TimerManager.doFrame(1, time, () => {
                    GameScrollerGroup.scrollH += GameFindSomethingView.scrollerSpeed;
                }, this, () => {
                    GameScrollerGroup.scrollH = target;
                }, this)
            } else {//向左滚 ,scroller to left
                let time = Math.floor((GameScrollerGroup.scrollH - target) / GameFindSomethingView.scrollerSpeed);
                if (time == 0) return;
                App.TimerManager.doFrame(1, time, () => {
                    GameScrollerGroup.scrollH -= GameFindSomethingView.scrollerSpeed;
                }, this, () => {
                    GameScrollerGroup.scrollH = target;
                }, this)
            }
        }
        nextRound = () => {
            this.titleMap = {};
            this.titleList = [];
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomTitle" + GameFindSomethingView.instance.roundController.currentRound);
            this.clearDelayTipTitle();
            this.tipTitleStop();
            this.targetNum = GameFindSomethingView.instance.scoreController.targetNum;
        }
        dispose = () => {
            this.titleMap = {};
            this.titleList = [];
            egret.Tween.removeTweens(this.leftCloud);
            egret.Tween.removeTweens(this.rightCloud);
            this.leftCloud.x = -1;
            this.rightCloud.x = 641;
            if (this.isItemFlick) {
                this.effect.stopFlicker(this.tipItem["img"]);
                this.isItemFlick = false;
            }
            this.clearDelayTipTitle();
            this.tipTitleStop();
            this.btn_tip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showTip, this);
        }
    }
}