const { gql } = require('apollo-server-express');
const fetch = require('node-fetch');

const typeDefs = gql`
  type Lesson {
    id: Int
    description: String
    docUrl: String
    githubUrl: String
    videoUrl: String
    order: Int
    title: String
    createdAt: String
    updatedAt: String
    chatUrl: String
    challenges: [Challenge]
  }

  type Challenge {
    id: Int
    description: String
    title: String
    order: Int
    createdAt: String
    updatedAt: String
    lessonId: Int
  }

  type BasicPokemon {
    name: String!
  }

  type Pokemon {
    name: String!
    image: String!
  }

  type Query {
    lessons: [Lesson]
    search(str: String!): [BasicPokemon]
    getPokemon(str: String!): Pokemon
  }
`;

const resolvers = {
  Query: {
    lessons: () =>
      fetch('https://www.c0d3.com/api/lessons').then((r) => r.json()),
  },
};

module.exports = { typeDefs, resolvers };
