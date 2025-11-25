# ⚡ Mise à jour : Gestion de la Production Solaire

## 📝 Résumé

Le dashboard distingue maintenant automatiquement les **points de consommation** des **points de production** (panneaux solaires).

---

## ✨ Nouveautés

### 🔍 Détection automatique des points de production

Le système détecte automatiquement qu'un point mesure de la production si son nom contient :
- `PV`
- `Solar` / `Solaire`
- `Production`
- `Photovoltaique`

**Exemple** : Le point `PV` sera automatiquement traité comme production.

---

## 📊 Changements par section

### 1. Jauges horizontales (temps réel)

**Avant** :
- Toutes les jauges affichaient "Import" ou "Export"

**Après** :
- Points de **consommation** : Badge rouge "↓ Import" / vert "↑ Export"
- Points de **production** : Badge jaune "☀️ Production"

### 2. Statistiques du jour

**Ajouté** (si production détectée) :
- 🌟 **Carte Production** (jaune)
  - Production totale (kWh)
  - Revenu estimé (€) basé sur 0.13€/kWh

**Résultat** :
- 4 cartes sans production : Consommation, Coût, Moyenne, Pic
- 5 cartes avec production : Consommation, Coût, Production, Moyenne, Pic

### 3. Graphique d'évolution

**Pas de changement** : Le graphique affiche la puissance (positive ou négative) de tous les points.

### 4. KPIs détaillés par point

**Pour les points de consommation** :
- 📥 **CONSOMMÉ** (violet) : kWh importés

**Pour les points de production** :
- ☀️ **PRODUIT** (jaune) : kWh exportés

---

## 🔧 Backend : Nouvelles données

### Route `/api/history-graph`

**Nouvelles propriétés dans la réponse** :

```json
{
  "stats": {
    "totalConsumption": 15.2,      // kWh consommés
    "totalProduction": 8.5,        // 🆕 kWh produits
    "estimatedCost": 2.74,         // € coût
    "estimatedRevenue": 1.11,      // 🆕 € revenu
    "pricePerKwh": 0.18,           // € prix achat
    "sellPricePerKwh": 0.13,       // 🆕 € prix vente
    "pointStats": [
      {
        "point_id": 3,
        "point_name": "PV",
        "is_production": true,       // 🆕 Indique production
        "consumption_kwh": 0,
        "production_kwh": 8.5,       // 🆕 Production du point
        "avg_power": 850,
        "max_power": 2800
      }
    ]
  }
}
```

---

## 📈 Exemple visuel

### Avec 4 pinces dont 1 production (PV)

```
┌─────────────────────────────────────────────────────┐
│  JAUGES TEMPS RÉEL                                   │
│  [House: 1043W ↓Import] [Water: 0W] [PV: 850W ☀️]  │
├─────────────────────────────────────────────────────┤
│  STATS DU JOUR (5 cartes)                            │
│  [Conso: 15.2kWh] [Coût: 2.74€] [Prod: 8.5kWh]     │
│  [Moyenne: 634W] [Pic: 3200W]                       │
├─────────────────────────────────────────────────────┤
│  GRAPHIQUE                                           │
│  [4 courbes colorées avec gradients]                │
├─────────────────────────────────────────────────────┤
│  KPIs PAR POINT                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │House    │ │Water    │ │PV       │ │Spare    │  │
│  │Consommé │ │Consommé │ │PRODUIT  │ │Consommé │  │
│  │ 12.5kWh │ │  2.7kWh │ │  8.5kWh │ │    0kWh │  │
│  │ (violet)│ │ (violet)│ │ (jaune) │ │ (violet)│  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Comment tester

### 1. Redémarrer le backend

```bash
cd C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie
docker compose down
docker compose up --build
```

### 2. Redémarrer le frontend

```bash
cd C:\Users\MON-PC\Documents\DOCKER\SuiveurEnergie\frontend
# Ctrl+C pour arrêter, puis :
npm run dev
```

### 3. Tester avec des données de production

Modifiez `test-data.json` pour que le point PV (module2/channel1) ait de la production :

```json
{
  "module2": {
    "channel1": {
      "voltage": 230.5,
      "current": 3.5,
      "power": -806,
      "consumption": 0,
      "powerFactor": 0.92,
      "production": 2.456,
      "direction": true,
      "va": 806
    }
  }
}
```

Puis envoyez :

```bash
curl -X POST http://localhost:3001/api/measurements -H "Content-Type: application/json" -d "@test-data.json"
```

---

## 💡 Comportement intelligent

### Détection automatique

✅ Le nom du point est `PV` → Détecté comme **production**  
✅ Le nom du point est `House` → Détecté comme **consommation**  
✅ Le nom du point est `Solar Panel` → Détecté comme **production**  
✅ Le nom du point est `WaterHeater` → Détecté comme **consommation**

### Couleurs adaptatives

- **Consommation** : Cartes violettes/bleues
- **Production** : Cartes jaunes/dorées
- **Badge** : Jaune avec ☀️ pour production

### Calculs

- **Coût** = Consommation × 0.18€/kWh
- **Revenu** = Production × 0.13€/kWh
- **Total consommation** = Somme des points de consommation uniquement
- **Total production** = Somme des points de production uniquement

---

## 🎯 Avantages

1. ✅ **Distinction claire** entre consommation et production
2. ✅ **Calculs séparés** pour ne pas mélanger les kWh
3. ✅ **Badge visuel** immédiat sur les jauges
4. ✅ **Revenu estimé** affiché pour la production
5. ✅ **Détection automatique** basée sur le nom (pas de config manuelle)

---

## 🔮 Évolutions possibles

- [ ] Calcul de l'autoconsommation (production - export)
- [ ] Taux d'autoconsommation (%)
- [ ] Graphique production vs consommation superposé
- [ ] Économies réalisées grâce à l'autoconsommation

---

**Version** : 2.1.0  
**Date** : 24 novembre 2025  
**Feature** : Gestion production/consommation

