import { _decorator, cclegacy, Vec3, Component, EventKeyboard, Input, input, KeyCode, Node, view, Prefab, MeshRenderer, Material, System, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    // 判断按钮是否被按下
    private _isKeyDown: boolean = false;
    //横向移动：
    private _isCrossMove:boolean = false;
    //纵向移动：
    private _isLongitudinal:boolean = false;
    //为什么要设置，这个，间接的得到鼠标按下和鼠标弹起的时间

    //固定每帧移动的距离
    private _moveDistance:number = 5;
    private _curSpeed:number = 0;

    //存储需要移动的位置
    private _curPos: Vec3 = new Vec3();

    //目标位置
    private _targetPos: Vec3 = new Vec3();


    public playerHp:number = 4;
    
    private meshRender:MeshRenderer | null = null; 
    start() {
        input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        input.on(Input.EventType.KEY_UP,this.onKeyUp,this);
        this.meshRender = this.node.children[0].getComponent(MeshRenderer);
        console.log( this.meshRender.getRenderMaterial(1));
        //开始监听触摸事件
        input.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
        input.on(Input.EventType.TOUCH_MOVE,this.onTouchMove,this);
    }
    onTouchStart(touch:EventTouch){

    };
    public deltatime:number = 0;
    onTouchMove(touch:EventTouch){
    console.log(touch.getDeltaX(),touch.getDeltaY())
    const planePos = this.node.getPosition();
    console.log(planePos)
    const newPosX = planePos.x + touch.getDeltaY()*this.deltatime*1.2;
    const newPosZ = planePos.z + touch.getDeltaX()*this.deltatime*1.2; 
    this.node.setPosition(newPosX,planePos.y,newPosZ)
    };
    update(deltaTime: number) {
        this.deltatime = deltaTime;
        //需要随时判断其是否触碰边界，所以应该在这里调用范围函数
        this.checkPlaneRadius();

        //_isKeyDown 判断按钮是否按下
        if(this._isKeyDown){
            this.node.getPosition(this._curPos); //用于获取当前节点的位置信息，并将其存储在 _curPos 变量中
            //计算的出每帧移动的位置，并使其移动。
            // 横向移动
             
            // console.log(this._moveDistance)
            if(this._isCrossMove){             
                Vec3.add(this._targetPos,this._curPos,new Vec3(0,0,this._moveDistance*deltaTime));
                // console.log(this._targetPos)
            }
            //纵向移动
            if(this._isLongitudinal){
                Vec3.add(this._targetPos,this._curPos,new Vec3(this._moveDistance*deltaTime,0,0));
            }
            // this._targetPos = this._curPos
            // this._curPos + x/y轴移动的距离
            this.node.setPosition(this._targetPos);

            //注意这个 if 语句必须放在 它们移动过后；不然当大于9时就无法横移 
            if(this.node.position.z >= 9 || this.node.position.z <= -9){
                this._isCrossMove = false;
                // console.log("可以执行吗")
            } 
            if(this.node.position.x >= 40 || this.node.position.x <= 0){
                this._isLongitudinal = false;
            }
        }
        //可以计算得出每帧向前移动的位置
        
        
        
    }

    //移动准备函数
    

    onKeyDown(event:EventKeyboard){
        this._isKeyDown = true;
        

        // this._targetPos = this._curPos
        // this._curPos + x/y轴移动的距离
        
        //控制向左移动
       if(event.keyCode === KeyCode.KEY_A){
         this._isCrossMove = true;
         this._moveDistance = -this._moveDistance;

       }
       //控制向右移动
       if(event.keyCode === KeyCode.KEY_D){
        this._isCrossMove = true;
        this._moveDistance = this._moveDistance;
        
       }
       //控制向前移动
       if(event.keyCode === KeyCode.KEY_W){
        this._isLongitudinal = true;
        this._moveDistance = this._moveDistance;
       }
       //控制向后移动
       if(event.keyCode === KeyCode.KEY_S){
        this._isLongitudinal = true;
        this._moveDistance = -this._moveDistance;
       }

    } 
    //限制其移动范围 
    checkPlaneRadius(){
        // 因为不知道怎样获取到屏幕的参数，所以直接手动测试出左右边距。38
        // 获取飞机的位置 也就是目标移动后的位置 this._targetPos
        // 判断pos的左右边距的位置，当触碰到边距时，让其 _moveDistance = 0;
        // 如果没有触碰到便让其移动距离恢复
        // console.log(this._targetPos.z)
        // if(this._targetPos.z >= 10 || this._targetPos.z <= -10){
        //     this._moveDistance = 0;
        //     // console.log("限制函数")
            
        // }
        // if(this._targetPos.z > -20 || this._targetPos.z < 20){
        //     this._moveDistance = 10;
        //     // console.log("限制函数被调用了吗")
        // }
        
        
     }

    onKeyUp(event:EventKeyboard){
        // console.log(this._isCrossMove)
        this._isKeyDown = false;
        this._isCrossMove = false;
        this._isLongitudinal = false;
       
        //恢复默认 
        this._moveDistance = 10;
    }

    
    //要限制飞机飞行的范围，需要使用this.node， 这个代指挂在脚本的节点
    limitFlightRange(){
        if(this.node.position.z >= 10 || this.node.position.z <= -10){
            this._moveDistance = 0;
            console.log("这个限制函数执行了")
        }
    }

    setInputActive(active:boolean){
        if(active){
            input.on(Input.EventType.KEY_UP,this.onKeyUp,this)
        }else{
            input.off(Input.EventType.KEY_DOWN,this.onKeyDown,this)
        }
    }
}

