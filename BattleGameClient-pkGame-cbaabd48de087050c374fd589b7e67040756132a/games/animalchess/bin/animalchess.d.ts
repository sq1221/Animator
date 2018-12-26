declare module AnimalChess {
    class AIController {
        constructor();
        private _round;
        contronType: ChessType;
        private selfChessesGrid;
        private comptitorChessesGrid;
        private isAttack;
        round: RoundType;
        private aicontrol;
        private setUserData;
        private currentChess;
        private dis;
        seeAround: (chessGrid: ChessGrid) => ChessGrid;
        restoreGrids(): void;
        dispose: () => void;
    }
}
declare namespace AnimalChess {
    class ChessboardController {
        /**棋盘数据，记录每个格子的内容，包括动物种类，颜色*/
        private _chessboardGrid;
        /**动物种类数 */
        private animalLength;
        /**棋盘的宽高 */
        sideNum: number;
        /** 移动特效 */
        private moveAffect;
        /** 上一手 */
        onOneHand: egret.Bitmap;
        /**哪个动物在叫*/
        numSound: number;
        AI: AIController;
        /**棋盘初始化 */
        chessboardInit(): void;
        private onGameEvent(data);
        /**根据xy得到棋盘中的位置,棋盘中的位置转换为数组中的位置 */
        getId(x: number, y: number): number;
        /**
         *  判断给定的点是否可走，返回布尔值
         */
        private isGridWalkable(startID, endID, result?);
        /**
         * 返回1 A吃B
         * 返回2 B吃A
         * 返回3 AB同归
         */
        gradeCompare(A: Chess, B: Chess): number;
        /** 下一回合 */
        private sendNextRound(command?, isWin?);
        sendResult(isWin: number): void;
        /**遍历查询所剩棋子 */
        getChessNumber(): chessNumer;
        /**检测是否开启追击模式检测 */
        private checkOpenChase();
        chessTypeWin(color: ChessType): void;
        /** 垃圾操作过多，检查牌面逻辑 ,并判断胜利*/
        checkChess: () => void;
        /**显示可走位置 */
        getWalkableGrid(x: number, y: number): ChessGrid[];
        private win(winChess, loseChess, endGrid);
        /**
         * 移动位置
         * 从x1,y1,移动到x2,y2
         * 若目标点有棋子，则进行对决判定
         * 棋盘会根据对决结果变化
        */
        move(x1: number, y1: number, x2: number, y2: number, isSend?: boolean): void;
        private winId;
        private winByDisplay;
        /**显示隐藏棋子 */
        displayGrid(x: number, y: number, isSend?: boolean): void;
        readonly chessboardMap: {
            [id: number]: ChessGrid;
        };
        showSelfChesses(): void;
        hideSelfChesses(): void;
        dispose(): void;
    }
    class ChessGrid extends egret.DisplayObjectContainer {
        position: {
            x: number;
            y: number;
        };
        private _chess;
        chessLayer: egret.DisplayObjectContainer;
        chess: Chess;
        constructor(position: {
            x: number;
            y: number;
        }, type: ChessType, animalGrade: AnimalGrade);
        readonly type: ChessType;
        /** 资源命名规范 自己的动物 elephant0.png  对手的动物 elephant1.png */
        tap: (callback: Function) => void;
        clear: (idDestroy: boolean) => void;
        getCopyChess: () => Chess;
    }
    class Chess extends egret.DisplayObjectContainer {
        type: ChessType;
        isVisible: boolean;
        animalGrade: AnimalGrade;
        dbArmature: DBArmature;
        border: egret.Bitmap;
        private bitmap;
        constructor(type: ChessType, animalGrade: AnimalGrade, show?: boolean);
        /** 资源命名规范 自己的动物 elephant0.png  对手的动物 elephant1.png */
        tap: (callback: Function) => void;
        destroy: () => void;
        showBorder(type: ChessType): void;
        showVisibleBorder(): void;
        hiddenBorder(): void;
        select: boolean;
    }
}
declare class GameAnimalChessView extends State {
    userController: AnimalChess.UserController;
    chessboardController: AnimalChess.ChessboardController;
    private chiji;
    static instance: GameAnimalChessView;
    static random: Function;
    constructor();
    init(): void;
    pauseCallback: () => void;
    onGameResult: (data: any) => void;
    gameLayer: egret.DisplayObjectContainer;
    UILayer: egret.DisplayObjectContainer;
    tipController: AnimalChess.TipController;
    private returnToLastButton;
    static scale: number;
    private viewInit;
    private onGameEvent(data);
    backgroundMain: egret.Bitmap;
    initBackground: () => void;
    addQiPaoCartoon(data: any, type?: number): void;
    AddAIexpress(): void;
    over(): void;
    /**适配IphoneX */
    adapt(): void;
    dispose(): void;
}
declare class GameReceiveDrawnView extends EuiComponent {
    btn_refuse: eui.Button;
    btn_agree: eui.Button;
    DrawnGroup: eui.Group;
    waitDrawnAnswer: eui.Image;
    drawnRefuseAnswer: eui.Image;
    chijiLogo: eui.Image;
    drawnLogo: eui.Image;
    failureLogo: eui.Image;
    constructor();
    showDrawnGroup: () => void;
    showWaitDrawnAnswer: () => void;
    showDrawnRefuseAnswer: () => void;
    showchiji: (delayTime: number) => void;
    showDrawn: (delayTime: number) => void;
    showFailure: (delayTime: number) => void;
    hide: () => void;
}
declare namespace AnimalChess {
    class TipController extends egret.DisplayObjectContainer {
        constructor();
        private giveUpTip;
        private receiveGiveUpTip;
        receiveDrawnView: GameReceiveDrawnView;
        init(): void;
        private refuseListener;
        private agreeListener;
        isGiveUp: boolean;
        private giveUp();
        private _drawntime;
        private drawnTime;
        showWaitDrawn(): void;
        private onGameEvent(data);
        wasteTipShow(round: number): void;
        chaseShow(): void;
        private competitorTip;
        showComRoundTip(): void;
        setCompetitorTip(chessType: ChessType): void;
        private selfTip;
        showSelfRoundTip(): void;
        setSelfTip(chessType: ChessType): void;
        showChiji(delayTime: number): void;
        showFailure(delayTime: number): void;
        showDrawn(delayTime: number): void;
        dispose(): void;
    }
}
declare namespace AnimalChess {
    /**玩家的数据结构，需要包括颜色 */
    enum ChessType {
        RED = 0,
        BLUE = 1,
    }
    /**棋盘格子类型 */
    type ChessJson = {
        position: {
            x: number;
            y: number;
        };
        type: ChessType;
        isVisible: boolean;
        animalGrade: AnimalGrade;
    };
    /**棋子分布 */
    type chessNumer = {
        RED: number;
        BLUE: number;
        isAllDisplay: boolean;
    };
    enum RoundType {
        self = 0,
        competitor = 1,
    }
    enum AnimalGrade {
        elephant = 7,
        lion = 6,
        tiger = 5,
        leopard = 4,
        wolf = 3,
        dog = 2,
        cat = 1,
        mouse = 0,
    }
    type wasteMoveType = {
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
    };
}
declare namespace AnimalChess {
    class UserController {
        static normalLimit: number;
        static chaseLimit: number;
        isWalk: boolean;
        wasteLimit: number;
        wasteMove: wasteMoveType[];
        private _controlChess;
        private userNameBg;
        private comNameBg;
        private haveSet;
        controlChess: ChessType;
        constructor();
        private round;
        private time;
        private timeView;
        private isSelf;
        startTime: (isSelf?: boolean) => void;
        private spliceTime;
        removeTime: () => void;
        private helloButton;
        init(): void;
        /**
         * 开心 + 伤心
         * 伤心 + 开心
         * 伤心 + 伤心 表情播放
         * */
        onPlayExpress(winChess: Chess): void;
        private onGameEvent(data);
        private initUserView();
        private userImgTap;
        userImg: DBArmature;
        comImg: DBArmature;
        private initCompetitorView();
        private comImgTap;
        canDrawn: boolean;
        private giveUpButton;
        private giveUpListener;
        private drawnButton;
        private drawnListener;
        private initGiveUpView();
        private walkables;
        private startGrid;
        _currentRound: RoundType;
        sideNum: number;
        currentRound: RoundType;
        clickHandler(id: number): void;
        chackWaste: () => void;
        private firstOpenChase;
        private isOpenChase;
        openChase: (isFirst?: boolean) => void;
        sayHello(): void;
        dispose: () => void;
    }
}
