import {
  getUsername,
  createUsername,
  updateUsername,
} from '../../../lib/fauna';

export default async function handler({ body, method }, res) {
  const handlers = {
    POST: async () => {
      // 1. Destructure parameters from the request from usernameFlow.js
      const {
        typeOfRequest,
        data: { username, engagementList, id },
      } = body;

      // 2a. Fetch the username from Fauna
      if (typeOfRequest === 'fetchUser') {
        const data = await getUsername(username);
        res.json(data);
      }

      // 2b. Create a new username on Fauna
      if (typeOfRequest === 'createUser') {
        const data = await createUsername({
          username,
          engagementList,
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
        });
        res.json(data);
      }

      // 2c. Update the user on Fauna
      if (typeOfRequest === 'updateUser') {
        const data = await updateUsername({
          data: {
            username,
            engagementList,
            lastUpdatedAt: new Date(),
          },
          id,
        });
        res.json(data);
      }
    },
  };

  if (!handlers[method]) {
    return res.status(405).end();
  }

  await handlers[method]();
}
