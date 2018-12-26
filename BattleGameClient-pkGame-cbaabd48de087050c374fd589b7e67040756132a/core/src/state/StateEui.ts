/**
 * Created by yangsong on 2014/11/22.
 */
class StateEui extends eui.Component implements IState {

    public isInit: boolean;
    private skinClass: any;
    private showParam: any;

    /**
     * 构造函数
     */
    public constructor(skinClass: any) {
        super();
        if (typeof (skinClass) !== "function") {
            console.error("skinName请使用类名");
            return;
        }
        this.skinClass = skinClass;

        this.percentHeight = 100;
        this.percentWidth = 100;
    }

    public addToParent(parent: egret.DisplayObjectContainer, param: any): void {
        this.showParam = param;
        parent.addChild(this);

        if (!this.isInit) {
            this.once(eui.UIEvent.COMPLETE, this.initComplate, this);
            this.skinName = this.skinClass;
        } else {
            this.show(this.showParam);
        }
    }

    private initComplate(): void {
        this.skinClass = null;
        this.init();
        if (this.stage) {
            this.show(this.showParam);
        }
    }

    public init(): void {
        this.isInit = true;
    }

    public show(showParam?: any): void {
        this.addMesssgaeListener();
    }

    public addMesssgaeListener(): void {

    }

    public next(state: string, param?: any): void {
        this.dispatchEvent(new StateEvent(StateEvent.NEXT, state, param));
    }

    public popup(state: string, param?: any): void {
        this.dispatchEvent(new StateEvent(StateEvent.POPUP, state, param));
    }

    public returnToLast(param?: any): void {
        this.dispatchEvent(new StateEvent(StateEvent.LAST, null, param));
    }

    public tick(advancedTime: number): void {

    }

    public close(): void {
        if (this.parent) {
            if (this["isPopup"]) {
                this.dispatchEvent(new StateEvent(StateEvent.POPUPCLOSE, null, null));
            }
            this.parent.removeChild(this);
            this.dispose();
        }
    }

    public dispose(): void {
        App.MessageCenter.removeAll(this);
        App.TimerManager.removeAll(this);
        this.showParam = null;
    }
}