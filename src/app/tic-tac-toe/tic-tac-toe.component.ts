import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Block } from '../block';
import { Player } from '../player';
import { timer, Subscription } from 'rxjs';
import { TicTacToeService } from '../tic-tac-toe.service';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicTacToeComponent implements OnInit {

  mouseAt: Block;
  ticTacToeServiceTimeChagne: Subscription;

  constructor(
    private ticTacToeService: TicTacToeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.ticTacToeServiceTimeChagne = this.ticTacToeService.timeChangeEventEmitter.subscribe(
      () => {
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  ngOnDestroy() {
    this.ticTacToeServiceTimeChagne.unsubscribe();
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
          this.showResult();
        }
      }
    }
  }

  private showResult(): void {
    const showTimer = timer(100);
    const subscript = showTimer.subscribe(
      () => {
        subscript.unsubscribe();
        if (this.wonPlayer === this.players[0]) {
          alert("Player ◯  Win");
        }
        else if (this.wonPlayer === this.players[1]) {
          alert("Player ✖ Win");
        }
        else {
          alert("Draw");
        }
      }
    );
  }

  timeUpShowed: boolean = false;
  ngDoCheck() {
    if (!this.timeUpShowed) {
      if (this.isGameEnds()) {
        if (this.ticTacToeService.isTimeup()) {
          this.showResult();
        }
        this.timeUpShowed = true;
      }
    }
  }

  start(): void {
    this.timeUpShowed = false;
    this.ticTacToeService.gameStart();
  }

  canStart(): boolean {
    return !this.canReset();
  }

  reset(): void {
    this.timeUpShowed = false;
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
