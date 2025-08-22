import reducer, { setUserInfo, userInfo } from "../../user/userSlice";

describe("userSlice", () => {
  const initialState = { username: "", userId: "", role: "" };

  it("should return the initial state when passed an empty action", () => {
    expect(reducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should set user info when username is not an email", () => {
    const payload = { username: "john_doe", userId: "123", role: "admin" };

    const newState = reducer(initialState, setUserInfo(payload));

    expect(newState).toEqual(payload);
  });

  it("should trim email username to the part before '@'", () => {
    const payload = { username: "jane@example.com", userId: "456", role: "user" };

    const newState = reducer(initialState, setUserInfo(payload));

    // Username should be "jane", not the full email
    expect(newState.username).toBe("jane");
    expect(newState.userId).toBe("456");
    expect(newState.role).toBe("user");
  });

  it("should overwrite only provided fields", () => {
    const stateWithUser = { username: "alice", userId: "789", role: "user" };
    const payload = { role: "admin" };

    const newState = reducer(stateWithUser, setUserInfo(payload));

    expect(newState).toEqual({
      username: "alice", // unchanged
      userId: "789", // unchanged
      role: "admin", // updated
    });
  });

  it("userInfo selector should return the userInfo state slice", () => {
    const rootState = {
      userInfo: { username: "bob", userId: "101", role: "user" },
    };

    expect(userInfo(rootState)).toEqual(rootState.userInfo);
  });
});
