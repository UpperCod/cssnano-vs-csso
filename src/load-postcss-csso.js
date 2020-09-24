import postcss from "postcss";
import csso from "postcss-csso";

export async function loadpostcssCsso(cssText) {
    const { css } = await postcss([csso]).process(cssText, {
        from: "",
        map: false,
    });
    return css;
}
