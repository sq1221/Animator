declare namespace FindSomeThing {
    class AiController {
        private currentTitle;
        private currentNum;
        private random;
        constructor();
        /**ms */
        private totalTime;
        private rightTime;
        private falseTime;
        private setTotalTime();
        private falseNum;
        private rightNum;
        setFalseNum(): void;
        private readonly isRight;
        choose: () => void;
        nextRound: () => void;
        aiRight: () => void;
        private wrongFlag;
        aiWrong: () => void;
        chooseTitle(): void;
        dispose: () => void;
    }
}
declare namespace FindSomeThing {
    class GameController {
        currentTitle: string;
        currentNum: number;
        private targetNum;
        titleMap: {};
        titleList: string[];
        private random;
        private itemConfigTip;
        private leftCloud;
        private rightCloud;
        private btn_tip;
        private tipTitle;
        /** 10s后没有选对，提示功能闪烁 */
        static TipTime: number;
        constructor(leftCloud: eui.Group, rightCloud: eui.Group, btn_tip: eui.Image, tipTitle: eui.Image);
        /**   添加题库信息 */
        pushTitle: (titles: string[]) => void;
        chooseTitle(): void;
        private tipEffect;
        private tipFlag;
        delayTipTitle: () => void;
        private clearDelayTipTitle;
        private isTipFicking;
        private tipTitleFicker;
        private tipTitleStop;
        tapRight(titles: string[]): void;
        tapFalse(): void;
        private effect;
        private tipItem;
        private isItemFlick;
        tipNum: number;
        stopFicker: (item: Item) => void;
        private showTip;
        nextRound: () => void;
        dispose: () => void;
    }
}
declare class GameFindSomethingView extends StateEui {
    GameScrollerGroup: eui.Group;
    private GameScroller;
    gp_bg: eui.Group;
    currentTitleView: eui.Label;
    private SelfScore1;
    private SelfScore2;
    private ComScore1;
    private ComScore2;
    private SelfAvatarGroup;
    private SelfName;
    private SelfSex;
    private ComAvatarGroup;
    private ComName;
    private ComSex;
    SelfCurrent: eui.Label;
    ComCurrent: eui.Label;
    Time: eui.Label;
    private leftCloud;
    private rightCloud;
    btn_return: eui.Image;
    btn_hello: eui.Image;
    private btn_tip;
    /** 名字最大长度，超过开始缩放 */
    static nameLength: number;
    /**一局时间限制 */
    static time: number;
    /** 提示滚屏速度 */
    static scrollerSpeed: number;
    constructor();
    static instance: GameFindSomethingView;
    itemController: FindSomeThing.ItemController;
    gameController: FindSomeThing.GameController;
    roundController: FindSomeThing.RoundController;
    scoreController: FindSomeThing.ScoreController;
    aiController: FindSomeThing.AiController;
    private roundBG;
    private ready;
    isGameing: boolean;
    private tipTitle;
    static aiConf: any;
    init(): void;
    readyStart: () => void;
    initUserData(): void;
    onGameResult: (data: any) => void;
    private onGameEvent(data);
    addQiPaoCartoon(data: any, type?: number): void;
    AddAIexpress(): void;
    sayHello(): void;
    nextRound: () => void;
    private time;
    private countDown;
    stopTime: () => void;
    dispose(): void;
}
declare namespace FindSomeThing {
    class ItemController {
        private itemConfigMap;
        private itemConfigList;
        private itemList;
        random: Function;
        map: boolean[][];
        static mapCell: number;
        static mapRow: number;
        static mapCellEdge: number;
        private tarRow;
        private tarCell;
        constructor();
        private initData;
        /**统计场上物品数量 */
        private itemNum;
        private numChildren;
        addItem: (isSmall?: boolean) => void;
        private addHeightItem(item);
        private addWidthItem(item);
        private addBigItem(item);
        private addSmallItem(item);
        private getNextGrid(grid?);
        clearItem(): void;
        nextRound: () => void;
        getItem: (title: string) => Item;
        dispose: () => void;
    }
    class Item extends egret.DisplayObjectContainer {
        tags: string[];
        private img;
        setImage(width: number, height: number, x: number, y: number): void;
        constructor(bitmapUrl: string, tags: string[]);
        private tap;
        dispose: () => void;
    }
}
declare namespace FindSomeThing {
    class RoundController {
        private SelfScore1;
        private SelfScore2;
        private ComScore1;
        private ComScore2;
        constructor(SelfScore1: eui.Image, SelfScore2: eui.Image, ComScore1: eui.Image, ComScore2: eui.Image);
        selfRound: number;
        comRound: number;
        currentRound: number;
        round: {};
        winRound(): void;
        private findSomethingScore;
        private playWinCartoon;
        loseRound(): void;
        nextRound(): void;
        /** 发送输赢 */
        sendResult(isWin: number): void;
        private onGameEvent(data);
        dispose(): void;
    }
}
declare namespace FindSomeThing {
    class ScoreController {
        private SelfScore;
        private ComScore;
        constructor(SelfScore: eui.Label, ComScore: eui.Label);
        private _selfRightNum;
        private _comRightNum;
        targetNum: number;
        selfRight(): void;
        comRight: () => boolean;
        readonly selfRightNum: number;
        readonly comRightNum: number;
        private onGameEvent(data);
        nextRound: () => void;
        roundOver: () => void;
        dispose(): void;
    }
}
