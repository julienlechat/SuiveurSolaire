# Changelog - SuiveurEnergie Dashboard

## Version 1.0.0 - Première version complète

### 🎨 Personnalisation de l'interface

#### Renommage du projet
- ✅ "Ekonity" → "SuiveurEnergie" partout dans l'interface
- ✅ Titre de la page mis à jour
- ✅ Version passée à v1.0.0

#### Noms dynamiques des points de mesure
- ✅ Suppression du mapping hardcodé `POINT_CONFIG`
- ✅ Utilisation directe des noms depuis la table `measurement_point`
- ✅ Affichage automatique de : `House`, `WaterHeater`, `PV`, `Spare`
- ✅ Ajout de la description sous chaque jauge (ex: "Module 1 - Channel 2")

#### Système de couleurs intelligent
- ✅ Attribution automatique des couleurs par ID de point
- ✅ Palette de 6 couleurs (bleu, rouge, orange, vert, violet, rose)
- ✅ Puissance maximale suggérée selon le type de point :
  - Maison/Logement : 5000W
  - Chauffe-eau : 3000W
  - Panneaux solaires (PV) : 3000W
  - Par défaut : 3000W

### 📊 Nouveau tableau d'historique

#### Route backend `/api/recent-measurements`
- ✅ Récupère les mesures récentes (dernières heures)
- ✅ Paramètres configurables :
  - `limit` : nombre max de mesures (défaut: 100, max: 500)
  - `hours` : nombre d'heures d'historique (défaut: 1, max: 24)
- ✅ Retourne toutes les mesures avec leurs points de mesure associés

#### Composant `MeasurementTable`
- ✅ Tableau moderne et responsive
- ✅ **Tri dynamique** sur toutes les colonnes :
  - Timestamp
  - Point de mesure
  - Puissance (W)
  - Tension (V)
  - Courant (A)
  - Import/Export (kWh)
- ✅ **Filtrage par point de mesure** (dropdown)
- ✅ Colonnes affichées :
  - 📅 Timestamp (formaté DD/MM HH:MM:SS)
  - 📍 Point de mesure (nom + module/channel)
  - ⚡ Puissance (W) - en orange si > 0
  - 🔌 Tension (V)
  - 💡 Courant (A)
  - 🔄 Direction (badge vert Export / rouge Import)
  - 📥 Import cumulé (kWh)
  - 📤 Export cumulé (kWh)
- ✅ Hover effect sur les lignes
- ✅ Compteur de mesures affichées

#### Intégration dans le dashboard
- ✅ Section dédiée sous les statistiques du jour
- ✅ Sélecteur de période (1h, 3h, 6h, 12h, 24h)
- ✅ Rafraîchissement automatique toutes les 30 secondes
- ✅ Spinner de chargement

### 🔄 Améliorations générales

#### API Frontend
- ✅ Nouvelle fonction `fetchRecentMeasurements(limit, hours)`
- ✅ Code organisé et documenté

#### Expérience utilisateur
- ✅ Temps de chargement optimisés
- ✅ Interface fluide et réactive
- ✅ Design cohérent avec le reste du dashboard

---

## 🚀 Utilisation

### Démarrer le dashboard

**Backend + DB :**
```bash
cd C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie
docker compose up
```

**Frontend :**
```bash
cd C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie\frontend
npm run dev
```

Dashboard accessible sur : **http://localhost:5173**

### Tester avec des données

```bash
curl -X POST http://localhost:3001/api/measurements ^
  -H "Content-Type: application/json" ^
  -d @test-data.json
```

---

## 📁 Fichiers modifiés/créés

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── MeasurementTable.jsx    [NOUVEAU] Tableau d'historique
│   │   ├── PowerGauge.jsx          [EXISTANT]
│   │   ├── Sidebar.jsx             [MODIFIÉ] Renommage Ekonity → SuiveurEnergie
│   │   └── StatsCard.jsx           [EXISTANT]
│   ├── App.jsx                     [MODIFIÉ] Noms dynamiques + tableau
│   └── api.js                      [MODIFIÉ] Nouvelle route
├── index.html                      [MODIFIÉ] Titre
└── postcss.config.js               [NOUVEAU] Config Tailwind
```

### Backend
```
backend/
└── index.js                        [MODIFIÉ] Route /api/recent-measurements
```

### Documentation
```
SuiveurEnergie/
├── CHANGELOG.md                    [NOUVEAU] Ce fichier
├── SETUP.md                        [MODIFIÉ]
└── test-data.json                  [NOUVEAU] Données de test
```

---

## 🎯 Prochaines évolutions possibles

- [ ] Graphiques historiques avec Chart.js
- [ ] Export des données (CSV, Excel)
- [ ] Pagination du tableau (si > 500 mesures)
- [ ] Recherche textuelle dans le tableau
- [ ] Alertes/notifications (seuils de puissance)
- [ ] WebSocket pour mises à jour temps réel
- [ ] Mode sombre
- [ ] Configuration des couleurs par point en base de données

