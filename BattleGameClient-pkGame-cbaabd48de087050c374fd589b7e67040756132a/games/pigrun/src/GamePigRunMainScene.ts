class GamePigRunMainScene extends State {
    public static partRotation: Array<number> = [0, -22.5, -45, -67.5, -90, -112.5, -135, -157.5, -180, -202.5, -225, -247.5, -270, -292.5, -315, -337.5];
    public static running: boolean = true;
    public static result: string;
    public static particleSmoke: particle.GravityParticleSystem;
    public static particleStars: particle.GravityParticleSystem;
    public static borderRotation: number;
    public static roleYouRotation: number;
    public static roleOtherRotation: number;
    public static role_you: DBArmature;
    public static role_other: DBArmature;
    public static volume_you: SoundEffects;
    public static volume_other: SoundEffects;
    public static volume_global: SoundEffects;
    public static multiple: number;
    public static btnRed: DBArmature;
    public static btnBlue: DBArmature;
    public static btnDeath: DBArmature;
    public static gameTurns: number = 0;
    public static tipsSwitcher: number = 0;
    public static tipsCover: DBArmature;
    public static readyIMG: GameReady;
    public static mark_you: number = 0;
    public static mark_other: number = 0;
    public static roundText: egret.Bitmap;
    public static resultText;
    public static koText;
    public static hasInDeathMode: boolean = false;
    public static scenceMask: egret.Bitmap;
    public static effectTimer;
    public static effectCounter = 0;
    public static part_you: egret.Bitmap;
    public static part_other;
    public static boomSmoke;
    public static ai: number = 0;
    public static target: number = -180;
    public static youTarget: number = 0;
    private readyState: Array<number> = [0, 0];
    private randomTime: number = 4;
    public static instance: GamePigRunMainScene;
    public static keyState: number = 0;

    public constructor() {
        super();
        if (DataCenter.instance.room.IsAI) {
            GamePigRunLogic.isOffline = true;
        }

        GamePigRunMainScene.instance = this;

        egret.lifecycle.onPause = () => {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GamePigRunMainScene.volume_global) {
                GamePigRunMainScene.volume_global.setVolume(0);
            }
            if (GamePigRunMainScene.volume_other) {
                GamePigRunMainScene.volume_other.setVolume(0);
            }
            if (GamePigRunMainScene.volume_you) {
                GamePigRunMainScene.volume_you.setVolume(0);
            }
        }

        egret.lifecycle.onResume = () => {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GamePigRunMainScene.volume_global) {
                GamePigRunMainScene.volume_global.setVolume(0.7);
            }
            if (GamePigRunMainScene.volume_other) {
                GamePigRunMainScene.volume_other.setVolume(0.7);
            }
            if (GamePigRunMainScene.volume_you) {
                GamePigRunMainScene.volume_you.setVolume(0.7);
            }
        }
    }

    init() {
        if (DataCenter.instance.room.IsAI) {
            GamePigRunLogic.isOffline = true;
        }
        try {
            this.gameStart();
        } catch (err) {
            egret.error(err);
        }
        App.SoundManager.stopBg();
        App.SoundManager.playBg("PR_music_normal_mp3");
        // App.CurrGameAiLevel = 5;
        // console.log("AI LEVEL:", App.CurrGameAiLevel);
    }

    public dispose(): void {
        egret.stopTick(this.circleLogic, this);
        egret.stopTick(this.readyTick, this);
        if (GamePigRunMainScene.role_you) { GamePigRunMainScene.role_you.stop(); }
        if (GamePigRunMainScene.role_other) { GamePigRunMainScene.role_other.stop(); }
        if (GamePigRunMainScene.tipsCover) { GamePigRunMainScene.tipsCover.stop(); }
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.messageDuel, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.resultDuel, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
        this.getChildByName("btnRed").removeEventListener(egret.TouchEvent.TOUCH_TAP, GamePigRunMainScene.redBtnPress, this);
        this.getChildByName("btnBlue").removeEventListener(egret.TouchEvent.TOUCH_TAP, GamePigRunMainScene.blueBtnPress, this);
        App.SoundManager.stopBg();
        (this.getChildByName("btnRed") as egret.Bitmap).touchEnabled = false;
        (this.getChildByName("btnBlue") as egret.Bitmap).touchEnabled = false;
        (this.getChildByName("btnDeath") as egret.Bitmap).touchEnabled = false;
        GamePigRunMainScene.result = undefined;
        GamePigRunLogic.logicLocalColor = undefined;
        GamePigRunLogic.keyPress = undefined;
        GamePigRunLogic.orderNum = -1;
        GamePigRunLogic.otherOrderNum = 8;
        GamePigRunLogic.whoWillWin = undefined;
        GamePigRunLogic.colorSettings = [];
        GamePigRunLogic.wrongSwitcher = false;
        GamePigRunLogic.gameModeisDeathMode = false;
        GamePigRunLogic.isOffline = false;
        GamePigRunLogic.colorOtherSettings = [];
        GamePigRunMainScene.borderRotation = undefined;
        GamePigRunMainScene.roleYouRotation = undefined;
        GamePigRunMainScene.roleOtherRotation = undefined;
        GamePigRunMainScene.multiple = undefined;
        GamePigRunMainScene.volume_you = undefined;
        GamePigRunMainScene.volume_other = undefined;
        GamePigRunMainScene.volume_global = undefined;
        GamePigRunMainScene.btnRed = undefined;
        GamePigRunMainScene.btnBlue = undefined;
        GamePigRunMainScene.btnDeath = undefined;
        GamePigRunMainScene.gameTurns = 0;
        GamePigRunMainScene.tipsSwitcher = 0;
        GamePigRunMainScene.mark_you = 0;
        GamePigRunMainScene.mark_other = 0;
        GamePigRunMainScene.roundText = undefined;
        GamePigRunMainScene.resultText = undefined;
        GamePigRunMainScene.koText = undefined;
        GamePigRunMainScene.hasInDeathMode = false;
        GamePigRunMainScene.scenceMask = undefined;
        GamePigRunMainScene.effectTimer = undefined;
        GamePigRunMainScene.effectCounter = 0;
        GamePigRunMainScene.part_you = undefined;
        GamePigRunMainScene.part_other = undefined;
        GamePigRunMainScene.boomSmoke = undefined;
        GamePigRunMainScene.ai = 0;
        GamePigRunMainScene.tipsCover = undefined;
        GamePigRunMainScene.target = -180;
        GamePigRunMainScene.youTarget = 0;
        if (GamePigRunMainScene.readyIMG) {
            GamePigRunMainScene.readyIMG.dispose();
            GamePigRunMainScene.readyIMG = undefined;
        }
        GamePigRunMainScene.instance = null;
        GamePigRunMainScene.keyState = 0;
        App.TimerManager.removeAll(this);
    }

    private reset = () => {
        console.log("RESET");
        // egret.stopTick(this.circleLogic, this);
        if (GamePigRunMainScene.role_you) { GamePigRunMainScene.role_you.stop(); }
        if (GamePigRunMainScene.role_other) { GamePigRunMainScene.role_other.stop(); }
        GamePigRunMainScene.result = undefined;
        GamePigRunLogic.logicLocalColor = undefined;
        GamePigRunLogic.keyPress = undefined;
        GamePigRunLogic.orderNum = -1;
        GamePigRunLogic.otherOrderNum = 8;
        GamePigRunLogic.whoWillWin = undefined;
        GamePigRunLogic.colorSettings = [];
        GamePigRunLogic.wrongSwitcher = false;
        GamePigRunLogic.colorOtherSettings = [];
        GamePigRunMainScene.borderRotation = undefined;
        GamePigRunMainScene.ai = 0;
    }

    private twManager = (name: string) => {
        switch (name) {
            case "koText":
                let tw_koText = egret.Tween.get(GamePigRunMainScene.koText);
                GamePigRunMainScene.koText.alpha = 1;
                tw_koText.to({ scaleX: 1, scaleY: 1 }, 300);
                break;
            case "resultText":
                let tw_resultText = egret.Tween.get(GamePigRunMainScene.resultText);
                GamePigRunMainScene.resultText.alpha = 1;
                tw_resultText.to({ x: GamePigRunMainScene.resultText.x - 200 }, 100);
                tw_resultText.to({ x: GamePigRunMainScene.resultText.x + 200 }, 100);
                tw_resultText.to({ x: GamePigRunMainScene.resultText.x - 100 }, 100);
                tw_resultText.to({ x: GamePigRunMainScene.resultText.x + 100 }, 100);
                tw_resultText.to({ x: GamePigRunMainScene.resultText.x }, 100);
                break;
            case "roundText":
                GamePigRunMainScene.roundText.alpha = 1;
                let tw_roundText = egret.Tween.get(GamePigRunMainScene.roundText);
                tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation + 40 }, 100);
                tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation - 40 }, 100);
                tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation + 20 }, 100);
                tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation - 20 }, 100);
                tw_roundText.to({ rotation: GamePigRunMainScene.resultText.rotation }, 100);
                break;
        }
    }

    /**
     * AI
     */
    private artificial = () => {
        GamePigRunMainScene.ai += 1;
        let random = Math.random();
        switch (GamePigRunLogic.gameModeisDeathMode) {
            case true:
                switch (App.CurrGameAiLevel) {
                    case 1:
                        if (0.04 >= random && random >= 0) {
                            this.otherDo();
                        }
                        break;
                    case 2:
                        if (0.06 >= random && random >= 0) {
                            this.otherDo();
                        }
                        break;
                    case 3:
                        if (0.08 >= random && random >= 0) {
                            this.otherDo();
                        }
                        break;
                    case 4:
                        if (GamePigRunMainScene.ai == this.randomTime) {
                            this.otherDo();
                            this.randomTime = 4 + Math.round(2 * Math.random() + 0.1);
                            GamePigRunMainScene.ai = 0;
                        }
                        break;
                    case 5:
                        if (GamePigRunMainScene.ai == this.randomTime) {
                            this.otherDo();
                            this.randomTime = 2 + Math.round(1 * Math.random() - 0.1);
                            GamePigRunMainScene.ai = 0;
                        }
                        break;
                }
                break;
            case false:
                switch (App.CurrGameAiLevel) {
                    case 1:
                        if (GamePigRunMainScene.ai == 20) {
                            if (0.4 >= random && random >= 0) {
                                this.otherDo();
                            }
                            GamePigRunMainScene.ai = 0;
                        }
                        break;
                    case 2:
                        if (GamePigRunMainScene.ai == 20) {
                            if (0.6 >= random && random >= 0) {
                                this.otherDo();
                            }
                            GamePigRunMainScene.ai = 0;
                        }
                        break;
                    case 3:
                        if (GamePigRunMainScene.ai == 20) {
                            if (0.8 >= random && random >= 0) {
                                this.otherDo();
                            }
                            GamePigRunMainScene.ai = 0;
                        }
                        break;
                    case 4:
                        if (GamePigRunMainScene.ai == 16) {
                            if (0.85 >= random && random >= 0) {
                                this.otherDo();
                                GamePigRunMainScene.ai = 0;
                            } else {
                                GamePigRunMainScene.ai = 8;
                            }
                        }
                        break;
                    case 5:
                        if (GamePigRunMainScene.ai == 10) {
                            if (0.98 >= random && random >= 0) {
                                this.otherDo();
                                GamePigRunMainScene.ai = 0;
                            } else {
                                GamePigRunMainScene.ai = 7;
                            }
                        }
                        break;
                }
                break;
        }

        switch (GamePigRunLogic.colorSettings[GamePigRunLogic.otherOrderNum]) {
            case "red":
                GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "red");
                break;
            case "blue":
                GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "blue");
                break;
            case "yellow":
                GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "yellow");
                break;
        }

        if (GamePigRunMainScene.ai == 20) {
            GamePigRunMainScene.ai = 0;
        }
    }

    /**
     * 获胜逻辑
     */
    private win = () => {
        GamePigRunMainScene.youTarget = 0;
        GamePigRunMainScene.target = -180;
        if (GamePigRunLogic.isOffline == false) {
            GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_NEWTURN);
        }
        GamePigRunMainScene.btnDeath.touchEnabled = false;
        GamePigRunMainScene.btnBlue.touchEnabled = false;
        GamePigRunMainScene.btnRed.touchEnabled = false;
        console.log("你赢了！");
        this.resultEffectManager();
        this.addHeadIco();
        GamePigRunMainScene.running = false;
        GamePigRunMainScene.mark_you += 1;
        if (GamePigRunMainScene.mark_you == 2) {
            this.twManager("koText");
            GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_win_png").texture;
            GamePigRunMainScene.volume_you.play("PR_music_ko_mp3", true);
            this.twManager("resultText");
            this.resultEffectManager();
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_STOP_GAME);
                App.TimerManager.doTimer(300, 1, () => {
                    GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_YOU_WIN);
                }, this);
            } else {
                GamePigRunLogic.gameOver(3);
            }
            return;
        }
        this.reset();
        GamePigRunMainScene.koText.alpha = 0;
        GamePigRunMainScene.resultText.alpha = 0;
        GamePigRunMainScene.roundText.alpha = 0;
        App.TimerManager.doTimer(1000, 1, () => {
            App.TimerManager.doTimer(750, 1, () => {
                GamePigRunMainScene.role_other.play("zhuli1", 0);
                GamePigRunMainScene.role_you.play("zhuli2", 0);
                GamePigRunLogic.roleExhibition(this.getChildByName("role_you") as egret.MovieClip, 0, true);
                GamePigRunLogic.roleExhibition(this.getChildByName("role_other") as egret.MovieClip, 8, true);
                this.gameStartManager();
            }, this);

            CircleMask.hide(() => {
                CircleMask.show(() => { });
            });
        }, this);
    }

    /**
     * 失败逻辑
     */
    private lose = () => {
        // if (GamePigRunLogic.isOffline == false) {
        //     GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_STOP_GAME);
        // }
        this.resultEffectManager();
        GamePigRunMainScene.youTarget = 0;
        GamePigRunMainScene.target = -180;
        GamePigRunMainScene.btnDeath.touchEnabled = false;
        GamePigRunMainScene.btnBlue.touchEnabled = false;
        GamePigRunMainScene.btnRed.touchEnabled = false;
        console.log("你输了！");
        this.addHeadIco();
        GamePigRunMainScene.running = false;
        GamePigRunMainScene.mark_other += 1;
        if (GamePigRunMainScene.mark_other == 2) {
            this.twManager("koText");
            GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_lose_png").texture;
            GamePigRunMainScene.volume_you.play("PR_music_ko_mp3", true);
            this.twManager("resultText");
            this.resultEffectManager();
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_YOU_LOSE);
            } else {
                GamePigRunLogic.gameOver(1);
            }
            return;
        }
        this.reset();
        GamePigRunMainScene.koText.alpha = 0;
        GamePigRunMainScene.resultText.alpha = 0;
        GamePigRunMainScene.roundText.alpha = 0;
        App.TimerManager.doTimer(1000, 1, () => {
            App.TimerManager.doTimer(750, 1, () => {
                GamePigRunMainScene.role_other.play("zhuli1", 0);
                GamePigRunMainScene.role_you.play("zhuli2", 0);
                GamePigRunLogic.roleExhibition(this.getChildByName("role_you") as egret.MovieClip, 0, true);
                GamePigRunLogic.roleExhibition(this.getChildByName("role_other") as egret.MovieClip, 8, true);
                this.gameStartManager();
            }, this);

            CircleMask.hide(() => {
                CircleMask.show(() => { });
            });
        }, this);
    }

    /**
     * particle playing Manager,
     */
    public static particleManager = (what: string, time: number) => {
        let PositionX: number;
        let PositionY: number;
        let pos = GamePigRunLogic.keyPress;

        switch (pos) {
            case "blue":
                PositionX = 520;
                PositionY = 980;
                break;
            case "yellow":
                PositionX = 310;
                PositionY = 980;
                break;
            case "red":
                PositionX = 100;
                PositionY = 980;
                break;
            case "death":
                PositionX = 310;
                PositionY = 980;
                break;
        }

        switch (what) {
            case "smoke":
                GamePigRunMainScene.particleSmoke.emitterX = PositionX;
                GamePigRunMainScene.particleSmoke.emitterY = PositionY;
                GamePigRunMainScene.particleSmoke.start(time);
                break;
            case "stars":
                GamePigRunMainScene.particleStars.emitterX = PositionX;
                GamePigRunMainScene.particleStars.emitterY = PositionY;
                GamePigRunMainScene.particleStars.start(time);
                break;
            case "death":
                GamePigRunMainScene.particleStars.emitterX = PositionX;
                GamePigRunMainScene.particleStars.emitterY = PositionY;
                GamePigRunMainScene.particleStars.start(time);
                break;
        }
    }

    /**
     * step manger
     */
    private colorStepManager = (finalSet = false) => {
        if (finalSet == false) {
            if (GamePigRunLogic.gameModeisDeathMode == true) { GamePigRunMainScene.role_you.alpha = 0; }
            let num = GamePigRunLogic.numManager();
            let upperColor = GamePigRunLogic.colorSettings[num].replace(GamePigRunLogic.colorSettings[num][0], GamePigRunLogic.colorSettings[num][0].toUpperCase());

            if (GamePigRunLogic.isOffline == false) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "other" + upperColor);
            }

            GamePigRunMainScene.volume_you.play("PR_music_running_mp3", true);

            // 播放龙骨动画
            switch (GamePigRunLogic.gameModeisDeathMode) {
                case true:
                    GamePigRunMainScene.role_you.play("lanbaozou", 1);
                    App.TimerManager.doTimer(370, 1, () => {
                        GamePigRunMainScene.role_you.stop();
                        GamePigRunMainScene.role_you.play("baozouli2", 0);
                    }, this);
                    break;
                case false:
                    GamePigRunMainScene.role_you.play("lantiao", 1);
                    App.TimerManager.doTimer(400, 1, () => {
                        GamePigRunMainScene.role_you.stop();
                        GamePigRunMainScene.role_you.play("zhuli2", 0);
                    }, this);
                    break;
            }

            GamePigRunLogic.partExhibition(this.getChildByName("part_you") as egret.Bitmap, GamePigRunLogic.colorSettings[num], num);
            GamePigRunLogic.roleExhibition(this.getChildByName("role_you") as egret.MovieClip, num);
            GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[num];
            GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[num];
        } else if (finalSet == true) {
            GamePigRunLogic.partExhibition(this.getChildByName("part_you") as egret.Bitmap, undefined, GamePigRunLogic.orderNum);
            GamePigRunLogic.roleExhibition(this.getChildByName("role_you") as egret.MovieClip, GamePigRunLogic.orderNum);
            GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[GamePigRunLogic.orderNum];
            GamePigRunLogic.logicLocalColor = GamePigRunLogic.colorSettings[GamePigRunLogic.orderNum];
        }
    }

    /**
     * press wrong button deal
     */
    private wrongPressDeal = () => {
        if (GamePigRunLogic.wrongSwitcher == false) {
            switch (GamePigRunLogic.logicLocalColor) {
                case "blue":
                    GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_blueAngle_blin_png", true, false).texture;
                    break;
                case "red":
                    GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_redAngle_blin_png", true, false).texture;
                    break;
            }
            (this.getChildByName("btnRed") as egret.Bitmap).touchEnabled = false;
            (this.getChildByName("btnBlue") as egret.Bitmap).touchEnabled = false;
            if (GamePigRunMainScene.btnRed && GamePigRunMainScene.btnBlue) {
                GamePigRunMainScene.btnRed.stop();
                GamePigRunMainScene.btnRed.play("btnRedWrong", 0);
                GamePigRunMainScene.btnBlue.stop();
                GamePigRunMainScene.btnBlue.play("btnBlueWrong", 0);
            }

            GamePigRunLogic.wrongSwitcher = true;
            App.TimerManager.doTimer(500, 1, () => {
                switch (GamePigRunLogic.logicLocalColor) {
                    case "blue":
                        GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_blueAngle_png", true, false).texture;
                        break;
                    case "red":
                        GamePigRunMainScene.part_you.texture = AssetManager.getBitmap("PR_redAngle_png", true, false).texture;
                        break;
                }
                (this.getChildByName("btnRed") as egret.Bitmap).touchEnabled = true;
                (this.getChildByName("btnBlue") as egret.Bitmap).touchEnabled = true;
                if (GamePigRunMainScene.btnRed && GamePigRunMainScene.btnBlue) {
                    GamePigRunMainScene.btnRed.stop();
                    GamePigRunMainScene.btnRed.play("btnRedNormal", 0);
                    GamePigRunMainScene.btnBlue.stop();
                    GamePigRunMainScene.btnBlue.play("btnBlueNormal", 0);
                }
                GamePigRunLogic.wrongSwitcher = false;
                GamePigRunMainScene.keyState = 0;
            }, this);
        }
    }

    /**
     * 循环逻辑
     */
    private circleLogic = (): boolean => {
        if (GamePigRunMainScene.running == false) {
            egret.stopTick(this.circleLogic, this);
            console.log("Tick has stoped!");
            return;
        }

        switch (GamePigRunMainScene.tipsSwitcher) {
            case 0:
                break;
            case 1:
                GamePigRunMainScene.tipsCover.alpha = 0;
                GamePigRunMainScene.tipsCover.stop();
                GamePigRunMainScene.tipsSwitcher = 2;
                break;
            case 2:
                break;
        }

        switch (GamePigRunLogic.gameModeisDeathMode) {
            case true:
                if ((this.getChildByName("basicCircleBorder") as egret.Bitmap).rotation == 360) {
                    (this.getChildByName("basicCircleBorder") as egret.Bitmap).rotation = 0;
                } else {
                    (this.getChildByName("basicCircleBorder") as egret.Bitmap).rotation += 3;
                }
                this.getChildByName("role_you").alpha = 1;
                this.getChildByName("role_other").alpha = 1;
                if (GamePigRunMainScene.result == undefined) {
                    GamePigRunMainScene.borderRotation = (this.getChildByName("basicCircleBorder") as egret.Bitmap).rotation;
                    (this.getChildByName("role_you") as egret.MovieClip).rotation = GamePigRunMainScene.roleYouRotation + GamePigRunMainScene.borderRotation;
                    (this.getChildByName("role_other") as egret.MovieClip).rotation = GamePigRunMainScene.roleOtherRotation + GamePigRunMainScene.borderRotation;
                }

                if (GamePigRunLogic.keyPress != undefined) {
                    GamePigRunLogic.keyPress = undefined;
                    GamePigRunMainScene.particleManager("death", 0.5);
                    GamePigRunMainScene.volume_global.play("PR_pressRight_mp3", true);
                    this.colorStepManager();
                    if (GamePigRunLogic.isOffline == false) {
                        GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_OTHER_DO);
                    }
                }
                break;
            case false:
                break;
        }


        if (GamePigRunLogic.isOffline == true) {
            this.artificial();
        }

        return true;
    }

    public gameResultCheck = () => {

        GamePigRunLogic.gameJudge();

        if (GamePigRunMainScene.result == "you") {
            this.win();
            GamePigRunMainScene.volume_global.play("PR_pound_mp3", true);
            // egret.stopTick(this.circleLogic, this);
        }

        if (GamePigRunMainScene.result == "other") {
            this.lose();
            GamePigRunMainScene.volume_global.play("PR_bePounded_mp3", true);
            // egret.stopTick(this.circleLogic, this);
        }
    }

    /**
     * init all color border
     */
    private initColorBorder = () => {
        for (let i = 0; i < 16; i++) {
            GamePigRunLogic.changeColor((this.getChildByName("step" + i.toString()) as egret.Bitmap), GamePigRunLogic.colorSettings[i], "true")
        }
    }

    private initNormalColor = () => {
        for (let i = 0; i < 16; i++) {
            GamePigRunLogic.changeColor((this.getChildByName("step" + i.toString()) as egret.Bitmap), "glary", "true")
        }
        GamePigRunLogic.changeColor(GamePigRunMainScene.part_you, "glary");
        GamePigRunLogic.changeColor(GamePigRunMainScene.part_other, "glary");
    }

    /**
     * 对方成功完成一次逻辑
     */
    private otherDo = () => {
        if (GamePigRunLogic.gameModeisDeathMode == true) { this.getChildByName("role_other").alpha = 0; }
        let num = GamePigRunLogic.otherNumManager();

        GamePigRunMainScene.volume_other.play("PR_music_running_mp3", true);

        // 播放龙骨动画
        switch (GamePigRunLogic.gameModeisDeathMode) {
            case true:
                GamePigRunMainScene.role_other.play("fenbaozou", 1);
                App.TimerManager.doTimer(370, 1, () => {
                    GamePigRunMainScene.role_other.stop();
                    GamePigRunMainScene.role_other.play("baozouli1", 0);
                }, this);
                break;
            case false:
                GamePigRunMainScene.role_other.play("fentiao", 1);
                App.TimerManager.doTimer(400, 1, () => {
                    GamePigRunMainScene.role_other.stop();
                    GamePigRunMainScene.role_other.play("zhuli1", 0);
                }, this);
                break;
        }

        GamePigRunLogic.partExhibition(this.getChildByName("part_other") as egret.Bitmap, undefined, num);
        GamePigRunLogic.roleExhibition(this.getChildByName("role_other") as egret.MovieClip, num);
        GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[num];
    }

    /**
     * game result effect manager
     */
    private resultEffectManager = () => {
        egret.Tween.removeTweens(GamePigRunMainScene.role_you);
        egret.Tween.removeTweens(GamePigRunMainScene.role_other);
        egret.Tween.removeTweens(GamePigRunMainScene.part_you);
        egret.Tween.removeTweens(GamePigRunMainScene.part_other);

        GamePigRunMainScene.part_you.alpha = 0;
        GamePigRunMainScene.part_other.alpha = 0;
        GamePigRunMainScene.role_you.alpha = 1;
        GamePigRunMainScene.role_other.alpha = 1;

        GamePigRunMainScene.running = false;

        (this.getChildByName("part_you") as egret.DisplayObject).alpha = 0;
        (this.getChildByName("part_other") as egret.DisplayObject).alpha = 0;

        switch (GamePigRunMainScene.result) {
            case "you":
                if (GamePigRunLogic.gameModeisDeathMode == false) {
                    this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation + 22.5;
                    this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation;
                } else if (GamePigRunLogic.gameModeisDeathMode == true) {
                    this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation + 22.5 + GamePigRunMainScene.borderRotation;
                    this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation + GamePigRunMainScene.borderRotation;
                }

                GamePigRunMainScene.role_you.stop();
                GamePigRunMainScene.role_other.stop();
                GamePigRunMainScene.role_you.play("ding2", 0);
                App.TimerManager.doTimer(300, 1, () => {
                    GamePigRunMainScene.role_you.stop();
                    GamePigRunMainScene.role_you.play("lanbaozou", 0);
                }, this);
                GamePigRunMainScene.role_other.play("zhuang1", 0);
                break;
            case "other":
                if (GamePigRunLogic.gameModeisDeathMode == false) {
                    this.getChildByName("role_other").rotation = GamePigRunMainScene.roleOtherRotation + 22.5;
                    this.getChildByName("role_you").rotation = GamePigRunMainScene.roleYouRotation;
                } else if (GamePigRunLogic.gameModeisDeathMode == true) {
                    (this.getChildByName("role_other") as egret.DisplayObject).rotation = GamePigRunMainScene.roleOtherRotation + 22.5 + GamePigRunMainScene.borderRotation;
                    (this.getChildByName("role_you") as egret.DisplayObject).rotation = GamePigRunMainScene.roleYouRotation + GamePigRunMainScene.borderRotation;
                }

                GamePigRunMainScene.role_you.stop();
                GamePigRunMainScene.role_other.stop();
                GamePigRunMainScene.role_you.play("zhuang2", 0);
                GamePigRunMainScene.role_other.play("ding1", 0);
                App.TimerManager.doTimer(300, 1, () => {
                    GamePigRunMainScene.role_other.stop();
                    GamePigRunMainScene.role_other.play("fenbaozou", 0);
                }, this);
                break;
        }
    }

    /**
     * 结果处理
     */
    private resultDuel = (data: any) => {

        let resultPageFun = () => {
            switch (GamePigRunLogic.whoWillWin) {
                case "you":
                    break;
                case "other":
                    GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_lose_png").texture;
                    GamePigRunMainScene.resultText.alpha = 1;
                    GamePigRunMainScene.koText.alpha = 1;
                    GamePigRunMainScene.volume_you.play("PR_music_ko_mp3", true);
                    break;
            }

            if (App.IsFaceBook) {
                App.MessageCenter.dispatch("showInterstitialAd");
            }

            App.TimerManager.doTimer(3100, 1, () => {
                this.popup("GameResult", null);
            }, this);
        }

        egret.stopTick(this.readyTick, this);
        egret.stopTick(this.circleLogic, this);
        GamePigRunMainScene.btnBlue.touchEnabled = false;
        GamePigRunMainScene.btnRed.touchEnabled = false;
        GamePigRunMainScene.btnDeath.touchEnabled = false;

        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", resultPageFun);
    }

    /**
     * 信息处理
     */
    private messageDuel = (data: any) => {

        // if (data.userId == DataCenter.instance.user.id) {
        //     return;
        // }

        let cmdString: Array<string>;
        cmdString = data.event.split("|");

        switch (cmdString[0]) {
            case GamePigRunEventClass.EVENT_OTHER_DO:
                GamePigRunMainScene.target -= 22.5;
                this.otherDo();
                break;
            case GamePigRunEventClass.EVENT_TIMEOUT:
                break;
            case GamePigRunEventClass.EVENT_OTHER_IS_RED:
                GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "red");
                break;
            case GamePigRunEventClass.EVENT_OTHER_IS_BLUE:
                GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "blue");
                break;
            case GamePigRunEventClass.EVENT_OTHER_IS_YELLOW:
                GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "yellow");
                break;
            case GamePigRunEventClass.EVENT_INITIALIZE_COLOR_ARRAY:
                for (let i = 1; i < 9; i++) {
                    GamePigRunLogic.colorOtherSettings.push(cmdString[i]);
                }
                break;
            case GamePigRunEventClass.EVENT_STOP_GAME:
                egret.stopTick(this.circleLogic, this);
                GamePigRunMainScene.btnBlue.touchEnabled = false;
                GamePigRunMainScene.btnRed.touchEnabled = false;
                GamePigRunMainScene.btnDeath.touchEnabled = false;
                switch (cmdString[1]) {
                    case "you":
                        GamePigRunMainScene.result = "other";
                        break;
                    case "other":
                        GamePigRunMainScene.result = "you";
                        break;
                }
                GamePigRunMainScene.resultText.texture = AssetManager.getBitmap("PR_lose_png").texture;
                this.twManager("resultText");
                this.resultEffectManager();
                break;
            case GamePigRunEventClass.EVENT_READY:
                if (data.userId == DataCenter.instance.user.id) {
                    this.readyState[0] = 1;
                } else if (data.userId == DataCenter.instance.room.player.id) {
                    this.readyState[1] = 1;
                }
                break;
            case GamePigRunEventClass.EVENT_REDBTN:
                if (data.userId == DataCenter.instance.user.id) {
                    GamePigRunMainScene.redBtnPress();
                }
                break;
            case GamePigRunEventClass.EVENT_BLUEBTN:
                if (data.userId == DataCenter.instance.user.id) {
                    GamePigRunMainScene.blueBtnPress();
                }
                break;
            case GamePigRunEventClass.EVENT_DEATHBTN:
                if (data.userId == DataCenter.instance.user.id) {
                    GamePigRunMainScene.deathBtnPress();
                }
                break;
            case GamePigRunEventClass.EVENT_NEWTURN:
                if (parseInt(cmdString[1]) == GamePigRunMainScene.gameTurns) {
                    GamePigRunMainScene.running == false;
                    egret.stopTick(this.circleLogic, this);
                    this.lose();
                    GamePigRunMainScene.volume_global.play("PR_bePounded_mp3", true);
                    GamePigRunMainScene.result = undefined;
                }
                break;
        }
    }

    public static handlePress = () => {
        if (GamePigRunLogic.logicLocalColor != undefined && GamePigRunLogic.logicLocalColor == GamePigRunLogic.keyPress) {
            GamePigRunMainScene.youTarget -= 22.5;
            GamePigRunMainScene.particleManager("stars", 0.5);
            GamePigRunMainScene.volume_global.play("PR_pressRight_mp3", true);
            GamePigRunLogic.logicLocalColor = undefined;
            GamePigRunLogic.keyPress = undefined;
            GamePigRunMainScene.instance.colorStepManager();
            if (GamePigRunLogic.isOffline == false) {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_OTHER_DO);
            }
            GamePigRunMainScene.keyState = 0;
        } else if (GamePigRunLogic.keyPress != undefined && GamePigRunLogic.logicLocalColor != GamePigRunLogic.keyPress) {
            GamePigRunMainScene.particleManager("smoke", 0.3);
            GamePigRunMainScene.volume_global.play("PR_pressWrong_mp3", true);
            GamePigRunLogic.keyPress = undefined;
            GamePigRunMainScene.instance.wrongPressDeal();
        }
    }

    private remoteRedBtnPress = () => {
        if (GamePigRunLogic.isOffline == false) {
            GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_REDBTN);
        } else {
            GamePigRunMainScene.redBtnPress();
        }
    }

    /**
     * 红按钮被按下
     */
    public static redBtnPress = () => {
        if (GamePigRunMainScene.tipsSwitcher == 0) { GamePigRunMainScene.tipsSwitcher = 1 };
        if (GamePigRunMainScene.keyState == 1) {
            return;
        }
        GamePigRunMainScene.keyState = 1;
        GamePigRunLogic.keyPress = "red";
        GamePigRunMainScene.handlePress();
        GamePigRunMainScene.instance.gameResultCheck();

        if (GamePigRunLogic.keyPress != undefined && GamePigRunLogic.logicLocalColor != GamePigRunLogic.keyPress) {
            return;
        } else {
            if (GamePigRunMainScene.btnRed) {
                GamePigRunMainScene.btnRed.stop();
                GamePigRunMainScene.btnRed.play("btnRedPress", 1);
                App.TimerManager.doTimer(35, 1, () => {
                    if (GamePigRunMainScene.btnRed) {
                        GamePigRunMainScene.btnRed.stop();
                        if (GamePigRunLogic.wrongSwitcher == false) {
                            GamePigRunMainScene.btnRed.play("btnRedNormal", 0);
                        } else {
                            GamePigRunMainScene.btnRed.play("btnRedeWrong", 0);
                        }
                    }
                }, GamePigRunMainScene);
            }
            GamePigRunMainScene.btnRed.touchEnabled = false;
            App.TimerManager.doTimer(50, 1, () => {
                GamePigRunMainScene.btnRed.touchEnabled = true;
            }, GamePigRunMainScene);
        }
    }

    private remoteBlueBtnPress = () => {
        if (GamePigRunLogic.isOffline == false) {
            GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_BLUEBTN);
        } else {
            GamePigRunMainScene.blueBtnPress();
        }
    }

    /**
     * 蓝按钮被按下
     */
    public static blueBtnPress = () => {
        if (GamePigRunMainScene.tipsSwitcher == 0) { GamePigRunMainScene.tipsSwitcher = 1 };
        if (GamePigRunMainScene.keyState == 1) {
            return;
        }
        GamePigRunMainScene.keyState = 1;
        GamePigRunLogic.keyPress = "blue";
        GamePigRunMainScene.handlePress();
        GamePigRunMainScene.instance.gameResultCheck();

        if (GamePigRunLogic.keyPress != undefined && GamePigRunLogic.logicLocalColor != GamePigRunLogic.keyPress) {
            return;
        } else {
            if (GamePigRunMainScene.btnBlue) {
                GamePigRunMainScene.btnBlue.stop();
                GamePigRunMainScene.btnBlue.play("btnBluePress", 1);
                App.TimerManager.doTimer(35, 1, () => {
                    if (GamePigRunMainScene.btnBlue) {
                        GamePigRunMainScene.btnBlue.stop();
                        if (GamePigRunLogic.wrongSwitcher == false) {
                            GamePigRunMainScene.btnBlue.play("btnBlueNormal", 0);
                        } else {
                            GamePigRunMainScene.btnBlue.play("btnBlueWrong", 0);
                        }
                    }
                }, GamePigRunMainScene);
            }
            GamePigRunMainScene.btnBlue.touchEnabled = false;
            App.TimerManager.doTimer(50, 1, () => {
                GamePigRunMainScene.btnBlue.touchEnabled = true;
            }, GamePigRunMainScene);
        }
    }

    private remoteDeathBtnPress = () => {
        if (GamePigRunLogic.isOffline == false) {
            GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_DEATHBTN);
        } else {
            GamePigRunMainScene.deathBtnPress();
        }

        GamePigRunMainScene.instance.gameResultCheck();
    }

    /**
     * Death button keyPress
     */
    public static deathBtnPress = () => {
        if (GamePigRunMainScene.tipsSwitcher == 0) { GamePigRunMainScene.tipsSwitcher = 1 };
        GamePigRunLogic.keyPress = "death";
        if (GamePigRunMainScene.btnDeath) {
            GamePigRunMainScene.btnDeath.stop();
            GamePigRunMainScene.btnDeath.play("btnDeathPress", 1);
            App.TimerManager.doTimer(110, 1, () => {
                if (GamePigRunMainScene.btnDeath) {
                    GamePigRunMainScene.btnDeath.stop();
                    GamePigRunMainScene.btnDeath.play("btnDeathNormal", 0);
                }
            }, GamePigRunMainScene);
        }
    }

    private readyTick = (): boolean => {
        if (this.readyState[0] == 1 && this.readyState[1] == 1 && GamePigRunLogic.colorOtherSettings.length > 0) {
            this.readyState[0] == 0;
            this.readyState[1] == 0;
            egret.stopTick(this.readyTick, this);
            console.log("ready go!");
            App.TimerManager.doTimer(1000, 1, () => {
                GamePigRunMainScene.readyIMG.play();
                this.addChild(GamePigRunMainScene.readyIMG);
                this.getChildByName("roundText").alpha = 0;
            }, this);
        }
        return false;
    }

    private gameStartManager = () => {
        GamePigRunLogic.logicLocalColor = undefined;
        GamePigRunLogic.keyPress = undefined;

        GamePigRunMainScene.btnBlue.touchEnabled = false;
        GamePigRunMainScene.btnRed.touchEnabled = false;
        GamePigRunMainScene.btnDeath.touchEnabled = false;
        GamePigRunMainScene.part_you.alpha = 1;
        GamePigRunMainScene.part_other.alpha = 1;

        let num = GamePigRunLogic.numManager();
        let color = GamePigRunLogic.getColor("array");
        this.initNormalColor();

        GamePigRunMainScene.role_other.play("zhuli1", 0);
        GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];
        GamePigRunMainScene.role_you.play("zhuli2", 0);
        GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];

        GamePigRunMainScene.koText.alpha = 0;
        let tw = egret.Tween.get(GamePigRunMainScene.koText);
        tw.to({ scaleX: 0.1, scaleY: 0.1 }, 50);

        GamePigRunMainScene.gameTurns += 1;

        if (GamePigRunMainScene.gameTurns == 3) {
            GamePigRunMainScene.tipsCover.alpha = 1;
            GamePigRunMainScene.tipsSwitcher = 0;
            GamePigRunMainScene.tipsCover.play("Prompt2", 0);
            GamePigRunLogic.gameModeisDeathMode = true;
            (this.getChildByName("backGround") as egret.Bitmap).texture = AssetManager.getBitmap("PR_OverCharge_jpg", false, false).texture;
            let tw_btnRed = egret.Tween.get(GamePigRunMainScene.btnRed);
            tw_btnRed.to({ alpha: 0, y: GamePigRunMainScene.btnRed.y + 200 }, 500);
            let tw_btnBlue = egret.Tween.get(GamePigRunMainScene.btnBlue);
            tw_btnBlue.to({ alpha: 0, y: GamePigRunMainScene.btnBlue.y + 200 }, 500);
            let tw_btnDeath = egret.Tween.get(GamePigRunMainScene.btnDeath);
            tw_btnDeath.to({ alpha: 1, y: 1010 }, 500, egret.Ease.elasticOut);
            GamePigRunLogic.gameModeisDeathMode = true;
            this.getChildByName("rainbowCircleBorder").alpha = 1;
            (this.getChildByName("basicCircleBorder") as egret.Bitmap).texture = AssetManager.getBitmap("PR_rainbowBorder_png", false, false).texture;
            let needHide: Array<string> = ["part_you", "part_other", "step0", "step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9", "step10", "step11", "step12", "step13", "step14", "step15"]
            needHide.forEach(element => {
                this.getChildByName(element).alpha = 0;
            });
        }

        GamePigRunMainScene.roundText.texture = AssetManager.getBitmap("PR_round" + GamePigRunMainScene.gameTurns.toString() + "_png").texture;
        if (GamePigRunMainScene.gameTurns == 3) {
            GamePigRunMainScene.roundText.anchorOffsetX = 135.5;
            GamePigRunMainScene.roundText.anchorOffsetY = 102.5;
        }

        GamePigRunLogic.partExhibition(GamePigRunMainScene.part_you, undefined, num, true);
        GamePigRunLogic.roleExhibition(this.getChildByName("role_you") as egret.MovieClip, num, true);
        GamePigRunLogic.partExhibition(GamePigRunMainScene.part_other, undefined, 8, true);
        GamePigRunLogic.roleExhibition(this.getChildByName("role_other") as egret.MovieClip, 8, true);
        GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];
        GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];

        this.twManager("roundText");
        GamePigRunMainScene.volume_global.play("PR_music_round_mp3", true);
        GamePigRunMainScene.running = true;

        GamePigRunMainScene.readyIMG = new GameReady(() => {

            switch (GamePigRunLogic.colorSettings[GamePigRunLogic.otherOrderNum]) {
                case "red":
                    GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "red");
                    break;
                case "blue":
                    GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "blue");
                    break;
                case "yellow":
                    GamePigRunLogic.changeColor(this.getChildByName("part_other") as egret.Bitmap, "yellow");
                    break;
            }

            App.TimerManager.doTimer(1000, 1, () => {
                egret.startTick(this.circleLogic, this);
            }, this);

            GamePigRunMainScene.btnBlue.touchEnabled = true;
            GamePigRunMainScene.btnRed.touchEnabled = true;

            if (GamePigRunMainScene.gameTurns == 3) { GamePigRunMainScene.btnDeath.touchEnabled = true; }

            GamePigRunLogic.colorOtherSettings.forEach(element => {
                GamePigRunLogic.colorSettings.push(element);
            });

            GamePigRunLogic.partExhibition(GamePigRunMainScene.part_you, color, num, true);
            GamePigRunLogic.roleExhibition(this.getChildByName("role_you") as egret.MovieClip, num, true);
            GamePigRunLogic.partExhibition(GamePigRunMainScene.part_other, GamePigRunLogic.colorOtherSettings[0], 8, true);
            GamePigRunLogic.roleExhibition(this.getChildByName("role_other") as egret.MovieClip, 8, true);
            GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];
            GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];

            this.initColorBorder();
        })
        GamePigRunMainScene.readyIMG.x = 300;
        GamePigRunMainScene.readyIMG.y = App.GameHeight / 2;

        if (GamePigRunLogic.isOffline == true) {
            App.TimerManager.doTimer(2000, 1, () => {
                GamePigRunMainScene.readyIMG.play();
                this.addChild(GamePigRunMainScene.readyIMG);
                this.getChildByName("roundText").alpha = 0;
            }, this);
        } else {
            egret.startTick(this.readyTick, this);
            App.TimerManager.doTimer(1000, 1, () => {
                GamePigRunLogic.localMessageCenter(GamePigRunEventClass.EVENT_READY);
            }, this);
        }
    }
    pauseCallback = () => {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
        this.next("gameChangeMatch");
    }
    private addHeadIco = () => {
        let x, y;
        switch (GamePigRunMainScene.gameTurns) {
            case 1:
                x = 180;
                y = 170;
                break;
            case 2:
                x = 320;
                y = 170;
                break;
            case 3:
                x = 460;
                y = 170;
                break;
        }

        switch (GamePigRunMainScene.result) {
            case "you":
                let myRoleAvatar: RoleAvatar;
                let myData = DataCenter.instance.user;
                myRoleAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "toukuang");
                myRoleAvatar.armature.width = 170;
                myRoleAvatar.armature.height = 170;
                myRoleAvatar.armature.x = x;
                myRoleAvatar.armature.y = y;
                myRoleAvatar.armature.alpha = 0;
                this.addChild(myRoleAvatar.armature)
                GamePigRunMainScene.boomSmoke.x = x;
                GamePigRunMainScene.boomSmoke.y = y - 40;
                GamePigRunMainScene.boomSmoke.scaleX = 1.5;
                GamePigRunMainScene.boomSmoke.scaleY = 1.5;
                let tw = egret.Tween.get(myRoleAvatar.armature);
                App.TimerManager.doTimer(700, 1, () => {
                    GamePigRunMainScene.boomSmoke.stop();
                    GamePigRunMainScene.boomSmoke.play("boom", 1);
                }, this);
                tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
                tw.to({ scaleX: 0.8, scaleY: 0.8 }, 1000, egret.Ease.elasticInOut);
                break;
            case "other":
            case undefined:
                let otherRoleAvatar: RoleAvatar;
                let playData = DataCenter.instance.room.player;
                otherRoleAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "toukuang");
                otherRoleAvatar.armature.width = 170;
                otherRoleAvatar.armature.height = 170;
                otherRoleAvatar.armature.x = x;
                otherRoleAvatar.armature.y = y;
                otherRoleAvatar.armature.alpha = 0;
                this.addChild(otherRoleAvatar.armature);
                GamePigRunMainScene.boomSmoke.x = x;
                GamePigRunMainScene.boomSmoke.y = y - 40;
                GamePigRunMainScene.boomSmoke.scaleX = 1.5;
                GamePigRunMainScene.boomSmoke.scaleY = 1.5;
                let _tw = egret.Tween.get(otherRoleAvatar.armature);
                App.TimerManager.doTimer(700, 1, () => {
                    GamePigRunMainScene.boomSmoke.stop();
                    GamePigRunMainScene.boomSmoke.play("boom", 1);
                }, this);
                _tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 50);
                _tw.to({ scaleX: 0.8, scaleY: 0.8 }, 1000, egret.Ease.elasticInOut);
                break;
        }
    }

    private gameStart = () => {
        let backGround = AssetManager.getBitmap("PR_backGround_jpg", false, false);
        backGround.height = 1136;
        backGround.width = 640;
        backGround.x = 0;
        backGround.y = 0;
        backGround.name = "backGround";
        this.addChild(backGround);

        let step0 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step0.x = 319.5;
        step0.y = 526;
        step0.anchorOffsetY = 0;
        step0.name = "step0";
        step0.rotation = GamePigRunMainScene.partRotation[0];
        this.addChild(step0);

        let step1 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step1.x = 319.5;
        step1.y = 526;
        step1.anchorOffsetY = 0;
        step1.name = "step1";
        step1.rotation = GamePigRunMainScene.partRotation[1];
        this.addChild(step1);

        let step2 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step2.x = 319.5;
        step2.y = 526;
        step2.anchorOffsetY = 0;
        step2.name = "step2";
        step2.rotation = GamePigRunMainScene.partRotation[2];
        this.addChild(step2);

        let step3 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step3.x = 319.5;
        step3.y = 526;
        step3.anchorOffsetY = 0;
        step3.name = "step3";
        step3.rotation = GamePigRunMainScene.partRotation[3];
        this.addChild(step3);

        let step4 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step4.x = 319.5;
        step4.y = 526;
        step4.anchorOffsetY = 0;
        step4.name = "step4";
        step4.rotation = GamePigRunMainScene.partRotation[4];
        this.addChild(step4);

        let step5 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step5.x = 319.5;
        step5.y = 526;
        step5.anchorOffsetY = 0;
        step5.name = "step5";
        step5.rotation = GamePigRunMainScene.partRotation[5];
        this.addChild(step5);

        let step6 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step6.x = 319.5;
        step6.y = 526;
        step6.anchorOffsetY = 0;
        step6.name = "step6";
        step6.rotation = GamePigRunMainScene.partRotation[6];
        this.addChild(step6);

        let step7 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step7.x = 319.5;
        step7.y = 526;
        step7.anchorOffsetY = 0;
        step7.name = "step7";
        step7.rotation = GamePigRunMainScene.partRotation[7];
        this.addChild(step7);

        let step8 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step8.x = 319.5;
        step8.y = 526;
        step8.anchorOffsetY = 0;
        step8.name = "step8";
        step8.rotation = GamePigRunMainScene.partRotation[8];
        this.addChild(step8);

        let step9 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step9.x = 319.5;
        step9.y = 526;
        step9.anchorOffsetY = 0;
        step9.name = "step9";
        step9.rotation = GamePigRunMainScene.partRotation[9];
        this.addChild(step9);

        let step10 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step10.x = 319.5;
        step10.y = 526;
        step10.anchorOffsetY = 0;
        step10.name = "step10";
        step10.rotation = GamePigRunMainScene.partRotation[10];
        this.addChild(step10);

        let step11 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step11.x = 319.5;
        step11.y = 526;
        step11.anchorOffsetY = 0;
        step11.name = "step11";
        step11.rotation = GamePigRunMainScene.partRotation[11];
        this.addChild(step11);

        let step12 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step12.x = 319.5;
        step12.y = 526;
        step12.anchorOffsetY = 0;
        step12.name = "step12";
        step12.rotation = GamePigRunMainScene.partRotation[12];
        this.addChild(step12);

        let step13 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step13.x = 319.5;
        step13.y = 526;
        step13.anchorOffsetY = 0;
        step13.name = "step13";
        step13.rotation = GamePigRunMainScene.partRotation[13];
        this.addChild(step13);

        let step14 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step14.x = 319.5;
        step14.y = 526;
        step14.anchorOffsetY = 0;
        step14.name = "step14";
        step14.rotation = GamePigRunMainScene.partRotation[14];
        this.addChild(step14);

        let step15 = AssetManager.getBitmap("PR_yellowBorder_png", true, false);
        step15.x = 319.5;
        step15.y = 526;
        step15.anchorOffsetY = 0;
        step15.name = "step15";
        step15.rotation = GamePigRunMainScene.partRotation[15];
        this.addChild(step15);

        let rainbowCircleBorder = AssetManager.getBitmap("PR_rainbowBorder__png", true, true);
        rainbowCircleBorder.x = 321;
        rainbowCircleBorder.y = 525.5;
        rainbowCircleBorder.alpha = 0;
        rainbowCircleBorder.name = "rainbowCircleBorder";
        this.addChild(rainbowCircleBorder);

        let basicCircleBorder = AssetManager.getBitmap("PR_circleBorder_png", false, false);
        basicCircleBorder.anchorOffsetX = 302;
        basicCircleBorder.anchorOffsetY = 302;
        basicCircleBorder.x = 321;
        basicCircleBorder.y = 525.5;
        basicCircleBorder.name = "basicCircleBorder";
        this.addChild(basicCircleBorder);

        GamePigRunMainScene.btnRed = AssetManager.getDBArmature("PR_btnRedDB");
        GamePigRunMainScene.btnRed.timeScale = 2;
        GamePigRunMainScene.btnRed.x = 195;
        GamePigRunMainScene.btnRed.y = 1010;
        GamePigRunMainScene.btnRed.name = "btnRed";
        GamePigRunMainScene.btnRed.touchEnabled = false;
        this.addChild(GamePigRunMainScene.btnRed);
        GamePigRunMainScene.btnRed.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remoteRedBtnPress, this);
        GamePigRunMainScene.btnRed.timeScale = 2;
        GamePigRunMainScene.btnRed.play("btnRedNormal", 0);

        GamePigRunMainScene.btnBlue = AssetManager.getDBArmature("PR_btnBlueDB");
        GamePigRunMainScene.btnBlue.timeScale = 2;
        GamePigRunMainScene.btnBlue.x = 428;
        GamePigRunMainScene.btnBlue.y = 1010;
        GamePigRunMainScene.btnBlue.name = "btnBlue";
        GamePigRunMainScene.btnBlue.touchEnabled = false;
        this.addChild(GamePigRunMainScene.btnBlue);
        GamePigRunMainScene.btnBlue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remoteBlueBtnPress, this);
        GamePigRunMainScene.btnBlue.timeScale = 2;
        GamePigRunMainScene.btnBlue.play("btnBlueNormal", 0);

        GamePigRunMainScene.btnDeath = AssetManager.getDBArmature("PR_btnDeathDB");
        GamePigRunMainScene.btnDeath.timeScale = 4;
        GamePigRunMainScene.btnDeath.x = 320;
        GamePigRunMainScene.btnDeath.y = 1210;
        GamePigRunMainScene.btnDeath.alpha = 0;
        GamePigRunMainScene.btnDeath.name = "btnDeath";
        this.addChild(GamePigRunMainScene.btnDeath);
        GamePigRunMainScene.btnDeath.touchEnabled = false;
        GamePigRunMainScene.btnDeath.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remoteDeathBtnPress, this);
        GamePigRunMainScene.btnDeath.timeScale = 3;
        GamePigRunMainScene.btnDeath.play("btnDeathNormal", 0);

        GamePigRunMainScene.part_you = AssetManager.getBitmap("PR_glaryAngle_png", true, false);
        GamePigRunMainScene.part_you.x = 320;
        GamePigRunMainScene.part_you.y = 526;
        GamePigRunMainScene.part_you.anchorOffsetY = 0;
        GamePigRunMainScene.part_you.name = "part_you";
        GamePigRunMainScene.part_you.rotation = GamePigRunMainScene.partRotation[0];
        this.addChild(GamePigRunMainScene.part_you);

        GamePigRunMainScene.part_other = AssetManager.getBitmap("PR_glaryAngle_png", true, false);
        GamePigRunMainScene.part_other.x = 320;
        GamePigRunMainScene.part_other.y = 526;
        GamePigRunMainScene.part_other.anchorOffsetY = 0;
        GamePigRunMainScene.part_other.name = "part_other";
        GamePigRunMainScene.part_other.rotation = GamePigRunMainScene.partRotation[8];
        this.addChild(GamePigRunMainScene.part_other);

        GamePigRunMainScene.role_you = AssetManager.getDBArmature("Armature");
        GamePigRunMainScene.role_you.timeScale = 2;
        GamePigRunMainScene.role_you.x = 320;
        GamePigRunMainScene.role_you.y = 526;
        GamePigRunMainScene.role_you.anchorOffsetX = 64;
        GamePigRunMainScene.role_you.anchorOffsetY = 0;
        GamePigRunMainScene.role_you.rotation = GamePigRunMainScene.partRotation[0];
        GamePigRunMainScene.role_you.name = "role_you";
        this.addChild(GamePigRunMainScene.role_you);
        GamePigRunMainScene.role_you.play("zhuli2", 0);
        GamePigRunMainScene.roleYouRotation = GamePigRunMainScene.partRotation[0];

        GamePigRunMainScene.role_other = AssetManager.getDBArmature("Armature");
        GamePigRunMainScene.role_other.timeScale = 2;
        GamePigRunMainScene.role_other.x = 320;
        GamePigRunMainScene.role_other.y = 526;
        GamePigRunMainScene.role_other.anchorOffsetX = 64;
        GamePigRunMainScene.role_other.anchorOffsetY = 0;
        GamePigRunMainScene.role_other.rotation = GamePigRunMainScene.partRotation[8];
        GamePigRunMainScene.role_other.name = "role_other";
        this.addChild(GamePigRunMainScene.role_other);
        GamePigRunMainScene.role_other.play("zhuli1", 0);
        GamePigRunMainScene.roleOtherRotation = GamePigRunMainScene.partRotation[8];

        let particleSmokeTexture = RES.getRes("PR_smoke_png");
        let particleSmokeConfig = RES.getRes("PR_smoke_json");
        GamePigRunMainScene.particleSmoke = new particle.GravityParticleSystem(particleSmokeTexture, particleSmokeConfig);
        this.addChild(GamePigRunMainScene.particleSmoke);

        let particleStarsTexture = RES.getRes("PR_stars_png");
        let particleStarsConfig = RES.getRes("PR_stars_json");
        GamePigRunMainScene.particleStars = new particle.GravityParticleSystem(particleStarsTexture, particleStarsConfig);
        this.addChild(GamePigRunMainScene.particleStars);

        if (!GamePigRunMainScene.role_you) {
            console.error(`============> GamePigRunMainScene.role_you: ${GamePigRunMainScene.role_you}`);
        }
        if (!GamePigRunMainScene.role_other) {
            console.error(`============> GamePigRunMainScene.role_other: ${GamePigRunMainScene.role_other}`);
        }
        let myRoleAvatar: RoleAvatar;
        let myData = DataCenter.instance.user;
        myRoleAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl);
        if (!myRoleAvatar.armature) {
            console.error(`============> myRoleAvatar.armature: ${myRoleAvatar.armature}`);
        }
        GamePigRunMainScene.role_you["_armature"].getSlot("ren").childArmature = myRoleAvatar.armature["_armature"];

        let otherRoleAvatar: RoleAvatar;
        let playData = DataCenter.instance.room.player;
        otherRoleAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl);
        if (!otherRoleAvatar.armature) {
            console.error(`============> otherRoleAvatar.armature: ${otherRoleAvatar.armature}`);
        }
        GamePigRunMainScene.role_other["_armature"].getSlot("ren").childArmature = otherRoleAvatar.armature["_armature"];

        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba) {
            let returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            returnToLastButton.y = 19;
            this.addChild(returnToLastButton);
            returnToLastButton.touchEnabled = true;
            returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.popup("GameSureLeave");
            }, this)
        }

        GamePigRunMainScene.roundText = AssetManager.getBitmap("PR_round1_png", true, true);
        GamePigRunMainScene.roundText.x = 320;
        GamePigRunMainScene.roundText.y = 522;
        GamePigRunMainScene.roundText.name = "roundText";
        this.addChild(GamePigRunMainScene.roundText);

        GamePigRunMainScene.tipsCover = AssetManager.getDBArmature("pigD");
        GamePigRunMainScene.tipsCover.x = 312;
        GamePigRunMainScene.tipsCover.y = 1145;
        GamePigRunMainScene.tipsCover.name = "tipsCover";
        this.addChild(GamePigRunMainScene.tipsCover);
        GamePigRunMainScene.tipsCover.play("Prompt1", 0);

        GamePigRunMainScene.resultText = AssetManager.getBitmap("PR_win_png", true, false);
        GamePigRunMainScene.resultText.width = 231;
        GamePigRunMainScene.resultText.height = 73;
        GamePigRunMainScene.resultText.x = 320;
        GamePigRunMainScene.resultText.y = 812;
        GamePigRunMainScene.resultText.alpha = 0;
        GamePigRunMainScene.resultText.name = "resultText";
        this.addChild(GamePigRunMainScene.resultText);

        GamePigRunMainScene.koText = AssetManager.getBitmap("PR_KO_png", true, true);
        GamePigRunMainScene.koText.width = 452;
        GamePigRunMainScene.koText.height = 282;
        GamePigRunMainScene.koText.x = 320;
        GamePigRunMainScene.koText.y = 525;
        GamePigRunMainScene.koText.alpha = 0;
        GamePigRunMainScene.koText.name = "koText";
        this.addChild(GamePigRunMainScene.koText);

        GamePigRunMainScene.boomSmoke = AssetManager.getDBArmature("boom");
        GamePigRunMainScene.boomSmoke.x = 0;
        GamePigRunMainScene.boomSmoke.y = 0;
        GamePigRunMainScene.boomSmoke.name = "boom";
        this.addChild(GamePigRunMainScene.boomSmoke);

        GamePigRunMainScene.volume_you = new SoundEffects();
        GamePigRunMainScene.volume_you.setVolume(0.7);
        GamePigRunMainScene.volume_other = new SoundEffects();
        GamePigRunMainScene.volume_other.setVolume(0.7);
        GamePigRunMainScene.volume_global = new SoundEffects();
        GamePigRunMainScene.volume_global.setVolume(0.7);

        this.initNormalColor();

        //游戏内事件返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.messageDuel, this);
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.resultDuel, this);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
        if (this.stage.stageHeight < 1136) {
            GamePigRunMainScene.multiple = (this.stage.stageHeight / 1136);
            this.scaleX = GamePigRunMainScene.multiple;
            this.scaleY = GamePigRunMainScene.multiple;
            let nowWidth = 640 * GamePigRunMainScene.multiple;
            this.x = (640 - nowWidth) / 2;
        } else if (this.stage.stageHeight > 1136) {
            this.y = (this.stage.stageHeight - 1136) / 2;
        }

        this.gameStartManager();
    }
}