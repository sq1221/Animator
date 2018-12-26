/**
 * 鹿皇争霸
 * by dingyafeng
 */
class GameChristmasMainView extends StateEui {

    public static GAME_WIDTH: number = 640;
    public static GAME_HEIGHT: number = 1136;

    //----------eui---------
    public containerGroup: eui.Group;

    public goBackBtn: eui.Button;// 返回

    public playerScoreLab1: eui.Label;// 左侧玩家分数
    public playerAvatarGroup1: eui.Group;//
    public timesLab: eui.Label;// 游戏倒计时
    public playerScoreLab2: eui.Label;// 右侧玩家分数
    public playerAvatarGroup2: eui.Group;//

    public buttonsGroup: eui.Group;// btnsGroup
    public daodanBtn: eui.Button;// 捣蛋按钮
    public chaofengBtn: eui.Button;// 嘲讽按钮

    public yancongDbGroup: eui.Group;// 烟囱
    public menkuangDbGroup: eui.Group;// 门框
    public liwuheDbGroup: eui.Group;// 礼物盒
    public ziseluGroup: eui.Group;// 紫色鹿
    public zongseluGroup: eui.Group;// 棕色鹿

    public snowContainerGroup: eui.Group;// 雪球容器
    public gp_top: eui.Group;//顶部区间

    private readyIMG: GameReady;

    public renyingImg: eui.Image;// 人影

    public youImg: eui.Image;// 标记个人的箭头

    public gantanhaoImg1: eui.Image;// 感叹号1
    public gantanhaoImg2: eui.Image;// 感叹号2
    public gantanhaoImg3: eui.Image;// 感叹号3

    public resultGroup: eui.Group;// 结算页
    public blueWinFlagImg: eui.Image;// 蓝方获胜flag
    public blueScoreLab: eui.Label;// 蓝方分数
    public blueScoreBg: eui.Image;// 蓝方分数背景
    public resultBuleLuImg: eui.Image;// 蓝方状态

    public redWinFlagImg: eui.Image;// 红方获胜flag
    public redScoreLab: eui.Label;// 红方分数
    public redScoreBg: eui.Image;// 红方分数背景
    public resultRedLuImg: eui.Image;// 红方状态


    //-----------变量---------
    private daodanActionTimeout: number = 0;// 捣蛋按钮timeout

    private oneselfNum: number = 1;// 1:左侧2：右侧

    private particleXueHua: particle.ParticleSystem;// 雪花粒子

    private clearTimeoutReadyId: number;// 延时
    private gameStartBool: boolean = false;// 游戏开始
    private gameLastTime: number = 60;// 游戏时长

    public gameChristmasModel: GameChristmasModel;// 玩家游戏数据
    private gameChristmasSantaModel: GameChristmasSantaModel;// 游戏随机动画数据

    public shanShuoTween: any;// 闪烁
    private clearTimeoutDaodanBtnYanChi: number;// 圣诞老人出现的时候捣蛋按钮延迟
    private clearTimeoutHideBtnsId: number;// 预警播放的时候隐藏捣蛋按钮
    public yujingIsPlay: boolean = false;// 预警动画是否播放中
    public xiaoIsPlay: boolean = false;// 笑动画是否播放中
    public nuIsPlay: boolean = false;// 怒动画是否播放中
    private santaDbIndex: number = 0;// 当前播放的动画是 1烟囱||2门||3礼物盒
    private santaDbDisplay: DBArmature;// 当前动画display
    private intervalIdKey: number;// 循环播放动画
    private currAmiIndex = 0;// 第几个动画

    public oneselfBeFound: boolean = false;// 玩家自己被发现
    public otherBeFound: boolean = false;// 对方玩家被发现

    private myAvatar: RoleAvatar;// 我的头像
    private myHeadImage: RoleHeadImage;// 我的头像
    private otherAvatar: RoleAvatar;// 对方头像
    private otherHeadImage: RoleHeadImage;// 我的头像

    //-------------db--------------
    private dbTimeTicker: number;

    public xunLuDb1: DBArmature;// 紫色鹿
    public xunLuDb2: DBArmature;// 棕色鹿
    public yancongDb: DBArmature;// 烟囱
    public fangjianmenDb: DBArmature;// 房间门
    public liwuheDb: DBArmature;// 礼物盒

    //------------Ai机器人----------
    public gameRobotAi: GameChristmasSantaAI;

    //------------音效--------------
    public christmasEffect: SoundEffects;
    public christmasCommonEffect: SoundEffects;

    public constructor() {
        super(GameChristmasMainSkin);
        // 记录游戏数据
        this.gameChristmasModel = new GameChristmasModel();
        // 游戏随机动画数据
        this.gameChristmasSantaModel = new GameChristmasSantaModel();
        // 当前播放动画 1烟囱||2门||3礼物盒
        this.santaDbIndex = 0;
    }

    public init(): void {
        super.init();

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
        egret.lifecycle.onPause = () => {
            if (this.christmasEffect) {
                this.christmasEffect.setVolume(0);
                // 背景音乐
                App.SoundManager.setBgOn(false);
                App.SoundManager.setEffectOn(false);
            }
            if (this.christmasCommonEffect) {
                this.christmasCommonEffect.setVolume(0);
            }
        }

        egret.lifecycle.onResume = () => {
            if (this.christmasEffect) {
                this.christmasEffect.setVolume(1);
                // 背景音乐
                App.SoundManager.setBgOn(true);
                App.SoundManager.setEffectOn(true);
            }
            if (this.christmasCommonEffect) {
                this.christmasCommonEffect.setVolume(1);
            }
        }

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
        } else {
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
    }

    public show(): void {
        super.show();
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
    }

    // 雪花particle
    private snowParticle(): void {
        var texture = RES.getRes("xuehua_png");
        var config = RES.getRes("xuehua_json");
        this.particleXueHua = new particle.GravityParticleSystem(texture, config);
        this.snowContainerGroup.addChild(this.particleXueHua);
        this.particleXueHua.start();
    }

    // 设置头像，并开启游戏
    private playerAvatarAdd() {
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
            } else {
                this.playerAvatarGroup1.addChild(this.myAvatar.armature);
                this.myAvatar.armature.x = this.playerAvatarGroup1.width / 2;
                this.myAvatar.armature.y = this.playerAvatarGroup1.height * 0.8;
                this.playerAvatarGroup2.addChild(this.otherAvatar.armature);
                this.otherAvatar.armature.x = this.playerAvatarGroup2.width / 2;
                this.otherAvatar.armature.y = this.playerAvatarGroup2.height * 0.8;
            }
        } else {
            if (App.IsXiaoMi) {
                this.playerAvatarGroup1.addChild(this.otherHeadImage);
                this.otherHeadImage.scaleX = this.otherHeadImage.scaleY = 0.8;
                this.otherHeadImage.x = 0;
                this.otherHeadImage.y = 0;
                this.playerAvatarGroup2.addChild(this.myHeadImage);
                this.myHeadImage.scaleX = this.myHeadImage.scaleY = 0.8;
                this.myHeadImage.x = 0;
                this.myHeadImage.y = 0;
            } else {
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
    }

    // 播放开始游戏 3，2，1
    private gameStart(): void {
        // you箭头缓动
        this.oneSelfTween();
        // 延时3秒播放
        this.clearTimeoutReadyId = egret.setTimeout(this.readyGoFun, this, 1200);
    }

    // 播放开始ready go
    private readyGoFun() {
        this.readyIMG = new GameReady(() => {
            // 播放背景音乐
            App.SoundManager.playBg("christmas_bg_mp3");
            // 游戏开始
            this.gameStartBool = true;
            // 取消箭头的缓动
            egret.Tween.removeTweens(this.youImg);
            this.youImg.visible = false;
            // 游戏剩余倒计时显示
            this.startMatchingTime();
            // 随机播动画 Id小的一方随机动画
            if (DataCenter.instance.room.IsAI) {
                this.randomPlaySantaAction();
                // 开启机器人动作播放
                if (this.gameRobotAi) {
                    this.gameRobotAi.randomPlayRobotAction();
                }
            } else {
                if (this.oneselfNum == 1) {
                    this.randomPlaySantaAction();
                }
            }
        });
        this.readyIMG.x = 300;
        this.readyIMG.y = App.GameHeight / 2;
        this.addChild(this.readyIMG);
        this.readyIMG.play();
    }

    // 注册服务器返回消息
    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
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
            } else {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.GET_HOST_PC + "|" + DataCenter.instance.user.id, 2);
            }
        }
    }
    private onGameEvent(data: any): void {
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
                } else {
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
                } else {
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
                } else {
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
                    } else {
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
                    } else {
                        this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                    }
                } else {
                    // 对方被发现
                    this.otherBeFound = true;
                    // 捣蛋按钮禁用,嘲讽按钮可用
                    if (!this.oneselfBeFound) {
                        this.btnsVisibleOrTouchEnabled(false, true);
                        // 播对方被发现动画
                        if (this.oneselfNum == 1) {
                            this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                        } else {
                            this.ziseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                        }
                    } else {
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
                    } else {
                        this.playerScoreLab1.text = arrEventData[2];
                        this.playerScoreLab2.text = arrEventData[1];
                    }
                } else {
                    // 同步分数
                    this.gameChristmasModel.myScore = parseInt(arrEventData[2]);
                    this.gameChristmasModel.otherScore = parseInt(arrEventData[1]);

                    if (this.oneselfNum == 1) {
                        this.playerScoreLab1.text = arrEventData[2];
                        this.playerScoreLab2.text = arrEventData[1];
                    } else {
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
    }
    // 烟囱预警
    private yancongYujingFun(): void {
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
    }
    // 门预警
    private fangJianMenYujingFun(): void {
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
    }
    // 礼物盒预警
    private liWuHeYujingFun(): void {
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
    }
    // santa播放怒动画
    public santaPlayNuAmiFun(): void {
        // santa骂的声音
        this.christmasCommonEffect && this.christmasCommonEffect.play("christmas_santaCurse_mp3");
        // 怒的动画
        if (this.santaDbIndex == 1) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_YANCONG_NU, true);
        } else if (this.santaDbIndex == 2) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_MEN_NU, true);
        } else if (this.santaDbIndex == 3) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_LIHE_NU, true);
        }
    }
    // 捣蛋，嘲讽按钮禁用或开启
    public btnsVisibleOrTouchEnabled(daodanStatus: boolean, chaofengStatus: boolean): void {
        // 捣蛋按钮状态
        this.daodanBtn.visible = daodanStatus;
        this.daodanBtn.touchEnabled = daodanStatus;
        // 嘲讽按钮状态
        this.chaofengBtn.visible = chaofengStatus;
        this.chaofengBtn.touchEnabled = chaofengStatus;
    }
    // 嘲讽别人
    private makeFunOtherPlayer(): void {
        this.gameChristmasModel.otherScore -= 2;
        if (this.gameChristmasModel.otherScore <= 0) {
            this.gameChristmasModel.otherScore = 0;
        }
        if (this.oneselfNum == 1) {
            this.playerScoreLab2.text = this.gameChristmasModel.otherScore + "";
            this.ziseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
        } else {
            this.playerScoreLab1.text = this.gameChristmasModel.otherScore + "";
            this.zongseluAmiPlay(GameChristmasModel.STATUS_MAKEFUN, 1);
        }
    }

    setScoreView(red: number, blue: number) {
        switch (App.Language) {
            case LanguageType.Ch:
                this.redScoreLab.text = "红方" + red + "分";// 红方分数
                this.blueScoreLab.text = "蓝方" + blue + "分";
                break;
            case LanguageType.En:
                this.redScoreLab.text = "Red " + red;// 红方分数
                this.blueScoreLab.text = "Blue" + blue;
                break;
        }
    }
    // 游戏结算页信息状态  1:win/lose   2:左右
    private resultViewState(): void {
        let data = DataCenter.instance.room.gameResult;
        if (data.winUserId == DataCenter.instance.user.id) {
            // 强制为150
            if (this.gameLastTime > 0 && this.gameChristmasModel.myScore != GameChristmasModel.resultScore) {
                this.gameChristmasModel.myScore = GameChristmasModel.resultScore;
            }
            if (this.oneselfNum == 1) {
                this.blueWinFlagImg.visible = true;// 蓝方获胜flag
                this.blueScoreLab.textColor = 0xFFFFFF;
                this.blueScoreBg.source = "blueBg_png";// 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuWin_png";// 蓝方状态

                this.redWinFlagImg.visible = false;// 红方失败flag
                this.redScoreLab.textColor = 0x6F6F6F;
                this.redScoreBg.source = "loseBg_png";// 红方分数背景
                this.resultRedLuImg.source = "redLuLose_png";// 红方状态

                this.setScoreView(this.gameChristmasModel.otherScore, this.gameChristmasModel.myScore);
            } else {
                this.blueWinFlagImg.visible = false;// 蓝方失败flag
                this.blueScoreLab.textColor = 0x6F6F6F;
                this.blueScoreBg.source = "loseBg_png";// 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuLose_png";// 蓝方状态

                this.redWinFlagImg.visible = true;// 红方胜利flag
                this.redScoreLab.textColor = 0xFFFFFF;
                this.redScoreBg.source = "redBg_png";// 红方分数背景
                this.resultRedLuImg.source = "redLuWin_png";// 红方状态

                this.setScoreView(this.gameChristmasModel.myScore, this.gameChristmasModel.otherScore);
            }
        } else {
            // 强制为150
            if (this.gameLastTime > 0 && this.gameChristmasModel.otherScore != GameChristmasModel.resultScore) {
                this.gameChristmasModel.otherScore = GameChristmasModel.resultScore;
            }
            if (this.oneselfNum == 1) {
                this.blueWinFlagImg.visible = false;// 蓝方获胜flag
                this.blueScoreLab.textColor = 0x6F6F6F;
                this.blueScoreBg.source = "loseBg_png";// 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuLose_png";// 蓝方状态

                this.redWinFlagImg.visible = true;// 红方失败flag
                this.redScoreLab.textColor = 0xFFFFFF;
                this.redScoreBg.source = "redBg_png";// 红方分数背景
                this.resultRedLuImg.source = "redLuWin_png";// 红方状态

                this.setScoreView(this.gameChristmasModel.otherScore, this.gameChristmasModel.myScore);
            } else {
                this.blueWinFlagImg.visible = true;// 蓝方失败flag
                this.blueScoreLab.textColor = 0xFFFFFF;
                this.blueScoreBg.source = "blueBg_png";// 蓝方分数背景
                this.resultBuleLuImg.source = "blueLuWin_png";// 蓝方状态

                this.redWinFlagImg.visible = false;// 红方胜利flag
                this.redScoreLab.textColor = 0x6F6F6F;
                this.redScoreBg.source = "loseBg_png";// 红方分数背景
                this.resultRedLuImg.source = "redLuLose_png";// 红方状态
                this.setScoreView(this.gameChristmasModel.myScore, this.gameChristmasModel.otherScore);
            }
        }
    }

    // 时间内先达到分数者获胜
    public arriveScore(): void {
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
        } else if (this.gameChristmasModel.otherScore >= GameChristmasModel.resultScore) {
            // 清楚数据
            this.clearData();
            // 校正分数
            this.gameChristmasModel.otherScore = GameChristmasModel.resultScore;
            // 同步分数
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasModel.GAMEOVER_AND_STEPSCORE + "|" + this.gameChristmasModel.myScore + "|" + this.gameChristmasModel.otherScore, 1);
        }
    }

    // 弹出游戏结果画面
    public onGameResult(data: any): void {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // 内部结算面板信息
        this.resultViewState();
        // 发送游戏结果
        this.popup("GameResult", this.resultPageFun);
    }

    // 游戏内部结算
    private resultPageFun = () => {
        // 弹出结果统计页
        this.resultGroup.visible = true;
        this.resultGroup.scaleX = this.resultGroup.scaleY = 0.3;
        egret.Tween.get(this.resultGroup)
            .to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.bounceOut)
            .wait(1600)
            .call(
            () => {
                this.popup("GameResult", null);
            }
            );
    }

    // 收到游戏离开
    private onGameleave() {
        this.clearData();
    }

    private clearData() {
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
    }

    public dispose(): void {
        super.dispose();
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
    }

    // 头像
    private playerAvatarGroup1Handler() {
        // 点击
        this.christmasCommonEffect && this.christmasCommonEffect.play("mouseClickSound_mp3");

        // 信息
        let playerData: any;
        if (this.oneselfNum == 1) {
            // 当前信息
            playerData = DataCenter.instance.user;
        } else {
            // 当前信息
            playerData = DataCenter.instance.room.player;
        }
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    }
    // 头像
    private playerAvatarGroup2Handler() {
        // 点击
        this.christmasCommonEffect && this.christmasCommonEffect.play("mouseClickSound_mp3");

        // 信息
        let playerData: any;
        if (this.oneselfNum == 1) {
            // 当前信息
            playerData = DataCenter.instance.room.player;
        } else {
            // 当前信息
            playerData = DataCenter.instance.user;
        }
        // 打开玩家信息页
        this.popup("GameCenterMyHomePage", { lastViewName: "IS_GAMEING", currPlayerData: playerData });
    }

    // 请求游戏返回
    private goBackBtnHandler(): void {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    }

    // 倒计时间刷新
    public ontimerUpdate() {
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
        } else {
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
    }

    // 发送游戏结果
    private sendResult(result: number): void {
        // 发送结果
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    }

    // 游戏剩余倒计时显示
    private startMatchingTime(): void {
        this.gameLastTime = 60;
        App.TimerManager.doTimer(1000, 0, this.ontimerUpdate, this);
    }

    // 标记个人的箭头 0:左 1：右
    private oneSelfTween(): void {
        let _startY = this.youImg.y;
        let _endY = this.youImg.y + 60;
        this.youImg.x = this.youImg.x;
        this.youImg.visible = true;
        // 执行缓动
        egret.Tween.get(this.youImg, { loop: true }, egret.Ease.sineOut)
            .to({ scaleX: 0.7, scaleY: 0.7, x: this.youImg.x, y: _endY }, 400)
            .to({ scaleX: 0.8, scaleY: 0.8, x: this.youImg.x, y: _startY }, 400)
    }

    // 感叹号闪烁 gantanhaoIndex: 1,2,3  times预警时间
    private onYuJingTween(gantanhaoIndex: number, times: number = 1000): void {
        let self = this;
        // 当前闪烁对象
        let gthObj = this["gantanhaoImg" + gantanhaoIndex];
        gthObj.visible = true;
        // 执行缓动
        this.shanShuoTween = egret.Tween.get(gthObj, { loop: true }, egret.Ease.sineOut)
            .to({ visible: false }, 200)
            .to({ visible: true }, 200)
        egret.Tween.get(gthObj).wait(times).call(() => {
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
    }

    //-------雪球缓动动画---------
    private moveOne(ball: GameChristmasBall): void {
        egret.Tween.get(ball).to({ factorTwo: 1 }, 100).call(this.moveTwo.bind(this, ball));
    }
    private moveTwo(ball: GameChristmasBall): void {
        egret.Tween.get(ball).to({ alpha: 0.2 }, 1600).call(() => {
            this.snowContainerGroup.removeChild(ball);
            ObjectPool.push(ball);
        });
    }
    //-------数字缓动动画---------
    private scoreTweenMove(scores: GameChristmasScore): void {
        egret.Tween.get(scores).wait(80).call(() => {
            this.snowContainerGroup.removeChild(scores);
            ObjectPool.push(scores);
        });
    }

    // 捣蛋按钮事件
    private daodanBtnHandler(event: egret.TouchEvent): void {
        if (!this.gameStartBool) {
            return;
        }

        this.daodanBtn.touchEnabled = false;
        // 按钮频率
        this.daodanActionTimeout = setTimeout(() => {
            this.daodanBtn.touchEnabled = true;
            egret.clearTimeout(this.daodanActionTimeout);
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

    }
    // 紫色驯鹿播放攻击动作之后扫雪
    private onThrowSnowBallXunlu1Complete(): void {
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
    }
    // 棕色驯鹿播放攻击动作之后扫雪
    private onThrowSnowBallXunlu2Complete(): void {
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
    }

    // 棕色驯鹿播放挨打完成之后扫雪
    public onBeatingXunlu2Complete(): void {
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
            } else {
                // 播放被发现动画
                this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        } else {
            if (this.oneselfNum == 1) {
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            } else if (this.oneselfNum == 2) {
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        }
    }
    // 紫色驯鹿播放挨打完成之后扫雪
    public onBeatingXunlu1Complete(): void {
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
            } else {
                // 播放被发现动画
                this.zongseluAmiPlay(GameChristmasModel.STATUS_ISSCOLDED, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        } else {
            if (this.oneselfNum == 1) {
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            } else if (this.oneselfNum == 2) {
                this.zongseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
                if (this.otherBeFound) {
                    return;
                }
                this.ziseluAmiPlay(GameChristmasModel.STATUS_SWEEPFLOOR, 0);
            }
        }
    }

    // 扔雪球  1：向右侧扔雪球 2：向右侧扔雪球
    public playerThrowSnowBall(directLorR: number): void {
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
        } else {
            // 扔雪球
            this.xunLuDb2.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onThrowSnowBallXunlu2Complete, this);
            this.zongseluAmiPlay(GameChristmasModel.STATUS_THROW_SNOWBALL);
            // 对方播放挨打动画一次
            this.xunLuDb1.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBeatingXunlu1Complete, this);
            this.ziseluAmiPlay(GameChristmasModel.STATUS_BEATING);
        }

        // 动态生成雪球
        var ball: GameChristmasBall = ObjectPool.pop(GameChristmasBall, "GameChristmasBall");
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
        } else if (ball.directionLOrR == 2) {
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
        var scoreImg: GameChristmasScore = ObjectPool.pop(GameChristmasScore, "GameChristmasScore");
        var colorType: number = Math.ceil(Math.random() * 4);
        // 左侧
        if (ball.directionLOrR == 1) {
            scoreImg.texture = RES.getRes("oneL" + colorType + "_png");
            scoreImg.x = this.ziseluGroup.x + 110;
            scoreImg.y = this.ziseluGroup.y - 400;
        } else if (ball.directionLOrR == 2) {
            scoreImg.texture = RES.getRes("oneR" + colorType + "_png");
            scoreImg.x = this.zongseluGroup.x - 110;
            scoreImg.y = this.zongseluGroup.y - 400;
        }
        scoreImg.alpha = 1;
        // 添加到容器
        this.snowContainerGroup.addChild(scoreImg);
        // 执行缓动
        egret.Tween.get(scoreImg).to({ x: scoreImg.x, y: (scoreImg.y - 200), alpha: 0.2 }, 1000).call(this.scoreTweenMove.bind(this, scoreImg));
    }

    // 嘲讽按钮事件
    private chaofengBtnHandler(event: egret.TouchEvent): void {
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
    }

    // 嘲讽 1:嘲讽别人，2：被嘲讽
    public playerMakeFun(makeFunStatus: number): void {
        // 嘲讽声音
        this.christmasEffect && this.christmasEffect.play("christmas_makeFun1_mp3");
        // 动态生成数字
        var scoreImg: GameChristmasScore = ObjectPool.pop(GameChristmasScore, "GameChristmasScore");
        var colorType: number = Math.ceil(Math.random() * 4);
        // 嘲讽别人
        if (makeFunStatus == 1) {
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("twoL" + colorType + "_png");
                scoreImg.x = this.zongseluGroup.x - 110;
                scoreImg.y = this.zongseluGroup.y - 400;
            } else {
                scoreImg.texture = RES.getRes("twoL" + colorType + "_png");
                scoreImg.x = this.ziseluGroup.x + 110;
                scoreImg.y = this.ziseluGroup.y - 400;
            }
        } else if (makeFunStatus == 2) {
            // 被别人嘲讽
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("twoL" + colorType + "_png");
                scoreImg.x = this.ziseluGroup.x + 110;
                scoreImg.y = this.ziseluGroup.y - 400;
            } else {
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
    }

    // 创建动画资源加载到舞台
    private addAllDb(): void {
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
    }

    public tick(advancedTime: number): void {
        super.tick(advancedTime);

        if (!this.dbTimeTicker) {
            this.dbTimeTicker = advancedTime;
        }
        var now = advancedTime;
        var pass = now - this.dbTimeTicker;
        this.dbTimeTicker = now;
    }

    // 停止所有动画
    private stopAllDbAmi(): void {
        this.santaStatusAmiPlay(1, GameChristmasSantaModel.STATUS_YANCONG_YUJING, false);
        this.santaStatusAmiPlay(2, GameChristmasSantaModel.STATUS_MEN_YUJING, false);
        this.santaStatusAmiPlay(3, GameChristmasSantaModel.STATUS_LIHE_YUJING, false);
        this.xunLuDb1.gotoAndStop(GameChristmasModel.STATUS_SWEEPFLOOR);
        this.xunLuDb2.gotoAndStop(GameChristmasModel.STATUS_SWEEPFLOOR);
    }

    // 房间门的预警
    public menYujingTween(): void {
        let self = this;
        // 预警动画播放中
        this.yujingIsPlay = true;
        // 坐标
        let _startY = this.renyingImg.x;
        let _endY = this.renyingImg.x + 80;
        this.renyingImg.x = this.renyingImg.x;
        self.renyingImg.visible = true;

        // tween次数
        let times = 3;

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
    }
    //---房间门动画---
    public santaStatusAmiPlay(santaDbIndex: number, actionName: string, playOrStop: boolean): void {
        if (playOrStop) {
            if (this.santaDbIndex == 1) {
                if (actionName == GameChristmasSantaModel.STATUS_YANCONG_YUJING) {
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
                } else if (actionName == GameChristmasSantaModel.STATUS_YANCONG_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(() => { if (this.xiaoIsPlay && !this.nuIsPlay) { this.btnsVisibleOrTouchEnabled(false, false) } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(() => { this.xiaoIsPlay = true; }, this, 400);

                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                } else if (actionName == GameChristmasSantaModel.STATUS_YANCONG_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 播放对应动画
                this.yancongDb.play(actionName, 1);
            } else if (this.santaDbIndex == 2) {
                if (actionName == GameChristmasSantaModel.STATUS_MEN_YUJING) {
                    this.menYujingTween();
                    return;
                } else if (actionName == GameChristmasSantaModel.STATUS_MEN_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(() => { if (this.xiaoIsPlay && !this.nuIsPlay) { this.btnsVisibleOrTouchEnabled(false, false) } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(() => { this.xiaoIsPlay = true; }, this, 400);

                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                } else if (actionName == GameChristmasSantaModel.STATUS_MEN_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 显示房间门动画，并播放对应动画
                this.fangjianmenDb.visible = true;
                this.fangjianmenDb.play(actionName, 1);
            } else if (this.santaDbIndex == 3) {
                if (actionName == GameChristmasSantaModel.STATUS_LIHE_YUJING) {
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onYuJingComplete, this);
                } else if (actionName == GameChristmasSantaModel.STATUS_LIHE_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(() => { if (this.xiaoIsPlay && !this.nuIsPlay) { this.btnsVisibleOrTouchEnabled(false, false) } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(() => { this.xiaoIsPlay = true; }, this, 400);

                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onXiaoComplete, this);
                } else if (actionName == GameChristmasSantaModel.STATUS_LIHE_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;
                    // 动画播放监听
                    this.santaDbDisplay.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onNuComplete, this);
                }
                // 播放对应动画
                this.liwuheDb.play(actionName, 1);
            }
        } else {
            if (santaDbIndex == 1) {
                // 停止在预警动画
                this.yancongDb.gotoAndStop(actionName);
            } else if (santaDbIndex == 2) {
                if (actionName == GameChristmasSantaModel.STATUS_MEN_YUJING) {
                    this.fangjianmenDb.visible = false;
                    this.renyingImg.visible = false;
                    return;
                }
                this.fangjianmenDb.gotoAndStop(actionName);
            } else if (santaDbIndex == 3) {
                this.liwuheDb.gotoAndStop(actionName);
            }
        }
    }
    private onYuJingComplete(): void {
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
    }
    private onXiaoComplete(): void {
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
    }
    private onNuComplete(): void {
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
    }

    // 暂停到预警状态
    private santaPlayStatusYuJingFun(): void {
        this.santaStatusAmiPlay(1, GameChristmasSantaModel.STATUS_YANCONG_YUJING, false);
        this.santaStatusAmiPlay(2, GameChristmasSantaModel.STATUS_MEN_YUJING, false);
        this.santaStatusAmiPlay(3, GameChristmasSantaModel.STATUS_LIHE_YUJING, false);
    }
    // 播放笑的动画
    private santaPlayStatusXiaoFun(): void {
        // 笑声音
        this.christmasCommonEffect && this.christmasCommonEffect.play("santaSmileStatus_mp3");
        // 播放笑动画
        if (this.santaDbIndex == 1) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_YANCONG_XIAO, true);
        } else if (this.santaDbIndex == 2) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_MEN_XIAO, true);
        } else if (this.santaDbIndex == 3) {
            this.santaStatusAmiPlay(this.santaDbIndex, GameChristmasSantaModel.STATUS_LIHE_XIAO, true);
        }
        // 小米平台下
        if (App.IsXiaoMi || App.IsLocal) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.SANTA_COMEOUT, 2);
        }
    }

    //---驯鹿动画---
    public ziseluAmiPlay(actionName: string, times: number = 1): void {
        this.xunLuDb1.play(actionName, times);
    }

    //---棕色驯鹿动画---
    public zongseluAmiPlay(actionName: string, times: number = 1): void {
        this.xunLuDb2.play(actionName, times);
    }

    //=====播放随机预警动画=====
    private randomPlaySantaAction(): void {
        this.currAmiIndex = 0;
        this.SetTimeoutExample();
    }
    // 随机间隔播放动画
    private SetTimeoutExample(): void {
        this.intervalIdKey = egret.setInterval(this.myDelayedFunction, this, 3000 + Math.ceil(Math.random() * 3) * 1000);
    }
    private myDelayedFunction(obj: any): void {
        // 如果当前有正在播的动画return
        if (this.yujingIsPlay || this.xiaoIsPlay || this.nuIsPlay) {
            return;
        }
        // 播放预警
        if (this.gameChristmasSantaModel.checkActions[this.currAmiIndex] == GameChristmasSantaModel.SANTA_ACTION_STATUS1) {
            DataCenter.instance.room.IsAI == true ? this.yancongYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.STATUS_YANCONG_YUJING, 1);
        } else if (this.gameChristmasSantaModel.checkActions[this.currAmiIndex] == GameChristmasSantaModel.SANTA_ACTION_STATUS2) {
            DataCenter.instance.room.IsAI == true ? this.fangJianMenYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.STATUS_MEN_YUJING, 1);
        } else if (this.gameChristmasSantaModel.checkActions[this.currAmiIndex] == GameChristmasSantaModel.SANTA_ACTION_STATUS3) {
            DataCenter.instance.room.IsAI == true ? this.liWuHeYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, GameChristmasSantaModel.STATUS_LIHE_YUJING, 1);
        }
        // 一定时间间隔后播放下一个
        this.currAmiIndex++;
    }
}