-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS "unique_vintage" ON "riksbank_vintages" ("monetary_policy_id", "policy_round_end_dtm", "policy_round");