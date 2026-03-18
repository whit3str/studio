# 🔴 PokéLearn Quest

**PokéLearn Quest** est une application web interactive conçue pour aider les dresseurs à maîtriser les 151 premiers Pokémon de la région de Kanto. Apprenez leurs numéros, leurs noms et leurs types grâce à des outils d'étude et des quiz stimulants.

## 🚀 Fonctionnalités

- **📖 Mode Étude** : Explorez le Pokédex complet avec filtrage par type et recherche dynamique.
- **🧠 Quiz des Numéros** : Retrouvez le numéro Pokédex à partir de l'image ou du nom.
- **🏆 Quiz des Noms** : Identifiez le Pokémon correspondant à un numéro donné.
- **🤖 Indices IA (Genkit)** : Obtenez des indices contextuels générés par l'IA du Professeur Chen si vous séchez.
- **⏱️ Mode Chrono** : Testez vos réflexes avec un compte à rebours ajustable selon la difficulté.
- **🌍 Multi-langue** : Support complet du Français et de l'Anglais.
- **📱 PWA Ready** : Installable sur Android et iOS comme une application native.

## 🛠️ Stack Technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **UI & Style** : [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **IA** : [Firebase Genkit](https://firebase.google.com/docs/genkit) + Google Gemini
- **Conteneurisation** : [Docker](https://www.docker.com/) (Build multi-étapes optimisé)
- **CI/CD** : [GitHub Actions](https://github.com/features/actions) vers GitHub Container Registry (GHCR)

## 📦 Installation Locale

1. **Cloner le dépôt** :
   ```bash
   git clone <votre-repo-url>
   cd pokelearn-quest
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Variables d'environnement** :
   Créez un fichier `.env.local` et ajoutez votre clé API Google pour Genkit :
   ```env
   GOOGLE_GENAI_API_KEY=votre_cle_ici
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

## 🐳 Déploiement Docker

L'application est prête pour la production via Docker.

**Via Docker Compose** :
```bash
docker-compose up -d
```

**Construction manuelle de l'image** :
```bash
docker build -t pokelearn-quest .
docker run -p 3000:3000 pokelearn-quest
```

## 🤖 GitHub Actions

Le projet inclut un workflow CI/CD (`.github/workflows/ci.yml`) qui :
1. Teste et construit l'application à chaque Push.
2. Publie automatiquement une image Docker sur **GHCR (GitHub Container Registry)** lors d'un push sur la branche `main`.

---
*Développé avec ❤️ pour les futurs Maîtres Pokémon.*