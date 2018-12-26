declare class GameGoBallisticArtificialts {
    static instance: GameGoBallisticArtificialts;
    clickInterval: number;
    mistake: number;
    walkSwitcher: boolean;
    tauntSwitcher: boolean;
    constructor();
    walk: () => void;
    taunt: () => void;
}
declare class Gob_role extends eui.Image {
    private scale;
    private xSBS;
    private ySBS;
    private localPosNum;
    private color;
    private nCounter;
    private qCounter;
    private wCounter;
    private tCounter;
    private walkType;
    soundChannel1: SoundEffects;
    constructor(color: string);
    private numManager;
    normalWalk: () => void;
    reset2normal: () => void;
    reset2dumbfounded: () => void;
    taunt: () => void;
    dumbfounded: () => void;
    quickWalk: () => void;
    win: () => void;
    behit: () => void;
    dispose: () => void;
}
declare class flyingItem extends eui.Image {
    private soundChannel;
    private itemClass;
    constructor(who: string);
}
declare class GameGoBallisticEventClass {
    static instance: GameGoBallisticEventClass;
    constructor();
    GOB_EVENT_READY: string;
    GOB_EVENT_WALK: string;
    GOB_EVENT_TAUNT: string;
    GOB_EVENT_DUMBFOUNDED: string;
    GOB_EVENT_SCORE: string;
    messageCenter: (msg: string, extra?: string) => void;
    messageDeal: (data: any) => void;
    resultDeal: (data: any) => void;
}
declare class GameGoBallisticItemClass {
    static instance: GameGoBallisticItemClass;
    roleBoss: DBArmature;
    roleBlue: Gob_role;
    roleRed: Gob_role;
    state: number;
    blueScore: number;
    redScore: number;
    readyState: number[];
    bothState: number[];
    isOffline: boolean;
    multiple: number;
    localTimer: number;
    stopSoundEffect: SoundEffects;
    isRuning: boolean;
    constructor();
}
declare class GameGoBallisticLogic {
    static instance: GameGoBallisticLogic;
    constructor();
    walkStartTick: number;
    tauntStartTick: number;
    dispose: () => void;
    bossCheckBoth: () => void;
    taunt: (who: number) => void;
    walking: (who: number) => void;
    blueReset: () => void;
    redReset: () => void;
    gameOver(result: number): void;
    btnRunClick: () => void;
    btnShowoffClick: () => void;
    readyTick: () => boolean;
    gamingTick: () => void;
    /**
     * 0-normal, 1-quick, 2-pointAll, 3-pointLeft, 4-pointRight, 5-censure, 6-stop
     */
    DBCtrlor: (state: number) => void;
}
declare class GameGoBallisticMainScene extends StateEui {
    static instance: GameGoBallisticMainScene;
    Gob_btn_run: eui.Button;
    Gob_btn_showoff: eui.Button;
    random: Function;
    constructor();
    Gob_group_boss: eui.Group;
    Gob_group_all: eui.Group;
    Img_blackMask: eui.Image;
    Img_light: eui.Image;
    Img_result: eui.Image;
    Gob_group_roles: eui.Group;
    Img_stop: eui.Image;
    Label_blueScore: eui.Label;
    Label_redScore: eui.Label;
    Img_isYou: eui.Image;
    Gob_group_flyingItem: eui.Group;
    Gob_group_blueHead: eui.Group;
    Gob_group_redHead: eui.Group;
    blackMask: egret.Bitmap;
    w8img: egret.Bitmap;
    private rdy;
    AiConf: {};
    init(): void;
    dispose(): void;
    gameInit: () => void;
    gameRdy: () => void;
    gameStart: () => void;
    showResult: (isWin: number) => void;
}
