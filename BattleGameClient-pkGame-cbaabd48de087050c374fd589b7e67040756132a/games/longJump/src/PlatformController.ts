namespace GameLongJump {
    export type normalPlatformType = { target: number, isHard: boolean, pos: { x: number, y: number } };
    export type LastPlatformType = { pos: { x: number, y: number } };
    export type selectPlatformType = { hardTarget: number, easyTarget: number, pos: { x: number, y: number } }
    export type configType = normalPlatformType | selectPlatformType | LastPlatformType;
    export class PlatformController {
        static slope: number;
        static itemSlope: number;
        static MaxOffset = 400;
        platformList: {};
        constructor() {
            this.platformList = {};
            PlatformController.slope = 28 / 180 * Math.PI;
            PlatformController.itemSlope = 45 / 180 * Math.PI;
        }
        init() {
            let newPlatform: Platform = ObjectPool.pop(Platform, "max_qPlatform");
            newPlatform.init(PlatformType.max_q, 0, false);
            newPlatform.setXY(150, 700)
            GameLongJumpView.instance.gameLayer.addChildAt(newPlatform, 0);

            this.platformList[newPlatform.UID] = newPlatform;

            GameLongJumpView.instance.userController.currentPlatform = newPlatform;
            GameLongJumpView.instance.userController.setPos();
            GameLongJumpView.instance.comController.currentPlatform = newPlatform;
            GameLongJumpView.instance.comController.setPos();
            this.moveWorld(GameLongJumpView.instance.userController.target, newPlatform);
        }
        creatNext(current: Platform) {
            let nextUId = current.UID + 1;
            if (this.platformList[nextUId]) return this.platformList[nextUId];
            let dis = this.getPlatformPos(current);
            let type = this.getPlatformType();
            let newPlatform: Platform = ObjectPool.pop(Platform, PlatformType[type] + "Platform");
            newPlatform.init(type, nextUId, true);
            newPlatform.setXY(
                dis.x,
                dis.y
            )
            newPlatform.offsetFromLast = dis.offset;
            GameLongJumpView.instance.gameLayer.addChildAt(newPlatform, 0);
            this.platformList[newPlatform.UID] = newPlatform;
            this.creatSceneItems(newPlatform);
            return newPlatform;
        }
        worldOffsetX: number = 0;
        worldOffsetY: number = 0;
        moveWorld(platform: Platform, current: Platform) {
            let x = (platform.x + current.x) / 2;
            let y = (platform.y + current.y) / 2;
            egret.Tween.get(GameLongJumpView.instance.moveLayer).to({
                x: -x + App.GameWidth / 2, y: -y + App.GameHeight / 2
            }, 500, egret.Ease.sineIn);
            this.worldOffsetX = -x + App.GameWidth / 2;
            this.worldOffsetY = -y + App.GameHeight / 2;
        }
        getPlatformPos(current: Platform) {
            let random = GameLongJumpView.instance.randomConfig.shift();
            let offset: number;
            let offsetX: number;
            if (random < 0.5) {
                offset = MathUtils.reserveDecimal((random + 0.5) * PlatformController.MaxOffset, 2);
                offsetX = -offset * Math.cos(PlatformController.slope);
            }
            else {
                offset = MathUtils.reserveDecimal(random * PlatformController.MaxOffset, 2);
                offsetX = offset * Math.cos(PlatformController.slope);
            }
            let x = current.collisionX + MathUtils.reserveDecimal(offsetX, 2);
            let y = current.collisionY - MathUtils.reserveDecimal(offset * Math.sin(PlatformController.slope), 2);
            return { x: x, y: y, offset: offset };
        }
        private getPlatformType() {
            let random = GameLongJumpView.instance.randomConfig.shift();
            if (random < 0.1)
                return PlatformType.max_e;
            else if (random < 0.2)
                return PlatformType.max_q;
            else if (random < 0.3)
                return PlatformType.max_r;
            else if (random < 0.4)
                return PlatformType.max_t;
            else if (random < 0.5)
                return PlatformType.max_u;
            else if (random < 0.6)
                return PlatformType.max_w;
            else if (random < 0.7)
                return PlatformType.max_y;


            else if (random < 0.72)
                return PlatformType.a;
            else if (random < 0.74)
                return PlatformType.h;
            else if (random < 0.76)
                return PlatformType.i;
            else if (random < 0.78)
                return PlatformType.j;
            else if (random < 0.8)
                return PlatformType.m;
            else if (random < 0.82)
                return PlatformType.o;
            else if (random < 0.84)
                return PlatformType.q;
            else if (random < 0.86)
                return PlatformType.t;
            else if (random < 0.88)
                return PlatformType.g;
            else if (random < 0.9)
                return PlatformType.z;
            if (random < 0.92)
                return PlatformType.e;
            else if (random < 0.94)
                return PlatformType.l;
            else if (random < 0.96)
                return PlatformType.k;
            else if (random < 0.98)
                return PlatformType.w;
            else
                return PlatformType.max_e;
        }
        getPlatformOffset(current: Platform, next: Platform) {
            let offsetView = Math.sqrt((next.collisionY - current.collisionY) * (next.collisionY - current.collisionY) +
                (next.collisionX - current.collisionX) * (next.collisionX - current.collisionX));
            return MathUtils.reserveDecimal(offsetView, 2);
        }
        creatSceneItems(next: Platform) {
            let random = GameLongJumpView.instance.random();
            let bitmap = this.creatSceneItem();

            if (random < 0.5) {
                bitmap.x = next.x - 100 * (random + 0.5);
                bitmap.y = next.y - next.platformImg.height - (150 * random + 0.5);
            }
            else {
                bitmap.x = next.x + 100 * random;
                bitmap.y = next.y + 150 * random;
            }
            bitmap.alpha = 0;
            egret.Tween.get(bitmap).to({ alpha: 1 }, 1000);
            GameLongJumpView.instance.sceneItemLayer.addChildAt(bitmap, 0);
        }
        private creatSceneItem() {
            let type = this.getSceneItemType();
            return AssetManager.getBitmap("bj" + type + "_png");
        }
        private getSceneItemType() {
            let random = GameLongJumpView.instance.random();
            // if (random < 0.4) {
            //     return 1;
            // } else if (random < 0.55) {
            //     return 2;
            // } else if (random < 0.7) {
            //     return 3;
            // } else if (random < 0.85) {
            //     return 4;
            // } else {
            //     return 5;
            // }
            if (random < 0.7)
                return 2;
            else
                return 5;
        }
        dispose() {
            ObjectPool.clearClass("max_ePlatform");
            ObjectPool.clearClass("max_yPlatform");
            ObjectPool.clearClass("max_uPlatform");
            ObjectPool.clearClass("max_yPlatform");
            ObjectPool.clearClass("max_rPlatform");
            ObjectPool.clearClass("max_qPlatform");
            ObjectPool.clearClass("max_ePlatform");
            ObjectPool.clearClass("kPlatform");
            ObjectPool.clearClass("ePlatform");
            ObjectPool.clearClass("lPlatform");
            ObjectPool.clearClass("wPlatform");
            ObjectPool.clearClass("aPlatform");
            ObjectPool.clearClass("gPlatform");
            ObjectPool.clearClass("hPlatform");
            ObjectPool.clearClass("iPlatform");
            ObjectPool.clearClass("jPlatform");
            ObjectPool.clearClass("mPlatform");
            ObjectPool.clearClass("oPlatform");
            ObjectPool.clearClass("qPlatform");
            ObjectPool.clearClass("tPlatform");
            ObjectPool.clearClass("zPlatform");

            egret.Tween.removeTweens(GameLongJumpView.instance.gameLayer);
        }
    }
}