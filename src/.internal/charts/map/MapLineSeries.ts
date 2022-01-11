import type { IMapPointSeriesDataItem } from "./MapPointSeries";
import type { DataItem } from "../../core/render/Component";

import { MapSeries, IMapSeriesSettings, IMapSeriesDataItem, IMapSeriesPrivate } from "./MapSeries";
import { MapLine } from "./MapLine";
import { ListTemplate } from "../../core/util/List";
import { Template } from "../../core/util/Template";

import * as $array from "../../core/util/Array";

/**
 * @ignore
 */
export interface IMapLineSeriesPrivate extends IMapSeriesPrivate {
}

export interface IMapLineSeriesDataItem extends IMapSeriesDataItem {

	/**
	 * Related [[MapLine]] object.
	 */
	mapLine?: MapLine;

	/**
	 * GeoJSON geometry of the line.
	 */
	geometry?: GeoJSON.LineString | GeoJSON.MultiLineString;

	/**
	 * An array of data items from [[MapPointSeries]] to use as line end-points.
	 */
	pointsToConnect?: Array<DataItem<IMapPointSeriesDataItem>>;

}

export interface IMapLineSeriesSettings extends IMapSeriesSettings {

	/**
	 * If set to `true` will hide line segments that are in the invisible range
	 * of the map.
	 *
	 * For example on the side of the globe facing away from the viewer when
	 * used with Orthographic projection.
	 *
	 * NOTE: not all projections have invisible side.
	 */
	clipBack?: boolean;

}

/**
 * Creates a map series for displaying lines on the map.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/} for more info
 * @important
 */
export class MapLineSeries extends MapSeries {

	/**
	 * @ignore
	 */
	public makeMapLine(dataItem: DataItem<this["_dataItemSettings"]>): MapLine {
		const mapLine = this.children.push(this.mapLines.make());
		mapLine._setDataItem(dataItem);
		this.mapLines.push(mapLine);
		return mapLine;
	}

	/**
	 * A [[ListTemplate]] of all lines in series.
	 *
	 * `mapLines.template` can also be used to configure lines.
	 *
	 * @default new ListTemplate<MapLine>
	 */
	public readonly mapLines: ListTemplate<MapLine> = new ListTemplate(
		Template.new({}),
		() => MapLine._new(this._root, {}, [this.mapLines.template])
	);

	public static className: string = "MapLineSeries";
	public static classNames: Array<string> = MapSeries.classNames.concat([MapLineSeries.className]);

	declare public _settings: IMapLineSeriesSettings;
	declare public _privateSettings: IMapLineSeriesPrivate;
	declare public _dataItemSettings: IMapLineSeriesDataItem;

	protected _types: Array<GeoJSON.GeoJsonGeometryTypes> = ["LineString", "MultiLineString"];

	/**
	 * @ignore
	 */
	public markDirtyProjection() {
		$array.each(this.dataItems, (dataItem) => {
			let mapLine = dataItem.get("mapLine");
			if (mapLine) {
				mapLine.markDirtyProjection();
			}
		})
	}

	public _prepareChildren() {
		super._prepareChildren();

		if (this.isDirty("stroke")) {
			this.mapLines.template.set("stroke", this.get("stroke"));
		}
	}

	protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>) {
		super.processDataItem(dataItem);

		let mapLine = dataItem.get("mapLine");
		if (!mapLine) {
			mapLine = this.makeMapLine(dataItem);
		}

		dataItem.set("mapLine", mapLine);
		const pointsToConnect = dataItem.get("pointsToConnect");
		if (pointsToConnect) {
			$array.each(pointsToConnect, (point) => {

				point.on("geometry", () => {
					this.markDirtyValues(dataItem);
				})

				point.on("longitude", () => {
					this.markDirtyValues(dataItem);
				})

				point.on("latitude", () => {
					this.markDirtyValues(dataItem);
				})
			})

			this.markDirtyValues(dataItem);
		}

		mapLine.setPrivate("series", this);
	}

	/**
	 * Forces a repaint of the element which relies on data.
	 *
	 * @since 5.0.21
	 */
	public markDirtyValues(dataItem: DataItem<this["_dataItemSettings"]>) {
		super.markDirtyValues();
		if (dataItem) {
			const mapLine = dataItem.get("mapLine");
			if (mapLine) {
				const pointsToConnect = dataItem.get("pointsToConnect");
				if (pointsToConnect) {
					let coordinates: Array<Array<number>> = [];
					$array.each(pointsToConnect, (point) => {
						const longitude = point.get("longitude");
						const latitude = point.get("latitude");
						if (longitude != null && latitude != null) {
							coordinates.push([longitude, latitude]);
						}
						else {
							const geometry = point.get("geometry");
							if (geometry) {
								const coords = geometry.coordinates;
								if (coords) {
									coordinates.push([coords[0] as any, coords[1] as any]);
								}
							}
						}
					})

					let geometry: any = { type: "LineString", coordinates: coordinates };

					dataItem.setRaw("geometry", geometry);
					mapLine.set("geometry", geometry);
				}
				else {
					mapLine.set("geometry", dataItem.get("geometry"));
				}
			}
		}
	}

	/**
	 * @ignore
	 */
	public disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>) {
		super.disposeDataItem(dataItem);
		const mapLine = dataItem.get("mapLine");
		if (mapLine) {
			this.mapLines.removeValue(mapLine);
			mapLine.dispose();
		}
	}
}
