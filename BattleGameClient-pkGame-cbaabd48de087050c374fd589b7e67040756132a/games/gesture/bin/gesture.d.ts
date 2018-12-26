declare class GameGestureAutonomy {
    constructor();
    private readonly successRate;
    private autonomyTick;
    start: () => void;
    stop: () => void;
    addItem: (time: number) => void;
}
declare class simulateItem {
    private needJudge;
    y: number;
    constructor();
    startJudge: () => void;
    judgeTick: () => void;
}
declare class GameGestureItemMaker extends egret.DisplayObjectContainer {
    private blackMask;
    private gesTureArray;
    runningInterval: number;
    runningSec: number;
    private items;
    private teachDelta;
    private teachV;
    private soundArray;
    constructor();
    changeSpeed: (runningInterval: number, timeInterval: number, tweenTime?: number) => void;
    start: (timeInterval?: number) => void;
    extraStart: (timeInterval?: number) => void;
    stop: () => void;
    private getTypeAndName;
    itemMakeOne: (balloonNum: number, isTeach?: number) => void;
    itemMaker: () => void;
    doubleItemMaker: () => void;
    playSoundEffect: (isLost?: boolean) => void;
}
declare class GestureItems extends egret.DisplayObjectContainer {
    itemType: string;
    itemName: string;
    needJudge: boolean;
    private balloon;
    private role;
    private boomEffect;
    private tempX;
    private tempY;
    rightFactor: number;
    leftFactor: number;
    constructor(name: string, type: string);
    dispose: () => void;
    judge: (judgeType: string) => void;
    judgeTick: () => void;
    startJudge: () => void;
    stopJudge: () => void;
    remove: () => void;
}
declare class GestureComplexItems extends egret.DisplayObjectContainer {
    item1Type: string;
    item1Name: string;
    item2Type: string;
    item2Name: string;
    needJudgeLeft: boolean;
    needJudgeRight: boolean;
    private balloon1;
    private boomEffect1;
    private balloon2;
    private boomEffect2;
    private role;
    private tempX;
    private tempY;
    rightFactor: number;
    leftFactor: number;
    constructor(name1: string, type1: string, name2: string, type2: string);
    dispose: () => void;
    judgeRightTick: () => void;
    judgeLeftTick: () => void;
    startJudge: () => void;
    stopJudgeLeft: () => void;
    stopJudgeRight: () => void;
    stopJudge: () => void;
    success: () => void;
    remove: () => void;
}
declare class healthCtrlor extends egret.DisplayObjectContainer {
    health: number;
    direction: string;
    private health1;
    private health2;
    private health3;
    constructor(direction_: string);
    getHealth: () => number;
    subtractHealth: () => void;
    setHealth: (healthNum: number) => void;
}
declare class GameGestureEventClass {
    static EVENT_GAMEREADY: string;
    static EVENT_BREAK: string;
    static EVENT_LOST: string;
    static EVENT_WIN: string;
    static EVENT_LOSE: string;
    static EVENT_SENDLLINE: string;
    static messageSendCenter: (msg: GameGestureEventClass, ary?: any[]) => void;
    static messageReceiveCenter: (data: any) => void;
    static resultMessageCenter: (data: any) => void;
    static gameOver(result: number): void;
}
declare class GameGestureItemClass {
    static multiple: number;
    static backGround: egret.Bitmap;
    static scoreYou: number;
    static scoreOther: number;
    static gestureType: string;
    static gestureScore: number;
    static mouseDBArray: Array<string>;
    static backGroundLight: egret.Bitmap;
    static ScoreColumn: egret.Bitmap;
    static headIcoLeft: RoleHeadImage;
    static headIcoRight: RoleHeadImage;
    static desk: egret.Bitmap;
    static foodLeft: egret.Bitmap;
    static foodMid: egret.Bitmap;
    static foodRight: egret.Bitmap;
    static leftHealthCtrlor: healthCtrlor;
    static rightHealthCtrlor: healthCtrlor;
    static leftHealth: number;
    static rightHealth: number;
    static readyState: Array<number>;
    static isOffline: boolean;
    static speedTime: number;
    static lineY: number;
    static isRunning: boolean;
    static resultPool: Array<number>;
    static runningSec: number;
    static rightTimeDvalue: number;
    static lowestLine: number;
    static otherlowest: number;
    static otherLine: egret.Bitmap;
    static otherLineTW: any;
    static AiSuccess: number;
    static autonomy: number;
    static soundWay_1: SoundEffects;
    static soundWay_2: SoundEffects;
    static soundWay_3: SoundEffects;
    static soundWay_num: number;
    static itemList: Array<any>;
    static isLocal: boolean;
    static dispose: () => void;
}
declare class GameGestureLogic {
    private static symbol;
    static mainTick: () => boolean;
    static result: () => void;
    static resultDeal: () => void;
    static readyTick: () => boolean;
    private static gameStart;
    static extraMakeItems: (itemNum: number) => void;
    static foodManager: (num: number, isSet?: boolean) => void;
    private static foodEffect;
    private static sendLow;
    private static dispose;
}
declare class GameGestureMainScene extends State {
    private panel;
    static instance: GameGestureMainScene;
    static gesturePanel: GameGestureItemMaker;
    private teachMask;
    private teachV;
    private teachDelta;
    private finger;
    private dishes1;
    private dishes2;
    private dishes3;
    private AiConf;
    rdy: GameReady;
    constructor();
    init(): void;
    dispose(): void;
    private getSType;
    teach: () => void;
    private gameInit;
}
declare class GesturePanel extends egret.DisplayObjectContainer {
    private _mousePoints;
    private _currentPoint;
    private _layer;
    private gestureUtil;
    private startTime;
    private _mouseEffectPoints;
    private particleStarsTexture;
    private particleStarsConfig;
    private touchMask;
    constructor();
    init(): void;
    addEvent(target: any): void;
    dispose(target: any): void;
    addTouchEvent(tar: any): void;
    disposeTouchEvent(tar: any): void;
    private mouseDown;
    private mouseMove;
    private mouseUp;
    private clear;
}
