import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as n$10, w as a$8 } from "./Error-CzxduO2m.js";
import { r as C$1 } from "./promiseUtils-DhYhergm.js";
import { E as D, P as x$1, a as o, i as r$1, n as c$5, o as r, r as m$1, t as a$9 } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import { t as q$1 } from "./Collection-BAJSKCip.js";
import { n as n$11 } from "./JSONSupport-BUaD4jSd.js";
import { n as o$1, t as i$12 } from "./jsonMap-CFSDFmi6.js";
import { t as g } from "./Color-C99QAF80.js";
import { n as l$7 } from "./Clonable-D_RHUyXD.js";
import { L as v, r as Be, z as w } from "./fieldUtils-CC2YSmV6.js";
import { i as h, n as c$6, o as x$2, s as m$2 } from "./fieldFormatUtils-R1ptUFq7.js";
import { n as a$10, r as p$15, t as r$2 } from "./ActionToggle-JH4srUd2.js";
//#region node_modules/@arcgis/core/popup/content/Content.js
var s$13 = class extends n$11 {
	constructor(t) {
		super(t), this.type = null;
	}
};
__decorate([a$9({
	type: [
		"attachments",
		"custom",
		"fields",
		"media",
		"text",
		"expression",
		"relationship",
		"utility-network-associations"
	],
	readOnly: !0,
	json: {
		read: !1,
		write: !0
	}
})], s$13.prototype, "type", void 0), s$13 = __decorate([c$5("esri.popup.content.Content")], s$13);
var p$14 = s$13;
//#endregion
//#region node_modules/@arcgis/core/popup/support/AttachmentsOrderByInfo.js
var i$11 = new o$1({
	asc: "ascending",
	desc: "descending"
});
var n$9 = class extends l$7(n$11) {
	constructor(o) {
		super(o), this.field = null, this.order = "ascending";
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], n$9.prototype, "field", void 0), __decorate([a$9({
	type: i$11.apiValues,
	json: {
		type: i$11.jsonValues,
		read: i$11.read,
		write: i$11.write
	}
})], n$9.prototype, "order", void 0), n$9 = __decorate([c$5("esri.popup.support.AttachmentsOrderByInfo")], n$9);
var c$4 = n$9;
//#endregion
//#region node_modules/@arcgis/core/popup/content/AttachmentsContent.js
var s$12 = class extends l$7(p$14) {
	constructor(t) {
		super(t), this.attachmentKeywords = null, this.attachmentTypes = null, this.description = null, this.displayType = "auto", this.orderByFields = null, this.title = null, this.type = "attachments";
	}
};
__decorate([a$9({
	type: [String],
	json: { write: !0 }
})], s$12.prototype, "attachmentKeywords", void 0), __decorate([a$9({
	type: [[
		"application",
		"audio",
		"image",
		"model",
		"text",
		"video"
	]],
	json: { write: !0 }
})], s$12.prototype, "attachmentTypes", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], s$12.prototype, "description", void 0), __decorate([a$9({
	type: [
		"auto",
		"preview",
		"list"
	],
	json: { write: !0 }
})], s$12.prototype, "displayType", void 0), __decorate([a$9({
	type: [c$4],
	json: { write: !0 }
})], s$12.prototype, "orderByFields", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], s$12.prototype, "title", void 0), __decorate([a$9({
	type: ["attachments"],
	readOnly: !0,
	json: {
		read: !1,
		write: { isRequired: !0 }
	}
})], s$12.prototype, "type", void 0), s$12 = __decorate([c$5("esri.popup.content.AttachmentsContent")], s$12);
var n$8 = s$12;
//#endregion
//#region node_modules/@arcgis/core/popup/content/CustomContent.js
var i$10;
var p$13 = i$10 = class extends p$14 {
	constructor(t) {
		super(t), this.creator = null, this.destroyer = null, this.outFields = null, this.type = "custom";
	}
	clone() {
		return new i$10({
			creator: this.creator,
			destroyer: this.destroyer,
			outFields: Array.isArray(this.outFields) ? a$8(this.outFields) : null
		});
	}
};
__decorate([a$9()], p$13.prototype, "creator", void 0), __decorate([a$9()], p$13.prototype, "destroyer", void 0), __decorate([a$9()], p$13.prototype, "outFields", void 0), __decorate([a$9({
	type: ["custom"],
	readOnly: !0
})], p$13.prototype, "type", void 0), p$13 = i$10 = __decorate([c$5("esri.popup.content.CustomContent")], p$13);
var l$6 = p$13;
//#endregion
//#region node_modules/@arcgis/core/popup/ElementExpressionInfo.js
var s$11;
var i$9 = s$11 = class extends n$11 {
	constructor(t) {
		super(t), this.title = null, this.expression = null, this.returnType = "dictionary";
	}
	clone() {
		return new s$11({
			title: this.title,
			expression: this.expression
		});
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$9.prototype, "title", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$9.prototype, "expression", void 0), __decorate([a$9({
	type: ["dictionary"],
	readOnly: !0,
	json: {
		read: !1,
		write: !0
	}
})], i$9.prototype, "returnType", void 0), i$9 = s$11 = __decorate([c$5("esri.popup.ElementExpressionInfo")], i$9);
var p$12 = i$9;
//#endregion
//#region node_modules/@arcgis/core/popup/content/ExpressionContent.js
var n$7;
var p$11 = n$7 = class extends p$14 {
	constructor(o) {
		super(o), this.expressionInfo = null, this.type = "expression";
	}
	clone() {
		return new n$7({ expressionInfo: this.expressionInfo?.clone() });
	}
};
__decorate([a$9({
	type: p$12,
	json: { write: !0 }
})], p$11.prototype, "expressionInfo", void 0), __decorate([a$9({
	type: ["expression"],
	readOnly: !0,
	json: {
		read: !1,
		write: !0
	}
})], p$11.prototype, "type", void 0), p$11 = n$7 = __decorate([c$5("esri.popup.content.ExpressionContent")], p$11);
var i$8 = p$11;
//#endregion
//#region node_modules/@arcgis/core/popup/FieldInfo.js
var f$1 = class extends l$7(n$11) {
	constructor(t) {
		super(t), this.fieldName = null, this.isEditable = !0, this.label = null, this.statisticType = null, this.stringFieldOption = "text-box", this.tooltip = null, this.visible = !0;
	}
	set fieldFormat(t) {
		this._set("fieldFormat", t), this._set("format", t ? x$2(t) : null);
	}
	set format(t) {
		this._set("format", t), this._set("fieldFormat", t ? h(t) : null);
	}
	readFormat(t, o) {
		if (!o.fieldFormat) return t ? m$2.fromJSON(t) : null;
	}
	clone() {
		const t = super.clone();
		return t._set("format", this.format?.clone()), t._set("fieldFormat", this.fieldFormat?.clone()), t;
	}
};
__decorate([a$9({
	value: null,
	clonable: !1,
	types: c$6,
	json: { write: { overridePolicy(t, o, e) {
		const { fieldName: r } = this;
		return { enabled: !!r && !r.startsWith("expression/") && !r.startsWith("relationships/") && !!e?.writeFieldFormat };
	} } }
})], f$1.prototype, "fieldFormat", null), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], f$1.prototype, "fieldName", void 0), __decorate([a$9({
	value: null,
	clonable: !1,
	type: m$2,
	json: { write: !0 }
})], f$1.prototype, "format", null), __decorate([o("format")], f$1.prototype, "readFormat", null), __decorate([a$9({
	type: Boolean,
	json: {
		write: { alwaysWriteDefaults: !0 },
		default: !0
	}
})], f$1.prototype, "isEditable", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], f$1.prototype, "label", void 0), __decorate([a$9({
	type: [
		"count",
		"sum",
		"min",
		"max",
		"avg",
		"stddev",
		"var"
	],
	json: { write: !0 }
})], f$1.prototype, "statisticType", void 0), __decorate([r(new o$1({
	richtext: "rich-text",
	textarea: "text-area",
	textbox: "text-box"
}), { default: "text-box" })], f$1.prototype, "stringFieldOption", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], f$1.prototype, "tooltip", void 0), __decorate([a$9({
	type: Boolean,
	json: { write: !0 }
})], f$1.prototype, "visible", void 0), f$1 = __decorate([c$5("esri.popup.FieldInfo")], f$1);
var u$2 = f$1;
//#endregion
//#region node_modules/@arcgis/core/popup/content/FieldsContent.js
var n$6;
var p$10 = n$6 = class extends p$14 {
	constructor(t) {
		super(t), this.attributes = null, this.description = null, this.fieldInfos = null, this.title = null, this.type = "fields";
	}
	clone() {
		return new n$6(a$8({
			attributes: this.attributes,
			description: this.description,
			fieldInfos: this.fieldInfos,
			title: this.title
		}));
	}
};
__decorate([a$9({
	type: Object,
	json: { write: !0 }
})], p$10.prototype, "attributes", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], p$10.prototype, "description", void 0), __decorate([a$9({
	type: [u$2],
	json: { write: !0 }
})], p$10.prototype, "fieldInfos", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], p$10.prototype, "title", void 0), __decorate([a$9({
	type: ["fields"],
	readOnly: !0,
	json: {
		read: !1,
		write: { isRequired: !0 }
	}
})], p$10.prototype, "type", void 0), p$10 = n$6 = __decorate([c$5("esri.popup.content.FieldsContent")], p$10);
var l$5 = p$10;
//#endregion
//#region node_modules/@arcgis/core/popup/content/mixins/MediaInfo.js
var i$7 = class extends n$11 {
	constructor(t) {
		super(t), this.altText = null, this.caption = "", this.title = "", this.type = null;
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$7.prototype, "altText", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$7.prototype, "caption", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$7.prototype, "title", void 0), __decorate([a$9({
	type: [
		"image",
		"bar-chart",
		"column-chart",
		"line-chart",
		"pie-chart"
	],
	readOnly: !0,
	json: {
		read: !1,
		write: !0
	}
})], i$7.prototype, "type", void 0), i$7 = __decorate([c$5("esri.popup.content.mixins.MediaInfo")], i$7);
var p$9 = i$7;
//#endregion
//#region node_modules/@arcgis/core/popup/content/support/ChartMediaInfoValueSeries.js
var l$4;
var i$6 = l$4 = class extends b {
	constructor(o) {
		super(o), this.color = null, this.fieldName = null, this.tooltip = null, this.value = null;
	}
	clone() {
		return new l$4({
			color: this.color?.clone(),
			fieldName: this.fieldName,
			tooltip: this.tooltip,
			value: this.value
		});
	}
};
__decorate([a$9()], i$6.prototype, "color", void 0), __decorate([a$9()], i$6.prototype, "fieldName", void 0), __decorate([a$9()], i$6.prototype, "tooltip", void 0), __decorate([a$9()], i$6.prototype, "value", void 0), i$6 = l$4 = __decorate([c$5("esri.popup.content.support.ChartMediaInfoValueSeries")], i$6);
var s$10 = i$6;
//#endregion
//#region node_modules/@arcgis/core/popup/content/support/ChartMediaInfoValue.js
var n$5;
var d$1 = n$5 = class extends n$11 {
	constructor(o) {
		super(o), this.colors = null, this.fields = [], this.normalizeField = null, this.series = [], this.tooltipField = null;
	}
	clone() {
		return new n$5({
			colors: a$8(this.colors),
			fields: a$8(this.fields),
			normalizeField: this.normalizeField,
			series: a$8(this.series),
			tooltipField: this.tooltipField
		});
	}
};
__decorate([a$9({
	type: [g],
	json: {
		type: [[D]],
		write: !0
	}
})], d$1.prototype, "colors", void 0), __decorate([a$9({
	type: [String],
	json: { write: { isRequired: !0 } }
})], d$1.prototype, "fields", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], d$1.prototype, "normalizeField", void 0), __decorate([a$9({
	type: [s$10],
	json: { read: !1 }
})], d$1.prototype, "series", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], d$1.prototype, "tooltipField", void 0), d$1 = n$5 = __decorate([c$5("esri.popup.content.support.ChartMediaInfoValue")], d$1);
var a$7 = d$1;
//#endregion
//#region node_modules/@arcgis/core/popup/content/mixins/ChartMediaInfo.js
var p$8 = class extends p$9 {
	constructor(t) {
		super(t), this.type = null, this.value = void 0;
	}
};
__decorate([a$9({
	type: [
		"bar-chart",
		"column-chart",
		"line-chart",
		"pie-chart"
	],
	readOnly: !0,
	json: {
		read: !1,
		write: !0
	}
})], p$8.prototype, "type", void 0), __decorate([a$9({
	type: a$7,
	json: { write: { isRequired: !0 } }
})], p$8.prototype, "value", void 0), p$8 = __decorate([c$5("esri.popup.content.mixins.ChartMediaInfo")], p$8);
var s$9 = p$8;
//#endregion
//#region node_modules/@arcgis/core/popup/content/support/chartMediaInfoUtils.js
var c$3 = i$12()({
	barchart: "bar-chart",
	columnchart: "column-chart",
	linechart: "line-chart",
	piechart: "pie-chart"
});
//#endregion
//#region node_modules/@arcgis/core/popup/content/BarChartMediaInfo.js
var i$5;
var s$8 = i$5 = class extends s$9 {
	constructor(t) {
		super(t), this.type = "bar-chart";
	}
	clone() {
		return new i$5({
			altText: this.altText,
			title: this.title,
			caption: this.caption,
			value: this.value?.clone()
		});
	}
};
__decorate([a$9({
	type: ["bar-chart"],
	readOnly: !0,
	json: {
		type: ["barchart"],
		read: !1,
		write: {
			writer: c$3.write,
			isRequired: !0
		}
	}
})], s$8.prototype, "type", void 0), s$8 = i$5 = __decorate([c$5("esri.popup.content.BarChartMediaInfo")], s$8);
var p$7 = s$8;
//#endregion
//#region node_modules/@arcgis/core/popup/content/ColumnChartMediaInfo.js
var s$7;
var a$6 = s$7 = class extends s$9 {
	constructor(t) {
		super(t), this.type = "column-chart";
	}
	clone() {
		return new s$7({
			altText: this.altText,
			title: this.title,
			caption: this.caption,
			value: this.value?.clone()
		});
	}
};
__decorate([a$9({
	type: ["column-chart"],
	readOnly: !0,
	json: {
		type: ["columnchart"],
		read: !1,
		write: {
			writer: c$3.write,
			isRequired: !0
		}
	}
})], a$6.prototype, "type", void 0), a$6 = s$7 = __decorate([c$5("esri.popup.content.ColumnChartMediaInfo")], a$6);
var n$4 = a$6;
//#endregion
//#region node_modules/@arcgis/core/popup/content/support/ImageMediaInfoValue.js
var s$6;
var i$4 = s$6 = class extends n$11 {
	constructor(o) {
		super(o), this.linkURL = null, this.sourceURL = null;
	}
	clone() {
		return new s$6({
			linkURL: this.linkURL,
			sourceURL: this.sourceURL
		});
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$4.prototype, "linkURL", void 0), __decorate([a$9({
	type: String,
	json: { write: { isRequired: !0 } }
})], i$4.prototype, "sourceURL", void 0), i$4 = s$6 = __decorate([c$5("esri.popup.content.support.ImageMediaInfoValue")], i$4);
var p$6 = i$4;
//#endregion
//#region node_modules/@arcgis/core/popup/content/ImageMediaInfo.js
var s$5;
var a$5 = s$5 = class extends p$9 {
	constructor(e) {
		super(e), this.refreshInterval = 0, this.type = "image", this.value = void 0;
	}
	clone() {
		return new s$5({
			altText: this.altText,
			title: this.title,
			caption: this.caption,
			refreshInterval: this.refreshInterval,
			value: this.value?.clone()
		});
	}
};
__decorate([a$9({
	type: Number,
	json: { write: !0 }
})], a$5.prototype, "refreshInterval", void 0), __decorate([a$9({
	type: ["image"],
	readOnly: !0,
	json: {
		read: !1,
		write: { isRequired: !0 }
	}
})], a$5.prototype, "type", void 0), __decorate([a$9({
	type: p$6,
	json: { write: { isRequired: !0 } }
})], a$5.prototype, "value", void 0), a$5 = s$5 = __decorate([c$5("esri.popup.content.ImageMediaInfo")], a$5);
var p$5 = a$5;
//#endregion
//#region node_modules/@arcgis/core/popup/content/LineChartMediaInfo.js
var s$4;
var a$4 = s$4 = class extends s$9 {
	constructor(t) {
		super(t), this.type = "line-chart";
	}
	clone() {
		return new s$4({
			altText: this.altText,
			title: this.title,
			caption: this.caption,
			value: this.value?.clone()
		});
	}
};
__decorate([a$9({
	type: ["line-chart"],
	readOnly: !0,
	json: {
		type: ["linechart"],
		read: !1,
		write: {
			writer: c$3.write,
			isRequired: !0
		}
	}
})], a$4.prototype, "type", void 0), a$4 = s$4 = __decorate([c$5("esri.popup.content.LineChartMediaInfo")], a$4);
var n$3 = a$4;
//#endregion
//#region node_modules/@arcgis/core/popup/content/PieChartMediaInfo.js
var s$3;
var p$4 = s$3 = class extends s$9 {
	constructor(t) {
		super(t), this.type = "pie-chart";
	}
	clone() {
		return new s$3({
			altText: this.altText,
			title: this.title,
			caption: this.caption,
			value: this.value?.clone()
		});
	}
};
__decorate([a$9({
	type: ["pie-chart"],
	readOnly: !0,
	json: {
		type: ["piechart"],
		read: !1,
		write: {
			writer: c$3.write,
			isRequired: !0
		}
	}
})], p$4.prototype, "type", void 0), p$4 = s$3 = __decorate([c$5("esri.popup.content.PieChartMediaInfo")], p$4);
var a$3 = p$4;
//#endregion
//#region node_modules/@arcgis/core/popup/content/support/mediaInfoTypes.js
var m = {
	base: p$9,
	key: "type",
	defaultKeyValue: "image",
	typeMap: {
		"bar-chart": p$7,
		"column-chart": n$4,
		"line-chart": n$3,
		"pie-chart": a$3,
		image: p$5
	}
};
//#endregion
//#region node_modules/@arcgis/core/popup/content/MediaContent.js
var l$3;
var I = l$3 = class extends p$14 {
	constructor(t) {
		super(t), this.activeMediaInfoIndex = null, this.attributes = null, this.description = null, this.mediaInfos = null, this.title = null, this.type = "media";
	}
	readMediaInfos(t) {
		return t && t.map((t) => "image" === t.type ? p$5.fromJSON(t) : "barchart" === t.type ? p$7.fromJSON(t) : "columnchart" === t.type ? n$4.fromJSON(t) : "linechart" === t.type ? n$3.fromJSON(t) : "piechart" === t.type ? a$3.fromJSON(t) : void 0).filter(Boolean);
	}
	writeMediaInfos(t, e) {
		e.mediaInfos = t && t.map((t) => t.toJSON());
	}
	clone() {
		return new l$3(a$8({
			activeMediaInfoIndex: this.activeMediaInfoIndex,
			attributes: this.attributes,
			description: this.description,
			mediaInfos: this.mediaInfos,
			title: this.title
		}));
	}
};
__decorate([a$9()], I.prototype, "activeMediaInfoIndex", void 0), __decorate([a$9({
	type: Object,
	json: { write: !0 }
})], I.prototype, "attributes", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], I.prototype, "description", void 0), __decorate([a$9({ types: [m] })], I.prototype, "mediaInfos", void 0), __decorate([o("mediaInfos")], I.prototype, "readMediaInfos", null), __decorate([r$1("mediaInfos")], I.prototype, "writeMediaInfos", null), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], I.prototype, "title", void 0), __decorate([a$9({
	type: ["media"],
	readOnly: !0,
	json: {
		read: !1,
		write: { isRequired: !0 }
	}
})], I.prototype, "type", void 0), I = l$3 = __decorate([c$5("esri.popup.content.MediaContent")], I);
var u$1 = I;
//#endregion
//#region node_modules/@arcgis/core/popup/support/RelatedRecordsInfoFieldOrder.js
var s$2;
var p$3 = s$2 = class extends n$11 {
	constructor(r) {
		super(r), this.field = null, this.order = null;
	}
	clone() {
		return new s$2({
			field: this.field,
			order: this.order
		});
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], p$3.prototype, "field", void 0), __decorate([a$9({
	type: ["asc", "desc"],
	json: { write: !0 }
})], p$3.prototype, "order", void 0), p$3 = s$2 = __decorate([c$5("esri.popup.support.RelatedRecordsInfoFieldOrder")], p$3);
var i$3 = p$3;
//#endregion
//#region node_modules/@arcgis/core/popup/content/RelationshipContent.js
var n$2 = class extends l$7(p$14) {
	constructor(t) {
		super(t), this.description = null, this.displayCount = null, this.displayType = "list", this.orderByFields = null, this.relationshipId = null, this.title = null, this.type = "relationship";
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], n$2.prototype, "description", void 0), __decorate([a$9({
	type: Number,
	json: {
		type: D,
		write: !0
	}
})], n$2.prototype, "displayCount", void 0), __decorate([a$9({
	type: ["list"],
	json: { write: { isRequired: !0 } }
})], n$2.prototype, "displayType", void 0), __decorate([a$9({
	type: [i$3],
	json: { write: !0 }
})], n$2.prototype, "orderByFields", void 0), __decorate([a$9({
	type: Number,
	json: {
		type: D,
		write: { isRequired: !0 }
	}
})], n$2.prototype, "relationshipId", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], n$2.prototype, "title", void 0), __decorate([a$9({
	type: ["relationship"],
	readOnly: !0,
	json: {
		read: !1,
		write: { isRequired: !0 }
	}
})], n$2.prototype, "type", void 0), n$2 = __decorate([c$5("esri.popup.content.RelationshipContent")], n$2);
var l$2 = n$2;
//#endregion
//#region node_modules/@arcgis/core/popup/content/TextContent.js
var s$1;
var p$2 = s$1 = class extends p$14 {
	constructor(t) {
		super(t), this.text = null, this.type = "text";
	}
	clone() {
		return new s$1({ text: this.text });
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], p$2.prototype, "text", void 0), __decorate([a$9({
	type: ["text"],
	readOnly: !0,
	json: {
		read: !1,
		write: { isRequired: !0 }
	}
})], p$2.prototype, "type", void 0), p$2 = s$1 = __decorate([c$5("esri.popup.content.TextContent")], p$2);
var n$1 = p$2;
//#endregion
//#region node_modules/@arcgis/core/popup/support/UtilityNetworkAssociationType.js
var i$2 = class extends l$7(n$11) {
	constructor(t) {
		super(t), this.title = null, this.description = null, this.type = null, this.associatedNetworkSourceId = null, this.associatedAssetGroup = null, this.associatedAssetType = null;
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$2.prototype, "title", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$2.prototype, "description", void 0), __decorate([a$9({
	type: [
		"attachment",
		"connectivity",
		"container",
		"content",
		"structure"
	],
	json: { write: !0 }
})], i$2.prototype, "type", void 0), __decorate([a$9({
	type: Number,
	json: {
		type: D,
		write: !0
	}
})], i$2.prototype, "associatedNetworkSourceId", void 0), __decorate([a$9({
	type: Number,
	json: {
		type: D,
		write: !0
	}
})], i$2.prototype, "associatedAssetGroup", void 0), __decorate([a$9({
	type: Number,
	json: {
		type: D,
		write: !0
	}
})], i$2.prototype, "associatedAssetType", void 0), i$2 = __decorate([c$5("esri.popup.support.UtilityNetworkAssociationType")], i$2);
var c$2 = i$2;
//#endregion
//#region node_modules/@arcgis/core/popup/content/UtilityNetworkAssociationsContent.js
var c$1 = class extends l$7(p$14) {
	constructor(t) {
		super(t), this.description = null, this.displayCount = null, this.title = null, this.associationTypes = [], this.type = "utility-network-associations";
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], c$1.prototype, "description", void 0), __decorate([a$9({
	type: Number,
	json: {
		type: D,
		write: !0
	}
})], c$1.prototype, "displayCount", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], c$1.prototype, "title", void 0), __decorate([a$9({
	type: [c$2],
	json: { write: !0 }
})], c$1.prototype, "associationTypes", void 0), __decorate([r({ utilityNetworkAssociations: "utility-network-associations" })], c$1.prototype, "type", void 0), c$1 = __decorate([c$5("esri.popup.content.UtilityNetworkAssociationsContent")], c$1);
var a$2 = c$1;
//#endregion
//#region node_modules/@arcgis/core/popup/content.js
var a$1 = n$8, c = p$14, f = l$6, l$1 = i$8, C = l$5, j = u$1, y = l$2, x = n$1, d = a$2;
var u = {
	base: null,
	key: "type",
	typeMap: {
		attachment: a$1,
		media: j,
		text: x,
		expression: l$1,
		field: C,
		relationship: y,
		utilityNetworkAssociations: d
	}
}, k$1 = {
	base: null,
	key: "type",
	typeMap: {
		attachment: a$1,
		media: j,
		text: x,
		expression: l$1,
		field: C,
		relationship: y
	}
};
//#endregion
//#region node_modules/@arcgis/core/popup/ExpressionInfo.js
var s;
var i$1 = s = class extends n$11 {
	constructor(t) {
		super(t), this.name = null, this.title = null, this.expression = null, this.returnType = null;
	}
	clone() {
		return new s({
			name: this.name,
			title: this.title,
			expression: this.expression,
			returnType: this.returnType
		});
	}
};
__decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$1.prototype, "name", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$1.prototype, "title", void 0), __decorate([a$9({
	type: String,
	json: { write: !0 }
})], i$1.prototype, "expression", void 0), __decorate([a$9({
	type: ["string", "number"],
	json: { write: !0 }
})], i$1.prototype, "returnType", void 0), i$1 = s = __decorate([c$5("esri.popup.ExpressionInfo")], i$1);
var n = i$1;
//#endregion
//#region node_modules/@arcgis/core/popup/LayerOptions.js
var e;
var p$1 = e = class extends n$11 {
	constructor(o) {
		super(o), this.returnTopmostRaster = null, this.showNoDataRecords = null;
	}
	clone() {
		return new e({
			showNoDataRecords: this.showNoDataRecords,
			returnTopmostRaster: this.returnTopmostRaster
		});
	}
};
__decorate([a$9({
	type: Boolean,
	json: { write: !0 }
})], p$1.prototype, "returnTopmostRaster", void 0), __decorate([a$9({
	type: Boolean,
	json: { write: !0 }
})], p$1.prototype, "showNoDataRecords", void 0), p$1 = e = __decorate([c$5("esri.popup.LayerOptions")], p$1);
var a = p$1;
//#endregion
//#region node_modules/@arcgis/core/popup/RelatedRecordsInfo.js
var l;
var i = l = class extends n$11 {
	constructor(e) {
		super(e), this.showRelatedRecords = null, this.orderByFields = null;
	}
	clone() {
		return new l({
			showRelatedRecords: this.showRelatedRecords,
			orderByFields: this.orderByFields ? a$8(this.orderByFields) : null
		});
	}
};
__decorate([a$9({
	type: Boolean,
	json: { write: !0 }
})], i.prototype, "showRelatedRecords", void 0), __decorate([a$9({
	type: [i$3],
	json: { write: !0 }
})], i.prototype, "orderByFields", void 0), i = l = __decorate([c$5("esri.popup.RelatedRecordsInfo")], i);
var p = i;
//#endregion
//#region node_modules/@arcgis/core/PopupTemplate.js
var B = "relationships/", L = "expression/", M = q$1.ofType({
	key: "type",
	defaultKeyValue: "button",
	base: p$15,
	typeMap: {
		button: a$10,
		toggle: r$2
	}
}), P = {
	base: c,
	key: "type",
	typeMap: {
		media: j,
		custom: f,
		text: x,
		attachments: a$1,
		fields: C,
		expression: l$1,
		relationship: y,
		utilityNetworkAssociations: d
	}
}, W = new Set([
	"attachments",
	"fields",
	"media",
	"text",
	"expression",
	"relationship"
]), k = new Set([...W, "utility-network-associations"]);
var U = class extends l$7(n$11) {
	constructor(t) {
		super(t), this.actions = null, this.expressionInfos = null, this.fieldInfos = null, this.layerOptions = null, this.lastEditInfoEnabled = !0, this.outFields = null, this.overwriteActions = !1, this.returnGeometry = !1, this.title = "";
	}
	get content() {
		return this._get("content") ?? "";
	}
	set content(t) {
		this._set("content", t);
	}
	castContent(t) {
		return Array.isArray(t) ? t.map((t) => x$1(P, t)) : "string" == typeof t || "function" == typeof t || t instanceof HTMLElement || C$1(t) ? t : (n$10.getLogger(this).error("content error", "unsupported content value", { value: t }), null);
	}
	readContent(t, e) {
		const { popupElements: o } = e;
		return Array.isArray(o) && o.length > 0 ? this._readPopupInfoElements(e.description, e.mediaInfos, o) : this._readPopupInfo(e);
	}
	writeWebSceneContent(t, e, o, s) {
		this._writePopupTemplateContent(t, e, s);
	}
	writeWebMapContent(t, e, o, s) {
		this._writePopupTemplateContent(t, e, s);
	}
	writeFieldInfos(t, e, o, s) {
		const { content: i } = this, r = Array.isArray(i) ? i : null, { writeFieldFormat: n, ...p } = s || {};
		if (t) {
			const o = r ? r.filter((t) => "fields" === t.type) : [], s = o.length && o.every((t) => t.fieldInfos?.length);
			e.fieldInfos = t.filter(Boolean).map((t) => {
				const e = t.toJSON(p);
				return s && (e.visible = !1), e;
			});
		}
		if (r) for (const l of r) "fields" === l.type && this._writeFieldsContent(l, e, p);
	}
	writeLayerOptions(t, e, o, s) {
		e[o] = !t || null === t.showNoDataRecords && null === t.returnTopmostRaster ? null : t.toJSON(s);
	}
	writeTitle(t, e) {
		e.title = t || "";
	}
	async collectRequiredFields(t, e, o) {
		const s = this.expressionInfos || [];
		await this._collectExpressionInfoFields(t, e, o, [...s, ...this._getContentExpressionInfos(this.content, s)]), w(t, e, [
			...this.outFields || [],
			...this._getActionsFields(this.actions),
			...this._getTitleFields(this.title),
			...this._getContentFields(this.content)
		]);
	}
	async getRequiredFields(t, e) {
		const o = /* @__PURE__ */ new Set();
		return await this.collectRequiredFields(o, t, e), [...o].sort();
	}
	_writePopupTemplateContent(t, e, o) {
		"string" != typeof t ? Array.isArray(t) && (e.popupElements = t.filter((t) => "web-scene" === o?.origin ? W.has(t.type) : k.has(t.type)).map((t) => t?.toJSON(o)), e.popupElements.forEach((t) => {
			"attachments" === t.type ? this._writeAttachmentContent(e) : "media" === t.type ? this._writeMediaContent(t, e) : "text" === t.type ? this._writeTextContent(t, e) : "relationship" === t.type && this._writeRelationshipContent(t, e);
		})) : e.description = t;
	}
	_writeFieldsContent(t, e, o) {
		const s = t.fieldInfos;
		if (!Array.isArray(s) || !s.length) return;
		const i = e.fieldInfos;
		if (Array.isArray(i)) for (const r of s) {
			const t = i.find((t) => t.fieldName?.toLowerCase() === r.fieldName?.toLowerCase());
			t ? t.visible = !0 : i.push(r.toJSON(o));
		}
		else e.fieldInfos = s.map((t) => t.toJSON(o));
	}
	_writeAttachmentContent(t) {
		t.showAttachments || (t.showAttachments = !0);
	}
	_writeRelationshipContent(t, e) {
		const o = t.orderByFields?.map((e) => this._toFieldOrderJSON(e, t.relationshipId)) || [], s = [...e.relatedRecordsInfo?.orderByFields || [], ...o];
		e.relatedRecordsInfo = {
			showRelatedRecords: !0,
			...s?.length && { orderByFields: s }
		};
	}
	_writeTextContent(t, e) {
		!e.description && t.text && (e.description = t.text);
	}
	_writeMediaContent(t, e) {
		if (!Array.isArray(t.mediaInfos) || !t.mediaInfos.length) return;
		const o = a$8(t.mediaInfos);
		Array.isArray(e.mediaInfos) ? e.mediaInfos = [...e.mediaInfos, ...o] : e.mediaInfos = o;
	}
	_readPopupInfoElements(t, e, o) {
		const s = {
			description: !1,
			mediaInfos: !1
		};
		return o.map((o) => "media" === o.type ? (o.mediaInfos || !e || s.mediaInfos || (o.mediaInfos = e, s.mediaInfos = !0), j.fromJSON(o)) : "text" === o.type ? (o.text || !t || s.description || (o.text = t, s.description = !0), x.fromJSON(o)) : "attachments" === o.type ? a$1.fromJSON(o) : "fields" === o.type ? C.fromJSON(o) : "expression" === o.type ? l$1.fromJSON(o) : "relationship" === o.type ? y.fromJSON(o) : "utilityNetworkAssociations" === o.type ? d.fromJSON(o) : void 0).filter(Boolean);
	}
	_toRelationshipContent(t) {
		const { field: e, order: o } = t;
		if (!e?.startsWith(B)) return null;
		const s = e.replace(B, "").split("/");
		if (2 !== s.length) return null;
		const i = parseInt(s[0], 10), r = s[1];
		return !Number.isNaN(i) && r ? y.fromJSON({
			relationshipId: i,
			orderByFields: [{
				field: r,
				order: o
			}]
		}) : null;
	}
	_toFieldOrderJSON(t, e) {
		const { order: o, field: s } = t;
		return {
			field: `${B}${e}/${s}`,
			order: o
		};
	}
	_readPopupInfo({ description: t, mediaInfos: e, showAttachments: o, relatedRecordsInfo: s = { showRelatedRecords: !1 } }) {
		const i = [];
		t ? i.push(new x({ text: t })) : i.push(new C()), Array.isArray(e) && e.length && i.push(j.fromJSON({ mediaInfos: e })), o && i.push(a$1.fromJSON({ displayType: "auto" }));
		const { showRelatedRecords: r, orderByFields: n } = s;
		return r && n?.length && n.forEach((t) => {
			const e = this._toRelationshipContent(t);
			e && i.push(e);
		}), i.length ? i : t;
	}
	_getContentElementFields(t) {
		const e = t?.type;
		if ("attachments" === e) return [...this._extractFieldNames(t.title), ...this._extractFieldNames(t.description)];
		if ("custom" === e) return t.outFields || [];
		if ("fields" === e) return [
			...this._extractFieldNames(t.title),
			...this._extractFieldNames(t.description),
			...this._getFieldInfoFields(t.fieldInfos ?? this.fieldInfos)
		];
		if ("media" === e) {
			const e = t.mediaInfos || [];
			return [
				...this._extractFieldNames(t.title),
				...this._extractFieldNames(t.description),
				...e.reduce((t, e) => [...t, ...this._getMediaInfoFields(e)], [])
			];
		}
		return "text" === e ? this._extractFieldNames(t.text) : "relationship" === e || "utility-network-associations" === e ? [...this._extractFieldNames(t.title), ...this._extractFieldNames(t.description)] : [];
	}
	_getMediaInfoFields(t) {
		const { caption: e, title: o, value: s } = t, { fields: r, normalizeField: n, tooltipField: p, sourceURL: l, linkURL: a } = s || {}, d = [
			...this._extractFieldNames(o),
			...this._extractFieldNames(e),
			...this._extractFieldNames(l),
			...this._extractFieldNames(a),
			...r ?? []
		];
		return n && d.push(n), p && d.push(p), d;
	}
	_getContentExpressionInfos(t, e) {
		return Array.isArray(t) ? t.reduce((t, e) => [...t, ..."expression" === e.type && e.expressionInfo ? [e.expressionInfo] : []], e) : [];
	}
	_getContentFields(t) {
		return "string" == typeof t ? this._extractFieldNames(t) : Array.isArray(t) ? t.reduce((t, e) => [...t, ...this._getContentElementFields(e)], []) : [];
	}
	async _collectExpressionInfoFields(t, e, o, s) {
		s && await Promise.all(s.map((s) => v(t, e, o, s.expression)));
	}
	_getFieldInfoFields(t) {
		return t ? t.filter(({ fieldName: t, visible: e }) => !(void 0 !== e && !e || !t || t.startsWith(B) || t.startsWith(L))).map((t) => t.fieldName) : [];
	}
	_getActionsFields(t) {
		return t ? t.toArray().reduce((t, e) => [...t, ...this._getActionFields(e)], []) : [];
	}
	_getActionFields(t) {
		const { className: e, title: o, type: s } = t, i = "button" === s || "toggle" === s ? t.image : "";
		return [
			...this._extractFieldNames(o),
			...this._extractFieldNames(e),
			...this._extractFieldNames(i)
		];
	}
	_getTitleFields(t) {
		return "string" == typeof t ? this._extractFieldNames(t) : [];
	}
	_extractFieldNames(t) {
		return Be(t).filter((t) => !(t.startsWith(B) || t.startsWith(L)));
	}
};
__decorate([a$9({ type: M })], U.prototype, "actions", void 0), __decorate([a$9()], U.prototype, "content", null), __decorate([m$1("content")], U.prototype, "castContent", null), __decorate([o("content", [
	"description",
	"fieldInfos",
	"popupElements",
	"mediaInfos",
	"showAttachments",
	"relatedRecordsInfo"
])], U.prototype, "readContent", null), __decorate([r$1("web-scene", "content", {
	popupElements: { type: q$1.ofType(k$1) },
	showAttachments: { type: Boolean },
	mediaInfos: { type: q$1.ofType(m) },
	description: { type: String },
	relatedRecordsInfo: { type: p }
})], U.prototype, "writeWebSceneContent", null), __decorate([r$1("content", {
	popupElements: { type: q$1.ofType(u) },
	showAttachments: { type: Boolean },
	mediaInfos: { type: q$1.ofType(m) },
	description: { type: String },
	relatedRecordsInfo: { type: p }
})], U.prototype, "writeWebMapContent", null), __decorate([a$9({
	type: [n],
	json: { write: !0 }
})], U.prototype, "expressionInfos", void 0), __decorate([a$9({ type: [u$2] })], U.prototype, "fieldInfos", void 0), __decorate([r$1("fieldInfos")], U.prototype, "writeFieldInfos", null), __decorate([a$9({ type: a })], U.prototype, "layerOptions", void 0), __decorate([r$1("layerOptions")], U.prototype, "writeLayerOptions", null), __decorate([a$9({
	type: Boolean,
	json: {
		read: { source: "showLastEditInfo" },
		write: { target: "showLastEditInfo" },
		default: !0
	}
})], U.prototype, "lastEditInfoEnabled", void 0), __decorate([a$9()], U.prototype, "outFields", void 0), __decorate([a$9()], U.prototype, "overwriteActions", void 0), __decorate([a$9()], U.prototype, "returnGeometry", void 0), __decorate([a$9({ json: { type: String } })], U.prototype, "title", void 0), __decorate([r$1("title")], U.prototype, "writeTitle", null), U = __decorate([c$5("esri.PopupTemplate")], U);
var q = U;
//#endregion
export { x as a, i$3 as c, u$2 as d, p$12 as f, j as i, s$10 as l, c$4 as m, n, c$2 as o, n$8 as p, C as r, n$1 as s, q as t, l$5 as u };

//# sourceMappingURL=PopupTemplate-8SH37QID.js.map