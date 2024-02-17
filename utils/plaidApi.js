const fetchFromApi = (endpoint, params) => {
  const url = `${process.env.EXPO_PUBLIC_SERVER_BASE}/api/${endpoint}`;
  return fetch(url, params).then((response) => {
    return response.json();
  });
};

const postToApi = (url, body = {}) => {
  return fetchFromApi(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export const createLinkToken = () => {
  return postToApi('create_link_token');
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

export const getUserById = (id) => {
  return fetchFromApi(`user/${id}`);
};

export const getCategories = () => {
  return fetchFromApi('categories');
};

export const createTransactionForUser = (transaction, id) => {
  return postToApi('user/transaction/create', {
    transaction,
    userId: id,
  });
};

export const signUpUser = (email, password, username) => {
  return postToApi('user/signup', {
    email,
    password,
    username,
  });
};

export const confirmUser = (username, code) => {
  return postToApi('user/confirm', {
    code,
    username,
  });
};

export const createUser = (username, id) => {
  return postToApi('user/create', {
    username,
    id,
  });
};

export const verifyUserSession = (token) => {
  return postToApi('user/verify', {
    token,
  });
};

export const authUser = (password, username) => {
  return postToApi('user/authenticate', {
    password,
    username,
  });
};

export const exchangeToken = (publicToken, userId) => {
  return postToApi('exchange', {
    publicToken,
    userId,
  });
};

export const updateUserBudget = (data) => {
  return postToApi('budget', data);
};

export const updateUser = (data) => {
  return postToApi('user', data);
};
