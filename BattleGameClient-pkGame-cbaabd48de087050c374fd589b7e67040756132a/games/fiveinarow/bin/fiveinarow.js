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
// 五子棋AI
var AIChessFive = (function () {
    function AIChessFive() {
        this.ChessArr = [];
        this.TempThree = []; //存放3+3两侧的点
        this.ArrSelf4 = ["01111", "10111", "11011", "11101", "11110"];
        this.ArrAI = ["02222", "20222", "22022", "22202", "22220"];
        this.type = 0; //1.横 2.纵 3.斜 4.反斜
        this.Decision_X = -1; //最终决定 X
        this.Decision_Y = -1; //最终决定 Y
        this.AIWin = 0; //0 AI没赢   1 AI赢 
        this.InitValueX = 7;
        this.InitValueY = 7;
        //防御战
        //优先防守四     01111 10111 11011 11101 11110 （堵法是唯一的）
        //挡住所有的活三 01110、011010、010110   （判断堵哪一个最佳）
        //活二 0110 01010 
        //攻击
        //发现进攻四     直接放子取胜    
        //用于收集所有可走点
        this.AllCanPot = [];
        // this.InitValueX = App.RandomUtils.limitInteger(6, 8);
        // this.InitValueY = App.RandomUtils.limitInteger(6, 8);
    }
    //判断4
    AIChessFive.prototype.onJudce = function () {
        //AI不存在4
        if (this.onJudceWinFour(true) == 0) {
            if (this.onJudceWinFour() == 0) {
                //点值评估
                this.onValueOfPot();
            }
            else {
                //self存在4 阻止self获胜
                /***********222222222********* */
                var str = this.onJudceWinFour();
                this.onDecisionFour(str);
                // //console.log("防守");
            }
        }
        else {
            //AI WIN 人工智能的胜利     赢赢赢赢
            /***********1111111111********* */
            var str = this.onJudceWinFour(true);
            this.onDecisionFour(str);
            // //console.log("进攻");
        }
    };
    //四杀
    AIChessFive.prototype.onJudceWinFour = function (isAI) {
        if (isAI === void 0) { isAI = false; }
        //横向
        var ArrTemp = [];
        if (isAI) {
            ArrTemp = this.ArrAI;
        }
        else {
            ArrTemp = this.ArrSelf4;
        }
        for (var i = 0; i < 11; ++i) {
            for (var j = 0; j < 15; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i + k][j];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1] ||
                    str == ArrTemp[2] ||
                    str == ArrTemp[3] ||
                    str == ArrTemp[4]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 1;
                    if (isAI) {
                        this.AIWin = 1;
                    }
                    return str;
                }
            }
        }
        //纵向
        for (var i = 0; i < 15; ++i) {
            for (var j = 0; j < 11; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i][j + k];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1] ||
                    str == ArrTemp[2] ||
                    str == ArrTemp[3] ||
                    str == ArrTemp[4]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 2;
                    if (isAI) {
                        this.AIWin = 2;
                    }
                    return str;
                }
            }
        }
        //斜向
        for (var i = 0; i < 11; ++i) {
            for (var j = 0; j < 11; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i + k][j + k];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1] ||
                    str == ArrTemp[2] ||
                    str == ArrTemp[3] ||
                    str == ArrTemp[4]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 3;
                    if (isAI) {
                        this.AIWin = 3;
                    }
                    return str;
                }
            }
        }
        //反斜向
        for (var i = 4; i < 15; ++i) {
            for (var j = 0; j < 11; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i - k][j + k];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1] ||
                    str == ArrTemp[2] ||
                    str == ArrTemp[3] ||
                    str == ArrTemp[4]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    if (isAI) {
                        this.AIWin = 4;
                    }
                    this.type = 4;
                    return str;
                }
            }
        }
        return 0;
    };
    //双4结构  优先级高于 活三   
    AIChessFive.prototype.onJudceWinDoubleFour = function (isAI) {
        if (isAI === void 0) { isAI = false; }
        //收集地图内所有的点
        this.AllCanPot = [];
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (this.ChessArr[i][j] == 0) {
                    var Arr = [i, j];
                    this.AllCanPot.push(Arr);
                }
            }
        }
        //AI 与 self
        var str = "";
        if (isAI) {
            str = "2";
        }
        else {
            str = "1";
        }
        var len = this.AllCanPot.length;
        for (var i = 0; i < len; ++i) {
            var Init_X = this.AllCanPot[i][0];
            var Init_Y = this.AllCanPot[i][1];
            // if (){
            // }
        }
        return 0;
    };
    //三杀
    AIChessFive.prototype.onJudceWinThree = function (isAI) {
        if (isAI === void 0) { isAI = false; }
        var strTemp;
        var ArrTemp = [];
        if (isAI) {
            strTemp = "02220";
            ArrTemp = ["022020", "020220"];
        }
        else {
            strTemp = "01110";
            ArrTemp = ["011010", "010110"];
        }
        //横向
        for (var i = 0; i < 11; ++i) {
            for (var j = 0; j < 15; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i + k][j];
                }
                if (str == strTemp) {
                    if (i == 0 && this.ChessArr[i + 5][j] == 0) {
                        str = "3" + str + "0";
                    }
                    else if (i == 10 && this.ChessArr[i - 1][j] == 0) {
                        str = "0" + str + "3";
                    }
                    else if (i > 0 && i < 10) {
                        var num1 = this.ChessArr[i - 1][j];
                        var num2 = this.ChessArr[i + 5][j];
                        if (num1 == 0 || num2 == 0) {
                            str = "" + num1 + str + num2;
                        }
                    }
                    if (str.length > 5) {
                        this.Init_X = i;
                        this.Init_Y = j;
                        this.type = 1;
                        return str;
                    }
                }
            }
        }
        //纵向
        for (var i = 0; i < 15; ++i) {
            for (var j = 0; j < 11; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i][j + k];
                }
                if (str == strTemp) {
                    if (j == 0 && this.ChessArr[i][j + 5] == 0) {
                        str = "3" + str + "0";
                    }
                    else if (j == 10 && this.ChessArr[i][j - 1] == 0) {
                        str = "0" + str + "3";
                    }
                    else if (j > 0 && j < 10) {
                        var num1 = this.ChessArr[i][j - 1];
                        var num2 = this.ChessArr[i][j + 5];
                        if (num1 == 0 || num2 == 0) {
                            str = "" + num1 + str + num2;
                        }
                    }
                    if (str.length > 5) {
                        this.Init_X = i;
                        this.Init_Y = j;
                        this.type = 2;
                        return str;
                    }
                }
            }
        }
        //斜向
        for (var i = 0; i < 11; ++i) {
            for (var j = 0; j < 11; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i + k][j + k];
                }
                if (str == strTemp) {
                    if (i == 0 && j != 10) {
                        if (this.ChessArr[i + 5][j + 5] == 0) {
                            str = "3" + str + "0";
                        }
                    }
                    else if (i != 10 && j == 0) {
                        if (this.ChessArr[i + 5][j + 5] == 0) {
                            str = "3" + str + "0";
                        }
                    }
                    else if (i == 10 && j != 0) {
                        if (this.ChessArr[i - 1][j - 1] == 0) {
                            str = "0" + str + "3";
                        }
                    }
                    else if (i != 0 && j == 10) {
                        if (this.ChessArr[i - 1][j - 1] == 0) {
                            str = "0" + str + "3";
                        }
                    }
                    else if (i < 10 && i > 0) {
                        if (j < 10 && j > 0) {
                            var num1 = this.ChessArr[i - 1][j - 1];
                            var num2 = this.ChessArr[5 + i][j + 5];
                            if (num1 == 0 || num2 == 0) {
                                str = "" + num1 + str + num2;
                            }
                        }
                    }
                    if (str.length > 5) {
                        this.Init_X = i;
                        this.Init_Y = j;
                        this.type = 3;
                        return str;
                    }
                }
            }
        }
        //反斜向(容易出错)
        for (var i = 4; i < 15; ++i) {
            for (var j = 0; j < 11; j++) {
                var str = "";
                for (var k = 0; k < 5; ++k) {
                    str += this.ChessArr[i - k][j + k];
                }
                if (str == strTemp) {
                    if (j == 0 && i != 4) {
                        if (this.ChessArr[i - 5][j + 5] == 0) {
                            str = "3" + str + "0";
                        }
                    }
                    else if (j != 10 && i == 14) {
                        if (this.ChessArr[i - 5][j + 5] == 0) {
                            str = "3" + str + "0";
                        }
                    }
                    else if (j != 10 && i == 4) {
                        if (this.ChessArr[i + 1][j - 1] == 0) {
                            str = "0" + str + "3";
                        }
                    }
                    else if (j == 10 && i != 14) {
                        if (this.ChessArr[i + 1][j - 1] == 0) {
                            str = "0" + str + "3";
                        }
                    }
                    else if (i < 14 && i > 4) {
                        if (j < 10 && j > 0) {
                            var num2 = this.ChessArr[i - 5][j + 5];
                            var num1 = this.ChessArr[i + 1][j + 1];
                            if (num1 == 0 || num2 == 0) {
                                str = "" + num1 + str + num2;
                            }
                        }
                    }
                    if (str.length > 5) {
                        this.Init_X = i;
                        this.Init_Y = j;
                        this.type = 4;
                        return str;
                    }
                }
            }
        }
        //横向
        for (var i = 0; i < 10; ++i) {
            for (var j = 0; j < 15; j++) {
                var str = "";
                for (var k = 0; k < 6; ++k) {
                    str += this.ChessArr[i + k][j];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 1;
                    return str;
                }
            }
        }
        //纵向
        for (var i = 0; i < 15; ++i) {
            for (var j = 0; j < 10; j++) {
                var str = "";
                for (var k = 0; k < 6; ++k) {
                    str += this.ChessArr[i][j + k];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 2;
                    return str;
                }
            }
        }
        //斜向
        for (var i = 0; i < 10; ++i) {
            for (var j = 0; j < 10; j++) {
                var str = "";
                for (var k = 0; k < 6; ++k) {
                    str += this.ChessArr[i + k][j + k];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 3;
                    return str;
                }
            }
        }
        //反斜向
        for (var i = 5; i < 15; ++i) {
            for (var j = 0; j < 10; j++) {
                var str = "";
                for (var k = 0; k < 6; ++k) {
                    str += this.ChessArr[i - k][j + k];
                }
                if (str == ArrTemp[0] ||
                    str == ArrTemp[1]) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 4;
                    return str;
                }
            }
        }
        return 0;
    };
    //决定4怎么走（至关重要）
    AIChessFive.prototype.onDecisionFour = function (str) {
        switch (this.type) {
            case 1:
                if (str == "01111" || str == "02222") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "10111" || str == "20222") {
                    this.Decision_X = this.Init_X + 1;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "11011" || str == "22022") {
                    this.Decision_X = this.Init_X + 2;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "11101" || str == "22202") {
                    this.Decision_X = this.Init_X + 3;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "11110" || str == "22220") {
                    this.Decision_X = this.Init_X + 4;
                    this.Decision_Y = this.Init_Y;
                }
                break;
            case 2:
                if (str == "01111" || str == "02222") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "10111" || str == "20222") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 1;
                }
                else if (str == "11011" || str == "22022") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str == "11101" || str == "22202") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "11110" || str == "22220") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 4;
                }
                break;
            case 3:
                if (str == "01111" || str == "02222") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "10111" || str == "20222") {
                    this.Decision_X = this.Init_X + 1;
                    this.Decision_Y = this.Init_Y + 1;
                }
                else if (str == "11011" || str == "22022") {
                    this.Decision_X = this.Init_X + 2;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str == "11101" || str == "22202") {
                    this.Decision_X = this.Init_X + 3;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "11110" || str == "22220") {
                    this.Decision_X = this.Init_X + 4;
                    this.Decision_Y = this.Init_Y + 4;
                }
                break;
            case 4:
                if (str == "01111" || str == "02222") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "10111" || str == "20222") {
                    this.Decision_X = this.Init_X - 1;
                    this.Decision_Y = this.Init_Y + 1;
                }
                else if (str == "11011" || str == "22022") {
                    this.Decision_X = this.Init_X - 2;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str == "11101" || str == "22202") {
                    this.Decision_X = this.Init_X - 3;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "11110" || str == "22220") {
                    this.Decision_X = this.Init_X - 4;
                    this.Decision_Y = this.Init_Y + 4;
                }
                break;
        }
        //console.log("推荐》》》4：", this.Decision_X, this.Decision_Y)
    };
    //决定3怎么走  (AI成形了活三决定怎么走)
    //进攻 022020、020220 直接决定位置 02220看情况
    AIChessFive.prototype.onDecisionThree = function (str) {
        //console.log("检测到的3数组为", str)
        switch (this.type) {
            case 1:
                if (str == "022020") {
                    this.Decision_X = this.Init_X + 3;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "020220") {
                    this.Decision_X = this.Init_X + 2;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str.indexOf("022200") != -1) {
                    this.Decision_X = this.Init_X + 4;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "0022201" || str == "0022203" || str == "0022200") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                break;
            case 2:
                if (str == "022020") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "020220") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str.indexOf("022200") != -1) {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 4;
                }
                else if (str == "0022201" || str == "0022203" || str == "0022200") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                break;
            case 3:
                if (str == "022020") {
                    this.Decision_X = this.Init_X + 3;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "020220") {
                    this.Decision_X = this.Init_X + 2;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str.indexOf("022200") != -1) {
                    this.Decision_X = this.Init_X + 4;
                    this.Decision_Y = this.Init_Y + 4;
                }
                else if (str == "0022201" || str == "0022203" || str == "0022200") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                break;
            case 4:
                if (str == "022020") {
                    this.Decision_X = this.Init_X - 3;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "020220") {
                    this.Decision_X = this.Init_X - 2;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str.indexOf("022200") != -1) {
                    this.Decision_X = this.Init_X - 4;
                    this.Decision_Y = this.Init_Y + 4;
                }
                else if (str == "0022201" || str == "0022203" || str == "0022200") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                break;
        }
        //console.log("推荐》》》3:", this.Decision_X, this.Decision_Y)
    };
    //决定3怎么走（高级的）  //防守 走点估值函数   //后期会改
    //01110 需要再次判定一次  冲上活四                                                                    
    AIChessFive.prototype.onDecisionGradeThree = function (str) {
        ////console.log("推荐》》》think", str)
        //console.log("检测到的3数组为", str)
        switch (this.type) {
            case 1:
                if (str == "011010") {
                    this.Decision_X = this.Init_X + 3;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "010110") {
                    this.Decision_X = this.Init_X + 2;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str.indexOf("011100") != -1) {
                    this.Decision_X = this.Init_X + 4;
                    this.Decision_Y = this.Init_Y;
                }
                else if (str == "0011102" || str == "0011103" || str == "0011100") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                // else if (str == "0011100") {
                //     this.TempThree[0] = [this.Init_X, this.Init_Y, 0];
                //     this.TempThree[1] = [this.Init_X + 4, this.Init_Y, 0];
                // }
                break;
            case 2:
                if (str == "011010") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "010110") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str.indexOf("011100") != -1) {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y + 4;
                }
                else if (str == "0011102" || str == "0011103" || str == "0011100") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                // else if (str == "0011100") {
                //     this.TempThree[0] = [this.Init_X, this.Init_Y, 0];
                //     this.TempThree[1] = [this.Init_X, this.Init_Y + 4, 0];
                // }
                break;
            case 3:
                if (str == "011010") {
                    this.Decision_X = this.Init_X + 3;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "010110") {
                    this.Decision_X = this.Init_X + 2;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str.indexOf("011100") != -1) {
                    this.Decision_X = this.Init_X + 4;
                    this.Decision_Y = this.Init_Y + 4;
                }
                else if (str == "0011102" || str == "0011103" || str == "0011100") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                // else if (str == "0011100") {
                //     this.TempThree[0] = [this.Init_X, this.Init_Y, 0];
                //     this.TempThree[1] = [this.Init_X + 4, this.Init_Y + 4, 0];
                // }
                break;
            case 4:
                if (str == "011010") {
                    this.Decision_X = this.Init_X - 3;
                    this.Decision_Y = this.Init_Y + 3;
                }
                else if (str == "010110") {
                    this.Decision_X = this.Init_X - 2;
                    this.Decision_Y = this.Init_Y + 2;
                }
                else if (str.indexOf("011100") != -1) {
                    this.Decision_X = this.Init_X - 4;
                    this.Decision_Y = this.Init_Y + 4;
                }
                else if (str == "0011102" || str == "0011103" || str == "0011100") {
                    this.Decision_X = this.Init_X;
                    this.Decision_Y = this.Init_Y;
                }
                // else if (str == "0011100") {
                //     this.TempThree[0] = [this.Init_X, this.Init_Y, 0];
                //     this.TempThree[1] = [this.Init_X - 4, this.Init_Y + 4, 0];
                // }
                break;
        }
        //console.log("推荐》》》3:", this.Decision_X, this.Decision_Y)
    };
    //点的估值
    AIChessFive.prototype.onValueOfPot = function () {
        //收集地图内所有的点
        this.AllCanPot = [];
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (this.ChessArr[i][j] == 0) {
                    var value = 100 - Math.abs(this.InitValueX - i) - Math.abs(this.InitValueY - j);
                    var Arr = [i, j, value]; //初始X 初始y 该点的初始估值(越靠近指定中心点估值越大)
                    this.AllCanPot.push(Arr);
                }
            }
        }
        //排序初始的估值
        var len = this.AllCanPot.length;
        //双4估值评选  
        for (var i = 0; i < len; i++) {
            this.onStructureDoubleFour(i);
        }
        this.AllCanPot.sort(function (a, b) {
            if (a[2] > b[2]) {
                return -1;
            }
            else {
                return 1;
            }
        });
        //对方不存在4+3  优先将活三变活4
        if (this.AllCanPot[0][2] < 10000) {
            //活三操作
            var str_three1 = this.onJudceWinThree(true);
            if (str_three1 == 0) {
                var str_three2 = this.onJudceWinThree(false);
                if (str_three2 == 0) {
                    if (this.AllCanPot.length - 1 >= GameFiveinARowView.AILEVEL) {
                        //继续估值
                        this.Decision_X = this.AllCanPot[GameFiveinARowView.AILEVEL][0];
                        this.Decision_Y = this.AllCanPot[GameFiveinARowView.AILEVEL][1];
                    }
                    else {
                        //继续估值
                        this.Decision_X = this.AllCanPot[0][0];
                        this.Decision_Y = this.AllCanPot[0][1];
                    }
                    //console.log("继续估值推荐》》》POT:", this.Decision_X, this.Decision_Y, this.AllCanPot);
                    //console.log("最佳估值系统：：：：", this.AllCanPot[0][2]);
                }
                else {
                    /***********444444444********* */
                    // if (this.TempThree.length > 0) {
                    //     this.onValueOfPot();
                    //     this.TempThree = [];
                    // }
                    // else {
                    this.onDecisionGradeThree(str_three2); //阻击对方活三变活四
                    //}
                }
            }
            else {
                /***********333333333********* */
                this.onDecisionThree(str_three1); //将自己的活三变成活四 击杀对方
            }
        }
        else {
            this.Decision_X = this.AllCanPot[0][0];
            this.Decision_Y = this.AllCanPot[0][1];
        }
        // //存在双4结构（9000）  单四+活三4（7000）    双活三（5000）
        // if (this.AllCanPot[0][2] > 3000) {
        //     this.Decision_X = this.AllCanPot[0][0];
        //     this.Decision_Y = this.AllCanPot[0][1];
        //     //console.log("估值水平推荐》》》POT:", this.Decision_X, this.Decision_Y);
        // }
        // else {
        // }
    };
    //加估值 三大操作
    //(1)双4结构 10000 9000(危)（优先级高于活三）   (对面至少7棵子)
    //(2)单四 + 活三 8000 7000（危）   (对面至少6棵子)
    //(3)双活三 6000 5000（危）   (对面至少5棵子)
    //（1）num_Loction相对于备选数组的位置
    AIChessFive.prototype.onStructureDoubleFour = function (num_Loction) {
        var num_X = this.AllCanPot[num_Loction][0];
        var num_Y = this.AllCanPot[num_Loction][1];
        var num_Value = this.AllCanPot[num_Loction][2];
        var StructureFour1 = 0; //统计敌人 4的数量
        var StructureFour2 = 0; //统计AI 4的数量
        var StructureThree1 = 0; //统计敌人 3的数量
        var StructureThree111 = 0; //统计敌人 3的数量  111 
        var StructureThree2 = 0; //统计AI 3的数量
        var StructureThree222 = 0; //统计AI 3的数量
        var strSelf_1 = "";
        var strSelf_2 = "";
        var strSelf_3 = "";
        var strSelf_4 = "";
        var strAI_1 = "";
        var strAI_2 = "";
        var strAI_3 = "";
        var strAI_4 = "";
        //横向
        var str1 = "";
        for (var i = -4; i <= 4; ++i) {
            var num = num_X + i;
            if (num >= 0 && num <= 14) {
                str1 += this.ChessArr[num][num_Y];
                if (i == 0) {
                    strAI_1 += "2";
                    strSelf_1 += "1";
                }
                else {
                    strAI_1 += this.ChessArr[num][num_Y];
                    strSelf_1 += this.ChessArr[num][num_Y];
                }
            }
        }
        //纵向
        var str2 = "";
        for (var i = -4; i <= 4; ++i) {
            var num = num_Y + i;
            if (num >= 0 && num <= 14) {
                str2 += this.ChessArr[num_X][num];
                if (i == 0) {
                    strAI_2 += "2";
                    strSelf_2 += "1";
                }
                else {
                    strAI_2 += this.ChessArr[num_X][num];
                    strSelf_2 += this.ChessArr[num_X][num];
                }
            }
        }
        //斜向        
        var str3 = "";
        for (var i = -4; i <= 4; ++i) {
            var num1 = num_X + i;
            var num2 = num_Y + i;
            if (num1 >= 0 && num1 <= 14) {
                if (num2 >= 0 && num2 <= 14) {
                    str3 += this.ChessArr[num1][num2];
                    if (i == 0) {
                        strAI_3 += "2";
                        strSelf_3 += "1";
                    }
                    else {
                        strAI_3 += this.ChessArr[num1][num2];
                        strSelf_3 += this.ChessArr[num1][num2];
                    }
                }
            }
        }
        //反斜向        
        var str4 = "";
        for (var i = -4; i <= 4; ++i) {
            var num1 = num_X - i;
            var num2 = num_Y + i;
            if (num1 >= 0 && num1 <= 14) {
                if (num2 >= 0 && num2 <= 14) {
                    str4 += this.ChessArr[num1][num2];
                    if (i == 0) {
                        strAI_4 += "2";
                        strSelf_4 += "1";
                    }
                    else {
                        strAI_4 += this.ChessArr[num1][num2];
                        strSelf_4 += this.ChessArr[num1][num2];
                    }
                }
            }
        }
        //如果长度为9 可以检查5次
        var strTemp = ""; //四的检测
        var StrThreeTempAI = "";
        var StrThreeTempSelf = "";
        for (var k = 1; k < 5; k++) {
            switch (k) {
                case 1:
                    strTemp = str1;
                    StrThreeTempAI = strAI_1;
                    StrThreeTempSelf = strSelf_1;
                    break;
                case 2:
                    strTemp = str2;
                    StrThreeTempAI = strAI_2;
                    StrThreeTempSelf = strSelf_2;
                    break;
                case 3:
                    strTemp = str3;
                    StrThreeTempAI = strAI_3;
                    StrThreeTempSelf = strSelf_3;
                    break;
                case 4:
                    strTemp = str4;
                    StrThreeTempAI = strAI_4;
                    StrThreeTempSelf = strSelf_4;
                    break;
            }
            var len = strTemp.length;
            if (len >= 5) {
                // for (var i = 0; i < len - 4; ++i) {
                //     var tem_num0 = 0;
                //     var tem_num1 = 0;
                //     var tem_num2 = 0;
                //     for (var j = 0; j < 5; j++) {
                //         if (strTemp[i + j] == "0") {
                //             tem_num0++;
                //         }
                //         else if (strTemp[i + j] == "1") {
                //             tem_num1++;
                //         }
                //         else if (strTemp[i + j] == "2") {
                //             tem_num2++;
                //         }
                //     }
                //     if (tem_num0 == 2) {
                //         if (tem_num1 == 3) {
                //             StructureFour1++;
                //         }
                //         if (tem_num2 == 3) {
                //             StructureFour2++;
                //         }
                //     }
                // }
                if (StrThreeTempAI.indexOf("02222") != -1 ||
                    StrThreeTempAI.indexOf("20222") != -1 ||
                    StrThreeTempAI.indexOf("22022") != -1 ||
                    StrThreeTempAI.indexOf("22202") != -1 ||
                    StrThreeTempAI.indexOf("22220") != -1) {
                    StructureFour2++;
                    //单排形成双四
                    if (StrThreeTempAI.indexOf("2022202") != -1) {
                        StructureFour2 += 1;
                    }
                    //console.log("AAAA4:", StrThreeTempAI)
                }
                else {
                    if (StrThreeTempAI.indexOf("002220") != -1 ||
                        StrThreeTempAI.indexOf("022200") != -1 ||
                        StrThreeTempAI.indexOf("022020") != -1 ||
                        StrThreeTempAI.indexOf("020220") != -1) {
                        StructureThree2++;
                        //console.log("AAAA:", StrThreeTempAI)
                    }
                    if (StrThreeTempAI.indexOf("002220") != -1 ||
                        StrThreeTempAI.indexOf("022200") != -1) {
                        StructureThree222++;
                    }
                }
                if (StrThreeTempSelf.indexOf("01111") != -1 ||
                    StrThreeTempSelf.indexOf("10111") != -1 ||
                    StrThreeTempSelf.indexOf("11011") != -1 ||
                    StrThreeTempSelf.indexOf("11101") != -1 ||
                    StrThreeTempSelf.indexOf("11110") != -1) {
                    StructureFour1++;
                    //单排形成双四
                    if (StrThreeTempSelf.indexOf("1011101") != -1) {
                        StructureFour1 += 1;
                    }
                    //console.log("BBBB4:", StrThreeTempAI)
                }
                else {
                    if (StrThreeTempSelf.indexOf("001110") != -1 ||
                        StrThreeTempSelf.indexOf("011100") != -1 ||
                        StrThreeTempSelf.indexOf("011010") != -1 ||
                        StrThreeTempSelf.indexOf("010110") != -1) {
                        StructureThree1++;
                        //console.log("BBBB:", StrThreeTempSelf)
                    }
                    if (StrThreeTempSelf.indexOf("001110") != -1 ||
                        StrThreeTempSelf.indexOf("011100") != -1) {
                        StructureThree111++;
                    }
                }
            }
        }
        //AI自身存在双4
        if (StructureFour2 > 1) {
            this.AllCanPot[num_Loction][2] += 10000;
            //console.log("双4估值推荐:", StructureFour2);
            return;
        }
        else if (StructureFour1 > 1) {
            this.AllCanPot[num_Loction][2] += 8000;
            //console.log("双4估值推荐:", StructureFour1);
            return;
        }
        else if (StructureFour2 == 1 && StructureThree2 > 0) {
            this.AllCanPot[num_Loction][2] += 9000;
            //console.log("4+3估值进攻推荐:", this.AllCanPot[num_Loction][0], this.AllCanPot[num_Loction][1]);
            return;
        }
        else if (StructureFour1 == 1 && StructureThree1 > 0) {
            this.AllCanPot[num_Loction][2] += 7000;
            //console.log("4+3估值防御推荐:", this.AllCanPot[num_Loction][0], this.AllCanPot[num_Loction][1]);
            return;
        }
        else if (StructureThree2 > 1) {
            this.AllCanPot[num_Loction][2] += 6000;
            //console.log("3+3估值进攻推荐:", StructureThree2);
            return;
        }
        else if (StructureThree1 > 1) {
            this.AllCanPot[num_Loction][2] += 5000;
            //console.log("3+3估值防御推荐:", StructureThree1);
            return;
        }
        else if (StructureThree222 == 1) {
            this.AllCanPot[num_Loction][2] += 3000;
            //console.log("3估值进攻推荐:", StructureThree2);
            return;
        }
        else if (StructureThree111 == 1) {
            this.AllCanPot[num_Loction][2] += 4000;
            //console.log("3估值防御推荐:", StructureThree111);
            return;
        }
    };
    return AIChessFive;
}());
__reflect(AIChessFive.prototype, "AIChessFive");
// TypeScript file
//五子棋 棋子
var ChessmanFive = (function (_super) {
    __extends(ChessmanFive, _super);
    function ChessmanFive(resId) {
        var _this = _super.call(this) || this;
        _this.img1 = App.DisplayUtils.createBitmap("chessman_" + resId + "_png");
        _this.addChild(_this.img1);
        _this.anchorOffsetX = _this.anchorOffsetY = 20;
        return _this;
    }
    ChessmanFive.prototype.init = function () {
    };
    return ChessmanFive;
}(egret.DisplayObjectContainer));
__reflect(ChessmanFive.prototype, "ChessmanFive");
//五子棋 棋子
var ChessmanShadow = (function (_super) {
    __extends(ChessmanShadow, _super);
    function ChessmanShadow(resId) {
        var _this = _super.call(this) || this;
        _this.INIT_X = 0;
        _this.INIT_Y = 0;
        _this.img1 = App.DisplayUtils.createBitmap("chessman_" + resId + "_png");
        _this.img2 = App.DisplayUtils.createBitmap("img_redying_png");
        _this.addChild(_this.img1);
        _this.addChild(_this.img2);
        _this.touchEnabled = false;
        _this.touchChildren = false;
        _this.img1.anchorOffsetX = _this.img1.anchorOffsetY = 20;
        _this.img2.anchorOffsetX = _this.img2.anchorOffsetY = 100;
        return _this;
    }
    ChessmanShadow.prototype.init = function () {
    };
    return ChessmanShadow;
}(egret.DisplayObjectContainer));
__reflect(ChessmanShadow.prototype, "ChessmanShadow");
// TypeScript file
var GameFiveExpressView = (function (_super) {
    __extends(GameFiveExpressView, _super);
    function GameFiveExpressView() {
        var _this = _super.call(this, GameFiveExpressSkin) || this;
        _this.numTimeRefuseSum = 5; //五秒后自动同意
        _this.btn_sumNo.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onCancelSum, _this);
        _this.btn_loseNo.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onCancelLose, _this);
        var ArrMessage = RES.getRes("FiveinARowMessage_json")["euiMessage"];
        _this.lb_sum.text = ArrMessage["1001"];
        _this.lb_sumDescribe.text = ArrMessage["1002"];
        _this.lb_lose.text = ArrMessage["1003"];
        _this.lb_loseDescribe.text = ArrMessage["1004"];
        _this.btn_loseYes["label"] = ArrMessage["1005"];
        _this.btn_loseNo["label"] = ArrMessage["1006"];
        _this.btn_sumYes["label"] = ArrMessage["1007"];
        switch (App.Language) {
            case LanguageType.En:
                _this.lb_sumDescribe.size = 18;
                _this.lb_loseDescribe.size = 24;
                break;
        }
        return _this;
    }
    //取消求和
    GameFiveExpressView.prototype.onCancelSum = function () {
        this.gp_sum.visible = false;
        switch (App.Language) {
            case LanguageType.Ch:
                this.btn_sumNo["label"] = "拒绝(5秒)";
                break;
            case LanguageType.En:
                this.btn_sumNo["label"] = "refuse(5s)";
                break;
        }
    };
    //取消认输 
    GameFiveExpressView.prototype.onCancelLose = function () {
        this.gp_lose.visible = false;
    };
    return GameFiveExpressView;
}(EuiComponent));
__reflect(GameFiveExpressView.prototype, "GameFiveExpressView");
var GameFiveinARowView = (function (_super) {
    __extends(GameFiveinARowView, _super);
    function GameFiveinARowView() {
        var _this = _super.call(this) || this;
        //起始的x
        _this.num_beginX = 0;
        //起始的y
        _this.num_beginY = 329;
        //隐形的矩形
        _this.num_YIN_X = 0;
        _this.num_YIM_Y = 0;
        _this.num_YIN_W = 0;
        _this.num_YIM_H = 0;
        //收集棋盘上的点
        _this.Obj_Pot = {};
        //收集棋盘上的棋子
        _this.Obj_Chess = {};
        //自己控制子的顔色
        _this.SELF_TYPE = 1; // 1黑子 2白子
        //自己控制子的顔色
        _this.ENENY_TYPE = 2; // 1黑子 2白子
        //隱形的棋子
        _this.ShadowChess = null;
        //横向
        _this.numSelfSuccess_1 = 0;
        //纵向
        _this.numSelfSuccess_2 = 0;
        //斜向
        _this.numSelfSuccess_3 = 0;
        //反斜向
        _this.numSelfSuccess_4 = 0;
        //是否是自己的回合
        _this.isSelfRound = false;
        //是否是点击有效区
        _this.isEffectLoction = false;
        //
        _this.num_time = 45; //45s倒计时
        _this.num_sum = 1; //求和；（发送求和的限制，每回合一次）
        _this.str_whoRound = "";
        _this.isGameOver = false;
        _this.selfIsWin = false; //自己是否赢了
        _this.numChess = 0; //棋子总数
        _this.chessboardArr = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        _this.pauseCallback = function () {
            App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
            _this.next("gameChangeMatch");
        };
        _this.isExpress = false;
        GameFiveinARowView.volume_global = new SoundEffects();
        GameFiveinARowView.volume_global.setVolume(1);
        egret.lifecycle.onPause = function () {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GameFiveinARowView.volume_global) {
                GameFiveinARowView.volume_global.setVolume(0);
            }
        };
        egret.lifecycle.onResume = function () {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GameFiveinARowView.volume_global) {
                GameFiveinARowView.volume_global.setVolume(1);
            }
        };
        return _this;
    }
    GameFiveinARowView.prototype.init = function () {
        _super.prototype.init.call(this);
        this.ArrMessage = RES.getRes("FiveinARowMessage_json")["ArrMessage"];
        //添加背景
        this.container = new egret.DisplayObjectContainer();
        this.addChild(this.container);
        //適配
        var a = App.GameWidth / GameFiveinARowView.GAME_WIDTH;
        var b = App.GameHeight / GameFiveinARowView.GAME_HEIGHT;
        var c = Math.min(a, b);
        this.container.scaleX = this.container.scaleY = c;
        this.container.x = (App.GameWidth - GameFiveinARowView.GAME_WIDTH * c) * 0.5;
        this.container.y = (App.GameHeight - GameFiveinARowView.GAME_HEIGHT * c) * 0.5;
        //添加游戏层
        this.GameContainer = new egret.DisplayObjectContainer();
        this.GameContainer.width = this.container.width;
        this.GameContainer.height = this.container.height;
        this.container.addChild(this.GameContainer);
        this.BaseComment = new GameFiveExpressView();
        this.addChild(this.BaseComment);
        this.BaseComment.width = App.GameWidth;
        this.BaseComment.height = App.GameHeight;
        //適配游戏区
        if (App.GameHeight < GameFiveinARowView.GAME_HEIGHT) {
            this.BaseComment.gp_game.scaleX = App.GameHeight / GameFiveinARowView.GAME_HEIGHT;
            this.BaseComment.gp_game.scaleY = App.GameHeight / GameFiveinARowView.GAME_HEIGHT;
        }
        var user = DataCenter.instance.user;
        this.BaseComment.lb_name1.text = user.name;
        this.BaseComment.img_sex1.source = GameCenterGetSexIcon.getSexIconSource(user.sex);
        var playerHead1 = new RoleHeadImage(user.imgUrl);
        //playerHead1.width =  playerHead1.height = 82;
        // playerHead1.anchorOffsetX = playerHead1.width / 2;
        // playerHead1.anchorOffsetY = playerHead1.height / 2;
        playerHead1.scaleX = playerHead1.scaleY = 0.85;
        this.BaseComment.playerAvatarGroup1.addChild(playerHead1);
        //playerHead1.ma = playerHead1.scaleX = 3;
        var enumy = DataCenter.instance.room.player;
        this.BaseComment.lb_name2.text = enumy.name;
        this.BaseComment.img_sex2.source = GameCenterGetSexIcon.getSexIconSource(enumy.sex);
        var playerHead2 = new RoleHeadImage(enumy.imgUrl);
        // playerHead2.anchorOffsetX = playerHead2.width / 2;
        // playerHead2.anchorOffsetY = playerHead2.height / 2;
        playerHead2.scaleX = playerHead2.scaleY = 0.85;
        this.BaseComment.playerAvatarGroup2.addChild(playerHead2);
        // playerHead2.width =  playerHead2.height = 82;
        // playerHead2.scaleX = playerHead2.scaleX = 3;
        this.onDraw();
        for (var i = 1; i <= 6; ++i) {
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendMessage, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onExpressBegin, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onExpressCancel, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onExpressCancel, this);
            this.BaseComment.lb_untouch.addEventListener(egret.TouchEvent.TOUCH_END, this.onExpressCancel, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onExpressBegin, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onExpressCancel, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onExpressCancel, this);
            this.BaseComment["btn_express" + i].addEventListener(egret.TouchEvent.TOUCH_END, this.onExpressCancel, this);
        }
        // this.BaseComment.touchEnabled = true;
        // this.BaseComment.touchChildren = true;
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onbegin, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.BaseComment.gp_game.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
        this.BaseComment.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBackBtnHandler, this);
        // 小米平台去掉退出按钮
        if (App.IsXiaoMi || App.IsWanba) {
            this.BaseComment.btn_return.visible = false;
            this.BaseComment.btn_return.touchEnabled = false;
        }
        this.BaseComment.btn_sum.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSum, this);
        this.BaseComment.btn_lose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLose, this);
        this.BaseComment.btn_sumYes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgreeSum, this);
        this.BaseComment.btn_sumNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefuseSum, this);
        this.BaseComment.btn_loseYes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgreeLose, this);
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
        this.AIObj = new AIChessFive();
    };
    // 弹出游戏结果画面
    GameFiveinARowView.prototype.onGameResult = function (data) {
        this.stop();
        DataCenter.instance.room.gameResult = data;
        this.popup("GameResult");
    };
    GameFiveinARowView.prototype.stop = function () {
    };
    //画棋盘  1.收集棋盘上的点 2.放置隐形的容器接收移动事件
    GameFiveinARowView.prototype.onDraw = function () {
        this.num_beginX = Math.floor((App.GameWidth - 588) / 2);
        // this.img_Chess.x = this.num_beginX - 1;
        // this.img_Chess.y = this.num_beginY - 1;
        this.num_YIN_X = this.num_beginX - GameFiveinARowView.LINE_DISTANCE / 2;
        this.num_YIM_Y = this.num_beginY + GameFiveinARowView.LINE_DISTANCE * 2;
        this.num_YIN_W = this.num_YIN_X + 630;
        this.num_YIM_H = this.num_YIM_Y + 630;
        //纵向
        // for (var i = 0; i < 15; ++i) {
        //     var shp: egret.Shape = new egret.Shape();
        //     var num: number = 2;
        //     if (i == 0 || i == 14) {
        //         num = 3;
        //     }
        //     shp.graphics.beginFill(0xff0000, 1);
        //     shp.graphics.drawRect(0, 0, 588, num);
        //     shp.x = this.num_beginX;
        //     shp.y = i * GameFiveinARowView.LINE_DISTANCE + this.num_beginY;
        //     shp.graphics.endFill();
        //     this.BaseComment.addChild(shp);
        // }
        // //横向
        // for (var j = 0; j < 15; ++j) {
        //     var shp: egret.Shape = new egret.Shape();
        //     var num: number = 2;
        //     if (j == 0 || j == 14) {
        //         num = 3;
        //     }
        //     shp.graphics.beginFill(0xff0000, 1);
        //     shp.graphics.drawRect(0, 0, num, 588);
        //     shp.graphics.endFill();
        //     this.BaseComment.addChild(shp);
        //     shp.y = this.num_beginY;
        //     shp.x = j * GameFiveinARowView.LINE_DISTANCE + this.num_beginX;
        // }
        //收集点
        this.onCollectPot();
    };
    //开始
    GameFiveinARowView.prototype.onbegin = function (e) {
        //console.log("表情：", this.isExpress);
        if (!this.isSelfRound || this.isGameOver || this.isExpress) {
            return;
        }
        if (this.BaseComment.gp_sum.visible == true || this.BaseComment.gp_lose.visible == true) {
            return;
        }
        //如果在有效区域内
        if (this.onJudceEffect(e.stageX, e.stageY)) {
            this.isEffectLoction = true;
            var initX = Math.floor((e.stageX - this.num_YIN_X) / GameFiveinARowView.LINE_DISTANCE);
            var initY = Math.floor((e.stageY - this.num_YIM_Y) / GameFiveinARowView.LINE_DISTANCE);
            if (initX > 14) {
                initX = 14;
            }
            if (initY > 14) {
                initY = 14;
            }
            this.ShadowChess.x = this.Obj_Pot["" + initX + "_" + initY][0];
            this.ShadowChess.y = this.Obj_Pot["" + initX + "_" + initY][1];
            this.ShadowChess.INIT_X = initX;
            this.ShadowChess.INIT_Y = initY;
            this.ShadowChess.visible = true;
        }
    };
    //移动
    GameFiveinARowView.prototype.onMove = function (e) {
        if (!this.isEffectLoction || !this.isSelfRound || this.isGameOver || this.isExpress) {
            return;
        }
        if (this.onJudceEffect(e.stageX, e.stageY)) {
            var initX = Math.floor((e.stageX - this.num_YIN_X) / GameFiveinARowView.LINE_DISTANCE);
            var initY = Math.floor((e.stageY - this.num_YIM_Y) / GameFiveinARowView.LINE_DISTANCE);
            if (initX > 14) {
                initX = 14;
            }
            if (initY > 14) {
                initY = 14;
            }
            this.ShadowChess.x = this.Obj_Pot["" + initX + "_" + initY][0];
            this.ShadowChess.y = this.Obj_Pot["" + initX + "_" + initY][1];
            this.ShadowChess.INIT_X = initX;
            this.ShadowChess.INIT_Y = initY;
            this.ShadowChess.visible = true;
            //console.log("移动的坐标：", initX, initY)
        }
        else {
            this.ShadowChess.visible = false;
        }
    };
    //结束
    GameFiveinARowView.prototype.onEnd = function (e) {
        //console.log("结束的坐标：", e.stageX, e.stageY);
        if (!this.isEffectLoction || !this.isSelfRound || this.isGameOver || this.isExpress) {
            return;
        }
        //若果影子存在
        if (this.ShadowChess.visible) {
            this.ShadowChess.visible = false;
            if (this.chessboardArr[this.ShadowChess.INIT_X][this.ShadowChess.INIT_Y] == 0) {
                var myChess = new ChessmanFive(this.SELF_TYPE);
                myChess.x = this.Obj_Pot["" + this.ShadowChess.INIT_X + "_" + this.ShadowChess.INIT_Y][0];
                myChess.y = this.Obj_Pot["" + this.ShadowChess.INIT_X + "_" + this.ShadowChess.INIT_Y][1];
                this.BaseComment.img_red.visible = true;
                this.BaseComment.img_red.x = myChess.x;
                this.BaseComment.img_red.y = myChess.y;
                this.BaseComment.gp_chess.addChild(myChess);
                // var str = "down_chess_mp3"
                // App.SoundManager.playEffect(str);
                GameFiveinARowView.volume_global.play("down_chess_mp3", true);
                this.Obj_Chess["" + this.ShadowChess.INIT_X + "_" + this.ShadowChess.INIT_Y] = myChess;
                this.onChessNumber();
                //估值追踪系统
                // if (this.AIObj.Decision_X != -1) {
                //     this.AIObj.InitValueX = this.AIObj.Decision_X;
                //     this.AIObj.InitValueY = this.AIObj.Decision_Y;
                // }
                // else {
                this.AIObj.InitValueX = this.ShadowChess.INIT_X;
                this.AIObj.InitValueY = this.ShadowChess.INIT_Y;
                //}
                this.chessboardArr[this.ShadowChess.INIT_X][this.ShadowChess.INIT_Y] = this.SELF_TYPE;
                //console.log("添加棋子成功");
                this.isSelfRound = false;
                this.onStatusChange();
                this.onJudceSuccess(this.ShadowChess.INIT_X, this.ShadowChess.INIT_Y);
            }
        }
    };
    //坐标点是否有效
    GameFiveinARowView.prototype.onJudceEffect = function (num_x, num_y) {
        var numX = num_x;
        var numY = num_y;
        if (numX >= this.num_YIN_X && numX <= this.num_YIN_W) {
            //-30防止与下排按钮冲突
            if (numY >= this.num_YIM_Y && numY <= this.num_YIM_H - 30) {
                return true;
            }
        }
        return false;
    };
    //判断是否五子连珠
    GameFiveinARowView.prototype.onJudceSuccess = function (num_x, num_y) {
        var _this = this;
        //横向
        this.numSelfSuccess_1 = 1;
        //纵向
        this.numSelfSuccess_2 = 1;
        //斜向
        this.numSelfSuccess_3 = 1;
        //反斜向
        this.numSelfSuccess_4 = 1;
        this.onJudce(num_x, num_y);
        var type = 0;
        if (this.numSelfSuccess_1 >= 5) {
            type = 1;
            //console.log("!!!!!!!!!横向5子");
        }
        if (this.numSelfSuccess_2 >= 5) {
            type = 2;
            //console.log("纵向5子~~~~~~~~~~~~~~~~~`");
        }
        if (this.numSelfSuccess_3 >= 5) {
            type = 3;
            //console.log("斜向5子~~~~~~~~~~~~~~~~~`");
        }
        if (this.numSelfSuccess_4 >= 5) {
            type = 4;
            //console.log("反斜向5子~`");
        }
        //通知对方自己的操作，如果自己赢了通知赢了
        if (!DataCenter.instance.room.IsAI) {
            var str = "sendOperation|" + num_x + "|" + num_y + "|" + type;
            //ProxySocket.sendGameEvent(App.CurrRoomId, str);
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
        }
        else {
            if (type == 0 && !this.isGameOver) {
                this.AIObj.ChessArr = this.chessboardArr;
                this.AIObj.onJudce();
                App.TimerManager.doTimer(3000, 1, function () {
                    _this.onAddEnemy(_this.AIObj.Decision_X, _this.AIObj.Decision_Y, _this.AIObj.AIWin);
                }, this);
            }
        }
        // //测试AI的代码
        // if (DataCenter.instance.room.selfIsMaster) {
        //     this.AIObj.ChessArr = this.chessboardArr;
        //     this.AIObj.onJudce();
        // }
        // //暂时注释
        // this.BaseComment.touchEnabled = false;
        // this.BaseComment.touchChildren = false;
        //自己赢了 
        if (type > 0) {
            //自己赢了
            this.selfIsWin = true;
            this.onFiveSuccessCartoon(num_x, num_y, type);
            App.TimerManager.doTimer(4500, 1, function () {
                _this.gameOver(3);
            }, this);
        }
        else if (this.AIObj.AIWin > 0) {
            App.TimerManager.doTimer(7500, 1, function () {
                _this.gameOver(1);
            }, this);
        }
    };
    GameFiveinARowView.prototype.gameOver = function (result) {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, result);
    };
    //4向判定
    GameFiveinARowView.prototype.onJudce = function (INIT_X, INIT_Y) {
        //左面
        for (var i = 1; i < 5; i++) {
            var num1 = INIT_X - i;
            if (num1 < 0) {
                break;
            }
            if (this.chessboardArr[num1][INIT_Y] == this.SELF_TYPE) {
                this.numSelfSuccess_1++;
            }
            else {
                break;
            }
        }
        //右面
        for (var i = 1; i < 5; i++) {
            var num2 = INIT_X + i;
            if (num2 > 14) {
                break;
            }
            if (this.chessboardArr[num2][INIT_Y] == this.SELF_TYPE) {
                this.numSelfSuccess_1++;
            }
            else {
                break;
            }
        }
        //上面
        for (var i = 1; i < 5; i++) {
            var num3 = INIT_Y - i;
            if (num3 < 0) {
                break;
            }
            if (this.chessboardArr[INIT_X][num3] == this.SELF_TYPE) {
                this.numSelfSuccess_2++;
            }
            else {
                break;
            }
        }
        //下面
        for (var i = 1; i < 5; i++) {
            var num4 = INIT_Y + i;
            if (num4 > 14) {
                break;
            }
            if (this.chessboardArr[INIT_X][num4] == this.SELF_TYPE) {
                this.numSelfSuccess_2++;
            }
            else {
                break;
            }
        }
        //斜向
        for (var i = 1; i < 5; i++) {
            var num5 = INIT_X - i;
            var num6 = INIT_Y - i;
            if (num5 < 0 || num6 < 0) {
                break;
            }
            if (this.chessboardArr[num5][num6] == this.SELF_TYPE) {
                this.numSelfSuccess_3++;
            }
            else {
                break;
            }
        }
        for (var i = 1; i < 5; i++) {
            var num7 = INIT_X + i;
            var num8 = INIT_Y + i;
            if (num7 > 14 || num8 > 14) {
                break;
            }
            if (this.chessboardArr[num7][num8] == this.SELF_TYPE) {
                this.numSelfSuccess_3++;
            }
            else {
                break;
            }
        }
        //反斜向
        for (var i = 1; i < 5; i++) {
            var num9 = INIT_X - i;
            var num10 = INIT_Y + i;
            if (num9 < 0 || num10 > 14) {
                break;
            }
            if (this.chessboardArr[num9][num10] == this.SELF_TYPE) {
                this.numSelfSuccess_4++;
            }
            else {
                break;
            }
        }
        for (var i = 1; i < 5; i++) {
            var num11 = INIT_X + i;
            var num12 = INIT_Y - i;
            if (num11 > 14 || num12 < 0) {
                break;
            }
            if (this.chessboardArr[num11][num12] == this.SELF_TYPE) {
                this.numSelfSuccess_4++;
            }
            else {
                break;
            }
        }
    };
    GameFiveinARowView.prototype.onCollectPot = function () {
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                var data = [0, 0];
                data[0] = i * 42 + 26;
                data[1] = j * 42 + this.num_beginY;
                this.Obj_Pot["" + i + "_" + j] = data;
            }
        }
    };
    GameFiveinARowView.prototype.show = function () {
        _super.prototype.show.call(this);
        if (DataCenter.instance.room.selfIsMaster) {
            // this.BaseComment.touchEnabled = true;
            // this.BaseComment.touchChildren = true;
            this.SELF_TYPE = 1;
            this.ENENY_TYPE = 2;
            this.onTipsShow(0); //你是先手
            this.isSelfRound = true;
        }
        else {
            // this.BaseComment.touchEnabled = false;
            // this.BaseComment.touchChildren = false;
            this.SELF_TYPE = 2;
            this.ENENY_TYPE = 1;
            this.onTipsShow(1); //对方先手
            this.isSelfRound = false;
        }
        //旗盒
        this.BaseComment.img_Chesstype1.source = "img_he" + this.SELF_TYPE + "_png";
        this.BaseComment.img_Chesstype2.source = "img_he" + this.ENENY_TYPE + "_png";
        //头部初始状态
        this.onStatusChange();
        //实例化隐形棋
        this.ShadowChess = new ChessmanShadow(this.SELF_TYPE);
        this.ShadowChess.visible = false;
        this.BaseComment.gp_red.addChild(this.ShadowChess);
        //停掉背景音效
        App.SoundManager.stopBg();
        App.SoundManager.playBg("bg_fiveMusic_mp3");
    };
    //网络事件
    GameFiveinARowView.prototype.onGameEvent = function (data) {
        var _this = this;
        var parseData = function (data) {
            var splitChar = data.split("|");
            return splitChar;
        };
        var datas = parseData(data.event);
        switch (datas[0]) {
            case "sendOperation":
                this.onAddEnemy(datas[1], datas[2], datas[3]);
                break;
            case "sendExpress":
                this.addQiPaoCartoon(datas[1], 2);
                break;
            case "giveUp":
                this.isGameOver = true;
                // var str = "five_win_mp3"
                // App.SoundManager.playEffect(str);
                GameFiveinARowView.volume_global.play("five_win_mp3", true);
                this.onTipsShow(3);
                App.TimerManager.doTimer(3000, 1, function () {
                    _this.gameOver(3);
                }, this);
                break;
            case "SumShow":
                this.BaseComment.gp_sum.visible = true;
                this.BaseComment.numTimeRefuseSum = 5;
                break;
            case "AGreeSum":
                //和棋--
                this.onTipsShow(6);
                this.isGameOver = true;
                this.onTipsShow(2);
                App.TimerManager.doTimer(3000, 1, function () {
                    _this.gameOver(2);
                }, this);
                break;
            case "RefuseSum":
                this.onTipsShow(5);
                break;
            default:
                break;
        }
    };
    //添加敌方棋子
    GameFiveinARowView.prototype.onAddEnemy = function (data1, data2, data3) {
        var myChess = new ChessmanFive(this.ENENY_TYPE);
        myChess.x = this.Obj_Pot["" + data1 + "_" + data2][0];
        myChess.y = this.Obj_Pot["" + data1 + "_" + data2][1];
        this.BaseComment.img_red.visible = true;
        this.BaseComment.img_red.x = myChess.x;
        this.BaseComment.img_red.y = myChess.y;
        this.BaseComment.gp_chess.addChild(myChess);
        // var str = "down_chess_mp3"
        // App.SoundManager.playEffect(str);
        GameFiveinARowView.volume_global.play("down_chess_mp3", true);
        this.Obj_Chess["" + data1 + "_" + data2] = myChess;
        this.onChessNumber();
        this.chessboardArr[data1][data2] = this.ENENY_TYPE;
        if (data3 == 0) {
            // this.BaseComment.touchEnabled = true;
            // this.BaseComment.touchChildren = true;
            this.isSelfRound = true;
            this.onStatusChange();
        }
        else {
            // this.BaseComment.touchEnabled = false;
            // this.BaseComment.touchChildren = false;
            this.onFiveSuccessCartoon(Number(data1), Number(data2), Number(data3));
        }
    };
    //统计棋子的数量
    GameFiveinARowView.prototype.onChessNumber = function () {
        var _this = this;
        this.numChess++;
        if (this.numChess >= 225) {
            //和棋--
            this.isGameOver = true;
            this.onTipsShow(2);
            App.TimerManager.doTimer(3000, 1, function () {
                _this.gameOver(2);
            }, this);
        }
    };
    // 请求游戏返回
    GameFiveinARowView.prototype.goBackBtnHandler = function () {
        // 弹出退出确认面板
        this.popup("GameSureLeave");
    };
    //求和
    GameFiveinARowView.prototype.onSum = function () {
        var _this = this;
        if (this.isGameOver) {
            return;
        }
        if (this.num_sum == 1) {
            this.num_sum--;
            this.onTipsShow(4);
            //发送求和
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "SumShow");
            }
            else {
                App.TimerManager.doTimer(2000, 1, function () {
                    _this.onTipsShow(5);
                }, this);
            }
        }
    };
    //认输
    GameFiveinARowView.prototype.onLose = function () {
        if (this.isGameOver) {
            return;
        }
        this.BaseComment.gp_lose.visible = true;
    };
    //同意求和
    GameFiveinARowView.prototype.onAgreeSum = function () {
        var _this = this;
        //发送同意求和
        this.BaseComment.gp_sum.visible = false;
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "AGreeSum");
        //和棋--
        this.isGameOver = true;
        this.onTipsShow(2);
        App.TimerManager.doTimer(3000, 1, function () {
            _this.gameOver(2);
        }, this);
    };
    //同意认输
    GameFiveinARowView.prototype.onAgreeLose = function () {
        //发送认输
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "giveUp");
        }
        else {
            this.gameOver(1);
        }
        this.isGameOver = true;
        // var str = "five_lose_mp3"
        // App.SoundManager.playEffect(str);
        GameFiveinARowView.volume_global.play("five_lose_mp3", true);
        this.BaseComment.gp_lose.visible = false;
    };
    //拒绝求和
    GameFiveinARowView.prototype.onRefuseSum = function () {
        App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "RefuseSum");
    };
    //提示五子连珠动画
    GameFiveinARowView.prototype.onFiveSuccessCartoon = function (num_X, num_Y, type) {
        this.isGameOver = true;
        if (this.selfIsWin) {
            // var str = "five_win_mp3"
            // App.SoundManager.playEffect(str);
            GameFiveinARowView.volume_global.play("five_win_mp3", true);
        }
        else {
            // var str = "five_lose_mp3"
            // App.SoundManager.playEffect(str);
            GameFiveinARowView.volume_global.play("five_lose_mp3", true);
        }
        this.BaseComment.gp_lose.visible = false;
        this.BaseComment.gp_sum.visible = false;
        var img;
        var strTemp = "11111" || "22222";
        if (type > 2) {
            img = this.BaseComment.img_aperture_2;
        }
        else {
            img = this.BaseComment.img_aperture_1;
        }
        if (type % 2 == 0) {
            img.rotation = 90;
        }
        var posiition;
        var str1 = "";
        var des_x = num_X;
        var des_y = num_Y;
        switch (type) {
            case 1:
                //横向
                for (var i = 0; i < 11; ++i) {
                    for (var j = 0; j < 15; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i + k][j];
                        }
                        if (str == "11111" || str == "22222") {
                            des_x = i + 2;
                            des_y = j;
                        }
                    }
                }
                break;
            case 2:
                //纵向
                for (var i = 0; i < 15; ++i) {
                    for (var j = 0; j < 11; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i][j + k];
                        }
                        if (str == "11111" || str == "22222") {
                            des_x = i;
                            des_y = j + 2;
                        }
                    }
                }
                break;
            case 3:
                //斜向
                for (var i = 0; i < 11; ++i) {
                    for (var j = 0; j < 11; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i + k][j + k];
                        }
                        if (str == "11111" || str == "22222") {
                            des_x = i + 2;
                            des_y = j + 2;
                        }
                    }
                }
                break;
            case 4:
                //反斜向
                for (var i = 4; i < 15; ++i) {
                    for (var j = 0; j < 11; j++) {
                        var str = "";
                        for (var k = 0; k < 5; ++k) {
                            str += this.chessboardArr[i - k][j + k];
                        }
                        if (str == "11111" || str == "22222") {
                            des_x = i - 2;
                            des_y = j + 2;
                        }
                    }
                }
                break;
        }
        img.x = this.Obj_Pot["" + des_x + "_" + des_y][0];
        img.y = this.Obj_Pot["" + des_x + "_" + des_y][1];
        img.visible = true;
        egret.Tween.get(img).to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 1500).call(function () { });
    };
    //信息提示
    GameFiveinARowView.prototype.onTipsShow = function (type) {
        var _this = this;
        this.BaseComment.lb_tip.text = "";
        this.BaseComment.gp_tipMessage.alpha = 1;
        this.BaseComment.lb_tip.text = this.ArrMessage[type];
        if (type == 3 || type == 4 || type == 5 || type == 6)
            this.BaseComment.lb_tip.size = 23;
        else
            this.BaseComment.lb_tip.size = 30;
        egret.Tween.get(this.BaseComment.gp_tipMessage).wait(1000).to({ alpha: 0 }, 500).call(function () {
            App.TimerManager.doTimer(1000, 0, _this.onTimerUpdate, _this);
        });
    };
    //
    GameFiveinARowView.prototype.addQiPaoCartoon = function (data, type) {
        if (type === void 0) { type = 1; }
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(120, 130);
        this.addChild(qiPao);
        if (type == 2) {
            qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 165, App.GameWidth - 145);
            qiPao.setSouce(data, true, 1);
        }
        else {
            qiPao.setSouce(data, false, 1);
            qiPao.x = App.RandomUtils.limitInteger(145, 165);
            if (!DataCenter.instance.room.IsAI) {
                var str = "sendExpress|" + data;
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            else {
                var num = App.RandomUtils.limitInteger(1, 5);
                if (num % 2 != 0) {
                    App.TimerManager.doTimer(1000 * num, 1, this.AddAIexpress, this);
                }
            }
        }
        if (type == 1) {
            qiPao.img_1.scaleX = -1;
            qiPao.onPlay(1);
        }
        else {
            // qiPao.img_2.scaleX = -1;
            qiPao.onPlay(2);
        }
    };
    //添加Ai的表情
    GameFiveinARowView.prototype.AddAIexpress = function () {
        var num = App.RandomUtils.limitInteger(1, 6);
        var str = "Express_five" + num + "_png";
        this.addQiPaoCartoon(str, 2);
    };
    //点击表情
    GameFiveinARowView.prototype.onSendMessage = function (e) {
        var time1 = egret.getTimer();
        if (time1 - DataCenter.instance.SendExpressTime > 500) {
            DataCenter.instance.SendExpressTime = time1;
            var str = "Express_five" + e.target.name + "_png";
            this.addQiPaoCartoon(str, 1);
        }
    };
    //开始点击表情
    GameFiveinARowView.prototype.onExpressBegin = function () {
        this.isExpress = true;
    };
    //完成点击表情
    GameFiveinARowView.prototype.onExpressCancel = function () {
        this.isExpress = false;
    };
    GameFiveinARowView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        App.TimerManager.remove(this.onTimerUpdate, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        // 游戏结果返回
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
    };
    //状态转化
    GameFiveinARowView.prototype.onStatusChange = function () {
        this.num_time = 45;
        if (this.isSelfRound) {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "你的回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Your turn " + this.num_time + "s";
                    break;
            }
            this.num_sum = 1;
            if (this.SELF_TYPE == 2) {
                this.BaseComment.lb_time.textColor = 0x5a5a5a;
                this.BaseComment.bg_wait.source = "chess_row2_png";
            }
            else {
                this.BaseComment.lb_time.textColor = 0xffffff;
                this.BaseComment.bg_wait.source = "chess_row1_png";
            }
            this.BaseComment.bg_wait.horizontalCenter = -23;
            this.BaseComment.bg_wait.scaleX = -1;
        }
        else {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "对手回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Opponent turn " + this.num_time + "s";
                    break;
            }
            if (this.ENENY_TYPE == 2) {
                this.BaseComment.lb_time.textColor = 0x5a5a5a;
                this.BaseComment.bg_wait.source = "chess_row2_png";
            }
            else {
                this.BaseComment.lb_time.textColor = 0xffffff;
                this.BaseComment.bg_wait.source = "chess_row1_png";
            }
            this.BaseComment.bg_wait.horizontalCenter = 23;
            this.BaseComment.bg_wait.scaleX = 1;
        }
    };
    //每秒刷新
    GameFiveinARowView.prototype.onTimerUpdate = function () {
        var _this = this;
        if (this.isGameOver) {
            App.TimerManager.remove(this.onTimerUpdate, this);
            return;
        }
        if (this.num_time > 0) {
            this.num_time--;
            if (this.num_time <= 10) {
                // var str = "time_Fivelast_mp3"
                // App.SoundManager.playEffect(str);
                GameFiveinARowView.volume_global.play("time_Fivelast_mp3", true);
            }
            //自动拒绝求和
            if (this.BaseComment.gp_sum.visible == true) {
                this.BaseComment.numTimeRefuseSum--;
                if (this.BaseComment.numTimeRefuseSum > 0) {
                    switch (App.Language) {
                        case LanguageType.Ch:
                            this.BaseComment.btn_sumNo["label"] = "拒绝(" + this.BaseComment.numTimeRefuseSum + "秒)";
                            break;
                        case LanguageType.En:
                            this.BaseComment.btn_sumNo["label"] = "refuse(" + this.BaseComment.numTimeRefuseSum + "s)";
                            break;
                    }
                }
                else {
                    //自动拒绝求和
                    this.onRefuseSum();
                    this.BaseComment.gp_sum.visible = false;
                }
            }
        }
        else {
            if (this.isSelfRound) {
                if (!DataCenter.instance.room.IsAI) {
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "giveUp");
                }
                this.isGameOver = true;
                this.onTipsShow(7);
                App.TimerManager.doTimer(2000, 1, function () {
                    _this.gameOver(1);
                }, this);
            }
            //超时
            return;
        }
        if (this.isSelfRound) {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "你的回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Your turn " + this.num_time + "s";
                    break;
            }
        }
        else {
            switch (App.Language) {
                case LanguageType.Ch:
                    this.BaseComment.lb_time.text = "对手回合 " + this.num_time + "s";
                    break;
                case LanguageType.En:
                    this.BaseComment.lb_time.text = "Opponent turn " + this.num_time + "s";
                    break;
            }
        }
    };
    GameFiveinARowView.GAME_WIDTH = 640;
    GameFiveinARowView.GAME_HEIGHT = 1136;
    GameFiveinARowView.LINE_DISTANCE = 42; // 14*42 = 588   15*42 = 630
    GameFiveinARowView.AILEVEL = 0; //取价值点
    return GameFiveinARowView;
}(State));
__reflect(GameFiveinARowView.prototype, "GameFiveinARowView");
