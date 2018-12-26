class GameGestureLogic {
    private static symbol = [-1, 1];
    public static mainTick = (): boolean => {
        if (GameGestureItemClass.isRunning == false) {
            return false;
        }

        GameGestureItemClass.runningSec += 1;

        // GameGestureLogic.sendLow();

        GameGestureLogic.result();

        if (GameGestureItemClass.speedTime > 1000 && GameGestureItemClass.runningSec >= 900) {
            GameGestureItemClass.speedTime -= 1;
        }

        if (GameGestureItemClass.runningSec == 900) {
            GameGestureMainScene.gesturePanel.extraStart();
        }

        return false;
    }

    public static result = () => {
        if (GameGestureItemClass.leftHealth == 0) {
            GameGestureItemClass.isRunning = false;
            GameGestureItemClass.resultPool[0] = 0;
            console.log("lose!");
            egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
            GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_LOSE, [GameGestureItemClass.runningSec]);
            App.TimerManager.doTimer(300, 1, () => {
                GameGestureLogic.resultDeal();
            }, GameGestureMainScene.instance);
            GameGestureLogic.dispose();
        } else if (GameGestureItemClass.rightHealth == 0) {
            GameGestureItemClass.isRunning = false;
            GameGestureItemClass.resultPool[0] = 1;
            console.log("win!");
            egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
            GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_WIN, [GameGestureItemClass.runningSec]);
            App.TimerManager.doTimer(300, 1, () => {
                GameGestureLogic.resultDeal();
            }, GameGestureMainScene.instance);
            GameGestureLogic.dispose();
        }
    }

    public static resultDeal = () => {
        if (GameGestureItemClass.resultPool[0] == 1 && GameGestureItemClass.resultPool[1] == 1) {
            if (GameGestureItemClass.runningSec > GameGestureItemClass.rightTimeDvalue) {
                GameGestureEventClass.gameOver(1);
            } else if (GameGestureItemClass.runningSec < GameGestureItemClass.rightTimeDvalue) {
                GameGestureEventClass.gameOver(3);
            } else {
                if (parseInt(DataCenter.instance.user.id.toString()) > parseInt(DataCenter.instance.room.player.id.toString())) {
                    GameGestureEventClass.gameOver(3);
                } else {
                    GameGestureEventClass.gameOver(1);
                }
            }
        } else if (GameGestureItemClass.resultPool[0] == 1 && GameGestureItemClass.resultPool[1] == 0) {
            GameGestureEventClass.gameOver(3);
        } else if (GameGestureItemClass.resultPool[0] == 0 && GameGestureItemClass.resultPool[1] == 1) {
            GameGestureEventClass.gameOver(1);
        } else {
            GameGestureEventClass.gameOver(1);
        }
    }

    public static readyTick = (): boolean => {
        switch (GameGestureItemClass.isOffline) {
            case false:
                if (GameGestureItemClass.readyState[0] == 1 && GameGestureItemClass.readyState[1] == 1) {
                    GameGestureItemClass.readyState = [0, 0];
                    egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
                    GameGestureLogic.gameStart();
                    return false;
                }
                break;
            case true:
                egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
                App.TimerManager.doTimer(1500 * Math.random(), 1, GameGestureLogic.gameStart, GameGestureMainScene)
                return false;
        }
        return false;
    }

    private static gameStart = () => {
        egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);

        GameGestureMainScene.instance.rdy.x = 300;
        GameGestureMainScene.instance.rdy.y = App.GameHeight / 2;
        GameGestureMainScene.instance.rdy.play();
        GameGestureMainScene.instance.addChildAt(GameGestureMainScene.instance.rdy, 15);

        egret.startTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
    }

    public static extraMakeItems = (itemNum: number) => {
        // for (let index = 0; index < itemNum; index++) {
        //     GameGestureMainScene.gesturePanel.itemMakeOne(1);
        // }

        GameGestureMainScene.gesturePanel.itemMakeOne(itemNum);
    }

    public static foodManager = (num: number, isSet = false) => {
        num += 1;
        GameGestureLogic.foodEffect(num, isSet);
    }

    private static foodEffect = (num: number, isSet = false) => {
        switch (isSet) {
            case false:
                let tw = egret.Tween.get(GameGestureMainScene.instance.getChildByName("food" + num.toString()) as egret.Bitmap);
                tw.to({ alpha: 0 }, 500);

                let smoke = AssetManager.getDBArmature("GT_smoke");
                smoke.x = (GameGestureMainScene.instance.getChildByName("food" + num.toString()) as egret.Bitmap).x + 80;
                smoke.y = (GameGestureMainScene.instance.getChildByName("food" + num.toString()) as egret.Bitmap).y - 50;
                GameGestureMainScene.instance.addChild(smoke);
                smoke.play("boom" + App.RandomUtils.limitInteger(1, 7).toString(), 1);
                break;
            case true:
                for (let index = 1; index <= num; index++) {
                    (GameGestureMainScene.instance.getChildByName("food" + (4 - num).toString()) as egret.Bitmap).alpha = 1;
                }
                break;
        }

    }

    private static sendLow = () => {
        if (GameGestureItemClass.runningSec % 40 == 0) {
            if (GameGestureItemClass.isOffline == false) {
                GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_SENDLLINE, [GameGestureItemClass.lowestLine]);
            } else {
                egret.Tween.removeTweens(GameGestureItemClass.otherLine);
                // console.log(GameGestureItemClass.lowestLine - 200 + App.RandomUtils.randomArray(GameGestureLogic.symbol) * 400 * Math.random());
                GameGestureItemClass.otherLineTW = egret.Tween.get(GameGestureItemClass.otherLine);
                GameGestureItemClass.otherLineTW.to({ y: GameGestureItemClass.lowestLine - 200 + App.RandomUtils.randomArray(GameGestureLogic.symbol) * 400 * Math.random() }, 500).to({ y: -100 }, 2000);
            }
        }
    }

    private static dispose = () => {
        egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
        egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
        //GameGestureAutonomy.instance.stop();
        GameGestureMainScene.gesturePanel.stop();
        GameGestureItemClass.backGround.touchEnabled = false;
    }
}