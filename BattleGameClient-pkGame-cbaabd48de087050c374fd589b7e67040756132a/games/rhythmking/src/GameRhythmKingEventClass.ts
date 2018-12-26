class GameRhythmKingEventClass {
    public static EVENT_CHOOSE_SETTINGS: string = "choose";
    public static EVEVT_READY: string = "ready";
    public static EVENT_PER: string = "per";
    public static EVENT_NOR: string = "nor";
    public static EVENT_GOOD: string = "good";
    public static EVENT_LOSE: string = "lose";
    public static EVENT_MUSIC_END: string = "end";

    public static rkMessagerCenter = (event: GameRhythmKingEventClass) => {
        
        if (GameRhythmKingLogic.isOffline == true) {
            return;
        }

        switch (event) {
            case GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS + "|" + GameRhythmKingLogic.randomChoose(), 1);
                break;
            case GameRhythmKingEventClass.EVEVT_READY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVEVT_READY);
                break;
            case GameRhythmKingEventClass.EVENT_PER:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_PER);
                break;
            case GameRhythmKingEventClass.EVENT_NOR:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_NOR);
                break;
            case GameRhythmKingEventClass.EVENT_GOOD:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_GOOD);
                break;
            case GameRhythmKingEventClass.EVENT_LOSE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_LOSE);
                break;
            case GameRhythmKingEventClass.EVENT_MUSIC_END:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameRhythmKingEventClass.EVENT_MUSIC_END);
                break;
        }
    }

    public static dispose = () => {

    }
}