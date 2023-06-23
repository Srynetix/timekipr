import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";

let httpsConfiguration = {};
if (process.env.SSL_KEY_FILE) {
  httpsConfiguration = {
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CRT_FILE),
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    https: httpsConfiguration,
    port: 53000,
  },
});
