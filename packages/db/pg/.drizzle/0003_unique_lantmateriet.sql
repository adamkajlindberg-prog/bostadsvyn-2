-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS "unique_lantmateriet" ON "lantmateriet" ("category_id", "entry_id");