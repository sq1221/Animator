declare class GameBangEventClass {
    static EVENT_READY: string;
    static EVENT_SENDSETTINGS: string;
    static EVENT_SHOOT: string;
    static EVENT_ISHOOT: string;
    static EVENT_RESULT: string;
    /**
     * manager 4 local game message
     */
    static messageCenter: (msg: GameBangEventClass) => void;
}
declare class GameBangItemClass extends State {
    static backGround: egret.Bitmap;
    static youRole: egret.Bitmap;
    static otherRole: egret.Bitmap;
    static btnBang: egret.Bitmap;
    static isOffline: boolean;
    static turnNum: number;
    static readyState: Array<number>;
    static youHealth: number;
    static youHealthBoard: egret.Bitmap;
    static otherHealth: number;
    static otherHealthBoard: egret.Bitmap;
    static multiple: number;
    static pkBorder: egret.Bitmap;
    static headIcoLeft: RoleHeadImage;
    static headIcoRight: RoleHeadImage;
    static btnBackGround: egret.Bitmap;
    static bangTip: egret.Bitmap;
    static tipsRole_ul: egret.Bitmap;
    static tipsRole_bl: egret.Bitmap;
    static tipsRole_ur: egret.Bitmap;
    static tipsRole_br: egret.Bitmap;
    static tipsText_ul: egret.Bitmap;
    static tipsText_bl: egret.Bitmap;
    static tipsText_ur: egret.Bitmap;
    static tipsText_br: egret.Bitmap;
    static tipsState: Array<number>;
    static isHost: boolean;
    static restSec: number;
    static youSmoke: egret.Bitmap;
    static otherSmoke: egret.Bitmap;
    static otherSoundEffect: SoundEffects;
    static youSoundEffect: SoundEffects;
    static thirdSoundEffect: SoundEffects;
    static backGroundSoundEffect: SoundBg;
    static gameSettings: Array<Array<number>>;
    static reference: boolean;
    static turnState: Array<number>;
    static AITimer: number;
    static fruitItem: Array<string>;
    static youFruit: egret.Bitmap;
    static youFruitBoom: egret.Bitmap;
    static otherFruit: egret.Bitmap;
    static otherFruitBoom: egret.Bitmap;
    static uBorder: egret.Bitmap;
    static bBorder: egret.Bitmap;
    static ulBorder: egret.Bitmap;
    static urBorder: egret.Bitmap;
    static AICanShoot: boolean;
    static img5s: egret.Bitmap;
    static fireLightL: egret.Bitmap;
    static fireLightR: egret.Bitmap;
    static youShootSec: number;
    static otherShootSec: number;
    static endArray: Array<Array<number>>;
    static tipsPosArray: Array<Array<Array<number>>>;
    static tipsRolePosArray: Array<Array<Array<number>>>;
    static dispose: () => void;
}
declare class GameBangLogic extends State {
    /**
     * reset the role
     */
    static resetRole: () => void;
    /**
     * enable/disenable btnBang
     */
    static btnBangManager: (canUse: boolean) => void;
    /**
     * when a turn has gone end,dispose
     */
    static turnDispose: () => void;
    static resetTips: () => void;
    static gameOver(result: number): void;
    /**
     * manager 4 shooting tips
     * pos:1-ul 2-bl 3-ur 4-br
     * item:1-bang 2-deng 3-deng
     */
    static showShootingTips: (pos: number, item: number) => void;
    /**
     * whether is the host
     */
    static isHost: () => void;
    /**
     * tips Pos manager
     */
    static tipPosManager: () => number;
    /**
     * make game settings
     */
    static makeSettings: () => string;
    /**
     * decode settings
     */
    static decodeSettings: (settings: string) => void;
    /**
     * random choose a fruit type
     */
    static randomFruit: () => void;
    /**
     * fruit animation manager
     */
    static fruitEffectManager: (who: number) => void;
    /**
     * random bullet hole
     */
    static randomBulletHole: () => void;
}
declare class GameBangMainScene extends State {
    constructor();
    static instance: GameBangMainScene;
    private expressionTimer;
    private screen;
    private fireEffect;
    private otherSweat;
    private youSweat;
    private reloadingImg;
    private _announcement;
    private readyImg;
    private youHealth_1;
    private youHealth_2;
    private youHealth_3;
    private youHealth_4;
    private youHealth_5;
    private otherHealth_1;
    private otherHealth_2;
    private otherHealth_3;
    private otherHealth_4;
    private otherHealth_5;
    private blackMask;
    private gameTips;
    private expression;
    private announcement;
    private N;
    private turnText;
    private hasRun;
    init(): void;
    dispose(): void;
    /**
     * shockEffect manager
     */
    private shockEffect;
    /**
     * turn manager
     */
    private turnManager;
    /**
     * shoot result deal
     */
    private shootResultDeal;
    private remoteShoot;
    /**
     * btn "bang" callback pretreatment
     */
    private preShoot;
    /**
     * btn "bang" callback
     */
    private shoot;
    /**
     * other shoot judge pretreatment
     */
    private preOtherShootJudge;
    /**
     * other shoot judge
     */
    private otherShootJudge;
    /**
     * ready tick
     */
    private readyTick;
    /**
     * function 4 is offline or not callback
     */
    private isOfflineCallback;
    private AI;
    /**
     * the main tick
     */
    private mainTick;
    /**
     * other do not hit you effect
     */
    private shootScreen;
    /**
     * manager 4 message received
     */
    private messageManager;
    private endTick;
    private localResultManager;
    /**
     * turn end
     */
    private turnEnd;
    /**
     * fire & smoke effect manager
     */
    private fireSmokeEffectManager;
    /**
     * shoot effect manager
     *
     * mode,0:other be hit,1:other happy
     */
    private shootEffectManager;
    /**
     * health effect manager
     *
     * who,0:you,1:other
     *
     * what,-> health num
     */
    private healthEffectManager;
    /**
     * first join animation manager
     */
    private firstStartEffectManager;
    /**
     * between field effect manager
     */
    private betweenFieldEffectManager;
    /**
     * deal of result
     */
    private resultDeal;
    /**
     * scene init
     */
    private gameStart;
}
