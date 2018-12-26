class GameGestureItemMaker extends egret.DisplayObjectContainer {
    private blackMask: egret.Shape = new egret.Shape();
    private gesTureArray: Array<string> = ["caret", "triangle", "circle", "pigtail", "v", "caret", "triangle", "circle", "pigtail", "v", "caret", "triangle", "circle", "pigtail", "v", "star"];
    public runningInterval: number = 1;
    public runningSec: number = 0;
    private items: number = 0;
    private teachDelta: egret.Bitmap;
    private teachV: egret.Bitmap;
    private soundArray: Array<string> = ["GT_boom1_mp3", "GT_boom2_mp3", "GT_boom3_mp3"];

    public constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 640;
        this.height = 1136;
    }

    public changeSpeed = (runningInterval: number, timeInterval: number, tweenTime = GameGestureItemClass.speedTime) => {
        this.stop();
        this.runningInterval = runningInterval;
        this.runningSec = runningInterval - 1;
        this.start(timeInterval);
        console.log("maker has change speed and now is running!");
        if (tweenTime != undefined) {
            GameGestureItemClass.speedTime = tweenTime;
        }
    }

    public start = (timeInterval = 1000) => {
        App.TimerManager.doTimer(timeInterval, 0, this.itemMaker, this);
    }

    public extraStart = (timeInterval = 10000) => {
        App.TimerManager.doTimer(timeInterval, 0, this.doubleItemMaker, this);
        console.log("doubleItemMaker now is running!");
    }

    public stop = () => {
        App.TimerManager.remove(this.itemMaker, this);
        App.TimerManager.remove(this.doubleItemMaker, this);
        console.log("maker now has stopped!");
    }

    private getTypeAndName = (): Array<string> => {
        let itemType = App.RandomUtils.randomArray(this.gesTureArray);
        let itemName: string;
        switch (itemType) {
            case "caret":
                itemName = "GT_itemA_png";
                break;
            case "triangle":
                itemName = "GT_itemDelta_png";
                break;
            case "circle":
                itemName = "GT_itemO_png";
                break;
            case "pigtail":
                itemName = "GT_itemP_png";
                break;
            case "star":
                itemName = "GT_itemStar_png";
                break;
            case "v":
                itemName = "GT_itemV_png";
                break;
            default:
                break;
        }

        return [itemType, itemName];
    }

    public itemMakeOne = (balloonNum: number, isTeach: number = 0) => {
        let newItem;
        switch (balloonNum) {
            case 1:
                let balloon = this.getTypeAndName();
                switch (isTeach) {
                    case 1:
                        newItem = new GestureItems("GT_itemV_png", "v");
                        break;
                    case 2:
                        newItem = new GestureItems("GT_itemDelta_png", "triangle");
                        break;
                    case 0:
                    default:
                        newItem = new GestureItems(balloon[1], balloon[0]);
                        break;
                }
                break;
            case 2:
                let balloon1 = this.getTypeAndName();
                let balloon2 = this.getTypeAndName();
                newItem = new GestureComplexItems(balloon1[1], balloon1[0], balloon2[1], balloon2[0]);
                break;
        }

        let halfWidth = Math.floor(newItem.width * 0.5);
        let startX = App.RandomUtils.limitInteger(halfWidth, 640 - halfWidth);
        let startY = 0;
        newItem.x = startX;
        newItem.y = startY;
        this.addChild(newItem);
        newItem.startJudge();
        GameGestureItemClass.itemList.push(newItem);
        let tw = egret.Tween.get(newItem);
        tw.to({ y: 1136 - newItem.height + 70 }, GameGestureItemClass.speedTime).call(() => {
            if (newItem) {
                newItem.alpha = 0;
                newItem.stopJudge();
                newItem.remove();
                GameGestureItemClass.leftHealthCtrlor.subtractHealth();
                GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_LOST);
                GameGestureLogic.foodManager(GameGestureItemClass.leftHealth);
                GameGestureMainScene.gesturePanel.playSoundEffect(true);
            }
        });
    }

    public itemMaker = () => {
        if (this.runningSec == this.runningInterval) {
            this.runningSec = 0;
            this.itemMakeOne(1);
            this.items += 1;

            if (this.items == 3) {
                this.changeSpeed(1, 10000);
            }
        }

        this.runningSec += 1;
    }

    public doubleItemMaker = () => {
        if (this.runningSec == this.runningInterval) {
            this.runningSec = 0;
            this.itemMakeOne(2);
        }

        this.runningSec += 1;
    }

    public playSoundEffect = (isLost: boolean = false) => {
        let item: string;
        switch (isLost) {
            case false:
                item = App.RandomUtils.randomArray(this.soundArray);
                break;
            case true:
                item = "GT_lost_mp3";
                break;
        }

        switch (GameGestureItemClass.soundWay_num) {
            case 1:
                GameGestureItemClass.soundWay_1.play(item);
                GameGestureItemClass.soundWay_num = 2;
                break;
            case 2:
                GameGestureItemClass.soundWay_2.play(item);
                GameGestureItemClass.soundWay_num = 3;
                break;
            case 3:
                GameGestureItemClass.soundWay_3.play(item);
                GameGestureItemClass.soundWay_num = 1;
                break;
        }
    }
}

class GestureItems extends egret.DisplayObjectContainer {
    public itemType: string;
    public itemName: string;
    public needJudge: boolean = true;
    private balloon: DBArmature;
    private role: DBArmature;
    private boomEffect: DBArmature;
    private tempX: number;
    private tempY: number;

    public get rightFactor(): number {
        return 0;
    }

    public set rightFactor(value: number) {
        this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX - 200) + value * value * (this.tempX - 400);
        this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
    }

    public get leftFactor(): number {
        return 0;
    }

    public set leftFactor(value: number) {
        this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX + 200) + value * value * (this.tempX + 400);
        this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
    }

    public constructor(name: string, type: string) {
        super();

        this.balloon = AssetManager.getDBArmature("GT_du1");
        this.balloon.x = 0;
        this.balloon.y = 0;
        this.balloon.getSlot("q2").display = AssetManager.getBitmap(name);
        this.addChild(this.balloon);
        this.balloon.play("du1", 0);

        this.boomEffect = AssetManager.getDBArmature("GT_yidong");
        this.boomEffect.x = 0;
        this.boomEffect.y = -100;
        this.boomEffect.alpha = 0;
        this.addChild(this.boomEffect);

        this.role = AssetManager.getDBArmature(App.RandomUtils.randomArray(GameGestureItemClass.mouseDBArray));;
        this.role.x = 0;
        this.role.y = 0;
        this.addChild(this.role);
        this.role.play("newAnimation", 0);

        this.itemName = name;
        this.itemType = type;
    }

    public dispose = () => {
        App.TimerManager.removeAll(this);
    }

    public judge = (judgeType: string) => {
        if (judgeType == this.itemType && this.needJudge == true) {
            this.stopJudge();
            this.balloon.alpha = 0;
            this.boomEffect.alpha = 1;
            if (this.boomEffect) {
                this.boomEffect.play("chi", 1);
            }
            this.remove();
            GameGestureMainScene.gesturePanel.playSoundEffect();

            let addingImg = AssetManager.getBitmap("GT_add1_png");
            addingImg.x = this.x;
            addingImg.y = this.y;
            GameGestureMainScene.instance.addChild(addingImg);
            let tw = egret.Tween.get(addingImg);
            tw.to({ y: 0, alpha: 0 }, Math.floor(this.y * 4)).call(() => {
                GameGestureMainScene.instance.removeChild(addingImg);
            });

            switch (GameGestureItemClass.isOffline) {
                case false:
                    if (GameGestureMainScene.gesturePanel.runningSec == 0) { return; };
                    GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_BREAK, [1]);
                    break;
                case true:
                    if (GameGestureMainScene.gesturePanel.runningSec == 0) { return; }
                    else if (GameGestureItemClass.runningSec >= GameGestureItemClass.autonomy) {
                        let temp = Math.random();
                        if (temp > 0 && temp < GameGestureItemClass.AiSuccess) {
                            GameGestureMainScene.gesturePanel.itemMakeOne(1);
                        } else {
                            GameGestureItemClass.rightHealthCtrlor.subtractHealth();
                        }
                    } else if (GameGestureItemClass.runningSec < GameGestureItemClass.autonomy) {
                        GameGestureMainScene.gesturePanel.itemMakeOne(1);
                    }
                    break;
            }

            GameGestureItemClass.scoreYou += Math.floor(GameGestureItemClass.gestureScore * 20);
        }
    }

    public judgeTick = () => {
        this.judge(GameGestureItemClass.gestureType);
        if (GameGestureItemClass.lowestLine < this.y) {
            GameGestureItemClass.lowestLine = this.y;
        }
    }

    public startJudge = () => {
        this.needJudge = true;
        App.TimerManager.doFrame(1, 0, this.judgeTick, this);
    }

    public stopJudge = () => {
        this.needJudge = false;
        App.TimerManager.remove(this.judgeTick, this);
    }

    public remove = () => {
        egret.Tween.removeTweens(this);
        this.tempX = this.role.x;
        this.tempY = this.role.y;
        let tw = egret.Tween.get(this);
        if (this.x <= 320) {
            tw.to({ rightFactor: 1 }, 1000).call(() => {
                GameGestureMainScene.gesturePanel.removeChild(this);
            });
        } else if (this.tempX < 320) {
            tw.to({ leftFactor: 1 }, 1000).call(() => {
                GameGestureMainScene.gesturePanel.removeChild(this);
            });
        }
    }
}

class GestureComplexItems extends egret.DisplayObjectContainer {
    public item1Type: string;
    public item1Name: string;
    public item2Type: string;
    public item2Name: string;
    public needJudgeLeft: boolean = true;
    public needJudgeRight: boolean = true;
    private balloon1: DBArmature;
    private boomEffect1: DBArmature;
    private balloon2: DBArmature;
    private boomEffect2: DBArmature;
    private role: DBArmature;
    private tempX: number;
    private tempY: number;

    public get rightFactor(): number {
        return 0;
    }

    public set rightFactor(value: number) {
        this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX - 200) + value * value * (this.tempX - 400);
        this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
    }

    public get leftFactor(): number {
        return 0;
    }

    public set leftFactor(value: number) {
        this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX + 200) + value * value * (this.tempX + 400);
        this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
    }

    public constructor(name1: string, type1: string, name2: string, type2: string) {
        super();
        console.log(name1, type1, name2, type2);
        this.balloon1 = AssetManager.getDBArmature("GT_du2");
        this.balloon1.x = 0;
        this.balloon1.y = 0;
        this.balloon1.getSlot("q2").display = AssetManager.getBitmap(name1);
        this.addChild(this.balloon1);

        this.balloon2 = AssetManager.getDBArmature("GT_du3");
        this.balloon2.x = 0;
        this.balloon2.y = 0;
        this.balloon2.getSlot("q21").display = AssetManager.getBitmap(name2);
        this.addChild(this.balloon2);

        this.boomEffect1 = AssetManager.getDBArmature("GT_yidong");
        this.boomEffect1.x = -50;
        this.boomEffect1.y = -100;
        this.boomEffect1.alpha = 0;
        this.addChild(this.boomEffect1);

        this.boomEffect2 = AssetManager.getDBArmature("GT_yidong");
        this.boomEffect2.x = 50;
        this.boomEffect2.y = -100;
        this.boomEffect2.alpha = 0;
        this.addChild(this.boomEffect2);

        this.role = AssetManager.getDBArmature("GT_king");;
        this.role.x = 0;
        this.role.y = 0;
        this.addChild(this.role);
        this.role.play("newAnimation", 0);

        this.item1Name = name1;
        this.item1Type = type1;
        this.item2Name = name2;
        this.item2Type = type2;
    }

    public dispose = () => {
        App.TimerManager.removeAll(this);
    }

    public judgeRightTick = () => {
        if (GameGestureItemClass.gestureType == this.item1Type && this.needJudgeRight == true) {
            this.stopJudgeRight();
            this.item1Type = undefined;
            this.balloon1.alpha = 0;
            this.boomEffect1.alpha = 1;
            this.boomEffect1.play("chi", 1);
            this.balloon2.play("du1", 1);
            GameGestureMainScene.gesturePanel.playSoundEffect();
            GameGestureItemClass.scoreYou += Math.floor(GameGestureItemClass.gestureScore * 20);
        }

        if (this.item1Type == undefined && this.item2Type == undefined) {
            this.stopJudge();
            this.remove();
        }

        if (GameGestureItemClass.lowestLine < this.y) {
            GameGestureItemClass.lowestLine = this.y;
        }
    }

    public judgeLeftTick = () => {
        if (GameGestureItemClass.gestureType == this.item2Type && this.needJudgeLeft == true) {
            this.stopJudgeLeft();
            this.item2Type = undefined;
            this.balloon2.alpha = 0;
            this.boomEffect2.alpha = 1;
            this.boomEffect2.play("chi", 1);
            this.balloon1.play("du1", 1);
            GameGestureMainScene.gesturePanel.playSoundEffect();
            GameGestureItemClass.scoreYou += Math.floor(GameGestureItemClass.gestureScore * 20);
        }

        if (this.item1Type == undefined && this.item2Type == undefined) {
            this.success();
            this.stopJudge();
            this.remove();
        }

        if (GameGestureItemClass.lowestLine < this.y) {
            GameGestureItemClass.lowestLine = this.y;
        }
    }

    public startJudge = () => {
        this.needJudgeLeft = true;
        this.needJudgeRight = true;
        App.TimerManager.doFrame(1, 0, this.judgeLeftTick, this);
        App.TimerManager.doFrame(1, 0, this.judgeRightTick, this);
    }

    public stopJudgeLeft = () => {
        this.needJudgeLeft = false;
        App.TimerManager.remove(this.judgeLeftTick, this);
    }

    public stopJudgeRight = () => {
        this.needJudgeRight = false;
        App.TimerManager.remove(this.judgeRightTick, this);
    }

    public stopJudge = () => {
        this.needJudgeRight = false;
        this.needJudgeLeft = false;
        App.TimerManager.remove(this.judgeRightTick, this);
        App.TimerManager.remove(this.judgeLeftTick, this);
    }

    public success = () => {

        let addingImg = AssetManager.getBitmap("GT_add2_png");
        addingImg.x = this.x;
        addingImg.y = this.y;
        GameGestureMainScene.instance.addChild(addingImg);
        let tw = egret.Tween.get(addingImg);
        tw.to({ y: 0, alpha: 0 }, Math.floor(this.y * 4)).call(() => {
            GameGestureMainScene.instance.removeChild(addingImg);
        });

        switch (GameGestureItemClass.isOffline) {
            case false:
                if (GameGestureMainScene.gesturePanel.runningSec == 0) { return; }
                GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_BREAK, [2]);
                break;
            case true:
                if (GameGestureMainScene.gesturePanel.runningSec == 0) { return; }
                else if (GameGestureItemClass.runningSec >= GameGestureItemClass.autonomy) {
                    let temp = Math.random();
                    if (temp > 0 && temp < GameGestureItemClass.AiSuccess) {
                        GameGestureMainScene.gesturePanel.itemMakeOne(2);
                    } else {
                        GameGestureItemClass.rightHealthCtrlor.subtractHealth();
                    }
                    break;
                } else if (GameGestureItemClass.runningSec < GameGestureItemClass.autonomy) {
                    GameGestureMainScene.gesturePanel.itemMakeOne(2);
                }
        }
    }

    public remove = () => {
        egret.Tween.removeTweens(this);
        this.tempX = this.role.x;
        this.tempY = this.role.y;
        let tw = egret.Tween.get(this);
        if (this.x <= 320) {
            tw.to({ rightFactor: 1 }, 1000).call(() => {
                App.TimerManager.removeAll(this);
                GameGestureMainScene.gesturePanel.removeChild(this);
            });
        } else if (this.tempX < 320) {
            tw.to({ leftFactor: 1 }, 1000).call(() => {
                App.TimerManager.removeAll(this);
                GameGestureMainScene.gesturePanel.removeChild(this);
            });
        }
    }
}

class healthCtrlor extends egret.DisplayObjectContainer {
    public health: number = 3;
    public direction: string;
    private health1: egret.Bitmap;
    private health2: egret.Bitmap;
    private health3: egret.Bitmap;

    public constructor(direction_: string) {
        super();
        this.direction = direction_;

        this.health1 = AssetManager.getBitmap("GT_health_png");
        this.health1.x = 14;
        this.health1.y = 15;
        this.health1.name = "health1";
        this.addChild(this.health1);

        this.health2 = AssetManager.getBitmap("GT_health_png");
        this.health2.x = 51;
        this.health2.y = 15;
        this.health2.name = "health2";
        this.addChild(this.health2);

        this.health3 = AssetManager.getBitmap("GT_health_png");
        this.health3.x = 88;
        this.health3.y = 15;
        this.health3.name = "health3";
        this.addChild(this.health3);
    }

    public getHealth = (): number => {
        return this.health;
    }

    public subtractHealth = (): void => {
        if (this.health > 0) {
            let tw;
            let item;
            switch (this.direction) {
                case "right":
                    item = this.getChildByName("health" + (4 - this.health).toString()) as egret.Bitmap;
                    console.log("R", "health" + (4 - this.health).toString());
                    break;
                case "left":
                    item = this.getChildByName("health" + (this.health).toString()) as egret.Bitmap;
                    console.log("L", "health" + (this.health).toString());
                    break;
            }

            this.health -= 1;

            switch (this.direction) {
                case "right":
                    GameGestureItemClass.rightHealth = this.health;
                    break;
                case "left":
                    GameGestureItemClass.leftHealth = this.health;
                    break;
            }

            tw = egret.Tween.get(item);
            tw.to({ alpha: 0, scaleX: 2, scaleY: 2 }, 250);
            tw.call(() => {
                item.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
            });
            tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 250);
        }
    }

    public setHealth = (healthNum: number): void => {
        switch (healthNum) {
            case 1:
                switch (this.direction) {
                    case "left":
                        this.health1.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                        this.health2.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                        this.health3.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                        break;
                    case "right":
                        this.health3.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                        this.health2.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                        this.health1.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                        break;
                }
                break;
            case 2:
                switch (this.direction) {
                    case "left":
                        this.health1.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                        this.health2.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                        this.health3.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                        break;
                    case "right":
                        this.health1.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                        this.health2.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                        this.health3.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                        break;
                }
                break;
            case 0:
                for (let count = 1; count <= 3; count++) {
                    (this.getChildByName("health" + (count).toString()) as egret.Bitmap).texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                }
                break;
            case 3:
                for (let n = 1; n <= 3; n++) {
                    (this.getChildByName("health" + (n).toString()) as egret.Bitmap).texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                }
                break;
        }

        this.health = healthNum;

        switch (this.direction) {
            case "left":
                GameGestureItemClass.leftHealth = this.health;
                break;
            case "right":
                GameGestureItemClass.rightHealth = this.health;
                break;
        }
    }
}