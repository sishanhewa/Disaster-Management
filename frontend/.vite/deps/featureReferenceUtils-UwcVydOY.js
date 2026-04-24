import { s as n } from "./vec3f64-CwISzc_v.js";
import { n as b$2 } from "./ray-B_6ooVQr.js";
n();
//#endregion
//#region node_modules/@arcgis/core/analysis/featureReferenceUtils.js
function c(e, t) {
	return s(e) === s(t);
}
function s(e) {
	if (null == e) return null;
	const t = null != e.layer ? e.layer.id : "";
	let r = null;
	return r = null != e.objectId ? e.objectId : null != e.layer && "objectIdField" in e.layer && null != e.layer.objectIdField && null != e.attributes ? e.attributes[e.layer.objectIdField] : e.uid, null == r ? null : `o-${t}-${r}`;
}
var d = {
	json: {
		write: {
			writer: b,
			target: {
				"feature.layerId": {
					type: [Number, String],
					isRequired: !0
				},
				"feature.objectId": {
					type: [Number, String],
					isRequired: !0
				}
			}
		},
		origins: { "web-scene": { read: f } }
	},
	clonable: "reference"
};
function b(e, t) {
	null != e?.layer?.objectIdField && null != e.attributes && (t.feature = {
		layerId: e.layer.id,
		objectId: e.attributes[e.layer.objectIdField]
	});
}
function f(e) {
	if (null != e.layerId && null != e.objectId) return {
		uid: null,
		layer: {
			id: e.layerId,
			objectIdField: "ObjectId"
		},
		attributes: { ObjectId: e.objectId }
	};
}
b$2();
n();
//#endregion
export { d as n, c as t };

//# sourceMappingURL=featureReferenceUtils-UwcVydOY.js.map