// src/stores/TimerStore.ts
import { defineStore } from 'pinia';

interface TimerState {
    startTime: number | null;
}

export const useTimerStore = defineStore('timer', {
    state: (): TimerState => ({
        startTime: null,
    }),
    actions: {
        setStartTime(this: TimerState, time: number) {
            this.startTime = time;
        },
        getStartTime(this: TimerState) {
            return this.startTime;
        },
        reset(this: TimerState) {
            this.startTime = null;
        },
    },
});
