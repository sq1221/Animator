var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by yangsong on 16/1/24.
 */
var game_loadProgress_notice_s2c = (function () {
    function game_loadProgress_notice_s2c() {
        this.msgId = 3002;
        this.userId = '';
        this.progress = 0;
    }
    game_loadProgress_notice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.userId);
        Msg.encode(buff, 'ushort', this.progress);
        return buff;
    };
    game_loadProgress_notice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.userId = Msg.decode(buff, 'string');
        this.progress = Msg.decode(buff, 'ushort');
    };
    return game_loadProgress_notice_s2c;
}());
__reflect(game_loadProgress_notice_s2c.prototype, "game_loadProgress_notice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var Proto = (function () {
    function Proto() {
    }
    Proto.init = function () {
        this.dic = {
            "1000": client_ping_c2s,
            "1001": client_network_c2s,
            "1002": client_network_s2c,
            "1999": error_notice_s2c,
            "2001": platform_login_c2s,
            "2002": platform_login_s2c,
            "3101": game_join_c2s,
            "3102": game_join_s2c,
            "3104": game_otherUserJoin_notice_s2c,
            "3001": game_loadProgress_c2s,
            "3002": game_loadProgress_notice_s2c,
            "3004": game_start_notice_s2c,
            "3005": game_exit_c2s,
            "3007": game_result_c2s,
            "3008": game_result_notice_s2c,
            "3009": game_event_c2s,
            "3010": game_event_notice_s2c,
            "3012": game_trunNumNotice_s2c,
            "3013": game_matching_c2s,
            "3014": game_matching_s2c,
            "3016": game_matching_notice_s2c,
            "3017": game_cancelMatching_c2s,
            "3018": game_cancelMatching_s2c,
        };
    };
    Proto.decode = function (buff) {
        var msgId = buff.readUnsignedShort();
        var cls = Proto.dic[msgId];
        if (!cls) {
            console.warn('收到未知消息ID：' + msgId);
            return null;
        }
        buff.position = 0;
        var data = new cls();
        data.decode(buff);
        return data;
    };
    Proto.dic = {};
    Proto.ID_client_ping_c2s = "1000";
    Proto.ID_client_network_c2s = "1001";
    Proto.ID_client_network_s2c = "1002";
    Proto.ID_error_notice_s2c = "1999";
    Proto.ID_platform_login_c2s = "2001";
    Proto.ID_platform_login_s2c = "2002";
    Proto.ID_game_join_c2s = "3101";
    Proto.ID_game_join_s2c = "3102";
    Proto.ID_game_otherUserJoin_notice_s2c = "3104";
    Proto.ID_game_loadProgress_c2s = "3001";
    Proto.ID_game_loadProgress_notice_s2c = "3002";
    Proto.ID_game_start_notice_s2c = "3004";
    Proto.ID_game_exit_c2s = "3005";
    Proto.ID_game_result_c2s = "3007";
    Proto.ID_game_result_notice_s2c = "3008";
    Proto.ID_game_event_c2s = "3009";
    Proto.ID_game_event_notice_s2c = "3010";
    Proto.ID_game_trunNumNotice_s2c = "3012";
    Proto.ID_game_matching_c2s = "3013";
    Proto.ID_game_matching_s2c = "3014";
    Proto.ID_game_matching_notice_s2c = "3016";
    Proto.ID_game_cancelMatching_c2s = "3017";
    Proto.ID_game_cancelMatching_s2c = "3018";
    return Proto;
}());
__reflect(Proto.prototype, "Proto");
App.Proto = Proto;
/**
 * Created by yangsong on 16/1/24.
 */
var client_network_c2s = (function () {
    function client_network_c2s() {
        this.msgId = 1001;
        this.time = 0;
    }
    client_network_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'uint32', this.time);
        return buff;
    };
    client_network_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.time = Msg.decode(buff, 'uint32');
    };
    return client_network_c2s;
}());
__reflect(client_network_c2s.prototype, "client_network_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var client_network_s2c = (function () {
    function client_network_s2c() {
        this.msgId = 1002;
        this.time = 0;
    }
    client_network_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'uint32', this.time);
        return buff;
    };
    client_network_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.time = Msg.decode(buff, 'uint32');
    };
    return client_network_s2c;
}());
__reflect(client_network_s2c.prototype, "client_network_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var client_ping_c2s = (function () {
    function client_ping_c2s() {
        this.msgId = 1000;
    }
    client_ping_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        return buff;
    };
    client_ping_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
    };
    return client_ping_c2s;
}());
__reflect(client_ping_c2s.prototype, "client_ping_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var error_notice_s2c = (function () {
    function error_notice_s2c() {
        this.msgId = 1999;
        this.errorCode = 0;
    }
    error_notice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'uint32', this.errorCode);
        return buff;
    };
    error_notice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.errorCode = Msg.decode(buff, 'uint32');
    };
    return error_notice_s2c;
}());
__reflect(error_notice_s2c.prototype, "error_notice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_cancelMatching_c2s = (function () {
    function game_cancelMatching_c2s() {
        this.msgId = 3017;
        this.userId = '';
    }
    game_cancelMatching_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.userId);
        return buff;
    };
    game_cancelMatching_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.userId = Msg.decode(buff, 'string');
    };
    return game_cancelMatching_c2s;
}());
__reflect(game_cancelMatching_c2s.prototype, "game_cancelMatching_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var game_cancelMatching_s2c = (function () {
    function game_cancelMatching_s2c() {
        this.msgId = 3018;
    }
    game_cancelMatching_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        return buff;
    };
    game_cancelMatching_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
    };
    return game_cancelMatching_s2c;
}());
__reflect(game_cancelMatching_s2c.prototype, "game_cancelMatching_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_event_c2s = (function () {
    function game_event_c2s() {
        this.msgId = 3009;
        this.roomId = '';
        this.sendType = 0;
        this.event = '';
    }
    game_event_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.roomId);
        Msg.encode(buff, 'byte', this.sendType);
        Msg.encode(buff, 'string', this.event);
        return buff;
    };
    game_event_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.roomId = Msg.decode(buff, 'string');
        this.sendType = Msg.decode(buff, 'byte');
        this.event = Msg.decode(buff, 'string');
    };
    return game_event_c2s;
}());
__reflect(game_event_c2s.prototype, "game_event_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var game_event_notice_s2c = (function () {
    function game_event_notice_s2c() {
        this.msgId = 3010;
        this.userId = '';
        this.event = '';
        this.trunNum = 0;
    }
    game_event_notice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.userId);
        Msg.encode(buff, 'string', this.event);
        Msg.encode(buff, 'uint32', this.trunNum);
        return buff;
    };
    game_event_notice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.userId = Msg.decode(buff, 'string');
        this.event = Msg.decode(buff, 'string');
        this.trunNum = Msg.decode(buff, 'uint32');
    };
    return game_event_notice_s2c;
}());
__reflect(game_event_notice_s2c.prototype, "game_event_notice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_exit_c2s = (function () {
    function game_exit_c2s() {
        this.msgId = 3005;
        this.roomId = '';
    }
    game_exit_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.roomId);
        return buff;
    };
    game_exit_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.roomId = Msg.decode(buff, 'string');
    };
    return game_exit_c2s;
}());
__reflect(game_exit_c2s.prototype, "game_exit_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var game_join_c2s = (function () {
    function game_join_c2s() {
        this.msgId = 3101;
        this.roomId = '';
    }
    game_join_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.roomId);
        return buff;
    };
    game_join_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.roomId = Msg.decode(buff, 'string');
    };
    return game_join_c2s;
}());
__reflect(game_join_c2s.prototype, "game_join_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var game_join_s2c = (function () {
    function game_join_s2c() {
        this.msgId = 3102;
        this.myUser = new userInfo();
        this.otherUser = new userInfo();
        this.isAi = 0;
        this.aiLevel = 0;
    }
    game_join_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'userInfo', this.myUser);
        Msg.encode(buff, 'userInfo', this.otherUser);
        Msg.encode(buff, 'ushort', this.isAi);
        Msg.encode(buff, 'ushort', this.aiLevel);
        return buff;
    };
    game_join_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.myUser = Msg.decode(buff, userInfo);
        this.otherUser = Msg.decode(buff, userInfo);
        this.isAi = Msg.decode(buff, 'ushort');
        this.aiLevel = Msg.decode(buff, 'ushort');
    };
    return game_join_s2c;
}());
__reflect(game_join_s2c.prototype, "game_join_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_loadProgress_c2s = (function () {
    function game_loadProgress_c2s() {
        this.msgId = 3001;
        this.roomId = '';
        this.progress = 0;
    }
    game_loadProgress_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.roomId);
        Msg.encode(buff, 'ushort', this.progress);
        return buff;
    };
    game_loadProgress_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.roomId = Msg.decode(buff, 'string');
        this.progress = Msg.decode(buff, 'ushort');
    };
    return game_loadProgress_c2s;
}());
__reflect(game_loadProgress_c2s.prototype, "game_loadProgress_c2s");
/**
 * Created by yangsong on 2016/7/27.
 */
var Msg = (function () {
    function Msg() {
    }
    Msg.encode = function (buff, fieldType, fieldValue, arrayType) {
        if (arrayType === void 0) { arrayType = null; }
        if (fieldType == 'byte') {
            buff.writeByte(fieldValue);
        }
        else if (fieldType == 'short') {
            buff.writeShort(fieldValue);
        }
        else if (fieldType == 'ushort') {
            buff.writeUnsignedShort(fieldValue);
        }
        else if (fieldType == 'int32') {
            buff.writeInt(fieldValue);
        }
        else if (fieldType == 'uint32') {
            buff.writeUnsignedInt(fieldValue);
        }
        else if (fieldType == 'int64') {
            buff.writeInt(fieldValue.high);
            buff.writeUnsignedInt(fieldValue.low);
        }
        else if (fieldType == 'uint64') {
            buff.writeUnsignedInt(fieldValue.high);
            buff.writeUnsignedInt(fieldValue.low);
        }
        else if (fieldType == 'string') {
            buff.writeByte(1);
            buff.writeUTF(fieldValue);
        }
        else if (fieldType == 'float') {
            buff.writeFloat(fieldValue);
        }
        else if (fieldType == 'double') {
            buff.writeDouble(fieldValue);
        }
        else if (fieldType == 'array') {
            Msg.encodeArray(buff, fieldValue, arrayType);
        }
        else {
            var byteArray = fieldValue.encode();
            buff.writeByte(1);
            buff.writeUnsignedShort(byteArray.length);
            buff.writeBytes(byteArray);
        }
    };
    Msg.decode = function (buff, fieldType, arrayType) {
        if (arrayType === void 0) { arrayType = null; }
        var result = null;
        if (fieldType == 'byte') {
            result = buff.readByte();
        }
        else if (fieldType == 'short') {
            result = buff.readShort();
        }
        else if (fieldType == 'ushort') {
            result = buff.readUnsignedShort();
        }
        else if (fieldType == 'int32') {
            result = buff.readInt();
        }
        else if (fieldType == 'uint32') {
            result = buff.readUnsignedInt();
        }
        else if (fieldType == 'int64') {
            var high = buff.readInt();
            var low = buff.readUnsignedInt();
            result = new Long(low, high, false);
        }
        else if (fieldType == 'uint64') {
            var high = buff.readUnsignedInt();
            var low = buff.readUnsignedInt();
            result = new Long(low, high, true);
        }
        else if (fieldType == 'string') {
            buff.readByte();
            result = buff.readUTF();
        }
        else if (fieldType == 'float') {
            result = buff.readFloat();
        }
        else if (fieldType == 'double') {
            result = buff.readDouble();
        }
        else if (fieldType == 'array') {
            result = Msg.decodeArray(buff, arrayType);
        }
        else {
            buff.readByte();
            buff.readUnsignedShort();
            var cls = fieldType;
            var model = new cls();
            model.decode(buff);
            result = model;
        }
        return result;
    };
    Msg.decodeArray = function (buff, fieldtype) {
        var len = buff.readShort();
        var arr = [];
        for (var index = 0; index < len; index++) {
            var temp = Msg.decode(buff, fieldtype);
            arr.push(temp);
        }
        return arr;
    };
    Msg.encodeArray = function (buff, fieldValue, arrayType) {
        var len = fieldValue.length;
        buff.writeShort(len);
        for (var index = 0; index < len; index++) {
            Msg.encode(buff, arrayType, fieldValue[index]);
        }
    };
    return Msg;
}());
__reflect(Msg.prototype, "Msg");
/**
 * Created by yangsong on 16/1/24.
 */
var game_matching_c2s = (function () {
    function game_matching_c2s() {
        this.msgId = 3013;
        this.gameId = 0;
        this.userId = '';
        this.userName = '';
        this.userPic = '';
        this.userSex = 0;
    }
    game_matching_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'ushort', this.gameId);
        Msg.encode(buff, 'string', this.userId);
        Msg.encode(buff, 'string', this.userName);
        Msg.encode(buff, 'string', this.userPic);
        Msg.encode(buff, 'byte', this.userSex);
        return buff;
    };
    game_matching_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.gameId = Msg.decode(buff, 'ushort');
        this.userId = Msg.decode(buff, 'string');
        this.userName = Msg.decode(buff, 'string');
        this.userPic = Msg.decode(buff, 'string');
        this.userSex = Msg.decode(buff, 'byte');
    };
    return game_matching_c2s;
}());
__reflect(game_matching_c2s.prototype, "game_matching_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var game_matching_notice_s2c = (function () {
    function game_matching_notice_s2c() {
        this.msgId = 3016;
        this.gameId = 0;
        this.otherUserId = '';
        this.otherUserName = '';
        this.otherUserPic = '';
        this.otherUserSex = 0;
        this.isAi = 0;
        this.aiLevel = 0;
        this.roomId = '';
    }
    game_matching_notice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'ushort', this.gameId);
        Msg.encode(buff, 'string', this.otherUserId);
        Msg.encode(buff, 'string', this.otherUserName);
        Msg.encode(buff, 'string', this.otherUserPic);
        Msg.encode(buff, 'byte', this.otherUserSex);
        Msg.encode(buff, 'byte', this.isAi);
        Msg.encode(buff, 'ushort', this.aiLevel);
        Msg.encode(buff, 'string', this.roomId);
        return buff;
    };
    game_matching_notice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.gameId = Msg.decode(buff, 'ushort');
        this.otherUserId = Msg.decode(buff, 'string');
        this.otherUserName = Msg.decode(buff, 'string');
        this.otherUserPic = Msg.decode(buff, 'string');
        this.otherUserSex = Msg.decode(buff, 'byte');
        this.isAi = Msg.decode(buff, 'byte');
        this.aiLevel = Msg.decode(buff, 'ushort');
        this.roomId = Msg.decode(buff, 'string');
    };
    return game_matching_notice_s2c;
}());
__reflect(game_matching_notice_s2c.prototype, "game_matching_notice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_matching_s2c = (function () {
    function game_matching_s2c() {
        this.msgId = 3014;
    }
    game_matching_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        return buff;
    };
    game_matching_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
    };
    return game_matching_s2c;
}());
__reflect(game_matching_s2c.prototype, "game_matching_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_otherUserJoin_notice_s2c = (function () {
    function game_otherUserJoin_notice_s2c() {
        this.msgId = 3104;
        this.otherUser = new userInfo();
    }
    game_otherUserJoin_notice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'userInfo', this.otherUser);
        return buff;
    };
    game_otherUserJoin_notice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.otherUser = Msg.decode(buff, userInfo);
    };
    return game_otherUserJoin_notice_s2c;
}());
__reflect(game_otherUserJoin_notice_s2c.prototype, "game_otherUserJoin_notice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_result_c2s = (function () {
    function game_result_c2s() {
        this.msgId = 3007;
        this.roomId = '';
        this.result = 0;
    }
    game_result_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.roomId);
        Msg.encode(buff, 'byte', this.result);
        return buff;
    };
    game_result_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.roomId = Msg.decode(buff, 'string');
        this.result = Msg.decode(buff, 'byte');
    };
    return game_result_c2s;
}());
__reflect(game_result_c2s.prototype, "game_result_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var game_result_notice_s2c = (function () {
    function game_result_notice_s2c() {
        this.msgId = 3008;
        this.winUserId = '';
        this.userExitFlag = 0;
    }
    game_result_notice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'string', this.winUserId);
        Msg.encode(buff, 'byte', this.userExitFlag);
        return buff;
    };
    game_result_notice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.winUserId = Msg.decode(buff, 'string');
        this.userExitFlag = Msg.decode(buff, 'byte');
    };
    return game_result_notice_s2c;
}());
__reflect(game_result_notice_s2c.prototype, "game_result_notice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_start_notice_s2c = (function () {
    function game_start_notice_s2c() {
        this.msgId = 3004;
    }
    game_start_notice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        return buff;
    };
    game_start_notice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
    };
    return game_start_notice_s2c;
}());
__reflect(game_start_notice_s2c.prototype, "game_start_notice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var game_trunNumNotice_s2c = (function () {
    function game_trunNumNotice_s2c() {
        this.msgId = 3012;
        this.trunNum = 0;
    }
    game_trunNumNotice_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'uint32', this.trunNum);
        return buff;
    };
    game_trunNumNotice_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.trunNum = Msg.decode(buff, 'uint32');
    };
    return game_trunNumNotice_s2c;
}());
__reflect(game_trunNumNotice_s2c.prototype, "game_trunNumNotice_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var platform_login_c2s = (function () {
    function platform_login_c2s() {
        this.msgId = 2001;
        this.gameId = 0;
        this.platformId = 0;
        this.platformData = '';
    }
    platform_login_c2s.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        Msg.encode(buff, 'ushort', this.gameId);
        Msg.encode(buff, 'ushort', this.platformId);
        Msg.encode(buff, 'string', this.platformData);
        return buff;
    };
    platform_login_c2s.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
        this.gameId = Msg.decode(buff, 'ushort');
        this.platformId = Msg.decode(buff, 'ushort');
        this.platformData = Msg.decode(buff, 'string');
    };
    return platform_login_c2s;
}());
__reflect(platform_login_c2s.prototype, "platform_login_c2s");
/**
 * Created by yangsong on 16/1/24.
 */
var platform_login_s2c = (function () {
    function platform_login_s2c() {
        this.msgId = 2002;
    }
    platform_login_s2c.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'ushort', this.msgId);
        return buff;
    };
    platform_login_s2c.prototype.decode = function (buff) {
        this.msgId = Msg.decode(buff, 'ushort');
    };
    return platform_login_s2c;
}());
__reflect(platform_login_s2c.prototype, "platform_login_s2c");
/**
 * Created by yangsong on 16/1/24.
 */
var userInfo = (function () {
    function userInfo() {
        this.uuid = '';
        this.userId = '';
        this.userName = '';
        this.userPic = '';
        this.userSex = 0;
        this.userProgress = 0;
    }
    userInfo.prototype.encode = function () {
        var buff = new egret.ByteArray();
        Msg.encode(buff, 'string', this.uuid);
        Msg.encode(buff, 'string', this.userId);
        Msg.encode(buff, 'string', this.userName);
        Msg.encode(buff, 'string', this.userPic);
        Msg.encode(buff, 'byte', this.userSex);
        Msg.encode(buff, 'ushort', this.userProgress);
        return buff;
    };
    userInfo.prototype.decode = function (buff) {
        this.uuid = Msg.decode(buff, 'string');
        this.userId = Msg.decode(buff, 'string');
        this.userName = Msg.decode(buff, 'string');
        this.userPic = Msg.decode(buff, 'string');
        this.userSex = Msg.decode(buff, 'byte');
        this.userProgress = Msg.decode(buff, 'ushort');
    };
    return userInfo;
}());
__reflect(userInfo.prototype, "userInfo");
var ProxyHttp = (function () {
    function ProxyHttp() {
    }
    /**
     * 初始化
     */
    ProxyHttp.init = function (serverUrl, platformId) {
        this.platformId = platformId;
        App.Http.initServer(serverUrl);
    };
    //请求数据
    ProxyHttp.request = function (type, param, callBack) {
        var variables = this.getURLVariables(type, param);
        App.Http.send(type, variables, callBack);
    };
    /**
     * 转换数据格式
     * @param	t_type
     * @param	...args
     * @return
     */
    ProxyHttp.getURLVariables = function (type, param) {
        var typeArr = type.split(".");
        var paramObj = {};
        paramObj["mod"] = typeArr[0];
        paramObj["do"] = typeArr[1];
        if (param != null) {
            paramObj["p"] = param;
        }
        var paramStr = JSON.stringify(paramObj);
        var variables = new egret.URLVariables("data=" + paramStr + "&h=" + App.UserToken);
        return variables;
    };
    //获取平台名称
    ProxyHttp.getPlatformName = function () {
        switch (this.platformId) {
            case 0:
                return "egret";
            case 1:
                return "baiwan";
            case 2:
                return "facebook";
            case 3:
                return "wanba";
            case 4:
                return "xiaoMiGame";
            case 6:
                return "liaoZhan";
            case 7:
                return "gameSLL";
            case 8:
                return "channel";
            case 9:
                return "meitu";
            case 11:
                return "liaoZhanAbroad";
            case 12:
                return "liaoZhanTest";
        }
        return "";
    };
    /**
     * 获取服务器ip & post
     */
    ProxyHttp.getGameServer = function (roomId, callBack) {
        var paramObj = {
            roomId: roomId,
            platform: this.getPlatformName()
        };
        this.request(this.Gate_getGameServer, paramObj, callBack);
    };
    /**
     * 获取答题数据
     */
    ProxyHttp.getQuestions = function (roomId, callBack) {
        var paramObj = {
            roomId: roomId,
            platform: this.getPlatformName()
        };
        this.request(this.Gate_getQuestions, paramObj, callBack);
    };
    /**
     * 获取数据
     */
    ProxyHttp.getData = function (gameId, callBack) {
        var paramObj = {
            gameId: gameId,
            platform: this.getPlatformName()
        };
        this.request(this.Gate_getData, paramObj, callBack);
    };
    /**
     * 微信图片转为Base64
     */
    ProxyHttp.wxImgToBase64 = function (imgUrl, callBack) {
    };
    //------------------------------------以下为业务逻辑代码--------------------------------------//
    ProxyHttp.Gate_getGameServer = "Gate.getGameServer";
    ProxyHttp.Gate_getQuestions = "Gate.getQuestions";
    ProxyHttp.Gate_getData = "Gate.getData";
    return ProxyHttp;
}());
__reflect(ProxyHttp.prototype, "ProxyHttp");
/**
 * Created by egret on 15-7-15.
 */
var ProxySocket = (function () {
    function ProxySocket() {
    }
    /**
     * 初始化
     */
    ProxySocket.init = function (host, port, useSSL) {
        console.log("Socket.init: ", host, port, useSSL);
        App.Socket.initServer(host, port, useSSL, new ByteArrayMsgByProto(), false);
        function testClose() {
            // App.TimerManager.doTimer(10000, 1, () => {
            //     if(DataCenter.instance.user.name == "yangsong"){
            //         App.Socket.close();
            //     }
            // }, this)
        }
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, function () {
            console.log("SOCKET_CONNECT");
            testClose();
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_RECONNECT, function () {
            console.log("SOCKET_RECONNECT");
            testClose();
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_START_RECONNECT, function () {
            console.log("SOCKET_START_RECONNECT");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, function () {
            console.log("SOCKET_CLOSE");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_DATA, function () {
            console.log("SOCKET_DATA");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, function () {
            console.log("SOCKET_NOCONNECT");
        }, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_DEBUG_INFO, function () {
            console.log("SOCKET_DEBUG_INFO");
        }, this);
        App.Socket.connect();
    };
    //停止
    ProxySocket.stop = function () {
        App.Socket["removeEvents"]();
        App.Socket.close();
        Socket["_instance"] = null;
        App.MessageCenter.removeAll(this);
        App.TimerManager.removeAll(this);
    };
    // 开启ping
    ProxySocket.startPing = function () {
        App.TimerManager.doTimer(3000, 0, this.ping, this);
    };
    // 停止ping
    ProxySocket.stopPing = function () {
        App.TimerManager.remove(this.ping, this);
    };
    //------------------------------------以下为业务逻辑代码--------------------------------------//
    //开始匹配
    ProxySocket.startMatching = function (gameId, userId, userName, userPic, userSex) {
        var sendMsg = new game_matching_c2s();
        sendMsg.gameId = gameId;
        sendMsg.userId = userId;
        sendMsg.userName = userName;
        sendMsg.userPic = userPic;
        sendMsg.userSex = userSex;
        App.Socket.send(sendMsg);
    };
    //取消匹配
    ProxySocket.stopMatching = function (userId) {
        var sendMsg = new game_cancelMatching_c2s();
        sendMsg.userId = userId;
        App.Socket.send(sendMsg);
    };
    //进入游戏
    ProxySocket.joinGame = function (roomId) {
        var sendMsg = new game_join_c2s();
        sendMsg.roomId = roomId;
        App.Socket.send(sendMsg);
    };
    //发送loading数据
    ProxySocket.sendLoadProgress = function (roomId, progressNum) {
        var sendMsg = new game_loadProgress_c2s();
        sendMsg.roomId = roomId;
        sendMsg.progress = progressNum;
        App.Socket.send(sendMsg);
    };
    //发送游戏内消息(sendType 1: 发送两人，2：发送另外一人)
    ProxySocket.sendGameEvent = function (roomId, event, sendType) {
        if (sendType === void 0) { sendType = 2; }
        var sendMsg = new game_event_c2s();
        sendMsg.roomId = roomId;
        sendMsg.sendType = sendType;
        sendMsg.event = event;
        App.Socket.send(sendMsg);
    };
    //发送游戏结果(赢的人发)
    ProxySocket.sendGameResult = function (roomId, result) {
        var sendMsg = new game_result_c2s();
        sendMsg.roomId = roomId;
        sendMsg.result = result;
        App.Socket.send(sendMsg);
    };
    //退出游戏
    ProxySocket.exitGame = function (roomId) {
        var sendMsg = new game_exit_c2s();
        sendMsg.roomId = roomId;
        App.Socket.send(sendMsg);
    };
    //ping
    ProxySocket.ping = function () {
        var sendMsg = new client_ping_c2s();
        App.Socket.send(sendMsg);
    };
    //平台登录
    ProxySocket.platformLogin = function (gameId, platformId, platformData) {
        var sendMsg = new platform_login_c2s();
        sendMsg.gameId = gameId;
        sendMsg.platformId = platformId;
        sendMsg.platformData = JSON.stringify(platformData);
        App.Socket.send(sendMsg);
    };
    return ProxySocket;
}());
__reflect(ProxySocket.prototype, "ProxySocket");
