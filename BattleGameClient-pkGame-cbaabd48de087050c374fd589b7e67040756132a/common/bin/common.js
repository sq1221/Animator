var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
// TypeScript file
var GameExpressTip = (function (_super) {
    __extends(GameExpressTip, _super);
    function GameExpressTip() {
        var _this = _super.call(this, GameExpressSkin) || this;
        _this.numMomentPage = 1; //当前页
        //斗兽棋表情
        _this.sourceArr1 = [
            [1, 2],
            [2, 1],
            [3, 1]
        ];
        //智多星
        _this.sourceArr2 = [
            [4, 3],
            [5, 4],
            [6, 4]
        ];
        return _this;
    }
    GameExpressTip.prototype.init = function () {
        _super.prototype.init.call(this);
        this.lb_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuit, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onbegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
    };
    GameExpressTip.prototype.show = function () {
        _super.prototype.show.call(this);
        this.arrayCollection1 = new eui.ArrayCollection([]);
        this.list.itemRenderer = ItemExpressTip;
        this.list.dataProvider = this.arrayCollection1;
        this.setGameType();
    };
    GameExpressTip.prototype.onbegin = function (e) {
        this.startPot = e.stageX;
    };
    GameExpressTip.prototype.onEnd = function (e) {
        var _this = this;
        this.Scroller1.stopAnimation();
        this.EndPot = e.stageX;
        var pianyi = Math.floor(this.startPot - this.EndPot);
        //右滑
        if (pianyi > 100 && this.numMomentPage != this.sourceArr1.length) {
            // this["pot_" + this.numMomentPage].alpha = 0.4;
            this.numMomentPage++;
        }
        else if (pianyi < -100 && this.numMomentPage != 1) {
            // this["pot_" + this.numMomentPage].alpha = 0.4;
            this.numMomentPage--;
        }
        var change_Pot = 0;
        if (pianyi != 0) {
            this.pot_1.alpha = 0.4;
            this.pot_2.alpha = 0.4;
            this.pot_3.alpha = 0.4;
            //this.Scroller1.scrollPolicyH = "OFF";
            change_Pot = this.numMomentPage;
            egret.Tween.get(this.list).to({
                scrollH: (this.numMomentPage - 1) * 606
            }, 300).call(function () {
                _this["pot_" + _this.numMomentPage].alpha = 1;
                // this.Scroller1.scrollPolicyH = "ON";
            });
        }
    };
    GameExpressTip.prototype.addMesssgaeListener = function () {
        _super.prototype.addMesssgaeListener.call(this);
        // 监听离开游戏
        App.MessageCenter.addListener(EventMessage.gameCloseExpress, this.onQuit, this);
    };
    GameExpressTip.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    GameExpressTip.prototype.onCancel = function () {
        this.close();
    };
    GameExpressTip.prototype.onQuit = function (e) {
        egret.Tween.removeTweens(this.list);
        this.close();
    };
    GameExpressTip.prototype.setGameType = function () {
        var type = App.GameExpressType;
        if (type == 1) {
            this.list.height = 130;
            this.Scroller1.height = 130;
            this.gp_pot.bottom = 36;
            this.gp_express.bottom = 106;
            this.Scroller1.bottom = 72;
            this.pot_1.source = "pot_write_png";
            this.pot_2.source = "pot_write_png";
            this.pot_3.source = "pot_write_png";
        }
        else if (type == 2) {
            this.list.height = 228;
            this.Scroller1.height = 228;
            this.gp_pot.bottom = 8;
            this.gp_express.bottom = 136;
            this.Scroller1.bottom = 42;
            this.pot_1.source = "pot_zi_png";
            this.pot_2.source = "pot_zi_png";
            this.pot_3.source = "pot_zi_png";
        }
        this.img_bg.source = "express_kuang" + type + "_png";
        this.arrayCollection1.replaceAll(this["sourceArr" + type]);
    };
    return GameExpressTip;
}(StateEui));
__reflect(GameExpressTip.prototype, "GameExpressTip");
var Base64BitmapDataPool = (function () {
    function Base64BitmapDataPool() {
    }
    Base64BitmapDataPool.getData = function (imgUrl, callBack) {
        var _this = this;
        var data = this.pools[imgUrl];
        if (data) {
            data.useNum += 1;
            callBack(data.data);
        }
        else {
            if (!this.waitLoading[imgUrl]) {
                this.waitLoading[imgUrl] = [];
                this.waitLoading[imgUrl].push(callBack);
            }
            else {
                this.waitLoading[imgUrl].push(callBack);
                return;
            }
            ProxyHttp.wxImgToBase64(imgUrl, function (result) {
                var arr = result.r.data.split(",");
                egret.BitmapData.create("base64", arr[1], function (bitmapData) {
                    var texture = new egret.Texture();
                    texture._setBitmapData(bitmapData);
                    var data = {
                        data: texture,
                        useNum: 0
                    };
                    _this.pools[imgUrl] = data;
                    var callBackList = _this.waitLoading[imgUrl];
                    callBackList.forEach(function (callBack) {
                        data.useNum += 1;
                        callBack(data.data);
                    });
                    _this.waitLoading[imgUrl] = null;
                    delete _this.waitLoading[imgUrl];
                });
            });
        }
    };
    Base64BitmapDataPool.reduceUseNum = function (imgUrl) {
        var data = this.pools[imgUrl];
        if (data) {
            data.useNum -= 1;
        }
    };
    Base64BitmapDataPool.pools = {};
    Base64BitmapDataPool.waitLoading = {};
    return Base64BitmapDataPool;
}());
__reflect(Base64BitmapDataPool.prototype, "Base64BitmapDataPool");
var RoleHeadImage = (function (_super) {
    __extends(RoleHeadImage, _super);
    function RoleHeadImage(url, maskRes, headImgWidth, headImgHeight) {
        if (maskRes === void 0) { maskRes = "tou_png"; }
        if (headImgWidth === void 0) { headImgWidth = 96; }
        if (headImgHeight === void 0) { headImgHeight = 96; }
        var _this = _super.call(this) || this;
        _this.userBase64 = false;
        _this.imgUrl = url;
        _this.maskRes = maskRes;
        _this.bitmap = new egret.Bitmap();
        _this.bitmap.width = headImgWidth;
        _this.bitmap.height = headImgHeight;
        _this.bitmap.texture = RES.getRes("tou_png");
        _this.addChild(_this.bitmap);
        if (!_this.imgUrl || !_this.imgUrl.length) {
            return _this;
        }
        // //玩吧特殊处理
        // if (App.IsWanba){
        //     Base64BitmapDataPool.getData(this.imgUrl, texture => {
        //         this.setBitmap(texture);
        //         if (this.bitmap && texture) {
        //             this.userBase64 = true;
        //         }
        //     });
        //     return;
        // }
        //普通处理
        var that = _this;
        var getHeadIcoSpecial = function (url) {
            window["CrossDomainImage"].load(url, function (result, data) {
                if (result == "SUCCESS") {
                    egret.BitmapData.create("base64", data, function (bitmapData) {
                        var texture = new egret.Texture();
                        texture.bitmapData = bitmapData;
                        that.setBitmap(texture);
                    });
                }
                else {
                    console.log("error message: ", data);
                }
            });
        };
        if (_this.imgUrl.indexOf("https://") == -1 && _this.imgUrl.indexOf("http://") == -1) {
            var resName = _this.imgUrl.replace('.', '_');
            RES.getResAsync(resName, function (texture) {
                _this.setBitmap(texture);
            }, _this);
        }
        else {
            if (window["CrossDomainImage"]) {
                getHeadIcoSpecial(_this.imgUrl);
            }
            else {
                RES.getResByUrl(_this.imgUrl, function (texture) {
                    _this.setBitmap(texture);
                }, _this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
        return _this;
    }
    RoleHeadImage.prototype.setBitmap = function (texture) {
        if (!this.bitmap || !texture) {
            return;
        }
        this.bitmap.texture = texture;
        if (this.maskRes) {
            //设置遮罩
            this.maskBitmap = App.DisplayUtils.createBitmap(this.maskRes);
            this.maskBitmap.width = this.bitmap.width;
            this.maskBitmap.height = this.bitmap.height;
            this.addChild(this.maskBitmap);
            this.bitmap.mask = this.maskBitmap;
            this.cacheAsBitmap = true;
        }
    };
    RoleHeadImage.prototype.dispose = function () {
        this.removeChildren();
        this.bitmap.texture = null;
        this.bitmap = null;
        if (this.maskBitmap) {
            this.maskBitmap.texture = null;
            this.maskBitmap = null;
        }
        if (this.userBase64) {
            Base64BitmapDataPool.reduceUseNum(this.imgUrl);
        }
        this.cacheAsBitmap = false;
    };
    return RoleHeadImage;
}(egret.Sprite));
__reflect(RoleHeadImage.prototype, "RoleHeadImage");
var EventMessage = (function () {
    function EventMessage() {
    }
    EventMessage.GameLeave = "GameLeave";
    EventMessage.GameGiveUp = "GameGiveUp";
    EventMessage.gameCloseGiveUp = "gameCloseGiveUp";
    EventMessage.GameExpress = "GameExpress";
    EventMessage.GameSendExpress = "GameSendExpress";
    EventMessage.ReddotChange = "reddotChange";
    EventMessage.ChangeAvatar = "changeAvatar";
    EventMessage.WechatAppShow = "WechatAppShow";
    EventMessage.WechatShareSuccess = "WechatShareSuccess";
    EventMessage.ChatListChange = "ChatListChange";
    EventMessage.gameResultLeave = "gameResultLeave";
    EventMessage.OpenChatRoomView = "OpenChatRoomView";
    EventMessage.OpenHomePageView = "OpenHomePageView";
    EventMessage.gameCloseExpress = "gameCloseExpress";
    EventMessage.GameGetSkinView = "GameGetSkinView";
    EventMessage.MoneyChange = "MoneyChange";
    EventMessage.ResumeDanmu = "ResumeDanmu";
    EventMessage.BarrageBtnPos = "BarrageBtnPos";
    EventMessage.GameSureSelect = "GameSureSelect";
    EventMessage.HomePageViewData = "HomePageViewData";
    /**
    * 发送游戏结算分数出来，排行榜使用
    */
    EventMessage.leaderboardSetScore = "leaderboardSetScore";
    /**
    * 发送暂停消息到游戏中，各游戏自己监听消息实现暂停的处理
    */
    EventMessage.pauseMessage = "pauseMessage";
    EventMessage.SendGameResultC2S = "SendGameResultC2S";
    EventMessage.SendGameEventC2S = "SendGameEventC2S";
    EventMessage.ReceiveGameEventS2C = "ReceiveGameEventS2C";
    EventMessage.ReceiveGameResultS2C = "ReceiveGameResultS2C";
    EventMessage.AddErrQuestionC2S = "AddErrQuestionC2S";
    EventMessage.GetQuestionsC2S = "GetQuestionsC2S";
    EventMessage.GetDataC2S = "GetDataC2S";
    return EventMessage;
}());
__reflect(EventMessage.prototype, "EventMessage");
// TypeScript file
var CircleMask = (function () {
    function CircleMask() {
    }
    CircleMask.hide = function (callback) {
        if (!this.circleMask) {
            this.init();
        }
        if (!this.isHadShow) {
            //左 右
            this.rect1.width = this.rect2.width = App.GameWidth / 2;
            this.rect1.height = this.rect2.height = App.GameHeight;
            //上 下
            this.rect3.height = this.rect4.height = App.GameHeight / 2;
            this.rect3.width = this.rect4.width = App.GameWidth;
            this.circleMask.anchorOffsetX = this.circleMask.width / 2;
            this.circleMask.anchorOffsetY = this.circleMask.height / 2;
            this.circleMask.x = App.GameWidth / 2;
            this.circleMask.y = App.GameHeight / 2;
        }
        App.StageUtils.getStage().addChild(this.circleMask);
        App.StageUtils.getStage().addChild(this.rect1);
        App.StageUtils.getStage().addChild(this.rect2);
        App.StageUtils.getStage().addChild(this.rect3);
        App.StageUtils.getStage().addChild(this.rect4);
        this.circleMask.scaleX = this.circleMask.scaleY = this.multiple;
        this.rect1.x = this.circleMask.x - this.circleMask.width * this.multiple / 2 - this.rect1.width;
        this.rect2.x = this.circleMask.x + this.circleMask.width * this.multiple / 2;
        this.rect3.y = this.circleMask.y - this.circleMask.height * this.multiple / 2 - this.rect3.height;
        this.rect4.y = this.circleMask.y + this.circleMask.height * this.multiple / 2;
        this.Arr[0] = this.rect1.x;
        this.Arr[1] = this.rect2.x;
        this.Arr[2] = this.rect3.y;
        this.Arr[3] = this.rect4.y;
        var tw = egret.Tween.get(this.circleMask);
        tw.to({ scaleX: 0, scaleY: 0 }, this.time, egret.Ease.quadInOut);
        tw.call(function () {
            callback();
        });
        var tw1 = egret.Tween.get(this.rect1);
        tw1.to({ x: App.GameWidth / 2 - this.rect1.width }, this.time, egret.Ease.quadInOut);
        var tw2 = egret.Tween.get(this.rect2);
        tw2.to({ x: App.GameWidth / 2 }, this.time, egret.Ease.quadInOut);
        var tw3 = egret.Tween.get(this.rect3);
        tw3.to({ y: App.GameHeight / 2 - this.rect3.height }, this.time, egret.Ease.quadInOut);
        var tw4 = egret.Tween.get(this.rect4);
        tw4.to({ y: App.GameHeight / 2 }, this.time, egret.Ease.quadInOut);
    };
    CircleMask.show = function (callback) {
        if (!this.circleMask) {
            this.init();
        }
        this.isHadShow = true;
        //左 右
        this.rect1.width = this.rect2.width = App.GameWidth / 2;
        this.rect1.height = this.rect2.height = App.GameHeight;
        this.rect1.y = this.rect2.y = 0;
        this.rect1.x = App.GameWidth / 2 - this.rect1.width;
        this.rect2.x = App.GameWidth / 2;
        //上 下
        this.rect3.height = this.rect4.height = App.GameHeight / 2;
        this.rect3.width = this.rect4.width = App.GameWidth;
        this.rect3.x = this.rect4.x = 0;
        this.rect3.y = App.GameHeight / 2 - this.rect3.height;
        this.rect4.y = App.GameHeight / 2;
        this.circleMask.anchorOffsetX = this.circleMask.width / 2;
        this.circleMask.anchorOffsetY = this.circleMask.height / 2;
        this.circleMask.x = App.GameWidth / 2;
        this.circleMask.y = App.GameHeight / 2;
        this.circleMask.scaleX = this.circleMask.scaleY = 0;
        var tw = egret.Tween.get(this.circleMask);
        tw.to({ scaleX: this.multiple, scaleY: this.multiple }, this.time, egret.Ease.quadInOut);
        tw.call(function () {
            callback();
        });
        var tw1 = egret.Tween.get(this.rect1);
        tw1.to({ x: this.Arr[0] }, this.time, egret.Ease.quadInOut);
        var tw2 = egret.Tween.get(this.rect2);
        tw2.to({ x: this.Arr[1] }, this.time, egret.Ease.quadInOut);
        var tw3 = egret.Tween.get(this.rect3);
        tw3.to({ y: this.Arr[2] }, this.time, egret.Ease.quadInOut);
        var tw4 = egret.Tween.get(this.rect4);
        tw4.to({ y: this.Arr[3] }, this.time, egret.Ease.quadInOut);
    };
    CircleMask.init = function () {
        this.circleMask = App.DisplayUtils.createBitmap("circlePlot_png");
        //上 下 左 右
        this.rect1 = new eui.Rect();
        this.rect2 = new eui.Rect();
        this.rect3 = new eui.Rect();
        this.rect4 = new eui.Rect();
        this.rect1.fillColor = 0x000000;
        this.rect2.fillColor = 0x000000;
        this.rect3.fillColor = 0x000000;
        this.rect4.fillColor = 0x000000;
    };
    CircleMask.time = 550;
    CircleMask.multiple = 3;
    CircleMask.Arr = [];
    CircleMask.isHadShow = false;
    return CircleMask;
}());
__reflect(CircleMask.prototype, "CircleMask");
var DBAnimButton = (function (_super) {
    __extends(DBAnimButton, _super);
    function DBAnimButton(armature) {
        var _this = _super.call(this) || this;
        _this._armature = armature;
        _this._armature.gotoAndStop("normal");
        _this._armature.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, _this.onAnimComplete, _this);
        _this.addChild(_this._armature);
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouch, _this);
        return _this;
    }
    DBAnimButton.prototype.onTouch = function (e) {
        this.touch();
    };
    DBAnimButton.prototype.onAnimComplete = function (e) {
        this._armature.gotoAndStop("normal");
    };
    DBAnimButton.prototype.touch = function () {
        this._armature.play("touch");
    };
    return DBAnimButton;
}(egret.DisplayObjectContainer));
__reflect(DBAnimButton.prototype, "DBAnimButton");
var DBButton = (function (_super) {
    __extends(DBButton, _super);
    function DBButton(armature) {
        var _this = _super.call(this) || this;
        _this.touchEnabled = true;
        _this._armature = armature;
        _this._armature.gotoAndStop("normal");
        _this.addChild(_this._armature);
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegin, _this);
        return _this;
    }
    DBButton.prototype.onTouchBegin = function (e) {
        this._armature.gotoAndStop("touch");
        if (this.stage) {
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }
    };
    DBButton.prototype.onTouchEnd = function (e) {
        if (this.stage) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }
        this._armature.gotoAndStop("normal");
    };
    return DBButton;
}(egret.DisplayObjectContainer));
__reflect(DBButton.prototype, "DBButton");
var DBProgress = (function (_super) {
    __extends(DBProgress, _super);
    function DBProgress(armature) {
        var _this = _super.call(this) || this;
        _this._armature = armature;
        _this._armature.gotoAndStop("progress");
        _this.addChild(_this._armature);
        return _this;
    }
    Object.defineProperty(DBProgress.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        set: function (v) {
            this._progress = v;
            if (this._progress > 1) {
                this._progress = 1;
            }
            if (this._progress < 0) {
                this._progress = 0;
            }
            this._armature.gotoAndStopByProgress("progress", this._progress);
        },
        enumerable: true,
        configurable: true
    });
    return DBProgress;
}(egret.DisplayObjectContainer));
__reflect(DBProgress.prototype, "DBProgress");
var RoleAvatar = (function () {
    function RoleAvatar(avatarType, headUrl, defaultAvatar) {
        if (defaultAvatar === void 0) { defaultAvatar = "dbxiaoren00"; }
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
        var avaterGroup = this.getDbRes(avatarType);
        var avatarRes = this.getAvatarRes(avatarType);
        var changeAvatar = function () {
            if (!this._armature)
                return;
            var armatureData = AssetManager.dbFactory.getArmatureData(avaterGroup);
            if (!armatureData)
                return;
            var skinData = armatureData.defaultSkin;
            this._armature.replaceSkin(skinData);
            this._armature.replaceSlot("tou", this._headContainer);
        }.bind(this);
        if (RES.getRes(avatarRes[0])) {
            changeAvatar();
        }
        else {
            App.ResourceUtils.createGroup(avaterGroup, avatarRes);
            App.ResourceUtils.loadGroup(avaterGroup, function () {
                AssetManager.loadDBAnimation([avaterGroup]);
                changeAvatar();
            }, function () { }, this);
        }
    }
    Object.defineProperty(RoleAvatar.prototype, "avatarConfig", {
        get: function () {
            return RES.getRes("avatar_json");
        },
        enumerable: true,
        configurable: true
    });
    RoleAvatar.prototype.getDbRes = function (avatarType) {
        return this.avatarConfig["base"][avatarType].res;
    };
    RoleAvatar.prototype.getAvatarRes = function (avatarType) {
        var resName = this.getDbRes(avatarType);
        return [
            resName + "_ske_json",
            resName + "_tex_json",
            resName + "_tex_png"
        ];
    };
    Object.defineProperty(RoleAvatar.prototype, "armature", {
        get: function () {
            return this._armature;
        },
        enumerable: true,
        configurable: true
    });
    RoleAvatar.prototype.dispose = function () {
        this._armature.dispose();
        this._armature = null;
        this._head.dispose();
        this._head = null;
    };
    return RoleAvatar;
}());
__reflect(RoleAvatar.prototype, "RoleAvatar");
var GameReady = (function (_super) {
    __extends(GameReady, _super);
    /**
     * 提供一个准备动画，在播放完毕后可以触发回调函数，callback：回调函数
     */
    function GameReady(callback, raeadyURL, goURL) {
        if (raeadyURL === void 0) { raeadyURL = "ready_png"; }
        if (goURL === void 0) { goURL = "go_png"; }
        var _this = _super.call(this) || this;
        _this._callback = callback;
        _this.imgReady = AssetManager.getBitmap(raeadyURL);
        _this.imgGo = AssetManager.getBitmap(goURL);
        _this.addChild(_this.imgReady);
        _this.addChild(_this.imgGo);
        return _this;
    }
    GameReady.prototype.hide = function () {
        this.imgReady.alpha = 0;
        this.imgGo.alpha = 0;
    };
    GameReady.prototype.play = function () {
        var _this = this;
        this.hide();
        App.SoundManager.playEffect("readyGo_mp3");
        this.imgReady.alpha = 1;
        this.stepReady = setTimeout(function () {
            _this.hide();
            _this.imgGo.alpha = 1;
            _this.stepGo = setTimeout(function () {
                _this.hide();
                _this._callback();
                clearTimeout(_this.stepGo);
                _this.stepGo = undefined;
            }, 1000);
            clearTimeout(_this.stepReady);
            _this.stepReady = undefined;
        }, 1000);
    };
    GameReady.prototype.dispose = function () {
        if (this.stepReady) {
            clearTimeout(this.stepReady);
            this.stepReady = undefined;
        }
        if (this.stepGo) {
            clearTimeout(this.stepGo);
            this.stepGo = undefined;
        }
        this._callback = undefined;
        this.imgGo = undefined;
        this.imgReady = undefined;
    };
    return GameReady;
}(egret.DisplayObjectContainer));
__reflect(GameReady.prototype, "GameReady");
var gameResultInGame = (function (_super) {
    __extends(gameResultInGame, _super);
    function gameResultInGame() {
        var _this = _super.call(this) || this;
        _this.winTitle = AssetManager.getBitmap("win_png");
        _this.loseTitle = AssetManager.getBitmap("lose_png");
        _this.winTitle.x = -100 - _this.winTitle.width;
        _this.loseTitle.x = -100 - _this.loseTitle.width;
        _this.winTitle.y = App.GameHeight / 2;
        _this.loseTitle.y = App.GameHeight / 2;
        _this.addChild(_this.winTitle);
        _this.addChild(_this.loseTitle);
        return _this;
    }
    gameResultInGame.prototype.win = function () {
        var _this = this;
        egret.Tween.get(this.winTitle).to({ x: App.GameWidth / 2 - 50 }, 400)
            .to({ x: App.GameWidth / 2 + 50 }, 1300).to({ x: App.GameWidth + 100 }, 400).call(function () {
            _this.winTitle.x = -100 - _this.winTitle.width;
        });
    };
    gameResultInGame.prototype.lose = function () {
        var _this = this;
        egret.Tween.get(this.loseTitle).to({ x: App.GameWidth / 2 - 50 }, 400)
            .to({ x: App.GameWidth / 2 + 50 }, 1300).to({ x: App.GameWidth + 100 }, 400).call(function () {
            _this.loseTitle.x = -100 - _this.loseTitle.width;
        });
    };
    gameResultInGame.prototype.recover = function () {
        this.winTitle.x = -100 - this.winTitle.width;
        this.loseTitle.x = -100 - this.loseTitle.width;
    };
    gameResultInGame.prototype.dispose = function () {
        egret.Tween.removeTweens(this.winTitle);
        egret.Tween.removeTweens(this.loseTitle);
    };
    return gameResultInGame;
}(egret.DisplayObjectContainer));
__reflect(gameResultInGame.prototype, "gameResultInGame");
var ItemExpressTip = (function (_super) {
    __extends(ItemExpressTip, _super);
    function ItemExpressTip() {
        var _this = _super.call(this, ItemExpressTipskin) || this;
        for (var i = 1; i < 25; ++i) {
            _this["btn_" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onSendMessage, _this);
        }
        return _this;
    }
    ItemExpressTip.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
    };
    ItemExpressTip.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        //布局类型
        var type = this.data[1];
        if (type == 1) {
            this.gp_1.visible = true;
            this.gp_2.visible = false;
            this.height = 130;
            for (var j = 7; j <= 10; ++j) {
                var num = j - 6;
                this["btn_" + j].img_express.source = "express" + this.data[0] + "_" + num + "_png";
            }
        }
        else if (type == 2) {
            this.height = 130;
            this.gp_1.visible = false;
            this.gp_2.visible = true;
            for (var i = 1; i <= 6; ++i) {
                this["btn_" + i].img_express.source = "express" + this.data[0] + "_" + i + "_png";
            }
        }
        else if (type == 3) {
            this.height = 228;
            this.gp_4.visible = false;
            this.gp_3.visible = true;
            for (var j = 11; j <= 20; ++j) {
                var num = j - 10;
                this["btn_" + j].img_express.source = "express" + this.data[0] + "_" + num + "_png";
            }
        }
        else if (type == 4) {
            this.height = 228;
            this.gp_3.visible = false;
            this.gp_4.visible = true;
            for (var j = 21; j <= 24; ++j) {
                var num = j - 20;
                this["btn_" + j].img_express.source = "express" + this.data[0] + "_" + num + "_png";
            }
        }
    };
    ItemExpressTip.prototype.onSendMessage = function (e) {
        var time1 = egret.getTimer();
        if (time1 - DataCenter.instance.SendExpressTime > 500) {
            DataCenter.instance.SendExpressTime = time1;
            var str = "express" + this.data[0] + "_" + e.target.name + "_png";
            App.MessageCenter.dispatch(EventMessage.GameSendExpress, str);
        }
    };
    return ItemExpressTip;
}(EuiItemRenderer));
__reflect(ItemExpressTip.prototype, "ItemExpressTip");
// TypeScript file
var QIPaoCartoon = (function (_super) {
    __extends(QIPaoCartoon, _super);
    function QIPaoCartoon() {
        return _super.call(this, ButtonQipao) || this;
    }
    //设置资源
    QIPaoCartoon.prototype.setSouce = function (str, isOther, type) {
        if (isOther === void 0) { isOther = false; }
        if (type === void 0) { type = 0; }
        //var str:string =  
        //斗兽棋
        if (type == 0) {
            if (isOther) {
                if (str.indexOf("express1") == -1) {
                    this.btn_qipao.visible = false;
                    this.btn_qipao2.visible = true;
                    this.btn_qipao2["img"].source = str;
                    this.anchorOffsetX = this.width;
                }
                else {
                    this.btn_qipao3.visible = true;
                    this.btn_qipao3["img"].source = str;
                    this.width = this.btn_qipao3.width;
                    this.anchorOffsetX = this.width;
                }
            }
            else {
                this.btn_qipao.visible = true;
                this.btn_qipao2.visible = false;
                this.btn_qipao["img"].source = str;
            }
        }
        else if (type == 1) {
            if (isOther) {
                this.img_2.visible = true;
                this.width = this.img_2.width;
                this.anchorOffsetX = this.width;
                this.img_2.source = str;
            }
            else {
                this.img_1.visible = true;
                this.img_1.source = str;
            }
        }
    };
    //设置翻转
    QIPaoCartoon.prototype.setFanzhuan = function () {
    };
    //彈力
    QIPaoCartoon.prototype.onPlayTanDong = function () {
    };
    //设置动画
    QIPaoCartoon.prototype.onPlay = function (type) {
        var _this = this;
        if (type === void 0) { type = 0; }
        //this.scaleX = this.scaleY = 0;
        if (type == 0) {
            egret.Tween.get(this).to({ y: this.y + App.RandomUtils.limitInteger(100, 140) }, 800);
            egret.Tween.get(this).wait(500).to({ alpha: 0 }, 700).call(function () {
                _this.parent.removeChild(_this);
                egret.Tween.removeTweens(_this);
                var self = _this;
                self = null;
            });
        }
        else if (type == 1) {
            egret.Tween.get(this).to({ x: this.x + App.RandomUtils.limitInteger(100, 140) }, 800);
            egret.Tween.get(this).wait(300).to({ alpha: 0 }, 500).call(function () {
                _this.parent.removeChild(_this);
                egret.Tween.removeTweens(_this);
                var self = _this;
                self = null;
            });
        }
        else if (type == 2) {
            egret.Tween.get(this).to({ x: this.x - App.RandomUtils.limitInteger(100, 140) }, 800);
            egret.Tween.get(this).wait(300).to({ alpha: 0 }, 500).call(function () {
                _this.parent.removeChild(_this);
                egret.Tween.removeTweens(_this);
                var self = _this;
                self = null;
            });
        }
    };
    return QIPaoCartoon;
}(EuiComponent));
__reflect(QIPaoCartoon.prototype, "QIPaoCartoon");
var DataCenter = (function (_super) {
    __extends(DataCenter, _super);
    function DataCenter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.SendExpressTime = 0; //上一次发送表情的时间
        return _this;
    }
    Object.defineProperty(DataCenter, "instance", {
        get: function () {
            if (DataCenter._instance == null) {
                DataCenter._instance = new DataCenter();
            }
            return DataCenter._instance;
        },
        enumerable: true,
        configurable: true
    });
    DataCenter.prototype.initConfig = function (gameConfig) {
        this.gameConfigs = gameConfig.games;
    };
    DataCenter.prototype.getGameConfig = function (id) {
        var i;
        var len;
        for (i = 0, len = this.gameConfigs.length; i < len; i++) {
            if (this.gameConfigs[i].gameId == id) {
                return this.gameConfigs[i];
            }
        }
        return null;
    };
    return DataCenter;
}(egret.EventDispatcher));
__reflect(DataCenter.prototype, "DataCenter");
var RoomVO = (function () {
    function RoomVO(id, gameId, player, isAi) {
        this.id = id;
        this.gameId = gameId;
        this.player = player;
        this._isAi = isAi;
    }
    Object.defineProperty(RoomVO.prototype, "IsAI", {
        get: function () {
            return this._isAi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoomVO.prototype, "selfIsMaster", {
        get: function () {
            if (this._isAi) {
                return true;
            }
            var players = App.CurrChatId.split("_");
            return players[0] == DataCenter.instance.user.id.toString();
        },
        enumerable: true,
        configurable: true
    });
    return RoomVO;
}());
__reflect(RoomVO.prototype, "RoomVO");
var User = (function (_super) {
    __extends(User, _super);
    function User(id) {
        var _this = _super.call(this) || this;
        _this.name = "";
        _this.sex = 0;
        _this.imgUrl = "";
        _this.country = "";
        _this.province = "";
        _this.city = "";
        _this.money = 0;
        _this.exp = 0;
        _this.guide = 0;
        _this.constellatory = 0;
        _this.barrage_num = 0;
        _this.status = 0;
        _this.roomId = -1;
        _this.gameId = -1;
        _this.id = id;
        return _this;
    }
    User.EVENT_LOAD_COMPLETE = "EVENT_LOAD_COMPLETE";
    User.STATUS_IDLE = 0; // 空闲状态
    User.STATUS_ROOM = 1; //在房间里等待匹配
    User.STATUS_MATCHING = 2; //在房间里匹配中
    User.STATUS_GAME_LOADING = 3; //游戏加载中
    User.STATUS_GAMING = 4; //正在游戏中
    User.STATUS_GAME_RESULT = 5; //游戏结算中
    return User;
}(egret.EventDispatcher));
__reflect(User.prototype, "User");
