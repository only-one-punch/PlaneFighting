import { _decorator, Animation, AudioSource, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BossControl')
export class BossControl extends Component {
    @property({type:Prefab})
    public bossBullet :Prefab | null = null
    public firstBulletPosition: Vec3 ;
    public bossHP = 40;
    public bossSpeed = 5;
    public bossSkill : boolean = true;
    public bossSkillTime: number = 0;
    public bossPos :Vec3;
    public bossBulletNode : Node[] = [];
    public screen : number = -30;
    @property({ type: AudioSource })
    public audioSource: AudioSource | null = null;
    @property({ type: AudioSource })
    public audioSource2: AudioSource | null = null;
    @property({ type: Animation })
    public dieAinmation: Animation | null = null;
    @property({type:GameManager})
    public gameManager : GameManager | null = null;
    start() {
        console.log(this.audioSource)
        
    }

    update(deltaTime: number) {
        
            this.bossMove(deltaTime);
            if(this.node.position.x > 30){
                  this.bossMoveX(deltaTime);
            }
          

            
            if(this.bossHP == 0){
                this.bossSkill = false;
                this.dieAinmation.play()
                this.audioSource2.play()
                console.log(this.audioSource==this.audioSource2)
                console.log(this.audioSource)
                console.log(this.audioSource2)
                
            }
            // console.log(this.bossSkill)
            
            for (const node of this.bossBulletNode) {
                if(node.position.x < this.screen){
                    node.destroy();
                    this.bossBulletNode.splice(this.bossBulletNode.indexOf(node),1);
                }
            }
      
    }
    bossMove(time){
        const pos = this.node.getPosition();
        pos.z += this.bossSpeed * time
        if(pos.z > 7){
            this.bossSpeed = -this.bossSpeed
        }
        if(pos.z < -7){
            this.bossSpeed = -this.bossSpeed 
        }
        this.node.setPosition(pos);
        this.bossPos = this.node.position;
    }
    bossMoveX(time){
        const pos = this.node.getPosition();
        if(pos.x > 30){
             pos.x -= 3 * time;
        }else{
            console.log("发射子弹")
       
        }
        this.node.setPosition(pos)
    }
    //创建子弹并给初始位置
    // bossBulletCreate(){
    //     console.log(this.node.parent)
    //     this.firstBulletPosition = this.node.children[5].getWorldPosition();
    //     for(let i = 0; i < 9 ; i+=2){
    //         const bossBulletNode = instantiate(this.bossBullet); 
    //         this.node.addChild(bossBulletNode);
    //         const bossBulletNodePos = this.firstBulletPosition.z + i;
    //         bossBulletNode.setWorldPosition(this.firstBulletPosition.x,this.firstBulletPosition.y,bossBulletNodePos);
    //         this.bossBulletNode.push(bossBulletNode);
    //     }
    // }
}

/*
    第一个问题，怎样解决子弹不会随着飞机的位置移动而移动。
    是不是因为我的子弹节点是属于飞机的，飞机移动子节点也会跟着移动。
    那是不是可以通过设置世界坐标？
    
    答：解决了，出现问题的原因是，子节点会随着父节点的移动而移动，
    我想到的办法是，把子弹节点创建在游戏场景节点下而不是boss节点下，
    这一即使是boss节点移动，被创造出来的子弹节点也不会移动。
*/
