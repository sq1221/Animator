namespace GameLongJump {
    export class CompetitorController extends CharacterController {
        ai: AiController;
        constructor() {
            super();
        }
        private commandList: { power: number, webScore: number }[] = [];
        private isPlay = false;
        init() {
            if (DataCenter.instance.room.selfIsMaster) {
                this.userCharacter = new Character(AssetManager.getDBArmature("wa2")["_armature"]);
            }
            else {
                this.userCharacter = new Character(AssetManager.getDBArmature("wa1")["_armature"]);
            }
            this.userCharacter.alpha = 0.5;
            this.userCharacter.name = "Com";
            GameLongJumpView.instance.gameLayer.addChild(this.userCharacter);

            //游戏内事件返回
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            else {
                // console.log("本地AI开启")
                this.ai = new AiController(this.jump);
            }
        }
        get power() {
            return this._power;
        }
        /**接受网络传来的事件 */
        private webSocre: number = undefined;
        private onGameEvent(data: any): void {
            if (data.userId == DataCenter.instance.user.id) {
                return;
            }
            /** 
             * "stand|123"
             * command：stand && parameter：123 
             * */
            let parseData = (data: string): string[] => {
                let splitChar = data.split("|");
                return splitChar;
            }
            let datas = parseData(data.event);
            switch (datas[0]) {
                case "pressBegin":
                    this.userCharacter.play("xuli");
                    break;
                case "jump":
                    if (!this.isPlay) {
                        this.power = parseFloat(datas[1]);
                        if (datas[2])
                            this.webSocre = parseInt(datas[2]);
                        this.jump();
                    } else {
                        let a = { power: parseFloat(datas[1]), webScore: parseFloat(datas[2]) };
                        this.commandList.push(a);
                    }
                    break;
                case "offset":
                    this.offsetS2C = parseFloat(datas[1]);
                    break;
            }
        }
        offsetS2C = 0;

        set power(power: number) {
            this._power = power;//      power 1,power1.6,5/8
        }
        set currentPlatform(value: Platform) {
            this._currentPlatform = value;
            this.userCharacter.gotoAndStopByProgress("xuli", 0);
            this.target = GameLongJumpView.instance.platformController.creatNext(this._currentPlatform);
            this.target.offsetFromLast = GameLongJumpView.instance.platformController.getPlatformOffset(this._currentPlatform, this.target);
            let slopeOrDir = this.getSlopeOrDir();
            if (slopeOrDir.dir) {//右上
                this.userCharacter.scaleX = 1;
            } else {
                this.userCharacter.scaleX = -1;
            }
        }
        get currentPlatform() {
            return this._currentPlatform;
        }
        excuteCommand = () => {
            if (this.commandList.length == 0) {
                this.isPlay = false;
            } else {
                let command = this.commandList.shift();
                this.power = command.power;
                this.webSocre = command.webScore;
                this.jump();
            }
        }
        jump = () => {
            this.isPlay = true;
            this.hideLightPower();
            this.userCharacter.scaleY = 1;
            // let random = Math.floor(Math.random() * 2) + 1;
            // App.SoundManager.playEffect("longJump_jump" + random + "_mp3", true);
            let dis = this.getDis();
            let middleDis = this.getDis(true);
            let offset = this._power * userConfig.jumpDis;
            if (this.userCharacter.directionLOrR) {
                this.userCharacter.directionPosL1_X = this.userCharacter.x;
                this.userCharacter.directionPosL1_Y = this.userCharacter.y;
                this.userCharacter.directionPosL2_X = middleDis.x;
                this.userCharacter.directionPosL2_Y = middleDis.y;
                this.userCharacter.directionPosL3_X = dis.x;
                this.userCharacter.directionPosL3_Y = dis.y;
            } else {
                this.userCharacter.directionPosR1_X = this.userCharacter.x;
                this.userCharacter.directionPosR1_Y = this.userCharacter.y;
                this.userCharacter.directionPosR2_X = middleDis.x;
                this.userCharacter.directionPosR2_Y = middleDis.y;
                this.userCharacter.directionPosR3_X = dis.x;
                this.userCharacter.directionPosR3_Y = dis.y;
            }
            this.userCharacter.play("tiao", 1);
            egret.Tween.get(this.userCharacter).to({ factorOne: 1 }, 300).call(() => {
                /** 遍历所有目标，判断是否能跳上 */
                if (this.power * userConfig.jumpDis < this.target.offsetFromLast + this.target.offsetToEdge &&
                    this.power * userConfig.jumpDis > this.target.offsetFromLast - this.target.offsetToEdge) {
                    this.userCharacter.scaleY = 0.8;
                    let random = Math.floor(Math.random() * 3) + 1;
                    // App.SoundManager.playEffect("longJump_jumpOver" + random + "_mp3", true);
                    /** MiniPK,本地AI
                     */
                    this.userCharacter.gotoAndStopByProgress("xuli", 0);
                    if (DataCenter.instance.room.IsAI) {
                        if (this.power * userConfig.jumpDis < this.target.offsetFromLast + this.target.offsetToEdge * 0.3 &&
                            this.power * userConfig.jumpDis > this.target.offsetFromLast - this.target.offsetToEdge * 0.3) {
                            if (this.ai.combo < 5)
                                this.ai.combo++;
                            if (isNaN(this.ai.combo)) {
                                this.ai.combo = 0;
                                GameLongJumpView.instance.stateController.comScore += 1;
                            } else
                                GameLongJumpView.instance.stateController.comScore += this.ai.combo * 2;
                        }
                        else {
                            this.ai.combo = 0;
                            GameLongJumpView.instance.stateController.comScore += 1;
                        }
                    }
                    this.posY = this.userCharacter.y;
                    this.currentPlatform = this.target;
                    egret.Tween.get(this.userCharacter).to({ scaleY: 1 }, 300).call(this.excuteCommand);
                    if (this.webSocre !== undefined && !isNaN(this.webSocre)) {
                        GameLongJumpView.instance.stateController.comScore = this.webSocre;
                        this.webSocre = undefined;
                    }
                    // console.log(`跳跃成 功==========================================================`)
                    if (DataCenter.instance.room.IsAI && GameLongJumpView.instance.stateController.comScore <= 60 && GameLongJumpView.instance.stateController.selfScore <= 60)
                        this.ai.AItouch();
                    return;
                }
                /** 都没有跳上台子 */
                if (this.power * userConfig.jumpDis > this.target.offsetFromLast + this.target.offsetToEdge)
                    GameLongJumpView.instance.gameLayer.addChildAt(this.userCharacter, 0)
                if (DataCenter.instance.room.IsAI)
                    this.ai.combo = 0;
                this.onParticleEffect(this.userCharacter.x, this.userCharacter.y);
                this.userCharacter.play("luoshui", 1);
                egret.Tween.get(this.userCharacter).to({ y: this.userCharacter.y + 120, alpha: 0 }, 800).call(() => {
                    this.userCharacter.alpha = 0.5;
                    /** 回到刚才的位置 */
                    GameLongJumpView.instance.gameLayer.addChild(this.userCharacter)
                    this.setPos();
                    this.userCharacter.gotoAndStopByProgress("xuli", 0);
                    egret.Tween.get(this.userCharacter).to({ alpha: 0.1 }, 50).to({ alpha: 0.5 }, 50)
                        .to({ alpha: 0.1 }, 50).to({ alpha: 0.5 }, 50).
                        to({ alpha: 0.1 }, 50).to({ alpha: 0.5 }, 50)
                    App.TimerManager.doTimer(300, 1, () => {
                        this.userCharacter.alpha = 0.5;
                        this.isPlay = false;
                        if (DataCenter.instance.room.IsAI && GameLongJumpView.instance.stateController.comScore <= 60 && GameLongJumpView.instance.stateController.selfScore <= 60)
                            this.ai.AItouch();
                    }, this)
                })
            })
        }
        dispose() {
            egret.Tween.removeTweens(this.userCharacter);
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            else
                this.ai.dispose();
            App.TimerManager.removeAll(this);
        }
    }
}