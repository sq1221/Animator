class GameRhythmKingItemClass {
    public static backGroundLeft: egret.Bitmap;
    public static backGroundRight: egret.Bitmap;
    public static backGroundLeft_: egret.Bitmap;
    public static backGroundRight_: egret.Bitmap;
    public static otherBtn: egret.Bitmap;
    public static multiple: number;
    public static backGroundMusicPlayer: SoundEffects = new SoundEffects();
    public static runningSec: number = -180;
    public static speedSupplement: number = 180; // 60 hexadecimal
    public static settingsIndex: number = 0;
    public static usingSetting: Array<number> = [];
    public static rkLine: egret.Bitmap;
    public static rkLineMask: egret.Bitmap;
    public static blockBack: egret.Bitmap;
    public static blockFront: egret.Bitmap;
    public static you: egret.Bitmap;
    public static pointBoardYou: egret.Bitmap;
    public static pointBoardOther: egret.Bitmap;
    public static pointYou: egret.TextField = new egret.TextField();
    public static pointOther: egret.TextField = new egret.TextField();
    public static roadBatholith: egret.Bitmap;
    public static pointYouNumber: number = 0;
    public static pointOtherNumber: number = 0;
    public static comboYou: number = 0;
    public static comboOther: number = 0;
    public static roadBeatCenter: egret.Bitmap;
    public static comboType: egret.Bitmap;
    public static comboOtherType: egret.Bitmap;
    public static tapTimeStamp: number;
    public static judgeItem: number;
    public static recycleArray: Array<egret.DisplayObject> = [];
    public static blockArray: Array<egret.DisplayObject> = [];
    public static blockOtherArray: Array<egret.DisplayObject> = [];
    public static blockYouHeight: number = 0;
    public static blockOtherHeight: number = 0;
    public static blockItemSettingsArray: Array<any> = [];
    public static blockItemSettingsOtherArray: Array<any> = [];
    public static comboYouImage: egret.Bitmap;
    public static comboOtherImage: egret.Bitmap;
    public static comboYouText = new egret.BitmapText();
    public static comboOtherText = new egret.BitmapText();
    public static headIcoYou: RoleAvatar;
    public static headIcoOther: RoleAvatar;
    public static sideFold: egret.Bitmap;
    public static sideProgress: egret.Bitmap;
    public static rhythmSumPast: number = 1;
    public static rhythmSumNum: number = 0;
    public static rhythmYouPast: number = 1;
    public static rhythmOtherPast: number = 1;
    public static otherRoleAvatar: RoleAvatar;
    public static myRoleAvatar: RoleAvatar;
    public static keyPressSoundEffect: SoundEffects;
    public static gameReady: GameReady;
    public static choice: number;
    public static readyState: Array<number> = [0, 0];
    public static jumpRoleYou: RoleAvatar;
    public static jumpRoleOther: RoleAvatar;
    public static sparkLeft: egret.Bitmap;
    public static sparkRight: egret.Bitmap;
    public static gameOverState = [0, 0];
    public static alaphaMask: egret.Bitmap;
    public static bottomSide: egret.Bitmap;
    public static waitingSceneMask: egret.Shape;
    public static waitingText: egret.Bitmap;
    public static starBoard: egret.Bitmap;
    public static stars: Array<any> = [];
    public static gameLevel: number = 0;
    public static whiteFont: egret.BitmapFont;
    public static highestYouCombo: number = 0;;
    public static highestOtherCombo: number = 0;;
    public static perNumYou: number = 0;;
    public static perNumOther: number = 0;;
    public static goodNumYou: number = 0;;
    public static goodNumOther: number = 0;;
    public static norNumYou: number = 0;;
    public static norNumOther: number = 0;
    public static musicPlaying: string;
    public static resultYouBoard: egret.Bitmap;
    public static resultOtherBoard: egret.Bitmap;
    public static resultYouText: Array<egret.DisplayObject> = [];
    public static resultOtherText: Array<egret.DisplayObject> = [];
    public static sunShineYou: egret.Bitmap;
    public static sunShineOther: egret.Bitmap;
    public static loseBlockYou: egret.Bitmap;
    public static loseBlockOther: egret.Bitmap;
    public static AiRandom: number = 0;
    public static rippleArray: Array<string> = [];
    public static topSide: egret.Bitmap;

    public static dispose = () => {
        GameRhythmKingItemClass.backGroundLeft = undefined;
        GameRhythmKingItemClass.backGroundRight = undefined;
        GameRhythmKingItemClass.backGroundLeft_ = undefined;
        GameRhythmKingItemClass.backGroundRight_ = undefined;
        GameRhythmKingItemClass.otherBtn = undefined;
        GameRhythmKingItemClass.multiple = undefined;
        GameRhythmKingItemClass.backGroundMusicPlayer = undefined;
        GameRhythmKingItemClass.runningSec = -300;
        GameRhythmKingItemClass.speedSupplement = 300;
        GameRhythmKingItemClass.settingsIndex = 0;
        GameRhythmKingItemClass.usingSetting = [];
        GameRhythmKingItemClass.rkLine = undefined;
        GameRhythmKingItemClass.rkLineMask = undefined;
        GameRhythmKingItemClass.blockBack = undefined;
        GameRhythmKingItemClass.blockFront = undefined;
        GameRhythmKingItemClass.you = undefined;
        GameRhythmKingItemClass.pointBoardYou = undefined;
        GameRhythmKingItemClass.pointBoardOther = undefined;
        GameRhythmKingItemClass.pointYou = new egret.TextField();
        GameRhythmKingItemClass.pointOther = new egret.TextField();
        GameRhythmKingItemClass.roadBatholith = undefined;
        GameRhythmKingItemClass.pointYouNumber = 0;
        GameRhythmKingItemClass.pointOtherNumber = 0;
        GameRhythmKingItemClass.comboYou = 0;
        GameRhythmKingItemClass.comboOther = 0;
        GameRhythmKingItemClass.roadBeatCenter = undefined;
        GameRhythmKingItemClass.comboType = undefined;
        GameRhythmKingItemClass.comboOtherType = undefined;
        GameRhythmKingItemClass.tapTimeStamp = undefined;
        GameRhythmKingItemClass.judgeItem = undefined;
        GameRhythmKingItemClass.recycleArray = [];
        GameRhythmKingItemClass.blockArray = [];
        GameRhythmKingItemClass.blockOtherArray = [];
        GameRhythmKingItemClass.blockYouHeight = 0;
        GameRhythmKingItemClass.blockOtherHeight = 0;
        GameRhythmKingItemClass.blockItemSettingsArray = [];
        GameRhythmKingItemClass.blockItemSettingsOtherArray = [];
        GameRhythmKingItemClass.comboYouImage = undefined;
        GameRhythmKingItemClass.comboOtherImage = undefined;
        GameRhythmKingItemClass.comboYouText = new egret.BitmapText();
        GameRhythmKingItemClass.comboOtherText = new egret.BitmapText();
        GameRhythmKingItemClass.headIcoYou = undefined;
        GameRhythmKingItemClass.headIcoOther = undefined;
        GameRhythmKingItemClass.sideFold = undefined;
        GameRhythmKingItemClass.sideProgress = undefined;
        GameRhythmKingItemClass.rhythmSumPast = 1;
        GameRhythmKingItemClass.rhythmSumNum = 0;
        GameRhythmKingItemClass.rhythmYouPast = 1;
        GameRhythmKingItemClass.rhythmOtherPast = 1;
        GameRhythmKingItemClass.otherRoleAvatar = undefined;
        GameRhythmKingItemClass.myRoleAvatar = undefined;
        GameRhythmKingItemClass.keyPressSoundEffect = undefined;
        GameRhythmKingItemClass.gameReady = undefined;
        GameRhythmKingItemClass.choice = undefined;
        GameRhythmKingItemClass.readyState = [0, 0];
        GameRhythmKingItemClass.jumpRoleYou = undefined;
        GameRhythmKingItemClass.jumpRoleOther = undefined;
        GameRhythmKingItemClass.sparkLeft = undefined;
        GameRhythmKingItemClass.sparkRight = undefined;
        GameRhythmKingItemClass.gameOverState = [0, 0];
        GameRhythmKingItemClass.alaphaMask = undefined;
        GameRhythmKingItemClass.bottomSide = undefined;
        GameRhythmKingItemClass.waitingSceneMask = undefined;
        GameRhythmKingItemClass.waitingText = undefined;
        GameRhythmKingItemClass.starBoard = undefined;
        GameRhythmKingItemClass.stars = [];
        GameRhythmKingItemClass.gameLevel = 0;
        GameRhythmKingItemClass.whiteFont = undefined;
        GameRhythmKingItemClass.highestYouCombo = 0;
        GameRhythmKingItemClass.highestOtherCombo = 0;
        GameRhythmKingItemClass.perNumYou = 0;
        GameRhythmKingItemClass.perNumOther = 0;
        GameRhythmKingItemClass.goodNumYou = 0;
        GameRhythmKingItemClass.goodNumOther = 0;
        GameRhythmKingItemClass.norNumYou = 0;
        GameRhythmKingItemClass.norNumOther = 0;
        GameRhythmKingItemClass.musicPlaying = undefined;
        GameRhythmKingItemClass.resultYouBoard = undefined;
        GameRhythmKingItemClass.resultOtherBoard = undefined;
        GameRhythmKingItemClass.resultYouText = [];
        GameRhythmKingItemClass.resultOtherText = [];
        GameRhythmKingItemClass.sunShineYou = undefined;
        GameRhythmKingItemClass.sunShineOther = undefined;
        GameRhythmKingItemClass.loseBlockYou = undefined;
        GameRhythmKingItemClass.loseBlockOther = undefined;
        GameRhythmKingItemClass.AiRandom = 0;
        GameRhythmKingItemClass.rippleArray = [];
        GameRhythmKingItemClass.topSide = undefined;
    }
}

/**
 * 层级
 * 0 —— 背景
 * 1 —— blockFront
 * 2 —— rkLine
 * 3 —— rhythm beat
 * 4 —— blockBack
 */