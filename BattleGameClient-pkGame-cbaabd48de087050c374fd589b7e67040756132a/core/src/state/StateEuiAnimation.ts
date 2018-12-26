/**
 * Created by yangsong on 2014/11/22.
 */
class StateEuiAnimation extends StateEui {

    private showAnimationCallback: Function;

    public constructor(skinClass: any) {
        super(skinClass);
    }

    public show(): void {
        super.show();

        if (this.showAnimationCallback) {
            this.doShowAnimation(this.showAnimationCallback);
        }
    }

    //对外调用使用
    public showAnimation(callBack: Function): void {
        this.showAnimationCallback = callBack;
    }

    //重写使用
    protected doShowAnimation(callBack: Function): void {

    }

    //对外调用使用
    public removeAnimation(callBack: Function): void {
        this.doRemoveAnimation(callBack);
    }

    //重写使用
    protected doRemoveAnimation(callBack: Function): void {

    }
}