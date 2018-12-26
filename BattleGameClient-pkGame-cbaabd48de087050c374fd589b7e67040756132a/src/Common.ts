class Common {
    public constructor() {
    }

    public static ServerIndex: number = -1;

    public static getGameResConfig(gameId?: number): string {
        gameId = gameId || App.CurrGameId;
        var resConfig: string = "";
        switch (gameId) {
            case 1:
                resConfig = "gameKingkong.res.json";
                break;
            case 2:
                resConfig = "gameChristmas.res.json";
                break;
            case 3:
                resConfig = "gameShooting.res.json";
                break;
            case 4:
                resConfig = "gamePigRun.res.json";
                break;
            case 5:
                resConfig = "gameLeonardFrog.res.json";
                break;
            case 6:
                resConfig = "gameAnimalChess.res.json";
                break;
            case 7:
                resConfig = "gameRhythmKing.res.json";
                break;
            case 8:
                resConfig = "gameMasterMind.res.json";
                break;
            case 10:
                resConfig = "gameBang.res.json";
                break;
            case 11:
                resConfig = "gameLongJump.res.json";
                break;
            case 12:
                resConfig = "gameFiveinARow.res.json";
                break;
            case 15:
                resConfig = "gameFindSomething.res.json";
                break;
            case 16:
                resConfig = "gameGesture.res.json";
                break;

            case 22:
                resConfig = "gameGreedy.res.json";
                break;

            case 17:
                resConfig = "gameTwiceJoy.res.json";
                break;
            case 18:
                resConfig = "gameBlockOut.res.json";
                break;
            case 19:
                resConfig = "gameLameDeskmate.res.json";
                break;
            case 20:
                resConfig = "gameDormitoryWar.res.json";
                break;
            case 21:
                resConfig = "gameGoBallistic.res.json";
                break;
        }
        return resConfig;
    }

    //错误信息显示
    public static showErrorMsg_Game(msg: string): void {
        msg = msg + "(" + Common.ServerIndex + ")";
        GamePopView.Popup(Game.getInstance().stateManager.curState, msg, () => {
            Platform.curPlatform.gameOver(1);
        });
    }

    //根据两个userId创建一个chatId
    public static createChatId(userIds): string {
        var userId1 = userIds[0];
        var userId2 = userIds[1];
        if (userId1 < userId2) {
            return userId1 + '_' + userId2;
        } else {
            return userId2 + '_' + userId1;
        }
    }
}