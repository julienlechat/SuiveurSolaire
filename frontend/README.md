# Frontend Ekonity - Dashboard énergétique

Dashboard React pour visualiser les données du projet SuiveurEnergie.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
npm install
```

### Lancement en développement

```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du dossier frontend :

```env
# URL de l'API backend (optionnel)
VITE_API_BASE_URL=http://localhost:3001

# Intervalle de rafraîchissement en millisecondes (par défaut: 5000)
VITE_REFRESH_MS=5000
```

Si `VITE_API_BASE_URL` n'est pas défini, le frontend déduira automatiquement l'URL du backend en utilisant le port 3001.

## 📊 Fonctionnalités

### 1. Jauges de puissance en temps réel
- 4 jauges circulaires affichant la puissance instantanée de chaque pince
- Affichage de la tension et du courant
- Indication du sens (import/export)
- Mise à jour automatique toutes les 5 secondes

### 2. Statistiques du jour
- Coût journalier estimé
- Consommation totale (kWh)
- Production solaire (kWh)
- Économies réalisées

### 3. Interface moderne
- Design inspiré de l'ancien dashboard Ekonity
- Sidebar avec navigation
- Indicateur de connexion en temps réel
- Responsive (adapté mobile/tablette/desktop)

## 🎨 Technologies utilisées

- **React 19** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Graphiques (pour évolutions futures)

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── PowerGauge.jsx   # Jauge circulaire de puissance
│   ├── Sidebar.jsx      # Barre latérale
│   └── StatsCard.jsx    # Carte de statistiques
├── api.js               # Fonctions d'appel API
├── App.jsx              # Composant principal
├── index.css            # Styles globaux + Tailwind
└── main.jsx             # Point d'entrée
```

## 🔌 API Backend

Le frontend communique avec le backend via les endpoints suivants :

- `GET /api/latest` - Récupère les dernières mesures de toutes les pinces
- `GET /api/daily-stats?date=YYYY-MM-DD` - Récupère les statistiques du jour

## 🎯 Prochaines évolutions

- [ ] Graphiques historiques (Chart.js)
- [ ] WebSocket pour les mises à jour temps réel
- [ ] Sélecteur de date pour historique
- [ ] Export des données (CSV, PDF)
- [ ] Alertes et notifications
- [ ] Mode sombre
