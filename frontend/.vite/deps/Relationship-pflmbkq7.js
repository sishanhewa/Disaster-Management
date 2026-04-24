import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import { n as o } from "./jsonMap-CFSDFmi6.js";
import { i as l } from "./timeZoneUtils-CBNjS1ZG.js";
import { n as l$1 } from "./Clonable-D_RHUyXD.js";
//#region node_modules/@arcgis/core/layers/support/EditFieldsInfo.js
var s$1 = class extends l$1(n$1) {
	constructor(e) {
		super(e), this.creatorField = null, this.creationDateField = null, this.editorField = null, this.editDateField = null, this.realm = null, this.timeZone = null;
	}
};
__decorate([a$1()], s$1.prototype, "creatorField", void 0), __decorate([a$1()], s$1.prototype, "creationDateField", void 0), __decorate([a$1()], s$1.prototype, "editorField", void 0), __decorate([a$1()], s$1.prototype, "editDateField", void 0), __decorate([a$1()], s$1.prototype, "realm", void 0), __decorate([a$1(l("dateFieldsTimeReference", !0))], s$1.prototype, "timeZone", void 0), s$1 = __decorate([c("esri.layers.support.EditFieldsInfo")], s$1);
//#endregion
//#region node_modules/@arcgis/core/layers/support/Relationship.js
var n = new o({
	esriRelCardinalityOneToOne: "one-to-one",
	esriRelCardinalityOneToMany: "one-to-many",
	esriRelCardinalityManyToMany: "many-to-many"
}), a = new o({
	esriRelRoleOrigin: "origin",
	esriRelRoleDestination: "destination"
});
var s = class extends l$1(n$1) {
	constructor(e) {
		super(e), this.cardinality = null, this.catalogId = null, this.composite = null, this.id = null, this.keyField = null, this.keyFieldInRelationshipTable = null, this.name = null, this.relatedTableId = null, this.relationshipTableId = null, this.role = null;
	}
};
__decorate([a$1({ json: {
	read: n.read,
	write: n.write
} })], s.prototype, "cardinality", void 0), __decorate([a$1({ json: { name: "catalogID" } })], s.prototype, "catalogId", void 0), __decorate([a$1({ json: {
	read: !0,
	write: !0
} })], s.prototype, "composite", void 0), __decorate([a$1({ json: {
	read: !0,
	write: !0
} })], s.prototype, "id", void 0), __decorate([a$1({ json: {
	read: !0,
	write: !0
} })], s.prototype, "keyField", void 0), __decorate([a$1({ json: {
	read: !0,
	write: !0
} })], s.prototype, "keyFieldInRelationshipTable", void 0), __decorate([a$1({ json: {
	read: !0,
	write: !0
} })], s.prototype, "name", void 0), __decorate([a$1({ json: {
	read: !0,
	write: !0
} })], s.prototype, "relatedTableId", void 0), __decorate([a$1({ json: {
	read: !0,
	write: !0
} })], s.prototype, "relationshipTableId", void 0), __decorate([a$1({ json: {
	read: a.read,
	write: a.write
} })], s.prototype, "role", void 0), s = __decorate([c("esri.layers.support.Relationship")], s);
//#endregion
export { s$1 as n, s as t };

//# sourceMappingURL=Relationship-pflmbkq7.js.map