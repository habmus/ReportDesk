function durationChart()
{
var xValues = ["Less Then 5min", "More Than 5min", "More Than 30min"];
var yValues = [23, 100, 88];
var barColors = ["black","blue","#DAA520"];

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: 
  {
    title: {display: false,},
    plugins:{labels: {fontSize: 25,  fontColor: 'white',}}
  }
});

var table ="<table><tr><th>Duration Range</th><th>Total Questions<th></tr>"+
    "<tr>"+ "<td>" +xValues[0] + "</td><td>" + yValues[0] + "</td></tr>" +
    "<tr>"+ "<td>" +xValues[1] + "</td><td>" + yValues[1] + "</td></tr>" +
    "<tr>"+ "<td>" +xValues[2] + "</td><td>" + yValues[2] + "</td></tr>"
    + "</table>";
    document.querySelector('[title="Table"]').innerHTML = table;
}