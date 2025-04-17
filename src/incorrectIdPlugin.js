import fs from 'fs';

function incorrectIdPlugin(rollupName, config = {}) {
  const resolving = new Set();
  const resolvedIds = [];
  return {
    name: "incorrect-id",
    async resolveId(id, importer) {
      if (resolving.has(importer + id)) {
        return null;
      }
      resolving.add(importer + id);
      const resolved = await this.resolve(id, importer, { skipSelf: true });
      if (!resolved.id.includes(id)) {
        console.log("ERROR ERROR ERROR");
        console.log(`${rollupName}:\nid: ${id};\nresolved: ${resolved.id};\nimporter: ${importer}\n`)
      }
      resolvedIds.push({
        id,
        resolved: resolved.id,
        importer
      })
      fs.writeFileSync(`./test/tmp/${rollupName}-resolved-ids.json`, JSON.stringify(resolvedIds), 'utf-8');
      return null;
    },
  };
}

export { incorrectIdPlugin };
