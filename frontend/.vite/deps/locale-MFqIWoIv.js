import { N as css, O as html, l as safeClassMap, r as customElement, s as LitElement, t as CSS_UTILITY, u as safeStyleMap } from "./runtime-C8rHe43j.js";
import { a as getElementDir } from "./dom-DTFGtTyI.js";
import { n as numberKeys } from "./key-B4sCl0gN.js";
//#region node_modules/@esri/calcite-components/dist/components/calcite-progress/customElement.js
var styles = css`:host{position:relative;display:block;inline-size:100%}.track,.bar{position:absolute;inset-block-start:0px;block-size:2px}.track{z-index:var(--calcite-z-index);inline-size:100%;overflow:hidden;background-color:var(--calcite-progress-background-color, var(--calcite-color-border-3))}.bar{z-index:var(--calcite-z-index);background-color:var(--calcite-progress-fill-color, var(--calcite-color-brand))}@media(forced-colors:active){.track{background-color:highlightText}.bar{background-color:linkText}}.indeterminate{inline-size:20%;animation:looping-progress-bar-ani calc(var(--calcite-internal-animation-timing-medium) / var(--calcite-internal-duration-factor) * 11 / var(--calcite-internal-duration-factor)) linear infinite}.indeterminate.calcite--rtl{animation-name:looping-progress-bar-ani-rtl}.reversed{animation-direction:reverse}.text{padding-inline:0px;padding-block:1rem 0px;text-align:center;font-size:var(--calcite-font-size-relative-sm);line-height:var(--calcite-font-line-height-sm);font-weight:var(--calcite-font-weight-medium);color:var(--calcite-progress-text-color, var(--calcite-color-text-2))}@keyframes looping-progress-bar-ani{0%{transform:translate3d(-100%,0,0)}50%{inline-size:40%}to{transform:translate3d(600%,0,0)}}@keyframes looping-progress-bar-ani-rtl{0%{transform:translate3d(100%,0,0)}50%{inline-size:40%}to{transform:translate3d(-600%,0,0)}}:host([hidden]){display:none}[hidden]{display:none}`;
var CSS = {
	track: "track",
	bar: "bar",
	text: "text"
};
var Progress = class extends LitElement {
	constructor() {
		super(...arguments);
		this.reversed = false;
		this.type = "determinate";
		this.value = 0;
	}
	static {
		this.properties = {
			label: 1,
			reversed: [
				7,
				{},
				{
					reflect: true,
					type: Boolean
				}
			],
			text: 1,
			type: [
				3,
				{},
				{ reflect: true }
			],
			value: [
				9,
				{},
				{ type: Number }
			]
		};
	}
	static {
		this.styles = styles;
	}
	render() {
		const isDeterminate = this.type === "determinate";
		const barStyles = isDeterminate ? { width: `${this.value}%` } : {};
		const dir = getElementDir(this.el);
		return html`<div .ariaLabel=${this.label || this.text} .ariaValueMax=${isDeterminate ? "100" : void 0} .ariaValueMin=${isDeterminate ? "0" : void 0} .ariaValueNow=${isDeterminate ? this.value : void 0} role=progressbar><div class=${safeClassMap(CSS.track)}><div class=${safeClassMap({
			[CSS.bar]: true,
			indeterminate: this.type === "indeterminate",
			[CSS_UTILITY.rtl]: dir === "rtl",
			reversed: this.reversed
		})} style=${safeStyleMap(barStyles)}></div></div>${this.text ? html`<div class=${safeClassMap(CSS.text)}>${this.text}</div>` : null}</div>`;
	}
};
customElement("calcite-progress", Progress);
//#endregion
//#region node_modules/@esri/calcite-components/dist/chunks/locale.js
var unnecessaryDecimal = new RegExp(`\\.(0+)?$`);
var trailingZeros = /* @__PURE__ */ new RegExp("0+$");
var BigDecimal = class BigDecimal {
	static {
		this.DECIMALS = 100;
	}
	static {
		this.ROUNDED = true;
	}
	static {
		this.SHIFT = BigInt("1" + "0".repeat(this.DECIMALS));
	}
	constructor(input) {
		if (input instanceof BigDecimal) return input;
		const [integers, decimals] = expandExponentialNumberString(input).split(".").concat("");
		this.value = BigInt(integers + decimals.padEnd(BigDecimal.DECIMALS, "0").slice(0, BigDecimal.DECIMALS)) + BigInt(BigDecimal.ROUNDED && decimals[BigDecimal.DECIMALS] >= "5");
		this.isNegative = input.charAt(0) === "-";
	}
	static {
		this._divRound = (dividend, divisor) => BigDecimal.fromBigInt(dividend / divisor + (BigDecimal.ROUNDED ? dividend * BigInt(2) / divisor % BigInt(2) : BigInt(0)));
	}
	static {
		this.fromBigInt = (bigint) => Object.assign(Object.create(BigDecimal.prototype), {
			value: bigint,
			isNegative: bigint < BigInt(0)
		});
	}
	getIntegersAndDecimals() {
		const s = this.value.toString().replace("-", "").padStart(BigDecimal.DECIMALS + 1, "0");
		return {
			integers: s.slice(0, -BigDecimal.DECIMALS),
			decimals: s.slice(-BigDecimal.DECIMALS).replace(trailingZeros, "")
		};
	}
	toString() {
		const { integers, decimals } = this.getIntegersAndDecimals();
		return `${this.isNegative ? "-" : ""}${integers}${decimals.length ? "." + decimals : ""}`;
	}
	formatToParts(formatter) {
		const { integers, decimals } = this.getIntegersAndDecimals();
		const parts = formatter.numberFormatter.formatToParts(BigInt(integers));
		if (this.isNegative) parts.unshift({
			type: "minusSign",
			value: formatter.minusSign
		});
		if (decimals.length) {
			parts.push({
				type: "decimal",
				value: formatter.decimal
			});
			decimals.split("").forEach((char) => parts.push({
				type: "fraction",
				value: char
			}));
		}
		return parts;
	}
	format(formatter) {
		const { integers, decimals } = this.getIntegersAndDecimals();
		return `${`${this.isNegative ? formatter.minusSign : ""}${formatter.numberFormatter.format(BigInt(integers))}`}${decimals.length ? `${formatter.decimal}${decimals.split("").map((char) => formatter.numberFormatter.format(Number(char))).join("")}` : ""}`;
	}
	add(n) {
		return BigDecimal.fromBigInt(this.value + new BigDecimal(n).value);
	}
	subtract(n) {
		return BigDecimal.fromBigInt(this.value - new BigDecimal(n).value);
	}
	multiply(n) {
		return BigDecimal._divRound(this.value * new BigDecimal(n).value, BigDecimal.SHIFT);
	}
	divide(n) {
		return BigDecimal._divRound(this.value * BigDecimal.SHIFT, new BigDecimal(n).value);
	}
};
function isValidNumber(numberString) {
	return !(!numberString || isNaN(Number(numberString)));
}
function parseNumberString(numberString) {
	if (!numberString || !stringContainsNumbers(numberString)) return "";
	return sanitizeExponentialNumberString(numberString, (nonExpoNumString) => {
		let containsDecimal = false;
		const result = nonExpoNumString.split("").filter((value, i) => {
			if (value.match(/\./g) && !containsDecimal) {
				containsDecimal = true;
				return true;
			}
			if (value.match(/-/g) && i === 0) return true;
			return numberKeys.includes(value);
		}).join("");
		return isValidNumber(result) ? new BigDecimal(result).toString() : "";
	});
}
var allLeadingZerosOptionallyNegative = /^([-0])0+(?=\d)/;
var decimalOnlyAtEndOfString = /(?!^\.)\.$/;
var allHyphensExceptTheStart = /(?!^-)-/g;
var isNegativeDecimalOnlyZeros = /^-\b0\b\.?0*$/;
var hasTrailingDecimalZeros = /0*$/;
var charAllowlist = /* @__PURE__ */ new Set([
	"e",
	"E",
	"-",
	",",
	".",
	...numberKeys
]);
var sanitizeNumberString = (numberString) => {
	return sanitizeExponentialNumberString(Array.from(numberString).filter((char) => charAllowlist.has(char)).join(""), (nonExpoNumString) => {
		const sanitizedValue = nonExpoNumString.replace(allHyphensExceptTheStart, "").replace(decimalOnlyAtEndOfString, "").replace(allLeadingZerosOptionallyNegative, "$1");
		return isValidNumber(sanitizedValue) ? isNegativeDecimalOnlyZeros.test(sanitizedValue) ? sanitizedValue : getBigDecimalAsString(sanitizedValue) : nonExpoNumString;
	});
};
function getBigDecimalAsString(sanitizedValue) {
	const sanitizedValueDecimals = sanitizedValue.split(".")[1];
	const value = new BigDecimal(sanitizedValue).toString();
	const [bigDecimalValueInteger, bigDecimalValueDecimals] = value.split(".");
	return sanitizedValueDecimals && bigDecimalValueDecimals !== sanitizedValueDecimals ? `${bigDecimalValueInteger}.${sanitizedValueDecimals}` : value;
}
function sanitizeExponentialNumberString(numberString, func) {
	if (!numberString) return numberString;
	const firstE = numberString.toLowerCase().indexOf("e") + 1;
	if (!firstE) return func(numberString);
	return numberString.replace(/[eE]*$/g, "").substring(0, firstE).concat(numberString.slice(firstE).replace(/[eE]/g, "")).split(/[eE]/).map((section, i) => i === 1 ? func(section.replace(/\./g, "")) : func(section)).join("e").replace(/^e/, "1e");
}
function expandExponentialNumberString(numberString) {
	const exponentialParts = numberString.split(/[eE]/);
	if (exponentialParts.length === 1) return numberString;
	const number = +numberString;
	if (Number.isSafeInteger(number)) return `${number}`;
	const isNegative = numberString.charAt(0) === "-";
	const magnitude = +exponentialParts[1];
	const decimalParts = exponentialParts[0].split(".");
	const integers = (isNegative ? decimalParts[0].substring(1) : decimalParts[0]) || "";
	const decimals = decimalParts[1] || "";
	const shiftDecimalLeft = (integers2, magnitude2) => {
		const magnitudeDelta = Math.abs(magnitude2) - integers2.length;
		const leftPaddedZeros = magnitudeDelta > 0 ? `${"0".repeat(magnitudeDelta)}${integers2}` : integers2;
		return `${leftPaddedZeros.slice(0, magnitude2)}.${leftPaddedZeros.slice(magnitude2)}`;
	};
	const shiftDecimalRight = (decimals2, magnitude2) => {
		const rightPaddedZeros = magnitude2 > decimals2.length ? `${decimals2}${"0".repeat(magnitude2 - decimals2.length)}` : decimals2;
		return `${rightPaddedZeros.slice(0, magnitude2)}.${rightPaddedZeros.slice(magnitude2)}`;
	};
	const expandedNumberString = magnitude > 0 ? `${integers}${shiftDecimalRight(decimals, magnitude)}` : `${shiftDecimalLeft(integers, magnitude)}${decimals}`;
	return `${isNegative ? "-" : ""}${expandedNumberString.charAt(0) === "." ? "0" : ""}${expandedNumberString.replace(unnecessaryDecimal, "").replace(allLeadingZerosOptionallyNegative, "")}`;
}
function stringContainsNumbers(string) {
	return numberKeys.some((number) => string.includes(number));
}
function addLocalizedTrailingDecimalZeros(localizedValue, value, formatter) {
	const decimals = value.split(".")[1];
	if (decimals) {
		const trailingDecimalZeros = decimals.match(hasTrailingDecimalZeros)[0];
		if (trailingDecimalZeros && formatter.delocalize(localizedValue).length !== value.length && decimals.indexOf("e") === -1) {
			const decimalSeparator = formatter.decimal;
			localizedValue = !localizedValue.includes(decimalSeparator) ? `${localizedValue}${decimalSeparator}` : localizedValue;
			return localizedValue.padEnd(localizedValue.length + trailingDecimalZeros.length, formatter.localize("0"));
		}
	}
	return localizedValue;
}
new Map(Object.entries({
	bg: {
		am: "пр.об.",
		pm: "сл.об."
	},
	bs: {
		am: "prijepodne",
		pm: "popodne"
	},
	ca: {
		am: "a.\xA0m.",
		pm: "p.\xA0m."
	},
	cs: {
		am: "dop.",
		pm: "odp."
	},
	es: {
		am: "a.\xA0m.",
		pm: "p.\xA0m."
	},
	"es-mx": {
		am: "a.m.",
		pm: "p.m."
	},
	"es-MX": {
		am: "a.m.",
		pm: "p.m."
	},
	fi: {
		am: "ap.",
		pm: "ip."
	},
	he: {
		am: "לפנה״צ",
		pm: "אחה״צ"
	},
	hu: {
		am: "de. ",
		pm: "du."
	},
	lt: {
		am: "priešpiet",
		pm: "popiet"
	},
	lv: {
		am: "priekšpusdienā",
		pm: "pēcpusdienā"
	},
	mk: {
		am: "претпл.",
		pm: "попл."
	},
	no: {
		am: "a.m.",
		pm: "p.m."
	},
	nl: {
		am: "a.m.",
		pm: "p.m."
	},
	"pt-pt": {
		am: "da manhã",
		pm: "da tarde"
	},
	"pt-PT": {
		am: "da manhã",
		pm: "da tarde"
	},
	ro: {
		am: "a.m.",
		pm: "p.m."
	},
	sl: {
		am: "dop.",
		pm: "pop."
	},
	sv: {
		am: "fm",
		pm: "em"
	},
	th: {
		am: "ก่อนเที่ยง",
		pm: "หลังเที่ยง"
	},
	tr: {
		am: "ÖÖ",
		pm: "ÖS"
	},
	uk: {
		am: "дп",
		pm: "пп"
	},
	vi: {
		am: "SA",
		pm: "CH"
	}
}));
var numberingSystems = [
	"arab",
	"arabext",
	"latn"
];
var isNumberingSystemSupported = (numberingSystem) => numberingSystems.includes(numberingSystem);
var browserNumberingSystem = new Intl.NumberFormat().resolvedOptions().numberingSystem;
var defaultNumberingSystem = browserNumberingSystem === "arab" || !isNumberingSystemSupported(browserNumberingSystem) ? "latn" : browserNumberingSystem;
var getSupportedNumberingSystem = (numberingSystem) => isNumberingSystemSupported(numberingSystem) ? numberingSystem : defaultNumberingSystem;
var NumberStringFormat = class {
	constructor() {
		this.delocalize = (numberString) => this._numberFormatOptions ? sanitizeExponentialNumberString(numberString, (nonExpoNumString) => nonExpoNumString.replace(new RegExp(`[${this._minusSign}]`, "g"), "-").replace(new RegExp(`[${this._group}]`, "g"), "").replace(new RegExp(`[${this._decimal}]`, "g"), ".").replace(new RegExp(`[${this._digits.join("")}]`, "g"), this._getDigitIndex)) : numberString;
		this.localize = (numberString) => this._numberFormatOptions ? sanitizeExponentialNumberString(numberString, (nonExpoNumString) => isValidNumber(nonExpoNumString.trim()) ? new BigDecimal(nonExpoNumString.trim()).format(this).replace(new RegExp(`[${this._actualGroup}]`, "g"), this._group) : nonExpoNumString) : numberString;
	}
	get group() {
		return this._group;
	}
	get decimal() {
		return this._decimal;
	}
	get minusSign() {
		return this._minusSign;
	}
	get digits() {
		return this._digits;
	}
	get numberFormatter() {
		return this._numberFormatter;
	}
	get numberFormatOptions() {
		return this._numberFormatOptions;
	}
	/** numberFormatOptions needs to be set before localize/delocalize is called to ensure the options are up to date */
	set numberFormatOptions(options) {
		options.numberingSystem = getSupportedNumberingSystem(options?.numberingSystem);
		options.locale = options?.locale || "en";
		if (!this._numberFormatOptions && options.locale === "en" && options.numberingSystem === defaultNumberingSystem && Object.keys(options).length === 2 || JSON.stringify(this._numberFormatOptions) === JSON.stringify(options)) return;
		this._numberFormatOptions = options;
		this._numberFormatter = new Intl.NumberFormat(this._numberFormatOptions.locale, this._numberFormatOptions);
		this._digits = [...new Intl.NumberFormat(this._numberFormatOptions.locale, {
			useGrouping: false,
			numberingSystem: this._numberFormatOptions.numberingSystem
		}).format(9876543210)].reverse();
		const index = new Map(this._digits.map((d, i) => [d, i]));
		const parts = new Intl.NumberFormat(this._numberFormatOptions.locale, { numberingSystem: this._numberFormatOptions.numberingSystem }).formatToParts(-12345678.9);
		this._actualGroup = parts.find((d) => d.type === "group").value;
		this._group = this._actualGroup.trim().length === 0 || this._actualGroup == " " ? "\xA0" : this._actualGroup;
		this._decimal = options.locale === "bs" || options.locale === "mk" ? "," : parts.find((d) => d.type === "decimal").value;
		this._minusSign = parts.find((d) => d.type === "minusSign").value;
		this._getDigitIndex = (d) => index.get(d);
	}
};
var numberStringFormatter = new NumberStringFormat();
//#endregion
export { parseNumberString as a, numberStringFormatter as i, addLocalizedTrailingDecimalZeros as n, sanitizeNumberString as o, isValidNumber as r, BigDecimal as t };

//# sourceMappingURL=locale-MFqIWoIv.js.map