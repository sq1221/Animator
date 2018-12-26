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
var FindSomeThing;
(function (FindSomeThing) {
    var AiController = (function () {
        function AiController() {
            var _this = this;
            this.rightTime = 200;
            this.falseTime = 1500;
            this.rightNum = 10;
            this.choose = function () {
                var random = Math.random();
                if (random < _this.isRight) {
                    _this.aiRight();
                }
                else {
                    _this.aiWrong();
                }
            };
            this.nextRound = function () {
                App.TimerManager.removeAll(_this);
                if (App.IsXiaoMi) {
                    _this.totalTime = GameFindSomethingView.aiConf.s * 1000 + Math.floor(GameFindSomethingView.aiConf.r * Math.random());
                    console.log(_this.totalTime);
                }
                else {
                    _this.setTotalTime();
                }
                _this.setFalseNum();
                _this.rightNum = 10;
            };
            this.aiRight = function () {
                App.TimerManager.doTimer(_this.rightTime, 1, function () {
                    if (_this.currentNum > 0) {
                        _this.currentNum--;
                    }
                    if (_this.currentNum == 0) {
                        _this.chooseTitle();
                    }
                    var isNext = GameFindSomethingView.instance.scoreController.comRight();
                    _this.rightNum--;
                    if (isNext)
                        _this.choose();
                }, _this);
            };
            this.aiWrong = function () {
                if (_this.wrongFlag)
                    clearTimeout(_this.wrongFlag);
                _this.wrongFlag = setTimeout(_this.choose, _this.falseTime);
                _this.falseNum--;
            };
            this.dispose = function () {
                App.TimerManager.removeAll(_this);
                if (_this.wrongFlag)
                    clearTimeout(_this.wrongFlag);
            };
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomTitle" + GameFindSomethingView.instance.roundController.currentRound);
            // App.CurrGameAiLevel = 1;
            if (App.IsXiaoMi) {
                this.totalTime = GameFindSomethingView.aiConf.s * 1000 + Math.floor(GameFindSomethingView.aiConf.r * Math.random());
                console.log(this.totalTime);
            }
            else {
                this.setTotalTime();
            }
            this.setFalseNum();
        }
        AiController.prototype.setTotalTime = function () {
            //GameFindSomethingView.aiConf
            var baseTime = (13 - App.CurrGameAiLevel) * 2.5;
            var folatTime;
            var random = Math.random();
            if (App.CurrGameAiLevel > 1 && App.CurrGameAiLevel < 10) {
                folatTime = Math.round(random * 5);
            }
            else if (App.CurrGameAiLevel == 1) {
                folatTime = Math.round(random * 10);
            }
            else if (App.CurrGameAiLevel == 10) {
                folatTime = Math.round(random * 3);
                baseTime = 9;
            }
            this.totalTime = (baseTime + folatTime) * 1000;
        };
        AiController.prototype.setFalseNum = function () {
            var fasleTotalTime = this.totalTime - this.rightTime * 10;
            if (fasleTotalTime < 0) {
                this.falseNum = 0;
            }
            else {
                this.falseNum = Math.floor(fasleTotalTime / this.falseTime);
            }
        };
        Object.defineProperty(AiController.prototype, "isRight", {
            get: function () {
                if (this.falseNum <= 0)
                    return 1;
                return this.rightNum / (this.falseNum + this.rightNum);
            },
            enumerable: true,
            configurable: true
        });
        AiController.prototype.chooseTitle = function () {
            var titleList = GameFindSomethingView.instance.gameController.titleList;
            var titleMap = GameFindSomethingView.instance.gameController.titleMap;
            var index = Math.floor(this.random() * titleList.length);
            if (this.currentTitle === titleList[index]) {
                this.chooseTitle();
                return;
            }
            this.currentTitle = titleList[index];
            if (titleMap[this.currentTitle] < 3)
                this.currentNum = Math.ceil(this.random() * titleMap[this.currentTitle]);
            else
                this.currentNum = Math.ceil(this.random() * 3);
        };
        return AiController;
    }());
    FindSomeThing.AiController = AiController;
    __reflect(AiController.prototype, "FindSomeThing.AiController");
})(FindSomeThing || (FindSomeThing = {}));
var FindSomeThing;
(function (FindSomeThing) {
    var GameController = (function () {
        function GameController(leftCloud, rightCloud, btn_tip, tipTitle) {
            var _this = this;
            this.titleMap = {};
            this.titleList = [];
            /**   添加题库信息 */
            this.pushTitle = function (titles) {
                for (var _i = 0, titles_1 = titles; _i < titles_1.length; _i++) {
                    var title = titles_1[_i];
                    if (_this.titleMap[title])
                        _this.titleMap[title]++;
                    else {
                        _this.titleMap[title] = 1;
                        _this.titleList.push(title);
                    }
                }
            };
            this.delayTipTitle = function () {
                _this.clearDelayTipTitle();
                _this.tipFlag = setTimeout(_this.tipTitleFicker, GameController.TipTime);
            };
            this.clearDelayTipTitle = function () {
                if (_this.tipFlag) {
                    clearTimeout(_this.tipFlag);
                    _this.tipFlag = undefined;
                }
            };
            this.tipTitleFicker = function () {
                _this.isTipFicking = true;
                _this.tipEffect.startFlicker(_this.tipTitle, 500);
            };
            this.tipTitleStop = function () {
                _this.isTipFicking = false;
                _this.tipEffect.stopFlicker(_this.tipTitle);
                _this.tipTitle.alpha = 1;
            };
            this.isItemFlick = false;
            this.tipNum = 3;
            this.stopFicker = function (item) {
                if (_this.isItemFlick) {
                    _this.effect.stopFlicker(_this.tipItem["img"]);
                    _this.isItemFlick = false;
                    if (item == _this.tipItem)
                        _this.tipItem["img"].alpha = 0.5;
                    else
                        _this.tipItem["img"].alpha = 1;
                }
            };
            this.showTip = function () {
                if (!GameFindSomethingView.instance.isGameing || _this.isItemFlick)
                    return;
                _this.tipNum--;
                if (_this.tipNum < 0)
                    return;
                if (_this.tipNum > 0) {
                    _this.tipTitleStop();
                    _this.delayTipTitle();
                }
                else {
                    _this.clearDelayTipTitle();
                    _this.tipTitleStop();
                }
                var GameScrollerGroup = GameFindSomethingView.instance.GameScrollerGroup;
                _this.btn_tip.source = "FindSometingTip" + _this.tipNum + "_png";
                App.SoundManager.playEffect("FindSomethingTip_mp3", true);
                _this.tipItem = GameFindSomethingView.instance.itemController.getItem(_this.currentTitle);
                var target = _this.tipItem.x - GameScrollerGroup.width / 2;
                if (target < 0)
                    target = 0;
                if (target > 1800 - GameScrollerGroup.width)
                    target = 1800 - GameScrollerGroup.width;
                _this.effect.startFlicker(_this.tipItem["img"], 400);
                _this.isItemFlick = true;
                //向右滚 ,scroller to right
                if (target > GameScrollerGroup.scrollH) {
                    var time = Math.floor((target - GameScrollerGroup.scrollH) / GameFindSomethingView.scrollerSpeed);
                    if (time == 0)
                        return;
                    App.TimerManager.doFrame(1, time, function () {
                        GameScrollerGroup.scrollH += GameFindSomethingView.scrollerSpeed;
                    }, _this, function () {
                        GameScrollerGroup.scrollH = target;
                    }, _this);
                }
                else {
                    var time = Math.floor((GameScrollerGroup.scrollH - target) / GameFindSomethingView.scrollerSpeed);
                    if (time == 0)
                        return;
                    App.TimerManager.doFrame(1, time, function () {
                        GameScrollerGroup.scrollH -= GameFindSomethingView.scrollerSpeed;
                    }, _this, function () {
                        GameScrollerGroup.scrollH = target;
                    }, _this);
                }
            };
            this.nextRound = function () {
                _this.titleMap = {};
                _this.titleList = [];
                _this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomTitle" + GameFindSomethingView.instance.roundController.currentRound);
                _this.clearDelayTipTitle();
                _this.tipTitleStop();
                _this.targetNum = GameFindSomethingView.instance.scoreController.targetNum;
            };
            this.dispose = function () {
                _this.titleMap = {};
                _this.titleList = [];
                egret.Tween.removeTweens(_this.leftCloud);
                egret.Tween.removeTweens(_this.rightCloud);
                _this.leftCloud.x = -1;
                _this.rightCloud.x = 641;
                if (_this.isItemFlick) {
                    _this.effect.stopFlicker(_this.tipItem["img"]);
                    _this.isItemFlick = false;
                }
                _this.clearDelayTipTitle();
                _this.tipTitleStop();
                _this.btn_tip.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.showTip, _this);
            };
            this.itemConfigTip = RES.getRes("ItemConfig_json")["tip"];
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomTitle" + GameFindSomethingView.instance.roundController.currentRound);
            this.leftCloud = leftCloud;
            this.rightCloud = rightCloud;
            this.tipTitle = tipTitle;
            this.btn_tip = btn_tip;
            this.btn_tip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTip, this);
            this.effect = new EffectUtils();
            this.tipEffect = new EffectUtils();
            this.targetNum = GameFindSomethingView.instance.scoreController.targetNum;
        }
        GameController.prototype.chooseTitle = function () {
            if (this.targetNum == 0) {
                GameFindSomethingView.instance.currentTitleView.text = "\u7B2C" + GameFindSomethingView.instance.roundController.currentRound + "\u5C40\u7ED3\u675F";
                return;
            }
            var index = Math.floor(this.random() * this.titleList.length);
            if (this.currentTitle === this.titleList[index]) {
                this.chooseTitle();
                return;
            }
            this.currentTitle = this.titleList[index];
            if (this.titleMap[this.currentTitle] < 3)
                this.currentNum = Math.ceil(this.random() * this.titleMap[this.currentTitle]);
            else
                this.currentNum = Math.ceil(this.random() * 3);
            if (this.targetNum < this.currentNum)
                this.currentNum = this.targetNum;
            this.targetNum -= this.currentNum;
            GameFindSomethingView.instance.currentTitleView.text = this.itemConfigTip[this.currentTitle] + "X" + this.currentNum;
        };
        GameController.prototype.tapRight = function (titles) {
            for (var _i = 0, titles_2 = titles; _i < titles_2.length; _i++) {
                var title = titles_2[_i];
                if (this.titleMap[title] > 1)
                    this.titleMap[title]--;
                else {
                    delete this.titleMap[title];
                    var index = this.titleList.indexOf(title);
                    this.titleList.splice(index, 1);
                }
            }
            if (this.currentNum > 0) {
                this.currentNum--;
                GameFindSomethingView.instance.currentTitleView.text = this.itemConfigTip[this.currentTitle] + "X" + this.currentNum;
            }
            if (this.currentNum == 0) {
                this.chooseTitle();
            }
            App.SoundManager.playEffect("FindSomethingRight_mp3", true);
            GameFindSomethingView.instance.scoreController.selfRight();
            if (this.tipNum > 0) {
                this.tipTitleStop();
                this.delayTipTitle();
            }
        };
        GameController.prototype.tapFalse = function () {
            App.SoundManager.playEffect("FingSomethingFalse_mp3", true);
            egret.Tween.get(this.leftCloud).to({ x: 320 }, 400).wait(700).to({ x: -1 }, 400);
            egret.Tween.get(this.rightCloud).to({ x: 320 }, 400).wait(700).to({ x: 641 }, 400);
        };
        /** 10s后没有选对，提示功能闪烁 */
        GameController.TipTime = 10000;
        return GameController;
    }());
    FindSomeThing.GameController = GameController;
    __reflect(GameController.prototype, "FindSomeThing.GameController");
})(FindSomeThing || (FindSomeThing = {}));
var GameFindSomethingView = (function (_super) {
    __extends(GameFindSomethingView, _super);
    function GameFindSomethingView() {
        var _this = _super.call(this, App.IsWanba ? GameFindSomethingViewSkinWanba : GameFindSomethingViewSkin) || this;
        _this.isGameing = false;
        _this.readyStart = function () {
            if (DataCenter.instance.room.IsAI) {
                _this.aiController.chooseTitle();
                _this.aiController.choose();
            }
            _this.gameController.chooseTitle();
            _this.GameScroller.scrollPolicyH = "on";
            _this.isGameing = true;
            App.TimerManager.doTimer(1000, GameFindSomethingView.time, _this.countDown, _this);
            if (_this.gameController.tipNum > 0)
                _this.gameController.delayTipTitle();
        };
        _this.onGameResult = function (data) {
            // 弹出结果面板
            DataCenter.instance.room.gameResult = data;
            // console.log(DataCenter.instance.room.id + "号房收到结果为" + DataCenter.instance.user.id + ":" + data.winUserId)
            // 发送游戏结果
            _this.popup("GameResult");
        };
        _this.nextRound = function () {
            _this.isGameing = false;
            _this.GameScroller.scrollPolicyH = "off";
            egret.Tween.get(_this.roundBG).to({ alpha: 1 }, 300).wait(600).call(function () {
                _this.GameScrollerGroup.scrollH = 0;
                _this.gameController.nextRound();
                _this.itemController.nextRound();
                _this.scoreController.nextRound();
                if (DataCenter.instance.room.IsAI)
                    _this.aiController.nextRound();
                _this.time = GameFindSomethingView.time;
                _this.Time.text = _this.time.toString();
                switch (App.Language) {
                    case LanguageType.Ch:
                        _this.currentTitleView.text = "\u7B2C" + _this.roundController.currentRound + "\u5C40\u5F00\u59CB";
                        break;
                    case LanguageType.En:
                        _this.currentTitleView.text = "Round " + _this.roundController.currentRound + " Start";
                        break;
                }
            }).to({ alpha: 0 }, 300).call(function () {
                _this.ready.play();
            });
        };
        _this.time = GameFindSomethingView.time;
        _this.countDown = function () {
            _this.time--;
            _this.Time.text = _this.time.toString();
            if (_this.time == 0) {
                _this.scoreController.roundOver();
            }
        };
        _this.stopTime = function () {
            App.TimerManager.remove(_this.countDown, _this);
        };
        GameFindSomethingView.instance = _this;
        return _this;
        // this.itemLayer = new egret.DisplayObjectContainer();
    }
    GameFindSomethingView.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        //注册相关控制器
        this.scoreController = new FindSomeThing.ScoreController(this.SelfCurrent, this.ComCurrent);
        this.roundController = new FindSomeThing.RoundController(this.SelfScore1, this.SelfScore2, this.ComScore1, this.ComScore2);
        this.gameController = new FindSomeThing.GameController(this.leftCloud, this.rightCloud, this.btn_tip, this.tipTitle);
        this.itemController = new FindSomeThing.ItemController();
        this.initUserData();
        if (DataCenter.instance.room.IsAI && App.IsXiaoMi) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, function (data) {
                GameFindSomethingView.aiConf = data[App.CurrGameAiLevel];
                console.log("IsXiaoMi" + App.CurrGameAiLevel + "   " + JSON.stringify(GameFindSomethingView.aiConf));
                _this.ready = new GameReady(_this.readyStart);
                _this.ready.x = 300;
                _this.ready.y = App.GameHeight / 2;
                _this.addChild(_this.ready);
                _this.ready.play();
                _this.aiController = new FindSomeThing.AiController();
            });
        }
        else {
            this.ready = new GameReady(this.readyStart);
            this.ready.x = 300;
            this.ready.y = App.GameHeight / 2;
            this.addChild(this.ready);
            this.ready.play();
            if (DataCenter.instance.room.IsAI) {
                this.aiController = new FindSomeThing.AiController();
            }
        }
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.addListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this);
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        if (App.GameHeight < 1136) {
            this.gp_bg.scaleY = this.gp_bg.scaleX = App.GameHeight / 1136;
        }
        //回合结束黑屏
        this.roundBG = new egret.Shape();
        this.roundBG.alpha = 0;
        this.roundBG.graphics.beginFill(0x000000);
        this.roundBG.graphics.drawRect(0, 0, App.GameWidth, App.GameHeight);
        this.roundBG.graphics.endFill();
        this.addChild(this.roundBG);
        this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.popup("GameSureLeave");
        }, this);
        if (App.IsXiaoMi || App.IsWanba) {
            this.btn_return.visible = false;
        }
        this.btn_hello.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sayHello, this);
        this.GameScroller.scrollPolicyH = "off";
        App.SoundManager.playBg("FindSomethingBGMusic_mp3");
        switch (App.Language) {
            case LanguageType.Ch:
                this.currentTitleView.text = "\u7B2C" + this.roundController.currentRound + "\u5C40\u5F00\u59CB";
                break;
            case LanguageType.En:
                this.currentTitleView.text = "Round " + this.roundController.currentRound + " Start";
                break;
        }
    };
    GameFindSomethingView.prototype.initUserData = function () {
        var self = DataCenter.instance.user;
        var com = DataCenter.instance.room.player;
        var selfHead = new RoleHeadImage(self.imgUrl);
        selfHead.scaleX = selfHead.scaleY = 0.85;
        this.SelfAvatarGroup.addChild(selfHead);
        this.SelfSex.source = GameCenterGetSexIcon.getSexIconSource(self.sex);
        this.SelfName.text = self.name;
        if (this.SelfName.text.length > GameFindSomethingView.nameLength)
            this.SelfName.size *= GameFindSomethingView.nameLength / this.SelfName.text.length;
        var comHead = new RoleHeadImage(com.imgUrl);
        comHead.scaleX = comHead.scaleY = 0.85;
        this.ComAvatarGroup.addChild(comHead);
        this.ComSex.source = GameCenterGetSexIcon.getSexIconSource(com.sex);
        this.ComName.text = com.name;
        if (this.ComName.text.length > GameFindSomethingView.nameLength)
            this.ComName.size *= GameFindSomethingView.nameLength / this.ComName.text.length;
    };
    GameFindSomethingView.prototype.onGameEvent = function (data) {
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        switch (datas[0]) {
            case "sendExpress":
                this.addQiPaoCartoon(datas[1], 2);
                break;
        }
    };
    GameFindSomethingView.prototype.addQiPaoCartoon = function (data, type) {
        if (type === void 0) { type = 1; }
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(120, 130);
        this.addChild(qiPao);
        if (type == 2) {
            qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 105, App.GameWidth - 85);
            qiPao.setSouce(data, true);
        }
        else {
            qiPao.setSouce(data);
            qiPao.x = App.RandomUtils.limitInteger(85, 105);
            if (!DataCenter.instance.room.IsAI) {
                var str = "sendExpress|" + data;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            else {
                var num = App.RandomUtils.limitInteger(1, 5);
                if (num % 2 != 0) {
                    App.TimerManager.doTimer(1000 * num, 1, this.AddAIexpress, this);
                }
            }
        }
        qiPao.onPlay();
    };
    //添加Ai的表情
    GameFindSomethingView.prototype.AddAIexpress = function () {
        var ArrPress = [
            "1_1", "1_2", "1_3", "1_4", "1_5", "1_6",
            "2_1", "2_2", "2_3", "2_4",
            "3_1", "3_2", "3_3", "3_4"
        ];
        var num = App.RandomUtils.limitInteger(0, 13);
        var str = "express" + ArrPress[num] + "_png";
        this.addQiPaoCartoon(str, 2);
    };
    GameFindSomethingView.prototype.sayHello = function () {
        //打招呼功能在这里写
        App.GameExpressType = 1;
        this.popup("GameExpress");
    };
    GameFindSomethingView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.itemController.dispose();
        this.gameController.dispose();
        this.roundController.dispose();
        this.scoreController.dispose();
        if (DataCenter.instance.room.IsAI)
            this.aiController.dispose();
        this.ready.dispose();
        egret.Tween.removeTweens(this.roundBG);
        App.TimerManager.removeAll(this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        this.btn_hello.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sayHello, this);
    };
    /** 名字最大长度，超过开始缩放 */
    GameFindSomethingView.nameLength = 6;
    /**一局时间限制 */
    GameFindSomethingView.time = 90;
    /** 提示滚屏速度 */
    GameFindSomethingView.scrollerSpeed = 30;
    GameFindSomethingView.aiConf = {};
    return GameFindSomethingView;
}(StateEui));
__reflect(GameFindSomethingView.prototype, "GameFindSomethingView");
var FindSomeThing;
(function (FindSomeThing) {
    var ItemController = (function () {
        function ItemController() {
            var _this = this;
            this.initData = function () {
                var map = RES.getRes("ItemConfig_json")["map"];
                _this.itemConfigMap = {};
                for (var i in map) {
                    _this.itemConfigMap[i] = map[i];
                }
                var list = RES.getRes("ItemConfig_json")["list"];
                _this.itemConfigList = [];
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var i = list_1[_i];
                    _this.itemConfigList.push(i);
                }
            };
            /**统计场上物品数量 */
            this.itemNum = 0;
            this.numChildren = 0;
            this.addItem = function (isSmall) {
                if (isSmall === void 0) { isSmall = false; }
                _this.itemNum++;
                var index = Math.floor(_this.itemConfigList.length * _this.random());
                _this.numChildren = GameFindSomethingView.instance.GameScrollerGroup.numChildren;
                if (_this.itemConfigList[index] === undefined) {
                    // console.log(`this.itemNum:${this.itemNum}  this.numChildren:${this.numChildren}`);
                    return;
                }
                var name = _this.itemConfigList[index];
                var item = new Item("FindSomething_" + name + "_png", _this.itemConfigMap[name]);
                delete _this.itemConfigMap[name];
                _this.itemConfigList.splice(index, 1);
                if (isSmall) {
                    var isAdd = _this.addSmallItem(item);
                    if (isAdd)
                        _this.addItem(isSmall);
                }
                else {
                    //原图是个正方形
                    if (item.width === item.height) {
                        //一个小格子位置
                        var isSmallNum = _this.random();
                        if (isSmallNum < 0.3) {
                            //加工原图
                            var isAdd = _this.addSmallItem(item);
                            if (isAdd)
                                _this.addItem(false);
                        }
                        else {
                            _this.addBigItem(item);
                        }
                    }
                    else if (item.width > item.height) {
                        _this.addWidthItem(item);
                    }
                    else {
                        _this.addHeightItem(item);
                    }
                }
            };
            this.nextRound = function () {
                _this.clearItem();
                _this.initData();
                _this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomItem" + GameFindSomethingView.instance.roundController.currentRound);
                _this.map = [];
                for (var i = 0; i < ItemController.mapRow; i++) {
                    var cell = [];
                    for (var j = 0; j < ItemController.mapCell; j++)
                        cell.push(false);
                    _this.map.push(cell);
                }
                _this.tarRow = _this.tarCell = 0;
                _this.addItem();
            };
            this.getItem = function (title) {
                for (var _i = 0, _a = _this.itemList; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.touchEnabled) {
                        for (var _b = 0, _c = item.tags; _b < _c.length; _b++) {
                            var itemTitle = _c[_b];
                            if (title === itemTitle) {
                                return item;
                            }
                        }
                    }
                }
            };
            this.dispose = function () {
                _this.clearItem();
                _this.map = [];
            };
            if (App.IsWanba)
                ItemController.mapCellEdge = 70;
            this.initData();
            this.itemList = [];
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomItem" + GameFindSomethingView.instance.roundController.currentRound);
            this.map = [];
            for (var i = 0; i < ItemController.mapRow; i++) {
                var cell = [];
                for (var j = 0; j < ItemController.mapCell; j++)
                    cell.push(false);
                this.map.push(cell);
            }
            this.tarRow = this.tarCell = 0;
            this.addItem();
        }
        ItemController.prototype.addHeightItem = function (item) {
            var _this = this;
            var b = item.width / (ItemController.mapCellEdge - 10);
            var maxRow = Math.ceil(b);
            var isNeedFindNext = function () {
                for (var temp = 0; temp < maxRow; temp++) {
                    if (_this.map[_this.tarRow + temp] == undefined || _this.map[_this.tarRow + temp][_this.tarCell] == undefined) {
                        return true;
                    }
                    if (_this.map[_this.tarRow + temp][_this.tarCell])
                        return true;
                }
                return false;
            };
            if (isNeedFindNext()) {
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    if (this.tarRow + maxRow >= ItemController.mapRow) {
                        this.tarRow = this.tarCell = 0;
                        var isAdd = this.addSmallItem(item);
                        if (isAdd)
                            this.addItem(true);
                        return;
                    }
                }
            }
            var width = ItemController.mapCellEdge - 10;
            var height = item.height / b;
            var y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            var x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge * b * 0.5 + 5;
            item.setImage(width, height, x, y);
            for (var temp = 0; temp < maxRow; temp++)
                this.map[this.tarRow + temp][this.tarCell] = true;
            this.getNextGrid();
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            this.addItem(false);
        };
        ItemController.prototype.addWidthItem = function (item) {
            var _this = this;
            var b = item.height / (ItemController.mapCellEdge - 10);
            var maxCell = Math.ceil(b);
            var isNeedFindNext = function () {
                for (var temp = 0; temp < maxCell; temp++) {
                    if (_this.map[_this.tarRow] == undefined || _this.map[_this.tarRow][_this.tarCell + temp] == undefined) {
                        return true;
                    }
                    if (_this.map[_this.tarRow][_this.tarCell + temp])
                        return true;
                }
                return false;
            };
            if (isNeedFindNext()) {
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    if (this.tarCell + maxCell >= ItemController.mapCell) {
                        this.tarRow++;
                        this.tarCell = 0;
                    }
                    if (this.tarRow + 1 >= ItemController.mapRow) {
                        var isAdd = this.addSmallItem(item);
                        if (isAdd)
                            this.addItem(true);
                        return;
                    }
                }
            }
            var y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge * b * 0.5 + 5;
            var x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            var height = (ItemController.mapCellEdge - 10);
            var width = item.width / b;
            item.setImage(width, height, x, y);
            for (var temp = 0; temp < maxCell; temp++)
                this.map[this.tarRow][this.tarCell + temp] = true;
            this.getNextGrid(maxCell);
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            this.addItem(false);
        };
        ItemController.prototype.addBigItem = function (item) {
            var _this = this;
            var isNeedFindNext = function () {
                if (_this.map[_this.tarRow + 1] == undefined || _this.map[_this.tarRow + 1][_this.tarCell + 1] == undefined) {
                    return true;
                }
                var result = _this.map[_this.tarRow][_this.tarCell] || _this.map[_this.tarRow][_this.tarCell + 1] ||
                    _this.map[_this.tarRow + 1][_this.tarCell + 1] || _this.map[_this.tarRow + 1][_this.tarCell];
                return result;
            };
            if (isNeedFindNext()) {
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    //边界处理
                    if (this.tarCell + 1 >= ItemController.mapCell) {
                        this.tarRow++;
                        this.tarCell = 0;
                    }
                    if (this.tarRow + 1 >= ItemController.mapRow) {
                        this.tarRow = this.tarCell = 0;
                        var isAdd = this.addSmallItem(item);
                        if (isAdd)
                            this.addItem(true);
                        return;
                    }
                }
            }
            var y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge;
            var x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge;
            item.setImage(ItemController.mapCellEdge * 2, ItemController.mapCellEdge * 2, x, y);
            this.map[this.tarRow][this.tarCell] = true;
            this.map[this.tarRow][this.tarCell + 1] = true;
            this.map[this.tarRow + 1][this.tarCell] = true;
            this.map[this.tarRow + 1][this.tarCell + 1] = true;
            this.getNextGrid(2);
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            this.addItem(false);
        };
        ItemController.prototype.addSmallItem = function (item) {
            var _this = this;
            //判断是否可以放下
            var isNeedFindNext = function () {
                return (_this.map[_this.tarRow][_this.tarCell]);
            };
            if (isNeedFindNext()) {
                var isFirst = true;
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    if (this.tarCell >= ItemController.mapCell) {
                        this.tarRow++;
                        this.tarCell = 0;
                    }
                    if (this.tarRow == ItemController.mapRow - 1 && this.tarCell == ItemController.mapCell - 1) {
                        if (isFirst) {
                            isFirst = false;
                        }
                        else {
                            return false;
                        }
                    }
                }
            }
            //放下图片维护相关数据
            var y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            var x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            item.setImage(ItemController.mapCellEdge, ItemController.mapCellEdge, x, y);
            this.map[this.tarRow][this.tarCell] = true;
            this.getNextGrid();
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            return true;
        };
        ItemController.prototype.getNextGrid = function (grid) {
            if (grid === void 0) { grid = 1; }
            this.tarCell = this.tarCell + grid;
            if (this.tarCell >= ItemController.mapCell) {
                this.tarRow++;
                this.tarCell = 0;
            }
            if (this.tarRow >= ItemController.mapRow) {
                this.tarRow = 0;
                this.tarCell = 0;
            }
        };
        ItemController.prototype.clearItem = function () {
            for (var _i = 0, _a = this.itemList; _i < _a.length; _i++) {
                var item = _a[_i];
                GameFindSomethingView.instance.GameScrollerGroup.removeChild(item);
                item.dispose();
            }
            this.itemList = [];
        };
        ItemController.mapCell = 28;
        ItemController.mapRow = 10;
        ItemController.mapCellEdge = 64;
        return ItemController;
    }());
    FindSomeThing.ItemController = ItemController;
    __reflect(ItemController.prototype, "FindSomeThing.ItemController");
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(bitmapUrl, tags) {
            var _this = _super.call(this) || this;
            _this.tap = function () {
                if (!GameFindSomethingView.instance.isGameing)
                    return;
                GameFindSomethingView.instance.gameController.stopFicker(_this);
                for (var _i = 0, _a = _this.tags; _i < _a.length; _i++) {
                    var title = _a[_i];
                    if (GameFindSomethingView.instance.gameController.currentTitle === title) {
                        _this.touchEnabled = false;
                        _this.img.alpha = 0.5;
                        GameFindSomethingView.instance.gameController.tapRight(_this.tags);
                        var v = AssetManager.getBitmap("FindSomethingV_png");
                        v.width = _this.img.width * 0.7;
                        v.height = _this.img.height * 0.7;
                        if (v.width > v.height)
                            v.width = v.height;
                        else
                            v.height = v.width;
                        v.anchorOffsetX = v.width * 0.5;
                        v.anchorOffsetY = v.height * 0.5;
                        v.x = _this.img.x;
                        v.y = _this.img.y;
                        _this.addChild(v);
                        return;
                    }
                }
                GameFindSomethingView.instance.gameController.tapFalse();
                var x = AssetManager.getBitmap("FindSomethingX_png");
                x.width = _this.img.width * 0.7;
                x.height = _this.img.height * 0.7;
                if (x.width > x.height)
                    x.width = x.height;
                else
                    x.height = x.width;
                x.anchorOffsetX = x.width * 0.5;
                x.anchorOffsetY = x.height * 0.5;
                x.x = _this.img.x;
                x.y = _this.img.y;
                _this.addChild(x);
                App.TimerManager.doTimer(1000, 1, function () {
                    _this.removeChild(x);
                    App.TimerManager.removeAll(_this);
                }, _this);
            };
            _this.dispose = function () {
                _this.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.tap, _this);
                _this.removeChildren();
                App.TimerManager.removeAll(_this);
            };
            _this.img = AssetManager.getBitmap(bitmapUrl);
            _this.tags = tags;
            GameFindSomethingView.instance.gameController.pushTitle(_this.tags);
            _this.addChild(_this.img);
            _this.touchEnabled = true;
            _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.tap, _this);
            return _this;
        }
        Item.prototype.setImage = function (width, height, x, y) {
            this.img.width = width;
            this.img.height = height;
            this.img.anchorOffsetX = this.img.width * 0.5;
            this.img.anchorOffsetY = this.img.height * 0.5;
            this.x = x;
            this.y = y;
            this.img.x = 0;
            this.img.y = 0;
        };
        return Item;
    }(egret.DisplayObjectContainer));
    FindSomeThing.Item = Item;
    __reflect(Item.prototype, "FindSomeThing.Item");
})(FindSomeThing || (FindSomeThing = {}));
var FindSomeThing;
(function (FindSomeThing) {
    var RoundController = (function () {
        function RoundController(SelfScore1, SelfScore2, ComScore1, ComScore2) {
            var _this = this;
            this.selfRound = 0;
            this.comRound = 0;
            this.currentRound = 1;
            this.round = {};
            this.playWinCartoon = function (target, callback) {
                if (!_this.findSomethingScore)
                    _this.findSomethingScore = AssetManager.getBitmap("FindSomethingScore_png");
                _this.findSomethingScore.scaleX = _this.findSomethingScore.scaleY = 1.2;
                _this.findSomethingScore.y = target.y;
                _this.findSomethingScore.x = target.x;
                _this.findSomethingScore.anchorOffsetX = _this.findSomethingScore.width * 0.5;
                _this.findSomethingScore.anchorOffsetY = _this.findSomethingScore.height * 0.5;
                GameFindSomethingView.instance.gp_bg.addChild(_this.findSomethingScore);
                egret.Tween.get(_this.findSomethingScore).to({ scaleX: 2, scaleY: 2 }, 300).to({ scaleX: 1, scaleY: 1 }, 200).wait(1000).call(function () {
                    if (_this.findSomethingScore.parent)
                        _this.findSomethingScore.parent.removeChild(_this.findSomethingScore);
                    target.source = _this.findSomethingScore.texture;
                    if (callback)
                        callback();
                });
            };
            this.SelfScore1 = SelfScore1;
            this.SelfScore2 = SelfScore2;
            this.ComScore1 = ComScore1;
            this.ComScore2 = ComScore2;
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
        RoundController.prototype.winRound = function () {
            var _this = this;
            GameFindSomethingView.instance.stopTime();
            switch (App.Language) {
                case LanguageType.Ch:
                    GameFindSomethingView.instance.currentTitleView.text = "\u7B2C" + this.currentRound + "\u5C40\u7ED3\u675F";
                    break;
                case LanguageType.En:
                    GameFindSomethingView.instance.currentTitleView.text = "Round " + this.currentRound + " Over";
                    break;
            }
            this.currentRound++;
            var playCartoonOver = function () {
                _this.selfRound++;
                if (_this.selfRound >= 2)
                    _this.sendResult(3);
                else
                    _this.nextRound();
            };
            if (this.selfRound === 0) {
                this.SelfScore1.source = "FindSomethingScore_png";
                this.playWinCartoon(this.SelfScore1, playCartoonOver);
            }
            else {
                this.SelfScore2.source = "FindSomethingScore_png";
                this.playWinCartoon(this.SelfScore2, playCartoonOver);
            }
            App.SoundManager.playEffect("FindSomethingRoundWin_mp3", true);
        };
        RoundController.prototype.loseRound = function () {
            var _this = this;
            GameFindSomethingView.instance.stopTime();
            switch (App.Language) {
                case LanguageType.Ch:
                    GameFindSomethingView.instance.currentTitleView.text = "\u7B2C" + this.currentRound + "\u5C40\u7ED3\u675F";
                    break;
                case LanguageType.En:
                    GameFindSomethingView.instance.currentTitleView.text = "Round " + this.currentRound + " Over";
                    break;
            }
            this.currentRound++;
            var playCartoonOver = function () {
                _this.comRound++;
                if (_this.comRound >= 2)
                    _this.sendResult(1);
                else
                    _this.nextRound();
            };
            if (this.comRound === 0) {
                this.ComScore1.source = "FindSomethingScore_png";
                this.playWinCartoon(this.ComScore1, playCartoonOver);
            }
            else {
                this.ComScore2.source = "FindSomethingScore_png";
                this.playWinCartoon(this.ComScore2, playCartoonOver);
            }
        };
        RoundController.prototype.nextRound = function () {
            GameFindSomethingView.instance.nextRound();
        };
        /** 发送输赢 */
        RoundController.prototype.sendResult = function (isWin) {
            // console.log(DataCenter.instance.room.id + "号房发送结果为" + DataCenter.instance.user.id + ":" + isWin)
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, isWin);
        };
        RoundController.prototype.onGameEvent = function (data) {
            var parseData = function (data) {
                var splitChar = data.split("|");
                return splitChar;
            };
            var datas = parseData(data.event);
            if (this.round[datas[1]] == undefined) {
                switch (datas[0]) {
                    case "roundWin":
                        if (data.userId === DataCenter.instance.user.id)
                            this.winRound();
                        else
                            this.loseRound();
                        this.round[datas[1]] = DataCenter.instance.user.name;
                        break;
                    case "roundLose":
                        if (data.userId === DataCenter.instance.user.id)
                            this.loseRound();
                        else
                            this.winRound();
                        this.round[datas[1]] = DataCenter.instance.room.player.name;
                        break;
                }
            }
        };
        RoundController.prototype.dispose = function () {
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        };
        return RoundController;
    }());
    FindSomeThing.RoundController = RoundController;
    __reflect(RoundController.prototype, "FindSomeThing.RoundController");
})(FindSomeThing || (FindSomeThing = {}));
var FindSomeThing;
(function (FindSomeThing) {
    var ScoreController = (function () {
        function ScoreController(SelfScore, ComScore) {
            var _this = this;
            this._selfRightNum = 0;
            this._comRightNum = 0;
            this.targetNum = 10;
            this.comRight = function () {
                _this._comRightNum++;
                _this.ComScore.text = _this._comRightNum.toString();
                if (_this._comRightNum >= _this.targetNum) {
                    GameFindSomethingView.instance.isGameing = false;
                    App.TimerManager.doFrame(1, 1, function () {
                        GameFindSomethingView.instance.roundController.loseRound();
                    }, _this);
                    return false;
                }
                return true;
            };
            this.nextRound = function () {
                _this._selfRightNum = 0;
                _this._comRightNum = 0;
                _this.SelfScore.text = _this._selfRightNum.toString();
                _this.ComScore.text = _this._comRightNum.toString();
            };
            this.roundOver = function () {
                if (!DataCenter.instance.room.IsAI) {
                    if (_this._selfRightNum >= _this._comRightNum) {
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundWin|" + GameFindSomethingView.instance.roundController.currentRound, 1);
                    }
                    else {
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundLose|" + GameFindSomethingView.instance.roundController.currentRound, 1);
                    }
                }
                else {
                    if (_this._selfRightNum >= _this._comRightNum) {
                        GameFindSomethingView.instance.roundController.winRound();
                    }
                    else {
                        GameFindSomethingView.instance.roundController.loseRound();
                    }
                }
            };
            this.SelfScore = SelfScore;
            this.ComScore = ComScore;
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        }
        ScoreController.prototype.selfRight = function () {
            this._selfRightNum++;
            this.SelfScore.text = this._selfRightNum.toString();
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "score|" + this._selfRightNum);
                if (this._selfRightNum >= this.targetNum)
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundWin|" + GameFindSomethingView.instance.roundController.currentRound, 1);
            }
            else {
                if (this._selfRightNum >= this.targetNum) {
                    GameFindSomethingView.instance.aiController.dispose();
                    App.TimerManager.doFrame(1, 1, function () {
                        GameFindSomethingView.instance.roundController.winRound();
                    }, this);
                }
            }
        };
        Object.defineProperty(ScoreController.prototype, "selfRightNum", {
            get: function () {
                return this._selfRightNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScoreController.prototype, "comRightNum", {
            get: function () {
                return this._comRightNum;
            },
            enumerable: true,
            configurable: true
        });
        ScoreController.prototype.onGameEvent = function (data) {
            var parseData = function (data) {
                var splitChar = data.split("|");
                return splitChar;
            };
            var datas = parseData(data.event);
            switch (datas[0]) {
                case "score":
                    this.ComScore.text = datas[1];
                    this._comRightNum = parseInt(datas[1]);
                    if (this._comRightNum >= this.targetNum)
                        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "roundLose|" + GameFindSomethingView.instance.roundController.currentRound, 1);
                    break;
            }
        };
        ScoreController.prototype.dispose = function () {
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        };
        return ScoreController;
    }());
    FindSomeThing.ScoreController = ScoreController;
    __reflect(ScoreController.prototype, "FindSomeThing.ScoreController");
})(FindSomeThing || (FindSomeThing = {}));
