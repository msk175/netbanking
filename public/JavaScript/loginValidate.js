window.onload = function() {
    document.getElementById("user_name").focus();
};
function loginValidate()
{
    var username = (document.getElementById("user_name").value).trim();
    var password1 = (document.getElementById("password").value).trim();

    if (username == "")
    {
        alert("Please Fill UserName");
        document.getElementById('user_name').focus();
        return false;
    }
    if (password1 == "")
    {
        alert("Please Fill Password");
        document.getElementById('password').focus();
        return false;
    }


    loginWindow = window.open("",document.getElementById("user_name").value, "_blank", "toolbar=no, location=no,menubar=no,dependant=no,directories=no,scrollbars=yes, resizable=no, top=0, left=0, width=1000, height=0");
    document.user_login_form.target = document.getElementById("user_name").value;
    document.getElementById("password").value = document.getElementById("password").value;
    document.user_login_form.submit ();
    document.getElementById("user_name").value="";
    document.getElementById("password").value="";
    return false;
}

