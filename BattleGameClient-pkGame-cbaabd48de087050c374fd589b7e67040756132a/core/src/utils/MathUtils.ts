enum reserveDecimal {
    floor,
    ceil,
    round
}
class MathUtils {
    /**
     * 保留小数
     * @param targetNum 要进行转化的小数
     * @param digits 保留小数位数
     * @example let a =MathUtil.reserveDecimal("0.1111111111",2);
     * @returns {string} 返回的是一个小数,0.1
     */
    static reserveDecimal(targetNum: number, digits: number, type = reserveDecimal.floor) {
        let multiple = Math.pow(10, digits);
        let tempNum = targetNum * multiple;
        switch (type) {
            case reserveDecimal.floor:
                return Math.floor(tempNum) / multiple;
            case reserveDecimal.ceil:
                return Math.ceil(tempNum) / multiple;
            case reserveDecimal.round:
                return Math.round(tempNum) / multiple;
        }
    }
}