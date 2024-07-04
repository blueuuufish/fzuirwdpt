import { useSocketGameService } from "../ws/socketGameService";
import { SocketDestinations } from "@/shared/enums/socketDestinationsEnum";
import { SocketEventType } from "@/shared/enums/socketEventTypeEnum";
import { SocketMessage } from "@/shared/models/ws/socketMessageModel";
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { LobbyCreateRoomDto } from "@/shared/models/dto/lobbyCreateRoomDto";
import { BehaviorSubject, Observable, from} from 'rxjs';
import { Room } from "@/shared/models/roomModel";
import { LobbyRoomCreatedDto } from "@/shared/models/dto/lobbyRoomCreateDto";
import { useRoomService } from "../room/roomService";
import { ref, onUnmounted, defineEmits} from 'vue';
import request from "@/utils/request";
import { environment } from "@/environments/environment";
import { AxiosResponse } from "axios";

export function useLobbyService() {
  const emit = defineEmits(['lobbyEvent']);
  const roomListSubject: BehaviorSubject<Room[]>  = new BehaviorSubject([] as any);
  const creatingRoomSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  const socketGameService = useSocketGameService();
  const roomService = useRoomService();
  const stompSubscriptions = ref<StompSubscription[]>([]);

  const join = (initialDataCallback: Function) => {
      stompSubscriptions.value.push(
        socketGameService.subscribe(SocketDestinations.Lobby,(message:IMessage)=>{
          const socketMessage: SocketMessage = JSON.parse(message.body);
          if(socketMessage.event === SocketEventType.Lobby_InitialData){
              setRoomListSubject(socketMessage.body.rooms);
              initialDataCallback(socketMessage.body);
          }
          receiveMessage(socketMessage);
        }),
        socketGameService.subscribeUser(SocketDestinations.Lobby,(message:IMessage)=>{
          const socketMessage: SocketMessage = JSON.parse(message.body);
          receiveMessage(socketMessage);
        })
      );
  };

  const setRoomListSubject = (roomList : Room[]) => {
      roomListSubject.next(roomList);
  };

  // const getRooms = (): Observable<Room[]> => {
  //   return from(
  //     request.get<Room[]>({url:`${environment.apiUrl}/rooms`})
  //     .then((response: AxiosResponse<Room[]>) => response.data)
  //   );
  // }
  const getRooms = () => {
    return request.get<Room[]>({url:`${environment.apiUrl}/rooms`});
  }
  const detach = () => {
    socketGameService.unsubscribe(SocketDestinations.Lobby);
    socketGameService.unsubscribeUser(SocketDestinations.Lobby);
    for(let sub of stompSubscriptions.value) {
      sub.unsubscribe();
    }
    stompSubscriptions.value = [];
  }
  // TODO: 未测试 未调用roomService
  const createRoom = (lobbyCreateRoom: LobbyCreateRoomDto, imageFile: File) => {
    console.log(imageFile);
    const formData: FormData = new FormData();
    formData.append('file', imageFile);
    const jsonBlob = new Blob([JSON.stringify(lobbyCreateRoom)], { type: 'application/json' });
        formData.append('dto', jsonBlob, 'dto.json');
    console.log("===");
    console.log(formData. get("file"));
    
    
    request.post({
      url: `${environment.apiUrl}/rooms`,
      data: formData2
    }).then((data)=> {
      console.log(data)
      // roomService.join(room.id); 
    })
   
  }
  
  const changeCreatingRoom = (creatingRoom: boolean) => {
      creatingRoomSubject.next(creatingRoom);
  }
  const receiveMessage = (message: SocketMessage) => {
    if(message.event === SocketEventType.Lobby_RoomCreated) {
      const messageBody: LobbyRoomCreatedDto = message.body;
      
      setRoomListSubject([...roomListSubject.value, messageBody.room]);
    }else if(message.event === SocketEventType.Lobby_RoomRemoved){
      const messageBody: LobbyRoomCreatedDto = message.body;
      setRoomListSubject(roomListSubject.value.filter(room => room.id !== messageBody.room.id)); 
    }
    emit("lobbyEvent",message);
  }

  return {
      creatingRoomSubject,
      roomListSubject,
      join,
      getRooms,
      setRoomListSubject,
      detach,
      createRoom,
      changeCreatingRoom
  };
}
