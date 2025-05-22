import { Injectable } from '@angular/core';
import { Player } from './models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private players: Player[] = [
    { id: 1, name: 'Player 1', currentPosition: 0, color: 'blue' },
    { id: 2, name: 'Player 2', currentPosition: 0, color: 'red' }
  ];

  private readonly numberOfSpaces = 20;

  constructor() { }

  getPlayers(): Player[] {
    return this.players;
  }

  rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  movePlayer(playerId: number, steps: number): void {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      player.currentPosition = (player.currentPosition + steps) % this.numberOfSpaces;
    }
  }
}
