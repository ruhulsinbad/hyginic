const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

dotenv.config({ path: path.resolve(__dirname, "./config.env") });

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const mongoose = require("mongoose");
const type1 = require("./gql/typeDefs/type1.js");
const reso1 = require("./gql/resolvers/reso1.js");

const port = process.env.PORT || 6000;

mongoose
  .connect(process.env.DB_URL)
  .then(console.log("DB connected"))
  .catch((error) => console.log(error.message));

const createServer = async () => {
  const app = express();
  app.use(cors());

  const apolloServer = new ApolloServer({
    typeDefs: [type1],
    resolvers: [reso1],
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],

    context: ({ req }) => {
      const { authorization } = req.headers;
      if (authorization) {
        const { id } = jwt.verify(authorization, process.env.JWT_SECRET);
        return { id };
      }
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  app.listen(port, () => {
    console.log(`Server listening on ${apolloServer.graphqlPath}`);
  });
};

createServer();
