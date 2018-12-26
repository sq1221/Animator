/**
 * 示例自定义插件
 */

import * as fs from 'fs';
import * as path from 'path';

export class CustomPlugin implements plugins.Command {

    constructor() {
    }

    async onFile(file: plugins.File) {
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        const projectRoot = commandContext.buildConfig.projectRoot;

        //同步games
        let gameDirs = fs.readdirSync(path.join(projectRoot, "games"));
        gameDirs.forEach(game => {
            if (game == ".DS_Store") {
                return
            }
            var gameJsName = game + '.min.js';
            var gameJsPath = path.join(projectRoot, 'games', game, "bin/", gameJsName);
            let content = fs.readFileSync(gameJsPath);
            commandContext.createFile('js/games_' + gameJsName, content);
        });
    }
}

export class CustomPlugin2 implements plugins.Command {

    constructor() {
    }

    async onFile(file: plugins.File) {
        if (file.origin == "manifest.json") {
            let json = JSON.parse(file.contents.toString());
            for (let i = 0; i < json.game.length; i++) {
                var jsname = json.game[i];
                if (jsname.indexOf('js/games_') != -1) {
                    json.game.splice(i, 1);
                    i--;
                }
            }
            file.contents = new Buffer(JSON.stringify(json, null, '\t'))
        }
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {

    }
}