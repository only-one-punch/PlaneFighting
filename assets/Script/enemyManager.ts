import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('enemyManager')
export class enemyManager extends Component {
    public moveLength: number = 0.05;
    
    //敌机死亡时的参数
    public mass : number = 0.3;
    //纵向移动
    public moveDown : number = 0.1
    //死亡参数
    public isDie : Boolean = null; 
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const movePos =pos.x - this.moveLength;
        this.node.setPosition(movePos,pos.y,pos.z)
    }

    
}


