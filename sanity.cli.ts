import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

/**
 * Sanity CLI config — used by `npx sanity` commands (dataset export/import,
 * schema deploy, etc.). Reads the same env vars as the Studio.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
})
