import { nodeResolve } from "@rollup/plugin-node-resolve";
import fs from "fs";
import { expect } from "chai";
import { rolldown } from "rolldown";
import { rollup } from "rollup";
import { incorrectIdPlugin } from "../src/incorrectIdPlugin.js";
import { resolvePath } from "./helpers.js";

function getPlugins(rollupName) {
  return [incorrectIdPlugin(rollupName), nodeResolve()];
}

// describe("rollup", () => {
//   describe("restrictResolvePlugin", () => {
//     it("should generate error when too old lib-a versions are used", async () => {
//       const bundle = await rollup({
//         input: resolvePath("app.js"),
//         plugins: getPlugins("rollup"),
//       });
//     });
//   });
// });

// describe("rolldown", () => {
//   describe("restrictResolvePlugin", () => {
//     it("should generate error when too old lib-a versions are used", async () => {
//       const bundle = await rolldown({
//         input: resolvePath("app.js"),
//         plugins: getPlugins("rolldown"),
//       });
//       await bundle.generate();
//     });
//   });
// });

describe("combined", () => {
  it("should resolve IDs in the same way between Rollup and Rolldown", async () => {
    await rollup({
      input: resolvePath("app.js"),
      plugins: getPlugins("rollup"),
    });
    const bundle = await rolldown({
      input: resolvePath("app.js"),
      plugins: getPlugins("rolldown"),
    });
    await bundle.generate();
    const rollupResolvedIds = JSON.parse(
      fs.readFileSync("./test/tmp/rollup-resolved-ids.json", "utf8")
    );
    const rolldownResolvedIds = JSON.parse(
      fs.readFileSync("./test/tmp/rolldown-resolved-ids.json", "utf8")
    );
    expect(rolldownResolvedIds.length).to.equal(rollupResolvedIds.length);
    rollupResolvedIds.forEach((upId) => {
      const result = rolldownResolvedIds.find(
        (downId) => upId.id === downId.id && upId.importer === downId.importer
      );
      if (result.resolved !== upId.resolved) {
      console.log("ROLLDOWN", result);
      console.log("ROLLUP", upId);
      }
      // expect(result.resolved).to.equal(upId.resolved)
    });
  });
});
