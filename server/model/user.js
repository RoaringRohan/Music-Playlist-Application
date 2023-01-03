const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminPrivileges: { type: Boolean, required: false },
    refreshToken: { type: String}
    
  }, { collection : 'Users' });
   
  const User = mongoose.model('User', userSchema);
   
  module.exports = User;