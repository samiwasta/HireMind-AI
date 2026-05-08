import { createUploadthing } from "uploadthing/server";

import type { FileRouter } from "uploadthing/types";

const f = createUploadthing();

export const ourFileRouter = {
  resume: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => {
      void file.url;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
