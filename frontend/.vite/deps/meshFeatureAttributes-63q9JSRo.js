import { t as _ } from "./Point-B7zMqEx6.js";
import { t as A } from "./MeshTransform-NyjZftdc.js";
//#region node_modules/@arcgis/core/rest/support/meshFeatureAttributes.js
function n(o, n, i = r) {
	return new _({
		x: o[i.originX],
		y: o[i.originY],
		z: o[i.originZ],
		spatialReference: n
	});
}
function i(t, n = r) {
	return new A({
		translation: [
			t[n.translationX],
			-t[n.translationZ],
			t[n.translationY]
		],
		rotationAxis: [
			t[n.rotationX],
			-t[n.rotationZ],
			t[n.rotationY]
		],
		rotationAngle: t[n.rotationDeg],
		scale: [
			t[n.scaleX],
			t[n.scaleZ],
			t[n.scaleY]
		]
	});
}
var r = {
	originX: "originX",
	originY: "originY",
	originZ: "originZ",
	translationX: "translationX",
	translationY: "translationY",
	translationZ: "translationZ",
	scaleX: "scaleX",
	scaleY: "scaleY",
	scaleZ: "scaleZ",
	rotationX: "rotationX",
	rotationY: "rotationY",
	rotationZ: "rotationZ",
	rotationDeg: "rotationDeg"
};
//#endregion
export { n, i as t };

//# sourceMappingURL=meshFeatureAttributes-63q9JSRo.js.map