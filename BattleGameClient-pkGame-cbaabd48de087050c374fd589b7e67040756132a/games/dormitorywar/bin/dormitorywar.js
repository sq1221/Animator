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
 * 纸球
 */
var DormitoryWarBall = (function (_super) {
    __extends(DormitoryWarBall, _super);
    function DormitoryWarBall() {
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
    Object.defineProperty(DormitoryWarBall.prototype, "factorOne", {
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
    Object.defineProperty(DormitoryWarBall.prototype, "factorTwo", {
        //-------------掉落-------------
        get: function () {
            return 0;
        },
        set: function (value) {
            if (this.directionLOrR == 1) {
                this.x = (1 - value) * (1 - value) * this.directionPosL3_X + 2 * value * (1 - value) * (this.directionPosL3_X - 80) + value * value * Math.ceil((this.directionPosL3_X - 100) - Math.random() * 100);
                this.y = (1 - value) * (1 - value) * this.directionPosL3_Y + 2 * value * (1 - value) * (this.directionPosL3_Y + 150) + value * value * Math.ceil((this.directionPosL3_Y + 190) + Math.random() * 30);
                return;
            }
            this.x = (1 - value) * (1 - value) * this.directionPosR3_X + 2 * value * (1 - value) * (this.directionPosR3_X + 80) + value * value * Math.ceil((this.directionPosR3_X + 100) + Math.random() * 100);
            this.y = (1 - value) * (1 - value) * this.directionPosR3_Y + 2 * value * (1 - value) * (this.directionPosR3_Y + 150) + value * value * Math.ceil((this.directionPosR3_Y + 190) + Math.random() * 30);
        },
        enumerable: true,
        configurable: true
    });
    return DormitoryWarBall;
}(egret.Bitmap));
__reflect(DormitoryWarBall.prototype, "DormitoryWarBall");
/**
 * 宿舍风云
 * by dingyafeng
 */
var DormitoryWarMainView = (function (_super) {
    __extends(DormitoryWarMainView, _super);
    function DormitoryWarMainView() {
        var _this = _super.call(this, GameDormitoryWarMainSkin) || this;
        _this.daodanActionTimeout = 0; // 捣蛋按钮timeout
        _this.oneselfNum = 1; // 1:左侧2：右侧
        _this.gameStartBool = false; // 游戏开始
        _this.gameLastTime = 60; // 游戏时长
        _this.teacherActionTime = 0; // 当前动作时长
        _this.checkPointBool = false; // 检测是否完成
        _this.yujingIsPlay = false; // 预警动画是否播放中
        _this.xiaoIsPlay = false; // 笑动画是否播放中
        _this.nuIsPlay = false; // 怒动画是否播放中
        _this.teachersAniIndex = 0; // 当前播放的动画是 1上铺左 2上铺右 3宿管
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
                .wait(1800)
                .call(function () {
                _this.popup("GameResult", null);
            });
        };
        // 记录游戏数据
        _this.dormitoryWarModel = new DormitoryWarModel();
        // 游戏随机动画数据
        _this.dormitoryWarSantaModel = new DormitoryWarSantaModel();
        // 当前播放动画 1上铺左||2上铺右||3宿管
        _this.teachersAniIndex = 0;
        return _this;
    }
    DormitoryWarMainView.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // 播放背景音乐
        App.SoundManager.stopBg();
        //適配
        var a = App.GameWidth / DormitoryWarMainView.GAME_WIDTH;
        var b = App.GameHeight / DormitoryWarMainView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.containerGroup.scaleX = this.containerGroup.scaleY = c;
        this.containerGroup.x = (App.GameWidth - DormitoryWarMainView.GAME_WIDTH * c) * 0.5;
        this.containerGroup.y = (App.GameHeight - DormitoryWarMainView.GAME_HEIGHT * c) * 0.5;
        // 初始化按钮状态
        this.btnsVisibleOrTouchEnabled(false, false);
        // 返回按钮
        this.goBackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // 弹出退出确认面板
            _this.popup("GameSureLeave");
        }, this);
        // 怼他点击事件
        this.daodanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.daodanBtnHandler, this);
        // 得瑟点击事件
        this.chaofengBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chaofengBtnHandler, this);
        // 小米平台去掉退出按钮
        if (App.IsXiaoMi || App.IsWanba) {
            this.goBackBtn.visible = false;
            this.goBackBtn.touchEnabled = false;
        }
        // 加载圆头像
        if (this.myHeadImage) {
            this.myHeadImage.dispose();
            this.myHeadImage = null;
        }
        this.myHeadImage = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 78, 78);
        // 加载圆头像
        if (this.otherHeadImage) {
            this.otherHeadImage.dispose();
            this.otherHeadImage = null;
        }
        this.otherHeadImage = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 78, 78);
        // 游戏结算页
        this.resultGroup.visible = false;
    };
    DormitoryWarMainView.prototype.show = function () {
        _super.prototype.show.call(this);
        // 游戏未开始
        this.gameStartBool = false;
        // 添加mc动画
        this.addAllMc();
        // 开启电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 电脑人模式
            this.gameRobotAi = new DormitoryWarSantaAI(this, 2);
            // Ai等级
            DormitoryWarSantaAI.robotAiLv = App.CurrGameAiLevel;
            // 默认玩家在左侧
            this.oneselfNum = 1;
            // 标记箭头在左
            this.youImg.x = 90;
            // 加载头像开始游戏
            this.playerAvatarAdd();
        }
    };
    // 设置头像，并开启游戏
    DormitoryWarMainView.prototype.playerAvatarAdd = function () {
        // 初始化玩家信息
        if (this.oneselfNum == 1) {
            // 头像
            this.playerAvatarGroup1.addChild(this.myHeadImage);
            this.myHeadImage.x = 0;
            this.myHeadImage.y = 0;
            this.playerAvatarGroup2.addChild(this.otherHeadImage);
            this.otherHeadImage.x = 0;
            this.otherHeadImage.y = 0;
        }
        else {
            // 头像
            this.playerAvatarGroup1.addChild(this.otherHeadImage);
            this.otherHeadImage.x = 0;
            this.otherHeadImage.y = 0;
            this.playerAvatarGroup2.addChild(this.myHeadImage);
            this.myHeadImage.x = 0;
            this.myHeadImage.y = 0;
        }
        // 游戏开始3，2，1，go
        this.gameStart();
    };
    // 播放开始游戏 3，2，1
    DormitoryWarMainView.prototype.gameStart = function () {
        var _this = this;
        var gameStartFun = function () {
            // 播放背景音乐
            App.SoundManager.playBg("dormitoryWar_bg_mp3");
            // you箭头缓动
            _this.oneSelfTween();
            // 引导手势
            _this.guideHandTween();
            // 按钮状态
            _this.btnsVisibleOrTouchEnabled(true, false);
            egret.setTimeout(function () {
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
            }, _this, 2000);
        };
        // 播放开始ready go
        function readyGoFun() {
            this.readyIMG = new GameReady(function () {
                gameStartFun();
            });
            this.readyIMG.x = 300;
            this.readyIMG.y = App.GameHeight / 2;
            this.addChild(this.readyIMG);
            this.readyIMG.play();
        }
        // 延时3秒播放
        this.clearTimeoutReadyId = egret.setTimeout(readyGoFun, this, 200);
    };
    // 注册服务器返回消息
    DormitoryWarMainView.prototype.addMesssgaeListener = function () {
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
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarModel.GET_HOST_PC + "|" + DataCenter.instance.room.player.id, 2);
            }
            else {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarModel.GET_HOST_PC + "|" + DataCenter.instance.user.id, 2);
            }
        }
    };
    DormitoryWarMainView.prototype.onGameEvent = function (data) {
        var arrEventData = data.event.split("|");
        switch (arrEventData[0]) {
            case DormitoryWarModel.GET_HOST_PC:
                // Ai情况下不接收
                if (DataCenter.instance.room.IsAI) {
                    return;
                }
                if (arrEventData[1] == DataCenter.instance.user.id) {
                    this.oneselfNum = 1;
                    // 标记箭头在左
                    this.youImg.x = 90;
                }
                else {
                    this.oneselfNum = 2;
                    // 标记箭头在右
                    this.youImg.x = App.GameWidth - 90;
                }
                // 开始游戏
                this.playerAvatarAdd();
                break;
            case DormitoryWarModel.EVENT_HIT:
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 更新自己分数
                    this.dormitoryWarModel.myScore++;
                    this["playerScoreLab" + this.oneselfNum].text = this.dormitoryWarModel.myScore + "";
                    // 先到达分数者胜出
                    this.arriveScore();
                }
                else {
                    // 更新对方分数
                    if (this.oneselfNum == 1) {
                        // 更新对方分数
                        this.dormitoryWarModel.otherScore++;
                        this["playerScoreLab" + 2].text = this.dormitoryWarModel.otherScore + "";
                        // 先到达分数者胜出
                        this.arriveScore();
                        // 不同步动作
                        if (this.nuIsPlay || this.xiaoIsPlay) {
                            return;
                        }
                        // 攻击
                        this.playerHitOther(2);
                        return;
                    }
                    // 更新对方分数
                    this.dormitoryWarModel.otherScore++;
                    this["playerScoreLab" + 1].text = this.dormitoryWarModel.otherScore + "";
                    // 先到达分数者胜出
                    this.arriveScore();
                    // 不同步动作
                    if (this.nuIsPlay || this.xiaoIsPlay) {
                        return;
                    }
                    // 攻击
                    this.playerHitOther(1);
                }
                break;
            case DormitoryWarModel.EVENT_MAKEFUN:
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 嘲讽并更新对方分数
                    this.makeFunOtherPlayer();
                }
                else {
                    // 更新自己分数
                    this.dormitoryWarModel.myScore -= 2;
                    if (this.dormitoryWarModel.myScore <= 0) {
                        this.dormitoryWarModel.myScore = 0;
                    }
                    this["playerScoreLab" + this.oneselfNum].text = this.dormitoryWarModel.myScore + "";
                    //  被嘲讽飘字
                    this.playerMakeFun(2);
                    if (this.oneselfNum == 1) {
                        // 被得瑟，右侧播放一次被得瑟动作
                        this.rightStudentAmiPlay(DormitoryWarModel.STATUS_MAKEFUN);
                    }
                    else {
                        // 被得瑟，左侧播放一次被得瑟动作
                        this.leftStudentAmiPlay(DormitoryWarModel.STATUS_MAKEFUN);
                    }
                }
                break;
            case DormitoryWarModel.EVENT_BE_FOUND:
                // 检测状态
                if (this.checkPointBool) {
                    return;
                }
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 被发现
                    this.oneselfBeFound = true;
                    // console.log("=状态==收到消息 =====我被发现");
                }
                else {
                    // 对方被发现
                    this.otherBeFound = true;
                    // console.log("=状态==收到消息 =====对方被发现");
                }
                break;
            case DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING:
                // 上铺左侧同学预警
                this.upLeftStudentYujingFun();
                break;
            case DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING:
                // 上铺右侧同学预警
                this.upRightStudentYujingFun();
                break;
            case DormitoryWarSantaModel.STATUS_TEACHER_YUJING:
                // 老师预警
                this.teacherYujingFun();
                break;
        }
    };
    // 上铺左学生预警
    DormitoryWarMainView.prototype.upLeftStudentYujingFun = function () {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutHit();
            }
        }
        // 当前播放的是上铺左学生
        this.teachersAniIndex = 1;
        // 上铺左预警
        this.teachersDbDisplay = this.upLeftStudentDb;
        // 上铺左预警
        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING, true);
    };
    // 上铺右预警
    DormitoryWarMainView.prototype.upRightStudentYujingFun = function () {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutHit();
            }
        }
        // 当前播放的是上铺右预警
        this.teachersAniIndex = 2;
        // 上铺右预警
        this.teachersDbDisplay = this.upRightStudentDb;
        // 上铺右预警
        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING, true);
    };
    // 宿管预警
    DormitoryWarMainView.prototype.teacherYujingFun = function () {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutHit();
            }
        }
        // 当前播放的是宿管
        this.teachersAniIndex = 3;
        // 宿管db
        this.teachersDbDisplay = this.suGuanDb;
        // 宿管预警
        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_YUJING, true);
    };
    // 怒动画
    DormitoryWarMainView.prototype.teachersNuAmiFun = function () {
        // 骂的声音
        App.SoundManager.playEffect("christmas_santaCurse_mp3");
        // 怒的动画
        if (this.teachersAniIndex == 1) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_NU, true);
        }
        else if (this.teachersAniIndex == 2) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_NU, true);
        }
        else if (this.teachersAniIndex == 3) {
            // 机器人
            if (DataCenter.instance.room.IsAI) {
                // 自己和机器人都被发现
                if (this.oneselfBeFound && this.gameRobotAi.robotBeMakeFun) {
                    this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_ALLNU, true);
                }
                else {
                    if (this.oneselfBeFound) {
                        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_LEFTNU, true);
                    }
                    else if (this.gameRobotAi.robotBeMakeFun) {
                        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_RIGHTNU, true);
                    }
                }
                return;
            }
            // 自己和对方都被发现
            if (this.oneselfBeFound && this.otherBeFound) {
                this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_ALLNU, true);
            }
            else {
                if (this.oneselfBeFound) {
                    if (this.oneselfNum == 1) {
                        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_LEFTNU, true);
                    }
                    else {
                        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_RIGHTNU, true);
                    }
                }
                else if (this.otherBeFound) {
                    if (this.oneselfNum == 1) {
                        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_RIGHTNU, true);
                    }
                    else {
                        this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_LEFTNU, true);
                    }
                }
            }
        }
    };
    // 怼他，得瑟按钮禁用或开启
    DormitoryWarMainView.prototype.btnsVisibleOrTouchEnabled = function (daodanStatus, chaofengStatus) {
        // 捣蛋按钮状态
        this.daodanBtn.visible = daodanStatus;
        this.daodanBtn.touchEnabled = daodanStatus;
        // 嘲讽按钮状态
        this.chaofengBtn.visible = chaofengStatus;
        this.chaofengBtn.touchEnabled = chaofengStatus;
    };
    // 嘲讽别人
    DormitoryWarMainView.prototype.makeFunOtherPlayer = function () {
        this.dormitoryWarModel.otherScore -= 2;
        if (this.dormitoryWarModel.otherScore <= 0) {
            this.dormitoryWarModel.otherScore = 0;
        }
        if (this.oneselfNum == 1) {
            this.playerScoreLab2.text = this.dormitoryWarModel.otherScore + "";
            // 得瑟动作
            this.leftStudentAmiPlay(DormitoryWarModel.STATUS_MAKEFUN);
        }
        else {
            this.playerScoreLab1.text = this.dormitoryWarModel.otherScore + "";
            // 得瑟动作
            this.rightStudentAmiPlay(DormitoryWarModel.STATUS_MAKEFUN);
        }
    };
    // 游戏结算页信息状态  1:win/lose   2:左右
    DormitoryWarMainView.prototype.resultViewState = function () {
        // 结算数据
        var data = DataCenter.instance.room.gameResult;
        // 我嬴
        if (data.winUserId == DataCenter.instance.user.id) {
            this.meWinImg.visible = true;
            this.meLoseImg.visible = false;
            if (this.oneselfNum == 1) {
                this.leftStatusImg.source = "dwLeftWin_png";
                this.rightStatusImg.source = "dwRightLose_png";
            }
            else {
                this.leftStatusImg.source = "dwLeftLose_png";
                this.rightStatusImg.source = "dwRightWin_png";
            }
        }
        else {
            // 我输
            this.meWinImg.visible = false;
            this.meLoseImg.visible = true;
            if (this.oneselfNum == 1) {
                this.leftStatusImg.source = "dwLeftLose_png";
                this.rightStatusImg.source = "dwRightWin_png";
            }
            else {
                this.leftStatusImg.source = "dwLeftWin_png";
                this.rightStatusImg.source = "dwRightLose_png";
            }
        }
    };
    // 时间内先达到分数者获胜
    DormitoryWarMainView.prototype.arriveScore = function () {
        if (this.dormitoryWarModel.myScore >= DormitoryWarModel.resultScore) {
            //自己嬴
            this.sendResult(3);
            return;
        }
        if (this.dormitoryWarModel.otherScore >= DormitoryWarModel.resultScore) {
            //对方嬴
            this.sendResult(1);
        }
    };
    // 弹出游戏结果画面
    DormitoryWarMainView.prototype.onGameResult = function (data) {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 内部结算面板信息
        this.resultViewState();
        // 发送游戏结果
        this.popup("GameResult", this.resultPageFun);
    };
    // 收到游戏离开
    DormitoryWarMainView.prototype.onGameleave = function () {
        this.clearData();
    };
    DormitoryWarMainView.prototype.clearData = function () {
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
            }
        }
        // 清楚随机播放santa动画
        egret.clearInterval(this.intervalIdKey);
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutCheckPoint);
        // 停止到计时
        App.TimerManager.remove(this.ontimerUpdate, this);
        // 停止当前游戏动作
        this.daodanBtn.touchEnabled = false;
        this.chaofengBtn.touchEnabled = false;
        // 停止所有Db
        this.stopAllDbAmi();
        // 清楚所有缓动
        egret.Tween.removeTweens(this.youImg);
    };
    DormitoryWarMainView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        // 倒计时
        this.timesLab.text = "60";
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutCheckPoint);
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
        // 内部结算页
        egret.Tween.removeTweens(this.resultGroup);
        // 清楚随机播放santa动画
        egret.clearInterval(this.intervalIdKey);
        // 清楚对象池
        ObjectPool.clearClass("DormitoryWarScore");
        // 结算页
        this.resultGroup.visible = false;
        // 自己被发现
        this.oneselfBeFound = false;
        // 对方被发现
        this.otherBeFound = false;
        // 检测是否完成
        this.checkPointBool = false;
    };
    // 头像
    DormitoryWarMainView.prototype.playerAvatarGroup1Handler = function () {
        // 点击
        var str = "mouseClickSound_mp3";
        App.SoundManager.playEffect(str);
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
    DormitoryWarMainView.prototype.playerAvatarGroup2Handler = function () {
        // 点击
        var str = "mouseClickSound_mp3";
        App.SoundManager.playEffect(str);
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
    // 倒计时间刷新
    DormitoryWarMainView.prototype.ontimerUpdate = function () {
        if (this.gameLastTime > 0) {
            this.gameLastTime--;
            this.timesLab.text = this.gameLastTime + "";
            // 倒计时音效
            if (this.gameLastTime < 4 && this.gameLastTime > 0) {
                App.SoundManager.playEffect("countDownSound_mp3");
            }
            else if (this.gameLastTime == 0) {
                App.SoundManager.playEffect("countDownSoundEnd_mp3");
            }
        }
        else {
            // 停止到计时
            App.TimerManager.remove(this.ontimerUpdate, this);
            //输赢结果
            this.dormitoryWarModel.myScore >= this.dormitoryWarModel.otherScore ? this.sendResult(3) : this.sendResult(1);
        }
    };
    // 发送游戏结果
    DormitoryWarMainView.prototype.sendResult = function (result) {
        // 被扔雪球，被嘲笑，被发现，当前santa动画播放状态
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 清楚数据
        this.clearData();
        // 发送结果
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    // 游戏剩余倒计时显示
    DormitoryWarMainView.prototype.startMatchingTime = function () {
        this.gameLastTime = 60;
        App.TimerManager.doTimer(1000, 0, this.ontimerUpdate, this);
    };
    // 标记个人的箭头 0:左 1：右
    DormitoryWarMainView.prototype.oneSelfTween = function () {
        var _startY = this.youImg.y;
        var _endY = this.youImg.y + 60;
        this.youImg.x = this.youImg.x;
        this.youImg.visible = true;
        // 执行缓动
        egret.Tween.get(this.youImg, { loop: true }, egret.Ease.sineOut)
            .to({ scaleX: 0.9, scaleY: 0.9, x: this.youImg.x, y: _endY }, 400)
            .to({ scaleX: 1, scaleY: 1, x: this.youImg.x, y: _startY }, 400);
    };
    // 手势
    DormitoryWarMainView.prototype.guideHandTween = function () {
        var _startX = 0;
        var _endX = 0;
        _startX = this.guideHandImg.x;
        _endX = this.guideHandImg.x - 20;
        var _startY = this.guideHandImg.y;
        var _endY = this.guideHandImg.y + 40;
        this.guideHandImg.x = this.guideHandImg.x;
        this.guideHandImg.y = this.guideHandImg.y;
        this.guideHandImg.visible = true;
        // 执行缓动
        egret.Tween.get(this.guideHandImg, { loop: true }, egret.Ease.sineOut)
            .to({ scaleX: 1, scaleY: 1, x: _endX, y: _endY }, 400)
            .to({ scaleX: 1, scaleY: 1, x: _startX, y: _startY }, 400);
    };
    //-------雪球缓动动画---------
    DormitoryWarMainView.prototype.moveOne = function (ball) {
        // 挨打声音
        App.SoundManager.playEffect("dormitoryWar_beHit_mp3");
        egret.Tween.get(ball).to({ factorTwo: 1 }, 100).call(this.moveTwo.bind(this, ball));
    };
    DormitoryWarMainView.prototype.moveTwo = function (ball) {
        var _this = this;
        egret.Tween.get(ball).to({ alpha: 0.2 }, 1600).call(function () {
            _this.scoreAndBallContainerGroup.removeChild(ball);
            ObjectPool.push(ball);
        });
    };
    //-------数字缓动动画---------
    DormitoryWarMainView.prototype.scoreTweenMove = function (scores) {
        var _this = this;
        egret.Tween.get(scores).wait(80).call(function () {
            _this.scoreAndBallContainerGroup.removeChild(scores);
            ObjectPool.push(scores);
        });
    };
    // 怼他 按钮事件
    DormitoryWarMainView.prototype.daodanBtnHandler = function (event) {
        var _this = this;
        if (!this.gameStartBool) {
            return;
        }
        // 取消手势的缓动
        if (this.guideHandImg.visible) {
            egret.Tween.removeTweens(this.guideHandImg);
            this.guideHandImg.visible = false;
        }
        // 按钮频率
        this.daodanBtn.touchEnabled = false;
        this.daodanActionTimeout = setTimeout(function () {
            _this.daodanBtn.touchEnabled = true;
            egret.clearTimeout(_this.daodanActionTimeout);
        }, 60);
        // 攻击对方并获得分数
        this.playerHitOther(this.oneselfNum);
        // 笑播放且检测状态被发现
        if (this.xiaoIsPlay && !this.checkPointBool) {
            // console.log("==状态==点击得瑟按钮 =====我被发现");
            // 电脑人模式
            if (DataCenter.instance.room.IsAI) {
                // 自己被发现
                this.oneselfBeFound = true;
                return;
            }
            // 向服务器发送被发现
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarModel.EVENT_BE_FOUND, 1);
            return;
        }
        // 电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 更新自己分数
            this.dormitoryWarModel.myScore++;
            this["playerScoreLab" + this.oneselfNum].text = this.dormitoryWarModel.myScore + "";
            // 先到达分数者胜出
            this.arriveScore();
            return;
        }
        // 向服务器发送 捣蛋 消息
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarModel.EVENT_HIT, 1);
    };
    // 左侧同学攻击后扫雪
    DormitoryWarMainView.prototype.onStudentHitLComplete = function () {
        // 移除监听
        this.hitLMc.removeEventListener(egret.Event.COMPLETE, this.onStudentHitLComplete, this);
        // 待机状态
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
        this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
    };
    // 右侧同学攻击后扫雪
    DormitoryWarMainView.prototype.onStudentHitRComplete = function () {
        // 移除监听
        this.hitRMc.removeEventListener(egret.Event.COMPLETE, this.onStudentHitRComplete, this);
        // 待机状态
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
        this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
    };
    // 棕色驯鹿播放挨打完成之后扫雪
    DormitoryWarMainView.prototype.onStudentBeHitRComplete = function () {
        // 移除监听
        this.beHitRMc.removeEventListener(egret.Event.COMPLETE, this.onStudentBeHitRComplete, this);
        if (this.oneselfBeFound) {
            // 我打别人
            if (this.oneselfNum == 1) {
                // 播放被发现动画
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
            else {
                // 播放被发现动画
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
        }
        else {
            if (this.oneselfNum == 1) {
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
            else if (this.oneselfNum == 2) {
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
        }
    };
    // 紫色驯鹿播放挨打完成之后扫雪
    DormitoryWarMainView.prototype.onStudentBeHitLComplete = function () {
        // 移除监听
        this.beHitLMc.removeEventListener(egret.Event.COMPLETE, this.onStudentBeHitLComplete, this);
        if (this.oneselfBeFound) {
            // 我打别人
            if (this.oneselfNum == 1) {
                // 播放被发现动画
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
            else {
                // 播放被发现动画
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
        }
        else {
            if (this.oneselfNum == 1) {
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
            else if (this.oneselfNum == 2) {
                this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
            }
        }
    };
    // 怼他  1：向右侧 2：向左侧
    DormitoryWarMainView.prototype.playerHitOther = function (directLorR) {
        // 攻击动画
        if (directLorR == 1) {
            // 攻击的动作
            this.leftStudentAmiActionInit();
            this.hitLMc.visible = true;
            this.hitLMc.addEventListener(egret.Event.COMPLETE, this.onStudentHitLComplete, this);
            this.hitLMc.gotoAndPlay(1, 1);
            // 对方播放挨打动画一次
            this.rightStudentAmiActionInit();
            this.beHitRMc.visible = true;
            this.beHitRMc.addEventListener(egret.Event.COMPLETE, this.onStudentBeHitRComplete, this);
            this.beHitRMc.gotoAndPlay(1, 1);
        }
        else {
            // 攻击
            this.rightStudentAmiActionInit();
            this.hitRMc.visible = true;
            this.hitRMc.addEventListener(egret.Event.COMPLETE, this.onStudentHitRComplete, this);
            this.hitRMc.gotoAndPlay(1, 1);
            // 对方播放挨打动画一次
            this.leftStudentAmiActionInit();
            this.beHitLMc.visible = true;
            this.beHitLMc.addEventListener(egret.Event.COMPLETE, this.onStudentBeHitLComplete, this);
            this.beHitLMc.gotoAndPlay(1, 1);
        }
        // 动态生成雪球
        var ball = ObjectPool.pop(DormitoryWarBall, "DormitoryWarBall");
        ball.alpha = 1;
        ball.texture = RES.getRes("zhiqiuDw_png");
        // 雪球方向
        ball.directionLOrR = directLorR;
        // 雪球初始位置
        if (ball.directionLOrR == 1) {
            ball.x = 190;
            ball.y = 670;
            ball.directionPosL1_X = 190;
            ball.directionPosL1_Y = 670;
            ball.directionPosL2_X = 260;
            ball.directionPosL2_Y = 590;
            ball.directionPosL3_X = 490;
            ball.directionPosL3_Y = 620 + Math.ceil(Math.random() * 30);
        }
        else if (ball.directionLOrR == 2) {
            ball.x = 450;
            ball.y = 670;
            ball.directionPosR1_X = 450;
            ball.directionPosR1_Y = 670;
            ball.directionPosR2_X = 380;
            ball.directionPosR2_Y = 590;
            ball.directionPosR3_X = 150;
            ball.directionPosR3_Y = 620 + Math.ceil(Math.random() * 30);
        }
        // 添加到容器
        this.scoreAndBallContainerGroup.addChild(ball);
        // 攻击声音
        App.SoundManager.playEffect("dormitoryWar_hit_mp3");
        // 执行缓动
        egret.Tween.get(ball).to({ factorOne: 1 }, 100).call(this.moveOne.bind(this, ball));
        // 动态生成数字
        var scoreImg = ObjectPool.pop(DormitoryWarScore, "DormitoryWarScore");
        var colorType = Math.ceil(Math.random() * 3);
        // 左侧
        if (directLorR == 1) {
            scoreImg.texture = RES.getRes("scoreOneDw" + colorType + "_png");
            scoreImg.x = 80;
            scoreImg.y = 520;
        }
        else if (directLorR == 2) {
            scoreImg.texture = RES.getRes("scoreOneDw" + colorType + "_png");
            scoreImg.x = 460;
            scoreImg.y = 520;
        }
        scoreImg.alpha = 1;
        // 添加到容器
        this.scoreAndBallContainerGroup.addChild(scoreImg);
        // 执行缓动
        egret.Tween.get(scoreImg).to({ x: scoreImg.x, y: (scoreImg.y - 100), alpha: 0.2 }, 1000).call(this.scoreTweenMove.bind(this, scoreImg));
    };
    // 得瑟按钮事件
    DormitoryWarMainView.prototype.chaofengBtnHandler = function (event) {
        if (!this.gameStartBool) {
            return;
        }
        // 取消手势的缓动
        if (this.guideHandImg.visible) {
            egret.Tween.removeTweens(this.guideHandImg);
            this.guideHandImg.visible = false;
        }
        // 得瑟飘字
        this.playerMakeFun(1);
        // 嘲讽机器人模式 
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi.robotBeMakeFun && !this.oneselfBeFound) {
                this.makeFunOtherPlayer();
                return;
            }
        }
        // 向 服务器 发送消息
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarModel.EVENT_MAKEFUN, 1);
    };
    // 嘲讽 1:嘲讽别人，2：被嘲讽
    DormitoryWarMainView.prototype.playerMakeFun = function (makeFunStatus) {
        // 嘲讽声音
        App.SoundManager.playEffect("dormitoryWar_makeFun_mp3");
        // 动态生成数字
        var scoreImg = ObjectPool.pop(DormitoryWarScore, "DormitoryWarScore");
        var colorType = Math.ceil(Math.random() * 3);
        // 嘲讽别人
        if (makeFunStatus == 1) {
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("scoreTwoDw" + colorType + "_png");
                scoreImg.x = 460;
                scoreImg.y = 520;
            }
            else {
                scoreImg.texture = RES.getRes("scoreTwoDw" + colorType + "_png");
                scoreImg.x = 80;
                scoreImg.y = 520;
            }
        }
        else if (makeFunStatus == 2) {
            // 被别人嘲讽
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("scoreTwoDw" + colorType + "_png");
                scoreImg.x = 80;
                scoreImg.y = 520;
            }
            else {
                scoreImg.texture = RES.getRes("scoreTwoDw" + colorType + "_png");
                scoreImg.x = 460;
                scoreImg.y = 520;
            }
        }
        scoreImg.alpha = 1;
        // 添加到容器
        this.scoreAndBallContainerGroup.addChild(scoreImg);
        // 执行缓动
        egret.Tween.get(scoreImg).to({ x: scoreImg.x, y: (scoreImg.y - 100), alpha: 0.2 }, 1000).call(this.scoreTweenMove.bind(this, scoreImg));
    };
    // 创建动画资源加载到舞台
    DormitoryWarMainView.prototype.addAllMc = function () {
        // 上铺同学左
        this.upLeftStudentDb = AssetManager.getQuickDBArmature("upLeftStudentDB");
        this.upLeftStudentDbGroup.addChild(this.upLeftStudentDb);
        this.upLeftStudentDb.x = 0;
        this.upLeftStudentDb.y = 0;
        // 上铺同学右
        this.upRightStudentDb = AssetManager.getQuickDBArmature("upRightStudentDB");
        this.upRightStudentDbGroup.addChild(this.upRightStudentDb);
        this.upRightStudentDb.x = 0;
        this.upRightStudentDb.y = 0;
        // 房间门老师
        this.suGuanDb = AssetManager.getQuickDBArmature("suGuanDB");
        this.teacherDbGroup.addChild(this.suGuanDb);
        this.suGuanDb.x = -16;
        this.suGuanDb.y = -34;
        // 左侧被发现 effect 
        this.beFoundOneMcFactory = new egret.MovieClipDataFactory(RES.getRes("beFoundLeftEffect_mc_json"), RES.getRes("beFoundLeftEffect_tex_png"));
        this.beFoundOneMc = new egret.MovieClip(this.beFoundOneMcFactory.generateMovieClipData("beFoundLeftEffect"));
        this.leftStudentDbGroup.addChild(this.beFoundOneMc);
        this.beFoundOneMc.x = 170;
        this.beFoundOneMc.y = 200;
        // 右侧被发现 effect 
        this.beFoundTwoMcFactory = new egret.MovieClipDataFactory(RES.getRes("beFoundRightEffect_mc_json"), RES.getRes("beFoundRightEffect_tex_png"));
        this.beFoundTwoMc = new egret.MovieClip(this.beFoundTwoMcFactory.generateMovieClipData("beFoundRightEffect"));
        this.rightStudentDbGroup.addChild(this.beFoundTwoMc);
        this.beFoundTwoMc.x = 150;
        this.beFoundTwoMc.y = 200;
        // 左侧同学 攻击mc 动画
        this.hitLMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentLeftHitMc_mc_json"), RES.getRes("studentLeftHitMc_tex_png"));
        this.hitLMc = new egret.MovieClip(this.hitLMcFactory.generateMovieClipData("studentLeftHit"));
        this.leftStudentDbGroup.addChild(this.hitLMc);
        this.hitLMc.x = 106;
        this.hitLMc.y = 253.5;
        // 左侧同学 被攻击mc 动画
        this.beHitLMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentLeftBeHit_mc_json"), RES.getRes("studentLeftBeHit_tex_png"));
        this.beHitLMc = new egret.MovieClip(this.beHitLMcFactory.generateMovieClipData("studentLeftBeHit"));
        this.leftStudentDbGroup.addChild(this.beHitLMc);
        this.beHitLMc.x = 84;
        this.beHitLMc.y = 224.5;
        // 左侧同学 嘲讽mc 动画
        this.makeFunLMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentLeftMakeFun_mc_json"), RES.getRes("studentLeftMakeFun_tex_png"));
        this.makeFunLMc = new egret.MovieClip(this.makeFunLMcFactory.generateMovieClipData("studentLeftMakeFun"));
        this.leftStudentDbGroup.addChild(this.makeFunLMc);
        this.makeFunLMc.x = 95;
        this.makeFunLMc.y = 254.5;
        // 右侧同学攻击mc 动画
        this.hitRMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentRightHit_mc_json"), RES.getRes("studentRightHit_tex_png"));
        this.hitRMc = new egret.MovieClip(this.hitRMcFactory.generateMovieClipData("studentRightHit"));
        this.rightStudentDbGroup.addChild(this.hitRMc);
        this.hitRMc.x = 213;
        this.hitRMc.y = 241;
        // 右侧同学 被攻击mc 动画
        this.beHitRMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentRightBeHit_mc_json"), RES.getRes("studentRightBeHit_tex_png"));
        this.beHitRMc = new egret.MovieClip(this.beHitRMcFactory.generateMovieClipData("studentRightBeHit"));
        this.rightStudentDbGroup.addChild(this.beHitRMc);
        this.beHitRMc.x = 231;
        this.beHitRMc.y = 229;
        // 右侧同学 嘲讽mc 动画
        this.makeFunRMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentRightMakeFun_mc_json"), RES.getRes("studentRightMakeFun_tex_png"));
        this.makeFunRMc = new egret.MovieClip(this.makeFunRMcFactory.generateMovieClipData("studentRightMakeFun"));
        this.rightStudentDbGroup.addChild(this.makeFunRMc);
        this.makeFunRMc.x = 230;
        this.makeFunRMc.y = 245;
        // 上铺左，上铺右， 宿管  初始化状态
        this.teachersPlayStatusYuJingFun();
        // 左侧同学初始化状态
        this.leftStudentAmiActionInit();
        this.leftStudentDaijiImg.visible = true;
        // 右侧同学初始化状态
        this.rightStudentAmiActionInit();
        this.rightStudentDaijiImg.visible = true;
    };
    DormitoryWarMainView.prototype.tick = function (advancedTime) {
        _super.prototype.tick.call(this, advancedTime);
        if (!this.dbTimeTicker) {
            this.dbTimeTicker = advancedTime;
        }
        var now = advancedTime;
        var pass = now - this.dbTimeTicker;
        this.dbTimeTicker = now;
    };
    // 停止所有动画
    DormitoryWarMainView.prototype.stopAllDbAmi = function () {
        this.upLeftStudentDb.gotoAndStop(DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING);
        this.upRightStudentDb.gotoAndStop(DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING);
        this.teachersStatusAmiPlay(3, DormitoryWarSantaModel.STATUS_TEACHER_YUJING, false);
        // 左侧同学
        this.leftStudentAmiActionInit();
        // 右侧同学
        this.rightStudentAmiActionInit();
    };
    // 开始播放笑的动画时候状态的设置
    DormitoryWarMainView.prototype.isXiaoAniPlayStatus = function () {
        var _this = this;
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutReadyId);
        // 清掉延迟
        egret.clearTimeout(this.clearTimeoutCheckPoint);
        // 检测状态
        this.checkPointBool = false;
        // 0.3秒后检测按下的情况
        this.clearTimeoutCheckPoint = egret.setTimeout(function () {
            // 笑动画播放中
            _this.xiaoIsPlay = true;
            // console.log("==状态===" + "开启xiaoIsPlay");
            // 敲门
            if (_this.teachersAniIndex == 3) {
                App.SoundManager.playEffect("dormitoryWar_hitDoor_mp3");
            }
            egret.clearTimeout(_this.clearTimeoutCheckPoint);
        }, this, 300);
        // 0.6秒后执行
        this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(function () {
            // 开启检测状态
            _this.checkPointBool = true;
            // AI的情况
            if (DataCenter.instance.room.IsAI) {
                // console.log("==状态=IsAI=IsAI=IsAI=IsAI=IsAI");
                if (_this.oneselfBeFound || _this.gameRobotAi.robotBeMakeFun) {
                    // 移除动画监听
                    _this.teachersDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, _this.onXiaoComplete, _this);
                    // 停止笑声音
                    App.SoundManager.stopEffect("santaSmileStatus_mp3");
                    // 笑播放停止状态
                    _this.xiaoIsPlay = false;
                    // 播放怒的动画开启
                    _this.nuIsPlay = true;
                    // 自己被发现
                    if (_this.oneselfBeFound) {
                        // 捣蛋按钮禁用,嘲讽按钮禁用
                        _this.btnsVisibleOrTouchEnabled(false, false);
                        // 播被发现动画
                        _this.leftStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                    }
                    else {
                        // 捣蛋按钮禁用,嘲讽按钮可用
                        _this.btnsVisibleOrTouchEnabled(false, true);
                    }
                    // 机器人被发现
                    if (_this.gameRobotAi.robotBeMakeFun) {
                        // 播放被发现动画
                        _this.rightStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                        // 机器人动作
                        _this.gameRobotAi.clearData();
                        _this.gameRobotAi.SetTimeoutExample();
                    }
                    // 播放老师们发现后怒的动画
                    _this.teachersNuAmiFun();
                }
                else {
                    if (_this.xiaoIsPlay && !_this.nuIsPlay) {
                        _this.btnsVisibleOrTouchEnabled(false, false);
                        // 取消手势的缓动
                        if (_this.guideHandImg.visible) {
                            egret.Tween.removeTweens(_this.guideHandImg);
                            _this.guideHandImg.visible = false;
                        }
                    }
                }
                return;
            }
            // 执行被发现状态
            if (_this.oneselfBeFound || _this.otherBeFound) {
                // 移除动画监听
                _this.teachersDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, _this.onXiaoComplete, _this);
                // 停止笑声音
                App.SoundManager.stopEffect("santaSmileStatus_mp3");
                // 笑播放停止状态
                _this.xiaoIsPlay = false;
                // 播放怒的动画开启
                _this.nuIsPlay = true;
                // 自己被发现
                if (_this.oneselfBeFound) {
                    // 捣蛋按钮禁用,嘲讽按钮禁用
                    _this.btnsVisibleOrTouchEnabled(false, false);
                    // 播被发现动画
                    if (_this.oneselfNum == 1) {
                        _this.leftStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                    }
                    else {
                        _this.rightStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                    }
                }
                else {
                    // 捣蛋按钮禁用,嘲讽按钮可用
                    _this.btnsVisibleOrTouchEnabled(false, true);
                }
                // 对方被发现
                if (_this.otherBeFound) {
                    // 播放被发现动画
                    if (_this.oneselfNum == 1) {
                        _this.rightStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                    }
                    else {
                        _this.leftStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
                    }
                }
                // 播放老师们发现后怒的动画
                _this.teachersNuAmiFun();
            }
            else {
                if (_this.xiaoIsPlay && !_this.nuIsPlay) {
                    _this.btnsVisibleOrTouchEnabled(false, false);
                    // 取消手势的缓动
                    if (_this.guideHandImg.visible) {
                        egret.Tween.removeTweens(_this.guideHandImg);
                        _this.guideHandImg.visible = false;
                    }
                }
            }
        }, this, 600);
    };
    //---预警，笑，怒 动画---
    DormitoryWarMainView.prototype.teachersStatusAmiPlay = function (teachersAniIndex, actionName, playOrStop) {
        if (playOrStop) {
            if (teachersAniIndex == 1) {
                if (actionName == DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING) {
                    // 播放预警
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_XIAO) {
                    // 状态设置
                    this.isXiaoAniPlayStatus();
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 播放对应动画
                this.upLeftStudentDb.play(actionName, 1);
            }
            else if (teachersAniIndex == 2) {
                if (actionName == DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING) {
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_XIAO) {
                    // 状态设置
                    this.isXiaoAniPlayStatus();
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 播放对应动画
                this.upRightStudentDb.play(actionName, 1);
            }
            else if (teachersAniIndex == 3) {
                if (actionName == DormitoryWarSantaModel.STATUS_TEACHER_YUJING) {
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_TEACHER_XIAO) {
                    // 状态设置
                    this.isXiaoAniPlayStatus();
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_TEACHER_LEFTNU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_TEACHER_RIGHTNU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                else if (actionName == DormitoryWarSantaModel.STATUS_TEACHER_ALLNU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.teachersDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 播放对应动画
                this.suGuanDb.play(actionName, 1);
            }
        }
        else {
            // 停止在预警动画
            if (teachersAniIndex == 1) {
                this.upLeftStudentDb.play(DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING, 0);
            }
            else if (teachersAniIndex == 2) {
                this.upRightStudentDb.play(DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING, 0);
            }
            else if (teachersAniIndex == 3) {
                this.suGuanDb.gotoAndStop(actionName);
            }
        }
    };
    DormitoryWarMainView.prototype.onYuJingComplete = function () {
        // 移除动画监听
        this.teachersDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
        // 预警播放完成
        this.yujingIsPlay = false;
        this.oneselfBeFound = false;
        this.otherBeFound = false;
        // console.log("状态== 预警 播放完成！" + this.yujingIsPlay);
        // 播放笑的动画
        this.santaPlayStatusXiaoFun();
    };
    DormitoryWarMainView.prototype.onXiaoComplete = function () {
        // 移除动画监听
        this.teachersDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
        // 预警播放完成
        this.yujingIsPlay = false;
        // 预警播放完成
        this.xiaoIsPlay = false;
        // console.log("状态== 笑 播放完成！" + this.xiaoIsPlay);
        // 播放怒的动画的时候
        if (this.nuIsPlay) {
            return;
        }
        // 清掉0.4秒执行检测操作
        // egret.clearTimeout(this.clearTimeoutDaodanBtnYanChi);
        // 回到预警状态
        this.teachersPlayStatusYuJingFun();
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
        if (App.IsXiaoMi) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarSantaModel.TEACHERS_ACTION_END, 2);
        }
    };
    DormitoryWarMainView.prototype.onNuComplete = function () {
        // 移除怒动画
        this.teachersDbDisplay.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
        // 清掉0.4秒执行检测操作
        egret.clearTimeout(this.clearTimeoutDaodanBtnYanChi);
        // 回到预警状态
        this.teachersPlayStatusYuJingFun();
        // 预警播放完成
        this.nuIsPlay = false;
        // 宿管笑
        this.xiaoIsPlay = false;
        // 预警播放完成
        this.yujingIsPlay = false;
        // 自己被发现
        this.oneselfBeFound = false;
        // 对方被发现
        this.otherBeFound = false;
        // console.log("==状态=onNuComplete=" + "播放完成" + this.nuIsPlay);
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
        // 恢复 同桌 的动画
        this.leftStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
        this.rightStudentAmiPlay(DormitoryWarModel.STATUS_DAIJI);
        // 恢复按钮事件
        this.btnsVisibleOrTouchEnabled(true, false);
        // 小米平台下
        if (App.IsXiaoMi) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarSantaModel.TEACHERS_ACTION_END, 2);
        }
    };
    // 老师，上铺左，上铺右 回到初始化状态
    DormitoryWarMainView.prototype.teachersPlayStatusYuJingFun = function () {
        this.teachersStatusAmiPlay(1, DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING, false);
        this.teachersStatusAmiPlay(2, DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING, false);
        this.teachersStatusAmiPlay(3, DormitoryWarSantaModel.STATUS_TEACHER_YUJING, false);
    };
    // 播放笑的动画
    DormitoryWarMainView.prototype.santaPlayStatusXiaoFun = function () {
        // 笑声音
        App.SoundManager.playEffect("santaSmileStatus_mp3");
        // 播放笑动画
        if (this.teachersAniIndex == 1) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_XIAO, true);
        }
        else if (this.teachersAniIndex == 2) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_XIAO, true);
        }
        else if (this.teachersAniIndex == 3) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, DormitoryWarSantaModel.STATUS_TEACHER_XIAO, true);
        }
        // 小米平台下通知后端AI
        if (App.IsXiaoMi) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarSantaModel.TEACHERS_COMEOUT, 2);
        }
    };
    // 左侧同学状态初始化
    DormitoryWarMainView.prototype.leftStudentAmiActionInit = function () {
        // 待机状态
        this.leftStudentDaijiImg.visible = false;
        // 被发现状态
        this.beFoundOneMc.gotoAndStop(1);
        this.beFoundOneMc.visible = false;
        // 攻击Mc
        this.hitLMc.visible = false;
        this.hitLMc.stop();
        // 被攻击Mc
        this.beHitLMc.visible = false;
        this.beHitLMc.stop();
        // 嘲讽Mc
        this.makeFunLMc.visible = false;
        this.makeFunLMc.stop();
    };
    //---左侧学生动画---
    DormitoryWarMainView.prototype.leftStudentAmiPlay = function (actionName) {
        this.leftStudentAmiActionInit();
        switch (actionName) {
            case DormitoryWarModel.STATUS_DAIJI:
                this.leftStudentDaijiImg.visible = true;
                break;
            case DormitoryWarModel.STATUS_ISSCOLDED:
                // 待机状态
                this.leftStudentDaijiImg.visible = true;
                this.beFoundOneMc.visible = true;
                this.beFoundOneMc.gotoAndPlay(1, -1);
                break;
            case DormitoryWarModel.STATUS_MAKEFUN:
                this.makeFunLMc.visible = true;
                this.makeFunLMc.gotoAndPlay(1, 1);
                break;
            case DormitoryWarModel.EVENT_HIT:
                this.hitLMc.visible = true;
                this.hitLMc.gotoAndPlay(1, 1);
                break;
            case DormitoryWarModel.EVENT_BEHIT:
                this.beHitLMc.visible = true;
                this.beHitLMc.gotoAndPlay(1, 1);
                break;
        }
    };
    // 右侧同学状态初始化
    DormitoryWarMainView.prototype.rightStudentAmiActionInit = function () {
        // 待机状态
        this.rightStudentDaijiImg.visible = false;
        // 被发现状态
        this.beFoundTwoMc.gotoAndStop(1);
        this.beFoundTwoMc.visible = false;
        // 攻击Mc
        this.hitRMc.visible = false;
        this.hitRMc.stop();
        // 被攻击Mc
        this.beHitRMc.visible = false;
        this.beHitRMc.stop();
        // 嘲讽Mc
        this.makeFunRMc.visible = false;
        this.makeFunRMc.stop();
    };
    //---右侧学生动画---
    DormitoryWarMainView.prototype.rightStudentAmiPlay = function (actionName) {
        this.rightStudentAmiActionInit();
        switch (actionName) {
            case DormitoryWarModel.STATUS_DAIJI:
                this.rightStudentDaijiImg.visible = true;
                break;
            case DormitoryWarModel.STATUS_ISSCOLDED:
                // 待机状态
                this.rightStudentDaijiImg.visible = true;
                this.beFoundTwoMc.visible = true;
                this.beFoundTwoMc.gotoAndPlay(1, -1);
                break;
            case DormitoryWarModel.STATUS_MAKEFUN:
                this.makeFunRMc.visible = true;
                this.makeFunRMc.gotoAndPlay(1, 1);
                break;
            case DormitoryWarModel.EVENT_HIT:
                this.hitRMc.visible = true;
                this.hitRMc.gotoAndPlay(1, 1);
                break;
            case DormitoryWarModel.EVENT_BEHIT:
                this.beHitRMc.visible = true;
                this.beHitRMc.gotoAndPlay(1, 1);
                break;
        }
    };
    //=====播放随机预警动画=====
    DormitoryWarMainView.prototype.randomPlaySantaAction = function () {
        this.currAmiIndex = 0;
        this.SetTimeoutExample();
    };
    // 随机间隔播放动画
    DormitoryWarMainView.prototype.SetTimeoutExample = function () {
        this.intervalIdKey = egret.setInterval(this.myDelayedFunction, this, 3000 + Math.ceil(Math.random() * 3) * 1000);
    };
    DormitoryWarMainView.prototype.myDelayedFunction = function (obj) {
        // 如果当前有正在播的动画return
        if (this.yujingIsPlay || this.xiaoIsPlay || this.nuIsPlay) {
            // console.log("状态==正在播的动画=》" + this.currAmiIndex + "==预警=" + this.yujingIsPlay + "==笑=" + this.xiaoIsPlay + "==怒=" + this.nuIsPlay);
            return;
        }
        // 播放预警
        if (this.dormitoryWarSantaModel.checkActions[this.currAmiIndex] == DormitoryWarSantaModel.TEACHERS_ACTION_STATUS1) {
            DataCenter.instance.room.IsAI == true ? this.upLeftStudentYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING, 1);
        }
        else if (this.dormitoryWarSantaModel.checkActions[this.currAmiIndex] == DormitoryWarSantaModel.TEACHERS_ACTION_STATUS2) {
            DataCenter.instance.room.IsAI == true ? this.upRightStudentYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING, 1);
        }
        else if (this.dormitoryWarSantaModel.checkActions[this.currAmiIndex] == DormitoryWarSantaModel.TEACHERS_ACTION_STATUS3) {
            DataCenter.instance.room.IsAI == true ? this.teacherYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, DormitoryWarSantaModel.STATUS_TEACHER_YUJING, 1);
        }
        // 一定时间间隔后播放下一个
        this.currAmiIndex++;
    };
    DormitoryWarMainView.GAME_WIDTH = 640;
    DormitoryWarMainView.GAME_HEIGHT = 1136;
    return DormitoryWarMainView;
}(StateEui));
__reflect(DormitoryWarMainView.prototype, "DormitoryWarMainView");
/**
 * 宿舍风云
*/
var DormitoryWarModel = (function (_super) {
    __extends(DormitoryWarModel, _super);
    function DormitoryWarModel() {
        var _this = _super.call(this) || this;
        _this.myScore = 0; // 我的分数
        _this.otherScore = 0; // 对方分数
        // 初始化数据
        _this.myScore = 0;
        _this.otherScore = 0;
        return _this;
    }
    DormitoryWarModel.EVENT_HIT = "EVENT_HIT"; // 攻击
    DormitoryWarModel.EVENT_BEHIT = "EVENT_BEHIT"; // 被攻击
    DormitoryWarModel.EVENT_MAKEFUN = "EVENT_MAKEFUN"; // 嘲笑
    DormitoryWarModel.EVENT_BE_FOUND = "EVENT_BE_FOUND"; // 被发现
    DormitoryWarModel.STATUS_ISSCOLDED = "isScolded"; // 被发现
    DormitoryWarModel.STATUS_MAKEFUN = "makeFun"; // 嘲讽
    DormitoryWarModel.STATUS_DAIJI = "sweepFloor"; // 静坐
    DormitoryWarModel.GET_HOST_PC = "GET_HOST_PC"; // 获取主机
    DormitoryWarModel.resultScore = 1500; // 设置优先达到分数获胜值
    return DormitoryWarModel;
}(egret.DisplayObjectContainer));
__reflect(DormitoryWarModel.prototype, "DormitoryWarModel");
/**
 * 电脑人
 */
var DormitoryWarSantaAI = (function (_super) {
    __extends(DormitoryWarSantaAI, _super);
    function DormitoryWarSantaAI(gameInstance, robotDirection) {
        var _this = _super.call(this) || this;
        // 机器人的方向
        _this.robotAiDirection = 2;
        // 循环播放相应动作
        _this.intervalIdRobotAiKey = 0;
        // 老师出现之后循环播放相应动作
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
    DormitoryWarSantaAI.prototype.robotThrowSnowBall = function () {
        // 电脑人分数
        this.gameChristmasMainView.dormitoryWarModel.otherScore++;
        this.gameChristmasMainView.playerScoreLab2.text = this.gameChristmasMainView.dormitoryWarModel.otherScore + "";
        // 是否达到目标分数
        this.gameChristmasMainView.arriveScore();
        // 攻击
        this.gameChristmasMainView.playerHitOther(this.robotAiDirection);
    };
    // 电脑人 嘲讽
    DormitoryWarSantaAI.prototype.robotMakeFun = function () {
        // 减分数
        this.gameChristmasMainView.dormitoryWarModel.myScore -= 2;
        if (this.gameChristmasMainView.dormitoryWarModel.myScore <= 0) {
            this.gameChristmasMainView.dormitoryWarModel.myScore = 0;
        }
        this.gameChristmasMainView.playerScoreLab1.text = this.gameChristmasMainView.dormitoryWarModel.myScore + "";
        // 嘲讽
        this.gameChristmasMainView.playerMakeFun(this.robotAiDirection);
        // 紫色熊播放被发现
        this.gameChristmasMainView.leftStudentAmiPlay(DormitoryWarModel.STATUS_ISSCOLDED);
        // 棕色熊播放嘲讽
        this.gameChristmasMainView.rightStudentAmiPlay(DormitoryWarModel.STATUS_MAKEFUN);
    };
    // 发送游戏结果
    DormitoryWarSantaAI.prototype.sendGameResult = function () {
        this.gameChristmasMainView.popup("GameResult");
    };
    //=====循环播放动画=====
    DormitoryWarSantaAI.prototype.randomPlayRobotAction = function () {
        this.SetTimeoutExample();
    };
    // clearSantaComeout
    DormitoryWarSantaAI.prototype.clearsantaComeoutHit = function () {
        egret.clearInterval(this.intervalSantaComeoutIdRobotAiKey);
    };
    // 预警之后
    DormitoryWarSantaAI.prototype.santaComeoutHit = function () {
        this.intervalSantaComeoutIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 200 + Math.ceil(Math.random() * 50));
    };
    // clearSantaComeout
    DormitoryWarSantaAI.prototype.clearSetTimeoutExample = function () {
        egret.clearInterval(this.intervalIdRobotAiKey);
    };
    // 随机间隔播放动画
    DormitoryWarSantaAI.prototype.SetTimeoutExample = function () {
        this.intervalIdRobotAiKey = egret.setInterval(this.myDelayedFunction, this, 140 + (5 - DormitoryWarSantaAI.robotAiLv) * 60);
    };
    DormitoryWarSantaAI.prototype.myDelayedFunction = function () {
        // 机器人被嘲讽状态
        if (this.robotBeMakeFun == true) {
            // console.log("==状态==机器人  被嘲讽  状态");
            return;
        }
        // 笑，并没有被发现
        if (this.gameChristmasMainView.xiaoIsPlay && this.robotNoBeFound) {
            // console.log("==状态==机器人 笑，并没有被发现  状态");
            return;
        }
        // santa出现
        if (this.gameChristmasMainView.xiaoIsPlay && !this.robotNoBeFound) {
            // 40%-的犯错
            var robotError = Math.ceil(Math.random() * 10);
            if (robotError > 5 + DormitoryWarSantaAI.robotAiLv) {
                // 机器人被嘲讽
                this.robotBeMakeFun = true;
            }
            else {
                // 机器人未被发现
                this.robotNoBeFound = true;
            }
            return;
        }
        // 玩家被发现 开始嘲讽
        if (this.gameChristmasMainView.nuIsPlay && this.gameChristmasMainView.oneselfBeFound) {
            // console.log("==状态==机器人 嘲讽玩家  状态");
            this.robotMakeFun();
            return;
        }
        // 捣蛋
        this.robotThrowSnowBall();
    };
    // 清楚数据
    DormitoryWarSantaAI.prototype.clearData = function () {
        // 清楚循环播放动画
        egret.clearInterval(this.intervalIdRobotAiKey);
        egret.clearInterval(this.intervalSantaComeoutIdRobotAiKey);
    };
    // 机器人等级
    DormitoryWarSantaAI.robotAiLv = 3;
    return DormitoryWarSantaAI;
}(egret.DisplayObjectContainer));
__reflect(DormitoryWarSantaAI.prototype, "DormitoryWarSantaAI");
/**
 * 舍友1，舍友2，宿管 随机检测数据
 */
var DormitoryWarSantaModel = (function (_super) {
    __extends(DormitoryWarSantaModel, _super);
    function DormitoryWarSantaModel() {
        var _this = _super.call(this) || this;
        // 随机预警动画 1上铺左 2上铺右 3宿管
        _this.checkActions = [1, 2, 3, 2, 3, 1, 3, 2, 1, 1, 2, 3, 2, 3, 1, 3, 2, 1, 2, 3, 2, 3, 1, 3, 2, 1];
        _this.arrRandomByIndex(_this.checkActions, 0, _this.checkActions.length);
        return _this;
    }
    DormitoryWarSantaModel.prototype.arrRandom = function (arr) {
        arr.sort(elementSort);
        function elementSort(elment1, element2) {
            return (Math.random() > 0.5) ? 1 : -1;
        }
    };
    DormitoryWarSantaModel.prototype.arrRandomByIndex = function (arr, startIndex, endIndex) {
        var arrTemp = arr.slice(startIndex, endIndex);
        this.arrRandom(arrTemp);
        for (var i = 0; i < arrTemp.length; i++) {
            arr[startIndex + i] = arrTemp[i];
        }
    };
    DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_YUJING = "upLeftDaiji"; // 上铺左 预警
    DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_XIAO = "upLeftYujing"; // 上铺左 笑
    DormitoryWarSantaModel.STATUS_UPLEFTSTUDENT_NU = "upLeftFound"; // 上铺左 怒
    DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_YUJING = "upRightDaiji"; // 上铺右 预警
    DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_XIAO = "upRightYujing"; // 上铺右 笑
    DormitoryWarSantaModel.STATUS_UPRIGHTSTUDENT_NU = "upRightFound"; // 上铺右 怒
    DormitoryWarSantaModel.STATUS_TEACHER_YUJING = "suGuanDaiji"; // 宿管 预警
    DormitoryWarSantaModel.STATUS_TEACHER_XIAO = "suGuanYujing"; // 宿管 笑
    DormitoryWarSantaModel.STATUS_TEACHER_LEFTNU = "suGuanLeftFound"; // 宿管 左怒
    DormitoryWarSantaModel.STATUS_TEACHER_RIGHTNU = "suGuanRightFound"; // 宿管 右怒
    DormitoryWarSantaModel.STATUS_TEACHER_ALLNU = "suGuanAllFound"; // 宿管 双怒
    DormitoryWarSantaModel.TEACHERS_ACTION_STATUS1 = 1; // 上铺左
    DormitoryWarSantaModel.TEACHERS_ACTION_STATUS2 = 2; // 上铺右
    DormitoryWarSantaModel.TEACHERS_ACTION_STATUS3 = 3; // 宿管
    DormitoryWarSantaModel.TEACHERS_COMEOUT = "TEACHERS_COMEOUT"; // 老师，校长开始出现
    DormitoryWarSantaModel.TEACHERS_ACTION_END = "TEACHERS_ACTION_END"; // 老师，校长动画结束
    return DormitoryWarSantaModel;
}(egret.DisplayObjectContainer));
__reflect(DormitoryWarSantaModel.prototype, "DormitoryWarSantaModel");
/**
 * 分数
 */
var DormitoryWarScore = (function (_super) {
    __extends(DormitoryWarScore, _super);
    function DormitoryWarScore() {
        return _super.call(this) || this;
    }
    return DormitoryWarScore;
}(egret.Bitmap));
__reflect(DormitoryWarScore.prototype, "DormitoryWarScore");
