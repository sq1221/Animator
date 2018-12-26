/**
 * 电脑人
 */
declare class GameTwiceJoyAI extends egret.DisplayObjectContainer {
    gameTwiceJoyMainView: GameTwiceJoyMainView;
    static robotAiLv: number;
    static robotSec: number;
    setTimeoutBool: boolean;
    intervalIdRobotAiKey: number;
    setTimeoutIdRobotAiKey: number;
    constructor(gameInstance: GameTwiceJoyMainView);
    checkResultScore: () => void;
    robotAiStart(): void;
    aiWin(): void;
    hardModel(): void;
    clearData(): void;
}
/**
 * 卡片数据
 */
declare class GameTwiceJoyCard extends EuiComponent {
    cardGroup: eui.Group;
    cardBgImg: eui.Image;
    showCardImg: eui.Image;
    hideCardImg: eui.Image;
    matchSuccessImg: eui.Image;
    private _cardType;
    private _iconSource;
    private _matchingSuccess;
    private _isOpen;
    private _cardPosId;
    constructor();
    /**卡片类型 */
    cardType: number;
    /**卡片icon */
    iconSource: string;
    readonly icon: string;
    /**是否配对成功 */
    matchSuccess: boolean;
    /**是否开启中 */
    isOpen: boolean;
    /**卡片位置id*/
    cardPosId: number;
    cardOpen(): void;
    cardClose(): void;
    cardMatchSuccess(): void;
    clearTween(): void;
}
/**
 * 翻翻乐
 * by dingyafeng
 */
declare class GameTwiceJoyMainView extends StateEui {
    static GAME_WIDTH: number;
    static GAME_HEIGHT: number;
    containerGroup: eui.Group;
    goBackBtn: eui.Button;
    redProgress: eui.Image;
    playerAvatarGroup1: eui.Group;
    player1Avatar: eui.Group;
    player1SexImg: eui.Image;
    player1NameLab: eui.Label;
    blueProgress: eui.Image;
    playerAvatarGroup2: eui.Group;
    player2Avatar: eui.Group;
    player2SexImg: eui.Image;
    player2NameLab: eui.Label;
    cardsGroup: eui.Group;
    cardEffectGroup: eui.Group;
    btn_express1: eui.Button;
    btn_express2: eui.Button;
    btn_express3: eui.Button;
    btn_express4: eui.Button;
    btn_express5: eui.Button;
    btn_express6: eui.Button;
    static avatarMoveDistance: number;
    private gameStartBool;
    private clearTimeoutReadyId;
    private myHeadImage;
    private otherHeadImage;
    private particleStars1;
    private particleStars2;
    gameTwiceJoyModel: GameTwiceJoyModel;
    private cardsItemArr;
    private selectCardArr;
    gameRobotAi: GameTwiceJoyAI;
    static aiConf: any;
    twiceJoyEffect: SoundEffects;
    twiceJoyCommonEffect: SoundEffects;
    constructor();
    init(): void;
    show(): void;
    private playerAvatarAdd();
    private gameStart();
    addMesssgaeListener(): void;
    private onGameEvent(data);
    arriveScore(): void;
    onGameResult(data: any): void;
    private onGameleave();
    private clearData();
    dispose(): void;
    private playerAvatarGroup1Handler();
    private playerAvatarGroup2Handler();
    private gameCardItemClickHandle(event);
    private cardMatchCheck(currentItem, posX, poxY);
    private addQiPaoCartoon(data, type?);
    private AddAIexpress();
    onSendExpressMessage(e: egret.TouchEvent): void;
    private goBackBtnHandler();
    private sendResult(result);
    particleManager: (posX1: number, poxY1: number, posX2: number, poxY2: number, particleType?: string, time?: number) => void;
}
/**
 * 翻翻乐model
 */
declare class GameTwiceJoyModel {
    static CARD_MATCH_SUCCESS: string;
    static SEND_EXPRESS: string;
    static random: Function;
    twiceMapData: number[];
    static resultScore: number;
    myScore: number;
    otherScore: number;
    constructor();
    mapInit(): void;
}
