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
  justify-content: left;
  gap: 0.5rem 2rem;
  margin: 2rem 0;
  width: fit-content;

  input,
  button {
    border-radius: 5px;
    border: none;
  }

  input {
    padding: 1rem;
    width: clamp(200px, 40vw, 400px);
    border: 1px solid rgba(0, 0, 0, 0.3);
  }

  input[type='submit'] {
    padding: 1rem 2rem;
    background-color: #475569;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    width: 200px;
  }
`;

export default function TwitterForm({ updateData, setStatusMessage }) {
  const { values, updateValue } = useForm({
    twitterHandle: '',
  });

  const { twitterHandle } = values;

  async function handleSubmit(e) {
    e.preventDefault();

    setStatusMessage('Looking up Twitter username...');

    try {
      setStatusMessage('Looking up Twitter username in Fauna.');
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
        setStatusMessage(
          'Fauna data outdated, fetching new data from Twitter.'
        );
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
        setStatusMessage('Fetching updated data from Fauna.');
        const updatedData = await getUsernameFlow({
          typeOfRequest: 'fetchUser',
          data: {
            username: twitterHandle,
          },
        });

        // 2c. Set the updatedData to be displayed on the page.
        updateData(updatedData);
        setStatusMessage('Looking up complete.');
        return;
      }

      // 1b. If the data doesn't need to be updated then return the initial data.
      updateData(initialData);
      setStatusMessage('Looking up complete');
    } catch (err) {
      // 3a. If the user doesn't exist on Fauna, it will error and we will catch it here and create a new user by fetching the data from Twitter and updating Fauna
      setStatusMessage(
        'Username not in Fauna, fetching data from Twitter and adding to Fauna.'
      );
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
      setStatusMessage('Looking up complete.');
    }
  }

  return (
    <FormContainer onSubmit={(e) => handleSubmit(e)} action="submit">
      <input
        aria-label="Please enter a twitter username"
        placeholder="@mrconermurphy"
        name="twitterHandle"
        value={twitterHandle.trim()}
        onChange={updateValue}
        pattern="@(?=.*[a-z0-9_])(?!.*[A-Z])\w+.*"
        type="text"
        title="Please enter a Twitter username starting with @ and lowercase. E.g. @mrconermurphy"
        required
      />
      <input type="submit" value="Lookup username" />
    </FormContainer>
  );
}
