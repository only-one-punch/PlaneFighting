import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('middleEnemyStats')
export class middleEnemyStats extends Component {
    public health : number = 5;
    public speed : number = 0.1;
    public enemyName : string = "middleEnemy";
    

}


