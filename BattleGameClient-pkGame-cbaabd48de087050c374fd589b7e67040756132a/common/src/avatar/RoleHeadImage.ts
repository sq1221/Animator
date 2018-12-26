class RoleHeadImage extends egret.Sprite {
    private bitmap: egret.Bitmap;
    private maskBitmap: egret.Bitmap;
    private imgUrl: string;
    private maskRes: string;
    private userBase64: boolean = false;

    public constructor(url: string, maskRes: string = "tou_png", headImgWidth: number = 96, headImgHeight: number = 96) {
        super();

        this.imgUrl = url;
        this.maskRes = maskRes;

        this.bitmap = new egret.Bitmap();
        this.bitmap.width = headImgWidth;
        this.bitmap.height = headImgHeight;
        this.bitmap.texture = RES.getRes("tou_png");
        this.addChild(this.bitmap);

        if (!this.imgUrl || !this.imgUrl.length) {
            return;
        }

        // //玩吧特殊处理
        // if (App.IsWanba){
        //     Base64BitmapDataPool.getData(this.imgUrl, texture => {
        //         this.setBitmap(texture);
        //         if (this.bitmap && texture) {
        //             this.userBase64 = true;
        //         }
        //     });
        //     return;
        // }

        //普通处理
        var that = this;
        var getHeadIcoSpecial = (url: any) => {
            window["CrossDomainImage"].load(url, function (result, data) {
                if (result == "SUCCESS") {
                    egret.BitmapData.create("base64", data, function (bitmapData: egret.BitmapData) {
                        let texture: egret.Texture = new egret.Texture();
                        texture.bitmapData = bitmapData;
                        that.setBitmap(texture);
                    });
                } else {
                    console.log("error message: ", data);
                }
            });
        }

        if (this.imgUrl.indexOf("https://") == -1 && this.imgUrl.indexOf("http://") == -1) {
            var resName = this.imgUrl.replace('.', '_');
            RES.getResAsync(resName, texture => {
                this.setBitmap(texture);
            }, this);
        } else {
            if (window["CrossDomainImage"]) {
                getHeadIcoSpecial(this.imgUrl);
            } else {
                RES.getResByUrl(this.imgUrl, (texture: egret.Texture) => {
                    this.setBitmap(texture);
                }, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
    }

    private setBitmap(texture: egret.Texture): void {
        if (!this.bitmap || !texture) {
            return;
        }
        this.bitmap.texture = texture;

        if (this.maskRes) {
            //设置遮罩
            this.maskBitmap = App.DisplayUtils.createBitmap(this.maskRes);
            this.maskBitmap.width = this.bitmap.width;
            this.maskBitmap.height = this.bitmap.height;
            this.addChild(this.maskBitmap);
            this.bitmap.mask = this.maskBitmap;
            this.cacheAsBitmap = true;
        }
    }

    public dispose(): void {
        this.removeChildren();
        this.bitmap.texture = null;
        this.bitmap = null;
        if (this.maskBitmap) {
            this.maskBitmap.texture = null;
            this.maskBitmap = null;
        }
        if (this.userBase64) {
            Base64BitmapDataPool.reduceUseNum(this.imgUrl);
        }
        this.cacheAsBitmap = false;
    }
}