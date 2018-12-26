class ShootingItemController {
	private isMain: boolean = false;
	public constructor() {
		this.isMain = DataCenter.instance.room.selfIsMaster;
		App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.webListener, this);
	}
	play() {
		if (GameShootingView.instance.shootingGame.isOffLine) {
			App.TimerManager.doTimer(UserConfig.ItemTime, 0, GameShootingAI.addAIItem, GameShootingAI);
		} else {
			if (this.isMain) {
				App.TimerManager.doTimer(UserConfig.ItemTime, 0, this.addItem, this);
			}
		}
	}
	stop() {
		if (GameShootingView.instance.shootingGame.isOffLine) {
			App.TimerManager.remove(GameShootingAI.addAIItem, GameShootingAI);
		} else {
			if (this.isMain) {
				App.TimerManager.remove(this.addItem, this);
			}
		}
	}
	private addItem() {
		let random = Math.random();
		if (random < 0.2) {
			App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|rocket|left", 1);
			return;
		} else if (random < 0.4) {
			App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|rocket|right", 1);
			return;
		} else if (random < 0.6) {
			App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|split|right", 1);
			return;
		} else if (random < 0.8) {
			App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DataCenter.instance.user.id + "|split|left", 1);
			return;
		}
	}
	webListener(data: any): void {
		/** 
		 * "stand|123"
		 * command：stand && parameter：123 
		 * */
		let parseData = (data: string): string[] => {
			let splitChar = data.split("|");
			return splitChar;
		}
		let datas = parseData(data.event);
		let item: ShootingItem;
		//自己是主机
		let direct: ShootingItemDirectionType;
		if (datas[0] == DataCenter.instance.user.id.toString()) {
			direct = ShootingItemDirectionType[datas[2]];
		} else {//对方是主机,方向做颠倒
			direct = ShootingItemDirectionType[datas[2]] == 0 ? 1 : 0;
		}
		switch (datas[1]) {
			case "rocket":
				item = ObjectPool.pop(ShootingRocket, "ShootingRocket");
				break;
			case "split":
				item = ObjectPool.pop(ShootingSplit, "ShootingSplit");
				break;
			default:
				return;
		}
		item.init(direct);
	}
	public dispose(): void {
		this.stop();
		App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.webListener, this);
	}
}