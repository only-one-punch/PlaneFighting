import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlaneFormation')
export class PlaneFormation extends Component {
    public sidesWay :number = 0.07;
    public moveDown :number = 0.13;
    start() {

    }

    update(deltaTime: number) {
        const childrenPlane = this.node.children;
        childrenPlane.forEach((element)=>{
            const planePos =  element.getPosition();
            const x_pos = planePos.x -this.moveDown;
            const z_pos = planePos.z + this.sidesWay;
            element.setPosition(x_pos,planePos.y,z_pos)
        });
    }
}


