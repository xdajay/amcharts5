import { LineSeries, ILineSeriesSettings, ILineSeriesPrivate, ILineSeriesDataItem } from "./LineSeries";
import type { Root } from "../../../core/Root";
import type { Template } from "../../../core/util/Template";
import { curveMonotoneXTension } from "../../../core/render/MonotoneXTension";


export interface ISmoothedXLineSeriesDataItem extends ILineSeriesDataItem {

}

export interface ISmoothedXLineSeriesSettings extends ILineSeriesSettings {

	/**
	 * A tension force for the smoothing (0-1). The smaller the value the more
	 * curvy the line will be.
	 * 
	 * @default 0.5
	 */
	tension?: number;

}

export interface ISmoothedXLineSeriesPrivate extends ILineSeriesPrivate {
}

/**
 * Smoothed line series suitable for horizontal plots.
 *
 * @see {@link https://www.amcharts.com/docs/v5/getting-started/xy-chart/series/smoothed-series/} for more info
 */
export class SmoothedXLineSeries extends LineSeries {
	public static className: string = "SmoothedXLineSeries";
	public static classNames: Array<string> = LineSeries.classNames.concat([SmoothedXLineSeries.className]);

	declare public _settings: ISmoothedXLineSeriesSettings;
	declare public _privateSettings: ISmoothedXLineSeriesPrivate;
	declare public _dataItemSettings: ISmoothedXLineSeriesDataItem;

	/**
	 * Use this method to create an instance of this class.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
	 * @param   root      Root element
	 * @param   settings  Settings
	 * @param   template  Template
	 * @return            Instantiated object
	 */
	public static new(root: Root, settings: LineSeries["_settings"], template?: Template<LineSeries>): SmoothedXLineSeries {
		const x = new SmoothedXLineSeries(root, settings, true, template);
		x._afterNew();
		return x;
	}

	protected _afterNew() {
		this._setDefault("curveFactory", curveMonotoneXTension(this.get("tension", 0.5)) as any);
		super._afterNew();
	}

	public _updateChildren() {
		if (this.isDirty("tension")) {
			this.set("curveFactory", curveMonotoneXTension(this.get("tension", 0.5)) as any);
			this._valuesDirty = true;
		}

		super._updateChildren();
	}
}
