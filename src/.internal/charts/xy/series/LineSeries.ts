import { XYSeries, IXYSeriesPrivate, IXYSeriesSettings, IXYSeriesDataItem, IXYSeriesAxisRange } from "./XYSeries";
import { Graphics } from "../../../core/render/Graphics";
import * as $type from "../../../core/util/Type";
import * as $array from "../../../core/util/Array";
import { CurveFactory, line, area } from "d3-shape";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
import { DataItem } from "../../../core/render/Component";
import type { Axis } from "../axes/Axis";
import type { AxisRenderer } from "../axes/AxisRenderer";
import * as $utils from "../../../core/util/Utils";

export interface IPointOptions {
}

export interface ILineSeriesDataItem extends IXYSeriesDataItem {
}

export interface ILineSeriesSettings extends IXYSeriesSettings {

	/**
	 * If set to `true` the line will connect over "gaps" - categories or time
	 * intervals with no data.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/#Gaps} for more info
	 * @default true
	 */
	connect?: boolean;

	/**
	 * If there are more than `autoGapCount` base time intervals (e.g. days) with
	 * no data, the line will break and will display gap.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/#Auto_gaps_with_dates} for more info
	 * @default 1.1
	 */
	autoGapCount?: number;

	/**
	 * @ignore
	 */
	curveFactory?: CurveFactory;
}

export interface ILineSeriesPrivate extends IXYSeriesPrivate {
}

/**
 * Interface representing a [[LineSeries]] axis range.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/#Series_axis_ranges} for more info
 */
export interface ILineSeriesAxisRange extends IXYSeriesAxisRange {

	/**
	 * A list template to use when applying line settings to the line segments covered
	 * by an axis range.
	 */
	strokes?: ListTemplate<Graphics>;

	/**
	 * A list template to use when applying fill settings to the fill segments covered
	 * by an axis range.
	 */
	fills?: ListTemplate<Graphics>;
}

/**
 * Used to plot line and/or area series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/} for more info
 * @important
 */
export class LineSeries extends XYSeries {

	declare public _settings: ILineSeriesSettings;
	declare public _privateSettings: ILineSeriesPrivate;
	declare public _dataItemSettings: ILineSeriesDataItem;
	declare public _axisRangeType: ILineSeriesAxisRange;

	public static className: string = "LineSeries";
	public static classNames: Array<string> = XYSeries.classNames.concat([LineSeries.className]);

	protected _endIndex!: number;

	protected _strokeGenerator = line();
	protected _fillGenerator = area();

	protected _afterNew() {
		this._fillGenerator.y0(function(p: number[]) {
			return p[3];
		});

		this._fillGenerator.x0(function(p: number[]) {
			return p[2];
		});

		this._fillGenerator.y1(function(p: number[]) {
			return p[1];
		});

		this._fillGenerator.x1(function(p: number[]) {
			return p[0];
		});

		super._afterNew();
	}

	/**
	 * @ignore
	 */
	public makeStroke(strokes: ListTemplate<Graphics>): Graphics {
		const stroke = this.mainContainer.children.push(strokes.make());
		strokes.push(stroke);
		return stroke;
	}

	/**
	 * A [[TemplateList]] of all line segments in series.
	 *
	 * `strokes.template` can be used to set default settings for all line
	 * segments, or to change on existing ones.
	 *
	 * @default new ListTemplate<Graphics>
	 */
	public readonly strokes: ListTemplate<Graphics> = new ListTemplate(
		Template.new({}),
		() => Graphics._new(this._root, {
			themeTags: $utils.mergeTags(this.strokes.template.get("themeTags", []), ["line", "series", "stroke"])
		}, [this.strokes.template]),
	);

	/**
	 * @ignore
	 */
	public makeFill(fills: ListTemplate<Graphics>): Graphics {
		const fill = this.mainContainer.children.push(fills.make());
		fills.push(fill);
		return fill;
	}

	/**
	 * A [[TemplateList]] of all segment fills in series.
	 *
	 * `fills.template` can be used to set default settings for all segment
	 * fills, or to change on existing ones.
	 *
	 * @default new ListTemplate<Graphics>
	 */
	public readonly fills: ListTemplate<Graphics> = new ListTemplate(
		Template.new({}),
		() => Graphics._new(this._root, {
			themeTags: $utils.mergeTags(this.strokes.template.get("themeTags", []), ["line", "series", "fill"])
		}, [this.fills.template]),
	);

	// custom set from data
	protected _fillTemplate: Template<Graphics> | undefined;
	protected _strokeTemplate: Template<Graphics> | undefined;

	public _updateChildren() {

		this._strokeTemplate = undefined;
		this._fillTemplate = undefined;

		let xAxis = this.get("xAxis");
		let yAxis = this.get("yAxis");

		if (this.isDirty("stroke")) {
			this.strokes.template.set("stroke", this.get("stroke"));
		}
		if (this.isDirty("fill")) {
			this.fills.template.set("fill", this.get("fill"));
		}

		if (this.isDirty("curveFactory")) {
			const curveFactory = this.get("curveFactory")!;
			if (curveFactory) {
				this._strokeGenerator.curve(curveFactory);
				this._fillGenerator.curve(curveFactory);
			}
		}

		if (xAxis.inited && yAxis.inited) {
			if (this._axesDirty || this._valuesDirty || this._stackDirty || this.isDirty("vcx") || this.isDirty("vcy") || this._sizeDirty || this.isDirty("connect") || this.isDirty("curveFactory")) {

				this.fills.each((fill) => {
					fill.setPrivate("visible", false);
				})

				this.strokes.each((fill) => {
					fill.setPrivate("visible", false);
				})

				this.axisRanges.each((axisRange) => {
					let fills = axisRange.fills;
					if (fills) {
						fills.each((fill) => {
							fill.setPrivate("visible", false);
						})
					}

					let strokes = axisRange.strokes;
					if (strokes) {
						strokes.each((stroke) => {
							stroke.setPrivate("visible", false);
						})
					}
				})

				let startIndex = this.getPrivate("startIndex", 0);

				let strokeTemplateField = this.strokes.template.get("templateField");
				let fillTemplateField = this.fills.template.get("templateField");

				let strokeTemplateFound = true;
				let fillTemplateFound = true;

				if (strokeTemplateField) {
					strokeTemplateFound = false;
				}
				if (fillTemplateField) {
					fillTemplateFound = false;
				}

				for (let i = startIndex - 1; i >= 0; i--) {
					let dataItem = this.dataItems[i];
					let hasValues = true;
					let dataContext = dataItem.dataContext as any;
					if (strokeTemplateField) {
						if (dataContext[strokeTemplateField]) {
							strokeTemplateFound = true;
						}
					}
					if (fillTemplateField) {
						if (dataContext[fillTemplateField]) {
							fillTemplateFound = true;
						}
					}

					$array.each(this._valueFields, (field) => {
						if (!$type.isNumber(dataItem.get(field as any))) {
							hasValues = false;
						}
					})
					if (hasValues && strokeTemplateFound && fillTemplateFound) {
						startIndex = i;
						break
					}
				}

				let len = this.dataItems.length;
				let endIndex = this.getPrivate("endIndex", len);

				if (endIndex < len) {
					endIndex++;
					for (let i = endIndex; i < len; i++) {
						let dataItem = this.dataItems[i];
						let hasValues = true;
						$array.each(this._valueFields, (field) => {
							if (!$type.isNumber(dataItem.get(field as any))) {
								hasValues = false;
							}
						})
						if (hasValues) {
							endIndex = i + 1;
							break;
						}
					}
				}

				this._endIndex = endIndex;

				this.strokes.clear();
				this.fills.clear();

				this._startSegment(0, startIndex);
			}
		}
		else {
			this._skipped = true;
		}

		super._updateChildren();
	}

	protected _startSegment(segmentIndex: number, dataItemIndex: number) {
		let endIndex = this._endIndex;
		let currentEndIndex = endIndex;

		const autoGapCount = this.get("autoGapCount")!;
		const connect = this.get("connect");

		const fill = this.makeFill(this.fills);

		const fillTemplate = this._fillTemplate;
		const originalTemplate = this.fills.template;
		if (fillTemplate && fillTemplate != originalTemplate) {
			fill.template = fillTemplate;
		}

		fill.setPrivate("visible", true);

		const stroke = this.makeStroke(this.strokes);

		const strokeTemplate = this._strokeTemplate;
		if (strokeTemplate && strokeTemplate != this.strokes.template) {
			stroke.template = strokeTemplate;
		}

		stroke.setPrivate("visible", true);

		let xAxis = this.get("xAxis");
		let yAxis = this.get("yAxis");
		let baseAxis = this.get("baseAxis")!;

		let vcx = this.get("vcx", 1);
		let vcy = this.get("vcy", 1);

		let xField = this._xField;
		let yField = this._yField;

		let xOpenField = this._xOpenField;
		let yOpenField = this._yOpenField;

		const xOpenFieldValue = this.get("openValueXField");
		const yOpenFieldValue = this.get("openValueYField");

		if (!xOpenFieldValue) {
			xOpenField = this._xField;
		}

		if (!yOpenFieldValue) {
			yOpenField = this._yField;
		}

		const stacked = this.get("stacked");

		const basePosX = xAxis.basePosition();
		const basePosY = yAxis.basePosition();

		let baseField: string;
		if (baseAxis === yAxis) {
			baseField = this._yField;
		}
		else {
			baseField = this._xField;
		}

		const segments: Array<Array<Array<number>>> = [];
		let points: Array<Array<number>> = [];
		segments.push(points);

		const strokeTemplateField = this.strokes.template.get("templateField");
		const fillTemplateField = this.fills.template.get("templateField");

		let locationX = this.get("locationX", 0.5);
		let locationY = this.get("locationY", 0.5);

		let openLocationX = this.get("openLocationX", locationX);
		let openLocationY = this.get("openLocationY", locationY);

		let i: number;

		let fillVisible = this.fills.template.get("visible");
		if (this.axisRanges.length > 0) {
			fillVisible = true;
		}

		let getOpen = false;
		if (stacked || xOpenFieldValue || yOpenFieldValue) {
			getOpen = true;
		}

		const o = {
			points, segments, stacked, getOpen, basePosX, basePosY, fillVisible, xField, yField, xOpenField, yOpenField, vcx, vcy, baseAxis, xAxis, yAxis, locationX, locationY, openLocationX, openLocationY
		}

		for (i = dataItemIndex; i < currentEndIndex; i++) {
			const dataItem = this._dataItems[i];

			let valueX = dataItem.get(xField as any);
			let valueY = dataItem.get(yField as any);

			if (valueX == null || valueY == null) {
				if (!connect) {
					points = [];
					segments.push(points);
					o.points = points;
				}
			}
			else {
				this._getPoints(dataItem, o);
			}

			if (strokeTemplateField) {
				let strokeTemplate = (dataItem.dataContext as any)[strokeTemplateField]
				if (strokeTemplate) {
					if (!(strokeTemplate instanceof Template)) {
						strokeTemplate = Template.new(strokeTemplate);
					}

					this._strokeTemplate = strokeTemplate;
					if (i > dataItemIndex) {
						currentEndIndex = i;
						break;
					}
					else {
						stroke.template = strokeTemplate;
					}
				}
			}

			if (fillTemplateField) {
				let fillTemplate = (dataItem.dataContext as any)[fillTemplateField]
				if (fillTemplate) {
					if (!(fillTemplate instanceof Template)) {
						fillTemplate = Template.new(fillTemplate);
					}

					this._fillTemplate = fillTemplate;
					if (i > dataItemIndex) {
						currentEndIndex = i;
						break;
					}
					else {
						fill.template = fillTemplate;
					}
				}
			}

			if (!connect) {
				let nextItem = this.dataItems[i + 1];
				if (nextItem) {
					if (baseAxis.shouldGap(dataItem, nextItem, autoGapCount, baseField)) {
						points = [];
						segments.push(points);
						o.points = points;
					}
				}
			}
		}


		if (i === endIndex) {
			this._endLine(points, segments[0][0]);
		}

		if (stroke) {
			this._drawStroke(stroke, segments);
		}

		if (fill) {
			this._drawFill(fill, segments);
		}

		this.axisRanges.each((axisRange) => {
			const container = axisRange.container;
			const fills = axisRange.fills!;
			let fill = this.makeFill(fills);
			if (container) {
				container.children.push(fill);
			}

			fill.setPrivate("visible", true);
			this._drawFill(fill, segments);

			const strokes = axisRange.strokes!;
			let stroke = this.makeStroke(strokes);
			if (container) {
				container.children.push(stroke);
			}

			stroke.setPrivate("visible", true);
			this._drawStroke(stroke, segments);
		})

		if (currentEndIndex < endIndex) {
			this._startSegment(segmentIndex + 1, currentEndIndex);
		}
	}

	protected _getPoints(dataItem: DataItem<this["_dataItemSettings"]>, o: { points: Array<Array<number>>, segments: number[][][], stacked: boolean | undefined, getOpen: boolean, basePosX: number, basePosY: number, fillVisible: boolean | undefined, xField: string, yField: string, xOpenField: string, yOpenField: string, vcx: number, vcy: number, baseAxis: Axis<AxisRenderer>, xAxis: Axis<AxisRenderer>, yAxis: Axis<AxisRenderer>, locationX: number, locationY: number, openLocationX: number, openLocationY: number }) {
		let points = o.points;

		let itemLocationX = dataItem.get("locationX", o.locationX);
		let itemLocationY = dataItem.get("locationY", o.locationY);

		let xPos = o.xAxis.getDataItemPositionX(dataItem, o.xField, itemLocationX, o.vcx);
		let yPos = o.yAxis.getDataItemPositionY(dataItem, o.yField, itemLocationY, o.vcy);

		if (this._shouldInclude(xPos)) {

			const iPoint = this.getPoint(xPos, yPos);
			const point = [iPoint.x, iPoint.y];

			iPoint.x += this._x;
			iPoint.y += this._y;

			dataItem.set("point", iPoint);

			if (o.fillVisible) {
				let xPos0: number = xPos;
				let yPos0: number = yPos;

				if (o.baseAxis === o.xAxis) {
					yPos0 = o.basePosY;
				}
				else if (o.baseAxis === o.yAxis) {
					xPos0 = o.basePosX;
				}

				if (o.getOpen) {
					let valueX = dataItem.get(o.xOpenField as any);
					let valueY = dataItem.get(o.yOpenField as any);

					if (valueX != null && valueY != null) {
						let itemLocationX = dataItem.get("openLocationX", o.openLocationX);
						let itemLocationY = dataItem.get("openLocationY", o.openLocationY);

						if (o.stacked) {
							let stackToItemX = dataItem.get("stackToItemX")!;
							let stackToItemY = dataItem.get("stackToItemY")!;

							if (stackToItemX) {
								xPos0 = o.xAxis.getDataItemPositionX(stackToItemX, o.xField, itemLocationX, (stackToItemX.component as XYSeries).get("vcx"));
								if($type.isNaN(xPos0)){
									xPos0 = o.basePosX;
								}
							}
							else {
								if (o.yAxis === o.baseAxis) {
									xPos0 = o.basePosX;
								}
								else {
									xPos0 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX, o.vcx);
								}
							}

							if (stackToItemY) {
								yPos0 = o.yAxis.getDataItemPositionY(stackToItemY, o.yField, itemLocationY, (stackToItemY.component as XYSeries).get("vcy"));
								if($type.isNaN(yPos0)){
									yPos0 = o.basePosY;
								}
							}
							else {
								if (o.xAxis === o.baseAxis) {
									yPos0 = o.basePosY;
								}
								else {
									yPos0 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY, o.vcy);
								}
							}
						}
						else {
							xPos0 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX, o.vcx);
							yPos0 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY, o.vcy);
						}
					}
				}

				let closeIPoint = this.getPoint(xPos0, yPos0);

				point[2] = closeIPoint.x;
				point[3] = closeIPoint.y;
			}

			points.push(point);
		}
	}


	protected _endLine(_points: Array<Array<number>>, _firstPoint: Array<number>) {

	}

	protected _drawStroke(graphics: Graphics, segments: number[][][]) {
		if (graphics.get("visible")) {
			graphics.set("draw", (display) => {
				$array.each(segments, (segment) => {
					this._strokeGenerator.context(display as any);
					this._strokeGenerator(segment as [number, number][]);
				})
			})
		}
	}

	protected _drawFill(graphics: Graphics, segments: number[][][]) {
		if (graphics.get("visible")) {
			graphics.set("draw", (display) => {
				$array.each(segments, (segment) => {
					this._fillGenerator.context(display as any);
					this._fillGenerator(segment as [number, number][]);
				})
			})
		}
	}

	protected _processAxisRange(axisRange: this["_axisRangeType"]) {
		super._processAxisRange(axisRange);
		axisRange.fills = new ListTemplate(
			Template.new({}),
			() => Graphics._new(this._root, {
				themeTags: $utils.mergeTags(axisRange.fills!.template.get("themeTags", []), ["line", "series", "fill"]),
			}, [this.fills.template, axisRange.fills!.template]),
		);

		axisRange.strokes = new ListTemplate(
			Template.new({}),
			() => Graphics._new(this._root, {
				themeTags: $utils.mergeTags(axisRange.strokes!.template.get("themeTags", []), ["line", "series", "stroke"]),
			}, [this.strokes.template, axisRange.strokes!.template])
		);
	}

	/**
	 * @ignore
	 */
	public createLegendMarker(_dataItem?: DataItem<this["_dataItemSettings"]>) {

		const legendDataItem = this.get("legendDataItem");

		if (legendDataItem) {
			const marker = legendDataItem.get("marker");

			const markerRectangle = legendDataItem.get("markerRectangle");
			if (markerRectangle) {
				markerRectangle.setPrivate("visible", false);
			}

			const legendStroke = marker.children.push(Graphics._new(this._root, {
				themeTags: ["line", "series", "legend", "marker", "stroke"]
			}, [this.strokes.template]));

			const legendFill = marker.children.push(Graphics._new(this._root, {
				themeTags: ["line", "series", "legend", "marker", "fill"]
			}, [this.fills.template]));

			const disabledColor = this._root.interfaceColors.get("disabled");

			legendStroke.states.create("disabled", { fill: disabledColor, stroke: disabledColor });
			legendFill.states.create("disabled", { fill: disabledColor, stroke: disabledColor });

			if (this.bullets.length > 0) {
				const bulletFunction = this.bullets.getIndex(0);
				if (bulletFunction) {
					const bullet = bulletFunction(this._root, this, new DataItem(this, {}, {}));
					if(bullet){
						const sprite = bullet.get("sprite");

						if (sprite instanceof Graphics) {
							sprite.states.create("disabled", { fill: disabledColor, stroke: disabledColor });
						}



						if (sprite) {
							sprite.set("tooltipText", undefined);

							marker.children.push(sprite);
							sprite.setAll({ x: marker.width() / 2, y: marker.height() / 2 });
						}
					}
				}
			}
		}
	}
}
