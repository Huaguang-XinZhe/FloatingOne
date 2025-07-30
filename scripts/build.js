import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const command = 'bun run tauri build';

const child = exec(command, {
  env: {
    ...process.env,
    TAURI_SIGNING_PRIVATE_KEY: process.env.TAURI_SIGNING_PRIVATE_KEY,
    TAURI_SIGNING_PRIVATE_KEY_PASSWORD: process.env.TAURI_SIGNING_PRIVATE_KEY_PASSWORD,
  },
});

child.stdout.on('data', (data) => {
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});