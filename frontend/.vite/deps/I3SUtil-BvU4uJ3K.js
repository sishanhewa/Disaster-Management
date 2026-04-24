import { t as f } from "./request-CuG5cxow.js";
import { S as u } from "./aaBoundingRect-CgUWvAgv.js";
import { s as n } from "./vec3f64-CwISzc_v.js";
import { t as e } from "./mat4f64-BA1Qbgtv.js";
import { i as v, t as S } from "./I3SBinaryReader-CH4DRgeM.js";
import { i as u$1 } from "./symbolColorUtils-Be_EUc3k.js";
import { n as O } from "./orientedBoundingBox-DXfFuUX4.js";
u();
async function E(t, r, o, n, i, s, a, l) {
	const c = [];
	for (const e of r) if (e && i.includes(e.name)) {
		const r = `${t}/nodes/${o}/attributes/${e.key}/0`;
		c.push({
			url: r,
			storageInfo: e
		});
	}
	const u = await Promise.allSettled(c.map((t) => f(t.url, {
		responseType: "array-buffer",
		query: {
			...a,
			token: s
		},
		signal: l?.signal
	}).then((e) => S(t.storageInfo, e.data)))), f$1 = [];
	for (const e of n) {
		const t = {};
		for (let r = 0; r < u.length; r++) {
			const o = u[r];
			if ("fulfilled" === o.status) {
				const n = o.value;
				t[c[r].storageInfo.name] = v(n, e);
			}
		}
		f$1.push(t);
	}
	return f$1;
}
u$1({
	color: [
		0,
		0,
		0,
		0
	],
	opacity: 0
});
n(), n(), n(), n(), n(), n(), n(), n();
u();
u();
new O();
n();
new Array(72);
e();
//#endregion
export { E as t };

//# sourceMappingURL=I3SUtil-BvU4uJ3K.js.map