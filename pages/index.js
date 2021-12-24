import Head from 'next/head';
import { useState } from 'react';
import styled from 'styled-components';
import DataDisplay from '../components/DataDisplay';
import TwitterForm from '../components/TwitterForm';

const Container = styled.main`
  text-align: left;
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;

  button,
  input {
    font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  .pageHeaderContainer {
    background-color: #cbd5e1;
    border-radius: 20px;
    padding: 2rem 5rem;

    h1 {
      width: fit-content;
    }

    p {
      max-width: 600px;
    }
  }
`;

const AppHead = () => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="icon" type="image/x-icon" href="/static/favicon.png" />
  </Head>
);

function Home() {
  const [dataToDisplay, setDataToDisplay] = useState();
  const [statusMessage, setStatusMessage] = useState(
    'Please enter a Twitter username to lookup.'
  );
  return (
    <Container>
      <AppHead />
      <div className="pageHeaderContainer">
        <h1>Twitter Account Engagement Lookup</h1>
        <p>
          Put in a Twitter account handle (e.g. @mrconermurphy) into the form
          below to see who they've engaged with the most recently.
        </p>
        <TwitterForm
          updateData={setDataToDisplay}
          setStatusMessage={setStatusMessage}
        />
        <p>
          <b>Status Message:</b> {statusMessage}
        </p>
      </div>
      <DataDisplay data={dataToDisplay} />
    </Container>
  );
}
export default Home;
