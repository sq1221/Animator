/**
 * 矩形工具类
 */
class RectangleUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 判定两个矩形是否相交
     */
    public intersects(a: egret.Rectangle, b: egret.Rectangle): boolean {
        var x1 = a.x;
        var x2 = b.x;
        var y1 = a.y;
        var y2 = b.y;
        var w1 = a.width;
        var w2 = b.width;
        var h1 = a.height;
        var h2 = b.height;

        if ((x1 < x2) && ((x2 - x1) >= w1))
            return false;
        if ((x1 > x2) && ((x1 - x2) >= w2))
            return false;
        if ((y1 < y2) && ((y2 - y1) >= h1))
            return false;
        if ((y1 > y2) && ((y1 - y2) >= h2))
            return false;
        return true;
    };
}
