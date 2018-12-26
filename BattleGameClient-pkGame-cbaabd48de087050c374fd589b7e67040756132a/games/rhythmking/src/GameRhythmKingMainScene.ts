class GameRhythmKingMainScene extends State {

    public constructor() {
        super();
    }

    private youRoleRotation: number = 0;
    private otherRoleRotation: number = 0;

    init() {
        super.init();

        GameRhythmKingEventClass.dispose();
        GameRhythmKingItemClass.dispose();
        GameRhythmKingLogic.dispose();
        GameRhythmKingSettingsClass.dispose();

        if (DataCenter.instance.room.IsAI) {
            GameRhythmKingLogic.isOffline = true;
        }

        this.gameStart();
        App.SoundManager.stopBg();
        // App.SoundManager.playBg("PR_music_normal_mp3");
    }

    private pointRecycleManager = () => {
        if (GameRhythmKingItemClass.recycleArray.length > 30) {
            GameRhythmKingItemClass.recycleArray.forEach(element => {
                this.removeChild(element);
            });
        }

        GameRhythmKingItemClass.recycleArray = [];
    }

    public dispose(): void {
        super.dispose();
        App.TimerManager.removeAll(this);

        egret.stopTick(this.endTick, this);
        egret.stopTick(this.readyTick, this);
        egret.stopTick(this.tickLogic, this);
        egret.stopTick(GameRhythmKingLogic.animationTick, this);
        egret.stopTick(GameRhythmKingLogic.compareTick, this);

        if (GameRhythmKingItemClass.backGroundMusicPlayer) {
            GameRhythmKingItemClass.backGroundMusicPlayer.stopSound(GameRhythmKingItemClass.musicPlaying);
        }

        if (GameRhythmKingItemClass.alaphaMask) {
            GameRhythmKingItemClass.alaphaMask.removeEventListener("touchTap", GameRhythmKingLogic.tap, this);
        }

        GameRhythmKingEventClass.dispose();
        GameRhythmKingItemClass.dispose();
        GameRhythmKingLogic.dispose();
        GameRhythmKingSettingsClass.dispose();
    }

    private blockTickManager = () => {
        if (GameRhythmKingItemClass.blockItemSettingsArray.length > 0) {
            this.blockManager(GameRhythmKingItemClass.blockItemSettingsArray[GameRhythmKingItemClass.blockItemSettingsArray.length - 1][0], GameRhythmKingItemClass.blockItemSettingsArray[GameRhythmKingItemClass.blockItemSettingsArray.length - 1][1]);
        }

        if (GameRhythmKingItemClass.blockItemSettingsOtherArray.length > 0) {
            this.blockManager(GameRhythmKingItemClass.blockItemSettingsOtherArray[GameRhythmKingItemClass.blockItemSettingsOtherArray.length - 1][0], GameRhythmKingItemClass.blockItemSettingsOtherArray[GameRhythmKingItemClass.blockItemSettingsOtherArray.length - 1][1]);
        }
    }

    private addBlock = (item: egret.Bitmap, who: number, height: number, type: string) => {
        let ending: number = 0;

        switch (who) {
            case 0:
                item.x = 147.5 + GameRhythmKingLogic.shiftingManager(type);
                GameRhythmKingItemClass.blockYouHeight += height;
                ending = 1136 - GameRhythmKingItemClass.blockYouHeight;
                item.y = 300;
                GameRhythmKingItemClass.blockArray.push(item);
                break;
            case 1:
                item.x = 492.5 + GameRhythmKingLogic.shiftingManager(type);
                GameRhythmKingItemClass.blockOtherHeight += height;
                ending = 1136 - GameRhythmKingItemClass.blockOtherHeight;
                item.y = 300;
                GameRhythmKingItemClass.blockOtherArray.push(item);
                break;
        }

        this.addChild(item);

        // 显示节奏评价，层级问题必须放在此处。
        if (GameRhythmKingItemClass.blockItemSettingsArray.length > 0) {
            GameRhythmKingLogic.displayManager(GameRhythmKingItemClass.blockItemSettingsArray[0][1], 0);
            this.setChildIndex(GameRhythmKingItemClass.comboType, this.numChildren + 1);
            this.scoreEffectManager(GameRhythmKingItemClass.blockItemSettingsArray[0][1], 0);
        }

        if (GameRhythmKingItemClass.blockItemSettingsOtherArray.length > 0) {
            GameRhythmKingLogic.displayManager(GameRhythmKingItemClass.blockItemSettingsOtherArray[0][1], 1);
            this.setChildIndex(GameRhythmKingItemClass.comboOtherType, this.numChildren + 1);
            this.scoreEffectManager(GameRhythmKingItemClass.blockItemSettingsOtherArray[0][1], 1);
        }

        switch (who) {
            case 0:
                if (this.youRoleRotation >= 3) {
                    this.youRoleRotation = 0;
                }
                let r: number;
                r = this.rotationManager(this.youRoleRotation);
                this.youRoleRotation += 1;
                this.setChildIndex(GameRhythmKingItemClass.jumpRoleYou.armature, this.numChildren + 4);
                egret.Tween.removeTweens(GameRhythmKingItemClass.jumpRoleYou.armature);
                let twRoleYou = egret.Tween.get(GameRhythmKingItemClass.jumpRoleYou.armature);
                twRoleYou.to({ y: (GameRhythmKingItemClass.jumpRoleYou.armature.y - 40) }, 20);
                twRoleYou.to({ y: (1136 - GameRhythmKingItemClass.blockYouHeight + 40 + 2 * GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockArray[1])), rotation: r }, 30);
                break;
            case 1:
                if (this.otherRoleRotation >= 3) {
                    this.otherRoleRotation = 0;
                }
                let _r: number;
                _r = this.rotationManager(this.otherRoleRotation);
                this.otherRoleRotation += 1;
                this.setChildIndex(GameRhythmKingItemClass.jumpRoleOther.armature, this.numChildren + 4);
                egret.Tween.removeTweens(GameRhythmKingItemClass.jumpRoleOther.armature);
                let twRoleOther = egret.Tween.get(GameRhythmKingItemClass.jumpRoleOther.armature);
                twRoleOther.to({ y: (GameRhythmKingItemClass.jumpRoleOther.armature.y - 40) }, 20)
                twRoleOther.to({ y: (1136 - GameRhythmKingItemClass.blockOtherHeight + 40 + 2 * GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockOtherArray[1])), rotation: _r }, 30)
                break;
        }

        let tw = egret.Tween.get(item);
        tw.to({ y: ending }, 100);

        switch (who) {
            case 0:
                App.TimerManager.doTimer(30, 1, () => {
                    GameRhythmKingItemClass.sparkLeft.x = 147.5;
                    GameRhythmKingItemClass.sparkLeft.y = ending + GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockArray[1]);
                    GameRhythmKingItemClass.sparkLeft.alpha = 1;
                    App.TimerManager.doTimer(65, 1, () => {
                        GameRhythmKingItemClass.sparkLeft.alpha = 0;
                    }, this);
                }, this);
                break;
            case 1:
                App.TimerManager.doTimer(30, 1, () => {
                    GameRhythmKingItemClass.sparkRight.x = 492.5;
                    GameRhythmKingItemClass.sparkRight.y = ending + GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockOtherArray[1]);
                    GameRhythmKingItemClass.sparkRight.alpha = 1;
                    App.TimerManager.doTimer(65, 1, () => {
                        GameRhythmKingItemClass.sparkRight.alpha = 0;
                    }, this);
                }, this);
                break;
        }

        tw.call(() => {
            switch (who) {
                case 0:
                    if (GameRhythmKingItemClass.blockYouHeight > 400) {
                        GameRhythmKingItemClass.blockArray.forEach(element => {
                            let tw = egret.Tween.get(element);
                            tw.to({ y: (element.y + GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockArray[0].height)) }, 50)
                        });

                        switch (GameRhythmKingItemClass.blockArray[0].height) {
                            case 132:
                                GameRhythmKingItemClass.blockYouHeight -= 43;
                                break;
                            case 110:
                                GameRhythmKingItemClass.blockYouHeight -= 21;
                                break;
                            case 99:
                                GameRhythmKingItemClass.blockYouHeight -= 10;
                                break;
                        }
                        GameRhythmKingItemClass.jumpRoleYou.armature.y += GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockArray[0].height);
                        this.removeChild(GameRhythmKingItemClass.blockArray[0]);
                        GameRhythmKingItemClass.blockArray.shift();
                    }
                    // // console.log(GameRhythmKingItemClass.blockYouHeight, 1136 - GameRhythmKingItemClass.blockYouHeight);
                    break;
                case 1:
                    if (GameRhythmKingItemClass.blockOtherHeight > 400) {
                        GameRhythmKingItemClass.blockOtherArray.forEach(element => {
                            let tw = egret.Tween.get(element);
                            tw.to({ y: (element.y + GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockOtherArray[0].height)) }, 50)
                        });

                        switch (GameRhythmKingItemClass.blockOtherArray[0].height) {
                            case 132:
                                GameRhythmKingItemClass.blockOtherHeight -= 43;
                                break;
                            case 110:
                                GameRhythmKingItemClass.blockOtherHeight -= 21;
                                break;
                            case 99:
                                GameRhythmKingItemClass.blockOtherHeight -= 10;
                                break;
                        }
                        GameRhythmKingItemClass.jumpRoleOther.armature.y += GameRhythmKingLogic.blockHeightSwitcher(GameRhythmKingItemClass.blockOtherArray[0].height);
                        this.removeChild(GameRhythmKingItemClass.blockOtherArray[0]);
                        GameRhythmKingItemClass.blockOtherArray.shift();
                    }
                    break;
            }
            // // console.log("arrived!")
        })
    }

    private rotationManager = (num: number): number => {
        let rotation: number = 0;
        switch (num) {
            case 0:
                rotation = 15;
                break;
            case 1:
                rotation = 0;
                break;
            case 2:
                rotation = 345;
                break;
        }

        return rotation;
    }

    public static effectiveHeight = (type): number => {
        let blockEffectiveHeight: number = 0;
        switch (type) {
            case "perfect":
                blockEffectiveHeight = 43;
                break;
            case "good":
                blockEffectiveHeight = 21;
                break;
            case "normal":
                blockEffectiveHeight = 10;
                break;
        }

        return blockEffectiveHeight;
    }

    public blockManager = (who: number, type: string) => {
        let block = new egret.Bitmap();
        let blockEffectiveHeight: number = 0;

        switch (type) {
            case "perfect":
                block = AssetManager.getBitmap("RK_block_perfect_png", true, false);
                blockEffectiveHeight = 43;
                break;
            case "good":
                block = AssetManager.getBitmap("RK_block_sliver_png", true, false);
                blockEffectiveHeight = 21;
                break;
            case "normal":
                block = AssetManager.getBitmap("RK_block_normal_png", true, false);
                blockEffectiveHeight = 10;
                break;
        }

        // block.anchorOffsetY = block.height;
        switch (who) {
            case 0: // yourself
                this.addBlock(block, 0, blockEffectiveHeight, type);
                GameRhythmKingItemClass.blockItemSettingsArray.shift();
                break;
            case 1: // other
                this.addBlock(block, 1, blockEffectiveHeight, type);
                GameRhythmKingItemClass.blockItemSettingsOtherArray.shift();
                break;
        }
    }

    /**
     * game progress manager
     */
    private gameProgressManager = () => {
        if (GameRhythmKingItemClass.usingSetting.length <= GameRhythmKingItemClass.rhythmSumPast) {
            // // console.log(GameRhythmKingItemClass.usingSetting.length, GameRhythmKingItemClass.rhythmSumPast);
            egret.startTick(this.endTick, this);
            App.TimerManager.doTimer(1000, 1, () => {
                GameRhythmKingItemClass.gameOverState[0] = 1;
                egret.stopTick(this.tickLogic, this);
            }, this);
            //xxx
            if (GameRhythmKingLogic.isOffline == false) {
                GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_MUSIC_END);
            } else {
                GameRhythmKingItemClass.gameOverState[1] = 1;
            }
        }
    }

    /**
     * Ripple effect manager
     */
    private rippleEffectManager = () => {
        if (GameRhythmKingItemClass.rippleArray.length > 0) {
            let rippleImg;
            let rippleTw: egret.Tween;
            switch (GameRhythmKingItemClass.rippleArray[0]) {
                default:
                    GameRhythmKingItemClass.rippleArray.shift();
                    rippleImg = AssetManager.getBitmap("RK_road_beatCenterRipple_png", true, true);
                    rippleImg.x = 320;
                    rippleImg.y = 865;
                    rippleImg.alpha = 1;
                    this.addChild(rippleImg);
                    rippleTw = egret.Tween.get(rippleImg);
                    rippleTw.to({ scaleX: 3, scaleY: 3, alpha: 0 }, 1000);
                    rippleTw.call(() => {
                        this.removeChild(rippleImg);
                        rippleImg = null;
                        rippleTw = null;
                    });
                    break;
            }
        }
    }

    /**
     * tick logic
     */
    public tickLogic = (sec): boolean => {
        if (GameRhythmKingItemClass.runningSec == 0) { //xxx
            GameRhythmKingItemClass.backGroundMusicPlayer.play(GameRhythmKingItemClass.musicPlaying);
        }
        this.judgePool();
        this.itemMaker();
        this.pointRecycleManager();
        GameRhythmKingLogic.compareTick();
        this.blockTickManager();
        this.comboTextManager();
        GameRhythmKingLogic.rhythmSumManager();
        this.rippleEffectManager();

        this.setChildIndex(GameRhythmKingItemClass.bottomSide, this.numChildren);
        this.setChildIndex(GameRhythmKingItemClass.alaphaMask, this.numChildren + 2);
        if (this.getChildByName("backBtn")) {
            this.setChildIndex(this.getChildByName("backBtn"), this.numChildren + 3);
        }

        GameRhythmKingItemClass.runningSec += 1;

        this.gameProgressManager();
        return true;
    }

    /**
     * judge pool
     */
    public judgePool = () => {
        GameRhythmKingItemClass.usingSetting.forEach(element => {
            if (GameRhythmKingItemClass.runningSec == (element - 15)) {
                GameRhythmKingItemClass.judgeItem = element;
            }
        });
    }

    /**
     * recycle point
     */
    private pointRecycle = () => {
        if (GameRhythmKingLogic.itemCache.length > 30) {
            GameRhythmKingLogic.itemCache.forEach(element => {
                this.removeChild(element);
            });

            GameRhythmKingLogic.itemCache = [];
        }
    }

    /**
     * Rhythm items maker
     */
    public itemMaker = () => {
        GameRhythmKingItemClass.usingSetting.forEach(element => {
            if (element == (GameRhythmKingItemClass.runningSec + GameRhythmKingItemClass.speedSupplement)) {
                let items = AssetManager.getBitmap("RK_beat_png", true, true);
                items.x = 320;
                items.y = 0;
                this.addChildAt(items, 9);

                GameRhythmKingLogic.animationManager(items, [items.x, items.y], [items.x, 875], GameRhythmKingItemClass.speedSupplement, () => {

                    if (GameRhythmKingLogic.isOffline == true) {
                        GameRhythmKingLogic.AITick();
                    }
                    this.pointRecycle();
                    GameRhythmKingItemClass.rhythmSumPast += 1;
                });
            }
        });
    }

    /**
     * score effect manager
     */
    private scoreEffectManager = (mode: string, who: number) => {
        let scoreImg: egret.Bitmap;
        // // console.log(mode);
        switch (who) {
            case 0:
                switch (mode) {
                    case "normal":
                        scoreImg = AssetManager.getBitmap("RK_point10_png", true, false);
                        break;
                    case "perfect":
                        scoreImg = AssetManager.getBitmap("RK_point30_png", true, false);
                        break;
                    case "good":
                        scoreImg = AssetManager.getBitmap("RK_point20_png", true, false);
                        break;
                    case "lose":
                        break;
                }
                scoreImg.x = 138.5;
                scoreImg.y = 230;
                break;
            case 1:
                switch (mode) {
                    case "normal":
                        scoreImg = AssetManager.getBitmap("RK_point10_png", true, false);
                        break;
                    case "perfect":
                        scoreImg = AssetManager.getBitmap("RK_point30_png", true, false);
                        break;
                    case "good":
                        scoreImg = AssetManager.getBitmap("RK_point20_png", true, false);
                        break;
                    case "lose":
                        break;
                }
                scoreImg.x = 500;
                scoreImg.y = 230;
                break;
        }

        this.addChild(scoreImg);
        let tw = egret.Tween.get(scoreImg);
        tw.to({ scaleX: 1.3, scaleY: 1.3 }, 200);
        tw.to({ scaleX: 1, scaleY: 1 }, 300);
        tw.to({ y: 150, alpha: 0.1, scaleX: 0.8, scaleY: 0.8 }, 1000);
        tw.call(() => {
            this.removeChild(scoreImg);
        });
    }

    /**
     * combo text manager
     */
    private comboTextManager = () => {
        if (GameRhythmKingItemClass.comboYou >= 2) {
            GameRhythmKingItemClass.comboYouText.alpha = 1;
            GameRhythmKingItemClass.comboYouImage.alpha = 1;
            GameRhythmKingItemClass.comboYouText.text = GameRhythmKingItemClass.comboYou.toString();
        } else if (GameRhythmKingItemClass.comboYou < 2) {
            GameRhythmKingItemClass.comboYouText.alpha = 0;
            GameRhythmKingItemClass.comboYouImage.alpha = 0;
        }

        if (GameRhythmKingItemClass.comboOther >= 2) {
            GameRhythmKingItemClass.comboOtherText.alpha = 1;
            GameRhythmKingItemClass.comboOtherImage.alpha = 1;
            GameRhythmKingItemClass.comboOtherText.text = GameRhythmKingItemClass.comboOther.toString();
        } else if (GameRhythmKingItemClass.comboOther < 2) {
            GameRhythmKingItemClass.comboOtherText.alpha = 0;
            GameRhythmKingItemClass.comboOtherImage.alpha = 0;
        }
    }

    private bitmapText = (font: egret.BitmapFont) => {
        GameRhythmKingItemClass.comboYouText.font = font;
        GameRhythmKingItemClass.comboYouText.text = "0";
        GameRhythmKingItemClass.comboYouText.textAlign = egret.HorizontalAlign.CENTER;
        GameRhythmKingItemClass.comboYouText.x = 135;
        GameRhythmKingItemClass.comboYouText.y = 112;
        GameRhythmKingItemClass.comboYouText.letterSpacing = -30;
        GameRhythmKingItemClass.comboYouText.alpha = 0;
        this.addChild(GameRhythmKingItemClass.comboYouText);

        GameRhythmKingItemClass.comboOtherText.font = font;
        GameRhythmKingItemClass.comboOtherText.text = "0";
        GameRhythmKingItemClass.comboOtherText.textAlign = egret.HorizontalAlign.CENTER;
        GameRhythmKingItemClass.comboOtherText.x = 509;
        GameRhythmKingItemClass.comboOtherText.y = 112;
        GameRhythmKingItemClass.comboOtherText.letterSpacing = -30;
        GameRhythmKingItemClass.comboOtherText.alpha = 0;
        this.addChild(GameRhythmKingItemClass.comboOtherText);
    }

    private whitebitmapText = (font: egret.BitmapFont) => {
        GameRhythmKingItemClass.whiteFont = font;
    }

    /**
     * message deal
     */
    private messageDeal = (data: any) => {
        // // console.log(App.CurrChatId);
        let cmdString: Array<string>;
        cmdString = data.event.split("|");

        if (cmdString[0] == GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS) {
            if (App.CurrChatId.split("_")[0] == data.userId) {
                GameRhythmKingItemClass.choice = parseInt(cmdString[1]);
                // console.log("get settings : " + cmdString[1]);
            }
        } else {
            if (data.userId == DataCenter.instance.user.id) {
                return;
            }

            switch (cmdString[0]) {
                case GameRhythmKingEventClass.EVEVT_READY:
                    GameRhythmKingItemClass.readyState[1] = 1;
                    break;
                case GameRhythmKingEventClass.EVENT_PER:
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
                    break;
                case GameRhythmKingEventClass.EVENT_GOOD:
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
                    break;
                case GameRhythmKingEventClass.EVENT_NOR:
                    GameRhythmKingLogic.sunShineOtherManager();
                    GameRhythmKingItemClass.rhythmOtherPast += 1;
                    GameRhythmKingItemClass.comboOther = 0;
                    GameRhythmKingItemClass.norNumOther += 1;
                    GameRhythmKingItemClass.pointOtherNumber += (10 + GameRhythmKingItemClass.comboOther);
                    GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
                    GameRhythmKingItemClass.blockItemSettingsOtherArray.push([1, "normal"]);
                    break;
                case GameRhythmKingEventClass.EVENT_LOSE:
                    GameRhythmKingLogic.sunShineOtherManager();
                    GameRhythmKingItemClass.comboOther = 0;
                    GameRhythmKingItemClass.pointOther.text = GameRhythmKingItemClass.pointOtherNumber.toString();
                    GameRhythmKingLogic.displayManager("lose", 1);
                    GameRhythmKingMainScene.loseBlockManager(1);
                    break;
                case GameRhythmKingEventClass.EVENT_MUSIC_END:
                    GameRhythmKingItemClass.gameOverState[1] = 1;
                    break;
            }
        }
    }

    private readyTick = (): boolean => {
        // console.log(GameRhythmKingLogic.isOffline);
        if (GameRhythmKingLogic.isOffline == false) {

            // console.log("ready state: " + GameRhythmKingItemClass.readyState[0], GameRhythmKingItemClass.readyState[1]);

            if (GameRhythmKingItemClass.usingSetting.length > 0 && GameRhythmKingItemClass.gameLevel != 0 && GameRhythmKingItemClass.rhythmSumNum != 0) {
                // console.log("time to go!");
                App.TimerManager.doTimer(1000, 1, () => {
                    this.waitingSceneManager("remove");
                }, this);
                egret.stopTick(this.readyTick, this);

                return false;
            }

            if (GameRhythmKingItemClass.readyState[0] == 1 && GameRhythmKingItemClass.readyState[1] == 1) {
                GameRhythmKingLogic.settingSwitcher(GameRhythmKingItemClass.choice);
                // GameRhythmKingLogic.settingSwitcher(2);
            }
        } else if (GameRhythmKingLogic.isOffline == true) {

            egret.stopTick(this.readyTick, this);

            GameRhythmKingLogic.settingSwitcher(GameRhythmKingLogic.randomChoose());
            App.TimerManager.doTimer(2500, 1, () => {
                this.waitingSceneManager("remove");
            }, this);
        }

        return false;
    }

    private endTick = (): boolean => {
        if (GameRhythmKingLogic.isOffline == true) {
            GameRhythmKingItemClass.gameOverState[1] = 1;
        }

        // console.log(GameRhythmKingItemClass.gameOverState[0], GameRhythmKingItemClass.gameOverState[1]);
        if (GameRhythmKingItemClass.gameOverState[0] == 1 && GameRhythmKingItemClass.gameOverState[1] == 1) {
            // console.log("both side has go end!");
            egret.stopTick(this.endTick, this);
            App.TimerManager.doTimer(500, 1, () => {
                this.showResult()
            }, this);
        }


        return false;
    }

    private showResult = () => {
        this.addChild(GameRhythmKingItemClass.waitingSceneMask);
        this.setChildIndex(GameRhythmKingItemClass.waitingSceneMask, this.numChildren);
        GameRhythmKingItemClass.waitingSceneMask.alpha = 0.9;
        this.removeChild(GameRhythmKingItemClass.alaphaMask);

        GameRhythmKingItemClass.resultYouBoard = AssetManager.getBitmap("RK_resultBlock_png", true, true);
        GameRhythmKingItemClass.resultYouBoard.x = 135;
        GameRhythmKingItemClass.resultYouBoard.y = 665;
        this.addChild(GameRhythmKingItemClass.resultYouBoard);

        GameRhythmKingItemClass.resultOtherBoard = AssetManager.getBitmap("RK_resultBlock_png", true, true);
        GameRhythmKingItemClass.resultOtherBoard.x = 505;
        GameRhythmKingItemClass.resultOtherBoard.y = 665;
        this.addChild(GameRhythmKingItemClass.resultOtherBoard);

        let youScore = new egret.BitmapText();
        youScore.font = GameRhythmKingItemClass.whiteFont;
        youScore.text = GameRhythmKingItemClass.pointYouNumber.toString();
        youScore.textAlign = egret.HorizontalAlign.RIGHT;
        youScore.letterSpacing = -10;
        youScore.x = 135;
        youScore.y = 495;
        this.addChild(youScore);
        GameRhythmKingItemClass.resultYouText.push(youScore);

        let youCombo = new egret.BitmapText();
        youCombo.font = GameRhythmKingItemClass.whiteFont;
        youCombo.text = GameRhythmKingItemClass.highestYouCombo.toString();
        youCombo.textAlign = egret.HorizontalAlign.RIGHT;
        youCombo.letterSpacing = -10;
        youCombo.x = 135;
        youCombo.y = 571;
        this.addChild(youCombo);
        GameRhythmKingItemClass.resultYouText.push(youCombo);

        let youPer = new egret.BitmapText();
        youPer.font = GameRhythmKingItemClass.whiteFont;
        youPer.text = GameRhythmKingItemClass.perNumYou.toString();
        youPer.textAlign = egret.HorizontalAlign.RIGHT;
        youPer.letterSpacing = -10;
        youPer.x = 135;
        youPer.y = 643;
        this.addChild(youPer);
        GameRhythmKingItemClass.resultYouText.push(youPer);

        let youGood = new egret.BitmapText();
        youGood.font = GameRhythmKingItemClass.whiteFont;
        youGood.text = GameRhythmKingItemClass.goodNumYou.toString();
        youGood.textAlign = egret.HorizontalAlign.RIGHT;
        youGood.letterSpacing = -10;
        youGood.x = 135;
        youGood.y = 721;
        this.addChild(youGood);
        GameRhythmKingItemClass.resultYouText.push(youGood);

        let youNor = new egret.BitmapText();
        youNor.font = GameRhythmKingItemClass.whiteFont;
        youNor.text = GameRhythmKingItemClass.norNumYou.toString();
        youNor.textAlign = egret.HorizontalAlign.RIGHT;
        youNor.letterSpacing = -10;
        youNor.x = 135;
        youNor.y = 794;
        this.addChild(youNor);
        GameRhythmKingItemClass.resultYouText.push(youNor);

        let otherScore = new egret.BitmapText();
        otherScore.font = GameRhythmKingItemClass.whiteFont;
        otherScore.text = GameRhythmKingItemClass.pointOtherNumber.toString();
        otherScore.textAlign = egret.HorizontalAlign.RIGHT;
        otherScore.letterSpacing = -10;
        otherScore.x = 505;
        otherScore.y = 495;
        this.addChild(otherScore);
        GameRhythmKingItemClass.resultYouText.push(otherScore);

        let otherCombo = new egret.BitmapText();
        otherCombo.font = GameRhythmKingItemClass.whiteFont;
        otherCombo.text = GameRhythmKingItemClass.highestOtherCombo.toString();
        otherCombo.textAlign = egret.HorizontalAlign.RIGHT;
        otherCombo.letterSpacing = -10;
        otherCombo.x = 505;
        otherCombo.y = 571;
        this.addChild(otherCombo);
        GameRhythmKingItemClass.resultYouText.push(otherCombo);

        let otherPer = new egret.BitmapText();
        otherPer.font = GameRhythmKingItemClass.whiteFont;
        otherPer.text = GameRhythmKingItemClass.perNumOther.toString();
        otherPer.textAlign = egret.HorizontalAlign.RIGHT;
        otherPer.letterSpacing = -10;
        otherPer.x = 505;
        otherPer.y = 643;
        this.addChild(otherPer);
        GameRhythmKingItemClass.resultYouText.push(otherPer);

        let otherGood = new egret.BitmapText();
        otherGood.font = GameRhythmKingItemClass.whiteFont;
        otherGood.text = GameRhythmKingItemClass.goodNumOther.toString();
        otherGood.textAlign = egret.HorizontalAlign.RIGHT;
        otherGood.letterSpacing = -10;
        otherGood.x = 505;
        otherGood.y = 721;
        this.addChild(otherGood);
        GameRhythmKingItemClass.resultYouText.push(otherGood);

        let otherNor = new egret.BitmapText();
        otherNor.font = GameRhythmKingItemClass.whiteFont;
        otherNor.text = GameRhythmKingItemClass.norNumOther.toString();
        otherNor.textAlign = egret.HorizontalAlign.RIGHT;
        otherNor.letterSpacing = -10;
        otherNor.x = 505;
        otherNor.y = 794;
        this.addChild(otherNor);
        GameRhythmKingItemClass.resultYouText.push(otherNor);

        let result = this.rankCalculator();

        let rankYou = new egret.Bitmap();
        let rankOther = new egret.Bitmap();

        switch (result[0]) {
            case 1:
                rankYou = AssetManager.getBitmap("RK_rankA_png", true, true);
                break;
            case 2:
                rankYou = AssetManager.getBitmap("RK_rankS_png", true, true);
                break;
            case 3:
                rankYou = AssetManager.getBitmap("RK_rankSS_png", true, true);
                break;
            case 4:
                rankYou = AssetManager.getBitmap("RK_rankSSS_png", true, true);
                break;
        }

        switch (result[1]) {
            case 1:
                rankOther = AssetManager.getBitmap("RK_rankA_png", true, true);
                break;
            case 2:
                rankOther = AssetManager.getBitmap("RK_rankS_png", true, true);
                break;
            case 3:
                rankOther = AssetManager.getBitmap("RK_rankSS_png", true, true);
                break;
            case 4:
                rankOther = AssetManager.getBitmap("RK_rankSSS_png", true, true);
                break;
        }

        rankYou.x = 135;
        rankYou.y = 215;
        rankYou.alpha = 0;
        this.addChild(rankYou);

        rankOther.x = 505;
        rankOther.y = 215;
        rankOther.alpha = 0;
        this.addChild(rankOther);

        let tw = egret.Tween.get(rankYou);
        tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
        tw.to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.elasticInOut);

        let _tw = egret.Tween.get(rankOther);
        _tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
        _tw.to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.elasticInOut);
        _tw.call(() => {
            App.TimerManager.doTimer(2000, 1, () => {
                if (GameRhythmKingItemClass.pointYouNumber > GameRhythmKingItemClass.pointOtherNumber) {
                    GameRhythmKingLogic.gameOver(3);
                } else if (GameRhythmKingItemClass.pointYouNumber < GameRhythmKingItemClass.pointOtherNumber) {
                    GameRhythmKingLogic.gameOver(1);
                } else {
                    GameRhythmKingLogic.gameOver(1);
                }
            }, this);
        });
    }

    private rankCalculator = (): Array<number> => {
        let result: Array<number> = [0, 0];

        let percentYou = (GameRhythmKingItemClass.goodNumYou + GameRhythmKingItemClass.perNumYou) / (GameRhythmKingItemClass.rhythmSumNum - 1);
        if (percentYou <= 0.5) {
            result[0] = 1;
        } else if (percentYou > 0.5 && percentYou <= 0.7) {
            result[0] = 2;
        } else if (percentYou > 0.7 && percentYou <= 0.9) {
            result[0] = 3;
        } else if (percentYou > 0.9) {
            result[0] = 4;
        }

        let percentOther = (GameRhythmKingItemClass.goodNumOther + GameRhythmKingItemClass.perNumOther) / (GameRhythmKingItemClass.rhythmSumNum - 1);
        if (percentOther <= 0.5) {
            result[1] = 1;
        } else if (percentOther > 0.5 && percentOther <= 0.7) {
            result[1] = 2;
        } else if (percentOther > 0.7 && percentOther <= 0.9) {
            result[1] = 3;
        } else if (percentOther > 0.9) {
            result[1] = 4;
        }

        return result;
    }

    /**
     * result deal
     */
    private resultDeal = (data: any) => {
        // console.log(data);

        egret.stopTick(this.endTick, this);
        egret.stopTick(this.readyTick, this);
        egret.stopTick(this.tickLogic, this);
        egret.stopTick(GameRhythmKingLogic.animationTick, this);
        egret.stopTick(GameRhythmKingLogic.compareTick, this);

        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", null);
    }

    public waitingSceneManager = (type: string) => {
        switch (type) {
            case "add":
                GameRhythmKingItemClass.waitingSceneMask = new egret.Shape();
                GameRhythmKingItemClass.waitingSceneMask.graphics.beginFill(0x000000, 0.9);
                GameRhythmKingItemClass.waitingSceneMask.graphics.drawRect(0, 0, 640, 1136);
                GameRhythmKingItemClass.waitingSceneMask.graphics.endFill();
                this.addChild(GameRhythmKingItemClass.waitingSceneMask);

                GameRhythmKingItemClass.waitingText = AssetManager.getBitmap("RK_waiting_png", true, true);
                GameRhythmKingItemClass.waitingText.x = 320;
                GameRhythmKingItemClass.waitingText.y = 800;
                this.addChild(GameRhythmKingItemClass.waitingText);

                let soundTips = AssetManager.getBitmap("RK_soundTips_png", true, false);
                soundTips.x = 320;
                soundTips.y = 280;
                soundTips.name = "soundTips";
                this.addChild(soundTips);
                break;
            case "remove":
                if (GameRhythmKingItemClass.waitingSceneMask) {
                    switch (GameRhythmKingItemClass.gameLevel) {
                        case 1:
                            let star = AssetManager.getBitmap("RK_stars_png", true, true);
                            star.x = 320;
                            star.y = 490;
                            GameRhythmKingItemClass.stars[0] = star;
                            this.addChild(star);
                            break;
                        case 2:
                            let star2_1 = AssetManager.getBitmap("RK_stars_png", true, true);
                            star2_1.x = 260;
                            star2_1.y = 490;
                            GameRhythmKingItemClass.stars[0] = star2_1;
                            this.addChild(star2_1);

                            let star2_2 = AssetManager.getBitmap("RK_stars_png", true, true);
                            star2_2.x = 380;
                            star2_2.y = 490;
                            GameRhythmKingItemClass.stars[1] = star2_2;
                            this.addChild(star2_2);
                            break;
                        case 3:
                            let star3_1 = AssetManager.getBitmap("RK_stars_png", true, true);
                            star3_1.x = 213;
                            star3_1.y = 490;
                            GameRhythmKingItemClass.stars[0] = star3_1;
                            this.addChild(star3_1);

                            let star3_2 = AssetManager.getBitmap("RK_stars_png", true, true);
                            star3_2.x = 320;
                            star3_2.y = 490;
                            GameRhythmKingItemClass.stars[1] = star3_2;
                            this.addChild(star3_2);

                            let star3_3 = AssetManager.getBitmap("RK_stars_png", true, true);
                            star3_3.x = 426;
                            star3_3.y = 490;
                            GameRhythmKingItemClass.stars[2] = star3_3;
                            this.addChild(star3_3);
                            break;
                    }

                    let waitingTextTw = egret.Tween.get(GameRhythmKingItemClass.waitingText);
                    waitingTextTw.to({ alpha: 0 }, 500);
                    let soundTipsTw = egret.Tween.get(this.getChildByName("soundTips"));
                    soundTipsTw.to({ alpha: 0 }, 500);

                    GameRhythmKingItemClass.starBoard = AssetManager.getBitmap("RK_startBoard_png", true, true);
                    GameRhythmKingItemClass.starBoard.x = 320;
                    GameRhythmKingItemClass.starBoard.y = 490;
                    GameRhythmKingItemClass.starBoard.alpha = 0;
                    this.addChild(GameRhythmKingItemClass.starBoard);
                    let starBoardTw = egret.Tween.get(GameRhythmKingItemClass.starBoard);
                    starBoardTw.to({ alpha: 1 }, 300);
                    starBoardTw.call(() => {
                        GameRhythmKingItemClass.stars.forEach(element => {
                            this.addChild(element);
                        });
                    });

                    let maskTw = egret.Tween.get(GameRhythmKingItemClass.waitingSceneMask);
                    maskTw.to({ alpha: 0 }, 3000);
                    maskTw.call(() => {
                        GameRhythmKingItemClass.stars.forEach(element => {
                            this.removeChild(element);
                        });
                        this.removeChild(GameRhythmKingItemClass.starBoard);
                        this.removeChild(GameRhythmKingItemClass.waitingSceneMask);

                        GameRhythmKingItemClass.gameReady.play();
                        this.addChild(GameRhythmKingItemClass.gameReady);
                    });
                }
                break;
        }
    }

    public static loseBlockManager = (who: number) => {
        let tw;
        switch (who) {
            case 0:
                egret.Tween.removeTweens(GameRhythmKingItemClass.loseBlockYou);
                GameRhythmKingItemClass.loseBlockYou.y = 300;
                tw = egret.Tween.get(GameRhythmKingItemClass.loseBlockYou);
                GameRhythmKingItemClass.loseBlockYou.alpha = 1;
                break;
            case 1:
                egret.Tween.removeTweens(GameRhythmKingItemClass.loseBlockOther);
                GameRhythmKingItemClass.loseBlockOther.y = 300;
                tw = egret.Tween.get(GameRhythmKingItemClass.loseBlockOther);
                GameRhythmKingItemClass.loseBlockOther.alpha = 1;
                break;
        }

        tw.to({ y: 1136 - GameRhythmKingItemClass.blockYouHeight + 40 + 2 * GameRhythmKingMainScene.effectiveHeight(GameRhythmKingItemClass.blockArray[1]) - 118 }, 100);
        tw.call(() => {
            switch (who) {
                case 0:
                    GameRhythmKingItemClass.loseBlockYou.alpha = 0;
                    GameRhythmKingItemClass.loseBlockYou.y = 300;
                    break;
                case 1:
                    GameRhythmKingItemClass.loseBlockOther.alpha = 0;
                    GameRhythmKingItemClass.loseBlockOther.y = 300;
                    break;
            }
        });
    }

    public gameStart = () => {
        //游戏内事件返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.messageDeal, this);
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.resultDeal, this);

        egret.startTick(this.readyTick, this);

        GameRhythmKingItemClass.backGroundLeft = AssetManager.getBitmap("RK_dynamicBackGround_jpg", false, false);
        GameRhythmKingItemClass.backGroundLeft.x = 0;
        GameRhythmKingItemClass.backGroundLeft.y = -863;
        GameRhythmKingItemClass.backGroundLeft.anchorOffsetX = 0;
        GameRhythmKingItemClass.backGroundLeft.anchorOffsetY = 0;
        this.addChildAt(GameRhythmKingItemClass.backGroundLeft, 0);

        GameRhythmKingItemClass.backGroundRight = AssetManager.getBitmap("RK_dynamicBackGround_jpg", false, false);
        GameRhythmKingItemClass.backGroundRight.x = 320;
        GameRhythmKingItemClass.backGroundRight.y = -863;
        GameRhythmKingItemClass.backGroundRight.anchorOffsetX = 0;
        GameRhythmKingItemClass.backGroundRight.anchorOffsetY = 0;
        this.addChildAt(GameRhythmKingItemClass.backGroundRight, 1);

        GameRhythmKingItemClass.backGroundLeft_ = AssetManager.getBitmap("RK_dynamicBackGround__jpg", false, false);
        GameRhythmKingItemClass.backGroundLeft_.x = 0;
        GameRhythmKingItemClass.backGroundLeft_.y = -2863;
        GameRhythmKingItemClass.backGroundLeft_.anchorOffsetX = 0;
        GameRhythmKingItemClass.backGroundLeft_.anchorOffsetY = 0;
        this.addChildAt(GameRhythmKingItemClass.backGroundLeft_, 2);

        GameRhythmKingItemClass.backGroundRight_ = AssetManager.getBitmap("RK_dynamicBackGround__jpg", false, false);
        GameRhythmKingItemClass.backGroundRight_.x = 320;
        GameRhythmKingItemClass.backGroundRight_.y = -2863;
        GameRhythmKingItemClass.backGroundRight_.anchorOffsetX = 0;
        GameRhythmKingItemClass.backGroundRight_.anchorOffsetY = 0;
        this.addChildAt(GameRhythmKingItemClass.backGroundRight_, 3);

        GameRhythmKingItemClass.sunShineYou = AssetManager.getBitmap("RK_sunShine_png", true, false);
        GameRhythmKingItemClass.sunShineYou.x = 135;
        GameRhythmKingItemClass.sunShineYou.y = 547;
        GameRhythmKingItemClass.sunShineYou.alpha = 0;
        this.addChildAt(GameRhythmKingItemClass.sunShineYou, 4);

        GameRhythmKingItemClass.sunShineOther = AssetManager.getBitmap("RK_sunShine_png", true, false);
        GameRhythmKingItemClass.sunShineOther.x = 505;
        GameRhythmKingItemClass.sunShineOther.y = 547;
        GameRhythmKingItemClass.sunShineOther.alpha = 0;
        this.addChildAt(GameRhythmKingItemClass.sunShineOther, 5);

        GameRhythmKingItemClass.rkLine = AssetManager.getBitmap("RK_road_normal_jpg", true, false);
        GameRhythmKingItemClass.rkLine.x = 320;
        GameRhythmKingItemClass.rkLine.y = 0;
        this.addChildAt(GameRhythmKingItemClass.rkLine, 6);

        GameRhythmKingItemClass.rkLineMask = AssetManager.getBitmap("RK_road_normal_jpg", true, false);
        GameRhythmKingItemClass.rkLineMask.x = 320;
        GameRhythmKingItemClass.rkLineMask.y = 0;
        this.addChildAt(GameRhythmKingItemClass.rkLineMask, 7);

        GameRhythmKingItemClass.pointBoardYou = AssetManager.getBitmap("RK_pointBoard_blue_png", false, false);
        GameRhythmKingItemClass.pointBoardYou.x = 36;
        GameRhythmKingItemClass.pointBoardYou.y = 23;
        this.addChild(GameRhythmKingItemClass.pointBoardYou);

        GameRhythmKingItemClass.pointBoardOther = AssetManager.getBitmap("RK_pointBoard_red_png", false, false);
        GameRhythmKingItemClass.pointBoardOther.x = 398;
        GameRhythmKingItemClass.pointBoardOther.y = 23;
        this.addChild(GameRhythmKingItemClass.pointBoardOther);

        GameRhythmKingItemClass.you = AssetManager.getBitmap("RK_you_png", false, false);
        GameRhythmKingItemClass.you.x = 22;
        GameRhythmKingItemClass.you.y = 16;
        this.addChild(GameRhythmKingItemClass.you);

        GameRhythmKingItemClass.roadBatholith = AssetManager.getBitmap("RK_road_batholith_jpg", true, true);
        GameRhythmKingItemClass.roadBatholith.x = 320;
        GameRhythmKingItemClass.roadBatholith.y = 1027;
        this.addChild(GameRhythmKingItemClass.roadBatholith);
        GameRhythmKingItemClass.roadBatholith.touchEnabled = true;

        GameRhythmKingItemClass.roadBeatCenter = AssetManager.getBitmap("RK_road_beatCenter_png", true, true);
        GameRhythmKingItemClass.roadBeatCenter.x = 320;
        GameRhythmKingItemClass.roadBeatCenter.y = 865;
        this.addChildAt(GameRhythmKingItemClass.roadBeatCenter, 8);

        GameRhythmKingItemClass.pointYou.text = "0";
        GameRhythmKingItemClass.pointYou.type = egret.TextFieldType.DYNAMIC;
        GameRhythmKingItemClass.pointYou.textAlign = egret.HorizontalAlign.CENTER;
        GameRhythmKingItemClass.pointYou.x = 138.5;
        GameRhythmKingItemClass.pointYou.y = 52.5;
        GameRhythmKingItemClass.pointYou.anchorOffsetX = 67.5;
        GameRhythmKingItemClass.pointYou.anchorOffsetY = 17.5;
        GameRhythmKingItemClass.pointYou.width = 135;
        GameRhythmKingItemClass.pointYou.height = 48;
        GameRhythmKingItemClass.pointYou.size = 48;
        this.addChild(GameRhythmKingItemClass.pointYou);

        GameRhythmKingItemClass.pointOther.text = "0";
        GameRhythmKingItemClass.pointOther.type = egret.TextFieldType.DYNAMIC;
        GameRhythmKingItemClass.pointOther.textAlign = egret.HorizontalAlign.CENTER;
        GameRhythmKingItemClass.pointOther.x = 500;
        GameRhythmKingItemClass.pointOther.y = 52.5;
        GameRhythmKingItemClass.pointOther.anchorOffsetX = 67.5;
        GameRhythmKingItemClass.pointOther.anchorOffsetY = 17.5;
        GameRhythmKingItemClass.pointOther.width = 135;
        GameRhythmKingItemClass.pointOther.height = 48;
        GameRhythmKingItemClass.pointOther.size = 48;
        this.addChild(GameRhythmKingItemClass.pointOther);

        GameRhythmKingItemClass.comboType = AssetManager.getBitmap("RK_perfect_png", true, true);
        GameRhythmKingItemClass.comboType.x = 320;
        GameRhythmKingItemClass.comboType.y = 990;
        GameRhythmKingItemClass.comboType.alpha = 0;
        this.addChild(GameRhythmKingItemClass.comboType);

        GameRhythmKingItemClass.comboOtherType = AssetManager.getBitmap("RK_perfect_png", true, true);
        GameRhythmKingItemClass.comboOtherType.x = 320;
        GameRhythmKingItemClass.comboOtherType.y = 990;
        GameRhythmKingItemClass.comboOtherType.alpha = 0;
        this.addChild(GameRhythmKingItemClass.comboOtherType);

        GameRhythmKingItemClass.comboYouImage = AssetManager.getBitmap("RK_combo_png", true, true);
        GameRhythmKingItemClass.comboYouImage.x = 80;
        GameRhythmKingItemClass.comboYouImage.y = 170;
        GameRhythmKingItemClass.comboYouImage.alpha = 0;
        this.addChild(GameRhythmKingItemClass.comboYouImage);

        GameRhythmKingItemClass.comboOtherImage = AssetManager.getBitmap("RK_combo_png", true, true);
        GameRhythmKingItemClass.comboOtherImage.x = 450;
        GameRhythmKingItemClass.comboOtherImage.y = 170;
        GameRhythmKingItemClass.comboOtherImage.alpha = 0;
        this.addChild(GameRhythmKingItemClass.comboOtherImage);

        GameRhythmKingItemClass.sideFold = AssetManager.getBitmap("RK_progress_gray_png", false, false);
        GameRhythmKingItemClass.sideFold.anchorOffsetY = 944;
        GameRhythmKingItemClass.sideFold.x = 621;
        GameRhythmKingItemClass.sideFold.y = 1100;
        this.addChild(GameRhythmKingItemClass.sideFold);

        GameRhythmKingItemClass.sideProgress = AssetManager.getBitmap("RK_progress_yellow_png", false, false);
        GameRhythmKingItemClass.sideProgress.anchorOffsetY = 944;
        GameRhythmKingItemClass.sideProgress.x = 621;
        GameRhythmKingItemClass.sideProgress.y = 1100;
        GameRhythmKingItemClass.sideProgress.scaleY = 0.001;
        this.addChild(GameRhythmKingItemClass.sideProgress);

        let playData = DataCenter.instance.room.player;
        GameRhythmKingItemClass.otherRoleAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "toukuang");
        GameRhythmKingItemClass.otherRoleAvatar.armature.scaleX = 0.4;
        GameRhythmKingItemClass.otherRoleAvatar.armature.scaleY = 0.4;
        GameRhythmKingItemClass.otherRoleAvatar.armature.x = 610;
        GameRhythmKingItemClass.otherRoleAvatar.armature.y = 1100;
        this.addChild(GameRhythmKingItemClass.otherRoleAvatar.armature);

        let myData = DataCenter.instance.user;
        GameRhythmKingItemClass.myRoleAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "toukuang");
        GameRhythmKingItemClass.myRoleAvatar.armature.scaleX = 0.4;
        GameRhythmKingItemClass.myRoleAvatar.armature.scaleY = 0.4;
        GameRhythmKingItemClass.myRoleAvatar.armature.x = 610;
        GameRhythmKingItemClass.myRoleAvatar.armature.y = 1100;
        this.addChild(GameRhythmKingItemClass.myRoleAvatar.armature)

        GameRhythmKingItemClass.jumpRoleYou = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "dbxiaoren00_game7");
        GameRhythmKingItemClass.jumpRoleYou.armature.x = 147.5;
        GameRhythmKingItemClass.jumpRoleYou.armature.y = 1120;
        this.addChild(GameRhythmKingItemClass.jumpRoleYou.armature);

        GameRhythmKingItemClass.jumpRoleOther = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "dbxiaoren00_game7");
        GameRhythmKingItemClass.jumpRoleOther.armature.x = 492.5;
        GameRhythmKingItemClass.jumpRoleOther.armature.y = 1120;
        this.addChild(GameRhythmKingItemClass.jumpRoleOther.armature);

        GameRhythmKingItemClass.sparkLeft = AssetManager.getBitmap("RK_pat_1_png", true, false);
        GameRhythmKingItemClass.sparkLeft.alpha = 0;
        GameRhythmKingItemClass.sparkLeft.anchorOffsetY = 100;
        this.addChild(GameRhythmKingItemClass.sparkLeft);

        GameRhythmKingItemClass.sparkRight = AssetManager.getBitmap("RK_pat_2_png", true, false);
        GameRhythmKingItemClass.sparkRight.alpha = 0;
        GameRhythmKingItemClass.sparkRight.anchorOffsetY = 100;
        this.addChild(GameRhythmKingItemClass.sparkRight);

        GameRhythmKingItemClass.alaphaMask = AssetManager.getBitmap("RK_alphaMask_png", false, false);
        GameRhythmKingItemClass.alaphaMask.x = 0;
        GameRhythmKingItemClass.alaphaMask.y = 0;
        GameRhythmKingItemClass.alaphaMask.alpha = 0.1;
        this.addChild(GameRhythmKingItemClass.alaphaMask);
        GameRhythmKingItemClass.alaphaMask.touchEnabled = true;
        GameRhythmKingItemClass.alaphaMask.addEventListener("touchTap", GameRhythmKingLogic.tap, this);

        GameRhythmKingItemClass.bottomSide = AssetManager.getBitmap("RK_bottomSide_png", false, false);
        GameRhythmKingItemClass.bottomSide.x = 0;
        GameRhythmKingItemClass.bottomSide.y = 1136;
        GameRhythmKingItemClass.bottomSide.alpha = 1;
        this.addChild(GameRhythmKingItemClass.bottomSide);

        GameRhythmKingItemClass.topSide = AssetManager.getBitmap("RK_bottomSide_png", false, false);
        GameRhythmKingItemClass.topSide.anchorOffsetY = 300;
        GameRhythmKingItemClass.topSide.x = 0;
        GameRhythmKingItemClass.topSide.y = 0;
        GameRhythmKingItemClass.topSide.alpha = 1;
        this.addChild(GameRhythmKingItemClass.topSide);

        GameRhythmKingItemClass.loseBlockYou = AssetManager.getBitmap("RK_block_miss_png", true, true);
        GameRhythmKingItemClass.loseBlockYou.x = 147.5;
        GameRhythmKingItemClass.loseBlockYou.y = 300;
        GameRhythmKingItemClass.loseBlockYou.alpha = 0;
        this.addChild(GameRhythmKingItemClass.loseBlockYou);

        GameRhythmKingItemClass.loseBlockOther = AssetManager.getBitmap("RK_block_miss_png", true, true);
        GameRhythmKingItemClass.loseBlockOther.x = 492.5;
        GameRhythmKingItemClass.loseBlockOther.y = 300;
        GameRhythmKingItemClass.loseBlockOther.alpha = 0;
        this.addChild(GameRhythmKingItemClass.loseBlockOther);

        this.waitingSceneManager("add");

        RES.getResByUrl("resource/assets/games/game_RhythmKing/RK_comboFont.fnt", this.bitmapText, this, RES.ResourceItem.TYPE_FONT);
        RES.getResByUrl("resource/assets/games/game_RhythmKing/RK_whiteFont.fnt", this.whitebitmapText, this, RES.ResourceItem.TYPE_FONT);

        GameRhythmKingItemClass.keyPressSoundEffect = new SoundEffects();
        GameRhythmKingItemClass.keyPressSoundEffect.setVolume(0.3);

        if (this.stage.stageHeight < 1136) {
            GameRhythmKingItemClass.multiple = (this.stage.stageHeight / 1136);
            this.scaleX = GameRhythmKingItemClass.multiple;
            this.scaleY = GameRhythmKingItemClass.multiple;
            let nowWidth = 640 * GameRhythmKingItemClass.multiple;
            this.x = (640 - nowWidth) / 2;
        } else if (this.stage.stageHeight > 1136) {
            this.y = (this.stage.stageHeight - 1136) / 2;
        }

        GameRhythmKingItemClass.gameReady = new GameReady(() => {

            GameRhythmKingItemClass.backGroundMusicPlayer = new SoundEffects();
            GameRhythmKingItemClass.backGroundMusicPlayer.setVolume(1);

            egret.startTick(this.tickLogic, this);
            egret.startTick(GameRhythmKingLogic.compareTick, this);
            egret.startTick(GameRhythmKingLogic.animationTick, this);
            // console.log("start!");

            let block = AssetManager.getBitmap("RK_block_normal_png", true, false);
            let _block = AssetManager.getBitmap("RK_block_normal_png", true, false);
            this.addBlock(block, 0, 43, "perfect");
            this.addBlock(_block, 1, 43, "perfect");

            // 小米平台去掉退出按钮
            if (!App.IsXiaoMi && !App.IsWanba ) {
                let returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
                returnToLastButton.y = 19;
                returnToLastButton.name = "backBtn";
                this.addChild(returnToLastButton);
                returnToLastButton.touchEnabled = true;
                returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    this.popup("GameSureLeave");
                }, this)
            }

        });

        GameRhythmKingItemClass.gameReady.x = 300;
        GameRhythmKingItemClass.gameReady.y = App.GameHeight / 2;

        GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVENT_CHOOSE_SETTINGS);
        GameRhythmKingEventClass.rkMessagerCenter(GameRhythmKingEventClass.EVEVT_READY);
        GameRhythmKingItemClass.readyState[0] = 1;
    }
}