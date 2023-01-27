import zulipInit, { Zulip } from "zulip-js";
import { when } from "jest-when";

import retromasterBot, { pickRandomUser } from "../retromasterBot";

describe("Retromaster Bot", () => {
  let zulip: Zulip;

  beforeEach(async () => {
    zulip = await zulipInit({ zuliprc: ".zuliprc" });
  });

  const streamId = 2137;
  const subscribers = [12345];
  const userFullName = "Ivan";

  it("sends message with a randomly picked user to given stream", async () => {
    const callEndpointSpy = jest.spyOn(zulip, "callEndpoint").mockImplementation(() => Promise.resolve());

    when(callEndpointSpy)
      .calledWith(`/streams/${streamId}/members`, "GET")
      .mockImplementation(async () => ({
        result: "success",
        msg: "",
        subscribers,
      }));
    when(callEndpointSpy)
      .calledWith(`/users/${subscribers[0]}`, "GET")
      .mockImplementation(async () => ({
        result: "success",
        msg: "",
        user: {
          email: "string",
          user_id: subscribers[0],
          full_name: userFullName,
          bot_type: null,
          is_bot: false,
          is_admin: false,
          is_active: true,
          avatar_url: "string",
        },
      }));
    when(callEndpointSpy)
      .calledWith("/messages", "POST")
      .mockImplementation(async () => ({
        result: "success",
        msg: "",
      }));

    await retromasterBot(zulip, streamId, 'test');

    expect(callEndpointSpy).toHaveBeenLastCalledWith("/messages", "POST", {
      to: "test",
      type: "stream",
      subject: "Retrospective",
      content: `Our next retro master is @**${userFullName}** 🎉. The expectations are super high!`,
    });
  });

  it("sends error message to given stream when failed to fetch users", async () => {
    const callEndpointSpy = jest.spyOn(zulip, "callEndpoint").mockImplementation(() => Promise.resolve());

    when(callEndpointSpy)
      .calledWith(`/streams/${streamId}/members`, "GET")
      .mockRejectedValue({
        result: "error",
        msg: "",
        subscribers,
      });
    when(callEndpointSpy)
      .calledWith(`/users/${subscribers[0]}`, "GET")
      .mockRejectedValue({
        result: "error",
        msg: "",
      });
    when(callEndpointSpy).calledWith("/messages", "POST").mockResolvedValue({
      result: "success",
      msg: "",
    });

    await retromasterBot(zulip, streamId, 'test');

    expect(callEndpointSpy).toHaveBeenLastCalledWith("/messages", "POST", {
      to: "test",
      type: "stream",
      subject: "Retrospective",
      content:
        "Oh no, something went wrong :( Error: Failed to fetch users from stream. Details: undefined",
    });
  });

  it("sends error message to given stream when user not found", async () => {
    const callEndpointSpy = jest.spyOn(zulip, "callEndpoint").mockImplementation(() => Promise.resolve());

    when(callEndpointSpy)
      .calledWith(`/streams/${streamId}/members`, "GET")
      .mockResolvedValue({
        result: "success",
        msg: "",
        subscribers,
      });
    when(callEndpointSpy)
      .calledWith(`/users/${subscribers[0]}`, "GET")
      .mockRejectedValue({
        result: "error",
        msg: "",
      });
    when(callEndpointSpy).calledWith("/messages", "POST").mockResolvedValue({
      result: "success",
      msg: "",
    });

    await retromasterBot(zulip, streamId, 'test');

    expect(callEndpointSpy).toHaveBeenLastCalledWith("/messages", "POST", {
      to: "test",
      type: "stream",
      subject: "Retrospective",
      content: `Oh no, something went wrong :( Error: Unable to retreive user data`,
    });
  });
});

describe("pickRandomUser()", () => {
  it("picks random user from array", () => {
    const users = [12345, 54321, 2137];

    expect(users).toContain(pickRandomUser(users));
  });
});
