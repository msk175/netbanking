function resetChangepassword()
{
    document.getElementById("old_password").value="";
    document.getElementById("new_password").value="";
    document.getElementById("confirm_new_password").value="";
    return false;
}

function resetBeneficiary()
{
    document.getElementById("acc_number").value="";
    document.getElementById("confirm_acc_number").value="";
    document.getElementById("ifsc_code").value="";
    document.getElementById("beneficiary_name").value="";

}
function resetNeft()
{
    document.getElementById("transfer_acc_number").value="Select"
    document.getElementById("acc_number").value = "";
    document.getElementById("ifsc_code").value = "";
    document.getElementById("beneficiary_name").value = "";
    document.getElementById("transfer_amount").value="";
    document.getElementById("transaction_notes").value="";
}