CREATE TABLE blog_comment(
    blog_comment_id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date TEXT NOT NULL,
    text TEXT NOT NULL,
    responds_to UUID NOT NULL, 
    journalist_id UUID NOT NULL REFERENCES journalist (journalist_id)
);