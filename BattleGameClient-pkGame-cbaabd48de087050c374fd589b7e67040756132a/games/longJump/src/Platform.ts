namespace GameLongJump {
    export enum PlatformType {
        a,
        g,
        h,
        i,
        j,
        m,
        o,
        q,
        t,
        z,
        max_e,
        max_q,
        max_r,
        max_t,
        max_u,
        max_w,
        max_y,


        k,
        e,
        l,
        w
    }
    export class Platform extends egret.DisplayObjectContainer {
        constructor() {
            super();

        }
        protected _UID: number;
        get UID() {
            return this._UID;
        }
        platformType: PlatformType;
        platformImg: egret.Bitmap;
        protected platformShadow: egret.Bitmap;
        offsetFromLast: number;
        offsetToEdge: number;

        collisionX: number;
        collisionY: number;
        // private test: egret.Bitmap;
        init(type: PlatformType, UID: number, isPlayCartoon = true) {
            if (this.platformType === type) return;
            this._UID = UID;
            this.platformType = type;
            if (this.platformType === PlatformType.max_e || this.platformType === PlatformType.max_q || this.platformType === PlatformType.max_r ||
                this.platformType === PlatformType.max_t || this.platformType === PlatformType.max_u
                || this.platformType === PlatformType.max_w || this.platformType === PlatformType.max_y) {
                this.platformImg = AssetManager.getBitmap("longJump_" + PlatformType[this.platformType] + "1_png");
                this.platformShadow = AssetManager.getBitmap("longJump_max_shadow_png");
            } else {
                this.platformImg = AssetManager.getBitmap("Jump" + PlatformType[this.platformType] + "1_png");
                this.platformShadow = AssetManager.getBitmap("Jump" + PlatformType[this.platformType] + "3_png");
            }
            this.collisionX = this.platformImg.anchorOffsetX = this.platformImg.width / 2;
            this.platformImg.anchorOffsetY = this.platformImg.height;
            /**手动设置碰撞点中心，图片尺寸都不同 */
            switch (this.platformType) {
                case PlatformType.a:
                    this.collisionY = 34;
                    this.platformShadow.anchorOffsetY = 34;
                    this.offsetToEdge = 32;
                    break;
                case PlatformType.e:
                    this.collisionY = 24;
                    this.platformShadow.anchorOffsetY = 24;
                    this.offsetToEdge = 32;
                    break;
                case PlatformType.g:
                    this.collisionY = 64;
                    this.platformShadow.anchorOffsetY = 64;
                    this.offsetToEdge = 67;
                    break;
                case PlatformType.h:
                    this.collisionY = 42;
                    this.platformShadow.anchorOffsetY = 42;
                    this.offsetToEdge = 44;
                    break;
                case PlatformType.i:
                    this.collisionY = 35;
                    this.platformShadow.anchorOffsetY = 35;
                    this.offsetToEdge = 36;
                    break;
                case PlatformType.j:
                    this.collisionY = 35;
                    this.platformShadow.anchorOffsetY = 35;
                    this.offsetToEdge = 35;
                    break;
                case PlatformType.k:
                    this.collisionY = 43;
                    this.platformShadow.anchorOffsetY = 64;
                    this.offsetToEdge = 42;
                    break;
                case PlatformType.l:
                    this.collisionY = 43;
                    this.platformShadow.anchorOffsetY = 43;
                    this.offsetToEdge = 45;
                    break;
                case PlatformType.m:
                    this.collisionY = 35;
                    this.platformShadow.anchorOffsetY = 35;
                    this.offsetToEdge = 35;
                    break;
                case PlatformType.o:
                    this.collisionY = 64;
                    this.platformShadow.anchorOffsetY = 64;
                    this.offsetToEdge = 65;
                    break;
                case PlatformType.q:
                    this.collisionY = 42;
                    this.platformShadow.anchorOffsetY = 42;
                    this.offsetToEdge = 59;
                    break;
                case PlatformType.t:
                    this.collisionY = 50;
                    this.platformShadow.anchorOffsetY = 50;
                    this.offsetToEdge = 50;
                    break;
                case PlatformType.w:
                    this.collisionY = 23;
                    this.platformShadow.anchorOffsetY = 23;
                    this.offsetToEdge = 31;
                    break;
                case PlatformType.z:
                    this.collisionY = 36;
                    this.platformShadow.anchorOffsetY = 36;
                    this.offsetToEdge = 37;
                    break;
                default:
                    this.collisionY = 65;
                    this.platformShadow.anchorOffsetY = 65;
                    this.offsetToEdge = 69;
                    break;
            }

            this.addChild(this.platformShadow);

            this.platformImg.name = "platformImg"
            this.addChild(this.platformImg);
            if (isPlayCartoon) {
                this.platformShadow.alpha = 0;
                this.platformImg.y = -800;
                this.playCartoon();
            } else {
                this.platformShadow.y = this.platformImg.y;
            }
            // this.test = AssetManager.getBitmap("longJump_blackMask_png");
            // this.test.height = this.test.width = 20;
            // this.test.anchorOffsetX = this.test.width / 2;
            // this.test.anchorOffsetY = this.test.height / 2;
            // this.test.x = 0;
            // this.test.y = -(this.platformImg.height - this.collisionY);
            // this.addChild(this.test);
        }
        /**传进来的应该是collison所在位置 */
        setXY(x: number, y: number) {
            // this.x = x;
            // this.y = y;
            // this.collisionX = x;
            // this.collisionY = y - this.platformImg.height + this.collisionY;


            this.x = x;
            this.y = y + this.platformImg.height - this.collisionY;
            this.collisionX = x;
            this.collisionY = y;
        }
        protected playCartoon() {
            egret.Tween.get(this.platformImg).to({
                y: 0
            }, 300).call(() => {
                this.platformShadow.alpha = 1;
                this.platformShadow.y = this.platformImg.y;
            })
        }
    }
}