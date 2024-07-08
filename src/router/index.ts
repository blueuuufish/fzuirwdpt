import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Lobby from '../views/lobby/join_lobby.vue'
import Room from '../views/room/room.vue'
import GameBoard from '../views/game-board/GameBoard.vue'
import Lobby_Nav from '../views/lobby/lobby_nav.vue'
import LobbyPage from '../views/lobby/lobby-page/LobbyPage.vue'
import Create_Room from '../views/lobby/create_room.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'lobby',
    component: LobbyPage
  },
  {
    path: '/lobby_nav',
    name: 'lobby_nav',
    component: Lobby_Nav
  },
  {
    path: '/create_room',
    name: 'create_room',
    component: Create_Room
  },
  {
    path: '/room',
    name: 'room',
    component: Room
  },
  {
    path: '/lobby',
    name: 'lobbyPage',
    component: LobbyPage
  },
  
  // {
  //   path: '/',
  //   name: 'gameTest',
  //   component: GameBoard
  // },
  // {
  //   path: '/lobby_page',
  //   name: 'lobbypage',
  //   component: Lobby_page
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
