// TypeScript file
class QIPaoCartoon extends EuiComponent {

    private btn_qipao: eui.Button;
    private btn_qipao2: eui.Button;
    private btn_qipao3: eui.Button;
    public img_1: eui.Image;
    public img_2: eui.Image;

    public constructor() {
        super(ButtonQipao);
    }

    //设置资源
    public setSouce(str: string, isOther: boolean = false, type: number = 0) {

        //var str:string =  
        //斗兽棋
        if (type == 0) {
            if (isOther) {

                if (str.indexOf("express1") == -1) {
                    this.btn_qipao.visible = false;
                    this.btn_qipao2.visible = true;
                    this.btn_qipao2["img"].source = str;
                    this.anchorOffsetX = this.width;
                }
                else {
                    this.btn_qipao3.visible = true;
                    this.btn_qipao3["img"].source = str;
                    this.width = this.btn_qipao3.width;
                    this.anchorOffsetX = this.width;
                }
            }
            else {
                this.btn_qipao.visible = true;
                this.btn_qipao2.visible = false;
                this.btn_qipao["img"].source = str;
            }
        }
        //智多星
        else if (type == 1) {
            if (isOther) {
                this.img_2.visible = true;
                this.width = this.img_2.width;
                this.anchorOffsetX = this.width;
                this.img_2.source = str;
            }
            else {
                this.img_1.visible = true;
                this.img_1.source = str
            }

        }
    }
    //设置翻转
    public setFanzhuan() {

    }

    //彈力
    public onPlayTanDong() {

    }
    //设置动画
    public onPlay(type: number = 0) {
        //this.scaleX = this.scaleY = 0;
        if (type == 0) {
            egret.Tween.get(this).to({ y: this.y + App.RandomUtils.limitInteger(100, 140) }, 800)
            egret.Tween.get(this).wait(500).to({ alpha: 0 }, 700).call(() => {
                this.parent.removeChild(this);
                egret.Tween.removeTweens(this);
                var self = this;
                self = null;
            })
        }
        else if(type == 1)
        {
            egret.Tween.get(this).to({ x: this.x + App.RandomUtils.limitInteger(100, 140) }, 800)
            egret.Tween.get(this).wait(300).to({ alpha: 0 }, 500).call(() => {
                this.parent.removeChild(this);
                egret.Tween.removeTweens(this);
                var self = this;
                self = null;
            })
        }
        else if(type == 2)
        {
            egret.Tween.get(this).to({ x: this.x - App.RandomUtils.limitInteger(100, 140) }, 800)
            egret.Tween.get(this).wait(300).to({ alpha: 0 }, 500).call(() => {
                this.parent.removeChild(this);
                egret.Tween.removeTweens(this);
                var self = this;
                self = null;
            })
        }
    }
}