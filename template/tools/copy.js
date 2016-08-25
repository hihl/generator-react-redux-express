/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import path from 'path';
import gaze from 'gaze';
import replace from 'replace';
import Promise from 'bluebird';

async function copy({ watch } = {}) {
  const ncp = Promise.promisify(require('ncp'));

  await Promise.all([
    ncp('src/public', 'dist/public'),
    ncp('src/templates', 'dist/templates'),
    ncp('package.json', 'dist/package.json')
  ]);

  replace({
    regex: '"start".*',
    replacement: '"start": "node server.js"',
    paths: ['dist/package.json'],
    recursive: false,
    silent: false,
  });

  if (watch) {
    const watcher = await new Promise((resolve, reject) => {
      gaze(['src/public/*', 'src/templates/*'], (err, val) => err ? reject(err) : resolve(val));
    });
    watcher.on('changed', async file => {
      const relPath = file.substr(path.join(__dirname, '../src').length);
      await ncp(`src/${relPath}`, `dist/${relPath}`);
    });
  }
}

export default copy;
