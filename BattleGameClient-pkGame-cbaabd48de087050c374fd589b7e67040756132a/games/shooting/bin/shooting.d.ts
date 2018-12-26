declare enum walkType {
    left = 0,
    right = 1,
    stand = 2,
}
declare class UserConfig {
    static frameTime: number;
    static shieldLimit: number;
    static shieldHP: number;
    static bulletLimit: number;
    static bulletSpeed: number;
    static reloadBullet: number;
    static ItemSpeed: number;
    static walkSpeed: number;
    static scores: number;
    static splitRotation: number;
    static AITime: number;
    static ItemTime: number;
}
declare enum ItemType {
    common = 0,
    rocket = 1,
    split = 2,
    shield = 3,
}
declare class ShootingUserController {
    private _walk;
    userImage: ShootingCharacter;
    private tempImage;
    private bulletView;
    private userImagePoint;
    private tempImagePoint;
    constructor();
    private initRectAndPoint();
    private setRect();
    nextRound(): void;
    setShield(): void;
    private onGameEvent(data);
    /**服务器发回来开始开枪 */
    private setSelfFire();
    /**服务器发回来开始放盾牌 */
    private setSelfShield();
    walk: walkType;
    startFire(): void;
    stopFire(): void;
    private continueFire();
    private frame(advancedTime);
    private setUserImageX(offset);
    private swapPoints();
    dispose(): void;
}
declare class GameShooting {
    userController: ShootingUserController;
    competitorController: ShootingComController;
    private itemController;
    scoreController: ShootingScoreController;
    private ai;
    items: ShootingItem[];
    isOffLine: boolean;
    isWuDi: boolean;
    userID: string;
    shields: {};
    bullets: ShootingBullet[];
    static point: egret.Point;
    constructor();
    private initObjects();
    init(): void;
    pauseCallback: () => void;
    private onGameEvent(data);
    nextRound(): void;
    private stopthisRoundNumber;
    stopThisRound(callback?: Function): void;
    private initBgMusic();
    private delayAi;
    startTime: () => void;
    clearGameItems(): void;
    onGameResult: (data: any) => void;
    dispose(): void;
}
declare class ShootingBulletController extends egret.DisplayObjectContainer {
    private bulletlist;
    private index;
    private bulletReloadBar;
    private bullets;
    constructor();
    bulletLimit: number;
    fire(): void;
    cannotFire(): void;
    private bulletFickerEffect;
    private bulletFicker;
    reload(): void;
    private stopBulletFlicker;
    private recover();
    private cancelFlickerAndInterval();
    nextRound(): void;
    dispose(): void;
}
declare class BulletReloadBar extends egret.DisplayObjectContainer {
    private bar;
    private process;
    private barBorder;
    private barMask;
    constructor();
    reload(): void;
    flip(): void;
    nextRound(): void;
    dispose(): void;
}
declare class ShootingComController {
    userImage: ShootingCharacter;
    private tempImage;
    private targetX;
    private walk;
    constructor();
    private initRectAndPoint();
    private setRect();
    nextRound(): void;
    /**接受网络传来的事件 */
    private onGameEvent(data);
    private setCompetitorShield;
    private frame(advancedTime);
    private setCompetitorFire();
    private userImagePoint;
    private tempImagePoint;
    private setUserImageX(offset, isChange?);
    private swapPoints();
    dispose(): void;
}
declare class GameShootingAI {
    private competitorController;
    constructor(cc: ShootingComController);
    stop: () => void;
    play: () => void;
    static shieldLimit: number;
    static bulleteLimit: number;
    private static isReload;
    private aiControl();
    static addAIItem(): void;
    dipose(): void;
}
declare class ShootingItemController {
    private isMain;
    constructor();
    play(): void;
    stop(): void;
    private addItem();
    webListener(data: any): void;
    dispose(): void;
}
declare class ShootingScoreController {
    private userHPs;
    private competitorHPs;
    private selfHPContainer;
    private competitorContainer;
    userScore: number;
    competitorScore: number;
    private userIndex;
    private competitorIndex;
    constructor();
    /**
     * 回掉包含音乐动画还有开启下一局需要参数
     */
    win(next: (isNext: boolean) => void): void;
    lose(next: (isNext: boolean) => void): void;
    sendmessage(win: number): void;
    setUserScore(score: number): void;
    setCompetitorScore(score: number): void;
    dispose(): void;
}
declare class GameShootingView extends State {
    basicLayer: egret.DisplayObjectContainer;
    selfShields: egret.DisplayObjectContainer;
    bulletsLayer: egret.DisplayObjectContainer;
    competitorshields: egret.DisplayObjectContainer;
    controlLayer: ControlLayer;
    roundBG: egret.Shape;
    static instance: GameShootingView;
    timeImg: GameReady;
    shootingGame: GameShooting;
    private result;
    background: egret.Bitmap;
    adaptScaleY: number;
    constructor();
    resultWin(): void;
    resultlose(): void;
    dispose(): void;
}
declare class ControlLayer extends egret.DisplayObjectContainer {
    constructor();
    private leftButton;
    private rightButton;
    private fireButton;
    private shieldButton;
    private returnToLastButton;
    private boom;
    private shieldNumberImg;
    private _shield;
    shield: number;
    private directArea;
    private addUIButton();
    private onKeyDown;
    private onKeyUp;
    private leftButtonPress;
    private rightButtonPress;
    private directAreaRelease();
    private controlPress;
    private leftRect;
    private rightRect;
    private directAreaRect;
    private touchPoint;
    private controlTouchMove;
    private controlRelease;
    private fireButtonPress();
    private fireButtonRelease();
    private shieldButtonTap();
    dispose(): void;
    boomPlay(x: number, y: number): void;
    private boomOver();
}
declare enum DirectionType {
    up = 0,
    down = 1,
}
declare enum BulletType {
    common = 0,
    rocket = 1,
}
declare class ShootingBullet extends egret.DisplayObjectContainer {
    private _owner;
    direction: DirectionType;
    type: BulletType;
    private bullet_img;
    private baozha;
    private globalPoint;
    private rect_bullet;
    private moveSpeed_x;
    private moveSpeed_y;
    halfWidth: number;
    halfHeight: number;
    /**有可能存在延迟，标脏 */
    private isDestroy;
    constructor(bitmapUrl: string);
    init: (owner: string, direction: DirectionType, bullettype?: BulletType) => void;
    readonly owner: string;
    destroy: (isPlay?: boolean) => void;
    private baozhaOver;
    private collisonShields();
    private collisonItems();
    private collisonUser();
    private collisonFrame;
    private transformFrame;
    private delayNextRound;
    private stopRoundAndNext;
    private stopRound;
    private removeFromParent();
    private setRotation($rotation);
    private static createShootingBulletInit(bullet, $x, $y, $rotation);
    static popShootingBullet(): ShootingBullet;
    static popShootingBullet_rocket(): ShootingBullet;
    static createShootingBullet($x: number, $y: number, $rotation: number): ShootingBullet;
    static createShootingBullet_rocket($x: number, $y: number, $rotation: number): ShootingBullet;
    static createShootingBulletByBullet(bullet: ShootingBullet, rotation: number): ShootingBullet;
    static createShootingBullet_rocketByBullet(bullet: ShootingBullet, rotation: number): ShootingBullet;
}
declare class ShootingCharacter extends egret.DisplayObjectContainer {
    userImage: DBArmature;
    personImg: DBArmature;
    istemp: boolean;
    private _rect;
    private _paoPosition;
    halfWidth: number;
    halfHeight: number;
    constructor(persondata: User, istemp?: boolean, defaultAvatar?: string);
    setRect(x: number, y: number, width: number, height: number): void;
    getRect(): egret.Rectangle;
    readonly paoPosition: egret.Point;
    walkLeft(): void;
    walkRight(): void;
    stand(): void;
    lose(callback?: Function): void;
    nextRound(): void;
    fire(): void;
    stop(): void;
}
declare enum ShootingItemDirectionType {
    left = 0,
    right = 1,
}
interface ShootingItemPort {
    effect(bullet: ShootingBullet): any;
}
declare class ShootingItem extends egret.DisplayObjectContainer implements ShootingItemPort {
    protected _itemType: ItemType;
    private _direction;
    private _rect;
    private _itemPoint;
    private _isDestroy;
    constructor();
    readonly itemType: ItemType;
    init(itemDirection: ShootingItemDirectionType): void;
    getRect(): egret.Rectangle;
    destroy(): void;
    private frame;
    effect(bullet: ShootingBullet): void;
}
declare class ShootingRocket extends ShootingItem {
    constructor();
    init(itemDirection: ShootingItemDirectionType): void;
    effect(bullet: ShootingBullet): void;
}
declare class ShootingSplit extends ShootingItem {
    constructor();
    init(itemDirection: ShootingItemDirectionType): void;
    effect(bullet: ShootingBullet): void;
}
declare class ShootingShield extends egret.DisplayObjectContainer {
    hp: number;
    private _owner;
    private shield_img;
    private _uid;
    private _rect;
    readonly uid: number;
    constructor(owner: string, key: number);
    setRect(x: number, y: number): void;
    getRect(): egret.Rectangle;
    readonly owner: string;
    hit(): void;
    destroy(): void;
}
declare class ShootingGetUID {
    private static _UID;
    static getUID(): number;
}
