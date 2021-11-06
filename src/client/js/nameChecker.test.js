import { checkForName } from "./nameChecker";

describe("nameChecker tests", () => {
  test("testing checkForName", () => {
    const expectedResult = "Welcome, Captain!";
    expect(checkForName("Archer")).toBe(expectedResult);
  });
});
