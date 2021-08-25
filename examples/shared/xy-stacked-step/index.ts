import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

/**
 * Create root element
 * https://www.amcharts.com/docs/v5/getting-started/#Root_element
 */
const root = am5.Root.new("chartdiv");

/**
 * Set themes
 * https://www.amcharts.com/docs/v5/concepts/themes/
 */
root.setThemes([
  am5themes_Animated.new(root)
]);

/**
 * Create chart
 * https://www.amcharts.com/docs/v5/charts/xy-chart/
 */
const chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX"
  })
);

const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

let date = new Date();
date.setHours(0, 0, 0, 0);
let value1 = 100;
let value2 = 20;

function generateData() {
  value1 = Math.round((Math.random() * 10 - 5) + value1);
  value2 = Math.round((Math.random() * 4 - 2) + value2);

  if (value1 < 10) {
    value1 = 10;
  }

  if (value2 < 1) {
    value2 = 1;
  }

  am5.time.add(date, "day", 1);
  return { date: date.getTime(), value1: value1, value2: value2 };
}

function generateDatas(count: number) {
  const data = [];
  for (let i = 0; i < count; ++i) {
    data.push(generateData());
  }
  return data;
}

/**
 * Create axes
 * https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
 */
const xAxis = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {
      themeTags: ["axis"],
      animationDuration: 200
    })
  })
);

const yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);


const series1 = chart.series.push(am5xy.StepLineSeries.new(root, { name: "Series", xAxis: xAxis, yAxis: yAxis, valueYField: "value1", valueXField: "date" }));
series1.fills.template.setAll({ fillOpacity: 0.5, visible: true });

const series2 = chart.series.push(am5xy.StepLineSeries.new(root, { name: "Series", stacked: true, xAxis: xAxis, yAxis: yAxis, valueYField: "value2", valueXField: "date" }));
series2.fills.template.setAll({ fillOpacity: 0.5, visible: true });

const tooltip1 = series1.set("tooltip", am5.Tooltip.new(root, {}));
tooltip1.label.set("text", "{valueY}");

const tooltip2 = series2.set("tooltip", am5.Tooltip.new(root, {}));
tooltip2.label.set("text", "{valueY}");

/**
 * Add scrollbar
 * https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
 */
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

let data = generateDatas(200);
series1.data.setAll(data);
series2.data.setAll(data);
series1.appear(1000);
series2.appear(1000);
chart.appear(1000);