//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI_Local extends EuiComponent {
    public loadProgress: eui.Label;
    public loadText: eui.Label;
    public gp_loading: eui.Group;
    public egretLogo: eui.Image;
    private dbArmature: DBArmature;

    public constructor() {
        super(LoadingUISkin);

        this.percentHeight = 100;
        this.percentWidth = 100;
    }

    private setLogoTexture(): void {
        if(this.dbArmature){
            return;
        }

        // [loading_ske_json,loading_tex_json,loading_tex_png];
        var res1 = RES.getRes("loading_ske_json");
        var res2 = RES.getRes("loading_tex_json");
        var res3 = RES.getRes("loading_tex_png");
        if(res1 && res2 && res3){
            AssetManager.loadDBAnimation(["loading"]);
            this.dbArmature = AssetManager.getDBArmature("loading");
            this.dbArmature.scaleX = this.dbArmature.scaleY = 1.5;
            this.dbArmature.x = this.gp_loading.width * 0.5;
            this.dbArmature.y = this.gp_loading.height;
            this.dbArmature.play("newAnimation", 0);
            this.gp_loading.addChild(this.dbArmature);
        }
    }

    private setEgretLogo(): void{
        if(!this.egretLogo.source && RES.getRes("egretLogo_png")){
            this.egretLogo.source = "egretLogo_png";
        }
    }

    public setProgress(current, total): void {
        this.setEgretLogo();
        this.setLogoTexture();
        if(this.loadProgress){
            this.loadProgress.text = "" + Math.ceil(current / total * 100) + "%";
        }
    }

    public setProgressText(text: string) {
        this.loadProgress.text = text;
        // this.loadText.text = text;
    }

    public destroy(): void {
        this.removeChildren();
        if(this.dbArmature){
            this.dbArmature.dispose();
        }
    }
}
