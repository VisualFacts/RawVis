import React, { useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import { Button, Segment, Image, Header, Grid, Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { addData, setData, store, RootState } from './upload-reducer';
import { TablePagination } from './Table';
import LeftMenu from './LeftMenu';
import './upload-styles.scss';

const App = () => {
  const storeState = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const papaparseOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
  };

  const force = (data, fileInfo) => {
    if (data.length > 0) {
      dispatch(addData(data));
      dispatch(setData(data.slice(1, 51)));
    }
  };

  const HandleForce = () => {
    return <div>{Object.keys(storeState.uploadState.data).length === 0 ? <h1>No data yet</h1> : <TablePagination />}</div>;
  };

  return (
    <div>
      <div className="select-csv-btn">
        {storeState.uploadState.data.length === 0 && (
          <Button className="csv-input-btn" size="big">
            <CSVReader
              cssClass="react-csv-input"
              inputStyle={{ display: 'none' }}
              label="Select CSV file"
              onFileLoaded={force}
              parserOptions={papaparseOptions}
            />
          </Button>
        )}
      </div>
      <HandleForce />
    </div>
  );
};

const Upload = () => (
  <div>
    <Provider store={store}>
      <Grid verticalAlign="middle" padded>
        <Image src="/content/images/logo.png" size="medium"></Image>
        <Grid.Column>
          <Header as="h1">blablabalbalabalablabalblaalb</Header>
        </Grid.Column>
      </Grid>
      <Divider />
      <Segment basic>
        <Grid>
          <Grid.Column width="2" stretched>
            <Segment>
              <LeftMenu />
            </Segment>
          </Grid.Column>

          <Grid.Column width="14" textAlign="center">
            <App />
          </Grid.Column>
        </Grid>
      </Segment>
    </Provider>
  </div>
);

export default Upload;
