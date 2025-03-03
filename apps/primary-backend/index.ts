import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {prismaClient} from "db/client";
import authMiddleware from "./middleware.ts";


const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());


app.post("/project",authMiddleware,async (req ,res ) => {
    const { prompt } = req.body;
    const userId = req.userId!;
    const name = prompt.split("\n")[0];

    const project = await prismaClient.project.create({
        data :{
            description : name,
            userId : userId,
        }
    })

    if(!project){
         res.status(404).json({
            status: "error",
            message : "Not able to create a project"
        })
        return
    }

     res.status(200).json({
        status:"success",
        data : project.id
    })

})

app.get("/projects",authMiddleware,async (req,res)=>{
    const userId  = req.userId;
    const projects = await prismaClient.project.findMany({
        where:{
            userId
        }
    })
    res.status(200).json({
        status:"success",
        data : projects
    })

})


app.listen(3000,() =>{
    console.log("Server started on port 3000");
})