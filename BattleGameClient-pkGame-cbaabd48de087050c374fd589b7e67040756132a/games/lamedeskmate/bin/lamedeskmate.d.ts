/**
 * 互怼校园
 * by dingyafeng
 */
declare class LameDeskmateMainView extends StateEui {
    static GAME_WIDTH: number;
    static GAME_HEIGHT: number;
    containerGroup: eui.Group;
    goBackBtn: eui.Button;
    playerScoreLab1: eui.BitmapLabel;
    playerAvatarGroup1: eui.Group;
    personSexImg1: eui.Image;
    personNameLab1: eui.Label;
    timesLab: eui.Label;
    playerScoreLab2: eui.BitmapLabel;
    playerAvatarGroup2: eui.Group;
    personSexImg2: eui.Image;
    personNameLab2: eui.Label;
    buttonsGroup: eui.Group;
    daodanBtn: eui.Button;
    chaofengBtn: eui.Button;
    teacherDbGroup: eui.Group;
    teacherXiaoNuImg: eui.Image;
    headmasterDbGroup: eui.Group;
    headmasterShadowImg: eui.Image;
    headmasterXiao: eui.Image;
    headmasterNu: eui.Image;
    leftStudentDbGroup: eui.Group;
    leftStudentDaijiImg: eui.Image;
    leftStudentBeFoundImg: eui.Image;
    rightStudentDbGroup: eui.Group;
    rightStudentDaijiImg: eui.Image;
    rightStudentBeFoundImg: eui.Image;
    effectGroup1: eui.Group;
    effectGroup2: eui.Group;
    effectGroup3: eui.Group;
    beFoundStandUpImg: eui.Image;
    chaofengImg: eui.Image;
    beHitEffectLeftGroup: eui.Group;
    beHitEffectRightGroup: eui.Group;
    scoreContainerGroup: eui.Group;
    private readyIMG;
    youImg: eui.Image;
    isMeImg: eui.Image;
    classStartImg: eui.Image;
    guideHandImg: eui.Image;
    guideTipImg: eui.Image;
    resultGroup: eui.Group;
    winStateImg: eui.Image;
    winOrLoseImg: eui.Image;
    winOrLoseLab: eui.Label;
    winnerAvatarGroup: eui.Group;
    myScoreLab: eui.Label;
    myResultLab: eui.Label;
    otherResultLab: eui.Label;
    resultPlayerAvatar1: eui.Group;
    resultPlayerAvatar2: eui.Group;
    resultPlayerNameLab1: eui.Label;
    resultPlayerNameLab2: eui.Label;
    resultSexImg1: eui.Image;
    resultSexImg2: eui.Image;
    private daodanActionTimeout;
    private oneselfNum;
    private clearTimeoutReadyId;
    private gameStartBool;
    private gameLastTime;
    private teacherActionTime;
    lameDeskmateModel: LameDeskmateModel;
    private LameDeskmateSantaModel;
    shanShuoTween: any;
    private clearTimeoutDaodanBtnYanChi;
    private clearTimeoutHideBtnsId;
    yujingIsPlay: boolean;
    xiaoIsPlay: boolean;
    nuIsPlay: boolean;
    private teachersAniIndex;
    private teachersAniMc;
    private intervalIdKey;
    private currAmiIndex;
    oneselfBeFound: boolean;
    otherBeFound: boolean;
    private myHeadImage;
    private otherHeadImage;
    private resultHeadImage;
    private resultMySmallHeadImage;
    private resultOtherSmallHeadImage;
    private dbTimeTicker;
    private hitLMcFactory;
    private hitLMc;
    private beHitLMcFactory;
    private beHitLMc;
    private beHitLEffectFactory;
    private beHitLEffectMc;
    private makeFunLMcFactory;
    private makeFunLMc;
    private hitRMcFactory;
    private hitRMc;
    private beHitRMcFactory;
    private beHitRMc;
    private beHitREffectFactory;
    private beHitREffectMc;
    private makeFunRMcFactory;
    private makeFunRMc;
    teacherDaijiFactory: egret.MovieClipDataFactory;
    teacherDaijiMc: egret.MovieClip;
    private fireMcFactory;
    private fireMc;
    private speedMcFactory;
    private speedMc;
    private beFoundOneMcFactory;
    private beFoundOneMc;
    private beFoundTwoMcFactory;
    private beFoundTwoMc;
    gameRobotAi: LameDeskmateSantaAI;
    static aiConf: any;
    lameDeskmateEffect: SoundEffects;
    lameDeskmateCommonEffect: SoundEffects;
    constructor();
    init(): void;
    show(): void;
    private playerAvatarAdd();
    private gameStart();
    addMesssgaeListener(): void;
    private onGameEvent(data);
    private teacherYujingFun();
    private headMasterYujingFun();
    teachersNuAmiFun(): void;
    btnsVisibleOrTouchEnabled(daodanStatus: boolean, chaofengStatus: boolean): void;
    private makeFunOtherPlayer();
    private resultViewState();
    arriveScore(): void;
    onGameResult(data: any): void;
    private waitTime;
    private resultPageFun;
    private onGameleave();
    private clearData();
    dispose(): void;
    private playerAvatarGroup1Handler();
    private playerAvatarGroup2Handler();
    ontimerUpdate(): void;
    private sendResult(result);
    private startMatchingTime();
    private oneSelfTween();
    private classStartTween();
    private guideHandTween();
    private scoreTweenMove(scores);
    private daodanBtnHandler(event);
    private onStudentHitLComplete();
    private onStudentHitRComplete();
    onStudentBeHitRComplete(): void;
    onStudentBeHitLComplete(): void;
    playerHitOther(directLorR: number): void;
    private chaofengBtnHandler(event);
    playerMakeFun(makeFunStatus: number): void;
    private addAllMc();
    tick(advancedTime: number): void;
    private stopAllDbAmi();
    headmasterYujingTween(): void;
    headmasterXiaoTween(bool: boolean): void;
    headmasterNuTween(bool: boolean): void;
    teachersStatusAmiPlay(teachersAniIndex: number, actionName: string, playOrStop: boolean): void;
    private onYuJingComplete();
    private onXiaoComplete();
    private onNuComplete();
    private teachersPlayStatusYuJingFun();
    private santaPlayStatusXiaoFun();
    leftStudentAmiActionInit(): void;
    leftStudentAmiPlay(actionName: string): void;
    rightStudentAmiActionInit(): void;
    rightStudentAmiPlay(actionName: string): void;
    private randomPlaySantaAction();
    private SetTimeoutExample();
    private myDelayedFunction(obj);
}
/**
 * 互怼校园
*/
declare class LameDeskmateModel extends egret.DisplayObjectContainer {
    static EVENT_HIT: string;
    static EVENT_BEHIT: string;
    static EVENT_MAKEFUN: string;
    static EVENT_BE_FOUND: string;
    static STATUS_ISSCOLDED: string;
    static STATUS_MAKEFUN: string;
    static STATUS_DAIJI: string;
    static GET_HOST_PC: string;
    static resultScore: number;
    myScore: number;
    otherScore: number;
    constructor();
}
/**
 * 电脑人
 */
declare class LameDeskmateSantaAI extends egret.DisplayObjectContainer {
    gameChristmasMainView: LameDeskmateMainView;
    robotAiDirection: number;
    intervalIdRobotAiKey: number;
    intervalSantaComeoutIdRobotAiKey: number;
    robotBeMakeFun: boolean;
    robotNoBeFound: boolean;
    static robotAiLv: number;
    static robotSec: number;
    constructor(gameInstance: LameDeskmateMainView, robotDirection: number);
    robotThrowSnowBall(): void;
    robotMakeFun(): void;
    sendGameResult(): void;
    randomPlayRobotAction(): void;
    clearsantaComeoutHit(): void;
    santaComeoutHit(): void;
    clearSetTimeoutExample(): void;
    SetTimeoutExample(): void;
    private myDelayedFunction();
    clearData(): void;
}
/**
 * 老师，校长随机检测数据
 */
declare class LameDeskmateSantaModel extends egret.DisplayObjectContainer {
    static STATUS_TEACHER_YUJING: string;
    static STATUS_TEACHER_XIAO: string;
    static STATUS_TEACHER_NU: string;
    static STATUS_HEADMASTER_YUJING: string;
    static STATUS_HEADMASTER_XIAO: string;
    static STATUS_HEADMASTER_NU: string;
    static TEACHERS_ACTION_STATUS1: number;
    static TEACHERS_ACTION_STATUS2: number;
    static TEACHERS_COMEOUT: string;
    static TEACHERS_ACTION_END: string;
    checkActions: number[];
    constructor();
    arrRandom(arr: number[]): void;
    arrRandomByIndex(arr: number[], startIndex: number, endIndex: number): void;
}
/**
 * 分数
 */
declare class LameDeskmateScore extends egret.Bitmap {
    constructor();
}
