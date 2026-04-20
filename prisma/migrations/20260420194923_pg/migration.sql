-- CreateTable
CREATE TABLE "Gist" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "filename" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "gistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("gistId","filename")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "gistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gist_slug_key" ON "Gist"("slug");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_gistId_fkey" FOREIGN KEY ("gistId") REFERENCES "Gist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_gistId_fkey" FOREIGN KEY ("gistId") REFERENCES "Gist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
