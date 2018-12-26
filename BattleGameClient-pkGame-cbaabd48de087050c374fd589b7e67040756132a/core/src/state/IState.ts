interface IState extends egret.IEventDispatcher {
    addToParent(parent: egret.DisplayObjectContainer, param: any): void
    init(): void
    show(showParam?: any): void
    tick(advancedTime: number): void
    close(): void
    dispose(): void
    next(state: string, param?: any): void
    popup(state: string, param?: any): void
    returnToLast(param?: any): void
}