# 🎯 Fonctionnalités du Dashboard SuiveurEnergie

## Vue d'ensemble

Le dashboard SuiveurEnergie affiche en temps réel les données de vos 4 pinces de mesure énergétique (JSY-MK-194G) connectées à un ESP32.

---

## 📊 Sections du Dashboard

### 1. ⚡ Puissance en temps réel (Jauges)

**4 jauges circulaires** affichant la puissance instantanée :

- **House** (Module 1, Channel 1) - Bleu
- **WaterHeater** (Module 1, Channel 2) - Rouge  
- **PV** (Module 2, Channel 1) - Orange
- **Spare** (Module 2, Channel 2) - Vert

**Informations affichées :**
- Puissance instantanée (W) avec jauge animée
- Direction : Import (rouge) ou Export (vert)
- Tension (V) avec icône
- Courant (A) avec icône
- Description du point (ex: "Main house consumption")

**Rafraîchissement :** Toutes les 5 secondes (configurable)

---

### 2. 📈 Statistiques du jour

**4 cartes colorées** affichant :

#### 💰 Coût (Bleu)
- Coût estimé de la journée en €
- Basé sur consommation × prix kWh

#### 📉 Consommation (Rouge)
- Consommation totale de la journée (kWh)
- Calculée depuis les compteurs import

#### ☀️ Production (Jaune)
- Production solaire de la journée (kWh)
- Calculée depuis les compteurs export

#### 💚 Économie (Vert)
- Économies réalisées grâce au solaire (€)
- Basée sur production × prix rachat

---

### 3. 📋 Historique des mesures (Tableau)

**Tableau interactif** affichant toutes les mesures récentes.

#### Fonctionnalités du tableau

##### 🔍 Filtrage
- **Par point de mesure** : Dropdown pour filtrer par House, WaterHeater, PV, ou Spare
- **Par période** : Sélecteur 1h / 3h / 6h / 12h / 24h

##### ↕️ Tri dynamique
Cliquez sur n'importe quel en-tête pour trier :
- **Timestamp** : Ordre chronologique
- **Point** : Ordre alphabétique
- **Puissance** : Du plus faible au plus fort
- **Tension** : Tri numérique
- **Courant** : Tri numérique
- **Import/Export** : Tri numérique

##### 📊 Colonnes

| Colonne | Description | Format |
|---------|-------------|--------|
| **Timestamp** | Date et heure de la mesure | DD/MM HH:MM:SS |
| **Point** | Nom + (Module/Channel) | Ex: House (M1C1) |
| **Puissance (W)** | Puissance instantanée | En orange si > 0 |
| **Tension (V)** | Tension mesurée | 1 décimale |
| **Courant (A)** | Courant mesuré | 2 décimales |
| **Direction** | Import ou Export | Badge coloré |
| **Import (kWh)** | Compteur import cumulé | 3 décimales |
| **Export (kWh)** | Compteur export cumulé | 3 décimales |

##### ✨ Effets visuels
- Hover : Ligne surlignée en bleu clair au survol
- Icônes de tri : Indiquent la colonne et direction actuelles
- Compteur : "X mesures" affiché en haut à droite

##### 🔄 Mise à jour
- **Automatique** : Toutes les 30 secondes
- **Manuelle** : Changez la période pour forcer un rafraîchissement

---

## 🎨 Personnalisation

### Couleurs des jauges

Les couleurs sont **attribuées automatiquement** selon l'ID du point :

```javascript
Point ID 1 → Bleu (#3b82f6)
Point ID 2 → Rouge (#ef4444)
Point ID 3 → Orange (#f59e0b)
Point ID 4 → Vert (#10b981)
Point ID 5 → Violet (#8b5cf6)
Point ID 6 → Rose (#ec4899)
```

### Puissance maximale des jauges

Détection automatique selon le nom du point :
- "House", "Maison", "Logement" → 5000W
- "WaterHeater", "Chauffe-eau" → 3000W
- "PV", "Solar", "Solaire" → 3000W
- Autres → 3000W (par défaut)

### Intervalle de rafraîchissement

Créez un fichier `.env` dans `frontend/` :

```env
VITE_REFRESH_MS=3000  # 3 secondes au lieu de 5
```

---

## 🔌 Points de mesure

Les noms et descriptions proviennent de votre **table PostgreSQL** `measurement_point`.

Pour modifier un point de mesure, connectez-vous à PostgreSQL :

```sql
-- Modifier le nom d'un point
UPDATE measurement_point 
SET name = 'NouveauNom', 
    description = 'Nouvelle description'
WHERE id = 1;

-- Désactiver un point
UPDATE measurement_point 
SET active = false
WHERE id = 4;
```

Le dashboard s'adaptera automatiquement !

---

## 💡 Astuces

### Détecter les pics de consommation
1. Réglez la période du tableau sur "1 heure"
2. Cliquez sur "Puissance (W)" pour trier du plus fort au plus faible
3. Identifiez les moments de forte consommation

### Suivre la production solaire
1. Filtrez par "PV" dans le dropdown
2. Observez les variations de puissance dans le tableau
3. Comparez avec les statistiques du jour

### Identifier les appareils en veille
1. Filtrez par point de mesure (ex: "House")
2. Triez par "Puissance (W)" ascendant
3. La consommation minimale = consommation de veille

---

## 📱 Responsive

Le dashboard s'adapte automatiquement :
- **Desktop** : 4 jauges côte à côte
- **Tablette** : 2 jauges par ligne
- **Mobile** : 1 jauge par ligne + sidebar cachée

---

## 🆘 Dépannage

### Le tableau est vide
- Vérifiez que l'ESP32 envoie bien des données
- Testez avec `curl` et le fichier `test-data.json`
- Augmentez la période (essayez 24h)

### Les couleurs ne s'affichent pas
- Vérifiez que Tailwind est bien configuré
- Redémarrez le serveur de développement (Ctrl+C puis `npm run dev`)

### Les noms n'apparaissent pas
- Vérifiez la table `measurement_point` dans PostgreSQL
- L'API `/api/latest` doit retourner le champ `point_name`

---

Bon monitoring ! ⚡🔋

