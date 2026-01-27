import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"

export default defineConfig({
  name: "brandson-studio",
  title: "Brandson Media CMS",
  projectId: "w5a4azh9",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})

