import Head from 'next/head';
import { useState } from 'react';
import styled from 'styled-components';
import formatDate from 'date-fns/format';
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

const DataDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 5rem;

  p,
  li {
    font-size: 18px;
  }

  .engagementLabel {
    font-weight: bold;
  }

  ol {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    margin: 0;
    padding: 0;

    li {
      text-align: left;
      margin: 0.5rem 0;
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
  // State definitions
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
      {/* Section for displaying data from fauna, if present */}
      {dataToDisplay ? (
        <DataDisplayContainer>
          <h2>Engagement data for {dataToDisplay.username}</h2>
          <p>
            <span>{'Data created on '}</span>
            <b>{`${formatDate(
              new Date(dataToDisplay.createdAt),
              'd MMM yyyy'
            )}`}</b>
            <span>{' | Data last updated on '}</span>
            <b>{`${formatDate(
              new Date(dataToDisplay.lastUpdatedAt),
              'd MMM yyyy'
            )}`}</b>
          </p>
          <p className="engagementLabel">Most Engagement</p>
          <ol>
            {dataToDisplay.engagementList.map((person) => (
              <li key={person}>{person}</li>
            ))}
          </ol>
          <p className="engagementLabel">Least Engagement</p>
        </DataDisplayContainer>
      ) : null}
    </Container>
  );
}
export default Home;
