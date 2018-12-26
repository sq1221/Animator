## 发包说明

runtime预加载方案的实现是将所有游戏涉及到的资源及代码打包为一个zip文件，runtime加载该zip文件后解压到本地，游戏运行时直接从本地获取游戏资源，以此提升游戏启动及运行时的加载效率

为使包体支持此Runtime预加载方案，游戏端需要做的改动：发包时**将包体内的内容如index.html、manifest.json、resource文件夹、js文件夹等打包为一个index.zip文件，并将index.zip文件放在与index.html文件同级目录下**，结束后包体中应同时存在index.html、index.zip、manifest.json、js文件夹、resource文件夹……

目前工程中发包时使用ZipCreator插件来自动生成zip文件，可在`scripts/ZipCreatorPlugin.ts`中找到其定义，该插件依赖npm包`archiver`，需要在工程根目录下安装该包：

```
npm i archiver
```
**注意不要在工程根目录下添加package.json文件，否则引擎会在编译第三方库时提示错误**

目前ZipCreator插件除用于生成zip包体，还对发包时的内容做了过滤，将非目标游戏所需的必要资源从包体过滤，以降低包体大小，过滤内容可查看

```
// 文件：scripts/ZipCreatorPlugin.ts

// pk游戏中的无用资源过滤
private readonly otherFilters: RegExp[] = [
    /resource\/assets\/gameCenter/i,
    /resource\/assets\/rank/i,
    /resource\/assets\/sound_barrage/i,
    /resource\/assets\/sound\/.+\//i,
    /resource\/assets\/icon\/.+\.png/i,
    /resource\/assets\/roleHeads\/.+\.png/i
];
```

发布`Local`包时，由于`Local`包运行依赖gameCenter中的资源内容，故需要将`otherFilters`中定义的第一个正则表达式注释掉，以避免在local包中出现资源丢失问题

### egret publish
该工程默认发包需要以`--version`字段指定游戏名称与版本，如

```
egret publish --version animalChess_v1
```
`animalChess`为游戏名，`v1`为游戏版本号，两值以`_`连接，若只传递游戏名，则默认版本号为`v1`。包体发布后，将存在在游戏`bin-release/animalChess/v1/`目录下

### 快捷脚本

当需要发布多个游戏包体时，在`Mac`或`Linux`系统上可使用`quickPublishAll.sh`脚本，该脚本会遍历工程`games/`目录下的游戏并逐一发包，调用方法:

```
sh quickPublishAll.sh v23
```
其中`v23`为所有游戏包体的统一版本号，若不传递该值，脚本默认会以`v1`发布，发布完成后游戏会按游戏名称存储在`bin-release`目录下

`Windows`系统脚本请按需自行编写

