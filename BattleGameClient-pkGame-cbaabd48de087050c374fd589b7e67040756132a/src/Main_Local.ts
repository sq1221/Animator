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

class Main_Local extends egret.DisplayObjectContainer {

    private loadingView: LoadingUI_Local;
    private euiLayer: eui.UILayer;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //初始化服务器
        var serverUrl = "https://pkgame_test.egret-labs.org/platforms/index.php";
        // serverUrl = "http://10.0.7.138/Server/BattleGameServerList/platforms/local.php";
        ProxyHttp.init(serverUrl, Platform.curPlatformID);

        //loading容器层
        this.euiLayer = new eui.UILayer();
        this.euiLayer.percentWidth = 100;
        this.euiLayer.percentHeight = 100;
        this.stage.addChild(this.euiLayer);

        //设置加载进度界面
        this.loadingView = new LoadingUI_Local();
        this.loadingView.bottom = 0;
        this.euiLayer.addChild(this.loadingView);

        // zip预加载方案测试
        App.TimerManager.doFrame(5, 1, () => {
            egret.ExternalInterface.call('callNativeGameLoaded', '');
        }, this);

        //初始化Resource资源加载库
        var gameResPath = "resource/";
        if (App.Language == LanguageType.En) {
            gameResPath = "resource_En/"
        }
        App.ResourceUtils.addConfig(gameResPath + "default_local.res.json", gameResPath);
        App.ResourceUtils.addConfig(gameResPath + "roleHeads.res.json", gameResPath);
        App.ResourceUtils.addConfig(gameResPath + Common.getGameResConfig(), gameResPath);
        App.ResourceUtils.loadConfig(this.onConfigComplete, this);
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        App.ResourceUtils.loadGroup("preload", this.onResourceLoadComplete, this.onResourceProgress, this, this.onResourceError);
    }

    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(groupName: string): void {
        if (groupName == "preload") {
            //解析龙骨动画
            let dbConfig = RES.getRes("dbAssetConfig_json");
            AssetManager.loadDBAnimation(dbConfig.db["0"]);

            //EasyLoading初始化
            EasyLoading.init();

            //配置文件初始化
            DataCenter.instance.initConfig(RES.getRes("gameConfig_json"));

            //进行平台登录
            this.startPlatformLogin();
        }
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(itemsLoaded: number, itemsTotal: number): void {
        this.loadingView.setProgress(itemsLoaded, itemsTotal);
    }

    /**
     * 资源加载失败
     */
    private onResourceError(): void {
        this.showErrorMsg_Loading(RES.getRes("errorCode_json")["7001"]);
    }

    //开始平台登录
    private startPlatformLogin(): void {
        this.setProgressText(RES.getRes("errorCode_json")["8001"]);
        //根据平台用户数据进行登录
        Platform.curPlatform.login((success) => {
            if (!success) {
                this.setProgressText(RES.getRes("errorCode_json")["8002"]);
                return;
            }

            //进入匹配界面
            this.joinGame();
        })
    }

    //进度显示
    private setProgressText(text: string): void {
        if (!this.loadingView) {
            return;
        }

        this.loadingView.setProgressText(text);
    }

    //进入游戏
    private joinGame(): void {
        //移除loading效果
        egret.Tween.get(this.loadingView).to({ alpha: 0 }, 300).call(() => {
            //移除loading
            this.euiLayer.removeChild(this.loadingView);
            this.loadingView.destroy();
            this.loadingView = null;

            this.stage.removeChild(this.euiLayer);

            //进入游戏
            let game: Game = Game.getInstance();
            this.stage.addChild(game);
            game.stateManager.curState.next("gameChangeMatch");
        });
    }

    //错误信息显示
    private showErrorMsg_Loading(msg: string): void {
        //显示信息
        msg = msg + "(" + Common.ServerIndex + ")";
        this.setProgressText(msg);
        //返回平台
        App.TimerManager.doTimer(2000, 1, () => {
            Platform.curPlatform.gameOver(1);
        }, this);
    }
}


