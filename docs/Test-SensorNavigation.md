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

### Étapes de Diagnostic
1. **Ouvrez la console du navigateur** (F12 ou Inspecteur)
2. **Vérifiez les logs** - vous devriez voir :
   - "Requesting sensor permissions..."
   - "iOS device detected..." ou "Android device..."
   - "Enabling sensors..."
   - "Event listeners added"
   - Des logs périodiques des événements capteurs

### Messages d'Erreur Courants
- **"❌ Capteurs non disponibles sur cet appareil"** : Vous n'êtes pas sur un smartphone
- **"❌ Permission refusée"** : L'utilisateur a refusé l'accès aux capteurs
- **"❌ Erreur de permission"** : Problème technique avec les permissions

### Tests de Fonctionnement
1. **Vérifiez que vous êtes sur un appareil mobile**
2. **Assurez-vous que les permissions sont accordées**
3. **Regardez la console pour les logs d'événements** :
   - Motion events : `{ totalAcceleration, x, y, z }`
   - Orientation events : `{ beta, gamma }`
4. **Rechargez la page si nécessaire**
5. **Testez sur différents navigateurs** (Safari iOS, Chrome Android)

### Logs de Debug Attendus
```
Requesting sensor permissions...
iOS device detected, requesting permissions...
Motion permission: granted
Orientation permission: granted
Enabling sensors...
Event listeners added
Checking if sensors are responding...
Motion event: {totalAcceleration: 9.8, x: 0, y: 0, z: -9.8}
Orientation event: {beta: 0, gamma: 0}
```

## 6. Personnalisation

Les seuils peuvent être ajustés dans le code :
```typescript
const TILT_THRESHOLD = 15; // Sensibilité inclinaison
const SHAKE_THRESHOLD = 15; // Sensibilité secousse
const ROTATION_THRESHOLD = 30; // Sensibilité rotation
```
