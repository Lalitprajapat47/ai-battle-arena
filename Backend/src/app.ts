import express from 'express';
import runGraph from "./ai/graph.ai.js"
import cors from "cors"

const app = express();
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}))


app.get('/', (req, res) => {
    res.json({ status: "ok", message: "AI Battle Arena backend is running" })
})

app.post("/invoke", async (req, res) => {

    const { input } = req.body
    const result = await runGraph(input)

    res.status(200).json({
        message: "Graph executed successfully",
        success: true,
        result
    })

})



export default app;