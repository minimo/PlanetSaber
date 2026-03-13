import { eventBus } from './EventBus';

export type GameStatus = 'title' | 'playing' | 'gameover' | 'clear';

export class GameState {
  score: number = 0;
  life: number = 5;
  progress: number = 0;
  status: GameStatus = 'title';
  isPaused: boolean = false;

  reset() {
    this.score = 0;
    this.life = 5;
    this.progress = 0;
    this.status = 'playing';
    this.isPaused = false;
    eventBus.emit('state:changed', this);
  }

  addScore(points: number) {
    this.score += points;
    eventBus.emit('state:score', this.score);
  }

  takeDamage(amount: number = 1) {
    if (this.status !== 'playing') return;
    this.life -= amount;
    eventBus.emit('state:life', this.life);
    
    if (this.life <= 0) {
      this.status = 'gameover';
      eventBus.emit('state:gameover');
    }
  }

  updateProgress(delta: number) {
    if (this.status !== 'playing') return;
    this.progress += delta;
    if (this.progress > 100) this.progress = 100;
    eventBus.emit('state:progress', this.progress);
    
    if (this.progress >= 100 && this.status === 'playing') {
      this.status = 'clear';
      eventBus.emit('state:clear');
    }
  }

  togglePause() {
    if (this.status === 'playing') {
      this.isPaused = !this.isPaused;
      eventBus.emit('state:pause', this.isPaused);
    }
  }
}

export const gameState = new GameState();
