/**
 * declare module '@vue/runtime-core'
 *   现调整为
 * declare module 'vue'
 */
import 'vue'
import type HomeGuess from '@/components/HomeGuess.vue'
declare module 'vue' {
  export interface GlobalComponents {
    //
  }
}
export type HomeGuessInstance = InstanceType<typeof HomeGuess>
