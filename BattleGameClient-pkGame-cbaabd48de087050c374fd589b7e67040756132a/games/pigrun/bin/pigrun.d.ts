declare class GamePigRunEventClass {
    static EVENT_OTHER_DO: string;
    static EVENT_TIMEOUT: string;
    static EVENT_OTHER_IS_RED: string;
    static EVENT_OTHER_IS_BLUE: string;
    static EVENT_OTHER_IS_YELLOW: string;
    static EVENT_YOU_WIN: string;
    static EVENT_YOU_LOSE: string;
    static EVENT_INITIALIZE_COLOR_ARRAY: string;
    static EVENT_OTHER_WIN: string;
    static EVENT_STOP_GAME: string;
    static EVENT_READY: string;
    static EVENT_REDBTN: string;
    static EVENT_BLUEBTN: string;
    static EVENT_DEATHBTN: string;
    static EVENT_NEWTURN: string;
}
declare class GamePigRunLogic extends egret.DisplayObjectContainer {
    static logicLocalColor: string;
    static keyPress: string;
    static orderNum: number;
    static otherOrderNum: number;
    static whoWillWin: string;
    static colorSettings: Array<string>;
    static colorOtherSettings: Array<string>;
    static wrongSwitcher: boolean;
    static gameModeisDeathMode: boolean;
    static isOffline: boolean;
    static colorArray: Array<string>;
    /**
     * Local Message Center
     */
    static localMessageCenter: (event: GamePigRunEventClass) => void;
    static gameOver(result: number): void;
    /**
     * Base Num Manager
     */
    private static baseNumManager;
    /**
     * 数值自动管理
     */
    static numManager: () => number;
    /**
     * 对方数值自动管理
     */
    static otherNumManager: () => number;
    /**
     * Base Color Manager
     */
    private static baseColorManager;
    /**
     * 随机数返回一个颜色，red，blue
     */
    static returnColor: (type?: any) => string;
    /**
     * get color setting(s),if type is not undefined than return a Array of color
     */
    static getColor: (type?: any) => string;
    /**
     * 根据输入的 color：string 来返回需要加载的资源
     */
    static switchColor: (color: string, isBorder?: string) => string;
    /**
     * 改变输入的item的颜色
     */
    static changeColor: (item: egret.Bitmap, color: string, isBorder?: string) => void;
    /**
     * 改变场景中part的颜色和位置
     */
    static partExhibition: (item: egret.Bitmap, color: string, rotation: number, reset?: boolean) => void;
    /**
     * 改变场景中role的角度
     */
    static roleExhibition: (item: egret.DisplayObject, pos: number, reset?: boolean) => void;
    /**
     * 游戏结果判断
     */
    static gameJudge: () => void;
}
declare class GamePigRunMainScene extends State {
    static partRotation: Array<number>;
    static running: boolean;
    static result: string;
    static particleSmoke: particle.GravityParticleSystem;
    static particleStars: particle.GravityParticleSystem;
    static borderRotation: number;
    static roleYouRotation: number;
    static roleOtherRotation: number;
    static role_you: DBArmature;
    static role_other: DBArmature;
    static volume_you: SoundEffects;
    static volume_other: SoundEffects;
    static volume_global: SoundEffects;
    static multiple: number;
    static btnRed: DBArmature;
    static btnBlue: DBArmature;
    static btnDeath: DBArmature;
    static gameTurns: number;
    static tipsSwitcher: number;
    static tipsCover: DBArmature;
    static readyIMG: GameReady;
    static mark_you: number;
    static mark_other: number;
    static roundText: egret.Bitmap;
    static resultText: any;
    static koText: any;
    static hasInDeathMode: boolean;
    static scenceMask: egret.Bitmap;
    static effectTimer: any;
    static effectCounter: number;
    static part_you: egret.Bitmap;
    static part_other: any;
    static boomSmoke: any;
    static ai: number;
    static target: number;
    static youTarget: number;
    private readyState;
    private randomTime;
    static instance: GamePigRunMainScene;
    static keyState: number;
    constructor();
    init(): void;
    dispose(): void;
    private reset;
    private twManager;
    /**
     * AI
     */
    private artificial;
    /**
     * 获胜逻辑
     */
    private win;
    /**
     * 失败逻辑
     */
    private lose;
    /**
     * particle playing Manager,
     */
    static particleManager: (what: string, time: number) => void;
    /**
     * step manger
     */
    private colorStepManager;
    /**
     * press wrong button deal
     */
    private wrongPressDeal;
    /**
     * 循环逻辑
     */
    private circleLogic;
    gameResultCheck: () => void;
    /**
     * init all color border
     */
    private initColorBorder;
    private initNormalColor;
    /**
     * 对方成功完成一次逻辑
     */
    private otherDo;
    /**
     * game result effect manager
     */
    private resultEffectManager;
    /**
     * 结果处理
     */
    private resultDuel;
    /**
     * 信息处理
     */
    private messageDuel;
    static handlePress: () => void;
    private remoteRedBtnPress;
    /**
     * 红按钮被按下
     */
    static redBtnPress: () => void;
    private remoteBlueBtnPress;
    /**
     * 蓝按钮被按下
     */
    static blueBtnPress: () => void;
    private remoteDeathBtnPress;
    /**
     * Death button keyPress
     */
    static deathBtnPress: () => void;
    private readyTick;
    private gameStartManager;
    pauseCallback: () => void;
    private addHeadIco;
    private gameStart;
}
