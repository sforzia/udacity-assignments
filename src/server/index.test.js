import "regenerator-runtime/runtime";
import axios from "axios";

export const API = {
  getData() {
    return axios(
      `http://localhost:8081/getCoordinates?loc=Delhi&date=${new Date().getTime()}`
    ).then((res) => res.json());
  },
};

describe("formHandler tests", () => {
  test("testing 'getCoordinates' API response", () => {
    // axios(
    //   `http://localhost:8081/getCoordinates?loc=Delhi&date=${new Date().getTime()}`
    // )
    //   .then((response) => {
    //     console.log("response: ", response.data);
    //   })
    //   .catch((error) => {
    //     console.log("error: ", error);
    //   });
    expect(
      axios(
        `http://localhost:8081/getCoordinates?loc=Delhi&date=${new Date().getTime()}`
      ).then((response) => response.data)
    ).resolves.toHaveProperty("destination", "Delhi");
  });
});
