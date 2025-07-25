# Projex CRM – Module Newsletter

Ce projet est un mini CRM interne permettant de centraliser les contributions commerciales.
Il est construit avec **Next.js 15** et **React 19** et s'appuie sur **Ant Design 5** pour l'interface.

## Fonctionnalités principales

- **Gestion des contributions** : création, édition et archivage avec informations de contact, organisation, secteur et qualification.
- **Éditeur riche** grâce à **Tiptap** pour rédiger le compte-rendu.
- **Workflow par rôles** : contributeurs, validateurs et administrateurs.
- **Module Newsletter** :
  - filtres par période et contributeurs,
  - graphiques de suivi (donut, ligne, histogramme),
  - tableau de contributions en attente avec export Word,
  - statistiques de participation.
- **Authentification** via Directus et récupération des données via **@tanstack/react-query**.

## Structure du projet

- `src/app` – Pages et route groups Next.js. Le dossier `'(protected)'` est protégé par `ProtectedLayout`.
- `src/components` – Composants réutilisables avec leurs fichiers SCSS associés.
- `src/hooks` – Hooks React Query (ex. `useContributions`, `useCreateContribution`).
- `src/lib` – Utilitaires comme `auth-context.tsx` et `directus.ts`.
- `models` – Types générés à partir du schéma Directus.
- `public` – Ressources statiques (logo, images).

## Prérequis

- Node.js 18 ou supérieur
- Une instance Directus accessible
- Les variables d'environnement suivantes :
  - `NEXT_PUBLIC_DIRECTUS_URL` – URL de l'API Directus
  - `NEXT_PUBLIC_ADMIN_ROLE_ID` – identifiant du rôle administrateur
  - `NEXT_PUBLIC_VALIDATOR_ROLE_ID` – identifiant du rôle validateur
  - `NEXT_PUBLIC_CONTRIBUTOR_ROLE_ID` - identifiant du rôle contributeur

## Installation et lancement

```bash
npm install
npm run dev
```

Avant de proposer une modification, exécutez :

```bash
npm run lint
```

Pour générer la version de production :

```bash
npm run build
```

## Licence

Projet fourni à titre d'exemple pédagogique.
