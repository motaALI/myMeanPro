const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // install --save mongoose-unique-validator
  password: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
