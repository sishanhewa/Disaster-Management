import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { L as e } from "./promiseUtils-DhYhergm.js";
import { A as m } from "./decorators-DE7S5xmd.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import { t as _ } from "./Point-B7zMqEx6.js";
import { E as y, p as e$1 } from "./vec2-BPF6SpMH.js";
import { t as y$1 } from "./Polyline-Cv0nwof6.js";
import { s as n } from "./vec3f64-CwISzc_v.js";
import { r as e$2 } from "./screenUtils-BR-xd7ya.js";
import { t as j } from "./Graphic-D2G0Ykqt.js";
import { r as d, t as u$1 } from "./SimpleMarkerSymbol-BjFFaoyw.js";
import { F as m$1 } from "./typeUtils-DZkmoi8p.js";
import { i as n$1 } from "./vec2f64-BKe4utUH.js";
import { d as s } from "./normalizedPoint-BO8sGqAY.js";
import { n as p } from "./ParallelSnappingHint-a7tHnrIG.js";
import { t as a } from "./SnappingVisualizer-BMQ0OYfT.js";
//#region node_modules/@arcgis/core/views/2d/interactive/SnappingVisualizer2D.js
var SnappingVisualizer2D_exports = /* @__PURE__ */ __exportAll({ SnappingVisualizer2D: () => f });
var f = class extends a {
	constructor(e) {
		super(), this._graphicsAdapter = e, this._symbolPairingsByType = /* @__PURE__ */ new Map();
	}
	visualizeIntersectionPoint(e, t) {
		return this._visualizeSnappingIndicator(new _({
			x: e.intersectionPoint[0],
			y: e.intersectionPoint[1],
			spatialReference: t.spatialReference
		}), this._getOrCreateSymbol("intersectionPoint", t.view.effectiveTheme.accentColor));
	}
	visualizePoint(e, t) {
		return this._visualizeSnappingIndicator(new _({
			x: e.point[0],
			y: e.point[1],
			spatialReference: t.spatialReference
		}), this._getOrCreateSymbol("point", t.view.effectiveTheme.accentColor));
	}
	visualizeLine(e, t) {
		return this._visualizeSnappingIndicator(new y$1({
			paths: [[[...e.lineStart], [...e.lineEnd]]],
			spatialReference: m(S, t.spatialReference)
		}), this._getOrCreateSymbol("line", t.view.effectiveTheme.accentColor));
	}
	visualizeCurve(e, t) {
		return this._visualizeSnappingIndicator(new y$1({
			curvePaths: [[[...e.start], e.curve]],
			spatialReference: m(S, t.spatialReference)
		}), this._getOrCreateSymbol("line", t.view.effectiveTheme.accentColor));
	}
	visualizeParallelSign(e, t) {
		return this._visualizeSnappingIndicator(new y$1({
			paths: [[[...e.lineStart], [...e.lineEnd]]],
			spatialReference: m(S, t.spatialReference)
		}), this._getOrCreateSymbol("parallelSign", t.view.effectiveTheme.accentColor));
	}
	visualizeRightAngleQuad(e, t) {
		const r = n$1(), s$1 = n$1(), p = n();
		e$1(r, s(e.centerVertex), s(e.previousVertex)), e$1(s$1, s(e.nextVertex), s(e.previousVertex)), y(p, r, s$1);
		const y$2 = `rightAngleQuad${p[2] < 0 ? 45 : 225}`;
		return this._visualizeSnappingIndicator(new y$1({
			paths: [[
				[...e.previousVertex],
				[...e.centerVertex],
				[...e.nextVertex]
			]],
			spatialReference: m(S, t.spatialReference)
		}), this._getOrCreateSymbol(y$2, t.view.effectiveTheme.accentColor));
	}
	_visualizeSnappingIndicator(r, i) {
		const n = new j({
			geometry: r,
			symbol: i
		});
		return this._graphicsAdapter.add(n), e(() => {
			this._graphicsAdapter.remove(n);
		});
	}
	_getOrCreateSymbol(e, t) {
		const r = this._symbolPairingsByType;
		return r.get(e)?.color !== t && r.set(e, {
			color: t,
			symbol: u(e, t)
		}), r.get(e).symbol;
	}
};
function u(e, t) {
	const i = [...t.toRgb(), 255 * t.a];
	switch (e) {
		case "point": return new u$1({
			outline: {
				width: .5,
				color: [
					0,
					0,
					0,
					1
				]
			},
			size: 10,
			color: t
		});
		case "intersectionPoint": return new u$1({
			outline: new d({
				width: 1.5,
				color: t
			}),
			size: 15,
			color: [
				0,
				0,
				0,
				0
			]
		});
		case "line": return new m$1({ data: {
			type: "CIMSymbolReference",
			symbol: {
				type: "CIMLineSymbol",
				symbolLayers: [{
					type: "CIMSolidStroke",
					enable: !0,
					capStyle: "Butt",
					joinStyle: "Round",
					miterLimit: 10,
					width: e$2(p.lineHintWidthTarget),
					color: i
				}]
			}
		} });
		case "parallelSign": return new m$1({ data: {
			type: "CIMSymbolReference",
			symbol: {
				type: "CIMLineSymbol",
				symbolLayers: [{
					type: "CIMVectorMarker",
					enable: !0,
					anchorPoint: {
						x: 0,
						y: -1,
						z: 0
					},
					anchorPointUnits: "Relative",
					size: 5,
					markerPlacement: {
						type: "CIMMarkerPlacementOnLine",
						placePerPart: !0,
						angleToLine: !0,
						relativeTo: "LineMiddle"
					},
					frame: {
						xmin: -5,
						ymin: -1.5,
						xmax: 5,
						ymax: 1.5
					},
					markerGraphics: [{
						type: "CIMMarkerGraphic",
						geometry: { rings: [[
							[7, 0],
							[-7, 0],
							[-7, 1.5],
							[7, 1.5]
						]] },
						symbol: {
							type: "CIMPolygonSymbol",
							symbolLayers: [{
								type: "CIMSolidFill",
								enable: !0,
								color: i
							}]
						}
					}],
					scaleSymbolsProportionally: !0,
					respectFrame: !0
				}, {
					type: "CIMVectorMarker",
					enable: !0,
					anchorPoint: {
						x: 0,
						y: 1,
						z: 0
					},
					anchorPointUnits: "Relative",
					size: 5,
					markerPlacement: {
						type: "CIMMarkerPlacementOnLine",
						placePerPart: !0,
						angleToLine: !0,
						relativeTo: "LineMiddle"
					},
					frame: {
						xmin: -5,
						ymin: -1.5,
						xmax: 5,
						ymax: 1.5
					},
					markerGraphics: [{
						type: "CIMMarkerGraphic",
						geometry: { rings: [[
							[7, 0],
							[-7, 0],
							[-7, -1.5],
							[7, -1.5]
						]] },
						symbol: {
							type: "CIMPolygonSymbol",
							symbolLayers: [{
								type: "CIMSolidFill",
								enable: !0,
								color: i
							}]
						}
					}],
					scaleSymbolsProportionally: !0,
					respectFrame: !0
				}]
			}
		} });
		case "rightAngleQuad45":
		case "rightAngleQuad225": {
			const n = "rightAngleQuad45" === e ? 45 : 225;
			return new m$1({ data: {
				type: "CIMSymbolReference",
				symbol: {
					type: "CIMLineSymbol",
					symbolLayers: [{
						type: "CIMVectorMarker",
						enable: !0,
						anchorPoint: {
							x: .5,
							y: .5,
							z: 0
						},
						anchorPointUnits: "Relative",
						size: e$2(p.rightAngleHintSize),
						rotation: n,
						markerPlacement: {
							type: "CIMMarkerPlacementOnVertices",
							placePerPart: !0,
							angleToLine: !0,
							placeOnEndPoints: !1
						},
						frame: {
							xmin: -5,
							ymin: -5,
							xmax: 5,
							ymax: 5
						},
						markerGraphics: [{
							type: "CIMMarkerGraphic",
							geometry: { paths: [[
								[5, -5],
								[-5, -5],
								[-5, 5],
								[5, 5],
								[5, -5]
							]] },
							symbol: {
								type: "CIMLineSymbol",
								symbolLayers: [{
									type: "CIMSolidStroke",
									enable: !0,
									capStyle: "Butt",
									joinStyle: "Round",
									miterLimit: 10,
									width: e$2(p.rightAngleHintOutlineSize),
									color: i
								}, {
									type: "CIMSolidFill",
									enable: !0,
									color: [...t.toRgb(), 255 * t.a * .4]
								}]
							}
						}],
						scaleSymbolsProportionally: !0,
						respectFrame: !0
					}]
				}
			} });
		}
	}
}
//#endregion
export { f as n, SnappingVisualizer2D_exports as t };

//# sourceMappingURL=SnappingVisualizer2D-DbwXahrQ.js.map