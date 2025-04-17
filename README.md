# Repro

## How to reproduce

Run `npm test` several times, it doesn't always fail, but eventually it will.

![issue](./issue.png)

## Creating npm dependency tree

```
cd test/fixtures/project-a
npm ls --all
```

![dep tree](./npm-dependency-tree.png)

## Creating a module graph visualization

```
node graph.js
```

![module graph](./module-graph.png)