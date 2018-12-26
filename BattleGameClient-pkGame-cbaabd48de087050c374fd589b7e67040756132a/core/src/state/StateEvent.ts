class StateEvent extends egret.Event {
    public static NEXT: string = "NEXT";
    public static LAST: string = "LAST";
    public static POPUP: string = "POPUP";
    public static POPUPCLOSE: string = "POPUPCLOSE";

    public data: string;
    public paramData: any;

    public constructor(type: string, data: string, paramData:any, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.data = data;
        this.paramData = paramData;
    }
}