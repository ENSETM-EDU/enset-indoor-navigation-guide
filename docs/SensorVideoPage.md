# Navigation avec Capteurs - SensorVideoPage

## Description

`SensorVideoPage.tsx` est une nouvelle page de navigation qui utilise les capteurs de mouvement et d'orientation du téléphone pour contrôler la lecture vidéo de manière dynamique. Cette page offre une expérience immersive où l'utilisateur peut contrôler la navigation simplement en bougeant son téléphone.

## Fonctionnalités

### Contrôle par Capteurs

#### Inclinaison (Beta - Avant/Arrière)
- **Pencher vers l'avant** (beta > 15°) : Accélère la vidéo (vitesse x2) ⚡
- **Pencher vers l'arrière** (beta < -15°) : Ralentit la vidéo (vitesse x0.5) 🐌
- **Position neutre** : Vitesse normale (x1) 🚶‍♂️

#### Rotation (Gamma - Gauche/Droite)
- **Incliner à droite** (gamma > 30°) : Avance de 5 secondes dans la vidéo ⏩
- **Incliner à gauche** (gamma < -30°) : Recule de 5 secondes dans la vidéo ⏪

#### Détection de Secousse
- **Mouvement brusque** (accélération > 15 m/s²) : Toggle pause/lecture 🔄
- Protection anti-rebond de 1 seconde pour éviter les déclenchements multiples

### Interface Utilisateur

#### Statut des Capteurs
- Affichage en temps réel du statut des capteurs
- Indicateur de vitesse actuelle avec emoji approprié
- Instructions d'utilisation intégrées

#### Contrôles
- **Bouton d'activation des capteurs** : Demande les permissions nécessaires
- **Contrôles manuels** : Boutons play/pause disponibles même avec les capteurs activés
- **Désactivation** : Bouton pour désactiver les capteurs et revenir au contrôle manuel

## API Utilisées

### DeviceMotionEvent
- Détection des secousses via l'accéléromètre
- Surveillance de l'accélération totale
- Filtrage des faux positifs

### DeviceOrientationEvent
- Lecture des angles d'inclinaison (beta, gamma)
- Contrôle de la vitesse de lecture
- Navigation temporelle dans la vidéo

## Compatibilité

### Permissions
- **iOS 13+** : Demande explicite de permission via `requestPermission()`
- **Android** : Activation automatique des capteurs
- **Navigateurs Desktop** : Fonctionnalité désactivée gracieusement

### Navigateurs Supportés
- Safari iOS 13+
- Chrome Android
- Firefox Android
- Edge Mobile

## Utilisation

### Accès à la Page
La page est accessible via l'URL : `/sensor-navigate/:id`

Exemple : `/sensor-navigate/Porte1ToAmphitheatre`

### Workflow d'Utilisation
1. **Chargement** : La page charge les données du parcours
2. **Modal d'information** : Affichage des détails du trajet
3. **Activation des capteurs** : L'utilisateur clique sur "Activer les capteurs"
4. **Permissions** : Le navigateur demande l'autorisation d'accès aux capteurs
5. **Navigation active** : Contrôle de la vidéo par les mouvements du téléphone

### Instructions pour l'Utilisateur
- Tenir le téléphone en mode portrait
- Effectuer des mouvements lents et contrôlés
- Éviter les mouvements brusques non intentionnels
- Utiliser les contrôles manuels si nécessaire

## Configuration

### Seuils Ajustables
```typescript
const TILT_THRESHOLD = 15; // degrés pour inclinaison
const SHAKE_THRESHOLD = 15; // m/s² pour détection de secousse
const ROTATION_THRESHOLD = 30; // degrés pour rotation
const SEEK_AMOUNT = 5; // secondes pour navigation
const SHAKE_DEBOUNCE = 1000; // ms anti-rebond
```

### Vitesses de Lecture
- **Lente** : 0.5x
- **Normale** : 1.0x
- **Rapide** : 2.0x

## Optimisations

### Performance
- Debouncing des événements de capteurs
- Cache des états pour éviter les recalculs
- Nettoyage automatique des event listeners

### UX/UI
- Feedback visuel en temps réel
- Messages d'état informatifs
- Transitions fluides entre les modes

### Gestion d'Erreurs
- Fallback vers contrôle manuel si capteurs indisponibles
- Messages d'erreur explicites
- Récupération gracieuse en cas d'échec

## Sécurité et Confidentialité

- Aucune donnée de capteur n'est stockée ou transmise
- Utilisation locale des API de capteurs uniquement
- Respect des politiques de permission des navigateurs

## Développement et Maintenance

### Structure du Code
- Hooks React pour la gestion d'état
- Séparation claire entre logique capteurs et UI
- Composants réutilisables de la NavigationVideoPage

### Tests Recommandés
- Test sur différents appareils iOS/Android
- Vérification des permissions dans différents navigateurs
- Test de performance avec vidéos de différentes tailles

### Améliorations Futures
- Calibration personnalisée des seuils
- Modes de sensibilité (faible, normal, élevé)
- Support des capteurs desktop (souris, clavier)
- Analytics d'utilisation des capteurs
