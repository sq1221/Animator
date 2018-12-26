var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameGoBallisticArtificialts = (function () {
    function GameGoBallisticArtificialts() {
        var _this = this;
        this.walkSwitcher = true;
        this.tauntSwitcher = false;
        this.walk = function () {
            if (GameGoBallisticItemClass.instance.isRuning == false || _this.walkSwitcher == false) {
                return;
            }
            App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_WALK + "|l");
        };
        this.taunt = function () {
            if (GameGoBallisticItemClass.instance.isRuning == false || _this.tauntSwitcher == false) {
                return;
            }
            App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT + "|l");
        };
        GameGoBallisticArtificialts.instance = this;
        if (App.IsXiaoMi) {
            var conf = GameGoBallisticMainScene.instance.AiConf[App.CurrGameAiLevel];
            console.log(">>>>> conf: ", conf.n, conf.x, conf.m);
            this.clickInterval = App.RandomUtils.limitInteger(conf.n, conf.x);
            this.mistake = conf.m;
        }
        else {
            switch (App.CurrGameAiLevel) {
                case 1:
                    this.clickInterval = App.RandomUtils.limitInteger(200, 220);
                    this.mistake = 0.1;
                    break;
                case 2:
                    this.clickInterval = App.RandomUtils.limitInteger(180, 200);
                    this.mistake = 0.2;
                    break;
                case 3:
                    this.clickInterval = App.RandomUtils.limitInteger(160, 175);
                    this.mistake = 0.4;
                    break;
                case 4:
                    this.clickInterval = App.RandomUtils.limitInteger(130, 150);
                    this.mistake = 0.7;
                    break;
                case 5:
                    this.clickInterval = App.RandomUtils.limitInteger(100, 110);
                    this.mistake = 1;
                    break;
            }
        }
    }
    return GameGoBallisticArtificialts;
}());
__reflect(GameGoBallisticArtificialts.prototype, "GameGoBallisticArtificialts");
var Gob_role = (function (_super) {
    __extends(Gob_role, _super);
    function Gob_role(color) {
        var _this = _super.call(this) || this;
        _this.scale = 0.00425; // // (1 - 0.29) / 200;
        _this.localPosNum = 0;
        _this.nCounter = 0;
        _this.qCounter = 0;
        _this.wCounter = 1;
        _this.tCounter = 1;
        _this.walkType = ["_walk1", "_walk2"];
        _this.soundChannel1 = new SoundEffects();
        _this.numManager = function (counter) {
            switch (counter) {
                case "nCounter":
                    if (_this.nCounter >= 2) {
                        _this.nCounter = 0;
                    }
                    else {
                        _this.nCounter += 1;
                    }
                    return _this.nCounter;
                case "qCounter":
                    if (_this.qCounter >= 2) {
                        _this.qCounter = 0;
                    }
                    else {
                        _this.qCounter += 1;
                    }
                    return _this.qCounter;
                case "wCounter":
                    if (_this.wCounter == 1) {
                        _this.wCounter = 2;
                    }
                    else if (_this.wCounter == 2) {
                        _this.wCounter = 1;
                    }
                    return _this.wCounter;
                case "tCounter":
                    if (_this.tCounter == 1) {
                        _this.tCounter = 2;
                    }
                    else if (_this.tCounter == 2) {
                        _this.tCounter = 1;
                    }
                    return _this.tCounter;
            }
        };
        _this.normalWalk = function () {
            _this.source = "Gob_role" + _this.color + App.RandomUtils.randomArray(_this.walkType) + _this.numManager("nCounter") + "_png";
            if (_this.scaleX > 1) {
                return;
            }
            _this.x += _this.xSBS;
            _this.y += _this.ySBS;
            _this.scaleX += _this.scale;
            _this.scaleY += _this.scale;
        };
        _this.reset2normal = function () {
            _this.source = "Gob_role" + _this.color + "_walk1" + _this.nCounter.toString() + "_png";
        };
        _this.reset2dumbfounded = function () {
            _this.source = "Gob_role" + _this.color + "_dumbfounded_png";
        };
        _this.taunt = function () {
            if (_this.color == "Blue") {
                _this.soundChannel1.play("Gob_showOff_mp3");
            }
            _this.source = "Gob_role" + _this.color + "_taunt" + _this.numManager("tCounter") + "_png";
        };
        _this.dumbfounded = function () {
            App.TimerManager.remove(_this.reset2normal, _this);
            _this.source = "Gob_role" + _this.color + "_dumbfounded_png";
        };
        _this.quickWalk = function () {
            _this.source = "Gob_role" + _this.color + "_qwalk" + _this.numManager("qCounter") + "_png";
            if (_this.scaleX > 1) {
                return;
            }
            _this.x += _this.xSBS;
            _this.y += _this.ySBS;
            _this.scaleX += _this.scale;
            _this.scaleY += _this.scale;
            // if (this.scaleX < 1) {
            //     let tw = egret.Tween.get(this);
            //     tw.to({
            //         x: this.x + this.xSBS, y: this.y + this.ySBS,
            //         scaleX: this.scaleX + this.scale, scaleY: this.scaleY + this.scale
            //     }, 75).call(() => {
            //         tw = null;
            //     });
            // }
        };
        _this.win = function () {
            App.TimerManager.doTimer(500, 0, function () {
                try {
                    _this.source = "Gob_role" + _this.color + "_win" + _this.numManager("wCounter") + "_png";
                }
                catch (e) {
                    console.log(e);
                }
            }, _this);
        };
        _this.behit = function () {
            if (_this.color == "Blue") {
                _this.soundChannel1.play("Gob_jeer_mp3");
            }
            App.TimerManager.remove(_this.reset2dumbfounded, _this);
            App.TimerManager.doTimer(120, 1, _this.reset2dumbfounded, _this);
            _this.source = "Gob_role" + _this.color + "_behit_png";
            if (_this.scaleX < 0.15) {
                return;
            }
            _this.x -= 2 * _this.xSBS;
            _this.y -= 2 * _this.ySBS;
            _this.scaleX -= 2 * _this.scale;
            _this.scaleY -= 2 * _this.scale;
            // let tw = egret.Tween.get(this);
            // tw.to({
            //     x: this.x - this.xSBS, y: this.y - this.ySBS,
            //     scaleX: this.scaleX - this.scale, scaleY: this.scaleY - this.scale
            // }, 75).call(() => {
            //     tw = null;
            // });
        };
        _this.dispose = function () {
            App.TimerManager.removeAll(_this);
        };
        _this.soundChannel1.setVolume(0.7);
        switch (color) {
            case "Red":
                _this.source = "Gob_roleRed_stand_png";
                _this.x = 340;
                _this.xSBS = 0.645;
                break;
            case "Blue":
                _this.source = "Gob_roleBlue_stand_png";
                _this.x = 300;
                _this.xSBS = -0.685;
                break;
        }
        _this.color = color;
        _this.ySBS = 2.415;
        _this.y = 374;
        _this.anchorOffsetX = 194.5;
        _this.anchorOffsetY = 556;
        _this.scaleX = 0.15;
        _this.scaleY = 0.15;
        return _this;
    }
    return Gob_role;
}(eui.Image));
__reflect(Gob_role.prototype, "Gob_role");
var flyingItem = (function (_super) {
    __extends(flyingItem, _super);
    function flyingItem(who) {
        var _this = _super.call(this) || this;
        _this.soundChannel = new SoundEffects();
        _this.itemClass = ["Gob_item_book1_png", "Gob_item_book2_png", "Gob_item_book3_png", "Gob_item_book4_png", "Gob_item_eraser1_png", "Gob_item_eraser2_png", "Gob_item_eraser3_png", "Gob_item_eraser4_png"];
        _this.soundChannel.setVolume(0.7);
        _this.source = App.RandomUtils.randomArray(_this.itemClass);
        _this.anchorOffsetX = _this.width * 0.5;
        _this.anchorOffsetY = _this.height * 0.5;
        _this.rotation = App.RandomUtils.limitInteger(0, 360);
        _this.x = 320;
        _this.y = 800;
        GameGoBallisticMainScene.instance.Gob_group_flyingItem.addChild(_this);
        var tw = egret.Tween.get(_this);
        switch (who) {
            case "blue":
                tw.to({ x: GameGoBallisticItemClass.instance.roleBlue.x, y: GameGoBallisticItemClass.instance.roleBlue.y - 0.2 * GameGoBallisticItemClass.instance.roleBlue.height, scaleX: GameGoBallisticItemClass.instance.roleBlue.scaleX, scaleY: GameGoBallisticItemClass.instance.roleBlue.scaleY }, 120);
                break;
            case "red":
                tw.to({ x: GameGoBallisticItemClass.instance.roleRed.x, y: GameGoBallisticItemClass.instance.roleRed.y - 0.2 * GameGoBallisticItemClass.instance.roleRed.height, scaleX: GameGoBallisticItemClass.instance.roleRed.scaleX, scaleY: GameGoBallisticItemClass.instance.roleRed.scaleY }, 120);
                break;
        }
        tw.call(function () {
            _this.soundChannel.play("Gob_beHit_mp3");
            GameGoBallisticMainScene.instance.Gob_group_flyingItem.removeChild(_this);
            tw = null;
        });
        return _this;
    }
    return flyingItem;
}(eui.Image));
__reflect(flyingItem.prototype, "flyingItem");
var GameGoBallisticEventClass = (function () {
    function GameGoBallisticEventClass() {
        this.GOB_EVENT_READY = "r";
        this.GOB_EVENT_WALK = "w";
        this.GOB_EVENT_TAUNT = "t";
        this.GOB_EVENT_DUMBFOUNDED = "d";
        this.GOB_EVENT_SCORE = "s";
        this.messageCenter = function (msg, extra) {
            // if (DataCenter.instance.room.IsAI) {
            //     return;
            // }
            if (extra === void 0) { extra = ""; }
            switch (msg) {
                case GameGoBallisticEventClass.instance.GOB_EVENT_READY:
                    switch (GameGoBallisticItemClass.instance.isOffline) {
                        case false:
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_READY, 1);
                            break;
                    }
                    break;
                case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                    switch (GameGoBallisticItemClass.instance.isOffline) {
                        case true:
                            App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_WALK + "|m");
                            break;
                        case false:
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_WALK + "|" + (GameGoBallisticItemClass.instance.blueScore + 1).toString() + "|" + GameGoBallisticItemClass.instance.redScore, 1);
                            break;
                    }
                    break;
                case GameGoBallisticEventClass.instance.GOB_EVENT_DUMBFOUNDED:
                    switch (GameGoBallisticItemClass.instance.isOffline) {
                        case true:
                            App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_DUMBFOUNDED + "|m");
                            break;
                        case false:
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_DUMBFOUNDED, 1);
                            break;
                    }
                    break;
                case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                    switch (GameGoBallisticItemClass.instance.isOffline) {
                        case true:
                            App.MessageCenter.dispatch("local", GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT + "|m");
                            break;
                        case false:
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT + "|" + GameGoBallisticItemClass.instance.blueScore + "|" + (GameGoBallisticItemClass.instance.redScore - 2).toString(), 1);
                            break;
                    }
                    break;
                default:
                    console.log("illegal messageCenter msg!!!");
                    break;
            }
        };
        this.messageDeal = function (data) {
            var cmdString;
            switch (GameGoBallisticItemClass.instance.isOffline) {
                case true:
                    cmdString = data.split("|");
                    break;
                case false:
                    cmdString = data.event.split("|");
                    break;
            }
            if (GameGoBallisticItemClass.instance.isOffline == true) {
                if (cmdString[1] == "l") {
                    switch (cmdString[0]) {
                        case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                            GameGoBallisticLogic.instance.walking(1);
                            break;
                        case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                            GameGoBallisticLogic.instance.taunt(1);
                            break;
                    }
                }
                else if (cmdString[1] == "m") {
                    switch (cmdString[0]) {
                        case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                            GameGoBallisticLogic.instance.walking(0);
                            break;
                        case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                            GameGoBallisticLogic.instance.taunt(0);
                            break;
                    }
                }
            }
            else {
                switch (cmdString[0]) {
                    case GameGoBallisticEventClass.instance.GOB_EVENT_READY:
                        switch (data.userId.toString()) {
                            case DataCenter.instance.user.id.toString():
                                GameGoBallisticItemClass.instance.readyState[0] = 1;
                                break;
                            case DataCenter.instance.room.player.id.toString():
                                GameGoBallisticItemClass.instance.readyState[1] = 1;
                                break;
                        }
                        break;
                    case GameGoBallisticEventClass.instance.GOB_EVENT_WALK:
                        switch (data.userId.toString()) {
                            case DataCenter.instance.user.id.toString():
                                GameGoBallisticLogic.instance.walking(0);
                                break;
                            case DataCenter.instance.room.player.id.toString():
                                GameGoBallisticLogic.instance.walking(1);
                                if (parseInt(cmdString[1]) != GameGoBallisticItemClass.instance.redScore) {
                                    GameGoBallisticItemClass.instance.redScore = parseInt(cmdString[1]);
                                    GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                                }
                                if (parseInt(cmdString[2]) != GameGoBallisticItemClass.instance.blueScore) {
                                    GameGoBallisticItemClass.instance.blueScore = parseInt(cmdString[2]);
                                    GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                                }
                                break;
                        }
                        break;
                    case GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT:
                        switch (data.userId.toString()) {
                            case DataCenter.instance.user.id.toString():
                                GameGoBallisticLogic.instance.taunt(0);
                                break;
                            case DataCenter.instance.room.player.id.toString():
                                GameGoBallisticLogic.instance.taunt(1);
                                if (parseInt(cmdString[1]) != GameGoBallisticItemClass.instance.redScore) {
                                    GameGoBallisticItemClass.instance.redScore = parseInt(cmdString[1]);
                                    GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                                }
                                if (parseInt(cmdString[2]) != GameGoBallisticItemClass.instance.blueScore) {
                                    GameGoBallisticItemClass.instance.blueScore = parseInt(cmdString[2]);
                                    GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                                }
                                break;
                        }
                        break;
                }
            }
        };
        this.resultDeal = function (data) {
            egret.clearInterval(GameGoBallisticLogic.instance.walkStartTick);
            egret.clearInterval(GameGoBallisticLogic.instance.tauntStartTick);
            GameGoBallisticItemClass.instance.isRuning = false;
            GameGoBallisticItemClass.instance.stopSoundEffect.setVolume(0);
            GameGoBallisticItemClass.instance.roleBlue.soundChannel1.setVolume(0);
            GameGoBallisticItemClass.instance.roleRed.soundChannel1.setVolume(0);
            App.MessageCenter.removeListener("local", GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);
            GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
            GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
            GameGoBallisticMainScene.instance.Gob_btn_run.alpha = 0;
            GameGoBallisticMainScene.instance.Gob_btn_showoff.alpha = 0;
            App.TimerManager.remove(GameGoBallisticLogic.instance.bossCheckBoth, GameGoBallisticLogic.instance);
            if (GameGoBallisticItemClass.instance.isOffline == true) {
                GameGoBallisticArtificialts.instance.tauntSwitcher = false;
                GameGoBallisticArtificialts.instance.walkSwitcher = false;
                App.TimerManager.remove(GameGoBallisticArtificialts.instance.taunt, GameGoBallisticArtificialts.instance);
                App.TimerManager.remove(GameGoBallisticArtificialts.instance.walk, GameGoBallisticArtificialts.instance);
            }
            GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
            GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
            App.TimerManager.removeAll(GameGoBallisticLogic.instance);
            egret.Tween.removeAllTweens();
            GameGoBallisticLogic.instance.DBCtrlor(6);
            if (data.winUserId.toString() == DataCenter.instance.user.id.toString()) {
                GameGoBallisticMainScene.instance.showResult(3);
            }
            else {
                GameGoBallisticMainScene.instance.showResult(1);
            }
            App.TimerManager.doTimer(2000, 1, function () {
                // 弹出结果面板
                DataCenter.instance.room.gameResult = data;
                // 发送游戏结果
                GameGoBallisticMainScene.instance.popup("GameResult", null);
            }, GameGoBallisticMainScene.instance);
        };
        GameGoBallisticEventClass.instance = this;
    }
    return GameGoBallisticEventClass;
}());
__reflect(GameGoBallisticEventClass.prototype, "GameGoBallisticEventClass");
var GameGoBallisticItemClass = (function () {
    function GameGoBallisticItemClass() {
        this.state = 0; // 0 BOSS藏可，1 BOSS慢动可，2 BOSS快动可，4 BOSS停不可
        this.blueScore = 0;
        this.redScore = 0;
        this.readyState = [0, 0];
        this.bothState = [0, 0];
        this.isOffline = false;
        this.multiple = 1;
        this.stopSoundEffect = new SoundEffects();
        this.isRuning = false;
        GameGoBallisticItemClass.instance = this;
        this.stopSoundEffect.setVolume(0.7);
    }
    return GameGoBallisticItemClass;
}());
__reflect(GameGoBallisticItemClass.prototype, "GameGoBallisticItemClass");
var GameGoBallisticLogic = (function () {
    function GameGoBallisticLogic() {
        var _this = this;
        this.dispose = function () {
            egret.clearInterval(_this.walkStartTick);
            egret.clearInterval(_this.tauntStartTick);
        };
        this.bossCheckBoth = function () {
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
                _this.DBCtrlor(2);
                // console.log("1,1 state!");
                if (GameGoBallisticItemClass.instance.isOffline == true) {
                    GameGoBallisticArtificialts.instance.walkSwitcher = false;
                    _this.walkStartTick = egret.setInterval(function () {
                        if (GameGoBallisticItemClass.instance == null || GameGoBallisticItemClass.instance.isRuning == false) {
                            return;
                        }
                        if (GameGoBallisticItemClass.instance.state == 0) {
                            egret.clearInterval(_this.walkStartTick);
                            GameGoBallisticArtificialts.instance.walkSwitcher = true;
                        }
                    }, GameGoBallisticLogic.instance, 50);
                }
            }
            else if (GameGoBallisticItemClass.instance.bothState[0] == 0 && GameGoBallisticItemClass.instance.bothState[1] == 1) {
                _this.DBCtrlor(4);
                // console.log("0,1 state!");
                GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = true;
                if (GameGoBallisticItemClass.instance.isOffline == true) {
                    GameGoBallisticArtificialts.instance.walkSwitcher = false;
                    _this.walkStartTick = egret.setInterval(function () {
                        if (GameGoBallisticItemClass.instance == null || GameGoBallisticItemClass.instance.isRuning == false) {
                            return;
                        }
                        if (GameGoBallisticItemClass.instance.state == 0) {
                            egret.clearInterval(_this.walkStartTick);
                            if (GameGoBallisticItemClass.instance.isOffline == true) {
                                GameGoBallisticArtificialts.instance.walkSwitcher = true;
                            }
                            GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
                        }
                    }, GameGoBallisticLogic.instance, 50);
                }
            }
            else if (GameGoBallisticItemClass.instance.bothState[0] == 1 && GameGoBallisticItemClass.instance.bothState[1] == 0) {
                _this.DBCtrlor(3);
                // console.log("1,0 state!");
                if (GameGoBallisticItemClass.instance.isOffline == true) {
                    GameGoBallisticArtificialts.instance.tauntSwitcher = true;
                }
                _this.tauntStartTick = egret.setInterval(function () {
                    if (GameGoBallisticItemClass.instance == null || GameGoBallisticItemClass.instance.isRuning == false) {
                        return;
                    }
                    if (GameGoBallisticItemClass.instance.state == 0) {
                        egret.clearInterval(_this.tauntStartTick);
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
        };
        this.taunt = function (who) {
            var item;
            var _item;
            switch (who) {
                case 0:
                    item = GameGoBallisticItemClass.instance.roleBlue;
                    _item = GameGoBallisticItemClass.instance.roleRed;
                    if (GameGoBallisticItemClass.instance.redScore >= 2) {
                        GameGoBallisticItemClass.instance.redScore -= 2;
                    }
                    else {
                        GameGoBallisticItemClass.instance.redScore = 0;
                    }
                    GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                    break;
                case 1:
                    item = GameGoBallisticItemClass.instance.roleRed;
                    _item = GameGoBallisticItemClass.instance.roleBlue;
                    if (GameGoBallisticItemClass.instance.blueScore >= 2) {
                        GameGoBallisticItemClass.instance.blueScore -= 2;
                    }
                    else {
                        GameGoBallisticItemClass.instance.blueScore = 0;
                    }
                    GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                    break;
            }
            item.taunt();
            _item.behit();
            switch (who) {
                case 0:
                    var newBlueItem = new flyingItem("red");
                    break;
                case 1:
                    var newRedItem = new flyingItem("blue");
                    break;
            }
        };
        this.walking = function (who) {
            var item;
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
                            }
                            else if (GameGoBallisticItemClass.instance.blueScore < 200) {
                                item.normalWalk();
                                GameGoBallisticItemClass.instance.blueScore += 1;
                            }
                            GameGoBallisticMainScene.instance.Label_blueScore.text = GameGoBallisticItemClass.instance.blueScore.toString();
                            if (GameGoBallisticItemClass.instance.blueScore >= 200) {
                                GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
                                GameGoBallisticMainScene.instance.Gob_btn_showoff.touchEnabled = false;
                                _this.gameOver(3);
                            }
                            break;
                        case 1:
                            if (GameGoBallisticItemClass.instance.redScore >= 170 && GameGoBallisticItemClass.instance.redScore < 200) {
                                item.quickWalk();
                                GameGoBallisticItemClass.instance.redScore += 1;
                            }
                            else if (GameGoBallisticItemClass.instance.redScore < 200) {
                                item.normalWalk();
                                GameGoBallisticItemClass.instance.redScore += 1;
                            }
                            GameGoBallisticMainScene.instance.Label_redScore.text = GameGoBallisticItemClass.instance.redScore.toString();
                            if (GameGoBallisticItemClass.instance.redScore >= 200) {
                                GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
                                GameGoBallisticMainScene.instance.Gob_btn_showoff.touchEnabled = false;
                                _this.gameOver(1);
                            }
                            break;
                    }
                    break;
                case 1:
                    GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
                    App.TimerManager.remove(GameGoBallisticLogic.instance.gamingTick, GameGoBallisticMainScene.instance);
                    App.TimerManager.doTimer(200, 1, function () {
                        if (GameGoBallisticItemClass.instance.isRuning == false) {
                            return;
                        }
                        GameGoBallisticLogic.instance.bossCheckBoth();
                    }, GameGoBallisticLogic.instance);
                    switch (who) {
                        case 0:
                            GameGoBallisticItemClass.instance.bothState[0] = 1;
                            App.TimerManager.remove(_this.blueReset, GameGoBallisticLogic.instance);
                            App.TimerManager.doTimer(2000, 1, _this.blueReset, GameGoBallisticLogic.instance);
                            break;
                        case 1:
                            GameGoBallisticItemClass.instance.bothState[1] = 1;
                            App.TimerManager.remove(_this.redReset, GameGoBallisticLogic.instance);
                            App.TimerManager.doTimer(2000, 1, _this.redReset, GameGoBallisticLogic.instance);
                            break;
                    }
                    item.dumbfounded();
                    App.TimerManager.doTimer(1000, 1, function () {
                        if (GameGoBallisticItemClass.instance.isRuning == false) {
                            return;
                        }
                        App.TimerManager.doTimer(1000, 0, GameGoBallisticLogic.instance.gamingTick, GameGoBallisticMainScene.instance);
                    }, GameGoBallisticLogic.instance);
                    App.TimerManager.doTimer(1950, 1, function () {
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
        };
        this.blueReset = function () {
            if (GameGoBallisticItemClass.instance.isRuning == false) {
                return;
            }
            GameGoBallisticItemClass.instance.roleBlue.reset2normal();
            GameGoBallisticMainScene.instance.Gob_btn_run.visible = true;
            GameGoBallisticItemClass.instance.bothState[0] = 0;
        };
        this.redReset = function () {
            if (GameGoBallisticItemClass.instance.isRuning == false) {
                return;
            }
            GameGoBallisticItemClass.instance.roleRed.reset2normal();
            GameGoBallisticMainScene.instance.Gob_btn_run.visible = true;
            GameGoBallisticItemClass.instance.bothState[1] = 0;
        };
        this.btnRunClick = function () {
            GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
            GameGoBallisticEventClass.instance.messageCenter(GameGoBallisticEventClass.instance.GOB_EVENT_WALK);
            App.TimerManager.doTimer(80, 1, function () {
                if (GameGoBallisticItemClass.instance.isRuning == false) {
                    return;
                }
                GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = true;
            }, GameGoBallisticLogic.instance);
        };
        this.btnShowoffClick = function () {
            GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = false;
            GameGoBallisticEventClass.instance.messageCenter(GameGoBallisticEventClass.instance.GOB_EVENT_TAUNT);
            App.TimerManager.doTimer(80, 1, function () {
                if (GameGoBallisticItemClass.instance.isRuning == false) {
                    return;
                }
                GameGoBallisticMainScene.instance.Gob_btn_run.touchEnabled = true;
            }, GameGoBallisticLogic.instance);
        };
        this.readyTick = function () {
            if (GameGoBallisticItemClass.instance.isOffline == false) {
                if (GameGoBallisticItemClass.instance.readyState[0] == 1 && GameGoBallisticItemClass.instance.readyState[1] == 1) {
                    GameGoBallisticItemClass.instance.readyState[0] = 0;
                    GameGoBallisticItemClass.instance.readyState[1] = 0;
                    egret.stopTick(GameGoBallisticLogic.instance.readyTick, GameGoBallisticMainScene.instance);
                    GameGoBallisticMainScene.instance.gameRdy();
                    return false;
                }
            }
            else if (GameGoBallisticItemClass.instance.isOffline == true) {
                egret.stopTick(GameGoBallisticLogic.instance.readyTick, GameGoBallisticMainScene.instance);
                App.TimerManager.doTimer(2345, 1, function () {
                    if (GameGoBallisticItemClass.instance.isRuning == false) {
                        return;
                    }
                    GameGoBallisticMainScene.instance.gameRdy();
                }, _this);
            }
            return false;
        };
        this.gamingTick = function () {
            if (GameGoBallisticItemClass.instance.isRuning == false) {
                return;
            }
            var ran = GameGoBallisticMainScene.instance.random();
            if (ran > 0 && ran < 0.75) {
                GameGoBallisticMainScene.instance.Gob_group_boss.visible = true;
                GameGoBallisticItemClass.instance.state = 0;
                GameGoBallisticMainScene.instance.Img_stop.visible = false;
                _this.DBCtrlor(0);
            }
            else if (ran >= 0.75 && ran <= 1) {
                GameGoBallisticMainScene.instance.Gob_group_boss.visible = true;
                GameGoBallisticItemClass.instance.state = 1;
                GameGoBallisticMainScene.instance.Img_stop.visible = true;
                GameGoBallisticItemClass.instance.stopSoundEffect.play("Gob_stop_mp3", true);
                if (GameGoBallisticItemClass.instance.isOffline == true) {
                    if (Math.random() > GameGoBallisticArtificialts.instance.mistake) {
                        App.TimerManager.doTimer(100, 1, function () {
                            if (GameGoBallisticItemClass.instance.isRuning == false) {
                                return;
                            }
                            _this.walking(1);
                        }, GameGoBallisticArtificialts.instance);
                    }
                    else {
                        GameGoBallisticArtificialts.instance.walkSwitcher = false;
                    }
                }
                _this.DBCtrlor(5);
            }
        };
        /**
         * 0-normal, 1-quick, 2-pointAll, 3-pointLeft, 4-pointRight, 5-censure, 6-stop
         */
        this.DBCtrlor = function (state) {
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
        };
        GameGoBallisticLogic.instance = this;
    }
    GameGoBallisticLogic.prototype.gameOver = function (result) {
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
            App.TimerManager.remove(GameGoBallisticArtificialts.instance.taunt, GameGoBallisticArtificialts.instance);
            App.TimerManager.remove(GameGoBallisticArtificialts.instance.walk, GameGoBallisticArtificialts.instance);
        }
        App.TimerManager.removeAll(GameGoBallisticArtificialts.instance);
        GameGoBallisticItemClass.instance.roleBoss.visible = false;
        GameGoBallisticMainScene.instance.Gob_btn_run.visible = false;
        GameGoBallisticMainScene.instance.Gob_btn_showoff.visible = false;
        this.DBCtrlor(6);
        App.TimerManager.removeAll(GameGoBallisticLogic.instance);
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    return GameGoBallisticLogic;
}());
__reflect(GameGoBallisticLogic.prototype, "GameGoBallisticLogic");
var GameGoBallisticMainScene = (function (_super) {
    __extends(GameGoBallisticMainScene, _super);
    function GameGoBallisticMainScene() {
        var _this = _super.call(this, GameGoBallisticMainSkin) || this;
        _this.AiConf = {};
        _this.gameInit = function () {
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticEventClass.instance);
            App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, GameGoBallisticEventClass.instance.resultDeal, GameGoBallisticEventClass.instance);
            GameGoBallisticItemClass.instance.roleBoss = AssetManager.getDBArmature("Gob_boss");
            GameGoBallisticItemClass.instance.roleBoss.x = 0.5 * GameGoBallisticItemClass.instance.roleBoss.width;
            GameGoBallisticItemClass.instance.roleBoss.y = 160;
            GameGoBallisticItemClass.instance.roleBoss.alpha = 0;
            _this.Gob_group_boss.addChild(GameGoBallisticItemClass.instance.roleBoss);
            GameGoBallisticItemClass.instance.roleBlue = new Gob_role("Blue");
            _this.Gob_group_roles.addChild(GameGoBallisticItemClass.instance.roleBlue);
            GameGoBallisticItemClass.instance.roleRed = new Gob_role("Red");
            _this.Gob_group_roles.addChild(GameGoBallisticItemClass.instance.roleRed);
            _this.Gob_btn_run.addEventListener("touchTap", GameGoBallisticLogic.instance.btnRunClick, GameGoBallisticMainScene.instance);
            _this.Gob_btn_showoff.addEventListener("touchTap", GameGoBallisticLogic.instance.btnShowoffClick, GameGoBallisticMainScene.instance);
            _this.w8img = AssetManager.getBitmap("Gob_w8_png", true, false);
            _this.w8img.x = 320;
            _this.w8img.y = 784;
            _this.addChild(_this.w8img);
            var headIcoLeft = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 67, 67);
            headIcoLeft.x = 0;
            headIcoLeft.y = 0;
            _this.Gob_group_blueHead.addChild(headIcoLeft);
            var headIcoRight = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 67, 67);
            headIcoRight.x = 0;
            headIcoRight.y = 0;
            _this.Gob_group_redHead.addChild(headIcoRight);
            _this.Img_blackMask.visible = true;
            egret.startTick(GameGoBallisticLogic.instance.readyTick, GameGoBallisticMainScene.instance);
            GameGoBallisticEventClass.instance.messageCenter(GameGoBallisticEventClass.instance.GOB_EVENT_READY);
            if (_this.stage.stageHeight < 1136) {
                GameGoBallisticItemClass.instance.multiple = (_this.stage.stageHeight / 1136);
                _this.scaleX = GameGoBallisticItemClass.instance.multiple;
                _this.scaleY = GameGoBallisticItemClass.instance.multiple;
                var nowWidth = 640 * GameGoBallisticItemClass.instance.multiple;
                _this.x = (640 - nowWidth) / 2;
            }
            else if (_this.stage.stageHeight > 1136) {
                _this.y = (_this.stage.stageHeight - 1136) / 2;
            }
            var tw = egret.Tween.get(_this.Img_isYou, { loop: true });
            tw.to({ y: 420 }, 600).to({ y: 390 }, 600);
            App.TimerManager.doTimer(3600, 1, function () {
                if (GameGoBallisticItemClass.instance.isRuning == false) {
                    return;
                }
                egret.Tween.removeTweens(_this.Img_isYou);
                _this.Img_isYou.visible = false;
            }, GameGoBallisticMainScene.instance);
        };
        _this.gameRdy = function () {
            _this.rdy = new GameReady(function () {
                _this.gameStart();
            });
            _this.Img_blackMask.visible = false;
            _this.removeChild(GameGoBallisticMainScene.instance.w8img);
            _this.rdy.x = 320;
            _this.rdy.y = 568;
            _this.rdy.play();
            _this.Gob_group_all.addChild(_this.rdy);
        };
        _this.gameStart = function () {
            GameGoBallisticItemClass.instance.roleBoss.alpha = 1;
            App.TimerManager.doTimer(1000, 0, GameGoBallisticLogic.instance.gamingTick, GameGoBallisticMainScene.instance);
            _this.Gob_btn_run.visible = true;
            if (GameGoBallisticItemClass.instance.isOffline == true) {
                App.TimerManager.doTimer(GameGoBallisticArtificialts.instance.clickInterval, 0, GameGoBallisticArtificialts.instance.taunt, GameGoBallisticArtificialts.instance);
                App.TimerManager.doTimer(GameGoBallisticArtificialts.instance.clickInterval, 0, GameGoBallisticArtificialts.instance.walk, GameGoBallisticArtificialts.instance);
            }
        };
        _this.showResult = function (isWin) {
            _this.Img_blackMask.visible = true;
            _this.Img_light.visible = true;
            var tw = egret.Tween.get(_this.Img_light, { loop: true });
            tw.to({ rotation: 180 }, 1500).to({ rotation: 360 }, 1500);
            switch (isWin) {
                case 3:
                    _this.Img_result.source = "Gob_win_png";
                    GameGoBallisticItemClass.instance.roleBlue.win();
                    break;
                case 1:
                    _this.Img_result.source = "Gob_lose_png";
                    GameGoBallisticItemClass.instance.roleRed.win();
                    break;
            }
            _this.Img_result.visible = true;
        };
        GameGoBallisticMainScene.instance = _this;
        if (App.IsXiaoMi) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, function (data) {
                GameGoBallisticMainScene.instance.AiConf = data;
                new GameGoBallisticArtificialts();
            });
        }
        else {
            new GameGoBallisticArtificialts();
        }
        new GameGoBallisticItemClass();
        new GameGoBallisticEventClass();
        new GameGoBallisticLogic();
        if (DataCenter.instance.room.IsAI) {
            GameGoBallisticItemClass.instance.isOffline = true;
            App.MessageCenter.addListener("local", GameGoBallisticEventClass.instance.messageDeal, GameGoBallisticMainScene.instance);
        }
        return _this;
    }
    GameGoBallisticMainScene.prototype.init = function () {
        _super.prototype.init.call(this);
        GameGoBallisticItemClass.instance.isRuning = true;
        this.random = new Math["seedrandom"](DataCenter.instance.room.id.toString());
        this.gameInit();
        App.SoundManager.playBg("bgm_mp3");
    };
    GameGoBallisticMainScene.prototype.dispose = function () {
        GameGoBallisticItemClass.instance.isRuning = false;
        GameGoBallisticLogic.instance.dispose();
        _super.prototype.dispose.call(this);
        egret.stopTick(GameGoBallisticLogic.instance.readyTick, this);
        GameGoBallisticLogic.instance.dispose();
        App.TimerManager.removeAll(GameGoBallisticLogic.instance);
        App.TimerManager.removeAll(GameGoBallisticMainScene.instance);
        App.TimerManager.removeAll(GameGoBallisticLogic.instance);
        App.TimerManager.removeAll(GameGoBallisticArtificialts.instance);
        App.MessageCenter.removeAll(GameGoBallisticMainScene.instance);
        App.MessageCenter.removeAll(GameGoBallisticEventClass.instance);
        egret.Tween.removeAllTweens();
        GameGoBallisticItemClass.instance.roleBoss.stop();
        if (this.rdy) {
            this.rdy.dispose();
            this.rdy = undefined;
        }
        GameGoBallisticItemClass.instance = null;
        GameGoBallisticEventClass.instance = null;
        GameGoBallisticLogic.instance = null;
        App.SoundManager.stopBg();
    };
    return GameGoBallisticMainScene;
}(StateEui));
__reflect(GameGoBallisticMainScene.prototype, "GameGoBallisticMainScene");
