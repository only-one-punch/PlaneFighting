import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('smallEnemyStats')
export class smallEnemyStats extends Component {
    public health : number = 1;
    public speed : number = 0.15;
    public enemyName : string = "smallEnemy";
}


