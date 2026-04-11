-- ============================================================
-- init.sql - Initialisation de la base de données
-- Exécuté automatiquement au démarrage de chaque conteneur
-- Auteur : Etudiante M2 - ESP Antsiranana
-- ============================================================

-- Création de la table utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id        SERIAL PRIMARY KEY,
    nom       VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de quelques données de test
INSERT INTO utilisateurs (nom, email) VALUES
    ('Alice Dupont', 'alice@example.com'),
    ('Bob Martin',   'bob@example.com'),
    ('Clara Noel',   'clara@example.com')
ON CONFLICT (email) DO NOTHING;

-- Confirmation dans les logs Docker
DO $$ BEGIN
  RAISE NOTICE 'Base de données initialisée avec succès !';
END $$;
