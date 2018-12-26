class GamePigRunLogic extends egret.DisplayObjectContainer {
    public static logicLocalColor: string;
    public static keyPress: string;
    public static orderNum: number = -1;
    public static otherOrderNum: number = 8;
    public static whoWillWin: string;
    public static colorSettings: Array<string> = [];
    public static colorOtherSettings: Array<string> = [];
    public static wrongSwitcher: boolean = false;
    public static gameModeisDeathMode: boolean = false;
    public static isOffline: boolean = false;
    public static colorArray: Array<string> = [];

    /**
     * Local Message Center
     */
    public static localMessageCenter = (event: GamePigRunEventClass) => {

        if (GamePigRunLogic.isOffline == true) {
            return;
        }

        switch (event) {
            case GamePigRunEventClass.EVENT_OTHER_DO:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_DO);
                break;
            case GamePigRunEventClass.EVENT_TIMEOUT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_TIMEOUT);
                break;
            case GamePigRunEventClass.EVENT_OTHER_IS_RED:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_IS_RED);
                break;
            case GamePigRunEventClass.EVENT_OTHER_IS_BLUE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_IS_BLUE);
                break;
            case GamePigRunEventClass.EVENT_YOU_WIN:
                GamePigRunLogic.gameOver(3);
                break;
            case GamePigRunEventClass.EVENT_YOU_LOSE:
                GamePigRunLogic.gameOver(1);
                break;
            case GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY:
                let cmdString: string = GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY;
                GamePigRunLogic.colorSettings.forEach(element => {
                    cmdString += ("|" + element)
                });
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, cmdString);
                break;
            case GamePigRunEventClass.EVENT_OTHER_WIN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_OTHER_WIN);
                break;
            case GamePigRunEventClass.EVENT_STOP_GAME:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_STOP_GAME + "|" + GamePigRunMainScene.result);
                break;
            case GamePigRunEventClass.EVENT_READY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_READY, 1);
                break;
            case GamePigRunEventClass.EVENT_REDBTN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_REDBTN, 1);
                break;
            case GamePigRunEventClass.EVENT_BLUEBTN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_BLUEBTN, 1);
                break;
            case GamePigRunEventClass.EVENT_DEATHBTN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_DEATHBTN, 1);
                break;
            case GamePigRunEventClass.EVENT_NEWTURN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GamePigRunEventClass.EVENT_NEWTURN + "|" + GamePigRunMainScene.gameTurns.toString());
                break;
        }
    }

    public static gameOver(result: number): void {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    /**
     * Base Num Manager
     */
    private static baseNumManager = (num: number): number => {
        // console.log("baseNumManager : " + num);
        if (num == 15) {
            num = 0;
        } else {
            num += 1;
        }

        return num;
    }

    /**
     * 数值自动管理
     */
    public static numManager = (): number => {
        return GamePigRunLogic.orderNum = GamePigRunLogic.baseNumManager(GamePigRunLogic.orderNum);
    }

    /**
     * 对方数值自动管理
     */
    public static otherNumManager = (): number => {
        return GamePigRunLogic.otherOrderNum = GamePigRunLogic.baseNumManager(GamePigRunLogic.otherOrderNum);
    }

    /**
     * Base Color Manager
     */
    private static baseColorManager = (color: string, type?: any) => {
        if (type != undefined) {
            return color;
        } else {
            GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[GamePigRunLogic.orderNum];
        }
    }

    /**
     * 随机数返回一个颜色，red，blue
     */
    public static returnColor = (type?: any) => {
        let random = Math.random();
        let color: string;

        if (GamePigRunLogic.colorArray.length > 3) {
            GamePigRunLogic.colorArray.shift();
        }

        if (0.5 > random && random >= 0) {
            color = "red";
            GamePigRunLogic.colorArray.push("red");
        } else if (1 >= random && random > 0.5) {
            color = "blue";
            GamePigRunLogic.colorArray.push("blue");
        }

        if (GamePigRunLogic.colorArray.length > 2) {
            if (GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 3] === GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 2] && GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 2] === GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 1]) {
                switch (color) {
                    case "red":
                        GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 1] = "blue";
                        return GamePigRunLogic.baseColorManager("blue", type);
                    case "blue":
                        GamePigRunLogic.colorArray[GamePigRunLogic.colorArray.length - 1] = "red";
                        return GamePigRunLogic.baseColorManager("red", type);
                }
            }
        }

        return GamePigRunLogic.baseColorManager(color, type);
    }

    /**
     * get color setting(s),if type is not undefined than return a Array of color
     */
    public static getColor = (type?: any) => {
        if (type != undefined) {
            switch (GamePigRunLogic.isOffline) {
                case true:
                    for (let i = 0; i < 16; i++) {
                        GamePigRunLogic.colorSettings.push(GamePigRunLogic.returnColor("init"))
                    }
                    GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[0];
                    return GamePigRunLogic.colorSettings[0];
                case false:
                    for (let i = 0; i < 8; i++) {
                        GamePigRunLogic.colorSettings.push(GamePigRunLogic.returnColor("init"))
                    }
                    GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[0];
                    GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY);
                    let upperColor = GamePigRunLogic.colorSettings[0].replace(GamePigRunLogic.colorSettings[0], GamePigRunLogic.colorSettings[0].toUpperCase());
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "other" + upperColor);
                    return GamePigRunLogic.colorSettings[0];
            }
        } else {
            return GamePigRunLogic.returnColor();
        }
    }

    /**
     * 根据输入的 color：string 来返回需要加载的资源
     */
    public static switchColor = (color: string, isBorder?: string): string => {
        let colorRes: string;
        if (isBorder) {
            switch (color) {
                case "red": colorRes = "PR_redBorder_png"; break;
                case "blue": colorRes = "PR_blueBorder_png"; break;
                case "glary": colorRes = "PR_glaryBorder_png"; break;
            }
            // console.log(colorRes);
            return colorRes;
        } else {
            switch (color) {
                case "red": colorRes = "PR_redAngle_png"; break;
                case "blue": colorRes = "PR_blueAngle_png"; break;
                case "glary": colorRes = "PR_glaryAngle_png"; break;
            }
            // console.log(colorRes);
            return colorRes;
        }
    }

    /**
     * 改变输入的item的颜色
     */
    public static changeColor = (item: egret.Bitmap, color: string, isBorder?: string) => {
        if (isBorder != undefined) {
            item.texture = RES.getRes(GamePigRunLogic.switchColor(color, isBorder));
        } else {
            item.texture = RES.getRes(GamePigRunLogic.switchColor(color));
        }
    }

    /**
     * 改变场景中part的颜色和位置
     */
    public static partExhibition = (item: egret.Bitmap, color: string, rotation: number, reset?: boolean) => {
        if (color != undefined) {
            GamePigRunLogic.changeColor(item, color);
        }
        if (reset && reset == true) {
            item.rotation = GamePigRunMainScene.partRotation[rotation];
        } else {
            egret.Tween.removeTweens(item);
            let tw = egret.Tween.get(item);
            switch (item) {
                case GamePigRunMainScene.part_you:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    tw.call(() => {
                        item.rotation = GamePigRunMainScene.youTarget;
                    });
                    break;
                case GamePigRunMainScene.part_other:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    if (GamePigRunLogic.isOffline == false) {
                        tw.call(() => {
                            item.rotation = GamePigRunMainScene.target;
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 改变场景中role的角度
     */
    public static roleExhibition = (item: egret.DisplayObject, pos: number, reset?: boolean) => {
        if (pos == -1) { pos = 15; }
        if (reset && reset == true) {
            item.rotation = GamePigRunMainScene.partRotation[pos];
        } else {
            egret.Tween.removeTweens(item);
            let tw = egret.Tween.get(item);
            switch (item) {
                case GamePigRunMainScene.role_you:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    tw.call(() => {
                        item.rotation = GamePigRunMainScene.youTarget;
                    });
                    break;
                case GamePigRunMainScene.role_other:
                    tw.to({ rotation: item.rotation - 22.5 }, 30);
                    if (GamePigRunLogic.isOffline == false) {
                        tw.call(() => {
                            item.rotation = GamePigRunMainScene.target;
                        });
                    }
                    break;
                default:
                    break;
            }

            switch (item.name) {
                case "role_you":
                    GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[GamePigRunLogic.orderNum];
                    // console.log(GamePigRunMainScene.roleYouRotation);
                    break;
                case "role_other":
                    GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[GamePigRunLogic.orderNum];
                    // console.log(GamePigRunMainScene.roleOtherRotation);
                    break;
            }
        }
    }

    /**
     * 游戏结果判断
     */
    public static gameJudge = () => {
        if (GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === 1 || GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === -15) {
            GamePigRunLogic.whoWillWin = "other";
        } else if (GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === -1 || GamePigRunLogic.orderNum - GamePigRunLogic.otherOrderNum === 15) {
            GamePigRunLogic.whoWillWin = "you";
        } else if (GamePigRunLogic.orderNum === GamePigRunLogic.otherOrderNum) {
            switch (GamePigRunLogic.whoWillWin) {
                case "you":
                    GamePigRunMainScene.result = "you";
                    break;
                case "other":
                    GamePigRunMainScene.result = "other";
                    break;
            }
        }
    }
}