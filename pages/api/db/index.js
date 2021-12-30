import { differenceInCalendarDays } from 'date-fns';
import fetchTwitterData from '../../../utils/fetchTwitterData';
import {
  getUsername,
  createUsername,
  updateUsername,
} from '../../../lib/fauna';

export default async function handler({ body, method }, res) {
  const handlers = {
    POST: async () => {
      // 1. Destructure parameters from the request from request
      const {
        data: { username },
      } = body;

      // 2a. Fetch the username from Fauna
      const initialData = await getUsername(username);

      // 2b. If initialData exists then check if it's out of date.
      if (initialData) {
        // 2b. Check if lastUpdated date is more/less than 1 day
        if (
          differenceInCalendarDays(
            new Date(),
            new Date(initialData.lastUpdatedAt)
          ) > 1
        ) {
          // 2c. If more than 1 day, update data.
          const updatedData = await updateUsername({
            data: {
              username,
              engagementList: await fetchTwitterData({ username }),
              lastUpdatedAt: new Date(),
            },
            id: initialData._id,
          });
          res.json(updatedData);
          return;
        }
        // 2d. Return initialData if newer than 1 day.

        res.json(initialData);
        return;
      }

      // 3a. If data doesn't exist, create new data.
      const newData = await createUsername({
        username,
        engagementList: await fetchTwitterData({ username }),
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });
      res.json(newData);
    },
  };

  // If the request isn't a POST request then return and give a 405 error.
  if (!handlers[method]) {
    return res.status(405).end();
  }

  // Await any functions defined in the handler if the request method is a property within it.
  await handlers[method]();
}
