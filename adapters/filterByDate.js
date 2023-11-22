import { format, isAfter, isEqual, isValid, parse } from "date-fns";

export function filterByDate(records = [], date = "", dateIndex = 0) {
  const parsedComparisonDate = parse(date, "yyyy-MM-dd", new Date());

  if (!isValid(parsedComparisonDate)) {
    throw new Error("The date param is not a valid date");
  }

  return records.filter((row) => {
    const parsedRowDate = parse(
      row[dateIndex],
      "yyyy-MM-dd HH:mm:ss",
      new Date()
    );

    if (!isValid(parsedRowDate)) {
      throw new Error("One or more rows do not have a valid date");
    }

    const yearMonthDay = parse(
      format(parsedRowDate, "yyyy-MM-dd"),
      "yyyy-MM-dd",
      new Date()
    );

    return (
      isEqual(yearMonthDay, parsedComparisonDate) ||
      isAfter(yearMonthDay, parsedComparisonDate)
    );
  });
}
