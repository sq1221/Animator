class FaceBookPlatform implements IPlatform {

    public platformData: any;
    public static gameData: {
        video: string,
        InterstitialAd: string,
        image: string,
        leaderboard: string
    };

    public constructor() {
        this.init();
    }

    private init(): void {
        App.MessageCenter.addListener("showRewardedVideo", () => {
            FaceBookPlatform.RewardedVideo();
        }, this);
        App.MessageCenter.addListener("showInterstitialAd", () => {
            FaceBookPlatform.InterstitialAd();
        }, this);
        //初始化统计
        App.CurrGameId = parseInt(window["egretGid"]);
        FaceBookPlatform.loader = new egret.URLLoader();
        FaceBookPlatform.loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        FaceBookPlatform.loader.addEventListener(egret.IOErrorEvent.IO_ERROR, FaceBookPlatform.onLoadError, this);
    }

    /**
     * 开始游戏之前必须调用  FBInstant.startGameAsync()，不然后面有些方法无法调用
     */
    public login(callBack: Function): void {
        FBInstant.startGameAsync().then(() => {
            egret.log("start game");
            //读取faceBook参数
            let userId = FBInstant.player.getID();
            let userName = FBInstant.player.getName();
            let userPic = FBInstant.player.getPhoto();
            this.platformData = {
                userId: userId,
                userName: userName,
                userPic: userPic,
                userSex: 1,

                otherUserId: null,
                otherUserName: null,
                otherUserPic: null,
                otherUserSex: null,

                roomId: null,

                isAi: null,
                aiLevel: null,
            }
            // console.log(JSON.stringify(this.platformData));

            //调用Facebook资源加载完成
            FBInstant.setLoadingProgress(100);

            callBack(true);
            FBInstant.onPause(function () {
                console.log('Pause event was triggered!');
                App.MessageCenter.dispatch(EventMessage.pauseMessage);
            })
        })
    }

    //背景音乐特殊处理
    public dealBgMusic(): void {
    }

    // 游戏结算通知小米平台前端  "0":无胜负结果,"1":负,"2":平,"3":胜
    public gameOver(value: number): void {
    }

    static getFacebookData() {
        FaceBookPlatform.gameData = RES.getRes("FacebookConfig_json");
    }
    /**
     * 邀请代码，在ios会呼出浮动菜单时间线和messager，安卓和网页是一部分，Facebook只会分享到时间线，messager只会分享到messager里面
     */
    public invite(callBack: Function): void {
        if (!FaceBookPlatform.gameData)
            FaceBookPlatform.getFacebookData();
        egret.log("invite");
        let inviteData: FBInstant.SharePayload = {
            intent: "INVITE",
            text: `${this.platformData.userName} is waiting for you`,
            image: FaceBookPlatform.gameData.image,
            data: {
                roomId: this.platformData.userId,
                userId: this.platformData.userId,
                userName: this.platformData.userName,
                userPic: this.platformData.userPic,
                userSex: this.platformData.userSex,
            }
        }

        this.platformData.roomId = this.platformData.userId;
        App.CurrRoomId = this.platformData.userId;
        FBInstant.shareAsync(inviteData).then(
            () => {
                egret.log("邀请成功")
                GameQuickMatchView.isInvite = true;
                callBack();
            }
        );
    }

    /**
    * 邀请代码，在ios会呼出浮动菜单时间线和messager，安卓和网页是一部分，Facebook只会分享到时间线，messager只会分享到messager里面
    *shareText:分享的文本，image分享的图片，base64格式，callback分享成功回调
    */
    public static share(shareText: string, image: string, callback: Function): void {
        egret.log("SHARE");
        let shareData: FBInstant.SharePayload = {
            intent: "SHARE",
            text: shareText,
            image: image,
        }
        FBInstant.shareAsync(shareData).then(
            () => {
                egret.log("分享成功")
                callback();
            }
        );
    }

    /**
     * 奖励视频广告,
     * 广告只会发请求，不一定呈现，涉及到Facebook的填充规则
     */
    static RewardedVideo() {
        if (!FaceBookPlatform.gameData)
            FaceBookPlatform.getFacebookData();
        let ad: any;
        FBInstant.getRewardedVideoAsync(this.gameData.video).then(function (ead) {
            // egret.log(ead, ead.getPlacementID())
            ad = ead
            return ad.loadAsync();
        }).then(function () {
            return ad.showAsync();
        }).then(function () {
            // Ad watched
        });
    }
    /**
    * 插屏式广告
    */
    static InterstitialAd() {
        if (!FaceBookPlatform.gameData)
            FaceBookPlatform.getFacebookData();
        let ad: any;
        FBInstant.getInterstitialAdAsync(this.gameData.InterstitialAd).then(function (ead) {
            // egret.log(ead, ead.getPlacementID())
            ad = ead
            return ad.loadAsync();
        }).then(function () {
            // Ad loaded
            return ad.showAsync();
        }).then(function () {
            // Ad watched
        });
    }
    /**
     * 保存到排行榜
     * @param score  分数
     */
    static setLeaderboardScore(score: number, callback: Function) {
        if (!FaceBookPlatform.gameData)
            FaceBookPlatform.getFacebookData();
        FBInstant.getLeaderboardAsync(FaceBookPlatform.gameData.leaderboard).then(leaderboard => {
            return leaderboard.setScoreAsync(score, "");
        }).then((entry) => {
            callback();
        });
        this.addRank(score);
    }
    /**
   * 读取自己排行榜分数
   */
    static getLeaderBoardScore(callback: (entry: FBInstant.LeaderboardEntry) => void) {
        if (!FaceBookPlatform.gameData)
            FaceBookPlatform.getFacebookData();
        FBInstant.getLeaderboardAsync(FaceBookPlatform.gameData.leaderboard)
            .then(function (leaderboard) {
                return leaderboard.getPlayerEntryAsync();
            })
            .then(function (entry) {
                callback(entry)
            });
    }
    /**
     * @param rankNum 获得的排名位数
     * @param offset 和第一名的偏差
     * 5，3  获取的就是6，7，8 排名
     */
    static getTopRank(callback: Function, rankNum = 10, offset = 0) {
        if (!FaceBookPlatform.gameData)
            FaceBookPlatform.getFacebookData();
        FBInstant.getLeaderboardAsync(FaceBookPlatform.gameData.leaderboard)
            .then(function (leaderboard) {
                return leaderboard.getEntriesAsync(rankNum, offset);
            })
            .then(function (entries: FBInstant.LeaderboardEntry) {
                callback(entries);
            });
    }
    /**
     * 用Facebook存储个人的信息
     * @param score 游戏内比分
     * @param winRounds 连胜数目
     */
    static setUserData(score: number, winRounds: number) {
        FBInstant.player
            .setDataAsync({
                score: score,
                winRounds: winRounds,
            })
            .then(function () {
                // console.log('data is set');
            });
    }
    /**
     * 获取个人的最好分数和连胜纪录，历史最佳推荐使用排行榜去做，不然要对游戏进行分类管理
     */
    static getUserData(callback: Function) {
        FBInstant.player
            .getDataAsync(['score', 'winRounds'])
            .then(function (data) {
                // console.log('data is loaded');
                callback(data);
            });
    }
    loaded() {

    }
    static getFriend() {
        FBInstant.player.getConnectedPlayersAsync()
            .then((players) => {
                console.log(players.map(function (player) {
                    return {
                        id: player.getID(),
                        name: player.getName(),
                        photo: player.getPhoto()
                    }
                }));
                this.getRank(players);
            });
    }

    static match() {
        FBInstant.checkCanPlayerMatchAsync().then(canMatch => {
            if (canMatch) {
                FBInstant.matchPlayerAsync(null, true).then((value) => {
                    console.log(FBInstant.context.getID());
                    // 3456
                    console.log("88888888888888888888" + value)
                });
            } else {
                console.log("Donot support to match");
            }
        });
    }
    /** 
     * 链接自己服务器的排行榜，增加数据
     */
    private static url = "https://api-fb.egret.com/api.php";
    private static loader: egret.URLLoader;
    static addRank(score: number) {
        let request = new egret.URLRequest(this.url);
        var paramStr = `a=addRank&gameId=${App.CurrGameId}&id=${Platform.curPlatform.platformData.userId}&score=${score}`;
        var variables: egret.URLVariables = new egret.URLVariables(paramStr);
        request.data = variables;
        this.loader.load(request);
    }
    /** 
     * 链接自己服务器的排行榜，获取
     */
    static getRank(friends: FBInstant.ConnectedPlayer[]) {
        let ids = [];
        let players: { id: string, name: string, head: string, des?: string }[] = [];
        for (let player of friends) {
            ids.push(player.getID())
            players.push({ id: player.getID(), name: player.getName(), head: player.getPhoto() });
        }

        ids.push(Platform.curPlatform.platformData.userId);
        players.push({
            id: Platform.curPlatform.platformData.userId,
            name: Platform.curPlatform.platformData.userName,
            head: Platform.curPlatform.platformData.userPic
        });
        let url = this.url + `?a=getRank&gameId=${App.CurrGameId}&ids=[${ids.toString()}]`;
        let request = new egret.URLRequest(url);
        this.loader.load(request);


        let eventDataCall = (event: egret.Event) => {
            this.loader.removeEventListener(egret.Event.COMPLETE, eventDataCall, this)
            let rankPlayers: { id: string, name: string, head: string, des: string }[] = [];
            let loadData = JSON.parse(this.loader.data);
            for (let player of players) {
                if (loadData["r"][player.id])
                    rankPlayers.push({
                        id: player.id, name: player.name, head: player.head, des: loadData["r"][player.id].score
                    })
            }
            if (Game.getInstance().stateManager.curState["showRank"]) {
                //升序
                rankPlayers.sort((a, b) => {
                    return parseInt(a["des"]) - parseInt(b["des"]);
                })
                //降序
                // players.sort((a, b) => {
                //     return b["des"] - a["des"];
                // })
                Game.getInstance().stateManager.curState["showRank"](rankPlayers);
            }
        }
        this.loader.addEventListener(egret.Event.COMPLETE, eventDataCall, this);
    }
    private static onLoadError(): void {
        console.log("onLoadError");
    }
}