import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'

export interface ModuleOptions {
    devtools: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'my-module',
        configKey: 'myModule',
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
