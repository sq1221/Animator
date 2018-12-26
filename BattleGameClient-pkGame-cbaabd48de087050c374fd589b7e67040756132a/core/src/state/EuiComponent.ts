// TypeScript file
class EuiComponent extends eui.Component {
    /**
     * 构造函数
     */
    public constructor(skinClass: any) {
        super();
        if(typeof(skinClass) !== "function"){
            console.error("skinName请使用类名");
            return;
        }
        this.skinName = skinClass;
    }
}