class ClickAnimation extends BaseClass {

    public register(target: egret.DisplayObject): void {

        var addFunc: Function = target.$onAddToStage.bind(target);
        target.$onAddToStage = (stage: egret.Stage, nestLevel: number) => {
            addFunc(stage, nestLevel);
            this.addAnimation(target);
        }

        var removeFunc: Function = target.$onRemoveFromStage.bind(target);
        target.$onRemoveFromStage = () => {
            removeFunc();
            this.ramoveAnimation(target);
        }

        if (target.stage) {
            this.addAnimation(target);
        }
    }

    private addAnimation(target: egret.DisplayObject): void {
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
        target.addEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
        target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
    }

    private ramoveAnimation(target: egret.DisplayObject): void {
        target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
        target.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
        target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
    }

    private onClickBegin(evt: egret.TouchEvent): void {
        var target: egret.DisplayObject = evt.currentTarget;
        egret.Tween.get(target, egret.Ease.sineOut)
            .to({ scaleX: 0.9, scaleY: 0.9 }, 100)
    }

    private onClickEnd(evt: egret.TouchEvent): void {
        var target: egret.DisplayObject = evt.currentTarget;
        egret.Tween.get(target, egret.Ease.sineOut)
            .to({ scaleX: 1, scaleY: 1 }, 100)
    }
}