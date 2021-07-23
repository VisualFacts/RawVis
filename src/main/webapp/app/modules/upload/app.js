import React from 'react';
import CSVReader from 'react-csv-reader';
import 'semantic-ui-css/semantic.min.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { addData } from './redux/actions/add';
import { setData } from './redux/actions/set';
import { TablePagination } from './components/Table';
import { store } from './redux/store';
import './css/styles.css';

const App = () => {
  const storeState = useSelector(state => state);
  const dispatch = useDispatch();
  let doi;

  const papaparseOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
  };

  const HandleForce = (data, fileInfo) => {
    doi = data;

    return (
      <div>
        {Object.keys(storeState.data).length === 0 ? <p>No data yet</p> : <TablePagination state={storeState} />}
        <button
          onClick={() => {
            if (storeState.data !== data) {
              dispatch(addData(doi));
              dispatch(setData(doi.slice(1, 11)));
            }
          }}
        >
          Show Table<i class="table"></i>
        </button>
      </div>
    );
  };

  return (
    <div>
      <CSVReader cssClass="react-csv-input" label="Select CSV " onFileLoaded={HandleForce} parserOptions={papaparseOptions} />
      <HandleForce />
    </div>
  );
};

const Reader = () => (
  <div className="container">
    <Provider store={store}>
      <App />
    </Provider>
  </div>
);

export default Reader;
