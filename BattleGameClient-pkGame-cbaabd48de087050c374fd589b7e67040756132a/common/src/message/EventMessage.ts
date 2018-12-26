class EventMessage {
    static GameLeave = "GameLeave";
    static GameGiveUp = "GameGiveUp";
    static gameCloseGiveUp = "gameCloseGiveUp";
    static GameExpress = "GameExpress";
    static GameSendExpress = "GameSendExpress";
    static ReddotChange = "reddotChange";
    static ChangeAvatar = "changeAvatar";
    static WechatAppShow = "WechatAppShow";
    static WechatShareSuccess = "WechatShareSuccess";
    static ChatListChange = "ChatListChange";
    static gameResultLeave = "gameResultLeave";
    static OpenChatRoomView = "OpenChatRoomView";
    static OpenHomePageView = "OpenHomePageView";
    static gameCloseExpress = "gameCloseExpress";
    static GameGetSkinView = "GameGetSkinView";
    static MoneyChange = "MoneyChange";
    static ResumeDanmu = "ResumeDanmu";
    static BarrageBtnPos = "BarrageBtnPos";
    static GameSureSelect = "GameSureSelect";
    static HomePageViewData = "HomePageViewData";
    /**
    * 发送游戏结算分数出来，排行榜使用
    */
    public static leaderboardSetScore = "leaderboardSetScore";
    /**
    * 发送暂停消息到游戏中，各游戏自己监听消息实现暂停的处理
    */
    public static pauseMessage = "pauseMessage";


    static SendGameResultC2S = "SendGameResultC2S";
    static SendGameEventC2S = "SendGameEventC2S";
    static ReceiveGameEventS2C = "ReceiveGameEventS2C";
    static ReceiveGameResultS2C = "ReceiveGameResultS2C";
    static AddErrQuestionC2S = "AddErrQuestionC2S";
    static GetQuestionsC2S = "GetQuestionsC2S";
    static GetDataC2S = "GetDataC2S";
}