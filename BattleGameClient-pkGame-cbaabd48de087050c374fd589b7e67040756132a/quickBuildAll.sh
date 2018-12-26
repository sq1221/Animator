#!/bin/sh
echo '--------- 编译core模块 ---------'
egret b core &&
echo '--------- 编译net模块 ---------'
egret b net &&
echo '--------- 编译common模块 ---------'
egret b common &&
echo '--------- 开始编译游戏 ---------'
for i in ./games/*
    do echo '--------- 编译游戏: '$i' ---------' & egret b $i
    done
echo '--------- 编译游戏外壳 ---------'
egret b -e &&
echo '--------- 编译完成 ---------'
