interface IPlatform {
    platformData: any;

    login(callBack: Function);
    dealBgMusic();
    gameOver(value: number);
    invite(callBack: Function);
    loaded();
}