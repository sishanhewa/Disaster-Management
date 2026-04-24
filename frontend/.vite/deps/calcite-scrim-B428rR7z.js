import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { N as css, O as html, l as safeClassMap, m as ref, p as createRef, r as customElement, s as LitElement } from "./runtime-C8rHe43j.js";
import { t as useT9n } from "./useT9n-ER3d4eMb.js";
import { y as slotChangeHasContent } from "./dom-DTFGtTyI.js";
import { t as createObserver } from "./observers-CnSD4z26.js";
//#region node_modules/@esri/calcite-components/dist/components/calcite-scrim/customElement.js
var CSS = {
	scrim: "scrim",
	content: "content"
};
var BREAKPOINTS = {
	s: 72,
	l: 480
};
var styles = css`:host{position:absolute;inset:0;z-index:var(--calcite-z-index-overlay);display:flex;block-size:100%;inline-size:100%;flex-direction:column;align-items:stretch}@keyframes calcite-scrim-fade-in{0%{--tw-bg-opacity: 0 }to{--tw-text-opacity: 1 }}.scrim{position:absolute;inset:0;display:flex;flex-direction:column;align-content:center;align-items:center;justify-content:center;overflow:hidden;animation:calcite-scrim-fade-in var(--calcite-internal-animation-timing-medium) ease-in-out;background-color:var(--calcite-scrim-background, var(--calcite-color-transparent-scrim))}.content{padding:1rem}:host([hidden]){display:none}[hidden]{display:none}`;
var Scrim = class extends LitElement {
	constructor() {
		super(...arguments);
		this.loaderRef = createRef();
		this.resizeObserver = createObserver("resize", () => this.handleResize());
		this.messages = useT9n();
		this.hasContent = false;
		this.loading = false;
	}
	static {
		this.properties = {
			hasContent: [
				16,
				{},
				{ state: true }
			],
			loaderScale: [
				16,
				{},
				{ state: true }
			],
			loading: [
				7,
				{},
				{
					reflect: true,
					type: Boolean
				}
			],
			messageOverrides: [
				0,
				{},
				{ attribute: false }
			]
		};
	}
	static {
		this.styles = styles;
	}
	connectedCallback() {
		super.connectedCallback();
		this.resizeObserver?.observe(this.el);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this.resizeObserver?.disconnect();
	}
	handleDefaultSlotChange(event) {
		this.hasContent = slotChangeHasContent(event);
	}
	getScale(size) {
		if (size < BREAKPOINTS.s) return "s";
		else if (size >= BREAKPOINTS.l) return "l";
		else return "m";
	}
	handleResize() {
		const { el } = this;
		this.loaderScale = this.getScale(Math.min(el.clientHeight, el.clientWidth) ?? 0);
	}
	render() {
		const { hasContent, loading, loaderScale, messages } = this;
		return html`<div class=${safeClassMap(CSS.scrim)}>${loading && loaderScale ? html`<calcite-loader .label=${messages.loading} .scale=${loaderScale} ${ref(this.loaderRef)}></calcite-loader>` : null}<div class=${safeClassMap(CSS.content)} .hidden=${!hasContent}><slot @slotchange=${this.handleDefaultSlotChange}></slot></div></div>`;
	}
};
customElement("calcite-scrim", Scrim);
//#endregion
//#region node_modules/@esri/calcite-components/dist/components/calcite-scrim/index.js
var calcite_scrim_exports = /* @__PURE__ */ __exportAll({ Scrim: () => Scrim });
//#endregion
export { calcite_scrim_exports as t };

//# sourceMappingURL=calcite-scrim-B428rR7z.js.map