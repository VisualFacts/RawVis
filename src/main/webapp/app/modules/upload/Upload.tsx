import React from 'react';
import CSVReader from 'react-csv-reader';
import { Button, Image, Header, Grid, Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { addData, setData, store, RootState, setName, setOriginalFile } from './upload-reducer';
import { TablePagination } from './Table';
import LeftMenu from './LeftMenu';
import DatasetsTable from './DatasetsTable';
import './upload-styles.scss';
import { Link } from 'react-router-dom';

const App = () => {
  const storeState = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  let jsx;

  const papaparseOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
  };

  const force = (data, fileInfo, originalFile) => {
    dispatch(setData(data.slice(1, 51)));
    dispatch(setName(fileInfo.name));
    dispatch(setOriginalFile(originalFile));
    dispatch(addData(data));
  };

  const HandleForce = () => {
    return (
      <div>
        {storeState.uploadState.data.length === 0 ? (
          <Header color="grey" size="large">
            Import a file for dataset creation
          </Header>
        ) : (
          <TablePagination />
        )}
      </div>
    );
  };

  if (storeState.uploadState.activeMenu === 'New Dataset') {
    jsx = (
      <div>
        <div className="select-csv-btn">
          {storeState.uploadState.data.length === 0 && (
            <Button className="csv-input-btn" size="big" inverted color="red">
              <CSVReader
                cssClass="react-csv-input"
                inputStyle={{ display: 'none' }}
                inputName="input-name"
                label="Select File"
                onFileLoaded={force}
                parserOptions={papaparseOptions}
              />
            </Button>
          )}
        </div>
        <Divider hidden />
        <HandleForce />
      </div>
    );
  } else if (storeState.uploadState.activeMenu === 'Open Dataset') {
    jsx = <DatasetsTable />;
  }

  return jsx;
};

const Upload = () => (
  <div>
    <Provider store={store}>
      <Grid verticalAlign="middle" padded inverted stackable>
        <Grid.Row columns="2" color="black">
          <Grid.Column width="2">
            <Link to={`/`}>
              <Image src="/content/images/logo.png" size="small"></Image>
            </Link>
          </Grid.Column>
          <Grid.Column textAlign="right" floated="right" verticalAlign="bottom">
            <Header inverted color="grey" as="h5">
              Online tool for importing editing and saving datasets
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid centered padded>
        <Grid.Row>
          <LeftMenu />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width="14" textAlign="center">
            <App />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Provider>
  </div>
);

export default Upload;
