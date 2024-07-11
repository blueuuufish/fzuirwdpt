// eventBus.ts
import { ref } from 'vue';
import { Subscription } from 'rxjs';

export const eventBus = {
  events: ref([] as any[]),

  emit(event: string, payload: any) {
    console.log("emit")
    console.log(event)
    console.log(payload)
    this.events.value.push({ event, payload });
  },

  on(event: string, callback: (payload: any) => void){
    console.log('on')
    console.log(event)
    console.log(callback)
    this.events.value.push({ event, callback });
  },

  off(event: string) {
    this.events.value = this.events.value.filter(e => e.event !== event);
  },

  trigger(event: string, payload: any) {
    this.events.value.forEach(e => {
      if (e.event === event && typeof e.callback === 'function') {
        e.callback(payload);
      }
    });
  }
};
