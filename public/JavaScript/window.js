function sendMail() {
    var link = 'mailto:'+document.getElementById('email').value+'?subject=Message from '
        +document.getElementById('email').value
        +'&body='+document.getElementById('email').value;
    window.location.href = link;
}
function myWindowForgot() {
    window.open("forgot", "_blank", "toolbar=yes, scrollbars=yes, resizable=no, top=100, left=200, width=1000, height=650");
    return false;
}
function myWindowCorporate() {
    window.open("corporate", "_blank", "toolbar=yes, scrollbars=yes, resizable=no, top=100, left=200, width=1000, height=650");
}
function myWindowRegister() {
    window.open("createuser", "_blank", "toolbar=yes, scrollbars=yes, resizable=no, top=100, left=200, width=1000, height=650");
}
function myWindowClose() {
    window.close();
}
function preventBack(){window.history.forward();}
setTimeout("preventBack()", 0);
window.onunload=function(){null};


/*window.oncontextmenu = function () {
   alert('Right Click Option Disabled');
    return false;
}*/

window.onload = function () {
    document.onkeydown = function (e) {
        if((e.which || e.keyCode) != 116)
        {
            return (e.which || e.keyCode) != 116;
        }
        else
        {
            alert("Refresh/F5 Option Disabled!");
        }
    };
}

window.onload = function () {
    document.onkeydown = function (e) {
        if((e.which || e.keyCode) != 82)
        {
            return (e.which || e.keyCode) != 82;
        }
        else
        {
            alert("Refresh/F5 Option Disabled!");
        }
    };
}

function CallbackFunction(event) {

    if(window.event){

              if (window.event.clientX < 40 && window.event.clientY < 0) { 

                  alert("back button is clicked");    

              }else{

                  alert("refresh button is clicked");
              }

    }else{

        if (event.currentTarget.performance.navigation.type == 2) { 

            alert("back button is clicked");    

        }
        if (event.currentTarget.performance.navigation.type == 1){

            alert("refresh button is clicked");
         }             
    }
}

/*window.onbeforeunload = function () {return false;}*/