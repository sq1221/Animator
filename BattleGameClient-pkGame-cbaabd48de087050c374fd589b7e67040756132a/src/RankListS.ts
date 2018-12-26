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

class RankListS extends egret.DisplayObjectContainer {

    public setData(list: { id: string, name: string, head: string, des: string }[]) {
        const bg = new egret.Bitmap(RES.getRes("rankBg_s_png"));
        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            const a = new RankList();
            a.setData(list);
            let selfRank = 1;
            let isSetSelf = false;
            for (let p of list) {
                if (p.id == Platform.curPlatform.platformData.userId) {
                    let data = {
                        name: p.name,
                        des: p.des,
                        head: p.head,
                        rank: selfRank.toString()
                    };
                    a.setSelfData(data);
                    isSetSelf = true;
                }
                selfRank++;
            }
            if (!isSetSelf) {
                let platformData = Platform.curPlatform.platformData
                let data = {
                    name: platformData.userName,
                    des: "XX",
                    head: platformData.userPic,
                    rank: "X"
                };
                a.setSelfData(data);
                isSetSelf = true;
            }
            this.stage.addChild(a);
        }, this);
        this.addChild(bg);

        const content = new egret.DisplayObjectContainer();
        content.x = 12;
        content.y = 30;
        this.addChild(content);
        let size = list.length > 4 ? 4 : list.length;
        for (let i = 0; i < size; ++i) {
            const data = list[i];
            const item = new egret.DisplayObjectContainer();
            item.y = i * 90;
            content.addChild(item);

            const bg = new egret.Shape();
            let bgColor: number;
            if (i == 0) {
                bgColor = 0xffb900;
            }
            else if (i == 1) {
                bgColor = 0xc0f6ff;
            }
            else if (i == 2) {
                bgColor = 0xea762f;
            }
            else {
                bgColor = 0xffffff;
            }
            bg.graphics.beginFill(bgColor);
            bg.graphics.drawRoundRect(0, 0, 80, 80, 45);
            bg.graphics.endFill();
            item.addChild(bg);

            const head = new RoleHeadImage(data.head, "rankItemBG_s_png", 70, 70);
            head.x = 5;
            head.y = 5;
            item.addChild(head);

            const numTxt = new egret.TextField();
            numTxt.size = 60;
            numTxt.x = 8;
            numTxt.y = 22;
            numTxt.scaleX = 0.7;
            numTxt.text = (i + 1) + "";
            item.addChild(numTxt);
            if (i == 0) {
                numTxt.stroke = 4;
                numTxt.strokeColor = 0xffb900;
            }
            else if (i == 1) {
                numTxt.stroke = 4;
                numTxt.strokeColor = 0xc0f6ff;
            }
            else if (i == 2) {
                numTxt.stroke = 4;
                numTxt.strokeColor = 0xea762f;
            }
        }

        const more = new egret.Bitmap(RES.getRes("rankMore_png"));
        more.x = 15;
        more.y = 392;
        this.addChild(more);
    }
}