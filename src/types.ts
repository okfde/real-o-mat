import type { InjectionKey } from 'vue'
import type { Election } from './content.config'

export const ElectionKey: InjectionKey<Election> = Symbol('Election')
