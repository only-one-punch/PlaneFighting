import { _decorator, Component, director, Node } from 'cc';
import { GameManager } from '../Script/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
   @property(Node)
   uiLevelFailure:Node;
    start(){ 
      director.getScene().on("level_failed",this.onEvent_levelFailed,this);
    }
    update(deltaTime: number) {
        
    }

    onButtonClick(){
       director.loadScene("GameScene")
    }
    reStart(){
       director.loadScene(director.getScene().name);
    }
    onBtnMainMenu(){
      director.loadScene("MainScene");
    }
    onEvent_levelFailed(){
      console.log("123");
      this.uiLevelFailure.active = true;
    }

}


