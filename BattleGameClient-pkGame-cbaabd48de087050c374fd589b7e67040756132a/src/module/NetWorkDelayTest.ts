/**
 * 网络延迟测试
 */
class NetWorkDelayTest {
    
    // 显示网络延迟
    private netWorktext: egret.TextField;
    // 记录点击次数
    private clickNum: number = 0;

    public constructor() {
        this.init();
    }

    private init() {
        // 文本
        this.netWorktext = new egret.TextField();
        this.netWorktext.borderColor = 0xFF0000;
        this.netWorktext.border = true;
        this.netWorktext.width = 400;
        this.netWorktext.height = 34;
        this.netWorktext.x = (App.GameWidth - this.netWorktext.width) / 2;
        this.netWorktext.y = 10;
        this.netWorktext.textColor = 0x000000;
        this.netWorktext.strokeColor = 0xFF0000;
        this.netWorktext.stroke = 2;
        this.netWorktext.size = 30;
        this.netWorktext.textAlign = "center";

        // 注册事件
        this.initMessage();
        // 监听舞台点击事件
        App.StageUtils.getStage().addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    private onClick(evt: egret.TouchEvent): void {
        if (evt.$stageY > 50) {
            return;
        }

        if (this.clickNum == 0) {
            egret.setTimeout(() => {
                if (this.clickNum >= 5) {
                    this.onStartSendNetWork();
                } else {
                    this.clickNum = 0;
                }
            }, this, 1000);
        }
        this.clickNum++;
    }

    // 注册网络延迟测试监听
    private initMessage(): void {
        //收到网络延时返回
        App.MessageCenter.addListener(Proto.ID_client_network_s2c, this.onGetNetWorkS2C, this);
    }

    // 收到网络延迟返回
    private onGetNetWorkS2C(data: client_network_s2c): void {
        var newTime = egret.getTimer() - parseInt(data.time.toString());
        this.netWorktext.text = "Server：" + Common.ServerIndex + " 延迟: " + newTime + " 毫秒";
    }

    // 开始发送net work
    private onStartSendNetWork(): void {
        this.ontimerUpdate();
        App.StageUtils.getStage().addChild(this.netWorktext);
        App.TimerManager.doTimer(2000, 0, this.ontimerUpdate, this);
    }

    // 结束发送net work
    private onStopSendNetWork(): void {
        App.TimerManager.remove(this.ontimerUpdate, this);
    }

    // net 
    private ontimerUpdate() {
        // 记录当前时间
        let sendNetResult = egret.getTimer();
        var sendMsg = new client_network_c2s();
        sendMsg.time = sendNetResult;
        App.Socket.send(sendMsg);
    }
}