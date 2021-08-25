import type { Root } from "../../../core/Root";
import { DataItem } from "../../../core/render/Component";
import type { AxisRenderer } from "./AxisRenderer";
import { Axis, IAxisSettings, IAxisPrivate, IAxisDataItem, IAxisEvents } from "./Axis";
import type { IXYSeriesDataItem, XYSeries } from "../series/XYSeries";
import type { Template } from "../../../core/util/Template";
import * as $type from "../../../core/util/Type";
import * as $array from "../../../core/util/Array";
import * as $math from "../../../core/util/Math";
import * as $utils from "../../../core/util/Utils";
//import * as $order from "../../../core/util/Order";

export interface IValueAxisSettings<R extends AxisRenderer> extends IAxisSettings<R> {

	/**
	 * Override minimum value for the axis scale.
	 *
	 * NOTE: the axis might modify the minimum value to fit into its scale better,
	 * unless `strictMinMax` is set to `true`.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Custom_scope} for more info
	 */
	min?: number;

	/**
	 * Override maximum value for the axis scale.
	 *
	 * NOTE: the axis might modify the maximum value to fit into its scale better,
	 * unless `strictMinMax` is set to `true`.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Custom_scope} for more info
	 */
	max?: number;

	/**
	 * Force axis scale to be precisely at values as set in `min` and/or `max`.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Custom_scope} for more info
	 */
	strictMinMax?: boolean;

	/**
	 * If set to `true` axis will use logarithmic scale.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Logarithmic_scale} for more info
	 */
	logarithmic?: boolean;

	/**
	 * Treat zero values as some other value.
	 *
	 * Useful in situations where zero would result in error, i.e. logarithmic
	 * scale.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Logarithmic_scale} for more info
	 */
	treatZeroAs?: number;

	/**
	 * Relative extension to the automatically-calculated minimum value of the
	 * axis scale.
	 *
	 * E..g. `0.1` will extend the scale by 10%, so if max value is `1000` and
	 * minimum value is `0`, the new minimum value will be `-100`.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Relative_scope_extension} for more info
	 */
	extraMin?: number;

	/**
	 * Relative extension to the automatically-calculated maximum value of the
	 * axis scale.
	 *
	 * E..g. `0.1` will extend the scale by 10%, so if max value is `1000`, the
	 * axis will now show maximum value of `1100`.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Relative_scope_extension} for more info
	 */
	extraMax?: number;

	/**
	 * Base value, which indicates the threshold between "positive" and "negative"
	 * values.
	 * 
	 * @default 0
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Base_value} for more info
	 */
	baseValue?: number;

	/**
	 * Maximum number of decimals to allow in axis labels.
	 *
	 * This setting not only affects formatting of the labels, but also where and
	 * how many grid/labels are placed on the axis.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Label_format} for more info
	 */
	maxPrecision?: number;

	/**
	 * A function that can be used to specify how to configure axis fills.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_fills} for more info
	 */
	fillRule?: (dataItem: DataItem<IValueAxisDataItem>) => void;

	/**
	 * Number format to use for axis labels.
	 *
	 * If not set, will use format set in global number formatter.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Label_format} for more info
	 */
	numberFormat?: string;

	/**
	 * A numeric format used for numbers displayed in axis tooltip.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Tooltip_number_format} for more info
	 */
	tooltipNumberFormat?: string;

	/**
	 * If set, will use greater precision for the axis fooltip than the one for
	 * axis' actual labels.
	 *
	 * E.g. if axis displays labels with one decimal (`1.0`, `1.1`, `1.2`) setting
	 * this setting to `1` would allow two decimals in axis tooltip, e.g. `1.15`.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Tooltip_number_format} for more info
	 */
	extraTooltipPrecision?: number;

	/**
	 * If your series relies on dynamically calculated values, like value
	 * changes, percents, or total sums, set this to `true`.
	 * 
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Calculated_values} for more info
	 */
	calculateTotals?: boolean;

}

export interface IValueAxisDataItem extends IAxisDataItem {

	/**
	 * Value of the data item.
	 */
	value?: number;

	/**
	 * End value for axis items that span multiple values, like axis ranges.
	 */
	endValue?: number;

}

export interface IMinMaxStep {
	min: number;
	max: number;
	step: number;
}

export interface IValueAxisPrivate extends IAxisPrivate {
	min?: number;
	max?: number;
	minFinal?: number;
	maxFinal?: number;
	selectionMin?: number;
	selectionMax?: number;
	step?: number;
	stepDecimalPlaces?: number;
}

export interface IValueAxisEvents extends IAxisEvents {

}

/**
 * Creates a value axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/} for more info
 * @important
 */
export class ValueAxis<R extends AxisRenderer> extends Axis<R> {

	/**
	 * Use this method to create an instance of this class.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
	 * @param   root      Root element
	 * @param   settings  Settings
	 * @param   template  Template
	 * @return            Instantiated object
	 */
	public static new<R extends AxisRenderer>(root: Root, settings: ValueAxis<R>["_settings"], template?: Template<ValueAxis<R>>): ValueAxis<R> {
		settings.themeTags = $utils.mergeTags(settings.themeTags, ["axis"]);
		const x = new ValueAxis<R>(root, settings, true, template);
		x._afterNew();
		return x;
	}

	public static className: string = "ValueAxis";
	public static classNames: Array<string> = Axis.classNames.concat([ValueAxis.className]);

	declare public _settings: IValueAxisSettings<R>;
	declare public _privateSettings: IValueAxisPrivate;
	declare public _dataItemSettings: IValueAxisDataItem;
	declare public _events: IValueAxisEvents;

	protected _dirtyExtremes: boolean = false;
	protected _dirtySelectionExtremes: boolean = false;
	protected _deltaMinMax: number = 1;
	protected _minReal: number | undefined;
	protected _maxReal: number | undefined;

	protected _baseValue: number = 0;

	/**
	 * @ignore
	 */
	public markDirtyExtremes() {
		this._dirtyExtremes = true;
		this.markDirty();
	}

	/**
	 * @ignore
	 */
	public markDirtySelectionExtremes() {
		this._dirtySelectionExtremes = true;
		this.markDirty();
	}

	protected _afterNew() {
		this._setPrivate("name", "value");
		super._afterNew();
	}

	public _prepareChildren() {
		super._prepareChildren();
		//if (this._dirtyExtremes || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("min") || this.isDirty("max") || this.isDirty("extraMin") || this.isDirty("extraMax") || this.isDirty("logarithmic") || this.isDirty("treatZeroAs") || this.isDirty("baseValue") || this.isDirty("strictMinMax") || this.isDirty("maxPrecision")) {
		if (this._sizeDirty || this._dirtyExtremes || this._valuesDirty || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("min") || this.isDirty("max") || this.isDirty("extraMin") || this.isDirty("extraMax") || this.isDirty("logarithmic") || this.isDirty("treatZeroAs") || this.isDirty("baseValue") || this.isDirty("strictMinMax") || this.isDirty("maxPrecision") || this.isDirty("numberFormat")) {
			this._getMinMax();
			this._dirtyExtremes = false;
		}

		if (this._dirtySelectionExtremes) {
			this._getSelectionMinMax();
			this._dirtySelectionExtremes = false;
		}

		this._groupData();

		if (this._sizeDirty || this._valuesDirty || this.isDirty("start") || this.isDirty("end") || this.isPrivateDirty("min") || this.isPrivateDirty("selectionMax") || this.isPrivateDirty("selectionMin") || this.isPrivateDirty("max") || this.isPrivateDirty("step") || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("logarithmic")) {
			this._handleRangeChange();
			this._prepareAxisItems();
			this._updateAxisRanges();
		}

		this._baseValue = this.baseValue();

	}

	protected _groupData() {

	}

	protected _prepareAxisItems() {
		const min = this.getPrivate("min");
		const max = this.getPrivate("max");
		const numberFormat = this.get("numberFormat");
		const formatter = this.getNumberFormatter();

		if ($type.isNumber(min) && $type.isNumber(max)) {

			const logarithmic = this.get("logarithmic");
			const step = this.getPrivate("step")!;
			const selectionMin = this.getPrivate("selectionMin")!;
			const selectionMax = this.getPrivate("selectionMax")! + step;

			let value = selectionMin - step;
			let i = 0;

			if(logarithmic){
				value = selectionMin;
			}

			while (value < selectionMax) {
				let dataItem: DataItem<this["_dataItemSettings"]>;
				if (this.dataItems.length < i + 1) {
					dataItem = new DataItem(this, undefined, {});
					this._dataItems.push(dataItem);
					this.processDataItem(dataItem);
				}
				else {
					dataItem = this.dataItems[i];
				}

				this._createAssets(dataItem);

				if (dataItem.isHidden()) {
					dataItem.show();
				}

				dataItem.set("value", value);

				const label = dataItem.get("label");
				if (label) {
					if (numberFormat) {
						label.set("text", formatter.format(value, numberFormat));
					}
					else {
						label.set("text", formatter.format(value, undefined, this.getPrivate("stepDecimalPlaces")));
					}
				}

				this._prepareDataItem(dataItem);

				if (!logarithmic) {
					value += step;
				}
				else {
					let differencePower = Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E;
					if (differencePower > 1) {
						value = Math.pow(10, Math.log(min) * Math.LOG10E + i);
					}
					else {
						value += step;
					}
				}

				let stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(step)) * Math.LOG10E));
				if (stepPower < 1) {
					// exponent is less then 1 too. Count decimals of exponent
					let decCount = Math.round(Math.abs(Math.log(Math.abs(stepPower)) * Math.LOG10E)) + 2;
					// round value to avoid floating point issues
					value = $math.round(value, decCount);
				}
				i++;
			}

			for (let j = i; j < this.dataItems.length; j++) {
				this.dataItems[j].hide();
			}

			$array.each(this.series, (series) => {
				if (series.inited) {
					series._markDirtyAxes();
				}
			})

			this._updateGhost();
		}
	}


	public _prepareDataItem(dataItem: DataItem<this["_dataItemSettings"]>, count?: number) {
		let renderer = this.get("renderer");
		let value = dataItem.get("value")!;
		let endValue = dataItem.get("endValue");

		let position = this.valueToPosition(value);

		let endPosition = position;
		let fillEndPosition = this.valueToPosition(value + this.getPrivate("step")!);

		if ($type.isNumber(endValue)) {
			endPosition = this.valueToPosition(endValue);
			fillEndPosition = endPosition;
		}

		renderer.updateLabel(dataItem.get("label"), position, endPosition, count);

		const grid = dataItem.get("grid");
		renderer.updateGrid(grid, position, endPosition);
		if (grid) {
			if (value == this.get("baseValue", 0)) {
				grid.addTag("base");
				grid._applyThemes();
			}
			else if (grid.hasTag("base")) {
				grid.removeTag("base");
				grid._applyThemes();
			}
		}

		renderer.updateTick(dataItem.get("tick"), position, endPosition, count);
		renderer.updateFill(dataItem.get("axisFill"), position, fillEndPosition);
		this._processBullet(dataItem);
		renderer.updateBullet(dataItem.get("bullet"), position, endPosition);

		if (!dataItem.get("isRange")) {
			const fillRule = this.get("fillRule");
			if (fillRule) {
				fillRule(dataItem)
			}
		}
	}


	protected _handleRangeChange() {
		let selectionMin: number = this.positionToValue(this.get("start", 0));
		let selectionMax: number = this.positionToValue(this.get("end", 1));

		const gridCount = this.get("renderer").gridCount();
		let minMaxStep: IMinMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount, true);

		let stepDecimalPlaces = $utils.decimalPlaces(minMaxStep.step);
		this.setPrivateRaw("stepDecimalPlaces", stepDecimalPlaces);

		selectionMin = $math.round(selectionMin, stepDecimalPlaces);
		selectionMax = $math.round(selectionMax, stepDecimalPlaces);

		minMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount, true);

		let step = minMaxStep.step;
		selectionMin = minMaxStep.min;
		selectionMax = minMaxStep.max;

		if (this.getPrivate("selectionMin") !== selectionMin || this.getPrivate("selectionMax") !== selectionMax || this.getPrivate("step") !== step) {
			this.setPrivateRaw("selectionMin", selectionMin);
			this.setPrivateRaw("selectionMax", selectionMax);
			this.setPrivateRaw("step", step);
		}
	}

	/**
	 * Converts a relative position to a corresponding numeric value from axis
	 * scale.
	 * 
	 * @param   position  Relative position
	 * @return            Value
	 */
	public positionToValue(position: number): number {
		const min = this.getPrivate("min")!;
		const max = this.getPrivate("max")!;

		if (!this.get("logarithmic")) {
			return position * (max - min) + min;
		}
		else {
			return Math.pow(Math.E, (position * ((Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E)) + Math.log(min) * Math.LOG10E) / Math.LOG10E);
		}
	}

	/**
	 * Convers value to a relative position on axis.
	 * 
	 * @param   value  Value
	 * @return         Relative position
	 */
	public valueToPosition(value: number): number {

		const min = this.getPrivate("min")!;
		const max = this.getPrivate("max")!;

		if (!this.get("logarithmic")) {
			return (value - min) / (max - min);
		}
		else {
			if (value <= 0) {
				let treatZeroAs = this.get("treatZeroAs");
				if ($type.isNumber(treatZeroAs)) {
					value = treatZeroAs;
				}
			}
			return (Math.log(value) * Math.LOG10E - Math.log(min) * Math.LOG10E) / ((Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E));
		}
	}

	/**
	 * @ignore
	 */
	public valueToFinalPosition(value: number): number {

		const min = this.getPrivate("minFinal")!;
		const max = this.getPrivate("maxFinal")!;

		if (!this.get("logarithmic")) {
			return (value - min) / (max - min);
		}
		else {
			if (value <= 0) {
				let treatZeroAs = this.get("treatZeroAs");
				if ($type.isNumber(treatZeroAs)) {
					value = treatZeroAs;
				}
			}
			return (Math.log(value) * Math.LOG10E - Math.log(min) * Math.LOG10E) / ((Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E));
		}
	}

	/**
	 * Returns X coordinate in pixels corresponding to specific value.
	 * 
	 * @param   value     Numeric value
	 * @param   location  Location
	 * @param   baseValue Base value
	 * @return            X coordinate
	 */
	public getX(value: number, location: number, baseValue: number) {
		value = baseValue + (value - baseValue) * location;

		const position = this.valueToPosition(value);
		return this._settings.renderer.positionToCoordinate(position);
	}

	/**
	 * Returns X coordinate in pixels corresponding to specific value.
	 * 
	 * @param   value     Numeric value
	 * @param   location  Location
	 * @param   baseValue Base value
	 * @return            X coordinate
	 */
	public getY(value: number, location: number, baseValue: number) {
		value = baseValue + (value - baseValue) * location;

		const position = this.valueToPosition(value)
		return this._settings.renderer.positionToCoordinate(position);
	}

	/**
	 * @ignore
	 */
	public getDataItemCoordinateX(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number): number {
		return this._settings.renderer.positionToCoordinate(this.getDataItemPositionX(dataItem, field, _cellLocation, axisLocation));
	}

	/**
	 * @ignore
	 */
	public getDataItemPositionX(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number) {
		let value = dataItem.get(field as any);

		const stackToItem = dataItem.get("stackToItemX");
		if (stackToItem) {
			const series = dataItem.component as XYSeries;
			value = value * axisLocation + series.getStackedXValueWorking(dataItem, field);
		}
		else {
			value = this._baseValue + (value - this._baseValue) * axisLocation;
		}

		return this.valueToPosition(value);
	}

	/**
	 * @ignore
	 */
	public getDataItemCoordinateY(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number): number {
		return this._settings.renderer.positionToCoordinate(this.getDataItemPositionY(dataItem, field, _cellLocation, axisLocation));
	}

	/**
	 * @ignore
	 */
	public getDataItemPositionY(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number): number {
		let value = dataItem.get(field as any);

		const stackToItem = dataItem.get("stackToItemY");
		if (stackToItem) {
			const series = dataItem.component as XYSeries;
			value = value * axisLocation + series.getStackedYValueWorking(dataItem, field);
		}
		else {
			value = this._baseValue + (value - this._baseValue) * axisLocation;
		}

		return this.valueToPosition(value);
	}

	/**
	 * Returns relative position of axis' `baseValue`.
	 * 
	 * @return  Base value position
	 */
	public basePosition(): number {
		return this.valueToPosition(this.baseValue());
	}

	/**
	 * Base value of the [[ValueAxis]], which determines positive and negative
	 * values.
	 * 
	 * @return Base value
	 */
	public baseValue(): number {
		const min = Math.min(this.getPrivate("minFinal", -Infinity), this.getPrivate("selectionMin", -Infinity));
		const max = Math.max(this.getPrivate("maxFinal", Infinity), this.getPrivate("selectionMax", Infinity));
		let baseValue = this.get("baseValue", 0);

		if (baseValue < min) {
			baseValue = min;
		}

		if (baseValue > max) {
			baseValue = max
		}

		return baseValue;
	}

	/**
	 * @ignore
	 */
	public cellEndValue(value: number): number {
		return value;
	}

	protected fixSmallStep(step: number): number {
		// happens because of floating point error
		if (1 + step === 1) {
			step *= 2;
			return this.fixSmallStep(step);
		}
		return step;
	}

	protected _fixMin(min: number) {
		return min;
	}

	protected _fixMax(max: number) {
		return max;
	}

	public _calculateTotals() {
		if (this.get("calculateTotals")) {
			let series = this.series[0];
			if (series) {
				let startIndex = series.getPrivate("startIndex", 0);

				if (series.dataItems.length > 0) {

					if (startIndex > 0) {
						startIndex--;
					}
					let endIndex = series.getPrivate("endIndex", series.dataItems.length);
					if (endIndex < series.dataItems.length) {
						endIndex++;
					}

					let field: string | undefined;
					let vc: string | undefined;

					if (series.get("yAxis") == this) {
						field = "valueY";
						vc = "vcy";
					}
					else if (series.get("xAxis") == this) {
						field = "valueX";
						vc = "vcx";
					}

					let fieldWorking = field + "Working";

					if (field) {
						for (let i = startIndex; i < endIndex; i++) {
							let sum = 0;
							let total = 0;

							$array.each(this.series, (series) => {
								if (!series.get("excludeFromTotal")) {
									let dataItem = series.dataItems[i];
									if (dataItem) {
										let value = dataItem.get(fieldWorking as any) * series.get(vc as any);

										if (value != undefined) {
											sum += value;
											total += Math.abs(value);
										}
									}
								}
							})

							$array.each(this.series, (series) => {
								if (!series.get("excludeFromTotal")) {
									let dataItem = series.dataItems[i];
									if (dataItem) {
										let value = dataItem.get(fieldWorking as any) * series.get(vc as any);

										if (value != undefined) {
											dataItem.set((field + "Total") as any, total);
											dataItem.set((field + "Sum") as any, sum);
											dataItem.set((field + "TotalPercent") as any, value / total * 100);
										}
									}
								}
							})
						}
					}
				}
			}
		}
	}

	protected _getSelectionMinMax() {
		const min = this.getPrivate("minFinal");
		const max = this.getPrivate("maxFinal");

		const minDefined = this.get("min");
		const maxDefined = this.get("max");

		const extraMin = this.get("extraMin", 0);
		const extraMax = this.get("extraMax", 0);

		const gridCount = this.get("renderer").gridCount();

		const strictMinMax = this.get("strictMinMax", false);

		if ($type.isNumber(min) && $type.isNumber(max)) {

			let selectionMin = max;
			let selectionMax = min;

			$array.each(this.series, (series) => {
				let seriesMin: number | undefined;
				let seriesMax: number | undefined;
				if (series.get("xAxis") === this) {
					seriesMin = series.getPrivate("selectionMinX");
					seriesMax = series.getPrivate("selectionMaxX");
				}
				else if (series.get("yAxis") === this) {
					seriesMin = series.getPrivate("selectionMinY");
					seriesMax = series.getPrivate("selectionMaxY");
				}
				if (!series.isHidden() && !series.isShowing()) {
					if ($type.isNumber(seriesMin)) {
						selectionMin = Math.min(selectionMin, seriesMin);
					}

					if ($type.isNumber(seriesMax)) {
						selectionMax = Math.max(selectionMax, seriesMax);
					}
				}
			})

			if (selectionMin > selectionMax) {
				[selectionMin, selectionMax] = [selectionMax, selectionMin]
			}

			if ($type.isNumber(minDefined)) {
				if (strictMinMax) {
					selectionMin = minDefined;
				}
				else {
					selectionMin = min;
				}
			}
			else if (strictMinMax) {
				if ($type.isNumber(this._minReal)) {
					selectionMin = this._minReal;
				}
			}

			if ($type.isNumber(maxDefined)) {
				if (strictMinMax) {
					selectionMax = maxDefined;
				}
				else {
					selectionMax = max;
				}
			}
			else if (strictMinMax) {
				if ($type.isNumber(this._maxReal)) {
					selectionMax = this._maxReal;
				}
			}

			if (selectionMin === selectionMax) {
				selectionMin -= this._deltaMinMax;
				selectionMax += this._deltaMinMax;

				let minMaxStep2 = this._adjustMinMax(selectionMin, selectionMax, gridCount, strictMinMax);
				selectionMin = minMaxStep2.min;
				selectionMax = minMaxStep2.max;
			}

			let minMaxStep: IMinMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount);

			selectionMin = minMaxStep.min;
			selectionMax = minMaxStep.max;

			selectionMin -= (selectionMax - selectionMin) * extraMin;
			selectionMax += (selectionMax - selectionMin) * extraMax;

			selectionMin = $math.fitToRange(selectionMin, min, max);
			selectionMax = $math.fitToRange(selectionMax, min, max);

			// do it for the second time !important
			minMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount, true);

			selectionMin = minMaxStep.min;
			selectionMax = minMaxStep.max;

			if (strictMinMax) {
				if ($type.isNumber(minDefined)) {
					selectionMin = Math.max(selectionMin, minDefined);
				}
				if ($type.isNumber(maxDefined)) {
					selectionMax = Math.min(selectionMax, maxDefined);
				}
			}

			let start = this.valueToFinalPosition(selectionMin);
			let end = this.valueToFinalPosition(selectionMax);

			this.zoom(start, end);
		}
	}


	protected _getMinMax() {
		let minDefined = this.get("min");
		let maxDefined = this.get("max");

		let min = Infinity;
		let max = -Infinity;

		let extraMin = this.get("extraMin", 0);
		let extraMax = this.get("extraMax", 0);
		let minDiff = Infinity;

		$array.each(this.series, (series) => {
			let seriesMin: number | undefined;
			let seriesMax: number | undefined;
			if (series.get("xAxis") === this) {
				seriesMin = series.getPrivate("minX");
				seriesMax = series.getPrivate("maxX");
			}
			else if (series.get("yAxis") === this) {
				seriesMin = series.getPrivate("minY");
				seriesMax = series.getPrivate("maxY");
			}

			if ($type.isNumber(seriesMin) && $type.isNumber(seriesMax)) {
				min = Math.min(min, seriesMin);
				max = Math.max(max, seriesMax);

				let diff = seriesMax - seriesMin;

				if (diff <= 0) {
					diff = Math.abs(seriesMax / 100);
				}

				if (diff < minDiff) {
					minDiff = diff;
				}
			}
		})

		if (this.get("logarithmic")) {
			let treatZeroAs = this.get("treatZeroAs");
			if ($type.isNumber(treatZeroAs)) {
				if (min <= 0) {
					min = treatZeroAs;
				}
			}
			if (min <= 0) {
				new Error("Logarithmic value axis can not have values <= 0.");
			}
		}

		if (min === 0 && max === 0) {
			max = 0.9;
			min = -0.9;
		}

		if ($type.isNumber(minDefined)) {
			min = minDefined;
		}
		if ($type.isNumber(maxDefined)) {
			max = maxDefined;
		}

		// meaning no min/max found on series/ranges and no min/max was defined
		if (min === Infinity && max === -Infinity) {
			return;
		}

		// adapter
		let minAdapted = this.adapters.fold("min", min);
		let maxAdapted = this.adapters.fold("max", max);

		if ($type.isNumber(minAdapted)) {
			min = minAdapted;
		}

		if ($type.isNumber(maxAdapted)) {
			max = maxAdapted;
		}

		// DateAxis does some magic here
		min = this._fixMin(min);
		max = this._fixMax(max);

		// this happens if starLocation and endLocation are 0.5 and DateAxis has only one date
		if (max - min <= 1 / Math.pow(10, 15)) {
			if (max - min !== 0) {
				this._deltaMinMax = (max - min) / 2;
			}
			else {
				// the number by which we need to raise 10 to get difference
				let exponent: number = Math.log(Math.abs(max)) * Math.LOG10E;

				// here we find a number which is power of 10 and has the same count of numbers as difference has
				let power = Math.pow(10, Math.floor(exponent));

				// reduce this number by 10 times
				power = power / 10;

				this._deltaMinMax = power;
			}

			min -= this._deltaMinMax;
			max += this._deltaMinMax;
		}

		// add extras
		min -= (max - min) * extraMin;
		max += (max - min) * extraMax;

		this._minReal = min;
		this._maxReal = max;

		let strict = this.get("strictMinMax");
		if ($type.isNumber(maxDefined)) {
			strict = true;
		}

		let gridCount = this.get("renderer").gridCount();

		let minMaxStep: IMinMaxStep = this._adjustMinMax(min, max, gridCount, strict);

		min = minMaxStep.min;
		max = minMaxStep.max;

		// do it for the second time with strict true (importat!)
		minMaxStep = this._adjustMinMax(min, max, gridCount, true);

		min = minMaxStep.min;
		max = minMaxStep.max;

		// return min max if strict
		if (this.get("strictMinMax")) {
			if ($type.isNumber(minDefined)) {
				min = minDefined;
			}
			else {
				min = this._minReal;
			}

			if ($type.isNumber(maxDefined)) {
				max = maxDefined;
			}
			else {
				max = this._maxReal;
			}

			if (max - min <= 0.00000001) {
				min -= this._deltaMinMax;
				max += this._deltaMinMax;
			}

			min -= (max - min) * extraMin;
			max += (max - min) * extraMax;
		}

		minAdapted = this.adapters.fold("min", min);
		maxAdapted = this.adapters.fold("max", max);

		if ($type.isNumber(minAdapted)) {
			min = minAdapted;
		}

		if ($type.isNumber(maxAdapted)) {
			max = maxAdapted;
		}

		if (minDiff == Infinity) {
			minDiff = (max - min)
		}

		this.setPrivateRaw("maxZoomFactor", (max - min) / minDiff * this.get("maxZoomFactor", 100));

		if ($type.isNumber(min) && $type.isNumber(max)) {
			if (this.getPrivate("minFinal") !== min || this.getPrivate("maxFinal") !== max) {
				this.setPrivate("minFinal", min);
				this.setPrivate("maxFinal", max);

				const duration = this.get("interpolationDuration", 0);
				const easing = this.get("interpolationEasing");

				this.animatePrivate({ key: "min", to: min, duration, easing });
				this.animatePrivate({ key: "max", to: max, duration, easing });
			}
		}
	}


	protected _adjustMinMax(min: number, max: number, gridCount: number, strictMode?: boolean): IMinMaxStep {
		const logarithmic = this.get("logarithmic");
		// will fail if 0
		if (gridCount <= 1) {
			gridCount = 1;
		}

		gridCount = Math.round(gridCount);

		let initialMin: number = min;
		let initialMax: number = max;

		let difference = max - min;

		// in case min and max is the same, use max
		if (difference === 0) {
			difference = Math.abs(max);
		}

		// the number by which we need to raise 10 to get difference
		let exponent: number = Math.log(Math.abs(difference)) * Math.LOG10E;

		// here we find a number which is power of 10 and has the same count of numbers as difference has
		let power = Math.pow(10, Math.floor(exponent));

		// reduce this number by 10 times
		power = power / 10;

		let extra: number = power;
		if (strictMode) {
			extra = 0;
		}

		if (!logarithmic) {
			// round down min
			if (strictMode) {
				min = Math.floor(min / power) * power;
				// round up max
				max = Math.ceil(max / power) * power;
			}
			else {
				min = Math.ceil(min / power) * power - extra;
				// round up max
				max = Math.floor(max / power) * power + extra;
			}

			// don't let min go below 0 if real min is >= 0
			if (min < 0 && initialMin >= 0) {
				min = 0;
			}
			// don't let max go above 0 if real max is <= 0
			if (max > 0 && initialMax <= 0) {
				max = 0;
			}
		}
		// logarithmic
		else {
			if (min <= 0) {
				//throw Error("Logarithmic value axis can not have values <= 0.");
				min = this.get("baseValue", 0);
			}

			if (min === Infinity) {
				min = 1;
			}

			if (max === -Infinity) {
				max = 10;
			}

			min = Math.pow(10, Math.floor(Math.log(Math.abs(min)) * Math.LOG10E));
			max = Math.pow(10, Math.ceil(Math.log(Math.abs(max)) * Math.LOG10E));

			if (this.get("strictMinMax")) {
				let minDefined = this.get("min");
				let maxDefined = this.get("max");
				if ($type.isNumber(minDefined) && minDefined > 0) {
					min = minDefined;
				}
				if ($type.isNumber(maxDefined) && maxDefined > 0) {
					max = maxDefined;
				}
			}
		}

		exponent = Math.log(Math.abs(difference)) * Math.LOG10E;
		power = Math.pow(10, Math.floor(exponent));
		power = power / 100; // used to be 10 in v4, but this caused issue that there could be limited number of grids with even very small minGridDistance

		// approximate difference between two grid lines
		let step = Math.ceil((difference / gridCount) / power) * power;
		let stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(step)) * Math.LOG10E));

		// the step should divide by  2, 5, and 10.
		let stepDivisor: number = Math.ceil(step / stepPower); // number 0 - 10


		if (stepDivisor > 5) {
			stepDivisor = 10;
		}
		else if (stepDivisor <= 5 && stepDivisor > 2) {
			stepDivisor = 5;
		}

		// now get real step
		step = Math.ceil(step / (stepPower * stepDivisor)) * stepPower * stepDivisor;

		let maxPrecision = this.get("maxPrecision");
		if ($type.isNumber(maxPrecision)) {
			let ceiledStep = $math.ceil(step, maxPrecision);
			if (maxPrecision < Number.MAX_VALUE && step !== ceiledStep) {
				step = ceiledStep;
			}
		}

		let decCount: number = 0;
		// in case numbers are smaller than 1
		if (stepPower < 1) {
			// exponent is less then 1 too. Count decimals of exponent
			decCount = Math.round(Math.abs(Math.log(Math.abs(stepPower)) * Math.LOG10E)) + 1;
			// round step
			step = $math.round(step, decCount);
		}
		if (!logarithmic) {
			// final min and max
			let minCount = Math.floor(min / step);

			min = $math.round(step * minCount, decCount);

			let maxCount: number;

			if (!strictMode) {
				maxCount = Math.ceil(max / step);
			}
			else {
				maxCount = Math.floor(max / step);
			}

			if (maxCount === minCount) {
				maxCount++;
			}

			max = $math.round(step * maxCount, decCount);

			if (max < initialMax) {
				max = max + step;
			}

			if (min > initialMin) {
				min = min - step;
			}
		}

		step = this.fixSmallStep(step);

		return { min: min, max: max, step: step };
	}

	/**
	 * Returns text to be used in an axis tooltip for specific relative position.
	 * 
	 * @param   position  Position
	 * @return            Tooltip text
	 */
	public getTooltipText(position: number): string | undefined {
		const numberFormat = this.get("tooltipNumberFormat", this.get("numberFormat"));
		const formatter = this.getNumberFormatter();
		const extraDecimals = this.get("extraTooltipPrecision", 0);
		const decimals = this.getPrivate("stepDecimalPlaces", 0) + extraDecimals;
		const value = $math.round(this.positionToValue(position), decimals);

		if (numberFormat) {
			return formatter.format(value, numberFormat);
		}
		else {
			return formatter.format(value, undefined, decimals);
			//label.set("text", this.getNumberFormatter().format(value, undefined, this.getPrivate("stepDecimalPlaces")));
		}

		// //@todo number formatter + tag
		// return $math.round(this.positionToValue(position), this.getPrivate("stepDecimalPlaces")).toString();
	}

	/**
	 * Returns a data item from series that is closest to the `position`.
	 * 
	 * @param   series    Series
	 * @param   position  Relative position
	 * @return            Data item
	 */
	public getSeriesItem(series: XYSeries, position: number): DataItem<IXYSeriesDataItem> | undefined {
		let fieldName = <any>(this.getPrivate("name")! + this.get("renderer").getPrivate("letter")!);
		let value = this.positionToValue(position);

		let index: number | undefined = undefined;
		let oldDiff: number;
		$array.each(series.dataItems, (dataItem, i) => {
			const diff = Math.abs(dataItem.get(fieldName) - value);
			if (index === undefined || diff < oldDiff) {
				index = i;
				oldDiff = diff;
			}
		});

		if (index != null) {
			return series.dataItems[index];
		}
	}

	/**
	 * Zooms the axis to specific `start` and `end` values.
	 *
	 * Optional `duration` specifies duration of zoom animation in milliseconds.
	 * 
	 * @param  start     Start value
	 * @param  end       End value
	 * @param  duration  Duration in milliseconds
	 */
	public zoomToValues(start: number, end: number, duration?: number) {
		const min = this.getPrivate("minFinal", 0);
		const max = this.getPrivate("maxFinal", 0);
		if (this.getPrivate("min") != null && this.getPrivate("max") != null) {
			this.zoom((start - min) / (max - min), (end - min) / (max - min), duration);
		}
	}
}
