import { _decorator, Animation, AudioSource, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BossControl')
export class BossControl extends Component {
    @property({type:Prefab})
    public bossBullet :Prefab | null = null
    public firstBulletPosition: Vec3 ;
    public bulletCreateTime: number = 0.7
    public curCreateTime : number = 0
    public bossHP = 40;
    public bossSpeed = 3;
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
    start() {
        console.log(this.audioSource)
        
    }

    update(deltaTime: number) {
        
            this.bossMove(deltaTime);
            if(this.node.position.x > 30){
                  this.bossMoveX(deltaTime);
            }
          
            // this.bossSkillTime += deltaTime;
                // if(this.bossSkillTime > 5){
            if(this.bossSkill){
                 this.curCreateTime += deltaTime;
                //     console.log(this.curCreateTime)
                if(this.curCreateTime > this.bulletCreateTime){
                this.bossBulletCreate();
                this.curCreateTime = 0 ;
                console.log("time")
                // }
            this.bossSkillTime = 0
            }
                   
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
    bossBulletCreate(){
        this.firstBulletPosition = this.node.children[5].getPosition();
        for(let i = 0; i < 9 ; i+=2){
            const bossBulletNode = instantiate(this.bossBullet); 
            this.node.addChild(bossBulletNode);
            const bossBulletNodePos = this.firstBulletPosition.z + i;
            bossBulletNode.setPosition(this.firstBulletPosition.x,this.firstBulletPosition.y,bossBulletNodePos);
            this.bossBulletNode.push(bossBulletNode);
        }
    }
}


