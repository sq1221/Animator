class GameGoBallisticItemClass {
    public static instance: GameGoBallisticItemClass;

    public roleBoss: DBArmature;
    public roleBlue: Gob_role;
    public roleRed: Gob_role;

    public state: number = 0; // 0 BOSS藏可，1 BOSS慢动可，2 BOSS快动可，4 BOSS停不可
    public blueScore: number = 0;
    public redScore: number = 0;
    public readyState = [0, 0];
    public bothState = [0, 0];
    public isOffline: boolean = false;
    public multiple = 1;
    public localTimer: number;
    public stopSoundEffect: SoundEffects = new SoundEffects();

    public isRuning: boolean = false;


    public constructor() {
        GameGoBallisticItemClass.instance = this;
        this.stopSoundEffect.setVolume(0.7);
    }
}