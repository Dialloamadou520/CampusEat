# Fonctionnalités CampusEat

## Vue d'ensemble

CampusEat est une solution complète de gestion des tickets de restauration universitaire basée sur la technologie QR Code.

## Fonctionnalités par rôle

### 👨‍🎓 Interface Étudiant

#### Tableau de bord
- **Solde de tickets** : Affichage en temps réel du nombre de tickets disponibles
- **Quota mensuel** : Visualisation du quota alloué et de la consommation
- **Statistiques personnelles** :
  - Repas consommés cette semaine
  - Repas consommés ce mois
  - Tendances de consommation

#### QR Code personnel
- Génération automatique d'un QR Code unique
- Actualisation en temps réel
- Affichage optimisé pour le scan
- Informations d'identification intégrées

#### Historique
- Liste des 10 dernières transactions
- Date et heure de chaque repas
- Restaurant visité
- Statut de validation

### 👮 Interface Agent

#### Scanner QR Code
- **Scan en temps réel** via caméra du dispositif
- **Validation instantanée** des tickets
- **Feedback visuel** :
  - ✅ Succès : Ticket validé
  - ❌ Erreur : Solde insuffisant, étudiant non trouvé, QR invalide

#### Informations de validation
- Nom et ID de l'étudiant
- Tickets restants après validation
- Horodatage précis

#### Statistiques agent
- Nombre de validations aujourd'hui
- Total des validations effectuées
- Liste des 10 dernières validations

#### Historique des validations
- Vue en temps réel des tickets validés
- Nom de l'étudiant
- ID étudiant
- Heure de validation

### 👨‍💼 Interface Administrateur

#### Tableau de bord statistiques
- **Métriques clés** :
  - Repas servis aujourd'hui
  - Repas cette semaine
  - Repas ce mois
  - Nombre d'étudiants actifs

#### Visualisations graphiques
- **Graphique linéaire** : Évolution des repas sur 7 jours
- **Graphique en barres** : Répartition par restaurant
- Données interactives avec tooltips

#### Gestion des étudiants
- **Liste complète** des étudiants
- **Informations affichées** :
  - ID étudiant
  - Nom complet
  - Solde de tickets actuel
  - Quota mensuel
  - Statut (actif/inactif)
- **Tri et filtrage** des données

#### Suivi des transactions
- **Historique complet** de toutes les transactions
- **Détails par transaction** :
  - Date et heure
  - Étudiant concerné
  - Restaurant
  - Agent validateur
- **Recherche et filtrage** avancés

#### Export de données
- **Export PDF** :
  - Rapport des transactions
  - Statistiques détaillées
  - Mise en page professionnelle
- **Export Excel** :
  - Données brutes pour analyse
  - Format compatible avec Excel/LibreOffice
  - Toutes les transactions exportables

## Fonctionnalités techniques

### Sécurité
- ✅ Authentification par email/mot de passe
- ✅ Gestion des sessions
- ✅ Contrôle d'accès basé sur les rôles (RBAC)
- ✅ QR Code avec timestamp pour éviter la fraude
- ✅ Validation côté client

### Performance
- ✅ Chargement rapide des pages
- ✅ Mise en cache locale (localStorage)
- ✅ Optimisation des rendus React
- ✅ Lazy loading des composants

### Responsive Design
- ✅ Interface adaptative pour tous les écrans
- ✅ Support mobile complet
- ✅ Support tablette
- ✅ Interface desktop optimisée
- ✅ Touch-friendly pour les appareils tactiles

### Accessibilité
- ✅ Contraste de couleurs optimisé
- ✅ Navigation au clavier
- ✅ Labels et descriptions appropriés
- ✅ Feedback visuel clair

### Compatibilité
- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Support des navigateurs mobiles

## Technologies utilisées

### Frontend
- **React 18** : Framework JavaScript moderne
- **React Router v6** : Navigation et routing
- **Context API** : Gestion d'état globale

### QR Code
- **qrcode.react** : Génération de QR Codes
- **html5-qrcode** : Scan de QR Codes via caméra

### Visualisation
- **Recharts** : Graphiques interactifs
- **Lucide React** : Icônes modernes

### Export
- **jsPDF** : Génération de PDF
- **jsPDF-AutoTable** : Tableaux dans les PDF
- **xlsx** : Export Excel

### Utilitaires
- **date-fns** : Manipulation de dates

## Évolutions futures possibles

### Court terme
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Multi-langues (FR/EN)
- [ ] Thème sombre

### Moyen terme
- [ ] Application mobile native (React Native)
- [ ] Backend API REST/GraphQL
- [ ] Base de données persistante
- [ ] Système de paiement intégré

### Long terme
- [ ] Intelligence artificielle pour prédictions
- [ ] Intégration avec systèmes universitaires
- [ ] Module de réservation de repas
- [ ] Programme de fidélité

## Avantages de CampusEat

### Pour les étudiants
- ✅ Plus besoin de tickets papier
- ✅ Consultation du solde en temps réel
- ✅ Historique accessible partout
- ✅ Processus rapide et moderne

### Pour les agents
- ✅ Validation rapide et sécurisée
- ✅ Réduction des fraudes
- ✅ Interface simple et intuitive
- ✅ Moins d'erreurs manuelles

### Pour l'administration
- ✅ Statistiques en temps réel
- ✅ Meilleur suivi des consommations
- ✅ Rapports automatisés
- ✅ Réduction des coûts d'impression
- ✅ Données exploitables pour optimisation

### Pour l'environnement
- ✅ Zéro papier
- ✅ Réduction de l'empreinte carbone
- ✅ Solution durable et écologique
