const zulipInit = require('zulip-js');
const path = require('path');
const zuliprc = path.resolve('zuliprc');

function pickRandomUser(users) {
  return users[Math.floor(Math.random() * users.length)];
}

(async () => {
  const zulip = await zulipInit({ zuliprc });
  const streamId = 1234;
  let users;

  try {
    users = await zulip.callEndpoint(`/streams/${streamId}/members`, 'GET');

    if (users.length > 0) {
      const randomUser = pickRandomUser(users);

      const params = {
        to: 'tools&services',
        type: 'stream',
        subject: 'Retrospective',
        content: `Our next retro master is ${randomUser} 🎉. The expectations are super high!`,
      };

      await zulip.callEndpoint('/messages', 'POST', params);
    }
  } catch (e) {
    return console.log('Failed to fetch users: ' + e);
  }
})();
