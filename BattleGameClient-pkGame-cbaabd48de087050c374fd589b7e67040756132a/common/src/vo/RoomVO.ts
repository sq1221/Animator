class RoomVO {
    public id: string;
    public gameId: number;
    public player: User;
    public gameResult: any;
    private _isAi: boolean;

    constructor(id: string, gameId: number, player: User, isAi: boolean) {
        this.id = id;
        this.gameId = gameId;
        this.player = player;
        this._isAi = isAi;
    }

    public get IsAI(): boolean {
        return this._isAi;
    }

    public get selfIsMaster(): boolean {
        if (this._isAi) {
            return true;
        }

        let players = App.CurrChatId.split("_");
        return players[0] == DataCenter.instance.user.id.toString();
    }
}