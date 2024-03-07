let params = new URL(document.location).searchParams; 
  let date = params.get("date"); 

  let data = {dateValue: date};

  fetch("/api/monthlyNumbers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },


  body: JSON.stringify({data}),
})
.then(response => response.json())
.then(dailyNumbers => dailyChart(dailyNumbers.count, dailyNumbers.question));



function monthlyChart(months, questions)
{
    const xValues = months
    const yValues = questions
    
    new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor:"rgba(0,0,255,1.0)",
          borderColor: "Black",
          data: yValues
        }]
      },
      options:
      { 
        legend: {display: false},
        elements: {point: {radius: 6}}
      }
    });

    var table ="<table><tr><th>Month</th><th>Total Questions<th></tr>"+
    "<tr>"+ "<td>" +months[0] + "</td><td>" + questions[0] + "</td></tr>" +
    "<tr>"+ "<td>" +months[1] + "</td><td>" + questions[1] + "</td></tr>" +
    "<tr>"+ "<td>" +months[2] + "</td><td>" + questions[2] + "</td></tr>" +
    "<tr>"+ "<td>" +months[3] + "</td><td>" + questions[3] + "</td></tr>" +
    "<tr>"+ "<td>" +months[4] + "</td><td>" + questions[4] + "</td></tr>" +
    "<tr>"+ "<td>" +months[5] + "</td><td>" + questions[5] + "</td></tr>"
    + "</table>";
    document.querySelector('[title="Table"]').innerHTML = table; 
}