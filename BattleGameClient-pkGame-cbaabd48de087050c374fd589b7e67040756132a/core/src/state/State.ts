class State extends egret.DisplayObjectContainer implements IState {
    public isInit: boolean;

    public constructor() {
        super();
    }

    public addToParent(parent: egret.DisplayObjectContainer, param: any): void {
        parent.addChild(this);

        if (!this.isInit) {
            this.init();
        }
        this.show(param);
    }

    public init(): void {
        this.isInit = true;
    }

    public show(showParam?: any): void {
        
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
    }
}