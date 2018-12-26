/**
 * 示例自定义插件，您可以查阅 http://developer.egret.com/cn/2d/projectConfig/cmdExtensionPluginin/ 
 * 了解如何开发一个自定义插件
 */

import * as fs from 'fs';
import * as archiver from '../node_modules/archiver';

export class ZipCreator implements plugins.Command {

    private files: { url: string, buff: Buffer }[] = [];
    private readonly targetGame: RegExp;
    // 其他游戏过滤
    private readonly jsFilter: RegExp = /js\/games_.+\.min\.js$/i;
    private readonly assetsFilter: RegExp = /resource\/assets\/games\/game_.+/i;
    // pk游戏中的无用资源过滤
    private readonly otherFilters: RegExp[] = [
        /resource\/assets\/gameCenter/i,
        /resource\/assets\/rank/i,
        /resource\/assets\/sound_barrage/i,
        /resource\/assets\/sound\/.+\//i,
        /resource\/assets\/icon\/.+\.png/i,
        /resource\/assets\/roleHeads\/.+\.png/i
    ];

    constructor(targetGame: string) {
        this.targetGame = new RegExp(targetGame.toLocaleLowerCase());
    }

    async onFile(file: plugins.File) {
        const url = file.relative.split('\\').join('/');
        if (this.otherFilters.some(reg => reg.test(url))) {
            return null;
        }
        if (this.jsFilter.test(url) || this.assetsFilter.test(url)) {
            if (!this.targetGame.test(url.toLocaleLowerCase())) {
                return null;
            }
        }
        if (file.basename == 'default.thm.json') {
            const json = JSON.parse(file.contents.toString());
            json.exmls = json.exmls.filter(url => {
                return (!/games\/game_/.test(url)) || this.targetGame.test(url.toLocaleLowerCase());
            });
            file.contents = new Buffer(JSON.stringify(json, null, '\t'));
        }
        this.files.push({
            url,
            buff: file.contents
        });
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        const path = `${commandContext.outputDir}/index.zip`;
        const output = fs.createWriteStream(path);
        const zip = archiver('zip');
        zip.pipe(output);
        await new Promise(resolve => {
            this.files.forEach(file => {
                zip.append(file.buff, { name: file.url });
            });
            zip.finalize();
            output.on('close', function () {
                resolve();
            });
        })
    }
}