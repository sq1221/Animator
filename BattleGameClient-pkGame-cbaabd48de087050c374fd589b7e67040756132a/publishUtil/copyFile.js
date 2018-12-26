const fs = require('fs');
const path = require('path');
const process = require('process');
function createFolder(to) { //文件写入
    let sep = path.sep
    let folders = path.dirname(to).split(sep);
    let p = '';
    while (folders.length) {
        p += folders.shift() + sep;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};

function copyFile(sourceFilePath, destFilePath) {
    if (fs.existsSync(sourceFilePath)) {
        createFolder(destFilePath);
        let readStream = fs.createReadStream(sourceFilePath);
        let writeStream = fs.createWriteStream(destFilePath);
        readStream.pipe(writeStream);
    } else {
        console.error(`${sourceFilePath} is't exist File`)
        return;
    }
}

var arguments = process.argv.splice(2);
if (arguments.length >= 2)
    copyFile(arguments[0], arguments[1])
else {
    console.log("参数不足")
}