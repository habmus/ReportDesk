function dailyChart(count, question)
{
let yCount = count;
let yQuestion = question;

const xValues = ["Total Count", "Total Questions"];
const yValues = [yCount, yQuestion];
const barColors = ["Blue", "Black"];

  new Chart("myChart", 
          {
                type: "bar",
                data: 
                  {
                    labels: xValues,
                    datasets: [{backgroundColor: barColors, data: yValues}]
                  },
                  options: 
                  {
                    legend: {display: false},
                    title: {display: true, text: "Daily Report"}, 
                    scales: {yAxes: [{ticks:{beginAtZero: true}}]},
                    plugins: {labels: false}
                  }
           });           

var table ="<table><tr><th>Total Count</th><th>Total Questions<th></tr><tr><td>" + yCount + "</td><td>" + yQuestion + "</td></table>";
document.querySelector('[title="Table"]').innerHTML = table;
}