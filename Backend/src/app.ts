import express from 'express';
import runGraph from "./ai/graph.ai.js"
import cors from "cors"
import rateLimit from "express-rate-limit"

const app = express();

// Render (and most hosts) sit behind a reverse proxy; this makes req.ip the real client IP
app.set("trust proxy", 1);

const MAX_PROMPT_LENGTH = 2000;

// Each battle triggers 3 paid LLM calls, so cap how often one client can start one.
const invokeLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please wait a minute and try again.",
    },
});
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}))


app.get('/', (req, res) => {
    res.json({ status: "ok", message: "AI Battle Arena backend is running" })
})

app.post("/invoke", invokeLimiter, async (req, res) => {

    const { input } = req.body

    if (!input || typeof input !== "string" || !input.trim()) {
        res.status(400).json({
            message: "Missing or invalid 'input' in request body",
            success: false
        })
        return
    }

    if (input.length > MAX_PROMPT_LENGTH) {
        res.status(400).json({
            message: `Prompt is too long. Please keep it under ${MAX_PROMPT_LENGTH} characters.`,
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