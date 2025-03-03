import type { Response,Request,NextFunction } from "express"
import jwt from 'jsonwebtoken'

export default function authMiddleware(req : Request,res : Response,next : NextFunction) {
    const authHeader = req.headers.authorization!;


    const token = authHeader.split(" ")[1];

    if(!token){
        res.status(401).json({
            status: "error",
            message : "No token provided, Unauthorized"
        })
        return
    }

    const decoded = jwt.verify(token,process.env.JWT_PUBLICKEY as string,{
        algorithms : ["RS256"],
    })

    if(!decoded){
        res.status(401).json({
            status: "error",
            message : "No token provided, Unauthorized"
        })
        return;
    }

    const userId = ( decoded as any ).payload.sub;

    if(!userId){
        res.status(401).json({
            status: "error",
            message : "No token provided, Unauthorized"
        })
        return;
    }

    req.userId = userId;

    next()


}