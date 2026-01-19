import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "w5a4azh9",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
