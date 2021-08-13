import { PyramidSeries, IPyramidSeriesSettings, IPyramidSeriesDataItem, IPyramidSeriesPrivate } from "./PyramidSeries";
import type { Root } from "../../core/Root";
import type { Template } from "../../core/util/Template";
import { Graphics } from "../../core/render/Graphics";
import { p100, p50 } from "../../core/util/Percent"


export interface IPictorialStackedSeriesDataItem extends IPyramidSeriesDataItem {

}

export interface IPictorialStackedSeriesSettings extends IPyramidSeriesSettings {

	/**
	 * An SVG path that will define the shape of the pictorial series.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/percent-charts/sliced-chart/pictorial-stacked-series/#Shape_of_the_series} for more info
	 */
	svgPath?: string;

}

export interface IPictorialStackedSeriesPrivate extends IPyramidSeriesPrivate {
}

/**
 * Creates a pictorial series for use in a [[SlicedChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/getting-started/percent-charts/sliced-chart/pictorial-stacked-series/} for more info
 * @important
 */
export class PictorialStackedSeries extends PyramidSeries {

	/**
	 * Use this method to create an instance of this class.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
	 * @param   root      Root element
	 * @param   settings  Settings
	 * @param   template  Template
	 * @return            Instantiated object
	 */
	public static new(root: Root, settings: PictorialStackedSeries["_settings"], template?: Template<PictorialStackedSeries>): PictorialStackedSeries {
		const x = new PictorialStackedSeries(root, settings, true, template);
		x._afterNew();
		return x;
	}

	protected _tag = "pictorial";

	public static className: string = "PictorialStackedSeries";
	public static classNames: Array<string> = PyramidSeries.classNames.concat([PictorialStackedSeries.className]);

	declare public _settings: IPictorialStackedSeriesSettings;
	declare public _privateSettings: IPictorialStackedSeriesPrivate;
	declare public _dataItemSettings: IPictorialStackedSeriesDataItem;

	/**
	 * A [[Graphics]] element to used as a mask (shape) for the series.
	 *
	 * This element is read-only. To modify the mask/shape, use the `svgPath` setting.
	 */
	public readonly seriesMask: Graphics = Graphics.new(this._root, { position: "absolute", x: p50, y: p50, centerX: p50, centerY: p50 });

	protected _afterNew() {
		super._afterNew();
		this.set("topWidth", p100);
		this.set("bottomWidth", p100);
		this.set("valueIs", "height");
		this.slicesContainer.set("mask", this.seriesMask);
	}

	protected _updateScale() {
		let slicesContainer = this.slicesContainer;

		let w = slicesContainer.innerWidth();
		let h = slicesContainer.innerHeight();

		let seriesMask = this.seriesMask;
		let scale = seriesMask.get("scale", 1);

		const bounds = seriesMask.localBounds();

		let mw = bounds.right - bounds.left;
		let mh = bounds.bottom - bounds.top;
		if (this.get("orientation") == "horizontal") {
			scale = w / mw;
		}
		else {
			scale = h / mh;
		}
		if (scale != Infinity && scale != NaN) {
			seriesMask.set("scale", scale);
			seriesMask.set("x", w / 2);
			seriesMask.set("y", h / 2);
		}
	}

	public _prepareChildren() {
		super._prepareChildren();
		if (this.isDirty("svgPath")) {
			this.seriesMask.set("svgPath", this.get("svgPath"));
		}

		this._updateScale();
	}

}
