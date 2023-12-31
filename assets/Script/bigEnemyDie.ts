import { _decorator, AudioClip, AudioSource, Component, MeshRenderer, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bigEnemyDie')
export class bigEnemyDie extends Component {
    //模拟重力 下沉
    public mass = 0.05;
    //横移
    public moveDown = 0.15;
    //音效播放时间
    public musicTime = 0

    //
    @property
    public planeDie:any | null = null;
   
    start() {
        let dieAudio = this.node.getComponent(AudioSource);
        console.log(dieAudio)
        dieAudio.play();
    }

    update(deltaTime: number) { 
        this.musicTime += deltaTime;
        const enemyPosition = this.node.getPosition();       
        this.node.setPosition(enemyPosition.x - this.moveDown,enemyPosition.y - this.mass,enemyPosition.z);
        if(this.node.position.y < 0 && this.musicTime>1){
            this.node.destroy();
            this.musicTime = 0;
        }
    }

    
   
}


