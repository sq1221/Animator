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
/**
 * 电脑人
 */
var GameTwiceJoyAI = (function (_super) {
    __extends(GameTwiceJoyAI, _super);
    function GameTwiceJoyAI(gameInstance) {
        var _this = _super.call(this) || this;
        // 5级AI
        _this.setTimeoutBool = false; // 随机间隔执行动作
        _this.intervalIdRobotAiKey = 0;
        _this.setTimeoutIdRobotAiKey = 0;
        // 检测分数
        _this.checkResultScore = function () {
            // 不超过最大分数
            if (_this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore >= GameTwiceJoyModel.resultScore) {
                _this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore = GameTwiceJoyModel.resultScore;
            }
            // 进度条移动
            _this.gameTwiceJoyMainView.playerAvatarGroup2.right = _this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
            _this.gameTwiceJoyMainView.blueProgress.width = _this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
            // 先到达分数者胜出
            _this.gameTwiceJoyMainView.arriveScore();
        };
        // 游戏主类
        _this.gameTwiceJoyMainView = gameInstance;
        return _this;
    }
    // 根据等级切换不同状态下的Ai
    GameTwiceJoyAI.prototype.robotAiStart = function () {
        // 根据等级
        // if (GameTwiceJoyAI.robotAiLv == 5) {
        //     this.aiWin();
        // } else if (GameTwiceJoyAI.robotAiLv == 4) {
        //     this.hardModel();
        // } else if (GameTwiceJoyAI.robotAiLv <= 3) {
        //     // 简单模式
        //     this.hardModel();
        // }
        // 小米AI方向
        var conf = GameTwiceJoyMainView.aiConf[GameTwiceJoyAI.robotAiLv + ""];
        GameTwiceJoyAI.robotSec = conf.s + Math.random() * conf.r;
        this.hardModel();
    };
    // 5级必赢模式
    GameTwiceJoyAI.prototype.aiWin = function () {
        var _this = this;
        this.intervalIdRobotAiKey = egret.setInterval(function () {
            // 当前玩家分数
            var playerNowScore = _this.gameTwiceJoyMainView.gameTwiceJoyModel.myScore;
            // 当前AI分数
            var aINowScore = _this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore;
            // 让Ai保持领先
            if ((aINowScore - playerNowScore) <= 2 && playerNowScore > 0) {
                // 更新对方分数
                _this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                // 检测结果
                _this.checkResultScore();
            }
            else {
                if (_this.setTimeoutBool) {
                    return;
                }
                // 加分
                _this.setTimeoutBool = true;
                _this.setTimeoutIdRobotAiKey = egret.setTimeout(function () {
                    // 加分
                    _this.setTimeoutBool = false;
                    // 更新对方分数
                    _this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                    // 检测结果
                    _this.checkResultScore();
                }, _this, 1800 + Math.random() * 3000);
            }
        }, this, 100);
    };
    // 4级 稳定输出 3级及以下
    GameTwiceJoyAI.prototype.hardModel = function () {
        var _this = this;
        this.intervalIdRobotAiKey = egret.setInterval(function () {
            // 加分条件
            if (_this.setTimeoutBool) {
                return;
            }
            _this.setTimeoutBool = true;
            _this.setTimeoutIdRobotAiKey = egret.setTimeout(function () {
                // 加分条件
                _this.setTimeoutBool = false;
                // 对应等级
                // if (GameTwiceJoyAI.robotAiLv == 4) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                // } else if (GameTwiceJoyAI.robotAiLv == 3) {
                //     // 一定概率加分
                //     let isAddScore = Math.ceil(Math.random() * 10);
                //     //if (isAddScore >= 2) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                //     //}
                // } else if (GameTwiceJoyAI.robotAiLv == 2) {
                //     // 一定概率加分
                //     let isAddScore = Math.ceil(Math.random() * 10);
                //     // if (isAddScore >= 2) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                //     //}
                // } else if (GameTwiceJoyAI.robotAiLv == 1) {
                //     // 一定概率加分
                //     let isAddScore = Math.ceil(Math.random() * 10);
                //     //if (isAddScore >= 2) {
                //     // 更新对方分数
                //     this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                //     // }
                // }
                // 更新对方分数
                _this.gameTwiceJoyMainView.gameTwiceJoyModel.otherScore++;
                // 检测结果                         
                _this.checkResultScore();
            }, _this, GameTwiceJoyAI.robotSec);
        }, this, 500);
    };
    // 清楚数据
    GameTwiceJoyAI.prototype.clearData = function () {
        // 清除5级AI循环监听
        this.setTimeoutBool = false;
        egret.clearInterval(this.intervalIdRobotAiKey);
        egret.clearTimeout(this.setTimeoutIdRobotAiKey);
    };
    // 机器人等级
    GameTwiceJoyAI.robotAiLv = 3;
    GameTwiceJoyAI.robotSec = 0;
    return GameTwiceJoyAI;
}(egret.DisplayObjectContainer));
__reflect(GameTwiceJoyAI.prototype, "GameTwiceJoyAI");
/**
 * 卡片数据
 */
var GameTwiceJoyCard = (function (_super) {
    __extends(GameTwiceJoyCard, _super);
    function GameTwiceJoyCard() {
        var _this = _super.call(this, GameTwiceJoyCardSkin) || this;
        _this._cardType = 0; // 卡片类型
        _this._matchingSuccess = false; // 是否配对成功
        _this._isOpen = false; // 打开状态
        _this._cardPosId = 0; // 卡片id
        _this._matchingSuccess = false; // 是否配对成功
        _this._isOpen = false; // 打开状态
        return _this;
    }
    Object.defineProperty(GameTwiceJoyCard.prototype, "cardType", {
        get: function () {
            return this._cardType;
        },
        /**卡片类型 */
        set: function (value) {
            this._cardType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameTwiceJoyCard.prototype, "iconSource", {
        /**卡片icon */
        set: function (value) {
            this._iconSource = value;
            // 设置卡片素材
            if (this.showCardImg) {
                this.showCardImg.source = this._iconSource;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameTwiceJoyCard.prototype, "icon", {
        get: function () {
            return this._iconSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameTwiceJoyCard.prototype, "matchSuccess", {
        get: function () {
            return this._matchingSuccess;
        },
        /**是否配对成功 */
        set: function (value) {
            this._matchingSuccess = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameTwiceJoyCard.prototype, "isOpen", {
        get: function () {
            return this._isOpen;
        },
        /**是否开启中 */
        set: function (value) {
            this._isOpen = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameTwiceJoyCard.prototype, "cardPosId", {
        get: function () {
            return this._cardPosId;
        },
        /**卡片位置id*/
        set: function (value) {
            this._cardPosId = value;
        },
        enumerable: true,
        configurable: true
    });
    // 卡片打开动画
    GameTwiceJoyCard.prototype.cardOpen = function () {
        var self = this;
        self.clearTween();
        self.cardBgImg.scaleX = 0;
        self.showCardImg.scaleX = 0;
        self.hideCardImg.scaleX = 1;
        egret.Tween.get(self.hideCardImg).to({ scaleX: 0 }, 80, egret.Ease.backIn).call(function () {
            egret.Tween.get(self.cardBgImg).to({ scaleX: 1 }, 80, egret.Ease.backOut);
            egret.Tween.get(self.showCardImg).to({ scaleX: 1 }, 80, egret.Ease.backOut);
        });
    };
    // 卡片关闭动画
    GameTwiceJoyCard.prototype.cardClose = function () {
        var self = this;
        self.clearTween();
        self.cardBgImg.scaleX = 1;
        self.showCardImg.scaleX = 1;
        self.hideCardImg.scaleX = 0;
        egret.Tween.get(self.cardBgImg).to({ scaleX: 0 }, 80, egret.Ease.backOut);
        egret.Tween.get(self.showCardImg).to({ scaleX: 0 }, 80, egret.Ease.backIn).call(function () {
            egret.Tween.get(self.hideCardImg).to({ scaleX: 1 }, 80, egret.Ease.backOut);
        });
    };
    // 卡片配对成功动画
    GameTwiceJoyCard.prototype.cardMatchSuccess = function () {
        var self = this;
        self.clearTween();
        self.hideCardImg.visible = false;
        self.hideCardImg.scaleX = 0;
        self.cardBgImg.scaleX = self.cardBgImg.scaleY = 1;
        self.showCardImg.scaleX = self.showCardImg.scaleY = 1;
        egret.setTimeout(function () {
            egret.Tween.get(self.cardBgImg).to({ scaleX: 0, scaleY: 0 }, 300, egret.Ease.sineInOut);
            egret.Tween.get(self.showCardImg).to({ scaleX: 0, scaleY: 0 }, 300, egret.Ease.sineInOut);
            self.matchSuccessImg.visible = true;
            self.matchSuccessImg.scaleX = self.matchSuccessImg.scaleY = 1;
            egret.Tween.get(self.matchSuccessImg).to({ scaleX: 1.4, scaleY: 1.4 }, 100, egret.Ease.sineInOut).call(function () {
                egret.Tween.get(self.matchSuccessImg).to({ scaleX: 0, scaleY: 0 }, 80, egret.Ease.sineInOut);
            });
        }, this, 400);
    };
    // 清楚Tween动画
    GameTwiceJoyCard.prototype.clearTween = function () {
        egret.Tween.removeTweens(this.cardBgImg);
        egret.Tween.removeTweens(this.showCardImg);
        egret.Tween.removeTweens(this.hideCardImg);
        egret.Tween.removeTweens(this.matchSuccessImg);
    };
    return GameTwiceJoyCard;
}(EuiComponent));
__reflect(GameTwiceJoyCard.prototype, "GameTwiceJoyCard");
/**
 * 翻翻乐
 * by dingyafeng
 */
var GameTwiceJoyMainView = (function (_super) {
    __extends(GameTwiceJoyMainView, _super);
    function GameTwiceJoyMainView() {
        var _this = _super.call(this, GameTwiceJoyMainSkin) || this;
        _this.gameStartBool = false; // 游戏开始
        _this.cardsItemArr = []; // 存放所有的卡片对象
        _this.selectCardArr = []; // 记录点击的的卡片
        // 点击效果
        _this.particleManager = function (posX1, poxY1, posX2, poxY2, particleType, time) {
            if (particleType === void 0) { particleType = ""; }
            if (time === void 0) { time = 0.2; }
            _this.particleStars1.emitterX = posX1;
            _this.particleStars1.emitterY = poxY1;
            _this.particleStars1.start(100);
            _this.particleStars2.emitterX = posX2;
            _this.particleStars2.emitterY = poxY2;
            _this.particleStars2.start(100);
        };
        // 记录游戏数据
        _this.gameTwiceJoyModel = new GameTwiceJoyModel();
        return _this;
    }
    GameTwiceJoyMainView.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // 适配
        var a = App.GameWidth / GameTwiceJoyMainView.GAME_WIDTH;
        var b = App.GameHeight / GameTwiceJoyMainView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.containerGroup.scaleX = this.containerGroup.scaleY = c;
        this.containerGroup.x = (App.GameWidth - GameTwiceJoyMainView.GAME_WIDTH * c) * 0.5;
        this.containerGroup.y = (App.GameHeight - GameTwiceJoyMainView.GAME_HEIGHT * c) * 0.5;
        // 播放背景音乐
        App.SoundManager.stopBg();
        // 音效
        this.twiceJoyEffect = new SoundEffects();
        this.twiceJoyEffect.setVolume(1);
        this.twiceJoyCommonEffect = new SoundEffects();
        this.twiceJoyCommonEffect.setVolume(1);
        // 音乐切换后台监听
        egret.lifecycle.onPause = function () {
            if (_this.twiceJoyEffect) {
                _this.twiceJoyEffect.setVolume(0);
                // 背景音乐
                App.SoundManager.setBgOn(false);
                App.SoundManager.setEffectOn(false);
            }
            if (_this.twiceJoyCommonEffect) {
                _this.twiceJoyCommonEffect.setVolume(0);
            }
        };
        egret.lifecycle.onResume = function () {
            if (_this.twiceJoyEffect) {
                _this.twiceJoyEffect.setVolume(1);
                // 背景音乐
                App.SoundManager.setBgOn(true);
                App.SoundManager.setEffectOn(true);
            }
            if (_this.twiceJoyCommonEffect) {
                _this.twiceJoyCommonEffect.setVolume(1);
            }
        };
        // 获取随机种子函数
        GameTwiceJoyModel.random = new Math["seedrandom"](DataCenter.instance.room.id.toString());
        // 初始化地图
        this.gameTwiceJoyModel.mapInit();
        // 星星1
        var particleStarsTexture = RES.getRes("twice_stars_png");
        var particleStarsConfig = RES.getRes("twice_stars_json");
        this.particleStars1 = new particle.GravityParticleSystem(particleStarsTexture, particleStarsConfig);
        this.particleStars2 = new particle.GravityParticleSystem(particleStarsTexture, particleStarsConfig);
        this.cardEffectGroup.addChild(this.particleStars1);
        this.cardEffectGroup.addChild(this.particleStars2);
        // 加载地图数据
        for (var i = 1; i < 7; i++) {
            for (var j = 1; j < 5; j++) {
                // 当前索引
                var indexNum = (i - 1) * 4 + j;
                // 游戏Item
                var gameCardItem = new GameTwiceJoyCard();
                gameCardItem.anchorOffsetX = gameCardItem.anchorOffsetY = 67.5;
                gameCardItem.x = (j - 1) * 141 + 70.5;
                gameCardItem.y = (i - 1) * 141 + 70.5;
                gameCardItem.cardType = this.gameTwiceJoyModel.twiceMapData[indexNum - 1];
                gameCardItem.iconSource = "twiceIcon" + this.gameTwiceJoyModel.twiceMapData[indexNum - 1] + "_png";
                gameCardItem.cardPosId = indexNum;
                // 注册点击事件
                gameCardItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameCardItemClickHandle, this);
                // 放入数组管理(当前位置，数据)
                this.cardsItemArr.push({ cardType: gameCardItem.cardType, cardPosId: gameCardItem.cardPosId, cardItemData: gameCardItem });
                // 添加至 group
                this.cardsGroup.addChild(gameCardItem);
            }
        }
        // 返回按钮
        this.goBackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBackBtnHandler, this);
        // 小米平台去掉退出按钮
        if (App.IsXiaoMi || App.IsWanba) {
            // 无返回键
            this.goBackBtn.visible = false;
            this.goBackBtn.touchEnabled = false;
        }
        // 表情按钮
        for (var i = 1; i <= 6; ++i) {
            this["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendExpressMessage, this);
        }
        // 加载自己圆头像
        if (this.myHeadImage) {
            this.myHeadImage.dispose();
            this.myHeadImage = null;
        }
        this.myHeadImage = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 60, 60);
        // 加载对方圆头像
        if (this.otherHeadImage) {
            this.otherHeadImage.dispose();
            this.otherHeadImage = null;
        }
        this.otherHeadImage = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 60, 60);
    };
    GameTwiceJoyMainView.prototype.show = function () {
        _super.prototype.show.call(this);
        // 游戏未开始
        this.gameStartBool = false;
        // 加载头像开始游戏
        this.playerAvatarAdd();
        // 开启电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 电脑人模式
            this.gameRobotAi = new GameTwiceJoyAI(this);
            // Ai等级
            GameTwiceJoyAI.robotAiLv = App.CurrGameAiLevel;
        }
    };
    // 设置头像，并开启游戏
    GameTwiceJoyMainView.prototype.playerAvatarAdd = function () {
        var _this = this;
        // 名称，性别
        var user = DataCenter.instance.user;
        this.player1NameLab.text = user.name;
        this.player1SexImg.source = GameCenterGetSexIcon.getSexIconSource(user.sex);
        var player = DataCenter.instance.room.player;
        this.player2NameLab.text = player.name;
        this.player2SexImg.source = GameCenterGetSexIcon.getSexIconSource(player.sex);
        // 加载头像,按钮位置设置
        this.player1Avatar.addChild(this.myHeadImage);
        this.myHeadImage.x = 0;
        this.myHeadImage.y = 0;
        this.player2Avatar.addChild(this.otherHeadImage);
        this.otherHeadImage.x = 0;
        this.otherHeadImage.y = 0;
        this.playerAvatarGroup1.left = this.playerAvatarGroup2.right = 0;
        // 机器人模式下获取服务器ai配置
        if (DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, function (data) {
                GameTwiceJoyMainView.aiConf = data;
                console.log("IsXiaoMi" + App.CurrGameAiLevel + "   " + JSON.stringify(GameTwiceJoyMainView.aiConf));
                // 游戏开始
                _this.gameStart();
            });
        }
        else {
            // 游戏开始
            this.gameStart();
        }
    };
    // 播放开始游戏ready go
    GameTwiceJoyMainView.prototype.gameStart = function () {
        // 播放开始ready go
        function readyGoFun() {
            var _this = this;
            this.readyIMG = new GameReady(function () {
                // 播放背景音乐
                App.SoundManager.playBg("twiceJoy_bg_mp3");
                // 游戏开始
                _this.gameStartBool = true;
                // Ai机器人
                if (DataCenter.instance.room.IsAI) {
                    // 开启机器人
                    if (_this.gameRobotAi) {
                        _this.gameRobotAi.robotAiStart();
                    }
                }
            });
            this.readyIMG.x = 300;
            this.readyIMG.y = App.GameHeight / 2;
            this.addChild(this.readyIMG);
            this.readyIMG.play();
        }
        // 延时播放
        this.clearTimeoutReadyId = egret.setTimeout(readyGoFun, this, 800);
    };
    // 注册服务器返回消息
    GameTwiceJoyMainView.prototype.addMesssgaeListener = function () {
        _super.prototype.addMesssgaeListener.call(this);
        // 接受消除成功消息
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        // 点击游戏离开
        App.MessageCenter.addListener(EventMessage.GameLeave, this.onGameleave, this);
    };
    GameTwiceJoyMainView.prototype.onGameEvent = function (data) {
        var arrEventData = data.event.split("|");
        switch (arrEventData[0]) {
            case GameTwiceJoyModel.CARD_MATCH_SUCCESS:
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 更新自己分数
                    this.gameTwiceJoyModel.myScore++;
                    // 进度条移动
                    this.playerAvatarGroup1.left = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    this.redProgress.width = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    // 先到达分数者胜出
                    this.arriveScore();
                }
                else {
                    // 更新对方分数
                    this.gameTwiceJoyModel.otherScore++;
                    // 进度条移动
                    this.playerAvatarGroup2.right = this.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    this.blueProgress.width = this.gameTwiceJoyModel.otherScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    // 先到达分数者胜出
                    this.arriveScore();
                }
                break;
            case GameTwiceJoyModel.SEND_EXPRESS:
                this.addQiPaoCartoon(arrEventData[1], 2);
                break;
        }
    };
    // 时间内先达到分数者获胜
    GameTwiceJoyMainView.prototype.arriveScore = function () {
        if (this.gameTwiceJoyModel.myScore >= GameTwiceJoyModel.resultScore) {
            //自己嬴
            this.sendResult(3);
            return;
        }
        if (this.gameTwiceJoyModel.otherScore >= GameTwiceJoyModel.resultScore) {
            //对方嬴
            this.sendResult(1);
        }
    };
    // 弹出游戏结果画面
    GameTwiceJoyMainView.prototype.onGameResult = function (data) {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 发送游戏结果
        this.popup("GameResult", null);
    };
    // 收到游戏离开
    GameTwiceJoyMainView.prototype.onGameleave = function () {
        this.clearData();
    };
    GameTwiceJoyMainView.prototype.clearData = function () {
        // 游戏停止
        this.gameStartBool = false;
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
            }
        }
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
    };
    GameTwiceJoyMainView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi = null;
            }
        }
        // 清空地图数据
        this.cardsItemArr.splice(0);
        this.cardsItemArr = [];
        // 清空点击记录的数据
        this.selectCardArr.splice(0);
        this.selectCardArr = [];
        // 游戏停止
        this.gameStartBool = false;
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
        // 清楚地图数据
        this.cardsGroup.removeChildren();
        // 背景音乐
        App.SoundManager.stopBg();
        // 音效
        this.twiceJoyEffect.setVolume(0);
        this.twiceJoyCommonEffect.setVolume(0);
        this.twiceJoyEffect = null;
        this.twiceJoyCommonEffect = null;
    };
    // 点击自己头像
    GameTwiceJoyMainView.prototype.playerAvatarGroup1Handler = function () {
        // 点击
        this.twiceJoyCommonEffect && this.twiceJoyCommonEffect.play("mouseClickSound_mp3");
        // 信息
        var playerData;
        // 当前信息
        playerData = DataCenter.instance.user;
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    };
    // 点击对方头像
    GameTwiceJoyMainView.prototype.playerAvatarGroup2Handler = function () {
        // 点击
        this.twiceJoyCommonEffect && this.twiceJoyCommonEffect.play("mouseClickSound_mp3");
        // 信息
        var playerData;
        // 当前信息
        playerData = DataCenter.instance.room.player;
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    };
    // 点击卡片
    GameTwiceJoyMainView.prototype.gameCardItemClickHandle = function (event) {
        // 游戏未开始的时候禁止点击
        if (!this.gameStartBool) {
            return;
        }
        // 当前卡片数据
        var item = event.currentTarget;
        // 是否开启中
        if (item.isOpen) {
            return;
        }
        else {
            // 开启
            item.isOpen = true;
        }
        // 打开音效
        this.twiceJoyEffect && this.twiceJoyEffect.play("twiceJoy_open_mp3");
        // 检测点击后的结果
        this.cardMatchCheck(item, item.x, item.y);
    };
    // 配对
    GameTwiceJoyMainView.prototype.cardMatchCheck = function (currentItem, posX, poxY) {
        // 上一对未匹配成功
        if (this.selectCardArr.length == 2) {
            // 再次隐藏 翻转效果
            for (var i = 0; i < this.cardsItemArr.length; i++) {
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[0]) {
                    // 关闭
                    this.cardsItemArr[i].cardItemData.isOpen = false;
                    this.cardsItemArr[i].cardItemData.cardClose();
                }
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[1]) {
                    // 关闭
                    this.cardsItemArr[i].cardItemData.isOpen = false;
                    this.cardsItemArr[i].cardItemData.cardClose();
                }
            }
            // 清空数据
            this.selectCardArr.splice(0);
            this.selectCardArr = [];
        }
        // 第一组数据
        if (this.selectCardArr.length == 0) {
            // 放入第一个 并打开
            this.selectCardArr.push(currentItem.cardPosId);
            currentItem.cardOpen();
        }
        else if (this.selectCardArr.length == 1) {
            // 关闭点击
            this.gameStartBool = false;
            // 放入第二个
            this.selectCardArr.push(currentItem.cardPosId);
            var card1;
            var card2;
            for (var i = 0; i < this.cardsItemArr.length; i++) {
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[0]) {
                    card1 = this.cardsItemArr[i].cardItemData;
                }
                if (this.cardsItemArr[i].cardPosId == this.selectCardArr[1]) {
                    card2 = this.cardsItemArr[i].cardItemData;
                }
            }
            // 是否可以消除
            if (card1.cardType == card2.cardType) {
                // 成功音效
                this.twiceJoyEffect && this.twiceJoyEffect.play("twiceJoy_matchSuccess_mp3");
                // 播放粒子效果
                this.particleManager(card1.x, card1.y, card2.x, card2.y);
                // 情况记录数组
                this.selectCardArr.splice(0);
                this.selectCardArr = [];
                // 清楚点击事件
                card1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameCardItemClickHandle, this);
                card2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameCardItemClickHandle, this);
                // 消除
                card1.cardMatchSuccess();
                card2.cardMatchSuccess();
                if (!DataCenter.instance.room.IsAI) {
                    // 向服务器发送 消除成功 消息
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameTwiceJoyModel.CARD_MATCH_SUCCESS, 1);
                }
                else {
                    // 更新自己分数
                    this.gameTwiceJoyModel.myScore++;
                    // 进度条移动
                    this.playerAvatarGroup1.left = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    this.redProgress.width = this.gameTwiceJoyModel.myScore / GameTwiceJoyModel.resultScore * GameTwiceJoyMainView.avatarMoveDistance;
                    // 先到达分数者胜出
                    this.arriveScore();
                }
            }
            else {
                // 音效
                this.twiceJoyEffect && this.twiceJoyEffect.play("twiceJoy_matchFailed_mp3");
                // 翻转效果
                currentItem.cardOpen();
            }
            // 开启点击
            this.gameStartBool = true;
        }
    };
    // 添加表情气泡
    GameTwiceJoyMainView.prototype.addQiPaoCartoon = function (data, type) {
        if (type === void 0) { type = 1; }
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(100, 110);
        this.addChild(qiPao);
        if (type == 2) {
            qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 145, App.GameWidth - 125);
            qiPao.setSouce(data, true, 1);
        }
        else {
            qiPao.setSouce(data, false, 1);
            qiPao.x = App.RandomUtils.limitInteger(125, 145);
            if (!DataCenter.instance.room.IsAI) {
                var str = GameTwiceJoyModel.SEND_EXPRESS + "|" + data;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            else {
                var num = App.RandomUtils.limitInteger(1, 5);
                if (num % 2 != 0) {
                    App.TimerManager.doTimer(1000 * num, 1, this.AddAIexpress, this);
                }
            }
        }
        if (type == 1) {
            qiPao.img_1.scaleX = -1;
            qiPao.onPlay(1);
        }
        else {
            qiPao.onPlay(2);
        }
    };
    // 添加Ai的表情
    GameTwiceJoyMainView.prototype.AddAIexpress = function () {
        var num = App.RandomUtils.limitInteger(1, 6);
        var str = "Express_five" + num + "_png";
        this.addQiPaoCartoon(str, 2);
    };
    // 点击表情
    GameTwiceJoyMainView.prototype.onSendExpressMessage = function (e) {
        var time1 = egret.getTimer();
        if (time1 - DataCenter.instance.SendExpressTime > 500) {
            DataCenter.instance.SendExpressTime = time1;
            var str = "Express_five" + e.target.name + "_png";
            this.addQiPaoCartoon(str, 1);
        }
    };
    // 请求游戏返回
    GameTwiceJoyMainView.prototype.goBackBtnHandler = function () {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    };
    // 发送游戏结果
    GameTwiceJoyMainView.prototype.sendResult = function (result) {
        // 被扔雪球，被嘲笑，被发现，当前santa动画播放状态
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 清楚数据
        this.clearData();
        // 发送结果
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    GameTwiceJoyMainView.GAME_WIDTH = 640;
    GameTwiceJoyMainView.GAME_HEIGHT = 1136;
    //-----------变量---------
    GameTwiceJoyMainView.avatarMoveDistance = 206; // 头像移动距离
    GameTwiceJoyMainView.aiConf = {};
    return GameTwiceJoyMainView;
}(StateEui));
__reflect(GameTwiceJoyMainView.prototype, "GameTwiceJoyMainView");
/**
 * 翻翻乐model
 */
var GameTwiceJoyModel = (function () {
    function GameTwiceJoyModel() {
        this.twiceMapData = []; // 地图数据
        this.myScore = 0; // 我的分数
        this.otherScore = 0; // 对方分数
        // 初始化分数
        this.myScore = 0;
        this.otherScore = 0;
    }
    // 地图初始化
    GameTwiceJoyModel.prototype.mapInit = function () {
        // 清空上一次地图数据
        this.twiceMapData.splice(0);
        this.twiceMapData = [];
        // 临时地图数据
        var mapData = [];
        // 取8个
        var twiceTypeNum = [1, 5, 2, 6, 3, 7, 4, 8]; // 地图类型
        for (var i = 0; i < 8; i++) {
            var index = Math.floor(GameTwiceJoyModel.random() * twiceTypeNum.length);
            // 地图数据
            mapData.push(twiceTypeNum[index]);
            mapData.push(twiceTypeNum[index]);
            // 清除已经取出的
            twiceTypeNum.splice(index, 1);
        }
        // 取4个
        var twiceTypeNum2 = [1, 5, 2, 6, 3, 7, 4, 8]; // 地图类型
        for (var m = 0; m < 4; m++) {
            var index = Math.floor(GameTwiceJoyModel.random() * twiceTypeNum2.length);
            // 地图数据
            mapData.push(twiceTypeNum2[index]);
            mapData.push(twiceTypeNum2[index]);
            // 清除已经取出的
            twiceTypeNum2.splice(index, 1);
        }
        // 最终地图数据
        for (var n = 0; n < 24; n++) {
            var index = Math.floor(GameTwiceJoyModel.random() * mapData.length);
            // 地图数据
            this.twiceMapData.push(mapData[index]);
            mapData.splice(index, 1);
        }
    };
    GameTwiceJoyModel.CARD_MATCH_SUCCESS = "CARD_MATCH_SUCCESS"; // 消除成功
    GameTwiceJoyModel.SEND_EXPRESS = "SEND_EXPRESS"; // 发送表情
    GameTwiceJoyModel.resultScore = 12; // 优先配对成功总数
    return GameTwiceJoyModel;
}());
__reflect(GameTwiceJoyModel.prototype, "GameTwiceJoyModel");
