
class User {
    constructor(name, age, email) {
      this.name = name;
      this.age = age;
      this.email = email;
    }}
    
class Check{
    
    constructor(password,email){
        this.password = password;
        this.email = email;
       
    }
    
    pChecker(){
        
        var pass = this.password;
        var result = this.password.replace(/\d+/g, "");
        var result2 = result.replace(/[A-Z]+/g,"");
        var result3 = result2.replace(/[a-z]+/g,"");
       
        if(pass.length<8 || pass.length>16)
        {
            return "Incorrect Password Length";   
        }
        else{
           if(result==this.password)
            {
                console.log(pass);
                console.log(result);
                return "Password Missing Number";
            } 
            else{
           
                if((/[A-Z]/).test(pass)==false)
            {

                console.log(pass);
                console.log(result);
                return "Password Missing Uppercase Letter";
                
            }
        
            if((/[a-z]/).test(pass)==false)
            {
                
                return "Password Missing Lowercase Letter";
            }
            else{
                
            if(result3==0)
            {
                
                return "Password Missing Special Character";
                
            }
            
            else {
                
                return "Password Accepted";
            }
            
        
            }        
        }
            }      
        }

        eChecker(){
    
            var em =this.email;
            var  con1= /(@gmail.com|@yahoo.com|@untdallas.edu)/g
           
         
            
             if(con1.test(em))
                    {
                        return console.log("Email Accepted")
                    }
                    else {
                       
                        return console.log("Invalid Email");
                    }
                }

      
}  
//var button = document.getElementById("checker")
//button.addEventListener("onclick", fun1())


function fun1(){
    
    const p = document.getElementById('password');
    const e = document.getElementById('email');
    const t = document.getElementById('target');
    const t2 = document.getElementById('target2');

    const ch = new Check(p.value,e.value);
    console.log(ch);
    t.innerHTML = ch.pChecker(); 
    t2.innerHTML = ch.eChecker(); 
}