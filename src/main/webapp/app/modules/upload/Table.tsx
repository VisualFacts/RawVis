import React, { useEffect } from 'react';
import HeadersCreator from './HeadersCreator';
import { Table, Checkbox, Dropdown, Form, Segment, Button, Container } from 'semantic-ui-react';
import TableCellRowCreator from './TableCellRowCreator';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './upload-reducer';

export const TablePagination = () => {
  const uploadState = useSelector((state: Actions.RootState) => state.uploadState);
  const displayInfo = useSelector((state: Actions.RootState) => state.displayInfo);
  const dataSet = useSelector((state: Actions.RootState) => state.dataSet);
  const dispatch = useDispatch();

  const options = !uploadState.checkbox
    ? uploadState.data[0].map((header, index) => ({ key: index, value: header, text: header }))
    : uploadState.data[0].map((header, index) => ({ key: index, value: `col(${index})`, text: `col(${index})` }));

  const filterOptions = numericCols => {
    let optionFil = [];
    if (numericCols !== null) {
      for (let i = 0; i < numericCols.length; i++) {
        if (
          options[numericCols[i]].value !== uploadState.dropdown1 &&
          options[numericCols[i]].value !== uploadState.dropdown2 &&
          options[numericCols[i]].value !== uploadState.dropdown3 &&
          uploadState.dropMultBox.includes(options[numericCols[i]].value) === false
        ) {
          optionFil.push(options[numericCols[i]]);
        }
      }
      return optionFil;
    } else {
      optionFil = options.reduce((filtered, option) => {
        if (
          option.value !== null &&
          option.value !== uploadState.dropdown1 &&
          option.value !== uploadState.dropdown2 &&
          option.value !== uploadState.dropdown3 &&
          uploadState.dropMultBox.includes(option.value) === false
        ) {
          option.text === false && (option.text = 'false');
          option.text === true && (option.text = 'true');
          filtered.push(option);
        }
        return filtered;
      }, []);
      return optionFil;
    }
  };

  const checkLatLon = (matrix, limit) => {
    let flag = false,
      temp = 0;
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
      for (let y = 0; y < matrix.length; y++) {
        if (limit !== null) {
          if (matrix[y][i] < -limit || matrix[y][i] > limit || typeof matrix[y][i] !== 'number') {
            flag = true;
            y = matrix.length;
          }
        } else {
          if (typeof matrix[y][i] !== 'number') {
            flag = true;
            y = matrix.length;
          }
        }
      }
      if (flag === true) {
        flag = false;
      } else {
        if (limit === 180) {
          temp++;
          result.push(i);
          if (temp === 2) {
            break;
          }
        } else if (limit === 90) {
          result.push(i);
          break;
        } else {
          result.push(i);
        }
      }
    }
    return result;
  };

  const filterItems = (itemSearch, headers, matrix) => {
    let avoidnull;
    const query = itemSearch.toLowerCase();
    const res = headers.filter(item => {
      item !== null ? (avoidnull = item) : (avoidnull = '');
      return avoidnull.toString().toLowerCase().indexOf(query) >= 0;
    });
    if (res.length === 0) {
      itemSearch === 'lat' ? res.push(headers[checkLatLon(matrix, 90)[0]]) : res.push(headers[checkLatLon(matrix, 180)[1]]);
    }
    res[0] === undefined && (res[0] = '');
    return res[0];
  };

  const handleChange = () => {
    dispatch(Actions.setBool());
  };

  const dropdownLatChange = (name, choice) => {
    if (name) {
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
    } else {
      choice ? dispatch(Actions.setLat(null, null)) : dispatch(Actions.setLon(null, null));
    }
  };

  const dropdownMeasureChange = name => {
    if (name) {
      const helpFind = element => {
        return element.value === name;
      };

      const found = options.find(helpFind);
      dispatch(Actions.setMeasure(name, found.key));
    } else {
      dispatch(Actions.setMeasure(null, null));
    }
  };

  const multDropboxChange = name => {
    dispatch(Actions.emptyDimensions());
    name.map((nam, index) => {
      const helpFind = element => {
        return element.value === nam;
      };

      const found = options.find(helpFind);
      dispatch(Actions.setDimensions(nam, found.key));
    });
  };

  useEffect(() => {
    if (uploadState.rend === false && uploadState.trimData.length !== 0) {
      dispatch(Actions.setDropbox1(filterItems('lat', uploadState.data[0], uploadState.trimData)));
      dropdownLatChange(filterItems('lat', uploadState.data[0], uploadState.trimData), true);
      dispatch(Actions.setDropbox2(filterItems('lon', uploadState.data[0], uploadState.trimData)));
      dropdownLatChange(filterItems('lon', uploadState.data[0], uploadState.trimData), false);
      dispatch(Actions.setRend());
    }
  });
  return (
    <div>
      <Container fluid textAlign="left">
        <Button
          onClick={() => {
            dispatch(Actions.addData([]));
            dispatch(Actions.setData([]));
            dispatch(Actions.resetDropdowns());
            uploadState.rend === true && dispatch(Actions.setRend());
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
                  options={filterOptions(null)}
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
                  options={filterOptions(null)}
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
                  options={filterOptions(checkLatLon(uploadState.data.slice(1, 51), null))}
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
              <Button
                onClick={() => {
                  dispatch(Actions.createEntity(displayInfo));
                }}
              >
                Apply
              </Button>
            </Form>
          </div>
        </div>
      </Segment>
    </div>
  );
};
