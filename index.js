const express= require('express');
const mysql = require('mysql')
const session = require('express-session');
const chalk = require('chalk');
const jsdom = require('jsdom');

const api= express();

const connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'JVP111230',
    database:'peunosthdy'
});

api.use(express.static('public'));
api.use(express.urlencoded({extended : false}));
api.use(session({
    secret:'my_secret_key',
    resave:'false',
    saveUninitialized:'false'
}));

api.use((req,res,next)=>{
    if(req.session.Username!==undefined || req.session.Userpass!==undefined)
    {
        const user_ide =req.session.Username;
        console.log("Login Authentication Succesful");
        console.log(`User Id ${user_ide}`);
       // console.log(chalk.red("hello"));
    }
    else{
        console.log("Login Authentication Failed")
    };
    next();
});

api.get('/logout',(req,res)=>{
    req.session.destroy((error)=>{
        res.redirect('/');
    });
});

api.get('/',(req,res)=>{
    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\RootPage.ejs");
});

let correction=0;

api.get('/login',(req,res)=>{
    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Login-Page.ejs",{not:[]});
});

const nothing=[];


api.post('/login',(req,res)=>{
    if(req.body.Username==='' || req.body.Userpass===''){
        nothing.push("Username or password is not entered");
        res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Login-Page.ejs",{not:nothing});
    }
    else{
    connection.query('select * from users where name=? and password=?',[req.body.Username,req.body.Userpass],
        (error,result)=>{
        if(result.length>0){
            req.session.Username= req.body.Username;
            req.session.Userpass=req.body.Userpass;
            const users=req.session.Username;
            console.log(result)
            console.log("login Succesful!!");
            res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Selection-page.ejs",{users:users});
        }
        else
        {
            console.log(result);
            correction++;
            console.log("login Unsuccesful!!");
            if(correction===1){
                nothing.push("Username or Password is not correct");
                res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Login-Page.ejs",{not:nothing});
            }
            else{
                res.redirect('/login');
            }
        }
    }
        );

}});

api.get('/selectionpage',(req,res)=>{
    const users=req.session.Username;
    console.log("hello");
    console.log(users);
    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Selection-page.ejs",{users: users});
});

api.get('/checking',(req,res)=>{
    const users=req.session.Username;
    console.log("hello");
    console.log(users);
    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Selection-page.ejs",{users: users});
});

api.post('/selectpage',(req,res)=>{
    const users=req.session.Username;
    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Selection-page.ejs",{users:users});
});

err=[];

api.post('/selectionpage',(req,res)=>{
    const result=[];
    //console.log(req.session.Username);
  /* const id1= document.getElementById("select");
    const id2= document.getElementById("select");*/
    const users = req.session.Username;
    console.log(`word: ${req.body.under}`);
    if(req.body.under==="Insertion"){
        return res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Insertion-page.ejs",{users:users});
    }
    if(req.body.under==="Revision" && req.body.userpassword===req.session.Userpass){
       return res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Revision-page.ejs",{user:users,result:result});
    }
    if(req.body.under==='' || req.body.userpassword!==req.session.Userpass){
        err.push("Password is incorrect");

        return res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Selection-page.ejs",{err : err, users : users});
    }


});

api.get('/insertionpage',(req,res)=>{
    const  users= req.session.Username;
    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Insertion-page.ejs",{users:users});
})

api.post('/insertionpage',(req,res)=>{
    const users=req.session.Username;
    connection.query('insert into study values(?,?,?,?,?,?,?)',
        [,users,req.body.usersubj,req.body.usertopic,req.body.userfor,req.body.userwork,req.body.userdef],
        (error,results)=>{
        console.log(error);
        console.log(results);
        console.log("Insertion Done!!");
        res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Selection-page.ejs",{users:users});
        });

});

api.get('/revisionpage',(req,res)=>{
    users=req.session.Username;
    const result=[];
    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Revision-page.ejs",{user: users, result:result});
});

api.post('/revisionpage',(req,res)=>{
    console.log(req.body.usersub);
    const users=req.session.Username;
    console.log(users);
    connection.query('select * from study where Name=? and Subject=? or Topic=?',
        [users,req.body.usersub,req.body.usertop],
        (error,result)=>{
        console.log(result);
            res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Revision-page.ejs",{user:users,result:result});
        });
});

api.get('/signup',(req,res)=>{

    res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Signup.ejs",{mist:[]});
});

api.post('/signup',(req,res)=>{
    number=req.body.UserPhoneNo;
    connection.query('insert into users values(?,?,?,?,?,?,?,?,?)',
        [,req.body.UserName,req.body.UserEmail,req.body.UserPass,req.body.UserPhoneNo,req.body.UserClass,req.body.UserDob,req.body.UserAge,
        req.body.UserGender],
        (error,result)=>{
        console.log(error);
        const errors=[];
            if(req.body.UserName==='' || req.body.UserEmail==='' || req.body.UserPhoneNo || req.body.UserPass || req.body.UserClass ||req.body.UserDob ||req.body.UserAge || req.body.UserGender)
            {
                errors.push("Enter all the required details !!");
            }
            if(errors.length>0)
            {
                res.render("C:\\Web Development Training\\PseunostHdy\\Views\\Signup.ejs",{mist:errors});
            }
            else {
                //console.log(error);
                console.log('Signup Succesfull!!');
                res.redirect('/login');
            }
        }
    );
});

api.listen(3004);