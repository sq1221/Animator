class ShootingBulletController extends egret.DisplayObjectContainer {
    private bulletlist: egret.Bitmap[] = [];
    private index: number;
    private bulletReloadBar: BulletReloadBar;
    private bullets: egret.DisplayObjectContainer;
    constructor() {
        super();
        this.bulletReloadBar = new BulletReloadBar();
        this.addChild(this.bulletReloadBar);

        this.bullets = new egret.DisplayObjectContainer();
        this.addChild(this.bullets);

        let x = 0;
        for (let i = 0; i < UserConfig.bulletLimit; i++) {
            let bullet = AssetManager.getBitmap("bullet1_png");
            bullet.scaleX = bullet.scaleY = 0.7
            x += 40;
            bullet.x = x;
            this.bullets.addChild(bullet);
            this.bulletlist.push(bullet);
        }
        this.index = UserConfig.bulletLimit - 1;
        this.bulletLimit = UserConfig.bulletLimit;
        this.x = 240;
        this.y = 840 * GameShootingView.instance.adaptScaleY;
        GameShootingView.instance.basicLayer.addChildAt(this, 10);
    }
    bulletLimit: number;
    fire() {
        if (this.index >= 0 && this.index < UserConfig.bulletLimit) {
            this.bulletlist[this.index].alpha = 0.3;
            this.index--;
            this.bulletLimit--;
        }
    }
    cannotFire() {
        this.bulletReloadBar.flip();
    }
    private bulletFickerEffect: EffectUtils;
    private bulletFicker: number;//延迟参数
    reload() {
        if (this.bulletFicker) //已经在换弹
            return;
        if (!this.bulletFickerEffect)
            this.bulletFickerEffect = new EffectUtils();
        this.bulletFickerEffect.startFlicker(this.bullets, 500);
        this.bulletFicker = setInterval(this.stopBulletFlicker, UserConfig.reloadBullet);
    }
    private stopBulletFlicker = () => {
        this.cancelFlickerAndInterval();
        this.alpha = 1;
        this.recover();
    }
    private recover() {
        for (let bullet of this.bulletlist) {
            bullet.alpha = 1;
        }
        this.index = UserConfig.bulletLimit - 1;
        this.bulletLimit = UserConfig.bulletLimit;
    }
    private cancelFlickerAndInterval() {
        if (this.bulletFicker) {
            this.bulletFickerEffect.stopFlicker(this.bullets);
            clearInterval(this.bulletFicker);
            this.bulletFicker = undefined;
        }
    }
    nextRound() {
        this.recover();
        this.cancelFlickerAndInterval();
        this.bulletReloadBar.nextRound();
    }
    dispose() {
        for (let bullet of this.bulletlist) {
            this.bullets.removeChild(bullet);
        }
        this.bulletlist = [];
        this.cancelFlickerAndInterval();
        this.bulletReloadBar.dispose();
    }
}

class BulletReloadBar extends egret.DisplayObjectContainer {
    private bar: egret.Bitmap;
    private process: egret.Bitmap;
    private barBorder: egret.Bitmap;
    private barMask: egret.Bitmap;
    constructor() {
        super();
        this.bar = AssetManager.getBitmap("bulletReloadOver_png", false, true);
        this.addChild(this.bar);
        this.process = AssetManager.getBitmap("bulletReload_png", false, true);
        this.addChild(this.process);
        this.process.alpha = 0;
        this.barBorder = AssetManager.getBitmap("bulletBorderFlip_png", false, true);
        this.addChildAt(this.barBorder, 5);
        this.barBorder.alpha = 0;
        this.barMask = AssetManager.getBitmap("bulletReloadMask_png", false, true);
        this.addChildAt(this.barMask, 6);
    }
    reload() {
        this.process.alpha = 1;
        let targetWidth = this.process.width;
        this.process.width = 1;
        egret.Tween.get(this.process).to({ width: targetWidth }, UserConfig.reloadBullet).call(() => {
            this.process.alpha = 0;
        });
    }
    flip() {
        egret.Tween.get(this.barBorder).to({ alpha: 1 }, 200).to({ alpha: 0 }, 100).to({ alpha: 1 }, 200).to({ alpha: 0 }, 100);
    }
    nextRound() {
        egret.Tween.removeTweens(this.barBorder);
    }
    dispose() {
        egret.Tween.removeTweens(this.barBorder);
    }
}