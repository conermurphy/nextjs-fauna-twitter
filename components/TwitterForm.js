import React from 'react';
import styled from 'styled-components';
import { server } from '../config';
import useForm from '../utils/useForm';

const DB_PATH = `${server}/api/db`;

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

    const dbResponse = await fetch(`${DB_PATH}?username=${twitterHandle}`);
    const data = await dbResponse.json();

    updateData(data);
    setStatusMessage('Look up complete.');
  }

  return (
    <FormContainer onSubmit={(e) => handleSubmit(e)} action="submit">
      <input
        aria-label="Please enter a twitter username"
        placeholder="@mrconermurphy"
        name="twitterHandle"
        value={twitterHandle.trim()}
        onChange={updateValue}
        // Regex to ensure the input matches: starting with @, contains only lowercase letters, numbers and _
        pattern="@(?=.*[a-z0-9_])(?!.*[A-Z])\w+.*"
        type="text"
        title="Please enter a Twitter username starting with @ and lowercase. E.g. @mrconermurphy"
        required
      />
      <input type="submit" value="Lookup username" />
    </FormContainer>
  );
}
