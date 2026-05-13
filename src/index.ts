import app from "./app"
import dotenv from "dotenv"

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`✅ | Servidor rodando na porta http://0.0.0.0:${port}`)
})