class ProxyHttp {
    //当前平台
    private static platformId: number;

    /**
     * 初始化
     */
    public static init(serverUrl: string, platformId: number): void {
        this.platformId = platformId;
        App.Http.initServer(serverUrl);
    }

    //请求数据
    private static request(type: string, param?: any, callBack?: Function): void {
        var variables: egret.URLVariables = this.getURLVariables(type, param);
        App.Http.send(type, variables, callBack);
    }

    /**
	 * 转换数据格式
	 * @param	t_type
	 * @param	...args
	 * @return
	 */
    private static getURLVariables(type: string, param: any): egret.URLVariables {
        var typeArr: Array<any> = type.split(".");
        var paramObj: any = {};
        paramObj["mod"] = typeArr[0];
        paramObj["do"] = typeArr[1];
        if (param != null) {
            paramObj["p"] = param;
        }

        var paramStr: string = JSON.stringify(paramObj);
        var variables: egret.URLVariables = new egret.URLVariables("data=" + paramStr + "&h=" + App.UserToken);
        return variables;
    }

    //获取平台名称
    private static getPlatformName(): string {
        switch (this.platformId) {
            case 0:
                return "egret";
            case 1:
                return "baiwan";
            case 2:
                return "facebook";
            case 3:
                return "wanba";
            case 4:
                return "xiaoMiGame";
            case 6:
                return "liaoZhan"
            case 7:
                return "gameSLL"
            case 8:
                return "channel"
            case 9:
                return "meitu"
            case 11:
                return "liaoZhanAbroad"
            case 12:
                return "liaoZhanTest"
        }
        return "";
    }

    //------------------------------------以下为业务逻辑代码--------------------------------------//

    private static Gate_getGameServer: string = "Gate.getGameServer";
    private static Gate_getQuestions: string = "Gate.getQuestions";
    private static Gate_getData: string = "Gate.getData";

    /**
     * 获取服务器ip & post
     */
    public static getGameServer(roomId: string, callBack: Function): void {
        var paramObj: any = {
            roomId: roomId,
            platform: this.getPlatformName()
        };
        this.request(this.Gate_getGameServer, paramObj, callBack);
    }

    /**
     * 获取答题数据
     */
    public static getQuestions(roomId: string, callBack: Function): void {
        var paramObj: any = {
            roomId: roomId,
            platform: this.getPlatformName()
        };
        this.request(this.Gate_getQuestions, paramObj, callBack);
    }

    /**
     * 获取数据
     */
    public static getData(gameId: number, callBack: Function): void {
        var paramObj: any = {
            gameId: gameId,
            platform: this.getPlatformName()
        };
        this.request(this.Gate_getData, paramObj, callBack);
    }

    /**
     * 微信图片转为Base64
     */
    public static wxImgToBase64(imgUrl: string, callBack: Function): void {
    }
}