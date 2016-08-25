/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import del from 'del';
import fs from './lib/fs';

async function clean() {
  await del(['.tmp', 'dist/*', '!dist/.git'], { dot: true });
  await fs.makeDir('dist/public');
  await fs.makeDir('dist/templates');
}

export default clean;
