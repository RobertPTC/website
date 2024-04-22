CREATE TABLE moment (
    moment_id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date TEXT NOT NULL,
    moment TEXT NOT NULL,
    journalist_id UUID NOT NULL REFERENCES journalist (journalist_id)
);