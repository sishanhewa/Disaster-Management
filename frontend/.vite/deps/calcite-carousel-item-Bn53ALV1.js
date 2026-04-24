import { N as css, O as html, d as setAttribute, l as safeClassMap, r as customElement, s as LitElement } from "./runtime-C8rHe43j.js";
import { t as guid } from "./guid-0rMdwY7J.js";
//#region node_modules/@esri/calcite-components/dist/components/calcite-carousel-item/customElement.js
var CSS = {
	container: "container",
	selected: "selected"
};
var idPrefix = "calcite-carousel-item";
var IDS = { host: (id) => `${idPrefix}-${id}` };
var styles = css`:host{display:flex}.container{display:none;inline-size:var(--calcite-container-size-content-fluid)}:host([selected]) .container{display:block}:host([hidden]){display:none}[hidden]{display:none}`;
var CarouselItem = class extends LitElement {
	constructor() {
		super(...arguments);
		this.guid = IDS.host(guid());
		this.selected = false;
	}
	static {
		this.properties = {
			label: 1,
			selected: [
				7,
				{},
				{
					reflect: true,
					type: Boolean
				}
			]
		};
	}
	static {
		this.styles = styles;
	}
	render() {
		const id = this.el.id || this.guid;
		setAttribute(this.el, "id", id);
		return html`<div .ariaLabel=${this.label} class=${safeClassMap({
			[CSS.container]: true,
			[CSS.selected]: this.selected
		})} role=tabpanel><slot></slot></div>`;
	}
};
customElement("calcite-carousel-item", CarouselItem);
//#endregion
export { CarouselItem };

//# sourceMappingURL=calcite-carousel-item-Bn53ALV1.js.map