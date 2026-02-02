# Guide d'installation CampusEat

## Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)

## Installation

### 1. Installer les dépendances

```bash
cd c:\xampp\htdocs\CampusEat
npm install
```

### 2. Configuration (optionnel)

Copier le fichier `.env.example` vers `.env` si vous souhaitez personnaliser la configuration :

```bash
copy .env.example .env
```

### 3. Lancer l'application en mode développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

### 4. Build pour la production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `build/`

## Déploiement

### Sur serveur Apache (XAMPP)

1. Construire l'application : `npm run build`
2. Copier le contenu du dossier `build/` vers votre dossier web
3. Configurer Apache pour rediriger toutes les routes vers `index.html`

Exemple de configuration `.htaccess` :

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Sur Netlify/Vercel

1. Connecter votre repository Git
2. Configuration de build :
   - Build command: `npm run build`
   - Publish directory: `build`
3. Déployer

## Comptes de test

### Étudiant
- Email: `etudiant@campus.edu`
- Mot de passe: `etudiant123`

### Agent
- Email: `agent@campus.edu`
- Mot de passe: `agent123`

### Administrateur
- Email: `admin@campus.edu`
- Mot de passe: `admin123`

## Fonctionnalités

### Pour les étudiants
- ✅ Consultation du solde de tickets
- ✅ Génération de QR Code personnel
- ✅ Historique des consommations

### Pour les agents
- ✅ Scanner QR Code via caméra
- ✅ Validation en temps réel
- ✅ Historique des validations

### Pour les administrateurs
- ✅ Tableau de bord avec statistiques
- ✅ Graphiques d'évolution
- ✅ Gestion des étudiants et quotas
- ✅ Export PDF et Excel

## Support navigateurs

- Chrome/Edge (recommandé pour le scan QR)
- Firefox
- Safari
- Opera

**Note**: Le scan de QR Code nécessite l'accès à la caméra. Assurez-vous d'autoriser l'accès lorsque demandé.

## Dépannage

### Le scan QR ne fonctionne pas
- Vérifiez que vous utilisez HTTPS ou localhost
- Autorisez l'accès à la caméra dans les paramètres du navigateur
- Essayez un autre navigateur (Chrome recommandé)

### L'application ne démarre pas
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez : `npm install`
- Vérifiez la version de Node.js : `node --version`

### Erreurs de build
- Nettoyez le cache : `npm cache clean --force`
- Réinstallez les dépendances

## Contact et Support

Pour toute question ou problème, contactez l'équipe de développement CampusEat.
