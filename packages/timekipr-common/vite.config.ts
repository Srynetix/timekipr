import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      name: "timekipr-common",
      fileName: "timekipr-common",
    },
  },
  plugins: [react()],
});
