import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { b as s } from "./promiseUtils-DhYhergm.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./jsonMap-CFSDFmi6.js";
import "./assets-BZbzeyNa.js";
import "./locale-BdrQIP_a.js";
import "./messages-BSXJ_xjI.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./Queue-CM8W5OTt.js";
import "./workers-BjS-6PTj.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import { t as r$1 } from "./workers-Nrqav2LG.js";
//#region node_modules/@arcgis/core/widgets/PanoramicViewer/support/PanoramicMeshManager.js
var o = class o {
	constructor() {
		this._connection = null, this.convertPixelBlockToImageData = async (e) => {
			if (!this._connection) throw new r("panoramic-mesh-manager:convertPixelBlockToImageData", "Panoramic mesh manager is not loaded");
			const { pixelBlock: o, transferList: i } = e.clone().getTransferableObject();
			return await this._connection.invoke("convertPixelBlockToImageData", o, { transferList: i });
		}, this.getFacesWithVertexAttributes = async (e) => {
			if (!this._connection) throw new r("panoramic-mesh-manager:getFacesWithVertexAttributes", "Panoramic mesh manager is not loaded");
			return await this._connection.invoke("getFacesWithVertexAttributes", e);
		};
	}
	destroy() {
		this._connection?.close();
	}
	async _startWorker(t) {
		this._connection = await r$1("PanoramicMeshWorker", t);
	}
	static getInstance() {
		return o._instance || (o._instance = new o()), o._instance;
	}
	async load(t) {
		return s(t), await this._startWorker(t), this;
	}
	async recomputePositions(e, n, o, i) {
		if (!this._connection) throw new r("panoramic-mesh-manager:recomputePositions", "Panoramic mesh manager is not loaded");
		return await this._connection.invoke("recomputePositions", {
			oldDistance: e,
			newDistance: n,
			position: o
		}, {
			...i,
			transferList: [o.buffer.slice()]
		});
	}
};
//#endregion
export { o as default };

//# sourceMappingURL=PanoramicMeshManager-D6kkMW6Z.js.map