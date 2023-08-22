import { _decorator, Animation, AudioSource, Color, Component, director, instantiate, Material, MeshRenderer, Node, Prefab, Scene, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { middleEnemyStats } from './middleEnemyStats';
import { enemyManager } from './enemyManager';
import { bigEnemyStats } from './bigEnemyStats';
import { smallEnemyStats } from './smallEnemyStats';
import { bigEnemyDie } from './bigEnemyDie';
import { BossControl } from './BossControl';
import { BossBullet } from './BossBullet';
import { PlayerController } from './PlayerControl';
@ccclass('GameManager')
export class GameManager extends Component {
    // 获取飞机组件
    @property(Node)
    public myPlane: Node | null = null;
    //获取子弹组件
    @property({ type: Prefab })
    public myBullet: Prefab | null = null;
    //获取敌机组件
    @property({ type: Prefab })
    public smallEnemy: Prefab | null = null;
    @property({ type: Prefab })
    public middleEnemy: Prefab | null = null;
    @property({ type: Prefab })
    public bigEnemy: Prefab | null = null;


    //创建子弹所需要的一系列的参数
    //发射时间
    public shootTime: number = 0.3;
    //发射计时器
    public curTime: number = 0;
    //存储子弹节点的数组
    public bulletNodes: Node[] = []
    //屏幕x最大值
    public screen: number = 40;



    //创建敌机所需要的一系列参数
    //小型机出生时间
    public createEnemyTime: number = 1;
    //中型机出生时间
    public middleTime: number = 3;
    public bigTime: number = 5;
    //计时器
    public enemyCurTime: number = 0;
    public enemyCurTime2: number = 0;
    public enemyCurTime3: number = 0;
    //存储敌机节点的数组
    public enemyNodes: Node[] = [];
    public bigEnemyNodes: Node[] = [];
    public middleEnemyNodes: Node[] = [];
    public smallEnemyNodes: Node[] = [];

    //敌机死亡后的模型
    @property({ type: Prefab })
    public bigEnemyDie: Prefab | null = null;
    public moveX: number = 0.1;
    public mass: number = 0.2;

    //敌机触碰后的变色
    //敌机普通材质
    @property({ type: Material })
    public standardMaterial: Material | null = null;
    //敌机受伤材质
    @property({ type: Material })
    public collisionMaterial: Material | null = null;

    //创造中型机飞行阵型
    @property({ type: Prefab })
    public middlePlaneFormation01: Prefab | null = null;
    //阵型出现的时间
    public formation01Time: number = 5;
    public curFormation01Time: number = 0;
    public formation02Time: number = 7;
    public curFormation02Time: number = 0;
    //加入阵型的数组
    public formation01Nodes: Node[] = [];
    public formation02Nodes: Node[] = [];

    //清理屏幕需要的参数
    public curClearnTime = 0;
    public clearnTime = 10;

    //创造Boss
    @property({ type: Prefab })
    public bossNode: Prefab | null = null;
    public curBossTime: number = 0;
    public bossTime: number = 5;
    public bossHasCreate: boolean = false;
    public bossSpeed = 0.03;
    public boss: any;
    @property({ type: Prefab })
    public bossBullet: Prefab | null = null;
    public bossBulletNode: Node[] = [];
    public bossSkill: boolean = false;
    public curCreateBulletTime: number = 0;
    public bulletCreateTime: number = 0.8;

    //控制UI的
    @property({ type: Node })
    public startMenu: Node | null = null;
    //控制动画
    @property({ type: Animation })
    public bossDie: Animation | null = null;

    @property({ type: Prefab })
    public diePlayerPrefab: Prefab | null = null;

    public isDie: boolean = false;
    public isConclusionSmall: boolean = false;
    public isConclusionMiddle: boolean = false;
    start() {
        console.log(this.myPlane)
    }

    update(deltaTime: number) {

        this.curTime += deltaTime;

        if (this.curTime > this.shootTime) {
            this.createBullet();
            this.curTime = 0;
        }
        //超过屏幕自动销毁节点
        //下面可以弄个函数
        
        for (const node of this.bulletNodes) {
            if (node.position.x > this.screen) {
                this.decoveryBullet(node)
            }
        }
        for (const node of this.smallEnemyNodes) {
            if (node.position.x < -10) {
                // node.destroy()
                node.removeFromParent();
                this._smallEnemyPool.push(node);
                this.smallEnemyNodes.splice(this.smallEnemyNodes.indexOf(node), 1)
            }
        }
        for (const node of this.middleEnemyNodes) {
            if (node.position.x < -10) {
                // node.destroy()
                node.removeFromParent();
                this._middleEnmeyPool.push(node);
                this.middleEnemyNodes.splice(this.middleEnemyNodes.indexOf(node), 1)
            }
        }
        for (const node of this.bigEnemyNodes) {
            if (node.position.x < -10) {
                node.destroy()
                this.bigEnemyNodes.splice(this.bigEnemyNodes.indexOf(node), 1)
            }
        }
        for (const node of this.bossBulletNode) {
            if (node.position.x < -10) {
                node.removeFromParent();
                this._bossBulletPool.push(node);
                this.bigEnemyNodes.splice(this.bigEnemyNodes.indexOf(node), 1)
            }
        }
        // 创造飞机

        if (this.bossHasCreate == false) {
            this.enemyCurTime += deltaTime;
            this.enemyCurTime2 += deltaTime;
            this.enemyCurTime3 += deltaTime;
            this.curFormation01Time += deltaTime;
            this.curFormation02Time += deltaTime;
        } else {
            this.enemyCurTime = 0
            this.enemyCurTime2 = 0
            this.enemyCurTime3 = 0
            this.curFormation01Time = 0;
            this.curFormation02Time = 0;
        }
        if (this.enemyCurTime > this.createEnemyTime) {
            this.createEnemyPlane(this.smallEnemy,this._smallEnemyPool);
            this.enemyCurTime = 0;

        }
        if (this.enemyCurTime2 > this.middleTime) {
            this.createEnemyPlane(this.middleEnemy,this._middleEnmeyPool);
            this.enemyCurTime2 = 0;
        }
        if (this.enemyCurTime3 > this.bigTime) {
            this.createEnemyPlane(this.bigEnemy,this._bigEnemyPool);
            this.enemyCurTime3 = 0;
            // this.audioButton()
        }

        //创造飞机阵型01

        if (this.curFormation01Time > this.formation01Time) {
            this.createMiddlePlaneFormation01()
            console.log("has create 01")
            this.curFormation01Time = 0;
        }
        this.formation01Nodes.forEach((ele) => {
            if (ele.children !== null) {
                const pos = ele.getPosition();
                pos.x -= 5 * deltaTime;
                pos.z += 3 * deltaTime;
                ele.setPosition(pos.x, pos.y, pos.z);
            }

        })
        //飞机阵型 02

        if (this.curFormation02Time > this.formation02Time) {
            this.createMiddlePlaneFormation02()
            console.log("has create 02")
            this.curFormation02Time = 0;
        }
        this.formation02Nodes.forEach((ele) => {
            if (ele.children !== null) {
                const pos = ele.getPosition();
                pos.x -= 5 * deltaTime;
                pos.z -= 6 * deltaTime;
                ele.setPosition(pos.x, pos.y, pos.z);
            }

        })

        //创造Boss
        this.curBossTime += deltaTime;
        if (this.curBossTime > this.bossTime) {
            this.createBoss();
            this.curBossTime = -9999;
            this.bossHasCreate = true;
            console.log(this.bossNode.data.children);
            this.bossSkill = true;
        }

        //处理碰撞
        this.ProcessCollision();
        if (this.bossHasCreate) {

            this.bossCollision()
        }

        if (this.bossSkill) {
            this.curCreateBulletTime += deltaTime;
            //     console.log(this.curCreateTime)
            if (this.curCreateBulletTime > this.bulletCreateTime) {
                this.bossBulletCreate();
                this.curCreateBulletTime = 0;
                // console.log("time")
            }
        }
        this.palyerCollision();
    }
    private _bulletPool: Node[] = [];
    public createBullet() {
        let bulletNode: Node;
        if (this._bulletPool.length > 0) {
            bulletNode = this._bulletPool.pop()
        } 
        else {
            bulletNode = instantiate(this.myBullet);
        }

        //加入到子弹数组中
        this.bulletNodes.push(bulletNode);
        this.node.addChild(bulletNode);
        const myPlanePosition = this.myPlane.position;
        // console.log(bulletNode)
        //0.3 和 1 是偏移量
        bulletNode.setPosition(myPlanePosition.x + 0.3, myPlanePosition.y + 0.8, myPlanePosition.z);
    }

    private decoveryBullet(bullet: Node) {
        // bullet.destroy();
        bullet.removeFromParent();
        this._bulletPool.push(bullet);
        this.bulletNodes.splice(this.bulletNodes.indexOf(bullet), 1)
    }

    private _smallEnemyPool: Node[] = [];
    private _middleEnmeyPool: Node[] = [];
    private _bigEnemyPool: Node[] = [];
    public createEnemyPlane(enemy: Prefab,enemyPool:Node[]) {
        let enemyNode:Node;
        if(enemyPool.length > 0){
            //直接使用，不用重新创建
            enemyNode = enemyPool.pop()
        }
        else{
            //重新实例化
        enemyNode = instantiate(enemy);
        }
        
        const middleEnemy = enemyNode.getComponent(middleEnemyStats)
        const bigEnemy = enemyNode.getComponent(bigEnemyStats);
        const smallEnemy = enemyNode.getComponent(smallEnemyStats);
        if (middleEnemy) {
            const middleSpeed = enemyNode.getComponent(enemyManager)
            middleSpeed.middleMoveLength = middleEnemy.speed;
            this.middleEnemyNodes.push(enemyNode);
        }
        if (bigEnemy) {
            const bigSpeed = enemyNode.getComponent(enemyManager)
            bigSpeed.bigMoveLength = bigEnemy.speed;
            this.bigEnemyNodes.push(enemyNode)
        }
        if (smallEnemy) {
            const smallSpeed = enemyNode.getComponent(enemyManager);
            smallSpeed.smallMoveLength = smallEnemy.speed;
            this.smallEnemyNodes.push(enemyNode)
        }
        this.enemyNodes.push()
        this.node.addChild(enemyNode);
        const inceptionPosition = new Vec3();
        inceptionPosition.x = 40;
        inceptionPosition.y = 1;
        inceptionPosition.z = Math.floor(Math.random() * 20 - 10);
        enemyNode.setPosition(inceptionPosition)
    }
    public createMiddlePlaneFormation01() {
        // const formation01 = instantiate(this.middlePlaneFormation01);
        // // console.log(formation01.children)

        // formation01.children.forEach((ele)=>{
        //     this.middleEnemyNodes.push(ele);
        // })
        // // console.log(this.middleEnemyNodes)
        // this.node.addChild(formation01);
        // formation01.setPosition(40,0,-13);

        // this.scheduleOnce(()=>{
        //     formation01.destroy();
        //     formation01.children.forEach((ele)=>{
        //         this.middleEnemyNodes.splice(this.middleEnemyNodes.indexOf(ele),1)
        //     })
        // },3000);
        const startPos = new Vec3(40, 1, 0);
        for (let row = 0; row < 5; row++) {
            const enemyNode = instantiate(this.middleEnemy);
            this.node.addChild(enemyNode);
            const position = new Vec3(startPos.x + 2 * row, startPos.y, startPos.z - 2 * row);
            enemyNode.setPosition(position);
            this.middleEnemyNodes.push(enemyNode);
            this.formation01Nodes.push(enemyNode);
        }
    }
    public createMiddlePlaneFormation02() {
        const startPos = new Vec3(40, 1, 12);
        for (let row = 0; row < 5; row++) {
            const enemyNode = instantiate(this.middleEnemy);
            this.node.addChild(enemyNode);
            const position = new Vec3(startPos.x + 2 * row, startPos.y, startPos.z + 2 * row);
            enemyNode.setPosition(position);
            this.middleEnemyNodes.push(enemyNode);
            this.formation02Nodes.push(enemyNode);
        }
    }
    public ProcessCollision() {
        for (const bullet of this.bulletNodes) {
            const bulletPosition = bullet.getPosition();
            for (const enemy of this.smallEnemyNodes) {
                const enemyPosition = enemy.getPosition();
                const distanceOfX = bulletPosition.x - enemyPosition.x;
                const distanceOfZ = bulletPosition.z - enemyPosition.z;
                const distance = distanceOfX * distanceOfX + distanceOfZ * distanceOfZ;
                if (distance < 0.16) {
                    const enemyHP = enemy.getComponent(smallEnemyStats);
                    enemyHP.health -= 1;
                    const collisionAudio = enemy.getComponent(AudioSource);
                    collisionAudio.play();
                    if (enemyHP.health <= 0) {
                        enemy.destroy()
                        this.smallEnemyNodes.splice(this.smallEnemyNodes.indexOf(enemy), 1);
                    }
                    bullet.destroy();
                    this.bulletNodes.splice(this.bulletNodes.indexOf(bullet), 1);
                }
            }
            for (const enemy of this.middleEnemyNodes) {
                const enemyPosition = enemy.getPosition();
                const distanceOfX = bulletPosition.x - enemyPosition.x;
                const distanceOfZ = bulletPosition.z - enemyPosition.z;
                const distance = distanceOfX * distanceOfX + distanceOfZ * distanceOfZ;
                if (enemy.name == "middleEnemy-002") {
                    console.log(enemy.name, enemy.position)
                }

                if (distance < 0.65 * 0.65) {
                    const enemyHp = enemy.getComponent(middleEnemyStats);
                    enemyHp.health -= 1;
                    if (enemyHp.health > 0) {
                        //发生碰撞后改变颜色
                        const enemyMeshRender = enemy.getComponent(MeshRenderer);
                        enemyMeshRender.setMaterial(this.collisionMaterial, 0)
                        //播放碰撞音效
                        const collisionAudio = enemy.getComponent(AudioSource);
                        collisionAudio.play();
                    }
                    //死亡事件
                    if (enemyHp.health == 0) {
                        //如果死亡，直接变色
                        const enemyMeshRender = enemy.getComponent(MeshRenderer);
                        enemyMeshRender.setMaterial(this.collisionMaterial, 0)
                        enemy.destroy();
                        // this.formation01Nodes.splice(this.formation01Nodes.indexOf(enemy),1);
                        // this.formation02Nodes.splice(this.formation02Nodes.indexOf(enemy),1);
                        this.middleEnemyNodes.splice(this.middleEnemyNodes.indexOf(enemy), 1);
                    }
                    bullet.destroy();
                    this.bulletNodes.splice(this.bulletNodes.indexOf(bullet), 1)
                }

            }
            for (const enemy of this.bigEnemyNodes) {
                const enemyPosition = enemy.getPosition();
                const distanceOfX = bulletPosition.x - enemyPosition.x;
                const distanceOfZ = bulletPosition.z - enemyPosition.z;
                const distance = distanceOfX * distanceOfX + distanceOfZ * distanceOfZ;
                if (distance < 0.9 * 0.9) {
                    const enemyHP = enemy.getComponent(bigEnemyStats);
                    enemyHP.health -= 1;
                    if (enemyHP.health > 0) {
                        //发生碰撞后改变颜色
                        const enemyMeshRender = enemy.getComponent(MeshRenderer);
                        enemyMeshRender.setMaterial(this.collisionMaterial, 0)
                        this.scheduleOnce(() => {
                            enemyMeshRender.setMaterial(this.standardMaterial, 0)

                        }, 0.05)
                        //播放碰撞音效
                        const collisionAudio = enemy.getComponent(AudioSource);
                        collisionAudio.play();
                    }

                    if (enemyHP.health <= 0) {
                        const enemyPosition = enemy.position;
                        const bigEnemyDie = instantiate(this.bigEnemyDie);
                        bigEnemyDie.setPosition(enemyPosition);
                        this.node.addChild(bigEnemyDie)

                        // console.log(bigEnemyDie.position)
                        enemy.destroy();
                        this.bigEnemyNodes.splice(this.bigEnemyNodes.indexOf(enemy), 1);
                    }
                    bullet.destroy();
                    this.bulletNodes.splice(this.bulletNodes.indexOf(bullet), 1)
                }

            }
        }
    }
    public clearScreen() {
        this.middleEnemyNodes.forEach((enemy) => {
            enemy.destroy();
            this.middleEnemyNodes = [];
        })
        this.smallEnemyNodes.forEach((enemy) => {
            enemy.destroy();
            this.smallEnemyNodes = [];
        })
        this.bigEnemyNodes.forEach((enemy) => {
            enemy.destroy();
            this.bigEnemyNodes = [];
        })
    }
    public createBoss() {
        // this.clearScreen();
        this.bossHasCreate = true;
        this.boss = instantiate(this.bossNode);
        this.node.addChild(this.boss);
        this.boss.setPosition(40, 1, 0)
        console.log("has create boss")
        this.bossSkill = true;
    }
    // bossMove(){
    //     this.bossNode.data.children.forEach((boss)=>{
    //         const pos = boss.getPosition();
    //         pos.z += this.bossSpeed
    //         if (pos.z > 7 || pos.z < -7) {
    //             this.bossSpeed = -this.bossSpeed;
    //         }
    //         boss.setPosition(pos);
    //         // console.log(boss.position)
    //     })

    // }
    public bossCollision() {
        this.bulletNodes.forEach((bullet) => {
            const bulletPos = bullet.getPosition();

            const bossChildren = this.bossNode.data.children;
            const bossPos = this.boss.position;
            // console.log(bossPos)
            // bossPos  再z(-4,4)这个区间；
            if (bossPos == null) return
            const minZ = bossPos.z - 4;
            const maxZ = bossPos.z + 4;
            const bossStats = this.boss.getComponent(BossControl);
            if (bulletPos.x - bossPos.x > 0) {

                if (bulletPos.z > minZ && bulletPos.z < maxZ) {
                    //    console.log("发生碰撞")


                }
            }
            //为什么这里获取不到子节点的材料fsdfasdf
            const meshRenderer = this.boss.getComponent(MeshRenderer);
            const Material0 = meshRenderer.getRenderMaterial(0);
          
            this.boss.children.forEach((bossChidren) => {
                const meshRenderer01 = bossChidren.getComponent(MeshRenderer);
                const Material1 = meshRenderer01.getRenderMaterial(0);
                if (bossChidren.name !== "BossBullet") {

                    this.bulletNodes.forEach(bullet => {

                        const distanceX = bossChidren.worldPosition.x - bullet.worldPosition.x;
                        const distanceZ = bossChidren.worldPosition.z - bullet.worldPosition.z;
                        const radiusDistance = 0.65;
                        if ((distanceX * distanceX + distanceZ * distanceZ) < radiusDistance * radiusDistance) {
                            // console.log("发生碰撞 ：新方法");
                            //被打击模块变色。
                            meshRenderer01.setMaterial(Material0, 0);
                            setTimeout(() => {
                                meshRenderer01.setMaterial(Material1, 0)
                            }, 100)
                            bullet.destroy()
                            this.bulletNodes.splice(this.bulletNodes.indexOf(bullet), 1);

                            //减少boss血量，产生boss被打击的音效，改变boss的颜色  
                            bossStats.bossHP--;
                            console.log(bossStats.bossHP);
                            const collisionAudio = this.boss.getComponent(AudioSource);
                            // console.log(collisionAudio)
                            collisionAudio.play();

                            if (bossStats.bossHP == 0) {
                                const dieMusic = this.boss.getComponent(BossControl).audioSource2;
                                bossStats.bossSkill = false
                                dieMusic.play();
                                // this.bossDie.play();
                                setTimeout(() => {
                                    console.log("die?")
                                    this.boss.destroy()
                                }, 2000)

                               
                            }
                        }

                    })
                }
            })



            // bossChildren.forEach((boss)=>{
            //     const bossPos = boss.getPosition();
            //     // console.log(bossChildren[1].getPosition())
            //     const X = bulletPos.x - 30 - bossPos.x;
            //     const Z = bulletPos.z - bossPos.z;
            //     const distance = X*X+Z*Z;
            //     // console.log(distance)
            //     if(distance <1){
            //         console.log("has conclusion boss")

            //         bullet.destroy()
            //         this.bulletNodes.splice(this.bulletNodes.indexOf(bullet),1);
            //     }
            // })
        })
    }

    public controlUI() {
        this.startMenu.active = false;
        //获取当前场景的名字
    }
    public reStart() {
        const scene = director.getScene().name;
        director.loadScene(scene);
        // director.pause()
        // if(director.isPaused){
        //     director.resume
        // }
    }
    private _bossBulletPool:Node[] = [];
    public bossBulletCreate() {
        if (this.boss === null) { return };
        let bossBulletNode : Node | null = null;
        if(this._bossBulletPool.length > 0){
            bossBulletNode = this._bossBulletPool.pop();
        }else{
            bossBulletNode = instantiate(this.bossBullet)
        }
        const firstBulletPosition = this.boss.children[5].getWorldPosition();
        for (let i = 0; i < 9; i += 2) {
            bossBulletNode = instantiate(bossBulletNode) //复制节点
            // console.log("实例boss子弹");
            this.node.addChild(bossBulletNode);
            const bossBulletNodePos = firstBulletPosition.z + i;
            bossBulletNode.setWorldPosition(firstBulletPosition.x, firstBulletPosition.y, bossBulletNodePos);
            this.bossBulletNode.push(bossBulletNode);
        }
    }

    //处理玩家的碰撞
    //玩家与物体，子弹
    // x^2 + z^2 < 半径
    public palyerCollision() {
        const meshRenderer = this.myPlane.children[0].getComponent(MeshRenderer);
        const Material0 = meshRenderer.getRenderMaterial(0);
        const Material1 = meshRenderer.getRenderMaterial(1);
        const player = this.myPlane.getComponent(PlayerController)
        //可以打印，但是编辑器里面出错了，那应该就是还没有加载进来，所以才会导致错误 :找到原因了，hp之前设置的是私有的，所以不能访问，但也只是编辑器里面会报错
        this.smallEnemyNodes.forEach(smallEnemy => {
            const distanceX = smallEnemy.worldPosition.x - this.myPlane.position.x;
            const distanceZ = smallEnemy.worldPosition.z - this.myPlane.position.z;
            const distance = distanceX * distanceX + distanceZ * distanceZ;
            const color: Color = new Color(0, 1, 0, 1)
            // console.log(meshRenderer)
            if (distance < 0.65) { // 0.65是两个物体的半径和
                setTimeout(() => {
                    meshRenderer.setMaterial(Material0, 0)
                }, 100)
                meshRenderer.setMaterial(Material1, 0)
                // console.log("挨到小型敌机了")
                smallEnemy.destroy();
                this.smallEnemyNodes.splice(this.smallEnemyNodes.indexOf(smallEnemy), 1)

                player.playerHp--;

            }
        })
        this.middleEnemyNodes.forEach(Enemy => {
            const distanceX = Enemy.worldPosition.x - this.myPlane.position.x;
            const distanceZ = Enemy.worldPosition.z - this.myPlane.position.z;
            const distance = distanceX * distanceX + distanceZ * distanceZ;
            if (distance < 1) { // 0.65是两个物体的半径和
                setTimeout(() => {
                    meshRenderer.setMaterial(Material0, 0)
                }, 100)
                meshRenderer.setMaterial(Material1, 0)
                // console.log("挨到中型敌机了")
                Enemy.destroy()
                this.middleEnemyNodes.splice(this.middleEnemyNodes.indexOf(Enemy), 1)
                player.playerHp--;
            }
        })
        this.bigEnemyNodes.forEach(Enemy => {
            const distanceX = Enemy.worldPosition.x - this.myPlane.position.x;
            const distanceZ = Enemy.worldPosition.z - this.myPlane.position.z;
            const distance = distanceX * distanceX + distanceZ * distanceZ;
            if (distance < 1.25) { // 0.65是两个物体的半径和
                setTimeout(() => {
                    meshRenderer.setMaterial(Material0, 0)
                }, 100)
                meshRenderer.setMaterial(Material1, 0)
                // console.log("挨到大型敌机了")
                Enemy.destroy()
                this.bigEnemyNodes.splice(this.bigEnemyNodes.indexOf(Enemy), 1)
                player.playerHp--;
            }
        })
        this.bossBulletNode.forEach(Enemy => {
            const distanceX = Enemy.worldPosition.x - this.myPlane.position.x;
            const distanceZ = Enemy.worldPosition.z - this.myPlane.position.z;
            const distance = distanceX * distanceX + distanceZ * distanceZ;
            if (distance < 0.75) { // 0.65是两个物体的半径和
                setTimeout(() => {
                    meshRenderer.setMaterial(Material0, 0)
                }, 100)
                meshRenderer.setMaterial(Material1, 0)
                // console.log("挨到子弹了")
                // Enemy.destroy()
                Enemy.removeFromParent();
                this._bossBulletPool.push(Enemy);
                this.bossBulletNode.splice(this.bossBulletNode.indexOf(Enemy), 1)
                player.playerHp--;
            }
        });
        if (player.playerHp <= 0) {
            if (this.isDie === false) {
                // console.log("移除")
                const diePos = this.myPlane.position;
                const diePlaneNode = instantiate(this.diePlayerPrefab);
                this.node.addChild(diePlaneNode);
                diePlaneNode.setPosition(diePos);
                director.getScene().emit("level_failed");
                //这个方法可以用，直接从父节点删除
                this.myPlane.removeFromParent();
                this.isDie = true;
            }
            //清除子弹
            this.bulletNodes.forEach((bullet) => {
                bullet.destroy();
                this.bulletNodes = [];
            })
        }
    }
}


