import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('middleEnemyStats')
export class middleEnemyStats extends Component {
    public health : number = 2;
    public speed : number = 12;
    public enemyName : string = "middleEnemy";
    

}


