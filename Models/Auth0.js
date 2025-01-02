// auth0Service.js
const request = require("request");

function getAuth0AccessToken() {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://dev-btad0jdv6jenv1st.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: 'iASvQAUXjsboZPgHiCw9Esn8FVBTDTSO',
        client_secret: 'U3UNGYiCg89eVs1oBbZlVQ-g9ByehJBYOxPIqN8pzyXJXdXg6gGkgNSDCa2KesiL',
        audience: 'https://dev-btad0jdv6jenv1st.us.auth0.com/api/v2/',
        grant_type: 'client_credentials',
      }),
    };

    request(options, (error, response, body) => {
      if (error) return reject(error);

      if (response.statusCode === 200) {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody.access_token);
      } else {
        reject(new Error(`Failed to retrieve access token: ${body}`));
      }
    });
  });
}

module.exports = { getAuth0AccessToken };
