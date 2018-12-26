class GameGoBallisticLogic {
    public static instance: GameGoBallisticLogic;
    public constructor() {
        GameGoBallisticLogic.instance = this;
    }

    public walkStartTick: number;
    public tauntStartTick: number;

    public dispose = () => {
        egret.clearInterval(this.walkStartTick);
        egret.clearInterval(this.tauntStartTick);
    }

    public bossCheckBoth = () => {
        // console.log("bossCheckBoth", GameGoBallisticItemClass.instance.bothState);
        // App.TimerManager.remove(GameGoBallisticLogic.instance.bossCheckBoth, GameGoBallisticLogic.instance);
        // if (GameGoBallisticItemClass.instance.isOffline == true) {
        //     GameGoBallisticArtificialts.instance.tauntSwitcher = false;
        //     GameGoBallisticArtificialts.instance.walkSwitcher = false;
        // }
        if (GameGoBallisticItemClass.instance == null || GameGoBallisticItemClass.instance.isRuning == false) {
            return;
        }

        if (GameGoBallisticItemClass.instance.bothState[0] == 1 && GameGoBallisticItemClass.instance.bothState[1] == 1) {
            this.DBCtrlor(2);
            // console.log("1,1 state!");
            if (GameGoBallisticItemClass.instance.isOffline == true) {
                GameGoBallisticArtificialts.instance.walkSwitcher = false;
                this.walkStartTick = egret.setInterval(() => {
                    if (GameGoBallisticItemClass.instance == null || GameGoBallisticItemClass.instance.isRuning == false) {
                        return;
                    }
                    if (GameGoBallisticItemClass.instance.state == 0) {
                        egret.clearInterval(this.walkStartTick);
                        GameGoBallisticArtificialts.instance.walkSwitcher = true;
                    }
                }, GameGoBallisticLogic.instance, 50);
            }
        } else if (GameGoBallisticItemClass.instance.bothState[0] == 0 && GameGoBallisticItemClass.instance.bothState[1] == 1) {
            this.DBCtrlor(4);
            // console.log("0,1 state!");
            GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = true;
            if (GameGoBallisticItemClass.instance.isOffline == true) {
                GameGoBallisticArtificialts.instance.walkSwitcher = false;
                this.walkStartTick = egret.setInterval(() => {
                    if (GameGoBallisticItemClass.instance == null || GameGoBallisticItemClass.instance.isRuning == false) {
                        return;
                    }
                    if (GameGoBallisticItemClass.instance.state == 0) {
                        egret.clearInterval(this.walkStartTick);
                        if (GameGoBallisticItemClass.instance.isOffline == true) {
                            GameGoBallisticArtificialts.instance.walkSwitcher = true;
                        }
                        GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
                    }
                }, GameGoBallisticLogic.instance, 50);
            }
        } else if (GameGoBallisticItemClass.instance.bothState[0] == 1 && GameGoBallisticItemClass.instance.bothState[1] == 0) {
            this.DBCtrlor(3);
            // console.log("1,0 state!");

            if (GameGoBallisticItemClass.instance.isOffline == true) {
                GameGoBallisticArtificialts.instance.tauntSwitcher = true;
            }

            this.tauntStartTick = egret.setInterval(() => {
                if (GameGoBallisticItemClass.instance == null || GameGoBallisticItemClass.instance.isRuning == false) {
                    return;
                }
                if (GameGoBallisticItemClass.instance.state == 0) {
                    egret.clearInterval(this.tauntStartTick);
                    if (GameGoBallisticItemClass.instance.isOffline == true) {
                        GameGoBallisticArtificialts.instance.tauntSwitcher = false;
                        GameGoBallisticArtificialts.instance.walkSwitcher = true;
                    }
                    GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
                }
            }, GameGoBallisticLogic.instance, 50);
        }
        // else if (GameGoBallisticItemClass.instance.bothState[0] == 0 && GameGoBallisticItemClass.instance.bothState[1] == 0) {
        //     if (GameGoBallisticItemClass.instance.isOffline == true) {
        //         App.TimerManager.doTimer(GameGoBallisticArtificialts.instance.clickInterval, 0, GameGoBallisticArtificialts.instance.walk, GameGoBallisticArtificialts.instance);
        //     }
        // }
    }

    public taunt = (who: number) => {
        let item: Gob_role;
        let _item: Gob_role;
        switch (who) {
            case 0:
                item = GameGoBallisticItemClass.instance.roleBlue;
                _item = GameGoBallisticItemClass.instance.roleRed;
                if (GameGoBallisticItemClass.instance.redScore >= 2) {
                    GameGoBallisticItemClass.instance.redScore -= 2;
                } else {
                    GameGoBallisticItemClass.instance.redScore = 0;
                }
                GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                break;
            case 1:
                item = GameGoBallisticItemClass.instance.roleRed;
                _item = GameGoBallisticItemClass.instance.roleBlue;
                if (GameGoBallisticItemClass.instance.blueScore >= 2) {
                    GameGoBallisticItemClass.instance.blueScore -= 2;
                } else {
                    GameGoBallisticItemClass.instance.blueScore = 0;
                }
                GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                break;
        }

        item.taunt();
        _item.behit();

        switch (who) {
            case 0:
                let newBlueItem = new flyingItem("red");
                break;
            case 1:
                let newRedItem = new flyingItem("blue");
                break;
        }
    }

    public walking = (who: number) => {
        let item: Gob_role;
        switch (who) {
            case 0:
                item = GameGoBallisticItemClass.instance.roleBlue;
                break;
            case 1:
                item = GameGoBallisticItemClass.instance.roleRed;
                break;
        }

        switch (GameGoBallisticItemClass.instance.state) {
            case 0:
                switch (who) {
                    case 0:
                        if (GameGoBallisticItemClass.instance.blueScore >= 170 && GameGoBallisticItemClass.instance.blueScore < 200) {
                            item.quickWalk();
                            GameGoBallisticItemClass.instance.blueScore += 1;
                        } else if (GameGoBallisticItemClass.instance.blueScore < 200) {
                            item.normalWalk();
                            GameGoBallisticItemClass.instance.blueScore += 1;
                        }
                        GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                        if (GameGoBallisticItemClass.instance.blueScore >= 200) {
                            GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
                            GameGoBallisticMainScene.instance.Gob_btn_showoff.touchEnabled = false;
                            this.gameOver(3);
                        }
                        break;
                    case 1:
                        if (GameGoBallisticItemClass.instance.redScore >= 170 && GameGoBallisticItemClass.instance.redScore < 200) {
                            item.quickWalk();
                            GameGoBallisticItemClass.instance.redScore += 1;
                        } else if (GameGoBallisticItemClass.instance.redScore < 200) {
                            item.normalWalk();
                            GameGoBallisticItemClass.instance.redScore += 1;
                        }
                        GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                        if (GameGoBallisticItemClass.instance.redScore >= 200) {
                            GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
                            GameGoBallisticMainScene.instance.Gob_btn_showoff.touchEnabled = false;
                            this.gameOver(1);
                        }
                        break;
                }
                break;
            case 1:
                GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
                App.TimerManager.remove(GameGoBallisticLogic.instance.gamingTick, GameGoBallisticMainScene.instance);

                App.TimerManager.doTimer(200, 1, () => {
                    if (GameGoBallisticItemClass.instance.isRuning == false) {
                        return;
                    }
                    GameGoBallisticLogic.instance.bossCheckBoth();
                }, GameGoBallisticLogic.instance);

                switch (who) {
                    case 0:
                        GameGoBallisticItemClass.instance.bothState[0] = 1;
                        App.TimerManager.remove(this.blueReset, GameGoBallisticLogic.instance);
                        App.TimerManager.doTimer(2000, 1, this.blueReset, GameGoBallisticLogic.instance);
                        break;
                    case 1:
                        GameGoBallisticItemClass.instance.bothState[1] = 1;
                        App.TimerManager.remove(this.redReset, GameGoBallisticLogic.instance);
                        App.TimerManager.doTimer(2000, 1, this.redReset, GameGoBallisticLogic.instance);
                        break;
                }

                item.dumbfounded();

                App.TimerManager.doTimer(1000, 1, () => {
                    if (GameGoBallisticItemClass.instance.isRuning == false) {
                        return;
                    }
                    App.TimerManager.doTimer(1000, 0, GameGoBallisticLogic.instance.gamingTick, GameGoBallisticMainScene.instance);
                }, GameGoBallisticLogic.instance);

                App.TimerManager.doTimer(1950, 1, () => {
                    if (GameGoBallisticItemClass.instance.isRuning == false) {
                        return;
                    }
                    GameGoBallisticItemClass.instance.state = 0;
                    GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
                    GameGoBallisticItemClass.instance.roleBlue.reset2normal();
                    GameGoBallisticItemClass.instance.roleRed.reset2normal();
                }, GameGoBallisticLogic.instance);
                break;
        }
    }

    public blueReset = () => {
        if (GameGoBallisticItemClass.instance.isRuning == false) {
            return;
        }
        GameGoBallisticItemClass.instance.roleBlue.reset2normal();
        GameGoBallisticMainScene.instance.Gob_btn_run.visible = true;
        GameGoBallisticItemClass.instance.bothState[0] = 0;
    }

    public redReset = () => {
        if (GameGoBallisticItemClass.instance.isRuning == false) {
            return;
        }
        GameGoBallisticItemClass.instance.roleRed.reset2normal();
        GameGoBallisticMainScene.instance.Gob_btn_run.visible = true;
        GameGoBallisticItemClass.instance.bothState[1] = 0;
    }

    public gameOver(result: number): void {
        GameGoBallisticLogic.instance.dispose();
        GameGoBallisticItemClass.instance.stopSoundEffect.setVolume(0);
        GameGoBallisticItemClass.instance.roleBlue.soundChannel1.setVolume(0);
        GameGoBallisticItemClass.instance.roleRed.soundChannel1.setVolume(0);
        App.MessageCenter.removeListener("local", GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);

        GameGoBallisticMainScene.instance.Gob_btn_run.alpha = 0;
        GameGoBallisticMainScene.instance.Gob_btn_showoff.alpha = 0;
        App.TimerManager.remove(GameGoBallisticLogic.instance.bossCheckBoth, GameGoBallisticLogic.instance);

        if (GameGoBallisticItemClass.instance.isOffline == true) {
            GameGoBallisticArtificialts.instance.tauntSwitcher = false;
            GameGoBallisticArtificialts.instance.walkSwitcher = false;
            App.TimerManager.remove(GameGoBallisticArtificialts.instance.taunt, GameGoBallisticArtificialts.instance)
            App.TimerManager.remove(GameGoBallisticArtificialts.instance.walk, GameGoBallisticArtificialts.instance)
        }

        App.TimerManager.removeAll(GameGoBallisticArtificialts.instance);
        GameGoBallisticItemClass.instance.roleBoss.visible = false;
        GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
        GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
        this.DBCtrlor(6);
        App.TimerManager.removeAll(GameGoBallisticLogic.instance);
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    public btnRunClick = () => {
        GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
        GameGoBallisticEventClass.instance.messageCenter(GameGoBallisticEventClass.instance.GOB_EVENT_WALK);
        App.TimerManager.doTimer(80, 1, () => {
            if (GameGoBallisticItemClass.instance.isRuning == false) {
                return;
            }
            GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = true;
        }, GameGoBallisticLogic.instance)
    }

    public btnShowoffClick = () => {
        GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
        GameGoBallisticEventClass.instance.messageCenter(GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT);
        App.TimerManager.doTimer(80, 1, () => {
            if (GameGoBallisticItemClass.instance.isRuning == false) {
                return;
            }
            GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = true;
        }, GameGoBallisticLogic.instance)
    }

    public readyTick = () => {
        if (GameGoBallisticItemClass.instance.isOffline == false) {
            if (GameGoBallisticItemClass.instance.readyState[0] == 1 && GameGoBallisticItemClass.instance.readyState[1] == 1) {
                GameGoBallisticItemClass.instance.readyState[0] = 0;
                GameGoBallisticItemClass.instance.readyState[1] = 0;
                egret.stopTick(GameGoBallisticLogic.instance.readyTick, GameGoBallisticMainScene.instance);
                GameGoBallisticMainScene.instance.gameRdy();
                return false;
            }
        } else if (GameGoBallisticItemClass.instance.isOffline == true) {
            egret.stopTick(GameGoBallisticLogic.instance.readyTick, GameGoBallisticMainScene.instance);
            App.TimerManager.doTimer(2345, 1, () => {
                if (GameGoBallisticItemClass.instance.isRuning == false) {
                    return;
                }
                GameGoBallisticMainScene.instance.gameRdy();
            }, this);
        }

        return false;
    }

    public gamingTick = () => {
        if (GameGoBallisticItemClass.instance.isRuning == false) {
            return;
        }
        let ran = GameGoBallisticMainScene.instance.random();
        if (ran > 0 && ran < 0.75) {
            GameGoBallisticMainScene.instance.Gob_group_boss.visible = true;
            GameGoBallisticItemClass.instance.state = 0;
            GameGoBallisticMainScene.instance.Img_stop.visible = false;
            this.DBCtrlor(0);
        } else if (ran >= 0.75 && ran <= 1) {
            GameGoBallisticMainScene.instance.Gob_group_boss.visible = true;
            GameGoBallisticItemClass.instance.state = 1;
            GameGoBallisticMainScene.instance.Img_stop.visible = true;
            GameGoBallisticItemClass.instance.stopSoundEffect.play("Gob_stop_mp3", true);
            if (GameGoBallisticItemClass.instance.isOffline == true) {
                if (Math.random() > GameGoBallisticArtificialts.instance.mistake) {
                    App.TimerManager.doTimer(100, 1, () => {
                        if (GameGoBallisticItemClass.instance.isRuning == false) {
                            return;
                        }
                        this.walking(1);
                    }, GameGoBallisticArtificialts.instance)
                } else {
                    GameGoBallisticArtificialts.instance.walkSwitcher = false;
                }
            }
            this.DBCtrlor(5);
        }
    }

    /**
     * 0-normal, 1-quick, 2-pointAll, 3-pointLeft, 4-pointRight, 5-censure, 6-stop
     */
    public DBCtrlor = (state: number) => {
        switch (state) {
            case 0:
                GameGoBallisticItemClass.instance.roleBoss.stop();
                GameGoBallisticItemClass.instance.roleBoss.play("normal", 0);
                break;
            case 1:
                GameGoBallisticItemClass.instance.roleBoss.stop();
                GameGoBallisticItemClass.instance.roleBoss.play("quick", 0);
                break;
            case 2:
                GameGoBallisticItemClass.instance.roleBoss.stop();
                GameGoBallisticItemClass.instance.roleBoss.play("pointAll", 0);
                break;
            case 3:
                GameGoBallisticItemClass.instance.roleBoss.stop();
                GameGoBallisticItemClass.instance.roleBoss.play("pointLeft", 0);
                break;
            case 4:
                GameGoBallisticItemClass.instance.roleBoss.stop();
                GameGoBallisticItemClass.instance.roleBoss.play("pointRight", 0);
                break;
            case 5:
                GameGoBallisticItemClass.instance.roleBoss.stop();
                GameGoBallisticItemClass.instance.roleBoss.play("point", 0);
                break;
            case 6:
                GameGoBallisticItemClass.instance.roleBoss.stop();
                break;
        }
    }
}