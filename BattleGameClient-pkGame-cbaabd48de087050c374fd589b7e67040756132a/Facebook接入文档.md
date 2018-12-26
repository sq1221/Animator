## Facebook接入文档 ##
**初始化**

    FBInstant.initializeAsync().then(function () {
            egret.log("getLocale:", FBInstant.getLocale());
            egret.log("getPlatform:", FBInstant.getPlatform());
            egret.log("getSDKVersion", FBInstant.getSDKVersion());
            egret.log("getSupportedAPIs", FBInstant.getSupportedAPIs());
            egret.log("getEntryPointData", FBInstant.getEntryPointData());
    })
    
必须执行的，初始化FaceBook


**开始**

	FBInstant.startGameAsync().then(()=>{
		//开始自己的游戏逻辑
	})

开始游戏之前必须调用 FBInstant.startGameAsync()，不然后面有些方法无法调用

**资源加载**

	//调用Facebook资源加载完成
	FBInstant.setLoadingProgress(number)

**暂停**

	//FaceBook对暂停的支持
	FBInstant.onPause(function () {
    	console.log('Pause event was triggered!');
	})

**广告**

*奖励视频广告*

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

注意
在getRewardedVideoAsync（对应的游戏广告id），必须是对应的，要不无法显示，
如果为了优化，可以考虑直接先ad.loadAsync()加载，用的时候直接播放再加载下一个

*插屏式广告*

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

注意
在getInterstitialAdAsync（对应的游戏广告id），必须是对应的，要不无法显示，
如果为了优化，可以考虑直接先ad.loadAsync()加载，用的时候直接播放再加载下一个


**分享和邀请**

*邀请*

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
所有参数必须齐全，否则无法使用image是base64的字符串


通过邀请分享打开的游戏，可以通过下面访问到SharePayload.Data的内容

  	let entryPointData = FBInstant.getEntryPointData();

*分享*

	/**
    * 分享代码，在ios会呼出浮动菜单时间线和messager，安卓和网页是一部分，Facebook只会分享到时间线，messager只会分享到messager里面
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
所有参数必须齐全，否则无法使用



**全服排行榜**

*保存自己的分数*

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
    }
注意
FBInstant.getLeaderboardAsync(对应的排行版名字)
排行榜名字到Facebook开发之平台设置。会根据设置的内容自动选择是否上榜或是刷新分数

*读取自己的分数*

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

*读取排名*

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
返回的都是FBInstant.LeaderboardEntry,然后再for遍历调用其方法就可以获取里面的数据

*存储自己的额外信息*

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
自己定义好存储内容，读取也是按照内容读取

*读取自己的额外信息*

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

*获取好友信息*

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
注意
获取的是登陆过这款游戏的好友，也就是一开始登陆的时候提示的那个

**匹配和进入群组**

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
注意
这个进入群组在sdk6.1之前全部是和FaceBook的匹配写死的，所有对于用户少的游戏很难使用，不知道后面会不会拆开。
调用此接口，会在游戏开始的时候，弹出悬浮菜单询问是否匹配，匹配成功进入群组，用户少的时候不能使用。

**好友排行榜**

*存储成绩信息*

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
链接自己写的服务器，存储id和成绩。

*读取排行榜信息*

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
返回的是一个数组

由于这个好友排行榜是依托于Facebook的好友列表的，所以要使用大致分为下面几步

 -  获取Facebook的好友信息
 -  将自己和好友的id存为一个数组传到对应的接口。
 -  会得到一个{id，score}的数组，在进行拼接数据，将对应的名字和头像与id匹配存起来
 -  根据游戏对成绩进行升序或是降序排列。
 -  最后调用接口显示
 
	 	Game.getInstance().stateManager.curState["showRank"](rankPlayers);

