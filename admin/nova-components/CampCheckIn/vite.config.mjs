import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        vue(),
        {
            name: "nova-versioned-assets",
            enforce: "post",
            generateBundle(_, bundle) {
                const manifest = {};
                for (const [file, asset] of Object.entries(bundle)) {
                    if (!/\.(js|css)$/.test(file)) continue;
                    const source =
                        asset.type === "chunk" ? asset.code : asset.source;
                    const hash = createHash("sha256")
                        .update(source)
                        .digest("hex")
                        .slice(0, 20);
                    manifest[`/${file}`] = `/${file}?id=${hash}`;
                }
                this.emitFile({
                    type: "asset",
                    fileName: "mix-manifest.json",
                    source: JSON.stringify(manifest, null, 2),
                });
                this.emitFile({
                    type: "asset",
                    fileName: "html5-qrcode.LICENSE.txt",
                    source: readFileSync(
                        "node_modules/html5-qrcode/LICENSE",
                        "utf8",
                    ),
                });
            },
        },
    ],
    build: {
        outDir: "dist",
        lib: {
            entry: "resources/js/tool.js",
            name: "CampCheckIn",
            formats: ["iife"],
            fileName: () => "js/tool.js",
            cssFileName: "tool",
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: { vue: "Vue" },
                assetFileNames: "css/tool.[ext]",
            },
        },
    },
});
