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

/**
 * @param {string} mark
 * @param {()=>Promise<string>|string} load
 * @returns {Promise<string>}
 */
async function createRegister(mark, load) {
    performance.mark(mark);
    const markResult = "Result: " + mark;
    const result = await load();
    sizes[markResult] = result.length;
    performance.measure(markResult, mark);
    return result;
}

async function test() {
    const cssText = await createRegister("readCss", () =>
        readFile(require.resolve("tailwindcss/dist/tailwind.css"), "utf8")
    );

    await createRegister("Postcss + Csso", () => loadpostcssCsso(cssText));

    await createRegister("Cssnano", () => loadCssnano(cssText));

    await createRegister("Csso", () => loadCsso(cssText));

    console.log(status);

    const template = await readFile(__dirname + "/template.md", "utf8");

    await writeFile(
        "README.md",
        template.replace(/<result>/g, JSON.stringify(status, null, 4))
    );
}

test();
