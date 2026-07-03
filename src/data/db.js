import Dexie from "dexie";
import { templateSeeds } from "./seeds";
import {
  CURRENT_INDEXEDDB_VERSION,
  backfillStableIds,
  logSeedError,
} from "./dbMigration";

export const db = new Dexie("drawDB");

// This independent refactor baseline starts at v67; no v1-v66 schema history exists in this repository.
db.version(CURRENT_INDEXEDDB_VERSION)
  .stores({
    diagrams: "++id, lastModified, loadedFromGistId, diagramId",
    templates: "++id, custom, templateId",
  })
  .upgrade(backfillStableIds);

db.on("populate", (transaction) => {
  transaction.templates.bulkAdd(templateSeeds).catch(logSeedError);
});
