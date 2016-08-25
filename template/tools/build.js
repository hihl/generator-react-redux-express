/**
 * Created by Zhengfeng Yao on 16/8/24.
 */
import run from './run';
import clean from './clean';
import copy from './copy';
import bundle from './bundle';

async function build() {
  await run(clean);
  await run(copy);
  await run(bundle);
}

export default build;
