import { setupDevToolsUI } from './devtools'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
    devtools: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'nuxt-devtools-events',
        configKey: 'nuxtDevtoolsEvents',
    },

    defaults: {
        devtools: true,
    },
        
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        addPlugin(resolver.resolve('./runtime/plugin'))

        if (options.devtools) {
            setupDevToolsUI(nuxt, resolver)
        }
    },
})
