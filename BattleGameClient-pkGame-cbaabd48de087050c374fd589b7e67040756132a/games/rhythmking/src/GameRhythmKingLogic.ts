class GameRhythmKingLogic {
    public static isOffline = false;
    public static setTimeOut: number;
    public static sunShineYouTO: number;
    public static sunShineOtherTO: number;
    public static animationItem: Array<Array<any>> = [];
    public static itemCache: Array<egret.DisplayObject> = [];
    public static nowTime: number;

    /**
     * shifting manager
     */
    public static shiftingManager = (type: string): number => {
        let num: number;

        switch (type) {
            case "perfect":
                num = Math.random() * 2;
                num = parseInt(num.toString(), 10);
                break;
            case "good":
                num = Math.random() * 4 + 2;
                num = parseInt(num.toString(), 10);
                break;
            case "normal":
                num = Math.random() * 6 + 6;
                num = parseInt(num.toString(), 10);
                break;
        }

        let plus_minus = Math.random();
        if (plus_minus > 0.5) {
            num *= -1;
        }

        return num;
    }

    /**
     * background y manager
     */
    public static backgroundYManager = (isYou: boolean) => {
        let tw;
        let tw_;
        switch (isYou) {
            case true:
                tw = egret.Tween.get(GameRhythmKingItemClass.backGroundLeft);
                tw.to({ y: (GameRhythmKingItemClass.backGroundLeft.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw.call(() => {
                    tw = null;
                });

                tw_ = egret.Tween.get(GameRhythmKingItemClass.backGroundLeft_);
                tw_.to({ y: (GameRhythmKingItemClass.backGroundLeft_.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw_.call(() => {
                    tw_ = null;
                });
                break;
            case false:
                tw = egret.Tween.get(GameRhythmKingItemClass.backGroundRight);
                tw.to({ y: (GameRhythmKingItemClass.backGroundRight.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw.call(() => {
                    tw = null;
                });

                tw_ = egret.Tween.get(GameRhythmKingItemClass.backGroundRight_);
                tw_.to({ y: (GameRhythmKingItemClass.backGroundRight_.y + ((4000 - 1136) / (GameRhythmKingItemClass.usingSetting.length - 1))) }, 50);
                tw_.call(() => {
                    tw_ = null;
                });
                break;
        }

    }

    /**
     * game display manager
     */
    public static displayManager = (mode: string, who: number) => {
        let hideOther = () => {
            App.TimerManager.doTimer(200, 1, () => {
                GameRhythmKingItemClass.comboOtherType.alpha = 0;
            }, GameRhythmKingLogic);
        }

        let setPointImg = (lose?) => {
            if (GameRhythmKingLogic.setTimeOut) { clearTimeout(GameRhythmKingLogic.setTimeOut); }
            if (!lose) {
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetX = 50;
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetY = 50;
                GameRhythmKingItemClass.roadBeatCenter.texture = AssetManager.getBitmap("RK_road_beatCenterBEAT_png", true, true).texture;
            }
            GameRhythmKingLogic.setTimeOut = setTimeout(() => {
                GameRhythmKingItemClass.roadBeatCenter.texture = AssetManager.getBitmap("RK_road_beatCenter_png", true, true).texture;
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetX = 36;
                GameRhythmKingItemClass.roadBeatCenter.anchorOffsetY = 36;
                GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_normal_jpg", true, true).texture;
                GameRhythmKingItemClass.comboType.alpha = 0;
            }, 200);
        }
        switch (who) {
            case 0:
                GameRhythmKingItemClass.comboType.x = 147.5;
                GameRhythmKingItemClass.comboType.y = 1136 - GameRhythmKingItemClass.blockYouHeight + 80;
                switch (mode) {
                    case "normal":
                        GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_white_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_normal_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg();
                        GameRhythmKingLogic.backgroundYManager(true);
                        break;
                    case "perfect":
                        GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_yellow_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_perfect_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg();
                        GameRhythmKingLogic.backgroundYManager(true);
                        break;
                    case "good":
                        GameRhythmKingItemClass.rkLineMask.texture = AssetManager.getBitmap("RK_road_red_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_pointgood_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg();
                        GameRhythmKingLogic.backgroundYManager(true);
                        break;
                    case "lose":
                        GameRhythmKingItemClass.comboType.texture = AssetManager.getBitmap("RK_miss_png", true, true).texture;
                        GameRhythmKingItemClass.comboType.alpha = 1;
                        setPointImg(1);
                }
                break;
            case 1:
                GameRhythmKingItemClass.comboOtherType.x = 492.5;
                GameRhythmKingItemClass.comboOtherType.y = 1136 - GameRhythmKingItemClass.blockOtherHeight + 80;
                switch (mode) {
                    case "normal":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_normal_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        GameRhythmKingLogic.backgroundYManager(false);
                        hideOther();
                        break;
                    case "perfect":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_perfect_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        GameRhythmKingLogic.backgroundYManager(false);
                        hideOther();
                        break;
                    case "good":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_pointgood_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        GameRhythmKingLogic.backgroundYManager(false);
                        hideOther();
                        break;
                    case "lose":
                        GameRhythmKingItemClass.comboOtherType.texture = AssetManager.getBitmap("RK_miss_png", true, true).texture;
                        GameRhythmKingItemClass.comboOtherType.alpha = 1;
                        hideOther();
                }
                break;
        }
    }

    /**
     * block height switcher
     */
    public static blockHeightSwitcher = (itemHeight: number): number => {
        switch (itemHeight) {
            case 132:
                return 43;
            case 110:
                return 21;
            case 99:
                return 10;
        }
    }

    /**
     * 
     */
    public static sunShineOtherManager = () => {
        if (GameRhythmKingLogic.sunShineOtherTO) { clearTimeout(GameRhythmKingLogic.sunShineOtherTO); }
        GameRhythmKingLogic.sunShineOtherTO = setTimeout(() => {
            GameRhythmKingItemClass.sunShineOther.alpha = 0;
        }, 200);

        GameRhythmKingItemClass.sunShineOther.alpha = 1;
    }

    /**
     * tap function
     */
    public static tap = () => {
        if (GameRhythmKingLogic.sunShineYouTO) { clearTimeout(GameRhythmKingLogic.sunShineYouTO); }
        GameRhythmKingLogic.sunShineYouTO = setTimeout(() => {
            GameRhythmKingItemClass.sunShineYou.alpha = 0;
        }, 200);

        GameRhythmKingItemClass.sunShineYou.alpha = 1;

        GameRhythmKingItemClass.tapTimeStamp = GameRhythmKingItemClass.runningSec;
        GameRhythmKingItemClass.keyPressSoundEffect.play("RK_keyPress_mp3", true);
        // // console.log("press", GameRhythmKingItemClass.runningSec);
    }

    /**
     * rhythm point sum progress
     */
    public static rhythmSumManager = () => {
        GameRhythmKingItemClass.sideProgress.scaleY = (GameRhythmKingItemClass.rhythmSumPast / GameRhythmKingItemClass.rhythmSumNum);
        GameRhythmKingItemClass.otherRoleAvatar.armature.y = 1100 - (GameRhythmKingItemClass.rhythmOtherPast / GameRhythmKingItemClass.rhythmSumNum * 944);
        GameRhythmKingItemClass.myRoleAvatar.armature.y = 1100 - (GameRhythmKingItemClass.rhythmYouPast / GameRhythmKingItemClass.rhythmSumNum * 944);
    }

    public static AITick = () => {
        GameRhythmKingItemClass.AiRandom = Math.random();
        if (GameRhythmKingItemClass.AiRandom >= 0 && GameRhythmKingItemClass.AiRandom <= 0.3) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.rhythmOtherPast += 1;
            GameRhythmKingItemClass.comboOther = 0;
            GameRhythmKingItemClass.norNumOther += 1;
            GameRhythmKingItemClass.pointOtherNumber += (10 + GameRhythmKingItemClass.comboOther);
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "normal"]);
        } else if (GameRhythmKingItemClass.AiRandom > 0.3 && GameRhythmKingItemClass.AiRandom <= 0.6) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.comboOther = 0;
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingLogic.displayManager("lose", 1);
            GameRhythmKingMainScene.loseBlockManager(1);
        } else if (GameRhythmKingItemClass.AiRandom > 0.6 && GameRhythmKingItemClass.AiRandom <= 0.9) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.rhythmOtherPast += 1;
            GameRhythmKingItemClass.comboOther += 1;
            if (GameRhythmKingItemClass.comboOther > GameRhythmKingItemClass.highestOtherCombo) {
                GameRhythmKingItemClass.highestOtherCombo = GameRhythmKingItemClass.comboOther;
            }
            GameRhythmKingItemClass.goodNumOther += 1;
            GameRhythmKingItemClass.pointOtherNumber += (20 + GameRhythmKingItemClass.comboOther);
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "good"]);
        } else if (GameRhythmKingItemClass.AiRandom > 0.9 && GameRhythmKingItemClass.AiRandom <= 1) {
            GameRhythmKingLogic.sunShineOtherManager();
            GameRhythmKingItemClass.rhythmOtherPast += 1;
            GameRhythmKingItemClass.comboOther += 1;
            if (GameRhythmKingItemClass.comboOther > GameRhythmKingItemClass.highestOtherCombo) {
                GameRhythmKingItemClass.highestOtherCombo = GameRhythmKingItemClass.comboOther;
            }
            GameRhythmKingItemClass.perNumOther += 1;
            GameRhythmKingItemClass.pointOtherNumber += (30 + GameRhythmKingItemClass.comboOther);
            GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
            GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "perfect"]);
        }
    }

    /**
     * compare tick
     */
    public static compareTick = (): boolean => {
        if (GameRhythmKingItemClass.tapTimeStamp != undefined && GameRhythmKingItemClass.judgeItem != undefined) {
            let D_value = GameRhythmKingItemClass.judgeItem - GameRhythmKingItemClass.tapTimeStamp;
            if (D_value >= 0 && D_value <= 5) {
                // // console.log("perfect!", "combo:" + GameRhythmKingItemClass.comboYou, GameRhythmKingItemClass.tapTimeStamp, GameRhythmKingItemClass.judgeItem);
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                GameRhythmKingItemClass.judgeItem = undefined;
                GameRhythmKingItemClass.rhythmYouPast += 1;
                GameRhythmKingItemClass.comboYou += 1;
                if (GameRhythmKingItemClass.comboYou > GameRhythmKingItemClass.highestYouCombo) {
                    GameRhythmKingItemClass.highestYouCombo = GameRhythmKingItemClass.comboYou;
                }
                GameRhythmKingItemClass.perNumYou += 1;
                GameRhythmKingItemClass.pointYouNumber += (30 + GameRhythmKingItemClass.comboYou);
                GameRhythmKingItemClass.pointYou.text = GameRhythmKingItemClass.pointYouNumber.toString();
                GameRhythmKingItemClass.blockItemSettingsArray.push([0, "perfect"]);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_PER);
                GameRhythmKingItemClass.rippleArray.push("per");
            } else if (D_value > 0 && D_value <= 10) {
                // // console.log("good!", "combo:" + GameRhythmKingItemClass.comboYou, GameRhythmKingItemClass.tapTimeStamp, GameRhythmKingItemClass.judgeItem);
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                GameRhythmKingItemClass.judgeItem = undefined;
                GameRhythmKingItemClass.rhythmYouPast += 1;
                GameRhythmKingItemClass.comboYou += 1;
                if (GameRhythmKingItemClass.comboYou > GameRhythmKingItemClass.highestYouCombo) {
                    GameRhythmKingItemClass.highestYouCombo = GameRhythmKingItemClass.comboYou;
                }
                GameRhythmKingItemClass.goodNumYou += 1;
                GameRhythmKingItemClass.pointYouNumber += (20 + GameRhythmKingItemClass.comboYou);
                GameRhythmKingItemClass.pointYou.text = GameRhythmKingItemClass.pointYouNumber.toString();
                GameRhythmKingItemClass.blockItemSettingsArray.push([0, "good"]);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_GOOD);
                GameRhythmKingItemClass.rippleArray.push("good");
            } else if (D_value > 0 && D_value <= 14) {
                // // console.log("normal!", "combo:" + GameRhythmKingItemClass.comboYou, GameRhythmKingItemClass.tapTimeStamp, GameRhythmKingItemClass.judgeItem);
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                GameRhythmKingItemClass.judgeItem = undefined;
                GameRhythmKingItemClass.rhythmYouPast += 1;
                GameRhythmKingItemClass.comboYou = 0;
                GameRhythmKingItemClass.norNumYou += 1;
                GameRhythmKingItemClass.pointYouNumber += (10 + GameRhythmKingItemClass.comboYou);
                GameRhythmKingItemClass.pointYou.text = GameRhythmKingItemClass.pointYouNumber.toString();
                GameRhythmKingItemClass.blockItemSettingsArray.push([0, "normal"]);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_NOR);
                GameRhythmKingItemClass.rippleArray.push("nor");
            } else {
                GameRhythmKingItemClass.tapTimeStamp = undefined;
                // // console.log("lose!");
                GameRhythmKingItemClass.comboYou = 0;
                GameRhythmKingLogic.displayManager("lose", 0);
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_LOSE);
                GameRhythmKingMainScene.loseBlockManager(0);
            }
        }
        return false;
    }

    public static gameOver(result: number): void {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    /**
     * random choice
     */
    public static randomChoose = (): number => {
        let ran = Math.random();

        if (ran > 0 && ran <= 0.333) {
            return 0;
        } else if (ran > 0.333 && ran <= 0.666) {
            return 1;
        } else if (ran > 0.666 && ran < 1) {
            return 2;
        }
    }

    /**
     * settings switcher
     */
    public static settingSwitcher = (num: number) => {
        switch (num) {
            case 0:
                GameRhythmKingItemClass.usingSetting = GameRhythmKingSettingsClass.settings1[1];
                GameRhythmKingItemClass.gameLevel = GameRhythmKingSettingsClass.settings1[0];
                GameRhythmKingItemClass.rhythmSumNum = GameRhythmKingItemClass.usingSetting.length;
                GameRhythmKingItemClass.musicPlaying = "RK_music_1_mp3";
                break;
            case 1:
                GameRhythmKingItemClass.usingSetting = GameRhythmKingSettingsClass.settings2[1];
                GameRhythmKingItemClass.gameLevel = GameRhythmKingSettingsClass.settings2[0];
                GameRhythmKingItemClass.rhythmSumNum = GameRhythmKingItemClass.usingSetting.length;
                GameRhythmKingItemClass.musicPlaying = "RK_music_2_mp3";
                break;
            case 2:
                GameRhythmKingItemClass.usingSetting = GameRhythmKingSettingsClass.settings3[1];
                GameRhythmKingItemClass.gameLevel = GameRhythmKingSettingsClass.settings3[0];
                GameRhythmKingItemClass.rhythmSumNum = GameRhythmKingItemClass.usingSetting.length;
                GameRhythmKingItemClass.musicPlaying = "RK_music_3_mp3";
                break;
        }

        // console.log(GameRhythmKingItemClass.gameLevel);
    }

    /**
     * animation manager
     */
    public static animationManager = (item: egret.DisplayObject, startPos: Array<number>, endPos: Array<number>, fpsTimeInterval: number, callback: () => any) => {
        let timeInterval = fpsTimeInterval / 60 * 1000;
        let endTime = GameRhythmKingLogic.nowTime + timeInterval;
        let xSpeed = (endPos[0] - startPos[0]) / timeInterval;
        let ySpeed = (endPos[1] - startPos[1]) / timeInterval;
        GameRhythmKingLogic.animationItem.push([item, timeInterval, (GameRhythmKingLogic.nowTime), endTime, xSpeed, ySpeed, startPos, callback]);
    }

    /**
     * animation tick
     */
    public static animationTick = (sec): boolean => {
        GameRhythmKingLogic.nowTime = sec;
        if (GameRhythmKingLogic.animationItem.length > 0) {
            GameRhythmKingLogic.animationItem.forEach(element => {
                let item = element[0] as egret.DisplayObject;
                let timeInterval = element[1] as number;
                let startTime = element[2] as number;
                let endTime = element[3] as number;
                let xSpeed = element[4] as number;
                let ySpeed = element[5] as number;
                let startPos = element[6] as Array<number>;
                let callback = element[7] as () => any;

                if (sec >= endTime) {
                    if (callback) {
                        callback();
                    }
                    GameRhythmKingLogic.itemCache.push(item);
                    item.alpha = 0;
                    GameRhythmKingLogic.animationItem.shift();
                } else {
                    item.x = startPos[0] + xSpeed * (sec - startTime);
                    item.y = startPos[1] + ySpeed * (sec - startTime);
                }

            });
        }
        return true;
    }

    public static dispose = () => {
        GameRhythmKingLogic.isOffline = false;
        GameRhythmKingLogic.setTimeOut = undefined;
        GameRhythmKingLogic.animationItem = [];
        GameRhythmKingLogic.itemCache = [];
        GameRhythmKingLogic.nowTime = undefined;
    }
}