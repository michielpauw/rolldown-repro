import { exportToFile } from "@ts-graphviz/node";
import { createModuleGraph } from '@thepassle/module-graph';

const digraphPlugin = {
  name: 'digraph-plugin',
  end(moduleGraph) {
    let digraph = 'digraph {\n';
    for (const [parent, importees] of moduleGraph.graph) {
      digraph += `  "${parent}" -> ${[...importees].map(p => `"${p}"`).join(',')}\n`;
    }
    digraph += '}';

    moduleGraph.digraph = digraph;
  }
}

const moduleGraph = await createModuleGraph('./test/fixtures/project-a/app.js', {
  plugins: [digraphPlugin]
});

await exportToFile(moduleGraph.digraph, {
  format: "png",
  output: "./module-graph.png",
});
