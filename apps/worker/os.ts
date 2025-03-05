import {prismaClient} from "db/client";

const BASE_WORKDIR_DIR = "/tmp/mobfit-worker";

if(!Bun.file(BASE_WORKDIR_DIR).exists()){
    Bun.write(BASE_WORKDIR_DIR,"")
}

export async function onFileUpdate(filePath : string,fileContent : string){
   await Bun.write(`${BASE_WORKDIR_DIR}/${filePath}`,fileContent);
}

export function onShellCommand(shellCommand : string){
    const cmds = shellCommand.split("&&");
    for(const command of cmds){
        const result = Bun.spawnSync({ cmd: command.split(" "),cwd : BASE_WORKDIR_DIR });
        console.log(result.stdout);
        console.log(result.stderr.toString());
    }
}