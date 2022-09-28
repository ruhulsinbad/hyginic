const User = require("../../db/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const reso1 = {
  Query: {
    hello: () => "Hello World",
    users: async () => await User.find({}),
  },

  User: {
    id: async (parent, args, context, info) => {
      return parent._id;
    },
  },

  Mutation: {
    register: async (parent, { user }, context, info) => {
      const { name, email, password, confirmPassword } = user;
      if (confirmPassword !== password) {
        throw new Error("Password does not match");
      }
      const existUser = await User.findOne({ email });
      if (existUser) {
        throw new Error("This email is already used");
      }

      const hashedPassword = bcrypt.hashSync(password);

      const newUser = await User.create({ ...user, password: hashedPassword });
      return newUser;
    },

    login: async (parent, { user }, context, info) => {
      const existUser = await User.findOne({ email: user.email });
      if (!existUser) {
        throw new Error("User not found with this email address");
      }

      const isPasswordCorrect = bcrypt.compareSync(
        user.password,
        existUser.password
      );
      if (!isPasswordCorrect) {
        throw new Error(" Invalid Password");
      }

      const token = jwt.sign({ id: existUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7 days",
      });

      return { token };
    },

    updateUser: async (parent, { user }, { id }, info) => {
      console.log(id);
      const existUser = await User.findById(id);
      console.log(existUser);
      if (!existUser) {
        throw new Error("Please login first");
      }

      const { name, email, password, phone, isVerified } = user;
      const updateUser = await User.findByIdAndUpdate(
        id,
        { ...user },
        { new: true }
      );
      return updateUser;
    },
  },
};

module.exports = reso1;
