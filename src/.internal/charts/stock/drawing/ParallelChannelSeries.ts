import type { DataItem } from "../../../core/render/Component";
import type { Graphics } from "../../../core/render/Graphics";
import type { IPoint } from "../../../core/util/IPoint";
import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
import type { ISpritePointerEvent } from "../../../core/render/Sprite";

export interface IParallelChannelSeriesDataItem extends ISimpleLineSeriesDataItem { }

export interface IParallelChannelSeriesSettings extends ISimpleLineSeriesSettings { }

export interface IParallelChannelSeriesPrivate extends ISimpleLineSeriesPrivate { }

export class ParallelChannelSeries extends SimpleLineSeries {
	public static className: string = "ParallelChannelSeries";
	public static classNames: Array<string> = SimpleLineSeries.classNames.concat([ParallelChannelSeries.className]);

	declare public _settings: IParallelChannelSeriesSettings;
	declare public _privateSettings: IParallelChannelSeriesPrivate;
	declare public _dataItemSettings: IParallelChannelSeriesDataItem;

	protected _index: number = 0;

	protected _di: Array<{ [index: string]: DataItem<IParallelChannelSeriesDataItem> }> = []
	protected _tag = "parallelchannel";

	protected _firstClick: boolean = false;

	protected _addPointsReal(valueX: number, valueY: number, index: number) {
		this._addPoint(valueX, valueY, "p1", index);
		this._addPoint(valueX, valueY, "p2", index);
		this._addPoint(valueX, valueY, "p3", index);
		this._addPoint(valueX, valueY, "p4", index);
	}

	protected _handlePointerClickReal(event: ISpritePointerEvent) {
		if (!this._isDragging) {
			if (!this._isDrawing) {
				if (!this._firstClick) {
					this._isDrawing = true;
					this._index++;
					this._addPoints(event, this._index);
					this._firstClick = true;
				}
			}
			else {
				if (!this._firstClick) {
					this._isDrawing = false;
				}
				this._firstClick = false;
			}
		}
	}


	protected _handlePointerMoveReal(_event: ISpritePointerEvent) {
		if (this._isDrawing) {
			const movePoint = this._movePointerPoint;

			if (movePoint) {

				const xAxis = this.get("xAxis");
				const yAxis = this.get("yAxis");

				const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(movePoint.x)));
				const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(movePoint.y)), valueX);

				const index = this._index;

				const diP1 = this._di[index]["p1"];
				const diP2 = this._di[index]["p2"];

				const diP3 = this._di[index]["p3"];
				const diP4 = this._di[index]["p4"];

				if (diP1 && diP2) {
					if (this._firstClick) {
						this._setContext(diP2, "valueX", valueX);
						this._setContext(diP2, "valueY", valueY, true);
						this._setXLocation(diP1, diP1.get("valueX", 0));
						this._setXLocation(diP3, diP3.get("valueX", 0));
						this._setXLocation(diP2, valueX);

						this._setContext(diP4, "valueX", valueX);
						this._setContext(diP4, "valueY", valueY, true);
						this._setXLocation(diP4, valueX);
					}
					else {
						this._setContext(diP4, "valueY", valueY, true);
						this._setContext(diP3, "valueY", diP1.get("valueY", 0) + valueY - diP2.get("valueY", 0), true);
					}

					this._updateSegment(index);
				}

			}
		}
	}

	public _updateChildren() {
		super._updateChildren();
		const chart = this.chart;
		this.fills.clear();
		if (chart) {
			for (let i = 0; i < this._lines.length; i++) {
				const line = this._lines[i];
				if (line) {
					const diP1 = this._di[i]["p1"];
					const diP2 = this._di[i]["p2"];
					const diP3 = this._di[i]["p3"];
					const diP4 = this._di[i]["p4"];
					const di = this._di[i]["e"];

					const dataContext = di.dataContext as any;
					const fillGraphics = this.makeFill(this.fills);

					const index = this.dataItems.indexOf(diP1);
					for (let j = index; j >= 0; j--) {
						const dataContext = this.dataItems[j].dataContext as any;
						const template = dataContext.fill;
						if (template) {
							fillGraphics.template = template;
						}
					}

					const userData = [this.dataItems.indexOf(diP1), this.dataItems.indexOf(diP2)];

					let fillColor = this.get("fillColor", this.get("fill"));

					const fillTemplate = dataContext.fill;

					if (fillTemplate) {
						fillColor = fillTemplate.get("fill");
					}

					const settings = { userData: userData, fill: fillColor };
					fillGraphics.setAll(settings);

					const p1 = diP1.get("point");
					const p2 = diP2.get("point");
					const p3 = diP3.get("point");
					const p4 = diP4.get("point");

					if (p1 && p2 && p3 && p4) {
						fillGraphics.set("draw", (display) => {
							display.moveTo(p1.x, p1.y);
							display.lineTo(p2.x, p2.y);
							display.lineTo(p4.x, p4.y);
							display.lineTo(p3.x, p3.y);
							display.lineTo(p1.x, p1.y);
						})

						const strokeGraphics = this.strokes.getIndex(this._getStrokeIndex(i));

						if (strokeGraphics) {
							strokeGraphics.set("draw", (display) => {
								display.moveTo(p1.x, p1.y);
								display.lineTo(p2.x, p2.y);

								display.moveTo(p3.x, p3.y);
								display.lineTo(p4.x, p4.y);
							})
						}

						line.set("draw", (display) => {
							display.moveTo(p1.x, p1.y + (p3.y - p1.y) / 2);
							display.lineTo(p2.x, p2.y + (p4.y - p2.y) / 2);
						})

						this._updateOthers(i, fillGraphics, p1, p2);
					}
				}
			}
		}
	}

	protected _handleBulletDraggedReal(dataItem: DataItem<this["_dataItemSettings"]>, point: IPoint) {
		const xAxis = this.get("xAxis");
		const yAxis = this.get("yAxis");

		const dataContext = dataItem.dataContext as any;
		const index = dataContext.index;

		const diP1 = this._di[index]["p1"];
		const diP2 = this._di[index]["p2"];
		const diP3 = this._di[index]["p3"];
		const diP4 = this._di[index]["p4"];

		if (diP1 && diP2 && diP3 && diP4) {

			const dy = diP3.get("valueY", 0) - diP1.get("valueY", 0);

			const vx = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(point.x)));
			const vy = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), vx);

			this._setContext(dataItem, "valueX", vx);
			this._setContext(dataItem, "valueY", vy, true);
			this._setXLocation(dataItem, vx);

			const corner = dataContext.corner;

			if (corner == "p1") {
				this._setContext(diP3, "valueX", vx);
				this._setContext(diP3, "valueY", vy + dy, true);
				this._setXLocation(diP3, vx);
			}
			else if (corner == "p3") {
				this._setContext(diP1, "valueX", vx);
				this._setContext(diP1, "valueY", vy - dy, true);
				this._setXLocation(diP1, vx);
			}
			else if (corner == "p2") {
				this._setContext(diP4, "valueX", vx);
				this._setContext(diP4, "valueY", vy + dy, true);
				this._setXLocation(diP4, vx);
			}
			else if (corner == "p4") {
				this._setContext(diP2, "valueX", vx);
				this._setContext(diP2, "valueY", vy - dy, true);
				this._setXLocation(diP2, vx);
			}
		}
		this._positionBullets(diP1);
		this._positionBullets(diP2);
		this._positionBullets(diP3);
		this._positionBullets(diP4);
	}

	protected _updateOthers(_index: number, _fillGraphics: Graphics, _p1: IPoint, _p2: IPoint) {

	}

	protected _drawFill() {

	}

	protected _updateLine() {

	}
}