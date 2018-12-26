/**
 * Created by husong on 4/10/15.
 */
class EasyLoading {

    private static content: egret.Sprite = null;
    private static dbArmature: DBArmature;

    public static init(): void {

        this.content = new egret.Sprite();
        this.content.graphics.beginFill(0x000000, 0.2);
        this.content.graphics.drawRect(0, 0, App.StageUtils.getWidth(), App.StageUtils.getHeight());
        this.content.graphics.endFill();
        this.content.touchEnabled = true;

        this.dbArmature = AssetManager.getDBArmature("loading");
        this.dbArmature.x = App.StageUtils.getWidth() * 0.5;
        this.dbArmature.y = App.StageUtils.getHeight() * 0.5 + 30;
        this.dbArmature.scaleX = this.dbArmature.scaleY = 1.6;
        this.content.addChild(this.dbArmature);
    }

    public static showLoading(): void {
        App.StageUtils.getStage().addChild(this.content);
        this.dbArmature.play("newAnimation", 0);
    }

    public static hideLoading(): void {
        if (this.content && this.content.parent) {
            App.StageUtils.getStage().removeChild(this.content);
        }
        this.dbArmature.stop();
    }
}
