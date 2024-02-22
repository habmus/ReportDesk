const xValues = ["Total Count", "Total Questions"];
const yValues = [55, 100];
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
                    scales: {yAxes: [{ticks: {min: 0, max: 100}}]},
                    title: {display: true, text: "Daily Report"}  
                  }
           });