//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI_XiaoMi extends EuiComponent {

    public bg: eui.Image;
    public logoBg: eui.Image;
    public logoCircle: eui.Image;
    public logo: eui.Image;
    public loadProgressTxt: eui.Label;
    public LD_Logo: eui.Image;
    
    public constructor() {
        super(LoadingUISkin_XiaoMi);

        this.percentHeight = 100;
        this.percentWidth = 100;

        this.setProgressText("加载基础资源...");
    }

    private setAssets(): void {
        if (!this.bg.source && RES.getRes("LD_loadingBG_jpg")) {
            this.bg.source = "LD_loadingBG_jpg";
            //Platform.curPlatform.loaded();
        }

        if (!this.logo.source && RES.getRes("LD_icon_png")) {
            this.logo.source = "LD_icon_png";
        }

        if (!this.LD_Logo.source && RES.getRes("LD_Logo_png")) {
            this.LD_Logo.source = "LD_Logo_png";
        }

        if (!this.logoBg.source && RES.getRes("LD_BG_png")) {
            this.logoBg.source = "LD_BG_png";
        }

        if (!this.logoCircle.source && RES.getRes("LD_Circle_png")) {
            this.logoCircle.source = "LD_Circle_png";
            // let tw = egret.Tween.get(this.logoCircle, { loop: true });
            // tw.to({ rotation: 180 }, 1000).to({rotation: 360}, 1000).call(()=>{this.logoCircle.rotation = 0});
        }
    }

    public setBaseProgress(current, total): void {
        this.setAssets();
        //this.setProgress(Math.ceil(current / total * 100));
    }

    private setProgress(progressNum: number): void {
        //this.loadProgressImg.width = progressNum / 100 * this.loadProgressImg.parent.width;
    }

    public setProgressText(text: string) {
        if (!this.loadProgressTxt) {
            return;
        }
        this.loadProgressTxt.text = text;
    }

    public close = (): void => {
        App.MessageCenter.removeAll(this);
        egret.Tween.removeTweens(this.logoCircle);
        if (this.parent.parent) {
            this.parent.parent.removeChild(this.parent);
        }
    }

    //错误信息显示
    private setErrorMsg(msg: string, gameResult: number = 1): void {
        //显示信息
        this.setProgressText(msg);
        //返回平台
        App.TimerManager.doTimer(2000, 1, () => {
            Platform.curPlatform.gameOver(gameResult);
        }, this);
    }







    private addMesssgaeListener(): void {
        //游戏开启通知
        App.MessageCenter.addListener(Proto.ID_game_start_notice_s2c, this.startGameS2C, this);
        //收到loadProgress通知
        App.MessageCenter.addListener(Proto.ID_game_loadProgress_notice_s2c, this.loadProgressS2C, this);
        //结果返回
        App.MessageCenter.addListener(Proto.ID_game_result_notice_s2c, this.onGameResultS2C, this);
    }

    public startGameLoad(): void {
        this.addMesssgaeListener();

        //进度显示还原
        this.setProgressText("加载游戏资源...");
        //this.setProgress(0);

        //加载资源
        this.loadGameSource();
    }


    // 加载资源
    private loadGameSource(): void {
        var config: any = DataCenter.instance.getGameConfig(App.CurrGameId);
        var gameRes = config.res;
        App.ResourceUtils.loadGroup(gameRes, this.onCompleteHandler, this.onProgressHandler, this, this.onErrorHandler);
    }

    // 资源加载失败
    private onErrorHandler(): void {
        //提示信息
        this.setErrorMsg("游戏资源加载失败");
        egret.ExternalInterface.call("callNativeGameError", XiaoMiErrorCode.GAME_RESOURCE_LOADERROR);
    }

    private onCompleteHandler(): void {
        //解析龙骨动画
        let dbConfig = RES.getRes("dbAssetConfig_json");
        AssetManager.loadDBAnimation(dbConfig.db[App.CurrGameId.toString()]);
        //加载完成统计log
        Statistics.loadingEndOne();
        //发送资源加载完成
        ProxySocket.sendLoadProgress(App.CurrRoomId, 100);
        //等待对手进入
        this.setProgressText("等待对手进入...");

        // 通知app游戏准备完毕，app会停止超时计时
        egret.ExternalInterface.call('callNativeGameLoadedRes', '')
    }

    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onProgressHandler(itemsLoaded: number, itemsTotal: number): void {
        var progressNum: number = Math.ceil(itemsLoaded / itemsTotal * 100);
        progressNum = Math.min(progressNum, 99);
        //发送LoadProgress
        ProxySocket.sendLoadProgress(App.CurrRoomId, progressNum);
    }

    //游戏开启通知
    private startGameS2C(data: game_start_notice_s2c): void {
        this.runGame();
    }

    //收到loadProgress通知
    private loadProgressS2C(data: game_loadProgress_notice_s2c): void {
        //进度显示
        if (data.userId.toString() == DataCenter.instance.user.id) {
            //this.setProgress(data.progress);
        } else {
        }
    }

    private initGame(): void {
        //创建Game
        let game: Game = Game.getInstance();
        this.stage.addChild(game);

        //关闭loading
        this.close();
    }

    //正常进入游戏
    private runGame(): void {
        //进入游戏
        this.initGame();
        Game.getInstance().joinGame(App.CurrGameId);
        //统计
        Statistics.loadingEnd();

        // 通知app移除loading
        App.TimerManager.doFrame(5, 1, () => {
            egret.ExternalInterface.call("callNativeGameLoaded", "");
        }, this);
    }

    //游戏结果返回
    private onGameResultS2C(data: game_result_notice_s2c): void {
        //统计
        Statistics.gameEnd();
        Statistics.reportResult(data.winUserId);

        //结束处理
        if (DataCenter.instance.room) {
            //弹出胜负结果
            this.initGame();
            DataCenter.instance.room.gameResult = data;
            Game.getInstance().stateManager.curState.popup("GameResult");
        } else {
            this.setErrorMsg("对手已经离线，2秒后退出", 3);
        }
    }
}
