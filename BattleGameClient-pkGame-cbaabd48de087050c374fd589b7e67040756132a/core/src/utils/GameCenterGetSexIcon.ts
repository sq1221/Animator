/**
 * 性别 设置
 */
class GameCenterGetSexIcon {

    private static boyIcon: string = "img_boy_png";// 男
    private static girlIcon: string = "img_gril_png";// 女

    public static getSexIconSource(sexType: number): string {
        var str: string = this.girlIcon;
        switch (sexType) {
            case 0:
            case 1:
                str = this.boyIcon;
                break;
            case 2:
                str = this.girlIcon;
                break;
        }
        return str;
    }
}