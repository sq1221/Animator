class GameMasterMindMainScene extends State {

    public constructor() {
        super();
    }

    private loadingType: number = 0;
    public static runningSec = 0;

    init() {
        super.init();

        this.loadingType = 0;
        GameMasterMindMainScene.runningSec = 0
        GameMasterMindItemClass.dispose();

        App.SoundManager.stopBg();
        App.SoundManager.playBg("BG_mp3");

        if (DataCenter.instance.room.IsAI) {
            GameMasterMindItemClass.isOffline = true;
        }

        this.gameInit();

    }

    dispose() {
        super.dispose();
        //通知表情页关闭
        App.MessageCenter.dispatch(EventMessage.gameCloseExpress);

        egret.Tween.removeAllTweens();

        egret.stopTick(this.readyTick, this);
        egret.stopTick(this.mainTick, this);
        egret.stopTick(this.answerTick, this);
        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);

        GameMasterMindItemClass.youRole.armature.removeEventListener("touchTap", this.showPersonalInformation, this);
        GameMasterMindItemClass.otherRole.armature.removeEventListener("touchTap", this.showOtherPersonalInformation, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.messageDuel, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.resultDuel, this);
        GameMasterMindItemClass.btn1.removeEventListener("touchTap", GameMasterMindLogic.btn1Press, this);
        GameMasterMindItemClass.btn2.removeEventListener("touchTap", GameMasterMindLogic.btn2Press, this);
        GameMasterMindItemClass.btn3.removeEventListener("touchTap", GameMasterMindLogic.btn3Press, this);
        GameMasterMindItemClass.btn4.removeEventListener("touchTap", GameMasterMindLogic.btn4Press, this);
        GameMasterMindItemClass.greetNormalBtn.removeEventListener("touchTap", this.showGreeting, this);
        GameMasterMindItemClass.reportIcon.removeEventListener("touchTap", this.report, this)
        GameMasterMindItemClass.answerMask.removeEventListener("touchTap", this.showHasChoose, this);

        GameMasterMindItemClass.dispose();
        App.TimerManager.removeAll(GameMasterMindLogic);
        App.TimerManager.removeAll(this);
    }

    addQiPaoCartoon(data, type: number = 1) {
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(120, 130);
        this.addChild(qiPao);
        if (type == 2) {
            if (data.indexOf("express4") == -1) {
                qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 90, App.GameWidth - 70);
            }
            else {
                qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 165, App.GameWidth - 145);
            }

            qiPao.setSouce(data, true, 1);
        }
        else {
            qiPao.setSouce(data, false, 1);
            if (data.indexOf("express4") == -1) {
                qiPao.x = App.RandomUtils.limitInteger(70, 90);
            }
            else {
                qiPao.x = App.RandomUtils.limitInteger(145, 165);
            }

            if (!DataCenter.instance.room.IsAI) {
                var str = "sendExpress|" + data
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            else {
                var num: number = App.RandomUtils.limitInteger(1, 5);
                if (num % 2 != 0) {
                    App.TimerManager.doTimer(1000 * num, 1, this.AddAIexpress, this);
                }
            }
        }
        if (data.indexOf("express4") == -1) {
            qiPao.onPlay();
        }
        else {
            if (type == 1) {
                qiPao.img_1.scaleX = -1;
                qiPao.onPlay(1);
            }
            else {
                // qiPao.img_2.scaleX = -1;
                qiPao.onPlay(2);
            }
        }
    }

    //添加Ai的表情
    AddAIexpress() {
        var ArrPress = [
            "4_1", "4_2", "4_3", "4_4", "4_5", "4_6", "4_7", "4_8", "4_9", "4_10",
            "5_1", "5_2", "5_3", "5_4",
            "6_1", "6_6", "6_3", "6_4"];

        var num: number = App.RandomUtils.limitInteger(0, 17);

        var str: string = "express" + ArrPress[num] + "_png";

        this.addQiPaoCartoon(str, 2);

    }

    private showHasChoose() {
        let Shape = AssetManager.getBitmap("MM_hasAnswer_png", false, false);
        Shape.x = 198;
        Shape.y = 512;
        Shape.alpha = 0;
        this.addChild(Shape);

        let tw = egret.Tween.get(Shape);
        tw.to({ alpha: 1 }, 200);
        tw.to({ alpha: 1 }, 300);
        tw.to({ alpha: 0 }, 200);
        tw.call(() => {
            App.DisplayUtils.removeFromParent(Shape);
        });
    }

    private showHasReport = () => {
        let imgReport = AssetManager.getBitmap("MM_hasReport_png", true, false);
        imgReport.x = 320;
        imgReport.y = 512;
        imgReport.alpha = 0;
        this.addChild(imgReport);

        let tw = egret.Tween.get(imgReport);
        tw.to({ alpha: 1 }, 200);
        tw.to({ alpha: 1 }, 300);
        tw.to({ alpha: 0 }, 200);
        tw.call(() => {
            App.DisplayUtils.removeFromParent(imgReport);
        });
    }

    /**
     * ready tick
     */
    private readyTick = () => {
        if (GameMasterMindItemClass.isOffline == false) {

            console.log("ready state: " + GameMasterMindItemClass.readyState[0], GameMasterMindItemClass.readyState[1]);

            if (GameMasterMindItemClass.readyState[0] == 1 && GameMasterMindItemClass.readyState[1] == 1) {
                GameMasterMindItemClass.readyState[0] = 0;
                GameMasterMindItemClass.readyState[1] = 0;
                egret.stopTick(this.readyTick, this);
                App.TimerManager.doTimer(1000, 1, () => {
                    // App.DisplayUtils.removeFromParent(GameMasterMindItemClass.loadingTips);
                    GameMasterMindItemClass.loadingTips.alpha = 0;
                    this.switchToReady(() => {
                        App.TimerManager.doTimer(3000, 1, () => {
                            this.switchToAnswer(() => {
                                egret.startTick(this.mainTick, this);
                                egret.startTick(this.answerTick, this);
                                egret.startTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
                                egret.startTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                            });
                        }, this);
                    });
                }, this);

                return false;
            }

            if (GameMasterMindItemClass.Question.length > 0) {
                GameMasterMindItemClass.readyState[0] = 1;

                return false;
            }
        } else if (GameMasterMindItemClass.isOffline == true) {

            egret.stopTick(this.readyTick, this);

            App.TimerManager.doTimer(2500, 1, () => {
                // App.DisplayUtils.removeFromParent(GameMasterMindItemClass.loadingTips);
                GameMasterMindItemClass.loadingTips.alpha = 0;
                this.switchToReady(() => {
                    App.TimerManager.doTimer(3000, 1, () => {
                        this.switchToAnswer(() => {
                            egret.startTick(this.mainTick, this);
                            egret.startTick(this.answerTick, this);
                            egret.startTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
                            egret.startTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                        });
                    }, this);
                });
            }, this);
        }

        return false;
    }

    /**
     * game message duel
     */
    private messageDuel = (data: any) => {
        if (data.userId == DataCenter.instance.user.id) {
            return;
        }

        let cmdString: Array<string>;
        cmdString = data.event.split("|");

        switch (cmdString[0]) {
            case GameMasterMindEvent.EVENT_GAMEREADY:
                GameMasterMindItemClass.readyState[1] = 1;
                break;
            case GameMasterMindEvent.EVENT_ANSWER:
                egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                GameMasterMindItemClass.otherChooseIndex = parseInt(cmdString[1]);
                if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
                    GameMasterMindItemClass.otherScore += GameMasterMindLogic.scoreManager(parseInt(cmdString[2]));
                }
                egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
                GameMasterMindItemClass.readyState[1] = 1;
                GameMasterMindMainScene.showRightTimeUsed(false);
                break;
            case "sendExpress":
                this.addQiPaoCartoon(cmdString[1], 2);
                break;
        }
    }

    /**
     * game result manager
     */
    private resultDuel = (data: any) => {

        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", null);
    }

    /**
     * loading effect
     */
    private loadingEffect = () => {
        let tw = egret.Tween.get(GameMasterMindItemClass.loadingTips);
        GameMasterMindItemClass.loadingTips.alpha = 0;
        GameMasterMindItemClass.loadingTips.text = "正在等待玩家";
        tw.to({ alpha: 1 }, 300);
    }

    /**
     * change game state to answer
     */
    private switchToAnswer = (callback?: () => any) => {

        GameMasterMindItemClass.soundEffect.play("MM_nextEffect_mp3", true);

        GameMasterMindItemClass.loadingTips.alpha = 0;
        GameMasterMindLogic.refresh();

        if (GameMasterMindItemClass.isOffline == true) {
            GameMasterMindLogic.AI();
        }

        let b3 = 0;
        let b4 = 0;

        switch ((GameMasterMindItemClass.Question[GameMasterMindItemClass.QuestionOrder]["answers"] as Array<any>).length) {
            case 3:
                b3 = 1;
                break;
            case 4:
                b3 = 1;
                b4 = 1;
                break;
        }

        this.tweemManager(GameMasterMindItemClass.questionBoard, [320, 397], 300, 1, true, () => {
            GameMasterMindItemClass.reportIcon.alpha = 1;
            GameMasterMindItemClass.reportIcon.touchEnabled = true;
        });
        this.tweemManager(GameMasterMindItemClass.btn1, [320, 619.5], 300, 1, true);
        this.tweemManager(GameMasterMindItemClass.btn2, [320, 730.5], 300, 1, true);
        this.tweemManager(GameMasterMindItemClass.btn3, [320, 842.5], 300, b3, true);
        this.tweemManager(GameMasterMindItemClass.btn4, [320, 954.5], 300, b4, true, callback);

        this.tweemManager(GameMasterMindItemClass.questionText, [320, 397], 300, 1);
        this.tweemManager(GameMasterMindItemClass.spareType, [320, 631], 300, 0);
        this.tweemManager(GameMasterMindItemClass.littlePurple, [320, 610], 300, 0);
        this.tweemManager(GameMasterMindItemClass.btn1Text, [320, 619.5], 300, 1);
        this.tweemManager(GameMasterMindItemClass.btn2Text, [320, 730.5], 300, 1);
        this.tweemManager(GameMasterMindItemClass.btn3Text, [320, 842.5], 300, b3);
        this.tweemManager(GameMasterMindItemClass.btn4Text, [320, 954.5], 300, b4);
    }

    /**
     * change game state to ready
     */
    private switchToReady = (callback?: () => any) => {
        GameMasterMindItemClass.littleLeftMark.alpha = 0;
        GameMasterMindItemClass.littleRightMark.alpha = 0;

        GameMasterMindItemClass.reportIcon.alpha = 0;
        GameMasterMindItemClass.reportIcon.touchEnabled = false;

        if (GameMasterMindItemClass.QuestionOrder < 10) {
            GameMasterMindLogic.tableSwitcher();
        } else {
            GameMasterMindItemClass.questionText.text = "";
        }

        GameMasterMindItemClass.turnsText.alpha = 1;
        GameMasterMindItemClass.turnsText.text = (GameMasterMindItemClass.QuestionOrder + 1).toString() + "/10";

        GameMasterMindItemClass.youTime = 0;
        GameMasterMindItemClass.otherTime = 0;

        GameMasterMindItemClass.youMark.alpha = 0;
        GameMasterMindItemClass.otherMark.alpha = 0;
        GameMasterMindItemClass.chooseIndex = -1;
        GameMasterMindItemClass.otherChooseIndex = -1;
        GameMasterMindItemClass.readyState = [0, 0];

        GameMasterMindItemClass.btn1Text.textColor = 0x4c407b;
        GameMasterMindItemClass.btn2Text.textColor = 0x4c407b;
        GameMasterMindItemClass.btn3Text.textColor = 0x4c407b;
        GameMasterMindItemClass.btn4Text.textColor = 0x4c407b;

        GameMasterMindItemClass.youScoreText.text = GameMasterMindItemClass.youScore.toString();
        GameMasterMindItemClass.youScoreText.scaleX = 3;
        GameMasterMindItemClass.youScoreText.scaleY = 3;
        let tw = egret.Tween.get(GameMasterMindItemClass.youScoreText);
        tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1500, egret.Ease.elasticInOut);
        tw.call(() => {
            tw = null;
        });

        GameMasterMindItemClass.otherScoreText.scaleX = 3;
        GameMasterMindItemClass.otherScoreText.scaleY = 3;
        GameMasterMindItemClass.otherScoreText.text = GameMasterMindItemClass.otherScore.toString();
        let _tw = egret.Tween.get(GameMasterMindItemClass.otherScoreText);
        _tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1500, egret.Ease.elasticInOut);
        _tw.call(() => {
            _tw = null;
        });

        if (GameMasterMindItemClass.QuestionOrder <= 8 && GameMasterMindItemClass.QuestionOrder > 0) {
            GameMasterMindItemClass.questionText.text = "第" + GameMasterMindLogic.numToFont() + "题";
        } else if (GameMasterMindItemClass.QuestionOrder == 9) {
            GameMasterMindItemClass.questionText.text = "最后一题";
        } else if (GameMasterMindItemClass.QuestionOrder == 0) {
            GameMasterMindItemClass.questionText.text = "开始答题";
        }

        GameMasterMindItemClass.btn1.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;
        GameMasterMindItemClass.btn2.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;
        GameMasterMindItemClass.btn3.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;
        GameMasterMindItemClass.btn4.texture = AssetManager.getBitmap("MM_BtnWhite_png", true, true).texture;

        GameMasterMindItemClass.questionBoard.touchEnabled = false;
        GameMasterMindItemClass.btn1.touchEnabled = false;
        GameMasterMindItemClass.btn2.touchEnabled = false;
        GameMasterMindItemClass.btn3.touchEnabled = false;
        GameMasterMindItemClass.btn4.touchEnabled = false;

        this.tweemManager(GameMasterMindItemClass.questionBoard, [320, 580], 300);
        this.tweemManager(GameMasterMindItemClass.btn1, [320, 580], 300);
        this.tweemManager(GameMasterMindItemClass.btn2, [320, 580], 300);
        this.tweemManager(GameMasterMindItemClass.btn3, [320, 580], 300);
        this.tweemManager(GameMasterMindItemClass.btn4, [320, 580], 300);

        this.tweemManager(GameMasterMindItemClass.questionText, [320, 580], 300, 1);
        if (GameMasterMindItemClass.QuestionOrder <= 9) {
            this.tweemManager(GameMasterMindItemClass.spareType, [320, 631], 300, 1);
            this.tweemManager(GameMasterMindItemClass.littlePurple, [320, 610], 300, 1);
        }
        this.tweemManager(GameMasterMindItemClass.btn1Text, [320, 580], 300, 0);
        this.tweemManager(GameMasterMindItemClass.btn2Text, [320, 580], 300, 0);
        this.tweemManager(GameMasterMindItemClass.btn3Text, [320, 580], 300, 0);
        this.tweemManager(GameMasterMindItemClass.btn4Text, [320, 580], 300, 0, false, () => {
            if (GameMasterMindItemClass.QuestionOrder == 9) {
                let doubleText = AssetManager.getBitmap("MM_double_png", false, false);
                doubleText.x = 378;
                doubleText.y = 518;
                doubleText.anchorOffsetX = 64;
                doubleText.anchorOffsetY = 10;
                doubleText.alpha = 0;
                this.addChild(doubleText);
                let tw = egret.Tween.get(doubleText);
                tw.to({ alpha: 1 }, 200);
                tw.to({ alpha: 1 }, 1000);
                tw.to({ alpha: 0 }, 200);
                tw.call(() => {
                    App.DisplayUtils.removeFromParent(doubleText);
                });
            }
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Tween manager
     */
    private tweemManager = (item: egret.DisplayObject, postion: Array<number>, time: number, alpha: number = 1, touchEnabled = false, callback?: () => any) => {
        let tw = egret.Tween.get(item);
        tw.to({ x: postion[0], y: postion[1], alpha: alpha }, time, egret.Ease.elasticInOut);
        tw.call(() => {
            item.touchEnabled = touchEnabled;
            if (callback) {
                callback();
            }
        });
    }

    private animationManager = (type: string) => {
        switch (type) {
            case "start":
                GameMasterMindItemClass.fireLineLeftMask.scaleY = 1;
                GameMasterMindItemClass.fireLineMask.scaleY = 1;

                egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
                egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);

                let tw = egret.Tween.get(GameMasterMindItemClass.fireLineLeft);
                tw.to({ scaleY: 0 }, 15000);

                let _tw = egret.Tween.get(GameMasterMindItemClass.fireLine);
                _tw.to({ scaleY: 0 }, 15000);

                GameMasterMindItemClass.countdownText.text = "16";
                GameMasterMindItemClass.countdownText.alpha = 1;
                break;
            case "end":
                this.judge();
                App.TimerManager.doTimer(3000, 1, () => {
                    if (GameMasterMindItemClass.QuestionOrder <= 9) {
                        this.switchToReady(() => {
                            App.TimerManager.doTimer(1500, 1, () => {

                                GameMasterMindMainScene.showLeftTimeUsed(true);
                                GameMasterMindMainScene.showRightTimeUsed(true);

                                if (GameMasterMindItemClass.youComboState == true) {

                                    let _youComboTW = egret.Tween.get(GameMasterMindItemClass.leftCombo);
                                    _youComboTW.to({ x: -157 }, 300);
                                    _youComboTW.call(() => {
                                        _youComboTW = null;
                                    });

                                    let youComboTextTW = egret.Tween.get(GameMasterMindItemClass.youComboText);
                                    youComboTextTW.to({ x: -42, alpha: 0 }, 300);
                                    youComboTextTW.call(() => {
                                        GameMasterMindItemClass.youComboState = false;
                                        youComboTextTW = null;
                                    });
                                }

                                if (GameMasterMindItemClass.otherComboState == true) {

                                    let _otherComboTW = egret.Tween.get(GameMasterMindItemClass.rightCombo);
                                    _otherComboTW.to({ x: 640 }, 300);
                                    _otherComboTW.call(() => {
                                        _otherComboTW = null;
                                    });

                                    let otherComboTextTW = egret.Tween.get(GameMasterMindItemClass.otherComboText);
                                    otherComboTextTW.to({ x: 772, alpha: 0 }, 300);
                                    otherComboTextTW.call(() => {
                                        GameMasterMindItemClass.otherComboState = false;
                                        otherComboTextTW = null;
                                    });
                                }

                                this.switchToAnswer(() => {
                                    GameMasterMindItemClass.answerMask.touchEnabled = false;
                                    GameMasterMindMainScene.runningSec = 0;
                                    egret.startTick(this.mainTick, this);
                                    egret.startTick(this.answerTick, this);
                                    egret.startTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
                                    egret.startTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);
                                });
                            }, this);
                        });
                    } else {
                        console.log("it's game over!");

                        this.switchToReady(() => {

                            GameMasterMindMainScene.showLeftTimeUsed(true);
                            GameMasterMindMainScene.showRightTimeUsed(true);

                            let resultArray = ["resultText", "dot", "leftScoreResult", "rightScoreResult"];
                            if (GameMasterMindItemClass.youScore >= GameMasterMindItemClass.otherScore) {
                                console.log("你赢了!");
                                (this.getChildByName("resultText") as egret.Bitmap).texture = AssetManager.getBitmap("MM_win_png", true, true).texture;
                                (this.getChildByName("leftScoreResult") as egret.Bitmap).texture = AssetManager.getBitmap("MM_winBG_png", true, true).texture;
                                (this.getChildByName("rightScoreResult") as egret.Bitmap).texture = AssetManager.getBitmap("MM_loseBG_png", true, true).texture;
                            } else {
                                console.log("你输了!");
                                (this.getChildByName("resultText") as egret.Bitmap).texture = AssetManager.getBitmap("MM_lose_png", true, true).texture;
                                (this.getChildByName("leftScoreResult") as egret.Bitmap).texture = AssetManager.getBitmap("MM_loseBG_png", true, true).texture;
                                (this.getChildByName("rightScoreResult") as egret.Bitmap).texture = AssetManager.getBitmap("MM_winBG_png", true, true).texture;
                            }

                            resultArray.forEach(element => {
                                let tw = egret.Tween.get(this.getChildByName(element));
                                tw.to({ alpha: 1, scaleY: 1, scaleX: 1 }, 1000, egret.Ease.elasticInOut);
                            });

                            this.setChildIndex(GameMasterMindItemClass.youScoreText, this.numChildren + 1);
                            this.setChildIndex(GameMasterMindItemClass.otherScoreText, this.numChildren + 2);

                            let tw = egret.Tween.get(GameMasterMindItemClass.youScoreText);
                            tw.to({ x: 180, y: 618, scaleY: 1.5, scaleX: 1.5 }, 1000, egret.Ease.elasticInOut);

                            let _tw = egret.Tween.get(GameMasterMindItemClass.otherScoreText);
                            _tw.to({ x: 460, y: 618, scaleY: 1.5, scaleX: 1.5 }, 1000, egret.Ease.elasticInOut);
                        });

                        App.TimerManager.doTimer(1300, 1, () => {
                            if (GameMasterMindItemClass.youScore >= GameMasterMindItemClass.otherScore) {
                                GameMasterMindLogic.gameOver(3);
                            } else {
                                GameMasterMindLogic.gameOver(1);
                            }
                        }, this);
                    }

                }, this);

                GameMasterMindItemClass.QuestionOrder += 1;
                break;
        }
    }

    private symbolPosManager = (who: number, where: number, what: boolean) => {
        if (where == -1) {
            return;
        }

        let pos = [0, 0];

        switch (where) {
            case 0:
                pos[1] = 615.5;
                break;
            case 1:
                pos[1] = 726.5;
                break;
            case 2:
                pos[1] = 837.5;
                break;
            case 3:
                pos[1] = 951.5;
                break;
        }

        switch (who) {
            case 0:
                pos[0] = 95.5;
                GameMasterMindItemClass.youMark.alpha = 1;
                switch (what) {
                    case true:
                        GameMasterMindItemClass.youMark.texture = AssetManager.getBitmap("MM_Right_png", true, true).texture;
                        break;
                    case false:
                        GameMasterMindItemClass.youMark.texture = AssetManager.getBitmap("MM_Wrong_png", true, true).texture;
                        break;
                }

                GameMasterMindItemClass.youMark.x = pos[0];
                GameMasterMindItemClass.youMark.y = pos[1];

                GameMasterMindItemClass.youMark.scaleX = 0.2;
                GameMasterMindItemClass.youMark.scaleY = 0.2;
                let tw = egret.Tween.get(GameMasterMindItemClass.youMark);
                tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.elasticInOut);
                tw.call(() => {
                    tw = null;
                });
                break;
            case 1:
                pos[0] = 543.5;
                switch (what) {
                    case true:
                        GameMasterMindItemClass.otherMark.texture = AssetManager.getBitmap("MM_Right_png", true, true).texture;
                        break;
                    case false:
                        GameMasterMindItemClass.otherMark.texture = AssetManager.getBitmap("MM_Wrong_png", true, true).texture;
                        break;
                }

                GameMasterMindItemClass.otherMark.x = pos[0];
                GameMasterMindItemClass.otherMark.y = pos[1];

                GameMasterMindItemClass.otherMark.scaleX = 0.2;
                GameMasterMindItemClass.otherMark.scaleY = 0.2;
                let _tw = egret.Tween.get(GameMasterMindItemClass.otherMark);
                _tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.elasticInOut);
                _tw.call(() => {
                    _tw = null;
                });
                break;
        }
    }

    private judge = () => {

        let youScoreText = new egret.TextField;
        youScoreText.width = 200;
        youScoreText.height = 40;
        youScoreText.anchorOffsetX = 100;
        youScoreText.anchorOffsetY = 20;
        youScoreText.alpha = 0;
        youScoreText.fontFamily = "Arial";
        youScoreText.x = 216;
        youScoreText.y = 275;
        youScoreText.size = 50;
        youScoreText.textAlign = egret.HorizontalAlign.CENTER;
        youScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            youScoreText.text = "+ " + GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.youTimeText.text)).toString();
            youScoreText.textColor = 0x33cc00;
        } else {
            youScoreText.text = "+ 0";
            youScoreText.textColor = 0xff0000;
        }
        this.addChild(youScoreText);
        let youScoreTextTw = egret.Tween.get(youScoreText);
        youScoreTextTw.to({ alpha: 1 }, 300);
        youScoreTextTw.to({ alpha: 1 }, 1900);
        youScoreTextTw.to({ y: 225, scaleX: 0, scaleY: 0, alpha: 0 }, 500);
        youScoreTextTw.call(() => {
            youScoreTextTw = null;
            App.DisplayUtils.removeFromParent(youScoreText);

            let tw = egret.Tween.get(GameMasterMindItemClass.fireLine);
            tw.to({ scaleY: 1 }, 700);

            let _tw = egret.Tween.get(GameMasterMindItemClass.fireLineLeft);
            _tw.to({ scaleY: 1 }, 700);
        });

        let otherScoreText = new egret.TextField;
        otherScoreText.width = 200;
        otherScoreText.height = 40;
        otherScoreText.anchorOffsetX = 100;
        otherScoreText.anchorOffsetY = 20;
        otherScoreText.alpha = 0;
        otherScoreText.fontFamily = "Arial";
        otherScoreText.x = 424;
        otherScoreText.y = 275;
        otherScoreText.size = 50;
        otherScoreText.textAlign = egret.HorizontalAlign.CENTER;
        otherScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
        if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            otherScoreText.text = "+ " + GameMasterMindLogic.scoreManager(parseInt(GameMasterMindItemClass.otherTimeText.text)).toString();
            otherScoreText.textColor = 0x33cc00;
        } else {
            otherScoreText.text = "+ 0";
            otherScoreText.textColor = 0xff0000;
        }
        this.addChild(otherScoreText);
        let otherScoreTextTw = egret.Tween.get(otherScoreText);
        otherScoreTextTw.to({ alpha: 1 }, 300);
        otherScoreTextTw.to({ alpha: 1 }, 1900);
        otherScoreTextTw.to({ y: 225, scaleX: 0, scaleY: 0, alpha: 0 }, 500);
        otherScoreTextTw.call(() => {
            youScoreTextTw = null;
            App.DisplayUtils.removeFromParent(otherScoreText);
        });

        egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
        egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);

        egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
        egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);

        let goGreen: number = GameMasterMindItemClass.correctAnswerIndex;
        switch (goGreen) {
            case 0:
                GameMasterMindItemClass.btn1.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                GameMasterMindItemClass.btn1Text.textColor = 0xffffff;
                break;
            case 1:
                GameMasterMindItemClass.btn2.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                GameMasterMindItemClass.btn2Text.textColor = 0xffffff;
                break;
            case 2:
                GameMasterMindItemClass.btn3.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                GameMasterMindItemClass.btn3Text.textColor = 0xffffff;
                break;
            case 3:
                GameMasterMindItemClass.btn4.texture = AssetManager.getBitmap("MM_BtnGreen_png", true, true).texture;
                GameMasterMindItemClass.btn4Text.textColor = 0xffffff;
                break;
        }

        if (GameMasterMindItemClass.chooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            this.symbolPosManager(0, GameMasterMindItemClass.chooseIndex, true);
            GameMasterMindItemClass.littleLeftMark.alpha = 1;
            GameMasterMindItemClass.littleLeftMark.texture = AssetManager.getBitmap("MM_littleRight_png", true, true).texture;
            GameMasterMindItemClass.soundEffect.play("MM_rightEffect_mp3", true);
            GameMasterMindItemClass.youRole.armature.play("winl", 1);
            GameMasterMindItemClass.youCombo += 1;
        } else {
            this.symbolPosManager(0, GameMasterMindItemClass.chooseIndex, false);
            GameMasterMindItemClass.littleLeftMark.alpha = 1;
            GameMasterMindItemClass.littleLeftMark.texture = AssetManager.getBitmap("MM_littleWrong_png", true, true).texture;
            if (GameMasterMindItemClass.chooseIndex != -1) {
                (this.getChildByName("btn" + (GameMasterMindItemClass.chooseIndex + 1).toString()) as egret.Bitmap).texture = AssetManager.getBitmap("MM_BtnRed_png", true, true).texture;
                (this.getChildByName("btn" + (GameMasterMindItemClass.chooseIndex + 1).toString() + "Text") as egret.TextField).textColor = 0xffffff;
            }
            GameMasterMindItemClass.soundEffect.play("MM_wrongEffect_mp3", true);
            GameMasterMindItemClass.youRole.armature.play("beizha", 1);
            GameMasterMindItemClass.youCombo = 0;
        }

        if (GameMasterMindItemClass.otherChooseIndex == GameMasterMindItemClass.correctAnswerIndex) {
            this.symbolPosManager(1, GameMasterMindItemClass.otherChooseIndex, true);
            GameMasterMindItemClass.littleRightMark.alpha = 1;
            GameMasterMindItemClass.littleRightMark.texture = AssetManager.getBitmap("MM_littleRight_png", true, true).texture;
            GameMasterMindItemClass.otherRole.armature.play("winl", 1);
            GameMasterMindItemClass.otherCombo += 1;
        } else {
            this.symbolPosManager(1, GameMasterMindItemClass.otherChooseIndex, false);
            GameMasterMindItemClass.littleRightMark.alpha = 1;
            GameMasterMindItemClass.littleRightMark.texture = AssetManager.getBitmap("MM_littleWrong_png", true, true).texture;
            if (GameMasterMindItemClass.otherChooseIndex != -1) {
                (this.getChildByName("btn" + (GameMasterMindItemClass.otherChooseIndex + 1).toString()) as egret.Bitmap).texture = AssetManager.getBitmap("MM_BtnRed_png", true, true).texture;
                (this.getChildByName("btn" + (GameMasterMindItemClass.otherChooseIndex + 1).toString() + "Text") as egret.TextField).textColor = 0xffffff;
            }
            GameMasterMindItemClass.otherRole.armature.play("beizha", 1);
            GameMasterMindItemClass.otherCombo = 0;
        }

        console.log("Combo : " + [GameMasterMindItemClass.youCombo, GameMasterMindItemClass.otherCombo]);

        if (GameMasterMindItemClass.youCombo > 1) {
            GameMasterMindItemClass.youComboText.text = GameMasterMindItemClass.youCombo.toString();

            let youComboTW = egret.Tween.get(GameMasterMindItemClass.leftCombo);
            youComboTW.to({ x: 0 }, 300);
            youComboTW.call(() => {
                youComboTW = null;
            });

            let youComboTextTW = egret.Tween.get(GameMasterMindItemClass.youComboText);
            youComboTextTW.to({ x: 115, alpha: 1 }, 300);
            youComboTextTW.call(() => {
                GameMasterMindItemClass.youComboState = true;
                youComboTextTW = null;
            });
        }

        if (GameMasterMindItemClass.otherCombo > 1) {
            GameMasterMindItemClass.otherComboText.text = GameMasterMindItemClass.otherCombo.toString();

            let otherComboTW = egret.Tween.get(GameMasterMindItemClass.rightCombo);
            otherComboTW.to({ x: 483 }, 300);
            otherComboTW.call(() => {
                otherComboTW = null;
            });

            let otherComboTextTW = egret.Tween.get(GameMasterMindItemClass.otherComboText);
            otherComboTextTW.to({ x: 615, alpha: 1 }, 300);
            otherComboTextTW.call(() => {
                GameMasterMindItemClass.otherComboState = true;
                otherComboTextTW = null;
            });
        }
    }

    private mainTick = (): boolean => {

        if (GameMasterMindMainScene.runningSec == 0) {
            this.animationManager("start");
        }

        if (GameMasterMindMainScene.runningSec % 60 == 0) {
            GameMasterMindItemClass.countdownText.text = (parseInt(GameMasterMindItemClass.countdownText.text) - 1).toString();
        }

        if (GameMasterMindMainScene.runningSec == 900) {
            egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
            egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
            egret.stopTick(this.mainTick, this);
            GameMasterMindMainScene.runningSec = 0
            this.animationManager("end");
            return;
        }

        GameMasterMindMainScene.runningSec += 1;
        return true;
    }

    private answerTick = (): boolean => {
        if (GameMasterMindItemClass.readyState[0] == 1 && GameMasterMindItemClass.readyState[1] == 1) {
            GameMasterMindItemClass.readyState[0] = 0;
            GameMasterMindItemClass.readyState[1] = 0;

            egret.stopTick(this.mainTick, this);
            egret.stopTick(this.answerTick, this);
            egret.stopTick(GameMasterMindMainScene.youTimer, GameMasterMindMainScene);
            egret.stopTick(GameMasterMindMainScene.otherTimer, GameMasterMindMainScene);

            egret.Tween.removeTweens(GameMasterMindItemClass.fireLineLeft);
            egret.Tween.removeTweens(GameMasterMindItemClass.fireLine);
            GameMasterMindItemClass.fireLineLeftMask.scaleY = 1;
            GameMasterMindItemClass.fireLineMask.scaleY = 1;

            this.animationManager("end");
        }
        return false;
    }

    public static youTimer = (): boolean => {
        GameMasterMindItemClass.youTime += 1;
        if (GameMasterMindItemClass.youTimeText) {
            GameMasterMindItemClass.youTimeText.alpha = 1;
            GameMasterMindItemClass.youTimeText.text = parseInt((GameMasterMindItemClass.youTime / 60).toString()).toString();
            switch (GameMasterMindItemClass.youTime) {
                case 600:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 660:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 720:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 780:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
                case 840:
                    GameMasterMindItemClass.soundEffect.play("MM_timeCount_mp3", true);
                    break;
            }
        }
        return false;
    }

    public static otherTimer = (): boolean => {
        GameMasterMindItemClass.otherTime += 1;
        if (GameMasterMindItemClass.otherTimeText) {
            GameMasterMindItemClass.otherTimeText.alpha = 1;
            GameMasterMindItemClass.otherTimeText.text = parseInt((GameMasterMindItemClass.otherTime / 60).toString()).toString();
        }
        return false;
    }

    private getSType = (who: number): egret.Bitmap => {
        let SexIcon: number = 0;

        let getIcon = (sexType: number) => {
            switch (sexType) {
                case 1:
                    SexIcon = 1;
                    break;
                case 2:
                    SexIcon = 2;
                    break;
            }
        }
        switch (who) {
            case 0:
                getIcon(DataCenter.instance.user.sex);
                break;
            case 1:
                getIcon(DataCenter.instance.room.player.sex);
                break;
        }

        switch (SexIcon) {
            case 1:
                return AssetManager.getBitmap("img_boy_png", false, false);
            case 2:
                return AssetManager.getBitmap("img_gril_png", false, false);
        }
    }

    public static showLeftTimeUsed = (hideOrShow: boolean = false) => {
        let leftArray = [GameMasterMindItemClass.timeUsedLeftBoard, GameMasterMindItemClass.leftTimeUsed, GameMasterMindItemClass.youTimeText];

        switch (hideOrShow) {
            case false:
                GameMasterMindItemClass.hasShowLeftTimeUsed = true;
                leftArray.forEach(element => {
                    let tw = egret.Tween.get(element);
                    tw.to({ x: (element.x + 132) }, 300);
                    tw.call(() => {
                        tw = null;
                    });
                });
                break;
            case true:
                if (GameMasterMindItemClass.hasShowLeftTimeUsed == true) {
                    GameMasterMindItemClass.hasShowLeftTimeUsed = false;
                    leftArray.forEach(element => {
                        let tw = egret.Tween.get(element);
                        tw.to({ x: (element.x - 132) }, 300);
                        tw.call(() => {
                            tw = null;
                        });
                    });
                }
                break;
        }
    }

    public static showRightTimeUsed = (hideOrShow: boolean = false) => {
        let rightArray = [GameMasterMindItemClass.timeUsedRightBoard, GameMasterMindItemClass.rightTimeUsed, GameMasterMindItemClass.otherTimeText];

        switch (hideOrShow) {
            case false:
                GameMasterMindItemClass.hasShowRightTimeUsed = true;
                rightArray.forEach(element => {
                    let tw = egret.Tween.get(element);
                    tw.to({ x: (element.x - 132) }, 300);
                    tw.call(() => {
                        tw = null;
                    });
                });
                break;
            case true:
                if (GameMasterMindItemClass.hasShowRightTimeUsed == true) {
                    GameMasterMindItemClass.hasShowRightTimeUsed = false;
                    rightArray.forEach(element => {
                        let tw = egret.Tween.get(element);
                        tw.to({ x: (element.x + 132) }, 300);
                        tw.call(() => {
                            tw = null;
                        });
                    });
                }
                break;
        }
    }

    private showPersonalInformation = () => {
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.user });
    }

    private showOtherPersonalInformation = () => {
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: DataCenter.instance.room.player });
    }

    private showGreeting = () => {
        App.GameExpressType = 2;
        this.popup("GameExpress");
    }

    private report = () => {
        (this.getChildByName("reportIcon") as egret.Bitmap).alpha = 0;
        GameMasterMindItemClass.reportIcon.touchEnabled = false;
        App.MessageCenter.dispatch(EventMessage.AddErrQuestionC2S, GameMasterMindItemClass.questionText.text, () => {
            console.log("HAS REPORT!");
            this.showHasReport();
        });
    }

    private gameInit = () => {
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.messageDuel, this);
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.resultDuel, this);
        App.MessageCenter.addListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this)

        GameMasterMindItemClass.backGround = AssetManager.getBitmap("MM_backGround_png", false, false);
        GameMasterMindItemClass.backGround.x = 0;
        GameMasterMindItemClass.backGround.y = 0;
        this.addChild(GameMasterMindItemClass.backGround);

        GameMasterMindItemClass.btn1 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
        GameMasterMindItemClass.btn1.x = 320;
        GameMasterMindItemClass.btn1.y = 580;
        GameMasterMindItemClass.btn1.name = "btn1";
        GameMasterMindItemClass.btn1.addEventListener("touchTap", GameMasterMindLogic.btn1Press, this);
        this.addChild(GameMasterMindItemClass.btn1);

        GameMasterMindItemClass.btn1Text = new egret.TextField();
        GameMasterMindItemClass.btn1Text.width = 520;
        GameMasterMindItemClass.btn1Text.height = 36;
        GameMasterMindItemClass.btn1Text.anchorOffsetX = 260;
        GameMasterMindItemClass.btn1Text.anchorOffsetY = 18;
        GameMasterMindItemClass.btn1Text.fontFamily = "Arial";
        GameMasterMindItemClass.btn1Text.textColor = 0x4c407b;
        GameMasterMindItemClass.btn1Text.size = 36;
        GameMasterMindItemClass.btn1Text.x = 320;
        GameMasterMindItemClass.btn1Text.y = 580;
        GameMasterMindItemClass.btn1Text.alpha = 0;
        GameMasterMindItemClass.btn1Text.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.btn1Text.verticalAlign = egret.VerticalAlign.MIDDLE;
        GameMasterMindItemClass.btn1Text.name = "btn1Text";
        this.addChild(GameMasterMindItemClass.btn1Text);

        GameMasterMindItemClass.btn2 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
        GameMasterMindItemClass.btn2.x = 320;
        GameMasterMindItemClass.btn2.y = 580;
        GameMasterMindItemClass.btn2.name = "btn2";
        GameMasterMindItemClass.btn2.addEventListener("touchTap", GameMasterMindLogic.btn2Press, this);
        this.addChild(GameMasterMindItemClass.btn2);

        GameMasterMindItemClass.btn2Text = new egret.TextField();
        GameMasterMindItemClass.btn2Text.width = 520;
        GameMasterMindItemClass.btn2Text.height = 36;
        GameMasterMindItemClass.btn2Text.anchorOffsetX = 260;
        GameMasterMindItemClass.btn2Text.anchorOffsetY = 18;
        GameMasterMindItemClass.btn2Text.fontFamily = "Arial";
        GameMasterMindItemClass.btn2Text.textColor = 0x4c407b;
        GameMasterMindItemClass.btn2Text.size = 36;
        GameMasterMindItemClass.btn2Text.x = 320;
        GameMasterMindItemClass.btn2Text.y = 580;
        GameMasterMindItemClass.btn2Text.alpha = 0;
        GameMasterMindItemClass.btn2Text.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.btn2Text.verticalAlign = egret.VerticalAlign.MIDDLE;
        GameMasterMindItemClass.btn2Text.name = "btn2Text";
        this.addChild(GameMasterMindItemClass.btn2Text);

        GameMasterMindItemClass.btn3 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
        GameMasterMindItemClass.btn3.x = 320;
        GameMasterMindItemClass.btn3.y = 580;
        GameMasterMindItemClass.btn3.name = "btn3";
        GameMasterMindItemClass.btn3.addEventListener("touchTap", GameMasterMindLogic.btn3Press, this);
        this.addChild(GameMasterMindItemClass.btn3);

        GameMasterMindItemClass.btn3Text = new egret.TextField();
        GameMasterMindItemClass.btn3Text.width = 520;
        GameMasterMindItemClass.btn3Text.height = 36;
        GameMasterMindItemClass.btn3Text.anchorOffsetX = 260;
        GameMasterMindItemClass.btn3Text.anchorOffsetY = 18;
        GameMasterMindItemClass.btn3Text.fontFamily = "Arial";
        GameMasterMindItemClass.btn3Text.textColor = 0x4c407b;
        GameMasterMindItemClass.btn3Text.size = 36;
        GameMasterMindItemClass.btn3Text.x = 320;
        GameMasterMindItemClass.btn3Text.y = 580;
        GameMasterMindItemClass.btn3Text.alpha = 0;
        GameMasterMindItemClass.btn3Text.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.btn3Text.verticalAlign = egret.VerticalAlign.MIDDLE;
        GameMasterMindItemClass.btn3Text.name = "btn3Text";
        this.addChild(GameMasterMindItemClass.btn3Text);

        GameMasterMindItemClass.btn4 = AssetManager.getBitmap("MM_BtnWhite_png", true, true);
        GameMasterMindItemClass.btn4.x = 320;
        GameMasterMindItemClass.btn4.y = 580;
        GameMasterMindItemClass.btn4.name = "btn4";
        GameMasterMindItemClass.btn4.addEventListener("touchTap", GameMasterMindLogic.btn4Press, this);
        this.addChild(GameMasterMindItemClass.btn4);

        GameMasterMindItemClass.btn4Text = new egret.TextField();
        GameMasterMindItemClass.btn4Text.width = 520;
        GameMasterMindItemClass.btn4Text.height = 36;
        GameMasterMindItemClass.btn4Text.anchorOffsetX = 260;
        GameMasterMindItemClass.btn4Text.anchorOffsetY = 18;
        GameMasterMindItemClass.btn4Text.fontFamily = "Arial";
        GameMasterMindItemClass.btn4Text.textColor = 0x4c407b;
        GameMasterMindItemClass.btn4Text.size = 36;
        GameMasterMindItemClass.btn4Text.x = 320;
        GameMasterMindItemClass.btn4Text.y = 580;
        GameMasterMindItemClass.btn4Text.alpha = 0;
        GameMasterMindItemClass.btn4Text.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.btn4Text.verticalAlign = egret.VerticalAlign.MIDDLE;
        GameMasterMindItemClass.btn4Text.name = "btn4Text";
        this.addChild(GameMasterMindItemClass.btn4Text);

        GameMasterMindItemClass.questionBoard = AssetManager.getBitmap("MM_questionBoard_png", true, true);
        GameMasterMindItemClass.questionBoard.x = 320;
        GameMasterMindItemClass.questionBoard.y = 580;
        this.addChild(GameMasterMindItemClass.questionBoard);

        GameMasterMindItemClass.questionText = new egret.TextField();
        GameMasterMindItemClass.questionText.width = 510;
        GameMasterMindItemClass.questionText.height = 279;
        GameMasterMindItemClass.questionText.anchorOffsetX = 255;
        GameMasterMindItemClass.questionText.anchorOffsetY = 139.5;
        GameMasterMindItemClass.questionText.fontFamily = "Arial";
        GameMasterMindItemClass.questionText.textColor = 0x4c407b;
        GameMasterMindItemClass.questionText.size = 36;
        GameMasterMindItemClass.questionText.lineSpacing = 22;
        GameMasterMindItemClass.questionText.x = 320;
        GameMasterMindItemClass.questionText.y = 580;
        GameMasterMindItemClass.questionText.alpha = 0;
        GameMasterMindItemClass.questionText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.questionText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.questionText);

        GameMasterMindItemClass.scoreBoard = AssetManager.getBitmap("MM_scoreBoard_png", true, true);
        GameMasterMindItemClass.scoreBoard.x = 320;
        GameMasterMindItemClass.scoreBoard.y = 223;
        this.addChild(GameMasterMindItemClass.scoreBoard);

        GameMasterMindItemClass.clock = AssetManager.getBitmap("MM_Clock_png", true, true);
        GameMasterMindItemClass.clock.x = 320;
        GameMasterMindItemClass.clock.y = 223;
        this.addChild(GameMasterMindItemClass.clock);

        GameMasterMindItemClass.countdownText = new egret.TextField();
        GameMasterMindItemClass.countdownText.height = 40;
        GameMasterMindItemClass.countdownText.width = 82;
        GameMasterMindItemClass.countdownText.size = 40;
        GameMasterMindItemClass.countdownText.fontFamily = "Arial";
        GameMasterMindItemClass.countdownText.anchorOffsetX = 41;
        GameMasterMindItemClass.countdownText.anchorOffsetY = 20;
        GameMasterMindItemClass.countdownText.textColor = 0x4c3a57;
        GameMasterMindItemClass.countdownText.alpha = 0;
        GameMasterMindItemClass.countdownText.bold = true;
        GameMasterMindItemClass.countdownText.x = 320;
        GameMasterMindItemClass.countdownText.y = 227;
        GameMasterMindItemClass.countdownText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.countdownText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.countdownText);

        let playData = DataCenter.instance.room.player;
        GameMasterMindItemClass.otherRole = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "dbxiaoren00_game8");
        GameMasterMindItemClass.otherRole.armature.x = 420;
        GameMasterMindItemClass.otherRole.armature.y = 180;
        GameMasterMindItemClass.otherRole.armature.scaleX = 0.8;
        GameMasterMindItemClass.otherRole.armature.scaleY = 0.8;
        GameMasterMindItemClass.otherRole.armature.play("zhengchang", 0);
        this.addChild(GameMasterMindItemClass.otherRole.armature);
        GameMasterMindItemClass.otherRole.armature.touchEnabled = true;
        GameMasterMindItemClass.otherRole.armature.addEventListener("touchTap", this.showOtherPersonalInformation, this);

        let myData = DataCenter.instance.user;
        GameMasterMindItemClass.youRole = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "dbxiaoren00_game8");
        GameMasterMindItemClass.youRole.armature.x = 212;
        GameMasterMindItemClass.youRole.armature.y = 180;
        GameMasterMindItemClass.youRole.armature.scaleX = 0.8;
        GameMasterMindItemClass.youRole.armature.scaleY = 0.8;
        GameMasterMindItemClass.youRole.armature.play("zhengchang", 0);
        this.addChild(GameMasterMindItemClass.youRole.armature);
        GameMasterMindItemClass.youRole.armature.touchEnabled = true;
        GameMasterMindItemClass.youRole.armature.addEventListener("touchTap", this.showPersonalInformation, this);

        GameMasterMindItemClass.fireLineLeftMask = AssetManager.getBitmap("MM_timeLineBlack_png", false, false);
        GameMasterMindItemClass.fireLineLeftMask.x = 25;
        GameMasterMindItemClass.fireLineLeftMask.y = 246;
        this.addChild(GameMasterMindItemClass.fireLineLeftMask);

        GameMasterMindItemClass.fireLineLeft = AssetManager.getBitmap("MM_timeLineOrange_png", false, false);
        GameMasterMindItemClass.fireLineLeft.x = 25;
        GameMasterMindItemClass.fireLineLeft.y = 246;
        this.addChild(GameMasterMindItemClass.fireLineLeft);

        GameMasterMindItemClass.fireLineMask = AssetManager.getBitmap("MM_timeLineBlack_png", false, false);
        GameMasterMindItemClass.fireLineMask.x = 600;
        GameMasterMindItemClass.fireLineMask.y = 246;
        this.addChild(GameMasterMindItemClass.fireLineMask);

        GameMasterMindItemClass.fireLine = AssetManager.getBitmap("MM_timeLineOrange_png", false, false);
        GameMasterMindItemClass.fireLine.x = 600;
        GameMasterMindItemClass.fireLine.y = 246;
        this.addChild(GameMasterMindItemClass.fireLine);

        GameMasterMindItemClass.greetNormalBtn = AssetManager.getBitmap("MM_greet_png", true, false);
        GameMasterMindItemClass.greetNormalBtn.x = 320;
        GameMasterMindItemClass.greetNormalBtn.y = 1035;
        GameMasterMindItemClass.greetNormalBtn.touchEnabled = true;
        GameMasterMindItemClass.greetNormalBtn.addEventListener("touchTap", this.showGreeting, this);
        this.addChild(GameMasterMindItemClass.greetNormalBtn);

        GameMasterMindItemClass.loadingTips = new egret.TextField();
        GameMasterMindItemClass.loadingTips.name = "loadingTips";
        GameMasterMindItemClass.loadingTips.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.loadingTips.size = 50;
        GameMasterMindItemClass.loadingTips.fontFamily = "Arial";
        GameMasterMindItemClass.loadingTips.textColor = 0x4c407b;
        GameMasterMindItemClass.loadingTips.width = 500;
        GameMasterMindItemClass.loadingTips.height = 50;
        GameMasterMindItemClass.loadingTips.anchorOffsetX = 250;
        GameMasterMindItemClass.loadingTips.anchorOffsetY = 25;
        GameMasterMindItemClass.loadingTips.x = 320;
        GameMasterMindItemClass.loadingTips.y = 580;
        this.addChild(GameMasterMindItemClass.loadingTips);

        GameMasterMindItemClass.youMark = AssetManager.getBitmap("MM_Right_png", true, true);
        GameMasterMindItemClass.youMark.width = 100;
        GameMasterMindItemClass.youMark.height = 100;
        GameMasterMindItemClass.youMark.x = 333;
        GameMasterMindItemClass.youMark.y = 333;
        GameMasterMindItemClass.youMark.alpha = 0;
        this.addChild(GameMasterMindItemClass.youMark);

        GameMasterMindItemClass.otherMark = AssetManager.getBitmap("MM_Right_png", true, true);
        GameMasterMindItemClass.otherMark.width = 100;
        GameMasterMindItemClass.otherMark.height = 100;
        GameMasterMindItemClass.otherMark.x = 333;
        GameMasterMindItemClass.otherMark.y = 333;
        GameMasterMindItemClass.otherMark.alpha = 0;
        this.addChild(GameMasterMindItemClass.otherMark);

        GameMasterMindItemClass.typeStr = new egret.TextField();
        GameMasterMindItemClass.typeStr.width = 110;
        GameMasterMindItemClass.typeStr.height = 30;
        GameMasterMindItemClass.typeStr.anchorOffsetX = 55;
        GameMasterMindItemClass.typeStr.anchorOffsetY = 15;
        GameMasterMindItemClass.typeStr.textColor = 0xffffff;
        GameMasterMindItemClass.typeStr.alpha = 0;
        GameMasterMindItemClass.typeStr.fontFamily = "Arial";
        GameMasterMindItemClass.typeStr.x = 86;
        GameMasterMindItemClass.typeStr.y = 1048;
        GameMasterMindItemClass.typeStr.bold = true;
        GameMasterMindItemClass.typeStr.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.typeStr.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.typeStr);

        GameMasterMindItemClass.turnsText = new egret.TextField();
        GameMasterMindItemClass.turnsText.width = 110;
        GameMasterMindItemClass.turnsText.height = 30;
        GameMasterMindItemClass.turnsText.anchorOffsetX = 55;
        GameMasterMindItemClass.turnsText.anchorOffsetY = 15;
        GameMasterMindItemClass.turnsText.textColor = 0xffffff;
        GameMasterMindItemClass.turnsText.alpha = 0;
        GameMasterMindItemClass.turnsText.fontFamily = "Arial";
        GameMasterMindItemClass.turnsText.x = 565;
        GameMasterMindItemClass.turnsText.y = 1048;
        GameMasterMindItemClass.turnsText.bold = true;
        GameMasterMindItemClass.turnsText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.turnsText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.turnsText);

        GameMasterMindItemClass.reportIcon = AssetManager.getBitmap("MM_Report_png", false, false);
        GameMasterMindItemClass.reportIcon.x = 538;
        GameMasterMindItemClass.reportIcon.y = 261;
        GameMasterMindItemClass.reportIcon.alpha = 0;
        GameMasterMindItemClass.reportIcon.scaleX = 0.8;
        GameMasterMindItemClass.reportIcon.scaleY = 0.8;
        GameMasterMindItemClass.reportIcon.name = "reportIcon";
        GameMasterMindItemClass.reportIcon.addEventListener("touchTap", this.report, this)
        this.addChild(GameMasterMindItemClass.reportIcon);

        GameMasterMindItemClass.nameLeftBoard = AssetManager.getBitmap("MM_nameBoard_png", false, false);
        GameMasterMindItemClass.nameLeftBoard.x = 224;
        GameMasterMindItemClass.nameLeftBoard.y = 151;
        GameMasterMindItemClass.nameLeftBoard.skewY = 180;
        this.addChild(GameMasterMindItemClass.nameLeftBoard);

        GameMasterMindItemClass.nameRightBoard = AssetManager.getBitmap("MM_nameBoard_png", false, false);
        GameMasterMindItemClass.nameRightBoard.x = 418;
        GameMasterMindItemClass.nameRightBoard.y = 151;
        this.addChild(GameMasterMindItemClass.nameRightBoard);

        GameMasterMindItemClass.leftDesk = AssetManager.getBitmap("MM_desk_png", true, true);
        GameMasterMindItemClass.leftDesk.x = 217;
        GameMasterMindItemClass.leftDesk.y = 173.5;
        this.addChild(GameMasterMindItemClass.leftDesk);

        GameMasterMindItemClass.rightDesk = AssetManager.getBitmap("MM_desk_png", true, true);
        GameMasterMindItemClass.rightDesk.x = 426;
        GameMasterMindItemClass.rightDesk.y = 173.5;
        this.addChild(GameMasterMindItemClass.rightDesk);

        GameMasterMindItemClass.youScoreText = new egret.TextField();
        GameMasterMindItemClass.youScoreText.width = 200;
        GameMasterMindItemClass.youScoreText.height = 36;
        GameMasterMindItemClass.youScoreText.anchorOffsetX = 100;
        GameMasterMindItemClass.youScoreText.anchorOffsetY = 18;
        GameMasterMindItemClass.youScoreText.textColor = 0xffffff;
        GameMasterMindItemClass.youScoreText.alpha = 0;
        GameMasterMindItemClass.youScoreText.fontFamily = "Arial";
        GameMasterMindItemClass.youScoreText.x = 216;
        GameMasterMindItemClass.youScoreText.y = 225;
        GameMasterMindItemClass.youScoreText.size = 36;
        GameMasterMindItemClass.youScoreText.bold = true;
        GameMasterMindItemClass.youScoreText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.youScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.youScoreText);

        GameMasterMindItemClass.otherScoreText = new egret.TextField();
        GameMasterMindItemClass.otherScoreText.width = 200;
        GameMasterMindItemClass.otherScoreText.height = 36;
        GameMasterMindItemClass.otherScoreText.anchorOffsetX = 100;
        GameMasterMindItemClass.otherScoreText.anchorOffsetY = 18;
        GameMasterMindItemClass.otherScoreText.textColor = 0xffffff;
        GameMasterMindItemClass.otherScoreText.alpha = 0;
        GameMasterMindItemClass.otherScoreText.fontFamily = "Arial";
        GameMasterMindItemClass.otherScoreText.x = 424;
        GameMasterMindItemClass.otherScoreText.y = 225;
        GameMasterMindItemClass.otherScoreText.size = 36;
        GameMasterMindItemClass.otherScoreText.bold = true;
        GameMasterMindItemClass.otherScoreText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.otherScoreText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.otherScoreText);

        GameMasterMindItemClass.littleLeftMark = AssetManager.getBitmap("MM_littleRight_png", true, true);
        GameMasterMindItemClass.littleLeftMark.x = 217;
        GameMasterMindItemClass.littleLeftMark.y = 177;
        GameMasterMindItemClass.littleLeftMark.alpha = 0;
        this.addChild(GameMasterMindItemClass.littleLeftMark);

        GameMasterMindItemClass.littleRightMark = AssetManager.getBitmap("MM_littleRight_png", true, true);
        GameMasterMindItemClass.littleRightMark.x = 426;
        GameMasterMindItemClass.littleRightMark.y = 177;
        GameMasterMindItemClass.littleRightMark.alpha = 0;
        this.addChild(GameMasterMindItemClass.littleRightMark);

        let leftSexTypeIcon = this.getSType(0);
        leftSexTypeIcon.x = 142;
        leftSexTypeIcon.y = 161;
        this.addChild(leftSexTypeIcon);

        let rightSexTypeIcon = this.getSType(1);
        rightSexTypeIcon.x = 478;
        rightSexTypeIcon.y = 161;
        this.addChild(rightSexTypeIcon);

        let leftName = new egret.TextField();
        leftName.width = 240;
        leftName.height = 30;
        leftName.anchorOffsetX = 240;
        leftName.x = 130;
        leftName.y = 158;
        leftName.textColor = 0xffffff;
        leftName.textAlign = egret.HorizontalAlign.RIGHT;
        leftName.verticalAlign = egret.VerticalAlign.MIDDLE;
        leftName.text = DataCenter.instance.user.name;
        this.addChild(leftName);

        let rightName = new egret.TextField();
        rightName.width = 240;
        rightName.height = 30;
        rightName.x = 512;
        rightName.y = 158;
        rightName.textColor = 0xffffff;
        rightName.textAlign = egret.HorizontalAlign.LEFT;
        rightName.verticalAlign = egret.VerticalAlign.MIDDLE;
        rightName.text = DataCenter.instance.room.player.name;
        this.addChild(rightName);

        GameMasterMindItemClass.timeUsedLeftBoard = AssetManager.getBitmap("MM_timeUsedBoard_png", false, false);
        GameMasterMindItemClass.timeUsedLeftBoard.x = 130 - 132;
        GameMasterMindItemClass.timeUsedLeftBoard.y = 191;
        GameMasterMindItemClass.timeUsedLeftBoard.skewY = 180;
        this.addChild(GameMasterMindItemClass.timeUsedLeftBoard);

        GameMasterMindItemClass.timeUsedRightBoard = AssetManager.getBitmap("MM_timeUsedBoard_png", false, false);
        GameMasterMindItemClass.timeUsedRightBoard.x = 510 + 132;
        GameMasterMindItemClass.timeUsedRightBoard.y = 191;
        this.addChild(GameMasterMindItemClass.timeUsedRightBoard);

        GameMasterMindItemClass.leftTimeUsed = AssetManager.getBitmap("MM_timeUsed_png", false, false);
        GameMasterMindItemClass.leftTimeUsed.x = 11 - 132;
        GameMasterMindItemClass.leftTimeUsed.y = 198;
        this.addChild(GameMasterMindItemClass.leftTimeUsed);

        GameMasterMindItemClass.rightTimeUsed = AssetManager.getBitmap("MM_timeUsed_png", false, false);
        GameMasterMindItemClass.rightTimeUsed.x = 527 + 132;
        GameMasterMindItemClass.rightTimeUsed.y = 198;
        this.addChild(GameMasterMindItemClass.rightTimeUsed);

        GameMasterMindItemClass.youTimeText = new egret.TextField();
        GameMasterMindItemClass.youTimeText.width = 60;
        GameMasterMindItemClass.youTimeText.height = 30;
        GameMasterMindItemClass.youTimeText.anchorOffsetX = 30;
        GameMasterMindItemClass.youTimeText.anchorOffsetY = 15;
        GameMasterMindItemClass.youTimeText.textColor = 0x4c407b;
        GameMasterMindItemClass.youTimeText.alpha = 0;
        GameMasterMindItemClass.youTimeText.fontFamily = "Arial";
        GameMasterMindItemClass.youTimeText.x = 71 - 132;
        GameMasterMindItemClass.youTimeText.y = 213;
        GameMasterMindItemClass.youTimeText.size = 24;
        GameMasterMindItemClass.youTimeText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.youTimeText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.youTimeText);

        GameMasterMindItemClass.otherTimeText = new egret.TextField();
        GameMasterMindItemClass.otherTimeText.width = 60;
        GameMasterMindItemClass.otherTimeText.height = 30;
        GameMasterMindItemClass.otherTimeText.anchorOffsetX = 30;
        GameMasterMindItemClass.otherTimeText.anchorOffsetY = 15;
        GameMasterMindItemClass.otherTimeText.textColor = 0x4c407b;
        GameMasterMindItemClass.otherTimeText.alpha = 0;
        GameMasterMindItemClass.otherTimeText.fontFamily = "Arial";
        GameMasterMindItemClass.otherTimeText.x = 587 + 132;
        GameMasterMindItemClass.otherTimeText.y = 213;
        GameMasterMindItemClass.otherTimeText.size = 24;
        GameMasterMindItemClass.otherTimeText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.otherTimeText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.otherTimeText);

        GameMasterMindItemClass.leftCombo = AssetManager.getBitmap("MM_leftCombo_png", false, false);
        GameMasterMindItemClass.leftCombo.x = 0 - 157;
        GameMasterMindItemClass.leftCombo.y = 126;
        this.addChild(GameMasterMindItemClass.leftCombo);

        GameMasterMindItemClass.youComboText = new egret.TextField();
        GameMasterMindItemClass.youComboText.width = 48;
        GameMasterMindItemClass.youComboText.height = 24;
        GameMasterMindItemClass.youComboText.anchorOffsetX = 24;
        GameMasterMindItemClass.youComboText.anchorOffsetY = 12;
        GameMasterMindItemClass.youComboText.textColor = 0xffffff;
        GameMasterMindItemClass.youComboText.alpha = 0;
        GameMasterMindItemClass.youComboText.fontFamily = "Arial";
        GameMasterMindItemClass.youComboText.x = -42;
        GameMasterMindItemClass.youComboText.y = 140;
        GameMasterMindItemClass.youComboText.size = 24;
        GameMasterMindItemClass.youComboText.bold = true;
        GameMasterMindItemClass.youComboText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.youComboText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.youComboText);

        GameMasterMindItemClass.rightCombo = AssetManager.getBitmap("MM_rightCombo_png", false, false);
        GameMasterMindItemClass.rightCombo.x = 483 + 157;
        GameMasterMindItemClass.rightCombo.y = 126;
        this.addChild(GameMasterMindItemClass.rightCombo);

        GameMasterMindItemClass.otherComboText = new egret.TextField();
        GameMasterMindItemClass.otherComboText.width = 48;
        GameMasterMindItemClass.otherComboText.height = 24;
        GameMasterMindItemClass.otherComboText.anchorOffsetX = 24;
        GameMasterMindItemClass.otherComboText.anchorOffsetY = 12;
        GameMasterMindItemClass.otherComboText.textColor = 0xffffff;
        GameMasterMindItemClass.otherComboText.alpha = 0;
        GameMasterMindItemClass.otherComboText.fontFamily = "Arial";
        GameMasterMindItemClass.otherComboText.x = 772;
        GameMasterMindItemClass.otherComboText.y = 140;
        GameMasterMindItemClass.otherComboText.size = 24;
        GameMasterMindItemClass.otherComboText.bold = true;
        GameMasterMindItemClass.otherComboText.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.otherComboText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.otherComboText);

        GameMasterMindItemClass.littlePurple = AssetManager.getBitmap("MM_littlePurple_png", true, false);
        GameMasterMindItemClass.littlePurple.x = 320;
        GameMasterMindItemClass.littlePurple.y = 610;
        GameMasterMindItemClass.littlePurple.alpha = 0;
        this.addChild(GameMasterMindItemClass.littlePurple);

        GameMasterMindItemClass.spareType = new egret.TextField();
        GameMasterMindItemClass.spareType.width = 110;
        GameMasterMindItemClass.spareType.height = 30;
        GameMasterMindItemClass.spareType.anchorOffsetX = 55;
        GameMasterMindItemClass.spareType.anchorOffsetY = 15;
        GameMasterMindItemClass.spareType.textColor = 0xffffff;
        GameMasterMindItemClass.spareType.alpha = 0;
        GameMasterMindItemClass.spareType.fontFamily = "Arial";
        GameMasterMindItemClass.spareType.x = 320;
        GameMasterMindItemClass.spareType.y = 631;
        GameMasterMindItemClass.spareType.bold = true;
        GameMasterMindItemClass.spareType.textAlign = egret.HorizontalAlign.CENTER;
        GameMasterMindItemClass.spareType.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(GameMasterMindItemClass.spareType);

        let sideMask = AssetManager.getBitmap("MM_sideMask_png", false, false);
        sideMask.x = -300;
        sideMask.y = 0;
        this.addChild(sideMask);

        let _sideMask = AssetManager.getBitmap("MM_sideMask_png", false, false);
        _sideMask.x = 640;
        _sideMask.y = 0;
        this.addChild(_sideMask);

        GameMasterMindItemClass.answerMask = AssetManager.getBitmap("MM_answerMask_png", false, false);
        GameMasterMindItemClass.answerMask.alpha = 0;
        GameMasterMindItemClass.answerMask.x = 52;
        GameMasterMindItemClass.answerMask.y = 566;
        GameMasterMindItemClass.answerMask.touchEnabled = false;
        GameMasterMindItemClass.answerMask.addEventListener("touchTap", this.showHasChoose, this);
        this.addChild(GameMasterMindItemClass.answerMask);

        let resultText = AssetManager.getBitmap("MM_win_png", true, false);
        resultText.x = 320;
        resultText.y = 510;
        resultText.alpha = 0;
        resultText.name = "resultText";
        resultText.scaleX = 3;
        resultText.scaleY = 3;
        this.addChild(resultText);

        let dot = AssetManager.getBitmap("MM_dot_png", true, false);
        dot.x = 320;
        dot.y = 605;
        dot.alpha = 0;
        dot.name = "dot";
        dot.scaleX = 3;
        dot.scaleY = 3;
        this.addChild(dot);

        let leftScoreResult = AssetManager.getBitmap("MM_winBG_png", true, true);
        leftScoreResult.y = 617;
        leftScoreResult.x = 180;
        leftScoreResult.alpha = 0;
        leftScoreResult.name = "leftScoreResult";
        leftScoreResult.scaleX = 3;
        leftScoreResult.scaleY = 3;
        this.addChild(leftScoreResult);

        let rightScoreResult = AssetManager.getBitmap("MM_loseBG_png", true, true);
        rightScoreResult.x = 460;
        rightScoreResult.y = 617;
        rightScoreResult.alpha = 0;
        rightScoreResult.name = "rightScoreResult";
        rightScoreResult.scaleX = 3;
        rightScoreResult.scaleY = 3;
        this.addChild(rightScoreResult);

        GameMasterMindItemClass.soundEffect = new SoundEffects();
        GameMasterMindItemClass.soundEffect.setVolume(1);

        this.loadingEffect();
        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba ) {
            let returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            returnToLastButton.y = 19;
            this.addChild(returnToLastButton);
            returnToLastButton.touchEnabled = true;
            returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.popup("GameSureLeave");
            }, this);
        }

        App.MessageCenter.dispatch(EventMessage.GetQuestionsC2S, (data: any) => {
            GameMasterMindItemClass.Question = data;
            GameMasterMindItemClass.readyState[0] = 1;
            egret.startTick(this.readyTick, this);
            GameMasterMindEvent.MMMessagerCenter(GameMasterMindEvent.EVENT_GAMEREADY);
        })

        if (GameMasterMindItemClass.isOffline == true) {
            App.TimerManager.doTimer((Math.random() * 5), 1, () => {
                GameMasterMindItemClass.readyState = [1, 1];
            }, this);
        }

        if (this.stage.stageHeight < 1136) {
            GameMasterMindItemClass.multiple = (this.stage.stageHeight / 1136);
            this.scaleX = GameMasterMindItemClass.multiple;
            this.scaleY = GameMasterMindItemClass.multiple;
            let nowWidth = 640 * GameMasterMindItemClass.multiple;
            this.x = (640 - nowWidth) / 2;
        } else if (this.stage.stageHeight > 1136) {
            this.y = (this.stage.stageHeight - 1136) / 2;
        }
    }
}