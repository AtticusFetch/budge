const fetchFromApi = (endpoint, params) => {
  const url = `${process.env.EXPO_PUBLIC_SERVER_BASE}/api/${endpoint}`;
  return fetch(url, params).then((response) => response.json());
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

export const updateUser = (data) => {
  return postToApi('user', data);
};

export const createLinkToken = (userId) => {
  return postToApi('create_link_token', { userId });
};

export const getPlaidTransactions = (userId) => {
  return fetchFromApi(`plaid/transactions/${userId}`);
};

export const getMonthlyTransactions = (userId, date) => {
  return fetchFromApi(`plaid/transactions/filter/${userId}/${date}`);
};

export const getPlaidTransactionUpdates = (userId) => {
  return fetchFromApi(`plaid/transactions/${userId}/sync`);
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

export const signOutUser = (username) => {
  return postToApi('user/signOut', {
    username,
  });
};

export const createCategory = (category, userId) => {
  return postToApi('user/category/create', {
    category,
    userId,
  });
};

export const changeCategory = (data) => {
  return postToApi('user/category/change', data);
};

export const acceptRequest = (requestId, userId) => {
  return postToApi('user/friend/accept', {
    requestId,
    userId,
  });
};

export const removeFriend = (friendId, userId) => {
  return postToApi('user/friend/remove', {
    friendId,
    userId,
  });
};

export const declineRequest = (requestId, userId) => {
  return postToApi('user/friend/decline', {
    requestId,
    userId,
  });
};

export const addFriend = (friendUsername, user) => {
  return postToApi('user/friend', {
    friendUsername,
    userId: user.id,
    username: user.username,
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

/**
 * ******************************
 * ******** Transactions ********
 * ******************************
 */

export const createTransactionForUser = (transaction, id) =>
  postToApi('user/transaction/create', {
    transaction,
    userId: id,
  });
export const updateTransactionForUser = (transaction, id) =>
  postToApi('user/transaction/update', {
    transaction,
    userId: id,
  });
export const transferPlaidTransaction = (transaction, id) =>
  postToApi('user/transaction/transfer', {
    transaction,
    userId: id,
  });
export const deleteTransaction = (transactionId, userId) =>
  postToApi('user/transaction/delete', {
    transactionId,
    userId,
  });

/**
 * ************************
 * ******** Budget ********
 * ************************
 */
export const createBudgetTransaction = (data) =>
  postToApi('budget/transaction/create', data);
export const updateBudgetTransaction = (data) =>
  postToApi('budget/transaction/update', data);
export const deleteBudgetTransaction = (data) =>
  postToApi('budget/transaction/delete', data);

export const createCategoryBudget = (data) =>
  postToApi('budget/category/create', data);
export const updateCategoryBudget = (data) =>
  postToApi('budget/category/update', data);
export const deleteCategoryBudget = (data) =>
  postToApi('budget/category/delete', data);

export const createBudgetLink = (data) => {
  return postToApi('budget/link/create', data);
};
