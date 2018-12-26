class Statistics {
	private static url = "https://gameanalysis.egret.com/pk/stat.php";
	private static loader: egret.URLLoader;
	private static platform: string;
	private static chanId: string = "";

	/**
	 * 初始化
	 */
	public static init(platform: string, url = "https://gameanalysis.egret.com/pk/stat.php", chanId = "") {
		this.platform = platform;
		if (chanId != "" && chanId != undefined && chanId != null) {
			this.chanId = chanId;
		}
		console.log("chanId", chanId);
		this.url = url;
		//http初始化
		this.loader = new egret.URLLoader();
		this.loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
		this.loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
	}

	/**
	 * 打开游戏
	 */
	public static open() {
		let data = {
			"act": "open",
			"gameId": App.CurrGameId,
			"roomId": App.CurrRoomId,
			"platform": this.platform,
			"platUid": App.CurrPlatformUid,
			"chanId": this.chanId
		}
		this.sendData(data);
	}

	/**
	 * 登录成功
	 */
	public static loginSccess() {
		let data = {
			"act": "login",
			"gameId": App.CurrGameId,
			"roomId": App.CurrRoomId,
			"platform": this.platform,
			"platUid": App.CurrPlatformUid,

			"uId": DataCenter.instance.user.id,
			"sex": DataCenter.instance.user.sex,
			"name": DataCenter.instance.user.name,
			"uuid": DataCenter.instance.user.uuid,
			"chanId": this.chanId
		}
		this.sendData(data);
	}

	/**
	 * 游戏结束
	 */
	public static gameEnd() {
		let data = {
			"act": "end",
			"gameId": App.CurrGameId,
			"roomId": App.CurrRoomId,
			"platform": this.platform,
			"platUid": App.CurrPlatformUid,

			"uId": DataCenter.instance.user.id,
			"sex": DataCenter.instance.user.sex,
			"name": DataCenter.instance.user.name,
			"uuid": DataCenter.instance.user.uuid,
			"chanId": this.chanId
		}
		this.sendData(data);
	}

	/**
	 * 俩人游戏加载完成发送
	 */
	public static loadingEnd() {
		let data = {
			"act": "loadingEnd",
			"gameId": App.CurrGameId,
			"roomId": App.CurrRoomId,
			"platform": this.platform,
			"platUid": App.CurrPlatformUid,

			"uId": DataCenter.instance.user.id,
			"sex": DataCenter.instance.user.sex,
			"name": DataCenter.instance.user.name,
			"uuid": DataCenter.instance.user.uuid,
			"chanId": this.chanId
		}
		this.sendData(data);
	}

	/**
	 * 单人游戏加载完成发送
	 */
	public static loadingEndOne() {
		let data = {
			"act": "loadingEndOne",
			"gameId": App.CurrGameId,
			"roomId": App.CurrRoomId,
			"platform": this.platform,
			"platUid": App.CurrPlatformUid,

			"uId": DataCenter.instance.user.id,
			"sex": DataCenter.instance.user.sex,
			"name": DataCenter.instance.user.name,
			"uuid": DataCenter.instance.user.uuid,
			"chanId": this.chanId
		}
		this.sendData(data);
	}

	/**
	 * 上报游戏结果
	 */
	public static reportResult(winUserId: string) {
		// result: 1输 2平 3赢
		let result = 2
		if (winUserId.length) {
			if (winUserId == DataCenter.instance.user.id) {
				result = 3
			} else {
				result = 1
			}
		}

		let data = {
			"act": "reportResult",
			"gameId": App.CurrGameId,
			"roomId": App.CurrRoomId,
			"platform": this.platform,
			"platUid": App.CurrPlatformUid,

			"uId": DataCenter.instance.user.id,
			"sex": DataCenter.instance.user.sex,
			"name": DataCenter.instance.user.name,
			"uuid": DataCenter.instance.user.uuid,
			"win": result,
			"chanId": this.chanId
		}
		this.sendData(data);
	}

	private static sendData(data) {
		if (!this.platform) {
			return
		}

		let request = new egret.URLRequest(this.url);
		var paramStr: string = JSON.stringify(data);
		var variables: egret.URLVariables = new egret.URLVariables("data=" + paramStr);
		request.data = variables;
		this.loader.load(request);
	}

	private static onLoadComplete(event: egret.Event): void {
		console.log("onLoadComplete");
		var loader: egret.URLLoader = <egret.URLLoader>event.target;
		console.log(loader.data);
	}

	private static onLoadError(): void {
		console.log("onLoadError");
	}
}