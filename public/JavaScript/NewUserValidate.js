window.onload = function() {
    document.getElementById("opening_balance").focus();
};
function NewUserValidate()
{

    var phoneno = /^\d{10}$/;
    var acc_number = (document.getElementById("acc_number").value).trim();
    var customer_id = (document.getElementById("customer_id").value).trim();
    var opening_balance = (document.getElementById("opening_balance").value).trim();
    var user_name = (document.getElementById("user_name").value).trim();
    var password = (document.getElementById("password").value).trim();
    var confirm_password = (document.getElementById("confirm_password").value).trim();
    var first_name = (document.getElementById("first_name").value).trim();
    var last_name = (document.getElementById("last_name").value).trim();
    var email = (document.getElementById("email").value).trim();
    var dob = (document.getElementById("dob").value).trim();
    var phone = document.getElementById("phone").value;
    if (acc_number == "")
    {
        alert("Please Fill Account Number");
        document.getElementById('acc_number').focus();
        return false;
    }
    else if (customer_id == "")
    {
        alert("Please Fill Customer ID");
        document.getElementById('customer_id').focus();
        return false;
    }
    else if (opening_balance.length == 0)
    {
        alert("Please Fill Opening Balance");
        document.getElementById('opening_balance').focus();
        return false;
    }
 /*   else if (user_name == "")
    {
        alert("Please Fill User Name");
        document.getElementById('user_name').focus();
        return false;
    }
    else if (password == "")
    {
        alert("Please Fill Password");
        document.getElementById('password').focus();
        return false;
    }
    else if (confirm_password == "")
    {
        alert("Please Fill Confirm Password");
        document.getElementById('confirm_password').focus();
        return false;
    } */
    else if (confirm_password != password )
    {
        alert("Confirm Password does not match");
        document.getElementById('confirm_password').focus();
        return false;
    }
    else if (first_name == "")
    {
        alert("Please Fill First Name");
        document.getElementById('first_name').focus();
        return false;
    }
    else if (last_name == "")
    {
        alert("Please Fill Last Name");
        document.getElementById('last_name').focus();
        return false;
    }
    else if (email == "")
    {
        alert("Please Fill Email Address");
        document.getElementById('email').focus();
        return false;
    }
    else if (dob == "")
    {
        alert("Please Fill Date of Birth");
        document.getElementById('dob').focus();
        return false;
    }
    else if (phone.match(phoneno))
    {
        alert("Acc Number: "+acc_number+"\nTransfer Amount:Rs."+opening_balance+"INR");
        return true;
    }
    else
    {
        alert("Please Fill Valid Phone Number");
        document.getElementById('phone').focus();
        return false;
    }

}
/*function phonenumber(inputtxt)
{
    var phoneno = /^\d{10}$/;
    if(inputtxt.value.match(phoneno))
    {
        return true;
    }
    else
    {
        alert("Not a valid Phone Number");
        return false;
    }
}*/

