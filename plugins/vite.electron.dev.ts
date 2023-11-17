import { AddressInfo } from 'node:net'
import type {Plugin, ViteDevServer} from 'vite'
import {spawn} from 'child_process'
import fs from 'node:fs'

export const ElectronDevPlugin = () :Plugin => {
    return {
        name: 'electron-dev',
        configureServer(server: ViteDevServer) {
            buildBackground()
            server.httpServer?.once('listening', () => {
                const addressInfo = server.httpServer?.address() as AddressInfo
                const IP = `http://localhost:${addressInfo.port}`
                console.log(IP)
                let ElectronProcess = spawn(require('electron'), ['dist/background.js', IP])
                fs.watchFile('src/background.ts', () => {
                    ElectronProcess.kill()
                    buildBackground()
                    ElectronProcess = spawn(require('electron'), ['dist/background.js', IP])
                })
                ElectronProcess.stderr.on('data', (data) => {
                    console.log('logger----', data.toString())
                })
            })
        }
    }
}

function buildBackground() {
    require('esbuild').buildSync({
        entryPoints: ['src/background.ts'],
        outfile: 'dist/background.js',
        bundle: true,
        platform: 'node',
        target: 'node12',
        external: ['electron']
    })
}