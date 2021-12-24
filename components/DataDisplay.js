import React from 'react';
import styled from 'styled-components';
import formatDate from 'date-fns/format';

const Container = styled.div`
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

export default function DataDisplay({ data }) {
  return data ? (
    <Container>
      <h2>Engagement data for {data.username}</h2>
      <p>
        <span>{'Data created on '}</span>
        <b>{`${formatDate(new Date(data.createdAt), 'd MMM yyyy')}`}</b>
        <span>{' | Data last updated on '}</span>
        <b>{`${formatDate(new Date(data.lastUpdatedAt), 'd MMM yyyy')}`}</b>
      </p>
      <p className="engagementLabel">Most Engagement</p>
      <ol>
        {data.engagementList.map((person) => (
          <li key={person}>{person}</li>
        ))}
      </ol>
      <p className="engagementLabel">Least Engagement</p>
    </Container>
  ) : null;
}
