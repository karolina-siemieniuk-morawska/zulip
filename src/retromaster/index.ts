import zulipInit from "zulip-js";

import retromasterBot from "./retromasterBot";

const config = {
  realm: process.env.ZULIP_REALM,
  username: process.env.ZULIP_USERNAME,
  apiKey: process.env.ZULIP_API_KEY,
};

(async () => {
  const zulip = await zulipInit(config);
  const streamId = process.env.STREAM_ID;
  const streamName = process.env.STREAM_NAME;

  await retromasterBot(zulip, streamId!, streamName!);
})();
