"use client";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Router, Send } from "lucide-react";

import { useState } from "react";


export function Prompt() {
    const [prompt, setPrompt] = useState("");



    return (
        <div>
            <Textarea placeholder="Create a chess application..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <div className="flex justify-end pt-2">
                <Button>
                    <Send />
                </Button>
            </div>
        </div>
    );
}