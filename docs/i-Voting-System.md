# i-Voting System - Documentation

## Vue d'ensemble

Le système i-Voting est un prototype de vote électronique intégré dans l'application de navigation ENSET. Il comprend trois étapes principales :

1. **Scanner de Carte d'Identité avec OCR**
2. **Vérification Faciale**
3. **Interface de Vote**

## Fonctionnalités

### 1. Scanner de Carte d'Identité (OCR Réel)

**Technologies utilisées :**
- Tesseract.js pour la reconnaissance de texte OCR
- API Camera du navigateur pour la capture d'images
- Support des langues : Anglais, Français, Arabe

**Fonctionnalités :**
- Capture en temps réel via caméra (caméra arrière privilégiée)
- Upload de fichiers image (JPG, PNG)
- Extraction automatique des informations :
  - Nom
  - Prénom  
  - Numéro CIN
  - Fonction (défaut: Employé)
- Barre de progression OCR en temps réel
- Fallback en cas d'échec OCR

**Formats CIN supportés :**
- Format standard : AB123456
- Format numérique : 12345678
- Détection automatique des patterns "CIN:" ou "CARTE:"

### 2. Vérification Faciale (Caméra Réelle)

**Technologies utilisées :**
- API Camera du navigateur
- Canvas HTML5 pour la capture d'images
- Caméra frontale pour selfie

**Fonctionnalités :**
- Capture en temps réel du visage
- Aperçu vidéo avec effet miroir
- Simulation de comparaison faciale (toujours réussie pour le prototype)
- Affichage de la photo capturée vs photo de la carte

### 3. Interface de Vote

**Catégories de vote :**
- **Conseil d'Établissement**
- **Conseil d'Université**

**Sous-catégories :**
- **MC** (Maître de Conférences)
- **MCH** (Maître de Conférences Habilité) 
- **PES** (Professeur d'Enseignement Supérieur)

**Candidats disponibles :**
- Ahmed REBBANI
- Mohammed YOUSSEFI
- Mohammed QBADOU
- Abdessalam BOUSSELHAM
- Azziz DAIF
- Omar BOUATTAN
- Azzedine KHIYAT
- Menssouri KHALIFA

## Architecture Technique

### Composants principaux

1. **IVotingPage.tsx** - Page principale avec gestion des étapes
2. **IDCardScanner.tsx** - Scanner OCR avec caméra
3. **FaceVerification.tsx** - Vérification faciale
4. **VotingInterface.tsx** - Interface de sélection des votes

### Flux de données

```
IDCardScanner → UserInfo → FaceVerification → VotingInterface → Confirmation
```

### Types TypeScript

```typescript
interface UserInfo {
  nom: string;
  prenom: string;
  cin: string;
  fonction: string;
}
```

## Accès au système

1. Aller sur la page d'accueil
2. Cliquer sur "Services"
3. Sélectionner "i-Voting"
4. Suivre les étapes :
   - Scanner la carte d'identité
   - Vérification faciale
   - Voter
   - Confirmation

## Permissions requises

- **Caméra** : Nécessaire pour scanner la carte et capturer le visage
- **Stockage local** : Pour les images temporaires

## Limitations du prototype

- La vérification faciale est simulée (toujours réussie)
- Les votes ne sont pas persistés dans une base de données
- OCR peut avoir des difficultés avec des images de mauvaise qualité
- Nécessite HTTPS pour l'accès caméra en production

## Améliorations futures

1. Intégration avec une vraie API de reconnaissance faciale
2. Base de données pour la persistance des votes
3. Système d'authentification avancé
4. Amélioration de la précision OCR
5. Support de plus de formats de cartes d'identité
6. Interface d'administration pour la gestion des élections

## URL de test

```
http://localhost:5174/i-voting
```

Le système est maintenant prêt pour les tests avec de vraies fonctionnalités de caméra et OCR !
