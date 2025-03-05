import {prismaClient} from "db/client";

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {systemPrompt} from "./SystemPrompt.tsx";
import {ArtifactProcessor} from "./parser.ts";
import {onFileUpdate,onShellCommand} from "./os.ts";
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.post("/prompt", async (req, res) => {
    const { prompt,projectId } = req.body;
    const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });
    if (!prompt && projectId) {
        res.status(400).json({
            error: "Project not found",
            status: "error",
        })
        return
    }



    await prismaClient.prompt.create({
        data :{
            content : prompt,
            projectId : projectId,
            type : "USER"
        }
    })

    const allPrompts = await prismaClient.prompt.findMany({
        where: {
            projectId : projectId
        },
        orderBy :{
            createdAt : "asc"
        }
    })

    let artifactProcessor = new ArtifactProcessor("",onFileUpdate,onShellCommand);
    let artifact = ""



   let response =  client.messages.stream({
        messages: allPrompts.map((p: any) => ({
            role: p.type === "USER" ? "user" : "assistant",
            content: p.content,
        })),
        system: systemPrompt,
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
    })
        .on('text', (text) => {
            artifactProcessor.append(text);
            artifactProcessor.parse();
            artifact += text;
        })
        .on('finalMessage', async (message) => {
            console.log("done!");

            await prismaClient.prompt.create({
                data: {
                    content: artifact,
                    projectId,
                    type: "SYSTEM",
                },
            });




            res.status(200).json({
                status: "success",
                data: message,
            });
        })
        .on('error', (error) => {
        console.log("error", error);
        });
    res.json({ response });

})

app.listen(9091,() =>{
    console.log("Server is running on port 9091")
})