import React from 'react';
import HeadersCreator from './HeadersCreator';
import { Menu, Table, Checkbox, Dropdown, Form } from 'semantic-ui-react';
import TableCellRowCreator from './TableCellRowCreator';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setNumber, RootState, setBool, setLat, setLon, setDropbox1, setDropbox2 } from './upload-reducer';

export const TablePagination = () => {
  const uploadState = useSelector((state: RootState) => state.uploadState);
  const displayInfo = useSelector((state: RootState) => state.displayInfo);
  const dispatch = useDispatch();

  const options = !uploadState.checkbox
    ? uploadState.data[0].map((header, index) => ({ key: index, value: header, text: header }))
    : uploadState.data[0].map((header, index) => ({ key: `col(${index}`, value: `col(${index})`, text: `col(${index})` }));

  const handleChange = () => {
    dispatch(setBool());
  };

  const dropdownLatChange = (name, choice) => {
    const helpFind = options => {
      return options.value === name;
    };
    if (choice) {
      const found = options.find(helpFind);
      dispatch(setLat(name, found.key));
    } else {
      const found = options.find(helpFind);
      dispatch(setLon(name, found.key));
    }
  };

  return (
    <div className="sematic_content">
      <div className="table_over">
        <Table celled>
          <Table.Header>
            <Table.Row>
              {uploadState.checkbox === false
                ? uploadState.data[0].map((header, index) => <HeadersCreator header={header} key={index} />)
                : uploadState.data[0].map((header, index) => <Table.HeaderCell key={index}>{`col(${index})`}</Table.HeaderCell>)}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {uploadState.trimData.map((cellRow, index) => (
              <TableCellRowCreator cellRow={cellRow} key={index} />
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={uploadState.data[0].length}></Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
      <div className="menu-content">
        <div className="dropdowns">
          <Form size="large">
            <Form.Field>
              <Checkbox className="checkbox" toggle label="File without header?" checked={uploadState.checkbox} onClick={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Latitude</label>
              <Dropdown
                className="dropdown"
                placeholder="Select Latitude"
                search
                selection
                options={options}
                value={uploadState.dropdown1}
                onChange={(e, data) => {
                  dropdownLatChange(data.value, true);
                  dispatch(setDropbox1(data.value));
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Longitude</label>
              <Dropdown
                className="dropdown"
                placeholder="Select Longitude"
                search
                selection
                options={options}
                value={uploadState.dropdown2}
                onChange={(e, data) => {
                  dropdownLatChange(data.value, false);
                  dispatch(setDropbox2(data.value));
                }}
              />
            </Form.Field>
          </Form>
        </div>

        <Menu className="pages" pagination>
          <Menu.Item
            active={uploadState.pageState === 1}
            onClick={() => {
              dispatch(setData(uploadState.data.slice(1, 11)));
              dispatch(setNumber(1));
            }}
          >
            1
          </Menu.Item>
          <Menu.Item
            active={uploadState.pageState === 2}
            disabled={uploadState.data.length < 11 ? true : false}
            onClick={() => {
              dispatch(setData(uploadState.data.slice(11, 21)));
              dispatch(setNumber(2));
            }}
          >
            2
          </Menu.Item>
          <Menu.Item
            active={uploadState.pageState === 3}
            disabled={uploadState.data.length < 11 ? true : false}
            onClick={() => {
              dispatch(setData(uploadState.data.slice(21, 31)));
              dispatch(setNumber(3));
            }}
          >
            3
          </Menu.Item>
          <Menu.Item
            active={uploadState.pageState === 4}
            disabled={uploadState.data.length < 31 ? true : false}
            onClick={() => {
              dispatch(setData(uploadState.data.slice(31, 41)));
              dispatch(setNumber(4));
            }}
          >
            4
          </Menu.Item>
          <Menu.Item
            active={uploadState.pageState === 5}
            disabled={uploadState.data.length < 41 ? true : false}
            onClick={() => {
              dispatch(setData(uploadState.data.slice(41, 51)));
              dispatch(setNumber(5));
            }}
          >
            5
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};
