/*window.onload = function() {
    document.getElementById("transfer_acc_number").focus();
};*/
function validate()
{
    var regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    var transfer_acc_number = (document.getElementById("transfer_acc_number").value).trim();
    var acc_number = (document.getElementById("acc_number").value).trim();
    var ifsc_code = (document.getElementById("ifsc_code").value).trim();
    var beneficiary_name = (document.getElementById("beneficiary_name").value).trim();
    var transfer_amount = document.getElementById("transfer_amount").value;
    var transaction_notes = (document.getElementById("transaction_notes").value).trim();
    var running_balance = document.getElementById("running_balance").value;
    if (transfer_acc_number == "Select")
    {
        alert("Please Add Beneficiary / Select Transfer Acc Number From List");
        return false;
    }
    if (acc_number == "")
    {
        alert("Please Fill Valid Account Number");
        return false;
    }
    else if (ifsc_code == "")
    {
        alert("Please Fill IFSC Code");
        return false;
    }
    else if (beneficiary_name == "")
    {
        alert("Please Fill Beneficiary Name");
        return false;
    }
    else if (transaction_notes == "")
    {
        alert("Please Fill Transaction Notes");
        document.getElementById('transaction_notes').focus();
        return false;
    }

    else if (transfer_amount.match(regex))
    {
            var x = confirm("Acc Number: "+acc_number+"\nTransfer Amount:Rs."+transfer_amount+"INR");
            if(x)
            {
                return true;
                $("#BDEFormID").hide();
            }
            else
            {
                return false;
            }
    }
    else
    {
        alert("Transfer amount only starting from Rs.1 INR");
        document.getElementById('transfer_amount').focus();
        return false;
    }
}
function Newcreateuservalidate()
{
    var acc_number = (document.getElementById("acc_number").value).trim();
    var customer_id = (document.getElementById("customer_id").value).trim();
    var dob = (document.getElementById("dob").value).trim();
    if (acc_number == "")
    {
        alert("Please Fill Account Number");
        document.getElementById('acc_number').focus();
        return false;
    }
    else if (dob == "")
    {
        alert("Please Fill Date of Birth");
        document.getElementById('dob').focus();
        return false;
    }
    else if (customer_id == "")
    {
        alert("Please Fill Customer ID");
        document.getElementById('customer_id').focus();
        return false;
    }
}
function Newregisteruservalidate()
{
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    var user_name = (document.getElementById("user_name").value).trim();
    var password = (document.getElementById("password").value).trim();
    var confirm_password = (document.getElementById("confirm_password").value).trim();
    var trans_box = document.getElementById("trans_box").checked;
    var trans_password = (document.getElementById("trans_password").value).trim();
    var trans_confirm_password = (document.getElementById("trans_confirm_password").value).trim();
    if (user_name =="")
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
    }
    else if (confirm_password != password )
    {
        alert("Confirm Password does not match");
        document.getElementById('confirm_password').focus();
        return false;
    }
    else if(trans_box == true )
    {
    if (trans_password == "")
    {
        alert("Please Fill Transaction Password");
        document.getElementById('trans_password').focus();
        return false;
    }
    else if (trans_confirm_password == "")
    {
        alert("Please Fill Transaction Confirm Password");
        document.getElementById('trans_confirm_password').focus();
        return false;
    }
    else if (trans_confirm_password != trans_password )
    {
        alert("Transaction Confirm Password does not match");
        document.getElementById('trans_confirm_password').focus();
        return false;
    }
    else if(trans_password.match(re))
    {
        return true;
    }
    else
    {
        alert("Transaction Password entered is not matched the condition");
        return false;
    }
    }
    else
    {
    if(password.match(re))
    {
        var x=confirm("Are you sure you don't want Transaction password?\nIf you click Ok There is no option to set Transaction Password You need to apply in Bank only");
        if(x)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        alert("Login Password entered is not matched the condition");
        return false;
    }
    }
}
function enable_text(status)
{
    status=!status;
    document.getElementById('trans_password').disabled = status;
    document.getElementById('trans_confirm_password').disabled = status;

}
function registerValidate()
{
    var phoneno = /^\d{10}$/;
    var acc_number = (document.getElementById("acc_number").value).trim();
    var dob = (document.getElementById("dob").value).trim();
    var phone = document.getElementById("phone").value;
    if (acc_number =="")
    {
        alert("Please Fill Account Number");
        document.getElementById('acc_number').focus();
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
        return true;
    }
    else
    {
        alert("Please Fill Valid Phone Number");
        document.getElementById('phone').focus();
        return false;
    }
}
function validateBeneficiary()
{
    var accno = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    var source_acc_number = (document.getElementById("source_acc_number").value).trim();
    var acc_number = (document.getElementById("acc_number").value).trim();
    var confirm_acc_number = (document.getElementById("confirm_acc_number").value).trim();
    var ifsc_code = (document.getElementById("ifsc_code").value).trim();
    var beneficiary_name = (document.getElementById("beneficiary_name").value).trim();
    if (acc_number == "")
    {
        alert("Please Fill Account Number");
        document.getElementById('acc_number').focus();
        return false;
    }
    if (confirm_acc_number == "")
    {
        alert("Please Fill Confirm Account Number");
        document.getElementById('acc_number').focus();
        return false;
    }
    else if (ifsc_code == "")
    {
        alert("Please Fill IFSC Code");
        document.getElementById('ifsc_code').focus();
        return false;
    }
    else if (beneficiary_name == "")
    {
        alert("Please Fill Beneficiary Name");
        document.getElementById('beneficiary_name').focus();
        return false;
    }
    else if (acc_number.match(accno))
    {
        if (confirm_acc_number != acc_number)
        {
            alert("Confirm Acc Number does not match");
            return false;
        }
        else if (source_acc_number == acc_number)
        {
            alert("Source and Destination same account number not allowed");
            return false;
        }
        else
        {
            alert("Acc Number: "+acc_number+"");
            return true;
        }
    }
    else
    {
        alert("Please Fill correct Account Number");
        return false;
    }
}

function beneficiaryload(beneDetails)
{
    var transfer_acc_number = (document.getElementById("transfer_acc_number").value).trim();
    if(transfer_acc_number != "Select")
    {
    var x=window.confirm("Transfer Account Number is : "+transfer_acc_number+"\nAre you sure you are ok?")
    if (x)
    {
        for (var j = 0; j < beneDetails.length; ++j) {
        if(beneDetails[j].acc_number==transfer_acc_number)
        {
            document.getElementById("acc_number").value = beneDetails[j].acc_number;
            document.getElementById("ifsc_code").value = beneDetails[j].ifsc_code;
            document.getElementById("beneficiary_name").value = beneDetails[j].beneficiary_name;
        }
    }
    }
    else
    {
        document.getElementById("acc_number").value = "";
        document.getElementById("ifsc_code").value = "";
        document.getElementById("beneficiary_name").value = "";
        return false;
    }
}
    else
    {
        document.getElementById("acc_number").value = "";
        document.getElementById("ifsc_code").value = "";
        document.getElementById("beneficiary_name").value = "";
        return false;
    }
}
function validateProfile(results)
{
    var phoneno = /^\d{10}$/;
    var email = (document.getElementById("email").value).trim();
    var phone = document.getElementById("phone").value;
    var old_email = (document.getElementById("old_email").value).trim();
    var old_phone = (document.getElementById("old_phone").value).trim();
    if (email == "")
    {
     alert("Please Fill Email Address");
        document.getElementById('email').focus();
        return false;
    }
    else if (email == old_email && phone == old_phone)
    {
        alert("There is no change in Email Address/Phone Number");
        document.getElementById('email').focus();
        return false;
    }
    else if (phone.match(phoneno))
    {
        /*var tr_password=prompt("please enter your Transaction Password","")
        for (var j = 0; j < results.length; ++j) {
            if(results[j].transaction_password==tr_password)
            {*/
                return true;
            /*}
            else
            {
                alert("Transaction Password is not matched");
                return false;
            }
        }*/
    }
    else
    {
        alert("Please Fill Valid Phone Number");
        document.getElementById('phone').focus();
        return false;
    }

    }
function transpassword()
{
    var trans_password = (document.getElementById("trans_password").value).trim();
    if (trans_password == "")
    {
        alert("Please Fill Transaction Password");
        document.getElementById('trans_password').focus();
        return false;
    }
    else
    {
        return true;
    }
}

function loginDynamicPassword()
{
    var trans_password = (document.getElementById("trans_password").value).trim();
    if (trans_password == "")
    {
        alert("Please Fill Dynamic Login Code");
        document.getElementById('trans_password').focus();
        return false;
    }
    else
    {
        return true;
    }
}

function validateChangepassword()
{
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    var new_password_type = (document.getElementById("new_password_type").value).trim();
    var old_password = (document.getElementById("old_password").value).trim();
    var tr_old_password = (document.getElementById("tr_old_password").value).trim();
    var db_old_password = (document.getElementById("db_old_password").value).trim();
    var new_password = (document.getElementById("new_password").value).trim();
    var confirm_new_password = (document.getElementById("confirm_new_password").value).trim();
    if (old_password == "")
    {
        alert("Please Fill Old Password");
        document.getElementById('old_password').focus();
        return false;
    }
    else if (new_password == "")
    {
        alert("Please Fill New Password");
        document.getElementById('new_password').focus();
        return false;
    }
    else if (confirm_new_password == "")
    {
        alert("Please Fill confirm new password");
        document.getElementById('confirm_new_password').focus();
        return false;
    }
    else if (confirm_new_password != new_password)
    {
        alert("Confirm New Password not matched");
        document.getElementById('confirm_new_password').focus();
        return false;
    }
    if (new_password_type == "transaction_password")
    {
        if (old_password != tr_old_password)
        {
            alert("Old Transaction Password is not matched");
            document.getElementById('new_password').focus();
            return false;
        }
        else if (new_password == tr_old_password)
        {
            alert("New Transaction Password is already you are used so please Fill new one");
            document.getElementById('new_password').focus();
            return false;
        }
        else if(new_password == db_old_password)
        {
            alert("Transaction Password and Login Password Cannot be same");
            document.getElementById('new_password').focus();
            return false;
        }
        else if(new_password.match(re))
        {
            return true;
        }
        else
        {
            alert("Password entered is not matched the condition");
            return false;
        }
    }
    else
    {
        if (old_password != db_old_password)
        {
            alert("Entered Old Login Password is not matched");
            document.getElementById('old_password').focus();
            return false;
        }
        else if (new_password == db_old_password)
        {
            alert("New Login Password is already you are used so please Fill new one");
            document.getElementById('old_password').focus();
            return false;
        }
        else if(new_password.match(re))
        {
           return true;
        }
        else
        {
            alert("Password entered is not matched the condition");
            return false;
        }
    }
}

function validateFeedback(){
    var comments =(document.getElementById("comments").value).trim();

    if(comments==""){
        alert("Please fill Comments");
        return false;
    }
    else{
        return true;
    }

}

function upload(){
    var arr=$("#singleUploadDocumentId").val().split('.');
    //alert(arr[1]);
    if($("#singleUploadDocumentId").val()!="" && (arr[1]=='jpg' || arr[1]=='jpeg')){
        document.getElementById("NEFTFormID").method='POST';
        document.getElementById("NEFTFormID").action="/upload";
        document.getElementById("NEFTFormID").submit();
    }else{
        alert("Please choose valid jpg/jpeg file to upload");
    }

}

function callAddTransaction(){
    var arr=(document.getElementById("acc_number").value).trim();
    //alert(arr[1]);
    if(arr){
        document.getElementById("BDEFormID").method='GET';
        document.getElementById("BDEFormID").action="/fetchAccDetails/"+arr+"/ACC Details";
        document.getElementById("BDEFormID").submit();
    }else{
        alert("Please enter acc number to continue");
    }

}

function callAddTransactionCredit(){
    var arr=(document.getElementById("amount").value).trim();
    var arr1=(document.getElementById("narration").value).trim();
    var arr2=(document.getElementById("acc_number").value).trim();
    //alert(arr[1]);
    if(arr&&arr1){
        document.getElementById("BDEFormID").method='GET';
        document.getElementById("BDEFormID").action="/creditFromAdminAction/"+arr+"/"+arr2+"/"+arr1;
        document.getElementById("BDEFormID").submit();
    }else{
        alert("Please enter Amount and Narration to continue");
    }

}

function callAddTransactionDebit(){
    var arr=(document.getElementById("amount").value).trim();
    var arr1=(document.getElementById("narration").value).trim();
    var arr2=(document.getElementById("acc_number").value).trim();
    //alert(arr[1]);
    if(arr&&arr1){
        document.getElementById("BDEFormID").method='GET';
        document.getElementById("BDEFormID").action="/debitFromAdminAction/"+arr+"/"+arr2+"/"+arr1;
        document.getElementById("BDEFormID").submit();
    }else{
        alert("Please enter Amount and Narration to continue");
    }

}

function deleteBeneficiary(val){
    var x=confirm("Are you sure to delete Beneficiary!");
    if(x){
        alert("Beneficiary: "+val.beneficiary_name+" will be deleted from your list.");
        document.getElementById("BDEFormID").method='GET';
        document.getElementById("BDEFormID").action="/deleteBeneficiary/"+val.acc_number+"/"+val.source_acc_number;
        document.getElementById("BDEFormID").submit();
    }
    
}

function download(){
     document.getElementById("BDEFormID").method='GET';
     document.getElementById("BDEFormID").action="/downloads";
     document.getElementById("BDEFormID").submit();
}
