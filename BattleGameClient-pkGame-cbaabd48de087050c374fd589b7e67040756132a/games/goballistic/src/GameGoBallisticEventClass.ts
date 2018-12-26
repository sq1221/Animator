class GameGoBallisticEventClass {
    public static instance: GameGoBallisticEventClass;
    public constructor() {
        GameGoBallisticEventClass.instance = this;
    }

    public GOB_EVENT_READY: string = "r";
    public GOB_EVENT_WALK: string = "w";
    public GOB_EVENT_TAUNT: string = "t";
    public GOB_EVENT_DUMBFOUNDED: string = "d";
    public GOB_EVENT_SCORE: string = "s";

    public messageCenter = (msg: string, extra = "") => {
        // if (DataCenter.instance.room.IsAI) {
        //     return;
        // }

        switch (msg) {
            case GameGoBallisticEventClass.instance.GOB_EVENT_READY:
                switch (GameGoBallisticItemClass.instance.isOffline) {
                    case false:
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_READY, 1);
                        break;
                }
                break;
            case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                switch (GameGoBallisticItemClass.instance.isOffline) {
                    case true:
                        App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_WALK + "|m");
                        break;
                    case false:
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_WALK + "|" + (GameGoBallisticItemClass.instance.blueScore + 1).toString() + "|" + GameGoBallisticItemClass.instance.redScore, 1);
                        break;
                }
                break;
            case GameGoBallisticEventClass.instance.GOB_EVENT_DUMBFOUNDED:
                switch (GameGoBallisticItemClass.instance.isOffline) {
                    case true:
                        App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_DUMBFOUNDED + "|m");
                        break;
                    case false:
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_DUMBFOUNDED, 1);
                        break;
                }
                break;
            case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                switch (GameGoBallisticItemClass.instance.isOffline) {
                    case true:
                        App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT + "|m");
                        break;
                    case false:
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT + "|" + GameGoBallisticItemClass.instance.blueScore + "|" + (GameGoBallisticItemClass.instance.redScore - 2).toString(), 1);
                        break;
                }
                break;
            default:
                console.log("illegal messageCenter msg!!!");
                break;
        }
    }

    public messageDeal = (data: any) => {
        let cmdString: Array<string>;
        switch (GameGoBallisticItemClass.instance.isOffline) {
            case true:
                cmdString = data.split("|");
                break;
            case false:
                cmdString = data.event.split("|");
                break;
        }

        if (GameGoBallisticItemClass.instance.isOffline == true) {
            if (cmdString[1] == "l") {
                switch (cmdString[0]) {
                    case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                        GameGoBallisticLogic.instance.walking(1);
                        break;
                    case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                        GameGoBallisticLogic.instance.taunt(1);
                        break;
                }
            } else if (cmdString[1] == "m") {
                switch (cmdString[0]) {
                    case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                        GameGoBallisticLogic.instance.walking(0);
                        break;
                    case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                        GameGoBallisticLogic.instance.taunt(0);
                        break;
                }
            }
        } else {
            switch (cmdString[0]) {
                case GameGoBallisticEventClass.instance.GOB_EVENT_READY:
                    switch (data.userId.toString()) {
                        case DataCenter.instance.user.id.toString():
                            GameGoBallisticItemClass.instance.readyState[0] = 1;
                            break;
                        case DataCenter.instance.room.player.id.toString():
                            GameGoBallisticItemClass.instance.readyState[1] = 1;
                            break;
                    }
                    break;
                case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                    switch (data.userId.toString()) {
                        case DataCenter.instance.user.id.toString():
                            GameGoBallisticLogic.instance.walking(0);
                            break;
                        case DataCenter.instance.room.player.id.toString():
                            GameGoBallisticLogic.instance.walking(1);
                            if (parseInt(cmdString[1]) != GameGoBallisticItemClass.instance.redScore) {
                                GameGoBallisticItemClass.instance.redScore = parseInt(cmdString[1]);
                                GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                            }
                            if (parseInt(cmdString[2]) != GameGoBallisticItemClass.instance.blueScore) {
                                GameGoBallisticItemClass.instance.blueScore = parseInt(cmdString[2]);
                                GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                            }
                            break;
                    }
                    break;
                case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                    switch (data.userId.toString()) {
                        case DataCenter.instance.user.id.toString():
                            GameGoBallisticLogic.instance.taunt(0);
                            break;
                        case DataCenter.instance.room.player.id.toString():
                            GameGoBallisticLogic.instance.taunt(1);
                            if (parseInt(cmdString[1]) != GameGoBallisticItemClass.instance.redScore) {
                                GameGoBallisticItemClass.instance.redScore = parseInt(cmdString[1]);
                                GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                            }
                            if (parseInt(cmdString[2]) != GameGoBallisticItemClass.instance.blueScore) {
                                GameGoBallisticItemClass.instance.blueScore = parseInt(cmdString[2]);
                                GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                            }
                            break;
                    }
                    break;
            }
        }
    }

    public resultDeal = (data: any) => {
        egret.clearInterval(GameGoBallisticLogic.instance.walkStartTick);
        egret.clearInterval(GameGoBallisticLogic.instance.tauntStartTick);
        GameGoBallisticItemClass.instance.isRuning = false;
        GameGoBallisticItemClass.instance.stopSoundEffect.setVolume(0);
        GameGoBallisticItemClass.instance.roleBlue.soundChannel1.setVolume(0);
        GameGoBallisticItemClass.instance.roleRed.soundChannel1.setVolume(0);
        App.MessageCenter.removeListener("local", GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);

        GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
        GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
        GameGoBallisticMainScene.instance.Gob_btn_run.alpha = 0;
        GameGoBallisticMainScene.instance.Gob_btn_showoff.alpha = 0;

        App.TimerManager.remove(GameGoBallisticLogic.instance.bossCheckBoth, GameGoBallisticLogic.instance);

        if (GameGoBallisticItemClass.instance.isOffline == true) {
            GameGoBallisticArtificialts.instance.tauntSwitcher = false;
            GameGoBallisticArtificialts.instance.walkSwitcher = false;
            App.TimerManager.remove(GameGoBallisticArtificialts.instance.taunt, GameGoBallisticArtificialts.instance)
            App.TimerManager.remove(GameGoBallisticArtificialts.instance.walk, GameGoBallisticArtificialts.instance)
        }

        GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
        GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;

        App.TimerManager.removeAll(GameGoBallisticLogic.instance);

        egret.Tween.removeAllTweens();
        GameGoBallisticLogic.instance.DBCtrlor(6);

        if (data.winUserId.toString() == DataCenter.instance.user.id.toString()) {
            GameGoBallisticMainScene.instance.showResult(3);
        } else {
            GameGoBallisticMainScene.instance.showResult(1);
        }

        App.TimerManager.doTimer(2000, 1, () => {
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            // 发送游戏结果
            GameGoBallisticMainScene.instance.popup("GameResult", null);
        }, GameGoBallisticMainScene.instance)
    }
}