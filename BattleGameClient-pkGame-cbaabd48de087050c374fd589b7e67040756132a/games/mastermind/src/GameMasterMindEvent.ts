class GameMasterMindEvent {
    public static EVENT_GAMEREADY: string = "ready";
    public static EVENT_ANSWER: string = "answer";
    public static EVENT_RESULT: string = "result";

    public static MMMessagerCenter = (msg: GameMasterMindEvent) => {
        if(DataCenter.instance.room.IsAI){
            return;
        }
        switch (msg) {
            case GameMasterMindEvent.EVENT_GAMEREADY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameMasterMindEvent.EVENT_GAMEREADY);
                break;
            case GameMasterMindEvent.EVENT_ANSWER:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameMasterMindEvent.EVENT_ANSWER + "|" + GameMasterMindItemClass.chooseIndex + "|" + GameMasterMindItemClass.youTimeText.text);
                break;
            case GameMasterMindEvent.EVENT_RESULT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameMasterMindEvent.EVENT_GAMEREADY);
                break;
        }
    }
}