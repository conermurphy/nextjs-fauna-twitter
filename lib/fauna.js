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

export const createUsername = (data) => {
  const mutation = gql`
    mutation CreateUsername($data: UsernameInput!) {
      createUsername(data: $data) {
        username
        engagementList
        createdAt
        lastUpdatedAt
      }
    }
  `;

  return graphQLClient.request(mutation, { data });
};

export const updateUsername = ({ data, id }) => {
  const mutation = gql`
    mutation UpdateUsername($data: UsernameInput!, $id: ID!) {
      updateUsername(data: $data, id: $id) {
        _id
        username
        engagementList
        lastUpdatedAt
      }
    }
  `;

  return graphQLClient.request(mutation, { data, id });
};
