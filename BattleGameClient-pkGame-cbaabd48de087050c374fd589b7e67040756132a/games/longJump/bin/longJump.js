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
var GameLongJump;
(function (GameLongJump) {
    var CharacterController = (function () {
        function CharacterController() {
            var _this = this;
            this.initbo = function () {
                _this.circleLightFallDB1 = AssetManager.getDBArmature("bo");
                _this.circleLightFallDB1.gotoAndStopByProgress("newAnimation", 1);
                GameLongJumpView.instance.gameLayer.addChild(_this.circleLightFallDB1);
                _this.circleLightFallDB2 = AssetManager.getDBArmature("bo");
                _this.circleLightFallDB2.gotoAndStopByProgress("newAnimation", 1);
                GameLongJumpView.instance.gameLayer.addChild(_this.circleLightFallDB2);
            };
            this.initShuihua = function () {
                var texture = RES.getRes("fallintowater_png");
                var config = RES.getRes("fallintowater_json");
                _this.particleShuiHua = new particle.GravityParticleSystem(texture, config);
                GameLongJumpView.instance.gameLayer.addChild(_this.particleShuiHua);
            };
            this.initPower = function () {
                var texture1 = RES.getRes("xuli1_png");
                var config1 = RES.getRes("xuli1_json");
                _this.circleLightPowerPartical1 = new particle.GravityParticleSystem(texture1, config1);
                GameLongJumpView.instance.gameLayer.addChild(_this.circleLightPowerPartical1);
                var texture2 = RES.getRes("xuli2_png");
                var config2 = RES.getRes("xuli2_json");
                _this.circleLightPowerPartical2 = new particle.GravityParticleSystem(texture2, config2);
                GameLongJumpView.instance.gameLayer.addChild(_this.circleLightPowerPartical2);
            };
            this.jumpSuccessLightAnim = function (combo) {
                var temp = Math.ceil(combo / 2);
                _this.circleLightFallDB1.x = _this.userCharacter.x;
                _this.circleLightFallDB1.y = _this.userCharacter.y;
                _this.circleLightFallDB2.x = _this.userCharacter.x;
                _this.circleLightFallDB2.y = _this.userCharacter.y;
                if (temp == 0)
                    temp = 1;
                _this.circleLightFallDB1.play("newAnimation", temp);
                if (combo - temp > 0) {
                    App.TimerManager.doFrame(10, 1, function () {
                        _this.circleLightFallDB2.play("newAnimation", combo - temp);
                    }, _this);
                }
            };
            this.hideLightPower = function () {
                _this.isRemovePower = true;
                _this.circleLightPowerPartical1.stop(true);
                _this.circleLightPowerPartical2.stop(true);
            };
            this.isRemovePower = true;
            this.setPowerAnim = function () {
                _this.isRemovePower = false;
                // 搜索动画
                var PowerAnim = function () {
                    if (_this.isRemovePower)
                        return;
                    _this.circleLightPowerPartical1.y = _this.userCharacter.y;
                    _this.circleLightPowerPartical1.x = _this.userCharacter.x;
                    _this.circleLightPowerPartical1.start();
                    _this.circleLightPowerPartical2.y = _this.userCharacter.y;
                    _this.circleLightPowerPartical2.x = _this.userCharacter.x;
                    _this.circleLightPowerPartical2.start();
                };
                PowerAnim();
            };
            if (CharacterController.powerSize == undefined) {
                //根据音乐和型变量算的值
                CharacterController.powerSize = GameLongJump.userConfig.powerLimit * 5;
            }
            this.initShuihua();
            this.initPower();
            this.initbo();
            this.hideLightPower();
        }
        CharacterController.prototype.setPos = function () {
            this.userCharacter.x = this._currentPlatform.collisionX;
            this.userCharacter.y = this._currentPlatform.collisionY;
            this.posY = this._currentPlatform.collisionY;
            this._power = GameLongJump.userConfig.power;
        };
        //方向0左上，1 右上
        CharacterController.prototype.getSlopeOrDir = function () {
            var offsetY = this.target.collisionY - this._currentPlatform.collisionY;
            var offsetX = this.target.collisionX - this._currentPlatform.collisionX;
            var slope = offsetY / offsetX; //斜率
            var dir; //方向0左上，1 右上
            if (slope > 0) {
                this.userCharacter.directionLOrR = 1;
                dir = 0;
            }
            else {
                this.userCharacter.directionLOrR = 0;
                slope *= -1;
                dir = 1;
            }
            return {
                slope: slope,
                dir: dir
            };
        };
        // 粒子效果
        CharacterController.prototype.onParticleEffect = function (_X, _Y) {
            this.particleShuiHua.y = _Y;
            this.particleShuiHua.x = _X;
            this.particleShuiHua.start(500);
        };
        /** 保证所有目标点在一个斜率上 */
        CharacterController.prototype.getDis = function (isHalf) {
            if (isHalf === void 0) { isHalf = false; }
            var slopeOrDir = this.getSlopeOrDir();
            var offset = this._power * GameLongJump.userConfig.jumpDis;
            // let c = this._currentPlatform.y - this._currentPlatform.x * slope;//常数c
            var y, x;
            if (isHalf) {
                var middley = void 0, middlex = void 0;
                var sslope = -1 / slopeOrDir.slope;
                if (slopeOrDir.dir) {
                    middley = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope)) / 2;
                    middlex = this._currentPlatform.collisionX + offset * Math.cos(Math.atan(slopeOrDir.slope)) / 2;
                    y = middley + GameLongJump.userConfig.jumpHeight * Math.sin(Math.atan(sslope));
                    x = middlex - GameLongJump.userConfig.jumpHeight * Math.cos(Math.atan(sslope));
                }
                else {
                    middley = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope)) / 2;
                    middlex = this._currentPlatform.collisionX - offset * Math.cos(Math.atan(slopeOrDir.slope)) / 2;
                    y = middley + GameLongJump.userConfig.jumpHeight * Math.sin(Math.atan(sslope));
                    x = middlex + GameLongJump.userConfig.jumpHeight * Math.cos(Math.atan(sslope));
                }
                return { x: x, y: y };
            }
            if (slopeOrDir.dir) {
                y = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope));
                x = this._currentPlatform.collisionX + offset * Math.cos(Math.atan(slopeOrDir.slope));
            }
            else {
                y = this._currentPlatform.collisionY - offset * Math.sin(Math.atan(slopeOrDir.slope));
                x = this._currentPlatform.collisionX - offset * Math.cos(Math.atan(slopeOrDir.slope));
            }
            return { x: x, y: y };
        };
        Object.defineProperty(CharacterController.prototype, "particalY", {
            set: function (value) {
                this.circleLightPowerPartical1.y = value;
                this.circleLightPowerPartical2.y = value;
            },
            enumerable: true,
            configurable: true
        });
        CharacterController.prototype.dispose = function () {
        };
        return CharacterController;
    }());
    GameLongJump.CharacterController = CharacterController;
    __reflect(CharacterController.prototype, "GameLongJump.CharacterController");
})(GameLongJump || (GameLongJump = {}));
var GameLongJumpView = (function (_super) {
    __extends(GameLongJumpView, _super);
    function GameLongJumpView() {
        var _this = _super.call(this) || this;
        _this.user1Ready = false;
        _this.user2Ready = false;
        _this.start = function () {
            if (_this.user1Ready && _this.user2Ready)
                _this.readyGo.play();
        };
        _this.sound = false;
        _this.onGameResult = function (data) {
            DataCenter.instance.room.gameResult = data;
            console.log(DataCenter.instance.room.id + "号房收到结果为" + DataCenter.instance.user.id + ":" + data.winUserId);
            // 发送游戏结果
            /**
             * 将分数抛出去降低耦合度
            */
            if (_this.stateController.selfScore >= 60)
                App.MessageCenter.dispatch(EventMessage.leaderboardSetScore, 120 - GameLongJumpView.instance.stateController.time);
            App.TimerManager.doTimer(2000, 1, function () {
                _this.popup("GameResult");
            }, _this);
        };
        _this.pauseCallback = function () {
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
            _this.next("gameChangeMatch");
        };
        GameLongJumpView.instance = _this;
        _this.gameLayer = new egret.DisplayObjectContainer();
        _this.sceneItemLayer = new egret.DisplayObjectContainer();
        _this.moveLayer = new egret.DisplayObjectContainer();
        return _this;
    }
    GameLongJumpView.prototype.init = function () {
        var _this = this;
        this.stateController = new GameLongJump.StateController();
        this.stateController.init();
        var i = CommonUtils.hashCodeAbs(DataCenter.instance.room.id) % 10;
        this.randomConfig = RES.getRes("RandomConfig_json")[i];
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "Map|" + i, 2);
        }
        this.random = new Math["seedrandom"](DataCenter.instance.room.id + "random");
        this.canJump = false;
        var bg = AssetManager.getBitmap("LongJumpBG_png", false, false);
        bg.width = App.GameWidth;
        bg.height = App.GameHeight;
        this.addChild(bg);
        this.moveLayer.addChild(this.sceneItemLayer);
        this.moveLayer.addChild(this.gameLayer);
        this.addChild(this.moveLayer);
        this.comController = new GameLongJump.CompetitorController();
        this.comController.init();
        this.userController = new GameLongJump.UserController();
        this.userController.init();
        this.platformController = new GameLongJump.PlatformController();
        this.platformController.init();
        this.addListener();
        this.addChild(this.stateController);
        this.stateController.x = App.GameWidth / 2;
        this.stateController.y = 90;
        this.readyGo = new GameLongJump.LongJumpReady(function () {
            _this.canJump = true;
            if (DataCenter.instance.room.IsAI)
                GameLongJumpView.instance.comController.ai.AItouch();
            _this.stateController.timeStart();
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "readyGoOver", 2);
            }
        });
        this.addChild(this.readyGo);
        this.readyGo.hide();
        this.result = new GameLongJump.GameLongJumpResult();
        this.result.init();
        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba) {
            this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            this.returnToLastButton.y = 19;
            this.addChild(this.returnToLastButton);
            this.returnToLastButton.touchEnabled = true;
            this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.popup("GameSureLeave");
            }, this);
        }
        App.SoundManager.stopBg();
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        var tip2 = AssetManager.getBitmap("longJump_tip_png", false, false);
        tip2.anchorOffsetX = 0;
        tip2.anchorOffsetY = tip2.height;
        tip2.x = 0;
        tip2.y = App.GameHeight - 30;
        this.addChild(tip2);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "ready", 1);
        }
        else {
            this.readyGo.play();
        }
    };
    GameLongJumpView.prototype.onGameEvent = function (data) {
        /**
         * "stand|123"
         * command：stand && parameter：123
         * */
        switch (data.event) {
            case "ready":
                if (data.userId == DataCenter.instance.user.id)
                    this.user1Ready = true;
                else
                    this.user2Ready = true;
                this.start();
                break;
        }
    };
    GameLongJumpView.prototype.addListener = function () {
        this.touchChildren = this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.pressBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.pressEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.pressEnd, this);
    };
    GameLongJumpView.prototype.pressBegin = function () {
        if (!this.canJump)
            return;
        this.isPressBegin = true;
        App.TimerManager.remove(this.touch, this);
        App.TimerManager.doTimer(100, 0, this.touch, this);
        App.SoundManager.playEffect("longJump_powering_mp3", true);
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "pressBegin", 2);
        }
        this.userController.userCharacter.play("xuli", 1);
    };
    GameLongJumpView.prototype.touch = function () {
        if (this.userController.power > GameLongJump.userConfig.powerLimit) {
            if (!this.sound) {
                App.SoundManager.playEffect("longJump_powerLimit_mp3", true, 0);
                this.sound = true;
            }
            return;
        }
        this.userController.power += GameLongJump.userConfig.powerAdd;
    };
    GameLongJumpView.prototype.pressEnd = function () {
        if (!this.canJump || !this.isPressBegin)
            return;
        this.isPressBegin = false;
        App.TimerManager.remove(this.touch, this);
        this.userController.jump();
        this.sound = false;
    };
    GameLongJumpView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.userController.dispose();
        this.platformController.dispose();
        this.comController.dispose();
        this.readyGo.dispose();
        this.result.dispose();
        this.stateController.dispose();
        App.TimerManager.removeAll(this);
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.pressBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.pressEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.pressEnd, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
    };
    return GameLongJumpView;
}(State));
__reflect(GameLongJumpView.prototype, "GameLongJumpView");
var GameLongJump;
(function (GameLongJump) {
    var AiController = (function () {
        function AiController(comJump) {
            var _this = this;
            this.isHard = false;
            this.AItouch = function () {
                App.TimerManager.removeAll(_this);
                var target = GameLongJumpView.instance.comController.target;
                if (!target) {
                    return;
                }
                var offset = target.offsetFromLast;
                var random = Math.random();
                var power;
                var stateController = GameLongJumpView.instance.stateController;
                var userCombon = GameLongJumpView.instance.userController.combo;
                //计算结果
                if (_this.aiLevel == 5) {
                    if (userCombon > 0 || stateController.comScore - stateController.selfScore < AiController.AIComboFlag) {
                        power = _this.nextCombo(offset, target.offsetToEdge);
                    }
                    else {
                        power = _this.nextSuccess(offset, target.offsetToEdge);
                    }
                }
                else {
                    var successRand = Math.random(); //跳成功波动
                    if (_this.dropNum > AiController.dropLimit || successRand <= AiController.successRound) {
                        power = _this.nextSuccess(offset, target.offsetToEdge);
                    }
                    else {
                        power = _this.nextFail(offset, target.offsetToEdge);
                    }
                }
                if (_this.isHard) {
                    if (stateController.comScore - stateController.selfScore < AiController.easyToHard || userCombon > 0)
                        _this.aiLevel = 5;
                    else {
                        if (stateController.comScore - stateController.selfScore >= AiController.hardTo4)
                            _this.aiLevel = 4;
                        else if (stateController.comScore - stateController.selfScore >= AiController.hardTo3)
                            _this.aiLevel = 3;
                    }
                }
                var Time = Math.ceil((power - GameLongJump.userConfig.power) / GameLongJump.userConfig.powerAdd) + 1;
                App.TimerManager.doTimer(100 * Time, 1, function () {
                    GameLongJumpView.instance.comController.power = power;
                    _this.comJump();
                }, _this);
            };
            this.comJump = comJump;
            this.combo = 0;
            this.aiLevel = App.CurrGameAiLevel;
            if (this.aiLevel === 5) {
                this.isHard = true;
            }
            this.dropNum = 0;
        }
        Object.defineProperty(AiController.prototype, "aiLevel", {
            get: function () {
                return this._aiLevel;
            },
            set: function (value) {
                this._aiLevel = value;
                switch (this._aiLevel) {
                    case 1:
                        AiController.successRound = 0.3;
                        AiController.comboRound = 0.1;
                        AiController.dropLimit = 4;
                        break;
                    case 2:
                        AiController.successRound = 0.5;
                        AiController.comboRound = 0.2;
                        AiController.dropLimit = 3;
                        break;
                    case 3:
                        AiController.successRound = 0.75;
                        AiController.comboRound = 0.5;
                        AiController.dropLimit = 2;
                        break;
                    case 4:
                        AiController.successRound = 0.95;
                        AiController.comboRound = 0.8;
                        AiController.dropLimit = 1;
                        break;
                    case 5:
                        AiController.successRound = 1;
                        AiController.comboRound = 0;
                        AiController.dropLimit = 0;
                        break;
                }
            },
            enumerable: true,
            configurable: true
        });
        //跳一跳 combo逻辑
        AiController.prototype.nextCombo = function (offset, edge) {
            var successEdge = edge * Math.random() * 0.3;
            this.dropNum = 0;
            return (offset + successEdge) / GameLongJump.userConfig.jumpDis;
        };
        //跳一跳 成功非combo逻辑
        AiController.prototype.nextSuccess = function (offset, edge) {
            var comboRand = Math.random(); //combo波动
            if (comboRand <= AiController.comboRound) {
                return this.nextCombo(offset, edge);
            }
            else {
                return this.noCombo(offset, edge);
            }
        };
        //跳一跳 失败逻辑
        AiController.prototype.nextFail = function (offset, edge) {
            var rnd = Math.random();
            var power;
            if (rnd > 0.5) {
                power = (offset + edge * (rnd + 1)) / GameLongJump.userConfig.jumpDis;
            }
            else {
                power = (offset - edge * (rnd + 1)) / GameLongJump.userConfig.jumpDis;
            }
            this.dropNum++;
            return power;
        };
        //跳一跳 成功非combo逻辑
        AiController.prototype.noCombo = function (offset, edge) {
            var successEdge = edge * 0.3 + edge * Math.random() * 0.2;
            this.dropNum = 0;
            this.combo = 0;
            return (offset + successEdge) / GameLongJump.userConfig.jumpDis;
        };
        AiController.prototype.dispose = function () {
            App.TimerManager.removeAll(this);
        };
        AiController.successRound = 0.2;
        AiController.comboRound = 0.6;
        AiController.dropLimit = 3;
        /**警戒值 */
        AiController.hardTo3 = 30; //最高级难度：AI分值领先30分时，AI将为3
        AiController.hardTo4 = 20; //最高级难度：AI分值领先20分时，AI将为4
        AiController.AIComboFlag = 15; //最高级难度：AI分值领先小于13分时候，AI开始combo，知道,2+4+6 1100MS,
        AiController.easyToHard = 15; //3,4：AI分值领先小于5分时候，AI升级为最高等级
        return AiController;
    }());
    GameLongJump.AiController = AiController;
    __reflect(AiController.prototype, "GameLongJump.AiController");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var CompetitorController = (function (_super) {
        __extends(CompetitorController, _super);
        function CompetitorController() {
            var _this = _super.call(this) || this;
            _this.commandList = [];
            _this.isPlay = false;
            /**接受网络传来的事件 */
            _this.webSocre = undefined;
            _this.offsetS2C = 0;
            _this.excuteCommand = function () {
                if (_this.commandList.length == 0) {
                    _this.isPlay = false;
                }
                else {
                    var command = _this.commandList.shift();
                    _this.power = command.power;
                    _this.webSocre = command.webScore;
                    _this.jump();
                }
            };
            _this.jump = function () {
                _this.isPlay = true;
                _this.hideLightPower();
                _this.userCharacter.scaleY = 1;
                // let random = Math.floor(Math.random() * 2) + 1;
                // App.SoundManager.playEffect("longJump_jump" + random + "_mp3", true);
                var dis = _this.getDis();
                var middleDis = _this.getDis(true);
                var offset = _this._power * GameLongJump.userConfig.jumpDis;
                if (_this.userCharacter.directionLOrR) {
                    _this.userCharacter.directionPosL1_X = _this.userCharacter.x;
                    _this.userCharacter.directionPosL1_Y = _this.userCharacter.y;
                    _this.userCharacter.directionPosL2_X = middleDis.x;
                    _this.userCharacter.directionPosL2_Y = middleDis.y;
                    _this.userCharacter.directionPosL3_X = dis.x;
                    _this.userCharacter.directionPosL3_Y = dis.y;
                }
                else {
                    _this.userCharacter.directionPosR1_X = _this.userCharacter.x;
                    _this.userCharacter.directionPosR1_Y = _this.userCharacter.y;
                    _this.userCharacter.directionPosR2_X = middleDis.x;
                    _this.userCharacter.directionPosR2_Y = middleDis.y;
                    _this.userCharacter.directionPosR3_X = dis.x;
                    _this.userCharacter.directionPosR3_Y = dis.y;
                }
                _this.userCharacter.play("tiao", 1);
                egret.Tween.get(_this.userCharacter).to({ factorOne: 1 }, 300).call(function () {
                    /** 遍历所有目标，判断是否能跳上 */
                    if (_this.power * GameLongJump.userConfig.jumpDis < _this.target.offsetFromLast + _this.target.offsetToEdge &&
                        _this.power * GameLongJump.userConfig.jumpDis > _this.target.offsetFromLast - _this.target.offsetToEdge) {
                        _this.userCharacter.scaleY = 0.8;
                        var random = Math.floor(Math.random() * 3) + 1;
                        // App.SoundManager.playEffect("longJump_jumpOver" + random + "_mp3", true);
                        /** MiniPK,本地AI
                         */
                        _this.userCharacter.gotoAndStopByProgress("xuli", 0);
                        if (DataCenter.instance.room.IsAI) {
                            if (_this.power * GameLongJump.userConfig.jumpDis < _this.target.offsetFromLast + _this.target.offsetToEdge * 0.3 &&
                                _this.power * GameLongJump.userConfig.jumpDis > _this.target.offsetFromLast - _this.target.offsetToEdge * 0.3) {
                                if (_this.ai.combo < 5)
                                    _this.ai.combo++;
                                if (isNaN(_this.ai.combo)) {
                                    _this.ai.combo = 0;
                                    GameLongJumpView.instance.stateController.comScore += 1;
                                }
                                else
                                    GameLongJumpView.instance.stateController.comScore += _this.ai.combo * 2;
                            }
                            else {
                                _this.ai.combo = 0;
                                GameLongJumpView.instance.stateController.comScore += 1;
                            }
                        }
                        _this.posY = _this.userCharacter.y;
                        _this.currentPlatform = _this.target;
                        egret.Tween.get(_this.userCharacter).to({ scaleY: 1 }, 300).call(_this.excuteCommand);
                        if (_this.webSocre !== undefined && !isNaN(_this.webSocre)) {
                            GameLongJumpView.instance.stateController.comScore = _this.webSocre;
                            _this.webSocre = undefined;
                        }
                        // console.log(`跳跃成 功==========================================================`)
                        if (DataCenter.instance.room.IsAI && GameLongJumpView.instance.stateController.comScore <= 60 && GameLongJumpView.instance.stateController.selfScore <= 60)
                            _this.ai.AItouch();
                        return;
                    }
                    /** 都没有跳上台子 */
                    if (_this.power * GameLongJump.userConfig.jumpDis > _this.target.offsetFromLast + _this.target.offsetToEdge)
                        GameLongJumpView.instance.gameLayer.addChildAt(_this.userCharacter, 0);
                    if (DataCenter.instance.room.IsAI)
                        _this.ai.combo = 0;
                    _this.onParticleEffect(_this.userCharacter.x, _this.userCharacter.y);
                    _this.userCharacter.play("luoshui", 1);
                    egret.Tween.get(_this.userCharacter).to({ y: _this.userCharacter.y + 120, alpha: 0 }, 800).call(function () {
                        _this.userCharacter.alpha = 0.5;
                        /** 回到刚才的位置 */
                        GameLongJumpView.instance.gameLayer.addChild(_this.userCharacter);
                        _this.setPos();
                        _this.userCharacter.gotoAndStopByProgress("xuli", 0);
                        egret.Tween.get(_this.userCharacter).to({ alpha: 0.1 }, 50).to({ alpha: 0.5 }, 50)
                            .to({ alpha: 0.1 }, 50).to({ alpha: 0.5 }, 50).
                            to({ alpha: 0.1 }, 50).to({ alpha: 0.5 }, 50);
                        App.TimerManager.doTimer(300, 1, function () {
                            _this.userCharacter.alpha = 0.5;
                            _this.isPlay = false;
                            if (DataCenter.instance.room.IsAI && GameLongJumpView.instance.stateController.comScore <= 60 && GameLongJumpView.instance.stateController.selfScore <= 60)
                                _this.ai.AItouch();
                        }, _this);
                    });
                });
            };
            return _this;
        }
        CompetitorController.prototype.init = function () {
            if (DataCenter.instance.room.selfIsMaster) {
                this.userCharacter = new GameLongJump.Character(AssetManager.getDBArmature("wa2")["_armature"]);
            }
            else {
                this.userCharacter = new GameLongJump.Character(AssetManager.getDBArmature("wa1")["_armature"]);
            }
            this.userCharacter.alpha = 0.5;
            this.userCharacter.name = "Com";
            GameLongJumpView.instance.gameLayer.addChild(this.userCharacter);
            //游戏内事件返回
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            else {
                // console.log("本地AI开启")
                this.ai = new GameLongJump.AiController(this.jump);
            }
        };
        Object.defineProperty(CompetitorController.prototype, "power", {
            get: function () {
                return this._power;
            },
            set: function (power) {
                this._power = power; //      power 1,power1.6,5/8
            },
            enumerable: true,
            configurable: true
        });
        CompetitorController.prototype.onGameEvent = function (data) {
            if (data.userId == DataCenter.instance.user.id) {
                return;
            }
            /**
             * "stand|123"
             * command：stand && parameter：123
             * */
            var parseData = function (data) {
                var splitChar = data.split("|");
                return splitChar;
            };
            var datas = parseData(data.event);
            switch (datas[0]) {
                case "pressBegin":
                    this.userCharacter.play("xuli");
                    break;
                case "jump":
                    if (!this.isPlay) {
                        this.power = parseFloat(datas[1]);
                        if (datas[2])
                            this.webSocre = parseInt(datas[2]);
                        this.jump();
                    }
                    else {
                        var a = { power: parseFloat(datas[1]), webScore: parseFloat(datas[2]) };
                        this.commandList.push(a);
                    }
                    break;
                case "offset":
                    this.offsetS2C = parseFloat(datas[1]);
                    break;
            }
        };
        Object.defineProperty(CompetitorController.prototype, "currentPlatform", {
            get: function () {
                return this._currentPlatform;
            },
            set: function (value) {
                this._currentPlatform = value;
                this.userCharacter.gotoAndStopByProgress("xuli", 0);
                this.target = GameLongJumpView.instance.platformController.creatNext(this._currentPlatform);
                this.target.offsetFromLast = GameLongJumpView.instance.platformController.getPlatformOffset(this._currentPlatform, this.target);
                var slopeOrDir = this.getSlopeOrDir();
                if (slopeOrDir.dir) {
                    this.userCharacter.scaleX = 1;
                }
                else {
                    this.userCharacter.scaleX = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        CompetitorController.prototype.dispose = function () {
            egret.Tween.removeTweens(this.userCharacter);
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            else
                this.ai.dispose();
            App.TimerManager.removeAll(this);
        };
        return CompetitorController;
    }(GameLongJump.CharacterController));
    GameLongJump.CompetitorController = CompetitorController;
    __reflect(CompetitorController.prototype, "GameLongJump.CompetitorController");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var GameLongJumpResult = (function () {
        function GameLongJumpResult() {
        }
        GameLongJumpResult.prototype.init = function () {
            this.selfContainner = new egret.DisplayObjectContainer();
            this.comContainner = new egret.DisplayObjectContainer();
            this.winContainner = new egret.DisplayObjectContainer();
            this.loseContainner = new egret.DisplayObjectContainer();
            this.mask = AssetManager.getBitmap("longJump_blackMask_png", false, false);
            this.mask.width = App.GameWidth;
            this.mask.height = App.GameHeight;
            this.mask.anchorOffsetX = this.mask.width / 2;
            this.mask.anchorOffsetY = this.mask.height / 2;
            this.mask.alpha = 0.5;
            if (DataCenter.instance.room.selfIsMaster) {
                this.winImage = AssetManager.getBitmap("winGreen_png");
                this.loseImage = AssetManager.getBitmap("loseRed_png");
                this.selfScoreBG = AssetManager.getBitmap("green_png");
                this.comScoreBg = AssetManager.getBitmap("red_png");
                this.selfHeadBg = AssetManager.getBitmap("headBg_green_png");
                this.comHeadBg = AssetManager.getBitmap("headBg_red_png");
            }
            else {
                this.winImage = AssetManager.getBitmap("winRed_png");
                this.loseImage = AssetManager.getBitmap("loseGreen_png");
                this.selfScoreBG = AssetManager.getBitmap("red_png");
                this.comScoreBg = AssetManager.getBitmap("green_png");
                this.comHeadBg = AssetManager.getBitmap("headBg_green_png");
                this.selfHeadBg = AssetManager.getBitmap("headBg_red_png");
            }
            this.winImage.y = this.loseImage.y = -100;
            this.selfScoreBG.anchorOffsetX = this.selfScoreBG.width;
            this.comScoreBg.anchorOffsetX = 0;
            this.selfHeadBg.x = this.selfScoreBG.x - this.selfScoreBG.width;
            this.selfHead = new RoleHeadImage(DataCenter.instance.user.imgUrl);
            this.selfHead.anchorOffsetX = this.selfHead.width / 2;
            this.selfHead.anchorOffsetY = this.selfHead.height / 2;
            this.selfHead.x = this.selfHeadBg.x;
            this.comHeadBg.x = this.comScoreBg.x + this.comScoreBg.width;
            this.comHead = new RoleHeadImage(DataCenter.instance.room.player.imgUrl);
            this.comHead.anchorOffsetX = this.comHead.width / 2;
            this.comHead.anchorOffsetY = this.comHead.height / 2;
            this.comHead.x = this.comHeadBg.x;
            this.selfScoreBG.y = this.comScoreBg.y = this.selfHeadBg.y = this.comHeadBg.y = this.selfHead.y = this.comHead.y = this.winImage.height / 2 + 30;
            this.winTag = AssetManager.getBitmap("winTag_png");
        };
        GameLongJumpResult.prototype.initData = function () {
            this.selfScoreView = new egret.TextField();
            var selfScore = GameLongJumpView.instance.stateController.selfScore;
            if (selfScore < 10)
                this.selfScoreView.text = "0" + selfScore;
            else
                this.selfScoreView.text = selfScore.toString();
            this.selfScoreView.size = 40;
            this.selfScoreView.anchorOffsetX = this.selfScoreView.measuredWidth;
            this.selfScoreView.anchorOffsetY = this.selfScoreView.measuredHeight / 2;
            this.selfScoreView.x = -this.selfScoreBG.width / 3;
            this.selfScoreView.y = this.winImage.height / 2 + 30;
            this.comScoreView = new egret.TextField();
            var comScore = GameLongJumpView.instance.stateController.comScore;
            if (comScore < 10)
                this.comScoreView.text = "0" + comScore;
            else
                this.comScoreView.text = comScore.toString();
            this.comScoreView.size = 40;
            this.comScoreView.anchorOffsetX = 0;
            this.comScoreView.anchorOffsetY = this.comScoreView.measuredHeight / 2;
            this.comScoreView.x = this.comScoreBg.width / 3;
            this.comScoreView.y = this.winImage.height / 2 + 30;
            ;
            this.selfContainner.addChild(this.selfScoreBG);
            this.comContainner.addChild(this.comScoreBg);
            this.selfContainner.addChild(this.selfHeadBg);
            this.comContainner.addChild(this.comHeadBg);
            this.selfContainner.addChild(this.selfHead);
            this.comContainner.addChild(this.comHead);
            this.selfContainner.addChild(this.selfScoreView);
            this.comContainner.addChild(this.comScoreView);
        };
        GameLongJumpResult.prototype.win = function () {
            this.initData();
            this.winContainner.addChild(this.winImage);
            this.winContainner.addChild(this.selfContainner);
            this.winContainner.addChild(this.comContainner);
            this.winTag.anchorOffsetX = this.winTag.width;
            this.winTag.y = this.selfScoreBG.y - 30;
            this.winTag.x = this.selfScoreBG.x;
            this.selfContainner.addChild(this.winTag);
            this.selfContainner.x = -350;
            egret.Tween.get(this.selfContainner).to({ x: -20 }, 300);
            this.comContainner.x = 350;
            egret.Tween.get(this.comContainner).to({ x: 20 }, 350);
            this.winContainner.addChildAt(this.mask, 0);
            this.selfContainner.y = this.comContainner.y = -50;
            this.winContainner.x = App.GameWidth / 2;
            this.winContainner.y = App.GameHeight / 2;
            GameLongJumpView.instance.addChild(this.winContainner);
        };
        GameLongJumpResult.prototype.lose = function (istime) {
            if (istime === void 0) { istime = false; }
            this.initData();
            this.loseContainner.addChildAt(this.mask, 0);
            this.loseContainner.addChild(this.loseImage);
            this.loseContainner.addChild(this.selfContainner);
            ;
            this.loseContainner.addChild(this.comContainner);
            this.winTag.anchorOffsetX = 0;
            this.winTag.y = this.comScoreBg.y - 30;
            this.winTag.x = this.comScoreBg.x;
            this.comContainner.addChild(this.winTag);
            this.selfContainner.x = -350;
            egret.Tween.get(this.selfContainner).to({ x: -20 }, 300);
            this.comContainner.x = 350;
            egret.Tween.get(this.comContainner).to({ x: 20 }, 300);
            this.selfContainner.y = this.comContainner.y = -50;
            this.loseContainner.x = App.GameWidth / 2;
            this.loseContainner.y = App.GameHeight / 2;
            GameLongJumpView.instance.addChild(this.loseContainner);
        };
        GameLongJumpResult.prototype.dispose = function () {
        };
        return GameLongJumpResult;
    }());
    GameLongJump.GameLongJumpResult = GameLongJumpResult;
    __reflect(GameLongJumpResult.prototype, "GameLongJump.GameLongJumpResult");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(armature) {
            var _this = _super.call(this, armature) || this;
            // (方向)  0:左侧 1：右侧
            _this.directionLOrR = 0;
            // 左侧 坐标
            _this.directionPosL1_X = 0;
            _this.directionPosL1_Y = 0;
            _this.directionPosL2_X = 0;
            _this.directionPosL2_Y = 0;
            _this.directionPosL3_X = 0;
            _this.directionPosL3_Y = 0;
            // 右侧
            _this.directionPosR1_X = 0;
            _this.directionPosR1_Y = 0;
            _this.directionPosR2_X = 0;
            _this.directionPosR2_Y = 0;
            _this.directionPosR3_X = 0;
            _this.directionPosR3_Y = 0;
            return _this;
        }
        Object.defineProperty(Character.prototype, "factorOne", {
            get: function () {
                return 0;
            },
            set: function (value) {
                if (this.directionLOrR == 1) {
                    this.x = (1 - value) * (1 - value) * this.directionPosL1_X + 2 * value * (1 - value) * this.directionPosL2_X + value * value * this.directionPosL3_X;
                    this.y = (1 - value) * (1 - value) * this.directionPosL1_Y + 2 * value * (1 - value) * this.directionPosL2_Y + value * value * this.directionPosL3_Y;
                    return;
                }
                this.x = (1 - value) * (1 - value) * this.directionPosR1_X + 2 * value * (1 - value) * this.directionPosR2_X + value * value * this.directionPosR3_X;
                this.y = (1 - value) * (1 - value) * this.directionPosR1_Y + 2 * value * (1 - value) * this.directionPosR2_Y + value * value * this.directionPosR3_Y;
            },
            enumerable: true,
            configurable: true
        });
        return Character;
    }(DBArmature));
    GameLongJump.Character = Character;
    __reflect(Character.prototype, "GameLongJump.Character");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var LongJumpReady = (function (_super) {
        __extends(LongJumpReady, _super);
        function LongJumpReady(callback) {
            var _this = _super.call(this, callback, "longJump_ready_png", "longJump_go_png") || this;
            _this.bgmask = AssetManager.getBitmap("longJump_blackMask_png", false, false);
            _this.title = AssetManager.getBitmap("readyGoTitle_png");
            _this.bgmask.width = App.GameWidth;
            _this.bgmask.height = App.GameHeight;
            _this.bgmask.alpha = 0.5;
            _this.addChildAt(_this.bgmask, 0);
            _this.imgReady.x = _this.imgGo.x = _this.title.x = App.GameWidth / 2;
            _this.imgReady.y = _this.imgGo.y = App.GameHeight / 2 - 50;
            _this.title.y = App.GameHeight / 2 + 50;
            _this.addChild(_this.title);
            return _this;
        }
        LongJumpReady.prototype.hide = function () {
            this.imgReady.alpha = 0;
            this.imgGo.alpha = 0;
            this.title.alpha = 0;
            this.bgmask.alpha = 0;
        };
        LongJumpReady.prototype.play = function () {
            var _this = this;
            this.hide();
            App.SoundManager.playEffect("readyGo_mp3");
            this.imgReady.alpha = 1;
            this.bgmask.alpha = 0.5;
            this.title.alpha = 1;
            this.stepReady = setTimeout(function () {
                _this.hide();
                _this.imgGo.alpha = 1;
                _this.bgmask.alpha = 0.5;
                _this.title.alpha = 1;
                _this.stepGo = setTimeout(function () {
                    _this.hide();
                    _this._callback();
                    clearTimeout(_this.stepGo);
                    _this.stepGo = undefined;
                }, 500);
                clearTimeout(_this.stepReady);
                _this.stepReady = undefined;
            }, 1000);
        };
        LongJumpReady.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.bgmask = undefined;
            this.title = undefined;
        };
        return LongJumpReady;
    }(GameReady));
    GameLongJump.LongJumpReady = LongJumpReady;
    __reflect(LongJumpReady.prototype, "GameLongJump.LongJumpReady");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var PlatformType;
    (function (PlatformType) {
        PlatformType[PlatformType["a"] = 0] = "a";
        PlatformType[PlatformType["g"] = 1] = "g";
        PlatformType[PlatformType["h"] = 2] = "h";
        PlatformType[PlatformType["i"] = 3] = "i";
        PlatformType[PlatformType["j"] = 4] = "j";
        PlatformType[PlatformType["m"] = 5] = "m";
        PlatformType[PlatformType["o"] = 6] = "o";
        PlatformType[PlatformType["q"] = 7] = "q";
        PlatformType[PlatformType["t"] = 8] = "t";
        PlatformType[PlatformType["z"] = 9] = "z";
        PlatformType[PlatformType["max_e"] = 10] = "max_e";
        PlatformType[PlatformType["max_q"] = 11] = "max_q";
        PlatformType[PlatformType["max_r"] = 12] = "max_r";
        PlatformType[PlatformType["max_t"] = 13] = "max_t";
        PlatformType[PlatformType["max_u"] = 14] = "max_u";
        PlatformType[PlatformType["max_w"] = 15] = "max_w";
        PlatformType[PlatformType["max_y"] = 16] = "max_y";
        PlatformType[PlatformType["k"] = 17] = "k";
        PlatformType[PlatformType["e"] = 18] = "e";
        PlatformType[PlatformType["l"] = 19] = "l";
        PlatformType[PlatformType["w"] = 20] = "w";
    })(PlatformType = GameLongJump.PlatformType || (GameLongJump.PlatformType = {}));
    var Platform = (function (_super) {
        __extends(Platform, _super);
        function Platform() {
            return _super.call(this) || this;
        }
        Object.defineProperty(Platform.prototype, "UID", {
            get: function () {
                return this._UID;
            },
            enumerable: true,
            configurable: true
        });
        // private test: egret.Bitmap;
        Platform.prototype.init = function (type, UID, isPlayCartoon) {
            if (isPlayCartoon === void 0) { isPlayCartoon = true; }
            if (this.platformType === type)
                return;
            this._UID = UID;
            this.platformType = type;
            if (this.platformType === PlatformType.max_e || this.platformType === PlatformType.max_q || this.platformType === PlatformType.max_r ||
                this.platformType === PlatformType.max_t || this.platformType === PlatformType.max_u
                || this.platformType === PlatformType.max_w || this.platformType === PlatformType.max_y) {
                this.platformImg = AssetManager.getBitmap("longJump_" + PlatformType[this.platformType] + "1_png");
                this.platformShadow = AssetManager.getBitmap("longJump_max_shadow_png");
            }
            else {
                this.platformImg = AssetManager.getBitmap("Jump" + PlatformType[this.platformType] + "1_png");
                this.platformShadow = AssetManager.getBitmap("Jump" + PlatformType[this.platformType] + "3_png");
            }
            this.collisionX = this.platformImg.anchorOffsetX = this.platformImg.width / 2;
            this.platformImg.anchorOffsetY = this.platformImg.height;
            /**手动设置碰撞点中心，图片尺寸都不同 */
            switch (this.platformType) {
                case PlatformType.a:
                    this.collisionY = 34;
                    this.platformShadow.anchorOffsetY = 34;
                    this.offsetToEdge = 32;
                    break;
                case PlatformType.e:
                    this.collisionY = 24;
                    this.platformShadow.anchorOffsetY = 24;
                    this.offsetToEdge = 32;
                    break;
                case PlatformType.g:
                    this.collisionY = 64;
                    this.platformShadow.anchorOffsetY = 64;
                    this.offsetToEdge = 67;
                    break;
                case PlatformType.h:
                    this.collisionY = 42;
                    this.platformShadow.anchorOffsetY = 42;
                    this.offsetToEdge = 44;
                    break;
                case PlatformType.i:
                    this.collisionY = 35;
                    this.platformShadow.anchorOffsetY = 35;
                    this.offsetToEdge = 36;
                    break;
                case PlatformType.j:
                    this.collisionY = 35;
                    this.platformShadow.anchorOffsetY = 35;
                    this.offsetToEdge = 35;
                    break;
                case PlatformType.k:
                    this.collisionY = 43;
                    this.platformShadow.anchorOffsetY = 64;
                    this.offsetToEdge = 42;
                    break;
                case PlatformType.l:
                    this.collisionY = 43;
                    this.platformShadow.anchorOffsetY = 43;
                    this.offsetToEdge = 45;
                    break;
                case PlatformType.m:
                    this.collisionY = 35;
                    this.platformShadow.anchorOffsetY = 35;
                    this.offsetToEdge = 35;
                    break;
                case PlatformType.o:
                    this.collisionY = 64;
                    this.platformShadow.anchorOffsetY = 64;
                    this.offsetToEdge = 65;
                    break;
                case PlatformType.q:
                    this.collisionY = 42;
                    this.platformShadow.anchorOffsetY = 42;
                    this.offsetToEdge = 59;
                    break;
                case PlatformType.t:
                    this.collisionY = 50;
                    this.platformShadow.anchorOffsetY = 50;
                    this.offsetToEdge = 50;
                    break;
                case PlatformType.w:
                    this.collisionY = 23;
                    this.platformShadow.anchorOffsetY = 23;
                    this.offsetToEdge = 31;
                    break;
                case PlatformType.z:
                    this.collisionY = 36;
                    this.platformShadow.anchorOffsetY = 36;
                    this.offsetToEdge = 37;
                    break;
                default:
                    this.collisionY = 65;
                    this.platformShadow.anchorOffsetY = 65;
                    this.offsetToEdge = 69;
                    break;
            }
            this.addChild(this.platformShadow);
            this.platformImg.name = "platformImg";
            this.addChild(this.platformImg);
            if (isPlayCartoon) {
                this.platformShadow.alpha = 0;
                this.platformImg.y = -800;
                this.playCartoon();
            }
            else {
                this.platformShadow.y = this.platformImg.y;
            }
            // this.test = AssetManager.getBitmap("longJump_blackMask_png");
            // this.test.height = this.test.width = 20;
            // this.test.anchorOffsetX = this.test.width / 2;
            // this.test.anchorOffsetY = this.test.height / 2;
            // this.test.x = 0;
            // this.test.y = -(this.platformImg.height - this.collisionY);
            // this.addChild(this.test);
        };
        /**传进来的应该是collison所在位置 */
        Platform.prototype.setXY = function (x, y) {
            // this.x = x;
            // this.y = y;
            // this.collisionX = x;
            // this.collisionY = y - this.platformImg.height + this.collisionY;
            this.x = x;
            this.y = y + this.platformImg.height - this.collisionY;
            this.collisionX = x;
            this.collisionY = y;
        };
        Platform.prototype.playCartoon = function () {
            var _this = this;
            egret.Tween.get(this.platformImg).to({
                y: 0
            }, 300).call(function () {
                _this.platformShadow.alpha = 1;
                _this.platformShadow.y = _this.platformImg.y;
            });
        };
        return Platform;
    }(egret.DisplayObjectContainer));
    GameLongJump.Platform = Platform;
    __reflect(Platform.prototype, "GameLongJump.Platform");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var PlatformController = (function () {
        function PlatformController() {
            this.worldOffsetX = 0;
            this.worldOffsetY = 0;
            this.platformList = {};
            PlatformController.slope = 28 / 180 * Math.PI;
            PlatformController.itemSlope = 45 / 180 * Math.PI;
        }
        PlatformController.prototype.init = function () {
            var newPlatform = ObjectPool.pop(GameLongJump.Platform, "max_qPlatform");
            newPlatform.init(GameLongJump.PlatformType.max_q, 0, false);
            newPlatform.setXY(150, 700);
            GameLongJumpView.instance.gameLayer.addChildAt(newPlatform, 0);
            this.platformList[newPlatform.UID] = newPlatform;
            GameLongJumpView.instance.userController.currentPlatform = newPlatform;
            GameLongJumpView.instance.userController.setPos();
            GameLongJumpView.instance.comController.currentPlatform = newPlatform;
            GameLongJumpView.instance.comController.setPos();
            this.moveWorld(GameLongJumpView.instance.userController.target, newPlatform);
        };
        PlatformController.prototype.creatNext = function (current) {
            var nextUId = current.UID + 1;
            if (this.platformList[nextUId])
                return this.platformList[nextUId];
            var dis = this.getPlatformPos(current);
            var type = this.getPlatformType();
            var newPlatform = ObjectPool.pop(GameLongJump.Platform, GameLongJump.PlatformType[type] + "Platform");
            newPlatform.init(type, nextUId, true);
            newPlatform.setXY(dis.x, dis.y);
            newPlatform.offsetFromLast = dis.offset;
            GameLongJumpView.instance.gameLayer.addChildAt(newPlatform, 0);
            this.platformList[newPlatform.UID] = newPlatform;
            this.creatSceneItems(newPlatform);
            return newPlatform;
        };
        PlatformController.prototype.moveWorld = function (platform, current) {
            var x = (platform.x + current.x) / 2;
            var y = (platform.y + current.y) / 2;
            egret.Tween.get(GameLongJumpView.instance.moveLayer).to({
                x: -x + App.GameWidth / 2, y: -y + App.GameHeight / 2
            }, 500, egret.Ease.sineIn);
            this.worldOffsetX = -x + App.GameWidth / 2;
            this.worldOffsetY = -y + App.GameHeight / 2;
        };
        PlatformController.prototype.getPlatformPos = function (current) {
            var random = GameLongJumpView.instance.randomConfig.shift();
            var offset;
            var offsetX;
            if (random < 0.5) {
                offset = MathUtils.reserveDecimal((random + 0.5) * PlatformController.MaxOffset, 2);
                offsetX = -offset * Math.cos(PlatformController.slope);
            }
            else {
                offset = MathUtils.reserveDecimal(random * PlatformController.MaxOffset, 2);
                offsetX = offset * Math.cos(PlatformController.slope);
            }
            var x = current.collisionX + MathUtils.reserveDecimal(offsetX, 2);
            var y = current.collisionY - MathUtils.reserveDecimal(offset * Math.sin(PlatformController.slope), 2);
            return { x: x, y: y, offset: offset };
        };
        PlatformController.prototype.getPlatformType = function () {
            var random = GameLongJumpView.instance.randomConfig.shift();
            if (random < 0.1)
                return GameLongJump.PlatformType.max_e;
            else if (random < 0.2)
                return GameLongJump.PlatformType.max_q;
            else if (random < 0.3)
                return GameLongJump.PlatformType.max_r;
            else if (random < 0.4)
                return GameLongJump.PlatformType.max_t;
            else if (random < 0.5)
                return GameLongJump.PlatformType.max_u;
            else if (random < 0.6)
                return GameLongJump.PlatformType.max_w;
            else if (random < 0.7)
                return GameLongJump.PlatformType.max_y;
            else if (random < 0.72)
                return GameLongJump.PlatformType.a;
            else if (random < 0.74)
                return GameLongJump.PlatformType.h;
            else if (random < 0.76)
                return GameLongJump.PlatformType.i;
            else if (random < 0.78)
                return GameLongJump.PlatformType.j;
            else if (random < 0.8)
                return GameLongJump.PlatformType.m;
            else if (random < 0.82)
                return GameLongJump.PlatformType.o;
            else if (random < 0.84)
                return GameLongJump.PlatformType.q;
            else if (random < 0.86)
                return GameLongJump.PlatformType.t;
            else if (random < 0.88)
                return GameLongJump.PlatformType.g;
            else if (random < 0.9)
                return GameLongJump.PlatformType.z;
            if (random < 0.92)
                return GameLongJump.PlatformType.e;
            else if (random < 0.94)
                return GameLongJump.PlatformType.l;
            else if (random < 0.96)
                return GameLongJump.PlatformType.k;
            else if (random < 0.98)
                return GameLongJump.PlatformType.w;
            else
                return GameLongJump.PlatformType.max_e;
        };
        PlatformController.prototype.getPlatformOffset = function (current, next) {
            var offsetView = Math.sqrt((next.collisionY - current.collisionY) * (next.collisionY - current.collisionY) +
                (next.collisionX - current.collisionX) * (next.collisionX - current.collisionX));
            return MathUtils.reserveDecimal(offsetView, 2);
        };
        PlatformController.prototype.creatSceneItems = function (next) {
            var random = GameLongJumpView.instance.random();
            var bitmap = this.creatSceneItem();
            if (random < 0.5) {
                bitmap.x = next.x - 100 * (random + 0.5);
                bitmap.y = next.y - next.platformImg.height - (150 * random + 0.5);
            }
            else {
                bitmap.x = next.x + 100 * random;
                bitmap.y = next.y + 150 * random;
            }
            bitmap.alpha = 0;
            egret.Tween.get(bitmap).to({ alpha: 1 }, 1000);
            GameLongJumpView.instance.sceneItemLayer.addChildAt(bitmap, 0);
        };
        PlatformController.prototype.creatSceneItem = function () {
            var type = this.getSceneItemType();
            return AssetManager.getBitmap("bj" + type + "_png");
        };
        PlatformController.prototype.getSceneItemType = function () {
            var random = GameLongJumpView.instance.random();
            // if (random < 0.4) {
            //     return 1;
            // } else if (random < 0.55) {
            //     return 2;
            // } else if (random < 0.7) {
            //     return 3;
            // } else if (random < 0.85) {
            //     return 4;
            // } else {
            //     return 5;
            // }
            if (random < 0.7)
                return 2;
            else
                return 5;
        };
        PlatformController.prototype.dispose = function () {
            ObjectPool.clearClass("max_ePlatform");
            ObjectPool.clearClass("max_yPlatform");
            ObjectPool.clearClass("max_uPlatform");
            ObjectPool.clearClass("max_yPlatform");
            ObjectPool.clearClass("max_rPlatform");
            ObjectPool.clearClass("max_qPlatform");
            ObjectPool.clearClass("max_ePlatform");
            ObjectPool.clearClass("kPlatform");
            ObjectPool.clearClass("ePlatform");
            ObjectPool.clearClass("lPlatform");
            ObjectPool.clearClass("wPlatform");
            ObjectPool.clearClass("aPlatform");
            ObjectPool.clearClass("gPlatform");
            ObjectPool.clearClass("hPlatform");
            ObjectPool.clearClass("iPlatform");
            ObjectPool.clearClass("jPlatform");
            ObjectPool.clearClass("mPlatform");
            ObjectPool.clearClass("oPlatform");
            ObjectPool.clearClass("qPlatform");
            ObjectPool.clearClass("tPlatform");
            ObjectPool.clearClass("zPlatform");
            egret.Tween.removeTweens(GameLongJumpView.instance.gameLayer);
        };
        PlatformController.MaxOffset = 400;
        return PlatformController;
    }());
    GameLongJump.PlatformController = PlatformController;
    __reflect(PlatformController.prototype, "GameLongJump.PlatformController");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var StateController = (function (_super) {
        __extends(StateController, _super);
        function StateController() {
            var _this = _super.call(this) || this;
            _this.isOver = false;
            _this.timeOver = function () {
                _this._time--;
                _this.timeView.text = _this._time.toString();
                if (_this._time <= 0) {
                    if (_this._selfScore > _this._comScore) {
                        _this.isWin = true;
                    }
                    else if (_this._selfScore < _this._comScore) {
                        App.TimerManager.doTimer(100, 1, function () {
                            App.SoundManager.playEffect("longJump_lose_wav", true);
                            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
                            console.log(DataCenter.instance.room.id + "号房发送结果为" + DataCenter.instance.user.id + ":" + 1);
                            GameLongJumpView.instance.result.lose(true);
                        }, _this);
                    }
                    else {
                        if (DataCenter.instance.user.id > DataCenter.instance.room.player.id) {
                            _this.isWin = true;
                        }
                        else {
                            _this.isWin = false;
                        }
                    }
                    App.TimerManager.remove(_this.timeOver, _this);
                }
            };
            return _this;
        }
        StateController.prototype.init = function () {
            var selfHeadBg;
            var comHeadBg;
            if (DataCenter.instance.room.selfIsMaster) {
                this.selfScoreBG = AssetManager.getBitmap("green_png");
                this.comScoreBg = AssetManager.getBitmap("red_png");
                selfHeadBg = AssetManager.getBitmap("headBg_green_png");
                comHeadBg = AssetManager.getBitmap("headBg_red_png");
            }
            else {
                this.selfScoreBG = AssetManager.getBitmap("red_png");
                this.comScoreBg = AssetManager.getBitmap("green_png");
                comHeadBg = AssetManager.getBitmap("headBg_green_png");
                selfHeadBg = AssetManager.getBitmap("headBg_red_png");
            }
            this.selfScoreBG.anchorOffsetX = this.selfScoreBG.width;
            this.comScoreBg.anchorOffsetX = 0;
            this.addChild(this.selfScoreBG);
            this.addChild(this.comScoreBg);
            selfHeadBg.x = this.selfScoreBG.x - this.selfScoreBG.width;
            var selfHead = new RoleHeadImage(DataCenter.instance.user.imgUrl);
            selfHead.anchorOffsetX = selfHead.width / 2;
            selfHead.anchorOffsetY = selfHead.height / 2;
            selfHead.x = selfHeadBg.x;
            comHeadBg.x = this.comScoreBg.x + this.comScoreBg.width;
            var comHead = new RoleHeadImage(DataCenter.instance.room.player.imgUrl);
            comHead.anchorOffsetX = comHead.width / 2;
            comHead.anchorOffsetY = comHead.height / 2;
            comHead.x = comHeadBg.x;
            this.addChild(selfHeadBg);
            this.addChild(comHeadBg);
            this.addChild(selfHead);
            this.addChild(comHead);
            this.selfScoreView = new egret.TextField();
            this.selfScoreView.text = "00";
            this.selfScoreView.size = 40;
            this.selfScoreView.anchorOffsetX = this.selfScoreView.measuredWidth;
            this.selfScoreView.anchorOffsetY = this.selfScoreView.measuredHeight / 2;
            this.selfScoreView.x = -this.selfScoreBG.width / 3;
            this.addChild(this.selfScoreView);
            this.comScoreView = new egret.TextField();
            this.comScoreView.text = "00";
            this.comScoreView.size = 40;
            this.comScoreView.anchorOffsetX = 0;
            this.comScoreView.anchorOffsetY = this.comScoreView.measuredHeight / 2;
            this.comScoreView.x = this.comScoreBg.width / 3;
            this.addChild(this.comScoreView);
            var timeBG = AssetManager.getBitmap("longJump_TimeBG_png");
            timeBG.scaleX = timeBG.scaleY = 1.2;
            this.addChild(timeBG);
            var tip = AssetManager.getBitmap("readyGoTitle_png");
            tip.anchorOffsetY = tip.height;
            tip.y = -timeBG.height * 0.6;
            this.addChild(tip);
            this._selfScore = 0;
            this._comScore = 0;
            this.timeView = new egret.BitmapText();
            this.timeView.font = RES.getRes("longJump_number_fnt");
            this.timeView.width = 102;
            this.timeView.height = 50;
            this.timeView.letterSpacing = -5;
            this.timeView.anchorOffsetX = 51;
            this.timeView.anchorOffsetY = 25;
            this.timeView.textAlign = egret.HorizontalAlign.CENTER;
            this.timeView.alpha = 1;
            this.timeView.text = "120";
            this.addChild(this.timeView);
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        };
        /**接受网络传来的事件 */
        StateController.prototype.onGameEvent = function (data) {
            /**
             * "stand|123"
             * command：stand && parameter：123
             * */
            var parseData = function (data) {
                var splitChar = data.split("|");
                return splitChar;
            };
            var datas = parseData(data.event);
            switch (datas[0]) {
                case "Score":
                    if (DataCenter.instance.user.id == datas[1])
                        this.selfScore = parseInt(datas[2]);
                    else
                        this.comScore = parseInt(datas[2]);
                    break;
            }
        };
        Object.defineProperty(StateController.prototype, "selfScore", {
            get: function () {
                return this._selfScore;
            },
            set: function (offset) {
                if (offset < 0)
                    return;
                this._selfScore = offset;
                if (this._selfScore >= 10)
                    this.selfScoreView.text = this._selfScore.toString();
                else
                    this.selfScoreView.text = "0" + this._selfScore;
                if (this._selfScore >= GameLongJump.userConfig.score && !this.isOver) {
                    this.isWin = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateController.prototype, "isWin", {
            set: function (isWin) {
                this.isOver = true;
                App.TimerManager.doTimer(100, 1, function () {
                    if (isWin) {
                        App.SoundManager.playEffect("longJump_sccess_mp3", true);
                        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 3);
                        // console.log(DataCenter.instance.room.id + "号房发送结果为" + DataCenter.instance.user.id + ":" + 3)
                        GameLongJumpView.instance.result.win();
                    }
                    else {
                        App.SoundManager.playEffect("longJump_lose_wav", true);
                        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
                        // console.log(DataCenter.instance.room.id + "号房发送结果为" + DataCenter.instance.user.id + ":" + 1)
                        GameLongJumpView.instance.result.lose();
                    }
                }, this);
                App.TimerManager.remove(this.timeOver, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateController.prototype, "comScore", {
            get: function () {
                return this._comScore;
            },
            set: function (offset) {
                if (offset < 0 && isNaN(offset))
                    return;
                this._comScore = offset;
                if (this._comScore >= 10)
                    this.comScoreView.text = this._comScore.toString();
                else
                    this.comScoreView.text = "0" + this._comScore;
                if (this._comScore >= GameLongJump.userConfig.score && !this.isOver) {
                    this.isWin = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateController.prototype, "time", {
            get: function () {
                return this._time;
            },
            enumerable: true,
            configurable: true
        });
        StateController.prototype.timeStart = function () {
            this._time = 120;
            App.TimerManager.doTimer(1000, 0, this.timeOver, this);
        };
        StateController.prototype.dispose = function () {
            App.TimerManager.removeAll(this);
            if (!DataCenter.instance.room.IsAI)
                App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        };
        return StateController;
    }(egret.DisplayObjectContainer));
    GameLongJump.StateController = StateController;
    __reflect(StateController.prototype, "GameLongJump.StateController");
})(GameLongJump || (GameLongJump = {}));
var GameLongJump;
(function (GameLongJump) {
    var userConfig = (function () {
        function userConfig() {
        }
        userConfig.jumpDis = 160;
        userConfig.jumpSpeed = 8;
        userConfig.power = 0.4; //初始力量
        userConfig.powerAdd = 0.2; //每100ms增加的力量
        userConfig.jumpHeight = 200;
        userConfig.powerLimit = 4;
        userConfig.score = 60; //比分最大值
        return userConfig;
    }());
    GameLongJump.userConfig = userConfig;
    __reflect(userConfig.prototype, "GameLongJump.userConfig");
    var UserController = (function (_super) {
        __extends(UserController, _super);
        function UserController() {
            var _this = _super.call(this) || this;
            _this.isPlayAnim = false;
            _this.landSccess = function (score) {
                if (score !== 1 && score !== 2 && score !== 4 && score !== 6 && score !== 8 && score !== 10)
                    return;
                //溅起草花
                if (_this.target.platformType === GameLongJump.PlatformType.k ||
                    _this.target.platformType === GameLongJump.PlatformType.q ||
                    _this.target.platformType === GameLongJump.PlatformType.w ||
                    _this.target.platformType === GameLongJump.PlatformType.max_r ||
                    _this.target.platformType === GameLongJump.PlatformType.g) {
                    _this.normalPlatformEffect.x = _this.userCharacter.x;
                    _this.normalPlatformEffect.y = _this.userCharacter.y;
                    _this.normalPlatformEffect.play("newAnimation", 1);
                }
                _this.userCharacter.gotoAndStopByProgress("xuli", 0);
                _this._power = userConfig.power;
                /** 压缩位置 */
                _this.posY = _this.userCharacter.y;
                _this.jumpSuccessLightAnim(_this.combo);
                _this.currentPlatform = _this.target;
                _this.userCharacter.scaleY = 0.8;
                _this.shakeTips(score);
                //播放音效
                App.SoundManager.playEffect("A\uFF0B" + score + "_mp3");
                GameLongJumpView.instance.platformController.moveWorld(_this.target, _this._currentPlatform);
                GameLongJumpView.instance.canJump = true;
                egret.Tween.get(_this.userCharacter).to({ scaleY: 1 }, 300);
            };
            _this.landFailure = function () {
                if (_this.power * userConfig.jumpDis > _this.target.offsetFromLast + _this.target.offsetToEdge)
                    GameLongJumpView.instance.gameLayer.addChildAt(_this.userCharacter, 0);
                _this.combo = 0;
                _this.userCharacter.play("luoshui", 1);
                var random = Math.floor(Math.random() * 3) + 1;
                App.SoundManager.playEffect("longJump_drop" + random + "_mp3", true);
                _this.onParticleEffect(_this.userCharacter.x, _this.userCharacter.y);
                egret.Tween.get(_this.userCharacter).to({ y: _this.userCharacter.y + 120, alpha: 0 }, 800).call(function () {
                    _this.userCharacter.alpha = 1;
                    /** 回到刚才的位置 */
                    GameLongJumpView.instance.gameLayer.addChild(_this.userCharacter);
                    _this.userCharacter.gotoAndStopByProgress("xuli", 0);
                    _this.setPos();
                    var effect = new EffectUtils();
                    effect.startFlicker(_this.userCharacter, 50);
                    App.TimerManager.doTimer(300, 1, function () {
                        effect.stopFlicker(_this.userCharacter);
                        _this.userCharacter.alpha = 1;
                        GameLongJumpView.instance.canJump = true;
                    }, _this);
                });
            };
            return _this;
        }
        UserController.prototype.init = function () {
            this.normalPlatformEffect = AssetManager.getDBArmature("Fang_1");
            this.normalPlatformEffect.gotoAndStopByProgress("newAnimation", 1);
            if (DataCenter.instance.room.selfIsMaster) {
                this.userCharacter = new GameLongJump.Character(AssetManager.getDBArmature("wa1")["_armature"]);
            }
            else {
                this.userCharacter = new GameLongJump.Character(AssetManager.getDBArmature("wa2")["_armature"]);
            }
            this.userCharacter.name = "Self";
            GameLongJumpView.instance.gameLayer.addChild(this.userCharacter);
            this._power = userConfig.power;
            this.floatScore = AssetManager.getDBArmature("floatScore");
            GameLongJumpView.instance.moveLayer.addChild(this.floatScore);
            GameLongJumpView.instance.moveLayer.addChild(this.normalPlatformEffect);
            this.combo = 0;
        };
        Object.defineProperty(UserController.prototype, "currentPlatform", {
            set: function (value) {
                this._currentPlatform = value;
                this.target = GameLongJumpView.instance.platformController.creatNext(this._currentPlatform);
                this.target.offsetFromLast = GameLongJumpView.instance.platformController.getPlatformOffset(this._currentPlatform, this.target);
                var slopeOrDir = this.getSlopeOrDir();
                if (slopeOrDir.dir) {
                    this.userCharacter.scaleX = 1;
                }
                else {
                    this.userCharacter.scaleX = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserController.prototype, "power", {
            get: function () {
                return this._power;
            },
            set: function (power) {
                this._power = power; //      power 1,power1.6,5/8
                this._currentPlatform.scaleY = (GameLongJump.CharacterController.powerSize - power) / GameLongJump.CharacterController.powerSize;
                this.userCharacter.y = this.posY + (this._currentPlatform.height * (1 - this._currentPlatform.scaleY));
                this.particalY = this.posY + (this._currentPlatform.height * (1 - this._currentPlatform.scaleY));
                if (!this.isPlayAnim) {
                    this.setPowerAnim();
                    this.isPlayAnim = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        UserController.prototype.shakeTips = function (score) {
            this.floatScore.scaleX = this.floatScore.scaleY = 1.4;
            this.floatScore.x = this._currentPlatform.collisionX;
            this.floatScore.y = this._currentPlatform.collisionY;
            this.floatScore.play("+" + score, 1);
            //加分
            if (!DataCenter.instance.room.IsAI) {
                var Score = GameLongJumpView.instance.stateController.selfScore + score;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "Score|" + DataCenter.instance.user.id + "|" + Score + "|" + this.combo, 1);
                console.log("Score" + Score);
            }
            else
                GameLongJumpView.instance.stateController.selfScore += score;
        };
        UserController.prototype.jump = function () {
            var _this = this;
            this.hideLightPower();
            this.isPlayAnim = false;
            egret.Tween.get(this._currentPlatform).to({ scaleY: 1 }, 300, egret.Ease.quintOut);
            GameLongJumpView.instance.canJump = false;
            var random = Math.floor(Math.random() * 2) + 1;
            App.SoundManager.stopEffect("longJump_powering_mp3");
            App.SoundManager.stopEffect("longJump_powerLimit_mp3");
            GameLongJumpView.instance.sound = false;
            App.SoundManager.playEffect("longJump_jump" + random + "_mp3", true);
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "jump|" + this.power, 2);
            }
            this.userCharacter.play("tiao");
            this.userCharacter.scaleY = 1;
            var dis = this.getDis();
            var middleDis = this.getDis(true);
            if (this.userCharacter.directionLOrR) {
                this.userCharacter.directionPosL1_X = this.userCharacter.x;
                this.userCharacter.directionPosL1_Y = this.userCharacter.y;
                this.userCharacter.directionPosL2_X = middleDis.x;
                this.userCharacter.directionPosL2_Y = middleDis.y;
                this.userCharacter.directionPosL3_X = dis.x;
                this.userCharacter.directionPosL3_Y = dis.y;
            }
            else {
                this.userCharacter.directionPosR1_X = this.userCharacter.x;
                this.userCharacter.directionPosR1_Y = this.userCharacter.y;
                this.userCharacter.directionPosR2_X = middleDis.x;
                this.userCharacter.directionPosR2_Y = middleDis.y;
                this.userCharacter.directionPosR3_X = dis.x;
                this.userCharacter.directionPosR3_Y = dis.y;
            }
            egret.Tween.get(this.userCharacter).to({ factorOne: 1 }, 300).call(function () {
                /** 目标，判断是否能跳上 */
                if (_this.power * userConfig.jumpDis < _this.target.offsetFromLast + _this.target.offsetToEdge &&
                    _this.power * userConfig.jumpDis > _this.target.offsetFromLast - _this.target.offsetToEdge) {
                    if (_this.power * userConfig.jumpDis < _this.target.offsetFromLast + _this.target.offsetToEdge * 0.3 &&
                        _this.power * userConfig.jumpDis > _this.target.offsetFromLast - _this.target.offsetToEdge * 0.3) {
                        if (_this.combo < 5)
                            _this.combo++;
                        if (_this.combo == 5)
                            App.SoundManager.playEffect("longJump_handclap_mp3", true);
                        if (isNaN(_this.combo)) {
                            _this.combo = 0;
                            _this.landSccess(1);
                        }
                        else
                            _this.landSccess(_this.combo * 2);
                    }
                    else {
                        _this.combo = 0;
                        _this.landSccess(1);
                    }
                    return;
                }
                /** 都没有跳上台子 */
                _this.landFailure();
            });
        };
        UserController.prototype.dispose = function () {
            egret.Tween.removeTweens(this.userCharacter);
            App.TimerManager.removeAll(this);
        };
        return UserController;
    }(GameLongJump.CharacterController));
    GameLongJump.UserController = UserController;
    __reflect(UserController.prototype, "GameLongJump.UserController");
})(GameLongJump || (GameLongJump = {}));
