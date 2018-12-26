/**
 * 纸球
 */
declare class DormitoryWarBall extends egret.Bitmap {
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
 * 宿舍风云
 * by dingyafeng
 */
declare class DormitoryWarMainView extends StateEui {
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
    teacherDbGroup: eui.Group;
    upLeftStudentDbGroup: eui.Group;
    upRightStudentDbGroup: eui.Group;
    leftStudentDbGroup: eui.Group;
    leftStudentDaijiImg: eui.Image;
    rightStudentDbGroup: eui.Group;
    rightStudentDaijiImg: eui.Image;
    scoreAndBallContainerGroup: eui.Group;
    youImg: eui.Image;
    guideHandImg: eui.Image;
    resultGroup: eui.Group;
    meWinImg: eui.Image;
    meLoseImg: eui.Image;
    leftStatusImg: eui.Image;
    rightStatusImg: eui.Image;
    private readyIMG;
    private daodanActionTimeout;
    private oneselfNum;
    private clearTimeoutReadyId;
    private gameStartBool;
    private gameLastTime;
    private teacherActionTime;
    dormitoryWarModel: DormitoryWarModel;
    private dormitoryWarSantaModel;
    private checkPointBool;
    private clearTimeoutCheckPoint;
    private clearTimeoutDaodanBtnYanChi;
    yujingIsPlay: boolean;
    xiaoIsPlay: boolean;
    nuIsPlay: boolean;
    private teachersAniIndex;
    private teachersDbDisplay;
    private intervalIdKey;
    private currAmiIndex;
    oneselfBeFound: boolean;
    otherBeFound: boolean;
    private myHeadImage;
    private otherHeadImage;
    private dbTimeTicker;
    upLeftStudentDb: DBArmature;
    upRightStudentDb: DBArmature;
    suGuanDb: DBArmature;
    private hitLMcFactory;
    private hitLMc;
    private beHitLMcFactory;
    private beHitLMc;
    private makeFunLMcFactory;
    private makeFunLMc;
    private hitRMcFactory;
    private hitRMc;
    private beHitRMcFactory;
    private beHitRMc;
    private makeFunRMcFactory;
    private makeFunRMc;
    private beFoundOneMcFactory;
    private beFoundOneMc;
    private beFoundTwoMcFactory;
    private beFoundTwoMc;
    gameRobotAi: DormitoryWarSantaAI;
    constructor();
    init(): void;
    show(): void;
    private playerAvatarAdd();
    private gameStart();
    addMesssgaeListener(): void;
    private onGameEvent(data);
    private upLeftStudentYujingFun();
    private upRightStudentYujingFun();
    private teacherYujingFun();
    teachersNuAmiFun(): void;
    btnsVisibleOrTouchEnabled(daodanStatus: boolean, chaofengStatus: boolean): void;
    private makeFunOtherPlayer();
    private resultViewState();
    arriveScore(): void;
    onGameResult(data: any): void;
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
    private guideHandTween();
    private moveOne(ball);
    private moveTwo(ball);
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
    private isXiaoAniPlayStatus();
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
 * 宿舍风云
*/
declare class DormitoryWarModel extends egret.DisplayObjectContainer {
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
declare class DormitoryWarSantaAI extends egret.DisplayObjectContainer {
    gameChristmasMainView: DormitoryWarMainView;
    robotAiDirection: number;
    intervalIdRobotAiKey: number;
    intervalSantaComeoutIdRobotAiKey: number;
    robotBeMakeFun: boolean;
    robotNoBeFound: boolean;
    private actionTimeout;
    static robotAiLv: number;
    constructor(gameInstance: DormitoryWarMainView, robotDirection: number);
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
 * 舍友1，舍友2，宿管 随机检测数据
 */
declare class DormitoryWarSantaModel extends egret.DisplayObjectContainer {
    static STATUS_UPLEFTSTUDENT_YUJING: string;
    static STATUS_UPLEFTSTUDENT_XIAO: string;
    static STATUS_UPLEFTSTUDENT_NU: string;
    static STATUS_UPRIGHTSTUDENT_YUJING: string;
    static STATUS_UPRIGHTSTUDENT_XIAO: string;
    static STATUS_UPRIGHTSTUDENT_NU: string;
    static STATUS_TEACHER_YUJING: string;
    static STATUS_TEACHER_XIAO: string;
    static STATUS_TEACHER_LEFTNU: string;
    static STATUS_TEACHER_RIGHTNU: string;
    static STATUS_TEACHER_ALLNU: string;
    static TEACHERS_ACTION_STATUS1: number;
    static TEACHERS_ACTION_STATUS2: number;
    static TEACHERS_ACTION_STATUS3: number;
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
declare class DormitoryWarScore extends egret.Bitmap {
    constructor();
}
