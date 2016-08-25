/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import path from 'path';
import serverConfig from './cfg/server';
import devConfig from './cfg/client.dev';
import prodConfig from './cfg/client.prod';
const DEBUG = !process.argv.includes('--release');
const clientConfig = DEBUG ? devConfig : prodConfig;

export default [clientConfig, serverConfig];
