import { useSocketGameService } from "../ws/socketGameService";
import { SocketDestinations } from "@/shared/enums/socketDestinationsEnum";
import { SocketEventType } from "@/shared/enums/socketEventTypeEnum";
import { SocketMessage } from "@/shared/models/ws/socketMessageModel";
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { LobbyCreateRoomDto } from "@/shared/models/dto/lobbyCreateRoomDto";
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from "@/shared/models/roomModel";
import { LobbyRoomCreatedDto } from "@/shared/models/dto/lobbyRoomCreateDto";
import { useRoomService } from "../room/roomService";

// TODO: 检查逻辑是否一致

export function useLobbyService() {
  

  return {
   
  };
}
