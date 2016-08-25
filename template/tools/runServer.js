/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import path from 'path';
import cp from 'child_process';
import webpackConfig from './webpack.config';

const RUNNING_REGEXP = /The server is running at http:\/\/(.*?)\//;

let server;
const { output } = webpackConfig.find(x => x.target === 'node');
const serverPath = path.join(output.path, output.filename);

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

export default function runServer(cb) {
  function onStdOut(data) {
    const time = new Date().toTimeString();
    const match = data.toString('utf8').match(RUNNING_REGEXP);

    process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '));
    process.stdout.write(data);

    if (match) {
      server.stdout.removeListener('data', onStdOut);
      server.stdout.on('data', x => process.stdout.write(x));
      if (cb) {
        cb(null, match[1]);
      }
    }
  }

  if (server) {
    server.kill('SIGTERM');
  }

  server = cp.spawn('node', [serverPath], {
    env: Object.assign({ NODE_ENV: 'development' }, process.env),
    silent: false,
  });

  server.stdout.on('data', onStdOut);
  server.stderr.on('data', x => process.stderr.write(x));
}
