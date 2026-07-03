export const CURRENT_INDEXEDDB_VERSION = 67;

export const INDEXEDDB_VERSION_JUMP_NOTE =
  "Lynn Lee's independent refactor baseline starts at Dexie version 67; this repository has no v1-v66 schema history to replay.";

export async function backfillStableIds(tx) {
  await tx.diagrams.toCollection().modify((diagram) => {
    if (!diagram.diagramId) {
      diagram.diagramId = crypto.randomUUID();
    }
  });
  await tx.templates.toCollection().modify((template) => {
    if (!template.templateId) {
      template.templateId = crypto.randomUUID();
    }
  });
}

export function logSeedError(error, env = import.meta.env) {
  if (env.DEV || env.dev) {
    console.error(error);
  }
}
