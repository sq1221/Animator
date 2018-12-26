/**
 * 互怼校园
 * by dingyafeng
 */
class LameDeskmateMainView extends StateEui {

    public static GAME_WIDTH: number = 640;
    public static GAME_HEIGHT: number = 1136;

    //----------eui---------
    public containerGroup: eui.Group;

    public goBackBtn: eui.Button;// 返回

    public playerScoreLab1: eui.BitmapLabel;// 左侧玩家分数
    public playerAvatarGroup1: eui.Group;// 左侧头像
    public personSexImg1: eui.Image;// 左侧性别
    public personNameLab1: eui.Label;// 左侧名称
    public timesLab: eui.Label;// 游戏倒计时
    public playerScoreLab2: eui.BitmapLabel;// 右侧玩家分数
    public playerAvatarGroup2: eui.Group;// 右侧头像
    public personSexImg2: eui.Image;// 右侧性别
    public personNameLab2: eui.Label;// 右侧名称

    public buttonsGroup: eui.Group;// btnsGroup
    public daodanBtn: eui.Button;// 怼他按钮
    public chaofengBtn: eui.Button;// 得瑟按钮

    public teacherDbGroup: eui.Group;// 老师
    public teacherXiaoNuImg: eui.Image;// 老师笑，怒状态

    public headmasterDbGroup: eui.Group;// 校长
    public headmasterShadowImg: eui.Image;// 校长人影
    public headmasterXiao: eui.Image;// 校长笑
    public headmasterNu: eui.Image;// 校长怒

    public leftStudentDbGroup: eui.Group;// 左侧同学
    public leftStudentDaijiImg: eui.Image;// 待机状态
    public leftStudentBeFoundImg: eui.Image;// 被发现

    public rightStudentDbGroup: eui.Group;// 右侧同学
    public rightStudentDaijiImg: eui.Image;// 待机状态
    public rightStudentBeFoundImg: eui.Image;// 被发现

    public effectGroup1: eui.Group;// 怒火effect
    public effectGroup2: eui.Group;// 风速effect
    public effectGroup3: eui.Group;// 站起来图片，动画Mc  竖线，十字包
    public beFoundStandUpImg: eui.Image;// 站起来
    public chaofengImg: eui.Image;// 没心态了吧
    public beHitEffectLeftGroup: eui.Group;// 左侧被打effect
    public beHitEffectRightGroup: eui.Group;// 右侧被打effect

    public scoreContainerGroup: eui.Group;// 分数容器

    private readyIMG: GameReady;// ready go
    public youImg: eui.Image;// 标记个人的箭头
    public isMeImg: eui.Image;// 标记我的位置
    public classStartImg: eui.Image;// 开始上课响铃
    public guideHandImg: eui.Image;// 手势引导
    public guideTipImg: eui.Image;// 引导提示

    public resultGroup: eui.Group;// 结算页

    public winStateImg: eui.Image;// 嬴显示，输隐藏
    public winOrLoseImg: eui.Image;// 嬴为彩色，输为灰色
    public winOrLoseLab: eui.Label;// 胜利，失败文本

    public winnerAvatarGroup: eui.Group;// 头像
    public myScoreLab: eui.Label;// 我的本局分数

    public myResultLab: eui.Label;// 我的比分
    public otherResultLab: eui.Label;// 对方比分
    public resultPlayerAvatar1: eui.Group;// 我的头像
    public resultPlayerAvatar2: eui.Group;// 对方头像
    public resultPlayerNameLab1: eui.Label;// 我的名字
    public resultPlayerNameLab2: eui.Label;// 对方名字
    public resultSexImg1: eui.Image;// 我的性别
    public resultSexImg2: eui.Image;// 对方性别

    //-----------变量---------
    private daodanActionTimeout: number = 0;// 捣蛋按钮timeout

    private oneselfNum: number = 1;// 1:左侧2：右侧

    private clearTimeoutReadyId: number;// 延时
    private gameStartBool: boolean = false;// 游戏开始
    private gameLastTime: number = 60;// 游戏时长

    private teacherActionTime: number = 0;// 当前动作时长

    public lameDeskmateModel: LameDeskmateModel;// 玩家游戏数据
    private LameDeskmateSantaModel: LameDeskmateSantaModel;// 游戏随机动画数据

    public shanShuoTween: any;// 闪烁

    private clearTimeoutDaodanBtnYanChi: number;// 圣诞老人出现的时候捣蛋按钮延迟
    private clearTimeoutHideBtnsId: number;// 预警播放的时候隐藏捣蛋按钮
    public yujingIsPlay: boolean = false;// 预警动画是否播放中
    public xiaoIsPlay: boolean = false;// 笑动画是否播放中
    public nuIsPlay: boolean = false;// 怒动画是否播放中

    private teachersAniIndex: number = 0;// 当前播放的动画是 1老师||2校长

    private teachersAniMc: egret.MovieClip;// 当前动画mc

    private intervalIdKey: number;// 循环播放动画
    private currAmiIndex = 0;// 第几个动画

    public oneselfBeFound: boolean = false;// 玩家自己被发现
    public otherBeFound: boolean = false;// 对方玩家被发现

    private myHeadImage: RoleHeadImage;// 我的头像
    private otherHeadImage: RoleHeadImage;// 我的头像

    private resultHeadImage: RoleHeadImage;// 结算页大头像
    private resultMySmallHeadImage: RoleHeadImage;// 结算页我的小头像
    private resultOtherSmallHeadImage: RoleHeadImage;// 结算页对方小头像

    //-------------ani mc 动画--------------
    private dbTimeTicker: number;

    // 左侧同学
    private hitLMcFactory: egret.MovieClipDataFactory;// 攻击mcFactory动画
    private hitLMc: egret.MovieClip;// 攻击Mc
    private beHitLMcFactory: egret.MovieClipDataFactory;// 被打mcFactory动画
    private beHitLMc: egret.MovieClip;// 被打Mc
    private beHitLEffectFactory: egret.MovieClipDataFactory;// 被打效果动画
    private beHitLEffectMc: egret.MovieClip;// 被打效果Mc
    private makeFunLMcFactory: egret.MovieClipDataFactory;// 嘲讽mcFactory动画
    private makeFunLMc: egret.MovieClip;// 嘲讽Mc

    // 右侧同学
    private hitRMcFactory: egret.MovieClipDataFactory;// 攻击mcFactory动画
    private hitRMc: egret.MovieClip;// 攻击Mc
    private beHitRMcFactory: egret.MovieClipDataFactory;// 被打mcFactory动画
    private beHitRMc: egret.MovieClip;// 被打Mc
    private beHitREffectFactory: egret.MovieClipDataFactory;// 被打效果动画
    private beHitREffectMc: egret.MovieClip;// 被打效果Mc
    private makeFunRMcFactory: egret.MovieClipDataFactory;// 嘲讽mcFactory动画
    private makeFunRMc: egret.MovieClip;// 嘲讽Mc

    // 老师
    public teacherDaijiFactory: egret.MovieClipDataFactory;// 老师mcFactory待机动画
    public teacherDaijiMc: egret.MovieClip;// 老师待机Mc

    // effect 效果
    private fireMcFactory: egret.MovieClipDataFactory;// 怒火mcFactory动画
    private fireMc: egret.MovieClip;// 怒火Mc
    private speedMcFactory: egret.MovieClipDataFactory;// 速度mcFactory动画
    private speedMc: egret.MovieClip;// 速度Mc

    // 被发现效果
    private beFoundOneMcFactory: egret.MovieClipDataFactory;// 被发现效果动画1
    private beFoundOneMc: egret.MovieClip;// 被发现效果动画1 Mc
    private beFoundTwoMcFactory: egret.MovieClipDataFactory;// 被发现效果动画2
    private beFoundTwoMc: egret.MovieClip;// 被发现效果动画2 Mc

    //------------Ai机器人----------
    public gameRobotAi: LameDeskmateSantaAI;
    public static aiConf: any = {};

    //------------音效--------------
    public lameDeskmateEffect: SoundEffects;
    public lameDeskmateCommonEffect: SoundEffects;

    public constructor() {
        super(GameLameDeskmateMainSkin);
        // 记录游戏数据
        this.lameDeskmateModel = new LameDeskmateModel();
        // 游戏随机动画数据
        this.LameDeskmateSantaModel = new LameDeskmateSantaModel();
        // 当前播放动画 1老师||2校长
        this.teachersAniIndex = 0;
    }

    public init(): void {
        super.init();

        //適配
        var a = App.GameWidth / LameDeskmateMainView.GAME_WIDTH;
        var b = App.GameHeight / LameDeskmateMainView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.containerGroup.scaleX = this.containerGroup.scaleY = c;
        this.containerGroup.x = (App.GameWidth - LameDeskmateMainView.GAME_WIDTH * c) * 0.5;
        this.containerGroup.y = (App.GameHeight - LameDeskmateMainView.GAME_HEIGHT * c) * 0.5;

        // 播放背景音乐
        App.SoundManager.stopBg();
        // 音效
        this.lameDeskmateEffect = new SoundEffects();
        this.lameDeskmateEffect.setVolume(1);
        this.lameDeskmateCommonEffect = new SoundEffects();
        this.lameDeskmateCommonEffect.setVolume(1);

        // 音乐切换后台监听
        egret.lifecycle.onPause = () => {
            if (this.lameDeskmateEffect) {
                this.lameDeskmateEffect.setVolume(0);
                // 背景音乐
                App.SoundManager.setBgOn(false);
                App.SoundManager.setEffectOn(false);
            }
            if (this.lameDeskmateCommonEffect) {
                this.lameDeskmateCommonEffect.setVolume(0);
            }
        }

        egret.lifecycle.onResume = () => {
            if (this.lameDeskmateEffect) {
                this.lameDeskmateEffect.setVolume(1);
                // 背景音乐
                App.SoundManager.setBgOn(true);
                App.SoundManager.setEffectOn(true);
            }
            if (this.lameDeskmateCommonEffect) {
                this.lameDeskmateCommonEffect.setVolume(1);
            }
        }

        // 初始化按钮状态
        this.btnsVisibleOrTouchEnabled(false, false);
        // 返回按钮
        this.goBackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 弹出退出确认面板
            this.popup("GameSureLeave");
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
        this.myHeadImage = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 60, 60);
        // 加载圆头像
        if (this.otherHeadImage) {
            this.otherHeadImage.dispose();
            this.otherHeadImage = null;
        }
        this.otherHeadImage = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 60, 60);

        // 游戏结算页
        this.resultGroup.visible = false;

        // 加载结算页头像
        if (this.resultHeadImage) {
            this.resultHeadImage.dispose();
            this.resultHeadImage = null;
        }
        this.resultHeadImage = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 170, 170);
        // 加载结算页我的小头像
        if (this.resultMySmallHeadImage) {
            this.resultMySmallHeadImage.dispose();
            this.resultMySmallHeadImage = null;
        }
        this.resultMySmallHeadImage = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 120, 120);
        // 加载结算页对方小头像
        if (this.resultOtherSmallHeadImage) {
            this.resultOtherSmallHeadImage.dispose();
            this.resultOtherSmallHeadImage = null;
        }
        this.resultOtherSmallHeadImage = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 120, 120);
    }

    public show(): void {
        super.show();
        // 游戏未开始
        this.gameStartBool = false;

        // 添加mc动画
        this.addAllMc();

        // 开启电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 电脑人模式
            this.gameRobotAi = new LameDeskmateSantaAI(this, 2);
            // Ai等级
            LameDeskmateSantaAI.robotAiLv = App.CurrGameAiLevel;
            // 默认玩家在左侧
            this.oneselfNum = 1;
            // 标记箭头在左
            this.youImg.source = "lameDeskMateYouL_png";
            this.youImg.x = 60;
            // 在游戏中标记我
            this.isMeImg.left = 8;
            // 机器人模式下获取服务器ai配置
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, (data: any) => {
                LameDeskmateMainView.aiConf = data;
                console.log(`IsXiaoMi${App.CurrGameAiLevel}   ${JSON.stringify(LameDeskmateMainView.aiConf)}`);
                // 加载头像开始游戏
                this.playerAvatarAdd();
            });
        }
    }

    // 设置头像，并开启游戏
    private playerAvatarAdd() {
        // 初始化玩家信息
        if (this.oneselfNum == 1) {
            // 玩家1 姓名+性别
            this.personNameLab1.text = DataCenter.instance.user.name;
            this.personSexImg1.source = GameCenterGetSexIcon.getSexIconSource(DataCenter.instance.user.sex);
            // 玩家2 姓名+性别
            this.personNameLab2.text = DataCenter.instance.room.player.name;
            this.personSexImg2.source = GameCenterGetSexIcon.getSexIconSource(DataCenter.instance.room.player.sex);
            // 头像
            this.playerAvatarGroup1.addChild(this.myHeadImage);
            this.myHeadImage.x = 0;
            this.myHeadImage.y = 0;
            this.playerAvatarGroup2.addChild(this.otherHeadImage);
            this.otherHeadImage.x = 0;
            this.otherHeadImage.y = 0;
        } else {
            // 玩家1 姓名+性别
            this.personNameLab1.text = DataCenter.instance.room.player.name;
            this.personSexImg1.source = GameCenterGetSexIcon.getSexIconSource(DataCenter.instance.room.player.sex);
            // 玩家2 姓名+性别
            this.personNameLab2.text = DataCenter.instance.user.name;
            this.personSexImg2.source = GameCenterGetSexIcon.getSexIconSource(DataCenter.instance.user.sex);
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
    }

    // 播放开始游戏 3，2，1
    private gameStart(): void {

        let gameStartFun = () => {
            // 播放背景音乐
            App.SoundManager.playBg("lameDeskMate_bg_mp3");

            // 在游戏中标记我
            this.isMeImg.visible = true;

            // you箭头缓动
            this.oneSelfTween();

            // 上课铃动画
            this.classStartTween();

            // 按钮状态
            this.btnsVisibleOrTouchEnabled(true, false);
            // 引导手势
            this.guideHandTween();
            // 引导提示
            this.guideTipImg.visible = true;

            egret.setTimeout(() => {
                // 游戏开始
                this.gameStartBool = true;

                // 取消箭头的缓动
                egret.Tween.removeTweens(this.youImg);
                this.youImg.visible = false;
                // 取消上课铃的缓动
                egret.Tween.removeTweens(this.classStartImg);
                this.classStartImg.visible = false;

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
            }, this, 2000);
        }

        // 播放开始ready go
        function readyGoFun() {
            this.readyIMG = new GameReady(() => {
                gameStartFun();
            });
            this.readyIMG.x = 300;
            this.readyIMG.y = App.GameHeight / 2;
            this.addChild(this.readyIMG);
            this.readyIMG.play();
        }
        // 延时3秒播放
        this.clearTimeoutReadyId = egret.setTimeout(readyGoFun, this, 200);
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
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateModel.GET_HOST_PC + "|" + DataCenter.instance.room.player.id, 2);
            } else {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateModel.GET_HOST_PC + "|" + DataCenter.instance.user.id, 2);
            }
        }
    }
    private onGameEvent(data: any): void {
        var arrEventData = data.event.split("|");
        switch (arrEventData[0]) {
            case LameDeskmateModel.GET_HOST_PC:
                // Ai情况下不接收
                if (DataCenter.instance.room.IsAI) {
                    return;
                }
                if (arrEventData[1] == DataCenter.instance.user.id) {
                    this.oneselfNum = 1;
                    // 标记箭头在左
                    this.youImg.source = "lameDeskMateYouL_png";
                    this.youImg.x = 60;
                    // 在游戏中标记我
                    this.isMeImg.left = 8;
                } else {
                    this.oneselfNum = 2;
                    // 标记箭头在右
                    this.youImg.source = "lameDeskMateYouR_png";
                    this.youImg.x = App.GameWidth - 60;
                    // 在游戏中标记我
                    this.isMeImg.right = 8;
                }

                // 开始游戏
                this.playerAvatarAdd();
                break;
            case LameDeskmateModel.EVENT_HIT:
                if (this.nuIsPlay || this.xiaoIsPlay) {
                    return;
                }
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 更新自己分数
                    this.lameDeskmateModel.myScore++;
                    this["playerScoreLab" + this.oneselfNum].text = this.lameDeskmateModel.myScore + "";
                    // 先到达分数者胜出
                    this.arriveScore();
                } else {
                    // 更新对方分数
                    if (this.oneselfNum == 1) {
                        // 更新对方分数
                        this.lameDeskmateModel.otherScore++;
                        this["playerScoreLab" + 2].text = this.lameDeskmateModel.otherScore + "";
                        // 先到达分数者胜出
                        this.arriveScore();
                        // 攻击
                        this.playerHitOther(2);
                        return;
                    }
                    // 更新对方分数
                    this.lameDeskmateModel.otherScore++;
                    this["playerScoreLab" + 1].text = this.lameDeskmateModel.otherScore + "";
                    // 先到达分数者胜出
                    this.arriveScore();
                    // 攻击
                    this.playerHitOther(1);
                }
                break;
            case LameDeskmateModel.EVENT_MAKEFUN:
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 嘲讽并更新对方分数
                    this.makeFunOtherPlayer();
                } else {
                    // 更新自己分数
                    this.lameDeskmateModel.myScore -= 2;
                    if (this.lameDeskmateModel.myScore <= 0) {
                        this.lameDeskmateModel.myScore = 0;
                    }
                    this["playerScoreLab" + this.oneselfNum].text = this.lameDeskmateModel.myScore + "";
                    //  被嘲讽飘字
                    this.playerMakeFun(2);

                    if (this.oneselfNum == 1) {
                        // 被得瑟，右侧播放一次被得瑟动作
                        this.rightStudentAmiPlay(LameDeskmateModel.STATUS_MAKEFUN);
                    } else {
                        // 被得瑟，左侧播放一次被得瑟动作
                        this.leftStudentAmiPlay(LameDeskmateModel.STATUS_MAKEFUN);
                    }
                }
                break;
            case LameDeskmateModel.EVENT_BE_FOUND:
                // 清掉按钮隐藏延迟
                egret.clearTimeout(this.clearTimeoutHideBtnsId);
                // 清掉 笑状态的延迟
                egret.clearTimeout(this.clearTimeoutDaodanBtnYanChi);
                // 笑播放停止状态
                this.xiaoIsPlay = false;
                // 播放老师们发现后怒的动画
                this.teachersNuAmiFun();
                // 判断是否是自己发出的数据
                if (data.userId == DataCenter.instance.user.id) {
                    // 播动画
                    if (this.oneselfNum == 1) {
                        this.leftStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                    } else {
                        this.rightStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                    }
                } else {
                    // 对方被发现
                    this.otherBeFound = true;
                    // 捣蛋按钮禁用,嘲讽按钮可用
                    if (!this.oneselfBeFound) {
                        this.btnsVisibleOrTouchEnabled(false, true);
                        // 播对方被发现动画
                        if (this.oneselfNum == 1) {
                            this.rightStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                        } else {
                            this.leftStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                        }
                    } else {
                        this.rightStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                        this.leftStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                    }
                }
                break;
            case LameDeskmateSantaModel.STATUS_TEACHER_YUJING:
                // 老师预警
                this.teacherYujingFun();
                break;
            case LameDeskmateSantaModel.STATUS_HEADMASTER_YUJING:
                // 校长预警
                this.headMasterYujingFun();
                break;
        }
    }
    // 老师预警
    private teacherYujingFun(): void {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutHit();
            }
        }
        // 当前播放的是老师
        this.teachersAniIndex = 1;
        // 获取老师mc
        this.teachersAniMc = this.teacherDaijiMc;
        // 老师预警
        this.teachersStatusAmiPlay(this.teachersAniIndex, LameDeskmateSantaModel.STATUS_TEACHER_YUJING, true);
    }
    // 校长预警
    private headMasterYujingFun(): void {
        // 预警动画播放中
        this.yujingIsPlay = true;
        // ai 部分
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
                this.gameRobotAi.santaComeoutHit();
            }
        }
        // 当前播放的是校长
        this.teachersAniIndex = 2;
        // 校长预警
        this.teachersStatusAmiPlay(this.teachersAniIndex, LameDeskmateSantaModel.STATUS_HEADMASTER_YUJING, true);
    }
    // 怒动画
    public teachersNuAmiFun(): void {
        // 骂的声音
        this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.play("christmas_santaCurse_mp3");
        // 怒的动画
        if (this.teachersAniIndex == 1) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, LameDeskmateSantaModel.STATUS_TEACHER_NU, true);
        } else if (this.teachersAniIndex == 2) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, LameDeskmateSantaModel.STATUS_HEADMASTER_NU, true);
        }
    }
    // 怼他，得瑟按钮禁用或开启
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
        this.lameDeskmateModel.otherScore -= 2;
        if (this.lameDeskmateModel.otherScore <= 0) {
            this.lameDeskmateModel.otherScore = 0;
        }
        if (this.oneselfNum == 1) {
            this.playerScoreLab2.text = this.lameDeskmateModel.otherScore + "";
            // 得瑟动作
            this.leftStudentAmiPlay(LameDeskmateModel.STATUS_MAKEFUN);
        } else {
            this.playerScoreLab1.text = this.lameDeskmateModel.otherScore + "";
            // 得瑟动作
            this.rightStudentAmiPlay(LameDeskmateModel.STATUS_MAKEFUN);
        }
    }

    // 游戏结算页信息状态  1:win/lose   2:左右
    private resultViewState(): void {
        let data = DataCenter.instance.room.gameResult;

        // 我的分数
        this.myScoreLab.text = this.lameDeskmateModel.myScore + "";

        // 加载头像
        this.winnerAvatarGroup.addChild(this.resultHeadImage);
        this.resultPlayerAvatar1.addChild(this.resultMySmallHeadImage);
        this.resultPlayerAvatar2.addChild(this.resultOtherSmallHeadImage);
        // 我嬴
        if (data.winUserId == DataCenter.instance.user.id) {
            this.winStateImg.visible = true;// 显示胜利状态
            this.winOrLoseImg.source = "resultTitle2_png";// 显示黄色样式
            this.winOrLoseLab.text = "胜利";
            this.myResultLab.text = "1";
            this.otherResultLab.text = "0";
        } else {
            this.winStateImg.visible = false;// 隐藏胜利状态
            this.winOrLoseImg.source = "resultTitle1_png";// 显示灰色样式
            this.winOrLoseLab.text = "失败";
            this.myResultLab.text = "0";
            this.otherResultLab.text = "1";
        }
        // 名字
        this.resultPlayerNameLab1.text = DataCenter.instance.user.name;
        this.resultPlayerNameLab2.text = DataCenter.instance.room.player.name;
        // 性别
        this.resultSexImg1.source = GameCenterGetSexIcon.getSexIconSource(DataCenter.instance.user.sex);
        this.resultSexImg2.source = GameCenterGetSexIcon.getSexIconSource(DataCenter.instance.room.player.sex);
    }

    // 时间内先达到分数者获胜
    public arriveScore(): void {
        // 显示speed 怒火 特效
        if (this.lameDeskmateModel.myScore >= this.lameDeskmateModel.otherScore) {
            // 速度
            this.speedMc.visible = true;
            this.speedMc.gotoAndPlay(1, -1);

            // 怒火
            if (this.oneselfNum == 1) {
                this.fireMc.x = 100;
            } else {
                this.fireMc.x = this.effectGroup1.width - 100;
            }
            this.fireMc.visible = true;
            this.fireMc.gotoAndPlay(1, -1);
        } else {
            // 速度
            this.speedMc.visible = false;
            this.speedMc.stop();
            // 怒火
            if (this.oneselfNum == 1) {
                this.fireMc.x = this.effectGroup1.width - 100;
            } else {
                this.fireMc.x = 100;
            }
            this.fireMc.visible = true;
            this.fireMc.gotoAndPlay(1, -1);
        }

        if (this.lameDeskmateModel.myScore >= LameDeskmateModel.resultScore) {
            //自己嬴
            this.sendResult(3);
            return;
        }
        if (this.lameDeskmateModel.otherScore >= LameDeskmateModel.resultScore) {
            //对方嬴
            this.sendResult(1);
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
    private waitTime: number = 0;// 内部结算等待时间
    private resultPageFun = () => {
        // 弹出结果统计页
        this.resultGroup.visible = true;
        this.resultGroup.scaleX = this.resultGroup.scaleY = 0.3;
        // 内部结算等待时间
        this.waitTime = App.IsXiaoMi ? 200 : 1200;
        egret.Tween.get(this.resultGroup)
            .to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.bounceOut)
            .wait(this.waitTime)
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
        // 关闭机器人模式
        if (DataCenter.instance.room.IsAI) {
            if (this.gameRobotAi) {
                this.gameRobotAi.clearData();
            }
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
        egret.Tween.removeTweens(this.headmasterShadowImg);
        // 音效
        this.lameDeskmateEffect && this.lameDeskmateEffect.setVolume(0);
        this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.setVolume(0);
        this.lameDeskmateEffect = null;
        this.lameDeskmateCommonEffect = null;
    }

    public dispose(): void {
        super.dispose();
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
        egret.Tween.removeTweens(this.headmasterShadowImg);
        // 内部结算页
        egret.Tween.removeTweens(this.resultGroup);
        // 清楚随机播放santa动画
        egret.clearInterval(this.intervalIdKey);
        // 清楚对象池
        ObjectPool.clearClass("LameDeskmateScore");
        // 结算页
        this.resultGroup.visible = false;
        // 自己被发现
        this.oneselfBeFound = false;
        // 对方被发现
        this.otherBeFound = false;
        // 音效
        this.lameDeskmateEffect && this.lameDeskmateEffect.setVolume(0);
        this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.setVolume(0);
        this.lameDeskmateEffect = null;
        this.lameDeskmateCommonEffect = null;
    }

    // 头像
    private playerAvatarGroup1Handler() {
        // 点击
        this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.play("mouseClickSound_mp3");

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
        this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.play("mouseClickSound_mp3");

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

    // 倒计时间刷新
    public ontimerUpdate() {
        if (this.gameLastTime > 0) {
            this.gameLastTime--;
            this.timesLab.text = this.gameLastTime + "";
            // 倒计时音效
            if (this.gameLastTime < 4 && this.gameLastTime > 0) {
                this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.play("countDownSound_mp3");
            }
            else if (this.gameLastTime == 0) {
                this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.play("countDownSoundEnd_mp3");
            }
        } else {
            // 停止到计时
            App.TimerManager.remove(this.ontimerUpdate, this);
            //输赢结果
            this.lameDeskmateModel.myScore >= this.lameDeskmateModel.otherScore ? this.sendResult(3) : this.sendResult(1);
        }
    }

    // 发送游戏结果
    private sendResult(result: number): void {
        // 被扔雪球，被嘲笑，被发现，当前santa动画播放状态
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 清楚数据
        this.clearData();
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
        let _startX = 0;
        let _endX = 0;

        if (this.oneselfNum == 1) {
            _startX = this.youImg.x;
            _endX = this.youImg.x + 20;
        } else {
            _startX = this.youImg.x;
            _endX = this.youImg.x - 20;
        }

        let _startY = this.youImg.y;
        let _endY = this.youImg.y + 60;

        this.youImg.x = this.youImg.x;
        this.youImg.y = this.youImg.y;

        this.youImg.visible = true;
        // 执行缓动
        egret.Tween.get(this.youImg, { loop: true }, egret.Ease.sineOut)
            .to({ scaleX: 1, scaleY: 1, x: _endX, y: _endY }, 400)
            .to({ scaleX: 1, scaleY: 1, x: _startX, y: _startY }, 400)
    }

    // 上课铃
    private classStartTween(): void {

        // 播放铃声声音
        this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.play("classStart_mp3");

        this.classStartImg.visible = true;
        this.classStartImg.rotation = 0;
        // 执行缓动
        egret.Tween.get(this.classStartImg, { loop: true }, egret.Ease.sineOut)
            .to({ rotation: 15 }, 200)
            .to({ rotation: 0 }, 200)
            .to({ rotation: -15 }, 200)
            .to({ rotation: 0 }, 200)
    }

    // 手势
    private guideHandTween(): void {
        let _startX = 0;
        let _endX = 0;

        _startX = this.guideHandImg.x;
        _endX = this.guideHandImg.x - 20;

        let _startY = this.guideHandImg.y;
        let _endY = this.guideHandImg.y + 40;

        this.guideHandImg.x = this.guideHandImg.x;
        this.guideHandImg.y = this.guideHandImg.y;

        this.guideHandImg.visible = true;
        // 执行缓动
        egret.Tween.get(this.guideHandImg, { loop: true }, egret.Ease.sineOut)
            .to({ scaleX: 1, scaleY: 1, x: _endX, y: _endY }, 400)
            .to({ scaleX: 1, scaleY: 1, x: _startX, y: _startY }, 400)
    }

    //-------数字缓动动画---------
    private scoreTweenMove(scores: LameDeskmateScore): void {
        egret.Tween.get(scores).wait(80).call(() => {
            this.scoreContainerGroup.removeChild(scores);
            ObjectPool.push(scores);
        });
    }

    // 怼他 按钮事件
    private daodanBtnHandler(event: egret.TouchEvent): void {
        if (!this.gameStartBool) {
            return;
        }

        // 取消手势的缓动
        if (this.guideHandImg.visible) {
            egret.Tween.removeTweens(this.guideHandImg);
            this.guideHandImg.visible = false;
        }
        // 引导提示
        if (this.guideTipImg.visible) {
            this.guideTipImg.visible = false;
        }

        // 按钮频率
        this.daodanBtn.touchEnabled = false;
        this.daodanActionTimeout = setTimeout(() => {
            this.daodanBtn.touchEnabled = true;
            egret.clearTimeout(this.daodanActionTimeout);
        }, 80);

        // 攻击对方并获得分数
        this.playerHitOther(this.oneselfNum);

        // 被发现
        if (this.xiaoIsPlay) {
            // 清掉按钮隐藏延迟
            egret.clearTimeout(this.clearTimeoutHideBtnsId);
            // 停止笑声音
            this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.stopSound("santaSmileStatus_mp3");
            // 被发现
            this.oneselfBeFound = true;
            // 捣蛋按钮禁用,嘲讽按钮禁用
            this.btnsVisibleOrTouchEnabled(false, false);
            // 电脑人模式
            if (DataCenter.instance.room.IsAI) {
                // 笑播放完成   
                this.xiaoIsPlay = false;
                // 播放老师们发现动画
                this.teachersNuAmiFun();
                // 播放被发现动画
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
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
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateModel.EVENT_BE_FOUND, 1);
            return;
        }

        // 电脑人模式
        if (DataCenter.instance.room.IsAI) {
            // 更新自己分数
            this.lameDeskmateModel.myScore++;
            this["playerScoreLab" + this.oneselfNum].text = this.lameDeskmateModel.myScore + "";
            // 先到达分数者胜出
            this.arriveScore();
            return;
        }
        // 向服务器发送 捣蛋 消息
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateModel.EVENT_HIT, 1);

    }
    // 左侧同学攻击后扫雪
    private onStudentHitLComplete(): void {
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
        this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
    }
    // 右侧同学攻击后扫雪
    private onStudentHitRComplete(): void {
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
        this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
    }

    // 棕色驯鹿播放挨打完成之后扫雪
    public onStudentBeHitRComplete(): void {
        // 移除监听
        this.beHitRMc.removeEventListener(egret.Event.COMPLETE, this.onStudentBeHitRComplete, this);

        if (this.oneselfBeFound) {
            // 我打别人
            if (this.oneselfNum == 1) {
                // 播放被发现动画
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            } else {
                // 播放被发现动画
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            }
        } else {
            if (this.oneselfNum == 1) {
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            } else if (this.oneselfNum == 2) {
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            }
        }
    }
    // 紫色驯鹿播放挨打完成之后扫雪
    public onStudentBeHitLComplete(): void {
        // 移除监听
        this.beHitLMc.removeEventListener(egret.Event.COMPLETE, this.onStudentBeHitLComplete, this);

        if (this.oneselfBeFound) {
            // 我打别人
            if (this.oneselfNum == 1) {
                // 播放被发现动画
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            } else {
                // 播放被发现动画
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_ISSCOLDED);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            }
        } else {
            if (this.oneselfNum == 1) {
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            } else if (this.oneselfNum == 2) {
                this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
                if (this.otherBeFound) {
                    return;
                }
                this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
            }
        }
    }

    // 怼他  1：向右侧 2：向左侧
    public playerHitOther(directLorR: number): void {
        // 攻击声音
        this.lameDeskmateEffect && this.lameDeskmateEffect.play("lameDeskMate_hit" + Math.ceil(Math.random() * 2) + "_mp3");

        // 攻击动画
        if (directLorR == 1) {
            // 攻击的动作
            this.leftStudentAmiActionInit();
            this.hitLMc.visible = true;
            this.hitLMc.addEventListener(egret.Event.COMPLETE, this.onStudentHitLComplete, this);
            this.hitLMc.gotoAndPlay(1, 1);

            // 对方播放挨打动画一次
            this.rightStudentAmiActionInit();
            // effect
            this.beHitEffectRightGroup.visible = true;
            // this.beHitREffectMc.visible = true;
            // this.beHitREffectMc.gotoAndPlay(1, -1);

            this.beHitRMc.visible = true;
            this.beHitRMc.addEventListener(egret.Event.COMPLETE, this.onStudentBeHitRComplete, this);
            this.beHitRMc.gotoAndPlay(1, 1);
        } else {
            // 攻击
            this.rightStudentAmiActionInit();
            this.hitRMc.visible = true;
            this.hitRMc.addEventListener(egret.Event.COMPLETE, this.onStudentHitRComplete, this);
            this.hitRMc.gotoAndPlay(1, 1);

            // 对方播放挨打动画一次
            this.leftStudentAmiActionInit();
            // effect
            this.beHitEffectLeftGroup.visible = true;
            // this.beHitLEffectMc.visible = true;
            // this.beHitLEffectMc.gotoAndPlay(1, -1);

            this.beHitLMc.visible = true;
            this.beHitLMc.addEventListener(egret.Event.COMPLETE, this.onStudentBeHitLComplete, this);
            this.beHitLMc.gotoAndPlay(1, 1);
        }

        // 动态生成数字
        var scoreImg: LameDeskmateScore = ObjectPool.pop(LameDeskmateScore, "LameDeskmateScore");
        var colorType: number = Math.ceil(Math.random() * 3);
        // 左侧
        if (directLorR == 1) {
            scoreImg.texture = RES.getRes("scoreOne" + colorType + "_png");
            scoreImg.x = 100;
            scoreImg.y = 400;
        } else if (directLorR == 2) {
            scoreImg.texture = RES.getRes("scoreOne" + colorType + "_png");
            scoreImg.x = 440;
            scoreImg.y = 400;
        }
        scoreImg.alpha = 1;
        // 添加到容器
        this.scoreContainerGroup.addChild(scoreImg);
        // 执行缓动
        egret.Tween.get(scoreImg).to({ x: scoreImg.x, y: (scoreImg.y - 100), alpha: 0.2 }, 1000).call(this.scoreTweenMove.bind(this, scoreImg));
    }

    // 得瑟按钮事件
    private chaofengBtnHandler(event: egret.TouchEvent): void {
        if (!this.gameStartBool) {
            return;
        }

        // 取消手势的缓动
        if (this.guideHandImg.visible) {
            egret.Tween.removeTweens(this.guideHandImg);
            this.guideHandImg.visible = false;
        }
        // 引导提示
        if (this.guideTipImg.visible) {
            this.guideTipImg.visible = false;
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
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateModel.EVENT_MAKEFUN, 1);
    }

    // 嘲讽 1:嘲讽别人，2：被嘲讽
    public playerMakeFun(makeFunStatus: number): void {
        // 嘲讽声音
        this.lameDeskmateEffect && this.lameDeskmateEffect.play("lameDeskMate_makeFun_mp3");
        // 动态生成数字
        var scoreImg: LameDeskmateScore = ObjectPool.pop(LameDeskmateScore, "LameDeskmateScore");
        var colorType: number = Math.ceil(Math.random() * 3);
        // 嘲讽别人
        if (makeFunStatus == 1) {
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("scoreTwo" + colorType + "_png");
                scoreImg.x = 440;
                scoreImg.y = 370;
            } else {
                scoreImg.texture = RES.getRes("scoreTwo" + colorType + "_png");
                scoreImg.x = 100;
                scoreImg.y = 370;
            }
        } else if (makeFunStatus == 2) {
            // 被别人嘲讽
            if (this.oneselfNum == 1) {
                scoreImg.texture = RES.getRes("scoreTwo" + colorType + "_png");
                scoreImg.x = 100;
                scoreImg.y = 370;
            } else {
                scoreImg.texture = RES.getRes("scoreTwo" + colorType + "_png");
                scoreImg.x = 440;
                scoreImg.y = 370;
            }
        }
        scoreImg.alpha = 1;
        // 添加到容器
        this.scoreContainerGroup.addChild(scoreImg);
        // 执行缓动
        egret.Tween.get(scoreImg).to({ x: scoreImg.x, y: (scoreImg.y - 100), alpha: 0.2 }, 1000).call(this.scoreTweenMove.bind(this, scoreImg));
    }

    // 创建动画资源加载到舞台
    private addAllMc(): void {
        // 怒火mc 动画
        this.fireMcFactory = new egret.MovieClipDataFactory(RES.getRes("fireAni_mc_json"), RES.getRes("fireAni_tex_png"));
        this.fireMc = new egret.MovieClip(this.fireMcFactory.generateMovieClipData("fireAni"));
        this.fireMc.visible = false;
        this.effectGroup1.addChild(this.fireMc);
        this.fireMc.x = 100;
        this.fireMc.y = 68;

        // 速度mc 动画
        this.speedMcFactory = new egret.MovieClipDataFactory(RES.getRes("speedMc_mc_json"), RES.getRes("speedMc_tex_png"));
        this.speedMc = new egret.MovieClip(this.speedMcFactory.generateMovieClipData("speedMc"));
        this.speedMc.visible = false;
        this.effectGroup2.addChild(this.speedMc);
        this.speedMc.x = 320;
        this.speedMc.y = 234;

        // 被发现 effect 竖线 动画
        this.beFoundOneMcFactory = new egret.MovieClipDataFactory(RES.getRes("beFoundEffect2_mc_json"), RES.getRes("beFoundEffect2_tex_png"));
        this.beFoundOneMc = new egret.MovieClip(this.beFoundOneMcFactory.generateMovieClipData("beFoundEffect2"));
        this.effectGroup3.addChild(this.beFoundOneMc);
        this.beFoundOneMc.x = 170;
        this.beFoundOneMc.y = 460;

        // 被发现 effect 流汗 动画
        this.beFoundTwoMcFactory = new egret.MovieClipDataFactory(RES.getRes("beFoundEffect_mc_json"), RES.getRes("beFoundEffect_tex_png"));
        this.beFoundTwoMc = new egret.MovieClip(this.beFoundTwoMcFactory.generateMovieClipData("beFoundEffect"));
        this.effectGroup3.addChild(this.beFoundTwoMc);
        this.beFoundTwoMc.x = 460;
        this.beFoundTwoMc.y = 460;

        // 老师的待机预警动画 
        this.teacherDaijiFactory = new egret.MovieClipDataFactory(RES.getRes("teacherDaiji_mc_json"), RES.getRes("teacherDaiji_tex_png"));
        this.teacherDaijiMc = new egret.MovieClip(this.teacherDaijiFactory.generateMovieClipData("teacherWhite"));
        this.teacherDbGroup.addChild(this.teacherDaijiMc);
        this.teacherDaijiMc.gotoAndPlay(1, -1);
        this.teacherDaijiMc.x = 100;
        this.teacherDaijiMc.y = 130;

        // 左侧同学 攻击mc 动画
        this.hitLMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentLeftHit_mc_json"), RES.getRes("studentLeftHit_tex_png"));
        this.hitLMc = new egret.MovieClip(this.hitLMcFactory.generateMovieClipData("studentLeftHitMc"));
        this.leftStudentDbGroup.addChild(this.hitLMc);
        this.hitLMc.x = 260;
        this.hitLMc.y = 200;
        // 左侧同学 被攻击mc 动画
        this.beHitLMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentLeftBeHit_mc_json"), RES.getRes("studentLeftBeHit_tex_png"));
        this.beHitLMc = new egret.MovieClip(this.beHitLMcFactory.generateMovieClipData("studentLeftBeHit"));
        this.leftStudentDbGroup.addChild(this.beHitLMc);
        this.beHitLMc.x = 170;
        this.beHitLMc.y = 200;
        // 左侧同学 被攻击效果mc 动画
        this.beHitLEffectFactory = new egret.MovieClipDataFactory(RES.getRes("beHitEffectLeft_mc_json"), RES.getRes("beHitEffectLeft_tex_png"));
        this.beHitLEffectMc = new egret.MovieClip(this.beHitLEffectFactory.generateMovieClipData("beHitLeftEffect"));
        // this.effectGroup3.addChild(this.beHitLEffectMc);
        this.beHitLEffectMc.x = 170;
        this.beHitLEffectMc.y = 600;
        // 左侧同学 嘲讽mc 动画
        this.makeFunLMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentLeftMakeFun_mc_json"), RES.getRes("studentLeftMakeFun_tex_png"));
        this.makeFunLMc = new egret.MovieClip(this.makeFunLMcFactory.generateMovieClipData("studentLeftMakeFun"));
        this.leftStudentDbGroup.addChild(this.makeFunLMc);
        this.makeFunLMc.x = 170;
        this.makeFunLMc.y = 200;

        // 右侧同学攻击mc 动画
        this.hitRMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentRightHit_mc_json"), RES.getRes("studentRightHit_tex_png"));
        this.hitRMc = new egret.MovieClip(this.hitRMcFactory.generateMovieClipData("studentRightHit"));
        this.rightStudentDbGroup.addChild(this.hitRMc);
        this.hitRMc.x = 80;
        this.hitRMc.y = 220;
        // 右侧同学 被攻击mc 动画
        this.beHitRMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentRightBeHit_mc_json"), RES.getRes("studentRightBeHit_tex_png"));
        this.beHitRMc = new egret.MovieClip(this.beHitRMcFactory.generateMovieClipData("studentRightBeHit"));
        this.rightStudentDbGroup.addChild(this.beHitRMc);
        this.beHitRMc.x = 190;
        this.beHitRMc.y = 210;
        // 右侧同学 被攻击效果mc 动画
        this.beHitREffectFactory = new egret.MovieClipDataFactory(RES.getRes("beHitEffectRight_mc_json"), RES.getRes("beHitEffectRight_tex_png"));
        this.beHitREffectMc = new egret.MovieClip(this.beHitREffectFactory.generateMovieClipData("beHitRightEffect"));
        // this.effectGroup3.addChild(this.beHitREffectMc);
        this.beHitREffectMc.x = 460;
        this.beHitREffectMc.y = 600;
        // 右侧同学 嘲讽mc 动画
        this.makeFunRMcFactory = new egret.MovieClipDataFactory(RES.getRes("studentRightMakeFun_mc_json"), RES.getRes("studentRightMakeFun_tex_png"));
        this.makeFunRMc = new egret.MovieClip(this.makeFunRMcFactory.generateMovieClipData("studentRightMakeFun"));
        this.rightStudentDbGroup.addChild(this.makeFunRMc);
        this.makeFunRMc.x = 170;
        this.makeFunRMc.y = 200;

        // 老师，校长初始化状态
        this.teachersPlayStatusYuJingFun();

        // 左侧同学初始化状态
        this.leftStudentAmiActionInit();
        this.leftStudentDaijiImg.visible = true;

        // 右侧同学初始化状态
        this.rightStudentAmiActionInit();
        this.rightStudentDaijiImg.visible = true;
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
        this.teachersStatusAmiPlay(1, LameDeskmateSantaModel.STATUS_TEACHER_YUJING, false);
        this.teachersStatusAmiPlay(2, LameDeskmateSantaModel.STATUS_HEADMASTER_YUJING, false);
        // 左侧同学
        this.leftStudentAmiActionInit();
        this.leftStudentDaijiImg.visible = true;
        // 右侧同学
        this.rightStudentAmiActionInit();
        this.rightStudentDaijiImg.visible = true;
    }

    // 校长的预警
    public headmasterYujingTween(): void {
        let self = this;
        // 预警动画播放中
        this.yujingIsPlay = true;
        // 坐标
        let _startX = this.headmasterShadowImg.x = -160;
        let _endX = this.headmasterShadowImg.x + 80;
        this.headmasterShadowImg.x = this.headmasterShadowImg.x;
        self.headmasterShadowImg.visible = true;

        // tween次数
        let times = 3;

        // 初始人影状态
        function initFun() {
            times--;
            egret.Tween.get(self.headmasterShadowImg, egret.Ease.sineOut)
                .to({ x: _endX, y: self.headmasterShadowImg.y }, 500 + 10 * times).call(twoFun);
        }
        function twoFun() {
            egret.Tween.get(self.headmasterShadowImg, egret.Ease.sineOut)
                .to({ x: _startX, y: self.headmasterShadowImg.y }, 500 + 30 * times).call(endFun);
        }

        function endFun() {
            if (times > 0) {
                initFun();
                return;
            }
            // 隐藏人影
            self.headmasterShadowImg.visible = false;
            // 预警动画播放中
            self.yujingIsPlay = false;
            // 校长播放笑
            self.santaPlayStatusXiaoFun();
        }
        // 开启
        initFun();
    }
    // 校长笑 true：出现   false:隐藏
    public headmasterXiaoTween(bool: boolean): void {
        let self = this;
        self.headmasterXiao.visible = true;

        if (bool) {
            // 坐标
            let _endX = 0;
            this.headmasterXiao.x = -110;

            // 校长笑
            egret.Tween.get(self.headmasterXiao, egret.Ease.sineOut)
                .to({ x: _endX, y: self.headmasterXiao.y }, 400);
        } else {
            // 坐标
            let _endX = -110;
            this.headmasterXiao.x = 0;
            // 校长笑
            egret.Tween.get(self.headmasterXiao, egret.Ease.sineOut)
                .to({ x: _endX, y: self.headmasterXiao.y }, 200).call(() => {
                    self.headmasterXiao.visible = false;
                });
        }
    }
    // 校长 怒 true：出现   false:隐藏
    public headmasterNuTween(bool: boolean): void {
        let self = this;
        self.headmasterNu.visible = true;

        if (bool) {
            // 坐标 校长怒
            this.headmasterNu.x = 0;
        } else {
            // 坐标
            let _endX = -215;
            this.headmasterNu.x = 0;
            // 校长怒
            egret.Tween.get(self.headmasterNu, egret.Ease.sineOut)
                .to({ x: _endX, y: self.headmasterNu.y }, 200).call(() => {
                    self.headmasterNu.visible = false;
                });
        }
    }

    //---预警，笑，怒 动画---
    public teachersStatusAmiPlay(teachersAniIndex: number, actionName: string, playOrStop: boolean): void {
        if (playOrStop) {
            if (teachersAniIndex == 1) {
                if (actionName == LameDeskmateSantaModel.STATUS_TEACHER_YUJING) {
                    // 老师播放预警
                    this.teacherDaijiMc.visible = true;
                    this.teacherDaijiMc.gotoAndPlay(1, -1);
                    // 动画播放监听 设置定时器
                    this.teacherActionTime = 2;
                    App.TimerManager.doTimer(1000, 0, this.onYuJingComplete, this);
                } else if (actionName == LameDeskmateSantaModel.STATUS_TEACHER_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(() => { if (this.xiaoIsPlay && !this.nuIsPlay) { this.btnsVisibleOrTouchEnabled(false, false) } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(() => { this.xiaoIsPlay = true; }, this, 400);

                    // 老师预警隐藏
                    this.teacherDaijiMc.stop();
                    this.teacherDaijiMc.visible = false;
                    // 设置老师的状态
                    this.teacherXiaoNuImg.visible = true;
                    this.teacherXiaoNuImg.source = "teacher2_png";

                    // 动画播放监听 设置定时器
                    this.teacherActionTime = 2;
                    App.TimerManager.doTimer(1000, 0, this.onXiaoComplete, this);
                } else if (actionName == LameDeskmateSantaModel.STATUS_TEACHER_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;

                    // 设置老师的状态
                    this.teacherXiaoNuImg.visible = true;
                    this.teacherXiaoNuImg.source = "teacher3_png";
                    // 站起来
                    this.beFoundStandUpImg.visible = true;

                    // 动画播放监听 设置定时器
                    this.teacherActionTime = 2;
                    App.TimerManager.doTimer(1000, 0, this.onNuComplete, this);
                }
            } else if (teachersAniIndex == 2) {
                if (actionName == LameDeskmateSantaModel.STATUS_HEADMASTER_YUJING) {
                    this.headmasterYujingTween();
                    return;
                } else if (actionName == LameDeskmateSantaModel.STATUS_HEADMASTER_XIAO) {
                    // 延时隐藏按钮
                    this.clearTimeoutHideBtnsId = egret.setTimeout(() => { if (this.xiaoIsPlay && !this.nuIsPlay) { this.btnsVisibleOrTouchEnabled(false, false) } }, this, 1000);
                    // 笑动画播放中
                    this.clearTimeoutDaodanBtnYanChi = egret.setTimeout(() => { this.xiaoIsPlay = true; }, this, 400);

                    // 预警动画隐藏
                    this.headmasterShadowImg.visible = false;
                    egret.Tween.removeTweens(this.headmasterShadowImg);
                    // 显示校长动画，并播放对应动画
                    this.headmasterXiaoTween(true);

                    // 动画播放监听 设置定时器
                    this.teacherActionTime = 2;
                    App.TimerManager.doTimer(1000, 0, this.onXiaoComplete, this);

                } else if (actionName == LameDeskmateSantaModel.STATUS_HEADMASTER_NU) {
                    // 怒动画播放中
                    this.nuIsPlay = true;

                    // 预警隐藏
                    this.headmasterXiao.visible = false;
                    egret.Tween.removeTweens(this.headmasterXiao);
                    // 设置的状态
                    this.headmasterNuTween(true);
                    // 站起来
                    this.beFoundStandUpImg.visible = true;

                    // 动画播放监听 设置定时器
                    this.teacherActionTime = 2;
                    App.TimerManager.doTimer(1000, 0, this.onNuComplete, this);
                }
            }
        } else {
            if (teachersAniIndex == 1) {
                // 老师停止在预警动画
                this.teacherXiaoNuImg.visible = false;
                // 老师播放待机预警
                this.teacherDaijiMc.visible = true;
                this.teacherDaijiMc.gotoAndPlay(1, -1);
            } else if (teachersAniIndex == 2) {
                // 预警
                this.headmasterShadowImg.visible = false;
                // 笑
                if (this.headmasterXiao.visible) {
                    this.headmasterXiaoTween(false);
                }
                // 怒
                if (this.headmasterNu.visible) {
                    this.headmasterNuTween(false);
                }
            }
        }
    }
    private onYuJingComplete(): void {
        if (this.teacherActionTime > 0) {
            this.teacherActionTime--;
            return;
        }
        // 停止到计时
        App.TimerManager.remove(this.onYuJingComplete, this);
        // 预警播放完成
        this.yujingIsPlay = false;
        // 随机播放笑的动画
        this.santaPlayStatusXiaoFun();
    }
    private onXiaoComplete(): void {
        if (this.nuIsPlay) {
            return;
        }
        if (this.teacherActionTime > 0) {
            this.teacherActionTime--;
            return;
        }
        // 停止到计时
        App.TimerManager.remove(this.onXiaoComplete, this);
        // 预警播放完成
        this.xiaoIsPlay = false;
        // 回到预警状态
        this.teachersPlayStatusYuJingFun();
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
        // 捣蛋按钮可用,嘲讽按钮禁用
        this.btnsVisibleOrTouchEnabled(true, false);
        // 小米平台下
        if (App.IsXiaoMi) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateSantaModel.TEACHERS_ACTION_END, 2);
        }
    }
    private onNuComplete(): void {
        if (this.teacherActionTime > 0) {
            this.teacherActionTime--;
            return;
        }
        // 停止到计时
        App.TimerManager.remove(this.onNuComplete, this);
        // 回到预警状态
        this.teachersPlayStatusYuJingFun();
        // 预警播放完成
        this.nuIsPlay = false;
        // 老师笑
        this.xiaoIsPlay = false;
        // 自己被发现
        this.oneselfBeFound = false;
        // 对方被发现
        this.otherBeFound = false;
        // 站起来
        this.beFoundStandUpImg.visible = false;
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
        this.leftStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
        this.rightStudentAmiPlay(LameDeskmateModel.STATUS_DAIJI);
        // 恢复按钮事件
        this.btnsVisibleOrTouchEnabled(true, false);
        // 小米平台下
        if (App.IsXiaoMi) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateSantaModel.TEACHERS_ACTION_END, 2);
        }
    }

    // 老师，校长暂停到预警状态
    private teachersPlayStatusYuJingFun(): void {
        this.teachersStatusAmiPlay(1, LameDeskmateSantaModel.STATUS_TEACHER_YUJING, false);
        this.teachersStatusAmiPlay(2, LameDeskmateSantaModel.STATUS_HEADMASTER_YUJING, false);
    }
    // 播放笑的动画
    private santaPlayStatusXiaoFun(): void {
        // 笑声音
        this.lameDeskmateCommonEffect && this.lameDeskmateCommonEffect.play("santaSmileStatus_mp3");
        // 播放笑动画
        if (this.teachersAniIndex == 1) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, LameDeskmateSantaModel.STATUS_TEACHER_XIAO, true);
        } else if (this.teachersAniIndex == 2) {
            this.teachersStatusAmiPlay(this.teachersAniIndex, LameDeskmateSantaModel.STATUS_HEADMASTER_XIAO, true);
        }
        // 小米平台下通知后端AI
        if (App.IsXiaoMi) {
            // 发送到服务器
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateSantaModel.TEACHERS_COMEOUT, 2);
        }
    }

    // 左侧同学状态初始化
    public leftStudentAmiActionInit(): void {
        // 待机状态
        this.leftStudentDaijiImg.visible = false;
        // 被发现状态
        this.leftStudentBeFoundImg.visible = false;
        // 竖线effect
        this.beFoundOneMc.stop();
        this.beFoundOneMc.visible = false;
        // 攻击Mc
        this.hitLMc.visible = false;
        this.hitLMc.stop();
        // 被攻击Mc
        this.beHitLMc.visible = false;
        this.beHitLMc.stop();
        // 被攻击effect
        this.beHitEffectLeftGroup.visible = false;
        // this.beHitLEffectMc.visible = false;
        // this.beHitLEffectMc.stop();
        // 嘲讽Mc
        this.makeFunLMc.visible = false;
        this.makeFunLMc.stop();
        // 没心态了吧
        this.chaofengImg.visible = false;
    }
    //---左侧学生动画---
    public leftStudentAmiPlay(actionName: string): void {
        this.leftStudentAmiActionInit();
        switch (actionName) {
            case LameDeskmateModel.STATUS_DAIJI:
                this.leftStudentDaijiImg.visible = true;
                break;
            case LameDeskmateModel.STATUS_ISSCOLDED:
                this.leftStudentBeFoundImg.visible = true;
                this.beFoundOneMc.visible = true;
                this.beFoundOneMc.gotoAndPlay(1, -1);
                break;
            case LameDeskmateModel.STATUS_MAKEFUN:
                // this.chaofengImg.x = 150;
                // this.chaofengImg.visible = true;
                this.makeFunLMc.visible = true;
                this.makeFunLMc.gotoAndPlay(1, 1);
                break;
            case LameDeskmateModel.EVENT_HIT:
                this.hitLMc.visible = true;
                this.hitLMc.gotoAndPlay(1, 1);
                break;
            case LameDeskmateModel.EVENT_BEHIT:
                this.beHitLMc.visible = true;
                this.beHitLMc.gotoAndPlay(1, 1);
                this.beHitEffectLeftGroup.visible = true;
                // this.beHitLEffectMc.visible = true;
                // this.beHitLEffectMc.gotoAndPlay(1, 1);
                break;
        }
    }

    // 右侧同学状态初始化
    public rightStudentAmiActionInit(): void {
        // 待机状态
        this.rightStudentDaijiImg.visible = false;
        // 被发现状态
        this.rightStudentBeFoundImg.visible = false;
        // 流汗
        this.beFoundTwoMc.stop();
        this.beFoundTwoMc.visible = false;
        // 攻击Mc
        this.hitRMc.visible = false;
        this.hitRMc.stop();
        // 被攻击Mc
        this.beHitRMc.visible = false;
        this.beHitRMc.stop();
        // 被攻击effect
        this.beHitEffectRightGroup.visible = false;
        // this.beHitREffectMc.visible = false;
        // this.beHitREffectMc.stop();
        // 嘲讽Mc
        this.makeFunRMc.visible = false;
        this.makeFunRMc.stop();
        // 没心态了吧
        this.chaofengImg.visible = false;
    }
    //---右侧学生动画---
    public rightStudentAmiPlay(actionName: string): void {
        this.rightStudentAmiActionInit();
        switch (actionName) {
            case LameDeskmateModel.STATUS_DAIJI:
                this.rightStudentDaijiImg.visible = true;
                break;
            case LameDeskmateModel.STATUS_ISSCOLDED:
                this.rightStudentBeFoundImg.visible = true;
                this.beFoundTwoMc.visible = true;
                this.beFoundTwoMc.gotoAndPlay(1, -1);
                break;
            case LameDeskmateModel.STATUS_MAKEFUN:
                // this.chaofengImg.x = App.GameWidth - 150;
                // this.chaofengImg.visible = true;
                this.makeFunRMc.visible = true;
                this.makeFunRMc.gotoAndPlay(1, 1);
                break;
            case LameDeskmateModel.EVENT_HIT:
                this.hitRMc.visible = true;
                this.hitRMc.gotoAndPlay(1, 1);
                break;
            case LameDeskmateModel.EVENT_BEHIT:
                this.beHitRMc.visible = true;
                this.beHitRMc.gotoAndPlay(1, 1);
                this.beHitEffectRightGroup.visible = true;
                // this.beHitREffectMc.visible = true;
                // this.beHitREffectMc.gotoAndPlay(1, 1);
                break;
        }
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
        if (this.LameDeskmateSantaModel.checkActions[this.currAmiIndex] == LameDeskmateSantaModel.TEACHERS_ACTION_STATUS1) {
            DataCenter.instance.room.IsAI == true ? this.teacherYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateSantaModel.STATUS_TEACHER_YUJING, 1);
        } else if (this.LameDeskmateSantaModel.checkActions[this.currAmiIndex] == LameDeskmateSantaModel.TEACHERS_ACTION_STATUS2) {
            DataCenter.instance.room.IsAI == true ? this.headMasterYujingFun() : App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, LameDeskmateSantaModel.STATUS_HEADMASTER_YUJING, 1);
        }
        // 一定时间间隔后播放下一个
        this.currAmiIndex++;
    }
}