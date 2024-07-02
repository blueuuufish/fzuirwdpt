import { PuzzlePiece } from "./puzzlePieceModel";

export class Puzzle {
  imageBase64: string;
  imageSize: number[];
  worldSize: number[];
  pieceSize: number[];
  piecesDimensions: number[];
  puzzlePieces: PuzzlePiece[];

  constructor(imageBase64: string, imageSize: number[], worldSize: number[], pieceSize: number[], piecesDimensions: number[], puzzlePieces: PuzzlePiece[]) {
    this.imageBase64 = imageBase64;
    this.imageSize = imageSize;
    this.worldSize = worldSize;
    this.pieceSize = pieceSize;
    this.piecesDimensions = piecesDimensions;
    this.puzzlePieces = puzzlePieces;
  }
}