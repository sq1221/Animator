class StateManager {

    private _parent: egret.DisplayObjectContainer;
    private _euiParent: eui.UILayer;
    private _popupParent: eui.UILayer;
    private _stateObj: any;
    private _curState: IState;
    private _curStateName: string;
    private _prevState: IState;
    private _prevStateName: string;

    private _curTime: number;
    private _lastTime: number;

    public constructor(parent: egret.DisplayObjectContainer, euiParent: eui.UILayer, popupParent: eui.UILayer) {
        this._parent = parent;
        this._euiParent = euiParent;
        this._popupParent = popupParent;
        this._stateObj = {};
    }

    public startTick(): void {
        this._curTime = egret.getTimer();
        egret.startTick(this.tick, this);
    }

    public stopTick(): void {
        egret.stopTick(this.tick, this);
    }

    public tick(advancedTime: number): boolean {
        this._lastTime = this._curTime;
        this._curTime = advancedTime;

        if (this._curState) {
            this._curState.tick(this._curTime - this._lastTime);
        }
        return true;
    }

    public registerState(name: string, state: IState): void {
        this._stateObj[name] = state;
    }

    public unregisterState(name: string): void {
        var state: IState = this._stateObj[name];
        if (!state) {
            return;
        }

        this._stateObj[name] = null;
        delete this._stateObj[name];
    }

    public setCurStateName(name: string, showParam?: any): void {
        if (this._curStateName == name) {
            this._curState.show(showParam);
            return;
        }
        var state: IState = this._stateObj[name];
        if (state) {
            this.setCurState(state, name, showParam);
        }
    }

    private addStateEvents(state: IState): void {
        state.addEventListener(StateEvent.NEXT, this.onNext, this);
        state.addEventListener(StateEvent.LAST, this.onLast, this);
        state.addEventListener(StateEvent.POPUP, this.onPopup, this);
        state.addEventListener(StateEvent.POPUPCLOSE, this.onPopupClose, this);
    }

    private removeStateEvents(state: IState): void {
        state.removeEventListener(StateEvent.NEXT, this.onNext, this);
        state.removeEventListener(StateEvent.LAST, this.onLast, this);
        state.removeEventListener(StateEvent.POPUP, this.onPopup, this);
        state.removeEventListener(StateEvent.POPUPCLOSE, this.onPopupClose, this);
    }

    private setCurState(state: IState, stateName: string, showParam: any): void {
        if (this._curState == state) {
            this._curState.show(showParam);
            return;
        }
        if (this._curState) {
            this.removeStateEvents(this._curState);
            this._curState.close();
            this._prevState = this._curState;
            this._prevStateName = this._curStateName;
        }

        var parent: egret.DisplayObjectContainer = this._parent;
        if (state instanceof StateEui) {
            parent = this._euiParent;
        }

        this._curState = state;
        this._curStateName = stateName;
        this.addStateEvents(this._curState);
        this._curState.addToParent(parent, showParam);
    }

    private onPopup(e: StateEvent): void {
        var state: IState = this._stateObj[e.data];
        if (state) {
            state["isPopup"] = true;
            this.addStateEvents(state);
            state.addToParent(this._popupParent, e.paramData);
        }
    }

    private onPopupClose(e: StateEvent): void {
        var state: IState = <IState>e.currentTarget;
        if (state) {
            this.removeStateEvents(state);
        }
    }

    private onNext(e: StateEvent): void {
        var state: IState = this._stateObj[e.data];
        if (state) {
            this.setCurState(state, e.data, e.paramData);
        }
    }

    private onLast(e: StateEvent): void {
        if (this._prevState) {
            this.setCurState(this._prevState, this._prevStateName, e.paramData);
        }
    }

    public get curState(): IState {
        return this._curState;
    }

    public get curStateName(): string {
        return this._curStateName;
    }
}