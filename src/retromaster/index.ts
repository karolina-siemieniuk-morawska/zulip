import zulipInit from "zulip-js";

import retromasterBot from "./retromasterBot";

(async () => {
  const zulip = await zulipInit({ zuliprc: '.zuliprc' });
  const streamId = 311658;
  const streamName = 'tools & services';

  await retromasterBot(zulip, streamId, streamName);
})();

