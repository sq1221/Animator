namespace AnimalChess {
    /**玩家的数据结构，需要包括颜色 */
    export enum ChessType {
        RED,
        BLUE
    }
    /**棋盘格子类型 */
    export type ChessJson = {
        position: { x: number, y: number },
        type: ChessType,
        isVisible: boolean,
        animalGrade: AnimalGrade
    }
    /**棋子分布 */
    export type chessNumer = { RED: number, BLUE: number, isAllDisplay: boolean }
    export enum RoundType {
        self,
        competitor
    }
    export enum AnimalGrade {
        elephant = 7,
        lion = 6,
        tiger = 5,
        leopard = 4,
        wolf = 3,
        dog = 2,
        cat = 1,
        mouse = 0
    }
    export type wasteMoveType = {
        start: { x: number, y: number },
        end: { x: number, y: number }
    }
}