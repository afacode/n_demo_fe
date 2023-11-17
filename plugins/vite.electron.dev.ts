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
                let ElectronProcess = spawn(require('electron'), ['dist/packground.js', IP])
                fs.watchFile('src/packground.ts', () => {
                    ElectronProcess.kill()
                    buildBackground()
                    ElectronProcess = spawn(require('electron'), ['dist/packground.js', IP])
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
        entryPoints: ['src/packground.ts'],
        outfile: 'dist/packground.js',
        bundle: true,
        platform: 'node',
        external: ['electron']
    })
}