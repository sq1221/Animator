/**
 * 卡片数据
 */
class GameTwiceJoyCard extends EuiComponent {

    public cardGroup: eui.Group;// 卡片group

    public cardBgImg: eui.Image;// 卡片背景img
    public showCardImg: eui.Image;// 卡片显示img
    public hideCardImg: eui.Image;// 卡片关闭img
    public matchSuccessImg: eui.Image;// 成功消除

    private _cardType: number = 0;// 卡片类型
    private _iconSource: string;// 卡片图标
    private _matchingSuccess: boolean = false;// 是否配对成功
    private _isOpen: boolean = false;// 打开状态
    private _cardPosId: number = 0;// 卡片id

    constructor() {
        super(GameTwiceJoyCardSkin);
        this._matchingSuccess = false;// 是否配对成功
        this._isOpen = false;// 打开状态
    }

    /**卡片类型 */
    public set cardType(value: number) {
        this._cardType = value;
    }
    public get cardType(): number {
        return this._cardType;
    }

    /**卡片icon */
    public set iconSource(value: string) {
        this._iconSource = value;
        // 设置卡片素材
        if (this.showCardImg) {
            this.showCardImg.source = this._iconSource;
        }
    }
    public get icon(): string {
        return this._iconSource;
    }

    /**是否配对成功 */
    public set matchSuccess(value: boolean) {
        this._matchingSuccess = value;
    }
    public get matchSuccess(): boolean {
        return this._matchingSuccess;
    }

    /**是否开启中 */
    public set isOpen(value: boolean) {
        this._isOpen = value;
    }
    public get isOpen(): boolean {
        return this._isOpen;
    }

    /**卡片位置id*/
    public set cardPosId(value: number) {
        this._cardPosId = value;
    }
    public get cardPosId(): number {
        return this._cardPosId;
    }

    // 卡片打开动画
    public cardOpen() {
        let self = this;
        self.clearTween();

        self.cardBgImg.scaleX = 0;
        self.showCardImg.scaleX = 0;
        self.hideCardImg.scaleX = 1;
        egret.Tween.get(self.hideCardImg).to({ scaleX: 0 }, 80, egret.Ease.backIn).call(() => {
            egret.Tween.get(self.cardBgImg).to({ scaleX: 1 }, 80, egret.Ease.backOut);
            egret.Tween.get(self.showCardImg).to({ scaleX: 1 }, 80, egret.Ease.backOut);
        });
    }

    // 卡片关闭动画
    public cardClose() {
        let self = this;
        self.clearTween();

        self.cardBgImg.scaleX = 1;
        self.showCardImg.scaleX = 1;
        self.hideCardImg.scaleX = 0;
        egret.Tween.get(self.cardBgImg).to({ scaleX: 0 }, 80, egret.Ease.backOut);
        egret.Tween.get(self.showCardImg).to({ scaleX: 0 }, 80, egret.Ease.backIn).call(() => {
            egret.Tween.get(self.hideCardImg).to({ scaleX: 1 }, 80, egret.Ease.backOut);
        });
    }

    // 卡片配对成功动画
    public cardMatchSuccess() {
        let self = this;
        self.clearTween();

        self.hideCardImg.visible = false;
        self.hideCardImg.scaleX = 0;

        self.cardBgImg.scaleX = self.cardBgImg.scaleY = 1;
        self.showCardImg.scaleX = self.showCardImg.scaleY = 1;

        egret.setTimeout(() => {
            egret.Tween.get(self.cardBgImg).to({ scaleX: 0, scaleY: 0 }, 300, egret.Ease.sineInOut);
            egret.Tween.get(self.showCardImg).to({ scaleX: 0, scaleY: 0 }, 300, egret.Ease.sineInOut);

            self.matchSuccessImg.visible = true;
            self.matchSuccessImg.scaleX = self.matchSuccessImg.scaleY = 1;
            egret.Tween.get(self.matchSuccessImg).to({ scaleX: 1.4, scaleY: 1.4 }, 100, egret.Ease.sineInOut).call(() => {
                egret.Tween.get(self.matchSuccessImg).to({ scaleX: 0, scaleY: 0 }, 80, egret.Ease.sineInOut);
            });
        }, this, 400);
    }

    // 清楚Tween动画
    public clearTween() {
        egret.Tween.removeTweens(this.cardBgImg);
        egret.Tween.removeTweens(this.showCardImg);
        egret.Tween.removeTweens(this.hideCardImg);
        egret.Tween.removeTweens(this.matchSuccessImg);
    }
}