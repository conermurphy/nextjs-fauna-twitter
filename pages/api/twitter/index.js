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

export default async function handler({ body, method }, res) {
  const handlers = {
    POST: async () => {
      // 0. Remove the @ symbol from the username passed in
      const usernameToLookup = body.replace('@', '');

      // 1. Fetch the userID of the username searched
      const authorEndpointToFetch = `${authorsEndpoint}${usernameToLookup}`;

      // 2. Get the twitter userID of the username given
      const { data: userData } = await fetchData(
        authorEndpointToFetch,
        'v2UserLookupJS'
      );
      const [{ id }] = userData;

      const tweetsEndpoint = `https://api.twitter.com/2/users/${id}/tweets?max_results=100`;

      const { data } = await fetchData(tweetsEndpoint, 'v2UserTweetsJS');

      // eslint-disable-next-line
      const regexp = /\@(?=.*[a-z0-9_])(?!.*[A-Z])\w+/g;

      const mentionedUsers = data
        .reduce((acc, cur) => {
          const { text } = cur;
          const usersInTweet = [...text.toLowerCase().matchAll(regexp)].flat();

          usersInTweet.map((user) => {
            if (user === body) return;

            const userInArray = acc.find((item) => item.username === user);

            if (userInArray) {
              return (userInArray.count += 1);
            }
            return acc.push({ username: user, count: 1 });
          });

          return acc;
        }, [])
        .sort((a, b) => b.count - a.count)
        .map((item) => item.username);

      res.json(mentionedUsers);
    },
  };

  if (!handlers[method]) {
    return res.status(405).end();
  }

  await handlers[method]();
}
