import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('enemyStats')
export class bigEnemyStats extends Component {
    public health : number = 7;
    public speed : number = 0.07;
    public enemyName : string = "bigEnemy";
}


