namespace GameLongJump {
    export class userConfig {
        static jumpDis = 160;
        static jumpSpeed = 8;
        static power = 0.4;//初始力量
        static powerAdd = 0.2;//每100ms增加的力量
        static jumpHeight = 200;
        static powerLimit = 4;
        static score = 60;//比分最大值
    }
    export class UserController extends CharacterController {
        private floatScore: DBArmature;
        private normalPlatformEffect: DBArmature;
        constructor() {
            super();
        }
        init() {
            this.normalPlatformEffect = AssetManager.getDBArmature("Fang_1")
            this.normalPlatformEffect.gotoAndStopByProgress("newAnimation", 1);
            if (DataCenter.instance.room.selfIsMaster) {
                this.userCharacter = new Character(AssetManager.getDBArmature("wa1")["_armature"]);
            }
            else {
                this.userCharacter = new Character(AssetManager.getDBArmature("wa2")["_armature"]);
            }
            this.userCharacter.name = "Self";
            GameLongJumpView.instance.gameLayer.addChild(this.userCharacter);

            this._power = userConfig.power;

            this.floatScore = AssetManager.getDBArmature("floatScore");
            GameLongJumpView.instance.moveLayer.addChild(this.floatScore);
            GameLongJumpView.instance.moveLayer.addChild(this.normalPlatformEffect);
            this.combo = 0;
        }
        set currentPlatform(value: Platform) {
            this._currentPlatform = value;
            this.target = GameLongJumpView.instance.platformController.creatNext(this._currentPlatform);
            this.target.offsetFromLast = GameLongJumpView.instance.platformController.getPlatformOffset(this._currentPlatform, this.target);
            let slopeOrDir = this.getSlopeOrDir();
            if (slopeOrDir.dir) {//右上
                this.userCharacter.scaleX = 1;
            } else {
                this.userCharacter.scaleX = -1;
            }
        }
        get power() {
            return this._power;
        }
        private isPlayAnim = false;
        set power(power: number) {
            this._power = power;//      power 1,power1.6,5/8
            this._currentPlatform.scaleY = (CharacterController.powerSize - power) / CharacterController.powerSize;
            this.userCharacter.y = this.posY + (this._currentPlatform.height * (1 - this._currentPlatform.scaleY));
            this.particalY = this.posY + (this._currentPlatform.height * (1 - this._currentPlatform.scaleY));
            if (!this.isPlayAnim) {
                this.setPowerAnim();
                this.isPlayAnim = true;
            }
        }

        private shakeTips(score: number) {
            this.floatScore.scaleX = this.floatScore.scaleY = 1.4;
            this.floatScore.x = this._currentPlatform.collisionX;
            this.floatScore.y = this._currentPlatform.collisionY;
            this.floatScore.play(`+${score}`, 1);
            //加分
            if (!DataCenter.instance.room.IsAI) {
                let Score = GameLongJumpView.instance.stateController.selfScore + score;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "Score|" + DataCenter.instance.user.id + "|" + Score + "|" + this.combo, 1);
                console.log("Score" + Score)
            }
            else
                GameLongJumpView.instance.stateController.selfScore += score;
        }
        private landSccess = (score: number) => {
            if (score !== 1 && score !== 2 && score !== 4 && score !== 6 && score !== 8 && score !== 10) return;
            //溅起草花
            if (this.target.platformType === PlatformType.k ||
                this.target.platformType === PlatformType.q ||
                this.target.platformType === PlatformType.w ||
                this.target.platformType === PlatformType.max_r ||
                this.target.platformType === PlatformType.g) {
                this.normalPlatformEffect.x = this.userCharacter.x;
                this.normalPlatformEffect.y = this.userCharacter.y;
                this.normalPlatformEffect.play("newAnimation", 1);
            }
            this.userCharacter.gotoAndStopByProgress("xuli", 0);
            this._power = userConfig.power;
            /** 压缩位置 */
            this.posY = this.userCharacter.y;
            this.jumpSuccessLightAnim(this.combo);
            this.currentPlatform = this.target;
            this.userCharacter.scaleY = 0.8;
            this.shakeTips(score);
            //播放音效
            App.SoundManager.playEffect(`A＋${score}_mp3`);
            GameLongJumpView.instance.platformController.moveWorld(this.target, this._currentPlatform);
            GameLongJumpView.instance.canJump = true;
            egret.Tween.get(this.userCharacter).to({ scaleY: 1 }, 300)
        }
        private landFailure = () => {
            if (this.power * userConfig.jumpDis > this.target.offsetFromLast + this.target.offsetToEdge)
                GameLongJumpView.instance.gameLayer.addChildAt(this.userCharacter, 0)
            this.combo = 0;
            this.userCharacter.play("luoshui", 1);
            let random = Math.floor(Math.random() * 3) + 1;
            App.SoundManager.playEffect("longJump_drop" + random + "_mp3", true);
            this.onParticleEffect(this.userCharacter.x, this.userCharacter.y);
            egret.Tween.get(this.userCharacter).to({ y: this.userCharacter.y + 120, alpha: 0 }, 800).call(() => {
                this.userCharacter.alpha = 1;
                /** 回到刚才的位置 */
                GameLongJumpView.instance.gameLayer.addChild(this.userCharacter);
                this.userCharacter.gotoAndStopByProgress("xuli", 0);
                this.setPos();
                let effect = new EffectUtils();
                effect.startFlicker(this.userCharacter, 50);
                App.TimerManager.doTimer(300, 1, () => {
                    effect.stopFlicker(this.userCharacter);
                    this.userCharacter.alpha = 1;
                    GameLongJumpView.instance.canJump = true;
                }, this)
            })
        }
        combo: number;
        jump() {
            this.hideLightPower();
            this.isPlayAnim = false;
            egret.Tween.get(this._currentPlatform).to({ scaleY: 1 }, 300, egret.Ease.quintOut);
            GameLongJumpView.instance.canJump = false;
            let random = Math.floor(Math.random() * 2) + 1;
            App.SoundManager.stopEffect("longJump_powering_mp3");
            App.SoundManager.stopEffect("longJump_powerLimit_mp3");
            GameLongJumpView.instance.sound = false;
            App.SoundManager.playEffect("longJump_jump" + random + "_mp3", true);
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "jump|" + this.power, 2);
            }
            this.userCharacter.play("tiao");
            this.userCharacter.scaleY = 1;
            let dis = this.getDis();
            let middleDis = this.getDis(true);

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
            egret.Tween.get(this.userCharacter).to({ factorOne: 1 }, 300).call(() => {
                /** 目标，判断是否能跳上 */
                if (this.power * userConfig.jumpDis < this.target.offsetFromLast + this.target.offsetToEdge &&
                    this.power * userConfig.jumpDis > this.target.offsetFromLast - this.target.offsetToEdge) {
                    if (this.power * userConfig.jumpDis < this.target.offsetFromLast + this.target.offsetToEdge * 0.3 &&
                        this.power * userConfig.jumpDis > this.target.offsetFromLast - this.target.offsetToEdge * 0.3) {
                        if (this.combo < 5)
                            this.combo++;
                        if (this.combo == 5)
                            App.SoundManager.playEffect("longJump_handclap_mp3", true);
                        if (isNaN(this.combo)) {
                            this.combo = 0;
                            this.landSccess(1);
                        } else
                            this.landSccess(this.combo * 2);
                    }
                    else {
                        this.combo = 0;
                        this.landSccess(1);
                    }
                    return;
                }
                /** 都没有跳上台子 */
                this.landFailure();
            })
        }
        dispose() {
            egret.Tween.removeTweens(this.userCharacter);
            App.TimerManager.removeAll(this);
        }
    }
}   