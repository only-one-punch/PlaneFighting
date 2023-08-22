import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DieMyPlane')
export class DieMyPlane extends Component {
    //模拟重力 下沉
    public mass = 2;
    //横移
    public moveDown = 10;

    start() {
         let dieAudio = this.node.getComponent(AudioSource);
        console.log(dieAudio)
        dieAudio.play();
    }

    update(deltaTime: number) {
        const position  = this.node.position;
        this.node.setPosition(position.x + this.moveDown * deltaTime, position.y - this.mass * deltaTime ,position.z);
    }
}


