function coursesChart(courses, questions)
{
    let xValues = courses;
    let yValues = questions;
    

    const barColors = ["blue", "black","#DAA520","#228B22","#8B0000" ];

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
                    title: {display: true, text: "Questions by Courses"},
                    legend: {display: false},
                    plugins:{labels: false}
                  }
           });   
           
           var table ="<table><tr><th>Courses</th><th>Total Questions<th></tr>"+
           "<tr>"+ "<td>" +xValues[0] + "</td><td>" + yValues[0] + "</td></tr>" +
           "<tr>"+ "<td>" +xValues[1] + "</td><td>" + yValues[1] + "</td></tr>" +
           "<tr>"+ "<td>" +xValues[2] + "</td><td>" + yValues[2] + "</td></tr>" +
           "<tr>"+ "<td>" +xValues[3] + "</td><td>" + yValues[3] + "</td></tr>" +
           "<tr>"+ "<td>" +xValues[4] + "</td><td>" + yValues[4] + "</td></tr>"
           + "</table>";
           document.querySelector('[title="Table"]').innerHTML = table;         
           
}