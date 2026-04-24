import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { a as o, n as c$1, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import { t as e } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import { n as s, t as p } from "./UNTraceConfiguration-KHJMMVBN.js";
import { t as a$1 } from "./typeUtils-CFnTDMtU.js";
//#region node_modules/@arcgis/core/networks/support/NamedTraceConfiguration.js
var d = class extends e(b) {
	constructor(r) {
		super(r), this.globalId = null, this.title = null, this.traceConfiguration = null, this.creationDate = null, this.creator = null, this.description = null, this.minStartingPoints = null, this.resultTypes = [], this.tags = [], this.traceType = null;
	}
	readTraceConfiguration(r, e) {
		return void 0 !== r.tierName ? p.fromJSON(r) : s.fromJSON(r);
	}
};
__decorate([a({
	type: String,
	nonNullable: !0,
	json: {
		origins: {
			"web-map": {
				read: { source: "id" },
				write: {
					target: "id",
					isRequired: !0
				}
			},
			service: {
				read: { source: "globalId" },
				write: {
					target: "globalId",
					isRequired: !0
				}
			}
		},
		read: !1
	}
})], d.prototype, "globalId", void 0), __decorate([a({
	type: String,
	nonNullable: !0,
	json: {
		origins: {
			"web-map": {
				read: { source: "title" },
				write: {
					target: "title",
					isRequired: !0
				}
			},
			service: {
				read: { source: "name" },
				write: {
					target: "name",
					isRequired: !0
				}
			}
		},
		read: !1
	}
})], d.prototype, "title", void 0), __decorate([a({
	type: s,
	json: {
		origins: { service: {
			read: !0,
			write: !0
		} },
		read: !1
	}
})], d.prototype, "traceConfiguration", void 0), __decorate([o("service", "traceConfiguration")], d.prototype, "readTraceConfiguration", null), __decorate([a({
	type: Date,
	json: {
		origins: { service: {
			read: !0,
			write: !0
		} },
		read: !1
	}
})], d.prototype, "creationDate", void 0), __decorate([a({
	type: String,
	json: {
		origins: { service: {
			read: !0,
			write: !0
		} },
		read: !1
	}
})], d.prototype, "creator", void 0), __decorate([a({
	type: String,
	json: {
		origins: { service: {
			read: !0,
			write: !0
		} },
		read: !1
	}
})], d.prototype, "description", void 0), __decorate([a({
	type: [
		"none",
		"one",
		"many"
	],
	json: {
		origins: { service: {
			read: { source: "minNumStartingPoints" },
			write: { target: "minNumStartingPoints" }
		} },
		read: !1
	}
})], d.prototype, "minStartingPoints", void 0), __decorate([a({ json: {
	origins: { service: {
		read: !0,
		write: !0
	} },
	read: !1
} })], d.prototype, "resultTypes", void 0), __decorate([a({
	type: [String],
	json: {
		origins: { service: {
			read: !0,
			write: !0
		} },
		read: !1
	}
})], d.prototype, "tags", void 0), __decorate([a({
	type: a$1.apiValues,
	json: {
		type: a$1.jsonValues,
		origins: { service: {
			read: a$1.read,
			write: a$1.write
		} },
		read: !1
	}
})], d.prototype, "traceType", void 0), d = __decorate([c$1("esri.networks.support.NamedTraceConfiguration")], d);
var c = d;
//#endregion
export { c as t };

//# sourceMappingURL=NamedTraceConfiguration-CnGSAvYn.js.map