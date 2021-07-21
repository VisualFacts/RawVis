import React from 'react';
import CSVReader from 'react-csv-reader';
import 'semantic-ui-css/semantic.min.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { addData } from './redux/actions/add';
import { setData } from './redux/actions/set';
import { TablePagination } from './components/Table';
import { store } from './redux/store';

const App = () => {
  const dota = useSelector(state => state);
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
        {Object.keys(dota.data).length === 0 ? <p>No data yet</p> : <TablePagination state={dota} />}
        <button
          onClick={() => {
            dispatch(addData(doi));
            dispatch(setData(doi.slice(1, 10)));
          }}
        >
          Show Table
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
