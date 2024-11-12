const { ContactModel } = require('../models/myModel');

exports.contact = async (req, res) => {
    try {
      const { name, email, contact_no, message } = req.body;
      
      const sms = new ContactModel({
        name,
        email,
        contact_no,
        message
        });
  
      // Save the document to the database
      await sms.save();
      res.status(201).json({ message: 'message has been sent' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message', error });
    }
  };