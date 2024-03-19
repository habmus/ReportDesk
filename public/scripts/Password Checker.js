

class Check{
    
    constructor(password){
        this.password = password;
       
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


      
}  
//var button = document.getElementById("checker")
//button.addEventListener("onclick", fun1())


function fun1(){
    
    const p = document.getElementById('password');
    const t = document.getElementById('target');

    const ch = new Check(p.value);
    console.log(ch);
    t.innerHTML = ch.pChecker(); 
}