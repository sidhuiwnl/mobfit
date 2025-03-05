import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {prismaClient} from "db/client";
import authMiddleware from "./middleware.ts";


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();





app.post("/project",authMiddleware,async (req ,res ) => {
    const { prompt } = req.body;

    const userId = req.userId!;

    console.log("userId ", userId);

    const name = prompt.split("\n")[0];

    const project = await prismaClient.project.create({
        data :{
            description : name,
            userId : userId,
        }
    })

    console.log("project", project)

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


app.listen(9090,() =>{
    console.log("Server started on port 8080");
})