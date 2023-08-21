import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BossBullet')
export class BossBullet extends Component {
    public movelength: number = 10;
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.getPosition();
        pos.x -=this.movelength *deltaTime ;
        this.node.setPosition(pos)
    }
}


