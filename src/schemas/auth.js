import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: function (value) {
      const salt = bcrypt.genSaltSync(9);
      const hash = bcrypt.hashSync(value, salt);
      return hash;
    },
  },
});

const Users = mongoose.model('Users', UsersSchema);

export default Users;
