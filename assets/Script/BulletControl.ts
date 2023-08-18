import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletControl')
export class BulletControl extends Component {
    public moveLength: number = 0.2;

    start() {
        const audio = this.node.getComponent(AudioSource)
        audio.play();
    }

    update(deltaTime: number) {
        const pos  = this.node.position;
        const movePos = pos.x + this.moveLength;
        this.node.setPosition(movePos,pos.y,pos.z);
    }
}


