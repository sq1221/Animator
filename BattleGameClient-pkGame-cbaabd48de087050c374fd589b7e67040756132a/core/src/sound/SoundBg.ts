/**
 * Created by yangsong on 15-1-14.
 * 背景音乐类
 */
class SoundBg extends BaseSound {
    private _currBg: string;
    private _currPlayTime: number;
    private _currSound: egret.Sound;
    private _currSoundChannel: egret.SoundChannel;
    private _volume: number;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this._currBg = "";
    }

    /**
     * 静音
     */
    public mute(): void {
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = 0;
        }
    }

    /**
     * 恢复音量
     */
    public restoreVolume(): void {
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    }

    /**
     * 停止当前音乐
     */
    public stop(): void {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
    }

    /**
     * 播放某个音乐
     * @param effectName
     */
    public play(effectName: string, playTime: number = 0): void {
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
        this._currPlayTime = playTime;
        var sound: egret.Sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    }

    /**
     * 播放
     * @param sound
     */
    private playSound(sound: egret.Sound): void {
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(this._currPlayTime, 0);
        this._currSoundChannel.volume = this._volume;
    }

    /**
     * 获取当前播放时间
     */
    public getPlayTime(): number {
        if (this._currSoundChannel) {
            return this._currSoundChannel.position;
        }
        return 0;
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume: number): void {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    }

    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key: string): void {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    }

    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    public checkCanClear(key: string): boolean {
        return this._currBg != key;
    }
}