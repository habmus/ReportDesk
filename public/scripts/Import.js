const fs=require('fs');
const { parse } = require("csv-parse");
const mysql = require('mysql');
const { connect } = require('http2');
const { error } = require('console');
const { resolve4 } = require('dns');

var data = [];

function report(l,t,c,n,d) {
  this.location = l;
  this.duration = t;
  this.course = c;
  this.notes =n;
  this.date=d;
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

function getData(file){
  var i=0;
  let r=0;
  fs.createReadStream(file)
  .pipe(parse({ delimiter: ",", from_line: 2}))
  .on("data", function (row) {
    r=row;
    var d=r[4];
    d= d.split("/").reverse();
    d= d[0] + "-"+d[2] +"-"+d[1];
    let t= new report(r[0],r[1],r[2],r[3], d);
    data[i]=t;
    i=i+1;
  })
  .on("error", function (error) {
    console.log(error);
  })
  .on("end", function () {
    test(data);
  });
}


async function test(array){
  data=array;
  if(array[0]==null){
    return console.log("The file is empty")
  }else
  {
    for( i=0; i< array.length;i=i+1){
      try{
        const lid= new Promise (async function(resolve ){
          await connection.query("SELECT locationID FROM locations WHERE location=  ? " , [data[i].location], function (err, result, fields) {
           if (err) console.log(err);
          else resolve(result[0].locationID);
          }); 
        });
       
        const cid= new Promise(async function (resolve){ 
          await connection.query("SELECT courseID FROM courses WHERE courseCode= ? " ,[data[i].course],function(err,result,fields){
          if(err) console.log(err);
          else resolve(result[0].courseID);
        })
      });

      const did= new Promise(async function (resolve){ await connection.query("SELECT durationID FROM durations WHERE duration= ?" ,[data[i].duration],function(err,result,fields){
        if(err)  console.log(err);
        else resolve(result[0].durationID);
      })
    });
    
    
  const sql = `INSERT into Questions(questionID,categoryID,locationID,durationID,courseID,notes,dateOfQuestion,userID) Values (null,null,?,?,?,?,?,null)`;


  var r1, r2, r3;
  var x=0;
 await lid
          .then(async function (result) {
            r1=result;
          })
          .then( async function (){
            r2 = await cid;
          })
          .then(async function() {
            r3 =await did;
          })
          .then(async function(){
          connection.query(sql,[r1,r3,r2,data[x].notes,data[x].date]);
           x=x+1;
          })
          .catch(err);{
            console.log(err);
          }
      
      } catch{
        console.log(error);
      }
    } 
  }
}

  getData('Template.csv');
