import path from 'path';

function resolvePath(...name) {
  return path.resolve(process.cwd(), 'test', 'fixtures', 'project-a', ...name);
}

export { resolvePath };
