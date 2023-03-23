import pc from "picocolors"
import fs from 'node:fs';
import { exit, extractInitialData } from "./utils.js";
import { readLine } from "./cli.js";
import { spawn } from "node:child_process";
import picocolors from "picocolors";

const args = process.argv;
const pathname = args.length > 2 ? args[2] : null;

if (!fs.existsSync(pathname)) {
    console.log(pc.red("No existe el archivo."));
    exit(1);
}

(async () => {

    const initial = extractInitialData(pathname);
    initial.groupId = await readLine('groupId', initial.groupId);
    initial.artifactId = await readLine('artifactId', initial.artifactId);
    initial.version = await readLine('version', initial.version);
    initial.packaging = await readLine('packaging', initial.packaging);

    console.log(picocolors.green('Instalando dependencia local...'));

    const cmd = (process.env.COMSPEC || "cmd.exe");
    const cli = ["/s", "/c", "mvn", "install:install-file", 
        `-Dfile=${pathname}`,
        `-DgroupId=${initial.groupId}`,
        `-DartifactId=${initial.artifactId}`,
        `-Dversion=${initial.version}`,
        `-Dpackaging=${initial.packaging}`
    ];
    const proc = spawn(cmd, cli, { stdio: [process.stdin, process.stdout, process.stderr] });
    proc.on('exit', (code) => {
        if (code !== 0) {
            console.log(picocolors.red(`Ha ocurrido un error: ${code}`));
        }
        exit(code);
    })

})();