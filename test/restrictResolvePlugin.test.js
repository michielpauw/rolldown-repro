import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";
import { rolldown } from "rolldown";
import { rollup } from "rollup";
import { expect } from 'chai';

function resolvePath(...name) {
  return path.resolve(process.cwd(), "test", "fixtures", "project-a", ...name);
}

const resolvedIds = {
  rollup: {},
  rolldown: {},
};

function incorrectIdPlugin(rollupName) {
  return {
    name: "incorrect-id",
    async resolveId(id, importer) {
      const resolved = await this.resolve(id, importer, { skipSelf: true });

      // console.log("id", id);
      // console.log("importer", importer);
      // console.log("resolved", resolved.id);
      // console.log("");

      // if (path.isAbsolute(id) && id !== resolved.id) {
      //   console.error(
      //     `\nResolve error in ${rollupName}\nExpected: "${id}"\nActual: "${resolved.id}"\n\nImporting from ${importer}`
      //   );
      // }

      const resolveIdentifier = `${id}-${importer}`;
      resolvedIds[rollupName][resolveIdentifier] = {
        id,
        importer,
        resolved: resolved.id,
      };

      return null;
    },
  };
}

function getPlugins(rollupName) {
  return [incorrectIdPlugin(rollupName), nodeResolve()];
}

describe("combined", () => {
  it("should resolve IDs in the same way between Rollup and Rolldown", async () => {
    console.log("ROLLUP");
    await rollup({
      input: resolvePath("app.js"),
      plugins: getPlugins("rollup"),
    });

    console.log("ROLLDOWN");
    const bundle = await rolldown({
      input: resolvePath("app.js"),
      plugins: getPlugins("rolldown"),
    });
    await bundle.generate();

    Object.values(resolvedIds['rollup']).forEach((upId) => {
      const result = Object.values(resolvedIds['rolldown']).find(
        (downId) => upId.id === downId.id && upId.importer === downId.importer
      );
      if (result.resolved !== upId.resolved) {
        console.log("ROLLUP")
        console.log(upId);
        console.log("ROLLDOWN")
        console.log(result);
      }
    });
  });
});
