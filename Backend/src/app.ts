import express from 'express';
import runGraph from "./ai/graph.ai.js"
import cors from "cors"

const app = express();
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-battle-arena-mr7l.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
}));


app.get('/', (req, res) => {
    res.json({ status: "ok", message: "AI Battle Arena backend is running" })
})

app.post("/invoke", async (req, res) => {

    const { input } = req.body

    if (!input || typeof input !== "string" || !input.trim()) {
        res.status(400).json({
            message: "Missing or invalid 'input' in request body",
            success: false
        })
        return
    }

    try {
        const result = await runGraph(input)

        res.status(200).json({
            message: "Graph executed successfully",
            success: true,
            result
        })
    } catch (error) {
        console.error("Error running graph:", error)
        res.status(500).json({
            message: "Something went wrong while generating a response. Please try again.",
            success: false
        })
    }

})



export default app;
