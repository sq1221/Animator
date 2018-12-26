declare namespace GameLongJump {
    class CharacterController {
        userCharacter: Character;
        target: Platform;
        _power: number;
        /**缩放动画需要的 */
        static powerSize: number;
        constructor();
        private initbo;
        private initShuihua;
        private initPower;
        posY: number;
        setPos(): void;
        protected _currentPlatform: Platform;
        getSlopeOrDir(): {
            slope: number;
            dir: number;
        };
        particleShuiHua: particle.GravityParticleSystem;
        protected onParticleEffect(_X: number, _Y: number): void;
        /** 保证所有目标点在一个斜率上 */
        protected getDis(isHalf?: boolean): {
            x: number;
            y: number;
        };
        circleLightFallDB1: DBArmature;
        circleLightFallDB2: DBArmature;
        protected jumpSuccessLightAnim: (combo: number) => void;
        circleLightPowerPartical1: particle.GravityParticleSystem;
        circleLightPowerPartical2: particle.GravityParticleSystem;
        hideLightPower: () => void;
        private isRemovePower;
        protected setPowerAnim: () => void;
        particalY: number;
        dispose(): void;
    }
}
declare class GameLongJumpView extends State {
    static instance: GameLongJumpView;
    private returnToLastButton;
    constructor();
    gameLayer: egret.DisplayObjectContainer;
    sceneItemLayer: egret.DisplayObjectContainer;
    moveLayer: egret.DisplayObjectContainer;
    userController: GameLongJump.UserController;
    platformController: GameLongJump.PlatformController;
    comController: GameLongJump.CompetitorController;
    randomConfig: number[];
    random: Function;
    canJump: boolean;
    stateController: GameLongJump.StateController;
    readyGo: GameLongJump.LongJumpReady;
    result: GameLongJump.GameLongJumpResult;
    init(): void;
    user1Ready: boolean;
    user2Ready: boolean;
    start: () => void;
    private onGameEvent(data);
    addListener(): void;
    private isPressBegin;
    private pressBegin();
    sound: boolean;
    private touch();
    private pressEnd();
    onGameResult: (data: any) => void;
    pauseCallback: () => void;
    dispose(): void;
}
declare namespace GameLongJump {
    class AiController {
        private _aiLevel;
        private comJump;
        static successRound: number;
        static comboRound: number;
        static dropLimit: number;
        /**警戒值 */
        static hardTo3: number;
        static hardTo4: number;
        static AIComboFlag: number;
        static easyToHard: number;
        private isHard;
        combo: number;
        private dropNum;
        constructor(comJump: Function);
        private aiLevel;
        private nextCombo(offset, edge);
        private nextSuccess(offset, edge);
        private nextFail(offset, edge);
        private noCombo(offset, edge);
        AItouch: () => void;
        dispose(): void;
    }
}
declare namespace GameLongJump {
    class CompetitorController extends CharacterController {
        ai: AiController;
        constructor();
        private commandList;
        private isPlay;
        init(): void;
        power: number;
        /**接受网络传来的事件 */
        private webSocre;
        private onGameEvent(data);
        offsetS2C: number;
        currentPlatform: Platform;
        excuteCommand: () => void;
        jump: () => void;
        dispose(): void;
    }
}
declare namespace GameLongJump {
    class GameLongJumpResult {
        private winImage;
        private loseImage;
        private mask;
        winContainner: egret.DisplayObjectContainer;
        loseContainner: egret.DisplayObjectContainer;
        private selfScoreBG;
        private comScoreBg;
        private selfHeadBg;
        private selfHead;
        private comHeadBg;
        private comHead;
        private comScoreView;
        private selfScoreView;
        private selfContainner;
        private comContainner;
        private winTag;
        init(): void;
        initData(): void;
        win(): void;
        lose(istime?: boolean): void;
        dispose(): void;
    }
}
declare namespace GameLongJump {
    class Character extends DBArmature {
        constructor(armature: dragonBones.Armature);
        directionLOrR: number;
        directionPosL1_X: number;
        directionPosL1_Y: number;
        directionPosL2_X: number;
        directionPosL2_Y: number;
        directionPosL3_X: number;
        directionPosL3_Y: number;
        directionPosR1_X: number;
        directionPosR1_Y: number;
        directionPosR2_X: number;
        directionPosR2_Y: number;
        directionPosR3_X: number;
        directionPosR3_Y: number;
        factorOne: number;
    }
}
declare namespace GameLongJump {
    class LongJumpReady extends GameReady {
        bgmask: egret.Bitmap;
        title: egret.Bitmap;
        constructor(callback: () => any);
        hide(): void;
        play(): void;
        dispose(): void;
    }
}
declare namespace GameLongJump {
    enum PlatformType {
        a = 0,
        g = 1,
        h = 2,
        i = 3,
        j = 4,
        m = 5,
        o = 6,
        q = 7,
        t = 8,
        z = 9,
        max_e = 10,
        max_q = 11,
        max_r = 12,
        max_t = 13,
        max_u = 14,
        max_w = 15,
        max_y = 16,
        k = 17,
        e = 18,
        l = 19,
        w = 20,
    }
    class Platform extends egret.DisplayObjectContainer {
        constructor();
        protected _UID: number;
        readonly UID: number;
        platformType: PlatformType;
        platformImg: egret.Bitmap;
        protected platformShadow: egret.Bitmap;
        offsetFromLast: number;
        offsetToEdge: number;
        collisionX: number;
        collisionY: number;
        init(type: PlatformType, UID: number, isPlayCartoon?: boolean): void;
        /**传进来的应该是collison所在位置 */
        setXY(x: number, y: number): void;
        protected playCartoon(): void;
    }
}
declare namespace GameLongJump {
    type normalPlatformType = {
        target: number;
        isHard: boolean;
        pos: {
            x: number;
            y: number;
        };
    };
    type LastPlatformType = {
        pos: {
            x: number;
            y: number;
        };
    };
    type selectPlatformType = {
        hardTarget: number;
        easyTarget: number;
        pos: {
            x: number;
            y: number;
        };
    };
    type configType = normalPlatformType | selectPlatformType | LastPlatformType;
    class PlatformController {
        static slope: number;
        static itemSlope: number;
        static MaxOffset: number;
        platformList: {};
        constructor();
        init(): void;
        creatNext(current: Platform): any;
        worldOffsetX: number;
        worldOffsetY: number;
        moveWorld(platform: Platform, current: Platform): void;
        getPlatformPos(current: Platform): {
            x: number;
            y: number;
            offset: number;
        };
        private getPlatformType();
        getPlatformOffset(current: Platform, next: Platform): number;
        creatSceneItems(next: Platform): void;
        private creatSceneItem();
        private getSceneItemType();
        dispose(): void;
    }
}
declare namespace GameLongJump {
    class StateController extends egret.DisplayObjectContainer {
        constructor();
        private selfScoreBG;
        private comScoreBg;
        private selfScoreView;
        private comScoreView;
        private _selfScore;
        private _comScore;
        private timeView;
        private isOver;
        init(): void;
        /**接受网络传来的事件 */
        private onGameEvent(data);
        selfScore: number;
        private isWin;
        comScore: number;
        private _time;
        readonly time: number;
        timeStart(): void;
        private timeOver;
        dispose(): void;
    }
}
declare namespace GameLongJump {
    class userConfig {
        static jumpDis: number;
        static jumpSpeed: number;
        static power: number;
        static powerAdd: number;
        static jumpHeight: number;
        static powerLimit: number;
        static score: number;
    }
    class UserController extends CharacterController {
        private floatScore;
        private normalPlatformEffect;
        constructor();
        init(): void;
        currentPlatform: Platform;
        power: number;
        private isPlayAnim;
        private shakeTips(score);
        private landSccess;
        private landFailure;
        combo: number;
        jump(): void;
        dispose(): void;
    }
}
