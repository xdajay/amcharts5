/**
 * amCharts 5 locale
 *
 * Locale: es_ES
 * Language: Spanish (Spain)
 *
 * Follow instructions in [on this page](https://www.amcharts.com/docs/v5/concepts/locales/creating-translations/) to make corrections or add new translations.
 */
export default {
	// number formatter related
	"_decimalSeparator": ",",
	"_thousandSeparator": ".",

	// Position of the percent sign in numbers
	"_percentPrefix": null,
	"_percentSuffix": "%",

	// Default date formats for various periods
	"_date_millisecond": "mm:ss SSS",
	"_date_millisecond_full": "HH:mm:ss SSS",
	"_date_second": "HH:mm:ss",
	"_date_second_full": "HH:mm:ss",
	"_date_minute": "HH:mm",
	"_date_minute_full": "HH:mm - dd MMM",
	"_date_hour": "HH:mm",
	"_date_hour_full": "HH:mm - dd MMM",
	"_date_day": "dd MMM",
	"_date_day_full": "dd MMM",
	"_date_week": "ww",
	"_date_week_full": "dd MMM",
	"_date_month": "MMM",
	"_date_month_full": "MMM, yyyy",
	"_date_year": "yyyy",

	// Default duration formats for various base units
	"_duration_millisecond": "SSS",
	"_duration_second": "ss",
	"_duration_minute": "mm",
	"_duration_hour": "hh",
	"_duration_day": "dd",
	"_duration_week": "ww",
	"_duration_month": "MM",
	"_duration_year": "yyyy",

	// Era
	"_era_ad": "DC",
	"_era_bc": "AC",

	// Period
	"A": "",
	"P": "",
	"AM": "",
	"PM": "",
	"A.M.": "",
	"P.M.": "",

	// Dates
	"January": "Enero",
	"February": "Febrero",
	"March": "Marzo",
	"April": "Abril",
	"May": "Mayo",
	"June": "Junio",
	"July": "Julio",
	"August": "Agosto",
	"September": "Septiembre",
	"October": "Octubre",
	"November": "Noviembre",
	"December": "Diciembre",
	"Jan": "Ene",
	"Feb": "Feb",
	"Mar": "Mar",
	"Apr": "Abr",
	"May(short)": "May",
	"Jun": "Jun",
	"Jul": "Jul",
	"Aug": "Ago",
	"Sep": "Sep",
	"Oct": "Oct",
	"Nov": "Nov",
	"Dec": "Dic",
	"Sunday": "Domingo",
	"Monday": "Lunes",
	"Tuesday": "Martes",
	"Wednesday": "Miércoles",
	"Thursday": "Jueves",
	"Friday": "Viernes",
	"Saturday": "Sábado",
	"Sun": "Dom",
	"Mon": "Lun",
	"Tue": "Mar",
	"Wed": "Mie",
	"Thu": "Jue",
	"Fri": "Vie",
	"Sat": "Sáb",

	// ordinal function
	"_dateOrd": function(_day: number): string {
		return "º"
	},

	// Chart elements
	"Zoom Out": "Aumentar Zoom",
	"Play": "Reproducir",
	"Stop": "Detener",
	"Legend": "Leyenda",
	"Press ENTER to toggle": "Haga clic, toque o presione ENTER para alternar",
	"Loading": "Cargando",
	"Home": "Inicio",

	// Chart types
	"Chart": "Gráfico",
	"Serial chart": "Gráfico de serie",
	"X/Y chart": "Gráfico X/Y",
	"Pie chart": "Gráfico circular",
	"Gauge chart": "Gráfico de medidor radial",
	"Radar chart": "Gráfico de radar",
	"Sankey diagram": "Diagrama de sankey",
	"Chord diagram": "Diagrama de cuerdas",
	"Flow diagram": "Diagrama de flujo",
	"TreeMap chart": "Gráfico de mapa de árbol",

	// Series types
	"Series": "Series",
	"Candlestick Series": "Series de velas",
	"Column Series": "Series de columnas",
	"Line Series": "Series de líneas",
	"Pie Slice Series": "Series de trozos circular",
	"X/Y Series": "Series de X/Y",

	// Map-related
	"Map": "Mapa",
	"Press ENTER to zoom in": "Presione ENTER para aumentar el zoom",
	"Press ENTER to zoom out": "Presione ENTER para disminuir el zoom",
	"Use arrow keys to zoom in and out": "Use los cursores para disminuir o aumentar el zoom",
	"Use plus and minus keys on your keyboard to zoom in and out": "Use las teclas mas o menos en su teclado para disminuir ou aumentar el zoom",

	// Export-related
	"Export": "Exportar",
	"Image": "Imagen",
	"Data": "Datos",
	"Print": "Imprimir",
	"Press ENTER to open": "Haga clic, toque o presione ENTER para abrir",
	"Press ENTER to print.": "Haga clic, toque o presione ENTER para imprimir",
	"Press ENTER to export as %1.": "Haga clic, toque o presione ENTER para exportar como %1.",
	"(Press ESC to close this message)": "(Presione ESC para cerrar este mensaje)",
	"Image Export Complete": "Exportación de imagen completada",
	"Export operation took longer than expected. Something might have gone wrong.": "La operación de exportación llevó más tiempo de lo esperado. Algo pudo haber salido mal.",
	"Saved from": "Guardado de",
	"PNG": "",
	"JPG": "",
	"GIF": "",
	"SVG": "",
	"PDF": "",
	"JSON": "",
	"CSV": "",
	"XLSX": "",
	"HTML": "",

	// Scrollbar-related
	"Use TAB to select grip buttons or left and right arrows to change selection": "Use TAB para seleccionar los botones de agarre o las flechas izquierda y derecha para cambiar la selección",
	"Use left and right arrows to move selection": "Use las flechas izquierda y derecha para mover la selección",
	"Use left and right arrows to move left selection": "Use las flechas izquierda y derecha para mover la selección izquierda",
	"Use left and right arrows to move right selection": "Use las flechas izquierda y derecha para mover la selección derecha",
	"Use TAB select grip buttons or up and down arrows to change selection": "Utilice los botones de control de selección TAB o flechas arriba y abajo para cambiar la selección",
	"Use up and down arrows to move selection": "Use las flechas hacia arriba y hacia abajo para mover la selección",
	"Use up and down arrows to move lower selection": "Use las flechas hacia arriba y hacia abajo para mover la selección inferior",
	"Use up and down arrows to move upper selection": "Use las flechas hacia arriba y hacia abajo para mover la selección superior",
	"From %1 to %2": "Desde %1 hasta %2",
	"From %1": "Desde %1",
	"To %1": "Hasta %1",

	// Data loader-related
	"No parser available for file: %1": "No hay analizador disponible para el archivo: %1",
	"Error parsing file: %1": "Error al analizar el archivo: %1",
	"Unable to load file: %1": "No se puede cargar el archivo: %1",
	"Invalid date": "Fecha inválida"
};
