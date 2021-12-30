const fetchRequest = async (payload, path) => {
  const response = await fetch(path, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export default fetchRequest;
