class GameBangLogic extends State {

    /**
     * reset the role
     */
    public static resetRole = () => {
        GameBangItemClass.otherRole.texture = AssetManager.getBitmap("BA_otherRole_png").texture;
        GameBangItemClass.youRole.texture = AssetManager.getBitmap("BA_youRole_png").texture;
    }

    /**
     * enable/disenable btnBang
     */
    public static btnBangManager = (canUse: boolean) => {
        switch (canUse) {
            case true:
                GameBangItemClass.btnBang.touchEnabled = true;
                break;
            case false:
                GameBangItemClass.btnBang.touchEnabled = false;
                break;
            default:
                console.log("illegal canUse!");
                break;
        }
    }

    /**
     * when a turn has gone end,dispose
     */
    public static turnDispose = () => {
        GameBangLogic.resetRole();
        GameBangItemClass.restSec = 300;
        GameBangItemClass.gameSettings = [];
        GameBangItemClass.tipsState = [0, 0, 0, 0];
        GameBangItemClass.reference = false;
        GameBangItemClass.turnState = [0, 0];
        GameBangItemClass.readyState = [0, 0];
        GameBangItemClass.btnBang.texture = AssetManager.getBitmap("BA_btnBang_png").texture;
    }

    public static resetTips = () => {
        let twArray = [
            GameBangItemClass.tipsRole_ul,
            GameBangItemClass.tipsRole_bl,
            GameBangItemClass.tipsRole_ur,
            GameBangItemClass.tipsRole_br,
            GameBangItemClass.tipsText_ul,
            GameBangItemClass.tipsText_bl,
            GameBangItemClass.tipsText_ur,
            GameBangItemClass.tipsText_br
        ]

        try {
            twArray.forEach(element => {
                egret.Tween.removeTweens(element);
                element.alpha = 0;
            });
        } catch (error) {
            console.log(error);
        }
    }

    public static gameOver(result: number): void {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    /**
     * manager 4 shooting tips
     * pos:1-ul 2-bl 3-ur 4-br
     * item:1-bang 2-deng 3-deng
     */
    public static showShootingTips = (pos: number, item: number) => {
        if (item == 0) {
            GameBangItemClass.reference = true;
        }
        let itemSettings: Array<string> = ["Bang", "Deng", "Boom", "Dang"];
        let tipsTextPos: Array<Array<number>> = [];
        let tipsRolePos: Array<Array<number>> = [];
        let isLeft: boolean = false;
        let aspect: string = "";
        let twItem: egret.Bitmap;
        let _twItem: egret.Bitmap;
        let soundName: string;

        GameBangItemClass.tipsState[pos] = 1;

        switch (pos) {
            case 0:
                tipsTextPos = GameBangItemClass.tipsPosArray[0];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[0];
                twItem = GameBangItemClass.tipsText_ul;
                _twItem = GameBangItemClass.tipsRole_ul;
                isLeft = true;
                break;
            case 1:
                tipsTextPos = GameBangItemClass.tipsPosArray[1];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[1];
                twItem = GameBangItemClass.tipsText_bl;
                _twItem = GameBangItemClass.tipsRole_bl;
                isLeft = true;
                break;
            case 2:
                tipsTextPos = GameBangItemClass.tipsPosArray[2];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[2];
                twItem = GameBangItemClass.tipsText_ur;
                _twItem = GameBangItemClass.tipsRole_ur;
                isLeft = false;
                break;
            case 3:
                tipsTextPos = GameBangItemClass.tipsPosArray[3];
                tipsRolePos = GameBangItemClass.tipsRolePosArray[3];
                twItem = GameBangItemClass.tipsText_br;
                _twItem = GameBangItemClass.tipsRole_br;
                isLeft = false;
                break;
            default:
                console.log("illegal pos! num: " + pos);
                break;
        }

        try {
            twItem.alpha = 1;
            _twItem.alpha = 1;
            egret.Tween.removeTweens(twItem);
            egret.Tween.removeTweens(_twItem);
            twItem.x = tipsTextPos[0][0];
            twItem.y = tipsTextPos[0][1];
            _twItem.x = tipsRolePos[0][0];
            _twItem.y = tipsRolePos[0][1];
        } catch (error) {
            console.log(error);
        }

        switch (isLeft) {
            case false:
                aspect = "R";
                break;
            case true:
                aspect = "L";
                break;
            default:
                console.log("illegal aspect!");
                break;
        }

        switch (item) {
            case 0:
                GameBangItemClass.reference = true;
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_BANG_png", false, false).texture;
                soundName = "BA_bang_mp3";
                break;
            case 1:
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_DENG_png", false, false).texture;
                soundName = "BA_deng_mp3";
                break;
            case 2:
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_BOOM_png", false, false).texture;
                soundName = "BA_boom_mp3";
                break;
            case 3:
                twItem.texture = AssetManager.getBitmap("BA_" + aspect + "_DANG_png", false, false).texture;
                soundName = "BA_dang_mp3";
                break;
            default:
                console.log("illegal item!");
                break;
        }

        let tw = egret.Tween.get(twItem);
        tw.to({ x: tipsTextPos[1][0], y: tipsTextPos[1][1] }, 250);
        tw.to({ x: tipsTextPos[1][0], y: tipsTextPos[1][1] }, 800);
        tw.to({ x: tipsTextPos[0][0], y: tipsTextPos[0][1] }, 250);
        tw.call(() => {
            tw = null;
        });

        let _tw = egret.Tween.get(_twItem);
        GameBangItemClass.youSoundEffect.play(soundName, true);
        _tw.to({ x: tipsRolePos[1][0], y: tipsRolePos[1][1] }, 250);
        // _tw.call(() => {
        //     GameBangItemClass.youSoundEffect.play(soundName, true);
        // });
        _tw.to({ x: tipsRolePos[1][0], y: tipsRolePos[1][1] }, 800);
        _tw.to({ x: tipsRolePos[0][0], y: tipsRolePos[0][1] }, 250);
        _tw.call(() => {
            GameBangItemClass.tipsState[pos] = 0;
            if (item == 0) {
                GameBangItemClass.reference = false;
            }
            _tw = null;
        });
    }

    /**
     * whether is the host
     */
    public static isHost = () => {
        if (GameBangItemClass.isOffline == true) {
            GameBangItemClass.isHost = true;
        } else {
            let str: Array<string> = App.CurrChatId.split("_");
            if (DataCenter.instance.user.id.toString() == str[0]) {
                GameBangItemClass.isHost = true;
            } else {
                GameBangItemClass.isHost = false;
            }
        }
    }

    /**
     * tips Pos manager
     */
    public static tipPosManager = (): number => {
        let temp = GameBangItemClass.tipsState;
        let array = [];
        for (let index = 0; index < temp.length; index++) {
            const element = temp[index];
            if (element == 0) {
                array.push(index);
            }
        }

        let random = App.RandomUtils.limitInteger(0, array.length - 1);
        return array[random];
    }

    /**
     * make game settings
     */
    public static makeSettings = (): string => {
        let settings: Array<Array<number>> = [
            [0, 1],
            [0, 1],
            [0, 1],
            [0, 1]
        ];
        let firstStep: number = Math.random();

        if (firstStep > 0 && firstStep <= 0.25) {
            settings[0][1] = 0;
        } else if (firstStep > 0.2 && firstStep <= 0.5) {
            settings[1][1] = 0;
        } else if (firstStep > 0.4 && firstStep <= 0.75) {
            settings[2][1] = 0;
        } else if (firstStep > 0.6 && firstStep <= 1) {
            settings[3][1] = 0;
        }

        for (let index = 0; index < 4; index++) {
            settings[index][0] = (index + 1) * 60 + App.RandomUtils.limitInteger(1, 59);
            if (settings[index][1] != 0) {
                settings[index][1] = App.RandomUtils.limitInteger(1, 3);
            }
        }

        let str: string = "";
        for (let index = 0; index < 4; index++) {
            for (let i = 0; i < 2; i++) {
                str += (settings[index][i] + "#");
            }
        }

        str = str.slice(0, str.length - 1);

        return str;
    }

    /**
     * decode settings
     */
    public static decodeSettings = (settings: string) => {
        let settingsArray: Array<Array<number>> = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ];

        let array = settings.split("#");
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (index % 2 == 0) {
                settingsArray[index / 2][0] = parseInt(element);
            } else {
                settingsArray[(index - 1) / 2][1] = parseInt(element);
            }
        }

        console.log("has get settings...");
        GameBangItemClass.gameSettings = settingsArray;
        console.log(settingsArray);
    }

    /**
     * random choose a fruit type
     */
    public static randomFruit = () => {
        let item = App.RandomUtils.randomArray(GameBangItemClass.fruitItem);
        let _item = App.RandomUtils.randomArray(GameBangItemClass.fruitItem);
        GameBangItemClass.youFruit.texture = AssetManager.getBitmap("BA_fruit_" + _item + "_png").texture;
        GameBangItemClass.otherFruit.texture = AssetManager.getBitmap("BA_fruit_" + item + "_png").texture;
        GameBangItemClass.youFruitBoom.texture = AssetManager.getBitmap("BA_boom_" + _item + "_png").texture;
        GameBangItemClass.otherFruitBoom.texture = AssetManager.getBitmap("BA_boom_" + item + "_png").texture;
    }

    /**
     * fruit animation manager
     */
    public static fruitEffectManager = (who: number) => {
        switch (who) {
            case 0:
                GameBangItemClass.youFruit.alpha = 0;
                GameBangItemClass.youFruitBoom.scaleX = 0.01;
                GameBangItemClass.youFruitBoom.scaleY = 0.01;
                GameBangItemClass.youFruitBoom.alpha = 1;
                let tw = egret.Tween.get(GameBangItemClass.youFruitBoom);
                tw.to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.quadOut);
                App.TimerManager.doTimer(2500, 1, () => {
                    GameBangItemClass.youFruitBoom.alpha = 0;
                    GameBangItemClass.youFruitBoom.scaleX = 1;
                    GameBangItemClass.youFruitBoom.scaleY = 1;
                }, GameBangLogic);
                break;
            case 1:
                GameBangItemClass.otherFruit.alpha = 0;
                GameBangItemClass.otherFruitBoom.scaleX = 0.01;
                GameBangItemClass.otherFruitBoom.scaleY = 0.01;
                GameBangItemClass.otherFruitBoom.alpha = 1;
                let _tw = egret.Tween.get(GameBangItemClass.otherFruitBoom);
                _tw.to({ scaleX: 0.5, scaleY: 0.5 }, 300, egret.Ease.quadOut);
                App.TimerManager.doTimer(2500, 1, () => {
                    GameBangItemClass.otherFruitBoom.alpha = 0;
                    GameBangItemClass.otherFruitBoom.scaleX = 0.5;
                    GameBangItemClass.otherFruitBoom.scaleY = 0.5;
                }, GameBangLogic);
                break;
            default:
                console.log("illegal fruit effect num!");
                break;
        }
    }

    /**
     * random bullet hole
     */
    public static randomBulletHole = () => {
        let randomArea = App.RandomUtils.limitInteger(0, 2);
        let x: number, y: number;
        switch (randomArea) {
            case 0:
                x = App.RandomUtils.limitInteger(0, 150);
                y = App.RandomUtils.limitInteger(455, 845);
                break;
            case 1:
                x = App.RandomUtils.limitInteger(490, 640);
                y = App.RandomUtils.limitInteger(455, 845);
                break;
            case 2:
                x = App.RandomUtils.limitInteger(215, 425);
                y = App.RandomUtils.limitInteger(470, 535);
                break;
            default:
                console.log("illegal randomArea!");
                break;
        }

        let bulletHole = AssetManager.getBitmap("BA_groundHole_png", true, true);
        bulletHole.x = x;
        bulletHole.y = y;
        GameBangMainScene.instance.addChildAt(bulletHole, 2);
    }
}