import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Block } from '../block';
import { Player } from '../player';
import { TicTacToeService } from '../tic-tac-toe.service';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {

  mouseAt: Block;

  constructor(private ticTacToeService: TicTacToeService) { }

  ngOnInit() {
  }

  get blocks(): Block[] {
    return this.ticTacToeService.blocks;
  }

  get players(): Player[] {
    return this.ticTacToeService.players;
  }

  get currentPlayer(): Player {
    return this.ticTacToeService.currentPlayer;
  }

  get wonPlayer(): Player {
    return this.ticTacToeService.wonPlayer;
  }

  userAction(blockIdx: number) {
    if (this.ticTacToeService.isGameStart()) {
      if (!this.ticTacToeService.isGameEnds()) {
        this.ticTacToeService.play(blockIdx);

        if (this.ticTacToeService.isGameEnds()) {
          if (this.wonPlayer === this.players[0]) {
            alert("Player 1 Win");
          }
          else if (this.wonPlayer === this.players[1]) {
            alert("Player 2 Win");
          }
          else {
            alert("Draw");
          }
        }
      }
    }
  }

  start(): void {
    this.ticTacToeService.gameStart();
  }

  canStart(): boolean {
    return !this.canReset();
  }

  reset(): void {
    this.ticTacToeService.gameReset();
  }

  canReset(): boolean {
    return this.ticTacToeService.isGameStart();
  }

  isGameEnds(): boolean {
    return this.ticTacToeService.isGameEnds();
  }

  blockEnter(block: Block): void {
    if (this.ticTacToeService.isGameStart() && !this.ticTacToeService.isGameEnds()) {
      this.mouseAt = block;
    }
  }

  blockLeave(block: Block): void {
    if (this.mouseAt === block) {
      this.mouseAt = null;
    }
  }

  isEnter(block: Block): boolean {
    return block === this.mouseAt;
  }
}
