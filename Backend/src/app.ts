// redeploy trigger
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
    try {
        const { input } = req.body ?? {};
        if (!input || typeof input !== "string") {
            return res.status(400).json({ success: false, message: "input is required" });
        }
        const result = await runGraph(input);
        res.status(200).json({ message: "Graph executed successfully", success: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Graph execution failed" });
    }
})



export default app;