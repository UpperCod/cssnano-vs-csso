import csso from "csso";

export function loadCsso(cssText) {
    return csso.minify(cssText, {
        sourceMap: false,
    }).css;
}
