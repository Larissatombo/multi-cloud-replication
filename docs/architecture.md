# 📐 Architecture et Choix Techniques

> Projet M2 — Multi-Cloud Replication  
> Auteure : Etudiante M2 — ESP Antsiranana

---

## 1. Vue d'ensemble de l'architecture

Le système repose sur une architecture **Master-Slave** avec un nœud principal (AWS) et deux réplicas (GCP, Azure), tous simulés via Docker sur une machine locale.

```
Client (Postman / Navigateur)
        │
        ▼
┌───────────────────┐
│   API Node.js     │  ← Point d'entrée unique
│   Express :3000   │
└────────┬──────────┘
         │
  ┌──────▼──────────────────────────────┐
  │         Logique de réplication       │
  │  1. Écriture sur AWS (master)        │
  │  2. Réplication vers GCP + Azure     │
  └──────┬─────────────┬────────────────┘
         │             │
   ┌─────▼────┐   ┌────▼────┐   ┌──────────┐
   │ AWS:5433 │   │GCP:5434 │   │Azure:5435│
   │ Master   │   │Réplica 1│   │Réplica 2 │
   └──────────┘   └─────────┘   └──────────┘
```

---

## 2. Choix techniques justifiés

### Base de données : PostgreSQL 15
- Standard de l'industrie, robuste et fiable
- Support natif des contraintes UNIQUE et des conflits (ON CONFLICT)
- Compatible avec tous les vrais clouds (AWS RDS, Cloud SQL GCP, Azure Database)

### API : Node.js + Express
- Léger, rapide, parfait pour une API REST
- Gestion asynchrone native (async/await) idéale pour les opérations multi-bases
- Large écosystème npm

### Conteneurisation : Docker + Docker Compose
- Simule fidèlement un environnement multi-cloud
- Reproductible sur n'importe quelle machine
- Chaque conteneur = un cloud isolé avec son propre réseau et stockage

### Tests : Jest + Supertest
- Jest : framework de test JavaScript le plus populaire
- Supertest : permet de tester une API HTTP sans la démarrer réellement

### CI/CD : GitHub Actions
- Intégré directement dans GitHub (aucun outil externe)
- Gratuit pour les projets publics
- Pipeline automatique : Tests → Build → Déploiement

---

## 3. Stratégie de réplication

**Type choisi : Réplication synchrone applicative**

À chaque insertion via l'API :
1. L'enregistrement est d'abord écrit sur le master (AWS)
2. Si le master répond avec succès, la même donnée est envoyée à GCP puis Azure
3. En cas d'échec d'un réplica, l'opération continue et l'erreur est loggée
4. Un endpoint `/consistency` permet de vérifier la cohérence à tout moment

**Avantages de cette approche :**
- Simple à comprendre et à maintenir
- Pas de dépendance à des outils de réplication tiers
- Facilement extensible pour ajouter d'autres clouds

**Limites (et solutions possibles) :**
- Pas de réplication en temps réel des suppressions/mises à jour → à implémenter en V2
- En cas de panne réseau, les réplicas peuvent être désynchronisés → endpoint `/consistency` pour détecter

---

## 4. Diagramme de séquence (POST /users)

```
Client          API           AWS(Master)      GCP          Azure
  │              │                │              │              │
  │─POST /users─▶│                │              │              │
  │              │──INSERT───────▶│              │              │
  │              │◀──OK (user)────│              │              │
  │              │──INSERT──────────────────────▶│              │
  │              │◀──OK───────────────────────────│              │
  │              │──INSERT────────────────────────────────────▶│
  │              │◀──OK────────────────────────────────────────│
  │◀─201 Created─│                │              │              │
```
