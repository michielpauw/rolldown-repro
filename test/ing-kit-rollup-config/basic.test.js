import { rollup } from 'rollup';
import { expect } from 'chai';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { resolvePath, findModule } from '../helpers.js';

describe('ing-kit-rollup-config', () => {
  let bundle;

  before(async () => {
    bundle = await rollup({
      input: resolvePath('app.js'),
      plugins: [nodeResolve()],
    });
  });

  it('basic', () => {
    const module = findModule(bundle, 'app.js');
    expect(module.dependencies.length).to.equal(4);
    expect(module.dependencies[0]).to.equal(
      resolvePath('node_modules', 'ing-web', 'index.js'),
    );
  });
});
