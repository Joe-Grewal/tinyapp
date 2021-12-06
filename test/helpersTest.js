const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.strictEqual(user.id, expectedOutput);
  });
  it('should return undefined for a non-existent email', () => {
    const user = getUserByEmail("abc@gmail.com", testUsers)
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });
});

describe('generateRandomString', function() {
  it('should return a string', function() {
    const input = typeof(generateRandomString());
    const expectedOutput = "string";
    assert.strictEqual(input, expectedOutput);
  });
  it('should return a 6 character string', function() {
    const input = generateRandomString().length;
    const expectedOutput = 6;
    assert.strictEqual(input, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should return all urls associated with user', function() {
    const user = urlsForUser("userRandomID", urlDatabase);
    const expectedOutput = urlDatabase;
    assert.deepEqual(user, expectedOutput);
  });
});