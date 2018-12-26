declare class GameRhythmKingEventClass {
    static EVENT_CHOOSE_SETTINGS: string;
    static EVEVT_READY: string;
    static EVENT_PER: string;
    static EVENT_NOR: string;
    static EVENT_GOOD: string;
    static EVENT_LOSE: string;
    static EVENT_MUSIC_END: string;
    static rkMessagerCenter: (event: GameRhythmKingEventClass) => void;
    static dispose: () => void;
}
declare class GameRhythmKingItemClass {
    static backGroundLeft: egret.Bitmap;
    static backGroundRight: egret.Bitmap;
    static backGroundLeft_: egret.Bitmap;
    static backGroundRight_: egret.Bitmap;
    static otherBtn: egret.Bitmap;
    static multiple: number;
    static backGroundMusicPlayer: SoundEffects;
    static runningSec: number;
    static speedSupplement: number;
    static settingsIndex: number;
    static usingSetting: Array<number>;
    static rkLine: egret.Bitmap;
    static rkLineMask: egret.Bitmap;
    static blockBack: egret.Bitmap;
    static blockFront: egret.Bitmap;
    static you: egret.Bitmap;
    static pointBoardYou: egret.Bitmap;
    static pointBoardOther: egret.Bitmap;
    static pointYou: egret.TextField;
    static pointOther: egret.TextField;
    static roadBatholith: egret.Bitmap;
    static pointYouNumber: number;
    static pointOtherNumber: number;
    static comboYou: number;
    static comboOther: number;
    static roadBeatCenter: egret.Bitmap;
    static comboType: egret.Bitmap;
    static comboOtherType: egret.Bitmap;
    static tapTimeStamp: number;
    static judgeItem: number;
    static recycleArray: Array<egret.DisplayObject>;
    static blockArray: Array<egret.DisplayObject>;
    static blockOtherArray: Array<egret.DisplayObject>;
    static blockYouHeight: number;
    static blockOtherHeight: number;
    static blockItemSettingsArray: Array<any>;
    static blockItemSettingsOtherArray: Array<any>;
    static comboYouImage: egret.Bitmap;
    static comboOtherImage: egret.Bitmap;
    static comboYouText: egret.BitmapText;
    static comboOtherText: egret.BitmapText;
    static headIcoYou: RoleAvatar;
    static headIcoOther: RoleAvatar;
    static sideFold: egret.Bitmap;
    static sideProgress: egret.Bitmap;
    static rhythmSumPast: number;
    static rhythmSumNum: number;
    static rhythmYouPast: number;
    static rhythmOtherPast: number;
    static otherRoleAvatar: RoleAvatar;
    static myRoleAvatar: RoleAvatar;
    static keyPressSoundEffect: SoundEffects;
    static gameReady: GameReady;
    static choice: number;
    static readyState: Array<number>;
    static jumpRoleYou: RoleAvatar;
    static jumpRoleOther: RoleAvatar;
    static sparkLeft: egret.Bitmap;
    static sparkRight: egret.Bitmap;
    static gameOverState: number[];
    static alaphaMask: egret.Bitmap;
    static bottomSide: egret.Bitmap;
    static waitingSceneMask: egret.Shape;
    static waitingText: egret.Bitmap;
    static starBoard: egret.Bitmap;
    static stars: Array<any>;
    static gameLevel: number;
    static whiteFont: egret.BitmapFont;
    static highestYouCombo: number;
    static highestOtherCombo: number;
    static perNumYou: number;
    static perNumOther: number;
    static goodNumYou: number;
    static goodNumOther: number;
    static norNumYou: number;
    static norNumOther: number;
    static musicPlaying: string;
    static resultYouBoard: egret.Bitmap;
    static resultOtherBoard: egret.Bitmap;
    static resultYouText: Array<egret.DisplayObject>;
    static resultOtherText: Array<egret.DisplayObject>;
    static sunShineYou: egret.Bitmap;
    static sunShineOther: egret.Bitmap;
    static loseBlockYou: egret.Bitmap;
    static loseBlockOther: egret.Bitmap;
    static AiRandom: number;
    static rippleArray: Array<string>;
    static topSide: egret.Bitmap;
    static dispose: () => void;
}
declare class GameRhythmKingLogic {
    static isOffline: boolean;
    static setTimeOut: number;
    static sunShineYouTO: number;
    static sunShineOtherTO: number;
    static animationItem: Array<Array<any>>;
    static itemCache: Array<egret.DisplayObject>;
    static nowTime: number;
    /**
     * shifting manager
     */
    static shiftingManager: (type: string) => number;
    /**
     * background y manager
     */
    static backgroundYManager: (isYou: boolean) => void;
    /**
     * game display manager
     */
    static displayManager: (mode: string, who: number) => void;
    /**
     * block height switcher
     */
    static blockHeightSwitcher: (itemHeight: number) => number;
    /**
     *
     */
    static sunShineOtherManager: () => void;
    /**
     * tap function
     */
    static tap: () => void;
    /**
     * rhythm point sum progress
     */
    static rhythmSumManager: () => void;
    static AITick: () => void;
    /**
     * compare tick
     */
    static compareTick: () => boolean;
    static gameOver(result: number): void;
    /**
     * random choice
     */
    static randomChoose: () => number;
    /**
     * settings switcher
     */
    static settingSwitcher: (num: number) => void;
    /**
     * animation manager
     */
    static animationManager: (item: egret.DisplayObject, startPos: number[], endPos: number[], fpsTimeInterval: number, callback: () => any) => void;
    /**
     * animation tick
     */
    static animationTick: (sec: any) => boolean;
    static dispose: () => void;
}
declare class GameRhythmKingMainScene extends State {
    constructor();
    private youRoleRotation;
    private otherRoleRotation;
    init(): void;
    private pointRecycleManager;
    dispose(): void;
    private blockTickManager;
    private addBlock;
    private rotationManager;
    static effectiveHeight: (type: any) => number;
    blockManager: (who: number, type: string) => void;
    /**
     * game progress manager
     */
    private gameProgressManager;
    /**
     * Ripple effect manager
     */
    private rippleEffectManager;
    /**
     * tick logic
     */
    tickLogic: (sec: any) => boolean;
    /**
     * judge pool
     */
    judgePool: () => void;
    /**
     * recycle point
     */
    private pointRecycle;
    /**
     * Rhythm items maker
     */
    itemMaker: () => void;
    /**
     * score effect manager
     */
    private scoreEffectManager;
    /**
     * combo text manager
     */
    private comboTextManager;
    private bitmapText;
    private whitebitmapText;
    /**
     * message deal
     */
    private messageDeal;
    private readyTick;
    private endTick;
    private showResult;
    private rankCalculator;
    /**
     * result deal
     */
    private resultDeal;
    waitingSceneManager: (type: string) => void;
    static loseBlockManager: (who: number) => void;
    gameStart: () => void;
}
declare class GameRhythmKingSettingsClass {
    static settings1: Array<any>;
    static settings2: Array<any>;
    static settings3: Array<any>;
    static dispose: () => void;
}
