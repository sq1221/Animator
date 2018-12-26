// 荷花和木头动画
class FrogEffect extends egret.DisplayObjectContainer {

    public currRect:MoveRect;
    private roleAvatar: RoleAvatar;
    public armature: DBArmature;

    public constructor(str:string) {
        super();
        this.onAddEffect(str);
    }

    private onAddEffect(str:string) {
        this.armature = this.armature;
        this.armature.play(str);
        this.addChild(this.armature);
    }

    public dispose(): void {
        this.roleAvatar.dispose();
        this.roleAvatar = null;
        this.armature = null;
        this.currRect = null;
    }
}