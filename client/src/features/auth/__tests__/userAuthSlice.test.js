import reducer, { userAuthenticated, userNotAuthenticated, userAuth, userIsAdmin } from "../userAuthSlice";

describe("userAuthSlice", () => {
  const initialState = {
    userIsAuthenticated: false,
    userIsAdmin: false,
  };

  it("should return the initial state when passed an empty action", () => {
    const result = reducer(undefined, { type: "" });
    expect(result).toEqual(initialState);
  });

  describe("userAuthenticated", () => {
    it("should set userIsAuthenticated to true and userIsAdmin to true when role is admin", () => {
      const action = userAuthenticated({ role: "admin" });
      const result = reducer(initialState, action);

      expect(result.userIsAuthenticated).toBe(true);
      expect(result.userIsAdmin).toBe(true);
    });

    it("should set userIsAuthenticated to true and userIsAdmin to false when role is user", () => {
      const action = userAuthenticated({ role: "user" });
      const result = reducer(initialState, action);

      expect(result.userIsAuthenticated).toBe(true);
      expect(result.userIsAdmin).toBe(false);
    });
  });

  describe("userNotAuthenticated", () => {
    it("should reset both userIsAuthenticated and userIsAdmin to false", () => {
      const loggedInState = {
        userIsAuthenticated: true,
        userIsAdmin: true,
      };

      const result = reducer(loggedInState, userNotAuthenticated());

      expect(result.userIsAuthenticated).toBe(false);
      expect(result.userIsAdmin).toBe(false);
    });
  });

  describe("selectors", () => {
    const mockState = {
      userAuth: {
        userIsAuthenticated: true,
        userIsAdmin: true,
      },
    };

    it("userAuth should return userIsAuthenticated from state", () => {
      const result = userAuth(mockState);
      expect(result).toBe(true);
    });

    it("userIsAdmin should return userIsAdmin from state", () => {
      const result = userIsAdmin(mockState);
      expect(result).toBe(true);
    });

    it("userAuth should return false when userIsAuthenticated is false", () => {
      const stateWithFalseAuth = {
        userAuth: {
          userIsAuthenticated: false,
          userIsAdmin: false,
        },
      };
      const result = userAuth(stateWithFalseAuth);
      expect(result).toBe(false);
    });

    it("userIsAdmin should return false when userIsAdmin is false", () => {
      const stateWithFalseAdmin = {
        userAuth: {
          userIsAuthenticated: true,
          userIsAdmin: false,
        },
      };
      const result = userIsAdmin(stateWithFalseAdmin);
      expect(result).toBe(false);
    });
  });
});