class Gob_role extends eui.Image {
    private scale: number = 0.00425; // // (1 - 0.29) / 200;
    private xSBS: number;
    private ySBS: number;
    private localPosNum: number = 0;
    private color: string;

    private nCounter: number = 0;
    private qCounter: number = 0;
    private wCounter: number = 1;
    private tCounter: number = 1;
    private walkType: Array<string> = ["_walk1", "_walk2"];

    public soundChannel1: SoundEffects = new SoundEffects();

    public constructor(color: string) {
        super();
        this.soundChannel1.setVolume(0.7);
        switch (color) {
            case "Red":
                this.source = "Gob_roleRed_stand_png";
                this.x = 340;
                this.xSBS = 0.645;
                break;
            case "Blue":
                this.source = "Gob_roleBlue_stand_png";
                this.x = 300;
                this.xSBS = -0.685;
                break;
        }

        this.color = color;
        this.ySBS = 2.415;
        this.y = 374;
        this.anchorOffsetX = 194.5;
        this.anchorOffsetY = 556;
        this.scaleX = 0.15;
        this.scaleY = 0.15;
    }

    private numManager = (counter: string): number => {
        switch (counter) {
            case "nCounter":
                if (this.nCounter >= 2) {
                    this.nCounter = 0;
                } else {
                    this.nCounter += 1;
                }
                return this.nCounter;
            case "qCounter":
                if (this.qCounter >= 2) {
                    this.qCounter = 0;
                } else {
                    this.qCounter += 1;
                }
                return this.qCounter;
            case "wCounter":
                if (this.wCounter == 1) {
                    this.wCounter = 2;
                } else if (this.wCounter == 2) {
                    this.wCounter = 1;
                }
                return this.wCounter;
            case "tCounter":
                if (this.tCounter == 1) {
                    this.tCounter = 2;
                } else if (this.tCounter == 2) {
                    this.tCounter = 1;
                }
                return this.tCounter;
        }
    }

    public normalWalk = () => {
        this.source = "Gob_role" + this.color + App.RandomUtils.randomArray(this.walkType) + this.numManager("nCounter") + "_png";
        if (this.scaleX > 1) {
            return;
        }
        this.x += this.xSBS;
        this.y += this.ySBS;
        this.scaleX += this.scale;
        this.scaleY += this.scale;
    }

    public reset2normal = () => {
        this.source = "Gob_role" + this.color + "_walk1" + this.nCounter.toString() + "_png";
    }

    public reset2dumbfounded = () => {
        this.source = "Gob_role" + this.color + "_dumbfounded_png";
    }

    public taunt = () => {
        if (this.color == "Blue") {
            this.soundChannel1.play("Gob_showOff_mp3");
        }

        this.source = "Gob_role" + this.color + "_taunt" + this.numManager("tCounter") + "_png";
    }

    public dumbfounded = () => {
        App.TimerManager.remove(this.reset2normal, this);
        this.source = "Gob_role" + this.color + "_dumbfounded_png";
    }

    public quickWalk = () => {
        this.source = "Gob_role" + this.color + "_qwalk" + this.numManager("qCounter") + "_png";
        if (this.scaleX > 1) {
            return;
        }
        this.x += this.xSBS;
        this.y += this.ySBS;
        this.scaleX += this.scale;
        this.scaleY += this.scale;

        // if (this.scaleX < 1) {
        //     let tw = egret.Tween.get(this);
        //     tw.to({
        //         x: this.x + this.xSBS, y: this.y + this.ySBS,
        //         scaleX: this.scaleX + this.scale, scaleY: this.scaleY + this.scale
        //     }, 75).call(() => {
        //         tw = null;
        //     });
        // }
    }

    public win = () => {
        App.TimerManager.doTimer(500, 0, () => {
            try {
                this.source = "Gob_role" + this.color + "_win" + this.numManager("wCounter") + "_png";
            } catch (e) {
                console.log(e);
            }
        }, this)
    }

    public behit = () => {
        if (this.color == "Blue") {
            this.soundChannel1.play("Gob_jeer_mp3");
        }
        App.TimerManager.remove(this.reset2dumbfounded, this);
        App.TimerManager.doTimer(120, 1, this.reset2dumbfounded, this);
        this.source = "Gob_role" + this.color + "_behit_png";
        if (this.scaleX < 0.15) {
            return;
        }

        this.x -= 2 * this.xSBS;
        this.y -= 2 * this.ySBS;
        this.scaleX -= 2 * this.scale;
        this.scaleY -= 2 * this.scale;

        // let tw = egret.Tween.get(this);
        // tw.to({
        //     x: this.x - this.xSBS, y: this.y - this.ySBS,
        //     scaleX: this.scaleX - this.scale, scaleY: this.scaleY - this.scale
        // }, 75).call(() => {
        //     tw = null;
        // });
    }

    public dispose = () => {
        App.TimerManager.removeAll(this);
    }
}

class flyingItem extends eui.Image {
    private soundChannel: SoundEffects = new SoundEffects();
    private itemClass = ["Gob_item_book1_png", "Gob_item_book2_png", "Gob_item_book3_png", "Gob_item_book4_png", "Gob_item_eraser1_png", "Gob_item_eraser2_png", "Gob_item_eraser3_png", "Gob_item_eraser4_png"];

    public constructor(who: string) {
        super();
        this.soundChannel.setVolume(0.7);
        this.source = App.RandomUtils.randomArray(this.itemClass);
        this.anchorOffsetX = this.width * 0.5;
        this.anchorOffsetY = this.height * 0.5;
        this.rotation = App.RandomUtils.limitInteger(0, 360);
        this.x = 320;
        this.y = 800;
        GameGoBallisticMainScene.instance.Gob_group_flyingItem.addChild(this);

        let tw = egret.Tween.get(this);
        switch (who) {
            case "blue":
                tw.to({ x: GameGoBallisticItemClass.instance.roleBlue.x, y: GameGoBallisticItemClass.instance.roleBlue.y - 0.2 * GameGoBallisticItemClass.instance.roleBlue.height, scaleX: GameGoBallisticItemClass.instance.roleBlue.scaleX, scaleY: GameGoBallisticItemClass.instance.roleBlue.scaleY }, 120);
                break;
            case "red":
                tw.to({ x: GameGoBallisticItemClass.instance.roleRed.x, y: GameGoBallisticItemClass.instance.roleRed.y - 0.2 * GameGoBallisticItemClass.instance.roleRed.height, scaleX: GameGoBallisticItemClass.instance.roleRed.scaleX, scaleY: GameGoBallisticItemClass.instance.roleRed.scaleY }, 120);
                break;
        }

        tw.call(() => {
            this.soundChannel.play("Gob_beHit_mp3");
            GameGoBallisticMainScene.instance.Gob_group_flyingItem.removeChild(this);
            tw = null;
        });
    }
}