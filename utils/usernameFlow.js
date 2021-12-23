import { server } from '../config';
import fetchRequest from './fetchRequest';

const USERNAME_PATH = `${server}/api/db`;

const usernameFlow = async ({ data, typeOfRequest }) => {
  try {
    const args = { data, typeOfRequest };
    const res = await fetchRequest(args, USERNAME_PATH);
    return res;
  } catch (e) {
    throw new Error(e);
  }
};

export default usernameFlow;
