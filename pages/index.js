import Head from 'next/head';
import { useState } from 'react';
import styled from 'styled-components';
import DataDisplay from '../components/DataDisplay';
import TwitterForm from '../components/TwitterForm';
import { getUsername } from '../lib/fauna';

const Container = styled.main`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  text-align: center;
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;

  button,
  input {
    font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  .pageHeaderContainer {
    background-color: #cbd5e1;
    border-radius: 10px;
    padding: 2rem 5rem;

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

function Home({ initialData }) {
  const [dataToDisplay, setDataToDisplay] = useState(initialData);
  return (
    <Container>
      <AppHead />
      <div className="pageHeaderContainer">
        <h1>Twitter Account Engagement Lookup</h1>
        <p>
          Put in a Twitter account handle (e.g. @MrConerMurphy) into the form
          below to see who they've engaged with the most recently.
        </p>
        <TwitterForm updateData={setDataToDisplay} />
      </div>
      <DataDisplay data={dataToDisplay} />
    </Container>
  );
}
export default Home;

export const getStaticProps = async () => ({
  props: {
    initialData: await getUsername('@MrConerMurphy'),
  },
  revalidate: 1,
});
