class GameMasterMindItemClass {
    public static readyState: Array<number> = [0, 0];
    public static multiple: number;
    public static backGround: egret.Bitmap;
    public static btn1: egret.Bitmap;
    public static btn2: egret.Bitmap;
    public static btn3: egret.Bitmap;
    public static btn4: egret.Bitmap;
    public static clock: egret.Bitmap;
    public static fireLine: egret.Bitmap;
    public static fireLineLeft: egret.Bitmap;
    public static fireLineMask: egret.Bitmap;
    public static fireLineLeftMask: egret.Bitmap;
    public static scoreBoard: egret.Bitmap;
    public static rightTips: egret.Bitmap;
    public static wrongTips: egret.Bitmap;
    public static questionBoard: egret.Bitmap;
    public static youRole: RoleAvatar;
    public static otherRole: RoleAvatar;
    public static leftTimeUsed: egret.Bitmap;
    public static rightTimeUsed: egret.Bitmap;
    public static greetNormalBtn: egret.Bitmap;
    public static loadingTips: egret.TextField;
    public static isOffline: boolean = false;
    public static soundEffect: SoundEffects;
    public static questionText: egret.TextField;
    public static btn1Text: egret.TextField;
    public static btn2Text: egret.TextField;
    public static btn3Text: egret.TextField;
    public static btn4Text: egret.TextField;
    public static countdownText: egret.TextField;
    public static Question: Array<any> = [];
    public static correctAnswerIndex: number = -1;
    public static chooseIndex: number = -1;
    public static otherChooseIndex: number = -1;
    public static QuestionOrder = 0;
    public static youMark: egret.Bitmap;
    public static otherMark: egret.Bitmap;
    public static youTime: number = 0;
    public static otherTime: number = 0;
    public static typeStr: egret.TextField;
    public static turnsText: egret.TextField;
    public static youTimeText: egret.TextField;
    public static otherTimeText: egret.TextField;
    public static youScore: number = 0;
    public static otherScore: number = 0;
    public static youScoreText: egret.TextField;
    public static otherScoreText: egret.TextField;
    public static reportIcon: egret.Bitmap;
    public static leftDesk: egret.Bitmap;
    public static rightDesk: egret.Bitmap;
    public static nameLeftBoard: egret.Bitmap;
    public static nameRightBoard: egret.Bitmap;
    public static littleLeftMark: egret.Bitmap;
    public static littleRightMark: egret.Bitmap;
    public static timeUsedLeftBoard: egret.Bitmap;
    public static timeUsedRightBoard: egret.Bitmap;
    public static answerMask: egret.Bitmap;
    public static littlePurple: egret.Bitmap;
    public static spareType: egret.TextField;
    public static leftCombo: egret.Bitmap;
    public static rightCombo: egret.Bitmap;
    public static youCombo: number = 0;
    public static otherCombo: number = 0;
    public static youComboText: egret.TextField;
    public static otherComboText: egret.TextField;
    public static youComboState: boolean = false;
    public static otherComboState: boolean = false;
    public static hasShowLeftTimeUsed: boolean = false;
    public static hasShowRightTimeUsed: boolean = false;

    public static dispose = () => {
        GameMasterMindItemClass.readyState = [0, 0];
        GameMasterMindItemClass.multiple = undefined;
        GameMasterMindItemClass.backGround = undefined;
        GameMasterMindItemClass.btn1 = undefined;
        GameMasterMindItemClass.btn2 = undefined;
        GameMasterMindItemClass.btn3 = undefined;
        GameMasterMindItemClass.btn4 = undefined;
        GameMasterMindItemClass.clock = undefined;
        GameMasterMindItemClass.fireLine = undefined;
        GameMasterMindItemClass.fireLineLeft = undefined;
        GameMasterMindItemClass.fireLineMask = undefined;
        GameMasterMindItemClass.fireLineLeftMask = undefined;
        GameMasterMindItemClass.scoreBoard = undefined;
        GameMasterMindItemClass.rightTips = undefined;
        GameMasterMindItemClass.wrongTips = undefined;
        GameMasterMindItemClass.questionBoard = undefined;
        GameMasterMindItemClass.youRole = undefined;
        GameMasterMindItemClass.otherRole = undefined;
        GameMasterMindItemClass.leftTimeUsed = undefined;
        GameMasterMindItemClass.rightTimeUsed = undefined;
        GameMasterMindItemClass.greetNormalBtn = undefined;
        GameMasterMindItemClass.loadingTips = undefined;
        GameMasterMindItemClass.isOffline = false;
        GameMasterMindItemClass.soundEffect = undefined;
        GameMasterMindItemClass.questionText = undefined;
        GameMasterMindItemClass.btn1Text = undefined;
        GameMasterMindItemClass.btn2Text = undefined;
        GameMasterMindItemClass.btn3Text = undefined;
        GameMasterMindItemClass.btn4Text = undefined;
        GameMasterMindItemClass.countdownText = undefined;
        GameMasterMindItemClass.Question = [];
        GameMasterMindItemClass.correctAnswerIndex = -1;
        GameMasterMindItemClass.chooseIndex = 0;
        GameMasterMindItemClass.otherChooseIndex = 0;
        GameMasterMindItemClass.QuestionOrder = 0;
        GameMasterMindItemClass.youMark = undefined;
        GameMasterMindItemClass.otherMark = undefined;
        GameMasterMindItemClass.youTime = 0;
        GameMasterMindItemClass.otherTime = 0;
        GameMasterMindItemClass.typeStr = undefined;
        GameMasterMindItemClass.turnsText = undefined;
        GameMasterMindItemClass.youTimeText = undefined;
        GameMasterMindItemClass.otherTimeText = undefined;
        GameMasterMindItemClass.youScore = 0;
        GameMasterMindItemClass.otherScore = 0;
        GameMasterMindItemClass.youScoreText = undefined;
        GameMasterMindItemClass.otherScoreText = undefined;
        GameMasterMindItemClass.reportIcon = undefined;
        GameMasterMindItemClass.leftDesk = undefined;
        GameMasterMindItemClass.rightDesk = undefined;
        GameMasterMindItemClass.nameLeftBoard = undefined;
        GameMasterMindItemClass.nameRightBoard = undefined;
        GameMasterMindItemClass.littleLeftMark = undefined;
        GameMasterMindItemClass.littleRightMark = undefined;
        GameMasterMindItemClass.timeUsedLeftBoard = undefined;
        GameMasterMindItemClass.timeUsedRightBoard = undefined;
        GameMasterMindItemClass.answerMask = undefined;
        GameMasterMindItemClass.littlePurple = undefined;
        GameMasterMindItemClass.spareType = undefined;
        GameMasterMindItemClass.leftCombo = undefined;
        GameMasterMindItemClass.rightCombo = undefined;
        GameMasterMindItemClass.youCombo = 0;
        GameMasterMindItemClass.otherCombo = 0;
        GameMasterMindItemClass.youComboText = undefined;
        GameMasterMindItemClass.otherComboText = undefined;
        GameMasterMindItemClass.youComboState = false;
        GameMasterMindItemClass.otherComboState = false;
        GameMasterMindItemClass.hasShowLeftTimeUsed = false;
        GameMasterMindItemClass.hasShowRightTimeUsed = false;
    }
}