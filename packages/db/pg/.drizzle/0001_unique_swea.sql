-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS "unique_swea" ON "riksbank_swea_observations" ("swea_id", "date");