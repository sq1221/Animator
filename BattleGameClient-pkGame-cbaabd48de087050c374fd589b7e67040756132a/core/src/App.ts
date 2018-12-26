class LanguageType {
    static En = "_En";
    static Ch = "";
}
class App {
    public static Proto = null;
    public static Language = LanguageType.Ch;

    public static get MessageCenter() {
        return MessageCenter.getInstance();
    }

    public static get Socket(): Socket {
        return Socket.getInstance();
    }

    public static get Http(): Http {
        return Http.getInstance();
    }

    public static get TimerManager(): TimerManager {
        return TimerManager.getInstance();
    }

    public static get DebugUtils(): DebugUtils {
        return DebugUtils.getInstance();
    }

    public static get ResourceUtils(): ResourceUtils {
        return ResourceUtils.getInstance();
    }

    public static get ClickAnimation(): ClickAnimation {
        return ClickAnimation.getInstance();
    }

    public static get SoundManager(): SoundManager {
        return SoundManager.getInstance();
    }

    public static get ArrayUtils(): ArrayUtils {
        return ArrayUtils.getInstance();
    }

    public static get StageUtils(): StageUtils {
        return StageUtils.getInstance();
    }

    public static get CommonUtils(): CommonUtils {
        return CommonUtils.getInstance();
    }

    public static get DateUtils(): DateUtils {
        return DateUtils.getInstance();
    }

    public static get DisplayUtils(): DisplayUtils {
        return DisplayUtils.getInstance();
    }

    public static get RandomUtils(): RandomUtils {
        return RandomUtils.getInstance();
    }

    public static get RectangleUtils(): RectangleUtils {
        return RectangleUtils.getInstance();
    }

    public static get GameWidth(): number {
        return App.StageUtils.getWidth();
    }

    public static get GameHeight(): number {
        return App.StageUtils.getHeight();
    }


    //-------------------------以下为全局数据存储-------------------------------//

    public static UserToken: string = "";
    public static GameExpressType: number;// 表情类型
    public static CurrChatId: string = "";
    public static CurrGameId: number = 1;
    public static CurrGameIsAi: boolean = false;
    public static CurrGameAiLevel: number = 3;// 当前游戏AI 等级
    public static CurrRoomId: string = "";
    public static googleAd: any;

    public static CurrPlatformUid: string = "";

    public static IsLocal: boolean = false;// 本地Local
    public static IsXiaoMi: boolean = false;// 小米
    public static IsFaceBook: boolean = false;// FaceBook
    public static IsWanba: boolean = false;// 玩吧


    public static IsLiaoZhan: boolean = false;//撩站
}


