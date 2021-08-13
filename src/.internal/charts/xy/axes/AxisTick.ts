import type { Root } from "../../../core/Root";
import { Tick, ITickSettings, ITickPrivate } from "../../../core/render/Tick";
import type { IPoint } from "../../../core/util/IPoint";
import type { Template } from "../../../core/util/Template";


export interface IAxisTickSettings extends ITickSettings {

	/**
	 * Relative location of the tick within the cell.
	 *
	 * `0` - beginning, `0.5` - middle, `1` - end.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/xy-chart/axes/#Location_of_axis_elements} for more info
	 */
	location?: number;

	/**
	 * Relative location of the tick within the cell when it spans multiple
	 * intervals.
	 *
	 * `0` - beginning, `0.5` - middle, `1` - end.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/xy-chart/axes/#Multi_location} for more info
	 */
	multiLocation?: number;

	/**
	 * If set to `true` the tick will be shown inside plot area.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/xy-chart/axes/#Labels_ticks_inside_plot_area} for more info
	 * @default false
	 */
	inside?: boolean | undefined;

	/**
	 * The minimum relative position within visible axis scope the tick can
	 * appear on.
	 *
	 * E.g. `0.1` will mean that tick will not be shown if it's closer to the
	 * beginning of the axis than 10%.
	 * 
	 * @default 0
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/xy-chart/axes/#Start_end_labels_and_ticks} for more info
	 */
	minPosition?: number;

	/**
	 * The maximum relative position within visible axis scope the tick can
	 * appear on.
	 *
	 * E.g. `0.9` will mean that tick will not be shown if it's closer to the
	 * end of the axis than 10%.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/xy-chart/axes/#Start_end_labels_and_ticks} for more info
	 * @default 1
	 */
	maxPosition?: number;

}

export interface IAxisTickPrivate extends ITickPrivate {
}

/**
 * Draws an axis tick.
 *
 * @see {@link https://www.amcharts.com/docs/v5/getting-started/xy-chart/axes/#Ticks} for more info
 * @important
 */
export class AxisTick extends Tick {

	/**
	 * Use this method to create an instance of this class.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
	 * @param   root      Root element
	 * @param   settings  Settings
	 * @param   template  Template
	 * @return            Instantiated object
	 */
	public static new(root: Root, settings: AxisTick["_settings"], template?: Template<AxisTick>): AxisTick {
		const x = new AxisTick(root, settings, true, template);
		x._afterNew();
		return x;
	}

	declare public _settings: IAxisTickSettings;
	declare public _privateSettings: IAxisTickPrivate;

	protected _tickPoints: Array<IPoint> = [];

	public static className: string = "AxisTick";
	public static classNames: Array<string> = Tick.classNames.concat([AxisTick.className]);
}
