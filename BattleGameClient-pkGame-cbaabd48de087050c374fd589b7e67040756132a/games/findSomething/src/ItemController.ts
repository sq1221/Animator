namespace FindSomeThing {
    export class ItemController {
        private itemConfigMap: {};
        private itemConfigList: string[];
        // eui存在设计问题，只能手动一个个移除
        private itemList: Item[];
        random: Function;
        map: boolean[][];
        static mapCell = 28;
        static mapRow = 10;
        static mapCellEdge = 64;
        private tarRow: number;
        private tarCell: number;
        constructor() {
            if (App.IsWanba)
                ItemController.mapCellEdge = 70;
            this.initData();
            this.itemList = [];
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomItem" + GameFindSomethingView.instance.roundController.currentRound);
            this.map = [];
            for (let i = 0; i < ItemController.mapRow; i++) {
                let cell = [];
                for (let j = 0; j < ItemController.mapCell; j++)
                    cell.push(false);
                this.map.push(cell);
            }
            this.tarRow = this.tarCell = 0;
            this.addItem();
        }
        private initData = () => {
            let map = RES.getRes("ItemConfig_json")["map"];
            this.itemConfigMap = {};
            for (let i in map) {
                this.itemConfigMap[i] = map[i];
            }
            let list = RES.getRes("ItemConfig_json")["list"];
            this.itemConfigList = [];
            for (let i of list) {
                this.itemConfigList.push(i);
            }
        }
        /**统计场上物品数量 */
        private itemNum: number = 0;
        private numChildren: number = 0;
        addItem = (isSmall = false) => {
            this.itemNum++;
            let index = Math.floor(this.itemConfigList.length * this.random());
            this.numChildren = GameFindSomethingView.instance.GameScrollerGroup.numChildren;
            if (this.itemConfigList[index] === undefined) {
                // console.log(`this.itemNum:${this.itemNum}  this.numChildren:${this.numChildren}`);
                return;
            }
            let name = this.itemConfigList[index];
            let item = new Item("FindSomething_" + name + "_png", this.itemConfigMap[name]);
            delete this.itemConfigMap[name];
            this.itemConfigList.splice(index, 1);

            if (isSmall) {//提升性能，不进行遍历数组查询
                let isAdd = this.addSmallItem(item);
                if (isAdd)
                    this.addItem(isSmall);
            } else {
                //原图是个正方形
                if (item.width === item.height) {
                    //一个小格子位置
                    let isSmallNum = this.random();
                    if (isSmallNum < 0.3) {
                        //加工原图
                        let isAdd = this.addSmallItem(item);
                        if (isAdd)
                            this.addItem(false);
                    } else {
                        this.addBigItem(item);
                    }
                } else if (item.width > item.height) {
                    this.addWidthItem(item);
                } else {
                    this.addHeightItem(item);
                }
            }
        }

        private addHeightItem(item: Item) {
            let b = item.width / (ItemController.mapCellEdge - 10);
            let maxRow = Math.ceil(b);
            let isNeedFindNext = () => {
                for (let temp = 0; temp < maxRow; temp++) {
                    if (this.map[this.tarRow + temp] == undefined || this.map[this.tarRow + temp][this.tarCell] == undefined) {
                        return true;
                    }
                    if (this.map[this.tarRow + temp][this.tarCell])
                        return true;
                }
                return false;
            };
            if (isNeedFindNext()) {
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    if (this.tarRow + maxRow >= ItemController.mapRow) {
                        this.tarRow = this.tarCell = 0;
                        let isAdd = this.addSmallItem(item);
                        if (isAdd)
                            this.addItem(true);
                        return;
                    }
                }
            }
            let width = ItemController.mapCellEdge - 10;
            let height = item.height / b;
            let y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            let x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge * b * 0.5 + 5;
            item.setImage(width, height, x, y);
            for (let temp = 0; temp < maxRow; temp++)
                this.map[this.tarRow + temp][this.tarCell] = true;
            this.getNextGrid();
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            this.addItem(false);
        }

        private addWidthItem(item: Item) {
            let b = item.height / (ItemController.mapCellEdge - 10);
            let maxCell = Math.ceil(b);
            let isNeedFindNext = () => {
                for (let temp = 0; temp < maxCell; temp++) {
                    if (this.map[this.tarRow] == undefined || this.map[this.tarRow][this.tarCell + temp] == undefined) {
                        return true;
                    }
                    if (this.map[this.tarRow][this.tarCell + temp])
                        return true;
                }
                return false;
            };
            if (isNeedFindNext()) {
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    if (this.tarCell + maxCell >= ItemController.mapCell) {
                        this.tarRow++;
                        this.tarCell = 0;
                    }
                    if (this.tarRow + 1 >= ItemController.mapRow) {
                        let isAdd = this.addSmallItem(item);
                        if (isAdd)
                            this.addItem(true);
                        return;
                    }
                }
            }
            let y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge * b * 0.5 + 5;
            let x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            let height = (ItemController.mapCellEdge - 10);
            let width = item.width / b;
            item.setImage(width, height, x, y);
            for (let temp = 0; temp < maxCell; temp++)
                this.map[this.tarRow][this.tarCell + temp] = true;
            this.getNextGrid(maxCell);
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            this.addItem(false);
        }

        private addBigItem(item: Item) {
            let isNeedFindNext = () => {
                if (this.map[this.tarRow + 1] == undefined || this.map[this.tarRow + 1][this.tarCell + 1] == undefined) {
                    return true;
                }
                let result = this.map[this.tarRow][this.tarCell] || this.map[this.tarRow][this.tarCell + 1] ||
                    this.map[this.tarRow + 1][this.tarCell + 1] || this.map[this.tarRow + 1][this.tarCell];
                return result;
            };
            if (isNeedFindNext()) {
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    //边界处理
                    if (this.tarCell + 1 >= ItemController.mapCell) {
                        this.tarRow++;
                        this.tarCell = 0;
                    }
                    if (this.tarRow + 1 >= ItemController.mapRow) {
                        this.tarRow = this.tarCell = 0;
                        let isAdd = this.addSmallItem(item);
                        if (isAdd)
                            this.addItem(true);
                        return;
                    }
                }
            }
            let y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge;
            let x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge;
            item.setImage(ItemController.mapCellEdge * 2, ItemController.mapCellEdge * 2, x, y);
            this.map[this.tarRow][this.tarCell] = true;
            this.map[this.tarRow][this.tarCell + 1] = true;
            this.map[this.tarRow + 1][this.tarCell] = true;
            this.map[this.tarRow + 1][this.tarCell + 1] = true;
            this.getNextGrid(2);
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            this.addItem(false);
        }
        private addSmallItem(item: Item) {
            //判断是否可以放下
            let isNeedFindNext = () => {
                return (this.map[this.tarRow][this.tarCell]);
            };
            if (isNeedFindNext()) {
                let isFirst = true;
                while (isNeedFindNext()) {
                    this.getNextGrid();
                    if (this.tarCell >= ItemController.mapCell) {
                        this.tarRow++;
                        this.tarCell = 0;
                    }
                    if (this.tarRow == ItemController.mapRow - 1 && this.tarCell == ItemController.mapCell - 1) {
                        if (isFirst) {
                            isFirst = false
                        } else {
                            return false;
                        }
                    }
                }
            }
            //放下图片维护相关数据
            let y = this.tarRow * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            let x = this.tarCell * ItemController.mapCellEdge + ItemController.mapCellEdge * 0.5;
            item.setImage(ItemController.mapCellEdge, ItemController.mapCellEdge, x, y);
            this.map[this.tarRow][this.tarCell] = true;
            this.getNextGrid();
            GameFindSomethingView.instance.GameScrollerGroup.addChild(item);
            this.itemList.push(item);
            return true;
        }

        private getNextGrid(grid = 1) {
            this.tarCell = this.tarCell + grid;
            if (this.tarCell >= ItemController.mapCell) {
                this.tarRow++;
                this.tarCell = 0
            }
            if (this.tarRow >= ItemController.mapRow) {
                this.tarRow = 0;
                this.tarCell = 0
            }
        }
        clearItem() {
            for (let item of this.itemList) {
                GameFindSomethingView.instance.GameScrollerGroup.removeChild(item);
                item.dispose();
            }
            this.itemList = [];
        }
        nextRound = () => {
            this.clearItem();
            this.initData();
            this.random = new Math["seedrandom"](DataCenter.instance.room.id + "randomItem" + GameFindSomethingView.instance.roundController.currentRound);
            this.map = [];
            for (let i = 0; i < ItemController.mapRow; i++) {
                let cell = [];
                for (let j = 0; j < ItemController.mapCell; j++)
                    cell.push(false);
                this.map.push(cell);
            }
            this.tarRow = this.tarCell = 0;
            this.addItem();
        }

        getItem = (title: string) => {
            for (let item of this.itemList) {
                if (item.touchEnabled) {
                    for (let itemTitle of item.tags) {
                        if (title === itemTitle) {
                            return item;
                        }
                    }
                }
            }
        }
        dispose = () => {
            this.clearItem();
            this.map = [];
        }
    }


    export class Item extends egret.DisplayObjectContainer {
        tags: string[];
        private img: egret.Bitmap;
        setImage(width: number, height: number, x: number, y: number) {
            this.img.width = width;
            this.img.height = height;
            this.img.anchorOffsetX = this.img.width * 0.5;
            this.img.anchorOffsetY = this.img.height * 0.5;
            this.x = x;
            this.y = y;
            this.img.x = 0;
            this.img.y = 0;
        }
        constructor(bitmapUrl: string, tags: string[]) {
            super();
            this.img = AssetManager.getBitmap(bitmapUrl);
            this.tags = tags;

            GameFindSomethingView.instance.gameController.pushTitle(this.tags);

            this.addChild(this.img);
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
        }
        private tap = () => {
            if (!GameFindSomethingView.instance.isGameing) return;
            GameFindSomethingView.instance.gameController.stopFicker(this);
            for (let title of this.tags) {
                if (GameFindSomethingView.instance.gameController.currentTitle === title) {
                    this.touchEnabled = false;
                    this.img.alpha = 0.5;
                    GameFindSomethingView.instance.gameController.tapRight(this.tags);
                    let v = AssetManager.getBitmap("FindSomethingV_png");
                    v.width = this.img.width * 0.7;
                    v.height = this.img.height * 0.7;
                    if (v.width > v.height)
                        v.width = v.height;
                    else
                        v.height = v.width;
                    v.anchorOffsetX = v.width * 0.5;
                    v.anchorOffsetY = v.height * 0.5;
                    v.x = this.img.x;
                    v.y = this.img.y;
                    this.addChild(v);
                    return;
                }
            }
            GameFindSomethingView.instance.gameController.tapFalse();
            let x = AssetManager.getBitmap("FindSomethingX_png");
            x.width = this.img.width * 0.7;
            x.height = this.img.height * 0.7;
            if (x.width > x.height)
                x.width = x.height;
            else
                x.height = x.width;
            x.anchorOffsetX = x.width * 0.5;
            x.anchorOffsetY = x.height * 0.5;
            x.x = this.img.x;
            x.y = this.img.y;
            this.addChild(x);
            App.TimerManager.doTimer(1000, 1, () => {
                this.removeChild(x)
                App.TimerManager.removeAll(this);
            }, this)
        }
        dispose = () => {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
            this.removeChildren();
            App.TimerManager.removeAll(this);
        }
    }
}

