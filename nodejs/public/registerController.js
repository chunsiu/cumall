const registerService = require("./registerService");


let createNewUser = async (req, res) => {
  try{
      let data = {
          userName: req.body.userName,
          password: req.body.password,
          email: req.body.email,
      };
      //create a new user
      await registerService.createNewUser(data);
      return res.status(200).json({
          message: "a user create succeeds"
      })
  }catch (e) {
      return res.status(500).json(e);
  }
};
module.exports = {
    createNewUser: createNewUser
};