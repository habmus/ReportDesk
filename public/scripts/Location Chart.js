function locationChart()
{
    
    var xValues = ["In-Person", "Phone", "Online"];
    var yValues = [300, 100, 103];
    var barColors = ["black","blue","#DAA520"];
    
    new Chart("myChart", {
      type: "doughnut",
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
    
    var table ="<table><tr><th>Location</th><th>Total Questions<th></tr>"+
        "<tr>"+ "<td>" +xValues[0] + "</td><td>" + yValues[0] + "</td></tr>" +
        "<tr>"+ "<td>" +xValues[1] + "</td><td>" + yValues[1] + "</td></tr>" +
        "<tr>"+ "<td>" +xValues[2] + "</td><td>" + yValues[2] + "</td></tr>"
        + "</table>";
        document.querySelector('[title="Table"]').innerHTML = table;
}