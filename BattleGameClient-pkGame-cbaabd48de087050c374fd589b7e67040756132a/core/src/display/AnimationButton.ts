class AnimationButton extends eui.Button implements  eui.UIComponent {
	
	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void{
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void{
		super.childrenCreated();
	}
	
	protected getCurrentState():string{
		var state:string = super.getCurrentState();
		if(state == "down"){
			this.scaleX = this.scaleY = 0.9;
		} else if(state == "up"){
			this.scaleX = this.scaleY = 1;
		}
		return state;
	}
}