ALTER TABLE moment RENAME COLUMN date TO date_string;
ALTER TABLE moment ADD COLUMN IF NOT EXISTS month INTEGER NOT NULL;
ALTER TABLE moment ADD COLUMN IF NOT EXISTS date INTEGER NOT NULL;
ALTER TABLE moment ADD COLUMN IF NOT EXISTS year INTEGER NOT NULL;
ALTER TABLE moment ADD COLUMN IF NOT EXISTS score NUMERIC NOT NULL DEFAULT 0;