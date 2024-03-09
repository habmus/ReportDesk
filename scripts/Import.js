const fs=require('fs');
const { parse } = require("csv-parse");
const mysql = require('mysql');
const { connect } = require('http2');
const { error, log } = require('console');


const data = [];

function report(loc, dur, co, not,da) {
  this.location = loc;
  this.duration = dur;
  this.course = co;
  this.notes = not;
  this.date=da;
}

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect((error) => {
  if (error)  console.error(error);
  else return console.log("Connnected to the Database")});

 function getID(array,i){
  var t=null;
  var tf=false;

  return new Promise((resolve, reject) => {
    connection.query("SELECT locationID FROM locations WHERE location= '" + array[i].location+"'", function (err, result, fields) {
      if (err) throw err;
      t=result[0].locationID;
      tf=true;
      
  })
      if(tf=true){
        console.log(t+"here");
        resolve(t);
      }
      else{
        reject("Didnt get anything");
      }
    }
  )}

function getData(file){
  var i=0;
  let r=0;
  fs.createReadStream(file)
  .pipe(parse({ delimiter: ",", from_line: 2}))
  .on("data", function (row) {
      r=row;
      let t= new report(r[0],r[1],r[2],r[3],r[4]);
    data[i]=t;
    i=i+1;
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    test(data);
  });
}

  async function test(array){
    var t=0;
  if(array[0]==null){
   return console.log("The file is empty")
  }else
  {
     for( i=0; i< array.length;i=i+1){
      t = await getID(array,i);
      array[i].location=t;
      console.log(t);
     }

     for( i=0; i< array.length;i=i+1){
      console.log(array[i].location);
    let sql = `INSERT into Questions(questionID,categoryID,locationID,duration,courseID,notes,dateOfQuestion,userID)
    VALUES(null,null,`+ array[i].location +`,` + array[i].duration +`,` +array[i].course + `,` + array[i].notes + `,`+array[i].date +`,null)`;
    
    } 
    
  
  }
}

  getData('Template.csv');
