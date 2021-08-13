import React from 'react';
import HeadersCreator from './HeadersCreator';
import { Table, Checkbox, Dropdown, Form, Segment, Button, Container } from 'semantic-ui-react';
import TableCellRowCreator from './TableCellRowCreator';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './upload-reducer';
import axios from 'axios';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const TablePagination = () => {
  const uploadState = useSelector((state: Actions.RootState) => state.uploadState);
  const displayInfo = useSelector((state: Actions.RootState) => state.displayInfo);
  const dataSet = useSelector((state: Actions.RootState) => state.dataSet);
  const dispatch = useDispatch();

  const options = !uploadState.checkbox
    ? uploadState.data[0].map((header, index) => ({ key: index, value: header, text: header }))
    : uploadState.data[0].map((header, index) => ({ key: index, value: `col(${index})`, text: `col(${index})` }));

  const filterOptions = () => {
    const optionFil = options.reduce((filtered, option) => {
      if (
        option.value !== uploadState.dropdown1 &&
        option.value !== uploadState.dropdown2 &&
        option.value !== uploadState.dropdown3 &&
        uploadState.dropMultBox.includes(option.value) === false
      ) {
        filtered.push(option);
      }
      return filtered;
    }, []);
    return optionFil;
  };

  const handleChange = () => {
    dispatch(Actions.setBool());
  };

  const dropdownLatChange = (name, choice) => {
    const helpFind = element => {
      return element.value === name;
    };
    if (choice) {
      const found = options.find(helpFind);
      dispatch(Actions.setLat(name, found.key));
    } else {
      const found = options.find(helpFind);
      dispatch(Actions.setLon(name, found.key));
    }
  };

  const dropdownMeasureChange = name => {
    const helpFind = element => {
      return element.value === name;
    };

    const found = options.find(helpFind);
    dispatch(Actions.setMeasure(name, found.key));
  };

  const multDropboxChange = name => {
    dispatch(Actions.emptyDimensions());
    name.map((nam, index) => {
      const helpFind = element => {
        return element.value === nam;
      };

      const found = options.find(helpFind);
      dispatch(Actions.setDimensions(name, found.key));
    });
  };

  return (
    <div>
      <Container fluid textAlign="left">
        <Button
          onClick={() => {
            dispatch(Actions.addData(''));
          }}
        >
          Back
        </Button>
      </Container>
      <Segment vertical>
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
          </Table>
        </div>
      </Segment>
      <Segment vertical>
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
                  placeholder={uploadState.dropdown1}
                  search
                  clearable
                  selection
                  options={filterOptions()}
                  value={uploadState.dropdown1}
                  onChange={(e, data) => {
                    dispatch(Actions.setDropbox1(data.value));
                    dropdownLatChange(data.value, true);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <label>Longitude</label>
                <Dropdown
                  className="dropdown"
                  placeholder={uploadState.dropdown2}
                  search
                  clearable
                  selection
                  options={filterOptions()}
                  value={uploadState.dropdown2}
                  onChange={(e, data) => {
                    dispatch(Actions.setDropbox2(data.value));
                    dropdownLatChange(data.value, false);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <label>Measure</label>
                <Dropdown
                  className="dropdown"
                  placeholder={uploadState.dropdown3}
                  search
                  clearable
                  selection
                  options={filterOptions()}
                  value={uploadState.dropdown3}
                  onChange={(e, data) => {
                    dispatch(Actions.setDropbox3(data.value));
                    dropdownMeasureChange(data.value);
                  }}
                />
              </Form.Field>
              <Form.Field>
                <label>Dimensions</label>
                <Dropdown
                  className="dropdown"
                  multiple
                  search
                  selection
                  options={options}
                  value={uploadState.dropMultBox}
                  onChange={(e, data) => {
                    dispatch(Actions.setDropMultBox(data.value));
                    multDropboxChange(data.value);
                  }}
                />
              </Form.Field>
            </Form>
          </div>
        </div>
      </Segment>
    </div>
  );
};
