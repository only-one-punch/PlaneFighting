import { _decorator, Component, director, Node } from 'cc';
import { GameManager } from '../Script/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
   @property(Node)
   uiLevelFailure:Node;
    update(deltaTime: number) {
        
    }

    onButtonClick(){
       director.loadScene("GameScene")
    }
    reStart(){
       director.loadScene(director.getScene().name)
    }
    onBtnMainMenu(){
      director.loadScene("MainScene")
    }
}


