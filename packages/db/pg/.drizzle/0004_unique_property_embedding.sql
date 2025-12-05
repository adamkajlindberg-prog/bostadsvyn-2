-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS "unique_property_embedding" ON "property_embeddings" ("property_id");