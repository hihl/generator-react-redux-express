/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import run from './run';

async function dist() {
  process.argv.push('--release');
  await run(require('./build'));
}

export default dist;
