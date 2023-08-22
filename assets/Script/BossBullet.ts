import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BossBullet')
export class BossBullet extends Component {
    public movelength: number = 10;
    public pos : Vec3;
    start() {
        // this.pos = this.node.getPosition();
        // console.log(this.pos);
    }

    update(deltaTime: number) {
        const pos = this.node.getPosition();
        pos.x -= this.movelength * deltaTime ;
        this.node.setPosition(pos)
    }
}


