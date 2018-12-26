/**
 * 雪球
 */
declare class GameChristmasBall extends egret.Bitmap {
    constructor();
    directionLOrR: number;
    directionPosL1_X: number;
    directionPosL1_Y: number;
    directionPosL2_X: number;
    directionPosL2_Y: number;
    directionPosL3_X: number;
    directionPosL3_Y: number;
    directionPosR1_X: number;
    directionPosR1_Y: number;
    directionPosR2_X: number;
    directionPosR2_Y: number;
    directionPosR3_X: number;
    directionPosR3_Y: number;
    factorOne: number;
    factorTwo: number;
}
/**
 * 鹿皇争霸
 * by dingyafeng
 */
declare class GameChristmasMainView extends StateEui {
    static GAME_WIDTH: number;
    static GAME_HEIGHT: number;
    containerGroup: eui.Group;
    goBackBtn: eui.Button;
    playerScoreLab1: eui.Label;
    playerAvatarGroup1: eui.Group;
    timesLab: eui.Label;
    playerScoreLab2: eui.Label;
    playerAvatarGroup2: eui.Group;
    buttonsGroup: eui.Group;
    daodanBtn: eui.Button;
    chaofengBtn: eui.Button;
    yancongDbGroup: eui.Group;
    menkuangDbGroup: eui.Group;
    liwuheDbGroup: eui.Group;
    ziseluGroup: eui.Group;
    zongseluGroup: eui.Group;
    snowContainerGroup: eui.Group;
    gp_top: eui.Group;
    private readyIMG;
    renyingImg: eui.Image;
    youImg: eui.Image;
    gantanhaoImg1: eui.Image;
    gantanhaoImg2: eui.Image;
    gantanhaoImg3: eui.Image;
    resultGroup: eui.Group;
    blueWinFlagImg: eui.Image;
    blueScoreLab: eui.Label;
    blueScoreBg: eui.Image;
    resultBuleLuImg: eui.Image;
    redWinFlagImg: eui.Image;
    redScoreLab: eui.Label;
    redScoreBg: eui.Image;
    resultRedLuImg: eui.Image;
    private daodanActionTimeout;
    private oneselfNum;
    private particleXueHua;
    private clearTimeoutReadyId;
    private gameStartBool;
    private gameLastTime;
    gameChristmasModel: GameChristmasModel;
    private gameChristmasSantaModel;
    shanShuoTween: any;
    private clearTimeoutDaodanBtnYanChi;
    private clearTimeoutHideBtnsId;
    yujingIsPlay: boolean;
    xiaoIsPlay: boolean;
    nuIsPlay: boolean;
    private santaDbIndex;
    private santaDbDisplay;
    private intervalIdKey;
    private currAmiIndex;
    oneselfBeFound: boolean;
    otherBeFound: boolean;
    private myAvatar;
    private myHeadImage;
    private otherAvatar;
    private otherHeadImage;
    private dbTimeTicker;
    xunLuDb1: DBArmature;
    xunLuDb2: DBArmature;
    yancongDb: DBArmature;
    fangjianmenDb: DBArmature;
    liwuheDb: DBArmature;
    gameRobotAi: GameChristmasSantaAI;
    christmasEffect: SoundEffects;
    christmasCommonEffect: SoundEffects;
    constructor();
    init(): void;
    show(): void;
    private snowParticle();
    private playerAvatarAdd();
    private gameStart();
    private readyGoFun();
    addMesssgaeListener(): void;
    private onGameEvent(data);
    private yancongYujingFun();
    private fangJianMenYujingFun();
    private liWuHeYujingFun();
    santaPlayNuAmiFun(): void;
    btnsVisibleOrTouchEnabled(daodanStatus: boolean, chaofengStatus: boolean): void;
    private makeFunOtherPlayer();
    setScoreView(red: number, blue: number): void;
    private resultViewState();
    arriveScore(): void;
    onGameResult(data: any): void;
    private resultPageFun;
    private onGameleave();
    private clearData();
    dispose(): void;
    private playerAvatarGroup1Handler();
    private playerAvatarGroup2Handler();
    private goBackBtnHandler();
    ontimerUpdate(): void;
    private sendResult(result);
    private startMatchingTime();
    private oneSelfTween();
    private onYuJingTween(gantanhaoIndex, times?);
    private moveOne(ball);
    private moveTwo(ball);
    private scoreTweenMove(scores);
    private daodanBtnHandler(event);
    private onThrowSnowBallXunlu1Complete();
    private onThrowSnowBallXunlu2Complete();
    onBeatingXunlu2Complete(): void;
    onBeatingXunlu1Complete(): void;
    playerThrowSnowBall(directLorR: number): void;
    private chaofengBtnHandler(event);
    playerMakeFun(makeFunStatus: number): void;
    private addAllDb();
    tick(advancedTime: number): void;
    private stopAllDbAmi();
    menYujingTween(): void;
    santaStatusAmiPlay(santaDbIndex: number, actionName: string, playOrStop: boolean): void;
    private onYuJingComplete();
    private onXiaoComplete();
    private onNuComplete();
    private santaPlayStatusYuJingFun();
    private santaPlayStatusXiaoFun();
    ziseluAmiPlay(actionName: string, times?: number): void;
    zongseluAmiPlay(actionName: string, times?: number): void;
    private randomPlaySantaAction();
    private SetTimeoutExample();
    private myDelayedFunction(obj);
}
/**
 * 驯鹿大战
*/
declare class GameChristmasModel extends egret.DisplayObjectContainer {
    static EVENT_THROW_SNOWBALL: string;
    static EVENT_MAKEFUN: string;
    static EVENT_GET_SNOWBALL: string;
    static EVENT_GET_MAKEFUN: string;
    static EVENT_BE_FOUND: string;
    static EVENT_GAME_START: string;
    static EVENT_GAME_OVER: string;
    static EVENT_WIN: string;
    static EVENT_LOSE: string;
    static STATUS_BEATING: string;
    static STATUS_ISSCOLDED: string;
    static STATUS_MAKEFUN: string;
    static STATUS_SWEEPFLOOR: string;
    static STATUS_THROW_SNOWBALL: string;
    static GET_HOST_PC: string;
    static GAMEOVER_AND_STEPSCORE: string;
    static resultScore: number;
    myScore: number;
    otherScore: number;
    constructor();
}
/**
 * 电脑人
 */
declare class GameChristmasSantaAI extends egret.DisplayObjectContainer {
    gameChristmasMainView: GameChristmasMainView;
    robotAiDirection: number;
    intervalIdRobotAiKey: number;
    intervalSantaComeoutIdRobotAiKey: number;
    robotBeMakeFun: boolean;
    robotNoBeFound: boolean;
    private actionTimeout;
    static robotAiLv: number;
    constructor(gameInstance: GameChristmasMainView, robotDirection: number);
    robotThrowSnowBall(): void;
    robotMakeFun(): void;
    sendGameResult(): void;
    randomPlayRobotAction(): void;
    clearsantaComeoutThrowBall(): void;
    santaComeoutThrowBall(): void;
    clearSetTimeoutExample(): void;
    SetTimeoutExample(): void;
    private myDelayedFunction();
    clearData(): void;
}
/**
 * 圣诞老人随机检测数据
 */
declare class GameChristmasSantaModel extends egret.DisplayObjectContainer {
    static STATUS_YANCONG_YUJING: string;
    static STATUS_YANCONG_XIAO: string;
    static STATUS_YANCONG_NU: string;
    static STATUS_MEN_YUJING: string;
    static STATUS_MEN_XIAO: string;
    static STATUS_MEN_NU: string;
    static STATUS_LIHE_YUJING: string;
    static STATUS_LIHE_XIAO: string;
    static STATUS_LIHE_NU: string;
    static SANTA_ACTION_STATUS1: number;
    static SANTA_ACTION_STATUS2: number;
    static SANTA_ACTION_STATUS3: number;
    static SANTA_COMEOUT: string;
    static SANTA_ACTION_END: string;
    checkActions: number[];
    constructor();
    arrRandom(arr: number[]): void;
    arrRandomByIndex(arr: number[], startIndex: number, endIndex: number): void;
}
/**
 * 分数
 */
declare class GameChristmasScore extends egret.Bitmap {
    constructor();
}
