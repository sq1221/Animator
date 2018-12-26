class DataCenter extends egret.EventDispatcher {
    private static _instance: DataCenter;

    private gameConfigs: GameConfig[];
    public user: User;
    public room: RoomVO;
    public SendExpressTime:number = 0;//上一次发送表情的时间

    public static get instance(): DataCenter {
        if (DataCenter._instance == null) {
            DataCenter._instance = new DataCenter();
        }
        return DataCenter._instance;
    }

    public initConfig(gameConfig: any): void {
        this.gameConfigs = gameConfig.games;
    }

    public getGameConfig(id: number): GameConfig {
        let i: number;
        let len: number;
        for (i = 0, len = this.gameConfigs.length; i < len; i++) {
            if (this.gameConfigs[i].gameId == id) {
                return this.gameConfigs[i];
            }
        }
        return null;
    }
}

interface ItemConfig {
    id: number,
    type: number,
    price: number,
    name: string,
    desc: string,
    asset: string
}

interface GameConfig {
    gameId: number,
    name: string,
    icon: string,
    playerNum: number
}