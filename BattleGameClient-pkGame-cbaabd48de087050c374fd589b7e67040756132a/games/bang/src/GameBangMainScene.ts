class GameBangMainScene extends State {
    public constructor() {
        super();
        GameBangMainScene.instance = this;
    }
    static instance: GameBangMainScene;
    private expressionTimer: number;
    private screen: egret.DisplayObjectContainer;
    private fireEffect: egret.Bitmap;
    private otherSweat: egret.Bitmap;
    private youSweat: egret.Bitmap;
    private reloadingImg: egret.Bitmap;
    private _announcement = new egret.DisplayObjectContainer();
    private readyImg: egret.Bitmap;
    private youHealth_1: egret.Bitmap;
    private youHealth_2: egret.Bitmap;
    private youHealth_3: egret.Bitmap;
    private youHealth_4: egret.Bitmap;
    private youHealth_5: egret.Bitmap;
    private otherHealth_1: egret.Bitmap;
    private otherHealth_2: egret.Bitmap;
    private otherHealth_3: egret.Bitmap;
    private otherHealth_4: egret.Bitmap;
    private otherHealth_5: egret.Bitmap;
    private blackMask: egret.Bitmap;
    private gameTips: egret.Bitmap;
    private expression: egret.Bitmap;
    private announcement: egret.Bitmap;
    private N: egret.Bitmap;
    private turnText: egret.BitmapText;
    private hasRun: boolean = false;

    init() {
        super.init();

        GameBangItemClass.dispose();

        if (DataCenter.instance.room.IsAI) {
            GameBangItemClass.isOffline = true;
        }

        GameBangLogic.isHost();
        App.SoundManager.stopBg();
        App.SoundManager.playBg("BA_bgm_w8ToShoot_mp3");

        egret.lifecycle.onPause = () => {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GameBangItemClass.backGroundSoundEffect) {
                GameBangItemClass.backGroundSoundEffect.setVolume(0);
            }
            if (GameBangItemClass.otherSoundEffect) {
                GameBangItemClass.otherSoundEffect.setVolume(0);
            }
            if (GameBangItemClass.thirdSoundEffect) {
                GameBangItemClass.thirdSoundEffect.setVolume(0);
            }
            if (GameBangItemClass.youSoundEffect) {
                GameBangItemClass.youSoundEffect.setVolume(0);
            }
        }

        egret.lifecycle.onResume = () => {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GameBangItemClass.backGroundSoundEffect) {
                GameBangItemClass.backGroundSoundEffect.setVolume(1);
            }
            if (GameBangItemClass.otherSoundEffect) {
                GameBangItemClass.otherSoundEffect.setVolume(1);
            }
            if (GameBangItemClass.thirdSoundEffect) {
                GameBangItemClass.thirdSoundEffect.setVolume(1);
            }
            if (GameBangItemClass.youSoundEffect) {
                GameBangItemClass.youSoundEffect.setVolume(1);
            }
        }

        this.gameStart();
    }

    dispose() {
        super.dispose();

        if (GameBangItemClass.btnBang) {
            GameBangItemClass.btnBang.removeEventListener("touchTap", this.shoot, this);
        }

        GameBangItemClass.dispose();

        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.messageManager, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.resultDeal, this);

        if (this.expressionTimer) {
            egret.clearTimeout(this.expressionTimer);
        }

        App.TimerManager.remove(this.otherShootJudge, this);

        egret.stopTick(this.mainTick, this);
        egret.stopTick(this.readyTick, this);

        egret.Tween.removeAllTweens();
    }

    /**
     * shockEffect manager
     */
    private shockEffect = (staticItem: egret.DisplayObject, interval: number, time: number, pxRange: number, fastenPxRange: number, effectX = true, effectY = true, loopEffect = false, resetPos = true) => {
        let orX = staticItem.x;
        let orY = staticItem.y;
        let symbol = [-1, 1];
        let xSymbol = App.RandomUtils.randomArray(symbol);
        let ySymbol = App.RandomUtils.randomArray(symbol);
        let _pxXRange = App.RandomUtils.limitInteger(0, pxRange);
        let _pxYRange = App.RandomUtils.limitInteger(0, pxRange);
        let tw = egret.Tween.get(staticItem, { loop: true });

        let xNum: number, yNum: number;

        App.TimerManager.doTimer(time, 1, () => {
            egret.Tween.removeTweens(staticItem);
            staticItem.x = orX;
            staticItem.y = orY;
        }, this);

        let ifEffect = () => {
            switch (loopEffect) {
                case true:
                    if (xSymbol == 1) {
                        xSymbol = -1;
                    } else {
                        xSymbol = 1;
                    }
                    if (ySymbol == 1) {
                        ySymbol = -1;
                    } else {
                        ySymbol = 1;
                    }
                    break;
                case false:
                    xSymbol = App.RandomUtils.randomArray(symbol);
                    ySymbol = App.RandomUtils.randomArray(symbol);
                    break;
            }

            if (effectX == true) {
                xNum = (orX + xSymbol * fastenPxRange + xSymbol * _pxXRange);
            } else {
                xNum = orX;
            }

            if (effectY == true) {
                yNum = (orY + xSymbol * fastenPxRange + ySymbol * _pxYRange);
            } else {
                yNum = orY;
            }
        }

        ifEffect();

        tw.to({ x: xNum, y: yNum }, interval);
        tw.call(() => {
            if (resetPos == true) {
                staticItem.x = orX;
                staticItem.y = orY;
            }
            _pxXRange = App.RandomUtils.limitInteger(0, pxRange);
            _pxYRange = App.RandomUtils.limitInteger(0, pxRange);

            ifEffect();
        });
    }

    /**
     * turn manager
     */
    private turnManager = () => {
        App.TimerManager.remove(this.otherShootJudge, this);
        if (this.screen) {
            this.screen.alpha = 0;
        }

        GameBangItemClass.fireLightL.alpha = 0;
        GameBangItemClass.fireLightR.alpha = 0;
        GameBangItemClass.youFruit.alpha = 0;
        GameBangItemClass.otherFruit.alpha = 0;
        GameBangItemClass.youFruitBoom.alpha = 0;
        GameBangItemClass.otherFruitBoom.alpha = 0;

        if (this.screen) {
            this.screen.alpha = 0;
        }

        App.SoundManager.stopBg();
        App.SoundManager.playBg("BA_bgm_w8ToShoot_mp3");

        if (GameBangItemClass.turnNum == 1) {
            this.firstStartEffectManager(() => {
                this.betweenFieldEffectManager(() => {
                    GameBangLogic.randomFruit();
                    GameBangItemClass.youFruit.alpha = 1;
                    GameBangItemClass.otherFruit.alpha = 1;
                    egret.startTick(this.mainTick, this);
                    if (GameBangItemClass.isOffline == true) {
                        GameBangItemClass.AICanShoot = true;
                        if (App.CurrGameAiLevel < 4) {
                            App.TimerManager.doTimer(500 + (Math.random() * 3500), 1, this.otherShootJudge, this);
                        }
                    }
                    GameBangItemClass.btnBang.touchEnabled = true;
                });
            });
        } else {
            this.betweenFieldEffectManager(() => {
                GameBangLogic.randomFruit();
                GameBangItemClass.youFruit.alpha = 1;
                GameBangItemClass.otherFruit.alpha = 1;
                egret.startTick(this.mainTick, this);
                if (GameBangItemClass.isOffline == true) {
                    GameBangItemClass.AICanShoot = true;
                    if (App.CurrGameAiLevel < 4) {
                        App.TimerManager.doTimer(500 + (Math.random() * 3500), 1, this.otherShootJudge, this);
                    }
                }
                GameBangItemClass.btnBang.touchEnabled = true;
            });
        }

        GameBangItemClass.readyState = [0, 0];
        console.log("第" + GameBangItemClass.turnNum.toString() + "回合开始！");

        let healthArray: Array<string> = ["youHealth_1", "youHealth_2", "youHealth_3", "youHealth_4", "youHealth_5", "otherHealth_1", "otherHealth_2", "otherHealth_3", "otherHealth_4", "otherHealth_5", "btnBang"];

        healthArray.forEach(element => {
            (this.getChildByName(element) as egret.Bitmap).alpha = 1;
        });
    }

    /**
     * shoot result deal
     */
    private shootResultDeal = () => {
        App.TimerManager.remove(this.shootResultDeal, this);
        let rightTime: number;
        GameBangItemClass.gameSettings.forEach(element => {
            if (element[1] == 0) {
                rightTime = element[0];
            }
        });
        let youDvalue = GameBangItemClass.youShootSec - rightTime;
        let otherDvalue = GameBangItemClass.otherShootSec - rightTime;

        if (GameBangItemClass.youShootSec == -1) {
            // other win
            this.otherShootJudge(false, true)
        } else if (GameBangItemClass.otherShootSec == -1) {
            // you win
            this.shoot(true);
        } else {
            console.log("rightTime :" + rightTime.toString() + ", youDvalue :" + youDvalue.toString() + ", otherDvalue :" + otherDvalue.toString());
            if (youDvalue > otherDvalue) {
                // other win
                this.otherShootJudge(false, true);
            } else if (youDvalue < otherDvalue) {
                // you win
                this.shoot(true);
            } else {
                if (parseInt(DataCenter.instance.user.id.toString()) > parseInt(DataCenter.instance.room.player.id.toString())) {
                    this.shoot(true);
                } else {
                    this.otherShootJudge(false, true);
                }
            }
        }

        this.hasRun = false;
    }

    private remoteShoot = () => {
        if (GameBangItemClass.isOffline == false) {
            GameBangEventClass.messageCenter(GameBangEventClass.EVENT_ISHOOT);
        } else {
            this.preShoot();
        }
    }

    /**
     * btn "bang" callback pretreatment
     */
    private preShoot = () => {
        GameBangItemClass.btnBang.touchEnabled = false;
        console.log("you shoot in :" + GameBangItemClass.restSec.toString());
        GameBangEventClass.messageCenter(GameBangEventClass.EVENT_SHOOT);
        switch (GameBangItemClass.reference) {
            case true:
                if (this.hasRun == false) {
                    this.hasRun = true;
                    App.TimerManager.doTimer(200, 1, () => {
                        this.shootResultDeal();
                    }, this);
                }
                break;
            case false:
                this.shoot();
                break;
            default:
                break;
        }
    }

    /**
     * btn "bang" callback
     */
    private shoot = (bool: boolean = false) => { // _shoot
        GameBangItemClass.btnBang.texture = AssetManager.getBitmap("BA_btnBangPressed_png").texture;
        GameBangItemClass.btnBang.touchEnabled = false;
        console.log(GameBangItemClass.reference);
        App.SoundManager.playEffect("BA_gunEffect_mp3", true);
        GameBangItemClass.youRole.texture = AssetManager.getBitmap("BA_youRoleS_png").texture;
        if (GameBangItemClass.reference == true || bool == true) {
            // you hit other sucessful            
            if (GameBangItemClass.isOffline == true) {
                App.TimerManager.remove(this.otherShootJudge, this);
            }
            GameBangItemClass.AICanShoot = false;
            App.SoundManager.stopBg();
            GameBangItemClass.youSoundEffect.play("BA_bgm_hitedOther_mp3", true);
            GameBangItemClass.thirdSoundEffect.play("BA_happyAndHitOther_mp3", true);
            GameBangItemClass.otherSoundEffect.play("BA_beHit_mp3", true);
            GameBangLogic.fruitEffectManager(1);
            this.fireSmokeEffectManager(0);
            this.shootEffectManager(0);
            if (GameBangItemClass.otherHealth >= 1) {
                GameBangItemClass.otherHealth -= 1;
                this.healthEffectManager(1, GameBangItemClass.otherHealth, 1);
            }
            GameBangItemClass.turnState[0] = 1;
            this.shockEffect(GameBangItemClass.otherRole, 10, 1000, 10, 5);
            egret.stopTick(this.mainTick, this);
            App.TimerManager.doTimer(3000, 1, () => {
                this.turnEnd();
            }, this);
        } else {
            // you have not hit other sucessful
            GameBangItemClass.thirdSoundEffect.play("BA_happyAndHitOther_mp3", true);
            this.fireSmokeEffectManager(0);
            this.shootEffectManager(1, 0);
            GameBangItemClass.turnState[0] = 2;
            GameBangLogic.randomBulletHole();
        }
    }

    /**
     * other shoot judge pretreatment
     */
    private preOtherShootJudge = (num: number) => {
        console.log("other shoot in :" + num.toString());
        GameBangItemClass.otherShootSec = num;
        GameBangItemClass.btnBang.touchEnabled = false;
        if (this.hasRun == false) {
            this.hasRun = true;
            App.TimerManager.doTimer(200, 1, () => {
                this.shootResultDeal();
            }, this);
        }
    }

    /**
     * other shoot judge
     */
    private otherShootJudge = (n = false, bool: boolean = false) => {
        if (GameBangItemClass.isOffline == true && GameBangItemClass.AICanShoot == false) {
            return;
        }

        GameBangItemClass.fireLightL.alpha = 1;
        GameBangItemClass.fireLightR.alpha = 1;
        App.TimerManager.doTimer(300, 1, () => {
            GameBangItemClass.fireLightL.alpha = 0;
            GameBangItemClass.fireLightR.alpha = 0;
        }, this)

        GameBangItemClass.AICanShoot = false;
        let shootCrooked = () => {
            // other have not hit you sucessful
            GameBangItemClass.thirdSoundEffect.play("BA_happyNoHit_mp3", true);
            this.shootScreen();
            this.fireSmokeEffectManager(1);
            this.shootEffectManager(0, 1);
            GameBangItemClass.turnState[1] = 2;
            GameBangLogic.randomBulletHole();
        }
        App.SoundManager.playEffect("BA_gunEffect_mp3", true);
        // if (GameBangItemClass.isOffline == true && n == true) {
        //     GameBangItemClass.otherRole.texture = AssetManager.getBitmap("BA_otherRoleS_png").texture;
        //     shootCrooked();
        //     return;
        // }
        GameBangItemClass.otherRole.texture = AssetManager.getBitmap("BA_otherRoleS_png").texture;
        if (GameBangItemClass.reference == true || bool == true) {
            // other hit other sucessful
            GameBangItemClass.btnBang.touchEnabled = false;
            App.SoundManager.stopBg();
            App.SoundManager.playBg("BA_bgm_hited_mp3");
            GameBangItemClass.youSoundEffect.play("BA_beHit_mp3");
            this.fireSmokeEffectManager(1);
            this.shootEffectManager(1);
            GameBangLogic.fruitEffectManager(0);
            if (GameBangItemClass.youHealth >= 1) {
                GameBangItemClass.youHealth -= 1;
                this.healthEffectManager(0, GameBangItemClass.youHealth, 1);
            }
            GameBangItemClass.turnState[1] = 1;
            this.shockEffect(GameBangItemClass.youRole, 10, 1000, 10, 5);
            egret.stopTick(this.mainTick, this);
            App.TimerManager.doTimer(3000, 1, () => {
                this.turnEnd();
            }, this);
        } else {
            // other have not hit you sucessful
            shootCrooked();
        }
    }

    /**
     * ready tick
     */
    private readyTick = (): boolean => {
        switch (GameBangItemClass.isOffline) {
            case false:
                if (GameBangItemClass.readyState[0] == 1 && GameBangItemClass.readyState[1] == 1) {
                    GameBangItemClass.readyState = [0, 0];
                    console.log("send settings!");
                    GameBangEventClass.messageCenter(GameBangEventClass.EVENT_SENDSETTINGS);
                    return false;
                }
                if (GameBangItemClass.gameSettings.length > 0) {
                    egret.stopTick(this.readyTick, this);
                    App.TimerManager.doTimer(1500, 1, this.turnManager, this);
                }
                break;
            case true:
                if (GameBangItemClass.gameSettings.length > 0) {
                    egret.stopTick(this.readyTick, this);
                    App.TimerManager.doTimer((1000 + 2000 * Math.random()), 1, this.turnManager, this);
                } else {
                    GameBangLogic.decodeSettings(GameBangLogic.makeSettings());
                }
                return false;
        }

        return false;
    }

    /**
     * function 4 is offline or not callback
     */
    private isOfflineCallback = (yesCallback: () => any, noCallback: () => any) => {
        switch (GameBangItemClass.isOffline) {
            case false:
                if (noCallback) {
                    noCallback();
                }
                break;
            case true:
                if (yesCallback) {
                    yesCallback();
                }
                break;
        }
    }

    private AI = () => {
        let shootTime: number;
        let random = Math.random();

        let setRightTime = () => {
            App.TimerManager.remove(this.otherShootJudge, this);
            App.TimerManager.doTimer((550 + Math.round(Math.random() * 500)), 1, this.otherShootJudge, this);
            console.log("shooooooot!");
        }

        switch (App.CurrGameAiLevel) {
            case 1:
                if (random <= 0.2) {
                    setRightTime();
                }
                break;
            case 2:
                if (random <= 0.4) {
                    setRightTime();
                }
                break;
            case 3:
                if (random <= 0.6) {
                    setRightTime();
                }
                break;
            case 4:
                if (random <= 0.85) {
                    App.TimerManager.remove(this.otherShootJudge, this);
                    App.TimerManager.doTimer((350 + Math.round(Math.random() * 450)), 1, this.otherShootJudge, this);
                }
                break;
            case 5:
                if (random <= 1) {
                    App.TimerManager.remove(this.otherShootJudge, this);
                    App.TimerManager.doTimer((200 + Math.round(Math.random() * 100)), 1, this.otherShootJudge, this);
                }
                break;
        }
    }

    /**
     * the main tick
     */
    private mainTick = (): boolean => { // _maintick
        if (GameBangItemClass.restSec > 0) {
            GameBangItemClass.gameSettings.forEach(element => {
                if (element[0] == GameBangItemClass.restSec) {
                    GameBangLogic.showShootingTips(GameBangLogic.tipPosManager(), element[1]);
                    if (element[1] == 0) {
                        GameBangItemClass.reference = true;
                        if (GameBangItemClass.isOffline == true) {
                            this.AI();
                        }
                    }
                }
            });
            GameBangItemClass.restSec -= 1;
        }

        if (GameBangItemClass.restSec == 0) {
            egret.stopTick(this.mainTick, this);
            GameBangItemClass.btnBang.touchEnabled = false;
            if (GameBangItemClass.turnState[0] == 0 && GameBangItemClass.turnState[1] == 0) {
                // show
                GameBangItemClass.img5s.alpha = 1;
                App.TimerManager.doTimer(1600, 1, () => {
                    GameBangItemClass.img5s.alpha = 0;
                }, this);
            }
            console.log("turn end!");
            this.turnEnd();
        }

        return true;
    }

    /**
     * other do not hit you effect
     */
    private shootScreen = () => {
        GameBangItemClass.youSoundEffect.play("BA_noHit_mp3", true);
        this.screen = new egret.DisplayObjectContainer();

        if (this.screen && this.screen.alpha == 0) {
            this.screen.getChildByName("screenBreaker").x = App.RandomUtils.limitInteger(200, 490);
            this.screen.getChildByName("screenBreaker").y = App.RandomUtils.limitInteger(200, 900);
            this.screen.alpha = 1;
        } else {
            let backMask = AssetManager.getBitmap("BA_whiteMask_png", false, false);
            backMask.x = 0;
            backMask.y = 0;
            backMask.alpha = 0.2;
            this.screen.addChild(backMask);
            let screenBreaker = AssetManager.getBitmap("BA_notBeHit_png", true, true);
            screenBreaker.name = "screenBreaker";
            screenBreaker.x = App.RandomUtils.limitInteger(200, 490);
            screenBreaker.y = App.RandomUtils.limitInteger(200, 900);
            this.screen.addChild(screenBreaker);
            this.addChild(this.screen);
        }

        let tw = egret.Tween.get(screen);
        tw.to({ alpha: 1 }, 800);
        tw.to({ alpha: 0 }, 800);
        tw.call(() => {
            this.screen.alpha = 0;
            tw = null;
        });
    }

    /**
     * manager 4 message received
     */
    private messageManager = (data: any) => { //_message
        let cmdString: Array<string>;
        cmdString = data.event.split("|");
        switch (cmdString[0]) {
            case GameBangEventClass.EVENT_READY:
                switch (data.userId.toString()) {
                    case DataCenter.instance.user.id.toString():
                        GameBangItemClass.readyState[0] = 1;
                        break;
                    case DataCenter.instance.room.player.id.toString():
                        GameBangItemClass.readyState[1] = 1;
                        break;
                }
                break;
            case GameBangEventClass.EVENT_SENDSETTINGS:
                GameBangLogic.decodeSettings(cmdString[1]);
                break;
            case GameBangEventClass.EVENT_SHOOT:
                if (GameBangItemClass.reference == false) {
                    this.otherShootJudge();
                } else {
                    this.preOtherShootJudge(parseInt(cmdString[1]));
                }
                break;
            case GameBangEventClass.EVENT_ISHOOT:
                if (data.userId == DataCenter.instance.user.id) {
                    this.preShoot();
                }
                break;
            case GameBangEventClass.EVENT_RESULT:
                GameBangItemClass.endArray[1] = [parseInt(cmdString[2]), parseInt(cmdString[1])];
                break;
        }
    }

    private endTick = (): boolean => {
        if (GameBangItemClass.endArray[0] == undefined || GameBangItemClass.endArray[1] == undefined) {
            return false;
        }

        if (GameBangItemClass.endArray[0][1] != undefined && GameBangItemClass.endArray[0][0] != undefined && GameBangItemClass.endArray[1][1] != undefined && GameBangItemClass.endArray[1][0] != undefined) {
            egret.stopTick(this.endTick, this);
            let _youHealth: number, _otherHealth: number;
            if (GameBangItemClass.endArray[0][0] > GameBangItemClass.endArray[1][0]) {
                _youHealth = GameBangItemClass.endArray[1][0];
            } else if (GameBangItemClass.endArray[0][0] < GameBangItemClass.endArray[1][0]) {
                _youHealth = GameBangItemClass.endArray[0][0];
            }
            if (GameBangItemClass.endArray[0][1] > GameBangItemClass.endArray[1][1]) {
                _otherHealth = GameBangItemClass.endArray[1][1];
            } else if (GameBangItemClass.endArray[0][1] < GameBangItemClass.endArray[1][1]) {
                _otherHealth = GameBangItemClass.endArray[0][1];
            }

            if (GameBangItemClass.youHealth != _youHealth && _youHealth != undefined) {
                GameBangItemClass.youHealth = _youHealth;
                for (let index = 0; index < GameBangItemClass.youHealth; index++) { // target
                    let n: number;
                    n = index + 1;
                    (this.getChildByName("youHealth_" + n) as egret.Bitmap).texture = AssetManager.getBitmap("BA_health_png", true, true).texture;
                }
                let rest = 5 - GameBangItemClass.youHealth;
                for (let index = 0; index < rest; index++) {
                    let num = 6 - rest;
                    (this.getChildByName("youHealth_" + num) as egret.Bitmap).texture = AssetManager.getBitmap("BA_healthGray_png", true, true).texture;
                }
            }

            if (GameBangItemClass.otherHealth != _otherHealth && _otherHealth != undefined) {
                GameBangItemClass.otherHealth = _otherHealth;
                for (let i = 0; i < GameBangItemClass.otherHealth; i++) {
                    let n: number;
                    n = i + 1;
                    (this.getChildByName("otherHealth_" + n) as egret.Bitmap).texture = AssetManager.getBitmap("BA_health_png", true, true).texture;
                }
                let rest = 5 - GameBangItemClass.otherHealth;
                for (let index = 0; index < rest; index++) {
                    let num = 6 - rest;
                    (this.getChildByName("otherHealth_" + num) as egret.Bitmap).texture = AssetManager.getBitmap("BA_healthGray_png", true, true).texture;
                }
            }

            this.localResultManager();
            GameBangItemClass.endArray = [];
        }
        return false;
    }

    private localResultManager = () => {
        if (GameBangItemClass.youHealth == 0 || GameBangItemClass.otherHealth == 0) {

            if (this.expressionTimer) {
                egret.clearTimeout(this.expressionTimer);
            }

            App.TimerManager.remove(this.otherShootJudge, this);

            egret.stopTick(this.mainTick, this);
            egret.stopTick(this.readyTick, this);

            let youWin = () => {
                egret.stopTick(this.mainTick, this);
                let winLight = AssetManager.getBitmap("BA_winLight_png");
                winLight.x = 320;
                winLight.y = 420;
                this.addChild(winLight);

                let winIMG = AssetManager.getBitmap("BA_win_png", false, false);
                winIMG.x = 0;
                winIMG.y = 0;
                this.addChild(winIMG);

                let tw = egret.Tween.get(winLight, { loop: true });
                tw.to({ rotation: 180 }, 2000);
                tw.to({ rotation: 360 }, 2000);

                App.SoundManager.playEffect("BA_win_mp3");
                App.TimerManager.doTimer(3000, 1, () => {
                    egret.Tween.removeAllTweens();
                }, this);
                App.TimerManager.doTimer(4000, 1, () => {
                    GameBangLogic.gameOver(3);
                }, this);
            }

            let otherWin = () => {
                egret.stopTick(this.mainTick, this);
                let loseIMG = AssetManager.getBitmap("BA_lose_png", false, false);
                loseIMG.x = 0;
                loseIMG.y = 0;
                this.addChild(loseIMG);
                App.SoundManager.playEffect("BA_lose_mp3");
                App.TimerManager.doTimer(3000, 1, () => {
                    egret.Tween.removeAllTweens();
                }, this);
                App.TimerManager.doTimer(4000, 1, () => {
                    GameBangLogic.gameOver(1);
                }, this);
            }

            if (GameBangItemClass.youHealth == 0) {
                otherWin();
            } else if (GameBangItemClass.youHealth == 0 && GameBangItemClass.otherHealth == 0) {
                if (GameBangItemClass.isHost == true) {
                    youWin();
                } else {
                    otherWin();
                }
            } else if (GameBangItemClass.otherHealth == 0) {
                youWin();
            }
        } else {
            App.TimerManager.doTimer(1000, 1, () => {
                egret.startTick(this.readyTick, this);
                GameBangEventClass.messageCenter(GameBangEventClass.EVENT_READY);
            }, this);
        }
    }

    /**
     * turn end
     */
    private turnEnd = () => {
        GameBangItemClass.AICanShoot = true;
        egret.stopTick(this.mainTick, this);
        GameBangLogic.turnDispose();

        GameBangLogic.resetTips();

        GameBangItemClass.youShootSec = -1;
        GameBangItemClass.otherShootSec = -1;

        GameBangItemClass.turnNum += 1;
        if (GameBangItemClass.isOffline == false) {
            egret.startTick(this.endTick, this);
            GameBangEventClass.messageCenter(GameBangEventClass.EVENT_RESULT);
            GameBangItemClass.endArray[0] = [GameBangItemClass.youHealth, GameBangItemClass.otherHealth];
        } else {
            this.localResultManager();
        }
    }

    /**
     * fire & smoke effect manager
     */
    private fireSmokeEffectManager = (smokeOwner: number, fire: number = 2) => {
        switch (smokeOwner) {
            case 0:
                let tw = egret.Tween.get(GameBangItemClass.youSmoke);
                tw.to({ alpha: 1, scaleX: 0.6, scaleY: 0.6 }, 300);
                tw.to({ alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 300);
                tw.to({ alpha: 0, scaleX: 1.8, scaleY: 1.8 }, 300);
                tw.call(() => {
                    GameBangItemClass.youSmoke.alpha = 0;
                    GameBangItemClass.youSmoke.scaleY = 0.01;
                    GameBangItemClass.youSmoke.scaleX = 0.01;
                    tw = null;
                });
                break;
            case 1:
                let _tw = egret.Tween.get(GameBangItemClass.otherSmoke);
                _tw.to({ alpha: 1, scaleX: 0.6, scaleY: 0.6 }, 300);
                _tw.to({ alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 300);
                _tw.to({ alpha: 0, scaleX: 1.8, scaleY: 1.8 }, 300);
                _tw.call(() => {
                    GameBangItemClass.otherSmoke.alpha = 0;
                    GameBangItemClass.otherSmoke.scaleY = 0.01;
                    GameBangItemClass.otherSmoke.scaleX = 0.01;
                    _tw = null;
                });
                break;
        }

        switch (fire) {
            case 0: // you boom
                GameBangItemClass.youFruitBoom.alpha = 1;
                App.TimerManager.doTimer(2500, 1, () => {
                    GameBangItemClass.youFruitBoom.alpha = 0;
                }, this);
                break;
            case 1: // other boom
                GameBangItemClass.otherFruitBoom.alpha = 1;
                App.TimerManager.doTimer(2500, 1, () => {
                    GameBangItemClass.otherFruitBoom.alpha = 0;
                    this.expression.alpha = 0;
                }, this);
                break;
            case 2:
                // pass
                break;
            default:
                console.log("illegal fire num!");
                break;
        }
    }

    /**
     * shoot effect manager
     * 
     * mode,0:other be hit,1:other happy
     */
    private shootEffectManager = (mode: number, sweatMode = 2) => {
        let remove = () => {
            if (this.expressionTimer) {
                egret.clearTimeout(this.expressionTimer);
            }
            if (this.expression) {
                this.expression.alpha = 0;
            }
        }
        switch (mode) {
            case 0:
                remove();
                this.expression = AssetManager.getBitmap("BA_otherBeHit_png", false, false);
                this.expression.x = 290;
                this.expression.y = 338;
                break;
            case 1:
                remove();
                this.expression = AssetManager.getBitmap("BA_otherHappy_png", false, false);
                this.expression.x = 287;
                this.expression.y = 338;
                break;
        }

        if (this.expression && this.expression.alpha == 0) {
            this.expression.alpha = 1;
        } else {
            this.addChild(this.expression);
        }

        if (mode == 1) {
            this.shockEffect(this.expression, 150, 1000, 0, 4, false, true, true, false);
        }

        this.expressionTimer = egret.setTimeout(() => {
            this.expression.alpha = 0;
            if (mode == 0) {
                GameBangItemClass.otherFruitBoom.alpha = 0;
            }
        }, this, 2500);

        let resetSweat = (item: string) => {
            if (this.getChildByName(item)) {
                let i = this.getChildByName(item);
                egret.Tween.removeTweens(i);
                i.alpha = 0;
            }
        }

        switch (sweatMode) {
            case 1:
                resetSweat("otherSweat");
                this.otherSweat = AssetManager.getBitmap("BA_otherSweat_png", false, false);
                this.otherSweat.x = 350;
                this.otherSweat.y = 312;
                this.otherSweat.alpha = 0.8;
                this.otherSweat.name = "otherSweat";
                if (this.otherSweat && this.otherSweat.alpha == 0) {
                    this.otherSweat.alpha = 1;
                } else {
                    this.addChild(this.otherSweat);
                }
                let tw = egret.Tween.get(this.otherSweat);
                tw.to({ y: 332 }, 500);
                tw.to({ y: 332 }, 1200);
                tw.call(() => {
                    this.otherSweat.alpha = 0;
                    tw = null;
                });
                break;
            case 0:
                resetSweat("youSweat");
                this.youSweat = AssetManager.getBitmap("BA_youSweat_png", false, false);
                this.youSweat.x = 384;
                this.youSweat.y = 690;
                this.youSweat.alpha = 0.8;
                this.youSweat.name = "youSweat";
                if (this.youSweat && this.youSweat.alpha == 0) {
                    this.youSweat.alpha = 1;
                } else {
                    this.addChild(this.youSweat);
                }
                let _tw = egret.Tween.get(this.youSweat);
                _tw.to({ y: 720 }, 500);
                _tw.to({ y: 720 }, 1200);
                _tw.call(() => {
                    this.youSweat.alpha = 0;
                    _tw = null;
                });
                break;
            case 2:
                break;
        }
    }

    /**
     * health effect manager
     * 
     * who,0:you,1:other
     * 
     * what,-> health num
     */
    private healthEffectManager = (who: number, what: number, how: number) => {
        let itemName: string = "";

        switch (who) {
            case 0:
                itemName += "you";
                break;
            case 1:
                itemName += "other";
                break;
        }

        itemName += "Health_";
        itemName += (what + 1).toString();

        let item: egret.Bitmap = this.getChildByName(itemName) as egret.Bitmap;
        let tw = egret.Tween.get(item);

        switch (how) {
            case 1:
                tw.to({ alpha: 0, scaleX: 2, scaleY: 2 }, 500);
                tw.call(() => {
                    item.texture = AssetManager.getBitmap("BA_healthGray_png", true, true).texture;
                });
                tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 500);
                tw.call(() => {
                    tw = null;
                });
                break;
            case 2:
                item.texture = AssetManager.getBitmap("BA_health_png", true, true).texture;
                break;
        }
    }

    /**
     * first join animation manager
     */
    private firstStartEffectManager = (callback: () => any) => {
        let tw = egret.Tween.get(this.blackMask);
        let _tw = egret.Tween.get(this.gameTips);
        let __tw = egret.Tween.get(GameBangItemClass.bangTip);

        tw.to({ alpha: 0 }, 1000);
        _tw.to({ alpha: 0 }, 1000);
        __tw.to({ y: 1097 }, 1000);
        __tw.call(() => {
            if (callback) {
                callback();
            }
        });
    }

    /**
     * between field effect manager
     */
    private betweenFieldEffectManager = (callback: () => any) => {
        if (this.readyImg && this.readyImg.alpha == 0) {
            this.readyImg.alpha = 1;
            this.readyImg.y = 530;
            this.readyImg.x = -87;
        } else {
            this.readyImg = AssetManager.getBitmap("BA_ready_png", true, true);
            this.readyImg.y = 530;
            this.readyImg.x = -87;
            this.addChild(this.readyImg);
        }

        if (this.reloadingImg && this.reloadingImg.alpha == 0) {
            this.reloadingImg.alpha = 1;
            this.reloadingImg.y = 530;
            this.reloadingImg.x = -87;
        } else {
            this.reloadingImg = AssetManager.getBitmap("BA_reloading_png", true, true);
            this.reloadingImg.y = 530;
            this.reloadingImg.x = -87;
            this.addChild(this.reloadingImg);
        }


        if (this._announcement && this._announcement.alpha == 0) {
            this._announcement.x = -640;
            this._announcement.y = 0;
            this._announcement.alpha = 1;
        } else {
            this._announcement.width = 640;
            this._announcement.height = 1136;
            this._announcement.x = -640;
            this._announcement.y = 0;
            this.addChild(this._announcement);
        }

        if (this.announcement && this.announcement.alpha == 0) {
            this.announcement.x = 0;
            this.announcement.y = 0;
            this.announcement.alpha = 1;
        } else {
            this.announcement = AssetManager.getBitmap("BA_announcement_png", false, false);
            this.announcement.x = 0;
            this.announcement.y = 0;
            this._announcement.addChild(this.announcement);
        }

        if (this.N && this.N.alpha == 0) {
            this.N.alpha = 1;
            this.N.x = 320;
            this.N.y = 568;
        } else {
            this.N = AssetManager.getBitmap("BA_N_png", true, true);
            this.N.x = 320;
            this.N.y = 568;
            this._announcement.addChild(this.N);
        }

        if (this.turnText && this.turnText.alpha == 0) {
            this.turnText.x = 282;
            this.turnText.y = 575;
            this.turnText.alpha = 1;
            this.turnText.text = GameBangItemClass.turnNum.toString();
        } else {
            this.turnText = new egret.BitmapText();
            this.turnText.font = RES.getRes("BA_font_fnt") as egret.BitmapFont;
            this.turnText.x = 282;
            this.turnText.y = 575;
            this.turnText.width = 102;
            this.turnText.height = 82;
            this.turnText.anchorOffsetX = 51;
            this.turnText.anchorOffsetY = 41;
            this.turnText.textAlign = egret.HorizontalAlign.CENTER;
            this.turnText.text = GameBangItemClass.turnNum.toString();
            this._announcement.addChild(this.turnText);
        }

        this.setChildIndex(this.readyImg, this.numChildren);
        this.setChildIndex(this.reloadingImg, this.numChildren);
        this.setChildIndex(this._announcement, this.numChildren);
        this.setChildIndex(GameBangItemClass.uBorder, this.numChildren + 1);
        this.setChildIndex(GameBangItemClass.bBorder, this.numChildren + 1);
        this.setChildIndex(GameBangItemClass.ulBorder, this.numChildren + 1);
        this.setChildIndex(GameBangItemClass.urBorder, this.numChildren + 1);

        let tw_announcement = egret.Tween.get(this._announcement);
        tw_announcement.to({ x: 0 }, 300);
        tw_announcement.to({ x: 0 }, 900);
        tw_announcement.to({ x: -640 }, 300);
        tw_announcement.call(() => {
            let tw = egret.Tween.get(this.readyImg);
            tw.to({ x: 220 }, 200);
            tw.call(() => {
                GameBangItemClass.youSoundEffect.play("BA_ready_mp3", true);
            });
            tw.to({ x: 420 }, 800);
            tw.to({ x: 727 }, 200);
            tw.call(() => {
                let _tw = egret.Tween.get(this.reloadingImg);
                _tw.to({ x: 220 }, 200);
                _tw.call(() => {
                    GameBangItemClass.youSoundEffect.play("BA_reload_mp3", true);
                });
                _tw.to({ x: 420 }, 800);
                _tw.call(() => {
                    let tw_youRole = egret.Tween.get(GameBangItemClass.youRole);
                    tw_youRole.to({ scaleX: 1, scaleY: 1 }, 100);
                    tw_youRole.to({ scaleX: 1, scaleY: 1 }, 100);
                    tw_youRole.call(() => {
                        tw_youRole = null;
                    });

                    let tw_otherRole = egret.Tween.get(GameBangItemClass.otherRole);
                    tw_otherRole.to({ scaleX: 1, scaleY: 1 }, 100);
                    tw_otherRole.to({ scaleX: 1, scaleY: 1 }, 100);
                    tw_otherRole.call(() => {
                        tw_otherRole = null;
                    });
                });
                _tw.to({ x: 727 }, 200);
                _tw.call(() => {
                    if (callback) {
                        callback();
                    }
                    _tw = null;
                    this.reloadingImg.alpha = 0;
                    this._announcement.alpha = 0;
                    this.setChildIndex(this._announcement, 1);
                });
                this.readyImg.alpha = 0;
                tw = null;
            });
        });
    }

    /**
     * deal of result
     */
    private resultDeal = (data: any) => {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", null);
    }

    /**
     * scene init
     */
    private gameStart = () => {
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.messageManager, this);
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.resultDeal, this);

        GameBangItemClass.backGround = AssetManager.getBitmap("BA_backGround_jpg", false, false);
        GameBangItemClass.backGround.x = 0;
        GameBangItemClass.backGround.y = 0;
        GameBangItemClass.backGround.width = 640;
        GameBangItemClass.backGround.height = 1136;
        this.addChildAt(GameBangItemClass.backGround, 1);

        GameBangItemClass.headIcoLeft = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 84, 84);
        GameBangItemClass.headIcoLeft.x = 188;
        GameBangItemClass.headIcoLeft.y = 19;
        this.addChild(GameBangItemClass.headIcoLeft);

        GameBangItemClass.headIcoRight = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 84, 84);
        GameBangItemClass.headIcoRight.x = 366;
        GameBangItemClass.headIcoRight.y = 19;
        this.addChild(GameBangItemClass.headIcoRight);

        GameBangItemClass.pkBorder = AssetManager.getBitmap("BA_headIcoBorder_png", true, false);
        GameBangItemClass.pkBorder.x = 320;
        GameBangItemClass.pkBorder.y = 18;
        this.addChild(GameBangItemClass.pkBorder);

        GameBangItemClass.otherSmoke = AssetManager.getBitmap("BA_otherSmoke_png", true, true);
        GameBangItemClass.otherSmoke.x = 320;
        GameBangItemClass.otherSmoke.y = 373.5;
        GameBangItemClass.otherSmoke.scaleX = 0.01;
        GameBangItemClass.otherSmoke.scaleY = 0.01;
        GameBangItemClass.otherSmoke.alpha = 0;
        this.addChild(GameBangItemClass.otherSmoke);

        GameBangItemClass.otherFruit = AssetManager.getBitmap("BA_fruit_blueberry_png", false, false);
        GameBangItemClass.otherFruit.x = 291;
        GameBangItemClass.otherFruit.y = 222;
        GameBangItemClass.otherFruit.scaleX = 0.5;
        GameBangItemClass.otherFruit.scaleY = 0.5;
        GameBangItemClass.otherFruit.alpha = 0;
        this.addChild(GameBangItemClass.otherFruit)

        GameBangItemClass.otherRole = AssetManager.getBitmap("BA_otherRole_png", true, false);
        GameBangItemClass.otherRole.x = 320;
        GameBangItemClass.otherRole.y = 266;
        this.addChild(GameBangItemClass.otherRole);

        GameBangItemClass.fireLightL = AssetManager.getBitmap("BA_fireLight_png", false, false);
        GameBangItemClass.fireLightL.x = 243;
        GameBangItemClass.fireLightL.y = 375;
        GameBangItemClass.fireLightL.alpha = 0;
        this.addChild(GameBangItemClass.fireLightL);

        GameBangItemClass.fireLightR = AssetManager.getBitmap("BA_fireLight_png", false, false);
        GameBangItemClass.fireLightR.x = 348;
        GameBangItemClass.fireLightR.y = 375;
        GameBangItemClass.fireLightR.alpha = 0;
        this.addChild(GameBangItemClass.fireLightR);

        GameBangItemClass.youSmoke = AssetManager.getBitmap("BA_youSmoke_png", true, true);
        GameBangItemClass.youSmoke.x = 320;
        GameBangItemClass.youSmoke.y = 703;
        GameBangItemClass.youSmoke.scaleX = 0.01;
        GameBangItemClass.youSmoke.scaleY = 0.01;
        GameBangItemClass.youSmoke.alpha = 0;
        this.addChild(GameBangItemClass.youSmoke);

        GameBangItemClass.youRole = AssetManager.getBitmap("BA_youRole_png", true, false);
        GameBangItemClass.youRole.x = 320;
        GameBangItemClass.youRole.y = 632;
        this.addChild(GameBangItemClass.youRole);

        GameBangItemClass.btnBackGround = AssetManager.getBitmap("BA_btnBackGround_png", false, false);
        GameBangItemClass.btnBackGround.x = 0;
        GameBangItemClass.btnBackGround.y = 0;
        this.addChild(GameBangItemClass.btnBackGround);

        GameBangItemClass.otherHealthBoard = AssetManager.getBitmap("BA_healthBoard_png", true, false);
        GameBangItemClass.otherHealthBoard.x = 320;
        GameBangItemClass.otherHealthBoard.y = 147;
        this.addChild(GameBangItemClass.otherHealthBoard);

        GameBangItemClass.youHealthBoard = AssetManager.getBitmap("BA_healthBoard_png", true, false);
        GameBangItemClass.youHealthBoard.x = 320;
        GameBangItemClass.youHealthBoard.y = 852;
        this.addChild(GameBangItemClass.youHealthBoard);

        GameBangItemClass.btnBang = AssetManager.getBitmap("BA_btnBang_png", true, false);
        GameBangItemClass.btnBang.x = 320;
        GameBangItemClass.btnBang.y = 950;
        GameBangItemClass.btnBang.name = "btnBang";
        GameBangItemClass.btnBang.touchEnabled = false;
        GameBangItemClass.btnBang.alpha = 0;
        switch (GameBangItemClass.isOffline) {
            case false:
                GameBangItemClass.btnBang.addEventListener("touchTap", this.preShoot, this);
                break;
            case true:
                GameBangItemClass.btnBang.addEventListener("touchTap", this.shoot, this);
                break;
            default:
                break;
        }
        this.addChild(GameBangItemClass.btnBang);

        this.youHealth_1 = AssetManager.getBitmap("BA_health_png", true, true);
        this.youHealth_1.x = 219.5;
        this.youHealth_1.y = 874.5;
        this.youHealth_1.name = "youHealth_1";
        this.youHealth_1.alpha = 0;
        this.addChild(this.youHealth_1);

        this.youHealth_2 = AssetManager.getBitmap("BA_health_png", true, true);
        this.youHealth_2.x = 269.5;
        this.youHealth_2.y = 874.5;
        this.youHealth_2.name = "youHealth_2";
        this.youHealth_2.alpha = 0;
        this.addChild(this.youHealth_2);

        this.youHealth_3 = AssetManager.getBitmap("BA_health_png", true, true);
        this.youHealth_3.x = 320.5;
        this.youHealth_3.y = 874.5;
        this.youHealth_3.name = "youHealth_3";
        this.youHealth_3.alpha = 0;
        this.addChild(this.youHealth_3);

        this.youHealth_4 = AssetManager.getBitmap("BA_health_png", true, true);
        this.youHealth_4.x = 370.5;
        this.youHealth_4.y = 874.5;
        this.youHealth_4.name = "youHealth_4";
        this.youHealth_4.alpha = 0;
        this.addChild(this.youHealth_4);

        this.youHealth_5 = AssetManager.getBitmap("BA_health_png", true, true);
        this.youHealth_5.x = 421.5;
        this.youHealth_5.y = 874.5;
        this.youHealth_5.name = "youHealth_5";
        this.youHealth_5.alpha = 0;
        this.addChild(this.youHealth_5);

        this.otherHealth_1 = AssetManager.getBitmap("BA_health_png", true, true);
        this.otherHealth_1.x = 219.5;
        this.otherHealth_1.y = 169.5;
        this.otherHealth_1.name = "otherHealth_1";
        this.otherHealth_1.alpha = 0;
        this.addChild(this.otherHealth_1);

        this.otherHealth_2 = AssetManager.getBitmap("BA_health_png", true, true);
        this.otherHealth_2.x = 269.5;
        this.otherHealth_2.y = 169.5;
        this.otherHealth_2.name = "otherHealth_2";
        this.otherHealth_2.alpha = 0;
        this.addChild(this.otherHealth_2);

        this.otherHealth_3 = AssetManager.getBitmap("BA_health_png", true, true);
        this.otherHealth_3.x = 320.5;
        this.otherHealth_3.y = 169.5;
        this.otherHealth_3.name = "otherHealth_3";
        this.otherHealth_3.alpha = 0;
        this.addChild(this.otherHealth_3);

        this.otherHealth_4 = AssetManager.getBitmap("BA_health_png", true, true);
        this.otherHealth_4.x = 370.5;
        this.otherHealth_4.y = 169.5;
        this.otherHealth_4.name = "otherHealth_4";
        this.otherHealth_4.alpha = 0;
        this.addChild(this.otherHealth_4);

        this.otherHealth_5 = AssetManager.getBitmap("BA_health_png", true, true);
        this.otherHealth_5.x = 421.5;
        this.otherHealth_5.y = 169.5;
        this.otherHealth_5.name = "otherHealth_5";
        this.otherHealth_5.alpha = 0;
        this.addChild(this.otherHealth_5);

        GameBangItemClass.tipsText_ul = AssetManager.getBitmap("BA_L_DANG_png", false, false);
        GameBangItemClass.tipsText_ul.x = GameBangItemClass.tipsPosArray[0][0][0];
        GameBangItemClass.tipsText_ul.y = GameBangItemClass.tipsPosArray[0][0][1];
        this.addChild(GameBangItemClass.tipsText_ul);

        GameBangItemClass.tipsRole_ul = AssetManager.getBitmap("BA_L_Role_png", false, false);
        GameBangItemClass.tipsRole_ul.x = GameBangItemClass.tipsRolePosArray[0][0][0];
        GameBangItemClass.tipsRole_ul.y = GameBangItemClass.tipsRolePosArray[0][0][1];
        this.addChild(GameBangItemClass.tipsRole_ul);

        GameBangItemClass.tipsText_bl = AssetManager.getBitmap("BA_L_DANG_png", false, false);
        GameBangItemClass.tipsText_bl.x = GameBangItemClass.tipsPosArray[1][0][0];
        GameBangItemClass.tipsText_bl.y = GameBangItemClass.tipsPosArray[1][0][1];
        this.addChild(GameBangItemClass.tipsText_bl);

        GameBangItemClass.tipsRole_bl = AssetManager.getBitmap("BA_L_Role_png", false, false);
        GameBangItemClass.tipsRole_bl.x = GameBangItemClass.tipsRolePosArray[1][0][0];
        GameBangItemClass.tipsRole_bl.y = GameBangItemClass.tipsRolePosArray[1][0][1];
        this.addChild(GameBangItemClass.tipsRole_bl);

        GameBangItemClass.tipsText_ur = AssetManager.getBitmap("BA_R_DANG_png", false, false);
        GameBangItemClass.tipsText_ur.x = GameBangItemClass.tipsPosArray[2][0][0];
        GameBangItemClass.tipsText_ur.y = GameBangItemClass.tipsPosArray[2][0][1];
        this.addChild(GameBangItemClass.tipsText_ur);

        GameBangItemClass.tipsRole_ur = AssetManager.getBitmap("BA_R_Role_png", false, false);
        GameBangItemClass.tipsRole_ur.x = GameBangItemClass.tipsRolePosArray[2][0][0];
        GameBangItemClass.tipsRole_ur.y = GameBangItemClass.tipsRolePosArray[2][0][1];
        this.addChild(GameBangItemClass.tipsRole_ur);

        GameBangItemClass.tipsText_br = AssetManager.getBitmap("BA_R_DANG_png", false, false);
        GameBangItemClass.tipsText_br.x = GameBangItemClass.tipsPosArray[3][0][0];
        GameBangItemClass.tipsText_br.y = GameBangItemClass.tipsPosArray[3][0][1];
        this.addChild(GameBangItemClass.tipsText_br);

        GameBangItemClass.tipsRole_br = AssetManager.getBitmap("BA_R_Role_png", false, false);
        GameBangItemClass.tipsRole_br.x = GameBangItemClass.tipsRolePosArray[3][0][0];
        GameBangItemClass.tipsRole_br.y = GameBangItemClass.tipsRolePosArray[3][0][1];
        this.addChild(GameBangItemClass.tipsRole_br);

        GameBangItemClass.youFruit = AssetManager.getBitmap("BA_fruit_blueberry_png", false, false);
        GameBangItemClass.youFruit.x = 256;
        GameBangItemClass.youFruit.y = 560;
        GameBangItemClass.youFruit.alpha = 0;
        this.addChild(GameBangItemClass.youFruit)

        GameBangItemClass.youFruitBoom = AssetManager.getBitmap("BA_boom_blueberry_png");
        GameBangItemClass.youFruitBoom.x = 320;
        GameBangItemClass.youFruitBoom.y = 794;
        GameBangItemClass.youFruitBoom.alpha = 0;
        this.addChild(GameBangItemClass.youFruitBoom)

        GameBangItemClass.otherFruitBoom = AssetManager.getBitmap("BA_boom_blueberry_png");
        GameBangItemClass.otherFruitBoom.x = 320;
        GameBangItemClass.otherFruitBoom.y = 390;
        GameBangItemClass.otherFruitBoom.scaleX = 0.5;
        GameBangItemClass.otherFruitBoom.scaleY = 0.5;
        GameBangItemClass.otherFruitBoom.alpha = 0;
        this.addChild(GameBangItemClass.otherFruitBoom)

        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba) {
            let returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            returnToLastButton.y = 19;
            returnToLastButton.name = "backBtn";
            this.addChild(returnToLastButton);
            returnToLastButton.touchEnabled = true;
            returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.popup("GameSureLeave");
            }, this);
        }

        this.blackMask = AssetManager.getBitmap("BA_blackMask_png", false, false);
        this.blackMask.x = 0;
        this.blackMask.y = 0;
        this.blackMask.alpha = 0.8;
        this.blackMask.name = "blackMask";
        this.addChild(this.blackMask);

        this.gameTips = AssetManager.getBitmap("BA_gameTips_png", true, false);
        this.gameTips.x = 320;
        this.gameTips.y = 80;
        this.gameTips.name = "gameTips";
        this.addChild(this.gameTips);

        GameBangItemClass.bangTip = AssetManager.getBitmap("BA_bangTip_jpg", true, false);
        GameBangItemClass.bangTip.x = 320;
        GameBangItemClass.bangTip.y = 1010;
        this.addChild(GameBangItemClass.bangTip);

        GameBangItemClass.uBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
        GameBangItemClass.uBorder.x = 0;
        GameBangItemClass.uBorder.y = -1136;
        this.addChild(GameBangItemClass.uBorder);
        GameBangItemClass.bBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
        GameBangItemClass.bBorder.x = 0;
        GameBangItemClass.bBorder.y = 1136;
        this.addChild(GameBangItemClass.bBorder);
        GameBangItemClass.ulBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
        GameBangItemClass.ulBorder.x = -640;
        GameBangItemClass.ulBorder.y = 0;
        this.addChild(GameBangItemClass.ulBorder);
        GameBangItemClass.urBorder = AssetManager.getBitmap("BA_blackMask_png", false, false);
        GameBangItemClass.urBorder.x = 640;
        GameBangItemClass.urBorder.y = 0;
        this.addChild(GameBangItemClass.urBorder);

        GameBangItemClass.img5s = AssetManager.getBitmap("BA_5s_png");
        GameBangItemClass.img5s.x = 320;
        GameBangItemClass.img5s.y = 550;
        GameBangItemClass.img5s.alpha = 0;
        this.addChild(GameBangItemClass.img5s);

        GameBangItemClass.youSoundEffect = new SoundEffects();
        GameBangItemClass.youSoundEffect.setVolume(1);

        GameBangItemClass.otherSoundEffect = new SoundEffects();
        GameBangItemClass.otherSoundEffect.setVolume(1);

        GameBangItemClass.thirdSoundEffect = new SoundEffects();
        GameBangItemClass.thirdSoundEffect.setVolume(1);

        GameBangItemClass.backGroundSoundEffect = new SoundBg();
        GameBangItemClass.backGroundSoundEffect.setVolume(1);

        if (this.stage.stageHeight < 1136) {
            GameBangItemClass.multiple = (this.stage.stageHeight / 1136);
            this.scaleX = GameBangItemClass.multiple;
            this.scaleY = GameBangItemClass.multiple;
            let nowWidth = 640 * GameBangItemClass.multiple;
            this.x = (640 - nowWidth) / 2;
        } else if (this.stage.stageHeight > 1136) {
            this.y = (this.stage.stageHeight - 1136) / 2;
        }

        egret.startTick(this.readyTick, this);

        switch (GameBangItemClass.isOffline) {
            case true:
                break;
            case false:
                App.TimerManager.doTimer(500, 1, () => {
                    GameBangEventClass.messageCenter(GameBangEventClass.EVENT_READY);
                }, this);
                break;
        }
    }
}