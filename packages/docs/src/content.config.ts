import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { autoSidebarLoader } from "starlight-auto-sidebar/loader";
import { autoSidebarSchema } from "starlight-auto-sidebar/schema";

import { generateDocsLoader } from "./loaders/docs-loader.js";

export const collections = {
  autoSidebar: defineCollection({
    loader: autoSidebarLoader(),
    schema: autoSidebarSchema(),
  }),
  docs: defineCollection({
    loader: generateDocsLoader(),
    schema: docsSchema(),
  }),
};
