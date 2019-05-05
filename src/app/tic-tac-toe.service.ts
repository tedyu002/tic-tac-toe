import { Injectable, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';
import { Block } from './block';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {
  blocks: Block[];
  players: Player[];
  round: number;
  SIZE = 3;
  PLAYER_NUM = 2;

  game_judge_row: number[];
  game_judge_col: number[];
  game_judge_slope: number[];

  startTime: number;
  tick: any;

  timeChangeEventEmitter: EventEmitter<number>;

  constructor() { 
    this.gameReset();
    this.timeChangeEventEmitter = new EventEmitter<any>();

    this.tick = timer(0, 1000 / 60).subscribe(
      (val) => {
        if (this.isGameStart() && !this.isGameEnds()) {
          this.applyTime();
          this.timeChangeEventEmitter.emit(null);
        }
      }
    );
  }

  ngOnDestroy() {
    this.tick.unsubscribe();
  }

  gameStart(): void {
    this.startTime = (new Date()).getTime();
  }

  gameReset(): void {
    this.blocks = [];
    this.players = [];
    this.round = 0;
    this.startTime = null;

    for (let i = 0; i < this.SIZE * this.SIZE; ++i) {
      this.blocks[i] = new Block();
    }

    for (let i = 0; i < this.PLAYER_NUM; ++i) {
      this.players[i] = new Player();
      this.players[i].remains = 60 * 1000;
    }

    this.game_judge_row = [];
    this.game_judge_col = [];

    for (let i = 0; i < this.SIZE; ++i) {
      this.game_judge_row[i] = 0;
      this.game_judge_col[i] = 0;
    }

    this.game_judge_slope = [0, 0];
  }

  play(blockIdx: number) {
    let block = this.blocks[blockIdx];

    if (this.isGameStart() && !this.isGameEnds() && !block.setBy) {
      if (!this.applyTime()) {
        return;
      }
      block.setBy = this.currentPlayer;

      let row = Math.floor(blockIdx / this.SIZE);
      let col = blockIdx % this.SIZE;
      let slope1 = row == col ? true: false;
      let slope2 = col == (this.SIZE - 1 - row) ? true: false;
      let change = this.currentPlayer === this.players[0] ? 1 : -1;

      this.game_judge_row[row] += change;
      this.game_judge_col[col] += change;

      if (slope1) {
        this.game_judge_slope[0] += change;
      }
      if (slope2) {
        this.game_judge_slope[1] += change;
      }

      if (!this.isHit()) {
        this.round += 1;
      }
    }
  }

  isGameStart(): boolean {
    return !(this.startTime === null);
  }

  isTimeup(): boolean {
    return this.players[0].remains == 0 || this.players[1].remains == 0;
  }

  isFull(): boolean {
    return this.round >= this.SIZE * this.SIZE;
  }

  isHit(): boolean {
    let checkPointss = [this.game_judge_row, this.game_judge_col, this.game_judge_slope];

    for (let checkPoints of checkPointss) {
      for (let checkPoint of checkPoints) {
        if (checkPoint == this.SIZE || checkPoint == -this.SIZE) {
          return true;
        }
      }
    }

    return false;
  }

  isGameEnds(): boolean {
    return this.isFull() || this.isTimeup() || this.isHit();
  }

  get currentPlayer(): Player {
    return this.players[this.round % 2];
  }

  get anotherPlayer(): Player {
    return this.players[(this.round + 1) % 2];
  }

  get wonPlayer(): Player {
    if (this.isHit()) {
      return this.currentPlayer;
    }
    else if (this.isTimeup()) {
      return this.anotherPlayer;
    }

    return null;
  }

  private applyTime(): boolean {
    let currentTime = (new Date()).getTime();
    this.currentPlayer.remains -= currentTime - this.startTime;

    if (this.currentPlayer.remains < 0) {
      this.currentPlayer.remains = 0;
      return false;
    }
    this.startTime = currentTime;

    return true;
  }
}
