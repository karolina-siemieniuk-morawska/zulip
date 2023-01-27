import { Zulip } from "zulip-js";
import { StreamData, User } from "./types";

export const pickRandomUser = (users: number[]) => {
  return users[Math.floor(Math.random() * users.length)];
};

const sendMessage = (zulip: any, streamName: string, content: string) =>
  zulip.callEndpoint("/messages", "POST", {
    to: streamName,
    type: "stream",
    subject: "Retrospective",
    content,
  });

const getUsersFromStream = async (zulip: Zulip, streamId: number) => {
  try {
    const users: StreamData = await zulip.callEndpoint(
      `/streams/${streamId}/members`,
      "GET"
    );

    if (users.subscribers.length > 0) {
      return users.subscribers;
    }

    throw new Error("No users found");
  } catch (error) {
    throw new Error(
      `Failed to fetch users from stream. Details: ${error.message}`
    );
  }
};

const getUserData = async (zulip: Zulip, userId: number) => {
  try {
    return await zulip
      .callEndpoint(`/users/${userId}`, "GET")
      .then((data) => data.user);
  } catch (error) {
    throw new Error("Unable to retreive user data");
  }
};

const retromasterBot = async (zulip: Zulip, streamId: number, streamName: string) => {
  try {
    const randomUser: User = await getUserData(
      zulip,
      pickRandomUser(await getUsersFromStream(zulip, streamId))
    );

    await sendMessage(
      zulip,
      streamName,
      `Our next retro master is @**${randomUser.full_name}** 🎉. The expectations are super high!`
    );
  } catch (error) {
    sendMessage(
      zulip,
      streamName,
      `Oh no, something went wrong :( Error: ${error.message}`
    );
  }
};

export default retromasterBot;
