-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS "unique_swestr_interest_rate" ON "riksbank_swestr_interest_rate" ("date");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_swestr_compounded_average" ON "riksbank_swestr_compounded_average" ("date");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_swestr_published_index" ON "riksbank_swestr_published_index" ("date");