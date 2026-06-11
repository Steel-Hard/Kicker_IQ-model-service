import { Pool, types } from "pg"
import dotenv from "dotenv"

types.setTypeParser(1700, (val) => parseFloat(val)) // NUMERIC
types.setTypeParser(701,  (val) => parseFloat(val)) // FLOAT8
types.setTypeParser(700,  (val) => parseFloat(val)) // FLOAT4

dotenv.config()

const db = new Pool({
    connectionString: process.env.POSTGRESQL_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
})

db.on("error", (err: unknown) => {
    console.error("🔴 Erro no pool PostgreSQL:", err)
})

db.query("SELECT 1")
    .then(() => console.log("🟢 Pool PostgreSQL inicializado com sucesso!"))
    .catch((err: unknown) => console.error("🔴 Erro ao inicializar pool PostgreSQL:", err))

export default db