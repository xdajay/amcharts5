import type { Percent } from "./Percent";
import type { IPointerEvent } from "../render/backend/Renderer";

import * as $type from "./Type";
import * as $array from "./Array";
import * as $object from "./Object";

import { Disposer, IDisposer } from "./Disposer";

/**
 * ============================================================================
 * DOM FUNCTIONS
 * ============================================================================
 * @hidden
 */

export function removeElement(el: HTMLElement): void {
	if (el.parentNode) {
		el.parentNode.removeChild(el);
	}
}

/**
 * Function that adds a disposable event listener directly to a DOM element.
 *
 * @ignore Exclude from docs
 * @param dom       A DOM element to add event to
 * @param type      Event type
 * @param listener  Event listener
 * @returns Disposable event
 */
export function addEventListener<E extends Event>(dom: EventTarget, type: string, listener: (event: E) => void, options?: any): IDisposer {
	//@todo proper type check for options: EventListenerOptions | boolean (TS for some reason gives error on passive parameter)
	//console.log(type, dom);
	dom.addEventListener(type, <EventListener>listener, options || false);

	return new Disposer(() => {
		dom.removeEventListener(type, <EventListener>listener, options || false);
	});
}

/**
 * @ignore
 */
export function supports(cap: "touchevents" | "pointerevents" | "mouseevents" | "wheelevents" | "keyboardevents"): boolean {
	switch (cap) {
		case "touchevents":
			//return "ontouchstart" in document.documentElement;
			return window.hasOwnProperty("TouchEvent");

		case "pointerevents":
			return window.hasOwnProperty("PointerEvent");

		case "mouseevents":
			return window.hasOwnProperty("MouseEvent");

		case "wheelevents":
			return window.hasOwnProperty("WheelEvent");

		case "keyboardevents":
			return window.hasOwnProperty("KeyboardEvent");
	}
	return false;
}

/**
 * @ignore
 */
export function getPointerId(event: IPointerEvent) {
	let id = (<any>event).pointerId || 0;
	//console.log(event);
	return id;
}

/**
 * Removes focus from any element by shifting focus to body.
 *
 * @ignore Exclude from docs
 */
export function blur(): void {
	if (document.activeElement && document.activeElement != document.body) {
		if ((<any>document.activeElement).blur) {
			(<any>document.activeElement).blur();
		}
		else {
			let input = document.createElement("button");
			input.style.position = "fixed";
			input.style.top = "0px";
			input.style.left = "-10000px";
			document.body.appendChild(input);
			input.focus();
			input.blur();
			document.body.removeChild(input);
		}
	}
}

/**
 * @ignore
 */
export function getRendererEvent(key: string): string {
	if (supports("pointerevents")) {
		return key;
	}
	else if (supports("touchevents")) {
		switch (key) {
			case "pointerover": return "touchstart";
			case "pointerout": return "touchend";
			case "pointerdown": return "touchstart";
			case "pointermove": return "touchmove";
			case "pointerup": return "touchend";
			case "click": return "click";
			case "dblclick": return "dblclick";

		}
	}
	else if (supports("mouseevents")) {
		switch (key) {
			case "pointerover": return "mouseover";
			case "pointerout": return "mouseout";
			case "pointerdown": return "mousedown";
			case "pointermove": return "mousemove";
			case "pointerup": return "mouseup";
			case "click": return "click";
			case "dblclick": return "dblclick";

		}
	}
	return key;
}

/**
 * Determines if pointer event originated from a touch pointer or mouse.
 *
 * @param ev  Original event
 * @return Touch pointer?
 */
export function isTouchEvent(ev: MouseEvent | Touch): boolean {
	if (typeof Touch !== "undefined" && ev instanceof Touch) {
		return true;
	}
	else if (typeof PointerEvent !== "undefined" && ev instanceof PointerEvent && (<any>ev).pointerType != null) {
		switch ((<any>ev).pointerType) {
			case "touch":
			case "pen":
			case 2:
				return true;
			case "mouse":
			case 4:
				return false;
			default:
				return !(ev instanceof MouseEvent);
		}
	}
	else if ((<any>ev).type != null) {
		if ((<any>ev).type.match(/^mouse/)) {
			return false;
		}
	}
	return true;
}

/**
 * Sets style property on DOM element.
 *
 * @ignore Exclude from docs
 */
export function setStyle(dom: HTMLElement, property: string, value: string | undefined): void {
	(<any>dom.style)[property] = value;
}

export function getStyle(dom: HTMLElement, property: string): string | undefined {
	return (<any>dom.style)[property];
}

/**
 * Checks of element `a` contains element `b`.
 *
 * @param a  Aleged ascendant
 * @param b  Aleged descendant
 * @return Contains?
 */
export function contains(a: Element, b: Element): boolean {
	let cursor: Node = b;

	while (true) {
		if (a === cursor) {
			return true;

		} else if (cursor.parentNode === null) {
			// TODO better ShadowRoot detection
			if ((<ShadowRoot>cursor).host == null) {
				return false;

			} else {
				cursor = (<ShadowRoot>cursor).host;
			}

		} else {
			cursor = cursor.parentNode;
		}
	}
}

/**
 * Disables or enables interactivity of a DOM element.
 * 
 * @param  target       Target element
 * @param  interactive  Interactive?
 */
export function setInteractive(target: HTMLElement, interactive: boolean): void {
	if (interactive) {
		target.style.pointerEvents = "";
	}
	else {
		target.style.pointerEvents = "none";
	}
}

/**
 * Returns the shadow root of the element or null
 *
 * @param a  Node
 * @return Root
 */
export function getShadowRoot(a: Node): ShadowRoot | null {
	let cursor: Node = a;

	while (true) {
		if (cursor.parentNode === null) {
			// TODO better ShadowRoot detection
			if ((<ShadowRoot>cursor).host != null) {
				return <ShadowRoot>cursor;

			} else {
				return null;
			}

		} else {
			cursor = cursor.parentNode;
		}
	}
}

/**
 * [rootStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
let rootStylesheet: $type.Optional<CSSStyleSheet>;

/**
 * [getStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @return [description]
 */
function getStylesheet(element: ShadowRoot | null, nonce: string = ""): CSSStyleSheet {
	if (element === null) {
		if (rootStylesheet == null) {
			// TODO use createElementNS ?
			const e = document.createElement("style");
			e.type = "text/css";
			if (nonce != "") {
				e.setAttribute("nonce", nonce)
			}
			document.head.appendChild(e);
			rootStylesheet = e.sheet as CSSStyleSheet;
		}

		return rootStylesheet;

	} else {
		// TODO use createElementNS ?
		const e = document.createElement("style");
		e.type = "text/css";
		if (nonce != "") {
			e.setAttribute("nonce", nonce)
		}
		element.appendChild(e);
		return e.sheet as CSSStyleSheet;
	}
}

/**
 * [makeStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param selector  [description]
 * @return [description]
 */
function appendStylesheet(root: CSSStyleSheet, selector: string): CSSStyleRule {
	const index = root.cssRules.length;

	root.insertRule(selector + "{}", index);

	return root.cssRules[index] as CSSStyleRule;
}

/**
 * Defines a class for a CSS rule.
 *
 * Can be used to dynamically add CSS to the document.
 */
export class StyleRule extends Disposer {

	/**
	 * CSS rule.
	 */
	private _rule: CSSStyleRule;

	/**
	 * A CSS selector text.
	 *
	 * E.g.: `.myClass p`
	 *
	 * @param selector  CSS selector
	 */
	public set selector(selector: string) {
		this._rule.selectorText = selector;
	}

	/**
	 * @return CSS selector
	 */
	public get selector(): string {
		return this._rule.selectorText;
	}

	/**
	 * Constructor.
	 *
	 * @param selector  CSS selector
	 * @param styles    An object of style attribute - value pairs
	 */
	constructor(element: ShadowRoot | null, selector: string, styles: { [name: string]: string }, nonce: string = "") {
		const root = getStylesheet(element, nonce);

		// TODO test this
		super(() => {
			// TODO a bit hacky
			const index = $array.indexOf(root.cssRules, this._rule);

			if (index === -1) {
				throw new Error("Could not dispose StyleRule");

			} else {
				// TODO if it's empty remove it from the DOM ?
				root.deleteRule(index);
			}
		});

		this._rule = appendStylesheet(root, selector);

		$object.each(styles, (key, value) => {
			this.setStyle(<string>key, value);
		});
	}

	/**
	 * Sets the same style properties with browser-specific prefixes.
	 *
	 * @param name   Attribute name
	 * @param value  Attribute value
	 */
	private _setVendorPrefixName(name: string, value: string): void {
		const style = this._rule.style;
		style.setProperty("-webkit-" + name, value, "");
		style.setProperty("-moz-" + name, value, "");
		style.setProperty("-ms-" + name, value, "");
		style.setProperty("-o-" + name, value, "");
		style.setProperty(name, value, "");
	}

	/**
	 * Sets a value for specific style attribute.
	 *
	 * @param name   Attribute
	 * @param value  Value
	 */
	public setStyle(name: string, value: string): void {
		if (name === "transition") {
			this._setVendorPrefixName(name, value);

		} else {
			this._rule.style.setProperty(name, value, "");
		}
	}

}

// /**
//  * Applies a set of styles to an element. Stores the original styles so they
//  * can be restored later.
//  *
//  * @ignore
//  * @param io      Element
//   */
// export function prepElementForDrag(dom: HTMLElement): void {

// 	// @todo: save current values

// 	// Define possible props
// 	let props = [
// 		"touchAction", "webkitTouchAction", "MozTouchAction", "MSTouchAction", "msTouchAction", "oTouchAction",
// 		"userSelect", "webkitUserSelect", "MozUserSelect", "MSUserSelect", "msUserSelect", "oUserSelect",
// 		"touchSelect", "webkitTouchSelect", "MozTouchSelect", "MSTouchSelect", "msTouchSelect", "oTouchSelect",
// 		"touchCallout", "webkitTouchCallout", "MozTouchCallout", "MSTouchCallout", "msTouchCallout", "oTouchCallout",
// 		"contentZooming", "webkitContentZooming", "MozContentZooming", "MSContentZooming", "msContentZooming", "oContentZooming",
// 		"userDrag", "webkitUserDrag", "MozUserDrag", "MSUserDrag", "msUserDrag", "oUserDrag"
// 	];
// 	for (let i = 0; i < props.length; i++) {
// 		if (props[i] in dom.style) {
// 			setStyle(dom, props[i], "none");
// 		}
// 	}

// 	// Remove iOS-specific selection;
// 	setStyle(dom, "tapHighlightColor", "rgba(0, 0, 0, 0)");

// }

// /**
//  * Restores replaced styles
//  *
//  * @ignore
//  * @param  io  Element
//  */
// export function unprepElementForDrag(dom: HTMLElement): void {

// 	// Define possible props
// 	let props = [
// 		"touchAction", "webkitTouchAction", "MozTouchAction", "MSTouchAction", "msTouchAction", "oTouchAction",
// 		"userSelect", "webkitUserSelect", "MozUserSelect", "MSUserSelect", "msUserSelect", "oUserSelect",
// 		"touchSelect", "webkitTouchSelect", "MozTouchSelect", "MSTouchSelect", "msTouchSelect", "oTouchSelect",
// 		"touchCallout", "webkitTouchCallout", "MozTouchCallout", "MSTouchCallout", "msTouchCallout", "oTouchCallout",
// 		"contentZooming", "webkitContentZooming", "MozContentZooming", "MSContentZooming", "msContentZooming", "oContentZooming",
// 		"userDrag", "webkitUserDrag", "MozUserDrag", "MSUserDrag", "msUserDrag", "oUserDrag"
// 	];
// 	for (let i = 0; i < props.length; i++) {
// 		if (props[i] in dom.style) {
// 			setStyle(dom, props[i], "");
// 		}
// 	}

// 	// Remove iOS-specific selection;
// 	setStyle(dom, "tapHighlightColor", "");

// }



export function relativeToValue(percent: number | Percent | undefined | null, full: number): number {
	if ($type.isNumber(percent)) {
		return percent;
	} else if (percent != null && $type.isNumber(percent.value) && $type.isNumber(full)) {
		return full * percent.value;

	} else {
		return 0;
	}
}



/**
 * Returns number of decimals
 *
 * @ignore Exclude from docs
 * @param number  Input number
 * @return Number of decimals
 */
export function decimalPlaces(number: number): number {
	let match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!match) { return 0; }
	return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}


/**
 * ============================================================================
 * STRING FORMATTING FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Pads a string with additional characters to certain length.
 *
 * @param value  A numeric value
 * @param len    Result string length in characters
 * @param char   A character to use for padding
 * @return Padded value as string
 */
export function padString(value: any, len: number = 0, char: string = "0"): string {
	if (typeof value !== "string") {
		value = value.toString();
	}

	return len > value.length ? Array(len - value.length + 1).join(char) + value : value;
}

export function trimLeft(text: string): string {
	return text.replace(/^[\n \t]+/, "");
}

export function trimRight(text: string): string {
	return text.replace(/^[\n \t]+$/, "");
}

export function trim(text: string): string {
	return trimLeft(trimRight(text));
}

/**
 * Tries to determine format type.
 *
 * @ignore Exclude from docs
 * @param format  Format string
 * @return Format type ("string" | "number" | "date" | "duration")
 */
export function getFormat(format: string): string {

	// Undefined?
	if (typeof format === "undefined") {
		return "string";
	}

	// Cleanup and lowercase format
	format = format.toLowerCase().replace(/^\[[^\]]*\]/, "");

	// Remove style tags
	format = format.replace(/\[[^\]]+\]/, "");

	// Trim
	format = format.trim();

	// Check for any explicit format hints (i.e. /Date)
	let hints: RegExpMatchArray | null = format.match(/\/(date|number|duration)$/);

	if (hints) {
		return hints[1];
	}

	// Check for explicit hints
	if (format === "number") {
		return "number";
	}

	if (format === "date") {
		return "date";
	}

	if (format === "duration") {
		return "duration";
	}

	// Detect number formatting symbols
	if (format.match(/[#0]/)) {
		return "number";
	}

	// Detect date formatting symbols
	if (format.match(/[ymwdhnsqaxkzgtei]/)) {
		return "date";
	}

	// Nothing? Let's display as string
	return "string";
}

/**
 * Cleans up format:
 * * Strips out formatter hints
 *
 * @ignore Exclude from docs
 * @param format  Format
 * @return Cleaned format
 */
export function cleanFormat(format: string): string {
	return format.replace(/\/(date|number|duration)$/i, "");
}

/**
 * Strips all tags from the string.
 *
 * @param text  Source string
 * @return String without tags
 */
export function stripTags(text: string): string {
	return text ? text.replace(/<[^>]*>/g, "") : text;
}

/**
 * Removes new lines and tags from a string.
 *
 * @param text  String to conver
 * @return Converted string
 */
export function plainText(text: string): string {
	return text ? stripTags(("" + text).replace(/[\n\r]+/g, ". ")) : text;
}

/**
 * Escapes string so it can safely be used in a Regex.
 *
 * @param value  Unsescaped string
 * @return Escaped string
 */
export function escapeForRgex(value: string): string {
	return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * ============================================================================
 * DATE-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Returns a year day.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Year day
 * @todo Account for UTC
 */
export function getYearDay(date: Date, utc: boolean = false): number {
	// TODO: utc needed?
	utc;
	const start = new Date(date.getFullYear(), 0, 0);
	const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
	const oneDay = 1000 * 60 * 60 * 24;
	return Math.floor(diff / oneDay);
}

/**
 * Returns week number for a given date.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Week number
 * @todo Account for UTC
 */
export function getWeek(date: Date, utc: boolean = false): number {
	const day = getYearDay(date, utc) - 1;
	let week = Math.floor((day - (date.getDay() || 7) + 10) / 7);
	if (week === 0) {
		week = 53;
	}
	else if (week === 53) {
		week = 1;
	}
	return week;
}

/**
 * Returns a week number in the month.
 *
 * @param date  Source Date
 * @param utc   Assume UTC dates?
 * @return Week number in month
 */
export function getMonthWeek(date: Date, utc: boolean = false): number {
	const firstWeek = getWeek(new Date(date.getFullYear(), date.getMonth(), 1), utc);
	let currentWeek = getWeek(date, utc);
	if (currentWeek == 1) {
		currentWeek = 53;
	}
	return currentWeek - firstWeek + 1;
}

/**
 * Returns a year day out of the given week number.
 *
 * @param week     Week
 * @param year     Year
 * @param weekday  Weekday
 * @param utc      Assume UTC dates
 * @return Day in a year
 */
export function getDayFromWeek(week: number, year: number, weekday: number = 1, utc: boolean = false): number {
	let date = new Date(year, 0, 4, 0, 0, 0, 0);
	if (utc) {
		date.setUTCFullYear(year);
	}
	let day = week * 7 + weekday - ((date.getDay() || 7) + 3);
	return day;
}

/**
 * Returns 12-hour representation out of the 24-hour hours.
 *
 * @param hours  24-hour number
 * @return 12-hour number
 */
export function get12Hours(hours: number, base?: number): number {
	if (hours > 12) {
		hours -= 12;
	}
	else if (hours === 0) {
		hours = 12;
	}
	return base != null ? hours + (base - 1) : hours;
}

/**
 * Returns a string name of the tome zone.
 *
 * @param date     Date object
 * @param long     Should return long ("Pacific Standard Time") or short abbreviation ("PST")
 * @param savings  Include information if it's in daylight savings mode
 * @param utc      Assume UTC dates
 * @return Time zone name
 */
export function getTimeZone(date: Date, long: boolean = false, savings: boolean = false, utc: boolean = false): string {
	if (utc) {
		return long ? "Coordinated Universal Time" : "UTC";
	}
	let wotz = date.toLocaleString("UTC");
	let wtz = date.toLocaleString("UTC", { timeZoneName: long ? "long" : "short" }).substr(wotz.length);
	//wtz = wtz.replace(/[+-]+[0-9]+$/, "");
	if (savings === false) {
		wtz = wtz.replace(/ (standard|daylight|summer|winter) /i, " ");
	}
	return wtz;
}


export function capitalizeFirst(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}


/**
 * ============================================================================
 * COLOR UTILS
 * ============================================================================
 */


/**
 * Represents an interface for an object that represents an RGB color.
 */
export interface iRGB {
	r: number;
	g: number;
	b: number;
	a?: number;
}

/**
 * Represents an interface for an object that represents an HSL color.
 */
export interface iHSL {
	h: number;
	s: number;
	l: number;
	a?: number;
}

/**
 * The functions below are taken and adapted from Garry Tan's blog post:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * The further attributions go mjijackson.com, which now seems to be defunct.
 */


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * Function adapted from:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * @ignore Exclude from docs
 * @param h       The hue
 * @param s       The saturation
 * @param l       The lightness
 * @return The RGB representation
 */
export function hslToRgb(color: iHSL): iRGB {
	let r, g, b;
	let h = color.h;
	let s = color.s;
	let l = color.l;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
			if (t < 0) { t += 1; }
			if (t > 1) { t -= 1; }
			if (t < 1 / 6) { return p + (q - p) * 6 * t; }
			if (t < 1 / 2) { return q; }
			if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
			return p;
		}

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * Function adapted from:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * @ignore Exclude from docs
 * @param r       The red color value
 * @param g       The green color value
 * @param b       The blue color value
 * @return The HSL representation
 */
export function rgbToHsl(color: iRGB): iHSL {
	let r = color.r / 255;
	let g = color.g / 255;
	let b = color.b / 255;
	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	let l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic

	} else {
		let d = max - min;

		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return {
		h: h,
		s: s,
		l: l
	};
}

/**
 * Returns a color that is `percent` brighter than the reference color.
 *
 * @ignore Exclude from docs
 * @param color    Reference color
 * @param percent  Brightness percent
 * @return Hex code of the new color
 */
export function lighten(rgb: $type.Optional<iRGB>, percent: number): $type.Optional<iRGB> {
	if (rgb) {
		return {
			r: Math.max(0, Math.min(255, rgb.r + getLightnessStep(rgb.r, percent))),
			g: Math.max(0, Math.min(255, rgb.g + getLightnessStep(rgb.g, percent))),
			b: Math.max(0, Math.min(255, rgb.b + getLightnessStep(rgb.b, percent))),
			a: rgb.a
		};

	} else {
		// TODO is this correct ?
		return rgb;
	}
};

/**
 * Gets lightness step.
 *
 * @ignore Exclude from docs
 * @param value    Value
 * @param percent  Percent
 * @return Step
 */
export function getLightnessStep(value: number, percent: number): number {
	let base = percent > 0 ? 255 - value : value;
	return Math.round(base * percent);
}

/**
 * Returns a color that is `percent` brighter than the source `color`.
 *
 * @ignore Exclude from docs
 * @param color    Source color
 * @param percent  Brightness percent
 * @return New color
 */
export function brighten(rgb: $type.Optional<iRGB>, percent: number): $type.Optional<iRGB> {
	if (rgb) {
		let base = Math.min(Math.max(rgb.r, rgb.g, rgb.b), 230);
		//let base = Math.max(rgb.r, rgb.g, rgb.b);
		let step = getLightnessStep(base, percent);
		return {
			r: Math.max(0, Math.min(255, Math.round(rgb.r + step))),
			g: Math.max(0, Math.min(255, Math.round(rgb.g + step))),
			b: Math.max(0, Math.min(255, Math.round(rgb.b + step))),
			a: rgb.a
		};

	} else {
		// TODO is this correct ?
		return rgb;
	}
};

/**
 * Returns brightness step.
 *
 * @ignore Exclude from docs
 * @param value    Value
 * @param percent  Percent
 * @return Step
 */
export function getBrightnessStep(_value: number, percent: number): number {
	let base = 255; //percent > 0 ? 255 - value : value;
	return Math.round(base * percent);
}

/**
 * Returns `true` if color is "light". Useful indetermining which contrasting
 * color to use for elements over this color. E.g.: you would want to use
 * black text over light background, and vice versa.
 *
 * @ignore Exclude from docs
 * @param color  Source color
 * @return Light?
 */
export function isLight(color: iRGB): boolean {
	return ((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000 >= 128;
}

/**
 * Returns a new [[iRGB]] object based on `rgb` parameter with specific
 * saturation applied.
 *
 * `saturation` can be in the range of 0 (fully desaturated) to 1 (fully
 * saturated).
 *
 * @ignore Exclude from docs
 * @param color       Base color
 * @param saturation  Saturation (0-1)
 * @return New color
 */
export function saturate(rgb: $type.Optional<iRGB>, saturation: number): $type.Optional<iRGB> {
	if (rgb === undefined || saturation == 1) {
		return rgb;
	}

	let hsl = rgbToHsl(rgb);
	hsl.s = saturation;
	return hslToRgb(hsl);
}

export function alternativeColor(color: iRGB, lightAlternative: iRGB = { r: 255, g: 255, b: 255 }, darkAlternative: iRGB = { r: 255, g: 255, b: 255 }): iRGB {
	return isLight(color) ? darkAlternative : lightAlternative;
}

/**
 * @ignore
 * @deprecated
 */
// export function unshiftThemeClass(settings: any, themeClass: string) {
// 	let themeClasses = settings.themeClasses;
// 	if (!themeClasses) {
// 		themeClasses = [];
// 	}
// 	themeClasses.unshift(themeClass);
// 	settings.themeClasses = themeClasses;
// }

/**
 * @ignore
 * @deprecated
 */
// export function pushThemeClass(settings: any, themeClass: string) {
// 	let themeClasses = settings.themeClasses;
// 	if (!themeClasses) {
// 		themeClasses = [];
// 	}
// 	themeClasses.push(themeClass);
// 	settings.themeClasses = themeClasses;
// }

/**
 * @ignore
 */
export function mergeTags(tags1: string[] | undefined, tags2: string[]): string[] {
	if (!tags1) {
		tags1 = [];
	}
	return [...tags1, ...tags2];
}