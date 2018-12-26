// TypeScript file
class GameResultView extends StateEui {

    //----对手退出，认输面板----
    public playerLeaveView: eui.Group;
    public gameResultStateImg: eui.Image;// 游戏状态

    public resultInfoView: eui.Group;
    public lb_persentage: eui.Label;
    public bg_result1: eui.Image;
    public bg_result2: eui.Image;
    public head_1: eui.Image;
    public head_2: eui.Image;
    public img_sex1: eui.Image;
    public img_sex2: eui.Image;
    public img_coin: eui.Image;
    public img_persentage: eui.Image;
    public lb_player_1: eui.Label;
    public lb_player_2: eui.Label;
    public lb_coin: eui.Label;
    public btn_otherGame: eui.Button;
    public mask_1: egret.Rectangle;
    public mask_2: egret.Rectangle;
    public gp_1: eui.Group;
    public gp_particle: eui.Group;//粒子效果
    public gp_coin: eui.Group;//

    public goldImg: eui.Image;// 金币位置

    public gp_people1: eui.Group;
    public gp_people2: eui.Group;
    private roleAvatar1: RoleAvatar;
    private roleAvatar2: RoleAvatar;
    private num_time: number = 5;

    private particleFlowers: particle.ParticleSystem;// 雪花粒子

    private particlesArr: any[] = [];// 存放撒花，撒雪的粒子效果

    //胜利 失败
    public dbresult1: DBArmature;//
    public dbresult2: DBArmature;//
    // 金币掉落效果
    public dbGoldDrop: DBArmature;

    public InviteData: any;//临时存放接受数据Data

    private gameOverResultData: any;// 游戏结算结果
    private static gameInnerResult: boolean = false;// 是否有游戏内部结算
    private gameCallBackFun: Function = null;// 回调函数
    private static gameOpenTimes: number = 0;// 打开次数

    // 游戏中退出的玩家Id
    public static playerExitGameId: string = null;

    public constructor() {
        super(GameResultViewSkin);
    }

    public init(): void {
        super.init();
        // 其它游戏
        this.btn_otherGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOtherGame, this);
        this.mask_1 = new egret.Rectangle(0, 0, 57, 18); //115
        this.mask_2 = new egret.Rectangle(0, 0, 640, 650); //115

        this.addAllDb();
    }

    public show(callBackFun: Function = null): void {
        super.show();
        // 是否有游戏内部结算结果
        this.gameCallBackFun = callBackFun || null;

        //战斗结果
        this.gameOverResultData = DataCenter.instance.room.gameResult;

        this.gameOverResultData.dayGetMoney = 100;
        this.gameOverResultData.addMoney = 100;

        // 对方退出
        if (this.gameOverResultData.userExitFlag == 1 && this.gameOverResultData.winUserId == DataCenter.instance.user.id) {
            // 离开玩家的Id
            GameResultView.playerExitGameId = DataCenter.instance.room.player.id;
            // 提示离开/认输 状态
            this.gameResultStateImgFun(1);
        } else if (this.gameOverResultData.userExitFlag == 1 && this.gameOverResultData.winUserId == DataCenter.instance.room.player.id) {
            // 自己退出 进入聊天窗口
            Game.getInstance().leaveGame();
            this.close();
        } else {
            // 是否有内部结算
            if (!this.gameCallBackFun) {
                App.googleAd && App.googleAd.show();
                // 正常游戏结算
                this.resultInfoFun();
            } else {
                // 抛出事件
                this.gameCallBackFun();
                this.close();
            }
        }
    }

    // 状态
    private gameResultStateImgFun(stateIndex: number) {
        if (!GameResultView.gameInnerResult) {
            switch (stateIndex) {
                case 1:
                    this.gameResultStateImg.source = "bg_result_playerLeave_png";
                    break;
                case 2:
                    this.gameResultStateImg.source = "bg_result_You_Giveup_png";
                    break;
                case 3:
                    this.gameResultStateImg.source = "bg_result_Other_Giveup_png";
                    break;
            }

            // 弹出状态面板
            let self = this;
            self.playerLeaveView.visible = true;
            self.playerLeaveView.scaleX = self.playerLeaveView.scaleY = 0.3;
            egret.Tween.get(self.playerLeaveView)
                .to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.bounceOut)
                .wait(1600)
                .to({ scaleX: 0, scaleY: 0, visible: false }, 200, egret.Ease.bounceOut)
                .call(() => {
                    // 无内部游戏结算
                    if (!self.gameCallBackFun) {
                        // 面板状态切换
                        self.playerLeaveView.visible = false;
                        // 结算页结算
                        self.resultInfoFun();
                    } else {
                        // 抛出事件
                        this.gameCallBackFun();
                        GameResultView.gameInnerResult = true;
                        self.close();
                    }
                })
        } else {
            GameResultView.gameInnerResult = false;
            // 面板状态切换
            this.playerLeaveView.visible = false;
            // 结算页结算
            this.resultInfoFun();
        }
    }

    // 结算页信息
    private resultInfoFun() {
        if (App.IsFaceBook) {
            FaceBookPlatform.InterstitialAd();
        }
        // 显示结算面板
        this.resultInfoView.visible = true;

        //我的数据
        var myUserData = DataCenter.instance.user;
        //敌方数据
        var otherUserData = DataCenter.instance.room.player;
        //配置数据
        var systemConfig = RES.getRes("system_json");

        this.lb_player_1.text = myUserData.name;

        this.lb_player_2.text = otherUserData.name;
        //自己性别判断
        this.img_sex1.source = GameCenterGetSexIcon.getSexIconSource(myUserData.sex);
        //他人性别判断
        this.img_sex2.source = GameCenterGetSexIcon.getSexIconSource(otherUserData.sex);

        //输赢结果显示
        if (this.gameOverResultData.winUserId == myUserData.id) {
            //赢了
            this.bg_result1.source = "bg_result_win_png";
            this.bg_result2.source = "bg_result_Lose_png";
            this.onParticleEffect(this.gp_particle.width / 2, 398, "hua");
            this.onParticleEffect(this.gp_particle.width / 2, 48, "falisnow");
        } else {
            //输了
            this.bg_result1.source = "bg_result_Lose_png";
            this.bg_result2.source = "bg_result_win_png";
            this.onParticleEffect(this.gp_particle.width / 2, 48, "hua");
            this.onParticleEffect(this.gp_particle.width / 2, 398, "falisnow");
        }

        if (this.gameOverResultData.dayGetMoney < systemConfig.dayMaxMoney) {
            this.mask_1.width = 116 * Math.min(1, (this.gameOverResultData.dayGetMoney / systemConfig.dayMaxMoney));
            this.img_coin.source = "bg_result_TodayGetGold_png";
        }
        else {
            this.mask_1.width = 116;
            this.img_coin.source = "img_max_coin_png";
        }

        this.lb_persentage.text = "" + this.gameOverResultData.dayGetMoney + "/" + systemConfig.dayMaxMoney;

        this.mask_1.x = 0;
        this.mask_1.y = -2;
        this.img_persentage.mask = this.mask_1;

        this.gp_particle.mask = this.mask_2;

        if (this.gameOverResultData.addMoney > 0) {
            this.lb_coin.text = "+" + this.gameOverResultData.addMoney.toString();
        } else if (this.gameOverResultData.addMoney == 0) {
            this.lb_coin.text = "";
        }
        else {
            this.lb_coin.text = this.gameOverResultData.addMoney.toString();
        }

        // 对方已经离开结算页
        if (GameResultView.playerExitGameId != null && GameResultView.playerExitGameId == otherUserData.id) {
            GameResultView.playerExitGameId = null;
        }

        this.addPerson();
    }

    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
        // 收其它页面操作
        App.MessageCenter.addListener(EventMessage.gameResultLeave, this.onGameResultLeave, this);
        // 监听形象更换
        App.MessageCenter.addListener(EventMessage.ChangeAvatar, this.onChangeAvatarFun, this);
    }

    // 形象更新
    private onChangeAvatarFun() {
        this.roleAvatar1 = this.createAvatar(this.gp_people1, true);
        var myUserData = DataCenter.instance.user;
        if (this.gameOverResultData.winUserId == myUserData.id) {
            this.roleAvatar1.armature.play("win");
        } else {
            this.roleAvatar1.armature.play("Loser2");
        }
    }

    public dispose(): void {
        super.dispose();
        // 
        this.particlesArr.splice(0);

        this.onClear();
        this.gp_particle.removeChildren();
        App.SoundManager.stopEffect("win_mp3");
        App.SoundManager.stopEffect("lose_mp3");
        App.SoundManager.restoreVolumeBg();
    }

    private timer() {
        this.num_time--;
        if (this.num_time == 0) {
            App.TimerManager.remove(this.timer, this);
            this.onOtherGame();
            return;
        }
        // this.btn_otherGame["img_time"].source = "otherGame" + this.num_time + "_png";
    }

    // 收到其它页面消息
    private onGameResultLeave(): void {
        this.onOtherGame();
    }

    // 创建动画资源加载到舞台
    private addAllDb(): void {
        // 
        this.dbresult1 = AssetManager.getQuickDBArmature("winloser");
        this.dbresult1.y = 570;
        this.gp_1.addChild(this.dbresult1);
        this.dbresult1.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayResultEnd, this);

        this.dbresult2 = AssetManager.getQuickDBArmature("winloser");
        this.dbresult2.y = 230;
        this.gp_1.addChild(this.dbresult2);

        // 金币掉落效果
        // this.dbGoldDrop = AssetManager.getQuickDBArmature("goldDB");
        // this.gp_coin.addChild(this.dbGoldDrop);
        // this.dbGoldDrop.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onPlayGoldDropEnd, this);
        // this.dbGoldDrop.x = 182;
        // this.dbGoldDrop.y = 512;

        this.dbresult1.visible = false;
        this.dbresult2.visible = false;
        // this.dbGoldDrop.visible = false;
    }

    // 隐藏金币
    // private onPlayGoldDropEnd() {
    //     this.dbGoldDrop.visible = false;
    // }

    private onPlayResultEnd() {
        this.dbresult1.visible = false;
        this.dbresult2.visible = false;
        //我的数据
        var myUserData = DataCenter.instance.user;

        setTimeout(() => {
            // 停止下雪，
            for (var i: number = 0; i < this.particlesArr.length; i++) {
                this.particlesArr[i].stop();
            }
        }, 5000)

        //输赢结果显示
        if (this.gameOverResultData.winUserId == myUserData.id) {
            // 获得金币
            // this.dbGoldDrop.visible = true;
            // this.dbGoldDrop.play("getGoldIcon", 1);
            // App.SoundManager.playEffect("addGoldAudio_mp3");

        }
    }

    public onClear() {
        // 离开玩家的Id
        GameResultView.playerExitGameId = null;

        // 隐藏面板
        this.resultInfoView.visible = false;
        this.playerLeaveView.visible = false;
        if (this.roleAvatar1) {
            this.roleAvatar1.dispose();
            this.roleAvatar1 = null;
        }
        if (this.roleAvatar2) {
            this.roleAvatar2.dispose();
            this.roleAvatar2 = null;
        }
        // this.btn_otherGame["img_time"].visible = false;
        // this.btn_otherGame["img_time"].source = "otherGame5_png";
        // this.num_time = 5;
        // App.TimerManager.remove(this.timer, this);
    }

    // 其它游戏
    private onOtherGame(): void {
        this.close();
        if (App.IsFaceBook) {
            FaceBookPlatform.RewardedVideo();
        }
        // 离开游戏
        Game.getInstance().leaveGame();
    }

    private addPerson() {
        this.roleAvatar1 = this.createAvatar(this.gp_people1, true);
        this.roleAvatar2 = this.createAvatar(this.gp_people2, false);
        var myUserData = DataCenter.instance.user;
        this.dbresult1.visible = true;
        this.dbresult2.visible = true;
        if (this.gameOverResultData.winUserId == myUserData.id) {
            // 播放完成播放金币效果
            // this.roleAvatar2.armature.once(dragonBones.AnimationEvent.COMPLETE, this.onLoseComplete, this);
            this.dbresult2.play("loser", 1);
            this.dbresult1.play("win", 1);
            this.roleAvatar1.armature.play("win");
            this.roleAvatar2.armature.play("Loser2");
            App.SoundManager.playEffect("win_mp3");
        } else {
            //this.roleAvatar1.armature.once(dragonBones.AnimationEvent.COMPLETE, this.onLoseComplete, this);
            this.dbresult1.play("loser", 1);
            this.dbresult2.play("win", 1);
            this.roleAvatar1.armature.play("Loser2");
            this.roleAvatar2.armature.play("win");
            App.SoundManager.playEffect("lose_mp3");
        }
        this.dbresult1.x = this.gp_1.width / 2;
        this.dbresult2.x = this.gp_1.width / 2;

        App.SoundManager.muteBg();
    }

    // 粒子效果
    private onParticleEffect(_X: number, _Y: number, str: string, time: number = -1, scaleX: number = 1): void {
        var texture = RES.getRes(str + "_png");
        var config = RES.getRes(str + "_json");
        var particleXueHua = new particle.GravityParticleSystem(texture, config);

        this.particlesArr.push(particleXueHua);

        particleXueHua.y = _Y;
        particleXueHua.x = _X;
        particleXueHua.scaleX = scaleX;
        if (str == "flowers") {
            this.gp_1.addChild(particleXueHua);
        }
        else {
            this.gp_particle.addChild(particleXueHua);
        }
        particleXueHua.start(time);

        if (str == "hua") {
            for (var i = 2; i < 7; i++) {
                str = "hua" + i;
                var texture = RES.getRes(str + "_png");
                var config = RES.getRes("hua_json");
                var particleXueHua = new particle.GravityParticleSystem(texture, config);

                this.particlesArr.push(particleXueHua);

                particleXueHua.y = _Y;
                particleXueHua.x = _X;
                particleXueHua.scaleX = scaleX;
                this.gp_particle.addChild(particleXueHua);
                particleXueHua.start(time);
            }
        }

    }

    private onLoseComplete(evt): void {
        // var armature: DBArmature = <DBArmature>evt.currentTarget.parent;
        // armature.play("Loser2");

    }

    private createAvatar(parentGroup: eui.Group, isMe: boolean): RoleAvatar {
        parentGroup.removeChildren();

        var roleAvatar: RoleAvatar;
        if (isMe) {
            var myData = DataCenter.instance.user;
            roleAvatar = new RoleAvatar(myData.curAvatarType, myData.imgUrl);
        } else {
            var playData = DataCenter.instance.room.player;
            roleAvatar = new RoleAvatar(playData.curAvatarType, playData.imgUrl);
        }

        roleAvatar.armature.x = parentGroup.width * 0.5;
        roleAvatar.armature.y = parentGroup.height;
        roleAvatar.armature.scaleX = roleAvatar.armature.scaleY = 0.8;
        parentGroup.addChild(roleAvatar.armature);
        return roleAvatar;
    }
}