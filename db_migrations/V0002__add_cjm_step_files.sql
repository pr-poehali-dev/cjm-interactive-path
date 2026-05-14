CREATE TABLE t_p25303014_cjm_interactive_path.cjm_step_files (
    id SERIAL PRIMARY KEY,
    step_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    size_bytes INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cjm_files_step ON t_p25303014_cjm_interactive_path.cjm_step_files(step_id);
