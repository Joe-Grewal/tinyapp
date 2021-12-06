const getUserByEmail = (email, database) => {
  for (const userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
};

const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = characters.length;
  for (let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * length));
 }
 return result;
};

const urlsForUser = (id, database) => {
  const userUrls = {};
  for (const key in database) {
    if (database[key].userID === id) {
      userUrls[key] = database[key];
    }
  } return userUrls;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser };