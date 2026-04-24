import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./mathUtils-hEBUcrMa.js";
import "./aaBoundingRect-CgUWvAgv.js";
import { s as n } from "./vec3f64-CwISzc_v.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import { C as i, F as z } from "./aaBoundingBox-CzeY9F8R.js";
import { t as c$1 } from "./symbolLayerUtils3D-BQRyZskR.js";
import "./MemCache-DQgW8nin.js";
import { t as e } from "./LRUCache-C0A4Jg0w.js";
//#region node_modules/@arcgis/core/symbols/support/symbolLayerUtils.js
var c = a();
function a() {
	return new e(50);
}
async function f(e, o = null) {
	if (!e.isPrimitive) {
		const o = e.resource?.href;
		if (!o) throw new r("symbol:invalid-resource", "The symbol does not have a valid resource");
		const s = c.get(o);
		if (null != s) return s;
		const { fetch: n$1 } = await import("./objectResourceUtils-D2rzK0Ju.js").then((n) => n.t), u = z((await n$1(o, {
			disableTextures: !0,
			spherical: !0
		})).referenceBoundingBox, n());
		return c.put(o, u), u;
	}
	if (!e.resource?.primitive) throw new r("symbol:invalid-resource", "The symbol does not have a valid resource");
	const a = i(c$1(e.resource.primitive));
	if (null != o) for (let r = 0; r < a.length; r++) a[r] *= o;
	return z(a, n());
}
//#endregion
export { f as computeObjectLayerResourceSize };

//# sourceMappingURL=symbolLayerUtils-CwdJoLIz.js.map