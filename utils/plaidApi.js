const fetchFromApi = (endpoint, params) => {
  const url = `${process.env.EXPO_PUBLIC_SERVER_BASE}/api/${endpoint}`;
  return fetch(url, params).then((response) => {
    return response.json();
  });
};

export const createLinkToken = () => {
  return fetchFromApi('create_link_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getTransactions = (userId) => {
  return fetchFromApi(`transactions/${userId}`);
};

export const getMonthlyTransactions = (userId, date) => {
  return fetchFromApi(`transactions/filter/${userId}/${date}`);
};

export const getTransactionUpdates = (userId) => {
  return fetchFromApi(`transactions/${userId}/sync`);
};

export const getAccaounts = () => {
  return fetchFromApi('accounts');
};

export const getUsers = () => {
  return fetchFromApi('users');
};

export const exchangeToken = (publicToken, userId) => {
  return fetchFromApi('exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicToken,
      userId,
    }),
  });
};

export const updateUserBudget = (data) => {
  return fetchFromApi('budget', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const updateUser = (data) => {
  return fetchFromApi('user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
