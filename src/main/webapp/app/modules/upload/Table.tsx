import React, { useEffect } from 'react';
import HeadersCreator from './HeadersCreator';
import { Table, Checkbox, Dropdown, Form, Segment, Button, Container } from 'semantic-ui-react';
import TableCellRowCreator from './TableCellRowCreator';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './upload-reducer';
import Map from './upmap';
import axios from 'axios';

export const TablePagination = () => {
  const uploadState = useSelector((state: Actions.RootState) => state.uploadState);
  const displayInfo = useSelector((state: Actions.RootState) => state.displayInfo);
  const dataSet = useSelector((state: Actions.RootState) => state.dataSet);
  const dispatch = useDispatch();

  const cap = {
    array: uploadState.data,
  };

  let options;
  if (uploadState.editButton.length === 0) {
    options = !uploadState.checkbox
      ? uploadState.data[0].map((header, index) => ({ key: index, value: header, text: header }))
      : uploadState.data[0].map((header, index) => ({ key: index, value: `col(${index})`, text: `col(${index})` }));
  } else {
    options = [];
  }

  const filterOptions = numericCols => {
    let optionFil = [];
    if (numericCols !== null) {
      for (let i = 0; i < numericCols.length; i++) {
        if (
          options[numericCols[i]].value !== uploadState.dropdown1 &&
          options[numericCols[i]].value !== uploadState.dropdown2 &&
          options[numericCols[i]].value !== uploadState.dropdown3 &&
          options[numericCols[i]].value !== uploadState.dropdown4 &&
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
          option.value !== uploadState.dropdown4 &&
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

  const getCoordinates = () => {
    const coordinates = [];
    if (displayInfo.lon !== null && displayInfo.lat !== null && uploadState.trimData !== []) {
      for (let i = 0; i < uploadState.trimData.length; i++) {
        coordinates.push([uploadState.trimData[i][displayInfo.lat], uploadState.trimData[i][displayInfo.lon]]);
      }
      dispatch(Actions.setCoordinates(coordinates));
    } else {
      dispatch(Actions.setCoordinates(coordinates));
    }
  };

  const dropdownLatChange = (name, choice) => {
    if (name) {
      const helpFind = element => {
        return element.value === name;
      };
      if (choice) {
        const found = options.find(helpFind);
        dispatch(Actions.setLat(found.key));
        uploadState.rend === true && uploadState.coordinates === null && getCoordinates();
      } else {
        const found = options.find(helpFind);
        dispatch(Actions.setLon(found.key));
        uploadState.rend === true && uploadState.coordinates === null && getCoordinates();
      }
    } else {
      choice ? dispatch(Actions.setLat(null)) : dispatch(Actions.setLon(null));
      uploadState.rend === true && uploadState.coordinates === null && getCoordinates();
    }
  };

  const dropdownMeasureChange = (name, choice) => {
    if (name) {
      const helpFind = element => {
        return element.value === name;
      };

      const found = options.find(helpFind);
      choice === 0 ? dispatch(Actions.setMeasure0(found.key)) : dispatch(Actions.setMeasure1(found.key));
    } else {
      choice === 0 ? dispatch(Actions.setMeasure0(null)) : dispatch(Actions.setMeasure1(null));
    }
  };

  const multDropboxChange = name => {
    dispatch(Actions.emptyDimensions());
    name.map((nam, index) => {
      const helpFind = element => {
        return element.value === nam;
      };

      const found = options.find(helpFind);
      dispatch(Actions.setDimensions(found.key));
    });
  };

  const fileUpload = file => {
    const url = 'api/importData';
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return axios.post(url, formData, config);
  };

  // PRESELECTION OF LAT AND LON VALUES
  useEffect(() => {
    if (uploadState.rend === false && uploadState.trimData.length !== 0) {
      dispatch(Actions.setDropbox1(filterItems('lat', uploadState.data[0], uploadState.trimData)));
      dropdownLatChange(filterItems('lat', uploadState.data[0], uploadState.trimData), true);
      dispatch(Actions.setDropbox2(filterItems('lon', uploadState.data[0], uploadState.trimData)));
      dropdownLatChange(filterItems('lon', uploadState.data[0], uploadState.trimData), false);
      dispatch(Actions.setRend());
    }
    if (uploadState.rend === true && uploadState.coordinates === null) {
      getCoordinates();
    }
  }, []);

  return (
    <div>
      <Container fluid textAlign="left">
        {uploadState.editButton.length === 0 && (
          <Button
            onClick={() => {
              dispatch(Actions.addData([]));
              dispatch(Actions.setData([]));
              dispatch(Actions.resetDropdowns());
              dispatch(Actions.setCoordinates(null));
              uploadState.rend === true && dispatch(Actions.setRend());
            }}
          >
            Back
          </Button>
        )}
      </Container>
      {uploadState.editButton.length === 0 ? (
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
      ) : (
        <h1>No data available for table preview</h1>
      )}
      <Segment.Group horizontal>
        <Container>
          <div className="menu-content">
            <div className="dropdowns">
              <Form size="large">
                <Form.Field>
                  {uploadState.editButton.length !== 0 ? (
                    <Checkbox className="checkbox" toggle label="File without header?" disabled />
                  ) : (
                    <Checkbox
                      className="checkbox"
                      toggle
                      label="File without header?"
                      checked={uploadState.checkbox}
                      onClick={handleChange}
                    />
                  )}
                </Form.Field>
                <Form.Field>
                  <label>Latitude</label>
                  <Dropdown
                    className="dropdown"
                    placeholder={uploadState.dropdown1}
                    search
                    clearable
                    selection
                    options={uploadState.editButton.length !== 0 ? [] : filterOptions(null)}
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
                    options={uploadState.editButton.length !== 0 ? [] : filterOptions(null)}
                    value={uploadState.dropdown2}
                    onChange={(e, data) => {
                      dispatch(Actions.setDropbox2(data.value));
                      dropdownLatChange(data.value, false);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Measure0</label>
                  <Dropdown
                    className="dropdown"
                    placeholder={uploadState.dropdown3}
                    search
                    clearable
                    selection
                    options={uploadState.editButton.length !== 0 ? [] : filterOptions(checkLatLon(uploadState.data.slice(1, 51), null))}
                    value={uploadState.dropdown3}
                    onChange={(e, data) => {
                      dispatch(Actions.setDropbox3(data.value));
                      dropdownMeasureChange(data.value, 0);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Measure1</label>
                  <Dropdown
                    className="dropdown"
                    placeholder={uploadState.dropdown4}
                    search
                    clearable
                    selection
                    options={uploadState.editButton.length !== 0 ? [] : filterOptions(checkLatLon(uploadState.data.slice(1, 51), null))}
                    value={uploadState.dropdown4}
                    onChange={(e, data) => {
                      dispatch(Actions.setDropbox4(data.value));
                      dropdownMeasureChange(data.value, 1);
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
                    options={uploadState.editButton.length !== 0 ? uploadState.dropMultBox : options}
                    defaultValue={uploadState.editButton.length !== 0 ? ['0', '1', '2', '3'] : uploadState.dropMultBox}
                    onChange={(e, data) => {
                      dispatch(Actions.setDropMultBox(data.value));
                      multDropboxChange(data.value);
                    }}
                  />
                </Form.Field>
                {uploadState.editButton.length === 0 && (
                  <Button
                    onClick={() => {
                      fileUpload(uploadState.originalFile);
                    }}
                  >
                    Apply
                  </Button>
                )}
              </Form>
            </div>
          </div>
        </Container>
        {/* <Container>
          <Map Coordinates={uploadState.coordinates} />
        </Container> */}
      </Segment.Group>
    </div>
  );
};
