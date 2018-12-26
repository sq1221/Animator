namespace GameLongJump {
    export class Character extends DBArmature {
        constructor(armature: dragonBones.Armature) {
            super(armature);
        }
        // (方向)  0:左侧 1：右侧
        public directionLOrR: number = 0;

        // 左侧 坐标
        public directionPosL1_X: number = 0;
        public directionPosL1_Y: number = 0;
        public directionPosL2_X: number = 0;
        public directionPosL2_Y: number = 0;
        public directionPosL3_X: number = 0;
        public directionPosL3_Y: number = 0;
        // 右侧
        public directionPosR1_X: number = 0;
        public directionPosR1_Y: number = 0;
        public directionPosR2_X: number = 0;
        public directionPosR2_Y: number = 0;
        public directionPosR3_X: number = 0;
        public directionPosR3_Y: number = 0;

        public get factorOne(): number {
            return 0;
        }
        public set factorOne(value: number) {
            if (this.directionLOrR == 1) {
                this.x = (1 - value) * (1 - value) * this.directionPosL1_X + 2 * value * (1 - value) * this.directionPosL2_X + value * value * this.directionPosL3_X;
                this.y = (1 - value) * (1 - value) * this.directionPosL1_Y + 2 * value * (1 - value) * this.directionPosL2_Y + value * value * this.directionPosL3_Y;
                return;
            }
            this.x = (1 - value) * (1 - value) * this.directionPosR1_X + 2 * value * (1 - value) * this.directionPosR2_X + value * value * this.directionPosR3_X;
            this.y = (1 - value) * (1 - value) * this.directionPosR1_Y + 2 * value * (1 - value) * this.directionPosR2_Y + value * value * this.directionPosR3_Y;
        }
    }
}