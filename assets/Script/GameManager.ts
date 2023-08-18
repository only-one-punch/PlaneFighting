import { _decorator, AudioSource, Component, instantiate, Material, MeshRenderer, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { middleEnemyStats } from './middleEnemyStats';
import { enemyManager } from './enemyManager';
import { bigEnemyStats } from './bigEnemyStats';
import { smallEnemyStats } from './smallEnemyStats';
import { bigEnemyDie } from './bigEnemyDie';
@ccclass('GameManager')
export class GameManager extends Component {
    // 获取飞机组件
    @property(Node)
    public myPlane : Node | null = null;
    //获取子弹组件
    @property({type:Prefab})
    public myBullet : Prefab | null = null;
    //获取敌机组件
    @property({type:Prefab})
    public smallEnemy : Prefab | null = null;
    @property({type:Prefab})
    public middleEnemy : Prefab | null = null;
    @property({type:Prefab})
    public bigEnemy : Prefab | null = null ; 


    //创建子弹所需要的一系列的参数
    //发射时间
    public shootTime : number = 0.3;
    //发射计时器
    public curTime : number = 0;
    //存储子弹节点的数组
    public bulletNodes : Node[] = []
    //屏幕x最大值
    public screen : number = 40;


    //创建敌机所需要的一系列参数
    //小型机出生时间
    public createEnemyTime : number = 1;
    //中型机出生时间
    public middleTime : number = 3;
    public bigTime : number = 5;
    //计时器
    public enemyCurTime: number = 0 ;
    public enemyCurTime2: number = 0 ;
    public enemyCurTime3: number = 0 ;
    //存储敌机节点的数组
    public enemyNodes : Node[] = [];
    public bigEnemyNodes : Node[] = [];
    public middleEnemyNodes: Node[] = [];
    public smallEnemyNodes : Node[] = [];

    //敌机死亡后的模型
    @property ({type:Prefab})
    public bigEnemyDie : Prefab | null = null;
    public moveX: number = 0.1;
    public mass : number = 0.2;

    //敌机触碰后的变色
    //敌机普通材质
    @property({type:Material})
    public standardMaterial: Material | null = null;
    //敌机受伤材质
    @property ({type:Material})
    public collisionMaterial: Material | null = null;
    start() {
        
    }

    update(deltaTime: number) {
        
        this.curTime += deltaTime;
        if(this.curTime > this.shootTime){          
                this.createBullet();
                this.curTime = 0;            
        }
        //超过屏幕自动销毁节点
        for (const node of this.bulletNodes) {
            if(node.position.x > this.screen){
                this.decoveryBullet(node)
            }
        }
        // 创造飞机
        this.enemyCurTime += deltaTime;
        this.enemyCurTime2 += deltaTime;
        this.enemyCurTime3 += deltaTime;
        if(this.enemyCurTime > this.createEnemyTime){
            this.createEnemyPlane(this.smallEnemy);
            this.enemyCurTime = 0;
        }
        if(this.enemyCurTime2 > this.middleTime){
            this.createEnemyPlane(this.middleEnemy);
            this.enemyCurTime2 = 0;
        }
        if(this.enemyCurTime3 > this.bigTime){
            this.createEnemyPlane(this.bigEnemy);
            this.enemyCurTime3 = 0;
            // this.audioButton()
        }
        
        //处理碰撞
        this.ProcessCollision();


    }

    public createBullet(){
        const bulletNode = instantiate(this.myBullet);
        //加入到子弹数组中
        this.bulletNodes.push(bulletNode);
        this.node.addChild(bulletNode);
        const myPlanePosition = this.myPlane.position;
        // console.log(bulletNode)
        //0.3 和 1 是偏移量
        bulletNode.setPosition(myPlanePosition.x + 0.3, myPlanePosition.y +0.8,  myPlanePosition.z);
    }

    private decoveryBullet(bullet: Node){
        bullet.destroy();
        this.bulletNodes.splice(this.bulletNodes.indexOf(bullet),1)
    }

    public createEnemyPlane(enemy:Prefab){
        const enemyNode = instantiate(enemy);
        const middleEnemy = enemyNode.getComponent(middleEnemyStats)
        const bigEnemy = enemyNode.getComponent(bigEnemyStats);
        const smallEnemy = enemyNode.getComponent(smallEnemyStats);
        if(middleEnemy){
            const middleSpeed = enemyNode.getComponent(enemyManager)
            middleSpeed.moveLength = middleEnemy.speed;
            this.middleEnemyNodes.push(enemyNode);
        }
        if(bigEnemy){
            const bigSpeed = enemyNode.getComponent(enemyManager)
            bigSpeed.moveLength = bigEnemy.speed;
            this.bigEnemyNodes.push(enemyNode)
        }
        if(smallEnemy){
            const smallSpeed = enemyNode.getComponent(enemyManager);
            smallSpeed.moveLength = smallEnemy.speed;
            this.smallEnemyNodes.push(enemyNode)
        }
        this.enemyNodes.push()
        // if(enemyComponentStats.enemyName === "bigEnemy"){
        //     this.bigEnemyNodes.push(enemyNode)
        //     console.log(enemyComponentStats)
        // }
        this.node.addChild(enemyNode);
        const inceptionPosition = new Vec3();
        inceptionPosition.x = 40;
        inceptionPosition.y = 1;
        inceptionPosition.z = Math.floor(Math.random()*20 - 10);
        enemyNode.setPosition(inceptionPosition)
    }

    public ProcessCollision(){
        for(const bullet of this.bulletNodes){
            const bulletPosition = bullet.getPosition();
            for(const enemy of this.smallEnemyNodes){
                const enemyPosition = enemy.getPosition();
                const distanceOfX = bulletPosition.x - enemyPosition.x;
                const distanceOfZ = bulletPosition.z - enemyPosition.z;
                const distance = distanceOfX * distanceOfX + distanceOfZ * distanceOfZ;
                if(distance < 0.16){
                    const enemyHP = enemy.getComponent(smallEnemyStats);
                    enemyHP.health -=1;
                    const collisionAudio = enemy.getComponent(AudioSource);
                    collisionAudio.play();
                    if(enemyHP.health <= 0){
                        enemy.destroy()
                    this.smallEnemyNodes.splice(this.smallEnemyNodes.indexOf(enemy),1);                  
                    }
                    bullet.destroy();
                    this.bulletNodes.splice(this.bulletNodes.indexOf(bullet),1);
                }
            }
            for(const enemy of this.middleEnemyNodes){
                const enemyPosition = enemy.getPosition();
                const distanceOfX = bulletPosition.x - enemyPosition.x;
                const distanceOfZ = bulletPosition.z - enemyPosition.z;
                const distance = distanceOfX * distanceOfX + distanceOfZ * distanceOfZ;
                if(distance < 0.65*0.65){
                    const enemyHp = enemy.getComponent(middleEnemyStats);
                    enemyHp.health -= 1;
                    if(enemyHp.health > 0){
                        //发生碰撞后改变颜色
                    const enemyMeshRender = enemy.getComponent(MeshRenderer);
                    enemyMeshRender.setMaterial(this.collisionMaterial,0)
                    this.scheduleOnce(()=>{
                        enemyMeshRender.setMaterial(this.standardMaterial,0)
                    },0.1)
                        //播放碰撞音效
                    const collisionAudio = enemy.getComponent(AudioSource);
                    collisionAudio.play();
                    }
                    //死亡事件
                    if(enemyHp.health <= 0){
                        //如果死亡，直接变色
                        const enemyMeshRender = enemy.getComponent(MeshRenderer);
                        enemyMeshRender.setMaterial(this.collisionMaterial,0)
                       setInterval(()=>{
                        if(enemy){
                            this.goDie(enemy)
                        }
                       },60)
                       if(enemy.position.y < 0){
                        enemy.destroy();
                       }
                         
                    this.middleEnemyNodes.splice(this.middleEnemyNodes.indexOf(enemy),1);
                    }
                    bullet.destroy();
                    this.bulletNodes.splice(this.bulletNodes.indexOf(bullet),1)
                }
                
            }
            for(const enemy of this.bigEnemyNodes){
                const enemyPosition = enemy.getPosition();
                const distanceOfX = bulletPosition.x - enemyPosition.x;
                const distanceOfZ = bulletPosition.z - enemyPosition.z;
                const distance = distanceOfX * distanceOfX + distanceOfZ * distanceOfZ;
                if(distance < 0.9*0.9){
                    const enemyHP = enemy.getComponent(bigEnemyStats);
                    enemyHP.health  -= 1;
                    if(enemyHP.health > 0){
                        //发生碰撞后改变颜色
                    const enemyMeshRender = enemy.getComponent(MeshRenderer);
                    enemyMeshRender.setMaterial(this.collisionMaterial,0)
                    this.scheduleOnce(()=>{
                        enemyMeshRender.setMaterial(this.standardMaterial,0)
                    },0.05) 
                        //播放碰撞音效
                    const collisionAudio = enemy.getComponent(AudioSource);
                    collisionAudio.play();
                    }
                    
                    if(enemyHP.health <= 0){
                        const enemyPosition = enemy.position;
                        const bigEnemyDie = instantiate(this.bigEnemyDie);
                        bigEnemyDie.setPosition(enemyPosition);
                        this.node.addChild(bigEnemyDie)
                       
                        // console.log(bigEnemyDie.position)
                        enemy.destroy();
                        this.bigEnemyNodes.splice(this.bigEnemyNodes.indexOf(enemy),1);
                    }                    
                    bullet.destroy();
                    this.bulletNodes.splice(this.bulletNodes.indexOf(bullet),1)
                }
                
            }
        }
    }

    public  goDie(dieEnemy:Node){
        const pos = dieEnemy.position;
        const movePos = pos.x -this.moveX;
        const moveDown = pos.y -this.mass;
        dieEnemy.setPosition(movePos,moveDown,pos.z);
    }
}


