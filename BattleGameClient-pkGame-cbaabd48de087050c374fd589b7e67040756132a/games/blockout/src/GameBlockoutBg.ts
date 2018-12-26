class GameBlockoutBg extends EuiComponent {
    public btn_1: eui.Group;
    public btn_2: eui.Group;
    public btn_3: eui.Group;

    public gp_add1: eui.Group;
    public gp_add2: eui.Group;
    public gp_add3: eui.Group;

    public gp_game: eui.Group;
    public gp_addGameRect: eui.Group;//添加物品块的层
    public gp_moveArr: eui.Group;//生成临时的物块组
    public gp_yuPan: eui.Group;//预判阴影的容器

    public btn_select1: eui.Image;
    public btn_select2: eui.Image;
    public btn_select3: eui.Image;
    public lb_wulukezou: eui.Label;

    public lb_reduce1: eui.Label;
    public lb_reduce2: eui.Label;

    public gp_red1: eui.Group;
    public gp_red2: eui.Group;

    public img_red1: eui.Image;
    public img_red2: eui.Image;
    public img_result: eui.Image;

    public lb_life1: eui.Label;
    public lb_life2: eui.Label;
    public lb_time: eui.Label;


    public img_time: eui.Rect;
    public rec_result: eui.Rect;
    public img_start1: eui.Image;
    public img_start2: eui.Image;
    public playerAvatarGroup1: eui.Group;
    public playerAvatarGroup2: eui.Group;
    public lb_name1: eui.Label;
    public lb_name2: eui.Label;
    public btn_help: eui.Image;
    public gp_help: eui.Group;

    public gp_addBoomEffect: eui.Group;//爆炸效果层
    public gp_addBoomRect: eui.Group;//爆炸层


    public numRectWidth: number = 29;//设置Button内的小物块宽高

    // 9 +

    public ArrBlock_5 =
    [
        [1, 1],
        [1, 1]
    ];

    public ArrBlock_6 =
    [
        [0, 1],
        [1, 1]
    ];

    public ArrBlock_7 =
    [
        [1, 0],
        [1, 1]
    ];

    public ArrBlock_8 =
    [
        [1, 1],
        [0, 1]
    ];

    public ArrBlock_9 =
    [
        [1, 1],
        [1, 0]
    ];

    public ArrBlock_10 =
    [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];

    public ArrBlock_11 =
    [
        [0, 0, 1],
        [0, 0, 1],
        [1, 1, 1]
    ];

    public ArrBlock_12 =
    [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1]
    ];

    public ArrBlock_13 =
    [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1]
    ];

    public ArrBlock_14 =
    [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]
    ];


    public constructor() {
        super(GameBlockoutBgSkin);
        this.btn_help.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHelp, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);

    }
    //物块类型
    //横向 1,2,3,4，5
    //纵向 1,2,3,4,5
    //田字  九宫格


    //更新按钮
    public onSetButton(num, num_btn: number = 1) {
        //通过name属性 得到当前点击块的类型
        this["btn_select" + num_btn].name = num;

        //单块
        if (num == 0) {
            var img = new eui.Image();
            img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
            this["gp_add" + num_btn].addChild(img);
            img.width = img.height = this.numRectWidth;
        }
        //横摆
        else if (num < 0) {
            for (var i = 0; i < (-1 * num + 1); ++i) {
                var img = new eui.Image();
                img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                this["gp_add" + num_btn].addChild(img);
                img.width = img.height = this.numRectWidth;
                img.x = i * this.numRectWidth
            }
        }
        //纵摆
        else if (num > 0 && num < 5) {
            for (var i = 0; i < num + 1; ++i) {
                var img = new eui.Image();
                img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                this["gp_add" + num_btn].addChild(img);
                img.width = img.height = this.numRectWidth;
                img.y = i * this.numRectWidth
            }
        }
        //复合型(本质方块)
        else {
            var len = this["ArrBlock_" + num].length;
            for (var i = 0; i < len; ++i) {
                for (var j = 0; j < len; ++j) {
                    if (this["ArrBlock_" + num][j][i] == 1) {
                        var img = new eui.Image();
                        img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                        this["gp_add" + num_btn].addChild(img);
                        img.width = img.height = this.numRectWidth;
                        img.x = i * this.numRectWidth
                        img.y = j * this.numRectWidth
                        console.log("添加物块", img.x, img.y, this["ArrBlock_" + num][i][j])
                    }
                }
            }
        }



    }
    //播放爆照效果
    public onPlayBoomEffect(num: number, isHang: boolean = true) {
        //行
        if (isHang) {
            for (var i = 0; i < 10; i++) {
                var img = new eui.Image();
                this.gp_addBoomRect.addChild(img);
                img.anchorOffsetX = 29;
                img.anchorOffsetY = 29;
                img.x = 29 + i * 58;
                img.y = 29 + num * 58;
                img.name = "" + i;
                img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                this.onBoom(img);
            }
        }
        //列
        else {
            for (var i = 0; i < 10; i++) {
                var img = new eui.Image();
                this.gp_addBoomRect.addChild(img);
                img.anchorOffsetX = 29;
                img.anchorOffsetY = 29;
                img.y = 29 + i * 58;
                img.x = 29 + num * 58;
                img.name = "" + i;
                img.source = "game_block" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
                this.onBoom(img);

            }
        }
    }

    public onBoom(Image: eui.Image) {

        var waitTime: number = Number(Image.name);
        egret.Tween.get(Image).wait(waitTime * 50).call(() => {
            var img = new eui.Image();
            this.gp_addBoomEffect.addChild(img);
            img.anchorOffsetX = 65.5;
            img.anchorOffsetY = 65.5;
            img.y = Image.y;
            img.x = Image.x;
            img.source = "effect_delete" + GameBlockoutView.GAME_BLOCK_CLOUR + "_png";
            egret.Tween.get(img).to({ alpha: 0 }, 600).call(() => {
                egret.Tween.removeTweens(img);
                if (img.parent) {
                    img.parent.removeChild(img);
                }
            })

        }).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ alpha: 0 }, 300).call(() => {
            egret.Tween.removeTweens(Image);
            if (Image.parent) {
                Image.parent.removeChild(Image);
            }
        })

    }

    public onHelp() {
        this.gp_help.visible = true;
    }

    public onEnd() {
        if (this.gp_help.visible == true) {
            this.gp_help.visible = false;
        }
    }
}