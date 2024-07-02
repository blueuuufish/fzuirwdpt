import { PuzzlePiece } from "@/shared/models/puzzlePieceModel";

export interface RoomPuzzleMoveDto {
  username: string;
  puzzlePiece: PuzzlePiece;
}