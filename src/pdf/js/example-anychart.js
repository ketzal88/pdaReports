anychart.onDocumentReady(function () {
  // create polar chart
  var chart = anychart.polar();

  var data = anychart.data.mapAsTable([
    ['Nail polish', 12814, 3054, 4376, 4229],
    ['Eyebrow pencil', 13012, 5067, 3987, 3932],
    ['Rouge', 11624, 7004, 3574, 5221],
    ['Lipstick', 8814, 9054, 4376, 9256],
    ['Eyeshadows', 12998, 12043, 4572, 3308],
    ['Eyeliner', 12321, 15067, 3417, 5432],
    ['Foundation', 10342, 10119, 5231, 13701],
    ['Lip gloss', 22998, 12043, 4572, 4008],
    ['Mascara', 11261, 10419, 6134, 18712],
    ['Powder', 10261, 14419, 5134, 25712],
  ]);

  // sort data by X
  chart
    .sortPointsByX(true)
    // set series type
    .defaultSeriesType('polygon')
    // disable y-axis
    .yAxis(false)
    // set x-scale
    .xScale('ordinal');

  // add series to chart
  chart.addSeries.apply(chart, data);

  // set title settings
  chart
    .title()
    .enabled(true)
    .text('Company Profit Dynamic in Regions by Year')
    .padding({ bottom: 25 });

  // set stack mode
  chart.yScale().stackMode('value');

  // set chart container id
  chart.container('container');
  // initiate chart drawing
  chart.draw();
});
