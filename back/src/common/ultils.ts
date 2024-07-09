import { exec } from "child_process";

export async function executeCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
        resolve();
      } else {
        console.log(`stdout: ${stdout}`);
        resolve();
      }
    });
  });
}
