import type {Plugin} from 'vite'
import fs from 'node:fs'
import * as ElectronBuilder from 'electron-builder'
import path from 'path'

// vue项目打包完成后才能执行electron-build打包
export const ElectronBuildPlugin = ():Plugin => {
    return {
        name: 'electron-build',
        closeBundle() {
            buildBackground()

            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            packageJson.main = 'packground.js'

            fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 4))

            fs.mkdirSync('dist/node_modules')

            ElectronBuilder.build({
                config: {
                    directories: {
                        output: path.resolve(process.cwd(), 'release'),
                        // output: "electron_dist"
                        app: path.resolve(process.cwd(), 'dist'),
                    },
                    // files: ['**/*'],
                    asar: true, //压缩包
                    appId:'top.afacode',
                    productName: 'n_demo_fe',
                    nsis: {
                        oneClick: false,
                        allowToChangeInstallationDirectory: true,

                    }
                }
            })
        },
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