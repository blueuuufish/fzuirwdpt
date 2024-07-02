import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Lobby from '../views/lobby/lobby.vue'
import Room from '../views/room/room.vue'
import GameBoard from '../views/game-board/GameBoard.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/lobby',
    name: 'src/App.vue',
    component: Lobby
  },
  {
    path: '/room',
    name: 'room',
    component: Room
  },
  {
    path: '/',
    name: 'gameTest',
    component: GameBoard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
