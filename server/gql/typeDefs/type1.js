const { gql } = require("apollo-server-express");

const type1 = gql`
  type Query {
    hello: String!
    users: [User]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    phone: String
    isVerified: Boolean
  }

  type Token {
    token: String!
  }

  input registerInput {
    name: String!
    email: String!
    password: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  input updateInput {
    name: String
    email: String
    password: String
    phone: String
    isVerified: Boolean
  }

  type Mutation {
    register(user: registerInput!): User
    login(user: loginInput!): Token
    updateUser(user: updateInput): User
  }
`;

module.exports = type1;
