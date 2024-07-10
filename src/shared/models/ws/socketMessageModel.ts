import { SocketEventType } from "@/shared/enums/socketEventTypeEnum";

export class SocketMessage {
  event: SocketEventType;
  body: any;

  constructor(event: SocketEventType, body: any) {
    this.event = event;
    this.body = body;
  }
}