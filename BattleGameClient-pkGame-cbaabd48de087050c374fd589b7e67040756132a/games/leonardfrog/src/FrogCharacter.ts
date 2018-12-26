// 青蛙过河人物骨骼动画
class FrogCharacter extends egret.DisplayObjectContainer {

    public status: number = 0;//0等待 1~4过道 5成功登录  10为落水

    public currRect:MoveRect;
    private roleAvatar: RoleAvatar;
    public id:number;
    public armature: DBArmature;
    public startJumptime:number;
    public validWidth:number;
    public validHeight:number;

    public constructor() {
        super();
    }

    public init(user:User) {
        if(this.roleAvatar){
            return;
        }
        
        this.roleAvatar = new RoleAvatar(user.curAvatarType, user.imgUrl, "dbxiaoren00_game1");
        this.armature = this.roleAvatar.armature;
        if(this.armature)
        {
              this.armature.scaleX = this.armature.scaleY = 0.6;
        }
        this.addChild(this.armature);

        this.validWidth = this.width;
        this.validHeight = Math.floor(GameLeonardFroG.IMPACT_parameter * this.height);
    }

    public get isEnemy():boolean{
        return this.scaleY == -1;
    }
    
    public dispose(): void {
        console.log("销毁了");
        egret.Tween.removeTweens(this);
        this.roleAvatar.dispose();
        this.roleAvatar = null;
        this.armature = null;
        this.currRect = null;
    }
}