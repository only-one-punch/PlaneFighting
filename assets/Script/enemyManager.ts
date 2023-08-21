import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('enemyManager')
export class enemyManager extends Component {
    public moveLength: number = 0.05;
    public smallMoveLength:number = 10;
    public middleMoveLength: number = 10;
    public bigMoveLength: number = 10;

    //敌机死亡时的参数
    public mass : number = 0.3;
    //纵向移动
    public moveDown : number = 0.1
    //死亡参数
    public isDie : Boolean = null; 
    start() {

    }

    update(deltaTime: number) {
        if(this.node.name == "smallEnemy"){
            const pos = this.node.position;
            const movePos =pos.x - this.smallMoveLength * deltaTime;
            this.node.setPosition(movePos,pos.y,pos.z)
        }
        if(this.node.name == "middleEnemy"){
            const pos = this.node.position;
            const movePos = pos.x - this.middleMoveLength * deltaTime;
            this.node.setPosition(movePos,pos.y,pos.z)
        }
        if(this.node.name == "bigEnemy"){
            const pos = this.node.position;
            const movePos = pos.x -this.bigMoveLength *deltaTime;
            this.node.setPosition(movePos,pos.y,pos.z);
        }
       
    }

    
}


