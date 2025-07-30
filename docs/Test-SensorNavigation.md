# Test de Navigation avec Capteurs

Pour tester la nouvelle fonctionnalité de navigation avec capteurs, vous pouvez :

## 1. Accès Direct par URL
Accédez à l'URL suivante dans votre navigateur mobile :
```
http://localhost:5173/sensor-navigate/Porte1ToAmphitheatre
```

## 2. Test des Fonctionnalités

### Prérequis
- Utiliser un smartphone (iOS/Android)
- Navigateur compatible (Safari, Chrome Mobile)
- Autoriser l'accès aux capteurs de mouvement

### Étapes de Test
1. Ouvrez la page sur votre smartphone
2. Cliquez sur "Activer les capteurs"
3. Accordez les permissions demandées
4. Testez les mouvements :
   - Penchez le téléphone vers l'avant → Accélération
   - Penchez vers l'arrière → Ralentissement
   - Inclinez à gauche/droite → Navigation dans la vidéo
   - Secouez le téléphone → Pause/lecture

### Indicateurs Visuels
- Barre de statut affichant l'état des capteurs
- Icône de vitesse avec emoji correspondant
- Instructions d'utilisation intégrées

## 3. Comparaison avec les Autres Modes

### Navigation Standard (`/navigate/:id`)
- Contrôle par boutons uniquement
- Navigation étape par étape avec images

### Navigation Vidéo (`/video-navigate/:id`)
- Contrôle manuel de la vidéo
- Boutons de vitesse prédéfinis

### Navigation Capteurs (`/sensor-navigate/:id`)
- Contrôle par mouvement du téléphone
- Expérience immersive et intuitive

## 4. URLs de Test Disponibles

```bash
# Navigation standard
/navigate/Porte1ToAmphitheatre

# Navigation vidéo
/video-navigate/Porte1ToAmphitheatre

# Navigation capteurs (NOUVEAU)
/sensor-navigate/Porte1ToAmphitheatre
```

## 5. Debugging

Si les capteurs ne fonctionnent pas :
1. Vérifiez que vous êtes sur un appareil mobile
2. Assurez-vous que les permissions sont accordées
3. Rechargez la page si nécessaire
4. Consultez la console pour les erreurs

## 6. Personnalisation

Les seuils peuvent être ajustés dans le code :
```typescript
const TILT_THRESHOLD = 15; // Sensibilité inclinaison
const SHAKE_THRESHOLD = 15; // Sensibilité secousse
const ROTATION_THRESHOLD = 30; // Sensibilité rotation
```
