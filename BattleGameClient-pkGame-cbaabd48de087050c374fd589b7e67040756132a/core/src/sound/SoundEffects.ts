/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
class SoundEffects extends BaseSound {
    private _volume: number;
    private _playingEffects: any;
    private _cacheSoundChannel: Array<egret.SoundChannel> = [];

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this._playingEffects = {};
    }

    /**
     * 播放一个音效
     * @param effectName
     */
    private _playTime: number;
    public play(effectName: string, isReplace = false, playTime = 1): void {
        this._playTime = playTime;
        if (!isReplace) {
            if (this._playingEffects[effectName]) {
                return;
            }
        }

        var sound: egret.Sound = this.getSound(effectName);
        if (sound) {
            this.playSound(effectName, sound);
        }
    }

    private getSoundChannel(sound: egret.Sound): egret.SoundChannel {
        var channel: egret.SoundChannel = null;
        if (this._cacheSoundChannel.length) {
            channel = this._cacheSoundChannel.pop();
            channel["isStopped"] = false;
            channel["$url"] = sound["url"];
            channel["$loops"] = this._playTime;
            channel["$audioBuffer"] = sound["audioBuffer"];
            channel["$startTime"] = 0;
            channel["$play"]();
        } else {
            channel = sound.play(0, this._playTime);
        }
        return channel;
    }

    /**
     * 播放
     * @param sound
     */
    private playSound(effectName: string, sound: egret.Sound): void {
        var channel: egret.SoundChannel = this.getSoundChannel(sound);
        channel.once(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        channel.volume = this._volume;
        channel["soundName"] = effectName;
        this._playingEffects[effectName] = channel;
    }

    /**
     * 播放完成
     */
    private onSoundComplete(event: egret.Event): void {
        var channel: egret.SoundChannel = <egret.SoundChannel>event.currentTarget;
        var effectName: string = channel["soundName"];
        delete this._playingEffects[effectName];
        // 对象池有Bug
        // this._cacheSoundChannel.push(channel);
    }

    /**
     * 停止某个音效
     */
    public stopSound(effectName: string): void {
        var channel: egret.SoundChannel = this._playingEffects[effectName];
        if (channel) {
            channel.stop();
            delete this._playingEffects[effectName];
        }
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume: number): void {
        this._volume = volume;
    }


    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key: string): void {
        this.playSound(key, RES.getRes(key));
    }
}