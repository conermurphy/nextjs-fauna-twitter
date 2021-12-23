import { differenceInCalendarDays } from 'date-fns';
import React from 'react';
import styled from 'styled-components';
import fetchRequest from '../utils/fetchRequest';
import { server } from '../config';
import getUsernameFlow from '../utils/usernameFlow';
import useForm from '../utils/useForm';

const TWITTER_PATH = `${server}/api/twitter`;

const FormContainer = styled.form`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;

  input,
  button {
    border-radius: 5px;
    border: none;
  }

  input {
    padding: 1rem;
  }

  button {
    padding: 1rem 2rem;
    background-color: #475569;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
  }
`;

export default function TwitterForm({ updateData }) {
  const { values, updateValue } = useForm({
    twitterHandle: '',
  });

  const { twitterHandle } = values;

  async function onSubmit(e) {
    e.preventDefault();

    try {
      // 1a. Try fetch data from Fauna
      const initialData = await getUsernameFlow({
        typeOfRequest: 'fetchUser',
        data: {
          username: twitterHandle,
        },
      });

      // 2. Check the lastUpdatedAt property of the data from Fauna, if more than 1 one day behind today, refetch the data from Twitter and update Fauna
      if (
        differenceInCalendarDays(
          new Date(),
          new Date(initialData.lastUpdatedAt)
        ) > 1
      ) {
        // 2a. Update the data on Fauna
        await getUsernameFlow({
          typeOfRequest: 'updateUser',
          data: {
            id: initialData._id,
            username: twitterHandle,
            engagementList: await fetchRequest(twitterHandle, TWITTER_PATH),
          },
        });

        // 2b. Refetch the new username data on Fauna
        const updatedData = await getUsernameFlow({
          typeOfRequest: 'fetchUser',
          data: {
            username: twitterHandle,
          },
        });

        // 2c. Set the updatedData to be displayed on the page.
        updateData(updatedData);
        return;
      }

      // 1b. If the data doesn't need to be updated then return the initial data.
      updateData(initialData);
    } catch (err) {
      // 3a. If the user doesn't exist on Fauna, it will error and we will catch it here and create a new user by fetching the data from Twitter and updating Fauna
      await getUsernameFlow({
        typeOfRequest: 'createUser',
        data: {
          username: twitterHandle,
          engagementList: await fetchRequest(twitterHandle, TWITTER_PATH),
        },
      });

      // 3b. Fetching the newly added data from Fauna
      const newData = await getUsernameFlow({
        typeOfRequest: 'fetchUser',
        data: {
          username: twitterHandle,
        },
      });

      // 3. Return the new data from Fauna
      updateData(newData);
    }
  }

  return (
    <FormContainer onSubmit={(e) => onSubmit(e)}>
      <input
        required
        aria-label="Please enter a twitter handle"
        placeholder="@MrConerMurphy"
        name="twitterHandle"
        value={twitterHandle}
        onChange={updateValue}
      />
      <button type="submit">Search</button>
    </FormContainer>
  );
}
