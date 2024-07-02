import { RoomUser } from './roomUserModel';
import { Puzzle } from './puzzleModel';

export class Room {
  id: string;
  userCapacity: number;
  users: RoomUser[];
  puzzle: Puzzle;

  constructor(id: string, userCapacity: number, users: RoomUser[], puzzle: Puzzle) {
    this.id = id;
    this.userCapacity = userCapacity;
    this.users = users;
    this.puzzle = puzzle;
  }
}
