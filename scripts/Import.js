const fs=require('fs');
const { parse } = require("csv-parse");

const report = [];

var data= 'Template.csv';

fs.createReadStream("Template.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    report.push(row);

  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function(){
    console.log(report);
  });
