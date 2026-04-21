CREATE TABLE IF NOT EXISTS utilisateurs (
    id        SERIAL PRIMARY KEY,
    nom       VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO utilisateurs (nom, email) VALUES
    ('Alice Dupont', 'alice@example.com'),
    ('Bob Martin',   'bob@example.com'),
    ('Clara Noel',   'clara@example.com')
ON CONFLICT (email) DO NOTHING;

DO $$ BEGIN
  RAISE NOTICE 'Base de données initialisée avec succès !';
END $$;
