<?php
// 1. SETTINGS (Fill these in from your Daraja Portal)
$consumerKey = '5MEk1VFjCEdHlgE6A95wUMJNICaI0VsOotQbRvmyQRnNH0QC'; 
$consumerSecret = 'jGLgGuScgWfB9HVCx9VFRAZFGfe1DceuYmNlcncMt9iCBu17LQXXaB8Gtqxv6hoa';
$BusinessShortCode = 'YOUR_PAYBILL_OR_TILL'; // e.g., 174379 for Sandbox
$Passkey = 'YOUR_LIPA_NA_MPESA_PASSKEY';
$PartyA = $_POST['phone']; // The client's phone number
$Amount = $_POST['amount']; // The amount (100, 200, etc.)
$Timestamp = date('YmdHis');
$Password = base64_encode($BusinessShortCode.$Passkey.$Timestamp);

// 2. GET ACCESS TOKEN
$headers = ['Content-Type:application/json; charset=utf8'];
$url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'; // Change to api.safaricom.co.ke for Live
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($curl, CURLOPT_HEADER, FALSE);
curl_setopt($curl, CURLOPT_USERPWD, $consumerKey.':'.$consumerSecret);
$result = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$result = json_decode($result);
$access_token = $result->access_token;

// 3. INITIATE STK PUSH
$stk_url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/query'; // Change to api.safaricom.co.ke for Live
$curl_post_data = [
  'BusinessShortCode' => $BusinessShortCode,
  'Password' => $Password,
  'Timestamp' => $Timestamp,
  'TransactionType' => 'CustomerPayBillOnline', // or CustomerBuyGoodsOnline
  'Amount' => $Amount,
  'PartyA' => $PartyA,
  'PartyB' => $BusinessShortCode,
  'PhoneNumber' => $PartyA,
  'CallBackURL' => 'https://yourdomain.com/callback.php', 
  'AccountReference' => 'RobermsRental',
  'TransactionDesc' => 'Loan Application Fee'
];

$data_string = json_encode($curl_post_data);
$curl = curl_init('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json','Authorization:Bearer '.$access_token));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
$curl_response = curl_exec($curl);

echo $curl_response; // Sends the result back to your JavaScript
?>
<?php
// This file waits for Safaricom to send a success message
$stkCallbackResponse = file_get_contents('php://input');
$logFile = "M_PESA_Confirmation.json";

// Log the response so you can see it in your hosting files
$log = fopen($logFile, "a");
fwrite($log, $stkCallbackResponse);
fclose($log);

$data = json_decode($stkCallbackResponse);
$resultCode = $data->Body->stkCallback->ResultCode;

if ($resultCode == 0) {
    // TRANSACTION SUCCESSFUL!
    // You can now update your database or send an SMS to the client
}
?>
