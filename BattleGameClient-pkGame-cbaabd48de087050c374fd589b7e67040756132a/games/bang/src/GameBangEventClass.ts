class GameBangEventClass {
    public static EVENT_READY: string = "ready";
    public static EVENT_SENDSETTINGS: string = "sendSettings";
    public static EVENT_SHOOT: string = "shoot";
    public static EVENT_ISHOOT: string = "ishoot";
    public static EVENT_RESULT: string = "result";

    /**
     * manager 4 local game message
     */
    public static messageCenter = (msg: GameBangEventClass) => {

        if (GameBangItemClass.isOffline == true) {
            return;
        }

        switch (msg) {
            case GameBangEventClass.EVENT_READY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_READY + "|" + new Date().getTime(), 1);
                break;
            case GameBangEventClass.EVENT_SENDSETTINGS:
                if (GameBangItemClass.isHost == true) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_SENDSETTINGS + "|" + GameBangLogic.makeSettings() + "|" + new Date().getTime(), 1);
                } else {
                    console.log("you are not the host,do not send settings.");
                }
                break;
            case GameBangEventClass.EVENT_SHOOT:
                let youTime: number = GameBangItemClass.restSec;
                GameBangItemClass.youShootSec = youTime;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_SHOOT + "|" + youTime.toString());
                break;
            case GameBangEventClass.EVENT_ISHOOT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_ISHOOT, 1);
                break;
            case GameBangEventClass.EVENT_RESULT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameBangEventClass.EVENT_RESULT + "|" + GameBangItemClass.youHealth.toString() + "|" + GameBangItemClass.otherHealth.toString());
                break;
            default:
                console.log("illegal message!");
                break;
        }
    }
}