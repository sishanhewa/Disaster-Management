import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
//#region node_modules/@arcgis/core/networks/support/TraceConfiguration.js
var i = class extends n$1 {
	constructor(t) {
		super(t), this.conditionBarriers = [], this.outputConditions = [], this.functions = [], this.functionBarriers = [], this.traversabilityScope = null, this.shortestPathNetworkAttributeName = null, this.includeBarriers = null, this.validateConsistency = null, this.ignoreBarriersAtStartingPoints = null;
	}
};
__decorate([a({
	type: [Object],
	json: { write: !0 }
})], i.prototype, "conditionBarriers", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], i.prototype, "outputConditions", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], i.prototype, "functions", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], i.prototype, "functionBarriers", void 0), __decorate([a({
	type: [
		"junctions",
		"edges",
		"junctionsAndEdges"
	],
	json: { write: !0 }
})], i.prototype, "traversabilityScope", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], i.prototype, "shortestPathNetworkAttributeName", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], i.prototype, "includeBarriers", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], i.prototype, "validateConsistency", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], i.prototype, "ignoreBarriersAtStartingPoints", void 0), i = __decorate([c("esri.networks.support.TraceConfiguration")], i);
var s = i;
//#endregion
//#region node_modules/@arcgis/core/networks/support/UNTraceConfiguration.js
var n = class extends l(s) {
	constructor(t) {
		super(t), this.filterBarriers = [], this.arcadeExpressionBarrier = null, this.circuitName = null, this.domainNetworkName = null, this.filterBitsetNetworkAttributeName = null, this.filterFunctionBarriers = [], this.filterScope = null, this.includeContainers = null, this.includeContent = null, this.includeIsolated = null, this.includeStructures = null, this.allowIndeterminateFlow = null, this.includeUpToFirstSpatialContainer = null, this.inferConnectivity = null, this.maxHops = null, this.nearestNeighbor = null, this.numPaths = null, this.outputFilterCategories = [], this.outputFilters = [], this.propagators = [], this.subnetworkName = null, this.targetTierName = null, this.diagramTemplateName = null, this.tierName = null, this.validateLocatability = null;
	}
};
__decorate([a({
	type: [Object],
	json: { write: !0 }
})], n.prototype, "filterBarriers", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "arcadeExpressionBarrier", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "circuitName", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "domainNetworkName", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "filterBitsetNetworkAttributeName", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], n.prototype, "filterFunctionBarriers", void 0), __decorate([a({
	type: [
		"junctions",
		"edges",
		"junctionsAndEdges"
	],
	json: { write: !0 }
})], n.prototype, "filterScope", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "includeContainers", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "includeContent", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "includeIsolated", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "includeStructures", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "allowIndeterminateFlow", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "includeUpToFirstSpatialContainer", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "inferConnectivity", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], n.prototype, "maxHops", void 0), __decorate([a({
	type: Object,
	json: { write: !0 }
})], n.prototype, "nearestNeighbor", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], n.prototype, "numPaths", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], n.prototype, "outputFilterCategories", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], n.prototype, "outputFilters", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], n.prototype, "propagators", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "subnetworkName", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "targetTierName", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "diagramTemplateName", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "tierName", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "validateLocatability", void 0), n = __decorate([c("esri.networks.support.UNTraceConfiguration")], n);
var p = n;
//#endregion
export { s as n, p as t };

//# sourceMappingURL=UNTraceConfiguration-KHJMMVBN.js.map