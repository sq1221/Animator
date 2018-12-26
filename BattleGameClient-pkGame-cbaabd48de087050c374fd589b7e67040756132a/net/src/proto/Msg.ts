/**
 * Created by yangsong on 2016/7/27.
 */
class Msg {
    public static encode(buff: egret.ByteArray, fieldType: string, fieldValue: any, arrayType: any = null) {
        if (fieldType == 'byte') {
            buff.writeByte(fieldValue);
        } else if (fieldType == 'short') {
            buff.writeShort(fieldValue);
        } else if (fieldType == 'ushort') {
            buff.writeUnsignedShort(fieldValue);
        } else if (fieldType == 'int32') {
            buff.writeInt(fieldValue);
        } else if (fieldType == 'uint32') {
            buff.writeUnsignedInt(fieldValue);
        } else if (fieldType == 'int64') {
            buff.writeInt(fieldValue.high);
            buff.writeUnsignedInt(fieldValue.low);
        } else if (fieldType == 'uint64') {
            buff.writeUnsignedInt(fieldValue.high);
            buff.writeUnsignedInt(fieldValue.low);
        }  else if (fieldType == 'string') {
            buff.writeByte(1);
            buff.writeUTF(fieldValue);
        } else if (fieldType == 'float') {
            buff.writeFloat(fieldValue);
        } else if (fieldType == 'double') {
            buff.writeDouble(fieldValue);
        } else if (fieldType == 'array') {
            Msg.encodeArray(buff, fieldValue, arrayType);
        } else {
            var byteArray: egret.ByteArray = fieldValue.encode();
            buff.writeByte(1);
            buff.writeUnsignedShort(byteArray.length);
            buff.writeBytes(byteArray);
        }
    }

    public static decode(buff: egret.ByteArray, fieldType: any, arrayType: any = null) {
        var result = null;
        if (fieldType == 'byte') {
            result = buff.readByte();
        } else if (fieldType == 'short') {
            result = buff.readShort();
        } else if (fieldType == 'ushort') {
            result = buff.readUnsignedShort();
        } else if (fieldType == 'int32') {
            result = buff.readInt();
        } else if (fieldType == 'uint32') {
            result = buff.readUnsignedInt();
        } else if (fieldType == 'int64') {
            var high = buff.readInt()
            var low = buff.readUnsignedInt()
            result = new Long(low, high, false);
        } else if (fieldType == 'uint64') {
            var high = buff.readUnsignedInt()
            var low = buff.readUnsignedInt()
            result = new Long(low, high, true);
        } else if (fieldType == 'string') {
            buff.readByte();
            result = buff.readUTF();
        } else if (fieldType == 'float') {
            result = buff.readFloat();
        } else if (fieldType == 'double') {
            result = buff.readDouble();
        } else if (fieldType == 'array') {
            result = Msg.decodeArray(buff, arrayType);
        } else {
            buff.readByte();
            buff.readUnsignedShort();
            var cls: any = fieldType;
            var model = new cls();
            model.decode(buff);
            result = model;
        }

        return result;
    }

    public static decodeArray(buff: egret.ByteArray, fieldtype) {
        var len = buff.readShort();
        var arr = [];
        for (var index = 0; index < len; index++) {
            var temp = Msg.decode(buff, fieldtype);
            arr.push(temp);
        }
        return arr;
    }

    public static encodeArray(buff, fieldValue, arrayType) {
        var len = fieldValue.length;
        buff.writeShort(len);
        for (var index = 0; index < len; index++) {
            Msg.encode(buff, arrayType, fieldValue[index]);
        }
    }
}

