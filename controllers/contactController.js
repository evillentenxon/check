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

exports.delmsg = async (req, res) => {
    try {
        const { id } = req.params;

        // Attempt to delete
        const deletedMessage = await ContactModel.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).send({ success: false, message: 'Message not found' });
        }

        res.status(200).send({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send({ success: false, message: 'Failed to delete message' });
    }
};

exports.message = async (req, res) => {
  try {
    const messages = await ContactModel.find(); // Fetch all messages
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};