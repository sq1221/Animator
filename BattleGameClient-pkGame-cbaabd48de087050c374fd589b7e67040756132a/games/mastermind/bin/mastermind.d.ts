declare class GameMasterMindEvent {
    static EVENT_GAMEREADY: string;
    static EVENT_ANSWER: string;
    static EVENT_RESULT: string;
    static MMMessagerCenter: (msg: GameMasterMindEvent) => void;
}
declare class GameMasterMindItemClass {
    static readyState: Array<number>;
    static multiple: number;
    static backGround: egret.Bitmap;
    static btn1: egret.Bitmap;
    static btn2: egret.Bitmap;
    static btn3: egret.Bitmap;
    static btn4: egret.Bitmap;
    static clock: egret.Bitmap;
    static fireLine: egret.Bitmap;
    static fireLineLeft: egret.Bitmap;
    static fireLineMask: egret.Bitmap;
    static fireLineLeftMask: egret.Bitmap;
    static scoreBoard: egret.Bitmap;
    static rightTips: egret.Bitmap;
    static wrongTips: egret.Bitmap;
    static questionBoard: egret.Bitmap;
    static youRole: RoleAvatar;
    static otherRole: RoleAvatar;
    static leftTimeUsed: egret.Bitmap;
    static rightTimeUsed: egret.Bitmap;
    static greetNormalBtn: egret.Bitmap;
    static loadingTips: egret.TextField;
    static isOffline: boolean;
    static soundEffect: SoundEffects;
    static questionText: egret.TextField;
    static btn1Text: egret.TextField;
    static btn2Text: egret.TextField;
    static btn3Text: egret.TextField;
    static btn4Text: egret.TextField;
    static countdownText: egret.TextField;
    static Question: Array<any>;
    static correctAnswerIndex: number;
    static chooseIndex: number;
    static otherChooseIndex: number;
    static QuestionOrder: number;
    static youMark: egret.Bitmap;
    static otherMark: egret.Bitmap;
    static youTime: number;
    static otherTime: number;
    static typeStr: egret.TextField;
    static turnsText: egret.TextField;
    static youTimeText: egret.TextField;
    static otherTimeText: egret.TextField;
    static youScore: number;
    static otherScore: number;
    static youScoreText: egret.TextField;
    static otherScoreText: egret.TextField;
    static reportIcon: egret.Bitmap;
    static leftDesk: egret.Bitmap;
    static rightDesk: egret.Bitmap;
    static nameLeftBoard: egret.Bitmap;
    static nameRightBoard: egret.Bitmap;
    static littleLeftMark: egret.Bitmap;
    static littleRightMark: egret.Bitmap;
    static timeUsedLeftBoard: egret.Bitmap;
    static timeUsedRightBoard: egret.Bitmap;
    static answerMask: egret.Bitmap;
    static littlePurple: egret.Bitmap;
    static spareType: egret.TextField;
    static leftCombo: egret.Bitmap;
    static rightCombo: egret.Bitmap;
    static youCombo: number;
    static otherCombo: number;
    static youComboText: egret.TextField;
    static otherComboText: egret.TextField;
    static youComboState: boolean;
    static otherComboState: boolean;
    static hasShowLeftTimeUsed: boolean;
    static hasShowRightTimeUsed: boolean;
    static dispose: () => void;
}
declare class GameMasterMindLogic {
    static btn1Press: () => void;
    static btn2Press: () => void;
    static btn3Press: () => void;
    static btn4Press: () => void;
    static numToFont: () => "二" | "三" | "四" | "五" | "六" | "七" | "八" | "九";
    static tableSwitcher: () => void;
    static AI: () => void;
    static fontSizeManager: (font: egret.TextField) => void;
    static refresh: () => void;
    static scoreManager: (num: number) => number;
    static gameOver(result: number): void;
}
declare class GameMasterMindMainScene extends State {
    constructor();
    private loadingType;
    static runningSec: number;
    init(): void;
    dispose(): void;
    addQiPaoCartoon(data: any, type?: number): void;
    AddAIexpress(): void;
    private showHasChoose();
    private showHasReport;
    /**
     * ready tick
     */
    private readyTick;
    /**
     * game message duel
     */
    private messageDuel;
    /**
     * game result manager
     */
    private resultDuel;
    /**
     * loading effect
     */
    private loadingEffect;
    /**
     * change game state to answer
     */
    private switchToAnswer;
    /**
     * change game state to ready
     */
    private switchToReady;
    /**
     * Tween manager
     */
    private tweemManager;
    private animationManager;
    private symbolPosManager;
    private judge;
    private mainTick;
    private answerTick;
    static youTimer: () => boolean;
    static otherTimer: () => boolean;
    private getSType;
    static showLeftTimeUsed: (hideOrShow?: boolean) => void;
    static showRightTimeUsed: (hideOrShow?: boolean) => void;
    private showPersonalInformation;
    private showOtherPersonalInformation;
    private showGreeting;
    private report;
    private gameInit;
}
