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
            packageJson.main = 'background.js'

            fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 4))

            fs.mkdirSync('dist/node_modules')

            ElectronBuilder.build({
                config: {
                    directories: {
                        output: path.resolve(process.cwd(), 'release'),
                        app: path.resolve(process.cwd(), 'dist'),
                    },
                    // files: [
                    //     // "dist/**/*",
                    //     // "electron/**/*"
                    // ],
                    asar: true, //压缩包
                    appId:'top.afacode.www',
                    productName: 'nest-electron',
                    nsis: {
                        oneClick: false, // 是否启用一键安装，此处设置为false，表示禁用一键安装；
                        allowToChangeInstallationDirectory: true, // 允许用户在安装过程中选择安装目录；
                    },
                    win: {
                        artifactName: '${productName}-${platform}-${arch}-${version}.${ext}',
                    }
                }
            })
        },
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