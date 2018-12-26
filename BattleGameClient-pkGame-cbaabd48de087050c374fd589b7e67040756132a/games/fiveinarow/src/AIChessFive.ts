// 五子棋AI
class AIChessFive {

    public ChessArr: Array<any> = [];
    public TempThree: Array<any> = [];//存放3+3两侧的点

    public ArrSelf4 = ["01111", "10111", "11011", "11101", "11110"];
    public ArrAI = ["02222", "20222", "22022", "22202", "22220"];
    private type: number = 0; //1.横 2.纵 3.斜 4.反斜
    private Init_X: number;
    private Init_Y: number;

    public Decision_X: number = -1;//最终决定 X
    public Decision_Y: number = -1;//最终决定 Y
    public AIWin: number = 0; //0 AI没赢   1 AI赢 
    public InitValueX = 7;
    public InitValueY = 7;

    //防御战
    //优先防守四     01111 10111 11011 11101 11110 （堵法是唯一的）
    //挡住所有的活三 01110、011010、010110   （判断堵哪一个最佳）
    //活二 0110 01010 


    //攻击
    //发现进攻四     直接放子取胜    

    //用于收集所有可走点
    public AllCanPot: Array<any> = [];


    public constructor() {
        // this.InitValueX = App.RandomUtils.limitInteger(6, 8);
        // this.InitValueY = App.RandomUtils.limitInteger(6, 8);
    }
    //判断4
    public onJudce() {
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

    }
    //四杀
    private onJudceWinFour(isAI: boolean = false): any {
        //纵向
        var ArrTemp: Array<any> = []
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
                    str == ArrTemp[4]
                ) {
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
        //横向
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
                    str == ArrTemp[4]
                ) {
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
                    str == ArrTemp[4]
                ) {
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
                    str == ArrTemp[4]
                ) {
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
    }
    //双4结构  优先级高于 活三   
    private onJudceWinDoubleFour(isAI: boolean = false): any {
        //收集地图内所有的点
        this.AllCanPot = []
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (this.ChessArr[i][j] == 0) {
                    var Arr = [i, j];
                    this.AllCanPot.push(Arr);
                }
            }
        }
        //AI 与 self
        var str = ""
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
    }
    //三杀
    private onJudceWinThree(isAI: boolean = false): any {
        var strTemp: string;
        var ArrTemp = [];
        if (isAI) {
            strTemp = "02220";
            ArrTemp = ["022020", "020220"];
        }
        else {
            strTemp = "01110";
            ArrTemp = ["011010", "010110"];
        }
        //纵向
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
                        var num1: number = this.ChessArr[i - 1][j];
                        var num2: number = this.ChessArr[i + 5][j];
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
        //横向
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
                        var num1: number = this.ChessArr[i][j - 1];
                        var num2: number = this.ChessArr[i][j + 5];
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
                            var num1: number = this.ChessArr[i - 1][j - 1];
                            var num2: number = this.ChessArr[5 + i][j + 5];
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
                    } else if (i < 14 && i > 4) {
                        if (j < 10 && j > 0) {
                            var num2: number = this.ChessArr[i - 5][j + 5];
                            var num1: number = this.ChessArr[i + 1][j + 1];
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
                    str == ArrTemp[1]
                ) {
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
                    str == ArrTemp[1]
                ) {
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
                    str == ArrTemp[1]
                ) {
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
                    str == ArrTemp[1]
                ) {
                    this.Init_X = i;
                    this.Init_Y = j;
                    this.type = 4;
                    return str;
                }
            }
        }

        return 0;
    }
    //决定4怎么走（至关重要）
    private onDecisionFour(str: string) {
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

    }
    //决定3怎么走  (AI成形了活三决定怎么走)
    //进攻 022020、020220 直接决定位置 02220看情况
    private onDecisionThree(str: string) {
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
    }
    //决定3怎么走（高级的）  //防守 走点估值函数   //后期会改
    //01110 需要再次判定一次  冲上活四                                                                    
    private onDecisionGradeThree(str: string) {
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
    }



    //点的估值
    private onValueOfPot() {
        //收集地图内所有的点
        this.AllCanPot = [];
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (this.ChessArr[i][j] == 0) {

                    var value: number = 100 - Math.abs(this.InitValueX - i) - Math.abs(this.InitValueY - j);
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

        this.AllCanPot.sort((a, b) => {
            if (a[2] > b[2]) {
                return -1;
            } else {
                return 1;
            }
        });

        //对方不存在4+3  优先将活三变活4
        if (this.AllCanPot[0][2] < 10000) {
            //活三操作
            var str_three1: any = this.onJudceWinThree(true);
            if (str_three1 == 0) {
                var str_three2: any = this.onJudceWinThree(false);
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
                    this.onDecisionGradeThree(str_three2);//阻击对方活三变活四
                    //}
                }
            }
            else {
                /***********333333333********* */
                this.onDecisionThree(str_three1);//将自己的活三变成活四 击杀对方
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








    }
    //加估值 三大操作
    //(1)双4结构 10000 9000(危)（优先级高于活三）   (对面至少7棵子)
    //(2)单四 + 活三 8000 7000（危）   (对面至少6棵子)
    //(3)双活三 6000 5000（危）   (对面至少5棵子)

    //（1）num_Loction相对于备选数组的位置
    private onStructureDoubleFour(num_Loction: number) {
        var num_X: number = this.AllCanPot[num_Loction][0];
        var num_Y: number = this.AllCanPot[num_Loction][1];
        var num_Value: number = this.AllCanPot[num_Loction][2];
        var StructureFour1: number = 0;//统计敌人 4的数量
        var StructureFour2: number = 0;//统计AI 4的数量

        var StructureThree1: number = 0;//统计敌人 3的数量
        var StructureThree111: number = 0;//统计敌人 3的数量  111 
        var StructureThree2: number = 0;//统计AI 3的数量
        var StructureThree222: number = 0;//统计AI 3的数量

        var strSelf_1: string = "";
        var strSelf_2: string = "";
        var strSelf_3: string = "";
        var strSelf_4: string = "";

        var strAI_1: string = "";
        var strAI_2: string = "";
        var strAI_3: string = "";
        var strAI_4: string = "";


        //横向
        var str1: string = "";
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
        var str2: string = "";
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
        var str3: string = "";
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
        var str4: string = "";
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

            var len: number = strTemp.length;

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
                        StrThreeTempSelf.indexOf("010110") != -1
                    ) {
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
        //敌人存在双4
        else if (StructureFour1 > 1) {
            this.AllCanPot[num_Loction][2] += 8000;
            //console.log("双4估值推荐:", StructureFour1);
            return;
        }
        //AI方存在 4 + 3
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
    }
}