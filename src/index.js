import { PerformanceObserver, performance } from "perf_hooks";
import { loadCssnano } from "./load-cssnano";
import { loadpostcssCsso } from "./load-postcss-csso";
import { loadCsso } from "./load-csso";
import { readFile, writeFile } from "fs/promises";

const status = {};
const sizes = {};

new PerformanceObserver((items) => {
    const [entry] = items.getEntries();
    status[entry.name] = entry;
    status[entry.name].size = sizes[entry.name];
}).observe({ entryTypes: ["measure"] });

async function test() {
    performance.mark("csstext");

    const cssText = await readFile(
        require.resolve("tailwindcss/dist/tailwind.css"),
        "utf8"
    );

    sizes.csstextResult = cssText.length;

    performance.measure("csstextResult", "csstext");

    performance.mark("postcssCsso");

    const postcssCssoResult = await loadpostcssCsso(cssText);

    sizes.postcssCssoResult = postcssCssoResult.length;

    performance.measure("postcssCssoResult", "cssnano");

    performance.mark("csso");

    performance.mark("cssnano");

    const cssnanoResult = await loadCssnano(cssText);

    sizes.cssnanoResult = cssnanoResult.length;

    performance.measure("cssnanoResult", "cssnano");

    performance.mark("csso");

    const cssoResult = await loadCsso(cssText);

    sizes.cssoResult = cssoResult.length;

    performance.measure("cssoResult", "csso");

    console.log(status);

    const template = await readFile(__dirname + "/template.md", "utf8");

    await writeFile(
        "README.md",
        template.replace(/<result>/g, JSON.stringify(status, null, 4))
    );
}

test();
