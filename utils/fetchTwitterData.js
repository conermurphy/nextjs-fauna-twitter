const bearerToken = process.env.TWITTER_BEARER_TOKEN;
const authorsEndpoint = 'https://api.twitter.com/2/users/by?usernames=';

async function fetchData(endpoint, userAgent) {
  const { data, includes } = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
      authorization: `Bearer ${bearerToken}`,
    },
  }).then((res) => res.json());

  return { data, includes };
}

// eslint-disable-next-line
const regexp = /\@(?=.*[a-z0-9_])(?!.*[A-Z])\w+/g;

export default async function fetchTwitterData({ username }) {
  // 0. Remove the @ symbol from the username passed in
  const usernameToLookup = username.replace('@', '');

  // 1. Fetch the userID of the username searched
  const authorEndpointToFetch = `${authorsEndpoint}${usernameToLookup}`;

  // 2. Get the twitter userID of the username given
  const { data: userData } = await fetchData(
    authorEndpointToFetch,
    'v2UserLookupJS'
  );
  const [{ id }] = userData;

  // 3. Construct the Twitter API endpoint required for looking up tweets of a user
  const tweetsEndpoint = `https://api.twitter.com/2/users/${id}/tweets?max_results=100`;

  // 3a. Fetch the data and wait for it.
  const { data } = await fetchData(tweetsEndpoint, 'v2UserTweetsJS');

  // 4. Transform the data returned from Twitter to count the mentioned usernames in all the tweets and sort from highest to lowest.
  const mentionedUsers = data
    .reduce((acc, cur) => {
      const { text } = cur;

      // 4a. Using the regex on line 17, find all the usernames in the tweets anc combine them into one array.
      const usersInTweet = [...text.toLowerCase().matchAll(regexp)].flat();

      usersInTweet.map((user) => {
        // 4b. If the username is the one we looked up, return and discard it.
        if (user === username) return;

        // 4c. See if the user has already been counted before and is present.
        const userInArray = acc.find((item) => item.username === user);

        // 4d. If the user has been counted before, increment the count by 1, if not add it with a count of 1
        if (userInArray) {
          return (userInArray.count += 1);
        }
        return acc.push({ username: user, count: 1 });
      });

      return acc;
    }, [])
    // 5. Sort the array from highest to lowest counts
    .sort((a, b) => b.count - a.count)
    // 6. Map over the array of objects, to just return the usernames
    .map((item) => item.username);

  // 7. Return the data
  return mentionedUsers;
}
