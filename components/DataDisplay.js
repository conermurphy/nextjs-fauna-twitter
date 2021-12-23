import React from 'react';
import styled from 'styled-components';
import formatDate from 'date-fns/format';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: clamp(100px, 80vw, 600px);

  p,
  li {
    font-size: 18px;
  }

  ol {
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
      <h2>Viewing data for {data.username}</h2>
      <p>
        {`Data created on ${formatDate(
          new Date(data.createdAt),
          "d MMM yyyy 'at' h:mm bb"
        )}
        `}
      </p>
      <p>
        {`Data last updated on ${formatDate(
          new Date(data.lastUpdatedAt),
          "d MMM yyyy 'at' h:mm bb"
        )}
        `}
      </p>
      <p>Most Engagement</p>
      <ol>
        {data.engagementList.map((person) => (
          <li key={person}>{person}</li>
        ))}
      </ol>
      <p>Least Engagement</p>
    </Container>
  ) : null;
}
