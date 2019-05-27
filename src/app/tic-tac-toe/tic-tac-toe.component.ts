import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Block } from '../block';
import { Player } from '../player';
import { timer, Subscription } from 'rxjs';
import { TicTacToeService } from '../tic-tac-toe.service';

class TicTacToeComponentBase implements OnInit {
  mouseAt: Block;

  gameWonSubscript: Subscription;
  gameDrawSubscript: Subscription;

  constructor(
    protected ticTacToeService: TicTacToeService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.gameWonSubscript = this.ticTacToeService.gameWonEvent.subscribe(
      () => {
        this.showResult();
      }
    );
    this.gameDrawSubscript = this.ticTacToeService.gameDrawEvent.subscribe(
      () => {
        this.showResult();
      }
    );
  }

  ngOnDestroy() {
    this.gameWonSubscript.unsubscribe();
    this.gameDrawSubscript.unsubscribe();
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
    this.ticTacToeService.play(blockIdx);
  }

  private showResult(): void {
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

@Component({
  selector: 'app-tic-tac-toe-default',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css'],
  providers: [TicTacToeService]
})
export class TicTacToeComponentDefault extends TicTacToeComponentBase {
  constructor(
    ticTacToeService: TicTacToeService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(ticTacToeService, changeDetectorRef);
  }
}

@Component({
  selector: 'app-tic-tac-toe-onpush',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css'],
  providers: [TicTacToeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicTacToeComponentOnPush extends TicTacToeComponentBase {
  constructor(
    ticTacToeService: TicTacToeService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(ticTacToeService, changeDetectorRef);
  }
}

@Component({
  selector: 'app-tic-tac-toe-onpush-check',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css'],
  providers: [TicTacToeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicTacToeComponentOnPushCheck extends TicTacToeComponentBase {
  ticTacToeServiceTimeChagne: Subscription;

  constructor(
    ticTacToeService: TicTacToeService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(ticTacToeService, changeDetectorRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.ticTacToeServiceTimeChagne = this.ticTacToeService.timeChangeEventEmitter.subscribe(
      () => {
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  ngOnDestroy() {
    this.ticTacToeServiceTimeChagne.unsubscribe();

    super.ngOnDestroy();
  }
}
