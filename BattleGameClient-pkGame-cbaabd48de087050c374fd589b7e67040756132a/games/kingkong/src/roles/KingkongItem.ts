class KingkongItem extends egret.Sprite {
    public static TYPE_BANANA: number = 0;
    public static TYPE_BOOM: number = 1;
    public static TYPE_FIRE_BOOM: number = 2;
    public static TYPE_KEY: number = 3;
    public static TYPE_WIN: number = 4;

    public static SIZE: number = 75;
    public static HALF_SIZE: number = KingkongItem.SIZE / 2;

    private _type: number;
    public pos: number;
    private _item: DBArmature;

    public constructor() {
        super();

        var name: string = "kingkongItem";

        this._item = AssetManager.getQuickDBArmature(name);
        this._item.scaleX = this._item.scaleY = 1.2;
        this.addChild(this._item);
    }

    private reDraw(): void {
        let color: number = 0xff0000;
        this._item.stop();
        switch (this._type) {
            case KingkongItem.TYPE_BANANA:
                color = 0xffff00;
                this._item.gotoAndStop("banana");
                break;
            case KingkongItem.TYPE_BOOM:
                color = 0;
                this._item.gotoAndStop("boom");
                break;
            case KingkongItem.TYPE_FIRE_BOOM:
                color = 0xff0000;
                this._item.play("fireBoom");
                break;
            case KingkongItem.TYPE_KEY:
                color = 0xff0000;
                this._item.gotoAndStop("key");
                break;
            case KingkongItem.TYPE_WIN:
                color = 0xff0000;
                this._item.gotoAndStop("qi");
                break;
            default:
                color = 0xffffff;
                this._item.stop();
                break;
        }
    }
    public set type(v: number) {
        this._type = v;
        this.reDraw();
    }
    public get type(): number {
        return this._type;
    }
}