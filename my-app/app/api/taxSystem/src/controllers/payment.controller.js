const axios = require('axios');


exports.payment = async (req, res) => {
  console.log(req.body)
  try {
    const { amount, email, firstName, lastName, phone } = req.body;
    const tx_ref = "chewatatest-" + Date.now();
    
    // Prepare payment request body for Chapa
    const body = {
        amount, 
        currency: "ETB",
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        tx_ref,
        callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
        return_url: `http://localhost:3000`,
        customization: {
          title: "Payment for ",
          description: "I love online payments",
        },
        meta: {
          hide_receipt: "true",
        },
      };
    const options = {
        method: "POST",
        url: "https://api.chapa.co/v1/transaction/initialize",
        headers: {
          Authorization: "Bearer CHASECK_TEST-E2XnZBkD5AqYSXud9MWRnqHtRqgqZYPm", // Replace with your Chapa test key
          "Content-Type": "application/json",
        },
        data: body,
      };

    const response = await axios(options);
    const chapaResponse = response.data;
    

   
 
    res.status(201).json({
      message: "Booking created successfully, redirect to payment",
      paymentUrl: chapaResponse.data.checkout_url
    });
  } catch (error) {
    console.error('Error handling Chapa payment:', error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};