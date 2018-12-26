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
    createFolder(destFilePath);
    let readStream = fs.createReadStream(sourceFilePath);
    let writeStream = fs.createWriteStream(destFilePath);
    readStream.pipe(writeStream);
}

function dealWildcard(resPath) {
    let resPaths = [];
    if (resPath.indexOf('*') != -1) {
        let rootPath = resPath.substring(0, resPath.indexOf('/') + 1);
        let resKey = resPath.substring(resPath.indexOf('/') + 1, resPath.indexOf('*'));
        let files = fs.readdirSync(rootPath);
        files.forEach((fileName, index) => {
            let path = rootPath + fileName;
            if (path.indexOf(resKey) == resPath.indexOf(resKey)) {
                resPaths.push(path);
            }
        });
    } else {
        resPaths.push(resPath);
    }
    // console.log('---------------------------')
    // console.log(resPaths);
    return resPaths;
}

function syncResDir(resPath) {
    let resPaths = dealWildcard(resPath);
    resPaths.forEach(res => {
        let files = fs.readdirSync(res);
        files.forEach((fileName, index) => {
            let path = res + '/' + fileName;
            let stat = fs.statSync(path)
            if (stat && stat.isDirectory()) {
                syncResDir(path);
            } else {
                syncResFile(path);
            }
        });
    });
}

function syncResFile(resPath) {
    if (resPath.indexOf('.DS_Store') != -1) {
        return;
    }
    let resPaths = dealWildcard(resPath);
    resPaths.forEach(fileName => {
        let sourceFilePath = path.join(process.cwd(), fileName);
        let destFilePath = sourceFilePath.replace(path.join(process.cwd(), Res_PATH), path.join(process.cwd(), DEST_PATH));
        copyFile(sourceFilePath, destFilePath);
    });
}

//资源目录copy
function syncRes() {
    createFolder(path.join(process.cwd(), DEST_PATH))
    if (Res_PATH.indexOf('.') != -1) {
        syncResFile(Res_PATH);
    } else {
        syncResDir(Res_PATH);
    }
}

let Res_PATH;
let DEST_PATH;

var arguments = process.argv.splice(2);
if (arguments.length >= 2) {
    if (fs.existsSync(arguments[0])) {
        Res_PATH = arguments[0];
        DEST_PATH = arguments[1];
        syncRes()
    } else {
        console.error(`${arguments[0]} is't exist File`)
        return;
    }
} else {
    console.log("参数不足")
}