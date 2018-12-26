/**
 * Created by yangsong on 16/1/24.
 */
var fs = require("fs");

var protoFile = "./net/src/proto/gameProto.json";
var protoFileJs = "./net/src/proto/gameProto.ts";
var msgFilePath = "./net/src/proto/msg/";

var msgTemplate = fs.readFileSync("./scripts/proto/template/msgTemplate.txt","utf-8");
var msgDicTemplate = fs.readFileSync("./scripts/proto/template/msgProtoTemplate.txt","utf-8");

var msgProtoId = "";
var msgProtoDic = "";

buildFile();
generateMsgDicFile();

function replaceAll(str, s1, s2) {
    var demo = str.replace(s1, s2);
    while (demo.indexOf(s1) != - 1)
        demo = demo.replace(s1, s2);
    return demo;
}

function generateMsgDicFile(){
    msgProtoDic = msgProtoDic.substr(0, msgProtoDic.length-2);
    var fileContent = msgDicTemplate;
    fileContent = fileContent.replace("$1", msgProtoDic);
    fileContent = fileContent.replace("$2", msgProtoId);
    saveMsgDicFile(fileContent);
}

function buildFile(){
    var msgObj = JSON.parse(readProtoFile());
    for (var key in msgObj){
        generateMsgFile(key, msgObj[key]);
    }
}

function readProtoFile(){
    var str = fs.readFileSync(protoFile).toString();
    str = str.replace(/\/\/.*[\n\r]/g, "");
    return str;
}

function generateMsgFile(fileName, msgObj){
    var fileContent = replaceAll(msgTemplate, "$0", fileName);
    var properties = "";
    var funEncode = "";
    var funDecode = "";
    for(var key  in msgObj){
        var value = msgObj[key];
        properties += "\t" + getPropertyStr(fileName, key, value) + "\n";
        funEncode += "\t" + getEncodeStr(key, value) + "\n\t";
        funDecode += "\t" + getDecodeStr(key, value) + "\n\t";
    }
    fileContent = fileContent.replace("$1", properties);
    fileContent = fileContent.replace("$2", funEncode);
    fileContent = fileContent.replace("$3", funDecode);
    saveFile(fileName, fileContent);
}

function isBaseType(type){
    return type =="byte"
        || type =="short"
        || type =="ushort"
        || type =="int32"
        || type =="uint32"
        || type =="int64"
        || type =="uint64"
        || type =="float"
        || type =="double"
        || type =="string"
}

function getDecodeStr(key, value){
    if(key =="msgId"){
        return "this."+key+" = Msg.decode(buff, 'ushort');";
    } else if (isBaseType(value)){
        return "this."+key+" = Msg.decode(buff, '"+value+"');";
    } else if(value.indexOf("array") != -1){
        var arr = value.split("/");
        if(isBaseType(arr[1])){
            //������
            return "this."+key+" = Msg.decode(buff, '"+arr[0]+"', '"+arr[1]+"');";
        } else {
            //�Զ�������
            return "this."+key+" = Msg.decode(buff, '"+arr[0]+"', "+arr[1]+");";
        }
    } else {
        return "this."+key+" = Msg.decode(buff, "+value+");";
    }
}


function getPropertyStr(fileName, key, value){
    if(key == "msgId"){
        msgProtoDic += "\t\""+ value +"\":" + fileName +",\n\t";
        msgProtoId += "public static ID_"+fileName+":string = \""+value+"\";\n\t"
        return "public "+key+":number = " + value + ";";
    } else if (value =="byte"
        || value =="short"
        || value =="ushort"
        || value =="int32"
        || value =="uint32"
        || value =="float"
        || value =="double"){
        return "public "+key+":number = 0;";
    } else if (value =="int64"
        || value =="uint64"){
        return "public "+key+":Long = new Long();";
    } else if(value =="string"){
        return "public "+key+":string = '';";
    } else if(value.indexOf("array") != -1){
        var arr = value.split("/");
		var str = arr[1];
		if(str =="byte"
        || str =="short"
        || str =="ushort"
        || str =="int32"
        || str =="uint32"
        || str =="float"
        || str =="double"){
			str = "number";
        } else if(str =="int64" || str =="uint64"){
            str = "Long"
        }
        return "public "+key+":Array<" + str + "> = [];";
    } else {
        return "public "+key+":"+value+" = new "+value+"();";
    }
}

function getEncodeStr(key, value){
    if(key =="msgId"){
        return "Msg.encode(buff, 'ushort', this."+key+");";
    } else if (isBaseType(value)){
        return "Msg.encode(buff, '"+value+"', this."+key+");";
    } else if(value.indexOf("array") != -1){
        var arr = value.split("/");
        if(isBaseType(arr[1])){
            return "Msg.encode(buff, '"+arr[0]+"', this."+key+", '"+arr[1]+"');";
        } else {
            return "Msg.encode(buff, '"+arr[0]+"', this."+key+", "+arr[1]+");";
        }
    } else {
        return "Msg.encode(buff, '"+value+"', this."+key+");";
    }
}

function saveFile(fileName, content){
    fs.writeFileSync(msgFilePath + fileName + ".ts", content);
}

function saveMsgDicFile(content){
    fs.writeFileSync(protoFileJs, content);
}