const { UserModel } = require('../models/myModel');

exports.postData = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { username, password } = req.body;
    
        // Create a new user document
        const user = new UserModel({
          username,
          password
        });
    
        // Save the document to the database
        await user.save();
        res.status(201).json({ message: 'User saved successfully', user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save user', error });
      }
  };


  // POST API to store data in the database
// app.post('/api/data', async (req, res) => {
//     try {
//       console.log("Request body:", req.body);
//       const { username, password } = req.body;
  
//       // Create a new user document
//       const user = new UserModel({
//         username,
//         password
//       });
  
//       // Save the document to the database
//       await user.save();
//       res.status(201).json({ message: 'User saved successfully', user });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to save user', error });
//     }
//   });