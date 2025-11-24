# 🚀 Guide de démarrage rapide - SuiveurEnergie

## Prérequis

- Docker et Docker Compose installés
- Node.js installé (pour le développement frontend)

## 📋 Étapes de démarrage

### 1. Démarrer le backend et la base de données

Depuis la racine du projet (`C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie\`) :

```bash
docker compose up --build
```

Cela va démarrer :
- PostgreSQL sur le port `5432`
- L'API Node.js sur le port `3001`

### 2. Vérifier que l'API fonctionne

Ouvrez votre navigateur et allez sur :
- http://localhost:3001/health - Devrait afficher "OK"
- http://localhost:3001/test-db - Devrait afficher la date/heure actuelle

### 3. Démarrer le frontend (mode développement)

**Important** : Ouvrez un nouveau terminal PowerShell et exécutez :

```powershell
cd "C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie\frontend"
npm run dev
```

Le frontend sera accessible sur : **http://localhost:5173**

## 🎯 Accéder au dashboard

Une fois tout démarré, ouvrez votre navigateur sur :

**http://localhost:5173**

Vous devriez voir le dashboard Ekonity avec :
- 4 jauges de puissance en temps réel pour les 4 pinces
- Les statistiques du jour
- Un indicateur de connexion

## 📊 Structure du projet

```
SuiveurEnergie/
├── backend/              # API Node.js + Express
│   ├── index.js          # Point d'entrée de l'API
│   ├── tempoService.js   # Service pour gérer les tarifs Tempo
│   └── Dockerfile
├── frontend/             # Dashboard React
│   ├── src/
│   │   ├── components/   # Composants React (jauges, sidebar, stats)
│   │   ├── App.jsx       # Application principale
│   │   └── api.js        # Appels API
│   └── package.json
└── docker-compose.yml    # Configuration Docker
```

## 🔧 Résolution de problèmes

### Le frontend ne démarre pas

Si vous avez une erreur liée à Node.js, vérifiez votre version :

```bash
node --version
```

Vous devriez avoir Node.js >= 18.

### Erreur de connexion au backend

1. Vérifiez que Docker est bien lancé : `docker ps`
2. Vérifiez les logs : `docker compose logs api`
3. Assurez-vous que le port 3001 n'est pas déjà utilisé

### Pas de données dans le dashboard

C'est normal si vous n'avez pas encore envoyé de données depuis l'ESP32.

Pour tester, vous pouvez envoyer des données manuelles avec curl :

```bash
curl -X POST http://localhost:3001/api/measurements `
  -H "Content-Type: application/json" `
  -d @test-data.json
```

Créez un fichier `test-data.json` avec :

```json
{
  "module1": {
    "channel1": {
      "voltage": 230.5,
      "current": 4.2,
      "power": 968.1,
      "consumption": 1.234,
      "powerFactor": 0.85,
      "production": 0,
      "direction": false,
      "va": 1138.2
    },
    "channel2": {
      "voltage": 230.5,
      "current": 0.5,
      "power": 115.25,
      "consumption": 0.056,
      "powerFactor": 0.95,
      "production": 0,
      "direction": false,
      "va": 121.32
    },
    "frequency": 50.01
  },
  "module2": {
    "channel1": {
      "voltage": 230.5,
      "current": 0,
      "power": 0,
      "consumption": 0,
      "powerFactor": 0,
      "production": 2.456,
      "direction": true,
      "va": 0
    },
    "channel2": {
      "voltage": 230.5,
      "current": 0,
      "power": 0,
      "consumption": 0,
      "powerFactor": 0,
      "production": 0,
      "direction": false,
      "va": 0
    },
    "frequency": 50.00
  }
}
```

## 🎨 Personnalisation

### Modifier les couleurs des jauges

Éditez `frontend/src/App.jsx` et modifiez l'objet `POINT_CONFIG` :

```javascript
const POINT_CONFIG = {
    'House': {
        label: 'Energie Logement',
        color: '#3b82f6',  // Changez cette couleur
        maxPower: 5000
    },
    // ...
};
```

### Changer l'intervalle de rafraîchissement

Créez un fichier `.env` dans le dossier `frontend/` :

```env
VITE_REFRESH_MS=3000  # Rafraîchir toutes les 3 secondes
```

## 📚 Prochaines étapes

1. Configurez votre ESP32 pour envoyer les données à `http://<IP_RASPBERRY>:3001/api/measurements`
2. Ajoutez vos tarifs dans la base de données PostgreSQL
3. Personnalisez le dashboard selon vos besoins

Bon monitoring énergétique ! ⚡

