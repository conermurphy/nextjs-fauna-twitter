import { GraphQLClient, gql } from 'graphql-request';

const CLIENT_SECRET =
  process.env.FAUNA_ADMIN_KEY || process.env.FAUNA_CLIENT_SECRET;
const FAUNA_GRAPHQL_BASE_URL = 'https://graphql.fauna.com/graphql';

const graphQLClient = new GraphQLClient(FAUNA_GRAPHQL_BASE_URL, {
  headers: {
    authorization: `Bearer ${CLIENT_SECRET}`,
  },
});

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

  return graphQLClient
    .request(query, { data: usernameToLookup })
    .then(({ getUsername: data }) => data);
};

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

  return graphQLClient
    .request(mutation, { data })
    .then(({ createUsername: createdUserData }) => createdUserData);
};

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

  return graphQLClient
    .request(mutation, { data, id })
    .then(({ updateUsername: updatedUserData }) => updatedUserData);
};
