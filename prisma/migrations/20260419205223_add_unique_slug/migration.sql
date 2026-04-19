/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Gist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gist_slug_key" ON "Gist"("slug");
