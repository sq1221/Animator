namespace GameLongJump {
    export class CharacterController {
        userCharacter: Character;
        target: Platform;
        _power: number;
        /**缩放动画需要的 */
        static powerSize: number;
        constructor() {
            if (CharacterController.powerSize == undefined) {
                //根据音乐和型变量算的值
                CharacterController.powerSize = userConfig.powerLimit * 5;
            }
            this.initShuihua();
            this.initPower();
            this.initbo();
            this.hideLightPower();
        }
        private initbo = () => {
            this.circleLightFallDB1 = AssetManager.getDBArmature("bo");
            this.circleLightFallDB1.gotoAndStopByProgress("newAnimation", 1)
            GameLongJumpView.instance.gameLayer.addChild(this.circleLightFallDB1);

            this.circleLightFallDB2 = AssetManager.getDBArmature("bo");
            this.circleLightFallDB2.gotoAndStopByProgress("newAnimation", 1)
            GameLongJumpView.instance.gameLayer.addChild(this.circleLightFallDB2);
        }
        private initShuihua = () => {
            var texture = RES.getRes("fallintowater_png");
            var config = RES.getRes("fallintowater_json");
            this.particleShuiHua = new particle.GravityParticleSystem(texture, config);
            GameLongJumpView.instance.gameLayer.addChild(this.particleShuiHua);
        }
        private initPower = () => {
            var texture1 = RES.getRes("xuli1_png");
            var config1 = RES.getRes("xuli1_json");
            this.circleLightPowerPartical1 = new particle.GravityParticleSystem(texture1, config1);
            GameLongJumpView.instance.gameLayer.addChild(this.circleLightPowerPartical1);
            var texture2 = RES.getRes("xuli2_png");
            var config2 = RES.getRes("xuli2_json");
            this.circleLightPowerPartical2 = new particle.GravityParticleSystem(texture2, config2);
            GameLongJumpView.instance.gameLayer.addChild(this.circleLightPowerPartical2);
        }
        posY: number;
        setPos() {
            this.userCharacter.x = this._currentPlatform.collisionX;
            this.userCharacter.y = this._currentPlatform.collisionY;
            this.posY = this._currentPlatform.collisionY;
            this._power = userConfig.power;
        }
        protected _currentPlatform: Platform;
        //方向0左上，1 右上
        getSlopeOrDir() {
            let offsetY = this.target.collisionY - this._currentPlatform.collisionY;
            let offsetX = this.target.collisionX - this._currentPlatform.collisionX;
            let slope = offsetY / offsetX;//斜率
            let dir: number;//方向0左上，1 右上
            if (slope > 0) {
                this.userCharacter.directionLOrR = 1;
                dir = 0;
            }
            else {
                this.userCharacter.directionLOrR = 0;
                slope *= -1;
                dir = 1;
            }
            return {
                slope: slope,
                dir: dir
            }
        }
        particleShuiHua: particle.GravityParticleSystem;
        // 粒子效果
        protected onParticleEffect(_X: number, _Y: number): void {
            this.particleShuiHua.y = _Y;
            this.particleShuiHua.x = _X;
            this.particleShuiHua.start(500);
        }
        /** 保证所有目标点在一个斜率上 */
        protected getDis(isHalf = false) {
            let slopeOrDir = this.getSlopeOrDir();
            let offset = this._power * userConfig.jumpDis;
            // let c = this._currentPlatform.y - this._currentPlatform.x * slope;//常数c
            let y: number, x: number;
            if (isHalf) {
                let middley: number, middlex: number;
                let sslope = -1 / slopeOrDir.slope;
                if (slopeOrDir.dir) {//右上
                    middley = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope)) / 2;
                    middlex = this._currentPlatform.collisionX + offset * Math.cos(Math.atan(slopeOrDir.slope)) / 2;
                    y = middley + userConfig.jumpHeight * Math.sin(Math.atan(sslope))
                    x = middlex - userConfig.jumpHeight * Math.cos(Math.atan(sslope))
                } else {//左上
                    middley = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope)) / 2;
                    middlex = this._currentPlatform.collisionX - offset * Math.cos(Math.atan(slopeOrDir.slope)) / 2;
                    y = middley + userConfig.jumpHeight * Math.sin(Math.atan(sslope))
                    x = middlex + userConfig.jumpHeight * Math.cos(Math.atan(sslope))
                }
                return { x: x, y: y };
            }
            if (slopeOrDir.dir) {//右上
                y = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope));
                x = this._currentPlatform.collisionX + offset * Math.cos(Math.atan(slopeOrDir.slope));
            } else {//左上
                y = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope));
                x = this._currentPlatform.collisionX - offset * Math.cos(Math.atan(slopeOrDir.slope));
            }
            return { x: x, y: y };
        }
        public circleLightFallDB1: DBArmature;
        public circleLightFallDB2: DBArmature;

        protected jumpSuccessLightAnim = (combo: number): void => {
            let temp = Math.ceil(combo / 2);
            this.circleLightFallDB1.x = this.userCharacter.x
            this.circleLightFallDB1.y = this.userCharacter.y;
            this.circleLightFallDB2.x = this.userCharacter.x
            this.circleLightFallDB2.y = this.userCharacter.y;
            if (temp == 0) temp = 1;
            this.circleLightFallDB1.play("newAnimation", temp);
            if (combo - temp > 0) {
                App.TimerManager.doFrame(10, 1, () => {
                    this.circleLightFallDB2.play("newAnimation", combo - temp);
                }, this)
            }
        }

        public circleLightPowerPartical1: particle.GravityParticleSystem;
        public circleLightPowerPartical2: particle.GravityParticleSystem;
        hideLightPower = () => {
            this.isRemovePower = true;
            this.circleLightPowerPartical1.stop(true);
            this.circleLightPowerPartical2.stop(true);
        }

        private isRemovePower = true;
        protected setPowerAnim = (): void => {
            this.isRemovePower = false;
            // 搜索动画
            let PowerAnim = () => {
                if (this.isRemovePower) return;
                this.circleLightPowerPartical1.y = this.userCharacter.y;
                this.circleLightPowerPartical1.x = this.userCharacter.x;
                this.circleLightPowerPartical1.start();
                this.circleLightPowerPartical2.y = this.userCharacter.y;
                this.circleLightPowerPartical2.x = this.userCharacter.x;
                this.circleLightPowerPartical2.start();
            }
            PowerAnim();
        }
        set particalY(value: number) {
            this.circleLightPowerPartical1.y = value;
            this.circleLightPowerPartical2.y = value;
        }
        dispose() {
        }
    }
}