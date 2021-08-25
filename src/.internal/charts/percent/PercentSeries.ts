import type { DataItem } from "../../core/render/Component";
import type { Graphics } from "../../core/render/Graphics";
import type { Label } from "../../core/render/Label";
import type { Tick } from "../../core/render/Tick";
import type { ListTemplate } from "../../core/util/List";
import type { ColorSet } from "../../core/util/ColorSet";
import type { ILegendDataItem } from "../../core/render/Legend";

import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate } from "../../core/render/Series";
import { Container } from "../../core/render/Container";

import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";

export interface IPercentSeriesDataItem extends ISeriesDataItem {
	valuePercentTotal: number;
	category: string;
	slice: Graphics;
	label: Label;
	tick: Tick;
	legendDataItem: DataItem<ILegendDataItem>;
}

//type IPercentSeriesDataItemSettings = { [K in keyof IPercentSeriesDataItem]?: string; };

export interface IPercentSeriesSettings extends ISeriesSettings {

	/**
	 * A [[ColorSet]] to use when asigning colors for slices.
	 */
	colors?: ColorSet;

	/**
	 * A field in data that holds category names.
	 */
	categoryField?: string;

	/**
	 * Should slice labelsbe aligned in columns/rows?
	 */
	alignLabels?: boolean;

}

export interface IPercentSeriesPrivate extends ISeriesPrivate {
	valueAverage?: number;
	valueCount?: number;
	valueSum?: number;
	valueAbsoluteSum?: number;
	valueLow?: number;
	valueHigh?: number;
}

/**
 * A base class for any percent chart series.
 */
export abstract class PercentSeries extends Series {
	public static className: string = "PercentSeries";
	public static classNames: Array<string> = Series.classNames.concat([PercentSeries.className]);

	declare public _settings: IPercentSeriesSettings;
	declare public _privateSettings: IPercentSeriesPrivate;
	declare public _dataItemSettings: IPercentSeriesDataItem;

	declare public _sliceType: Graphics;
	declare public _labelType: Label;
	declare public _tickType: Tick;

	public readonly slicesContainer = this.children.push(Container.new(this._root, { position: "absolute", isMeasured: false }));
	public readonly labelsContainer = this.children.push(Container.new(this._root, { position: "absolute", isMeasured: false }));
	public readonly ticksContainer = this.children.push(Container.new(this._root, { position: "absolute", isMeasured: false }));

	protected _lLabels: Array<{ label: Label, y: number }> = [];
	protected _rLabels: Array<{ label: Label, y: number }> = [];
	protected _hLabels: Array<{ label: Label, y: number }> = [];

	/**
	 * A [[ListTemplate]] of all slices in series.
	 *
	 * `slices.template` can also be used to configure slices.
	 */
	public readonly slices: ListTemplate<this["_sliceType"]> = this._makeSlices();

	protected abstract _makeSlices(): ListTemplate<this["_sliceType"]>;

	/**
	 * @ignore
	 */
	public makeSlice(dataItem: DataItem<this["_dataItemSettings"]>): this["_sliceType"] {
		const slice = this.slicesContainer.children.push(this.slices.make());

		slice.on("fill", () => {
			this.updateLegendMarker(dataItem);
		})

		slice.on("stroke", () => {
			this.updateLegendMarker(dataItem);
		})		

		slice._setDataItem(dataItem);
		dataItem.set("slice", slice);
		this.slices.push(slice);

		return slice;
	}

	/**
	 * A [[ListTemplate]] of all slice labels in series.
	 *
	 * `labels.template` can also be used to configure slice labels.
	 */
	public readonly labels: ListTemplate<this["_labelType"]> = this._makeLabels();

	protected abstract _makeLabels(): ListTemplate<this["_labelType"]>;

	/**
	 * @ignore
	 */
	public makeLabel(dataItem: DataItem<this["_dataItemSettings"]>): this["_labelType"] {
		const label = this.labelsContainer.children.push(this.labels.make());
		label._setDataItem(dataItem);
		dataItem.set("label", label);
		this.labels.push(label);
		return label;
	}

	/**
	 * A [[ListTemplate]] of all slice ticks in series.
	 *
	 * `ticks.template` can also be used to configure slice ticks.
	 */
	public readonly ticks: ListTemplate<this["_tickType"]> = this._makeTicks();

	protected abstract _makeTicks(): ListTemplate<this["_tickType"]>;


	protected _shouldMakeBullet(dataItem: DataItem<this["_dataItemSettings"]>): boolean {
		if (dataItem.get("value") != null) {
			return true;
		}
		return false;
	}

	/**
	 * @ignore
	 */
	public makeTick(dataItem: DataItem<this["_dataItemSettings"]>): this["_tickType"] {
		const tick = this.ticksContainer.children.push(this.ticks.make());
		tick._setDataItem(dataItem);
		dataItem.set("tick", tick);
		this.ticks.push(tick);
		return tick;
	}

	protected _afterNew() {
		this.fields.push("category");
		super._afterNew();
	}

	public _prepareChildren() {
		super._prepareChildren();

		this._lLabels = [];
		this._rLabels = [];
		this._hLabels = [];

		if (this._valuesDirty) {
			let sum = 0;
			let absSum = 0;
			let valueHigh = 0;
			let valueLow = 0;
			let count = 0;
			$array.each(this._dataItems, (dataItem) => {
				let valueWorking = dataItem.get("valueWorking", 0);
				sum += valueWorking;
				absSum += Math.abs(valueWorking);
			});

			$array.each(this._dataItems, (dataItem) => {
				let value = dataItem.get("valueWorking", 0);
				if (value >= absSum) {
					sum = dataItem.get("value", 0);
				}

				if (value > valueHigh) {
					valueHigh = value;
				}

				if (value < valueLow) {
					valueLow = value;
				}

				count++;

				let percentTotal = value / absSum;

				if (absSum == 0) {
					percentTotal = 0;
				}

				dataItem.set("valuePercentTotal", percentTotal * 100);
			});

			this.setPrivateRaw("valueLow", valueLow);
			this.setPrivateRaw("valueHigh", valueHigh);
			this.setPrivateRaw("valueSum", sum);
			this.setPrivateRaw("valueAverage", sum / count);
			this.setPrivateRaw("valueAbsoluteSum", absSum);
		}
	}

	/**
	 * Shows hidden series.
	 *
	 * @param   duration  Animation duration in milliseconds
	 * @return            Animation promise
	 */
	public async show(duration?: number): Promise<void> {
		let promises: Array<Promise<any>> = [];
		promises.push(super.show(duration))

		promises.push(this._sequencedShowHide(true, duration));
		await Promise.all(promises);
	}

	/**
	 * Hide whole series.
	 *
	 * @param   duration  Animation duration in milliseconds
	 * @return            Animation promise
	 */
	public async hide(duration?: number): Promise<void> {
		let promises: Array<Promise<any>> = [];
		promises.push(super.hide(duration))

		promises.push(this._sequencedShowHide(false, duration));
		await Promise.all(promises);
	}

	/**
	 * @ignore 
	 */
	public _updateChildren() {
		super._updateChildren();
		if (this._valuesDirty) {
			$array.each(this._dataItems, (dataItem) => {
				dataItem.get("label").text.markDirtyText();
			});
		}

		this._arrangeDown(this._lLabels);
		this._arrangeUp(this._lLabels);

		this._arrangeDown(this._rLabels);
		this._arrangeUp(this._rLabels);

		this._arrangeLeft(this._hLabels);
		this._arrangeRight(this._hLabels);
	}

	/**
	 * Shows series's data item.
	 *
	 * @param   dataItem  Data item
	 * @param   duration  Animation duration in milliseconds
	 * @return            Promise
	 */
	public async showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void> {
		const promises = [super.showDataItem(dataItem, duration)];
		if (!$type.isNumber(duration)) {
			duration = this.get("stateAnimationDuration", 0);
		}

		const easing = this.get("stateAnimationEasing");

		let value = dataItem.get("value");

		const animation = dataItem.animate({ key: "valueWorking", to: value, duration: duration, easing: easing });
		if (animation) {
			promises.push(animation.waitForStop());
		}

		const tick = dataItem.get("tick");
		if (tick) {
			promises.push(tick.show(duration));
		}
		const label = dataItem.get("label");
		if (label) {
			promises.push(label.show(duration));
		}

		const slice = dataItem.get("slice");
		if (slice) {
			promises.push(slice.show(duration));
		}

		await Promise.all(promises);
	}

	/**
	 * Hides series's data item.
	 *
	 * @param   dataItem  Data item
	 * @param   duration  Animation duration in milliseconds
	 * @return            Promise
	 */
	public async hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void> {
		const promises = [super.hideDataItem(dataItem, duration)];
		const hiddenState = this.states.create("hidden", {})

		if (!$type.isNumber(duration)) {
			duration = hiddenState.get("stateAnimationDuration", this.get("stateAnimationDuration", 0));
		}

		const easing = hiddenState.get("stateAnimationEasing", this.get("stateAnimationEasing"));

		const animation = dataItem.animate({ key: "valueWorking", to: 0, duration: duration, easing: easing });
		if (animation) {
			promises.push(animation.waitForStop());
		}

		const tick = dataItem.get("tick");
		if (tick) {
			promises.push(tick.hide(duration));
		}
		const label = dataItem.get("label");
		if (label) {
			promises.push(label.hide(duration));
		}

		const slice = dataItem.get("slice");
		if (slice) {
			promises.push(slice.hide(duration));
		}

		await Promise.all(promises);
	}

	/**
	 * @ignore
	 */
	public disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>) {
		super.disposeDataItem(dataItem);
		let label = dataItem.get("label");
		if (label) {
			this.labels.removeValue(label);
			label.dispose();
		}
		let tick = dataItem.get("tick");
		if (tick) {
			this.ticks.removeValue(tick);
			tick.dispose();
		}
		let slice = dataItem.get("slice");
		if (slice) {
			this.slices.removeValue(slice);
			slice.dispose();
		}
	}

	/**
	 * @ignore
	 */
	public updateLegendMarker(dataItem: DataItem<this["_dataItemSettings"]>) {
		const slice = dataItem.get("slice");

		if (slice) {
			const legendDataItem = dataItem.get("legendDataItem");
			if (legendDataItem) {
				const markerRectangle = legendDataItem.get("markerRectangle");
				if (markerRectangle) {
					markerRectangle.setAll({ fill: slice.get("fill"), fillOpacity: slice.get("fillOpacity"), stroke: slice.get("stroke"), strokeOpacity: slice.get("strokeOpacity") });
				}
			}
		}
	}

	protected _arrangeDown(labels?: Array<{ label: Label, y: number }>) {
		if (labels) {

			let next = this._getNextDown();

			labels.sort((a, b) => {
				if (a.y > b.y) {
					return 1;
				}
				else if (a.y < b.y) {
					return -1;
				}
				else {
					return 0;
				}
			})

			$array.each(labels, (l) => {
				const bounds = l.label.adjustedLocalBounds();
				let labelTop = bounds.top;
				if (l.y + labelTop < next) {
					l.y = next - labelTop;
				}
				l.label.set("y", l.y);

				next = l.y + bounds.bottom;
			})
		}
	}

	protected _getNextUp() {
		return this.labelsContainer.maxHeight();
	}

	protected _getNextDown() {
		return 0;
	}

	protected _arrangeUp(labels?: Array<{ label: Label, y: number }>) {
		if (labels) {
			let next = this._getNextUp();

			labels.sort((a, b) => {
				if (a.y < b.y) {
					return 1;
				}
				else if (a.y > b.y) {
					return -1;
				}
				else {
					return 0;
				}
			})

			$array.each(labels, (l) => {
				const bounds = l.label.adjustedLocalBounds();
				let labelBottom = bounds.bottom;
				if (l.y + labelBottom > next) {
					l.y = next - labelBottom;
				}
				l.label.set("y", l.y);
				next = l.y + bounds.top;
			})
		}
	}

	protected _arrangeRight(labels?: Array<{ label: Label, y: number }>) {
		if (labels) {

			let next = 0;

			labels.sort((a, b) => {
				if (a.y > b.y) {
					return 1;
				}
				else if (a.y < b.y) {
					return -1;
				}
				else {
					return 0;
				}
			})

			$array.each(labels, (l) => {
				const bounds = l.label.adjustedLocalBounds();
				let labelLeft = bounds.left;
				if (l.y + labelLeft < next) {
					l.y = next - labelLeft;
				}
				l.label.set("x", l.y);

				next = l.y + bounds.right;
			})
		}
	}

	protected _arrangeLeft(labels?: Array<{ label: Label, y: number }>) {
		if (labels) {
			let next = this.labelsContainer.maxWidth();

			labels.sort((a, b) => {
				if (a.y < b.y) {
					return 1;
				}
				else if (a.y > b.y) {
					return -1;
				}
				else {
					return 0;
				}
			})

			$array.each(labels, (l) => {
				const bounds = l.label.adjustedLocalBounds();
				let labelRight = bounds.right;
				if (l.y + labelRight > next) {
					l.y = next - labelRight;
				}
				l.label.set("x", l.y);
				next = l.y + bounds.left;
			})
		}
	}

	public _updateSize() {
		super._updateSize();
		this.markDirty();
	}

	protected _updateTick(_dataItem: DataItem<this["_dataItemSettings"]>) {

	}
}
