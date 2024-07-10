import { PuzzlePiece } from "@/shared/models/puzzlePieceModel";

export interface RoomPuzzleReleaseDto {
  puzzlePiece: PuzzlePiece;
  changedPieces: PuzzlePiece[];
}