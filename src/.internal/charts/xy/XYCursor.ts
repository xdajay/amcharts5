import type { IPoint } from "../../core/util/IPoint";
import type { XYChart } from "./XYChart"
import type { XYSeries } from "./series/XYSeries";
import type { Root } from "../../core/Root";
import type { IPointerEvent } from "../../core/render/backend/Renderer";
import type { Axis } from "./axes/Axis";
import type { AxisRenderer } from "./axes/AxisRenderer";
import type { Tooltip } from "../../core/render/Tooltip";
import type { Template } from "../../core/util/Template";

import { Container, IContainerSettings, IContainerPrivate, IContainerEvents } from "../../core/render/Container";
import { p100 } from "../../core/util/Percent";
import { Graphics } from "../../core/render/Graphics";
import { Grid } from "./axes/Grid";
//import { Animations } from "../core/util/Animation";

import * as $type from "../../core/util/Type";
import * as $utils from "../../core/util/Utils";

export interface IXYCursorSettings extends IContainerSettings {

	/**
	 * Cursor's X axis.
	 *
	 * If set, cursor will snap to that axis' cells.
	 */
	xAxis?: Axis<AxisRenderer>;

	/**
	 * Cursor's Y axis.
	 *
	 * If set, cursor will snap to that axis' cells.
	 */
	yAxis?: Axis<AxisRenderer>;

	/**
	 * What should cursor do when dragged across plot area.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#Behavior} for more info
	 * @default "none"
	 */
	behavior?: "zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "none";

	/**
	 * Cursor's horizontal position relative to plot area.
	 * 
	 * If this setting is set, cursor will not react to mouse/touch and will just
	 * sit at specified position until `positionX` is reset to `undefined`.
	 * 
	 * `0` - left, `1` - right.
	 */
	positionX?: number;

	/**
	 * Cursor's vertical position relative to plot area.
	 * 
	 * If this setting is set, cursor will not react to mouse/touch and will just
	 * sit at specified position until `positionY` is reset to `undefined`.
	 * 
	 * `0` - left, `1` - right.
	 */
	positionY?: number;

	/**
	 * If set to `true`, cursor will not be hidden when mouse cursor moves out
	 * of the plot area.
	 * 
	 * @default false 
	 */
	alwaysShow?: boolean;

	/**
	 * A list of series to snap cursor to.
	 *
	 * If set, the cursor will always snap to the closest data item of listed
	 * series.
	 */
	snapToSeries?: Array<XYSeries>;

}


export interface IXYCursorPrivate extends IContainerPrivate {

	/**
	 * Current X/Y coordinates of the cursor.
	 */
	point?: IPoint;

	/**
	 * Current horizontal position relative to the plot area (0-1).
	 */
	positionX?: number;

	/**
	 * Current vertical position relative to the plot area (0-1).
	 */
	positionY?: number;

	/**
	 * @ignore
	 */
	downPositionX?: number;

	/**
	 * @ignore
	 */
	downPositionY?: number;

}

export interface IXYCursorEvents extends IContainerEvents {

	/**
	 * Kicks in when cursor selection starts.
	 * 
	 * Only when `behavior` is set.
	 */
	selectended: {
		target: XYCursor;
	};

	/**
	 * Kicks in when cursor selection ends.
	 * 
	 * Only when `behavior` is set.
	 */
	selectstarted: {
		target: XYCursor;
	};

	/**
	 * Kicks in when cursor's position over plot area changes.
	 */
	cursormoved: {
		target: XYCursor;
	};

}

/**
 * Creates a chart cursor for an [[XYChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/} for more info
 * @important
 */
export class XYCursor extends Container {
	public static className: string = "XYCursor";
	public static classNames: Array<string> = Container.classNames.concat([XYCursor.className]);

	declare public _settings: IXYCursorSettings;
	declare public _privateSettings: IXYCursorPrivate;
	declare public _events: IXYCursorEvents;

	/**
	 * A [[Grid]] elment that used for horizontal line of the cursor crosshair.
	 * 
	 * @default Grid.new()
	 */
	public readonly lineX: Grid = this.children.push(Grid.new(this._root, {
		themeTags: ["x"]
	}));

	/**
	 * A [[Grid]] elment that used for horizontal line of the cursor crosshair.
	 * 
	 * @default Grid.new()
	 */
	public readonly lineY: Grid = this.children.push(Grid.new(this._root, {
		themeTags: ["y"]
	}));

	/**
	 * An element that represents current selection.
	 *
	 * @default Graphics.new()
	 */
	public readonly selection: Graphics = this.children.push(Graphics.new(this._root, {
		themeTags: ["selection"]
	}));

	protected _movePoint: IPoint | undefined;
	protected _lastPoint: IPoint = { x: 0, y: 0 };

	protected _tooltipX: boolean = false;
	protected _tooltipY: boolean = false;

	/**
	 * A chart cursor is attached to.
	 */
	public chart: XYChart | undefined;

	/**
	 * Use this method to create an instance of this class.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
	 * @param   root      Root element
	 * @param   settings  Settings
	 * @param   template  Template
	 * @return            Instantiated object
	 */
	public static new(root: Root, settings: XYCursor["_settings"], template?: Template<XYCursor>): XYCursor {
		settings.themeTags = $utils.mergeTags(settings.themeTags, ["xy", "cursor"]);
		const x = new XYCursor(root, settings, true, template);
		x._afterNew();
		return x;
	}

	protected _afterNew() {
		super._afterNew();
		this.setAll({ "width": p100, height: p100, isMeasured: true, position: "absolute" });
		this.states.create("hidden", { visible: true, opacity: 0 });

		//this.lineX.states.create("hidden", { visible: true, opacity: 0 });
		//this.lineY.states.create("hidden", { visible: true, opacity: 0 });

		this._drawLines();
	}

	public _prepareChildren() {
		super._prepareChildren();

		if (this.isDirty("xAxis")) {
			this._tooltipX = false;
			const xAxis = this.get("xAxis");

			if (xAxis) {
				const tooltip = xAxis.get("tooltip");
				if (tooltip) {
					this._tooltipX = true;
					tooltip.on("pointTo", () => {
						this._updateXLine(tooltip);
					})
				}
			}
		}

		if (this.isDirty("yAxis")) {
			this._tooltipY = false;
			const yAxis = this.get("yAxis");

			if (yAxis) {
				const tooltip = yAxis.get("tooltip");
				if (tooltip) {
					this._tooltipY = true;
					tooltip.on("pointTo", () => {
						this._updateYLine(tooltip);
					})
				}
			}
		}
	}

	public _updateChildren() {
		super._updateChildren();

		if (this.isDirty("positionX") || this.isDirty("positionY")) {
			this._movePoint = this.toGlobal(this._getPoint(this.get("positionX", 0), this.get("positionY", 0)));
			this.handleMove();
		}
	}

	protected _updateXLine(tooltip: Tooltip) {
		this.lineX.animate({ key: "x", to: this._display.toLocal(tooltip.get("pointTo", { x: 0, y: 0 })).x, duration: tooltip.get("animationDuration", 0), easing: tooltip.get("animationEasing") });
	}

	protected _updateYLine(tooltip: Tooltip) {
		this.lineY.animate({ key: "y", to: this._display.toLocal(tooltip.get("pointTo", { x: 0, y: 0 })).y, duration: tooltip.get("animationDuration", 0), easing: tooltip.get("animationEasing") });
	}

	protected _drawLines() {
		this.lineX.set("draw", (display) => {
			display.moveTo(0, 0);
			display.lineTo(0, this.height());
		})
		this.lineY.set("draw", (display) => {
			display.moveTo(0, 0);
			display.lineTo(this.width(), 0);
		})
	}

	public _setChart(chart: XYChart): void {
		this.chart = chart;

		const plotContainer = chart.plotContainer;

		this.events.on("boundschanged", () => {
			this._disposers.push(this.setTimeout(() => {
				if (this.get("alwaysShow")) {
					this._movePoint = this.toGlobal(this._getPoint(this.get("positionX", 0), this.get("positionY", 0)));
					this.handleMove();
				}
			}, 50))
		})

		//this._display.interactive = true;
		if ($utils.supports("touchevents")) {
			this._disposers.push(plotContainer.events.on("click", (event) => {
				if ($utils.isTouchEvent(event.originalEvent)) {
					this._handleMove(event.originalEvent);
				}
			}));
		}

		this._disposers.push(plotContainer.events.on("pointerdown", (event) => {
			this._handleCursorDown(event.originalEvent);
		}));

		this._disposers.push(plotContainer.events.on("globalpointerup", (event) => {
			this._handleCursorUp(event.originalEvent);
		}));

		this._disposers.push(plotContainer.events.on("globalpointermove", (event) => {
			this._handleMove(event.originalEvent);
		}));
	}

	protected _inPlot(point: IPoint): boolean {
		const chart = this.chart;
		if (chart) {
			return chart.inPlot(point);
		}
		return false;
	}

	protected _handleCursorDown(event: IPointerEvent) {
		// TODO: handle multitouch
		const rootPoint = this._root.documentPointToRoot({ x: event.clientX, y: event.clientY });
		let local = this._display.toLocal(rootPoint);
		const chart = this.chart;
		if (chart && this._inPlot(local)) {
			this._downPoint = local;

			if (this.get("behavior") != "none") {
				this.selection.show();

				const type = "selectstarted";
				if (this.events.isEnabled(type)) {
					this.events.dispatch(type, { type: type, target: this });
				}
			}

			this.selection.set("draw", () => { });

			let positionX = this._getPosition(local).x;
			let positionY = this._getPosition(local).y;

			this.setPrivate("downPositionX", positionX);
			this.setPrivate("downPositionY", positionY);
		}
	}

	protected _handleCursorUp(_event: IPointerEvent) {
		// TODO: handle multitouch
		if (this._downPoint) {
			const behavior = this.get("behavior");
			if (behavior === "zoomX" || behavior === "zoomY" || behavior === "zoomXY") {
				this.selection.hide();

				let userPositionX = this.get("positionX");
				let positionX = this.getPrivate("positionX", 0);

				if ($type.isNumber(userPositionX)) {
					positionX = userPositionX;
				}

				let userPositionY = this.get("positionY");
				let positionY = this.getPrivate("positionY", 0);

				if ($type.isNumber(userPositionY)) {
					positionY = userPositionY;
				}

				if (Math.abs(positionX - this.getPrivate("downPositionX", 0)) > 0.002 || Math.abs(positionY - this.getPrivate("downPositionY", 0)) > 0.002) {
					const type = "selectended";
					if (this.events.isEnabled(type)) {
						this.events.dispatch(type, { type: type, target: this });
					}
				}
			}
		}
		this._downPoint = undefined;
	}

	protected _handleMove(event: IPointerEvent) {
		// TODO: handle multitouch
		const rootPoint = this._root.documentPointToRoot({ x: event.clientX, y: event.clientY });

		const lastPoint = this._lastPoint;

		if (Math.round(lastPoint.x) === Math.round(rootPoint.x) && Math.round(lastPoint.y) === Math.round(rootPoint.y)) {
			return;
		}

		this._lastPoint = rootPoint;

		this.handleMove({ x: rootPoint.x, y: rootPoint.y });
	}

	protected _getPosition(point: IPoint): IPoint {
		return { x: point.x / this.width(), y: point.y / this.height() };
	}

	/**
	 * @ignore
	 */
	public handleMove(point?: IPoint, skipEvent?: boolean) {
		if (!point) {
			point = this._movePoint;
		}

		const alwaysShow = this.get("alwaysShow");

		if (!point) {
			this.hide(0);
			return;
		}

		this._movePoint = point;
		let local = this._display.toLocal(point);
		let chart = this.chart;

		if (chart && this._inPlot(local)) {
			chart._movePoint = point;

			if (this.isHidden()) {
				this.show();
				this.selection.set("draw", () => { });
			}

			let x = local.x;
			let y = local.y;

			let xyPos = this._getPosition(local);

			this.setPrivate("point", local);

			const snapToSeries = this.get("snapToSeries")

			let userPositionX = this.get("positionX");
			let positionX = xyPos.x;

			if ($type.isNumber(userPositionX)) {
				positionX = userPositionX;
			}

			let userPositionY = this.get("positionY");
			let positionY = xyPos.y;

			if ($type.isNumber(userPositionY)) {
				positionY = userPositionY;
			}

			this.setPrivate("positionX", positionX);
			this.setPrivate("positionY", positionY);

			const xy = this._getPoint(positionX, positionY);
			x = xy.x;
			y = xy.y;

			chart.xAxes.each((axis) => {

				axis._handleCursorPosition(positionX, snapToSeries);
				if (alwaysShow) {
					axis.handleCursorShow();
				}
			})
			chart.yAxes.each((axis) => {
				axis._handleCursorPosition(positionY, snapToSeries);
				if (alwaysShow) {
					axis.handleCursorShow();
				}
			})

			if (!skipEvent) {
				chart._handleCursorPosition();

				const type = "cursormoved";
				if (this.events.isEnabled(type)) {
					this.events.dispatch(type, { type: type, target: this });
				}
			}

			this._updateLines(x, y);

			chart.arrangeTooltips();
			setTimeout(() => {
				let chart = this.chart;
				if (chart) {
					chart.arrangeTooltips();
				}
			}, 100)
		}
		else if (!this._downPoint) {
			if (!alwaysShow) {
				this.hide(0);
			}
		}

		if (this._downPoint && this.get("behavior") != "none") {
			this._updateSelection(local)
		}
	}

	protected _getPoint(positionX: number, positionY: number): IPoint {
		return { x: this.width() * positionX, y: this.height() * positionY };
	}


	protected _updateLines(x: number, y: number) {
		if (!this._tooltipX) {
			this.lineX.set("x", x);
		}
		if (!this._tooltipY) {
			this.lineY.set("y", y);
		}

		this._drawLines();
	}

	protected _updateSelection(point: IPoint) {
		const selection = this.selection;
		const behavior = this.get("behavior");
		const w = this.width();
		const h = this.height();

		selection.set("draw", (display) => {
			const downPoint = this._downPoint;
			if (downPoint) {
				if (behavior === "zoomXY" || behavior === "selectXY") {
					display.moveTo(downPoint.x, downPoint.y);
					display.lineTo(downPoint.x, point.y);
					display.lineTo(point.x, point.y);
					display.lineTo(point.x, downPoint.y);
					display.lineTo(downPoint.x, downPoint.y);
				}
				else if (behavior === "zoomX" || behavior === "selectX") {
					display.moveTo(downPoint.x, 0);
					display.lineTo(downPoint.x, h);
					display.lineTo(point.x, h);
					display.lineTo(point.x, 0);
					display.lineTo(downPoint.x, 0);
				}
				else if (behavior === "zoomY" || behavior === "selectY") {
					display.moveTo(0, downPoint.y);
					display.lineTo(w, downPoint.y);
					display.lineTo(w, point.y);
					display.lineTo(0, point.y);
					display.lineTo(0, downPoint.y);
				}
			}
		})
	}

	protected _onHide() {
		if (this.isHidden()) {
			let chart = this.chart;
			if (chart) {

				chart.xAxes.each((axis) => {
					axis.handleCursorHide();
				})
				chart.yAxes.each((axis) => {
					axis.handleCursorHide();
				})
				chart.series.each((series) => {
					series.handleCursorHide();
				})
			}
		}
		super._onHide();
	}

	protected _onShow() {
		if (!this.isHidden()) {
			let chart = this.chart;
			if (chart) {
				chart.xAxes.each((axis) => {
					axis.handleCursorShow();
				})
				chart.yAxes.each((axis) => {
					axis.handleCursorShow();
				})
			}
		}
		super._onShow();
	}
}
