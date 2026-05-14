CREATE TABLE t_p25303014_cjm_interactive_path.cjm_step_links (
    id SERIAL PRIMARY KEY,
    step_id INTEGER NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p25303014_cjm_interactive_path.cjm_step_images (
    id SERIAL PRIMARY KEY,
    step_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cjm_links_step ON t_p25303014_cjm_interactive_path.cjm_step_links(step_id);
CREATE INDEX idx_cjm_images_step ON t_p25303014_cjm_interactive_path.cjm_step_images(step_id);
