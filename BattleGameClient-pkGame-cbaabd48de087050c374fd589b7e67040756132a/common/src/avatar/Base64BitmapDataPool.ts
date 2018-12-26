class Base64BitmapDataPool {
	private static pools:any = {};
	private static waitLoading:any = {};
	public constructor() {

	}

	public static getData(imgUrl:string, callBack:Function):void{
		var data = this.pools[imgUrl];
		if (data) {
			data.useNum += 1;
			callBack(data.data);
		} else {
			if(!this.waitLoading[imgUrl]){
				this.waitLoading[imgUrl] = [];
				this.waitLoading[imgUrl].push(callBack);
			} else {
				this.waitLoading[imgUrl].push(callBack);
				return;
			}

			ProxyHttp.wxImgToBase64(imgUrl, (result) => {
                var arr = result.r.data.split(",");
				egret.BitmapData.create("base64", arr[1], (bitmapData: egret.BitmapData) => {
                    let texture:egret.Texture = new egret.Texture();
                    texture._setBitmapData(bitmapData);
					
					var data = {
						data: texture,
						useNum: 0
					}
					this.pools[imgUrl] = data;

					var callBackList = this.waitLoading[imgUrl];
					callBackList.forEach(callBack => {
						data.useNum += 1;
						callBack(data.data);
					});

					this.waitLoading[imgUrl] = null;
					delete this.waitLoading[imgUrl];
                });
            });
		}
	}

	public static reduceUseNum(imgUrl:string):void{
		var data = this.pools[imgUrl];
		if (data) {
			data.useNum -= 1;
		}
	}
}