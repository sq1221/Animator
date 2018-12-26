class GameMasterMindLogic {

    public static btn1Press = () => {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 0;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn1.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn1Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    }

    public static btn2Press = () => {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 1;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn2.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn2Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    }

    public static btn3Press = () => {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 2;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn3.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn3Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    }

    public static btn4Press = () => {
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        GameMasterMindItemClass.chooseIndex = 3;
        GameMasterMindItemClass.readyState[0] = 1;
        GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_ANSWER);
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            GameMasterMindItemClass.youScore += GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text));
        }
        GameMasterMindItemClass.btn4.texture = AssetManager.getBitmap("MM_BtnBlue_png", true, true).texture;
        GameMasterMindItemClass.btn4Text.textColor = 0xffffff;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;
        GameMasterMindItemClass.answerMask.touchEnabled = true;
        GameMasterMindMainScene.showLeftTimeUsed(false);
    }

    public static numToFont = () => {
        switch (GameMasterMindItemClass.QuestionOrder) {
            case 1:
                return "二";
            case 2:
                return "三";
            case 3:
                return "四";
            case 4:
                return "五";
            case 5:
                return "六";
            case 6:
                return "七";
            case 7:
                return "八";
            case 8:
                return "九";
        }
    }

    public static tableSwitcher = () => {
        GameMasterMindItemClass.typeStr.alpha = 1;
        switch (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["type"] as string) {
            case "lishi":
                GameMasterMindItemClass.typeStr.text = "历史";
                GameMasterMindItemClass.spareType.text = "历史";
                break;
            case "dongman":
                GameMasterMindItemClass.typeStr.text = "动漫";
                GameMasterMindItemClass.spareType.text = "动漫";
                break;
            case "wenhua":
                GameMasterMindItemClass.typeStr.text = "文化";
                GameMasterMindItemClass.spareType.text = "文化";
                break;
            case "richang":
                GameMasterMindItemClass.typeStr.text = "日常";
                GameMasterMindItemClass.spareType.text = "日常";
                break;
            case "dianying":
                GameMasterMindItemClass.typeStr.text = "电影";
                GameMasterMindItemClass.spareType.text = "电影";
                break;
            case "youxi":
                GameMasterMindItemClass.typeStr.text = "游戏";
                GameMasterMindItemClass.spareType.text = "游戏";
                break;
            case "renwu":
                GameMasterMindItemClass.typeStr.text = "人物";
                GameMasterMindItemClass.spareType.text = "人物";
                break;
            case "ziran":
                GameMasterMindItemClass.typeStr.text = "自然";
                GameMasterMindItemClass.spareType.text = "自然";
                break;
            case "mingzhu":
                GameMasterMindItemClass.typeStr.text = "名著";
                GameMasterMindItemClass.spareType.text = "名著";
                break;
            case "dili":
                GameMasterMindItemClass.typeStr.text = "地理";
                GameMasterMindItemClass.spareType.text = "地理";
                break;
            case "yinyue":
                GameMasterMindItemClass.typeStr.text = "音乐";
                GameMasterMindItemClass.spareType.text = "音乐";
                break;
            case "kexue":
                GameMasterMindItemClass.typeStr.text = "科学";
                GameMasterMindItemClass.spareType.text = "科学";
                break;
        }
    }

    public static AI = () => {
        let random: number = Math.random();
        switch ((GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"] as Array<any>).length) {
            case 2:
                if (random < 0.5) {
                    GameMasterMindItemClass.otherChooseIndex = 1;
                } else {
                    GameMasterMindItemClass.otherChooseIndex = 0;
                }
                break;
            case 3:
                if (random < 0.333) {
                    GameMasterMindItemClass.otherChooseIndex = 1;
                } else if (random >= 0.333 && random < 0.666) {
                    GameMasterMindItemClass.otherChooseIndex = 0;
                } else if (random >= 0.666) {
                    GameMasterMindItemClass.otherChooseIndex = 2;
                }
                break;
            case 4:
                if (random < 0.25) {
                    GameMasterMindItemClass.otherChooseIndex = 1;
                } else if (random >= 0.25 && random < 0.5) {
                    GameMasterMindItemClass.otherChooseIndex = 0;
                } else if (random >= 0.5 && random < 0.75) {
                    GameMasterMindItemClass.otherChooseIndex = 2;
                } else if (random >= 0.75) {
                    GameMasterMindItemClass.otherChooseIndex = 3;
                }
                break;
        }

        // GameMasterMindItemClass.otherChooseIndex = GameMasterMindItemClass.correctAnswerIndex;

        let time = (random * 8000 + 4500);
        App.TimerManager.doTimer(time, 1, () => {
            egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
            egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
            GameMasterMindItemClass.readyState[1] = 1;
            console.log("DO!");
            if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                GameMasterMindItemClass.otherScore += GameMasterMindLogic.scoreManager(parseInt((time / 1000).toString()));
            }
            GameMasterMindMainScene.showRightTimeUsed(false);
        }, GameMasterMindLogic);
    }

    public static fontSizeManager = (font: egret.TextField) => {

        if (font == undefined || GameMasterMindItemClass.Question == undefined || GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"] == undefined) {
            return;
        }

        switch (font) {
            case GameMasterMindItemClass.btn1Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][0] == undefined) { return; }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][0].length > 10) {
                    GameMasterMindItemClass.btn1Text.size = 30;
                } else {
                    GameMasterMindItemClass.btn1Text.size = 36;
                }
                break;
            case GameMasterMindItemClass.btn2Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1] == undefined) { return; }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1].length > 10) {
                    GameMasterMindItemClass.btn2Text.size = 30;
                } else {
                    GameMasterMindItemClass.btn2Text.size = 36;
                }
                break;
            case GameMasterMindItemClass.btn3Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2] == undefined) { return; }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2].length > 10) {
                    GameMasterMindItemClass.btn3Text.size = 30;
                } else {
                    GameMasterMindItemClass.btn3Text.size = 36;
                }
                break;
            case GameMasterMindItemClass.btn4Text:
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][3] == undefined) { return; }
                if (GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][3].length > 10) {
                    GameMasterMindItemClass.btn4Text.size = 30;
                } else {
                    GameMasterMindItemClass.btn4Text.size = 36;
                }
                break;
        }
    }

    public static refresh = () => {
        GameMasterMindItemClass.correctAnswerIndex = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["correctAnswerIndex"];
        GameMasterMindItemClass.questionText.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["title"];

        GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn1Text);
        GameMasterMindItemClass.btn1Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][0];

        switch ((GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"] as Array<any>).length) {
            case 2:
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn2Text);
                GameMasterMindItemClass.btn2Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1];
                break;
            case 3:
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn2Text);
                GameMasterMindItemClass.btn2Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1];
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn3Text);
                GameMasterMindItemClass.btn3Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2];
                break;
            case 4:
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn2Text);
                GameMasterMindItemClass.btn2Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][1];
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn3Text);
                GameMasterMindItemClass.btn3Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][2];
                GameMasterMindLogic.fontSizeManager(GameMasterMindItemClass.btn4Text);
                GameMasterMindItemClass.btn4Text.text = GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"][3];
                break;
        }
    }

    public static scoreManager = (num: number) => {
        let score = 30 - num;

        if (GameMasterMindItemClass.QuestionOrder == 9) {
            console.log("double score!");
            return (score * 2);
        } else {
            return score;
        }
    }

    public static gameOver(result: number): void {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }
}