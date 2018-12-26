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
var GameGestureAutonomy = (function () {
    function GameGestureAutonomy() {
        var _this = this;
        this.autonomyTick = function () {
            return false;
        };
        this.start = function () {
            App.TimerManager.doTimer;
            egret.startTick(_this.autonomyTick, _this);
        };
        this.stop = function () {
            egret.stopTick(_this.autonomyTick, _this);
        };
        this.addItem = function (time) {
            var item = new simulateItem();
            var tw = egret.Tween.get(item);
            tw.to({ y: 960 }, time);
            var probability = Math.random();
            if (probability > 0 && probability <= _this.successRate) {
                tw.call(function () {
                });
            }
            else {
                tw.call(function () {
                    GameGestureItemClass.rightHealthCtrlor.subtractHealth();
                });
            }
        };
    }
    Object.defineProperty(GameGestureAutonomy.prototype, "successRate", {
        get: function () {
            var num;
            switch (App.CurrGameAiLevel) {
                case 1:
                    num = 0.66;
                    break;
                case 2:
                    num = 0.72;
                    break;
                case 3:
                    num = 0.78;
                    break;
                case 4:
                    num = 0.84;
                    break;
                case 5:
                    num = 0.9;
                    break;
            }
            return num;
        },
        enumerable: true,
        configurable: true
    });
    return GameGestureAutonomy;
}());
__reflect(GameGestureAutonomy.prototype, "GameGestureAutonomy");
var simulateItem = (function () {
    function simulateItem() {
        var _this = this;
        this.needJudge = true;
        this.y = 0;
        this.startJudge = function () {
            _this.needJudge = true;
            App.TimerManager.doFrame(1, 0, _this.judgeTick, _this);
        };
        this.judgeTick = function () {
            if (GameGestureItemClass.otherlowest < _this.y) {
                GameGestureItemClass.otherlowest = _this.y;
            }
        };
    }
    return simulateItem;
}());
__reflect(simulateItem.prototype, "simulateItem");
var GameGestureItemMaker = (function (_super) {
    __extends(GameGestureItemMaker, _super);
    function GameGestureItemMaker() {
        var _this = _super.call(this) || this;
        _this.blackMask = new egret.Shape();
        _this.gesTureArray = ["caret", "triangle", "circle", "pigtail", "v", "caret", "triangle", "circle", "pigtail", "v", "caret", "triangle", "circle", "pigtail", "v", "star"];
        _this.runningInterval = 1;
        _this.runningSec = 0;
        _this.items = 0;
        _this.soundArray = ["GT_boom1_mp3", "GT_boom2_mp3", "GT_boom3_mp3"];
        _this.changeSpeed = function (runningInterval, timeInterval, tweenTime) {
            if (tweenTime === void 0) { tweenTime = GameGestureItemClass.speedTime; }
            _this.stop();
            _this.runningInterval = runningInterval;
            _this.runningSec = runningInterval - 1;
            _this.start(timeInterval);
            console.log("maker has change speed and now is running!");
            if (tweenTime != undefined) {
                GameGestureItemClass.speedTime = tweenTime;
            }
        };
        _this.start = function (timeInterval) {
            if (timeInterval === void 0) { timeInterval = 1000; }
            App.TimerManager.doTimer(timeInterval, 0, _this.itemMaker, _this);
        };
        _this.extraStart = function (timeInterval) {
            if (timeInterval === void 0) { timeInterval = 10000; }
            App.TimerManager.doTimer(timeInterval, 0, _this.doubleItemMaker, _this);
            console.log("doubleItemMaker now is running!");
        };
        _this.stop = function () {
            App.TimerManager.remove(_this.itemMaker, _this);
            App.TimerManager.remove(_this.doubleItemMaker, _this);
            console.log("maker now has stopped!");
        };
        _this.getTypeAndName = function () {
            var itemType = App.RandomUtils.randomArray(_this.gesTureArray);
            var itemName;
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
        };
        _this.itemMakeOne = function (balloonNum, isTeach) {
            if (isTeach === void 0) { isTeach = 0; }
            var newItem;
            switch (balloonNum) {
                case 1:
                    var balloon = _this.getTypeAndName();
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
                    var balloon1 = _this.getTypeAndName();
                    var balloon2 = _this.getTypeAndName();
                    newItem = new GestureComplexItems(balloon1[1], balloon1[0], balloon2[1], balloon2[0]);
                    break;
            }
            var halfWidth = Math.floor(newItem.width * 0.5);
            var startX = App.RandomUtils.limitInteger(halfWidth, 640 - halfWidth);
            var startY = 0;
            newItem.x = startX;
            newItem.y = startY;
            _this.addChild(newItem);
            newItem.startJudge();
            GameGestureItemClass.itemList.push(newItem);
            var tw = egret.Tween.get(newItem);
            tw.to({ y: 1136 - newItem.height + 70 }, GameGestureItemClass.speedTime).call(function () {
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
        };
        _this.itemMaker = function () {
            if (_this.runningSec == _this.runningInterval) {
                _this.runningSec = 0;
                _this.itemMakeOne(1);
                _this.items += 1;
                if (_this.items == 3) {
                    _this.changeSpeed(1, 10000);
                }
            }
            _this.runningSec += 1;
        };
        _this.doubleItemMaker = function () {
            if (_this.runningSec == _this.runningInterval) {
                _this.runningSec = 0;
                _this.itemMakeOne(2);
            }
            _this.runningSec += 1;
        };
        _this.playSoundEffect = function (isLost) {
            if (isLost === void 0) { isLost = false; }
            var item;
            switch (isLost) {
                case false:
                    item = App.RandomUtils.randomArray(_this.soundArray);
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
        };
        _this.x = 0;
        _this.y = 0;
        _this.width = 640;
        _this.height = 1136;
        return _this;
    }
    return GameGestureItemMaker;
}(egret.DisplayObjectContainer));
__reflect(GameGestureItemMaker.prototype, "GameGestureItemMaker");
var GestureItems = (function (_super) {
    __extends(GestureItems, _super);
    function GestureItems(name, type) {
        var _this = _super.call(this) || this;
        _this.needJudge = true;
        _this.dispose = function () {
            App.TimerManager.removeAll(_this);
        };
        _this.judge = function (judgeType) {
            if (judgeType == _this.itemType && _this.needJudge == true) {
                _this.stopJudge();
                _this.balloon.alpha = 0;
                _this.boomEffect.alpha = 1;
                if (_this.boomEffect) {
                    _this.boomEffect.play("chi", 1);
                }
                _this.remove();
                GameGestureMainScene.gesturePanel.playSoundEffect();
                var addingImg_1 = AssetManager.getBitmap("GT_add1_png");
                addingImg_1.x = _this.x;
                addingImg_1.y = _this.y;
                GameGestureMainScene.instance.addChild(addingImg_1);
                var tw = egret.Tween.get(addingImg_1);
                tw.to({ y: 0, alpha: 0 }, Math.floor(_this.y * 4)).call(function () {
                    GameGestureMainScene.instance.removeChild(addingImg_1);
                });
                switch (GameGestureItemClass.isOffline) {
                    case false:
                        if (GameGestureMainScene.gesturePanel.runningSec == 0) {
                            return;
                        }
                        ;
                        GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_BREAK, [1]);
                        break;
                    case true:
                        if (GameGestureMainScene.gesturePanel.runningSec == 0) {
                            return;
                        }
                        else if (GameGestureItemClass.runningSec >= GameGestureItemClass.autonomy) {
                            var temp = Math.random();
                            if (temp > 0 && temp < GameGestureItemClass.AiSuccess) {
                                GameGestureMainScene.gesturePanel.itemMakeOne(1);
                            }
                            else {
                                GameGestureItemClass.rightHealthCtrlor.subtractHealth();
                            }
                        }
                        else if (GameGestureItemClass.runningSec < GameGestureItemClass.autonomy) {
                            GameGestureMainScene.gesturePanel.itemMakeOne(1);
                        }
                        break;
                }
                GameGestureItemClass.scoreYou += Math.floor(GameGestureItemClass.gestureScore * 20);
            }
        };
        _this.judgeTick = function () {
            _this.judge(GameGestureItemClass.gestureType);
            if (GameGestureItemClass.lowestLine < _this.y) {
                GameGestureItemClass.lowestLine = _this.y;
            }
        };
        _this.startJudge = function () {
            _this.needJudge = true;
            App.TimerManager.doFrame(1, 0, _this.judgeTick, _this);
        };
        _this.stopJudge = function () {
            _this.needJudge = false;
            App.TimerManager.remove(_this.judgeTick, _this);
        };
        _this.remove = function () {
            egret.Tween.removeTweens(_this);
            _this.tempX = _this.role.x;
            _this.tempY = _this.role.y;
            var tw = egret.Tween.get(_this);
            if (_this.x <= 320) {
                tw.to({ rightFactor: 1 }, 1000).call(function () {
                    GameGestureMainScene.gesturePanel.removeChild(_this);
                });
            }
            else if (_this.tempX < 320) {
                tw.to({ leftFactor: 1 }, 1000).call(function () {
                    GameGestureMainScene.gesturePanel.removeChild(_this);
                });
            }
        };
        _this.balloon = AssetManager.getDBArmature("GT_du1");
        _this.balloon.x = 0;
        _this.balloon.y = 0;
        _this.balloon.getSlot("q2").display = AssetManager.getBitmap(name);
        _this.addChild(_this.balloon);
        _this.balloon.play("du1", 0);
        _this.boomEffect = AssetManager.getDBArmature("GT_yidong");
        _this.boomEffect.x = 0;
        _this.boomEffect.y = -100;
        _this.boomEffect.alpha = 0;
        _this.addChild(_this.boomEffect);
        _this.role = AssetManager.getDBArmature(App.RandomUtils.randomArray(GameGestureItemClass.mouseDBArray));
        ;
        _this.role.x = 0;
        _this.role.y = 0;
        _this.addChild(_this.role);
        _this.role.play("newAnimation", 0);
        _this.itemName = name;
        _this.itemType = type;
        return _this;
    }
    Object.defineProperty(GestureItems.prototype, "rightFactor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX - 200) + value * value * (this.tempX - 400);
            this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GestureItems.prototype, "leftFactor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX + 200) + value * value * (this.tempX + 400);
            this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
        },
        enumerable: true,
        configurable: true
    });
    return GestureItems;
}(egret.DisplayObjectContainer));
__reflect(GestureItems.prototype, "GestureItems");
var GestureComplexItems = (function (_super) {
    __extends(GestureComplexItems, _super);
    function GestureComplexItems(name1, type1, name2, type2) {
        var _this = _super.call(this) || this;
        _this.needJudgeLeft = true;
        _this.needJudgeRight = true;
        _this.dispose = function () {
            App.TimerManager.removeAll(_this);
        };
        _this.judgeRightTick = function () {
            if (GameGestureItemClass.gestureType == _this.item1Type && _this.needJudgeRight == true) {
                _this.stopJudgeRight();
                _this.item1Type = undefined;
                _this.balloon1.alpha = 0;
                _this.boomEffect1.alpha = 1;
                _this.boomEffect1.play("chi", 1);
                _this.balloon2.play("du1", 1);
                GameGestureMainScene.gesturePanel.playSoundEffect();
                GameGestureItemClass.scoreYou += Math.floor(GameGestureItemClass.gestureScore * 20);
            }
            if (_this.item1Type == undefined && _this.item2Type == undefined) {
                _this.stopJudge();
                _this.remove();
            }
            if (GameGestureItemClass.lowestLine < _this.y) {
                GameGestureItemClass.lowestLine = _this.y;
            }
        };
        _this.judgeLeftTick = function () {
            if (GameGestureItemClass.gestureType == _this.item2Type && _this.needJudgeLeft == true) {
                _this.stopJudgeLeft();
                _this.item2Type = undefined;
                _this.balloon2.alpha = 0;
                _this.boomEffect2.alpha = 1;
                _this.boomEffect2.play("chi", 1);
                _this.balloon1.play("du1", 1);
                GameGestureMainScene.gesturePanel.playSoundEffect();
                GameGestureItemClass.scoreYou += Math.floor(GameGestureItemClass.gestureScore * 20);
            }
            if (_this.item1Type == undefined && _this.item2Type == undefined) {
                _this.success();
                _this.stopJudge();
                _this.remove();
            }
            if (GameGestureItemClass.lowestLine < _this.y) {
                GameGestureItemClass.lowestLine = _this.y;
            }
        };
        _this.startJudge = function () {
            _this.needJudgeLeft = true;
            _this.needJudgeRight = true;
            App.TimerManager.doFrame(1, 0, _this.judgeLeftTick, _this);
            App.TimerManager.doFrame(1, 0, _this.judgeRightTick, _this);
        };
        _this.stopJudgeLeft = function () {
            _this.needJudgeLeft = false;
            App.TimerManager.remove(_this.judgeLeftTick, _this);
        };
        _this.stopJudgeRight = function () {
            _this.needJudgeRight = false;
            App.TimerManager.remove(_this.judgeRightTick, _this);
        };
        _this.stopJudge = function () {
            _this.needJudgeRight = false;
            _this.needJudgeLeft = false;
            App.TimerManager.remove(_this.judgeRightTick, _this);
            App.TimerManager.remove(_this.judgeLeftTick, _this);
        };
        _this.success = function () {
            var addingImg = AssetManager.getBitmap("GT_add2_png");
            addingImg.x = _this.x;
            addingImg.y = _this.y;
            GameGestureMainScene.instance.addChild(addingImg);
            var tw = egret.Tween.get(addingImg);
            tw.to({ y: 0, alpha: 0 }, Math.floor(_this.y * 4)).call(function () {
                GameGestureMainScene.instance.removeChild(addingImg);
            });
            switch (GameGestureItemClass.isOffline) {
                case false:
                    if (GameGestureMainScene.gesturePanel.runningSec == 0) {
                        return;
                    }
                    GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_BREAK, [2]);
                    break;
                case true:
                    if (GameGestureMainScene.gesturePanel.runningSec == 0) {
                        return;
                    }
                    else if (GameGestureItemClass.runningSec >= GameGestureItemClass.autonomy) {
                        var temp = Math.random();
                        if (temp > 0 && temp < GameGestureItemClass.AiSuccess) {
                            GameGestureMainScene.gesturePanel.itemMakeOne(2);
                        }
                        else {
                            GameGestureItemClass.rightHealthCtrlor.subtractHealth();
                        }
                        break;
                    }
                    else if (GameGestureItemClass.runningSec < GameGestureItemClass.autonomy) {
                        GameGestureMainScene.gesturePanel.itemMakeOne(2);
                    }
            }
        };
        _this.remove = function () {
            egret.Tween.removeTweens(_this);
            _this.tempX = _this.role.x;
            _this.tempY = _this.role.y;
            var tw = egret.Tween.get(_this);
            if (_this.x <= 320) {
                tw.to({ rightFactor: 1 }, 1000).call(function () {
                    App.TimerManager.removeAll(_this);
                    GameGestureMainScene.gesturePanel.removeChild(_this);
                });
            }
            else if (_this.tempX < 320) {
                tw.to({ leftFactor: 1 }, 1000).call(function () {
                    App.TimerManager.removeAll(_this);
                    GameGestureMainScene.gesturePanel.removeChild(_this);
                });
            }
        };
        console.log(name1, type1, name2, type2);
        _this.balloon1 = AssetManager.getDBArmature("GT_du2");
        _this.balloon1.x = 0;
        _this.balloon1.y = 0;
        _this.balloon1.getSlot("q2").display = AssetManager.getBitmap(name1);
        _this.addChild(_this.balloon1);
        _this.balloon2 = AssetManager.getDBArmature("GT_du3");
        _this.balloon2.x = 0;
        _this.balloon2.y = 0;
        _this.balloon2.getSlot("q21").display = AssetManager.getBitmap(name2);
        _this.addChild(_this.balloon2);
        _this.boomEffect1 = AssetManager.getDBArmature("GT_yidong");
        _this.boomEffect1.x = -50;
        _this.boomEffect1.y = -100;
        _this.boomEffect1.alpha = 0;
        _this.addChild(_this.boomEffect1);
        _this.boomEffect2 = AssetManager.getDBArmature("GT_yidong");
        _this.boomEffect2.x = 50;
        _this.boomEffect2.y = -100;
        _this.boomEffect2.alpha = 0;
        _this.addChild(_this.boomEffect2);
        _this.role = AssetManager.getDBArmature("GT_king");
        ;
        _this.role.x = 0;
        _this.role.y = 0;
        _this.addChild(_this.role);
        _this.role.play("newAnimation", 0);
        _this.item1Name = name1;
        _this.item1Type = type1;
        _this.item2Name = name2;
        _this.item2Type = type2;
        return _this;
    }
    Object.defineProperty(GestureComplexItems.prototype, "rightFactor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX - 200) + value * value * (this.tempX - 400);
            this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GestureComplexItems.prototype, "leftFactor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.role.x = (1 - value) * (1 - value) * this.tempX + 2 * value * (1 - value) * (this.tempX + 200) + value * value * (this.tempX + 400);
            this.role.y = (1 - value) * (1 - value) * this.tempY + 2 * value * (1 - value) * (this.tempY - 200) + value * value * 1200;
        },
        enumerable: true,
        configurable: true
    });
    return GestureComplexItems;
}(egret.DisplayObjectContainer));
__reflect(GestureComplexItems.prototype, "GestureComplexItems");
var healthCtrlor = (function (_super) {
    __extends(healthCtrlor, _super);
    function healthCtrlor(direction_) {
        var _this = _super.call(this) || this;
        _this.health = 3;
        _this.getHealth = function () {
            return _this.health;
        };
        _this.subtractHealth = function () {
            if (_this.health > 0) {
                var tw = void 0;
                var item_1;
                switch (_this.direction) {
                    case "right":
                        item_1 = _this.getChildByName("health" + (4 - _this.health).toString());
                        console.log("R", "health" + (4 - _this.health).toString());
                        break;
                    case "left":
                        item_1 = _this.getChildByName("health" + (_this.health).toString());
                        console.log("L", "health" + (_this.health).toString());
                        break;
                }
                _this.health -= 1;
                switch (_this.direction) {
                    case "right":
                        GameGestureItemClass.rightHealth = _this.health;
                        break;
                    case "left":
                        GameGestureItemClass.leftHealth = _this.health;
                        break;
                }
                tw = egret.Tween.get(item_1);
                tw.to({ alpha: 0, scaleX: 2, scaleY: 2 }, 250);
                tw.call(function () {
                    item_1.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                });
                tw.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 250);
            }
        };
        _this.setHealth = function (healthNum) {
            switch (healthNum) {
                case 1:
                    switch (_this.direction) {
                        case "left":
                            _this.health1.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                            _this.health2.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                            _this.health3.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                            break;
                        case "right":
                            _this.health3.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                            _this.health2.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                            _this.health1.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                            break;
                    }
                    break;
                case 2:
                    switch (_this.direction) {
                        case "left":
                            _this.health1.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                            _this.health2.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                            _this.health3.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                            break;
                        case "right":
                            _this.health1.texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                            _this.health2.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                            _this.health3.texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                            break;
                    }
                    break;
                case 0:
                    for (var count = 1; count <= 3; count++) {
                        _this.getChildByName("health" + (count).toString()).texture = AssetManager.getBitmap("GT_healthGary_png", true, true).texture;
                    }
                    break;
                case 3:
                    for (var n = 1; n <= 3; n++) {
                        _this.getChildByName("health" + (n).toString()).texture = AssetManager.getBitmap("GT_health_png", true, true).texture;
                    }
                    break;
            }
            _this.health = healthNum;
            switch (_this.direction) {
                case "left":
                    GameGestureItemClass.leftHealth = _this.health;
                    break;
                case "right":
                    GameGestureItemClass.rightHealth = _this.health;
                    break;
            }
        };
        _this.direction = direction_;
        _this.health1 = AssetManager.getBitmap("GT_health_png");
        _this.health1.x = 14;
        _this.health1.y = 15;
        _this.health1.name = "health1";
        _this.addChild(_this.health1);
        _this.health2 = AssetManager.getBitmap("GT_health_png");
        _this.health2.x = 51;
        _this.health2.y = 15;
        _this.health2.name = "health2";
        _this.addChild(_this.health2);
        _this.health3 = AssetManager.getBitmap("GT_health_png");
        _this.health3.x = 88;
        _this.health3.y = 15;
        _this.health3.name = "health3";
        _this.addChild(_this.health3);
        return _this;
    }
    return healthCtrlor;
}(egret.DisplayObjectContainer));
__reflect(healthCtrlor.prototype, "healthCtrlor");
var GameGestureEventClass = (function () {
    function GameGestureEventClass() {
    }
    GameGestureEventClass.gameOver = function (result) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
        console.log("now is over!");
        var resultImg;
        var name;
        switch (result) {
            case 1:
                name = "GT_lose_png";
                break;
            case 3:
                name = "GT_win_png";
                break;
        }
        var backMask = AssetManager.getBitmap("GT_mask_png", false, false);
        backMask.x = 0;
        backMask.y = 0;
        backMask.alpha = 0.6;
        GameGestureMainScene.instance.addChild(backMask);
        resultImg = AssetManager.getBitmap(name);
        resultImg.x = 320;
        resultImg.y = 600;
        resultImg.scaleX = 0.01;
        resultImg.scaleY = 0.01;
        GameGestureMainScene.instance.addChild(resultImg);
        var tw = egret.Tween.get(resultImg);
        tw.to({ scaleX: 1, scaleY: 1 }, 1500, egret.Ease.elasticInOut).call(function () {
            egret.Tween.removeAllTweens();
        });
    };
    GameGestureEventClass.EVENT_GAMEREADY = "r";
    GameGestureEventClass.EVENT_BREAK = "b";
    GameGestureEventClass.EVENT_LOST = "l";
    GameGestureEventClass.EVENT_WIN = "w";
    GameGestureEventClass.EVENT_LOSE = "ls";
    GameGestureEventClass.EVENT_SENDLLINE = "s";
    GameGestureEventClass.messageSendCenter = function (msg, ary) {
        if (ary === void 0) { ary = []; }
        if (GameGestureItemClass.isOffline == true) {
            return;
        }
        switch (msg) {
            case GameGestureEventClass.EVENT_GAMEREADY:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_GAMEREADY, 1);
                break;
            case GameGestureEventClass.EVENT_BREAK:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_BREAK + "|" + ary[0].toString());
                break;
            case GameGestureEventClass.EVENT_LOST:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_LOST);
                break;
            case GameGestureEventClass.EVENT_LOSE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_LOSE + "|" + ary[0].toString());
                break;
            case GameGestureEventClass.EVENT_WIN:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_WIN + "|" + ary[0].toString());
                break;
            case GameGestureEventClass.EVENT_SENDLLINE:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameGestureEventClass.EVENT_SENDLLINE + "|" + ary[0].toString());
                break;
            default:
                console.log("illegal message in messageSendCenter!");
                break;
        }
    };
    GameGestureEventClass.messageReceiveCenter = function (data) {
        var cmdString;
        cmdString = data.event.split("|");
        switch (cmdString[0]) {
            case GameGestureEventClass.EVENT_GAMEREADY:
                switch (data.userId.toString()) {
                    case DataCenter.instance.user.id.toString():
                        GameGestureItemClass.readyState[0] = 1;
                        break;
                    case DataCenter.instance.room.player.id.toString():
                        GameGestureItemClass.readyState[1] = 1;
                        break;
                }
                break;
            case GameGestureEventClass.EVENT_BREAK:
                GameGestureLogic.extraMakeItems(parseInt(cmdString[1]));
                break;
            case GameGestureEventClass.EVENT_LOST:
                GameGestureItemClass.rightHealthCtrlor.subtractHealth();
                break;
            case GameGestureEventClass.EVENT_LOSE:
                GameGestureItemClass.resultPool[1] = 0;
                break;
            case GameGestureEventClass.EVENT_WIN:
                GameGestureItemClass.resultPool[1] = 1;
                GameGestureItemClass.rightTimeDvalue = parseInt(cmdString[1]);
                break;
            case GameGestureEventClass.EVENT_SENDLLINE:
                GameGestureItemClass.otherlowest = parseInt(cmdString[1]);
                egret.Tween.removeTweens(GameGestureItemClass.otherLine);
                GameGestureItemClass.otherLineTW = egret.Tween.get(GameGestureItemClass.otherLine);
                GameGestureItemClass.otherLineTW.to({ y: GameGestureItemClass.otherlowest }, 500).to({ y: -100 }, 500);
                break;
        }
    };
    GameGestureEventClass.resultMessageCenter = function (data) {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        App.TimerManager.doTimer(3500, 1, function () {
            GameGestureMainScene.instance.popup("GameResult", null);
        }, GameGestureMainScene.instance);
    };
    return GameGestureEventClass;
}());
__reflect(GameGestureEventClass.prototype, "GameGestureEventClass");
var GameGestureItemClass = (function () {
    function GameGestureItemClass() {
    }
    GameGestureItemClass.multiple = 1;
    GameGestureItemClass.scoreYou = 0;
    GameGestureItemClass.scoreOther = 0;
    GameGestureItemClass.gestureScore = 0;
    GameGestureItemClass.mouseDBArray = ["GT_blue", "GT_cheng1", "GT_green", "GT_powder", "GT_red"];
    GameGestureItemClass.leftHealth = 3;
    GameGestureItemClass.rightHealth = 3;
    GameGestureItemClass.readyState = [0, 0];
    GameGestureItemClass.speedTime = 7000;
    GameGestureItemClass.lineY = 0;
    GameGestureItemClass.isRunning = true;
    GameGestureItemClass.resultPool = [0, 0];
    GameGestureItemClass.runningSec = 0;
    GameGestureItemClass.lowestLine = -10;
    GameGestureItemClass.otherlowest = 0;
    GameGestureItemClass.AiSuccess = 0;
    GameGestureItemClass.soundWay_num = 1;
    GameGestureItemClass.itemList = [];
    GameGestureItemClass.isLocal = false;
    GameGestureItemClass.dispose = function () {
        GameGestureItemClass.multiple = 1;
        GameGestureItemClass.backGround = undefined;
        GameGestureItemClass.scoreYou = 0;
        GameGestureItemClass.scoreOther = 0;
        GameGestureItemClass.gestureType = undefined;
        GameGestureItemClass.gestureScore = 0;
        GameGestureItemClass.backGroundLight = undefined;
        GameGestureItemClass.ScoreColumn = undefined;
        GameGestureItemClass.headIcoLeft = undefined;
        GameGestureItemClass.headIcoRight = undefined;
        GameGestureItemClass.desk = undefined;
        GameGestureItemClass.foodLeft = undefined;
        GameGestureItemClass.foodRight = undefined;
        GameGestureItemClass.foodMid = undefined;
        GameGestureItemClass.leftHealthCtrlor = undefined;
        GameGestureItemClass.rightHealthCtrlor = undefined;
        GameGestureItemClass.leftHealth = 3;
        GameGestureItemClass.rightHealth = 3;
        GameGestureItemClass.readyState = [0, 0];
        GameGestureItemClass.isOffline = undefined;
        GameGestureItemClass.speedTime = 5000;
        GameGestureItemClass.lineY = 0;
        GameGestureItemClass.isRunning = true;
        GameGestureItemClass.resultPool = [0, 0];
        GameGestureItemClass.runningSec = 0;
        GameGestureItemClass.rightTimeDvalue = undefined;
        GameGestureItemClass.lowestLine = 0;
        GameGestureItemClass.otherlowest = 0;
        GameGestureItemClass.otherLine = undefined;
        GameGestureItemClass.otherLineTW = undefined;
        GameGestureItemClass.AiSuccess = 0;
        GameGestureItemClass.autonomy = undefined;
        GameGestureItemClass.soundWay_1 = undefined;
        GameGestureItemClass.soundWay_2 = undefined;
        GameGestureItemClass.soundWay_3 = undefined;
        GameGestureItemClass.soundWay_num = 1;
        GameGestureItemClass.isLocal = false;
    };
    return GameGestureItemClass;
}());
__reflect(GameGestureItemClass.prototype, "GameGestureItemClass");
var GameGestureLogic = (function () {
    function GameGestureLogic() {
    }
    GameGestureLogic.symbol = [-1, 1];
    GameGestureLogic.mainTick = function () {
        if (GameGestureItemClass.isRunning == false) {
            return false;
        }
        GameGestureItemClass.runningSec += 1;
        // GameGestureLogic.sendLow();
        GameGestureLogic.result();
        if (GameGestureItemClass.speedTime > 1000 && GameGestureItemClass.runningSec >= 900) {
            GameGestureItemClass.speedTime -= 1;
        }
        if (GameGestureItemClass.runningSec == 900) {
            GameGestureMainScene.gesturePanel.extraStart();
        }
        return false;
    };
    GameGestureLogic.result = function () {
        if (GameGestureItemClass.leftHealth == 0) {
            GameGestureItemClass.isRunning = false;
            GameGestureItemClass.resultPool[0] = 0;
            console.log("lose!");
            egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
            GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_LOSE, [GameGestureItemClass.runningSec]);
            App.TimerManager.doTimer(300, 1, function () {
                GameGestureLogic.resultDeal();
            }, GameGestureMainScene.instance);
            GameGestureLogic.dispose();
        }
        else if (GameGestureItemClass.rightHealth == 0) {
            GameGestureItemClass.isRunning = false;
            GameGestureItemClass.resultPool[0] = 1;
            console.log("win!");
            egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
            GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_WIN, [GameGestureItemClass.runningSec]);
            App.TimerManager.doTimer(300, 1, function () {
                GameGestureLogic.resultDeal();
            }, GameGestureMainScene.instance);
            GameGestureLogic.dispose();
        }
    };
    GameGestureLogic.resultDeal = function () {
        if (GameGestureItemClass.resultPool[0] == 1 && GameGestureItemClass.resultPool[1] == 1) {
            if (GameGestureItemClass.runningSec > GameGestureItemClass.rightTimeDvalue) {
                GameGestureEventClass.gameOver(1);
            }
            else if (GameGestureItemClass.runningSec < GameGestureItemClass.rightTimeDvalue) {
                GameGestureEventClass.gameOver(3);
            }
            else {
                if (parseInt(DataCenter.instance.user.id.toString()) > parseInt(DataCenter.instance.room.player.id.toString())) {
                    GameGestureEventClass.gameOver(3);
                }
                else {
                    GameGestureEventClass.gameOver(1);
                }
            }
        }
        else if (GameGestureItemClass.resultPool[0] == 1 && GameGestureItemClass.resultPool[1] == 0) {
            GameGestureEventClass.gameOver(3);
        }
        else if (GameGestureItemClass.resultPool[0] == 0 && GameGestureItemClass.resultPool[1] == 1) {
            GameGestureEventClass.gameOver(1);
        }
        else {
            GameGestureEventClass.gameOver(1);
        }
    };
    GameGestureLogic.readyTick = function () {
        switch (GameGestureItemClass.isOffline) {
            case false:
                if (GameGestureItemClass.readyState[0] == 1 && GameGestureItemClass.readyState[1] == 1) {
                    GameGestureItemClass.readyState = [0, 0];
                    egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
                    GameGestureLogic.gameStart();
                    return false;
                }
                break;
            case true:
                egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
                App.TimerManager.doTimer(1500 * Math.random(), 1, GameGestureLogic.gameStart, GameGestureMainScene);
                return false;
        }
        return false;
    };
    GameGestureLogic.gameStart = function () {
        egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
        GameGestureMainScene.instance.rdy.x = 300;
        GameGestureMainScene.instance.rdy.y = App.GameHeight / 2;
        GameGestureMainScene.instance.rdy.play();
        GameGestureMainScene.instance.addChildAt(GameGestureMainScene.instance.rdy, 15);
        egret.startTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
    };
    GameGestureLogic.extraMakeItems = function (itemNum) {
        // for (let index = 0; index < itemNum; index++) {
        //     GameGestureMainScene.gesturePanel.itemMakeOne(1);
        // }
        GameGestureMainScene.gesturePanel.itemMakeOne(itemNum);
    };
    GameGestureLogic.foodManager = function (num, isSet) {
        if (isSet === void 0) { isSet = false; }
        num += 1;
        GameGestureLogic.foodEffect(num, isSet);
    };
    GameGestureLogic.foodEffect = function (num, isSet) {
        if (isSet === void 0) { isSet = false; }
        switch (isSet) {
            case false:
                var tw = egret.Tween.get(GameGestureMainScene.instance.getChildByName("food" + num.toString()));
                tw.to({ alpha: 0 }, 500);
                var smoke = AssetManager.getDBArmature("GT_smoke");
                smoke.x = GameGestureMainScene.instance.getChildByName("food" + num.toString()).x + 80;
                smoke.y = GameGestureMainScene.instance.getChildByName("food" + num.toString()).y - 50;
                GameGestureMainScene.instance.addChild(smoke);
                smoke.play("boom" + App.RandomUtils.limitInteger(1, 7).toString(), 1);
                break;
            case true:
                for (var index = 1; index <= num; index++) {
                    GameGestureMainScene.instance.getChildByName("food" + (4 - num).toString()).alpha = 1;
                }
                break;
        }
    };
    GameGestureLogic.sendLow = function () {
        if (GameGestureItemClass.runningSec % 40 == 0) {
            if (GameGestureItemClass.isOffline == false) {
                GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_SENDLLINE, [GameGestureItemClass.lowestLine]);
            }
            else {
                egret.Tween.removeTweens(GameGestureItemClass.otherLine);
                // console.log(GameGestureItemClass.lowestLine - 200 + App.RandomUtils.randomArray(GameGestureLogic.symbol) * 400 * Math.random());
                GameGestureItemClass.otherLineTW = egret.Tween.get(GameGestureItemClass.otherLine);
                GameGestureItemClass.otherLineTW.to({ y: GameGestureItemClass.lowestLine - 200 + App.RandomUtils.randomArray(GameGestureLogic.symbol) * 400 * Math.random() }, 500).to({ y: -100 }, 2000);
            }
        }
    };
    GameGestureLogic.dispose = function () {
        egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
        egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
        //GameGestureAutonomy.instance.stop();
        GameGestureMainScene.gesturePanel.stop();
        GameGestureItemClass.backGround.touchEnabled = false;
    };
    return GameGestureLogic;
}());
__reflect(GameGestureLogic.prototype, "GameGestureLogic");
var GameGestureMainScene = (function (_super) {
    __extends(GameGestureMainScene, _super);
    function GameGestureMainScene() {
        var _this = _super.call(this) || this;
        _this.panel = new GesturePanel();
        _this.AiConf = {};
        _this.rdy = new GameReady(function () {
            _this.teach();
        });
        _this.getSType = function (who) {
            var SexIcon = 0;
            var getIcon = function (sexType) {
                switch (sexType) {
                    case 1:
                        SexIcon = 1;
                        break;
                    case 2:
                        SexIcon = 2;
                        break;
                    default:
                        SexIcon = 1;
                        break;
                }
            };
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
        };
        _this.teach = function () {
            _this.teachMask = AssetManager.getBitmap("GT_mask_png", false, false);
            _this.teachMask.x = 0;
            _this.teachMask.y = 0;
            _this.teachMask.alpha = 0.3;
            _this.addChildAt(_this.teachMask, 21);
            console.log("teach!");
            _this.teachV = AssetManager.getBitmap("GT_teachV_png");
            _this.teachV.x = 320;
            _this.teachV.y = 700;
            _this.addChildAt(_this.teachV, 22);
            _this.finger = AssetManager.getBitmap("GT_finger_png", false, false);
            _this.finger.anchorOffsetX = 27;
            _this.finger.anchorOffsetY = 22;
            _this.finger.x = 231;
            _this.finger.y = 629;
            _this.addChildAt(_this.finger, 23);
            var twV = egret.Tween.get(_this.finger, { loop: true });
            twV.to({ x: 321, y: 774 }, 900).to({ x: 417, y: 629 }, 900).call(function () {
                _this.finger.x = 231;
                _this.finger.y = 629;
            });
            GameGestureMainScene.gesturePanel.itemMakeOne(1, 1);
            App.TimerManager.doTimer(3000, 1, function () {
                egret.Tween.removeTweens(_this.finger);
                _this.removeChild(_this.finger);
                _this.removeChild(_this.teachV);
                _this.teachDelta = AssetManager.getBitmap("GT_teachDelta_png");
                _this.teachDelta.x = 320;
                _this.teachDelta.y = 700;
                _this.addChildAt(_this.teachDelta, 22);
                _this.finger = AssetManager.getBitmap("GT_finger_png", false, false);
                _this.finger.anchorOffsetX = 27;
                _this.finger.anchorOffsetY = 22;
                _this.finger.x = 324;
                _this.finger.y = 624;
                _this.addChildAt(_this.finger, 23);
                var twV = egret.Tween.get(_this.finger, { loop: true });
                twV.to({ x: 227, y: 789 }, 900).to({ x: 419, y: 789 }, 900).to({ x: 324, y: 624 }, 900).call(function () {
                    _this.finger.x = 324;
                    _this.finger.y = 624;
                });
                GameGestureMainScene.gesturePanel.itemMakeOne(1, 2);
                App.TimerManager.doTimer(3000, 1, function () {
                    egret.Tween.removeTweens(_this.finger);
                    _this.removeChild(_this.finger);
                    _this.removeChild(_this.teachMask);
                    _this.removeChild(_this.teachDelta);
                    console.log("teach over!");
                    GameGestureMainScene.gesturePanel.start();
                    console.log("maker now is running!");
                }, GameGestureMainScene.instance);
            }, GameGestureMainScene.instance);
        };
        _this.gameInit = function () {
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, GameGestureEventClass.messageReceiveCenter, GameGestureMainScene.instance);
            App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, GameGestureEventClass.resultMessageCenter, GameGestureMainScene.instance);
            GameGestureMainScene.gesturePanel = new GameGestureItemMaker();
            if (!App.IsXiaoMi) {
                switch (App.CurrGameAiLevel) {
                    case 1:
                        GameGestureItemClass.AiSuccess = 0.72;
                        GameGestureItemClass.autonomy = 1500;
                        break;
                    case 2:
                        GameGestureItemClass.AiSuccess = 0.78;
                        GameGestureItemClass.autonomy = 1800;
                        break;
                    case 3:
                        GameGestureItemClass.AiSuccess = 0.84;
                        GameGestureItemClass.autonomy = 2100;
                        break;
                    case 4:
                        GameGestureItemClass.AiSuccess = 0.9;
                        GameGestureItemClass.autonomy = 2400;
                        break;
                    case 5:
                        GameGestureItemClass.AiSuccess = 0.95;
                        GameGestureItemClass.autonomy = 3000;
                        break;
                }
            }
            egret.startTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
            GameGestureItemClass.backGround = AssetManager.getBitmap("GT_backGround_jpg", false, false);
            GameGestureItemClass.backGround.x = 0;
            GameGestureItemClass.backGround.y = 0;
            GameGestureItemClass.backGround.touchEnabled = true;
            _this.addChildAt(GameGestureItemClass.backGround, 1);
            GameGestureItemClass.desk = AssetManager.getBitmap("GT_desk_png", false, false);
            GameGestureItemClass.desk.anchorOffsetY = GameGestureItemClass.desk.height;
            GameGestureItemClass.desk.x = 0;
            GameGestureItemClass.desk.y = 1136;
            _this.addChildAt(GameGestureItemClass.desk, 2);
            _this.addChildAt(GameGestureMainScene.gesturePanel, 3);
            GameGestureItemClass.backGroundLight = AssetManager.getBitmap("GT_backGroundLight_png", false, false);
            GameGestureItemClass.backGroundLight.x = 0;
            GameGestureItemClass.backGroundLight.y = 0;
            _this.addChildAt(GameGestureItemClass.backGroundLight, 4);
            GameGestureItemClass.headIcoLeft = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 84, 84);
            GameGestureItemClass.headIcoLeft.x = 89;
            GameGestureItemClass.headIcoLeft.y = 17;
            _this.addChildAt(GameGestureItemClass.headIcoLeft, 5);
            GameGestureItemClass.headIcoRight = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 84, 84);
            GameGestureItemClass.headIcoRight.x = 495;
            GameGestureItemClass.headIcoRight.y = 17;
            _this.addChildAt(GameGestureItemClass.headIcoRight, 6);
            GameGestureItemClass.ScoreColumn = AssetManager.getBitmap("GT_scoreColumn_png", false, false);
            GameGestureItemClass.ScoreColumn.x = 88;
            GameGestureItemClass.ScoreColumn.y = 16;
            _this.addChildAt(GameGestureItemClass.ScoreColumn, 7);
            GameGestureItemClass.leftHealthCtrlor = new healthCtrlor("left");
            GameGestureItemClass.leftHealthCtrlor.x = 199;
            GameGestureItemClass.leftHealthCtrlor.y = 61;
            _this.addChildAt(GameGestureItemClass.leftHealthCtrlor, 8);
            GameGestureItemClass.rightHealthCtrlor = new healthCtrlor("right");
            GameGestureItemClass.rightHealthCtrlor.x = 372;
            GameGestureItemClass.rightHealthCtrlor.y = 61;
            _this.addChildAt(GameGestureItemClass.rightHealthCtrlor, 9);
            var leftSexTypeIcon = _this.getSType(0);
            leftSexTypeIcon.x = 176;
            leftSexTypeIcon.y = 25;
            _this.addChildAt(leftSexTypeIcon, 10);
            var rightSexTypeIcon = _this.getSType(1);
            rightSexTypeIcon.x = 463;
            rightSexTypeIcon.y = 25;
            _this.addChildAt(rightSexTypeIcon, 11);
            var leftName = new egret.TextField();
            leftName.width = 110;
            leftName.height = 16;
            leftName.size = 16;
            leftName.x = 209;
            leftName.y = 30;
            leftName.textColor = 0xffffff;
            leftName.textAlign = egret.HorizontalAlign.LEFT;
            leftName.verticalAlign = egret.VerticalAlign.MIDDLE;
            leftName.text = DataCenter.instance.user.name;
            _this.addChildAt(leftName, 12);
            var rightName = new egret.TextField();
            rightName.width = 110;
            rightName.height = 16;
            rightName.size = 16;
            rightName.x = 344;
            rightName.y = 30;
            rightName.textColor = 0xffffff;
            rightName.textAlign = egret.HorizontalAlign.RIGHT;
            rightName.verticalAlign = egret.VerticalAlign.MIDDLE;
            rightName.text = DataCenter.instance.room.player.name;
            _this.addChildAt(rightName, 13);
            _this.dishes1 = AssetManager.getBitmap("GT_dish_png", false, false);
            _this.dishes1.x = 66;
            _this.dishes1.y = 1066;
            _this.dishes1.anchorOffsetY = _this.dishes1.height;
            _this.addChildAt(_this.dishes1, 14);
            _this.dishes2 = AssetManager.getBitmap("GT_dish_png", false, false);
            _this.dishes2.x = 256;
            _this.dishes2.y = 1066;
            _this.dishes2.anchorOffsetY = _this.dishes2.height;
            _this.addChildAt(_this.dishes2, 15);
            _this.dishes3 = AssetManager.getBitmap("GT_dish_png", false, false);
            _this.dishes3.x = 450;
            _this.dishes3.y = 1066;
            _this.dishes3.anchorOffsetY = _this.dishes3.height;
            _this.addChildAt(_this.dishes3, 16);
            GameGestureItemClass.foodLeft = AssetManager.getBitmap("GT_foodLeft_png", false, false);
            GameGestureItemClass.foodLeft.anchorOffsetY = GameGestureItemClass.foodLeft.height;
            GameGestureItemClass.foodLeft.y = 1066;
            GameGestureItemClass.foodLeft.x = 66;
            GameGestureItemClass.foodLeft.name = "food3";
            _this.addChildAt(GameGestureItemClass.foodLeft, 17);
            GameGestureItemClass.foodMid = AssetManager.getBitmap("GT_foodMid_png", false, false);
            GameGestureItemClass.foodMid.anchorOffsetY = GameGestureItemClass.foodMid.height;
            GameGestureItemClass.foodMid.y = 1066;
            GameGestureItemClass.foodMid.x = 256;
            GameGestureItemClass.foodMid.name = "food1";
            _this.addChildAt(GameGestureItemClass.foodMid, 18);
            GameGestureItemClass.foodRight = AssetManager.getBitmap("GT_foodRight_png", false, false);
            GameGestureItemClass.foodRight.anchorOffsetY = GameGestureItemClass.foodRight.height;
            GameGestureItemClass.foodRight.y = 1066;
            GameGestureItemClass.foodRight.x = 450;
            GameGestureItemClass.foodRight.name = "food2";
            _this.addChildAt(GameGestureItemClass.foodRight, 19);
            GameGestureItemClass.otherLine = AssetManager.getBitmap("GT_lLine_png", false, false);
            GameGestureItemClass.otherLine.x = 0;
            GameGestureItemClass.otherLine.y = -100;
            GameGestureItemClass.otherLine.alpha = 0;
            _this.addChildAt(GameGestureItemClass.otherLine, 20);
            var leftSide = AssetManager.getBitmap("GT_mask_png", false, false);
            leftSide.anchorOffsetX = 640;
            leftSide.anchorOffsetY = 0;
            leftSide.x = 0;
            leftSide.y = 0;
            _this.addChildAt(leftSide, 25);
            var rightSide = AssetManager.getBitmap("GT_mask_png", false, false);
            rightSide.anchorOffsetX = 0;
            rightSide.anchorOffsetY = 0;
            rightSide.x = 640;
            rightSide.y = 0;
            _this.addChildAt(rightSide, 26);
            var topSide = AssetManager.getBitmap("GT_mask_png", false, false);
            topSide.anchorOffsetX = 0;
            topSide.anchorOffsetY = 1136;
            topSide.x = 0;
            topSide.y = 0;
            _this.addChildAt(topSide, 27);
            var botSide = AssetManager.getBitmap("GT_mask_png", false, false);
            botSide.anchorOffsetX = 0;
            botSide.anchorOffsetY = 0;
            botSide.x = 0;
            botSide.y = 1136;
            _this.addChildAt(botSide, 28);
            _this.panel.init();
            _this.panel.width = 640;
            _this.panel.height = 1136;
            _this.panel.x = 0;
            _this.panel.y = 0;
            _this.panel.addEvent(GameGestureItemClass.backGround);
            _this.addChildAt(_this.panel, 24);
            // 小米平台去掉退出按钮
            if (!App.IsXiaoMi && !App.IsWanba) {
                var returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
                returnToLastButton.y = 19;
                returnToLastButton.name = "backBtn";
                _this.addChild(returnToLastButton);
                returnToLastButton.touchEnabled = true;
                returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    _this.popup("GameSureLeave");
                }, _this);
            }
            if (_this.stage.stageHeight < 1136) {
                GameGestureItemClass.multiple = (_this.stage.stageHeight / 1136);
                _this.scaleX = GameGestureItemClass.multiple;
                _this.scaleY = GameGestureItemClass.multiple;
                var nowWidth = 640 * GameGestureItemClass.multiple;
                _this.x = (640 - nowWidth) / 2;
                GameGestureItemClass.isLocal = true;
            }
            else if (_this.stage.stageHeight > 1136) {
                _this.y = (_this.stage.stageHeight - 1136) / 2;
                _this.panel.y -= _this.y;
                GameGestureItemClass.isLocal = false;
            }
            switch (GameGestureItemClass.isOffline) {
                case true:
                    break;
                case false:
                    GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_GAMEREADY);
                    break;
            }
        };
        GameGestureMainScene.instance = _this;
        if (App.IsXiaoMi) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, function (data) {
                GameGestureMainScene.instance.AiConf = data;
                var conf = GameGestureMainScene.instance.AiConf[App.CurrGameAiLevel];
                GameGestureItemClass.AiSuccess = conf.s;
                GameGestureItemClass.autonomy = conf.a;
                console.log(">>>>> conf :", conf.s, conf.a);
            });
        }
        return _this;
    }
    GameGestureMainScene.prototype.init = function () {
        _super.prototype.init.call(this);
        if (DataCenter.instance.room.IsAI == true) {
            GameGestureItemClass.isOffline = true;
        }
        else {
            GameGestureItemClass.isOffline = false;
        }
        App.SoundManager.stopBg();
        App.SoundManager.playBg("GT_bgm_mp3");
        GameGestureItemClass.soundWay_1 = new SoundEffects();
        GameGestureItemClass.soundWay_1.setVolume(0.8);
        GameGestureItemClass.soundWay_2 = new SoundEffects();
        GameGestureItemClass.soundWay_2.setVolume(0.8);
        GameGestureItemClass.soundWay_3 = new SoundEffects();
        GameGestureItemClass.soundWay_3.setVolume(0.8);
        egret.lifecycle.onPause = function () {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GameGestureItemClass.soundWay_1) {
                GameGestureItemClass.soundWay_1.setVolume(0);
            }
            if (GameGestureItemClass.soundWay_2) {
                GameGestureItemClass.soundWay_2.setVolume(0);
            }
            if (GameGestureItemClass.soundWay_3) {
                GameGestureItemClass.soundWay_3.setVolume(0);
            }
        };
        egret.lifecycle.onResume = function () {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GameGestureItemClass.soundWay_1) {
                GameGestureItemClass.soundWay_1.setVolume(0.8);
            }
            if (GameGestureItemClass.soundWay_2) {
                GameGestureItemClass.soundWay_2.setVolume(0.8);
            }
            if (GameGestureItemClass.soundWay_3) {
                GameGestureItemClass.soundWay_3.setVolume(0.8);
            }
        };
        this.gameInit();
    };
    GameGestureMainScene.prototype.dispose = function () {
        egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
        egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, GameGestureEventClass.messageReceiveCenter, GameGestureMainScene.instance);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, GameGestureEventClass.resultMessageCenter, GameGestureMainScene.instance);
        App.TimerManager.removeAll(GameGestureMainScene.instance);
        App.TimerManager.removeAll(GameGestureMainScene.gesturePanel);
        //GameGestureAutonomy.instance.stop();
        GameGestureMainScene.gesturePanel.stop();
        this.panel.dispose(GameGestureItemClass.backGround);
        egret.Tween.removeAllTweens();
        GameGestureItemClass.dispose();
        App.SoundManager.stopBg();
        GameGestureMainScene.instance = undefined;
        GameGestureMainScene.gesturePanel = undefined;
        for (var index = 0; index < GameGestureItemClass.itemList.length; index++) {
            GameGestureItemClass.itemList[index].dispose();
        }
        GameGestureItemClass.itemList = [];
        _super.prototype.dispose.call(this);
    };
    return GameGestureMainScene;
}(State));
__reflect(GameGestureMainScene.prototype, "GameGestureMainScene");
var GesturePanel = (function (_super) {
    __extends(GesturePanel, _super);
    function GesturePanel() {
        var _this = _super.call(this) || this;
        _this.gestureUtil = ur.UnistrokeRecognize.create();
        _this._mouseEffectPoints = [];
        _this.particleStarsTexture = RES.getRes("GT_stars_png");
        _this.particleStarsConfig = RES.getRes("GT_stars_json");
        _this.touchMask = new egret.DisplayObject();
        //响应函数
        _this.mouseDown = function (evt) {
            _this._layer.graphics.clear();
            _this._layer.graphics.lineStyle(15, 0xbefe24);
            var p;
            switch (GameGestureItemClass.isLocal) {
                case true:
                    p = new ur.Point(evt.localX, evt.localY);
                    break;
                case false:
                    p = new ur.Point(evt.stageX, evt.stageY);
                    break;
            }
            var ep;
            switch (GameGestureItemClass.isLocal) {
                case true:
                    ep = [evt.localX, evt.localY];
                    break;
                case false:
                    ep = [evt.stageX, evt.stageY];
                    break;
            }
            _this._mouseEffectPoints.push(ep);
            _this._currentPoint = p;
            _this._layer.graphics.moveTo(_this._currentPoint.x, _this._currentPoint.y);
            _this._mousePoints = [];
            _this._mousePoints.push(p);
            _this.startTime = new Date().getTime();
            _this.stage.addChild(_this.touchMask);
            _this.addTouchEvent(_this.touchMask);
        };
        _this.mouseMove = function (evt) {
            var p;
            switch (GameGestureItemClass.isLocal) {
                case true:
                    p = new ur.Point(evt.localX, evt.localY);
                    break;
                case false:
                    p = new ur.Point(evt.stageX, evt.stageY);
                    break;
            }
            var ep;
            switch (GameGestureItemClass.isLocal) {
                case true:
                    ep = [evt.localX, evt.localY];
                    break;
                case false:
                    ep = [evt.stageX, evt.stageY];
                    break;
            }
            _this._mouseEffectPoints.push(ep);
            _this._mousePoints.push(p);
            _this._layer.graphics.lineTo(p.x, p.y);
            _this._currentPoint = p;
        };
        _this.mouseUp = function (evt) {
            App.TimerManager.remove(_this.clear, _this);
            var p;
            switch (GameGestureItemClass.isLocal) {
                case true:
                    p = new ur.Point(evt.localX, evt.localY);
                    break;
                case false:
                    p = new ur.Point(evt.stageX, evt.stageY);
                    break;
            }
            _this._mousePoints.push(p);
            // egret.log('===================');
            var result = _this.gestureUtil.recognize(_this._mousePoints, false);
            var timeUsed = new Date().getTime() - _this.startTime;
            // egret.log('time ==>', timeUsed);
            // egret.log('name:', result.name, 'score:', result.score);
            // let str = '手势名: ' + result.name + ',相似度: ' + result.score + ",用时：" + timeUsed;
            // window.alert(str);
            // console.log(result.score, result.name);
            if (result.score >= 0.7) {
                GameGestureItemClass.gestureType = result.name;
                GameGestureItemClass.gestureScore = result.score;
                App.TimerManager.doTimer(100, 1, _this.clear, _this);
            }
            _this._layer.graphics.clear();
            if (_this._mouseEffectPoints.length < 200) {
                var _effectBuffer_1 = [];
                for (var index = 0; index < _this._mouseEffectPoints.length; index++) {
                    var mouseEffect = new particle.GravityParticleSystem(_this.particleStarsTexture, _this.particleStarsConfig);
                    _this.addChild(mouseEffect);
                    _effectBuffer_1.push(mouseEffect);
                    mouseEffect.emitterX = _this._mouseEffectPoints[index][0];
                    mouseEffect.emitterY = _this._mouseEffectPoints[index][1];
                    if (_this._mouseEffectPoints.length <= 20) {
                        mouseEffect.maxParticles = 3;
                    }
                    else if (_this._mouseEffectPoints.length > 20 && _this._mouseEffectPoints.length < 50) {
                        mouseEffect.maxParticles = 2;
                    }
                    else {
                        mouseEffect.maxParticles = 1;
                    }
                    mouseEffect.start(300);
                }
                egret.setTimeout(function () {
                    for (var index = 0; index < _effectBuffer_1.length; index++) {
                        _this.removeChild(_effectBuffer_1[index]);
                    }
                }, _this, 320);
            }
            _this._mouseEffectPoints.splice(0, _this._mouseEffectPoints.length);
            // App.TimerManager.doTimer(300, 1, () => {
            // 	this._effectBuffer.forEach(element => {
            // 		this.removeChild(element);
            // 	});
            // 	this._mouseEffectPoints.splice(0, this._mouseEffectPoints.length);
            // 	this._effectBuffer.splice(0, this._effectBuffer.length);
            // }, this);
            _this.stage.removeChild(_this.touchMask);
            _this.disposeTouchEvent(_this.touchMask);
        };
        _this.clear = function () {
            GameGestureItemClass.gestureType = undefined;
            GameGestureItemClass.gestureScore = undefined;
        };
        _this.touchMask.$hitTest = function () {
            return this;
        };
        _this.touchMask.touchEnabled = true;
        return _this;
    }
    GesturePanel.prototype.init = function () {
        this._layer = new egret.Sprite();
        this._layer.$hitTest = function () {
            return null;
        };
        this._layer.width = 640;
        this._layer.height = 1136;
        this._layer.x = 0;
        this._layer.y = 0;
        this.addChild(this._layer);
        this.gestureUtil.addGesture("triangle", new Array(new ur.Point(137, 139), new ur.Point(135, 141), new ur.Point(133, 144), new ur.Point(132, 146), new ur.Point(130, 149), new ur.Point(128, 151), new ur.Point(126, 155), new ur.Point(123, 160), new ur.Point(120, 166), new ur.Point(116, 171), new ur.Point(112, 177), new ur.Point(107, 183), new ur.Point(102, 188), new ur.Point(100, 191), new ur.Point(95, 195), new ur.Point(90, 199), new ur.Point(86, 203), new ur.Point(82, 206), new ur.Point(80, 209), new ur.Point(75, 213), new ur.Point(73, 213), new ur.Point(70, 216), new ur.Point(67, 219), new ur.Point(64, 221), new ur.Point(61, 223), new ur.Point(60, 225), new ur.Point(62, 226), new ur.Point(65, 225), new ur.Point(67, 226), new ur.Point(74, 226), new ur.Point(77, 227), new ur.Point(85, 229), new ur.Point(91, 230), new ur.Point(99, 231), new ur.Point(108, 232), new ur.Point(116, 233), new ur.Point(125, 233), new ur.Point(134, 234), new ur.Point(145, 233), new ur.Point(153, 232), new ur.Point(160, 233), new ur.Point(170, 234), new ur.Point(177, 235), new ur.Point(179, 236), new ur.Point(186, 237), new ur.Point(193, 238), new ur.Point(198, 239), new ur.Point(200, 237), new ur.Point(202, 239), new ur.Point(204, 238), new ur.Point(206, 234), new ur.Point(205, 230), new ur.Point(202, 222), new ur.Point(197, 216), new ur.Point(192, 207), new ur.Point(186, 198), new ur.Point(179, 189), new ur.Point(174, 183), new ur.Point(170, 178), new ur.Point(164, 171), new ur.Point(161, 168), new ur.Point(154, 160), new ur.Point(148, 155), new ur.Point(143, 150), new ur.Point(138, 148), new ur.Point(136, 148)));
        // this.gestureUtil.addGesture("x",
        // 	new Array(new ur.Point(87, 142), new ur.Point(89, 145), new ur.Point(91, 148), new ur.Point(93, 151), new ur.Point(96, 155), new ur.Point(98, 157), new ur.Point(100, 160), new ur.Point(102, 162), new ur.Point(106, 167), new ur.Point(108, 169), new ur.Point(110, 171), new ur.Point(115, 177), new ur.Point(119, 183), new ur.Point(123, 189), new ur.Point(127, 193), new ur.Point(129, 196), new ur.Point(133, 200), new ur.Point(137, 206), new ur.Point(140, 209), new ur.Point(143, 212), new ur.Point(146, 215), new ur.Point(151, 220), new ur.Point(153, 222), new ur.Point(155, 223), new ur.Point(157, 225), new ur.Point(158, 223), new ur.Point(157, 218), new ur.Point(155, 211), new ur.Point(154, 208), new ur.Point(152, 200), new ur.Point(150, 189), new ur.Point(148, 179), new ur.Point(147, 170), new ur.Point(147, 158), new ur.Point(147, 148), new ur.Point(147, 141), new ur.Point(147, 136), new ur.Point(144, 135), new ur.Point(142, 137), new ur.Point(140, 139), new ur.Point(135, 145), new ur.Point(131, 152), new ur.Point(124, 163), new ur.Point(116, 177), new ur.Point(108, 191), new ur.Point(100, 206), new ur.Point(94, 217), new ur.Point(91, 222), new ur.Point(89, 225), new ur.Point(87, 226), new ur.Point(87, 224)));
        // this.gestureUtil.addGesture("rectangle",
        // 	new Array(new ur.Point(78, 149), new ur.Point(78, 153), new ur.Point(78, 157), new ur.Point(78, 160), new ur.Point(79, 162), new ur.Point(79, 164), new ur.Point(79, 167), new ur.Point(79, 169), new ur.Point(79, 173), new ur.Point(79, 178), new ur.Point(79, 183), new ur.Point(80, 189), new ur.Point(80, 193), new ur.Point(80, 198), new ur.Point(80, 202), new ur.Point(81, 208), new ur.Point(81, 210), new ur.Point(81, 216), new ur.Point(82, 222), new ur.Point(82, 224), new ur.Point(82, 227), new ur.Point(83, 229), new ur.Point(83, 231), new ur.Point(85, 230), new ur.Point(88, 232), new ur.Point(90, 233), new ur.Point(92, 232), new ur.Point(94, 233), new ur.Point(99, 232), new ur.Point(102, 233), new ur.Point(106, 233), new ur.Point(109, 234), new ur.Point(117, 235), new ur.Point(123, 236), new ur.Point(126, 236), new ur.Point(135, 237), new ur.Point(142, 238), new ur.Point(145, 238), new ur.Point(152, 238), new ur.Point(154, 239), new ur.Point(165, 238), new ur.Point(174, 237), new ur.Point(179, 236), new ur.Point(186, 235), new ur.Point(191, 235), new ur.Point(195, 233), new ur.Point(197, 233), new ur.Point(200, 233), new ur.Point(201, 235), new ur.Point(201, 233), new ur.Point(199, 231), new ur.Point(198, 226), new ur.Point(198, 220), new ur.Point(196, 207), new ur.Point(195, 195), new ur.Point(195, 181), new ur.Point(195, 173), new ur.Point(195, 163), new ur.Point(194, 155), new ur.Point(192, 145), new ur.Point(192, 143), new ur.Point(192, 138), new ur.Point(191, 135), new ur.Point(191, 133), new ur.Point(191, 130), new ur.Point(190, 128), new ur.Point(188, 129), new ur.Point(186, 129), new ur.Point(181, 132), new ur.Point(173, 131), new ur.Point(162, 131), new ur.Point(151, 132), new ur.Point(149, 132), new ur.Point(138, 132), new ur.Point(136, 132), new ur.Point(122, 131), new ur.Point(120, 131), new ur.Point(109, 130), new ur.Point(107, 130), new ur.Point(90, 132), new ur.Point(81, 133), new ur.Point(76, 133)));
        this.gestureUtil.addGesture("circle", new Array(new ur.Point(127, 141), new ur.Point(124, 140), new ur.Point(120, 139), new ur.Point(118, 139), new ur.Point(116, 139), new ur.Point(111, 140), new ur.Point(109, 141), new ur.Point(104, 144), new ur.Point(100, 147), new ur.Point(96, 152), new ur.Point(93, 157), new ur.Point(90, 163), new ur.Point(87, 169), new ur.Point(85, 175), new ur.Point(83, 181), new ur.Point(82, 190), new ur.Point(82, 195), new ur.Point(83, 200), new ur.Point(84, 205), new ur.Point(88, 213), new ur.Point(91, 216), new ur.Point(96, 219), new ur.Point(103, 222), new ur.Point(108, 224), new ur.Point(111, 224), new ur.Point(120, 224), new ur.Point(133, 223), new ur.Point(142, 222), new ur.Point(152, 218), new ur.Point(160, 214), new ur.Point(167, 210), new ur.Point(173, 204), new ur.Point(178, 198), new ur.Point(179, 196), new ur.Point(182, 188), new ur.Point(182, 177), new ur.Point(178, 167), new ur.Point(170, 150), new ur.Point(163, 138), new ur.Point(152, 130), new ur.Point(143, 129), new ur.Point(140, 131), new ur.Point(129, 136), new ur.Point(126, 139)));
        // this.gestureUtil.addGesture("check",
        // 	new Array(new ur.Point(91, 185), new ur.Point(93, 185), new ur.Point(95, 185), new ur.Point(97, 185), new ur.Point(100, 188), new ur.Point(102, 189), new ur.Point(104, 190), new ur.Point(106, 193), new ur.Point(108, 195), new ur.Point(110, 198), new ur.Point(112, 201), new ur.Point(114, 204), new ur.Point(115, 207), new ur.Point(117, 210), new ur.Point(118, 212), new ur.Point(120, 214), new ur.Point(121, 217), new ur.Point(122, 219), new ur.Point(123, 222), new ur.Point(124, 224), new ur.Point(126, 226), new ur.Point(127, 229), new ur.Point(129, 231), new ur.Point(130, 233), new ur.Point(129, 231), new ur.Point(129, 228), new ur.Point(129, 226), new ur.Point(129, 224), new ur.Point(129, 221), new ur.Point(129, 218), new ur.Point(129, 212), new ur.Point(129, 208), new ur.Point(130, 198), new ur.Point(132, 189), new ur.Point(134, 182), new ur.Point(137, 173), new ur.Point(143, 164), new ur.Point(147, 157), new ur.Point(151, 151), new ur.Point(155, 144), new ur.Point(161, 137), new ur.Point(165, 131), new ur.Point(171, 122), new ur.Point(174, 118), new ur.Point(176, 114), new ur.Point(177, 112), new ur.Point(177, 114), new ur.Point(175, 116), new ur.Point(173, 118)));
        this.gestureUtil.addGesture("caret", new Array(new ur.Point(79, 245), new ur.Point(79, 242), new ur.Point(79, 239), new ur.Point(80, 237), new ur.Point(80, 234), new ur.Point(81, 232), new ur.Point(82, 230), new ur.Point(84, 224), new ur.Point(86, 220), new ur.Point(86, 218), new ur.Point(87, 216), new ur.Point(88, 213), new ur.Point(90, 207), new ur.Point(91, 202), new ur.Point(92, 200), new ur.Point(93, 194), new ur.Point(94, 192), new ur.Point(96, 189), new ur.Point(97, 186), new ur.Point(100, 179), new ur.Point(102, 173), new ur.Point(105, 165), new ur.Point(107, 160), new ur.Point(109, 158), new ur.Point(112, 151), new ur.Point(115, 144), new ur.Point(117, 139), new ur.Point(119, 136), new ur.Point(119, 134), new ur.Point(120, 132), new ur.Point(121, 129), new ur.Point(122, 127), new ur.Point(124, 125), new ur.Point(126, 124), new ur.Point(129, 125), new ur.Point(131, 127), new ur.Point(132, 130), new ur.Point(136, 139), new ur.Point(141, 154), new ur.Point(145, 166), new ur.Point(151, 182), new ur.Point(156, 193), new ur.Point(157, 196), new ur.Point(161, 209), new ur.Point(162, 211), new ur.Point(167, 223), new ur.Point(169, 229), new ur.Point(170, 231), new ur.Point(173, 237), new ur.Point(176, 242), new ur.Point(177, 244), new ur.Point(179, 250), new ur.Point(181, 255), new ur.Point(182, 257)));
        // this.gestureUtil.addGesture("zig-zag",
        // 	new Array(new ur.Point(307, 216), new ur.Point(333, 186), new ur.Point(356, 215), new ur.Point(375, 186), new ur.Point(399, 216), new ur.Point(418, 186)));
        // this.gestureUtil.addGesture("arrow",
        // 	new Array(new ur.Point(68, 222), new ur.Point(70, 220), new ur.Point(73, 218), new ur.Point(75, 217), new ur.Point(77, 215), new ur.Point(80, 213), new ur.Point(82, 212), new ur.Point(84, 210), new ur.Point(87, 209), new ur.Point(89, 208), new ur.Point(92, 206), new ur.Point(95, 204), new ur.Point(101, 201), new ur.Point(106, 198), new ur.Point(112, 194), new ur.Point(118, 191), new ur.Point(124, 187), new ur.Point(127, 186), new ur.Point(132, 183), new ur.Point(138, 181), new ur.Point(141, 180), new ur.Point(146, 178), new ur.Point(154, 173), new ur.Point(159, 171), new ur.Point(161, 170), new ur.Point(166, 167), new ur.Point(168, 167), new ur.Point(171, 166), new ur.Point(174, 164), new ur.Point(177, 162), new ur.Point(180, 160), new ur.Point(182, 158), new ur.Point(183, 156), new ur.Point(181, 154), new ur.Point(178, 153), new ur.Point(171, 153), new ur.Point(164, 153), new ur.Point(160, 153), new ur.Point(150, 154), new ur.Point(147, 155), new ur.Point(141, 157), new ur.Point(137, 158), new ur.Point(135, 158), new ur.Point(137, 158), new ur.Point(140, 157), new ur.Point(143, 156), new ur.Point(151, 154), new ur.Point(160, 152), new ur.Point(170, 149), new ur.Point(179, 147), new ur.Point(185, 145), new ur.Point(192, 144), new ur.Point(196, 144), new ur.Point(198, 144), new ur.Point(200, 144), new ur.Point(201, 147), new ur.Point(199, 149), new ur.Point(194, 157), new ur.Point(191, 160), new ur.Point(186, 167), new ur.Point(180, 176), new ur.Point(177, 179), new ur.Point(171, 187), new ur.Point(169, 189), new ur.Point(165, 194), new ur.Point(164, 196)));
        // this.gestureUtil.addGesture("left square bracket",
        // 	new Array(new ur.Point(140, 124), new ur.Point(138, 123), new ur.Point(135, 122), new ur.Point(133, 123), new ur.Point(130, 123), new ur.Point(128, 124), new ur.Point(125, 125), new ur.Point(122, 124), new ur.Point(120, 124), new ur.Point(118, 124), new ur.Point(116, 125), new ur.Point(113, 125), new ur.Point(111, 125), new ur.Point(108, 124), new ur.Point(106, 125), new ur.Point(104, 125), new ur.Point(102, 124), new ur.Point(100, 123), new ur.Point(98, 123), new ur.Point(95, 124), new ur.Point(93, 123), new ur.Point(90, 124), new ur.Point(88, 124), new ur.Point(85, 125), new ur.Point(83, 126), new ur.Point(81, 127), new ur.Point(81, 129), new ur.Point(82, 131), new ur.Point(82, 134), new ur.Point(83, 138), new ur.Point(84, 141), new ur.Point(84, 144), new ur.Point(85, 148), new ur.Point(85, 151), new ur.Point(86, 156), new ur.Point(86, 160), new ur.Point(86, 164), new ur.Point(86, 168), new ur.Point(87, 171), new ur.Point(87, 175), new ur.Point(87, 179), new ur.Point(87, 182), new ur.Point(87, 186), new ur.Point(88, 188), new ur.Point(88, 195), new ur.Point(88, 198), new ur.Point(88, 201), new ur.Point(88, 207), new ur.Point(89, 211), new ur.Point(89, 213), new ur.Point(89, 217), new ur.Point(89, 222), new ur.Point(88, 225), new ur.Point(88, 229), new ur.Point(88, 231), new ur.Point(88, 233), new ur.Point(88, 235), new ur.Point(89, 237), new ur.Point(89, 240), new ur.Point(89, 242), new ur.Point(91, 241), new ur.Point(94, 241), new ur.Point(96, 240), new ur.Point(98, 239), new ur.Point(105, 240), new ur.Point(109, 240), new ur.Point(113, 239), new ur.Point(116, 240), new ur.Point(121, 239), new ur.Point(130, 240), new ur.Point(136, 237), new ur.Point(139, 237), new ur.Point(144, 238), new ur.Point(151, 237), new ur.Point(157, 236), new ur.Point(159, 237)));
        // this.gestureUtil.addGesture("right square bracket",
        // 	new Array(new ur.Point(112, 138), new ur.Point(112, 136), new ur.Point(115, 136), new ur.Point(118, 137), new ur.Point(120, 136), new ur.Point(123, 136), new ur.Point(125, 136), new ur.Point(128, 136), new ur.Point(131, 136), new ur.Point(134, 135), new ur.Point(137, 135), new ur.Point(140, 134), new ur.Point(143, 133), new ur.Point(145, 132), new ur.Point(147, 132), new ur.Point(149, 132), new ur.Point(152, 132), new ur.Point(153, 134), new ur.Point(154, 137), new ur.Point(155, 141), new ur.Point(156, 144), new ur.Point(157, 152), new ur.Point(158, 161), new ur.Point(160, 170), new ur.Point(162, 182), new ur.Point(164, 192), new ur.Point(166, 200), new ur.Point(167, 209), new ur.Point(168, 214), new ur.Point(168, 216), new ur.Point(169, 221), new ur.Point(169, 223), new ur.Point(169, 228), new ur.Point(169, 231), new ur.Point(166, 233), new ur.Point(164, 234), new ur.Point(161, 235), new ur.Point(155, 236), new ur.Point(147, 235), new ur.Point(140, 233), new ur.Point(131, 233), new ur.Point(124, 233), new ur.Point(117, 235), new ur.Point(114, 238), new ur.Point(112, 238)));
        this.gestureUtil.addGesture("v", new Array(new ur.Point(89, 164), new ur.Point(90, 162), new ur.Point(92, 162), new ur.Point(94, 164), new ur.Point(95, 166), new ur.Point(96, 169), new ur.Point(97, 171), new ur.Point(99, 175), new ur.Point(101, 178), new ur.Point(103, 182), new ur.Point(106, 189), new ur.Point(108, 194), new ur.Point(111, 199), new ur.Point(114, 204), new ur.Point(117, 209), new ur.Point(119, 214), new ur.Point(122, 218), new ur.Point(124, 222), new ur.Point(126, 225), new ur.Point(128, 228), new ur.Point(130, 229), new ur.Point(133, 233), new ur.Point(134, 236), new ur.Point(136, 239), new ur.Point(138, 240), new ur.Point(139, 242), new ur.Point(140, 244), new ur.Point(142, 242), new ur.Point(142, 240), new ur.Point(142, 237), new ur.Point(143, 235), new ur.Point(143, 233), new ur.Point(145, 229), new ur.Point(146, 226), new ur.Point(148, 217), new ur.Point(149, 208), new ur.Point(149, 205), new ur.Point(151, 196), new ur.Point(151, 193), new ur.Point(153, 182), new ur.Point(155, 172), new ur.Point(157, 165), new ur.Point(159, 160), new ur.Point(162, 155), new ur.Point(164, 150), new ur.Point(165, 148), new ur.Point(166, 146)));
        // this.gestureUtil.addGesture("delete",
        // 	new Array(new ur.Point(123, 129), new ur.Point(123, 131), new ur.Point(124, 133), new ur.Point(125, 136), new ur.Point(127, 140), new ur.Point(129, 142), new ur.Point(133, 148), new ur.Point(137, 154), new ur.Point(143, 158), new ur.Point(145, 161), new ur.Point(148, 164), new ur.Point(153, 170), new ur.Point(158, 176), new ur.Point(160, 178), new ur.Point(164, 183), new ur.Point(168, 188), new ur.Point(171, 191), new ur.Point(175, 196), new ur.Point(178, 200), new ur.Point(180, 202), new ur.Point(181, 205), new ur.Point(184, 208), new ur.Point(186, 210), new ur.Point(187, 213), new ur.Point(188, 215), new ur.Point(186, 212), new ur.Point(183, 211), new ur.Point(177, 208), new ur.Point(169, 206), new ur.Point(162, 205), new ur.Point(154, 207), new ur.Point(145, 209), new ur.Point(137, 210), new ur.Point(129, 214), new ur.Point(122, 217), new ur.Point(118, 218), new ur.Point(111, 221), new ur.Point(109, 222), new ur.Point(110, 219), new ur.Point(112, 217), new ur.Point(118, 209), new ur.Point(120, 207), new ur.Point(128, 196), new ur.Point(135, 187), new ur.Point(138, 183), new ur.Point(148, 167), new ur.Point(157, 153), new ur.Point(163, 145), new ur.Point(165, 142), new ur.Point(172, 133), new ur.Point(177, 127), new ur.Point(179, 127), new ur.Point(180, 125)));
        // this.gestureUtil.addGesture("left curly brace",
        // 	new Array(new ur.Point(150, 116), new ur.Point(147, 117), new ur.Point(145, 116), new ur.Point(142, 116), new ur.Point(139, 117), new ur.Point(136, 117), new ur.Point(133, 118), new ur.Point(129, 121), new ur.Point(126, 122), new ur.Point(123, 123), new ur.Point(120, 125), new ur.Point(118, 127), new ur.Point(115, 128), new ur.Point(113, 129), new ur.Point(112, 131), new ur.Point(113, 134), new ur.Point(115, 134), new ur.Point(117, 135), new ur.Point(120, 135), new ur.Point(123, 137), new ur.Point(126, 138), new ur.Point(129, 140), new ur.Point(135, 143), new ur.Point(137, 144), new ur.Point(139, 147), new ur.Point(141, 149), new ur.Point(140, 152), new ur.Point(139, 155), new ur.Point(134, 159), new ur.Point(131, 161), new ur.Point(124, 166), new ur.Point(121, 166), new ur.Point(117, 166), new ur.Point(114, 167), new ur.Point(112, 166), new ur.Point(114, 164), new ur.Point(116, 163), new ur.Point(118, 163), new ur.Point(120, 162), new ur.Point(122, 163), new ur.Point(125, 164), new ur.Point(127, 165), new ur.Point(129, 166), new ur.Point(130, 168), new ur.Point(129, 171), new ur.Point(127, 175), new ur.Point(125, 179), new ur.Point(123, 184), new ur.Point(121, 190), new ur.Point(120, 194), new ur.Point(119, 199), new ur.Point(120, 202), new ur.Point(123, 207), new ur.Point(127, 211), new ur.Point(133, 215), new ur.Point(142, 219), new ur.Point(148, 220), new ur.Point(151, 221)));
        // this.gestureUtil.addGesture("right curly brace",
        // 	new Array(new ur.Point(117, 132), new ur.Point(115, 132), new ur.Point(115, 129), new ur.Point(117, 129), new ur.Point(119, 128), new ur.Point(122, 127), new ur.Point(125, 127), new ur.Point(127, 127), new ur.Point(130, 127), new ur.Point(133, 129), new ur.Point(136, 129), new ur.Point(138, 130), new ur.Point(140, 131), new ur.Point(143, 134), new ur.Point(144, 136), new ur.Point(145, 139), new ur.Point(145, 142), new ur.Point(145, 145), new ur.Point(145, 147), new ur.Point(145, 149), new ur.Point(144, 152), new ur.Point(142, 157), new ur.Point(141, 160), new ur.Point(139, 163), new ur.Point(137, 166), new ur.Point(135, 167), new ur.Point(133, 169), new ur.Point(131, 172), new ur.Point(128, 173), new ur.Point(126, 176), new ur.Point(125, 178), new ur.Point(125, 180), new ur.Point(125, 182), new ur.Point(126, 184), new ur.Point(128, 187), new ur.Point(130, 187), new ur.Point(132, 188), new ur.Point(135, 189), new ur.Point(140, 189), new ur.Point(145, 189), new ur.Point(150, 187), new ur.Point(155, 186), new ur.Point(157, 185), new ur.Point(159, 184), new ur.Point(156, 185), new ur.Point(154, 185), new ur.Point(149, 185), new ur.Point(145, 187), new ur.Point(141, 188), new ur.Point(136, 191), new ur.Point(134, 191), new ur.Point(131, 192), new ur.Point(129, 193), new ur.Point(129, 195), new ur.Point(129, 197), new ur.Point(131, 200), new ur.Point(133, 202), new ur.Point(136, 206), new ur.Point(139, 211), new ur.Point(142, 215), new ur.Point(145, 220), new ur.Point(147, 225), new ur.Point(148, 231), new ur.Point(147, 239), new ur.Point(144, 244), new ur.Point(139, 248), new ur.Point(134, 250), new ur.Point(126, 253), new ur.Point(119, 253), new ur.Point(115, 253)));
        this.gestureUtil.addGesture("star", new Array(new ur.Point(75, 250), new ur.Point(75, 247), new ur.Point(77, 244), new ur.Point(78, 242), new ur.Point(79, 239), new ur.Point(80, 237), new ur.Point(82, 234), new ur.Point(82, 232), new ur.Point(84, 229), new ur.Point(85, 225), new ur.Point(87, 222), new ur.Point(88, 219), new ur.Point(89, 216), new ur.Point(91, 212), new ur.Point(92, 208), new ur.Point(94, 204), new ur.Point(95, 201), new ur.Point(96, 196), new ur.Point(97, 194), new ur.Point(98, 191), new ur.Point(100, 185), new ur.Point(102, 178), new ur.Point(104, 173), new ur.Point(104, 171), new ur.Point(105, 164), new ur.Point(106, 158), new ur.Point(107, 156), new ur.Point(107, 152), new ur.Point(108, 145), new ur.Point(109, 141), new ur.Point(110, 139), new ur.Point(112, 133), new ur.Point(113, 131), new ur.Point(116, 127), new ur.Point(117, 125), new ur.Point(119, 122), new ur.Point(121, 121), new ur.Point(123, 120), new ur.Point(125, 122), new ur.Point(125, 125), new ur.Point(127, 130), new ur.Point(128, 133), new ur.Point(131, 143), new ur.Point(136, 153), new ur.Point(140, 163), new ur.Point(144, 172), new ur.Point(145, 175), new ur.Point(151, 189), new ur.Point(156, 201), new ur.Point(161, 213), new ur.Point(166, 225), new ur.Point(169, 233), new ur.Point(171, 236), new ur.Point(174, 243), new ur.Point(177, 247), new ur.Point(178, 249), new ur.Point(179, 251), new ur.Point(180, 253), new ur.Point(180, 255), new ur.Point(179, 257), new ur.Point(177, 257), new ur.Point(174, 255), new ur.Point(169, 250), new ur.Point(164, 247), new ur.Point(160, 245), new ur.Point(149, 238), new ur.Point(138, 230), new ur.Point(127, 221), new ur.Point(124, 220), new ur.Point(112, 212), new ur.Point(110, 210), new ur.Point(96, 201), new ur.Point(84, 195), new ur.Point(74, 190), new ur.Point(64, 182), new ur.Point(55, 175), new ur.Point(51, 172), new ur.Point(49, 170), new ur.Point(51, 169), new ur.Point(56, 169), new ur.Point(66, 169), new ur.Point(78, 168), new ur.Point(92, 166), new ur.Point(107, 164), new ur.Point(123, 161), new ur.Point(140, 162), new ur.Point(156, 162), new ur.Point(171, 160), new ur.Point(173, 160), new ur.Point(186, 160), new ur.Point(195, 160), new ur.Point(198, 161), new ur.Point(203, 163), new ur.Point(208, 163), new ur.Point(206, 164), new ur.Point(200, 167), new ur.Point(187, 172), new ur.Point(174, 179), new ur.Point(172, 181), new ur.Point(153, 192), new ur.Point(137, 201), new ur.Point(123, 211), new ur.Point(112, 220), new ur.Point(99, 229), new ur.Point(90, 237), new ur.Point(80, 244), new ur.Point(73, 250), new ur.Point(69, 254), new ur.Point(69, 252)));
        this.gestureUtil.addGesture("pigtail", new Array(new ur.Point(81, 219), new ur.Point(84, 218), new ur.Point(86, 220), new ur.Point(88, 220), new ur.Point(90, 220), new ur.Point(92, 219), new ur.Point(95, 220), new ur.Point(97, 219), new ur.Point(99, 220), new ur.Point(102, 218), new ur.Point(105, 217), new ur.Point(107, 216), new ur.Point(110, 216), new ur.Point(113, 214), new ur.Point(116, 212), new ur.Point(118, 210), new ur.Point(121, 208), new ur.Point(124, 205), new ur.Point(126, 202), new ur.Point(129, 199), new ur.Point(132, 196), new ur.Point(136, 191), new ur.Point(139, 187), new ur.Point(142, 182), new ur.Point(144, 179), new ur.Point(146, 174), new ur.Point(148, 170), new ur.Point(149, 168), new ur.Point(151, 162), new ur.Point(152, 160), new ur.Point(152, 157), new ur.Point(152, 155), new ur.Point(152, 151), new ur.Point(152, 149), new ur.Point(152, 146), new ur.Point(149, 142), new ur.Point(148, 139), new ur.Point(145, 137), new ur.Point(141, 135), new ur.Point(139, 135), new ur.Point(134, 136), new ur.Point(130, 140), new ur.Point(128, 142), new ur.Point(126, 145), new ur.Point(122, 150), new ur.Point(119, 158), new ur.Point(117, 163), new ur.Point(115, 170), new ur.Point(114, 175), new ur.Point(117, 184), new ur.Point(120, 190), new ur.Point(125, 199), new ur.Point(129, 203), new ur.Point(133, 208), new ur.Point(138, 213), new ur.Point(145, 215), new ur.Point(155, 218), new ur.Point(164, 219), new ur.Point(166, 219), new ur.Point(177, 219), new ur.Point(182, 218), new ur.Point(192, 216), new ur.Point(196, 213), new ur.Point(199, 212), new ur.Point(201, 211)));
    };
    GesturePanel.prototype.addEvent = function (target) {
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
    };
    GesturePanel.prototype.dispose = function (target) {
        target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
    };
    GesturePanel.prototype.addTouchEvent = function (tar) {
        tar.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
        tar.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
    };
    GesturePanel.prototype.disposeTouchEvent = function (tar) {
        tar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
        tar.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
    };
    return GesturePanel;
}(egret.DisplayObjectContainer));
__reflect(GesturePanel.prototype, "GesturePanel");
