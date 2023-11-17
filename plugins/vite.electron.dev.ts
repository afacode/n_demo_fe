import { AddressInfo } from 'node:net'
import type {Plugin, ViteDevServer} from 'vite'
import {spawn} from 'child_process'


export const ElectronDevPlugin = () :Plugin => {
    return {
        name: 'electron-dev',
        configureServer(server: ViteDevServer) {
            require('esbuild').buildSync({
                entryPoints: ['src/packground.ts'],
                outfile: 'dist/packground.js',
                bundle: true,
                platform: 'node',
                external: ['electron']
            })
            server.httpServer?.on('listening', () => {
                const addressInfo = server.httpServer?.address() as AddressInfo
                const IP = `http://localhost:${addressInfo.port}`
                console.log(IP)
                spawn(require('electron'), ['dist/packground.js', IP])
            })
        }
    }
}