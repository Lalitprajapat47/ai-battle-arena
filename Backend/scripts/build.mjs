import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  external: ["express", "cors", "dotenv"],
  outfile: "api/index.cjs",
});

console.log("Build complete: api/index.cjs");