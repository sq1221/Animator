/**
 * Created by yangsong on 14/12/18.
 * 基类
 */
declare class BaseClass {
    constructor();
    /**
     * 获取一个单例
     * @returns {any}
     */
    static getInstance(...args: any[]): any;
}
/**
 * Created by yangsong on 15-2-11.
 */
declare class ByteArrayMsg implements BaseMsg {
    private _msgBuffer;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 接收消息处理
     * @param msg
     */
    receive(socket: egret.WebSocket): void;
    /**
     * 发送消息处理
     * @param msg
     */
    send(socket: egret.WebSocket, msg: any): void;
    /**
     * 消息解析
     * @param msg
     */
    decode(msg: any): any;
    /**
     * 消息封装
     * @param msg
     */
    encode(msg: any): any;
}
/**
 * Created by yangsong on 15-2-11.
 */
declare class UTFMsg implements BaseMsg {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 接收消息处理
     * @param msg
     */
    receive(socket: egret.WebSocket): void;
    /**
     * 发送消息处理
     * @param msg
     */
    send(socket: egret.WebSocket, msg: any): void;
    /**
     * 消息解析
     * @param msg
     */
    decode(msg: any): any;
    /**
     * 消息封装
     * @param msg
     */
    encode(msg: any): any;
}
declare module particle {
    class Particle {
        /**
         * 表示 Particle 实例相对于父级本地坐标的 x 坐标。
         * @member {number} particle.Particle#x
         */
        x: number;
        /**
         * 表示粒子实例相对于父级本地坐标的 y 坐标。
         * @member {number} particle.Particle#y
         */
        y: number;
        /**
         * 表示从注册点开始应用的对象的缩放比例（百分比）。
         * @member {number} particle.Particle#scale
         * @default 1
         */
        scale: number;
        /**
         * 表示 Particle 实例距其原始方向的旋转程度，以度为单位
         * @member {number} particle.Particle#rotation
         * @default 0
         */
        rotation: number;
        /**
         * 表示粒子的 Alpha 透明度值
         * @member {number} particle.Particle#alpha
         * @default 1
         */
        alpha: number;
        /**
         * 表示粒子当前存活时间，以毫秒为单位，取值范围(0,Number.MAX_VALUE]，该值超过 totalTime 时，粒子将会被销毁
         * @member {number} particle.Particle#currentTime
         * @default 0
         */
        currentTime: number;
        /**
         * 表示粒子的存活总时间，以毫秒为单位，取值范围(0,Number.MAX_VALUE]
         * @member {number} particle.Particle#totalTime
         * @default 1000
         */
        totalTime: number;
        /**
         * 表示粒子的混合模式
         * @member {number} particle.Particle#blendMode
         */
        blendMode: number;
        constructor();
        reset(): void;
        private matrix;
        $getMatrix(regX: number, regY: number): egret.Matrix;
    }
}
declare module particle {
    class ParticleSystem extends egret.DisplayObject {
        private _pool;
        private frameTime;
        private particles;
        private _emitterBounds;
        protected relativeContentBounds: egret.Rectangle;
        protected _emitterX: number;
        protected _emitterY: number;
        /**
         * 表示粒子出现总时间，单位毫秒，取值范围(0,Number.MAX_VALUE]，-1表示无限时间
         * @member {number} particle.ParticleSystem#emissionTime
         * @default -1
         */
        emissionTime: number;
        /**
         * 表示粒子出现间隔，单位毫秒，取值范围(0,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#emissionRate
         */
        emissionRate: number;
        /**
         * 表示粒子所使用的纹理
         * @member {egret.Texture} particle.ParticleSystem#texture
         */
        texture: egret.Texture;
        /**
         * 表示粒子系统最大粒子数，超过该数量将不会继续创建粒子，取值范围[1,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#maxParticles
         * @default 200
         */
        maxParticles: number;
        /**
         * 当前粒子数
         * @member {number} particle.ParticleSystem#numParticles
         */
        private numParticles;
        /**
         * 表示粒子类，如果设置创建粒子时将创建该类
         * @member {number} particle.ParticleSystem#particleClass
         */
        particleClass: any;
        $particleConfig: any;
        constructor(texture: egret.Texture, emissionRate: number);
        protected createNativeDisplayObject(): void;
        initConfig(emissionRate: number, emitterX: number, emitterY: number): void;
        private getParticle();
        private removeParticle(particle);
        initParticle(particle: Particle): void;
        /**
         * 更新当前显示对象坐标系下的边框界限
         * @param emitterRect {egret.Rectangle} 相对发射点坐标系下的界限
         */
        private updateRelativeBounds(emitterRect);
        /**
         * 表示当前粒子系统中发射粒子的渲染边界范围，使用以发射点为基准的坐标系
         * @member {egret.Rectangle} particle.ParticleSystem#emitterBounds
         */
        emitterBounds: egret.Rectangle;
        onPropertyChanges(): void;
        /**
         * 表示粒子出现点X坐标，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#emitterX
         * @default 0
         */
        emitterX: number;
        /**
         * 表示粒子出现点Y坐标，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#emitterY
         * @default 0
         */
        emitterY: number;
        /**
         * 开始创建粒子
         * @param duration {number} 粒子出现总时间
         */
        start(duration?: number): void;
        /**
         * 停止创建粒子
         * @param clear {boolean} 是否清除掉现有粒子
         */
        stop(clear?: boolean): void;
        private timeStamp;
        private update(timeStamp);
        private particleMeasureRect;
        private transformForMeasure;
        private lastRect;
        $measureContentBounds(bounds: egret.Rectangle): void;
        setCurrentParticles(num: number): void;
        /**
         * 更换粒子纹理
         * @param texture {egret.Texture} 新的纹理
         */
        changeTexture(texture: egret.Texture): void;
        private clear();
        private addOneParticle();
        advanceParticle(particle: Particle, dt: number): void;
        private bitmapNodeList;
        $updateRenderNode(): void;
        private appendTransform(matrix, x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY);
    }
}
declare let regionPool: Region[];
/**
 * @private
 */
declare class Region {
    /**
     * @private
     * 释放一个Region实例到对象池
     */
    static release(region: Region): void;
    /**
     * @private
     * 从对象池中取出或创建一个新的Region对象。
     * 建议对于一次性使用的对象，均使用此方法创建，而不是直接new一个。
     * 使用完后调用对应的release()静态方法回收对象，能有效减少对象创建数量造成的性能开销。
     */
    static create(): Region;
    /**
     * @private
     */
    minX: number;
    /**
     * @private
     */
    minY: number;
    /**
     * @private
     */
    maxX: number;
    /**
     * @private
     */
    maxY: number;
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @private
     */
    area: number;
    /**
     * @private
     */
    private setEmpty();
    /**
     * @private
     */
    updateRegion(bounds: egret.Rectangle, matrix: egret.Matrix): void;
}
/**
 * Created by yangsong on 15-1-14.
 * Sound基类
 */
declare class BaseSound {
    _cache: any;
    _loadingCache: Array<string>;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 处理音乐文件的清理
     */
    private dealSoundTimer();
    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    getSound(key: string): egret.Sound;
    /**
     * 资源加载完成
     * @param event
     */
    private onResourceLoadComplete(data, key);
    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    loadedPlay(key: string): void;
    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    checkCanClear(key: string): boolean;
}
/**
 * Created by yangsong on 2014/11/22.
 */
declare class StateEui extends eui.Component implements IState {
    isInit: boolean;
    private skinClass;
    private showParam;
    /**
     * 构造函数
     */
    constructor(skinClass: any);
    addToParent(parent: egret.DisplayObjectContainer, param: any): void;
    private initComplate();
    init(): void;
    show(showParam?: any): void;
    addMesssgaeListener(): void;
    next(state: string, param?: any): void;
    popup(state: string, param?: any): void;
    returnToLast(param?: any): void;
    tick(advancedTime: number): void;
    close(): void;
    dispose(): void;
}
declare class EuiItemRenderer extends eui.ItemRenderer {
    /**
     * 构造函数
     */
    constructor(skinClass: any);
}
/**
 * Created by Saco on 2014/12/1.
 */
declare class HotspotBitmap extends egret.Bitmap {
    private _hotspot;
    constructor();
    addHotspotArea(rect: egret.Rectangle, callBack: Function, thisObj: any, para?: any): void;
    private onTouch(e);
}
declare class DBArmature extends egret.DisplayObjectContainer {
    private _armature;
    private _armatureDisplay;
    private _curClock;
    private _displayEvents;
    private _currAction;
    constructor(armature: dragonBones.Armature);
    private dealClock(target);
    private addToClock(clock);
    /**
     * 慎用
     */
    $addToClock(): void;
    /**
     * 慎用
     */
    $removeFromClock(): void;
    private getRunDbNum();
    gotoAndStop(animationName: string): void;
    gotoAndStopByTime(animationName: string, time?: number): void;
    gotoAndStopByProgress(animationName: string, progress?: number): void;
    play(animationName: string, playTimes?: number): dragonBones.AnimationState;
    readonly currAction: string;
    stop(): void;
    replaceSlot(slotName: string, display: egret.DisplayObject): void;
    replaceTexture(texture: any): void;
    replaceSkin(skinData: dragonBones.SkinData): void;
    readonly armatureName: string;
    timeScale: number;
    getSlot(slotName: string): dragonBones.Slot;
    getBone(boneName: string): dragonBones.Bone;
    once(type: dragonBones.EventStringType, listener: (event: dragonBones.EgretEvent) => void, target: any): void;
    addDisplayEvent(type: dragonBones.EventStringType, listener: (event: dragonBones.EgretEvent) => void, target: any): void;
    removeDisplayEvent(type: dragonBones.EventStringType, listener: (event: dragonBones.EgretEvent) => void, target: any): void;
    removeAllDisplayEvent(): void;
    dispose(): void;
}
/**
 * Created by yangsong on 2014/11/22.
 * Http数据缓存类
 */
declare class DynamicChange {
    private _dataCache;
    private _pUpdate;
    constructor();
    readonly pUpdate: ProxyUpdate;
    getCacheData(key: string): any;
    clearCache(): void;
    getCacheKeyInfos(): Array<any>;
    isCache(key: string): boolean;
}
/**
 * Created by yangsong on 2014/11/22.
 * Http数据更新类
 */
declare class ProxyUpdate {
    private _cache;
    constructor(cache: any);
    isArray(key: any): boolean;
    isObject(key: string): boolean;
    isNormal(key: string): boolean;
    isAddToArray(key: string): boolean;
    isRemoveToArray(key: string): boolean;
    isFilter(key: string): boolean;
    isNumeric(v: string): boolean;
    private _updateObject(name, value, cacheData);
    private _getFilterObject(filter, cacheData);
    private _addObjectToArray(cacheData, changeValue);
    private _removeObjectFromArray(cacheData, key, changeValue);
    update(key: string, data: any): void;
    private _update(cacheData, changeData);
}
/**
 * Created by yangsong on 2014/11/22.
 * Http请求处理
 */
declare class Http extends BaseClass {
    private _serverUrl;
    private _urlLoader;
    private _request;
    private _cache;
    private _isRequesting;
    private _data;
    private _type;
    private _typeCallBack;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    initServer(serverUrl: string): void;
    /**
     * 当前服务器地址
     */
    readonly serverUrl: string;
    /**
     * 数据缓存
     * @returns {DynamicChange}
     * @constructor
     */
    readonly Data: DynamicChange;
    /**
     * Http错误处理函数
     * @param e
     */
    private onError(e);
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    send(type: string, urlVariables: egret.URLVariables, callBack?: Function): void;
    /**
     * 请求服务器
     */
    private post();
    /**
     * 数据返回
     * @param event
     */
    private onLoaderComplete(event);
    /**
     * 开始下一个请求
     */
    private nextPost();
}
/**
 * Created by chaoshengze on 2018/04/02.
 * Http 使用常量
 */
declare class HttpConst {
    /**
     * Http不能连接上
     * @type {string}
     */
    static HTTP_NOCONNECT: string;
}
/**
 * Created by yangsong on 2014/11/25.
 * 服务端消息解析
 */
interface BaseMsg {
    /**
     * 接收消息处理
     * @param msg
     */
    receive(socket: egret.WebSocket): void;
    /**
     * 发送消息处理
     * @param msg
     */
    send(socket: egret.WebSocket, msg: any): void;
    /**
     * 消息解析,返回格式{key:XX, body:XX}
     * @param msg
     */
    decode(msg: any): any;
    /**
     * 消息封装
     * @param msg
     */
    encode(msg: any): any;
}
declare class ThemeAdapter implements eui.IThemeAdapter {
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
}
/**
 * Created by yangsong on 15-3-25.
 */
declare class ByteArrayMsgByProto extends ByteArrayMsg {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 消息解析
     * @param msg
     */
    decode(msg: any): any;
    /**
     * 消息封装
     * @param msg
     */
    encode(msg: any): any;
}
/**
 * Created by yangsong on 2014/11/23.
 * 服务端返回消息处理
 */
declare class MessageCenter {
    private static _instance;
    static getInstance(): MessageCenter;
    private dict;
    private eVec;
    private lastRunTime;
    private type;
    /**
     * 构造函数
     * @param type 0:使用分帧处理 1:及时执行
     */
    constructor(type: number);
    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     *
     */
    addListener(type: string, listener: Function, listenerObj: any): void;
    /**
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
    removeListener(type: string, listener: Function, listenerObj: any): void;
    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
    removeAll(listenerObj: any): void;
    /**
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
     *
     */
    dispatch(type: string, ...param: any[]): void;
    /**
     * 运行
     *
     */
    private run(advancedTime);
    /**
     * 处理一条消息
     * @param msgVo
     */
    private dealMsg(msgVo);
}
declare class MessageVo {
    type: string;
    param: any[];
    constructor();
    dispose(): void;
}
/**
 * Created by yangsong on 2014/11/25.
 * Socket类
 */
declare class Socket extends BaseClass {
    private _needReconnect;
    private _isConnected;
    private _host;
    private _port;
    private _useSSL;
    private _socket;
    private _msg;
    private _isConnecting;
    /**
     * 添加事件监听
     */
    private addEvents();
    /**
     * 移除事件监听
     */
    private removeEvents();
    /**
     * 服务器连接成功
     */
    private onSocketOpen();
    /**
     * 服务器断开连接
     */
    private onSocketClose();
    /**
     * 服务器连接错误
     */
    private onSocketError();
    /**
     * 收到服务器消息
     * @param e
     */
    private onReceiveMessage(e);
    /**
     * 初始化服务区地址
     * @param host IP
     * @param port 端口
     * @param msg 消息发送接受处理类
     */
    initServer(host: string, port: any, useSSL: boolean, msg: BaseMsg, needReconnect?: boolean): void;
    /**
     * 开始Socket连接
     */
    connect(): void;
    /**
     * 重新连接
     */
    reconnect(): void;
    /**
     * 发送消息到服务器
     * @param msg
     */
    send(msg: any): void;
    /**
     * 关闭Socket连接
     */
    close(): void;
    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
    isConnecting(): boolean;
    /**
     * Socket是否已经连接过
     * @returns {boolean}
     */
    isConnected(): boolean;
    /**
     * Debug信息
     * @param str
     */
    private debugInfo(str);
}
/**
 * Created by yangsong on 2014/11/25.
 * Socket使用常量
 */
declare class SocketConst {
    /**
     * Socket已经连接上
     * @type {string}
     */
    static SOCKET_CONNECT: string;
    /**
     * Socket重新连接上
     * @type {string}
     */
    static SOCKET_RECONNECT: string;
    /**
     * Socket开始重新连接上
     * @type {string}
     */
    static SOCKET_START_RECONNECT: string;
    /**
     * Socket已关闭
     * @type {string}
     */
    static SOCKET_CLOSE: string;
    static SOCKET_DATA: string;
    /**
     * Socket不能连接上
     * @type {string}
     */
    static SOCKET_NOCONNECT: string;
    /**
     * Socketdebug的消息
     * @type {string}
     */
    static SOCKET_DEBUG_INFO: string;
}
declare class ThemeAdapterWx implements eui.IThemeAdapter {
    getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void;
}
declare var generateEUI: {
    paths: string[];
    skins: any;
};
/**
 * Created by yangsong on 15-3-20.
 */
declare class UTFMsgByJson extends UTFMsg {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 消息解析
     * @param msg
     */
    decode(msg: any): any;
    /**
     * 消息封装
     * @param msg
     */
    encode(msg: any): any;
}
declare module particle {
    class GravityParticle extends Particle {
        startX: number;
        startY: number;
        velocityX: number;
        velocityY: number;
        radialAcceleration: number;
        tangentialAcceleration: number;
        rotationDelta: number;
        scaleDelta: number;
        alphaDelta: number;
        reset(): void;
    }
}
declare module particle {
    class GravityParticleSystem extends ParticleSystem {
        /**
         * 表示粒子初始坐标 x 差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitterXVariance
         */
        private emitterXVariance;
        /**
         * 表示粒子初始坐标 y 差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitterYVariance
         */
        private emitterYVariance;
        /**
         * 表示粒子存活时间，单位毫秒，取值范围(0,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#lifespan
         */
        private lifespan;
        /**
         * 表示粒子存活时间差值，单位毫秒，取值范围(0,Number.MAX_VALUE]且不大于 lifespan
         * @member {number} particle.GravityParticleSystem#lifespanVariance
         */
        private lifespanVariance;
        /**
         * 表示粒子出现时大小，取值范围(0,Number.MAX_VALUE]，粒子将会在存活时间内由 startSize 慢慢变为 endSize
         * @member {number} particle.GravityParticleSystem#startSize
         */
        private startSize;
        /**
         * 表示粒子出现时大小差值，取值范围(0,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#startSizeVariance
         */
        private startSizeVariance;
        /**
         * 表示粒子消失时大小，取值范围(0,Number.MAX_VALUE]，粒子将会在存活时间内由 startSize慢慢变为 endSize
         * @member {number} particle.GravityParticleSystem#endSize
         */
        private endSize;
        /**
         * 表示粒子消失时大小差值，取值范围(0,Number.MAX_VALUE]，且不大于endSize
         * @member {number} particle.GravityParticleSystem#endSizeVariance
         */
        private endSizeVariance;
        /**
         * 表示粒子出现时的角度，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitAngle
         */
        private emitAngle;
        /**
         * 表示粒子出现时的角度差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitAngleVariance
         */
        private emitAngleVariance;
        /**
         * 表示粒子出现时旋转值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]，粒子将会在存活时间内由 startRotation 慢慢变为 endRotation
         * @member {number} particle.GravityParticleSystem#startRotation
         */
        private startRotation;
        /**
         * 表示粒子出现时旋转值差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#startRotationVariance
         */
        private startRotationVariance;
        /**
         * 表示粒子消失时旋转值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]，粒子将会在存活时间内由 startRotation 慢慢变为 endRotation
         * @member {number} particle.GravityParticleSystem#endRotation
         */
        private endRotation;
        /**
         * 表示粒子消失时旋转值差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#endRotationVariance
         */
        private endRotationVariance;
        /**
         * 表示粒子出现时速度，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#speed
         */
        private speed;
        /**
         * 表示粒子出现时速度差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#speedVariance
         */
        private speedVariance;
        /**
         * 表示粒子水平重力，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#gravityX
         */
        private gravityX;
        /**
         * 表示粒子垂直重力，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#gravityX
         */
        private gravityY;
        /**
         * 表示粒子径向加速度，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#radialAcceleration
         */
        private radialAcceleration;
        /**
         * 表示粒子径向加速度差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#radialAccelerationVariance
         */
        private radialAccelerationVariance;
        /**
         * 表示粒子切向加速度，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#tangentialAcceleration
         */
        private tangentialAcceleration;
        /**
         * 表示粒子切向加速度差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#tangentialAccelerationVariance
         */
        private tangentialAccelerationVariance;
        /**
         * 表示粒子出现时的 Alpha 透明度值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]，粒子将会在存活时间内由 startAlpha 慢慢变为 endAlpha
         * @member {number} particle.GravityParticleSystem#startAlpha
         */
        private startAlpha;
        /**
         * 表示粒子出现时的 Alpha 透明度差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#startAlphaVariance
         */
        private startAlphaVariance;
        /**
         * 表示粒子消失时的 Alpha 透明度值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]，粒子将会在存活时间内由 startAlpha 慢慢变为 endAlpha
         * @member {number} particle.GravityParticleSystem#endAlpha
         */
        private endAlpha;
        /**
         * 表示粒子消失时的 Alpha 透明度差值，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#endAlphaVariance
         */
        private endAlphaVariance;
        /**
         * 表示粒子使用的混合模式
         * @member {number} particle.GravityParticleSystem#blendMode
         */
        private particleBlendMode;
        /**
         * 是否完成解析json数据
         */
        private $init;
        constructor(texture: egret.Texture, config: any);
        start(duration?: number): void;
        setCurrentParticles(num: number): void;
        onPropertyChanges(): void;
        private parseConfig(config);
        initParticle(particle: Particle): void;
        private static getValue(base, variance);
        advanceParticle(particle: Particle, dt: number): void;
    }
}
declare class LanguageType {
    static En: string;
    static Ch: string;
}
declare class App {
    static Proto: any;
    static Language: string;
    static readonly MessageCenter: MessageCenter;
    static readonly Socket: Socket;
    static readonly Http: Http;
    static readonly TimerManager: TimerManager;
    static readonly DebugUtils: DebugUtils;
    static readonly ResourceUtils: ResourceUtils;
    static readonly ClickAnimation: ClickAnimation;
    static readonly SoundManager: SoundManager;
    static readonly ArrayUtils: ArrayUtils;
    static readonly StageUtils: StageUtils;
    static readonly CommonUtils: CommonUtils;
    static readonly DateUtils: DateUtils;
    static readonly DisplayUtils: DisplayUtils;
    static readonly RandomUtils: RandomUtils;
    static readonly RectangleUtils: RectangleUtils;
    static readonly GameWidth: number;
    static readonly GameHeight: number;
    static UserToken: string;
    static GameExpressType: number;
    static CurrChatId: string;
    static CurrGameId: number;
    static CurrGameIsAi: boolean;
    static CurrGameAiLevel: number;
    static CurrRoomId: string;
    static googleAd: any;
    static CurrPlatformUid: string;
    static IsLocal: boolean;
    static IsXiaoMi: boolean;
    static IsFaceBook: boolean;
    static IsWanba: boolean;
    static IsLiaoZhan: boolean;
}
declare class AnimationButton extends eui.Button implements eui.UIComponent {
    constructor();
    protected partAdded(partName: string, instance: any): void;
    protected childrenCreated(): void;
    protected getCurrentState(): string;
}
/**
 * 素材需要提前加载好
 * 素材命名规则：类型_数值（有类型是因为一般会同时有几种数字图片，比如大小号或不同颜色）
 * 点号素材命名：类型_dot
 * 创建BitmapNumber使用createNumPic返回DisplayObjectContainer
 * 创建好的BitmapNumber数值需要变化是调用changeNum
 * 回收使用desstroyNumPic
 *
 * Created by Saco on 2014/8/1.
 */
declare class BitmapNumber extends BaseClass {
    private _imgPool;
    private _containerPool;
    constructor();
    createNumPic(num: number, type: string): egret.DisplayObjectContainer;
    desstroyNumPic(picContainer: egret.DisplayObjectContainer): void;
    changeNum(picContainer: egret.DisplayObjectContainer, num: number, type: string): void;
    private repositionNumPic(container);
    private clearContainer(picContainer);
    private recycleBM(bm);
    private getContainer();
    private getSingleNumPic(num, type);
    private getTexture(num, type);
    private getBitmap();
}
/**
 * Created by yangsong on 15-1-14.
 * 背景音乐类
 */
declare class SoundBg extends BaseSound {
    private _currBg;
    private _currPlayTime;
    private _currSound;
    private _currSoundChannel;
    private _volume;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 静音
     */
    mute(): void;
    /**
     * 恢复音量
     */
    restoreVolume(): void;
    /**
     * 停止当前音乐
     */
    stop(): void;
    /**
     * 播放某个音乐
     * @param effectName
     */
    play(effectName: string, playTime?: number): void;
    /**
     * 播放
     * @param sound
     */
    private playSound(sound);
    /**
     * 获取当前播放时间
     */
    getPlayTime(): number;
    /**
     * 设置音量
     * @param volume
     */
    setVolume(volume: number): void;
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    loadedPlay(key: string): void;
    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    checkCanClear(key: string): boolean;
}
/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
declare class SoundEffects extends BaseSound {
    private _volume;
    private _playingEffects;
    private _cacheSoundChannel;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 播放一个音效
     * @param effectName
     */
    private _playTime;
    play(effectName: string, isReplace?: boolean, playTime?: number): void;
    private getSoundChannel(sound);
    /**
     * 播放
     * @param sound
     */
    private playSound(effectName, sound);
    /**
     * 播放完成
     */
    private onSoundComplete(event);
    /**
     * 停止某个音效
     */
    stopSound(effectName: string): void;
    /**
     * 设置音量
     * @param volume
     */
    setVolume(volume: number): void;
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    loadedPlay(key: string): void;
}
/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
declare class SoundManager extends BaseClass {
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    static CLEAR_TIME: number;
    private effect;
    private bg;
    private effectOn;
    private bgOn;
    private currBg;
    private bgVolume;
    private effectVolume;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 播放音效
     * @param effectName
     */
    playEffect(effectName: string, isReplace?: boolean, playTime?: number): void;
    /**
     * 播放背景音乐
     * @param key
     */
    playBg(bgName: string): void;
    /**
     * 暂停背景播放
     */
    private bgPlayTime;
    pauseBg(): void;
    /**
     * 重新播放背景音乐
     */
    replayBg(): void;
    /**
     * 停止背景音乐
     */
    stopBg(): void;
    /**
     * 背景静音
     */
    muteBg(): void;
    /**
     * 背景恢复音量
     */
    restoreVolumeBg(): void;
    /**
     * 停止音效
     */
    stopEffect(effectName: string): void;
    /**
     * 设置音效是否开启
     * @param $isOn
     */
    setEffectOn($isOn: boolean): void;
    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
    setBgOn($isOn: boolean): void;
    /**
     * 设置背景音乐音量
     * @param volume
     */
    setBgVolume(volume: number): void;
    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    getBgVolume(): number;
    /**
     * 设置音效音量
     * @param volume
     */
    setEffectVolume(volume: number): void;
    /**
     * 获取音效音量
     * @returns {number}
     */
    getEffectVolume(): number;
    /**
     * 背景音乐是否是开启中
     */
    readonly bgIsOn: boolean;
}
declare class EuiComponent extends eui.Component {
    /**
     * 构造函数
     */
    constructor(skinClass: any);
}
declare class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    getAsset(source: string, compFunc: Function, thisObject: any): void;
}
interface IState extends egret.IEventDispatcher {
    addToParent(parent: egret.DisplayObjectContainer, param: any): void;
    init(): void;
    show(showParam?: any): void;
    tick(advancedTime: number): void;
    close(): void;
    dispose(): void;
    next(state: string, param?: any): void;
    popup(state: string, param?: any): void;
    returnToLast(param?: any): void;
}
declare class State extends egret.DisplayObjectContainer implements IState {
    isInit: boolean;
    constructor();
    addToParent(parent: egret.DisplayObjectContainer, param: any): void;
    init(): void;
    show(showParam?: any): void;
    next(state: string, param?: any): void;
    popup(state: string, param?: any): void;
    returnToLast(param?: any): void;
    tick(advancedTime: number): void;
    close(): void;
    dispose(): void;
}
/**
 * Created by husong on 4/10/15.
 */
declare class EasyLoading {
    private static content;
    private static dbArmature;
    static init(): void;
    static showLoading(): void;
    static hideLoading(): void;
}
/**
 * Created by yangsong on 2014/11/22.
 */
declare class StateEuiAnimation extends StateEui {
    private showAnimationCallback;
    constructor(skinClass: any);
    show(): void;
    showAnimation(callBack: Function): void;
    protected doShowAnimation(callBack: Function): void;
    removeAnimation(callBack: Function): void;
    protected doRemoveAnimation(callBack: Function): void;
}
declare class StateEvent extends egret.Event {
    static NEXT: string;
    static LAST: string;
    static POPUP: string;
    static POPUPCLOSE: string;
    data: string;
    paramData: any;
    constructor(type: string, data: string, paramData: any, bubbles?: boolean, cancelable?: boolean);
}
declare class StateManager {
    private _parent;
    private _euiParent;
    private _popupParent;
    private _stateObj;
    private _curState;
    private _curStateName;
    private _prevState;
    private _prevStateName;
    private _curTime;
    private _lastTime;
    constructor(parent: egret.DisplayObjectContainer, euiParent: eui.UILayer, popupParent: eui.UILayer);
    startTick(): void;
    stopTick(): void;
    tick(advancedTime: number): boolean;
    registerState(name: string, state: IState): void;
    unregisterState(name: string): void;
    setCurStateName(name: string, showParam?: any): void;
    private addStateEvents(state);
    private removeStateEvents(state);
    private setCurState(state, stateName, showParam);
    private onPopup(e);
    private onPopupClose(e);
    private onNext(e);
    private onLast(e);
    readonly curState: IState;
    readonly curStateName: string;
}
/**
 * Created by yangsong on 15-11-4.
 */
declare class AllAsyncExecutor {
    private _callBack;
    private _callBackTarget;
    private _functions;
    private _complateNum;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 设置全部执行完成处理函数
     * @param callBack 此队列处理完成执行函数
     * @param callBackTarget 此队列处理完成执行函数所属对象
     */
    setCallBack(callBack: Function, callBackTarget: any): void;
    /**
     * 注册需要队列处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    regist($func: Function, $thisObj: any): void;
    /**
     * 开始执行
     */
    start(): void;
    /**
     * 执行完成
     */
    complate(): void;
}
/**
 * Created by Saco on 2015/9/16.
 */
declare class AnchorUtil {
    private static _propertyChange;
    private static _anchorChange;
    static init(): void;
    static setAnchorX(target: egret.DisplayObject, value: number): void;
    static setAnchorY(target: egret.DisplayObject, value: number): void;
    static setAnchor(target: egret.DisplayObject, value: number): void;
    static getAnchor(target: egret.DisplayObject): number;
    static getAnchorY(target: egret.DisplayObject): number;
    static getAnchorX(target: egret.DisplayObject): number;
    private static injectAnchor();
    private static changeAnchor(tar);
}
/**
 * Created by egret on 15-8-7.
 */
declare class ArrayUtils extends BaseClass {
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    forEach(arr: Array<any>, func: Function, funcObj: any): void;
}
declare class AssetManager {
    static dbFactory: dragonBones.EgretFactory;
    private static cacheDbs;
    private static clearCacheList(armatureName);
    static removeCacheArmature(armature: DBArmature): void;
    private static addCacheArmature(armature);
    private static printCacheListCount();
    static getBitmap(name: string, centerX?: boolean, centerY?: boolean): egret.Bitmap;
    static getSound(name: string): egret.Sound;
    static loadDBAnimation(dbNames: string[]): void;
    static removeDBAnimation(dbNames: string[]): void;
    static getDBArmature(armatureName: string): DBArmature;
    static getQuickDBArmature(armatureName: string): DBArmature;
    static changeTexture(image: egret.Bitmap, name: string): void;
    static setText(textField: egret.TextField, str: string): void;
}
/**
 * Created by yangsong on 15-8-19.
 * 平均数工具类
 */
declare class AverageUtils {
    private maxNum;
    private nums;
    private numsLen;
    private numSum;
    /**
     * 构造函数
     * @param $maxNum 参与计算的最大值
     */
    constructor($maxNum?: number);
    /**
     * 加入一个值
     * @param value
     */
    push(value: number): void;
    /**
     * 获取平均值
     * @returns {number}
     */
    getValue(): number;
    /**
     * 清空
     */
    clear(): void;
}
declare class ClickAnimation extends BaseClass {
    register(target: egret.DisplayObject): void;
    private addAnimation(target);
    private ramoveAnimation(target);
    private onClickBegin(evt);
    private onClickEnd(evt);
}
/**
 * Created by yangsong on 15-1-12.
 * 通用工具类
 */
declare class CommonUtils extends BaseClass {
    constructor();
    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    static addLableStrokeColor(lable: eui.Label, color: any, width: any): void;
    /**
     * 深度复制
     * @param _data
     */
    static copyDataHandler(obj: any): any;
    /**
     * 锁屏
     */
    static lock(): void;
    /**
     * 解屏
     */
    static unlock(): void;
    /**
     * 万字的显示
     * @param label
     * @param num
     */
    static labelIsOverLenght: (label: any, num: any) => void;
    /**
     * int64转number
     * @param obj
     * @returns {number}
     */
    static int64ToNumber(obj: any): number;
    /**
     * 获取一个字符串的hashCode值
     */
    static hashCode(str: string): number;
    /**
     * 获取一个字符串的hashCode值，>=0
     */
    static hashCodeAbs(str: string): number;
}
/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
declare class DateUtils extends BaseClass {
    constructor();
    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1:00:00:00   2:yyyy-mm-dd h:m:s    3:00:00   4:xx天前，xx小时前，xx分钟前
     * @return
     *
     */
    getFormatBySecond(second: number, type?: number): string;
    private getFormatBySecond1(t?);
    private getFormatBySecond3(t?);
    private getFormatBySecond2(time);
    private getFormatBySecond4(time);
    private getFormatBySecond5(time);
}
/**
 * Created by yangsong on 2014/11/23.
 * Debug调试工具
 */
declare class DebugUtils extends BaseClass {
    private _isOpen;
    private _startTimes;
    private _threshold;
    constructor();
    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    isOpen(flag: boolean): void;
    /**
     * 是否是调试模式
     * @returns {boolean}
     */
    readonly isDebug: boolean;
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    start(key: string): void;
    /**
     * 停止
     *
     */
    stop(key: any): number;
    /**
     * 设置时间间隔阈值
     * @param value
     */
    setThreshold(value: number): void;
}
/**
 * Created by Saco on 2014/8/2.
 */
declare class DelayOptManager extends BaseClass {
    private TIME_THRESHOLD;
    private _delayOpts;
    constructor();
    addDelayOptFunction(thisObj: any, fun: Function, funPara?: any, callBack?: Function, para?: any): void;
    clear(): void;
    stop(): void;
    private runCachedFun(f);
}
/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
declare class DisplayUtils extends BaseClass {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    createBitmap(resName: string): egret.Bitmap;
    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {egret.Bitmap}
     */
    createEuiImage(resName: string): eui.Image;
    /**
     * 从父级移除child
     * @param child
     */
    removeFromParent(child: egret.DisplayObject): void;
    /**
     * quickAddChild
     */
    quickAddChild(parent: egret.DisplayObjectContainer, child: egret.DisplayObject): void;
    /**
     * quickRemoveChild
     */
    quickRemoveChild(child: egret.DisplayObject): void;
}
/**
 * Created by yangsong on 2014/12/3.
 * 各种效果工具类
 */
declare class EffectUtils extends BaseClass {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 类似mac上图标上下抖动的效果
     * @param obj 要抖动的对象，使用
     * @param initY 要抖动的对象的初始Y值，原始位置
     * @example eval(macIconShake("this.btnIcon", 100));
     * @returns {string} 返回的是一个要执行代码的字符串，通过eval执行
     */
    macIconShake(obj: string, initY: number): string;
    /**
     * 开始闪烁
     * @param obj
     */
    startFlicker(obj: egret.DisplayObject, alphaTime: number): void;
    /**
     * 停止闪烁
     * @param obj
     */
    stopFlicker(obj: egret.DisplayObject): void;
}
/**
 * 性别 设置
 */
declare class GameCenterGetSexIcon {
    private static boyIcon;
    private static girlIcon;
    static getSexIconSource(sexType: number): string;
}
/**
 * Created by Saco on 2014/12/1.
 */
declare class LocationProperty {
    static getPara(paraName: string, paraUrl?: string): string;
    static setProperty(paraName: string, paraValue: string, paraUrl?: string): string;
    static hasProperty(paraName: string, paraUrl?: string): boolean;
}
/**
 * Created by yangsong on 2014/11/22.
 */
declare class Log {
    /**
     * Debug_Log
     * @param messsage 内容
     * @constructor
     */
    static trace(...optionalParams: any[]): void;
}
declare enum reserveDecimal {
    floor = 0,
    ceil = 1,
    round = 2,
}
declare class MathUtils {
    /**
     * 保留小数
     * @param targetNum 要进行转化的小数
     * @param digits 保留小数位数
     * @example let a =MathUtil.reserveDecimal("0.1111111111",2);
     * @returns {string} 返回的是一个小数,0.1
     */
    static reserveDecimal(targetNum: number, digits: number, type?: reserveDecimal): number;
}
/**
 * Created by yangsong on 2014/11/22.
 * 对象池类
 */
declare class ObjectPool {
    private static _content;
    private _objs;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 放回一个对象
     * @param obj
     */
    pushObj(obj: any): void;
    /**
     * 取出一个对象
     * @returns {*}
     */
    popObj(): any;
    /**
     * 清除所有缓存对象
     */
    clear(): void;
    /**
     * 取出一个对象
     * @param classZ Class
     * @return Object
     *
     */
    static pop(classZ: any, classKey: string, ...args: any[]): any;
    /**
     * 取出一个对象
     * @param refKey Class
     * @param extraKey 标识值
     * @returns {any}
     */
    static popWithExtraKey(refKey: any, extraKey: any): any;
    /**
     * 放入一个对象
     * @param obj
     *
     */
    static push(obj: any): boolean;
    /**
     * 清除所有对象
     */
    static clear(): void;
    /**
     * 清除某一类对象
     * @param classZ Class
     * @param clearFuncName 清除对象需要执行的函数
     */
    static clearClass(classKey: string, clearFuncName?: string): void;
    /**
     * 缓存中对象统一执行一个函数
     * @param classZ Class
     * @param dealFuncName 要执行的函数名称
     */
    static dealFunc(refKey: string, dealFuncName: string): void;
}
/**
 * Created by yangsong on 15-8-19.
 * 队列处理
 */
declare class QueueExecutor {
    private _callBack;
    private _callBackTarget;
    private _functions;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 设置全部执行完成处理函数
     * @param callBack 此队列处理完成执行函数
     * @param callBackTarget 此队列处理完成执行函数所属对象
     */
    setCallBack(callBack: Function, callBackTarget: any): void;
    /**
     * 注册需要队列处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    regist($func: Function, $thisObj: any): void;
    /**
     * 开始执行
     */
    start(): void;
    /**
     * 执行下一个
     */
    next(): void;
}
/**
 * Created by yangsong on 2014/11/23.
 */
declare class RandomUtils extends BaseClass {
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    limit($from: number, $end: number): number;
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    limitInteger($from: number, $end: number): number;
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    randomArray(arr: Array<any>): any;
}
/**
 * 矩形工具类
 */
declare class RectangleUtils extends BaseClass {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 判定两个矩形是否相交
     */
    intersects(a: egret.Rectangle, b: egret.Rectangle): boolean;
}
/**
 * Created by yangsong on 15-2-11.
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
declare class ResourceUtils extends BaseClass {
    private _configs;
    private _onConfigComplete;
    private _onConfigCompleteTarget;
    private _groups;
    private _groupIndex;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    addConfig(jsonPath: string, filePath: string): void;
    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    loadConfig($onConfigComplete: Function, $onConfigCompleteTarget: any): void;
    /**
     * 加载
     */
    private loadNextConfig();
    /**
     * 加载完成
     * @param event
     */
    private onConfigCompleteHandle(event);
    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     * @param $onResourceLoadError 资源加载失败监听函数
     */
    loadGroup($groupName: string, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any, $onResourceLoadError?: Function): void;
    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     * @param $onResourceLoadError 资源加载失败监听函数
     */
    loadGroups($groupName: string, $subGroups: Array<any>, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any, $onResourceLoadError?: Function): void;
    /**
     * 静默加载
     * @param $groupName 资源组名称
     * @param $groupName 所包含的组名称或者key名称数组
     */
    pilfererLoadGroup($groupName: string, $subGroups?: Array<any>): void;
    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(event);
    /**
     * 资源组加载进度
     */
    private onResourceLoadProgress(event);
    /**
     * 资源组加载失败
     * @param event
     */
    private onResourceLoadError(event);
    /**
     * 动态创建加载组
     * @param {string} $groupName
     * @param {string[]} resKeys
     */
    createGroup($groupName: string, resKeys: string[]): void;
    /**
     * 动态创建Resource
     * @param {string} resKey
     * @param {string} resType
     * @param {string} resUrl
     */
    createResource(resKey: string, resType: string, resUrl: string): void;
}
/**
 * Created by Channing on 2014/12/6.
 * 震动
 */
declare class ShockUtils extends BaseClass {
    constructor();
    MAP: number;
    SPRITE: number;
    private mapPoss;
    private spritePoss;
    private _shockPoss;
    private _shockLength;
    private _shockCount;
    private _target;
    private _rx;
    private _ry;
    private _type;
    private _repeatCount;
    destroy(): void;
    shock(type?: number, target?: egret.DisplayObject, repeatCount?: number): void;
    private start(num?);
    private stop();
    private onShockEnter(time);
    repeatCount: number;
}
/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
declare class StageUtils extends BaseClass {
    private static _uiStage;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    getHeight(): number;
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    getWidth(): number;
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    setTouchChildren(value: boolean): void;
    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    setMaxTouches(value: number): void;
    /**
     * 设置帧频
     * @param value
     */
    setFrameRate(value: number): void;
    /**
     * 设置适配方式
     * @param value
     */
    setScaleMode(value: string): void;
    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    getStage(): egret.Stage;
    /**
     * 获取唯一UIStage
     * @returns {eui.UILayer}
     */
    getUIStage(): eui.UILayer;
    /**
     * 开启全屏适配方案
     */
    private designWidth;
    private designHeight;
    private resizeCallback;
    startFullscreenAdaptation(designWidth: number, designHeight: number, resizeCallback: Function): void;
    private stageOnResize();
}
/**
 * Created by yangsong on 2014/11/23.
 * Timer管理器
 */
declare class TimerManager extends BaseClass {
    private _handlers;
    private _delHandlers;
    private _currTime;
    private _currFrame;
    private _count;
    private _timeScale;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 设置时间参数
     * @param timeScale
     */
    setTimeScale(timeScale: number): void;
    /**
     * 每帧执行函数
     * @param frameTime
     */
    private onEnterFrame();
    private create(useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    /**
     *
     * 定时执行
     * @param delay 执行间隔:毫秒
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    doTimer(delay: number, repeatCount: number, method: Function, methodObj: any, complateMethod?: Function, complateMethodObj?: any): void;
    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    doFrame(delay: number, repeatCount: number, method: Function, methodObj: any, complateMethod?: Function, complateMethodObj?: any): void;
    /**
     * 定时器执行数量
     * @return
     *
     */
    readonly count: number;
    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
    remove(method: Function, methodObj: any): void;
    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
    removeAll(methodObj: any): void;
    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
    isExists(method: Function, methodObj: any): boolean;
}
declare class TimerHandler {
    /**执行间隔*/
    delay: number;
    /**是否重复执行*/
    repeat: boolean;
    /**重复执行次数*/
    repeatCount: number;
    /**是否用帧率*/
    userFrame: boolean;
    /**执行时间*/
    exeTime: number;
    /**处理函数*/
    method: Function;
    /**处理函数所属对象*/
    methodObj: any;
    /**完成处理函数*/
    complateMethod: Function;
    /**完成处理函数所属对象*/
    complateMethodObj: any;
    /**上次的执行时间*/
    dealTime: number;
    /**清理*/
    clear(): void;
}
