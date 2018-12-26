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
/**
 * Created by yangsong on 14/12/18.
 * 基类
 */
var BaseClass = (function () {
    function BaseClass() {
    }
    /**
     * 获取一个单例
     * @returns {any}
     */
    BaseClass.getInstance = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var Class = this;
        if (!Class._instance) {
            var argsLen = args.length;
            if (argsLen == 0) {
                Class._instance = new Class();
            }
            else if (argsLen == 1) {
                Class._instance = new Class(args[0]);
            }
            else if (argsLen == 2) {
                Class._instance = new Class(args[0], args[1]);
            }
            else if (argsLen == 3) {
                Class._instance = new Class(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                Class._instance = new Class(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                Class._instance = new Class(args[0], args[1], args[2], args[3], args[4]);
            }
        }
        return Class._instance;
    };
    return BaseClass;
}());
__reflect(BaseClass.prototype, "BaseClass");
/**
 * Created by yangsong on 15-2-11.
 */
var ByteArrayMsg = (function () {
    /**
     * 构造函数
     */
    function ByteArrayMsg() {
        this._msgBuffer = new egret.ByteArray();
    }
    /**
     * 接收消息处理
     * @param msg
     */
    ByteArrayMsg.prototype.receive = function (socket) {
        socket.readBytes(this._msgBuffer);
        var obj = this.decode(this._msgBuffer);
        if (obj) {
            if (true) {
                console.log("收到消息", obj.body);
            }
            App.MessageCenter.dispatch(obj.key, obj.body);
        }
        //TODO double bytearray clear
        if (this._msgBuffer.bytesAvailable == 0) {
            this._msgBuffer.clear();
        }
    };
    /**
     * 发送消息处理
     * @param msg
     */
    ByteArrayMsg.prototype.send = function (socket, msg) {
        var obj = this.encode(msg);
        if (obj) {
            if (true) {
                console.log("发送消息", msg);
            }
            obj.position = 0;
            socket.writeBytes(obj, 0, obj.bytesAvailable);
        }
    };
    /**
     * 消息解析
     * @param msg
     */
    ByteArrayMsg.prototype.decode = function (msg) {
        console.log("decode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    ByteArrayMsg.prototype.encode = function (msg) {
        console.log("encode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    return ByteArrayMsg;
}());
__reflect(ByteArrayMsg.prototype, "ByteArrayMsg", ["BaseMsg"]);
/**
 * Created by yangsong on 15-2-11.
 */
var UTFMsg = (function () {
    /**
     * 构造函数
     */
    function UTFMsg() {
    }
    /**
     * 接收消息处理
     * @param msg
     */
    UTFMsg.prototype.receive = function (socket) {
        var msg = socket.readUTF();
        var obj = this.decode(msg);
        if (obj) {
            if (true) {
                console.log("收到消息", obj);
            }
            // App.MessageCenter.dispatch(obj.key, obj.body);
            App.MessageCenter.dispatch(SocketConst.SOCKET_DATA, obj);
        }
    };
    /**
     * 发送消息处理
     * @param msg
     */
    UTFMsg.prototype.send = function (socket, msg) {
        if (true) {
            console.log("发送消息", msg);
        }
        var obj = this.encode(msg);
        if (obj) {
            socket.type = egret.WebSocket.TYPE_STRING;
            socket.writeUTF(obj);
        }
    };
    /**
     * 消息解析
     * @param msg
     */
    UTFMsg.prototype.decode = function (msg) {
        Log.trace("decode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    UTFMsg.prototype.encode = function (msg) {
        Log.trace("encode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    return UTFMsg;
}());
__reflect(UTFMsg.prototype, "UTFMsg", ["BaseMsg"]);
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
var particle;
(function (particle) {
    var Particle = (function () {
        function Particle() {
            this.matrix = new egret.Matrix();
            this.reset();
        }
        Particle.prototype.reset = function () {
            this.x = 0;
            this.y = 0;
            this.scale = 1;
            this.rotation = 0;
            this.alpha = 1;
            this.currentTime = 0;
            this.totalTime = 1000;
        };
        Particle.prototype.$getMatrix = function (regX, regY) {
            var matrix = this.matrix;
            matrix.identity();
            if (this.rotation % 360) {
                var r = this.rotation;
                var cos = egret.NumberUtils.cos(r);
                var sin = egret.NumberUtils.sin(r);
            }
            else {
                cos = 1;
                sin = 0;
            }
            matrix.append(cos * this.scale, sin * this.scale, -sin * this.scale, cos * this.scale, this.x, this.y);
            if (regX || regY) {
                matrix.tx -= regX * matrix.a + regY * matrix.c;
                matrix.ty -= regX * matrix.b + regY * matrix.d;
            }
            return matrix;
        };
        return Particle;
    }());
    particle.Particle = Particle;
    __reflect(Particle.prototype, "particle.Particle");
})(particle || (particle = {}));
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
var particle;
(function (particle_1) {
    var ParticleSystem = (function (_super) {
        __extends(ParticleSystem, _super);
        function ParticleSystem(texture, emissionRate) {
            var _this = _super.call(this) || this;
            _this._pool = [];
            _this.frameTime = 0;
            _this.particles = [];
            _this._emitterX = 0;
            _this._emitterY = 0;
            /**
             * 表示粒子出现总时间，单位毫秒，取值范围(0,Number.MAX_VALUE]，-1表示无限时间
             * @member {number} particle.ParticleSystem#emissionTime
             * @default -1
             */
            _this.emissionTime = -1;
            /**
             * 表示粒子系统最大粒子数，超过该数量将不会继续创建粒子，取值范围[1,Number.MAX_VALUE]
             * @member {number} particle.ParticleSystem#maxParticles
             * @default 200
             */
            _this.maxParticles = 200;
            /**
             * 当前粒子数
             * @member {number} particle.ParticleSystem#numParticles
             */
            _this.numParticles = 0;
            /**
             * 表示粒子类，如果设置创建粒子时将创建该类
             * @member {number} particle.ParticleSystem#particleClass
             */
            _this.particleClass = null;
            _this.$particleConfig = null;
            _this.particleMeasureRect = new egret.Rectangle();
            _this.transformForMeasure = new egret.Matrix();
            _this.bitmapNodeList = [];
            if (egret.nativeRender) {
                _this.initConfig(emissionRate, 0, 0);
                _this.changeTexture(texture);
            }
            else {
                _this.emissionRate = emissionRate;
                _this.texture = texture;
                _this.$renderNode = new egret.sys.GroupNode();
                //不清除绘制数据
                _this.$renderNode.cleanBeforeRender = function () { };
            }
            return _this;
        }
        ParticleSystem.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(10 /* PARTICLE_SYSTEM */);
        };
        ParticleSystem.prototype.initConfig = function (emissionRate, emitterX, emitterY) {
            this.$particleConfig = [
                emissionRate,
                emitterX,
                emitterY,
                0,
                200 //maxParticles
            ];
            this.emissionRate = emissionRate;
            this._emitterX = emitterX;
            this._emitterY = emitterY;
        };
        ParticleSystem.prototype.getParticle = function () {
            var result;
            if (this._pool.length) {
                result = this._pool.pop();
            }
            else if (this.particleClass) {
                result = new this.particleClass();
            }
            else {
                result = new particle_1.Particle();
            }
            return result;
        };
        ParticleSystem.prototype.removeParticle = function (particle) {
            var index = this.particles.indexOf(particle);
            if (index != -1) {
                particle.reset();
                this.particles.splice(index, 1);
                this._pool.push(particle);
                this.numParticles--;
                if (this.bitmapNodeList.length > this.numParticles) {
                    this.bitmapNodeList.length = this.numParticles;
                    this.$renderNode.drawData.length = this.numParticles;
                }
                return true;
            }
            else {
                return false;
            }
        };
        ParticleSystem.prototype.initParticle = function (particle) {
            particle.x = this.emitterX;
            particle.y = this.emitterY;
            particle.currentTime = 0;
            particle.totalTime = 1000;
        };
        /**
         * 更新当前显示对象坐标系下的边框界限
         * @param emitterRect {egret.Rectangle} 相对发射点坐标系下的界限
         */
        ParticleSystem.prototype.updateRelativeBounds = function (emitterRect) {
            if (emitterRect) {
                if (this.relativeContentBounds == null) {
                    this.relativeContentBounds = new egret.Rectangle();
                }
                this.relativeContentBounds.copyFrom(emitterRect);
                this.relativeContentBounds.x += this.emitterX;
                this.relativeContentBounds.y += this.emitterY;
            }
            else {
                this.relativeContentBounds = null;
            }
            this.mask = this.relativeContentBounds;
        };
        Object.defineProperty(ParticleSystem.prototype, "emitterBounds", {
            get: function () {
                return this._emitterBounds;
            },
            /**
             * 表示当前粒子系统中发射粒子的渲染边界范围，使用以发射点为基准的坐标系
             * @member {egret.Rectangle} particle.ParticleSystem#emitterBounds
             */
            set: function (rect) {
                this._emitterBounds = rect;
                this.updateRelativeBounds(rect);
                if (egret.nativeRender) {
                    this.onPropertyChanges();
                }
            },
            enumerable: true,
            configurable: true
        });
        ParticleSystem.prototype.onPropertyChanges = function () {
            this.$nativeDisplayObject.setCustomData(this.$particleConfig);
        };
        Object.defineProperty(ParticleSystem.prototype, "emitterX", {
            get: function () {
                return this._emitterX;
            },
            /**
             * 表示粒子出现点X坐标，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
             * @member {number} particle.ParticleSystem#emitterX
             * @default 0
             */
            set: function (value) {
                this._emitterX = value;
                this.updateRelativeBounds(this.emitterBounds);
                if (egret.nativeRender) {
                    this.onPropertyChanges();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParticleSystem.prototype, "emitterY", {
            get: function () {
                return this._emitterY;
            },
            /**
             * 表示粒子出现点Y坐标，取值范围[-Number.MAX_VALUE,Number.MAX_VALUE]
             * @member {number} particle.ParticleSystem#emitterY
             * @default 0
             */
            set: function (value) {
                this._emitterY = value;
                this.updateRelativeBounds(this.emitterBounds);
                if (egret.nativeRender) {
                    this.onPropertyChanges();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 开始创建粒子
         * @param duration {number} 粒子出现总时间
         */
        ParticleSystem.prototype.start = function (duration) {
            if (duration === void 0) { duration = -1; }
            if (this.emissionRate != 0) {
                this.emissionTime = duration;
                if (egret.nativeRender) {
                    this.$particleConfig[3] = duration;
                    this.$nativeDisplayObject.setCustomData(this.$particleConfig);
                }
                else {
                    this.timeStamp = egret.getTimer();
                    egret.startTick(this.update, this);
                }
            }
        };
        /**
         * 停止创建粒子
         * @param clear {boolean} 是否清除掉现有粒子
         */
        ParticleSystem.prototype.stop = function (clear) {
            if (clear === void 0) { clear = false; }
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setStopToParticle(clear);
                return;
            }
            this.emissionTime = 0;
            if (clear) {
                this.clear();
                egret.stopTick(this.update, this);
            }
        };
        ParticleSystem.prototype.update = function (timeStamp) {
            var dt = timeStamp - this.timeStamp;
            this.timeStamp = timeStamp;
            //粒子数很少的时候可能会错过添加粒子的时机
            if (this.emissionTime == -1 || this.emissionTime > 0) {
                this.frameTime += dt;
                while (this.frameTime > 0) {
                    if (this.numParticles < this.maxParticles) {
                        this.addOneParticle();
                    }
                    this.frameTime -= this.emissionRate;
                }
                if (this.emissionTime != -1) {
                    this.emissionTime -= dt;
                    if (this.emissionTime < 0) {
                        this.emissionTime = 0;
                    }
                }
            }
            var particle;
            var particleIndex = 0;
            while (particleIndex < this.numParticles) {
                particle = this.particles[particleIndex];
                if (particle.currentTime < particle.totalTime) {
                    this.advanceParticle(particle, dt);
                    particle.currentTime += dt;
                    particleIndex++;
                }
                else {
                    this.removeParticle(particle);
                }
            }
            this.$renderDirty = true;
            if (this.numParticles == 0 && this.emissionTime == 0) {
                egret.stopTick(this.update, this);
                this.dispatchEventWith(egret.Event.COMPLETE);
            }
            return false;
        };
        ParticleSystem.prototype.$measureContentBounds = function (bounds) {
            //如果设置了固定的区域边界则直接使用这个边界，否则进行自动的内容边界测量
            if (this.relativeContentBounds) {
                bounds.copyFrom(this.relativeContentBounds);
                return;
            }
            if (this.numParticles > 0) {
                var texture = this.texture;
                var textureW = Math.round(texture.$getScaleBitmapWidth());
                var textureH = Math.round(texture.$getScaleBitmapHeight());
                var totalRect = egret.Rectangle.create();
                var particle;
                for (var i = 0; i < this.numParticles; i++) {
                    particle = this.particles[i];
                    this.transformForMeasure.identity();
                    this.appendTransform(this.transformForMeasure, particle.x, particle.y, particle.scale, particle.scale, particle.rotation, 0, 0, textureW / 2, textureH / 2);
                    this.particleMeasureRect.setEmpty();
                    this.particleMeasureRect.width = textureW;
                    this.particleMeasureRect.height = textureH;
                    var tmpRegion = Region.create();
                    tmpRegion.updateRegion(this.particleMeasureRect, this.transformForMeasure);
                    if (i == 0) {
                        totalRect.setTo(tmpRegion.minX, tmpRegion.minY, tmpRegion.maxX - tmpRegion.minX, tmpRegion.maxY - tmpRegion.minY);
                    }
                    else {
                        var l = Math.min(totalRect.x, tmpRegion.minX);
                        var t = Math.min(totalRect.y, tmpRegion.minY);
                        var r = Math.max(totalRect.right, tmpRegion.maxX);
                        var b = Math.max(totalRect.bottom, tmpRegion.maxY);
                        totalRect.setTo(l, t, r - l, b - t);
                    }
                    Region.release(tmpRegion);
                }
                //console.log(totalRect.x + "," + totalRect.y + "," + totalRect.width + "," + totalRect.height);
                this.lastRect = totalRect;
                bounds.setTo(totalRect.x, totalRect.y, totalRect.width, totalRect.height);
                egret.Rectangle.release(totalRect);
            }
            else {
                if (this.lastRect) {
                    totalRect = this.lastRect;
                    bounds.setTo(totalRect.x, totalRect.y, totalRect.width, totalRect.height);
                    egret.Rectangle.release(totalRect);
                    this.lastRect = null;
                }
            }
        };
        ParticleSystem.prototype.setCurrentParticles = function (num) {
            if (egret.nativeRender) {
                return;
            }
            for (var i = this.numParticles; i < num && this.numParticles < this.maxParticles; i++) {
                this.addOneParticle();
            }
        };
        /**
         * 更换粒子纹理
         * @param texture {egret.Texture} 新的纹理
         */
        ParticleSystem.prototype.changeTexture = function (texture) {
            if (this.texture != texture) {
                this.texture = texture;
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setBitmapDataToParticle(texture);
                }
                else {
                    //todo 这里可以优化
                    this.bitmapNodeList.length = 0;
                    this.$renderNode.drawData.length = 0;
                }
            }
        };
        ParticleSystem.prototype.clear = function () {
            while (this.particles.length) {
                this.removeParticle(this.particles[0]);
            }
            this.numParticles = 0;
            this.$renderNode.drawData.length = 0;
            this.bitmapNodeList.length = 0;
            this.$renderDirty = true;
        };
        ParticleSystem.prototype.addOneParticle = function () {
            //todo 这里可能需要返回成功与否
            var particle = this.getParticle();
            this.initParticle(particle);
            if (particle.totalTime > 0) {
                this.particles.push(particle);
                this.numParticles++;
            }
        };
        ParticleSystem.prototype.advanceParticle = function (particle, dt) {
            particle.y -= dt / 6;
        };
        ParticleSystem.prototype.$updateRenderNode = function () {
            if (egret.nativeRender) {
                return;
            }
            if (this.numParticles > 0) {
                //todo 考虑不同粒子使用不同的texture，或者使用egret.SpriteSheet
                var texture = this.texture;
                var textureW = Math.round(texture.$getScaleBitmapWidth());
                var textureH = Math.round(texture.$getScaleBitmapHeight());
                var offsetX = texture.$offsetX;
                var offsetY = texture.$offsetY;
                var bitmapX = texture.$bitmapX;
                var bitmapY = texture.$bitmapY;
                var bitmapWidth = texture.$bitmapWidth;
                var bitmapHeight = texture.$bitmapHeight;
                var particle;
                for (var i = 0; i < this.numParticles; i++) {
                    particle = this.particles[i];
                    var bitmapNode;
                    if (!this.bitmapNodeList[i]) {
                        bitmapNode = new egret.sys.BitmapNode();
                        this.bitmapNodeList[i] = bitmapNode;
                        this.$renderNode.addNode(this.bitmapNodeList[i]);
                        bitmapNode.image = texture.$bitmapData;
                        bitmapNode.imageWidth = texture.$sourceWidth;
                        bitmapNode.imageHeight = texture.$sourceHeight;
                        bitmapNode.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureW, textureH);
                    }
                    bitmapNode = this.bitmapNodeList[i];
                    bitmapNode.matrix = particle.$getMatrix(textureW / 2, textureH / 2);
                    bitmapNode.blendMode = particle.blendMode;
                    bitmapNode.alpha = particle.alpha;
                }
            }
        };
        ParticleSystem.prototype.appendTransform = function (matrix, x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation; // * Matrix.DEG_TO_RAD;
                var cos = egret.NumberUtils.cos(r);
                var sin = egret.NumberUtils.sin(r);
            }
            else {
                cos = 1;
                sin = 0;
            }
            if (skewX || skewY) {
                // TODO: can this be combined into a single append?
                //                skewX *= Matrix.DEG_TO_RAD;
                //                skewY *= Matrix.DEG_TO_RAD;
                matrix.append(egret.NumberUtils.cos(skewY), egret.NumberUtils.sin(skewY), -egret.NumberUtils.sin(skewX), egret.NumberUtils.cos(skewX), x, y);
                matrix.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            }
            else {
                matrix.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }
            if (regX || regY) {
                // prepend the registration offset:
                matrix.tx -= regX * matrix.a + regY * matrix.c;
                matrix.ty -= regX * matrix.b + regY * matrix.d;
            }
            return matrix;
        };
        return ParticleSystem;
    }(egret.DisplayObject));
    particle_1.ParticleSystem = ParticleSystem;
    __reflect(ParticleSystem.prototype, "particle.ParticleSystem");
})(particle || (particle = {}));
var regionPool = [];
/**
 * @private
 */
var Region = (function () {
    function Region() {
        /**
         * @private
         */
        this.minX = 0;
        /**
         * @private
         */
        this.minY = 0;
        /**
         * @private
         */
        this.maxX = 0;
        /**
         * @private
         */
        this.maxY = 0;
        /**
         * @private
         */
        this.width = 0;
        /**
         * @private
         */
        this.height = 0;
        /**
         * @private
         */
        this.area = 0;
    }
    /**
     * @private
     * 释放一个Region实例到对象池
     */
    Region.release = function (region) {
        regionPool.push(region);
    };
    /**
     * @private
     * 从对象池中取出或创建一个新的Region对象。
     * 建议对于一次性使用的对象，均使用此方法创建，而不是直接new一个。
     * 使用完后调用对应的release()静态方法回收对象，能有效减少对象创建数量造成的性能开销。
     */
    Region.create = function () {
        var region = regionPool.pop();
        if (!region) {
            region = new Region();
        }
        return region;
    };
    /**
     * @private
     */
    Region.prototype.setEmpty = function () {
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.width = 0;
        this.height = 0;
        this.area = 0;
    };
    /**
     * @private
     */
    Region.prototype.updateRegion = function (bounds, matrix) {
        if (bounds.width == 0 || bounds.height == 0) {
            //todo 理论上应该是空
            this.setEmpty();
            return;
        }
        var m = matrix;
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var x = bounds.x;
        var y = bounds.y;
        var xMax = x + bounds.width;
        var yMax = y + bounds.height;
        var minX, minY, maxX, maxY;
        //优化，通常情况下不缩放旋转的对象占多数，直接加上偏移量即可。
        if (a == 1.0 && b == 0.0 && c == 0.0 && d == 1.0) {
            minX = x + tx - 1;
            minY = y + ty - 1;
            maxX = xMax + tx + 1;
            maxY = yMax + ty + 1;
        }
        else {
            var x0 = a * x + c * y + tx;
            var y0 = b * x + d * y + ty;
            var x1 = a * xMax + c * y + tx;
            var y1 = b * xMax + d * y + ty;
            var x2 = a * xMax + c * yMax + tx;
            var y2 = b * xMax + d * yMax + ty;
            var x3 = a * x + c * yMax + tx;
            var y3 = b * x + d * yMax + ty;
            var tmp = 0;
            if (x0 > x1) {
                tmp = x0;
                x0 = x1;
                x1 = tmp;
            }
            if (x2 > x3) {
                tmp = x2;
                x2 = x3;
                x3 = tmp;
            }
            minX = (x0 < x2 ? x0 : x2) - 1;
            maxX = (x1 > x3 ? x1 : x3) + 1;
            if (y0 > y1) {
                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            if (y2 > y3) {
                tmp = y2;
                y2 = y3;
                y3 = tmp;
            }
            minY = (y0 < y2 ? y0 : y2) - 1;
            maxY = (y1 > y3 ? y1 : y3) + 1;
        }
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        this.area = this.width * this.height;
    };
    return Region;
}());
__reflect(Region.prototype, "Region");
/**
 * Created by yangsong on 15-1-14.
 * Sound基类
 */
var BaseSound = (function () {
    /**
     * 构造函数
     */
    function BaseSound() {
        this._cache = {};
        this._loadingCache = new Array();
        App.TimerManager.doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }
    /**
     * 处理音乐文件的清理
     */
    BaseSound.prototype.dealSoundTimer = function () {
        var currTime = egret.getTimer();
        var keys = Object.keys(this._cache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!this.checkCanClear(key))
                continue;
            if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
                //console.log(key + "已clear")
                delete this._cache[key];
                RES.destroyRes(key);
            }
        }
    };
    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    BaseSound.prototype.getSound = function (key) {
        var sound = RES.getRes(key);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = egret.getTimer();
            }
        }
        else {
            if (this._loadingCache.indexOf(key) != -1) {
                return null;
            }
            this._loadingCache.push(key);
            RES.getResAsync(key, this.onResourceLoadComplete, this);
        }
        return sound;
    };
    /**
     * 资源加载完成
     * @param event
     */
    BaseSound.prototype.onResourceLoadComplete = function (data, key) {
        var index = this._loadingCache.indexOf(key);
        if (index != -1) {
            this._loadingCache.splice(index, 1);
            this._cache[key] = egret.getTimer();
            this.loadedPlay(key);
        }
    };
    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    BaseSound.prototype.loadedPlay = function (key) {
    };
    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    BaseSound.prototype.checkCanClear = function (key) {
        return true;
    };
    return BaseSound;
}());
__reflect(BaseSound.prototype, "BaseSound");
/**
 * Created by yangsong on 2014/11/22.
 */
var StateEui = (function (_super) {
    __extends(StateEui, _super);
    /**
     * 构造函数
     */
    function StateEui(skinClass) {
        var _this = _super.call(this) || this;
        if (typeof (skinClass) !== "function") {
            console.error("skinName请使用类名");
            return _this;
        }
        _this.skinClass = skinClass;
        _this.percentHeight = 100;
        _this.percentWidth = 100;
        return _this;
    }
    StateEui.prototype.addToParent = function (parent, param) {
        this.showParam = param;
        parent.addChild(this);
        if (!this.isInit) {
            this.once(eui.UIEvent.COMPLETE, this.initComplate, this);
            this.skinName = this.skinClass;
        }
        else {
            this.show(this.showParam);
        }
    };
    StateEui.prototype.initComplate = function () {
        this.skinClass = null;
        this.init();
        if (this.stage) {
            this.show(this.showParam);
        }
    };
    StateEui.prototype.init = function () {
        this.isInit = true;
    };
    StateEui.prototype.show = function (showParam) {
        this.addMesssgaeListener();
    };
    StateEui.prototype.addMesssgaeListener = function () {
    };
    StateEui.prototype.next = function (state, param) {
        this.dispatchEvent(new StateEvent(StateEvent.NEXT, state, param));
    };
    StateEui.prototype.popup = function (state, param) {
        this.dispatchEvent(new StateEvent(StateEvent.POPUP, state, param));
    };
    StateEui.prototype.returnToLast = function (param) {
        this.dispatchEvent(new StateEvent(StateEvent.LAST, null, param));
    };
    StateEui.prototype.tick = function (advancedTime) {
    };
    StateEui.prototype.close = function () {
        if (this.parent) {
            if (this["isPopup"]) {
                this.dispatchEvent(new StateEvent(StateEvent.POPUPCLOSE, null, null));
            }
            this.parent.removeChild(this);
            this.dispose();
        }
    };
    StateEui.prototype.dispose = function () {
        App.MessageCenter.removeAll(this);
        App.TimerManager.removeAll(this);
        this.showParam = null;
    };
    return StateEui;
}(eui.Component));
__reflect(StateEui.prototype, "StateEui", ["IState", "egret.IEventDispatcher"]);
var EuiItemRenderer = (function (_super) {
    __extends(EuiItemRenderer, _super);
    /**
     * 构造函数
     */
    function EuiItemRenderer(skinClass) {
        var _this = _super.call(this) || this;
        if (typeof (skinClass) !== "function") {
            console.error("skinName请使用类名");
            return _this;
        }
        _this.skinName = skinClass;
        return _this;
    }
    return EuiItemRenderer;
}(eui.ItemRenderer));
__reflect(EuiItemRenderer.prototype, "EuiItemRenderer");
/**
 * Created by Saco on 2014/12/1.
 */
var HotspotBitmap = (function (_super) {
    __extends(HotspotBitmap, _super);
    function HotspotBitmap() {
        var _this = _super.call(this) || this;
        _this._hotspot = [];
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouch, _this);
        return _this;
    }
    HotspotBitmap.prototype.addHotspotArea = function (rect, callBack, thisObj, para) {
        this._hotspot.push({ "rect": rect, "callBack": callBack, "thisObj": thisObj, "para": para });
    };
    HotspotBitmap.prototype.onTouch = function (e) {
        var x = e.localX;
        var y = e.localY;
        var tempObj;
        for (var i = 0; i < this._hotspot.length; i++) {
            tempObj = this._hotspot[i];
            if (tempObj.rect.contains(x, y)) {
                if (tempObj.para)
                    tempObj.callBack.call(tempObj.thisObj, tempObj.para);
                else
                    tempObj.callBack.call(tempObj.thisObj);
            }
        }
    };
    return HotspotBitmap;
}(egret.Bitmap));
__reflect(HotspotBitmap.prototype, "HotspotBitmap");
var DBArmature = (function (_super) {
    __extends(DBArmature, _super);
    function DBArmature(armature) {
        var _this = _super.call(this) || this;
        _this._displayEvents = [];
        _this._armature = armature;
        _this._armatureDisplay = armature.display;
        _this.dealClock(_this);
        // this.dealClock(this._armatureDisplay);
        _this.addChild(_this._armatureDisplay);
        return _this;
    }
    DBArmature.prototype.dealClock = function (target) {
        var _this = this;
        var addFunc = target.$onAddToStage.bind(target);
        target.$onAddToStage = function (stage, nestLevel) {
            addFunc(stage, nestLevel);
            _this.$addToClock();
        };
        var removeFunc = target.$onRemoveFromStage.bind(target);
        target.$onRemoveFromStage = function () {
            removeFunc();
            _this.$removeFromClock();
        };
    };
    DBArmature.prototype.addToClock = function (clock) {
        if (this._curClock) {
            return;
        }
        this._curClock = clock;
        this._curClock.add(this._armature);
        if (true) {
            console.log("当前运行着的DB数量", this.getRunDbNum());
        }
    };
    /**
     * 慎用
     */
    DBArmature.prototype.$addToClock = function () {
        this.addToClock(dragonBones.EgretFactory.factory.clock);
    };
    /**
     * 慎用
     */
    DBArmature.prototype.$removeFromClock = function () {
        if (!this._curClock) {
            return;
        }
        this._curClock.remove(this._armature);
        this._curClock = null;
        if (true) {
            console.log("当前运行着的DB数量", this.getRunDbNum());
        }
    };
    DBArmature.prototype.getRunDbNum = function () {
        var arr = dragonBones.EgretFactory.factory.clock["_animatebles"];
        var dic = {};
        arr.forEach(function (t) {
            if (t) {
                var name = t.armatureData.name;
                if (!dic[name]) {
                    dic[name] = 0;
                }
                dic[name]++;
            }
        });
        return JSON.stringify(dic);
    };
    DBArmature.prototype.gotoAndStop = function (animationName) {
        this._currAction = animationName;
        this._armature.animation.gotoAndStopByFrame(animationName);
    };
    DBArmature.prototype.gotoAndStopByTime = function (animationName, time) {
        this._currAction = animationName;
        this._armature.animation.gotoAndStopByTime(animationName, time);
    };
    DBArmature.prototype.gotoAndStopByProgress = function (animationName, progress) {
        this._currAction = animationName;
        this._armature.animation.gotoAndStopByProgress(animationName, progress);
    };
    DBArmature.prototype.play = function (animationName, playTimes) {
        if (playTimes === void 0) { playTimes = 0; }
        this._currAction = animationName;
        return this._armature.animation.play(animationName, playTimes);
    };
    Object.defineProperty(DBArmature.prototype, "currAction", {
        get: function () {
            return this._currAction;
        },
        enumerable: true,
        configurable: true
    });
    DBArmature.prototype.stop = function () {
        this._armature.animation.stop();
    };
    DBArmature.prototype.replaceSlot = function (slotName, display) {
        var slot = this._armature.getSlot(slotName);
        if (slot) {
            slot.display = display;
        }
    };
    DBArmature.prototype.replaceTexture = function (texture) {
        this._armature.replaceTexture(texture);
    };
    DBArmature.prototype.replaceSkin = function (skinData) {
        AssetManager.dbFactory.replaceSkin(this._armature, skinData);
    };
    Object.defineProperty(DBArmature.prototype, "armatureName", {
        get: function () {
            return this._armature.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DBArmature.prototype, "timeScale", {
        get: function () {
            return this._armature.animation.timeScale;
        },
        set: function (value) {
            if (!this._armature) {
                return;
            }
            this._armature.animation.timeScale = value;
        },
        enumerable: true,
        configurable: true
    });
    DBArmature.prototype.getSlot = function (slotName) {
        return this._armature.getSlot(slotName);
    };
    DBArmature.prototype.getBone = function (boneName) {
        return this._armature.getBone(boneName);
    };
    DBArmature.prototype.once = function (type, listener, target) {
        this._armatureDisplay.once(type, listener, target);
    };
    DBArmature.prototype.addDisplayEvent = function (type, listener, target) {
        this._armatureDisplay.addEvent(type, listener, target);
        this._displayEvents.push([type, listener, target]);
    };
    DBArmature.prototype.removeDisplayEvent = function (type, listener, target) {
        this._armatureDisplay.removeEvent(type, listener, target);
    };
    DBArmature.prototype.removeAllDisplayEvent = function () {
        while (this._displayEvents.length) {
            var arr = this._displayEvents.pop();
            this.removeDisplayEvent(arr[0], arr[1], arr[2]);
        }
    };
    DBArmature.prototype.dispose = function () {
        if (!this._armature) {
            return;
        }
        AssetManager.removeCacheArmature(this);
        this.$removeFromClock();
        this.removeAllDisplayEvent();
        egret.Tween.removeTweens(this);
        App.DisplayUtils.removeFromParent(this);
        App.DisplayUtils.removeFromParent(this._armatureDisplay);
        this._armature.dispose();
        this._armature = null;
        this._armatureDisplay = null;
    };
    return DBArmature;
}(egret.DisplayObjectContainer));
__reflect(DBArmature.prototype, "DBArmature");
/**
 * Created by yangsong on 2014/11/22.
 * Http数据缓存类
 */
var DynamicChange = (function () {
    function DynamicChange() {
        this._dataCache = [];
        this._pUpdate = new ProxyUpdate(this._dataCache);
    }
    Object.defineProperty(DynamicChange.prototype, "pUpdate", {
        get: function () {
            return this._pUpdate;
        },
        enumerable: true,
        configurable: true
    });
    DynamicChange.prototype.getCacheData = function (key) {
        if (this._dataCache[key]) {
            return this._dataCache[key];
        }
        return null;
    };
    DynamicChange.prototype.clearCache = function () {
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this._dataCache[key] = null;
            delete this._dataCache[key];
        }
    };
    DynamicChange.prototype.getCacheKeyInfos = function () {
        var results = [];
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var k = this._dataCache[key];
            results.push(k);
        }
        return results;
    };
    DynamicChange.prototype.isCache = function (key) {
        return this._dataCache[key];
    };
    return DynamicChange;
}());
__reflect(DynamicChange.prototype, "DynamicChange");
/**
 * Created by yangsong on 2014/11/22.
 * Http数据更新类
 */
var ProxyUpdate = (function () {
    function ProxyUpdate(cache) {
        this._cache = cache;
    }
    ProxyUpdate.prototype.isArray = function (key) {
        return key instanceof Array;
    };
    ProxyUpdate.prototype.isObject = function (key) {
        return key.indexOf("object") > -1;
    };
    ProxyUpdate.prototype.isNormal = function (key) {
        var isAt = key.indexOf("@") > -1;
        var isDot = key.indexOf(".") > -1;
        var isUnderline = key.indexOf("_") > -1;
        return (!isAt && !isDot && !isUnderline);
    };
    ProxyUpdate.prototype.isAddToArray = function (key) {
        return (key == "@a");
    };
    ProxyUpdate.prototype.isRemoveToArray = function (key) {
        var arr = key.split("_");
        return (arr.length <= 3 && arr[0] == "@d");
    };
    ProxyUpdate.prototype.isFilter = function (key) {
        var arr = key.split("_");
        return (arr[0] == "@f");
    };
    ProxyUpdate.prototype.isNumeric = function (v) {
        return parseFloat(v).toString() == v.toString();
    };
    ProxyUpdate.prototype._updateObject = function (name, value, cacheData) {
        var arr = name.split(".");
        if (arr[0] == "@a" || arr[0] == "@s") {
            cacheData[arr[1]] = value;
        }
        else if (arr[0] == "@d") {
            delete cacheData[arr[1]];
        }
    };
    ProxyUpdate.prototype._getFilterObject = function (filter, cacheData) {
        if (cacheData) {
            var arr = filter.split("_");
            if (arr.length == 3 && arr[0] == "@f" && this.isArray(cacheData)) {
                var key = arr[1];
                var value = arr[2];
                for (var i = 0; i < cacheData.length; i++) {
                    var v = cacheData[i];
                    if (arr.length == 3 && this.isObject(v.toString())) {
                        var cacheValue = v[key];
                        if (cacheValue) {
                            if (value[0] == "@") {
                                value = value.replace("@", "");
                            }
                            if (value == cacheValue) {
                                return v;
                            }
                        }
                    }
                }
            }
        }
        return null;
    };
    ProxyUpdate.prototype._addObjectToArray = function (cacheData, changeValue) {
        if (this.isArray(changeValue)) {
            for (var i = 0; i < changeValue.length; i++) {
                cacheData.push(changeValue[i]);
            }
        }
        else {
            cacheData.push(changeValue);
        }
    };
    ProxyUpdate.prototype._removeObjectFromArray = function (cacheData, key, changeValue) {
        var arr = key.split("_");
        if (arr.length <= 3 && arr[0] == "@d") {
            if (this.isArray(cacheData)) {
                var count = cacheData.length;
                for (var i = count - 1; i >= 0; i--) {
                    var cacheDataItem = cacheData[i];
                    if (arr.length == 3) {
                        if (cacheDataItem.hasOwnProperty(arr[1])) {
                            var val = arr[2];
                            if (val[0] == "@") {
                                val = val.replace("@", "");
                            }
                            if (val == cacheDataItem[arr[1]]) {
                                cacheData.splice(i, 1);
                            }
                        }
                    }
                    else if (arr.length == 2 && cacheDataItem.hasOwnProperty(arr[1])) {
                        if (changeValue == cacheDataItem[arr[1]]) {
                            cacheData.splice(i, 1);
                        }
                    }
                    else if (arr.length == 1) {
                        if (changeValue == cacheDataItem) {
                            cacheData.splice(i, 1);
                        }
                    }
                }
            }
        }
    };
    ProxyUpdate.prototype.update = function (key, data) {
        this._cache[key] = data;
        if (data.hasOwnProperty("c")) {
            var cdata = data["c"];
            var keys = Object.keys(cdata);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k1 = keys[i];
                if (this._cache[k1]) {
                    this._update(this._cache[k1], cdata[k1]);
                    App.MessageCenter.dispatch(k1 + "_HttpUpdate");
                }
            }
        }
    };
    ProxyUpdate.prototype._update = function (cacheData, changeData) {
        if (cacheData && changeData && this.isObject(changeData.toString())) {
            var keys = Object.keys(changeData);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k = keys[i];
                var v = changeData[k];
                if (this.isNormal(k) && this.isObject(v.toString())) {
                    if (cacheData.hasOwnProperty(k)) {
                        this._update(cacheData[k], v);
                    }
                }
                else if (this.isNormal(k) && this.isNumeric(v)) {
                    var cv = cacheData[k];
                    cacheData[k] = cv + v;
                }
                else if (this.isNormal(k)) {
                    cacheData[k] = v;
                }
                else if (this.isAddToArray(k)) {
                    this._addObjectToArray(cacheData, v);
                }
                else if (this.isRemoveToArray(k)) {
                    this._removeObjectFromArray(cacheData, k, v);
                }
                else if (this.isFilter(k)) {
                    var subCacheData = this._getFilterObject(k, cacheData);
                    if (subCacheData) {
                        this._update(subCacheData, v);
                    }
                }
                else {
                    this._updateObject(k, v, cacheData);
                }
            }
        }
    };
    return ProxyUpdate;
}());
__reflect(ProxyUpdate.prototype, "ProxyUpdate");
/**
 * Created by yangsong on 2014/11/22.
 * Http请求处理
 */
var Http = (function (_super) {
    __extends(Http, _super);
    /**
     * 构造函数
     */
    function Http() {
        var _this = _super.call(this) || this;
        _this._data = new DynamicChange();
        _this._cache = [];
        _this._request = new egret.URLRequest();
        _this._request.method = egret.URLRequestMethod.GET;
        _this._urlLoader = new egret.URLLoader();
        _this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onError, _this);
        return _this;
    }
    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    Http.prototype.initServer = function (serverUrl) {
        this._serverUrl = serverUrl;
    };
    Object.defineProperty(Http.prototype, "serverUrl", {
        /**
         * 当前服务器地址
         */
        get: function () {
            return this._serverUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Http.prototype, "Data", {
        /**
         * 数据缓存
         * @returns {DynamicChange}
         * @constructor
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Http错误处理函数
     * @param e
     */
    Http.prototype.onError = function (e) {
        this.nextPost();
        App.MessageCenter.dispatch(HttpConst.HTTP_NOCONNECT);
    };
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    Http.prototype.send = function (type, urlVariables, callBack) {
        this._cache.push([type, urlVariables, callBack]);
        this.post();
    };
    /**
     * 请求服务器
     */
    Http.prototype.post = function () {
        if (this._isRequesting) {
            return;
        }
        if (this._cache.length == 0) {
            return;
        }
        var arr = this._cache.shift();
        this._type = arr[0];
        var urlVariables = arr[1];
        this._typeCallBack = arr[2];
        this._request.url = this._serverUrl;
        this._request.data = urlVariables;
        this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._urlLoader.load(this._request);
        this._isRequesting = true;
    };
    /**
     * 数据返回
     * @param event
     */
    Http.prototype.onLoaderComplete = function (event) {
        this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        var t_obj = JSON.parse(this._urlLoader.data);
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            this._data.pUpdate.update(this._type, t_obj);
            this._typeCallBack && this._typeCallBack(t_obj);
        }
        else {
            Log.trace("Http错误:" + t_obj["s"]);
        }
        this._type = null;
        this._typeCallBack = null;
        this.nextPost();
    };
    /**
     * 开始下一个请求
     */
    Http.prototype.nextPost = function () {
        this._isRequesting = false;
        this.post();
    };
    return Http;
}(BaseClass));
__reflect(Http.prototype, "Http");
/**
 * Created by chaoshengze on 2018/04/02.
 * Http 使用常量
 */
var HttpConst = (function () {
    function HttpConst() {
    }
    /**
     * Http不能连接上
     * @type {string}
     */
    HttpConst.HTTP_NOCONNECT = "HTTP_NOCONNECT";
    return HttpConst;
}());
__reflect(HttpConst.prototype, "HttpConst");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
var ThemeAdapter = (function () {
    function ThemeAdapter() {
    }
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
        function onGetRes(e) {
            compFunc.call(thisObject, e);
        }
        function onError(e) {
            if (e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                errorFunc.call(thisObject);
            }
        }
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
        RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
    };
    return ThemeAdapter;
}());
__reflect(ThemeAdapter.prototype, "ThemeAdapter", ["eui.IThemeAdapter"]);
/**
 * Created by yangsong on 15-3-25.
 */
var ByteArrayMsgByProto = (function (_super) {
    __extends(ByteArrayMsgByProto, _super);
    /**
     * 构造函数
     */
    function ByteArrayMsgByProto() {
        return _super.call(this) || this;
    }
    /**
     * 消息解析
     * @param msg
     */
    ByteArrayMsgByProto.prototype.decode = function (msg) {
        msg.position = 0;
        if (msg.bytesAvailable == 0) {
            console.log("收到空消息");
            return null;
        }
        var len = msg.readUnsignedShort();
        if (msg.bytesAvailable >= len) {
            var bytes = new egret.ByteArray();
            msg.readBytes(bytes, 0, len);
            var msgObj = App.Proto.decode(bytes);
            var obj = {};
            obj.key = msgObj.msgId.toString();
            obj.body = msgObj;
            return obj;
        }
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    ByteArrayMsgByProto.prototype.encode = function (msg) {
        var msgBody = msg.encode();
        var len = msgBody.length;
        var sendMsg = new egret.ByteArray();
        sendMsg.writeUnsignedShort(len);
        sendMsg.writeBytes(msgBody);
        return sendMsg;
    };
    return ByteArrayMsgByProto;
}(ByteArrayMsg));
__reflect(ByteArrayMsgByProto.prototype, "ByteArrayMsgByProto");
/**
 * Created by yangsong on 2014/11/23.
 * 服务端返回消息处理
 */
var MessageCenter = (function () {
    /**
     * 构造函数
     * @param type 0:使用分帧处理 1:及时执行
     */
    function MessageCenter(type) {
        this.dict = null;
        this.type = 0;
        this.type = type;
        this.dict = {};
        this.eVec = new Array();
        this.lastRunTime = 0;
        if (this.type == 0) {
            egret.startTick(this.run, this);
        }
    }
    MessageCenter.getInstance = function () {
        return MessageCenter._instance ? MessageCenter._instance : (MessageCenter._instance = new MessageCenter(1));
    };
    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     *
     */
    MessageCenter.prototype.addListener = function (type, listener, listenerObj) {
        var arr = this.dict[type];
        if (arr == null) {
            arr = new Array();
            this.dict[type] = arr;
        }
        //检测是否已经存在
        var i = 0;
        var len = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                return;
            }
        }
        arr.push([listener, listenerObj]);
    };
    /**
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
    MessageCenter.prototype.removeListener = function (type, listener, listenerObj) {
        var arr = this.dict[type];
        if (arr == null) {
            return;
        }
        var i = 0;
        var len = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }
        if (arr.length == 0) {
            this.dict[type] = null;
            delete this.dict[type];
        }
    };
    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
    MessageCenter.prototype.removeAll = function (listenerObj) {
        var keys = Object.keys(this.dict);
        for (var i = 0, len = keys.length; i < len; i++) {
            var type = keys[i];
            var arr = this.dict[type];
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][1] == listenerObj) {
                    arr.splice(j, 1);
                    j--;
                }
            }
            if (arr.length == 0) {
                this.dict[type] = null;
                delete this.dict[type];
            }
        }
    };
    /**
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
     *
     */
    MessageCenter.prototype.dispatch = function (type) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (this.dict[type] == null) {
            return;
        }
        var vo = new MessageVo();
        vo.type = type;
        vo.param = param;
        if (this.type == 0) {
            this.eVec.push(vo);
        }
        else if (this.type == 1) {
            this.dealMsg(vo);
        }
        else {
            console.log("MessageCenter未实现的类型");
        }
    };
    /**
     * 运行
     *
     */
    MessageCenter.prototype.run = function (advancedTime) {
        var currTime = egret.getTimer();
        var inSleep = currTime - this.lastRunTime > 100;
        this.lastRunTime = currTime;
        if (inSleep) {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());
            }
        }
        else {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());
                if ((egret.getTimer() - currTime) > 5) {
                    break;
                }
            }
        }
        return true;
    };
    /**
     * 处理一条消息
     * @param msgVo
     */
    MessageCenter.prototype.dealMsg = function (msgVo) {
        var listeners = this.dict[msgVo.type];
        var i = 0;
        var len = listeners.length;
        var listener = null;
        while (i < len) {
            listener = listeners[i];
            listener[0].apply(listener[1], msgVo.param);
            if (listeners.length != len) {
                len = listeners.length;
                i--;
            }
            i++;
        }
        msgVo.dispose();
        msgVo = null;
    };
    MessageCenter._instance = null;
    return MessageCenter;
}());
__reflect(MessageCenter.prototype, "MessageCenter");
var MessageVo = (function () {
    function MessageVo() {
        this.type = null;
        this.param = null;
    }
    MessageVo.prototype.dispose = function () {
        this.type = null;
        this.param = null;
    };
    return MessageVo;
}());
__reflect(MessageVo.prototype, "MessageVo");
/**
 * Created by yangsong on 2014/11/25.
 * Socket类
 */
var Socket = (function (_super) {
    __extends(Socket, _super);
    function Socket() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._needReconnect = true;
        return _this;
    }
    /**
     * 添加事件监听
     */
    Socket.prototype.addEvents = function () {
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    };
    /**
     * 移除事件监听
     */
    Socket.prototype.removeEvents = function () {
        this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    };
    /**
     * 服务器连接成功
     */
    Socket.prototype.onSocketOpen = function () {
        this._isConnecting = true;
        if (this._isConnected) {
            App.MessageCenter.dispatch(SocketConst.SOCKET_RECONNECT);
        }
        else {
            App.MessageCenter.dispatch(SocketConst.SOCKET_CONNECT);
        }
        this._isConnected = true;
    };
    /**
     * 服务器断开连接
     */
    Socket.prototype.onSocketClose = function () {
        if (this._needReconnect) {
            this.reconnect();
        }
        else {
            this.removeEvents();
            App.MessageCenter.dispatch(SocketConst.SOCKET_CLOSE);
        }
        this._isConnecting = false;
    };
    /**
     * 服务器连接错误
     */
    Socket.prototype.onSocketError = function () {
        if (this._needReconnect) {
            this.reconnect();
        }
        else {
            this.removeEvents();
            App.MessageCenter.dispatch(SocketConst.SOCKET_NOCONNECT);
        }
        this._isConnecting = false;
    };
    /**
     * 收到服务器消息
     * @param e
     */
    Socket.prototype.onReceiveMessage = function (e) {
        this._msg.receive(this._socket);
    };
    /**
     * 初始化服务区地址
     * @param host IP
     * @param port 端口
     * @param msg 消息发送接受处理类
     */
    Socket.prototype.initServer = function (host, port, useSSL, msg, needReconnect) {
        if (needReconnect === void 0) { needReconnect = true; }
        this._host = host;
        this._port = port;
        this._useSSL = useSSL;
        this._msg = msg;
        this._needReconnect = needReconnect;
    };
    /**
     * 开始Socket连接
     */
    Socket.prototype.connect = function () {
        //防止socket的重复创建，容错处理
        if (this._isConnecting) {
            this.close();
        }
        this._socket = new egret.WebSocket();
        if (this._msg instanceof ByteArrayMsg) {
            this._socket.type = egret.WebSocket.TYPE_BINARY;
        }
        // console.log("WebSocket: " + this._host + ":" + this._port);
        this.addEvents();
        if (this._useSSL) {
            this._socket.connectByUrl("wss://" + this._host + ":" + this._port);
        }
        else {
            this._socket.connectByUrl("ws://" + this._host + ":" + this._port);
        }
    };
    /**
     * 重新连接
     */
    Socket.prototype.reconnect = function () {
        App.TimerManager.remove(this.connect, this);
        App.MessageCenter.dispatch(SocketConst.SOCKET_START_RECONNECT);
        App.TimerManager.doTimer(1000, 1, this.connect, this);
    };
    /**
     * 发送消息到服务器
     * @param msg
     */
    Socket.prototype.send = function (msg) {
        if (!this._isConnecting) {
            console.log('socket尚未连接！');
            return;
        }
        this._msg.send(this._socket, msg);
    };
    /**
     * 关闭Socket连接
     */
    Socket.prototype.close = function () {
        this._socket.close();
    };
    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
    Socket.prototype.isConnecting = function () {
        return this._isConnecting;
    };
    /**
     * Socket是否已经连接过
     * @returns {boolean}
     */
    Socket.prototype.isConnected = function () {
        return this._isConnected;
    };
    /**
     * Debug信息
     * @param str
     */
    Socket.prototype.debugInfo = function (str) {
        App.MessageCenter.dispatch(SocketConst.SOCKET_DEBUG_INFO, str);
    };
    return Socket;
}(BaseClass));
__reflect(Socket.prototype, "Socket");
/**
 * Created by yangsong on 2014/11/25.
 * Socket使用常量
 */
var SocketConst = (function () {
    function SocketConst() {
    }
    /**
     * Socket已经连接上
     * @type {string}
     */
    SocketConst.SOCKET_CONNECT = "SOCKET_CONNECT";
    /**
     * Socket重新连接上
     * @type {string}
     */
    SocketConst.SOCKET_RECONNECT = "SOCKET_RECONNECT";
    /**
     * Socket开始重新连接上
     * @type {string}
     */
    SocketConst.SOCKET_START_RECONNECT = "SOCKET_START_RECONNECT";
    /**
     * Socket已关闭
     * @type {string}
     */
    SocketConst.SOCKET_CLOSE = "SOCKET_CLOSE";
    /*
     * socket收到消息
     * */
    SocketConst.SOCKET_DATA = "SOCKET_DATA";
    /**
     * Socket不能连接上
     * @type {string}
     */
    SocketConst.SOCKET_NOCONNECT = "SOCKET_NOCONNECT";
    /**
     * Socketdebug的消息
     * @type {string}
     */
    SocketConst.SOCKET_DEBUG_INFO = "SOCKET_DEBUG_INFO";
    return SocketConst;
}());
__reflect(SocketConst.prototype, "SocketConst");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
var ThemeAdapterWx = (function () {
    function ThemeAdapterWx() {
    }
    ThemeAdapterWx.prototype.getTheme = function (url, onSuccess, onError, thisObject) {
        egret.callLater(function () {
            onSuccess.call(thisObject, generateEUI);
        }, this);
    };
    return ThemeAdapterWx;
}());
__reflect(ThemeAdapterWx.prototype, "ThemeAdapterWx", ["eui.IThemeAdapter"]);
;
/**
 * Created by yangsong on 15-3-20.
 */
var UTFMsgByJson = (function (_super) {
    __extends(UTFMsgByJson, _super);
    /**
     * 构造函数
     */
    function UTFMsgByJson() {
        return _super.call(this) || this;
    }
    /**
     * 消息解析
     * @param msg
     */
    UTFMsgByJson.prototype.decode = function (msg) {
        return JSON.parse(msg);
    };
    /**
     * 消息封装
     * @param msg
     */
    UTFMsgByJson.prototype.encode = function (msg) {
        return JSON.stringify(msg);
    };
    return UTFMsgByJson;
}(UTFMsg));
__reflect(UTFMsgByJson.prototype, "UTFMsgByJson");
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
var particle;
(function (particle) {
    var GravityParticle = (function (_super) {
        __extends(GravityParticle, _super);
        function GravityParticle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GravityParticle.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.startX = 0;
            this.startY = 0;
            this.velocityX = 0;
            this.velocityY = 0;
            this.radialAcceleration = 0;
            this.tangentialAcceleration = 0;
            this.rotationDelta = 0;
            this.scaleDelta = 0;
        };
        return GravityParticle;
    }(particle.Particle));
    particle.GravityParticle = GravityParticle;
    __reflect(GravityParticle.prototype, "particle.GravityParticle");
})(particle || (particle = {}));
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
var particle;
(function (particle_2) {
    var GravityParticleSystem = (function (_super) {
        __extends(GravityParticleSystem, _super);
        function GravityParticleSystem(texture, config) {
            var _this = _super.call(this, texture, 200) || this;
            /**
             * 是否完成解析json数据
             */
            _this.$init = false;
            _this.parseConfig(config);
            _this.emissionRate = _this.lifespan / _this.maxParticles;
            _this.particleClass = particle_2.GravityParticle;
            _this.$init = true;
            return _this;
        }
        GravityParticleSystem.prototype.start = function (duration) {
            if (duration === void 0) { duration = -1; }
            if (egret.nativeRender) {
                if (this.emissionRate != 0) {
                    this.emissionTime = duration;
                }
                this.$particleConfig[2] = duration;
                var configArray = [];
                var i = 0;
                for (var key in this.$particleConfig) {
                    configArray.push(i++);
                    configArray.push(this.$particleConfig[key]);
                }
                this.$nativeDisplayObject.setCustomData(configArray);
            }
            else {
                _super.prototype.start.call(this, duration);
            }
        };
        GravityParticleSystem.prototype.setCurrentParticles = function (num) {
            if (num > this.maxParticles) {
                return;
            }
            var configArray = [];
            configArray.push(35 /* currentParticles */);
            configArray.push(num);
            this.$nativeDisplayObject.setCustomData(configArray);
        };
        GravityParticleSystem.prototype.onPropertyChanges = function () {
            if (this.$init == false) {
                return;
            }
            var configArray = [];
            configArray.push(0 /* emitterX */);
            this.$particleConfig[0 /* emitterX */] = this._emitterX;
            configArray.push(this._emitterX);
            configArray.push(1 /* emitterY */);
            this.$particleConfig[1 /* emitterY */] = this._emitterY;
            configArray.push(this._emitterY);
            if (this.relativeContentBounds) {
                configArray.push(31 /* emitterBoundsX */);
                this.$particleConfig[31 /* emitterBoundsX */] = this.relativeContentBounds.x;
                configArray.push(this.relativeContentBounds.x);
                configArray.push(32 /* emitterBoundsY */);
                this.$particleConfig[32 /* emitterBoundsY */] = this.relativeContentBounds.y;
                configArray.push(this.relativeContentBounds.y);
                configArray.push(33 /* emitterBoundsWidth */);
                this.$particleConfig[33 /* emitterBoundsWidth */] = this.relativeContentBounds.width;
                configArray.push(this.relativeContentBounds.width);
                configArray.push(34 /* emitterBoundsHeight */);
                this.$particleConfig[34 /* emitterBoundsHeight */] = this.relativeContentBounds.height;
                configArray.push(this.relativeContentBounds.height);
            }
            this.$nativeDisplayObject.setCustomData(configArray);
        };
        GravityParticleSystem.prototype.parseConfig = function (config) {
            if (egret.nativeRender) {
                this._emitterX = getValue(config.emitter.x);
                this._emitterY = getValue(config.emitter.y);
            }
            else {
                this.emitterX = getValue(config.emitter.x);
                this.emitterY = getValue(config.emitter.y);
            }
            this.emitterXVariance = getValue(config.emitterVariance.x);
            this.emitterYVariance = getValue(config.emitterVariance.y);
            this.gravityX = getValue(config.gravity.x);
            this.gravityY = getValue(config.gravity.y);
            if (config.useEmitterRect == true) {
                var bounds = new egret.Rectangle();
                bounds.x = getValue(config.emitterRect.x);
                bounds.y = getValue(config.emitterRect.y);
                bounds.width = getValue(config.emitterRect.width);
                bounds.height = getValue(config.emitterRect.height);
                this.emitterBounds = bounds;
            }
            this.maxParticles = getValue(config.maxParticles);
            this.speed = getValue(config.speed);
            this.speedVariance = getValue(config.speedVariance);
            this.lifespan = Math.max(0.01, getValue(config.lifespan));
            this.lifespanVariance = getValue(config.lifespanVariance);
            this.emitAngle = getValue(config.emitAngle);
            this.emitAngleVariance = getValue(config.emitAngleVariance);
            this.startSize = getValue(config.startSize);
            this.startSizeVariance = getValue(config.startSizeVariance);
            this.endSize = getValue(config.endSize);
            this.endSizeVariance = getValue(config.endSizeVariance);
            this.startRotation = getValue(config.startRotation);
            this.startRotationVariance = getValue(config.startRotationVariance);
            this.endRotation = getValue(config.endRotation);
            this.endRotationVariance = getValue(config.endRotationVariance);
            this.radialAcceleration = getValue(config.radialAcceleration);
            this.radialAccelerationVariance = getValue(config.radialAccelerationVariance);
            this.tangentialAcceleration = getValue(config.tangentialAcceleration);
            this.tangentialAccelerationVariance = getValue(config.tangentialAccelerationVariance);
            this.startAlpha = getValue(config.startAlpha);
            this.startAlphaVariance = getValue(config.startAlphaVariance);
            this.endAlpha = getValue(config.endAlpha);
            this.endAlphaVariance = getValue(config.endAlphaVariance);
            if (egret.nativeRender) {
                if (config.blendMode) {
                    this.particleBlendMode = config.blendMode;
                }
            }
            else {
                this.particleBlendMode = config.blendMode;
            }
            function getValue(value) {
                if (typeof value == "undefined") {
                    return 0;
                }
                return value;
            }
            this.$particleConfig = {
                0: this.emitterX,
                1: this.emitterY,
                2: -1,
                3: this.maxParticles,
                4: this.emitterXVariance,
                5: this.emitterYVariance,
                6: this.gravityX,
                7: this.gravityY,
                8: this.speed,
                9: this.speedVariance,
                10: this.lifespan,
                11: this.lifespanVariance,
                12: this.emitAngle,
                13: this.emitAngleVariance,
                14: this.startSize,
                15: this.startSizeVariance,
                16: this.endSize,
                17: this.endSizeVariance,
                18: this.startRotation,
                19: this.startRotationVariance,
                20: this.endRotation,
                21: this.endRotationVariance,
                22: this.radialAcceleration,
                23: this.radialAccelerationVariance,
                24: this.tangentialAcceleration,
                25: this.tangentialAccelerationVariance,
                26: this.startAlpha,
                27: this.startAlphaVariance,
                28: this.endAlpha,
                29: this.endAlphaVariance,
                30: this.particleBlendMode,
                31: config.useEmitterRect ? this.relativeContentBounds.x : 0,
                32: config.useEmitterRect ? this.relativeContentBounds.y : 0,
                33: config.useEmitterRect ? this.relativeContentBounds.width : 0,
                34: config.useEmitterRect ? this.relativeContentBounds.height : 0,
                35: 0
            };
        };
        GravityParticleSystem.prototype.initParticle = function (particle) {
            var locParticle = particle;
            var lifespan = GravityParticleSystem.getValue(this.lifespan, this.lifespanVariance);
            locParticle.currentTime = 0;
            locParticle.totalTime = lifespan > 0 ? lifespan : 0;
            if (lifespan <= 0) {
                return;
            }
            locParticle.x = GravityParticleSystem.getValue(this.emitterX, this.emitterXVariance);
            locParticle.y = GravityParticleSystem.getValue(this.emitterY, this.emitterYVariance);
            locParticle.startX = this.emitterX;
            locParticle.startY = this.emitterY;
            var angle = GravityParticleSystem.getValue(this.emitAngle, this.emitAngleVariance);
            var speed = GravityParticleSystem.getValue(this.speed, this.speedVariance);
            locParticle.velocityX = speed * egret.NumberUtils.cos(angle);
            locParticle.velocityY = speed * egret.NumberUtils.sin(angle);
            locParticle.radialAcceleration = GravityParticleSystem.getValue(this.radialAcceleration, this.radialAccelerationVariance);
            locParticle.tangentialAcceleration = GravityParticleSystem.getValue(this.tangentialAcceleration, this.tangentialAccelerationVariance);
            var startSize = GravityParticleSystem.getValue(this.startSize, this.startSizeVariance);
            if (startSize < 0.1) {
                startSize = 0.1;
            }
            var endSize = GravityParticleSystem.getValue(this.endSize, this.endSizeVariance);
            if (endSize < 0.1) {
                endSize = 0.1;
            }
            var textureWidth = this.texture.textureWidth;
            locParticle.scale = startSize / textureWidth;
            locParticle.scaleDelta = ((endSize - startSize) / lifespan) / textureWidth;
            var startRotation = GravityParticleSystem.getValue(this.startRotation, this.startRotationVariance);
            var endRotation = GravityParticleSystem.getValue(this.endRotation, this.endRotationVariance);
            locParticle.rotation = startRotation;
            locParticle.rotationDelta = (endRotation - startRotation) / lifespan;
            var startAlpha = GravityParticleSystem.getValue(this.startAlpha, this.startAlphaVariance);
            var endAlpha = GravityParticleSystem.getValue(this.endAlpha, this.endAlphaVariance);
            locParticle.alpha = startAlpha;
            locParticle.alphaDelta = (endAlpha - startAlpha) / lifespan;
            locParticle.blendMode = this.particleBlendMode;
        };
        GravityParticleSystem.getValue = function (base, variance) {
            return base + variance * (Math.random() * 2 - 1);
        };
        GravityParticleSystem.prototype.advanceParticle = function (particle, dt) {
            var locParticle = particle;
            dt = dt / 1000;
            var restTime = locParticle.totalTime - locParticle.currentTime;
            dt = restTime > dt ? dt : restTime;
            locParticle.currentTime += dt;
            var distanceX = locParticle.x - locParticle.startX;
            var distanceY = locParticle.y - locParticle.startY;
            var distanceScalar = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if (distanceScalar < 0.01) {
                distanceScalar = 0.01;
            }
            var radialX = distanceX / distanceScalar;
            var radialY = distanceY / distanceScalar;
            var tangentialX = radialX;
            var tangentialY = radialY;
            radialX *= locParticle.radialAcceleration;
            radialY *= locParticle.radialAcceleration;
            var temp = tangentialX;
            tangentialX = -tangentialY * locParticle.tangentialAcceleration;
            tangentialY = temp * locParticle.tangentialAcceleration;
            locParticle.velocityX += dt * (this.gravityX + radialX + tangentialX);
            locParticle.velocityY += dt * (this.gravityY + radialY + tangentialY);
            locParticle.x += locParticle.velocityX * dt;
            locParticle.y += locParticle.velocityY * dt;
            locParticle.scale += locParticle.scaleDelta * dt * 1000;
            if (locParticle.scale < 0) {
                locParticle.scale = 0;
            }
            locParticle.rotation += locParticle.rotationDelta * dt * 1000;
            locParticle.alpha += locParticle.alphaDelta * dt * 1000;
        };
        return GravityParticleSystem;
    }(particle_2.ParticleSystem));
    particle_2.GravityParticleSystem = GravityParticleSystem;
    __reflect(GravityParticleSystem.prototype, "particle.GravityParticleSystem");
})(particle || (particle = {}));
var LanguageType = (function () {
    function LanguageType() {
    }
    LanguageType.En = "_En";
    LanguageType.Ch = "";
    return LanguageType;
}());
__reflect(LanguageType.prototype, "LanguageType");
var App = (function () {
    function App() {
    }
    Object.defineProperty(App, "MessageCenter", {
        get: function () {
            return MessageCenter.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "Socket", {
        get: function () {
            return Socket.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "Http", {
        get: function () {
            return Http.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TimerManager", {
        get: function () {
            return TimerManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DebugUtils", {
        get: function () {
            return DebugUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ResourceUtils", {
        get: function () {
            return ResourceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ClickAnimation", {
        get: function () {
            return ClickAnimation.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "SoundManager", {
        get: function () {
            return SoundManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ArrayUtils", {
        get: function () {
            return ArrayUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StageUtils", {
        get: function () {
            return StageUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "CommonUtils", {
        get: function () {
            return CommonUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DateUtils", {
        get: function () {
            return DateUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DisplayUtils", {
        get: function () {
            return DisplayUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RandomUtils", {
        get: function () {
            return RandomUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RectangleUtils", {
        get: function () {
            return RectangleUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "GameWidth", {
        get: function () {
            return App.StageUtils.getWidth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "GameHeight", {
        get: function () {
            return App.StageUtils.getHeight();
        },
        enumerable: true,
        configurable: true
    });
    App.Proto = null;
    App.Language = LanguageType.Ch;
    //-------------------------以下为全局数据存储-------------------------------//
    App.UserToken = "";
    App.CurrChatId = "";
    App.CurrGameId = 1;
    App.CurrGameIsAi = false;
    App.CurrGameAiLevel = 3; // 当前游戏AI 等级
    App.CurrRoomId = "";
    App.CurrPlatformUid = "";
    App.IsLocal = false; // 本地Local
    App.IsXiaoMi = false; // 小米
    App.IsFaceBook = false; // FaceBook
    App.IsWanba = false; // 玩吧
    App.IsLiaoZhan = false; //撩站
    return App;
}());
__reflect(App.prototype, "App");
var AnimationButton = (function (_super) {
    __extends(AnimationButton, _super);
    function AnimationButton() {
        return _super.call(this) || this;
    }
    AnimationButton.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    AnimationButton.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    AnimationButton.prototype.getCurrentState = function () {
        var state = _super.prototype.getCurrentState.call(this);
        if (state == "down") {
            this.scaleX = this.scaleY = 0.9;
        }
        else if (state == "up") {
            this.scaleX = this.scaleY = 1;
        }
        return state;
    };
    return AnimationButton;
}(eui.Button));
__reflect(AnimationButton.prototype, "AnimationButton", ["eui.UIComponent", "egret.DisplayObject"]);
/**
 * 素材需要提前加载好
 * 素材命名规则：类型_数值（有类型是因为一般会同时有几种数字图片，比如大小号或不同颜色）
 * 点号素材命名：类型_dot
 * 创建BitmapNumber使用createNumPic返回DisplayObjectContainer
 * 创建好的BitmapNumber数值需要变化是调用changeNum
 * 回收使用desstroyNumPic
 *
 * Created by Saco on 2014/8/1.
 */
var BitmapNumber = (function (_super) {
    __extends(BitmapNumber, _super);
    function BitmapNumber() {
        var _this = _super.call(this) || this;
        _this._imgPool = [];
        _this._containerPool = [];
        return _this;
    }
    /*
     * 根据需要的数字和类型返回一个DisplayObjectContainer
     * num数字值，支持小数点
     * type素材类型
     * */
    BitmapNumber.prototype.createNumPic = function (num, type) {
        var container = this.getContainer();
        var numStr = num.toString();
        var index = 0;
        var tempBm;
        for (index; index < numStr.length; index++) {
            tempBm = this.getSingleNumPic(numStr.charAt(index), type);
            container.addChild(tempBm);
        }
        this.repositionNumPic(container);
        return container;
    };
    //回收带数字的DisplayObjectContainer
    BitmapNumber.prototype.desstroyNumPic = function (picContainer) {
        this.clearContainer(picContainer);
        if (picContainer.parent)
            picContainer.parent.removeChild(picContainer);
        this._containerPool.push(picContainer);
    };
    /*
     * 改变带数字的DisplayObjectContainer数字值
     * 提供这个方法是为了提高效率，直接更换之前创建对象的texture，避免多余的删除和创建
     * */
    BitmapNumber.prototype.changeNum = function (picContainer, num, type) {
        var numStr = num.toString();
        var tempBm;
        //如果当前数字个数多于目标个数则把多余的回收
        if (picContainer.numChildren > numStr.length) {
            while (picContainer.numChildren > numStr.length) {
                this.recycleBM(picContainer.getChildAt(picContainer.numChildren - 1));
            }
        }
        var index = 0;
        var tempStr;
        for (index; index < numStr.length; index++) {
            //如果当前的Bitmap数量不够则获取新的Bitmap补齐
            if (index >= picContainer.numChildren)
                picContainer.addChild(this.getBitmap());
            tempStr = numStr.charAt(index);
            tempStr = tempStr == "." ? "dot" : tempStr;
            picContainer.getChildAt(index).texture = this.getTexture(tempStr, type);
        }
        this.repositionNumPic(picContainer);
    };
    //每个数字宽度不一样，所以重新排列
    BitmapNumber.prototype.repositionNumPic = function (container) {
        var index = 0;
        var lastX = 0;
        var temp;
        for (index; index < container.numChildren; index++) {
            temp = container.getChildAt(index);
            temp.x = lastX;
            lastX = temp.x + temp.width;
        }
    };
    //清理容器
    BitmapNumber.prototype.clearContainer = function (picContainer) {
        while (picContainer.numChildren) {
            this.recycleBM(picContainer.removeChildAt(0));
        }
    };
    //回收Bitmap
    BitmapNumber.prototype.recycleBM = function (bm) {
        if (bm && bm.parent) {
            bm.parent.removeChild(bm);
            bm.texture = null;
            this._imgPool.push(bm);
        }
    };
    BitmapNumber.prototype.getContainer = function () {
        if (this._containerPool.length)
            return this._containerPool.shift();
        return new egret.DisplayObjectContainer();
    };
    //获得单个数字Bitmap
    BitmapNumber.prototype.getSingleNumPic = function (num, type) {
        if (num == ".")
            num = "dot";
        var bm = this.getBitmap();
        bm.texture = this.getTexture(num, type);
        return bm;
    };
    BitmapNumber.prototype.getTexture = function (num, type) {
        return RES.getRes(type + num);
    };
    BitmapNumber.prototype.getBitmap = function () {
        if (this._imgPool.length)
            return this._imgPool.shift();
        return new egret.Bitmap();
    };
    return BitmapNumber;
}(BaseClass));
__reflect(BitmapNumber.prototype, "BitmapNumber");
/**
 * Created by yangsong on 15-1-14.
 * 背景音乐类
 */
var SoundBg = (function (_super) {
    __extends(SoundBg, _super);
    /**
     * 构造函数
     */
    function SoundBg() {
        var _this = _super.call(this) || this;
        _this._currBg = "";
        return _this;
    }
    /**
     * 静音
     */
    SoundBg.prototype.mute = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = 0;
        }
    };
    /**
     * 恢复音量
     */
    SoundBg.prototype.restoreVolume = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * 停止当前音乐
     */
    SoundBg.prototype.stop = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
    };
    /**
     * 播放某个音乐
     * @param effectName
     */
    SoundBg.prototype.play = function (effectName, playTime) {
        if (playTime === void 0) { playTime = 0; }
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
        this._currPlayTime = playTime;
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    };
    /**
     * 播放
     * @param sound
     */
    SoundBg.prototype.playSound = function (sound) {
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(this._currPlayTime, 0);
        this._currSoundChannel.volume = this._volume;
    };
    /**
     * 获取当前播放时间
     */
    SoundBg.prototype.getPlayTime = function () {
        if (this._currSoundChannel) {
            return this._currSoundChannel.position;
        }
        return 0;
    };
    /**
     * 设置音量
     * @param volume
     */
    SoundBg.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    SoundBg.prototype.loadedPlay = function (key) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    };
    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    SoundBg.prototype.checkCanClear = function (key) {
        return this._currBg != key;
    };
    return SoundBg;
}(BaseSound));
__reflect(SoundBg.prototype, "SoundBg");
/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
var SoundEffects = (function (_super) {
    __extends(SoundEffects, _super);
    /**
     * 构造函数
     */
    function SoundEffects() {
        var _this = _super.call(this) || this;
        _this._cacheSoundChannel = [];
        _this._playingEffects = {};
        return _this;
    }
    SoundEffects.prototype.play = function (effectName, isReplace, playTime) {
        if (isReplace === void 0) { isReplace = false; }
        if (playTime === void 0) { playTime = 1; }
        this._playTime = playTime;
        if (!isReplace) {
            if (this._playingEffects[effectName]) {
                return;
            }
        }
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(effectName, sound);
        }
    };
    SoundEffects.prototype.getSoundChannel = function (sound) {
        var channel = null;
        if (this._cacheSoundChannel.length) {
            channel = this._cacheSoundChannel.pop();
            channel["isStopped"] = false;
            channel["$url"] = sound["url"];
            channel["$loops"] = this._playTime;
            channel["$audioBuffer"] = sound["audioBuffer"];
            channel["$startTime"] = 0;
            channel["$play"]();
        }
        else {
            channel = sound.play(0, this._playTime);
        }
        return channel;
    };
    /**
     * 播放
     * @param sound
     */
    SoundEffects.prototype.playSound = function (effectName, sound) {
        var channel = this.getSoundChannel(sound);
        channel.once(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        channel.volume = this._volume;
        channel["soundName"] = effectName;
        this._playingEffects[effectName] = channel;
    };
    /**
     * 播放完成
     */
    SoundEffects.prototype.onSoundComplete = function (event) {
        var channel = event.currentTarget;
        var effectName = channel["soundName"];
        delete this._playingEffects[effectName];
        // 对象池有Bug
        // this._cacheSoundChannel.push(channel);
    };
    /**
     * 停止某个音效
     */
    SoundEffects.prototype.stopSound = function (effectName) {
        var channel = this._playingEffects[effectName];
        if (channel) {
            channel.stop();
            delete this._playingEffects[effectName];
        }
    };
    /**
     * 设置音量
     * @param volume
     */
    SoundEffects.prototype.setVolume = function (volume) {
        this._volume = volume;
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    SoundEffects.prototype.loadedPlay = function (key) {
        this.playSound(key, RES.getRes(key));
    };
    return SoundEffects;
}(BaseSound));
__reflect(SoundEffects.prototype, "SoundEffects");
/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
var SoundManager = (function (_super) {
    __extends(SoundManager, _super);
    /**
     * 构造函数
     */
    function SoundManager() {
        var _this = _super.call(this) || this;
        _this.bgOn = true;
        _this.effectOn = true;
        _this.bgVolume = 0.5;
        _this.effectVolume = 0.7;
        _this.bg = new SoundBg();
        _this.bg.setVolume(_this.bgVolume);
        _this.effect = new SoundEffects();
        _this.effect.setVolume(_this.effectVolume);
        return _this;
    }
    /**
     * 播放音效
     * @param effectName
     */
    SoundManager.prototype.playEffect = function (effectName, isReplace, playTime) {
        if (isReplace === void 0) { isReplace = false; }
        if (playTime === void 0) { playTime = 1; }
        if (!this.effectOn)
            return;
        this.effect.play(effectName, isReplace, playTime);
    };
    /**
     * 播放背景音乐
     * @param key
     */
    SoundManager.prototype.playBg = function (bgName) {
        this.currBg = bgName;
        if (!this.bgOn)
            return;
        this.bg.play(bgName);
    };
    SoundManager.prototype.pauseBg = function () {
        if (!this.bgOn)
            return;
        this.bgPlayTime = this.bg.getPlayTime();
        this.bg.stop();
    };
    /**
     * 重新播放背景音乐
     */
    SoundManager.prototype.replayBg = function () {
        if (!this.bgOn)
            return;
        this.bg.play(this.currBg, this.bgPlayTime);
    };
    /**
     * 停止背景音乐
     */
    SoundManager.prototype.stopBg = function () {
        this.bg.stop();
    };
    /**
     * 背景静音
     */
    SoundManager.prototype.muteBg = function () {
        this.bg.mute();
    };
    /**
     * 背景恢复音量
     */
    SoundManager.prototype.restoreVolumeBg = function () {
        this.bg.restoreVolume();
    };
    /**
     * 停止音效
     */
    SoundManager.prototype.stopEffect = function (effectName) {
        this.effect.stopSound(effectName);
    };
    /**
     * 设置音效是否开启
     * @param $isOn
     */
    SoundManager.prototype.setEffectOn = function ($isOn) {
        this.effectOn = $isOn;
    };
    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
    SoundManager.prototype.setBgOn = function ($isOn) {
        if (this.bgOn == $isOn) {
            return;
        }
        this.bgOn = $isOn;
        if (!this.bgOn) {
            this.stopBg();
        }
        else {
            if (this.currBg) {
                this.playBg(this.currBg);
            }
        }
    };
    /**
     * 设置背景音乐音量
     * @param volume
     */
    SoundManager.prototype.setBgVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    };
    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    SoundManager.prototype.getBgVolume = function () {
        return this.bgVolume;
    };
    /**
     * 设置音效音量
     * @param volume
     */
    SoundManager.prototype.setEffectVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        this.effect.setVolume(this.effectVolume);
    };
    /**
     * 获取音效音量
     * @returns {number}
     */
    SoundManager.prototype.getEffectVolume = function () {
        return this.effectVolume;
    };
    Object.defineProperty(SoundManager.prototype, "bgIsOn", {
        /**
         * 背景音乐是否是开启中
         */
        get: function () {
            return this.bgOn;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    SoundManager.CLEAR_TIME = 3 * 60 * 1000;
    return SoundManager;
}(BaseClass));
__reflect(SoundManager.prototype, "SoundManager");
// TypeScript file
var EuiComponent = (function (_super) {
    __extends(EuiComponent, _super);
    /**
     * 构造函数
     */
    function EuiComponent(skinClass) {
        var _this = _super.call(this) || this;
        if (typeof (skinClass) !== "function") {
            console.error("skinName请使用类名");
            return _this;
        }
        _this.skinName = skinClass;
        return _this;
    }
    return EuiComponent;
}(eui.Component));
__reflect(EuiComponent.prototype, "EuiComponent");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
var AssetAdapter = (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    };
    return AssetAdapter;
}());
__reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
var State = (function (_super) {
    __extends(State, _super);
    function State() {
        return _super.call(this) || this;
    }
    State.prototype.addToParent = function (parent, param) {
        parent.addChild(this);
        if (!this.isInit) {
            this.init();
        }
        this.show(param);
    };
    State.prototype.init = function () {
        this.isInit = true;
    };
    State.prototype.show = function (showParam) {
    };
    State.prototype.next = function (state, param) {
        this.dispatchEvent(new StateEvent(StateEvent.NEXT, state, param));
    };
    State.prototype.popup = function (state, param) {
        this.dispatchEvent(new StateEvent(StateEvent.POPUP, state, param));
    };
    State.prototype.returnToLast = function (param) {
        this.dispatchEvent(new StateEvent(StateEvent.LAST, null, param));
    };
    State.prototype.tick = function (advancedTime) {
    };
    State.prototype.close = function () {
        if (this.parent) {
            if (this["isPopup"]) {
                this.dispatchEvent(new StateEvent(StateEvent.POPUPCLOSE, null, null));
            }
            this.parent.removeChild(this);
            this.dispose();
        }
    };
    State.prototype.dispose = function () {
        App.MessageCenter.removeAll(this);
        App.TimerManager.removeAll(this);
    };
    return State;
}(egret.DisplayObjectContainer));
__reflect(State.prototype, "State", ["IState", "egret.IEventDispatcher"]);
/**
 * Created by husong on 4/10/15.
 */
var EasyLoading = (function () {
    function EasyLoading() {
    }
    EasyLoading.init = function () {
        this.content = new egret.Sprite();
        this.content.graphics.beginFill(0x000000, 0.2);
        this.content.graphics.drawRect(0, 0, App.StageUtils.getWidth(), App.StageUtils.getHeight());
        this.content.graphics.endFill();
        this.content.touchEnabled = true;
        this.dbArmature = AssetManager.getDBArmature("loading");
        this.dbArmature.x = App.StageUtils.getWidth() * 0.5;
        this.dbArmature.y = App.StageUtils.getHeight() * 0.5 + 30;
        this.dbArmature.scaleX = this.dbArmature.scaleY = 1.6;
        this.content.addChild(this.dbArmature);
    };
    EasyLoading.showLoading = function () {
        App.StageUtils.getStage().addChild(this.content);
        this.dbArmature.play("newAnimation", 0);
    };
    EasyLoading.hideLoading = function () {
        if (this.content && this.content.parent) {
            App.StageUtils.getStage().removeChild(this.content);
        }
        this.dbArmature.stop();
    };
    EasyLoading.content = null;
    return EasyLoading;
}());
__reflect(EasyLoading.prototype, "EasyLoading");
/**
 * Created by yangsong on 2014/11/22.
 */
var StateEuiAnimation = (function (_super) {
    __extends(StateEuiAnimation, _super);
    function StateEuiAnimation(skinClass) {
        return _super.call(this, skinClass) || this;
    }
    StateEuiAnimation.prototype.show = function () {
        _super.prototype.show.call(this);
        if (this.showAnimationCallback) {
            this.doShowAnimation(this.showAnimationCallback);
        }
    };
    //对外调用使用
    StateEuiAnimation.prototype.showAnimation = function (callBack) {
        this.showAnimationCallback = callBack;
    };
    //重写使用
    StateEuiAnimation.prototype.doShowAnimation = function (callBack) {
    };
    //对外调用使用
    StateEuiAnimation.prototype.removeAnimation = function (callBack) {
        this.doRemoveAnimation(callBack);
    };
    //重写使用
    StateEuiAnimation.prototype.doRemoveAnimation = function (callBack) {
    };
    return StateEuiAnimation;
}(StateEui));
__reflect(StateEuiAnimation.prototype, "StateEuiAnimation");
var StateEvent = (function (_super) {
    __extends(StateEvent, _super);
    function StateEvent(type, data, paramData, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this.data = data;
        _this.paramData = paramData;
        return _this;
    }
    StateEvent.NEXT = "NEXT";
    StateEvent.LAST = "LAST";
    StateEvent.POPUP = "POPUP";
    StateEvent.POPUPCLOSE = "POPUPCLOSE";
    return StateEvent;
}(egret.Event));
__reflect(StateEvent.prototype, "StateEvent");
var StateManager = (function () {
    function StateManager(parent, euiParent, popupParent) {
        this._parent = parent;
        this._euiParent = euiParent;
        this._popupParent = popupParent;
        this._stateObj = {};
    }
    StateManager.prototype.startTick = function () {
        this._curTime = egret.getTimer();
        egret.startTick(this.tick, this);
    };
    StateManager.prototype.stopTick = function () {
        egret.stopTick(this.tick, this);
    };
    StateManager.prototype.tick = function (advancedTime) {
        this._lastTime = this._curTime;
        this._curTime = advancedTime;
        if (this._curState) {
            this._curState.tick(this._curTime - this._lastTime);
        }
        return true;
    };
    StateManager.prototype.registerState = function (name, state) {
        this._stateObj[name] = state;
    };
    StateManager.prototype.unregisterState = function (name) {
        var state = this._stateObj[name];
        if (!state) {
            return;
        }
        this._stateObj[name] = null;
        delete this._stateObj[name];
    };
    StateManager.prototype.setCurStateName = function (name, showParam) {
        if (this._curStateName == name) {
            this._curState.show(showParam);
            return;
        }
        var state = this._stateObj[name];
        if (state) {
            this.setCurState(state, name, showParam);
        }
    };
    StateManager.prototype.addStateEvents = function (state) {
        state.addEventListener(StateEvent.NEXT, this.onNext, this);
        state.addEventListener(StateEvent.LAST, this.onLast, this);
        state.addEventListener(StateEvent.POPUP, this.onPopup, this);
        state.addEventListener(StateEvent.POPUPCLOSE, this.onPopupClose, this);
    };
    StateManager.prototype.removeStateEvents = function (state) {
        state.removeEventListener(StateEvent.NEXT, this.onNext, this);
        state.removeEventListener(StateEvent.LAST, this.onLast, this);
        state.removeEventListener(StateEvent.POPUP, this.onPopup, this);
        state.removeEventListener(StateEvent.POPUPCLOSE, this.onPopupClose, this);
    };
    StateManager.prototype.setCurState = function (state, stateName, showParam) {
        if (this._curState == state) {
            this._curState.show(showParam);
            return;
        }
        if (this._curState) {
            this.removeStateEvents(this._curState);
            this._curState.close();
            this._prevState = this._curState;
            this._prevStateName = this._curStateName;
        }
        var parent = this._parent;
        if (state instanceof StateEui) {
            parent = this._euiParent;
        }
        this._curState = state;
        this._curStateName = stateName;
        this.addStateEvents(this._curState);
        this._curState.addToParent(parent, showParam);
    };
    StateManager.prototype.onPopup = function (e) {
        var state = this._stateObj[e.data];
        if (state) {
            state["isPopup"] = true;
            this.addStateEvents(state);
            state.addToParent(this._popupParent, e.paramData);
        }
    };
    StateManager.prototype.onPopupClose = function (e) {
        var state = e.currentTarget;
        if (state) {
            this.removeStateEvents(state);
        }
    };
    StateManager.prototype.onNext = function (e) {
        var state = this._stateObj[e.data];
        if (state) {
            this.setCurState(state, e.data, e.paramData);
        }
    };
    StateManager.prototype.onLast = function (e) {
        if (this._prevState) {
            this.setCurState(this._prevState, this._prevStateName, e.paramData);
        }
    };
    Object.defineProperty(StateManager.prototype, "curState", {
        get: function () {
            return this._curState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateManager.prototype, "curStateName", {
        get: function () {
            return this._curStateName;
        },
        enumerable: true,
        configurable: true
    });
    return StateManager;
}());
__reflect(StateManager.prototype, "StateManager");
/**
 * Created by yangsong on 15-11-4.
 */
var AllAsyncExecutor = (function () {
    /**
     * 构造函数
     */
    function AllAsyncExecutor() {
        this._functions = new Array();
        this._complateNum = 0;
    }
    /**
     * 设置全部执行完成处理函数
     * @param callBack 此队列处理完成执行函数
     * @param callBackTarget 此队列处理完成执行函数所属对象
     */
    AllAsyncExecutor.prototype.setCallBack = function (callBack, callBackTarget) {
        this._callBack = callBack;
        this._callBackTarget = callBackTarget;
    };
    /**
     * 注册需要队列处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    AllAsyncExecutor.prototype.regist = function ($func, $thisObj) {
        this._functions.push([$func, $thisObj]);
    };
    /**
     * 开始执行
     */
    AllAsyncExecutor.prototype.start = function () {
        App.ArrayUtils.forEach(this._functions, function (arr) {
            arr[0].call(arr[1]);
        }, this);
    };
    /**
     * 执行完成
     */
    AllAsyncExecutor.prototype.complate = function () {
        if (!this._functions) {
            return;
        }
        this._complateNum++;
        if (this._complateNum == this._functions.length) {
            if (this._callBack) {
                this._callBack.call(this._callBackTarget);
            }
            this._callBack = null;
            this._callBackTarget = null;
            this._functions = null;
        }
    };
    return AllAsyncExecutor;
}());
__reflect(AllAsyncExecutor.prototype, "AllAsyncExecutor");
/**
 * Created by Saco on 2015/9/16.
 */
var AnchorUtil = (function () {
    function AnchorUtil() {
    }
    AnchorUtil.init = function () {
        AnchorUtil._propertyChange = Object.create(null);
        AnchorUtil._anchorChange = Object.create(null);
        AnchorUtil.injectAnchor();
    };
    AnchorUtil.setAnchorX = function (target, value) {
        target["anchorX"] = value;
    };
    AnchorUtil.setAnchorY = function (target, value) {
        target["anchorY"] = value;
    };
    AnchorUtil.setAnchor = function (target, value) {
        target["anchorX"] = target["anchorY"] = value;
    };
    AnchorUtil.getAnchor = function (target) {
        if (target["anchorX"] != target["anchorY"]) {
            console.log("target's anchorX != anchorY");
        }
        return target["anchorX"] || 0;
    };
    AnchorUtil.getAnchorY = function (target) {
        return target["anchorY"] || 0;
    };
    AnchorUtil.getAnchorX = function (target) {
        return target["anchorX"] || 0;
    };
    AnchorUtil.injectAnchor = function () {
        Object.defineProperty(egret.DisplayObject.prototype, "width", {
            get: function () {
                return this.$getWidth();
            },
            set: function (value) {
                var _this = this;
                this.$setWidth(value);
                AnchorUtil._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "height", {
            get: function () {
                return this.$getHeight();
            },
            set: function (value) {
                var _this = this;
                this.$setHeight(value);
                AnchorUtil._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorX", {
            get: function () {
                return this._anchorX;
            },
            set: function (value) {
                var _this = this;
                this._anchorX = value;
                AnchorUtil._propertyChange[this.hashCode] = true;
                AnchorUtil._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorY", {
            get: function () {
                return this._anchorY;
            },
            set: function (value) {
                var _this = this;
                this._anchorY = value;
                AnchorUtil._propertyChange[this.hashCode] = true;
                AnchorUtil._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
    };
    AnchorUtil.changeAnchor = function (tar) {
        if (AnchorUtil._propertyChange[tar.hashCode] && AnchorUtil._anchorChange[tar.hashCode]) {
            tar.anchorOffsetX = tar._anchorX * tar.width;
            tar.anchorOffsetY = tar._anchorY * tar.height;
            delete AnchorUtil._propertyChange[tar.hashCode];
        }
    };
    return AnchorUtil;
}());
__reflect(AnchorUtil.prototype, "AnchorUtil");
/**
 * Created by egret on 15-8-7.
 */
var ArrayUtils = (function (_super) {
    __extends(ArrayUtils, _super);
    function ArrayUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    ArrayUtils.prototype.forEach = function (arr, func, funcObj) {
        for (var i = 0, len = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    };
    return ArrayUtils;
}(BaseClass));
__reflect(ArrayUtils.prototype, "ArrayUtils");
var AssetManager = (function () {
    function AssetManager() {
    }
    AssetManager.clearCacheList = function (armatureName) {
        var arr = this.cacheDbs[armatureName] || [];
        while (arr.length) {
            var armature = arr[0];
            armature.dispose();
        }
        delete this.cacheDbs[armatureName];
    };
    AssetManager.removeCacheArmature = function (armature) {
        var armatureName = armature.armatureName;
        var arr = this.cacheDbs[armatureName];
        if (arr) {
            var index = arr.indexOf(armature);
            if (index != -1) {
                arr.splice(index, 1);
            }
        }
        this.printCacheListCount();
    };
    AssetManager.addCacheArmature = function (armature) {
        var armatureName = armature.armatureName;
        if (!this.cacheDbs[armatureName]) {
            this.cacheDbs[armatureName] = [];
        }
        this.cacheDbs[armatureName].push(armature);
        this.printCacheListCount();
    };
    AssetManager.printCacheListCount = function () {
        if (!true) {
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
    };
    AssetManager.getBitmap = function (name, centerX, centerY) {
        if (centerX === void 0) { centerX = true; }
        if (centerY === void 0) { centerY = true; }
        var result = new egret.Bitmap();
        //result.scaleX = result.scaleY = 0.5;
        var texture = RES.getRes(name);
        result.texture = texture;
        if (centerX) {
            result.anchorOffsetX = result.width >> 1;
        }
        if (centerY) {
            result.anchorOffsetY = result.height >> 1;
        }
        return result;
    };
    AssetManager.getSound = function (name) {
        return RES.getRes(name);
    };
    AssetManager.loadDBAnimation = function (dbNames) {
        var i;
        var len;
        var name;
        for (i = 0, len = dbNames.length; i < len; i++) {
            name = dbNames[i];
            var skeletonData = RES.getRes(name + "_ske_json");
            var textureData = RES.getRes(name + "_tex_json");
            var texture = RES.getRes(name + "_tex_png");
            if (skeletonData && textureData && texture) {
                AssetManager.dbFactory.parseDragonBonesData(skeletonData);
                AssetManager.dbFactory.parseTextureAtlasData(textureData, texture);
            }
        }
    };
    AssetManager.removeDBAnimation = function (dbNames) {
        var i;
        var len;
        var name;
        for (i = 0, len = dbNames.length; i < len; i++) {
            name = dbNames[i];
            var skeletonData = RES.getRes(name + "_ske_json");
            if (!skeletonData) {
                continue;
            }
            var dragonBoneName = skeletonData.name;
            var dragonBonesData = AssetManager.dbFactory.getDragonBonesData(dragonBoneName);
            AssetManager.dbFactory.removeDragonBonesData(dragonBoneName);
            AssetManager.dbFactory.removeTextureAtlasData(dragonBoneName);
            for (var armatureName in dragonBonesData.armatures) {
                this.clearCacheList(armatureName);
            }
        }
    };
    AssetManager.getDBArmature = function (armatureName) {
        var armature = AssetManager.dbFactory.buildArmature(armatureName);
        if (!armature) {
            return null;
        }
        var dbArmature = new DBArmature(armature);
        this.addCacheArmature(dbArmature);
        return dbArmature;
    };
    AssetManager.getQuickDBArmature = function (armatureName) {
        var armature = AssetManager.dbFactory.buildArmature(armatureName);
        if (!armature) {
            return null;
        }
        armature.cacheFrameRate = 30;
        var dbArmature = new DBArmature(armature);
        this.addCacheArmature(dbArmature);
        return dbArmature;
    };
    AssetManager.changeTexture = function (image, name) {
        var width = image.width;
        var height = image.height;
        image.texture = RES.getRes(name);
        image.width = width;
        image.height = height;
    };
    AssetManager.setText = function (textField, str) {
        textField.text = str;
        textField.anchorOffsetX = textField.width >> 1;
        textField.anchorOffsetY = textField.height >> 1;
    };
    AssetManager.dbFactory = new dragonBones.EgretFactory();
    AssetManager.cacheDbs = {};
    return AssetManager;
}());
__reflect(AssetManager.prototype, "AssetManager");
/**
 * Created by yangsong on 15-8-19.
 * 平均数工具类
 */
var AverageUtils = (function () {
    /**
     * 构造函数
     * @param $maxNum 参与计算的最大值
     */
    function AverageUtils($maxNum) {
        if ($maxNum === void 0) { $maxNum = 10; }
        this.nums = [];
        this.numsLen = 0;
        this.numSum = 0;
        this.maxNum = $maxNum;
    }
    /**
     * 加入一个值
     * @param value
     */
    AverageUtils.prototype.push = function (value) {
        if (this.numsLen > this.maxNum) {
            this.numsLen--;
            this.numSum -= this.nums.shift();
        }
        this.nums.push(value);
        this.numSum += value;
        this.numsLen++;
    };
    /**
     * 获取平均值
     * @returns {number}
     */
    AverageUtils.prototype.getValue = function () {
        return this.numSum / this.numsLen;
    };
    /**
     * 清空
     */
    AverageUtils.prototype.clear = function () {
        this.nums.splice(0);
        this.numsLen = 0;
        this.numSum = 0;
    };
    return AverageUtils;
}());
__reflect(AverageUtils.prototype, "AverageUtils");
var ClickAnimation = (function (_super) {
    __extends(ClickAnimation, _super);
    function ClickAnimation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClickAnimation.prototype.register = function (target) {
        var _this = this;
        var addFunc = target.$onAddToStage.bind(target);
        target.$onAddToStage = function (stage, nestLevel) {
            addFunc(stage, nestLevel);
            _this.addAnimation(target);
        };
        var removeFunc = target.$onRemoveFromStage.bind(target);
        target.$onRemoveFromStage = function () {
            removeFunc();
            _this.ramoveAnimation(target);
        };
        if (target.stage) {
            this.addAnimation(target);
        }
    };
    ClickAnimation.prototype.addAnimation = function (target) {
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
        target.addEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
        target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
    };
    ClickAnimation.prototype.ramoveAnimation = function (target) {
        target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
        target.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
        target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
    };
    ClickAnimation.prototype.onClickBegin = function (evt) {
        var target = evt.currentTarget;
        egret.Tween.get(target, egret.Ease.sineOut)
            .to({ scaleX: 0.9, scaleY: 0.9 }, 100);
    };
    ClickAnimation.prototype.onClickEnd = function (evt) {
        var target = evt.currentTarget;
        egret.Tween.get(target, egret.Ease.sineOut)
            .to({ scaleX: 1, scaleY: 1 }, 100);
    };
    return ClickAnimation;
}(BaseClass));
__reflect(ClickAnimation.prototype, "ClickAnimation");
/**
 * Created by yangsong on 15-1-12.
 * 通用工具类
 */
var CommonUtils = (function (_super) {
    __extends(CommonUtils, _super);
    function CommonUtils() {
        return _super.call(this) || this;
    }
    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    CommonUtils.addLableStrokeColor = function (lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * 深度复制
     * @param _data
     */
    CommonUtils.copyDataHandler = function (obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    };
    /**
     * 锁屏
     */
    CommonUtils.lock = function () {
        App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = false;
    };
    /**
     * 解屏
     */
    CommonUtils.unlock = function () {
        App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = true;
    };
    /**
     * int64转number
     * @param obj
     * @returns {number}
     */
    CommonUtils.int64ToNumber = function (obj) {
        return parseInt(obj.toString());
    };
    /**
     * 获取一个字符串的hashCode值
     */
    CommonUtils.hashCode = function (str) {
        var hash = 757602046;
        if (!str.length) {
            return hash;
        }
        for (var i = 0, len = str.length; i < len; i++) {
            var character = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash;
        }
        return hash;
    };
    /**
     * 获取一个字符串的hashCode值，>=0
     */
    CommonUtils.hashCodeAbs = function (str) {
        return Math.abs(this.hashCode(str));
    };
    /**
     * 万字的显示
     * @param label
     * @param num
     */
    CommonUtils.labelIsOverLenght = function (label, num) {
        var str = null;
        if (num < 100000) {
            str = num;
        }
        else if (num < 1000000) {
            str = Math.floor(num / 1000 / 10).toString() + "万";
        }
        else {
            str = Math.floor(num / 10000).toString() + "万";
        }
        label.text = str;
    };
    return CommonUtils;
}(BaseClass));
__reflect(CommonUtils.prototype, "CommonUtils");
/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
var DateUtils = (function (_super) {
    __extends(DateUtils, _super);
    function DateUtils() {
        return _super.call(this) || this;
    }
    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1:00:00:00   2:yyyy-mm-dd h:m:s    3:00:00   4:xx天前，xx小时前，xx分钟前
     * @return
     *
     */
    DateUtils.prototype.getFormatBySecond = function (second, type) {
        if (type === void 0) { type = 1; }
        var str = "";
        switch (type) {
            case 1:
                str = this.getFormatBySecond1(second);
                break;
            case 2:
                str = this.getFormatBySecond2(second);
                break;
            case 3:
                str = this.getFormatBySecond3(second);
                break;
            case 4:
                str = this.getFormatBySecond4(second);
                break;
            case 5:
                str = this.getFormatBySecond5(second);
                break;
        }
        return str;
    };
    //1: 00:00:00
    DateUtils.prototype.getFormatBySecond1 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var hours;
        if (hourst == 0) {
            hours = "00";
        }
        else {
            if (hourst < 10)
                hours = "0" + hourst;
            else
                hours = "" + hourst;
        }
        var minst = Math.floor((t - hourst * 3600) / 60);
        var secondt = Math.floor((t - hourst * 3600) % 60);
        var mins;
        var sens;
        if (minst == 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        }
        else if (secondt < 10) {
            sens = "0" + secondt;
        }
        else {
            sens = "" + secondt;
        }
        return hours + ":" + mins + ":" + sens;
    };
    //3: 00:00
    DateUtils.prototype.getFormatBySecond3 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var minst = Math.floor((t - hourst * 3600) / 60);
        var secondt = Math.floor((t - hourst * 3600) % 60);
        var mins;
        var sens;
        if (minst == 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        }
        else if (secondt < 10) {
            sens = "0" + secondt;
        }
        else {
            sens = "" + secondt;
        }
        return mins + ":" + sens;
    };
    //2:yyyy-mm-dd h:m:s
    DateUtils.prototype.getFormatBySecond2 = function (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
    };
    //4:xx天前，xx小时前，xx分钟前
    DateUtils.prototype.getFormatBySecond4 = function (time) {
        var t = Math.floor(time / 3600);
        if (t > 0) {
            if (t > 24) {
                return Math.floor(t / 24) + "天前";
            }
            else {
                return t + "小时前";
            }
        }
        else {
            return Math.floor(time / 60) + "分钟前";
        }
    };
    DateUtils.prototype.getFormatBySecond5 = function (time) {
        //每个时间单位所对应的秒数
        var oneDay = 3600 * 24;
        var oneHourst = 3600;
        var oneMinst = 60;
        var days = Math.floor(time / oneDay);
        var hourst = Math.floor(time % oneDay / oneHourst);
        var minst = Math.floor((time - hourst * oneHourst) / oneMinst); //Math.floor(time % oneDay % oneHourst / oneMinst);
        var secondt = Math.floor((time - hourst * oneHourst) % oneMinst); //time;
        var dayss = "";
        var hourss = "";
        var minss = "";
        var secss = "";
        if (time > 0) {
            //天
            if (days == 0) {
                dayss = "";
                //小时
                if (hourst == 0) {
                    hourss = "";
                    //分
                    if (minst == 0) {
                        minss = "";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                        return secss;
                    }
                    else {
                        minss = "" + minst + "分";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                    }
                    return minss + secss;
                }
                else {
                    hourss = hourst + "小时";
                    if (minst == 0) {
                        minss = "";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                        return secss;
                    }
                    else if (minst < 10) {
                        minss = "0" + minst + "分";
                    }
                    else {
                        minss = "" + minst + "分";
                    }
                    return hourss + minss;
                }
            }
            else {
                dayss = days + "天";
                if (hourst == 0) {
                    hourss = "";
                }
                else {
                    if (hourst < 10)
                        hourss = "0" + hourst + "小时";
                    else
                        hourss = "" + hourst + "小时";
                    ;
                }
                return dayss + hourss;
            }
        }
        return "";
    };
    return DateUtils;
}(BaseClass));
__reflect(DateUtils.prototype, "DateUtils");
/**
 * Created by yangsong on 2014/11/23.
 * Debug调试工具
 */
var DebugUtils = (function (_super) {
    __extends(DebugUtils, _super);
    function DebugUtils() {
        var _this = _super.call(this) || this;
        _this._threshold = 3;
        _this._startTimes = {};
        return _this;
    }
    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    DebugUtils.prototype.isOpen = function (flag) {
        this._isOpen = flag;
    };
    Object.defineProperty(DebugUtils.prototype, "isDebug", {
        /**
         * 是否是调试模式
         * @returns {boolean}
         */
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    DebugUtils.prototype.start = function (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * 停止
     *
     */
    DebugUtils.prototype.stop = function (key) {
        if (!this._isOpen) {
            return 0;
        }
        if (!this._startTimes[key]) {
            return 0;
        }
        var cha = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            Log.trace(key + ": " + cha);
        }
        return cha;
    };
    /**
     * 设置时间间隔阈值
     * @param value
     */
    DebugUtils.prototype.setThreshold = function (value) {
        this._threshold = value;
    };
    return DebugUtils;
}(BaseClass));
__reflect(DebugUtils.prototype, "DebugUtils");
/**
 * Created by Saco on 2014/8/2.
 */
var DelayOptManager = (function (_super) {
    __extends(DelayOptManager, _super);
    function DelayOptManager() {
        var _this = _super.call(this) || this;
        //每帧运算逻辑的时间阈值，执行代码超过这个时间就跳过到下一帧继续执行，根据实际情况调整，因为每一帧除了这里的逻辑还有别的逻辑要做对吧
        _this.TIME_THRESHOLD = 2;
        _this._delayOpts = [];
        App.TimerManager.doFrame(1, 0, _this.runCachedFun, _this);
        return _this;
    }
    DelayOptManager.prototype.addDelayOptFunction = function (thisObj, fun, funPara, callBack, para) {
        this._delayOpts.push({ "fun": fun, "funPara": funPara, "thisObj": thisObj, "callBack": callBack, "para": para });
    };
    DelayOptManager.prototype.clear = function () {
        this._delayOpts.length = 0;
    };
    DelayOptManager.prototype.stop = function () {
        App.TimerManager.remove(this.runCachedFun, this);
    };
    DelayOptManager.prototype.runCachedFun = function (f) {
        if (this._delayOpts.length == 0) {
            return;
        }
        var timeFlag = egret.getTimer();
        var funObj;
        while (this._delayOpts.length) {
            funObj = this._delayOpts.shift();
            if (funObj.funPara)
                funObj.fun.call(funObj.thisObj, funObj.funPara);
            else
                funObj.fun.call(funObj.thisObj);
            if (funObj.callBack) {
                if (funObj.para != undefined)
                    funObj.callBack.call(funObj.thisObj, funObj.para);
                else
                    funObj.callBack();
            }
            if (egret.getTimer() - timeFlag > this.TIME_THRESHOLD)
                break;
        }
    };
    return DelayOptManager;
}(BaseClass));
__reflect(DelayOptManager.prototype, "DelayOptManager");
/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
var DisplayUtils = (function (_super) {
    __extends(DisplayUtils, _super);
    /**
     * 构造函数
     */
    function DisplayUtils() {
        return _super.call(this) || this;
    }
    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    DisplayUtils.prototype.createBitmap = function (resName) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    };
    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {egret.Bitmap}
     */
    DisplayUtils.prototype.createEuiImage = function (resName) {
        var result = new eui.Image();
        var texture = RES.getRes(resName);
        result.source = texture;
        return result;
    };
    /**
     * 从父级移除child
     * @param child
     */
    DisplayUtils.prototype.removeFromParent = function (child) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    /**
     * quickAddChild
     */
    DisplayUtils.prototype.quickAddChild = function (parent, child) {
        if (egret.getOption("egretnative") === "true") {
            parent.addChild(child);
            return;
        }
        if (child.$parent == parent) {
            return;
        }
        parent.$children.push(child);
        child.$parent = parent;
        if (child instanceof DBArmature) {
            child.$addToClock();
        }
    };
    /**
     * quickRemoveChild
     */
    DisplayUtils.prototype.quickRemoveChild = function (child) {
        if (egret.getOption("egretnative") === "true") {
            this.removeFromParent(child);
            return;
        }
        var parent = child.$parent;
        if (!parent) {
            return;
        }
        var index = parent.$children.indexOf(child);
        parent.$children.splice(index, 1);
        child.$parent = null;
        if (child instanceof DBArmature) {
            child.$removeFromClock();
        }
    };
    return DisplayUtils;
}(BaseClass));
__reflect(DisplayUtils.prototype, "DisplayUtils");
/**
 * Created by yangsong on 2014/12/3.
 * 各种效果工具类
 */
var EffectUtils = (function (_super) {
    __extends(EffectUtils, _super);
    /**
     * 构造函数
     */
    function EffectUtils() {
        return _super.call(this) || this;
    }
    /**
     * 类似mac上图标上下抖动的效果
     * @param obj 要抖动的对象，使用
     * @param initY 要抖动的对象的初始Y值，原始位置
     * @example eval(macIconShake("this.btnIcon", 100));
     * @returns {string} 返回的是一个要执行代码的字符串，通过eval执行
     */
    EffectUtils.prototype.macIconShake = function (obj, initY) {
        //抖动频率[时间，移动距离]，可修改
        var arr = [
            [20, 300],
            [15, 300],
            [10, 300],
            [5, 300]
        ];
        var str = "egret.Tween.get(" + obj + ")";
        for (var i = 0, len = arr.length; i < len; i++) {
            str += ".to({'y':" + initY + "-" + arr[i][0] + "}, " + arr[i][1] + ")";
            str += ".to({'y':" + initY + "}, " + arr[i][1] + ")";
        }
        str += ";";
        return str;
    };
    /**
     * 开始闪烁
     * @param obj
     */
    EffectUtils.prototype.startFlicker = function (obj, alphaTime) {
        obj.alpha = 1;
        egret.Tween.get(obj).to({ "alpha": 0 }, alphaTime).to({ "alpha": 1 }, alphaTime).call(this.startFlicker, this, [obj, alphaTime]);
    };
    /**
     * 停止闪烁
     * @param obj
     */
    EffectUtils.prototype.stopFlicker = function (obj) {
        egret.Tween.removeTweens(obj);
    };
    return EffectUtils;
}(BaseClass));
__reflect(EffectUtils.prototype, "EffectUtils");
/**
 * 性别 设置
 */
var GameCenterGetSexIcon = (function () {
    function GameCenterGetSexIcon() {
    }
    GameCenterGetSexIcon.getSexIconSource = function (sexType) {
        var str = this.girlIcon;
        switch (sexType) {
            case 0:
            case 1:
                str = this.boyIcon;
                break;
            case 2:
                str = this.girlIcon;
                break;
        }
        return str;
    };
    GameCenterGetSexIcon.boyIcon = "img_boy_png"; // 男
    GameCenterGetSexIcon.girlIcon = "img_gril_png"; // 女
    return GameCenterGetSexIcon;
}());
__reflect(GameCenterGetSexIcon.prototype, "GameCenterGetSexIcon");
/**
 * Created by Saco on 2014/12/1.
 */
var LocationProperty = (function () {
    function LocationProperty() {
    }
    /*
     * 获取url参数值，没有返回null
     * 不传递paraUrl参数默认获取当前url
     * */
    LocationProperty.getPara = function (paraName, paraUrl) {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE)
            return null;
        var url = paraUrl || location.href;
        if (url.indexOf("?") != -1) {
            var urlPara = "&" + url.split("?")[1];
            var reg = new RegExp("\&" + paraName + "\=.*?(?:\&|$)");
            var result = reg.exec(urlPara);
            if (result) {
                var value = result[0];
                return value.split("&")[1].split("=")[1];
            }
        }
        return null;
    };
    /*
     * 给Url参数赋值
     * 不传递paraUrl参数默认获取当前url
     * */
    LocationProperty.setProperty = function (paraName, paraValue, paraUrl) {
        var url = paraUrl || location.href;
        var urlPara = "&" + url.split("?")[1];
        if (url.indexOf("?") == -1) {
            return url += "?" + paraName + "=" + paraValue;
        }
        else {
            var urlPara = url.split("?")[1];
            if (urlPara == "")
                return url += paraName + "=" + paraValue;
            var regParaKV = new RegExp("(?:^|\&)" + paraName + "\=.*?(?:\&|$)");
            var result = regParaKV.exec(urlPara);
            if (!result || result[0] == "") {
                return url += "&" + paraName + "=" + paraValue;
            }
            else {
                var oldValue = result[0];
                var regParaKey = new RegExp("\=.*$");
                var newValue = oldValue.replace(regParaKey, "=" + paraValue);
                return url.replace(oldValue, newValue);
            }
        }
    };
    /*
     * 检查url中是否包含某参数
     * 这代码有一个例外就是paraName = "undefined", paraUrl中不含"?"会返回true
     * 相信你不会这么用的 =.=
     * */
    LocationProperty.hasProperty = function (paraName, paraUrl) {
        var url = paraUrl || location.href;
        var para = "&" + url.split("?")[1]; //加&是为了把&作为参数名开始=作为参数名结束，防止uid=1&id=2此类误判
        return para.indexOf("&" + paraName + "=") != -1;
    };
    return LocationProperty;
}());
__reflect(LocationProperty.prototype, "LocationProperty");
/**
 * Created by yangsong on 2014/11/22.
 */
var Log = (function () {
    function Log() {
    }
    /**
     * Debug_Log
     * @param messsage 内容
     * @constructor
     */
    Log.trace = function () {
        var optionalParams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            optionalParams[_i] = arguments[_i];
        }
        if (App.DebugUtils.isDebug) {
            optionalParams[0] = "[DebugLog]" + optionalParams[0];
            console.log.apply(console, optionalParams);
        }
    };
    return Log;
}());
__reflect(Log.prototype, "Log");
var reserveDecimal;
(function (reserveDecimal) {
    reserveDecimal[reserveDecimal["floor"] = 0] = "floor";
    reserveDecimal[reserveDecimal["ceil"] = 1] = "ceil";
    reserveDecimal[reserveDecimal["round"] = 2] = "round";
})(reserveDecimal || (reserveDecimal = {}));
var MathUtils = (function () {
    function MathUtils() {
    }
    /**
     * 保留小数
     * @param targetNum 要进行转化的小数
     * @param digits 保留小数位数
     * @example let a =MathUtil.reserveDecimal("0.1111111111",2);
     * @returns {string} 返回的是一个小数,0.1
     */
    MathUtils.reserveDecimal = function (targetNum, digits, type) {
        if (type === void 0) { type = reserveDecimal.floor; }
        var multiple = Math.pow(10, digits);
        var tempNum = targetNum * multiple;
        switch (type) {
            case reserveDecimal.floor:
                return Math.floor(tempNum) / multiple;
            case reserveDecimal.ceil:
                return Math.ceil(tempNum) / multiple;
            case reserveDecimal.round:
                return Math.round(tempNum) / multiple;
        }
    };
    return MathUtils;
}());
__reflect(MathUtils.prototype, "MathUtils");
/**
 * Created by yangsong on 2014/11/22.
 * 对象池类
 */
var ObjectPool = (function () {
    /**
     * 构造函数
     */
    function ObjectPool() {
        this._objs = new Array();
    }
    /**
     * 放回一个对象
     * @param obj
     */
    ObjectPool.prototype.pushObj = function (obj) {
        this._objs.push(obj);
    };
    /**
     * 取出一个对象
     * @returns {*}
     */
    ObjectPool.prototype.popObj = function () {
        if (this._objs.length > 0) {
            return this._objs.pop();
        }
        else {
            return null;
        }
    };
    /**
     * 清除所有缓存对象
     */
    ObjectPool.prototype.clear = function () {
        while (this._objs.length > 0) {
            this._objs.pop();
        }
    };
    /**
     * 取出一个对象
     * @param classZ Class
     * @return Object
     *
     */
    ObjectPool.pop = function (classZ, classKey) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!ObjectPool._content[classKey]) {
            ObjectPool._content[classKey] = [];
        }
        var list = ObjectPool._content[classKey];
        if (list.length) {
            return list.pop();
        }
        else {
            var argsLen = args.length;
            var obj;
            if (argsLen == 0) {
                obj = new classZ();
            }
            else if (argsLen == 1) {
                obj = new classZ(args[0]);
            }
            else if (argsLen == 2) {
                obj = new classZ(args[0], args[1]);
            }
            else if (argsLen == 3) {
                obj = new classZ(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                obj = new classZ(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                obj = new classZ(args[0], args[1], args[2], args[3], args[4]);
            }
            obj.ObjectPoolKey = classKey;
            return obj;
        }
    };
    /**
     * 取出一个对象
     * @param refKey Class
     * @param extraKey 标识值
     * @returns {any}
     */
    ObjectPool.popWithExtraKey = function (refKey, extraKey) {
        if (!ObjectPool._content[refKey]) {
            ObjectPool._content[refKey] = [];
        }
        var obj;
        var list = ObjectPool._content[refKey];
        if (list.length) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].extraKey == extraKey) {
                    obj = list[i];
                    list.splice(i, 1);
                    break;
                }
            }
        }
        if (!obj) {
            var classZ = refKey;
            obj = new classZ(extraKey);
            obj.extraKey = extraKey;
            obj.ObjectPoolKey = refKey;
        }
        return obj;
    };
    /**
     * 放入一个对象
     * @param obj
     *
     */
    ObjectPool.push = function (obj) {
        if (obj == null) {
            return false;
        }
        var refKey = obj.ObjectPoolKey;
        //保证只有pop出来的对象可以放进来，或者是已经清除的无法放入
        if (!ObjectPool._content[refKey]) {
            return false;
        }
        ObjectPool._content[refKey].push(obj);
        return true;
    };
    /**
     * 清除所有对象
     */
    ObjectPool.clear = function () {
        ObjectPool._content = {};
    };
    /**
     * 清除某一类对象
     * @param classZ Class
     * @param clearFuncName 清除对象需要执行的函数
     */
    ObjectPool.clearClass = function (classKey, clearFuncName) {
        if (clearFuncName === void 0) { clearFuncName = null; }
        var list = ObjectPool._content[classKey];
        while (list && list.length) {
            var obj = list.pop();
            if (clearFuncName) {
                obj[clearFuncName]();
            }
            obj = null;
        }
        ObjectPool._content[classKey] = null;
        delete ObjectPool._content[classKey];
    };
    /**
     * 缓存中对象统一执行一个函数
     * @param classZ Class
     * @param dealFuncName 要执行的函数名称
     */
    ObjectPool.dealFunc = function (refKey, dealFuncName) {
        var list = ObjectPool._content[refKey];
        if (list == null) {
            return;
        }
        var i = 0;
        var len = list.length;
        for (i; i < len; i++) {
            list[i][dealFuncName]();
        }
    };
    ObjectPool._content = {};
    return ObjectPool;
}());
__reflect(ObjectPool.prototype, "ObjectPool");
/**
 * Created by yangsong on 15-8-19.
 * 队列处理
 */
var QueueExecutor = (function () {
    /**
     * 构造函数
     */
    function QueueExecutor() {
        this._functions = new Array();
    }
    /**
     * 设置全部执行完成处理函数
     * @param callBack 此队列处理完成执行函数
     * @param callBackTarget 此队列处理完成执行函数所属对象
     */
    QueueExecutor.prototype.setCallBack = function (callBack, callBackTarget) {
        this._callBack = callBack;
        this._callBackTarget = callBackTarget;
    };
    /**
     * 注册需要队列处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    QueueExecutor.prototype.regist = function ($func, $thisObj) {
        this._functions.push([$func, $thisObj]);
    };
    /**
     * 开始执行
     */
    QueueExecutor.prototype.start = function () {
        this.next();
    };
    /**
     * 执行下一个
     */
    QueueExecutor.prototype.next = function () {
        if (!this._functions) {
            return;
        }
        if (this._functions.length == 0) {
            if (this._callBack) {
                this._callBack.call(this._callBackTarget);
            }
            this._callBack = null;
            this._callBackTarget = null;
            this._functions = null;
        }
        else {
            var arr = this._functions.shift();
            arr[0].call(arr[1]);
        }
    };
    return QueueExecutor;
}());
__reflect(QueueExecutor.prototype, "QueueExecutor");
/**
 * Created by yangsong on 2014/11/23.
 */
var RandomUtils = (function (_super) {
    __extends(RandomUtils, _super);
    function RandomUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    RandomUtils.prototype.limit = function ($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    RandomUtils.prototype.limitInteger = function ($from, $end) {
        return Math.round(this.limit($from, $end));
    };
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    RandomUtils.prototype.randomArray = function (arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };
    return RandomUtils;
}(BaseClass));
__reflect(RandomUtils.prototype, "RandomUtils");
/**
 * 矩形工具类
 */
var RectangleUtils = (function (_super) {
    __extends(RectangleUtils, _super);
    /**
     * 构造函数
     */
    function RectangleUtils() {
        return _super.call(this) || this;
    }
    /**
     * 判定两个矩形是否相交
     */
    RectangleUtils.prototype.intersects = function (a, b) {
        var x1 = a.x;
        var x2 = b.x;
        var y1 = a.y;
        var y2 = b.y;
        var w1 = a.width;
        var w2 = b.width;
        var h1 = a.height;
        var h2 = b.height;
        if ((x1 < x2) && ((x2 - x1) >= w1))
            return false;
        if ((x1 > x2) && ((x1 - x2) >= w2))
            return false;
        if ((y1 < y2) && ((y2 - y1) >= h1))
            return false;
        if ((y1 > y2) && ((y1 - y2) >= h2))
            return false;
        return true;
    };
    ;
    return RectangleUtils;
}(BaseClass));
__reflect(RectangleUtils.prototype, "RectangleUtils");
/**
 * Created by yangsong on 15-2-11.
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
var ResourceUtils = (function (_super) {
    __extends(ResourceUtils, _super);
    /**
     * 构造函数
     */
    function ResourceUtils() {
        var _this = _super.call(this) || this;
        _this._groupIndex = 0;
        _this._configs = new Array();
        _this._groups = {};
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this.onResourceLoadComplete, _this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, _this.onResourceLoadProgress, _this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, _this.onResourceLoadError, _this);
        return _this;
    }
    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    ResourceUtils.prototype.addConfig = function (jsonPath, filePath) {
        this._configs.push([jsonPath, filePath]);
    };
    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    ResourceUtils.prototype.loadConfig = function ($onConfigComplete, $onConfigCompleteTarget) {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    };
    /**
     * 加载
     */
    ResourceUtils.prototype.loadNextConfig = function () {
        //加载完成
        if (this._configs.length == 0) {
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }
        var arr = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        RES.loadConfig(arr[0], arr[1]);
    };
    /**
     * 加载完成
     * @param event
     */
    ResourceUtils.prototype.onConfigCompleteHandle = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    };
    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     * @param $onResourceLoadError 资源加载失败监听函数
     */
    ResourceUtils.prototype.loadGroup = function ($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget, $onResourceLoadError) {
        if ($onResourceLoadError === void 0) { $onResourceLoadError = null; }
        this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget, $onResourceLoadError];
        RES.loadGroup($groupName);
    };
    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     * @param $onResourceLoadError 资源加载失败监听函数
     */
    ResourceUtils.prototype.loadGroups = function ($groupName, $subGroups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget, $onResourceLoadError) {
        if ($onResourceLoadError === void 0) { $onResourceLoadError = null; }
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget, $onResourceLoadError);
    };
    /**
     * 静默加载
     * @param $groupName 资源组名称
     * @param $groupName 所包含的组名称或者key名称数组
     */
    ResourceUtils.prototype.pilfererLoadGroup = function ($groupName, $subGroups) {
        if ($subGroups === void 0) { $subGroups = null; }
        //添加前缀，防止与正常加载组名重复
        var useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        RES.createGroup(useGroupName, $subGroups, true);
        RES.loadGroup(useGroupName, -1);
    };
    /**
     * 资源组加载完成
     */
    ResourceUtils.prototype.onResourceLoadComplete = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadComplete = this._groups[groupName][0];
            var loadCompleteTarget = this._groups[groupName][2];
            if (loadComplete != null) {
                loadComplete.apply(loadCompleteTarget, [groupName]);
            }
            this._groups[groupName] = null;
            delete this._groups[groupName];
        }
    };
    /**
     * 资源组加载进度
     */
    ResourceUtils.prototype.onResourceLoadProgress = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadProgress = this._groups[groupName][1];
            var loadProgressTarget = this._groups[groupName][2];
            if (loadProgress != null) {
                loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
            }
        }
    };
    /**
     * 资源组加载失败
     * @param event
     */
    ResourceUtils.prototype.onResourceLoadError = function (event) {
        Log.trace(event.groupName + "资源组有资源加载失败");
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadErrorTarget = this._groups[groupName][2];
            var loadError = this._groups[groupName][3];
            if (loadError != null) {
                loadError.apply(loadErrorTarget, [groupName]);
            }
        }
    };
    /**
     * 动态创建加载组
     * @param {string} $groupName
     * @param {string[]} resKeys
     */
    ResourceUtils.prototype.createGroup = function ($groupName, resKeys) {
        RES.createGroup($groupName, resKeys, true);
    };
    /**
     * 动态创建Resource
     * @param {string} resKey
     * @param {string} resType
     * @param {string} resUrl
     */
    ResourceUtils.prototype.createResource = function (resKey, resType, resUrl) {
        var res = {
            name: resKey,
            type: resType,
            url: resUrl
        };
        RES.parseConfig({
            resources: [res]
        });
    };
    return ResourceUtils;
}(BaseClass));
__reflect(ResourceUtils.prototype, "ResourceUtils");
/**
 * Created by Channing on 2014/12/6.
 * 震动
 */
var ShockUtils = (function (_super) {
    __extends(ShockUtils, _super);
    function ShockUtils() {
        var _this = _super.call(this) || this;
        _this.MAP = 0;
        _this.SPRITE = 1;
        _this.mapPoss = [new egret.Point(0, 3), new egret.Point(0, 0), new egret.Point(0, -2)];
        _this.spritePoss = [new egret.Point(5, 0), new egret.Point(-5, 0), new egret.Point(5, 0)];
        _this._shockLength = 0;
        _this._shockCount = 0;
        _this._rx = 0;
        _this._ry = 0;
        _this._type = 0;
        _this._repeatCount = 0;
        return _this;
    }
    ShockUtils.prototype.destroy = function () {
        this.stop();
    };
    ShockUtils.prototype.shock = function (type, target, repeatCount) {
        if (type === void 0) { type = 0; }
        if (target === void 0) { target = null; }
        if (repeatCount === void 0) { repeatCount = 3; }
        if (this._target) {
            return;
        }
        this._type = type;
        this._target = target;
        if (this._type == this.MAP) {
            this._shockPoss = this.mapPoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        else if (this._type == this.SPRITE) {
            this._shockPoss = this.spritePoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        this.start(repeatCount);
    };
    ShockUtils.prototype.start = function (num) {
        if (num === void 0) { num = 1; }
        this.repeatCount = num;
        this._shockCount = 0;
        if (this._target) {
            if (this._type != this.MAP) {
                this._rx = this._target.x;
            }
            this._ry = this._target.y;
            App.TimerManager.doFrame(1, 0, this.onShockEnter, this);
        }
    };
    ShockUtils.prototype.stop = function () {
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx;
            }
            this._target.y = this._ry;
            App.TimerManager.remove(this.onShockEnter, this);
        }
        this._target = null;
    };
    ShockUtils.prototype.onShockEnter = function (time) {
        var maxCount = this._shockLength * this._repeatCount;
        if (this._shockCount >= maxCount) {
            this.stop();
            return;
        }
        var index = this._shockCount % this._shockLength;
        var pos = this._shockPoss[index];
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx + pos.x;
            }
            this._target.y = this._ry + pos.y;
        }
        this._shockCount++;
    };
    Object.defineProperty(ShockUtils.prototype, "repeatCount", {
        get: function () {
            return this._repeatCount;
        },
        set: function (value) {
            this._repeatCount = value;
        },
        enumerable: true,
        configurable: true
    });
    return ShockUtils;
}(BaseClass));
__reflect(ShockUtils.prototype, "ShockUtils");
/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
var StageUtils = (function (_super) {
    __extends(StageUtils, _super);
    /**
     * 构造函数
     */
    function StageUtils() {
        var _this = _super.call(this) || this;
        if (StageUtils._uiStage == null) {
            StageUtils._uiStage = new eui.UILayer();
            StageUtils._uiStage.percentHeight = 100;
            StageUtils._uiStage.percentWidth = 100;
            StageUtils._uiStage.touchEnabled = false;
            _this.getStage().addChild(StageUtils._uiStage);
        }
        return _this;
    }
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    StageUtils.prototype.getHeight = function () {
        return this.getStage().stageHeight;
    };
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    StageUtils.prototype.getWidth = function () {
        return this.getStage().stageWidth;
    };
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    StageUtils.prototype.setTouchChildren = function (value) {
        this.getStage().touchChildren = value;
    };
    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    StageUtils.prototype.setMaxTouches = function (value) {
        this.getStage().maxTouches = value;
    };
    /**
     * 设置帧频
     * @param value
     */
    StageUtils.prototype.setFrameRate = function (value) {
        this.getStage().frameRate = value;
    };
    /**
     * 设置适配方式
     * @param value
     */
    StageUtils.prototype.setScaleMode = function (value) {
        this.getStage().scaleMode = value;
    };
    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    StageUtils.prototype.getStage = function () {
        return egret.MainContext.instance.stage;
    };
    /**
     * 获取唯一UIStage
     * @returns {eui.UILayer}
     */
    StageUtils.prototype.getUIStage = function () {
        return StageUtils._uiStage;
    };
    StageUtils.prototype.startFullscreenAdaptation = function (designWidth, designHeight, resizeCallback) {
        this.designWidth = designWidth;
        this.designHeight = designHeight;
        this.resizeCallback = resizeCallback;
        this.stageOnResize();
    };
    StageUtils.prototype.stageOnResize = function () {
        this.getStage().removeEventListener(egret.Event.RESIZE, this.stageOnResize, this);
        var designWidth = this.designWidth;
        var designHeight = this.designHeight;
        var clientWidth = window.innerWidth;
        var clientHeight = window.innerHeight;
        var a = clientWidth / clientHeight;
        var b = designWidth / designHeight;
        var c = a / b;
        if (a > b) {
            var c1 = c;
            var c2 = c;
            designWidth = Math.floor(designWidth * c1);
            designHeight = Math.floor(designHeight * c2);
        }
        this.getStage().setContentSize(designWidth, designHeight);
        // console.log(a, b, c);
        // console.log(designWidth, designHeight);
        this.resizeCallback && this.resizeCallback();
        this.getStage().addEventListener(egret.Event.RESIZE, this.stageOnResize, this);
    };
    return StageUtils;
}(BaseClass));
__reflect(StageUtils.prototype, "StageUtils");
/**
 * Created by yangsong on 2014/11/23.
 * Timer管理器
 */
var TimerManager = (function (_super) {
    __extends(TimerManager, _super);
    /**
     * 构造函数
     */
    function TimerManager() {
        var _this = _super.call(this) || this;
        _this._handlers = new Array();
        _this._delHandlers = new Array();
        _this._currTime = egret.getTimer();
        _this._currFrame = 0;
        _this._count = 0;
        _this._timeScale = 1;
        egret.Ticker.getInstance().register(_this.onEnterFrame, _this);
        return _this;
    }
    /**
     * 设置时间参数
     * @param timeScale
     */
    TimerManager.prototype.setTimeScale = function (timeScale) {
        this._timeScale = timeScale;
    };
    /**
     * 每帧执行函数
     * @param frameTime
     */
    TimerManager.prototype.onEnterFrame = function () {
        this._currFrame++;
        this._currTime = egret.getTimer();
        App.DebugUtils.start("TimerManager:");
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            var t = handler.userFrame ? this._currFrame : this._currTime;
            if (t >= handler.exeTime) {
                App.DebugUtils.start(handler.method.toString());
                handler.method.call(handler.methodObj, (this._currTime - handler.dealTime) * this._timeScale);
                App.DebugUtils.stop(handler.method.toString());
                handler.dealTime = this._currTime;
                handler.exeTime += handler.delay;
                if (!handler.repeat) {
                    if (handler.repeatCount > 1) {
                        handler.repeatCount--;
                    }
                    else {
                        if (handler.complateMethod) {
                            handler.complateMethod.apply(handler.complateMethodObj);
                        }
                        this._delHandlers.push(handler);
                    }
                }
            }
        }
        while (this._delHandlers.length) {
            var handler = this._delHandlers.pop();
            this.remove(handler.method, handler.methodObj);
        }
        App.DebugUtils.stop("TimerManager:");
    };
    TimerManager.prototype.create = function (useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        //参数监测
        if (delay < 0 || repeatCount < 0 || method == null) {
            return;
        }
        //先删除相同函数的计时
        this.remove(method, methodObj);
        //创建
        var handler = ObjectPool.pop(TimerHandler, "TimerHandler");
        handler.userFrame = useFrame;
        handler.repeat = repeatCount == 0;
        handler.repeatCount = repeatCount;
        handler.delay = delay;
        handler.method = method;
        handler.methodObj = methodObj;
        handler.complateMethod = complateMethod;
        handler.complateMethodObj = complateMethodObj;
        handler.exeTime = delay + (useFrame ? this._currFrame : this._currTime);
        handler.dealTime = this._currTime;
        this._handlers.push(handler);
        this._count++;
    };
    /**
     *
     * 定时执行
     * @param delay 执行间隔:毫秒
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doTimer = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(false, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doFrame = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(true, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    Object.defineProperty(TimerManager.prototype, "count", {
        /**
         * 定时器执行数量
         * @return
         *
         */
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.remove = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                this._handlers.splice(i, 1);
                ObjectPool.push(handler);
                this._count--;
                break;
            }
        }
    };
    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.removeAll = function (methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.methodObj == methodObj) {
                this._handlers.splice(i, 1);
                ObjectPool.push(handler);
                this._count--;
                i--;
            }
        }
    };
    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
    TimerManager.prototype.isExists = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                return true;
            }
        }
        return false;
    };
    return TimerManager;
}(BaseClass));
__reflect(TimerManager.prototype, "TimerManager");
var TimerHandler = (function () {
    function TimerHandler() {
        /**执行间隔*/
        this.delay = 0;
        /**重复执行次数*/
        this.repeatCount = 0;
        /**执行时间*/
        this.exeTime = 0;
        /**上次的执行时间*/
        this.dealTime = 0;
    }
    /**清理*/
    TimerHandler.prototype.clear = function () {
        this.method = null;
        this.methodObj = null;
        this.complateMethod = null;
        this.complateMethodObj = null;
    };
    return TimerHandler;
}());
__reflect(TimerHandler.prototype, "TimerHandler");
