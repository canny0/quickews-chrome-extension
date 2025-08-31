import { Group, Text } from "@mantine/core";
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from "react-icons/hi2";
import classes from "./ColumnHeadings.module.css";

export default function ColumnHeadings({
  heading,
  sorting,
  setSort,
  setHistory,
}) {
  function handleChangeSort() {
    let sort;
    if (sorting.sortBy === heading) {
      sort = { ...sorting, reversed: !sorting.reversed };
      setSort(sort);
    } else {
      sort = { sortBy: heading, reversed: true };
      setSort(sort);
    }
    if (sort.sortBy === "session") {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      setHistory((history) =>
        history.sort((a, b) =>
          sort.reversed
            ? months.indexOf(b[sort.sortBy]) - months.indexOf(a[sort.sortBy])
            : months.indexOf(a[sort.sortBy]) - months.indexOf(b[sort.sortBy])
        )
      );
    } else {
      setHistory((history) =>
        history.sort((a, b) =>
          sort.reversed
            ? b[sort.sortBy] - a[sort.sortBy]
            : a[sort.sortBy] - b[sort.sortBy]
        )
      );
    }
  }

  return (
    <Group className={classes["table-heading"]} onClick={handleChangeSort}>
      <Text fw={600}>{heading}</Text>
      {sorting.sortBy === heading ? (
        sorting.reversed ? (
          <HiChevronUp size={16} strokeWidth={2} />
        ) : (
          <HiChevronDown size={16} strokeWidth={2} />
        )
      ) : (
        <HiChevronUpDown size={16} strokeWidth={2} />
      )}
    </Group>
  );
}
