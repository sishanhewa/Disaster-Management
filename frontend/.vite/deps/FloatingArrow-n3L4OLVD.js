import { M as svg, O as html, j as nothing, l as safeClassMap, m as ref } from "./runtime-C8rHe43j.js";
import { t as keyed } from "./keyed-2L57BRzI.js";
//#region node_modules/@esri/calcite-components/dist/chunks/FloatingArrow.js
var CSS = {
	arrow: "calcite-floating-ui-arrow",
	arrowStroke: "calcite-floating-ui-arrow__stroke"
};
var DEFAULTS = {
	width: 12,
	height: 6,
	strokeWidth: 1
};
var FloatingArrow = ({ floatingLayout, key, ref: ref$1 }) => {
	const { width, height, strokeWidth } = DEFAULTS;
	const svgX = width / 2;
	const isVertical = floatingLayout === "vertical";
	const dValue = `M0,0 H${width} L${width - svgX},${height} Q${svgX},${height} ${svgX},${height} Z`;
	return keyed(key, html`<svg aria-hidden=true class=${safeClassMap(CSS.arrow)} height=${width} viewBox=${`0 0 ${width} ${width + (!isVertical ? strokeWidth : 0)}`} width=${width + (isVertical ? strokeWidth : 0)} ${ref(ref$1)}>${svg`${svg`<path class=${safeClassMap(CSS.arrowStroke)} d=${dValue ?? nothing} fill=none stroke-width=${strokeWidth + 1} />` || ""}<path d=${dValue ?? nothing} stroke=none />`}</svg>`);
};
//#endregion
export { FloatingArrow as t };

//# sourceMappingURL=FloatingArrow-n3L4OLVD.js.map