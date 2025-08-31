import { useEffect, useState } from "react";
import openDB from "../js/db";
import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Group,
  Modal,
  NativeSelect,
  Rating,
  ScrollArea,
  Table,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { FaSearch } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import {
  TbCalendar,
  TbCalendarEvent,
  TbCalendarMonth,
  TbGrid3X3,
  TbLink,
  TbStar,
  TbStarOff,
  TbTableOptions,
  TbTag,
} from "react-icons/tb";
import classes from "./HistoryTable.module.css";
import { useForm } from "@mantine/form";
import ColumnHeadings from "./ColumnHeadings";
import {
  DatePickerInput,
  MonthPickerInput,
  YearPickerInput,
} from "@mantine/dates";

export default function HistoryTable() {
  const [openModal, { open, close }] = useDisclosure(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedSearches, setSelectedSearches] = useState([]);
  const [sortSearchHistory, setSortSearchHistory] = useState({
    sortBy: "date",
    reversed: true,
  });
  const [searchCount, setSearchCount] = useState(0);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      code: "",
      year: [],
      session: [],
      version: "",
      date: [],
      favourite: "",
      link: "",
    },

    validate: {},
  });

  useEffect(() => {
    (async () => {
      /** @type {IDBDatabase} */
      const db = await openDB();
      const tx = db.transaction(["searches"]);
      const store = tx.objectStore("searches");

      const requestHistory = store.getAll();

      requestHistory.onsuccess = function (event) {
        const history = event.target.result;

        setSearchCount(history.length);
        setSearchHistory(history.sort((a, b) => b.date - a.date));
      };

      requestHistory.onerror = function (event) {
        console.error("Error fetching data:", event.target.error);
      };
    })();
  }, []);

  const tableRows = searchHistory.map((search) => {
    const [month, day, year] = new Date(search.date)
      .toLocaleDateString()
      .split("/");

    return (
      <Table.Tr key={search.id}>
        <Table.Td>
          <Checkbox
            checked={selectedSearches.includes(search.id)}
            onChange={() => {
              setSelectedSearches((selection) =>
                selection.includes(search.id)
                  ? selection.filter((s) => s !== search.id)
                  : [...selection, search.id]
              );
            }}
          />
        </Table.Td>
        <Table.Td>{search.code}</Table.Td>
        <Table.Td>{search.session}</Table.Td>
        <Table.Td>{search.year}</Table.Td>
        <Table.Td>{search.version}</Table.Td>
        <Table.Td>{`
          ${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}
        `}</Table.Td>
        <Table.Td>
          <Rating count={1} value={Number(search.favourite)} />
        </Table.Td>
        <Table.Td>
          <Anchor maw="100%" target="_blank" href={search.url}>
            {new URL(search.url).host || search.url}
          </Anchor>
        </Table.Td>
      </Table.Tr>
    );
  });

  function handleFavouriteSelection() {
    selectedSearches.forEach(async (id) => {
      console.log(id);

      /** @type {IDBDatabase} */
      const db = await openDB();
      const tx = db.transaction(["searches"], "readwrite");
      const store = tx.objectStore("searches");

      const [data] = searchHistory.filter((value) => value.id === id);

      const requestUpdate = store.put({ ...data, favourite: true });

      requestUpdate.onsuccess = function () {
        window.location.reload();
      };

      requestUpdate.onerror = function (err) {
        console.log(err);
      };
    });
  }
  function handleUnfavouriteSelection() {
    selectedSearches.forEach(async (id) => {
      console.log(id);

      /** @type {IDBDatabase} */
      const db = await openDB();
      const tx = db.transaction(["searches"], "readwrite");
      const store = tx.objectStore("searches");

      const [data] = searchHistory.filter((value) => value.id === id);

      const requestUpdate = store.put({ ...data, favourite: false });

      requestUpdate.onsuccess = function () {
        window.location.reload();
      };

      requestUpdate.onerror = function (err) {
        console.log(err);
      };
    });
  }

  function handleDeleteSelection() {
    selectedSearches.forEach(async (id) => {
      console.log(id);

      /** @type {IDBDatabase} */
      const db = await openDB();
      const tx = db.transaction(["searches"], "readwrite");
      const store = tx.objectStore("searches");

      const deleteRequest = store.delete(id);

      deleteRequest.onerror = function (err) {
        console.log("Failed to set favourites", err);
        alert(1);
      };

      deleteRequest.onsuccess = function () {
        window.location.reload();
      };
    });
  }

  function queryHistory(query) {
    console.log(query);

    let searches = [...searchHistory];

    if (query.code.length !== 0) {
      searches = searches.filter((obj) => obj.code.includes(query.code));
    }

    if (query.year.length !== 0) {
      searches = searches.filter((obj) =>
        query.year.map((v) => v.slice(0, 4)).includes(obj.year.toString())
      );
    }

    if (query.session.length !== 0) {
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

      searches = searches.filter((obj) => {
        const objSession = months.indexOf(obj.session) + 1;
        const querySession = Number(query.session[0].slice(5, 7));

        console.log(objSession, querySession);

        return objSession === querySession;
      });
    }

    if (query.version.length === 2 && query.version !== "??") {
      if (query.version[0] === "?") {
        searches = searches.filter(
          (obj) => obj.version[1] === query.version[1]
        );
      } else if (query.version[1] === "?") {
        searches = searches.filter(
          (obj) => obj.version[0] === query.version[0]
        );
      } else {
        searches = searches.filter((obj) => obj.version === query.version);
      }
    }

    if (query.date.length !== 0) {
      searches = searches.filter(
        (obj) =>
          obj.date >= new Date(query.date[0]) &&
          obj.date <= new Date(query.date[1])
      );
    }

    if (query.favourite.length !== 0) {
      searches = searches.filter(
        (obj) => obj.favourite === (query.favourite === "favourite")
      );
    }

    if (query.link.length !== 0) {
      searches = searches.filter((obj) => obj.url.includes(query.link));
    }

    setSearchHistory(searches);
    form.reset();
  }

  return (
    <div>
      <Group>
        <Title w="100%" fw={400} size="3rem" ta="center" mt="lg" order={1}>{searchCount}<br/>Total Searches<br/></Title>
      </Group>

      {selectedSearches.length === 0 ? (
        <Group
          className={classes.form}
          component="form"
          gap={0}
          mr={10}
          wrap="nowrap"
          onSubmit={form.onSubmit((values) => queryHistory(values))}
        >
          <ActionIcon type="submit" size={36} mt={6} mb={6} mr={2} ml={2}>
            <FaSearch size={18} />
          </ActionIcon>
          <Tooltip label="past paper subject code">
            <TextInput
              leftSection={<TbGrid3X3 size={14} />}
              key={form.key("code")}
              {...form.getInputProps("code")}
            />
          </Tooltip>
          <Tooltip label="session period past paper was released">
            <MonthPickerInput
              type="multiple"
              valueFormat="MMM"
              leftSection={<TbCalendar size={14} />}
              key={form.key("session")}
              {...form.getInputProps("session")}
            />
          </Tooltip>
          <Tooltip label="year past paper was released">
            <YearPickerInput
              type="multiple"
              valueFormat="YY"
              leftSection={<TbCalendarMonth size={14} />}
              key={form.key("year")}
              {...form.getInputProps("year")}
            />
          </Tooltip>
          <Tooltip label="past paper number and version, '?' can be used as a wildcard character in filters">
            <TextInput
              leftSection={<TbTag size={14} />}
              key={form.key("version")}
              {...form.getInputProps("version")}
            />
          </Tooltip>
          <Tooltip label="past paper search date range">
            <DatePickerInput
              styles={{ input: { fontSize: "12px" } }}
              leftSection={<TbCalendarEvent size={14} />}
              type="range"
              valueFormat="YYYY/MM/DD"
              key={form.key("date")}
              {...form.getInputProps("date")}
            />
          </Tooltip>
          <NativeSelect
            data={["no filter", "favourite", "not favourate"]}
            leftSection={<TbTableOptions size={14} />}
            key={form.key("favourite")}
            {...form.getInputProps("favourite")}
          />
          <TextInput
            leftSection={<TbLink size={14} />}
            key={form.key("link")}
            {...form.getInputProps("link")}
          />
        </Group>
      ) : (
        <Group>
          <Button
            onClick={handleFavouriteSelection}
            mt={6}
            mb={6}
            color="yellow"
            leftSection={<TbStar />}
          >
            Favourite
          </Button>
          <Button
            onClick={handleUnfavouriteSelection}
            mt={6}
            mb={6}
            color="orange"
            leftSection={<TbStarOff />}
          >
            Unfavorite
          </Button>
          <Button
            mt={6}
            mb={6}
            onClick={open}
            color="red"
            leftSection={<MdDeleteForever />}
          >
            Delete
          </Button>
          <Modal
            centered={true}
            opened={openModal}
            onClose={close}
            title={
              <>
                Are you sure you want to delete? <br />
                This action cannot be undone.
              </>
            }
          >
            <Button
              onClick={handleDeleteSelection}
              color="red"
              leftSection={<MdDeleteForever />}
            >
              Delete
            </Button>
          </Modal>
        </Group>
      )}

      <Group pr={10}>
        <Table
          className={classes["heading-table"]}
          withColumnBorders
          withTableBorder
          withRowBorders
          layout="fixed"
        >
          <colgroup>
            <col style={{ width: "40px" }} />
            <col /> <col />
            <col /> <col />
            <col /> <col />
            <col />
          </colgroup>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  onChange={() =>
                    setSelectedSearches(
                      searchHistory.length === selectedSearches.length
                        ? []
                        : searchHistory.map(({ id }) => id)
                    )
                  }
                  checked={
                    searchHistory.length === selectedSearches.length &&
                    searchHistory.length !== 0
                  }
                  indeterminate={
                    selectedSearches.length > 0 &&
                    selectedSearches.length !== searchHistory.length
                  }
                />
              </Table.Th>
              <Table.Th>
                <ColumnHeadings
                  heading="code"
                  sorting={sortSearchHistory}
                  setSort={setSortSearchHistory}
                  setHistory={setSearchHistory}
                />
              </Table.Th>
              <Table.Th>
                <ColumnHeadings
                  heading="session"
                  sorting={sortSearchHistory}
                  setHistory={setSearchHistory}
                  setSort={setSortSearchHistory}
                />
              </Table.Th>
              <Table.Th>
                <ColumnHeadings
                  heading="year"
                  sorting={sortSearchHistory}
                  setHistory={setSearchHistory}
                  setSort={setSortSearchHistory}
                />
              </Table.Th>
              <Table.Th>
                <ColumnHeadings
                  heading="version"
                  sorting={sortSearchHistory}
                  setHistory={setSearchHistory}
                  setSort={setSortSearchHistory}
                />
              </Table.Th>
              <Table.Th>
                <ColumnHeadings
                  heading="date"
                  sorting={sortSearchHistory}
                  setHistory={setSearchHistory}
                  setSort={setSortSearchHistory}
                />
              </Table.Th>
              <Table.Th>
                <ColumnHeadings
                  heading="favourite"
                  sorting={sortSearchHistory}
                  setHistory={setSearchHistory}
                  setSort={setSortSearchHistory}
                />
              </Table.Th>
              <Table.Th>
                <ColumnHeadings
                  heading="link"
                  sorting={sortSearchHistory}
                  setHistory={setSearchHistory}
                  setSort={setSortSearchHistory}
                />
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
        </Table>
      </Group>
      <ScrollArea
        scrollbars="y"
        type="always"
        h="26rem"
        pr={10}
        scrollbarSize={10}
      >
        <Table withColumnBorders withTableBorder withRowBorders layout="fixed">
          <colgroup>
            <col style={{ width: "40px" }} />
            <col /> <col />
            <col /> <col />
            <col /> <col />
            <col />
          </colgroup>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}
