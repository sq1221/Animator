declare class GameExpressTip extends StateEui {
    list: eui.List;
    gp_bg: eui.Group;
    lb_bg: eui.Label;
    img_bg: eui.Image;
    private arrayCollection1;
    private numMomentPage;
    private startPot;
    private EndPot;
    private Scroller1;
    gp_express: eui.Group;
    gp_pot: eui.Group;
    pot_1: eui.Image;
    pot_2: eui.Image;
    pot_3: eui.Image;
    private sourceArr1;
    private sourceArr2;
    constructor();
    init(): void;
    show(): void;
    private onbegin(e);
    private onEnd(e);
    addMesssgaeListener(): void;
    dispose(): void;
    onCancel(): void;
    private onQuit(e);
    private setGameType();
}
declare class Base64BitmapDataPool {
    private static pools;
    private static waitLoading;
    constructor();
    static getData(imgUrl: string, callBack: Function): void;
    static reduceUseNum(imgUrl: string): void;
}
declare class RoleHeadImage extends egret.Sprite {
    private bitmap;
    private maskBitmap;
    private imgUrl;
    private maskRes;
    private userBase64;
    constructor(url: string, maskRes?: string, headImgWidth?: number, headImgHeight?: number);
    private setBitmap(texture);
    dispose(): void;
}
declare class EventMessage {
    static GameLeave: string;
    static GameGiveUp: string;
    static gameCloseGiveUp: string;
    static GameExpress: string;
    static GameSendExpress: string;
    static ReddotChange: string;
    static ChangeAvatar: string;
    static WechatAppShow: string;
    static WechatShareSuccess: string;
    static ChatListChange: string;
    static gameResultLeave: string;
    static OpenChatRoomView: string;
    static OpenHomePageView: string;
    static gameCloseExpress: string;
    static GameGetSkinView: string;
    static MoneyChange: string;
    static ResumeDanmu: string;
    static BarrageBtnPos: string;
    static GameSureSelect: string;
    static HomePageViewData: string;
    /**
    * 发送游戏结算分数出来，排行榜使用
    */
    static leaderboardSetScore: string;
    /**
    * 发送暂停消息到游戏中，各游戏自己监听消息实现暂停的处理
    */
    static pauseMessage: string;
    static SendGameResultC2S: string;
    static SendGameEventC2S: string;
    static ReceiveGameEventS2C: string;
    static ReceiveGameResultS2C: string;
    static AddErrQuestionC2S: string;
    static GetQuestionsC2S: string;
    static GetDataC2S: string;
}
declare class CircleMask {
    private static circleMask;
    private static rect1;
    private static rect2;
    private static rect3;
    private static rect4;
    private static time;
    private static multiple;
    private static Arr;
    private static isHadShow;
    static hide(callback: Function): void;
    static show(callback: Function): void;
    private static init();
}
declare class DBAnimButton extends egret.DisplayObjectContainer {
    private _armature;
    constructor(armature: DBArmature);
    private onTouch(e);
    private onAnimComplete(e);
    touch(): void;
}
declare class DBButton extends egret.DisplayObjectContainer {
    private _armature;
    constructor(armature: DBArmature);
    private onTouchBegin(e);
    private onTouchEnd(e);
}
declare class DBProgress extends egret.DisplayObjectContainer {
    private _armature;
    private _progress;
    constructor(armature: DBArmature);
    progress: number;
}
declare class RoleAvatar {
    private _armature;
    private _headContainer;
    private _head;
    constructor(avatarType: number, headUrl: string, defaultAvatar?: string);
    private readonly avatarConfig;
    private getDbRes(avatarType);
    private getAvatarRes(avatarType);
    readonly armature: DBArmature;
    dispose(): void;
}
declare class GameReady extends egret.DisplayObjectContainer {
    /**
     * 回调函数，动画播放完毕后触发
     */
    protected _callback: () => any;
    protected imgReady: egret.Bitmap;
    protected imgGo: egret.Bitmap;
    protected stepReady: number;
    protected stepGo: number;
    /**
     * 提供一个准备动画，在播放完毕后可以触发回调函数，callback：回调函数
     */
    constructor(callback: () => any, raeadyURL?: string, goURL?: string);
    protected hide(): void;
    play(): void;
    dispose(): void;
}
declare class gameResultInGame extends egret.DisplayObjectContainer {
    private winTitle;
    private loseTitle;
    constructor();
    win(): void;
    lose(): void;
    recover(): void;
    dispose(): void;
}
declare class ItemExpressTip extends EuiItemRenderer {
    private btn_1;
    private btn_2;
    private btn_3;
    private btn_4;
    private btn_5;
    private btn_6;
    private btn_7;
    private btn_8;
    private btn_10;
    private btn_9;
    private btn_11;
    private btn_12;
    private btn_13;
    private btn_14;
    private btn_15;
    private btn_16;
    private btn_17;
    private btn_18;
    private btn_20;
    private btn_19;
    private btn_21;
    private btn_22;
    private btn_23;
    private btn_24;
    private gp_1;
    private gp_2;
    private gp_3;
    private gp_4;
    private num_page;
    constructor();
    $onRemoveFromStage(): void;
    dataChanged(): void;
    onSendMessage(e: egret.TouchEvent): void;
}
declare class QIPaoCartoon extends EuiComponent {
    private btn_qipao;
    private btn_qipao2;
    private btn_qipao3;
    img_1: eui.Image;
    img_2: eui.Image;
    constructor();
    setSouce(str: string, isOther?: boolean, type?: number): void;
    setFanzhuan(): void;
    onPlayTanDong(): void;
    onPlay(type?: number): void;
}
declare class DataCenter extends egret.EventDispatcher {
    private static _instance;
    private gameConfigs;
    user: User;
    room: RoomVO;
    SendExpressTime: number;
    static readonly instance: DataCenter;
    initConfig(gameConfig: any): void;
    getGameConfig(id: number): GameConfig;
}
interface ItemConfig {
    id: number;
    type: number;
    price: number;
    name: string;
    desc: string;
    asset: string;
}
interface GameConfig {
    gameId: number;
    name: string;
    icon: string;
    playerNum: number;
}
declare class RoomVO {
    id: string;
    gameId: number;
    player: User;
    gameResult: any;
    private _isAi;
    constructor(id: string, gameId: number, player: User, isAi: boolean);
    readonly IsAI: boolean;
    readonly selfIsMaster: boolean;
}
declare class User extends egret.EventDispatcher {
    static EVENT_LOAD_COMPLETE: string;
    static STATUS_IDLE: number;
    static STATUS_ROOM: number;
    static STATUS_MATCHING: number;
    static STATUS_GAME_LOADING: number;
    static STATUS_GAMING: number;
    static STATUS_GAME_RESULT: number;
    uuid: string;
    id: string;
    name: string;
    sex: number;
    imgUrl: string;
    country: string;
    province: string;
    city: string;
    curAvatarType: number;
    flowers: number;
    money: number;
    exp: number;
    guide: number;
    constellatory: number;
    barrage_num: number;
    status: number;
    roomId: number;
    gameId: number;
    constructor(id: string);
}
