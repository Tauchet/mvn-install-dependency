import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import picocolors from 'picocolors';

const rl = readline.createInterface({ input, output });

export async function readLine(name, defValue = null) {

    const isDef = Boolean(defValue);
    
    let repeat = false;
    let value = null;
    do {
        value = await rl.question(`${name}${isDef ? picocolors.yellow(` (${defValue})`) : ""}${picocolors.reset(":")} `);
        repeat = !isDef && String(value || "").trim().length == 0;
        if (repeat) {
            console.log(picocolors.red(`Debes ingresar un valor para: ${name}`));
        }
    } while (repeat);

    return value || defValue;
}