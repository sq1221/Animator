class Platform {
    public static Local: number = 0;
    public static XiaoMi: number = 1;
    public static FaceBook: number = 2;
    public static Wanba: number = 3;
    public static XiaoMiGame: number = 4;
    public static LiaoZhan: number = 6;
    public static GameSLL: number = 7;
    public static Channel: number = 8;
    public static MeiTu: number = 9;
    public static LiaoZhanAbroad: number = 11;
    public static LiaoZhanTest: number = 12;

    public static curPlatformID: number = Platform.LiaoZhanTest;
    public static curPlatform: IPlatform;

    public static initPlatform(platformID: number): void {
        Platform.curPlatformID = platformID;
        App.Language = LanguageType.Ch;
        switch (Platform.curPlatformID) {
            case Platform.Local:
                Platform.curPlatform = new LocalPlatform()
                break;
            case Platform.XiaoMi:
                Platform.curPlatform = new XiaoMiPlatform();
                break;
            case Platform.FaceBook:
                Platform.curPlatform = new FaceBookPlatform();
                App.Language = LanguageType.En;
                break;
            case Platform.Wanba:
                Platform.curPlatform = new WanbaPlatform();
                break;
            case Platform.XiaoMiGame:
                Platform.curPlatform = new XiaoMiGamePlatform();
                break;
            case Platform.LiaoZhan:
                Platform.curPlatform = new LiaoZhanPlatform();
                break;
            case Platform.GameSLL:
                Platform.curPlatform = new GameSLLPlatform();
                break;
            case Platform.Channel:
                Platform.curPlatform = new ChannelPlatform();
                break;
            case Platform.MeiTu:
                Platform.curPlatform = new MeiTuPlatform();
                break;
            case Platform.LiaoZhanAbroad:
                Platform.curPlatform = new LiaoZhanAbroadPlatform();
                break;
            case Platform.LiaoZhanTest:
                Platform.curPlatform = new LiaoZhanTestPlatform();
                break;
        }

        // 平台
        App.IsLocal = Platform.curPlatformID == Platform.Local;
        App.IsXiaoMi = Platform.curPlatformID == Platform.XiaoMi;
        App.IsFaceBook = Platform.curPlatformID == Platform.FaceBook;
        App.IsWanba = Platform.curPlatformID == Platform.Wanba || Platform.curPlatformID == Platform.GameSLL || Platform.curPlatformID == Platform.Channel || Platform.curPlatformID == Platform.MeiTu;
        App.IsLiaoZhan = Platform.curPlatformID == Platform.LiaoZhan || Platform.curPlatformID == Platform.LiaoZhanAbroad || Platform.curPlatformID == Platform.LiaoZhanTest;
        App.CurrPlatformUid = platformID.toString();
    }
}