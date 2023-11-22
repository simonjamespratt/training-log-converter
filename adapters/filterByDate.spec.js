import { expect, describe, it, beforeEach } from "vitest";

import { filterByDate } from "./filterByDate.js";

describe("for a given date", () => {
  let date;

  beforeEach(() => {
    date = "2023-07-10";
  });

  it("throws an error if the date param cannot be converted to a valid date", () => {
    expect(() => filterByDate([["2023-07-10 18:52:44"]], "foo")).toThrowError(
      "The date param is not a valid date"
    );
  });

  it("throws an error if any records' date cannot be converted to a valid date", () => {
    expect(() =>
      filterByDate([["2023-07-10 18:52:44"], ["foo"]], date)
    ).toThrowError("One or more rows do not have a valid date");
  });

  it("returns entries on the specified day", () => {
    expect(filterByDate([["2023-07-10 18:52:44"]], date)).toEqual([
      ["2023-07-10 18:52:44"],
    ]);
  });

  it("returns entries after the specified day", () => {
    expect(filterByDate([["2023-07-11 18:52:44"]], date)).toEqual([
      ["2023-07-11 18:52:44"],
    ]);
  });

  it("does not return entries before the specified day", () => {
    expect(filterByDate([["2023-07-09 18:52:44"]], date)).toEqual([]);
  });
});
