import reducer, { setUserJustVerified, resetUserJustVerified, selectUserJustVerified } from "../verificationSlice";

describe("verificationSlice", () => {
  const initialState = {
    userJustVerified: false,
  };

  it("should return the initial state when passed an empty action", () => {
    const result = reducer(undefined, { type: "" });
    expect(result).toEqual(initialState);
  });

  describe("setUserJustVerified", () => {
    it("should set userJustVerified to true when payload is true", () => {
      const action = setUserJustVerified(true);
      const result = reducer(initialState, action);
      expect(result.userJustVerified).toBe(true);
    });

    it("should set userJustVerified to false when payload is false", () => {
      const action = setUserJustVerified(false);
      const result = reducer(initialState, action);
      expect(result.userJustVerified).toBe(false);
    });
  });

  describe("resetUserJustVerified", () => {
    it("should reset userJustVerified to false", () => {
      const verifiedState = {
        userJustVerified: true,
      };
      const result = reducer(verifiedState, resetUserJustVerified());
      expect(result.userJustVerified).toBe(false);
    });
  });

  describe("selectUserJustVerified", () => {
    const mockState = {
      verificationStatus: {
        userJustVerified: true,
      },
    };

    it("should return userJustVerified from state when true", () => {
      const result = selectUserJustVerified(mockState);
      expect(result).toBe(true);
    });

    it("should return userJustVerified from state when false", () => {
      const stateWithFalse = {
        verificationStatus: {
          userJustVerified: false,
        },
      };
      const result = selectUserJustVerified(stateWithFalse);
      expect(result).toBe(false);
    });
  });
});