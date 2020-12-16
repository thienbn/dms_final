  
const url_ = 'mongodb+srv://valeriavelasquez:tomato@cluster0.bmsdw.mongodb.net/forApp?retryWrites=true&w=majority';
const express = require('express');
const bodyParser = require('body-parser');
const mailer = require('nodemailer');
var mongoose = require('mongoose');
const path = require('path');


const app = express();

mongoose.connect(url_);
var db = mongoose.connection;
app.use(bodyParser.json()); 
app.use('/static',express.static('public'));


app.use(bodyParser.urlencoded({ 
    extended: true
})); 


app.get('/',function(req,res){ 
    res.sendFile(path.join(__dirname + "/index.html"));
    app.post('/matchMeLater', function(req,res){ 
        var fname = req.body.fname; 
        var lname =req.body.lname; 
        var email = req.body.email; 
        var age =req.body.age;
        var q1 = req.body.q1;
        var q2 = req.body.q2;
        var q3 = req.body.q3;
        var q4 = req.body.q4;
        var q5 = req.body.q5;
        var q6 = req.body.q6;
        var q7 = req.body.q7;
        var q8 = req.body.q8;
        var q9 = req.body.q9;
        var q10 = req.body.q10;
        var q11= req.body. q11;
        var q12 = req.body.q12 ;
        console.log(q1);
        var data = { 
            "fname": fname, 
            "lname":lname, 
            "email": email, 
            "age": age,
            "q1": q1,
            "q2": q2,
            "q3": q3,
            "q4": q4, 
            "q5": q5,
            "q6": q6, 
            "q7": q7,
            "q8": q8, 
            "q9": q9,
            "q10": q10,
            "q11": q11,
            "q12": q12   
            
        } 
    db.collection('toMatch').insertOne(data,function(err, collection){ 
            if (err) throw err; 
            console.log("Record inserted Successfully"); 
                  
        }); 
         res.sendFile(__dirname + "/public/later_page.html");
    })   
app.post('/signUp',function(req,res){
    
    var q1 = parseInt(req.body.q1);
    var q2 = parseInt(req.body.q2);
    var q3 = parseInt(req.body.q3);
    var q4 = parseInt(req.body.q4);
    var q5 = parseInt(req.body.q5);
    var q6 = parseInt(req.body.q6);
    var q7 = parseInt(req.body.q7);
    var q8 = parseInt(req.body.q8);
    var q9 = parseInt(req.body.q9);
    var q10 = parseInt(req.body.q10);
    var q11= parseInt(req.body.q11);
    var q12 = parseInt(req.body.q12);
    var email = req.body.email;
    var fname = req.body.fname; 
    var lname =req.body.lname; 
    var age = req.body.age;
    var curr = [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12];
    var possible_q = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12'];
    var cursor =  db.collection('toMatch').find().toArray(function(err,A)
    {
        /* Matching START */
        var best_match_score = Number.MAX_SAFE_INTEGER;
        var best_id;
        var best_name;
        var best_email;
        if (A.length == 0)
        {
            console.log("no one is currently in the database :(, Try to Match later!");
                var data = { 
        "fname": fname, 
        "lname":lname, 
        "email": email, 
        "age": age,
        "q1": q1,
        "q2": q2,
        "q3": q3,
        "q4": q4, 
        "q5": q5,
        "q6": q6, 
        "q7": q7,
        "q8": q8, 
        "q9": q9,
        "q10": q10,
        "q11": q11,
        "q12": q12   
   
        
    } 
db.collection('toMatch').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
       
    } 
 
         )
            res.sendFile(__dirname + "/public/no_matches.html");

            //Send them to some page that says no matches currently, we have added you to the database
            
        }
        else
        {
            for (var i = 0 ; i < A.length ; i++)
            {
                var curr_score = 0;
                for (var j = 0 ; j < possible_q.length ; j++)
                {
                    curr_score += (curr[j] - A[i][possible_q[j]]) * (curr[j] - A[i][possible_q[j]]);
                }
            

                if (curr_score <= best_match_score)
                {
                    best_match_score = curr_score;
                    best_id = A[i]['_id'];
                    best_name = A[i]['fname'] + ' ' + A[i]['lname'];
                    best_email = A[i]['email'];
                }
            }
            console.log("your best match has the name of: " + best_name);
        
        /* MATCHING END*/
        
        
        /* DELETE MATCHED PERSON FROM DATABASE */
            db.collection("toMatch").remove({_id: best_id});

        /* EMAIL PEOPLE THAT GOT MATCHED */
            var recipients_string = best_email + ', ' + email;
            var _text = best_name + " and " + fname + " " + lname + " are a match! You guys can reach eachother at: " + best_email + " and " + email + "!";
            var transporter = mailer.createTransport({service:'gmail',auth:{user:'friendmatchapp20@gmail.com',pass:'comp20rocks'}});
            var mailOptions = {from:'friendmatchapp20@gmail.com',to:recipients_string,subject:'Friend Match Results!',text:_text}

            transporter.sendMail(mailOptions,function(err,info){
                if (err)
                {
                    console.log(err);
                }
                else{
                    console.log('Email sent: ' + info.response);
                }
            })
            
             res.sendFile(__dirname + "/public/now_page.html");


        }
    });
})

}).listen(process.env.PORT  || 3000); 
console.log('Running');
