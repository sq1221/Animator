class GameGestureEventClass {
    public static EVENT_GAMEREADY = "r";
    public static EVENT_BREAK = "b";
    public static EVENT_LOST = "l";
    public static EVENT_WIN = "w";
    public static EVENT_LOSE = "ls";
    public static EVENT_SENDLLINE = "s";

    public static messageSendCenter = (msg: GameGestureEventClass, ary = []) => {
        if (GameGestureItemClass.isOffline == true) {
            return;
        }

        switch (msg) {
            case GameGestureEventClass.EVENT_GAMEREADY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_GAMEREADY, 1);
                break;
            case GameGestureEventClass.EVENT_BREAK:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_BREAK + "|" + ary[0].toString());
                break;
            case GameGestureEventClass.EVENT_LOST:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_LOST);
                break;
            case GameGestureEventClass.EVENT_LOSE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_LOSE + "|" + ary[0].toString());
                break;
            case GameGestureEventClass.EVENT_WIN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_WIN + "|" + ary[0].toString());
                break;
            case GameGestureEventClass.EVENT_SENDLLINE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_SENDLLINE + "|" + ary[0].toString());
                break;
            default:
                console.log("illegal message in messageSendCenter!");
                break;
        }
    }

    public static messageReceiveCenter = (data: any) => {
        let cmdString: Array<string>;
        cmdString = data.event.split("|");
        switch (cmdString[0]) {
            case GameGestureEventClass.EVENT_GAMEREADY:
                switch (data.userId.toString()) {
                    case DataCenter.instance.user.id.toString():
                        GameGestureItemClass.readyState[0] = 1;
                        break;
                    case DataCenter.instance.room.player.id.toString():
                        GameGestureItemClass.readyState[1] = 1;
                        break;
                }
                break;
            case GameGestureEventClass.EVENT_BREAK:
                GameGestureLogic.extraMakeItems(parseInt(cmdString[1]));
                break;
            case GameGestureEventClass.EVENT_LOST:
                GameGestureItemClass.rightHealthCtrlor.subtractHealth();
                break;
            case GameGestureEventClass.EVENT_LOSE:
                GameGestureItemClass.resultPool[1] = 0;
                break;
            case GameGestureEventClass.EVENT_WIN:
                GameGestureItemClass.resultPool[1] = 1;
                GameGestureItemClass.rightTimeDvalue = parseInt(cmdString[1]);
                break;
            case GameGestureEventClass.EVENT_SENDLLINE:
                GameGestureItemClass.otherlowest = parseInt(cmdString[1]);
                egret.Tween.removeTweens(GameGestureItemClass.otherLine);
                GameGestureItemClass.otherLineTW = egret.Tween.get(GameGestureItemClass.otherLine);
                GameGestureItemClass.otherLineTW.to({ y: GameGestureItemClass.otherlowest }, 500).to({ y: -100 }, 500);
                break;
        }
    }

    public static resultMessageCenter = (data: any) => {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        App.TimerManager.doTimer(3500, 1, () => {
            GameGestureMainScene.instance.popup("GameResult", null);
        }, GameGestureMainScene.instance);
    }

    public static gameOver(result: number): void {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
        console.log("now is over!");
        let resultImg: egret.Bitmap;
        let name: string;
        switch (result) {
            case 1:
                name = "GT_lose_png";
                break;
            case 3:
                name = "GT_win_png";
                break;
        }

        let backMask = AssetManager.getBitmap("GT_mask_png", false, false);
        backMask.x = 0;
        backMask.y = 0;
        backMask.alpha = 0.6;
        GameGestureMainScene.instance.addChild(backMask);

        resultImg = AssetManager.getBitmap(name);
        resultImg.x = 320;
        resultImg.y = 600;
        resultImg.scaleX = 0.01;
        resultImg.scaleY = 0.01;
        GameGestureMainScene.instance.addChild(resultImg);
        let tw = egret.Tween.get(resultImg);
        tw.to({ scaleX: 1, scaleY: 1 }, 1500, egret.Ease.elasticInOut).call(() => {
            egret.Tween.removeAllTweens();
        });
    }
}