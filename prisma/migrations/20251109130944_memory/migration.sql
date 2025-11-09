-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "thoughts" TEXT NOT NULL,
    "mood" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);
