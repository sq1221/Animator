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
 * 雪球
 */
var GameChristmasBall = (function (_super) {
    __extends(GameChristmasBall, _super);
    function GameChristmasBall() {
        var _this = _super.call(this) || this;
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
    Object.defineProperty(GameChristmasBall.prototype, "factorOne", {
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
    Object.defineProperty(GameChristmasBall.prototype, "factorTwo", {
        //-------------掉落-------------
        get: function () {
            return 0;
        },
        set: function (value) {
            if (this.directionLOrR == 1) {
                this.x = (1 - value) * (1 - value) * this.directionPosL3_X + 2 * value * (1 - value) * (this.directionPosL3_X - 100) + value * value * Math.ceil((this.directionPosL3_X - 100) - Math.random() * 100);
                this.y = (1 - value) * (1 - value) * this.directionPosL3_Y + 2 * value * (1 - value) * (this.directionPosL3_Y + 280) + value * value * Math.ceil((this.directionPosL3_Y + 300) + Math.random() * 30);
                return;
            }
            this.x = (1 - value) * (1 - value) * this.directionPosR3_X + 2 * value * (1 - value) * (this.directionPosR3_X + 80) + value * value * Math.ceil((this.directionPosR3_X + 100) + Math.random() * 100);
            this.y = (1 - value) * (1 - value) * this.directionPosR3_Y + 2 * value * (1 - value) * (this.directionPosR3_Y + 280) + value * value * Math.ceil((this.directionPosR3_Y + 300) + Math.random() * 30);
        },
        enumerable: true,
        configurable: true
    });
    return GameChristmasBall;
}(egret.Bitmap));
__reflect(GameChristmasBall.prototype, "GameChristmasBall");
/**
 * 鹿皇争霸
 * by dingyafeng
 */
var GameChristmasMainView = (function (_super) {
    __extends(GameChristmasMainView, _super);
    function GameChristmasMainView() {
        var _this = _super.call(this, GameChristmasMainSkin) || this;
        //-----------变量---------
        _this.daodanActionTimeout = 0; // 捣蛋按钮timeout
        _this.oneselfNum = 1; // 1:左侧2：右侧
        _this.gameStartBool = false; // 游戏开始
        _this.gameLastTime = 60; // 游戏时长
        _this.yujingIsPlay = false; // 预警动画是否播放中
        _this.xiaoIsPlay = false; // 笑动画是否播放中
        _this.nuIsPlay = false; // 怒动画是否播放中
        _this.santaDbIndex = 0; // 当前播放的动画是 1烟囱||2门||3礼物盒
        _this.currAmiIndex = 0; // 第几个动画
        _this.oneselfBeFound = false; // 玩家自己被发现
        _this.otherBeFound = false; // 对方玩家被发现
        // 游戏内部结算
        _this.resultPageFun = function () {
            // 弹出结果统计页
            _this.resultGroup.visible = true;
            _this.resultGroup.scaleX = _this.resultGroup.scaleY = 0.3;
            egret.Tween.get(_this.resultGroup)
                .to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.bounceOut)
                .wait(1600)
                .call(function () {
                _this.popup("GameResult", null);
            });
        };
        // 记录游戏数据
        _this.gameChristmasModel = new GameChristmasModel();
        // 游戏随机动画数据
        _this.gameChristmasSantaModel = new GameChristmasSantaModel();
        // 当前播放动画 1烟囱||2门||3礼物盒
        _this.santaDbIndex = 0;
        return _this;
    }
    GameChristmasMainView.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        //適配
        var a = App.GameWidth / GameChristmasMainView.GAME_WIDTH;
        var b = App.GameHeight / GameChristmasMainView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.containerGroup.scaleX = this.containerGroup.scaleY = c;
        this.containerGroup.x = (App.GameWidth - GameChristmasMainView.GAME_WIDTH * c) * 0.5;
        this.containerGroup.y = (App.GameHeight - GameChristmasMainView.GAME_HEIGHT * c) * 0.5;
        // 播放背景音乐
        App.SoundManager.stopBg();
        // 音效
        this.christmasEffect = new SoundEffects();
        this.christmasEffect.setVolume(1);
        this.christmasCommonEffect = new SoundEffects();
        this.christmasCommonEffect.setVolume(1);
        // 音乐切换后台监听
        egret.lifecycle.onPause = function () {
            if (_this.christmasEffect) {
                _this.christmasEffect.setVolume(0);
                // 背景音乐
                App.SoundManager.setBgOn(false);
                App.SoundManager.setEffectOn(false);
            }
            if (_this.christmasCommonEffect) {
                _this.christmasCommonEffect.setVolume(0);
            }
        };
        egret.lifecycle.onResume = function () {
            if (_this.christmasEffect) {
                _this.christmasEffect.setVolume(1);
                // 背景音乐
                App.SoundManager.setBgOn(true);
                App.SoundManager.setEffectOn(true);
            }
            if (_this.christmasCommonEffect) {
                _this.christmasCommonEffect.setVolume(1);
            }
        };
        // 初始化按钮状态
        this.btnsVisibleOrTouchEnabled(true, false);
        // 返回按钮
        this.goBackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBackBtnHandler, this);
        // 捣蛋点击事件
        this.daodanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.daodanBtnHandler, this);
        // 嘲讽点击事件
        this.chaofengBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chaofengBtnHandler, this);
        // 小米平台去掉退出按钮
        if (App.IsXiaoMi || App.IsWanba) {
            // 无返回键
            this.goBackBtn.visible = false;
            this.goBackBtn.touchEnabled = false;
            // 加载圆头像
            if (this.myHeadImage) {
                this.myHeadImage.dispose();
                this.myHeadImage = null;
            }
            this.myHeadImage = new RoleHeadImage(DataCenter.instance.user.imgUrl);
            // 加载圆头像
            if (this.otherHeadImage) {
                this.otherHeadImage.dispose();
                this.otherHeadImage = null;
            }
            this.otherHeadImage = new RoleHeadImage(DataCenter.instance.room.player.imgUrl);
        }
        else {
            // 我的头像
            this.playerAvatarGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerAvatarGroup1Handler, this);
            // 别人的头像
            this.playerAvatarGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerAvatarGroup2Handler, this);
            // 我的头像
            var myData = DataCenter.instance.user;
            this.myAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl, "toukuang");
            this.myAvatar.armature.play("jing");
            this.myAvatar.armature.scaleX = this.myAvatar.armature.scaleY = 0.5;
            // 对方头像
            var playData = DataCenter.instance.room.player;
            this.otherAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl, "toukuang");
            this.otherAvatar.armature.play("jing");
            this.otherAvatar.armature.scaleX = this.otherAvatar.armature.scaleY = 0.5;
        }
        // 游戏结算页
        this.resultGroup.visible = false;
    };
    GameChristmasMainView.prototype.show = function () {
        _super.prototype.show.call(this);
        // 游戏未开始
        this.gameStartBool = false;
        // 添加动画
        this.addAllDb();
        // 雪花粒子
        this.snowParticle();
        // 开启电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 电脑人模式
            this.gameRobotAi = new GameChristmasSantaAI(this, 2);
            // Ai等级
            GameChristmasSantaAI.robotAiLv = App.CurrGameAiLevel;
            // 默认玩家在左侧
            this.oneselfNum = 1;
            // 标记箭头在左
            this.youImg.x = 130;
            // 加载头像开始游戏
            this.playerAvatarAdd();
        }
    };
    // 雪花particle
    GameChristmasMainView.prototype.snowParticle = function () {
        var texture = RES.getRes("xuehua_png");
        var config = RES.getRes("xuehua_json");
        this.particleXueHua = new particle.GravityParticleSystem(texture, config);
        this.snowContainerGroup.addChild(this.particleXueHua);
        this.particleXueHua.start();
    };
    // 设置头像，并开启游戏
    GameChristmasMainView.prototype.playerAvatarAdd = function () {
        // 加载头像,按钮位置设置
        if (this.oneselfNum == 1) {
            if (App.IsXiaoMi) {
                this.playerAvatarGroup1.addChild(this.myHeadImage);
                this.myHeadImage.scaleX = this.myHeadImage.scaleY = 0.8;
                this.myHeadImage.x = 0;
                this.myHeadImage.y = 0;
                this.playerAvatarGroup2.addChild(this.otherHeadImage);
                this.otherHeadImage.scaleX = this.otherHeadImage.scaleY = 0.8;
                this.otherHeadImage.x = 0;
                this.otherHeadImage.y = 0;
            }
            else {
                this.playerAvatarGroup1.addChild(this.myAvatar.armature);
                this.myAvatar.armature.x = this.playerAvatarGroup1.width / 2;
                this.myAvatar.armature.y = this.playerAvatarGroup1.height * 0.8;
                this.playerAvatarGroup2.addChild(this.otherAvatar.armature);
                this.otherAvatar.armature.x = this.playerAvatarGroup2.width / 2;
                this.otherAvatar.armature.y = this.playerAvatarGroup2.height * 0.8;
            }
        }
        else {
            if (App.IsXiaoMi) {
                this.playerAvatarGroup1.addChild(this.otherHeadImage);
                this.otherHeadImage.scaleX = this.otherHeadImage.scaleY = 0.8;
                this.otherHeadImage.x = 0;
                this.otherHeadImage.y = 0;
                this.playerAvatarGroup2.addChild(this.myHeadImage);
                this.myHeadImage.scaleX = this.myHeadImage.scaleY = 0.8;
                this.myHeadImage.x = 0;
                this.myHeadImage.y = 0;
            }
            else {
                this.playerAvatarGroup1.addChild(this.otherAvatar.armature);
                this.otherAvatar.armature.x = this.playerAvatarGroup1.width / 2;
                this.otherAvatar.armature.y = this.playerAvatarGroup1.height * 0.8;
                this.playerAvatarGroup2.addChild(this.myAvatar.armature);
                this.myAvatar.armature.x = this.playerAvatarGroup2.width / 2;
                this.myAvatar.armature.y = this.playerAvatarGroup2.height * 0.8;
            }
        }
        // 游戏开始3，2，1，go
        this.gameStart();
    };
    // 播放开始游戏 3，2，1
    GameChristmasMainView.prototype.gameStart = function () {
        // you箭头缓动
        this.oneSelfTween();
        // 延时3秒播放
        this.clearTimeoutReadyId = egret.setTimeout(this.readyGoFun, this, 1200);
    };
    // 播放开始ready go
    GameChristmasMainView.prototype.readyGoFun = function () {
        var _this = this;
        this.readyIMG = new GameReady(function () {
            // 播放背景音乐
            App.SoundManager.playBg("christmas_bg_mp3");
            // 游戏开始
            _this.gameStartBool = true;
            // 取消箭头的缓动
            egret.Tween.removeTweens(_this.youImg);
            _this.youImg.visible = false;
            // 游戏剩余倒计时显示
            _this.startMatchingTime();
            // 随机播动画 Id小的一方随机动画
            if (DataCenter.instance.room.IsAI) {
                _this.randomPlaySantaAction();
                // 开启机器人动作播放
                if (_this.gameRobotAi) {
                    _this.gameRobotAi.randomPlayRobotAction();
                }
            }
            else {
                if (_this.oneselfNum == 1) {
                    _this.randomPlaySantaAction();
                }
            }
        });
        this.readyIMG.x = 300;
        this.readyIMG.y = App.GameHeight / 2;
        this.addChild(this.readyIMG);
        this.readyIMG.play();
    };
    // 注册服务器返回消息
    GameChristmasMainView.prototype.addMesssgaeListener = function () {
        _super.prototype.addMesssgaeListener.call(this);
        // 被扔雪球，被嘲笑，被发现，当前santa动画播放状态
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        // 点击游戏离开
        App.MessageCenter.addListener(EventMessage.GameLeave, this.onGameleave, this);
        // 非AI情况下请求主机
        if (!DataCenter.instance.room.IsAI) {
            // 请求主机
            if (DataCenter.instance.room.player.id > DataCenter.instance.user.id) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.GET_HOST_PC + "|" + DataCenter.instance.room.player.id, 2);
            }
            else {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.GET_HOST_PC + "|" + DataCenter.instance.user.id, 2);
            }
        }
    };
    GameChristmasMainView.prototype.onGameEvent = function (data) {
        var arrEventData = data.event.split("|");
        switch (arrEventData[0]) {
            case GameChristmasModel.GET_HOST_PC:
                // Ai情况下不接受
                if (DataCenter.instance.room.IsAI) {
                    return;
                }
                if (arrEventData[1] == DataCenter.instance.user.id) {
                    this.oneselfNum = 1;
                    // 标记箭头在左
                    this.youImg.x = 130;
                }
                else {
                    this.oneselfNum = 2;
                    // 标记箭头在右
                    this.youImg.x = App.GameWidth - 130;
                }
                // 开始游戏
                this.playerAvatarAdd();
                break;
            case GameChristmasModel.EVENT_THROW_SNOWBALL:
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 更新自己分数
                    this.gameChristmasModel.myScore++;
                    this["playerScoreLab" + this.oneselfNum].text = this.gameChristmasModel.myScore + "";
                    // 先到达分数者胜出
                    this.arriveScore();
                }
                else {
                    // 更新对方分数
                    if (this.oneselfNum == 1) {
                        // 更新对方分数
                        this.gameChristmasModel.otherScore++;
                        this["playerScoreLab" + 2].text = this.gameChristmasModel.otherScore + "";
                        // 先到达分数者胜出
                        this.arriveScore();
                        // 圣诞怒，笑
                        if (this.nuIsPlay || this.xiaoIsPlay) {
                            return;
                        }
                        // 扔雪球
                        this.playerThrowSnowBall(2);
                        return;
                    }
                    // 更新对方分数
                    this.gameChristmasModel.otherScore++;
                    this["playerScoreLab" + 1].text = this.gameChristmasModel.otherScore + "";
                    // 先到达分数者胜出
                    this.arriveScore();
                    // 圣诞怒，笑
                    if (this.nuIsPlay || this.xiaoIsPlay) {
                        return;
                    }
                    // 扔雪球
                    this.playerThrowSnowBall(1);
                }
                break;
            case GameChristmasModel.EVENT_MAKEFUN:
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 嘲讽并更新对方分数
                    this.makeFunOtherPlayer();
                }
                else {
                    // 更新自己分数
                    this.gameChristmasModel.myScore -= 2;
                    if (this.gameChristmasModel.myScore <= 0) {
                        this.gameChristmasModel.myScore = 0;
                    }
                    this["playerScoreLab" + this.oneselfNum].text = this.gameChristmasModel.myScore + "";
                    //  被嘲讽飘字
                    this.playerMakeFun(2);
                    if (this.oneselfNum == 1) {
                        this.zongseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
                    }
                    else {
                        this.ziseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
                    }
                }
                break;
            case GameChristmasModel.EVENT_BE_FOUND:
                // 清掉按钮隐藏延迟
                egret.clearTimeout(this.clearTimeoutHideBtnsId);
                // 清掉圣诞老人出现 笑状态的延迟
                egret.clearTimeout(this.clearTimeoutDaodanBtnYanChi);
                // 笑播放停止状态
                this.xiaoIsPlay = false;
                // 播放Santa发现后怒的动画
                this.santaPlayNuAmiFun();
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 播动画
                    if (this.oneselfNum == 1) {
                        this.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                    }
                    else {
                        this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                    }
                }
                else {
                    // 对方被发现
                    this.otherBeFound = true;
                    // 捣蛋按钮禁用,嘲讽按钮可用
                    if (!this.oneselfBeFound) {
                        this.btnsVisibleOrTouchEnabled(false, true);
                        // 播对方被发现动画
                        if (this.oneselfNum == 1) {
                            this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                        }
                        else {
                            this.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                        }
                    }
                    else {
                        this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                        this.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                    }
                }
                break;
            case GameChristmasSantaModel.STATUS_YANCONG_YUJING:
                // 烟囱预警
                this.yancongYujingFun();
                break;
            case GameChristmasSantaModel.STATUS_MEN_YUJING:
                // 门预警
                this.fangJianMenYujingFun();
                break;
            case GameChristmasSantaModel.STATUS_LIHE_YUJING:
                // 礼物盒预警
                this.liWuHeYujingFun();
                break;
            case GameChristmasModel.GAMEOVER_AND_STEPSCORE:
                // 清楚数据
                this.clearData();
                // 优先获胜者
                if (data.userId == DataCenter.instance.user.id) {
                    // 同步分数
                    this.gameChristmasModel.myScore = parseInt(arrEventData[1]);
                    this.gameChristmasModel.otherScore = parseInt(arrEventData[2]);
                    if (this.oneselfNum == 1) {
                        this.playerScoreLab1.text = arrEventData[1];
                        this.playerScoreLab2.text = arrEventData[2];
                    }
                    else {
                        this.playerScoreLab1.text = arrEventData[2];
                        this.playerScoreLab2.text = arrEventData[1];
                    }
                }
                else {
                    // 同步分数
                    this.gameChristmasModel.myScore = parseInt(arrEventData[2]);
                    this.gameChristmasModel.otherScore = parseInt(arrEventData[1]);
                    if (this.oneselfNum == 1) {
                        this.playerScoreLab1.text = arrEventData[2];
                        this.playerScoreLab2.text = arrEventData[1];
                    }
                    else {
                        this.playerScoreLab1.text = arrEventData[1];
                        this.playerScoreLab2.text = arrEventData[2];
                    }
                }
                // 发送输赢结果
                if (this.oneselfNum == 1) {
                    // 自己嬴
                    this.gameChristmasModel.myScore >= this.gameChristmasModel.otherScore ? this.sendResult(3) : this.sendResult(1);
                    // 停止接受被扔雪球，被嘲笑，被发现，当前santa动画播放状态
                    App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
                }
                break;
        }
    };
    // 烟囱预警
    GameChristmasMainView.prototype.yancongYujingFun = function () {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutThrowBall();
            }
        }
        // 当前播放的是烟囱
        this.santaDbIndex = 1;
        // 获取烟囱display
        this.santaDbDisplay = this.yancongDb;
        // 概率播放 感叹号预警 | 烟囱预警
        if (Math.random() * 10 < 5) {
            // 感叹号预警
            this.onYuJingTween(this.santaDbIndex, 1600);
            return;
        }
        // 烟囱预警
        this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_YANCONG_YUJING, true);
    };
    // 门预警
    GameChristmasMainView.prototype.fangJianMenYujingFun = function () {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutThrowBall();
            }
        }
        // 当前播放的是门
        this.santaDbIndex = 2;
        // 获取房间display
        this.santaDbDisplay = this.fangjianmenDb;
        // 门预警
        this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_MEN_YUJING, true);
    };
    // 礼物盒预警
    GameChristmasMainView.prototype.liWuHeYujingFun = function () {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutThrowBall();
            }
        }
        // 当前播放的是房间
        this.santaDbIndex = 3;
        // 获取礼物盒display
        this.santaDbDisplay = this.liwuheDb;
        // 概率播放 感叹号预警 | 礼物盒预警
        if (Math.random() * 10 < 5) {
            // 感叹号预警
            this.onYuJingTween(this.santaDbIndex, 1300);
            return;
        }
        // 礼盒预警
        this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_LIHE_YUJING, true);
    };
    // santa播放怒动画
    GameChristmasMainView.prototype.santaPlayNuAmiFun = function () {
        // santa骂的声音
        this.christmasCommonEffect && this.christmasCommonEffect.play("christmas_santaCurse_mp3");
        // 怒的动画
        if (this.santaDbIndex == 1) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_YANCONG_NU, true);
        }
        else if (this.santaDbIndex == 2) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_MEN_NU, true);
        }
        else if (this.santaDbIndex == 3) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_LIHE_NU, true);
        }
    };
    // 捣蛋，嘲讽按钮禁用或开启
    GameChristmasMainView.prototype.btnsVisibleOrTouchEnabled = function (daodanStatus, chaofengStatus) {
        // 捣蛋按钮状态
        this.daodanBtn.visible = daodanStatus;
        this.daodanBtn.touchEnabled = daodanStatus;
        // 嘲讽按钮状态
        this.chaofengBtn.visible = chaofengStatus;
        this.chaofengBtn.touchEnabled = chaofengStatus;
    };
    // 嘲讽别人
    GameChristmasMainView.prototype.makeFunOtherPlayer = function () {
        this.gameChristmasModel.otherScore -= 2;
        if (this.gameChristmasModel.otherScore <= 0) {
            this.gameChristmasModel.otherScore = 0;
        }
        if (this.oneselfNum == 1) {
            this.playerScoreLab2.text = this.gameChristmasModel.otherScore + "";
            this.ziseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
        }
        else {
            this.playerScoreLab1.text = this.gameChristmasModel.otherScore + "";
            this.zongseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
        }
    };
    GameChristmasMainView.prototype.setScoreView = function (red, blue) {
        switch (App.Language) {
            case LanguageType.Ch:
                this.redScoreLab.text = "红方" + red + "分"; // 红方分数
                this.blueScoreLab.text = "蓝方" + blue + "分";
                break;
            case LanguageType.En:
                this.redScoreLab.text = "Red " + red; // 红方分数
                this.blueScoreLab.text = "Blue" + blue;
                break;
        }
    };
    // 游戏结算页信息状态  1:win/lose   2:左右
    GameChristmasMainView.prototype.resultViewState = function () {
        var data = DataCenter.instance.room.gameResult;
        if (data.winUserId == DataCenter.instance.user.id) {
            // 强制为150
            if (this.gameLastTime > 0 && this.gameChristmasModel.myScore != GameChristmasModel.resultScore) {
                this.gameChristmasModel.myScore = GameChristmasModel.resultScore;
            }
            if (this.oneselfNum == 1) {
                this.blueWinFlagImg.visible = true; // 蓝方获胜flag
                this.blueScoreLab.textColor = 0xFFFFFF;
                this.blueScoreBg.source = "blueBg_png"; // 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuWin_png"; // 蓝方状态
                this.redWinFlagImg.visible = false; // 红方失败flag
                this.redScoreLab.textColor = 0x6F6F6F;
                this.redScoreBg.source = "loseBg_png"; // 红方分数背景
                this.resultRedLuImg.source = "redLuLose_png"; // 红方状态
                this.setScoreView(this.gameChristmasModel.otherScore, this.gameChristmasModel.myScore);
            }
            else {
                this.blueWinFlagImg.visible = false; // 蓝方失败flag
                this.blueScoreLab.textColor = 0x6F6F6F;
                this.blueScoreBg.source = "loseBg_png"; // 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuLose_png"; // 蓝方状态
                this.redWinFlagImg.visible = true; // 红方胜利flag
                this.redScoreLab.textColor = 0xFFFFFF;
                this.redScoreBg.source = "redBg_png"; // 红方分数背景
                this.resultRedLuImg.source = "redLuWin_png"; // 红方状态
                this.setScoreView(this.gameChristmasModel.myScore, this.gameChristmasModel.otherScore);
            }
        }
        else {
            // 强制为150
            if (this.gameLastTime > 0 && this.gameChristmasModel.otherScore != GameChristmasModel.resultScore) {
                this.gameChristmasModel.otherScore = GameChristmasModel.resultScore;
            }
            if (this.oneselfNum == 1) {
                this.blueWinFlagImg.visible = false; // 蓝方获胜flag
                this.blueScoreLab.textColor = 0x6F6F6F;
                this.blueScoreBg.source = "loseBg_png"; // 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuLose_png"; // 蓝方状态
                this.redWinFlagImg.visible = true; // 红方失败flag
                this.redScoreLab.textColor = 0xFFFFFF;
                this.redScoreBg.source = "redBg_png"; // 红方分数背景
                this.resultRedLuImg.source = "redLuWin_png"; // 红方状态
                this.setScoreView(this.gameChristmasModel.otherScore, this.gameChristmasModel.myScore);
            }
            else {
                this.blueWinFlagImg.visible = true; // 蓝方失败flag
                this.blueScoreLab.textColor = 0xFFFFFF;
                this.blueScoreBg.source = "blueBg_png"; // 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuWin_png"; // 蓝方状态
                this.redWinFlagImg.visible = false; // 红方胜利flag
                this.redScoreLab.textColor = 0x6F6F6F;
                this.redScoreBg.source = "loseBg_png"; // 红方分数背景
                this.resultRedLuImg.source = "redLuLose_png"; // 红方状态
                this.setScoreView(this.gameChristmasModel.myScore, this.gameChristmasModel.otherScore);
            }
        }
    };
    // 时间内先达到分数者获胜
    GameChristmasMainView.prototype.arriveScore = function () {
        // AI情况下
        if (DataCenter.instance.room.IsAI) {
            if (this.gameChristmasModel.myScore >= GameChristmasModel.resultScore) {
                // 清楚数据
                this.clearData();
                //我方嬴
                this.sendResult(3);
            }
            if (this.gameChristmasModel.otherScore >= GameChristmasModel.resultScore) {
                // 清楚数据
                this.clearData();
                //对方嬴
                this.sendResult(1);
            }
            return;
        }
        // pvp
        if (this.gameChristmasModel.myScore >= GameChristmasModel.resultScore) {
            // 清楚数据
            this.clearData();
            // 校正分数
            this.gameChristmasModel.myScore = GameChristmasModel.resultScore;
            // 同步分数
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.GAMEOVER_AND_STEPSCORE + "|" + this.gameChristmasModel.myScore + "|" + this.gameChristmasModel.otherScore, 1);
        }
        else if (this.gameChristmasModel.otherScore >= GameChristmasModel.resultScore) {
            // 清楚数据
            this.clearData();
            // 校正分数
            this.gameChristmasModel.otherScore = GameChristmasModel.resultScore;
            // 同步分数
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.GAMEOVER_AND_STEPSCORE + "|" + this.gameChristmasModel.myScore + "|" + this.gameChristmasModel.otherScore, 1);
        }
    };
    // 弹出游戏结果画面
    GameChristmasMainView.prototype.onGameResult = function (data) {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 内部结算面板信息
        this.resultViewState();
        // 发送游戏结果
        this.popup("GameResult", this.resultPageFun);
    };
    // 收到游戏离开
    GameChristmasMainView.prototype.onGameleave = function () {
        this.clearData();
    };
    GameChristmasMainView.prototype.clearData = function () {
        // 粒子关闭
        this.particleXueHua.stop();
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
            }
        }
        // 清楚ready go
        if (this.readyIMG) {
            this.readyIMG.dispose();
        }
        // 清楚随机播放santa动画
        egret.clearInterval(this.intervalIdKey);
        // 清掉按钮隐藏延迟
        egret.clearTimeout(this.clearTimeoutHideBtnsId);
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
        // 停止到计时
        App.TimerManager.remove(this.ontimerUpdate, this);
        // 停止当前游戏动作
        this.daodanBtn.touchEnabled = false;
        this.chaofengBtn.touchEnabled = false;
        // 停止所有Db
        this.stopAllDbAmi();
        // 清楚所有缓动
        egret.Tween.removeTweens(this.youImg);
        egret.Tween.removeTweens(this.renyingImg);
        egret.Tween.removeTweens(this.gantanhaoImg1);
        egret.Tween.removeTweens(this.gantanhaoImg2);
        egret.Tween.removeTweens(this.gantanhaoImg3);
        // 音效
        this.christmasEffect && this.christmasEffect.setVolume(0);
        this.christmasCommonEffect && this.christmasCommonEffect.setVolume(0);
        this.christmasEffect = null;
        this.christmasCommonEffect = null;
    };
    GameChristmasMainView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        // 头像
        if (this.myAvatar) {
            this.myAvatar.dispose();
            this.myAvatar = null;
        }
        if (this.otherAvatar) {
            this.otherAvatar.dispose();
            this.otherAvatar = null;
        }
        //
        if (this.readyIMG) {
            this.readyIMG.dispose();
        }
        // 停止监听
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        }
        // 清楚随机播放santa动画
        egret.clearInterval(this.intervalIdKey);
        // 清掉按钮隐藏延迟
        egret.clearTimeout(this.clearTimeoutHideBtnsId);
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi = null;
            }
        }
        // 停止所有Db
        this.stopAllDbAmi();
        // 清楚所有缓动
        egret.Tween.removeTweens(this.youImg);
        egret.Tween.removeTweens(this.renyingImg);
        egret.Tween.removeTweens(this.gantanhaoImg1);
        egret.Tween.removeTweens(this.gantanhaoImg2);
        egret.Tween.removeTweens(this.gantanhaoImg3);
        // 内部结算页
        egret.Tween.removeTweens(this.resultGroup);
        // 清楚对象池
        ObjectPool.clearClass("GameChristmasBall");
        ObjectPool.clearClass("GameChristmasScore");
        // 清楚group组里面的对象
        this.yancongDbGroup.removeChildren();
        this.menkuangDbGroup.removeChildren();
        this.liwuheDbGroup.removeChildren();
        this.ziseluGroup.removeChildren();
        this.zongseluGroup.removeChildren();
        // 结算页
        this.resultGroup.visible = false;
        // 自己被发现
        this.oneselfBeFound = false;
        // 对方被发现
        this.otherBeFound = false;
        // 音效
        this.christmasEffect && this.christmasEffect.setVolume(0);
        this.christmasCommonEffect && this.christmasCommonEffect.setVolume(0);
        this.christmasEffect = null;
        this.christmasCommonEffect = null;
    };
    // 头像
    GameChristmasMainView.prototype.playerAvatarGroup1Handler = function () {
        // 点击
        this.christmasCommonEffect && this.christmasCommonEffect.play("mouseClickSound_mp3");
        // 信息
        var playerData;
        if (this.oneselfNum == 1) {
            // 当前信息
            playerData = DataCenter.instance.user;
        }
        else {
            // 当前信息
            playerData = DataCenter.instance.room.player;
        }
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    };
    // 头像
    GameChristmasMainView.prototype.playerAvatarGroup2Handler = function () {
        // 点击
        this.christmasCommonEffect && this.christmasCommonEffect.play("mouseClickSound_mp3");
        // 信息
        var playerData;
        if (this.oneselfNum == 1) {
            // 当前信息
            playerData = DataCenter.instance.room.player;
        }
        else {
            // 当前信息
            playerData = DataCenter.instance.user;
        }
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    };
    // 请求游戏返回
    GameChristmasMainView.prototype.goBackBtnHandler = function () {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    };
    // 倒计时间刷新
    GameChristmasMainView.prototype.ontimerUpdate = function () {
        if (this.gameLastTime > 0) {
            this.gameLastTime--;
            this.timesLab.text = this.gameLastTime + "";
            // 倒计时音效
            if (this.gameLastTime < 4 && this.gameLastTime > 0) {
                this.christmasCommonEffect && this.christmasCommonEffect.play("countDownSound_mp3");
            }
            else if (this.gameLastTime == 0) {
                this.christmasCommonEffect && this.christmasCommonEffect.play("countDownSoundEnd_mp3");
            }
        }
        else {
            // 停止到计时
            App.TimerManager.remove(this.ontimerUpdate, this);
            // 清楚数据
            this.clearData();
            // 输赢结果
            if (this.gameChristmasModel.myScore == this.gameChristmasModel.otherScore) {
                this.gameChristmasModel.myScore++;
            }
            // Ai 
            if (DataCenter.instance.room.IsAI) {
                this.gameChristmasModel.myScore >= this.gameChristmasModel.otherScore ? this.sendResult(3) : this.sendResult(1);
                return;
            }
            // 输赢结果
            if (this.gameChristmasModel.myScore == this.gameChristmasModel.otherScore) {
                this.gameChristmasModel.myScore++;
            }
            // 同步分数
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.GAMEOVER_AND_STEPSCORE + "|" + this.gameChristmasModel.myScore + "|" + this.gameChristmasModel.otherScore, 1);
        }
    };
    // 发送游戏结果
    GameChristmasMainView.prototype.sendResult = function (result) {
        // 发送结果
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    // 游戏剩余倒计时显示
    GameChristmasMainView.prototype.startMatchingTime = function () {
        this.gameLastTime = 60;
        App.TimerManager.doTimer(1000, 0, this.ontimerUpdate, this);
    };
    // 标记个人的箭头 0:左 1：右
    GameChristmasMainView.prototype.oneSelfTween = function () {
        var _startY = this.youImg.y;
        var _endY = this.youImg.y + 60;
        this.youImg.x = this.youImg.x;
        this.youImg.visible = true;
        // 执行缓动
        egret.Tween.get(this.youImg, { loop: true }, egret.Ease.sineOut)
            .to({ scaleX: 0.7, scaleY: 0.7, x: this.youImg.x, y: _endY }, 400)
            .to({ scaleX: 0.8, scaleY: 0.8, x: this.youImg.x, y: _startY }, 400);
    };
    // 感叹号闪烁 gantanhaoIndex: 1,2,3  times预警时间
    GameChristmasMainView.prototype.onYuJingTween = function (gantanhaoIndex, times) {
        if (times === void 0) { times = 1000; }
        var self = this;
        // 当前闪烁对象
        var gthObj = this["gantanhaoImg" + gantanhaoIndex];
        gthObj.visible = true;
        // 执行缓动
        this.shanShuoTween = egret.Tween.get(gthObj, { loop: true }, egret.Ease.sineOut)
            .to({ visible: false }, 200)
            .to({ visible: true }, 200);
        egret.Tween.get(gthObj).wait(times).call(function () {
            // 预警播放完成
            self.yujingIsPlay = false;
            // 取消闪烁
            egret.Tween.removeTweens(gthObj);
            // 隐藏感叹号
            gthObj.visible = false;
            // 概率播放笑的动画 概率小于3的时候不播(服务器暂时不能传参数，随机值同步会有问题)
            // if (Math.random() * 10 < 3) {
            //     // 回到预警状态
            //     self.santaPlayStatusYuJingFun();
            //     return;
            // }
            // 随机播放笑的动画
            self.santaPlayStatusXiaoFun();
        });
    };
    //-------雪球缓动动画---------
    GameChristmasMainView.prototype.moveOne = function (ball) {
        egret.Tween.get(ball).to({ factorTwo: 1 }, 100).call(this.moveTwo.bind(this, ball));
    };
    GameChristmasMainView.prototype.moveTwo = function (ball) {
        var _this = this;
        egret.Tween.get(ball).to({ alpha: 0.2 }, 1600).call(function () {
            _this.snowContainerGroup.removeChild(ball);
            ObjectPool.push(ball);
        });
    };
    //-------数字缓动动画---------
    GameChristmasMainView.prototype.scoreTweenMove = function (scores) {
        var _this = this;
        egret.Tween.get(scores).wait(80).call(function () {
            _this.snowContainerGroup.removeChild(scores);
            ObjectPool.push(scores);
        });
    };
    // 捣蛋按钮事件
    GameChristmasMainView.prototype.daodanBtnHandler = function (event) {
        var _this = this;
        if (!this.gameStartBool) {
            return;
        }
        this.daodanBtn.touchEnabled = false;
        // 按钮频率
        this.daodanActionTimeout = setTimeout(function () {
            _this.daodanBtn.touchEnabled = true;
            egret.clearTimeout(_this.daodanActionTimeout);
        }, 80);
        // 扔雪球
        this.playerThrowSnowBall(this.oneselfNum);
        // 被发现
        if (this.xiaoIsPlay) {
            // 清掉按钮隐藏延迟
            egret.clearTimeout(this.clearTimeoutHideBtnsId);
            // 停止笑声音
            this.christmasCommonEffect && this.christmasCommonEffect.stopSound("santaSmileStatus_mp3");
            // 被发现
            this.oneselfBeFound = true;
            // 捣蛋按钮禁用,嘲讽按钮禁用
            this.btnsVisibleOrTouchEnabled(false, false);
            // 电脑人模式
            if (DataCenter.instance.room.IsAI) {
                // 笑播放完成   
                this.xiaoIsPlay = false;
                // 播放Santa发现动画
                this.santaPlayNuAmiFun();
                // 播放被发现动画
                this.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                // 机器人
                if (this.gameRobotAi) {
                    // ai 部分
                    this.gameRobotAi.clearData();
                    this.gameRobotAi.SetTimeoutExample();
                }
                return;
            }
            // 播放怒的动画开启
            this.nuIsPlay = true;
            // 向服务器发送被发现
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.EVENT_BE_FOUND, 1);
            return;
        }
        // 电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 更新自己分数
            this.gameChristmasModel.myScore++;
            this["playerScoreLab" + this.oneselfNum].text = this.gameChristmasModel.myScore + "";
            // 先到达分数者胜出
            this.arriveScore();
            return;
        }
        // 向服务器发送 捣蛋 消息
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.EVENT_THROW_SNOWBALL, 1);
    };
    // 紫色驯鹿播放攻击动作之后扫雪
    GameChristmasMainView.prototype.onThrowSnowBallXunlu1Complete = function () {
        // 移除监听
        this.xunLuDb1.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onThrowSnowBallXunlu1Complete, this);
        // 扫雪状态
        if (this.nuIsPlay || this.xiaoIsPlay) {
            // 我打别人的情况
            if (this.oneselfNum == 1 && this.oneselfBeFound) {
                return;
            }
            // 别人打我
            if (this.oneselfNum == 2 && this.otherBeFound) {
                return;
            }
        }
        this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
    };
    // 棕色驯鹿播放攻击动作之后扫雪
    GameChristmasMainView.prototype.onThrowSnowBallXunlu2Complete = function () {
        // 移除监听
        this.xunLuDb2.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onThrowSnowBallXunlu2Complete, this);
        // 扫雪状态
        if (this.nuIsPlay || this.xiaoIsPlay) {
            // 我打别人的情况
            if (this.oneselfNum == 2 && this.oneselfBeFound) {
                return;
            }
            // 别人打我
            if (this.oneselfNum == 1 && this.otherBeFound) {
                return;
            }
        }
        this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
    };
    // 棕色驯鹿播放挨打完成之后扫雪
    GameChristmasMainView.prototype.onBeatingXunlu2Complete = function () {
        // 移除监听
        this.xunLuDb2.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBeatingXunlu2Complete, this);
        if (this.oneselfBeFound) {
            // 我打别人
            if (this.oneselfNum == 1) {
                // 播放被发现动画
                this.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
            else {
                // 播放被发现动画
                this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        }
        else {
            if (this.oneselfNum == 1) {
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
            else if (this.oneselfNum == 2) {
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        }
    };
    // 紫色驯鹿播放挨打完成之后扫雪
    GameChristmasMainView.prototype.onBeatingXunlu1Complete = function () {
        // 移除监听
        this.xunLuDb1.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBeatingXunlu1Complete, this);
        if (this.oneselfBeFound) {
            // 我打别人
            if (this.oneselfNum == 1) {
                // 播放被发现动画
                this.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
            else {
                // 播放被发现动画
                this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        }
        else {
            if (this.oneselfNum == 1) {
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
            else if (this.oneselfNum == 2) {
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        }
    };
    // 扔雪球  1：向右侧扔雪球 2：向右侧扔雪球
    GameChristmasMainView.prototype.playerThrowSnowBall = function (directLorR) {
        // 捣蛋声音
        this.christmasEffect && this.christmasEffect.play("christmas_throwSnowBall" + Math.ceil(Math.random() * 2) + "_mp3");
        // 被打的声音
        this.christmasEffect && this.christmasEffect.play("christmas_beating" + Math.ceil(Math.random() * 2) + "_mp3");
        // 捣蛋动画
        if (directLorR == 1) {
            // 扔雪球
            this.xunLuDb1.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onThrowSnowBallXunlu1Complete, this);
            this.ziseluAmiPlay(GameChristmasModel.STATUS_THROW_SNOWBALL);
            // 对方播放挨打动画一次
            this.xunLuDb2.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBeatingXunlu2Complete, this);
            this.zongseluAmiPlay(GameChristmasModel.STATUS_BEATING);
        }
        else {
            // 扔雪球
            this.xunLuDb2.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onThrowSnowBallXunlu2Complete, this);
            this.zongseluAmiPlay(GameChristmasModel.STATUS_THROW_SNOWBALL);
            // 对方播放挨打动画一次
            this.xunLuDb1.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBeatingXunlu1Complete, this);
            this.ziseluAmiPlay(GameChristmasModel.STATUS_BEATING);
        }
        // 动态生成雪球
        var ball = ObjectPool.pop(GameChristmasBall, "GameChristmasBall");
        ball.alpha = 1;
        ball.texture = RES.getRes("xueqiu_png");
        // 雪球方向
        ball.directionLOrR = directLorR;
        // 雪球初始位置
        if (ball.directionLOrR == 1) {
            ball.x = this.ziseluGroup.x;
            ball.y = 620;
            ball.directionPosL1_X = this.ziseluGroup.x;
            ball.directionPosL1_Y = 620;
            ball.directionPosL2_X = this.ziseluGroup.x + (this.zongseluGroup.x - this.ziseluGroup.x) * (1 / 3);
            ball.directionPosL2_Y = 500;
            ball.directionPosL3_X = this.zongseluGroup.x - 80;
            ball.directionPosL3_Y = 590 + Math.ceil(Math.random() * 40);
        }
        else if (ball.directionLOrR == 2) {
            ball.x = this.zongseluGroup.x;
            ball.y = 620;
            ball.directionPosR1_X = this.zongseluGroup.x;
            ball.directionPosR1_Y = 620;
            ball.directionPosR2_X = this.zongseluGroup.x - (this.zongseluGroup.x - this.ziseluGroup.x) * (2 / 3);
            ball.directionPosR2_Y = 500;
            ball.directionPosR3_X = this.ziseluGroup.x + 60;
            ball.directionPosR3_Y = 590 + Math.ceil(Math.random() * 40);
        }
        // 添加到容器
        this.snowContainerGroup.addChild(ball);
        // 执行缓动
        egret.Tween.get(ball).to({ factorOne: 1 }, 100).call(this.moveOne.bind(this, ball));
        // 动态生成数字
        var scoreImg = ObjectPool.pop(GameChristmasScore, "GameChristmasScore");
        var colorType = Math.ceil(Math.random() * 4);
        // 左侧
        if (ball.directionLOrR == 1) {
            scoreImg.texture = RES.getRes("oneL" + colorType + "_png");
            scoreImg.x = this.ziseluGroup.x + 110;
            scoreImg.y = this.ziseluGroup.y - 400;
        }
        else if (ball.directionLOrR == 2) {
            scoreImg.texture = RES.getRes("oneR" + colorType + "_png");
            scoreImg.x = this.zongseluGroup.x - 110;
            scoreImg.y = this.zongseluGroup.y - 400;
        }
        scoreImg.alpha = 1;
        // 添加到容器
        this.snowContainerGroup.addChild(scoreImg);
        // 执行缓动
        egret.Tween.get(scoreImg).to({ x: scoreImg.x, y: (scoreImg.y - 200), alpha: 0.2 }, 1000).call(this.scoreTweenMove.bind(this, scoreImg));
    };
    // 嘲讽按钮事件
    GameChristmasMainView.prototype.chaofengBtnHandler = function (event) {
        if (!this.gameStartBool) {
            return;
        }
        //  嘲讽飘字
        this.playerMakeFun(1);
        // 嘲讽机器人模式 
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi.robotBeMakeFun && !this.oneselfBeFound) {
                this.makeFunOtherPlayer();
                return;
            }
        }
        // 向 服务器 发送消息
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.EVENT_MAKEFUN, 1);
    };
    // 嘲讽 1:嘲讽别人，2：被嘲讽
    GameChristmasMainView.prototype.playerMakeFun = function (makeFunStatus) {
        // 嘲讽声音
        this.christmasEffect && this.christmasEffect.play("christmas_makeFun1_mp3");
        // 动态生成数字
        var scoreImg = ObjectPool.pop(GameChristmasScore, "GameChristmasScore");
        var colorType = Math.ceil(Math.random() * 4);
        // 嘲讽别人
        if (makeFunStatus == 1) {
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("twoL" + colorType + "_png");
                scoreImg.x = this.zongseluGroup.x - 110;
                scoreImg.y = this.zongseluGroup.y - 400;
            }
            else {
                scoreImg.texture = RES.getRes("twoL" + colorType + "_png");
                scoreImg.x = this.ziseluGroup.x + 110;
                scoreImg.y = this.ziseluGroup.y - 400;
            }
        }
        else if (makeFunStatus == 2) {
            // 被别人嘲讽
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("twoL" + colorType + "_png");
                scoreImg.x = this.ziseluGroup.x + 110;
                scoreImg.y = this.ziseluGroup.y - 400;
            }
            else {
                scoreImg.texture = RES.getRes("twoL" + colorType + "_png");
                scoreImg.x = this.zongseluGroup.x - 110;
                scoreImg.y = this.zongseluGroup.y - 400;
            }
        }
        scoreImg.alpha = 1;
        // 添加到容器
        this.snowContainerGroup.addChild(scoreImg);
        // 执行缓动
        egret.Tween.get(scoreImg).to({ x: scoreImg.x, y: (scoreImg.y - 200), alpha: 0.2 }, 1000).call(this.scoreTweenMove.bind(this, scoreImg));
    };
    // 创建动画资源加载到舞台
    GameChristmasMainView.prototype.addAllDb = function () {
        // 烟囱
        this.yancongDb = AssetManager.getQuickDBArmature("santaArmature");
        // 房间门
        this.fangjianmenDb = AssetManager.getQuickDBArmature("santaArmature");
        // 礼物盒
        this.liwuheDb = AssetManager.getQuickDBArmature("santaArmature");
        // 紫色鹿
        this.xunLuDb1 = AssetManager.getQuickDBArmature("ziseluDb");
        // 棕色鹿
        this.xunLuDb2 = AssetManager.getQuickDBArmature("zongseluDb");
        // 添加到舞台
        this.yancongDb.x = 0;
        this.yancongDb.y = 0;
        this.yancongDbGroup.addChild(this.yancongDb);
        this.fangjianmenDb.x = 0;
        this.fangjianmenDb.y = 0;
        this.menkuangDbGroup.addChild(this.fangjianmenDb);
        this.liwuheDb.x = 0;
        this.liwuheDb.y = 0;
        this.liwuheDbGroup.addChild(this.liwuheDb);
        this.xunLuDb1.x = 0;
        this.xunLuDb1.y = 0;
        this.ziseluGroup.addChild(this.xunLuDb1);
        this.xunLuDb2.x = 0;
        this.xunLuDb2.y = 0;
        this.zongseluGroup.addChild(this.xunLuDb2);
        this.santaStatusAmiPlay(1, GameChristmasSantaModel.STATUS_YANCONG_YUJING, false);
        this.santaStatusAmiPlay(2, GameChristmasSantaModel.STATUS_MEN_YUJING, false);
        this.santaStatusAmiPlay(3, GameChristmasSantaModel.STATUS_LIHE_YUJING, false);
        this.xunLuDb1.play(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
        this.xunLuDb2.play(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
    };
    GameChristmasMainView.prototype.tick = function (advancedTime) {
        _super.prototype.tick.call(this, advancedTime);
        if (!this.dbTimeTicker) {
            this.dbTimeTicker = advancedTime;
        }
        var now = advancedTime;
        var pass = now - this.dbTimeTicker;
        this.dbTimeTicker = now;
    };
    // 停止所有动画
    GameChristmasMainView.prototype.stopAllDbAmi = function () {
        this.santaStatusAmiPlay(1, GameChristmasSantaModel.STATUS_YANCONG_YUJING, false);
        this.santaStatusAmiPlay(2, GameChristmasSantaModel.STATUS_MEN_YUJING, false);
        this.santaStatusAmiPlay(3, GameChristmasSantaModel.STATUS_LIHE_YUJING, false);
        this.xunLuDb1.gotoAndStop(GameChristmasModel.STATUS_SWEEPFLOOR);
        this.xunLuDb2.gotoAndStop(GameChristmasModel.STATUS_SWEEPFLOOR);
    };
    // 房间门的预警
    GameChristmasMainView.prototype.menYujingTween = function () {
        var self = this;
        // 预警动画播放中
        this.yujingIsPlay = true;
        // 坐标
        var _startY = this.renyingImg.x;
        var _endY = this.renyingImg.x + 80;
        this.renyingImg.x = this.renyingImg.x;
        self.renyingImg.visible = true;
        // tween次数
        var times = 3;
        // 初始人影状态
        function initFun() {
            times--;
            egret.Tween.get(self.renyingImg, egret.Ease.sineOut)
                .to({ x: _endY, y: self.renyingImg.y }, 500 + 10 * times).call(twoFun);
        }
        function twoFun() {
            egret.Tween.get(self.renyingImg, egret.Ease.sineOut)
                .to({ x: _startY, y: self.renyingImg.y }, 500 + 30 * times).call(endFun);
        }
        function endFun() {
            if (times > 0) {
                initFun();
                return;
            }
            // 隐藏人影
            self.renyingImg.visible = false;
            // 预警动画播放中
            self.yujingIsPlay = false;
            // 概率播放笑的动画 概率小于3的时候不播
            // if (Math.random() * 10 < 3) {
            //     // 回到预警状态
            //     self.santaPlayStatusYuJingFun();
            //     return;
            // }
            // 门播放笑
            self.santaPlayStatusXiaoFun();
        }
        // 开启
        initFun();
    };
    //---房间门动画---
    GameChristmasMainView.prototype.santaStatusAmiPlay = function (santaDbIndex, actionName, playOrStop) {
        var _this = this;
        if (playOrStop) {
            if (this.santaDbIndex == 1) {
                if (actionName == GameChristmasSantaModel.STATUS_YANCONG_YUJING) {
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
                }
                else if (actionName == GameChristmasSantaModel.STATUS_YANCONG_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(function () { if (_this.xiaoIsPlay && !_this.nuIsPlay) {
                        _this.btnsVisibleOrTouchEnabled(false, false);
                    } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(function () { _this.xiaoIsPlay = true; }, this, 400);
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                }
                else if (actionName == GameChristmasSantaModel.STATUS_YANCONG_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 播放对应动画
                this.yancongDb.play(actionName, 1);
            }
            else if (this.santaDbIndex == 2) {
                if (actionName == GameChristmasSantaModel.STATUS_MEN_YUJING) {
                    this.menYujingTween();
                    return;
                }
                else if (actionName == GameChristmasSantaModel.STATUS_MEN_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(function () { if (_this.xiaoIsPlay && !_this.nuIsPlay) {
                        _this.btnsVisibleOrTouchEnabled(false, false);
                    } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(function () { _this.xiaoIsPlay = true; }, this, 400);
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                }
                else if (actionName == GameChristmasSantaModel.STATUS_MEN_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 显示房间门动画，并播放对应动画
                this.fangjianmenDb.visible = true;
                this.fangjianmenDb.play(actionName, 1);
            }
            else if (this.santaDbIndex == 3) {
                if (actionName == GameChristmasSantaModel.STATUS_LIHE_YUJING) {
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
                }
                else if (actionName == GameChristmasSantaModel.STATUS_LIHE_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(function () { if (_this.xiaoIsPlay && !_this.nuIsPlay) {
                        _this.btnsVisibleOrTouchEnabled(false, false);
                    } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(function () { _this.xiaoIsPlay = true; }, this, 400);
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                }
                else if (actionName == GameChristmasSantaModel.STATUS_LIHE_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 播放对应动画
                this.liwuheDb.play(actionName, 1);
            }
        }
        else {
            if (santaDbIndex == 1) {
                // 停止在预警动画
                this.yancongDb.gotoAndStop(actionName);
            }
            else if (santaDbIndex == 2) {
                if (actionName == GameChristmasSantaModel.STATUS_MEN_YUJING) {
                    this.fangjianmenDb.visible = false;
                    this.renyingImg.visible = false;
                    return;
                }
                this.fangjianmenDb.gotoAndStop(actionName);
            }
            else if (santaDbIndex == 3) {
                this.liwuheDb.gotoAndStop(actionName);
            }
        }
    };
    GameChristmasMainView.prototype.onYuJingComplete = function () {
        // 移除动画监听
        this.santaDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
        // 预警播放完成
        this.yujingIsPlay = false;
        // 概率播放笑的动画 概率小于3的时候不播
        // if (Math.random() * 10 < 3) {
        //     // 回到预警状态
        //     this.santaPlayStatusYuJingFun();
        //     return;
        // }
        // 随机播放笑的动画
        this.santaPlayStatusXiaoFun();
    };
    GameChristmasMainView.prototype.onXiaoComplete = function () {
        if (this.nuIsPlay) {
            return;
        }
        // 移除动画监听
        this.santaDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
        // 预警播放完成
        this.xiaoIsPlay = false;
        // 回到预警状态
        this.santaPlayStatusYuJingFun();
        // 机器人被嘲笑模式关闭
        if (DataCenter.instance.room.IsAI) {
            // 机器人
            if (this.gameRobotAi) {
                this.gameRobotAi.robotNoBeFound = false;
            }
        }
        // 捣蛋按钮可用,嘲讽按钮禁用
        this.btnsVisibleOrTouchEnabled(true, false);
        // 小米平台下
        if (App.IsXiaoMi || App.IsLocal) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.SANTA_ACTION_END, 2);
        }
    };
    GameChristmasMainView.prototype.onNuComplete = function () {
        // 移除怒动画
        this.santaDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
        // 回到预警状态
        this.santaPlayStatusYuJingFun();
        // 预警播放完成
        this.nuIsPlay = false;
        // 老人笑
        this.xiaoIsPlay = false;
        // 自己被发现
        this.oneselfBeFound = false;
        // 对方被发现
        this.otherBeFound = false;
        // 机器人被嘲笑模式关闭
        if (DataCenter.instance.room.IsAI) {
            // 机器人
            if (this.gameRobotAi) {
                this.gameRobotAi.robotBeMakeFun = false;
                this.gameRobotAi.robotNoBeFound = false;
                // ai 部分
                this.gameRobotAi.clearData();
                this.gameRobotAi.SetTimeoutExample();
            }
        }
        // 回复驯鹿的动画
        this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
        this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
        // 恢复按钮事件
        this.btnsVisibleOrTouchEnabled(true, false);
        // 小米平台下
        if (App.IsXiaoMi || App.IsLocal) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.SANTA_ACTION_END, 2);
        }
    };
    // 暂停到预警状态
    GameChristmasMainView.prototype.santaPlayStatusYuJingFun = function () {
        this.santaStatusAmiPlay(1, GameChristmasSantaModel.STATUS_YANCONG_YUJING, false);
        this.santaStatusAmiPlay(2, GameChristmasSantaModel.STATUS_MEN_YUJING, false);
        this.santaStatusAmiPlay(3, GameChristmasSantaModel.STATUS_LIHE_YUJING, false);
    };
    // 播放笑的动画
    GameChristmasMainView.prototype.santaPlayStatusXiaoFun = function () {
        // 笑声音
        this.christmasCommonEffect && this.christmasCommonEffect.play("santaSmileStatus_mp3");
        // 播放笑动画
        if (this.santaDbIndex == 1) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_YANCONG_XIAO, true);
        }
        else if (this.santaDbIndex == 2) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_MEN_XIAO, true);
        }
        else if (this.santaDbIndex == 3) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_LIHE_XIAO, true);
        }
        // 小米平台下
        if (App.IsXiaoMi || App.IsLocal) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.SANTA_COMEOUT, 2);
        }
    };
    //---驯鹿动画---
    GameChristmasMainView.prototype.ziseluAmiPlay = function (actionName, times) {
        if (times === void 0) { times = 1; }
        this.xunLuDb1.play(actionName, times);
    };
    //---棕色驯鹿动画---
    GameChristmasMainView.prototype.zongseluAmiPlay = function (actionName, times) {
        if (times === void 0) { times = 1; }
        this.xunLuDb2.play(actionName, times);
    };
    //=====播放随机预警动画=====
    GameChristmasMainView.prototype.randomPlaySantaAction = function () {
        this.currAmiIndex = 0;
        this.SetTimeoutExample();
    };
    // 随机间隔播放动画
    GameChristmasMainView.prototype.SetTimeoutExample = function () {
        this.intervalIdKey = egret.setInterval(this.myDelayedFunction, this, 3000 + Math.ceil(Math.random() * 3) * 1000);
    };
    GameChristmasMainView.prototype.myDelayedFunction = function (obj) {
        // 如果当前有正在播的动画return
        if (this.yujingIsPlay || this.xiaoIsPlay || this.nuIsPlay) {
            return;
        }
        // 播放预警
        if (this.gameChristmasSantaModel.checkActions[this.currAmiIndex] == GameChristmasSantaModel.SANTA_ACTION_STATUS1) {
            DataCenter.instance.room.IsAI == true ? this.yancongYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.STATUS_YANCONG_YUJING, 1);
        }
        else if (this.gameChristmasSantaModel.checkActions[this.currAmiIndex] == GameChristmasSantaModel.SANTA_ACTION_STATUS2) {
            DataCenter.instance.room.IsAI == true ? this.fangJianMenYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.STATUS_MEN_YUJING, 1);
        }
        else if (this.gameChristmasSantaModel.checkActions[this.currAmiIndex] == GameChristmasSantaModel.SANTA_ACTION_STATUS3) {
            DataCenter.instance.room.IsAI == true ? this.liWuHeYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.STATUS_LIHE_YUJING, 1);
        }
        // 一定时间间隔后播放下一个
        this.currAmiIndex++;
    };
    GameChristmasMainView.GAME_WIDTH = 640;
    GameChristmasMainView.GAME_HEIGHT = 1136;
    return GameChristmasMainView;
}(StateEui));
__reflect(GameChristmasMainView.prototype, "GameChristmasMainView");
/**
 * 驯鹿大战
*/
var GameChristmasModel = (function (_super) {
    __extends(GameChristmasModel, _super);
    function GameChristmasModel() {
        var _this = _super.call(this) || this;
        _this.myScore = 0; // 我的分数
        _this.otherScore = 0; // 对方分数
        // 初始化数据
        _this.myScore = 0;
        _this.otherScore = 0;
        return _this;
    }
    GameChristmasModel.EVENT_THROW_SNOWBALL = "EVENT_THROW_SNOWBALL"; // 扔雪球
    GameChristmasModel.EVENT_MAKEFUN = "EVENT_MAKEFUN"; // 嘲笑
    GameChristmasModel.EVENT_GET_SNOWBALL = "EVENT_GET_SNOWBALL"; // 被扔雪球
    GameChristmasModel.EVENT_GET_MAKEFUN = "EVENT_GET_MAKEFUN"; // 被嘲笑
    GameChristmasModel.EVENT_BE_FOUND = "EVENT_BE_FOUND"; // 被发现
    GameChristmasModel.EVENT_GAME_START = "EVENT_GAME_START";
    GameChristmasModel.EVENT_GAME_OVER = "EVENT_GAME_OVER";
    GameChristmasModel.EVENT_WIN = "EVENT_WIN";
    GameChristmasModel.EVENT_LOSE = "EVENT_WIN";
    GameChristmasModel.STATUS_BEATING = "beating"; // 被打
    GameChristmasModel.STATUS_ISSCOLDED = "isScolded"; // 被发现
    GameChristmasModel.STATUS_MAKEFUN = "makeFun"; // 嘲讽
    GameChristmasModel.STATUS_SWEEPFLOOR = "sweepFloor"; // 扫雪
    GameChristmasModel.STATUS_THROW_SNOWBALL = "throwSnowBall"; // 扔雪球
    GameChristmasModel.GET_HOST_PC = "GET_HOST_PC"; // 获取主机
    GameChristmasModel.GAMEOVER_AND_STEPSCORE = "GAMEOVER_AND_STEPSCORE"; // 游戏结束并同步分数
    GameChristmasModel.resultScore = 150; // 设置优先达到分数获胜值
    return GameChristmasModel;
}(egret.DisplayObjectContainer));
__reflect(GameChristmasModel.prototype, "GameChristmasModel");
/**
 * 电脑人
 */
var GameChristmasSantaAI = (function (_super) {
    __extends(GameChristmasSantaAI, _super);
    function GameChristmasSantaAI(gameInstance, robotDirection) {
        var _this = _super.call(this) || this;
        // 机器人的方向
        _this.robotAiDirection = 2;
        // 循环播放相应动作
        _this.intervalIdRobotAiKey = 0;
        // 圣诞出现之后循环播放相应动作
        _this.intervalSantaComeoutIdRobotAiKey = 0;
        // 记录机器人被嘲讽
        _this.robotBeMakeFun = false;
        // 记录机器人未被发现
        _this.robotNoBeFound = false;
        // settimeOut
        _this.actionTimeout = 0;
        // 游戏主类
        _this.gameChristmasMainView = gameInstance;
        // 机器人方向
        _this.robotAiDirection = robotDirection;
        return _this;
    }
    // 电脑人 攻击
    GameChristmasSantaAI.prototype.robotThrowSnowBall = function () {
        // 电脑人分数
        this.gameChristmasMainView.gameChristmasModel.otherScore++;
        this.gameChristmasMainView.playerScoreLab2.text = this.gameChristmasMainView.gameChristmasModel.otherScore + "";
        // 是否达到目标分数
        this.gameChristmasMainView.arriveScore();
        // 扔雪球
        this.gameChristmasMainView.playerThrowSnowBall(this.robotAiDirection);
    };
    // 电脑人 嘲讽
    GameChristmasSantaAI.prototype.robotMakeFun = function () {
        // 减分数
        this.gameChristmasMainView.gameChristmasModel.myScore -= 2;
        if (this.gameChristmasMainView.gameChristmasModel.myScore <= 0) {
            this.gameChristmasMainView.gameChristmasModel.myScore = 0;
        }
        this.gameChristmasMainView.playerScoreLab1.text = this.gameChristmasMainView.gameChristmasModel.myScore + "";
        // 嘲讽
        this.gameChristmasMainView.playerMakeFun(this.robotAiDirection);
        // 紫色熊播放被发现
        this.gameChristmasMainView.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
        // 棕色熊播放嘲讽
        this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
    };
    // 发送游戏结果
    GameChristmasSantaAI.prototype.sendGameResult = function () {
        this.gameChristmasMainView.popup("GameResult");
    };
    //=====循环播放动画=====
    GameChristmasSantaAI.prototype.randomPlayRobotAction = function () {
        this.SetTimeoutExample();
    };
    // clearSantaComeout
    GameChristmasSantaAI.prototype.clearsantaComeoutThrowBall = function () {
        egret.clearInterval(this.intervalSantaComeoutIdRobotAiKey);
    };
    // 圣诞老人预警之后
    GameChristmasSantaAI.prototype.santaComeoutThrowBall = function () {
        this.intervalSantaComeoutIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 200 + Math.ceil(Math.random() * 50));
    };
    // clearSantaComeout
    GameChristmasSantaAI.prototype.clearSetTimeoutExample = function () {
        egret.clearInterval(this.intervalIdRobotAiKey);
    };
    // 随机间隔播放动画
    GameChristmasSantaAI.prototype.SetTimeoutExample = function () {
        this.intervalIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 140 + (5 - GameChristmasSantaAI.robotAiLv) * 60);
    };
    GameChristmasSantaAI.prototype.myDelayedFunction = function () {
        // 机器人被嘲讽状态
        if (this.robotBeMakeFun == true) {
            // 棕色熊播放被发现
            this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
            return;
        }
        // 笑，并没有被发现
        if (this.gameChristmasMainView.xiaoIsPlay && this.robotNoBeFound) {
            return;
        }
        // santa出现
        if (this.gameChristmasMainView.xiaoIsPlay && !this.robotNoBeFound) {
            // 50%的犯错
            var robotError = Math.ceil(Math.random() * 10);
            if (robotError > 5 + GameChristmasSantaAI.robotAiLv) {
                // 笑播放完成   
                this.gameChristmasMainView.xiaoIsPlay = false;
                // 机器人被嘲讽
                this.robotBeMakeFun = true;
                // 棕色熊播放被发现
                this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                // 播放Santa发现动画
                if (!this.gameChristmasMainView.nuIsPlay) {
                    this.gameChristmasMainView.santaPlayNuAmiFun();
                }
                // 设置玩家的按钮状态
                this.gameChristmasMainView.btnsVisibleOrTouchEnabled(false, true);
            }
            else {
                // 机器人未被发现
                this.robotNoBeFound = true;
                // 棕色熊播放被发现
                this.gameChristmasMainView.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
            return;
        }
        // 玩家被发现 开始嘲讽
        if (this.gameChristmasMainView.nuIsPlay && this.gameChristmasMainView.oneselfBeFound) {
            this.robotMakeFun();
            return;
        }
        // 捣蛋
        this.robotThrowSnowBall();
    };
    // 清楚数据
    GameChristmasSantaAI.prototype.clearData = function () {
        // 清楚循环播放动画
        egret.clearInterval(this.intervalIdRobotAiKey);
        egret.clearInterval(this.intervalSantaComeoutIdRobotAiKey);
    };
    // 机器人等级
    GameChristmasSantaAI.robotAiLv = 3;
    return GameChristmasSantaAI;
}(egret.DisplayObjectContainer));
__reflect(GameChristmasSantaAI.prototype, "GameChristmasSantaAI");
/**
 * 圣诞老人随机检测数据
 */
var GameChristmasSantaModel = (function (_super) {
    __extends(GameChristmasSantaModel, _super);
    function GameChristmasSantaModel() {
        var _this = _super.call(this) || this;
        // 随机预警动画 1代表烟囱 2代表门 3代表礼盒
        _this.checkActions = [1, 2, 3, 2, 3, 1, 3, 2, 1, 1, 2, 3, 2, 3, 1, 3, 2, 1, 2, 3, 2, 3, 1, 3, 2, 1];
        _this.arrRandomByIndex(_this.checkActions, 0, _this.checkActions.length);
        return _this;
    }
    GameChristmasSantaModel.prototype.arrRandom = function (arr) {
        arr.sort(elementSort);
        function elementSort(elment1, element2) {
            return (Math.random() > 0.5) ? 1 : -1;
        }
    };
    GameChristmasSantaModel.prototype.arrRandomByIndex = function (arr, startIndex, endIndex) {
        var arrTemp = arr.slice(startIndex, endIndex);
        this.arrRandom(arrTemp);
        for (var i = 0; i < arrTemp.length; i++) {
            arr[startIndex + i] = arrTemp[i];
        }
    };
    GameChristmasSantaModel.STATUS_YANCONG_YUJING = "yancongyujing"; // 烟囱 预警
    GameChristmasSantaModel.STATUS_YANCONG_XIAO = "yancongxiao"; // 烟囱 笑
    GameChristmasSantaModel.STATUS_YANCONG_NU = "yancongnu"; // 烟囱 怒
    GameChristmasSantaModel.STATUS_MEN_YUJING = "menyujing"; // 门 预警
    GameChristmasSantaModel.STATUS_MEN_XIAO = "menxiao"; // 门 笑
    GameChristmasSantaModel.STATUS_MEN_NU = "mennu"; // 门 怒
    GameChristmasSantaModel.STATUS_LIHE_YUJING = "liheyujing"; // 礼盒 预警
    GameChristmasSantaModel.STATUS_LIHE_XIAO = "lihexiao"; // 礼盒 笑
    GameChristmasSantaModel.STATUS_LIHE_NU = "lihenu"; // 礼盒 怒
    GameChristmasSantaModel.SANTA_ACTION_STATUS1 = 1; // 烟囱
    GameChristmasSantaModel.SANTA_ACTION_STATUS2 = 2; // 门
    GameChristmasSantaModel.SANTA_ACTION_STATUS3 = 3; // 礼物盒
    GameChristmasSantaModel.SANTA_COMEOUT = "SANTA_COMEOUT"; // 圣诞老人开始出现
    GameChristmasSantaModel.SANTA_ACTION_END = "SANTA_ACTION_END"; // 圣诞动画结束
    return GameChristmasSantaModel;
}(egret.DisplayObjectContainer));
__reflect(GameChristmasSantaModel.prototype, "GameChristmasSantaModel");
/**
 * 分数
 */
var GameChristmasScore = (function (_super) {
    __extends(GameChristmasScore, _super);
    function GameChristmasScore() {
        return _super.call(this) || this;
    }
    return GameChristmasScore;
}(egret.Bitmap));
__reflect(GameChristmasScore.prototype, "GameChristmasScore");
