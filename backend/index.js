const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const { getHourTypeForContract } = require("./tempoService");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware pour parser le JSON reçu
app.use(express.json());
// Pool de connexion PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "suiveurenergie",
    password: process.env.DB_PASSWORD || "suiveurenergie",
    database: process.env.DB_NAME || "suiveurenergie",
});

// Route de test simple
app.get("/health", (req, res) => {
    res.send("OK");
});

// Route de test DB
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as now");
        res.json({ ok: true, now: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.get("/api/latest", async (req, res) => {
    try {
        const sql = `
            SELECT
              mp.id          AS point_id,
              mp.name        AS point_name,
              mp.module,
              mp.channel,
              m.ts,
              m.power_w,
              m.voltage_v,
              m.current_a,
              m.apparent_power_va,
              m.power_factor,
              m.direction_export,
              m.import_kwh_total,
              m.export_kwh_total,
              m.hour_type
            FROM measurement_point mp
            JOIN LATERAL (
              SELECT *
              FROM measurement m
              WHERE m.point_id = mp.id
              ORDER BY m.ts DESC
              LIMIT 1
            ) m ON TRUE
            ORDER BY mp.id;
        `;
        const result = await pool.query(sql);
        res.json({ ok: true, points: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.get("/api/history", async (req, res) => {
    try {
        const { point, from, to } = req.query;

        if (!point || !from || !to) {
            return res.status(400).json({
                ok: false,
                error: "Missing query params: point, from, to",
            });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (
            Number.isNaN(fromDate.getTime()) ||
            Number.isNaN(toDate.getTime())
        ) {
            return res.status(400).json({
                ok: false,
                error: "Invalid date format for from/to",
            });
        }

        const sql = `
            SELECT
              m.ts,
              m.power_w,
              m.import_kwh_total,
              m.export_kwh_total,
              m.hour_type
            FROM measurement m
            JOIN measurement_point mp ON m.point_id = mp.id
            WHERE mp.name = $1
              AND m.ts >= $2
              AND m.ts <= $3
            ORDER BY m.ts ASC
            LIMIT 10000
        `;
        const params = [point, fromDate.toISOString(), toDate.toISOString()];
        const result = await pool.query(sql, params);

        res.json({
            ok: true,
            point,
            from: fromDate.toISOString(),
            to: toDate.toISOString(),
            data: result.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

/**
 * Route pour obtenir les statistiques journalières
 * GET /api/daily-stats?date=YYYY-MM-DD
 */
app.get("/api/daily-stats", async (req, res) => {
    try {
        const { date } = req.query;
        
        // Si pas de date fournie, utiliser aujourd'hui
        const targetDate = date ? new Date(date) : new Date();
        if (Number.isNaN(targetDate.getTime())) {
            return res.status(400).json({
                ok: false,
                error: "Invalid date format",
            });
        }

        // Début et fin de la journée
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Requête pour obtenir les stats par point de mesure
        const sql = `
            SELECT
                mp.id AS point_id,
                mp.name AS point_name,
                COUNT(*) AS measurement_count,
                MIN(m.import_kwh_total) AS import_kwh_start,
                MAX(m.import_kwh_total) AS import_kwh_end,
                MIN(m.export_kwh_total) AS export_kwh_start,
                MAX(m.export_kwh_total) AS export_kwh_end,
                AVG(m.power_w) AS avg_power_w,
                MAX(m.power_w) AS max_power_w,
                MIN(m.power_w) AS min_power_w
            FROM measurement_point mp
            LEFT JOIN measurement m ON m.point_id = mp.id
                AND m.ts >= $1
                AND m.ts <= $2
            WHERE mp.active = true
            GROUP BY mp.id, mp.name
            ORDER BY mp.id;
        `;
        
        const result = await pool.query(sql, [startOfDay.toISOString(), endOfDay.toISOString()]);

        // Calculer les différences pour obtenir la consommation/production du jour
        const stats = result.rows.map(row => ({
            point_id: row.point_id,
            point_name: row.point_name,
            measurement_count: parseInt(row.measurement_count) || 0,
            import_kwh: row.import_kwh_end && row.import_kwh_start 
                ? parseFloat(row.import_kwh_end) - parseFloat(row.import_kwh_start)
                : 0,
            export_kwh: row.export_kwh_end && row.export_kwh_start
                ? parseFloat(row.export_kwh_end) - parseFloat(row.export_kwh_start)
                : 0,
            avg_power_w: row.avg_power_w ? parseFloat(row.avg_power_w) : 0,
            max_power_w: row.max_power_w ? parseFloat(row.max_power_w) : 0,
            min_power_w: row.min_power_w ? parseFloat(row.min_power_w) : 0,
        }));

        res.json({
            ok: true,
            date: targetDate.toISOString().split('T')[0],
            stats,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

/**
 * Helper : récupère l'id du measurement_point pour un (module, channel)
 */
async function getMeasurementPointId(client, moduleNumber, channelNumber) {
    const result = await client.query(
        "SELECT id FROM measurement_point WHERE module = $1 AND channel = $2",
        [moduleNumber, channelNumber]
    );
    if (result.rowCount === 0) {
        throw new Error(
            `No measurement_point found for module=${moduleNumber}, channel=${channelNumber}`
        );
    }
    return result.rows[0].id;
}

async function getActiveContract(client) {
    const result = await client.query(
        `SELECT id,
                name,
                contract_type,
                hp_start,
                hp_end,
                hp_timezone
         FROM energy_contract
         WHERE active = true
         ORDER BY id
         LIMIT 1`
    );
    return result.rows[0] ?? null;
}

/**
 * Route principale : reçoit le JSON de l'ESP32 et enregistre les mesures
 *
 * Exemple de body :
 * {
 *   "module1": {
 *     "channel1": { ... },
 *     "channel2": { ... },
 *     "frequency": 50.0
 *   },
 *   "module2": { ... }
 * }
 */
app.post("/api/measurements", async (req, res) => {
    const payload = req.body;
    const ts = new Date(); // timestamp unique pour toutes les pinces de ce batch

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const contractRow = await getActiveContract(client);
        let hourType = null;
        try {
            hourType = await getHourTypeForContract(contractRow, ts);
        } catch (hourErr) {
            console.error("[HourType] Unable to compute hour_type:", hourErr);
        }

        // On parcourt les modules : module1, module2, ...
        for (const [moduleKey, moduleData] of Object.entries(payload)) {
            if (!moduleKey.startsWith("module")) continue;

            const moduleNumber = parseInt(moduleKey.replace("module", ""), 10);
            if (Number.isNaN(moduleNumber)) continue;

            const frequency =
                typeof moduleData.frequency === "number"
                    ? moduleData.frequency
                    : null;

            // On parcourt les channels : channel1, channel2, ...
            for (const [channelKey, channelData] of Object.entries(
                moduleData
            )) {
                if (!channelKey.startsWith("channel")) continue;

                const channelNumber = parseInt(
                    channelKey.replace("channel", ""),
                    10
                );
                if (Number.isNaN(channelNumber)) continue;

                // Récupérer l'id du measurement_point correspondant
                const pointId = await getMeasurementPointId(
                    client,
                    moduleNumber,
                    channelNumber
                );

                // Extraire les valeurs du JSON (en gérant le cas où certains champs manquent)
                const voltage = channelData.voltage ?? null;
                const current = channelData.current ?? null;
                const power = channelData.power ?? null;
                const apparentPower = channelData.va ?? null;
                const powerFactor = channelData.powerFactor ?? null;

                // consumption = import, production = export
                const importTotal = channelData.consumption ?? null;
                const exportTotal = channelData.production ?? null;

                // direction : tu pourras ajuster le sens plus tard,
                // ici on prend "true = export"
                const directionExport = channelData.direction === true;

                // Insert dans la table measurement
                await client.query(
                    `INSERT INTO measurement (
            point_id, ts,
            voltage_v, current_a, power_w, apparent_power_va,
            power_factor, frequency_hz,
            direction_export, import_kwh_total, export_kwh_total,
            hour_type, raw_payload
          ) VALUES (
            $1, $2,
            $3, $4, $5, $6,
            $7, $8,
            $9, $10, $11,
            $12, $13
          )`,
                    [
                        pointId,
                        ts,
                        voltage,
                        current,
                        power,
                        apparentPower,
                        powerFactor,
                        frequency,
                        directionExport,
                        importTotal,
                        exportTotal,
                        hourType,
                        channelData, // le JSON du channel en brut
                    ]
                );
            }
        }

        await client.query("COMMIT");
        res.json({ ok: true });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    } finally {
        client.release();
    }
});

app.listen(port, () => {
    console.log(`API started on port ${port}`);
});
