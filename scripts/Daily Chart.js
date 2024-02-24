function dailyChart(count, question)
{
let yCount;
let yQuestion;
let chartMax;
yCount = count;
yQuestion = question;
if (yCount >= yQuestion)
{
  chartMax = yCount;
}
else
{
  chartMax = yQuestion;
}

const xValues = ["Total Count", "Total Questions"];
const yValues = [yCount, yQuestion];
const barColors = ["Blue", "Grey"];

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
                    scales: {yAxes: [{ticks: {min: 0, max: chartMax}}]},
                    title: {display: true, text: "Daily Report"}  
                  }
           });           

var table ="<table><tr><th>Total Count</th><th>Total Questions<th></tr><tr><td>" + yCount + "</td><td>" + yQuestion + "</td></table>";
document.querySelector('[title="Table"]').innerHTML = table;
}