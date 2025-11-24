# 🚀 Mise à jour v2.0 - Dashboard Suiveur d'Énergie

## 📝 Résumé des changements

Cette version transforme complètement le dashboard pour mieux correspondre à un **suiveur d'énergie** (et non un routeur solaire).

---

## ✨ Nouveautés

### 1. 📊 Nouvelles jauges horizontales
- **Avant** : Jauges circulaires complexes
- **Après** : Barres horizontales simples et claires
- Affichage : Nom, Puissance, %, Tension, Courant, Direction

### 2. 📈 Statistiques du jour refondues
**Supprimé** :
- ❌ Production solaire
- ❌ Économies

**Ajouté** :
- ✅ **Consommation totale** (kWh)
- ✅ **Coût estimé** (€)
- ✅ **Puissance moyenne** (W)
- ✅ **Pic de puissance** (W + heure)

### 3. 📉 Graphique d'évolution
- **Graphique ligne** (Chart.js) affichant les 4 points de mesure
- Évolution minute par minute sur la journée
- Tooltips interactifs
- Légende cliquable

### 4. 🎯 KPIs détaillés par point
Pour chaque point (House, WaterHeater, PV, Spare) :
- **Actuel** : Puissance instantanée
- **Consommé** : kWh du jour
- **Moyenne** : Puissance moyenne
- **Pic** : Puissance maximum
- Tension et courant en bas

### 5. 📅 Sélecteur de période
- Boutons : Aujourd'hui / Hier
- Sélecteur de date (calendrier)

---

## 🗂️ Fichiers créés

### Frontend - Nouveaux composants
```
frontend/src/components/
├── HorizontalGauge.jsx    - Jauges horizontales
├── DailyStats.jsx         - Statistiques du jour
├── PowerChart.jsx         - Graphique d'évolution
└── PointKPIs.jsx          - KPIs par point
```

### Backend - Nouvelle route
```
backend/index.js
└── GET /api/history-graph?date=YYYY-MM-DD
```

---

## 🗑️ Fichiers supprimés

```
frontend/src/components/
├── PowerGauge.jsx        - Remplacé par HorizontalGauge
├── StatsCard.jsx         - Remplacé par DailyStats
└── MeasurementTable.jsx  - Remplacé par PowerChart + PointKPIs
```

---

## 🎨 Structure du nouveau dashboard

```
┌─────────────────────────────────────────────────────┐
│  En-tête : Titre + Sélecteur de date                │
├─────────────────────────────────────────────────────┤
│  ⚡ PUISSANCE EN TEMPS RÉEL                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐   │
│  │House     │ │Water     │ │PV        │ │Spare │   │
│  │████ 75%  │ │██ 25%    │ │███ 60%   │ │      │   │
│  │1043 W    │ │0 W       │ │23 W      │ │0 W   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────┘   │
├─────────────────────────────────────────────────────┤
│  📊 STATISTIQUES DU JOUR                             │
│  [Consommation] [Coût] [Moyenne] [Pic]              │
│     15.2 kWh    2.74€    634 W    3200 W            │
├─────────────────────────────────────────────────────┤
│  📈 ÉVOLUTION DE LA PUISSANCE                        │
│  [Graphique ligne avec 4 courbes]                   │
├─────────────────────────────────────────────────────┤
│  🎯 DÉTAILS PAR POINT                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │House    │ │Water    │ │PV       │ │Spare    │  │
│  │Actuel   │ │Actuel   │ │Actuel   │ │Actuel   │  │
│  │Consommé │ │Consommé │ │Consommé │ │Consommé │  │
│  │Moyenne  │ │Moyenne  │ │Moyenne  │ │Moyenne  │  │
│  │Pic      │ │Pic      │ │Pic      │ │Pic      │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Déploiement

### 1. Redémarrer le backend

```bash
cd C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie
docker compose down
docker compose up --build
```

### 2. Redémarrer le frontend

```bash
cd C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie\frontend
npm run dev
```

### 3. Tester avec des données

Envoyez plusieurs mesures (espacées de 1 minute) pour voir le graphique :

```bash
curl -X POST http://localhost:3001/api/measurements -H "Content-Type: application/json" -d @test-data.json
```

Attendez 1 minute, puis renvoyez (modifier les valeurs pour simuler une évolution).

---

## 📊 Nouvelles routes API

### GET /api/history-graph
Récupère les données pour le graphique + stats

**Query params** :
- `date` (optional) : YYYY-MM-DD (défaut: aujourd'hui)

**Réponse** :
```json
{
  "ok": true,
  "date": "2025-11-24",
  "measurements": [
    {
      "ts": "2025-11-24T10:00:00Z",
      "point_id": 1,
      "point_name": "House",
      "power_w": 1043.93,
      "voltage_v": 230.84,
      "current_a": 4.93,
      "import_kwh_total": 0.37,
      "export_kwh_total": 0
    },
    ...
  ],
  "stats": {
    "totalConsumption": 15.2,
    "estimatedCost": 2.736,
    "averagePower": 634.5,
    "maxPower": 3200,
    "maxPowerTime": "2025-11-24T14:23:00Z",
    "pricePerKwh": 0.18,
    "pointStats": [
      {
        "point_id": 1,
        "point_name": "House",
        "consumption_kwh": 12.5,
        "avg_power": 850,
        "max_power": 3200
      },
      ...
    ]
  }
}
```

---

## 🎯 Fonctionnalités clés

### Temps réel (rafraîchi toutes les 5s)
- ✅ 4 jauges horizontales
- ✅ Puissance instantanée
- ✅ Tension et courant
- ✅ Direction (import/export)

### Historique (sélectionnable par date)
- ✅ Graphique d'évolution minute par minute
- ✅ Stats globales du jour
- ✅ KPIs détaillés par point

### UX
- ✅ Design moderne et épuré
- ✅ Responsive (mobile/tablette/desktop)
- ✅ Couleurs cohérentes par point
- ✅ Navigation simple (Aujourd'hui/Hier/Date)

---

## 🐛 Dépannage

### Le graphique est vide
- Vérifiez qu'il y a des données dans la BDD pour la date sélectionnée
- Envoyez plusieurs mesures avec `test-data.json`

### Les stats sont à 0
- Normal si aucune donnée enregistrée
- Laissez l'ESP32 envoyer des données pendant quelques minutes

### Erreur Chart.js
- Vérifiez que Chart.js est bien installé : `npm list chart.js`
- Si non : `npm install chart.js react-chartjs-2`

---

## 📈 Prochaines améliorations possibles

- [ ] Export CSV des données
- [ ] Comparaison de plusieurs jours
- [ ] Alertes sur seuils de puissance
- [ ] Vue semaine/mois (graphiques agrégés)
- [ ] Intégration WebSocket pour mises à jour en direct

---

**Version** : 2.0.0  
**Date** : 24 novembre 2025  
**Projet** : SuiveurEnergie Dashboard

