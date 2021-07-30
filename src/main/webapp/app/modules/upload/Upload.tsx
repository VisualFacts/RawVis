import React from 'react';
import CSVReader from 'react-csv-reader';
import { Icon, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { addData, setData, store, RootState } from './upload-reducer';
import { TablePagination } from './Table';
import './upload-styles.scss';
import { objectEach } from 'highcharts';

const App = () => {
  const storeState = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const papaparseOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
  };

  const yolo = (data, fileInfo) => {
    if (data.length > 0) {
      dispatch(addData(data));
      dispatch(setData(data.slice(1, 11)));
    }
  };

  const HandleForce = () => {
    return <div>{Object.keys(storeState.uploadState.data).length === 0 ? <h1>No data yet</h1> : <TablePagination />}</div>;
  };

  return (
    <div>
      <div>
        <Button className="csv-input-btn" size="massive">
          <CSVReader
            cssClass="react-csv-input"
            inputStyle={{ display: 'none' }}
            label="Select CSV file"
            onFileLoaded={yolo}
            parserOptions={papaparseOptions}
          />
        </Button>
      </div>
      <HandleForce />
    </div>
  );
};

const Upload = () => (
  <div className="app_content">
    <Provider store={store}>
      <App />
    </Provider>
  </div>
);

export default Upload;
