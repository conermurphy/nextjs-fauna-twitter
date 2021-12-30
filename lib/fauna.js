// Import required depenencies from graphql-request
import { GraphQLClient, gql } from 'graphql-request';

// get client secret from env file for authenticating with Fauna
const CLIENT_SECRET =
  process.env.FAUNA_ADMIN_KEY || process.env.FAUNA_CLIENT_SECRET;

// Fauna GraphQL API endpoint
const FAUNA_GRAPHQL_BASE_URL = 'https://graphql.fauna.com/graphql';

// Creating our graphQL client for performing authenticated queries with Fauna
const graphQLClient = new GraphQLClient(FAUNA_GRAPHQL_BASE_URL, {
  headers: {
    authorization: `Bearer ${CLIENT_SECRET}`,
  },
});

// Mutation to get data from Fauna based on given username
export const getUsername = async (usernameToLookup) => {
  const query = gql`
    query GetUsername($data: String) {
      getUsername(username: $data) {
        _id
        username
        engagementList
        createdAt
        lastUpdatedAt
      }
    }
  `;

  const { getUsername: data } = await graphQLClient.request(query, {
    data: usernameToLookup,
  });
  return data;
};

// Mutation to create new data on Fauna
export const createUsername = async (data) => {
  const mutation = gql`
    mutation CreateUsername($data: UsernameInput!) {
      createUsername(data: $data) {
        _id
        username
        engagementList
        createdAt
        lastUpdatedAt
      }
    }
  `;

  const { createUsername: createdUserData } = await graphQLClient.request(
    mutation,
    { data }
  );
  return createdUserData;
};

// Query to update existing data on Fauna
export const updateUsername = async ({ data, id }) => {
  const mutation = gql`
    mutation UpdateUsername($data: UsernameInput!, $id: ID!) {
      updateUsername(data: $data, id: $id) {
        _id
        username
        engagementList
        lastUpdatedAt
        createdAt
      }
    }
  `;

  const { updateUsername: updatedUserData } = await graphQLClient.request(
    mutation,
    { data, id }
  );
  return updatedUserData;
};
