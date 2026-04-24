import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { n as o } from "./jsonMap-CFSDFmi6.js";
//#region node_modules/@arcgis/core/rest/support/GPMessage.js
var i = new o({
	esriJobMessageTypeInformative: "informative",
	esriJobMessageTypeProcessDefinition: "process-definition",
	esriJobMessageTypeProcessStart: "process-start",
	esriJobMessageTypeProcessStop: "process-stop",
	esriJobMessageTypeWarning: "warning",
	esriJobMessageTypeError: "error",
	esriJobMessageTypeEmpty: "empty",
	esriJobMessageTypeAbort: "abort"
});
var p = class extends n {
	constructor(e) {
		super(e), this.description = null, this.type = null;
	}
};
__decorate([a$1({
	type: String,
	json: { write: !0 }
})], p.prototype, "description", void 0), __decorate([a$1({
	type: String,
	json: {
		read: i.read,
		write: i.write
	}
})], p.prototype, "type", void 0), p = __decorate([c("esri.rest.support.GPMessage")], p);
var a = p;
//#endregion
export { a as t };

//# sourceMappingURL=GPMessage-BS9PmezP.js.map