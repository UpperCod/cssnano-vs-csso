import postcss from "postcss";
import cssnano from "cssnano";

export async function loadCssnano(cssText) {
    const { css } = await postcss([cssnano()]).process(cssText, { from: "" });
    return css;
}
