/**
 * Created by yangsong on 16/1/24.
 */
declare class game_loadProgress_notice_s2c {
    msgId: number;
    userId: string;
    progress: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class Proto {
    private static dic;
    static init(): void;
    static ID_client_ping_c2s: string;
    static ID_client_network_c2s: string;
    static ID_client_network_s2c: string;
    static ID_error_notice_s2c: string;
    static ID_platform_login_c2s: string;
    static ID_platform_login_s2c: string;
    static ID_game_join_c2s: string;
    static ID_game_join_s2c: string;
    static ID_game_otherUserJoin_notice_s2c: string;
    static ID_game_loadProgress_c2s: string;
    static ID_game_loadProgress_notice_s2c: string;
    static ID_game_start_notice_s2c: string;
    static ID_game_exit_c2s: string;
    static ID_game_result_c2s: string;
    static ID_game_result_notice_s2c: string;
    static ID_game_event_c2s: string;
    static ID_game_event_notice_s2c: string;
    static ID_game_trunNumNotice_s2c: string;
    static ID_game_matching_c2s: string;
    static ID_game_matching_s2c: string;
    static ID_game_matching_notice_s2c: string;
    static ID_game_cancelMatching_c2s: string;
    static ID_game_cancelMatching_s2c: string;
    static decode(buff: egret.ByteArray): any;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class client_network_c2s {
    msgId: number;
    time: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class client_network_s2c {
    msgId: number;
    time: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class client_ping_c2s {
    msgId: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class error_notice_s2c {
    msgId: number;
    errorCode: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_cancelMatching_c2s {
    msgId: number;
    userId: string;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_cancelMatching_s2c {
    msgId: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_event_c2s {
    msgId: number;
    roomId: string;
    sendType: number;
    event: string;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_event_notice_s2c {
    msgId: number;
    userId: string;
    event: string;
    trunNum: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_exit_c2s {
    msgId: number;
    roomId: string;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_join_c2s {
    msgId: number;
    roomId: string;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_join_s2c {
    msgId: number;
    myUser: userInfo;
    otherUser: userInfo;
    isAi: number;
    aiLevel: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_loadProgress_c2s {
    msgId: number;
    roomId: string;
    progress: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 2016/7/27.
 */
declare class Msg {
    static encode(buff: egret.ByteArray, fieldType: string, fieldValue: any, arrayType?: any): void;
    static decode(buff: egret.ByteArray, fieldType: any, arrayType?: any): any;
    static decodeArray(buff: egret.ByteArray, fieldtype: any): any[];
    static encodeArray(buff: any, fieldValue: any, arrayType: any): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_matching_c2s {
    msgId: number;
    gameId: number;
    userId: string;
    userName: string;
    userPic: string;
    userSex: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_matching_notice_s2c {
    msgId: number;
    gameId: number;
    otherUserId: string;
    otherUserName: string;
    otherUserPic: string;
    otherUserSex: number;
    isAi: number;
    aiLevel: number;
    roomId: string;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_matching_s2c {
    msgId: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_otherUserJoin_notice_s2c {
    msgId: number;
    otherUser: userInfo;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_result_c2s {
    msgId: number;
    roomId: string;
    result: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_result_notice_s2c {
    msgId: number;
    winUserId: string;
    userExitFlag: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_start_notice_s2c {
    msgId: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class game_trunNumNotice_s2c {
    msgId: number;
    trunNum: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class platform_login_c2s {
    msgId: number;
    gameId: number;
    platformId: number;
    platformData: string;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class platform_login_s2c {
    msgId: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
/**
 * Created by yangsong on 16/1/24.
 */
declare class userInfo {
    uuid: string;
    userId: string;
    userName: string;
    userPic: string;
    userSex: number;
    userProgress: number;
    encode(): egret.ByteArray;
    decode(buff: egret.ByteArray): void;
}
declare class ProxyHttp {
    private static platformId;
    /**
     * 初始化
     */
    static init(serverUrl: string, platformId: number): void;
    private static request(type, param?, callBack?);
    /**
     * 转换数据格式
     * @param	t_type
     * @param	...args
     * @return
     */
    private static getURLVariables(type, param);
    private static getPlatformName();
    private static Gate_getGameServer;
    private static Gate_getQuestions;
    private static Gate_getData;
    /**
     * 获取服务器ip & post
     */
    static getGameServer(roomId: string, callBack: Function): void;
    /**
     * 获取答题数据
     */
    static getQuestions(roomId: string, callBack: Function): void;
    /**
     * 获取数据
     */
    static getData(gameId: number, callBack: Function): void;
    /**
     * 微信图片转为Base64
     */
    static wxImgToBase64(imgUrl: string, callBack: Function): void;
}
/**
 * Created by egret on 15-7-15.
 */
declare class ProxySocket {
    /**
     * 初始化
     */
    static init(host: string, port: any, useSSL: boolean): void;
    static stop(): void;
    static startPing(): void;
    static stopPing(): void;
    static startMatching(gameId: number, userId: string, userName: string, userPic: string, userSex: number): void;
    static stopMatching(userId: string): void;
    static joinGame(roomId: string): void;
    static sendLoadProgress(roomId: string, progressNum: number): void;
    static sendGameEvent(roomId: string, event: string, sendType?: number): void;
    static sendGameResult(roomId: string, result: number): void;
    static exitGame(roomId: string): void;
    static ping(): void;
    static platformLogin(gameId: number, platformId: number, platformData: any): void;
}
