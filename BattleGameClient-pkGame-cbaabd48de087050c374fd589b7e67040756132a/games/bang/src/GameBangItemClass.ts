class GameBangItemClass extends State {
    public static backGround: egret.Bitmap;
    public static youRole: egret.Bitmap;
    public static otherRole: egret.Bitmap;
    public static btnBang: egret.Bitmap;
    public static isOffline: boolean = false;
    public static turnNum: number = 1;
    public static readyState: Array<number> = [0, 0];
    public static youHealth: number = 5;
    public static youHealthBoard: egret.Bitmap;
    public static otherHealth: number = 5;
    public static otherHealthBoard: egret.Bitmap;
    public static multiple: number = 1;
    public static pkBorder: egret.Bitmap;
    public static headIcoLeft: RoleHeadImage;
    public static headIcoRight: RoleHeadImage;
    public static btnBackGround: egret.Bitmap;
    public static bangTip: egret.Bitmap;
    public static tipsRole_ul: egret.Bitmap;
    public static tipsRole_bl: egret.Bitmap;
    public static tipsRole_ur: egret.Bitmap;
    public static tipsRole_br: egret.Bitmap;
    public static tipsText_ul: egret.Bitmap;
    public static tipsText_bl: egret.Bitmap;
    public static tipsText_ur: egret.Bitmap;
    public static tipsText_br: egret.Bitmap;
    public static tipsState: Array<number> = [0, 0, 0, 0];
    public static isHost: boolean = false;
    public static restSec: number = 300;
    public static youSmoke: egret.Bitmap;
    public static otherSmoke: egret.Bitmap;
    public static otherSoundEffect: SoundEffects;
    public static youSoundEffect: SoundEffects;
    public static thirdSoundEffect: SoundEffects;
    public static backGroundSoundEffect: SoundBg;
    public static gameSettings: Array<Array<number>> = [];
    public static reference: boolean = false;
    public static turnState: Array<number> = [0, 0]; // 0-null 1-win 2-lose
    public static AITimer: number;
    // [0]杏、[1]蓝莓、[2]樱桃、[3]石榴、[4]葡萄、[5]桑仁
    public static fruitItem: Array<string> = ["apricot", "blueberry", "cherry", "granada", "grape", "mulberry"];
    public static youFruit: egret.Bitmap;
    public static youFruitBoom: egret.Bitmap;
    public static otherFruit: egret.Bitmap;
    public static otherFruitBoom: egret.Bitmap;
    public static uBorder: egret.Bitmap;
    public static bBorder: egret.Bitmap;
    public static ulBorder: egret.Bitmap;
    public static urBorder: egret.Bitmap;
    public static AICanShoot: boolean = true;
    public static img5s: egret.Bitmap;
    public static fireLightL: egret.Bitmap;
    public static fireLightR: egret.Bitmap;
    public static youShootSec: number = -1;
    public static otherShootSec: number = -1;
    public static endArray: Array<Array<number>> = [];
    public static tipsPosArray: Array<Array<Array<number>>> = [
        [
            [-210, 274], [10, 274]
        ], [
            [-210, 618], [10, 618]
        ], [
            [686, 274], [466, 274]
        ], [
            [686, 618], [466, 618]
        ]
    ];
    public static tipsRolePosArray: Array<Array<Array<number>>> = [
        [
            [-220, 333], [0, 333]
        ], [
            [-220, 671], [0, 671]
        ], [
            [640, 333], [418, 333]
        ], [
            [640, 671], [418, 671]
        ]
    ];

    public static dispose = () => {
        GameBangItemClass.backGround = undefined;
        GameBangItemClass.youRole = undefined;
        GameBangItemClass.otherRole = undefined;
        GameBangItemClass.btnBang = undefined;
        GameBangItemClass.isOffline = false;
        GameBangItemClass.turnNum = 1;
        GameBangItemClass.readyState = [0, 0];
        GameBangItemClass.youHealth = 5;
        GameBangItemClass.youHealthBoard = undefined;
        GameBangItemClass.otherHealth = 5;
        GameBangItemClass.otherHealthBoard = undefined;
        GameBangItemClass.multiple = 1;
        GameBangItemClass.pkBorder = undefined;
        GameBangItemClass.headIcoLeft = undefined;
        GameBangItemClass.headIcoRight = undefined;
        GameBangItemClass.btnBackGround = undefined;
        GameBangItemClass.bangTip = undefined;
        GameBangItemClass.tipsRole_ul = undefined;
        GameBangItemClass.tipsRole_bl = undefined;
        GameBangItemClass.tipsRole_ur = undefined;
        GameBangItemClass.tipsRole_br = undefined;
        GameBangItemClass.tipsText_ul = undefined;
        GameBangItemClass.tipsText_bl = undefined;
        GameBangItemClass.tipsText_ur = undefined;
        GameBangItemClass.tipsText_br = undefined;
        GameBangItemClass.isHost = false;
        GameBangItemClass.restSec = 300;
        GameBangItemClass.youSmoke = undefined;
        GameBangItemClass.otherSmoke = undefined;
        GameBangItemClass.otherSoundEffect = undefined;
        GameBangItemClass.youSoundEffect = undefined;
        GameBangItemClass.backGroundSoundEffect = undefined;
        GameBangItemClass.gameSettings = [];
        GameBangItemClass.tipsState = [0, 0, 0, 0];
        GameBangItemClass.reference = false;
        GameBangItemClass.turnState = [0, 0];
        GameBangItemClass.AITimer = undefined;
        GameBangItemClass.thirdSoundEffect = undefined;
        GameBangItemClass.AICanShoot = true;
        GameBangItemClass.img5s = undefined;
        GameBangItemClass.fireLightL = undefined;
        GameBangItemClass.fireLightR = undefined;
        GameBangItemClass.youShootSec = -1;
        GameBangItemClass.otherShootSec = -1;
        GameBangItemClass.endArray = [];
    }
}