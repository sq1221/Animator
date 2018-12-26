class AssetManager {
    public static dbFactory: dragonBones.EgretFactory = new dragonBones.EgretFactory();

    private static cacheDbs: any = {};

    private static clearCacheList(armatureName: string): void {
        var arr = this.cacheDbs[armatureName] || [];
        while (arr.length) {
            var armature: DBArmature = arr[0];
            armature.dispose();
        }
        delete this.cacheDbs[armatureName];
    }

    public static removeCacheArmature(armature: DBArmature): void {
        var armatureName: string = armature.armatureName;
        var arr: Array<DBArmature> = this.cacheDbs[armatureName];
        if (arr) {
            var index: number = arr.indexOf(armature);
            if (index != -1) {
                arr.splice(index, 1);
            }
        }
        this.printCacheListCount();
    }

    private static addCacheArmature(armature: DBArmature): void {
        var armatureName: string = armature.armatureName;
        if (!this.cacheDbs[armatureName]) {
            this.cacheDbs[armatureName] = [];
        }
        this.cacheDbs[armatureName].push(armature);
        this.printCacheListCount();
    }

    private static printCacheListCount(): void {
        if (!DEBUG) {
            return;
        }
        console.log("--------------------------");
        var dic = {};
        for (var key in this.cacheDbs) {
            var arr = this.cacheDbs[key];
            if (arr.length) {
                dic[key] = arr.length;
            }
        }
        console.log("存在DB数量", JSON.stringify(dic));
    }

    public static getBitmap(name: string, centerX: boolean = true, centerY: boolean = true): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        //result.scaleX = result.scaleY = 0.5;
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;

        if (centerX) {
            result.anchorOffsetX = result.width >> 1;
        }
        if (centerY) {
            result.anchorOffsetY = result.height >> 1;
        }

        return result;
    }

    public static getSound(name: string): egret.Sound {
        return RES.getRes(name);
    }

    public static loadDBAnimation(dbNames: string[]): void {
        let i: number;
        let len: number;
        let name: string;

        for (i = 0, len = dbNames.length; i < len; i++) {
            name = dbNames[i];
            let skeletonData = RES.getRes(name + "_ske_json");
            let textureData = RES.getRes(name + "_tex_json");
            let texture = RES.getRes(name + "_tex_png");
            if (skeletonData && textureData && texture) {
                AssetManager.dbFactory.parseDragonBonesData(skeletonData);
                AssetManager.dbFactory.parseTextureAtlasData(textureData, texture);
            }
        }
    }

    public static removeDBAnimation(dbNames: string[]): void {
        let i: number;
        let len: number;
        let name: string;

        for (i = 0, len = dbNames.length; i < len; i++) {
            name = dbNames[i];
            var skeletonData = RES.getRes(name + "_ske_json");
            if (!skeletonData) {
                continue;
            }
            var dragonBoneName = skeletonData.name;
            var dragonBonesData: dragonBones.DragonBonesData = AssetManager.dbFactory.getDragonBonesData(dragonBoneName);
            AssetManager.dbFactory.removeDragonBonesData(dragonBoneName);
            AssetManager.dbFactory.removeTextureAtlasData(dragonBoneName);
            for (var armatureName in dragonBonesData.armatures) {
                this.clearCacheList(armatureName);
            }
        }
    }

    public static getDBArmature(armatureName: string): DBArmature {
        let armature: dragonBones.Armature = AssetManager.dbFactory.buildArmature(armatureName);
        if (!armature) {
            return null;
        }
        let dbArmature: DBArmature = new DBArmature(armature);
        this.addCacheArmature(dbArmature);
        return dbArmature;
    }

    public static getQuickDBArmature(armatureName: string): DBArmature {
        let armature: dragonBones.Armature = AssetManager.dbFactory.buildArmature(armatureName);
        if (!armature) {
            return null;
        }
        armature.cacheFrameRate = 30;
        let dbArmature: DBArmature = new DBArmature(armature);
        this.addCacheArmature(dbArmature);
        return dbArmature;
    }

    public static changeTexture(image: egret.Bitmap, name: string) {
        let width = image.width;
        let height = image.height;
        image.texture = RES.getRes(name);
        image.width = width;
        image.height = height;
    }

    public static setText(textField: egret.TextField, str: string) {
        textField.text = str;
        textField.anchorOffsetX = textField.width >> 1;
        textField.anchorOffsetY = textField.height >> 1;
    }
}