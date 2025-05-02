import { existsSync } from 'node:fs'
import type { Nuxt } from 'nuxt/schema'
import type { Resolver } from '@nuxt/kit'

const DEVTOOLS_UI_ROUTE = '/__nuxt-devtools-events'
const DEVTOOLS_UI_LOCAL_PORT = 3300

export function setupDevToolsUI(nuxt: Nuxt, resolver: Resolver) {
    const clientPath = resolver.resolve('./client')
    const isProductionBuild = existsSync(clientPath)

    // Serve production-built client (used when package is published)
    if (isProductionBuild) {
        nuxt.hook('vite:serverCreated', async (server) => {
            const sirv = await import('sirv').then(module => module.default || module)
            
            server.middlewares.use(
                DEVTOOLS_UI_ROUTE,
                sirv(clientPath, { dev: true, single: true }),
            )
        })
    } else {
        // In local development, start a separate Nuxt Server and proxy to serve the client
        nuxt.hook('vite:extendConfig', (config) => {
            config.server = config.server || {}
            config.server.proxy = config.server.proxy || {}
            
            config.server.proxy[DEVTOOLS_UI_ROUTE] = {
                target: 'http://localhost:' + DEVTOOLS_UI_LOCAL_PORT + DEVTOOLS_UI_ROUTE,
                changeOrigin: true,
                followRedirects: true,
                rewrite: path => path.replace(DEVTOOLS_UI_ROUTE, ''),
            }
        })
    }

    nuxt.hook('devtools:customTabs', tabs => {
        tabs.push({
            name: 'nuxt-devtools-events',
            title: 'Nuxt Devtools Events',
            icon: 'carbon:apps',
            view: {
                type: 'iframe',
                src: DEVTOOLS_UI_ROUTE,
            },
        })
    })
}
