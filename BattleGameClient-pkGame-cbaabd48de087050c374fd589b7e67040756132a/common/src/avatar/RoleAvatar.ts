class RoleAvatar {
    private _armature: DBArmature;
    private _headContainer: egret.Sprite;
    private _head: RoleHeadImage;

    public constructor(avatarType: number, headUrl: string, defaultAvatar: string = "dbxiaoren00") {
        //默认形象
        this._armature = AssetManager.getDBArmature(defaultAvatar);
        if (this._armature == null) {
            return;
        }

        //头像替换
        this._headContainer = new egret.Sprite();
        this._head = new RoleHeadImage(headUrl);
        this._head.x = -this._head.width * 0.5;
        this._head.y = -this._head.height * 0.5;
        this._headContainer.addChild(this._head);
        this._armature.replaceSlot("tou", this._headContainer);

        //整体换装实现(换装资源未清理，待处理)
        if (avatarType == 1) {
            return;
        }

        var avaterGroup: string = this.getDbRes(avatarType);
        var avatarRes: Array<string> = this.getAvatarRes(avatarType);

        var changeAvatar = function () {
            if (!this._armature) return;
            const armatureData = AssetManager.dbFactory.getArmatureData(avaterGroup);
            if (!armatureData) return;
            const skinData = armatureData.defaultSkin;
            this._armature.replaceSkin(skinData);
            this._armature.replaceSlot("tou", this._headContainer);
        }.bind(this);

        if (RES.getRes(avatarRes[0])) {
            changeAvatar();
        } else {
            App.ResourceUtils.createGroup(avaterGroup, avatarRes);
            App.ResourceUtils.loadGroup(
                avaterGroup,
                () => {
                    AssetManager.loadDBAnimation([avaterGroup]);
                    changeAvatar();
                },
                () => { },
                this
            );
        }
    }

    private get avatarConfig(): any {
        return RES.getRes("avatar_json");
    }

    private getDbRes(avatarType: number): string {
        return this.avatarConfig["base"][avatarType].res;
    }

    private getAvatarRes(avatarType: number): Array<string> {
        var resName = this.getDbRes(avatarType);
        return [
            resName + "_ske_json",
            resName + "_tex_json",
            resName + "_tex_png"
        ];
    }

    public get armature(): DBArmature {
        return this._armature;
    }

    public dispose(): void {
        this._armature.dispose();
        this._armature = null;

        this._head.dispose();
        this._head = null;
    }
}