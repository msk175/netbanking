var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    mysql = require('mysql'),
    PDFDocument = require('pdfkit');
    var router = express.Router();
// Create a connection to MySql Server and Database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'netbanking',
    user: 'root',
    password: 'root'
});
var app = express();


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());/*{secret:'your secret here', cookie:{maxAge:180000,expires: new Date(Date.now() + 180000)}})*/
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
           });
    app.use(app.router);

});

var request=require("request");
request.get("http://codeforgeek.com",function(error,response,body){
           if(error){
                 console.log(error);
           }else{
                 console.log("response");
         }
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.render('index', {
        title: '::-Home-::'
    });
});

app.get('/netbanking', function (req, res) {
    res.render('netbanking', {
        title: '::-NetBanking-::'
    });
});

app.get('/contact', function (req, res) {
    res.render('contact', {
        title: '::-Contact-::'
    });
});

app.get('/retail', function (req, res) {
    res.render('retail',{
        title: '::-Retail Login-::', msg: ''
    });
});

app.get('/corporate', function (req, res) {
    var self = this;
    var rest = require("./rest.js");
    var http = require('http');
    var https = require('https');
    var postheaders = {
        'Content-Type' : 'application/json'
    };
    var options = {
        port: 3000,
        path: "www.linkedin.com",
        method: 'GET',
        headers : postheaders
    };
    rest.getJSON(options,function(statuscode,result,headers) {
        if (statuscode == 302) {
            res.render('corporate', {
                title: '::-CorporateLogin-::'
            });
        } else if (result.status == "success") {
            res.render('corporate', {
                title: '::-CorporateLogin-::'
            });
        }
    });
});

app.get('/createuser', function (req, res) {
    res.render('createuser', {
        title: '::-UpdateRegister-::', results: 0, msg: ''
    });
});
app.get('/NewCreateUser', function (req, res) {
    if( req.session.role=='Admin'){
        connection.query('SELECT MAX(acc_number) as acc_number,MAX(customer_id) as customer_id,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user', function (err, results) {
            if (err) {
                res.send(err.message);
                req.session.destroy();
                res.redirect('/retail');
            }
            else if (results.length > 0 && results[0] !== null) {
                res.render('NewCreateUser', {
                    title: '::-NewCreateUser-::',
                    results: results,msg: ''
                });
            }
            else {
                res.render('NewCreateUser', {
                    title: '::-NewCreateUser-::', msg: 'No Results Found!'
                });
            }
        });
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }

});

app.get('/login', function (req, res) {
    res.render('login', {
        title: '::-NetBankingHome-::'
    });
});
app.get('/adminMenu', function (req, res) {
    if( req.session.role=='Admin'){
        res.render('AdminMenu', {
            title: '::-AdminMenu-::'
        });
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }

});
app.get('/addtransaction', function (req, res) {
    if( req.session.role=='Admin'){
        res.render('addtransaction', {
            title: '::-Admin Add Transaction-::',userDetails:'',msg:''
        });
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});
app.get('/fetchAccDetails/:acc/:msg', function (req, res) {
    if( req.session.role=='Admin'){
        var acc = req.param('acc');
        var msg= req.param('msg');
         connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where acc_number=?',
        [acc], function (err, results) {
            if (err) {
                 console.log(err);
                 res.render('addtransaction', {
                    title: '::-Admin Add Transaction-::',userDetails:'',msg:err
                });
            }else if(results.length>0){
                console.log(results);
                res.render('addtransaction', {
                    title: '::-Admin Add Transaction-::',userDetails:results,msg:msg
                });
            }else{
                res.render('addtransaction', {
                    title: '::-Admin Add Transaction-::',userDetails:results,msg:'No Results Found!'
                });
            }
        });
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});
app.get('/transactionverify', function (req, res) {
    if( req.session.role=='Admin'){
        connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%M-%Y") as tr_date,concat("/fetchDetails/",transaction_id) as url FROM netbanking.nefttransfer WHERE is_verified=0',
            function (err, result){
                res.render('transactionverify', {
                title: '::-Admin Transaction Verify-::',toVerify:result,msg:''
            });
        });
        
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});
app.get('/fetchDetails/:id',function (req, res){
   if( req.session.role=='Admin'){
        var id = req.param('id');
        connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%M-%Y") as tr_date,concat("/rejectTranx/",transaction_id) as reject_url,concat("/approveTranx/",transaction_id) as approve_url FROM netbanking.nefttransfer WHERE transaction_id=? and is_verified=0',[id],
            function (err, result){
                console.log(err);
                console.log(result);
                if(result.length>0){
                    connection.query('SELECT * FROM netbanking.user WHERE acc_number=?',[result[0].acc_number],
                    function (err, accresult){
                        res.render('transactionverifyfetch', {
                            title: '::-Admin Transaction Verify-::',results:result,accresult:accresult
                        });
                    });  
                }else{
                    res.redirect('/transactionverify');
                }
                 
        });
        
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});

app.get('/creditFromAdminAction/:amount/:acc/:narr',function (req, res){
    console.log("/creditFromAdminAction");
   if( req.session.role=='Admin'){
    var amount = req.param('amount');
    var acc = req.param('acc');
    var narration = req.param('narr');

        connection.query('SELECT running_balance FROM user WHERE acc_number=?',[acc],
            function (err ,balres){
                console.log(balres[0].running_balance,amount);
                var balance=parseInt(balres[0].running_balance)+parseInt(amount);
                console.log(balance);
                 connection.query('INSERT INTO netbanking.account_summary SET transaction_date=(SELECT CURDATE()),acc_number=?,source_acc_number=?,credit=?,debit=?,narration=?,running_balance=?',[acc,'2715118000001',amount,'-',narration,balance],
                    function (err, result){
                    console.log(err);
                    connection.query('UPDATE `netbanking`.`user` SET `running_balance` = ?,`last_updated_timestamp` = (SELECT NOW()) WHERE `acc_number` = ?',[balance,acc],function (err ,resofbal){
                         connection.query('SELECT running_balance FROM user WHERE acc_number=?',['2715118000001'],
                            function (err ,balres){
                            console.log(balres[0].running_balance,amount);
                                var balance1=parseInt(balres[0].running_balance)-parseInt(amount);
                                console.log(balance1);
                                connection.query('INSERT INTO account_summary SET transaction_date=(SELECT CURDATE()),acc_number=?,source_acc_number=?,credit=?,debit=?,narration=?,running_balance=?',['2715118000001',acc,'-',amount,narration,balance1],
                                    function (err, result){
                                        console.log(err);
                                        connection.query('UPDATE `netbanking`.`user` SET `running_balance` = ?,`last_updated_timestamp` = (SELECT NOW()) WHERE `acc_number` = ?',[balance1,'2715118000001'],function (err ,resofbal){
                                            var msg="Transaction Added successfully!";
                                            res.redirect('/fetchAccDetails/'+acc+'/'+msg);
                                     });
                            });
                        });    
                    });
                                
                }); 
            });
        
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});

app.get('/debitFromAdminAction/:amount/:acc/:narr',function (req, res){
    console.log("/debitFromAdminAction");
   if( req.session.role=='Admin'){
    var amount = req.param('amount');
    var acc = req.param('acc');
    var narration = req.param('narr');

        connection.query('SELECT running_balance FROM user WHERE acc_number=?',[acc],
            function (err ,balres){
                console.log(balres[0].running_balance,amount);
                var balance=parseInt(balres[0].running_balance)-parseInt(amount);
                console.log(balance);
                 connection.query('INSERT INTO netbanking.account_summary SET transaction_date=(SELECT CURDATE()),acc_number=?,source_acc_number=?,credit=?,debit=?,narration=?,running_balance=?',[acc,'2715118000001','-',amount,narration,balance],
                    function (err, result){
                    console.log(err);
                    connection.query('UPDATE `netbanking`.`user` SET `running_balance` = ?,`last_updated_timestamp` = (SELECT NOW()) WHERE `acc_number` = ?',[balance,acc],function (err ,resofbal){
                         connection.query('SELECT running_balance FROM user WHERE acc_number=?',['2715118000001'],
                            function (err ,balres){
                            console.log(balres[0].running_balance,amount);
                                var balance1=parseInt(balres[0].running_balance)+parseInt(amount);
                                console.log(balance1);
                                connection.query('INSERT INTO account_summary SET transaction_date=(SELECT CURDATE()),acc_number=?,source_acc_number=?,credit=?,debit=?,narration=?,running_balance=?',['2715118000001',acc,amount,'-',narration,balance1],
                                    function (err, result){
                                        console.log(err);
                                        connection.query('UPDATE `netbanking`.`user` SET `running_balance` = ?,`last_updated_timestamp` = (SELECT NOW()) WHERE `acc_number` = ?',[balance1,'2715118000001'],function (err ,resofbal){
                                            var msg="Transaction Added successfully!";
                                            res.redirect('/fetchAccDetails/'+acc+'/'+msg);
                                     });
                            });
                        });    
                    });
                                
                }); 
            });
        
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});

app.get('/rejectTranx/:id',function (req, res){
   if( req.session.role=='Admin'){
        var id = req.param('id');
        connection.query('SELECT * FROM netbanking.nefttransfer WHERE transaction_id=?',[id],
            function (err, result){
                connection.query('SELECT running_balance FROM user WHERE acc_number=?',[result[0].source_acc_number],
                    function (err ,balres){
                        var balance=parseInt(balres[0].running_balance)+parseInt(result[0].transfer_amount);
                        connection.query('call sp_neft_transfer_reject(?,?,?,?,?)',[result[0].source_acc_number,result[0].acc_number,result[0].transfer_amount,balance,id],
                        function (err, accresult){
                            connection.query('UPDATE `netbanking`.`user` SET `running_balance` = ?,`last_updated_timestamp` = (SELECT NOW()) WHERE `acc_number` = ?',[balance,result[0].source_acc_number],function (err ,resofbal){
                                connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%M-%Y") as tr_date,concat("/fetchDetails/",transaction_id) as url FROM netbanking.nefttransfer WHERE is_verified=0',
                                    function (err, result){
                                        res.render('transactionverify', {
                                        title: '::-Admin Transaction Verify-::',toVerify:result,msg:'Authorized Successfully !'
                                    });
                                });
                            });
                        });  
                    });
        });
        
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});

app.get('/approveTranx/:id',function (req, res){
      if( req.session.role=='Admin'){
        var id = req.param('id');
        connection.query('SELECT * FROM netbanking.nefttransfer WHERE transaction_id=?',[id],
            function (err, result){
                connection.query('SELECT running_balance FROM user WHERE acc_number=?',[result[0].acc_number],
                    function (err ,balres){
                        var balance=parseInt(balres[0].running_balance)+parseInt(result[0].transfer_amount);
                        connection.query('call sp_neft_transfer_approve(?,?,?,?,?)',[result[0].source_acc_number,result[0].acc_number,result[0].transfer_amount,balance,id],
                        function (err, accresult){
                            connection.query('UPDATE `netbanking`.`user` SET `running_balance` = ?,`last_updated_timestamp` = (SELECT NOW()) WHERE `acc_number` = ?',[balance,result[0].acc_number],function (err ,resofbal){
                                connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%M-%Y") as tr_date,concat("/fetchDetails/",transaction_id) as url FROM netbanking.nefttransfer WHERE is_verified=0',
                                    function (err, result){
                                        res.render('transactionverify', {
                                        title: '::-Admin Transaction Verify-::',toVerify:result,msg:'Authorized Successfully !'
                                    });
                                });
                            });
                        });  
                    });
        });
        
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
});
app.get('/reportsmanagement', function (req, res) {
    res.render('reportsmanagement', {
        title: '::-AdminReports-::'
    });
});

app.post('/authen', function (req, res) {
    connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where user_name=? AND password=? and active_indicator="1"',
        [req.body.user_name, req.body.password ], function (err, results) {
            req.session.userResultList = results;
            console.log(req.session.userResultList);
            if (err) {
                res.send(err.message);
                req.session.destroy();
                res.redirect('/retail');
            }
            else if (req.body.user_name == "admin" && req.body.password == "admin123") {
                req.session.role='Admin';
                connection.query('SELECT MAX(acc_number) as acc_number,MAX(customer_id) as customer_id,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user', function (err, results) {
                    if (err) {
                        res.send(err.message);
                        req.session.destroy();
                        res.redirect('/retail');
                    }
                    else if (results.length > 0 && results[0] !== null) {
                        res.render('AdminMenu', {
                            title: '::-AdminMenu-::'
                        });

                    }
                });
            }
            else if (results.length > 0 && results[0] !== null) {
                req.session.role='User';

                var randtoken = require('rand-token');
                var randomPassword = randtoken.generate(8);

                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport("SMTP",{
                    service: 'Gmail',
                    auth: {
                        user: 'mfi.android@ionixxtech.com',
                        pass: 'mfiteam@321'
                    }
                });

                var mailOptions = {
                    from: "TrustBank<no-reply@trustbank.com>",
                    to: req.session.userResultList[0].email ,
                    subject: 'Dynamic Login Code',//props.emailSubject,
                    html: "To proceed further take a dynamic login code : "+randomPassword//props.emailText+""+newPassword
                };

                connection.query('UPDATE user SET dynamic_code = ? where customer_id =?',[randomPassword,req.session.userResultList[0].customer_id],function(err){
                    if(err){
                        console.log(err);
                        res.render('accountsummary', {
                                    title: '::-AccountSummary-::',
                                    userDetails: req.session.userResultList,page:''
                                });
                    }else{
                        if(req.session.userResultList[0].isSecuredLogin=='Y'){
                            transporter.sendMail(mailOptions, function(error, response){
                                if(error){
                                    console.log(error);
                                    res.render('accountsummary', {
                                        title: '::-AccountSummary-::',
                                        userDetails: req.session.userResultList
                                    });
                                }else{
                                    res.render('dynamicOTP', {
                                        title: '::-Dynamic Login Code-::',
                                        userDetails: req.session.userResultList,
                                        msg:''
                                    });
                                }
                            });
                        }else{
                            res.render('accountsummary', {
                                        title: '::-AccountSummary-::',
                                        userDetails: req.session.userResultList
                                    });
                        }
                        
                    }
                });

                

                /*if(results.length >1){

                    res.render('cca', {
                        title: '::-Neft Transfer-::',msg:'Please Choose Acc Number to Continue',results:results,
                        userDetails: req.session.userResultList
                    });

                }
                else
                {*/
                    /*res.render('accountsummary', {
                        title: '::-AccountSummary-::',
                        userDetails: req.session.userResultList
                    });*/
               /*}*/
             }
            else {
                connection.query('select user_name from user where user_name=?',[req.body.user_name],function(err,results){
                    if (err)
                    {
                        res.send(err.message);
                        req.session.destroy();
                        res.redirect('/retail');
                    }
                    else if(results.length > 0 && results[0] !== null)
                    {
                        connection.query('call sp_login_check(?,?)',[req.body.user_name,new Date()],function(err,results){
                            res.render('retail', {
                                title: '::-UserID Blocked-::', msg: 'Invalid Password'
                            });
                        });

                    }
                    else
                    {
                        res.render('retail', {
                            title: '::-No Results Found-::', msg: 'Invalid UserId/Password!'
                        });
                    }
                });
            }
        });
});

app.post('/forgotinfo', function (req, res) {
    connection.query('SELECT * FROM user where acc_number=? and date_of_birth=? and phone=?',
        [req.body.acc_number, req.body.dob, req.body.phone ], function (err, results) {
            if (err) {
                res.send(err.message);
                req.session.destroy();
                res.redirect('/retail');
            }
            else if (results[0] == "") {
                res.render('forgot', {
                    title: '::-No Results Found-::', msg: 'Sorry No Results Found!'
                });
            }
            else if (results.length > 0 && results[0].value !== null) {
                res.render('recoversucess', {
                    title: '::-RecoverySucess-::',
                    results: results
                });

            }
            else {
                res.render('forgot', {
                    title: '::-No Results Found-::', msg: 'Sorry No Results Found!'
                });
            }
        });
});

app.post('/insert', function (req, res) {

    if( req.session.role=='Admin'){
         console.log("POST: ");

    var body = req.body;

    connection.query('CALL `sp_new_create_user`(?,?,?,?,?,?,?,?,?,?,?)',
        [body.acc_number, body.customer_id,body.opening_balance, body.user_name, body.password, body.first_name, body.last_name, body.email, body.dob, body.phone, body.address], function (err, results) {
            if (err) {
                console.log(err);
                res.render('NewCreateUser', {
                    title: '::-NewCreateUser-::',
                    results: results,msg: 'Error Try Again!'
                });
            }
            else {
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport("SMTP",{
                    service: 'Gmail',
                    auth: {
                        user: 'mfi.android@ionixxtech.com',
                        pass: 'mfiteam@321'
                    }
                });

                var mailOptions = {
                    from: "TrustBank<no-reply@trustbank.com>",
                    to: body.email ,
                    subject: 'Welcome to TrustBank',
                    html: "Greetings !!! Welcome Mr. "+body.first_name+" "+body.last_name+",<br/>\nThank you very much for being Trust Bank Internet Banking Customer.  We value the trust and confidence you have placed in us. It will be our privilege to make your Net Banking experience very user friendly.<br> \nChief Manager (IT), <br>Internet Banking Cell, <br> TrustBank. <br/> \n NB – Please DO NOT respond to E-Mail/Phone calls seeking details of your Internet Banking Passwords, ATM-CARD PIN/CVV. Bank never seeks such details."
                };

                transporter.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);

                    }else{
                        console.log("Send Email Success");
                    }
                });
                res.redirect('/NewCreateUser');
/*                connection.query('SELECT MAX(acc_number) as acc_number,MAX(customer_id) as customer_id,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user', function (err, results) {
                    if (err) {
                        res.send(err.message);
                        req.session.destroy();
                        res.redirect('/retail');
                    }
                    else if (results.length > 0 && results[0] !== null) {
                        res.render('NewCreateUser', {
                            title: '::-NewCreateUser-::',
                            results: results,msg: 'New User Created Successfully!'
                        });
                    }
                    else {
                        res.render('NewCreateUser', {
                            title: '::-NewCreateUser-::', msg: 'No Results Found!'
                        });
                    }
                });*/
            }
        });
    }else{
        res.render('retail',{
            title: '::-Retail Login-::', msg: 'You are not Authorized person to view this page.'
        });
    }
   
});
app.post('/neftTransfer',function (req,res){
    var body = req.body;
    var detail=new Array();
    detail['running_balance']=body.running_balance;
    detail['source_acc_number']=body.source_acc_number;
    detail['acc_number']=body.acc_number;
    detail['ifsc_code']=body.ifsc_code;
    detail['beneficiary_name']=body.beneficiary_name;
    detail['transfer_amount']=body.transfer_amount;
    detail['transaction_notes']=body.transaction_notes;
    detail['customer_id']=body.customer_id;
    req.session.neftupdate=detail;
    console.log(req.session.neftupdate);
    connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where acc_number=? AND password=?', [req.session.userResultList[0].acc_number,req.session.userResultList[0].password],
            function (err, result)
            {
                req.session.userResultList = result ;
                var balance = req.session.userResultList[0].running_balance - body.transfer_amount;
                detail['balance']=balance;
                req.session.neftupdate=detail;
                console.log(req.session.neftupdate);
                if (err)
                {
                    console.log(err);
                    req.session.destroy();
                    res.redirect('/logout');
                }
                else if(balance >=0){
                    res.render('neftTransactionPassword', {
                        title: '::-TransactionPassword-::',msg:'',userDetails: req.session.userResultList,neftupdate:req.session.neftupdate
                    });
                }
                else
                {
                    res.render('nefttransaction', {
                        title: '::-NEFT Transaction-::',msg:'Available Balance Rs. '+req.session.userResultList[0].running_balance+' INR only',userDetails: req.session.userResultList,beneDetails: req.session.beneResultList
                    });
                }
            });
});
app.post('/transfer', function (req, res) {
    console.log("POST:/transfer ");

    var body = req.body;
    var detail=new Array();
    detail['running_balance']=body.running_balance;
    detail['source_acc_number']=body.source_acc_number;
    detail['acc_number']=body.acc_number;
    detail['ifsc_code']=body.ifsc_code;
    detail['beneficiary_name']=body.beneficiary_name;
    detail['transfer_amount']=body.transfer_amount;
    detail['transaction_notes']=body.transaction_notes;
    detail['customer_id']=body.customer_id;
    req.session.neftupdate=detail;
    console.log(req.session.neftupdate);

    connection.query('SELECT * FROM user where transaction_password=? and acc_number=?',
        [req.body.trans_password,req.body.source_acc_number],
        function (err, results)
        {
            if (err)
            {
                console.log(err.message);
                req.session.destroy();
                res.redirect('/retail');
            }
            else if(results.length > 0 && results[0] !== null)
            {
                console.log(results);
                var balance = results[0].running_balance - body.transfer_amount;
                console.log(results.running_balance,body.transfer_amount,balance);
                connection.query('CALL `sp_neft_transfer_update`(?,?,?,?,?,?,?,?,?,?)',
                    [body.source_acc_number,body.acc_number, body.ifsc_code, body.beneficiary_name, body.transfer_amount, body.transaction_notes, results[0].customer_id,balance,results[0].id,results[0].user_name],
                    function (err, results)
                    {
                        if (!err)
                        {
                            connection.query('UPDATE user SET running_balance=?,last_updated_timestamp=(SELECT NOW()) WHERE acc_number=? AND customer_id=?', [balance,req.session.neftupdate.source_acc_number,req.session.neftupdate.customer_id],
                                function (err,updateRes){
                                    if (err){
                                        console.log(err);
                                    }
                                    res.redirect('/neftsuccess/'+body.acc_number);
                                });
                        }
                        else
                        {
                            console.log(err);
                            res.render('neftTransactionPassword',{title: '::Transaction Password::',msg:'sorry unable to carry out your instruction',userDetails: req.session.userResultList,neftupdate:req.session.neftupdate});
                        }
                });
            }
            else
            {
                res.render('neftTransactionPassword',{title: '::Transaction Password::',msg:'Invalid Transaction Password',userDetails: req.session.userResultList,neftupdate:req.session.neftupdate});
            }

    });
});

app.get('/neftsuccess/:acc',function (req, res){
    var acc = req.param('acc');
        connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where acc_number=? AND password=?', [req.session.userResultList[0].acc_number,req.session.userResultList[0].password],
        function (err, result)
        {
            if (err)
            {
                console.log(err);
                req.session.destroy();
                res.redirect('/logout');
            }
            else
            {
                    req.session.userResultList = result ;
                    if(req.session.neftupdate){
                        
                        console.log(result[0].acc_number+acc);
                        connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%M-%Y") as tr_date FROM nefttransfer WHERE source_acc_number=? AND acc_number=? and transaction_id=(SELECT MAX(transaction_id) from nefttransfer)',[result[0].acc_number,acc],function (err,results){
                        console.log(results);
                        console.log(err);
                        req.session.neftupdate='';
                        if(results){
                            res.render('nefttransactionconfirm', {
                                    title: '::-Transfer Success-::',
                                    results: results, userDetails: req.session.userResultList
                                });
                        }else{
                            res.render('nefttransaction', {
                                    title: '::-Transfer Failed-::',
                                    results: results, msg:'sorry unable to carry out your instruction',userDetails: req.session.userResultList,beneDetails: req.session.beneResultList
                                });
                        }
                       /* if(typeof results[0] == 'undefined'){
                            res.render('nefttransaction', {
                                title: '::-Transfer Failed-::',
                                results: results[0], msg:'sorry unable to carry out your instruction',userDetails: req.session.userResultList,beneDetails: req.session.beneResultList
                            });
                        }else{
                            if(results[0].length > 0 && results[0] !== null)
                            {
                                res.render('nefttransactionconfirm', {
                                    title: '::-Transfer Success-::',
                                    results: results[0], userDetails: req.session.userResultList
                                });
                            }
                            else
                            {
                                res.render('nefttransaction', {
                                    title: '::-Transfer Failed-::',
                                    results: results[0], msg:'sorry unable to carry out your instruction',userDetails: req.session.userResultList,beneDetails: req.session.beneResultList
                                });
                            }
                        } */
                    });
                    }else{
                        console.log(err);
                        req.session.destroy();
                        res.redirect('/logout');
                    }
            }
    });
});

app.post('/transferaction', function (req, res) {
 console.log("POST: ");

 var body = req.body;
 var transaction_id = req.body.transaction_id;
 var acc_number = req.body.acc_number;
 var ifsc_code = req.body.ifsc_code;
 var beneficiary_name = req.body.beneficiary_name;
 var transfer_amount = req.body.transfer_amount;
 var transaction_notes = req.body.transaction_notes;
 var email = req.body.email;
 var dob = req.body.dob;
 var phone = req.body.phone;
 res.render('nefttransactionconfirm', {title: '::-NewUserCreated-::', transaction_id: transaction_id, acc_number: acc_number, ifsc_code: ifsc_code, beneficiary_name: beneficiary_name, transfer_amount: transfer_amount, transaction_notes: transaction_notes, email: email, dob: dob, phone: phone});

 });  


app.post('/insert', function (req, res) {
    console.log("POST: ");

    var body = req.body;

    connection.query('CALL `sp_new_create_user`(?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [body.acc_number, body.opening_balance, body.user_name, body.password, body.first_name, body.last_name, body.email, body.dob, body.customer_id, body.phone, new Date(), new Date()], function (err, results) {
            if (err) {
                res.send(err);
                req.session.destroy();
                res.redirect('/retail');
            }
            else {
                res.render('insert', {
                    title: '::-NewUserCreated-::'
                });
            }
        });
});

app.post('/tranferconfirm', function (req, res) {
    console.log("POST: ");

    var body = req.body;

    connection.query('INSERT INTO user SET opening_balance = ? where acc_number = ?',
        [body.transfer_amount, body.acc_number], function (err, results) {
            if (err) {
                res.send(err);
                req.session.destroy();
                res.redirect('/retail');
            }
            else {
                res.render('accountsummary', {
                    title: '::-NetBankingMenu-::', userDetails: req.session.userResultList
                });
            }
        });
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.render('logout', {
        title: '::-LogoutSessionSummary-::'
    });
});

app.get('/accountsummary', function (req, res) {
    res.render('accountsummary', {
        title: '::-NetBankingMenu-::', userDetails: req.session.userResultList
    });
});
app.get('/nefttransaction', function (req, res) {

   if(req.session.userResultList)
   {
       var body = req.body;

    var userDetails= req.session.userResultList
    connection.query('SELECT * FROM beneficiary where source_acc_number=?',
        [userDetails[0].acc_number], function (err, results) {
            req.session.beneResultList=results
            console.log(req.session.beneResultList);
            if (err) {
                res.send(err);
                req.session.destroy();
                res.redirect('/retail');
            }
            else {
                res.render('nefttransaction', {
                    title: '::-NetBankingMenu-::',msg:'',userDetails: req.session.userResultList  ,beneDetails: req.session.beneResultList
                });
            }
        });
   }
    else
   {
       req.session.destroy();
       console.log('Session Expired');
       res.render('retail', {
           title: '::-Retail Login-::',msg:'Session Expired!'
       });
   }
});

app.get('/nefttransactionconfirm', function (req, res) {
    res.render('nefttransactionconfirm', {
        title: '::-NetBankingMenu-::', userDetails: req.session.userResultList
    });
});

app.get('/transactionreport', function (req, res) {
    res.render('transactionreport', {
        title: '::-NetBankingMenu-::', msg: '', userDetails: req.session.userResultList
    });
});
app.post('/report', function (req, res) {
    if(req.session.userResultList)
    {
        var fromdate = req.body.from_date ;
    var todate =  req.body.to_date ;
    connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%m-%Y") as tr_date FROM nefttransfer WHERE source_acc_number = ? and transaction_date BETWEEN "' + fromdate + '" AND "' + todate + '"',[req.body.acc_number], function (err, results) {
        if (err) {
            console.log(err.message);
            req.session.destroy();
            res.redirect('/retail');
        }
        else if (results.length > 0 && results[0] !== null) {
            res.render('neftreportgeneration', {
                title: '::-NEFT Report-::',
                results: results,msg:'', userDetails: req.session.userResultList
            });

        }
        else {
            connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%m-%Y") as tr_date FROM nefttransfer WHERE source_acc_number = ? ORDER BY transaction_date DESC LIMIT 10',[req.body.acc_number], function (err, results) {
                if (err) {
                    res.send(err.message);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if (results.length > 0 && results[0] !== null) {
                    res.render('neftreportgeneration', {
                        title: '::-NEFT Report-::',
                        results: results, msg:'Last 10 Records is displaying.....',userDetails: req.session.userResultList
                    });

                }
                else {
                    res.render('transactionreport', {
                        title: '::-NEFT Report-::', msg: 'No Records Found!', userDetails: req.session.userResultList
                    });
                }
            });
        }
    });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});
app.post('/statement', function (req, res) {
    if(req.session.userResultList)
    {

        var fromdate = req.body.from_date ;
    var todate =  req.body.to_date ;
    connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%m-%Y") as tr_date FROM account_summary WHERE acc_number = ? and transaction_date BETWEEN "' + fromdate + '" AND "' + todate + '"',[req.body.acc_number], function (err, results) {
        if (err) {
            console.log(err);
            req.session.destroy();
            res.redirect('/retail');
        }
        else if (results.length > 0 && results[0] !== null) {
                    var clientInc=50;
                    var doc = new PDFDocument({
                        size: 'B5'
                    });
                    doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,5);
                    doc.font('Times-Roman').fontSize(13).text("Transaction Date     Account Number       Credit      Debit          Narration             Running Balance",5,20);
                    doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,25);
                    for(var i=0; i < results.length; i++){
                        if(i==25 || i==50){
                            doc.addPage({
                                size: 'B5'
                            });
                            var clientInc=50;
                            doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,5);
                    doc.font('Times-Roman').fontSize(13).text("Transaction Date     Account Number       Credit      Debit          Narration             Running Balance",5,20);
                    doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,25);
                        }
                        
                        doc.font('Times-Roman').fontSize(11).text(results[i].tr_date,5,clientInc);
                        doc.font('Times-Roman').fontSize(11).text(results[i].acc_number,112,clientInc);
                        doc.font('Times-Roman').fontSize(11).text(results[i].credit,240,clientInc);
                        doc.font('Times-Roman').fontSize(11).text(results[i].debit,280,clientInc);
                        doc.font('Times-Roman').fontSize(10).text(results[i].narration,320,clientInc);
                        doc.font('Times-Roman').fontSize(10).text(results[i].running_balance,430,clientInc);
                        clientInc = clientInc + 30;
                    }
                    //doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,12+(567-25));
                    doc.write("/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/documents/statement.pdf");
                    doc.write("statement.pdf",function(err){    
                        if(err){
                            console.log(err);
                            res.render('reportgeneration', {
                                title: '::-Account Summary Report-::',
                                results: results,msg:'Displaying Last 10 Records....',userDetails: req.session.userResultList
                            });
                        }else{
                            //res.download("/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/documents","statement.pdf");
                            res.render('reportgeneration', {
                                title: '::-Account Summary Report-::',
                                results: results,msg:'',userDetails: req.session.userResultList
                            });
                        }
                    }); 
           

        }
        else {
                connection.query('SELECT *,DATE_FORMAT(transaction_date,"%d-%m-%Y") as tr_date FROM account_summary WHERE acc_number = ? ORDER BY transaction_date DESC LIMIT 10',[req.body.acc_number], function (err, results) {
                if (err) {
                    console.log(err);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if (results.length > 0 && results[0] !== null) {
                        var clientInc=50;
                        var doc = new PDFDocument({
                            size: 'B5'
                        });
                    doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,5);
                    doc.font('Times-Roman').fontSize(13).text("Transaction Date     Account Number       Credit      Debit          Narration             Running Balance",5,18);
                    doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,25);
                    for(var i=0; i < results.length; i++){
                        if(typeof results[i] != "undefined"){
                            doc.font('Times-Roman').fontSize(11).text(results[i].tr_date,5,clientInc);
                            doc.font('Times-Roman').fontSize(11).text(results[i].acc_number,112,clientInc);
                            doc.font('Times-Roman').fontSize(11).text(results[i].credit,240,clientInc);
                            doc.font('Times-Roman').fontSize(11).text(results[i].debit,280,clientInc);
                            doc.font('Times-Roman').fontSize(10).text(results[i].narration,320,clientInc);
                            doc.font('Times-Roman').fontSize(10).text(results[i].running_balance,430,clientInc);
                            clientInc = clientInc + 30;
                        }
                    }
                    doc.font('Times-Roman').fontSize(13).text("______________________________________________________________________________________",5,12+(567-25));
                    doc.write("/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/documents/statement.pdf");
                    doc.write("statement.pdf",function(err){    
                        if(err){
                            res.render('reportgeneration', {
                                title: '::-Account Summary Report-::',
                                results: results,msg:'Displaying Last 10 Records....',userDetails: req.session.userResultList
                            });
                        }else{

                           /* res.download("C:/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/documents","statement.pdf", function(err){
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        
                                    }
                                });*/
                            res.render('reportgeneration', {
                                title: '::-Account Summary Report-::',
                                results: results,msg:'Displaying Last 10 Records....',userDetails: req.session.userResultList
                            });
                        }
                    }); 
                }
                else {
                    res.render('accountstatement', {
                        title: '::-Account Statement-::', msg: 'No Records found!', userDetails: req.session.userResultList
                    });
                }
            });
        }
    });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});

app.get('/downloads', function (req, res){
     if(req.session.userResultList)
    {
        res.download("/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/documents/statement.pdf", function(err){
                    if (err) {
                        console.log(err);
                    } else {
                        //res.redirect('/statement');
                    }
                });
    } else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});
app.post('/cca', function (req, res) {
    if(req.session.userResultList)
    {
        connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where date_of_birth=? AND password=?',
            [req.body.dob, req.body.password ], function (err, results) {
                if (err) {
                    res.send(err.message);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if (results.length > 0 && results[0] !== null) {
                    res.render('accountsummary', {
                        title: '::-CCA AccountSummary-::',
                        results: results, userDetails: req.session.userResultList,page: 'acc'
                    });

                }
                else {
                    res.render('cca', {
                        title: '::-CCA AccountSummary-::', msg: 'No Records Found!', userDetails: req.session.userResultList,page:'acc'
                    });
                }
            });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});

app.post('/update', function (req, res) {
    if(req.session.userResultList)
    {
        var details= new Array();
        details['email']=req.body.email;
        details['phone']=req.body.phone;
        details['acc_number']=req.body.acc_number;
        details['user_name']=req.body.user_name;
        req.session.update = details;
        console.log(req.session.update);
        res.render('transactionpassword', {
            title: '::-TransactionPassword-::',msg:'',userDetails: req.session.userResultList,update:req.session.update
        });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});
app.post('/profile', function (req, res) {
    if(req.session.userResultList)
    {
        var details= new Array();
        details['email']=req.body.email;
        details['phone']=req.body.phone;
        details['acc_number']=req.body.acc_number;
        details['user_name']=req.body.user_name;
        req.session.update = details;
        console.log(req.session.update);
        connection.query('SELECT * FROM user where transaction_password=? and acc_number=?',
            [req.body.trans_password,req.body.acc_number], function (err, results) {
               if (err) {
                    console.log(err.message);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if(results.length > 0 && results[0] !== null) {
                   connection.query('UPDATE user SET email = ?,phone=? WHERE acc_number = ?', [req.body.email, req.body.phone, req.body.acc_number], function (err, results) {
                       if (err) {
                           res.send(err);
                           req.session.destroy();
                           res.redirect('/retail');
                       }
                       else {
                           connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where user_name=? AND acc_number=?',
                               [req.body.user_name, req.body.acc_number ], function (err, results) {
                                   req.session.userResultList=results
                                   console.log(req.session.userResultList);
                                   if (err) {
                                       res.send(err.message);
                                       req.session.destroy();
                                       res.redirect('/retail');
                                   }
                                   else {
                                       res.render('updateprofile', {
                                           title: '::-Profile Updation-::',
                                           results: results, msg:'Profile Updated Successfully!',userDetails: req.session.userResultList
                                       });

                                   }
                               });
                       }
                   });

                }
                else
               {
                   res.render('transactionpassword', {
                       title: '::-TransactionPassword-::',msg:'Invalid Transaction Password',userDetails: req.session.userResultList,update: req.session.update
                   });
               }
            });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});

app.post('/authenregister', function (req, res) {
    connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where acc_number= ? and date_of_birth= ? and customer_id= ? and (active_indicator=0 or active_indicator=1)',
        [req.body.acc_number, req.body.dob, req.body.customer_id ], function (err, results) {
            req.session.registerDetails = results;
            console.log("New netbanking customer " + req.body.acc_number + " tried to register");
            if (err) {
                console.log(err.message);
                req.session.destroy();
                res.redirect('/retail');
            }
            else if (results.length == 0) {
                res.render('createuser', {
                    title: '::-NoResultsFound-::',
                    results: results, msg: 'No Results Found !'
                });

            }
            else if (!results[0].user_name) {
                res.render('NewNetbankingUser', {
                    title: '::-NewNetbankingUser-::',
                    results: results, msg: 'Please Fill details to Register!', registerDetails: req.session.registerDetails
                });

            }
            else {
                res.render('createuser', {
                    title: '::-NoResultsFound-::',
                    results: 2, msg: 'User already Exists!'
                });
                ;
            }
        });
});

app.post('/confirmregister', function (req, res) {

    connection.query('SELECT * FROM user where user_name = ?',
        [req.body.user_name], function (err, results) {
            if (err) {
                console.log(err.message);
                 res.render('NewNetbankingUser', {
                    title: '::-NewNetbankingUser-::',
                    results: results, msg: 'Error Try Again!', registerDetails: req.session.registerDetails
                });
            }
            else if (results.length == 1) {
                res.render('NewNetbankingUser', {
                    title: '::-NewNetbankingUser-::',
                    results: results, msg: 'User Name already Exists!', registerDetails: req.session.registerDetails
                });

            }
            else {
                if(req.body.trans_password != null){
                    connection.query('UPDATE user SET user_name = ?,password=?,transaction_password=?,active_indicator=1,last_updated_timestamp=? WHERE acc_number = ?', [req.body.user_name, req.body.password,req.body.trans_password, new Date(),req.body.acc_number], function (err, results) {
                        if (err) {
                            console.log(err);
                             res.render('NewNetbankingUser', {
                                title: '::-NewNetbankingUser-::',
                                results: results, msg: 'Error Try Again!', registerDetails: req.session.registerDetails
                            });
                        }
                        else {
                            req.session.destroy();
                            res.render('createuser', {
                                title: '::-UserAddedSucess-::', msg: 'Registered Sucessfully!'
                            });
                            ;
                        }
                    });
                }
                else{
                    connection.query('UPDATE user SET user_name = ?,password=?,active_indicator=1,last_updated_timestamp=? WHERE acc_number = ?', [req.body.user_name, req.body.password, new Date(),req.body.acc_number], function (err, results) {
                        if (err) {
                            console.log(err);
                            res.render('NewNetbankingUser', {
                                title: '::-NewNetbankingUser-::',
                                results: results, msg: 'Error Try Again!', registerDetails: req.session.registerDetails
                            });
                        }
                        else {
                            req.session.destroy();
                            res.render('createuser', {
                                title: '::-UserAddedSucess-::', msg: 'Registered Successfully!'
                            });
                            ;
                        }
                    });
                }
            }

        });
});
app.get('/insert', function (req, res) {
    res.render('insert', {

    });
});


app.get('/accountstatement', function (req, res) {
    if(req.session.userResultList)
    {
        connection.query('SELECT * FROM user', function (err, results) {
            if (err) {
                res.send(err.message);
                req.session.destroy();
                res.redirect('/retail');
            }
            else if (results.length > 0 && results[0] !== null) {
                res.render('accountstatement', {
                    title: '::-AccountStatement-::',
                    results: results, msg: '', userDetails: req.session.userResultList
                });

            }
            else {
                res.render('accountstatement', {
                    title: '::-AccountStatement-::', msg: 'No Records Found!', userDetails: req.session.userResultList
                });
            }
        });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});

app.get('/cca', function (req, res) {
    if(req.session.userResultList)
    {
        res.render('accountsummary', {
            title: '::-CCA AccountStatement-::', msg: '', userDetails: req.session.userResultList
        });

    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});

app.get('/reportgeneration', function (req, res) {
    if(req.session.userResultList)
    {
    res.render('reportgeneration', {  userDetails: req.session.userResultList});
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});
app.get('/profileupdate', function (req, res) {
    if(req.session.userResultList)
    {
        var profileUpdateQuery = "SELECT *,DATE_FORMAT(date_of_birth,'%d-%M-%Y') as dob FROM user where acc_number='"+req.session.userResultList[0].acc_number+"' AND password='"+req.session.userResultList[0].password+"'"
        connection.query(profileUpdateQuery,function (err, results) {
            if (err) {
                res.send(err.message);
                req.session.destroy();
                res.redirect('/retail');
            }
            else if (results.length > 0 && results[0] !== null) {
                res.render('updateprofile', {
                    title: '::-Profile Updation-::',
                    results: results, msg:'',userDetails: req.session.userResultList
                });

            }
            else {
                res.render('profileupdate', {
                    title: '::-Profile Updation-::', msg: 'No Records Found!', userDetails: req.session.userResultList
                });
            }
        });
    }
    else
    {
        req.session.destroy() ;
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});

app.get('/changepassword', function (req, res) {
    if(req.session.userResultList)
    {
    res.render('changepassword', {
        title: '::-Change Password-::',msg:'', userDetails: req.session.userResultList
    });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});
app.post('/changepwd',function(req,res){
    var details= new Array();
    details['new_password_type']=req.body.new_password_type;
    details['acc_number']=req.body.acc_number;
    details['new_password']=req.body.new_password;
    details['confirm_new_password']=req.body.confirm_new_password;
    req.session.changepwdUpdate = details;
    console.log(req.session.changepwdUpdate);
    res.render('changepasswordTransactionPassword', {
        title: '::-Transaction Password-::',msg:'',userDetails: req.session.userResultList,changepwdUpdate:req.session.changepwdUpdate
    });
});
app.post('/changepassword', function (req, res) {
    if(req.session.userResultList)
    {

        var details= new Array();
        details['new_password_type']=req.body.new_password_type;
        details['acc_number']=req.body.acc_number;
        details['new_password']=req.body.new_password;
        details['confirm_new_password']=req.body.confirm_new_password;
        req.session.changepwdUpdate = details;
        console.log(req.session.changepwdUpdate);
        connection.query('SELECT * FROM user where transaction_password=? and acc_number=?',
            [req.body.trans_password,req.body.acc_number], function (err, results) {
                if (err) {
                    console.log(err.message);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if(results.length > 0 && results[0] !== null)
                {
                    if(req.body.new_password_type == "login_password")
                    {
                        connection.query('UPDATE user SET password = ? WHERE acc_number = ?', [req.body.new_password, req.body.acc_number], function (err, results) {
                            if (err) {
                                res.send(err);
                                req.session.destroy();
                                res.redirect('/retail');
                            }
                            else {
                                connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where acc_number=?',
                                    [req.body.acc_number ], function (err, results) {
                                        req.session.userResultList=results
                                        console.log(req.session.userResultList);
                                        if (err) {
                                            res.send(err.message);
                                            req.session.destroy();
                                            res.redirect('/retail');
                                        }
                                        else {
                                            res.render('changepassword', {
                                                title: '::-Change Password-::',
                                                results: results, msg:'Login Password Changed Successfully!',userDetails: req.session.userResultList
                                            });

                                        }
                                    });
                            }
                        });
                    }
                    else if(req.body.new_password_type == "transaction_password")
                    {
                        connection.query('UPDATE user SET transaction_password = ? WHERE acc_number = ?', [req.body.new_password, req.body.acc_number], function (err, results) {
                            if (err) {
                                res.send(err);
                                req.session.destroy();
                                res.redirect('/retail');
                            }
                            else {
                                connection.query('SELECT *,DATE_FORMAT(date_of_birth,"%d-%M-%Y") as dob FROM user where acc_number=?',
                                    [req.body.acc_number ], function (err, results) {
                                        req.session.userResultList=results
                                        console.log(req.session.userResultList);
                                        if (err) {
                                            res.send(err.message);
                                            req.session.destroy();
                                            res.redirect('/retail');
                                        }
                                        else {
                                            res.render('changepassword', {
                                                title: '::-Change Password-::',
                                                results: results, msg:'Transaction Password Changed Successfully!',userDetails: req.session.userResultList
                                            });

                                        }
                                    });
                            }
                        });
                    }
                    else
                    {
                        req.session.destroy();
                        console.log('Session Expired');
                        res.render('retail', {
                            title: '::-Retail Login-::',msg:'Session Expired!'
                        });
                    }
                }
                else
                {
                    res.render('changepasswordTransactionPassword', {
                        title: '::-Transaction Password-::',msg:'Invalid Transaction Password',userDetails: req.session.userResultList,changepwdUpdate:req.session.changepwdUpdate
                    });
                }
            });

    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});
app.get('/recoversucess', function (req, res) {
    res.render('recoversucess', {
        title: '::-RecoverySucess-::'
    });
});

app.get('/forgot', function (req, res) {
    res.render('forgot', {
        title: '::-RecoverUserInfo-::', msg: ''
    });
});
app.get('/transactionpassword', function (req, res) {
    res.render('transactionpassword', {
        title: '::-TransactionPassword-::'
    });
});
app.get('/beneficiary', function (req, res) {
    if(req.session.userResultList)
    {
        connection.query('SELECT * FROM beneficiary where source_acc_number=?',[ req.session.userResultList[0].acc_number], function (err, results) {
        if (err) {
            res.send(err.message);
            req.session.destroy();
            res.redirect('/retail');
        }
        else if (results.length > 0 && results[0] !== null) {
            res.render('beneficiary', {
                title: '::-Beneficiary Maintain-::',
                results: results, msg: '',userDetails: req.session.userResultList
            });
        }
        else {
            res.render('beneficiary', {
                title: '::-Beneficiary Maintain-::',
                results: results, msg: '',userDetails: req.session.userResultList,msg:''
            });
        }
    });
}
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }

});

app.get('/deleteBeneficiary/:acc/:sacc', function (req, res) {
    if(req.session.userResultList)
    {
        var acc=req.param('acc');
        var sacc=req.param('sacc');
        console.log(acc,sacc);
        connection.query('DELETE FROM `netbanking`.`beneficiary` WHERE source_acc_number=? AND acc_number=?',[ sacc,acc], function (err, results) {
        if (err) {
            console.log(err);
            res.render('beneficiary', {
                        title: '::-Beneficiary Maintain-::',
                        results: results, msg: 'Beneficiary Deletion Failure',userDetails: req.session.userResultList
                    });
        }
        else {
           connection.query('SELECT * FROM beneficiary where source_acc_number=?',[ req.session.userResultList[0].acc_number], function (err, results) {
                if (err) {
                    res.send(err.message);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if (results.length > 0 && results[0] !== null) {
                    res.render('beneficiary', {
                        title: '::-Beneficiary Maintain-::',
                        results: results, msg: 'Beneficiary Deletion Success',userDetails: req.session.userResultList
                    });
                }
                else {
                    res.render('beneficiary', {
                        title: '::-Beneficiary Maintain-::',
                        results: results, msg: 'Beneficiary Deletion Success',userDetails: req.session.userResultList,msg:''
                    });
                }
            });
        }
    });
}
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }

});


app.post('/beneficiary', function (req, res) {
    if(req.session.userResultList)
    {

        var details= new Array();
        details['source_acc_number']=req.body.source_acc_number;
        details['acc_number']=req.body.acc_number;
        details['ifsc_code']=req.body.ifsc_code;
        details['beneficiary_name']=req.body.beneficiary_name;
        req.session.beneficiary = details;
        console.log(req.session.beneficiary);
        connection.query('SELECT * FROM beneficiary where source_acc_number=? and acc_number=?',[req.body.source_acc_number,req.body.acc_number],
            function (err, results)
            {
                if (err)
                {
                    console.log(err.message);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if (results.length > 0 && results[0] !== null)
                {
                    res.render('beneficiary', {
                        title: '::-Beneficiary Maintain-::',
                        results: results, userDetails: req.session.userResultList,msg:'You already added the Beneficiary!'
                    });
                }
                else
                {
                    res.render('beneficiaryTransactionPassword', {
                  title: '::-TransactionPassword-::',msg:'',userDetails: req.session.userResultList,beneficiary:req.session.beneficiary
                  });
                }
        });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }

});
app.post('/AddBeneficiary', function (req, res) {
    if(req.session.userResultList)
    {

        var details= new Array();
        details['source_acc_number']=req.body.source_acc_number;
        details['acc_number']=req.body.acc_number;
        details['ifsc_code']=req.body.ifsc_code;
        details['beneficiary_name']=req.body.beneficiary_name;
        req.session.beneficiary = details;
        console.log(req.session.beneficiary);
        connection.query('SELECT * FROM user where transaction_password=? and acc_number=?',[req.body.trans_password,req.body.source_acc_number],
            function (err, results)
            {
                if (err)
                {
                    console.log(err.message);
                    req.session.destroy();
                    res.redirect('/retail');
                }
                else if(results.length > 0 && results[0] !== null)
                {
                    var beneficisaryAddQuery = 'INSERT INTO beneficiary SET source_acc_number = "'+req.body.source_acc_number+'",acc_number = "'+req.body.acc_number+'", ifsc_code="'+req.body.ifsc_code+'",beneficiary_name= "'+req.body.beneficiary_name+'", created_timestamp="'+new Date()+'", last_updated_timestamp="'+new Date()+'"';
                    connection.query(beneficisaryAddQuery, function (err, results) {
                            if (err) {
                                console.log(err.message);
                                req.session.destroy();
                                res.redirect('/retail');
                            }
                            else {
                                 connection.query('SELECT * FROM beneficiary where source_acc_number=?',[ req.session.userResultList[0].acc_number], function (err, results) {
                                    if (err) {
                                        res.send(err.message);
                                        req.session.destroy();
                                        res.redirect('/retail');
                                    }
                                    else {
                                        res.render('beneficiary', {
                                            title: '::-Beneficiary Maintain-::',
                                            results: results, msg: 'Beneficiary Addition Success',userDetails: req.session.userResultList,msg:''
                                        });
                                    }
                                });
                                /*res.render('beneficiary', {
                                    title: '::-Beneficiary Maintain-::',
                                    results: results, userDetails: req.session.userResultList,msg:'Beneficiary added Successfully!'
                                });*/
                            }
                        });

                }
                else
                {
                    res.render('beneficiaryTransactionPassword', {
                        title: '::-TransactionPassword-::',msg:'Invalid Transaction Password',userDetails: req.session.userResultList,beneficiary:req.session.beneficiary
                    });
                }
        });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }

});

app.get('/transferconfirm', function (req, res) {
    if(req.session.userResultList)
    {
    res.render('transferconfirm', {
        title: '::-Transfer Confirm-::', userDetails: req.session.userResultList
    });
}
else
{
    req.session.destroy();
    console.log('Session Expired');
    res.render('retail', {
        title: '::-Retail Login-::',msg:'Session Expired!'
    });
}
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

app.post('/dynamicPasswordCheck', function(req,res){
    var dynamicCode = req.body.trans_password;
    var redirectTo = req.body.redirect_option;
    connection.query('select dynamic_code from user where dynamic_code =? and customer_id =?',[dynamicCode,req.session.userResultList[0].customer_id],function(err,results){
        if(err){
            req.session.destroy();
            console.log('Session Expired');
            res.render('retail', {
                title: '::-Retail Login-::',msg:'Session Expired!'
            });
        }else if(results.length >0){
            res.redirect(redirectTo);
        }else{
            res.render('dynamicOTP', {
                title: '::-Dynamic Login Code-::',
                userDetails: req.session.userResultList,
                msg:'Invalid Dynamic Code/Re Login'
            });
        }
    });

});

app.get('/feedbackORcomplaint',function(req,res){

    if(req.session.userResultList)
    {
        res.render('feedback_complaint', {
            title: '::-feedback/complaint-::',
            userDetails: req.session.userResultList,
            results: req.session.userResultList,
            msg:''
        });
    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }

});

app.post('/feedbackUpdate',function(req,res){

    if(req.session.userResultList)
    {
        connection.query('INSERT INTO `feedback_complaint`(`type_of_query`,`type_of_services`,`customer_id`,`customer_name`,`email`,`mobile`,`address`,`comments`,`query_date`,`query_status`)VALUES(?,?,?,?,?,?,?,?,?,?)',[req.body.query_type,req.body.type_of_services,req.body.customer_id,req.body.first_name,req.body.email,req.body.phone,req.body.address,req.body.comments,new Date(),0],function(err){
            if(err){
                console.log(err);
                res.render('feedback_complaint', {
                    title: '::-feedback/complaint-::',
                    userDetails: req.session.userResultList,
                    results: req.session.userResultList,
                    msg:'Something went wrong!'
                });
            }else{
                res.render('feedback_complaint', {
                    title: '::-feedback/complaint-::',
                    userDetails: req.session.userResultList,
                    results: req.session.userResultList,
                    msg:'Feedback/Complaint updated successfully'
                });
            }
        });

    }
    else
    {
        req.session.destroy();
        console.log('Session Expired');
        res.render('retail', {
            title: '::-Retail Login-::',msg:'Session Expired!'
        });
    }
});

app.post('/upload',function(req, res) {
        var self = this;
        var fs = require('fs'),
            util = require('util');
        var fileName = new Array();
        fs.unlink("/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/images/"+req.session.userResultList[0].acc_number+".jpg", function(err){
            if(err){ console.log('Error while unlinking Old'+err); }
            else { console.log('Successfully unlinked Old');};
        });
        var fileType = req.files.singleUploadDocument.name;

        var is = fs.createReadStream(req.files.singleUploadDocument.path);
        var os = fs.createWriteStream("/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/images/"+fileType);
        is.pipe(os);
        is.on('end', function() {
           console.log("File uploaded successfully");
        });
        fs.unlink(req.files.singleUploadDocument.path, function(err){
            if(err){ console.log('Error while unlinking '+err); }
            else { console.log('Successfully unlinked');};
            fs.rename("/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/images/"+fileType,"/Users/Sathishkumar.M/Downloads/Netbanking/Netbanking/public/images/"+req.session.userResultList[0].acc_number+".jpg", function(err) {
                if ( err ) console.log('ERROR: ' + err);
                res.redirect('/cca');
            });
        });
        is.on('error', function(err) { console.log("error while uploading "+err); });
});

app.post('/sendEmail',function(req,res){
    var randtoken = require('rand-token');
    var randomPassword = randtoken.generate(8);

    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport("SMTP",{
        service: 'Gmail',
        auth: {
            user: 'mfi.android@ionixxtech.com',
            pass: 'mfiteam@321'
        }
    });

    var mailOptions = {
        from: "TrustBank<no-reply@trustbank.com>",
        to: 'msk175@gmail.com' ,
        subject: 'Dynamic Login Code',//props.emailSubject,
        html: "To proceed further take a dynamic login code : "+randomPassword//props.emailText+""+newPassword
    };

    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);

        }else{
            console.log("Send Email Success");
        }
    });
});