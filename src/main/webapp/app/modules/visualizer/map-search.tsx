import React, { useEffect, useState, useCallback } from 'react';
import { Search } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

const MapSearch = props => {
  const [searchValues, setSearchValues] = useState({
    isLoading: false,
    results: [],
    value: '',
  });

  let timeoutRef;

  const searchHandle = useCallback((e, data) => {
    clearTimeout(timeoutRef);
    setSearchValues({ ...searchValues, isLoading: true, value: data.value });
    timeoutRef = setTimeout(() => {
      if (data.value.length === 0) {
        setSearchValues({ isLoading: false, results: [], value: '' });
        return;
      }

      axios.get(`https://nominatim.openstreetmap.org/search?q=${data.value}&format=json&addressdetails=1`).then(res => {
        setSearchValues({
          ...searchValues,
          results: res.data.map((result, index) => ({
            title: result.display_name,
            id: index,
            xMin: result.boundingbox[0],
            xMax: result.boundingbox[1],
            yMin: result.boundingbox[2],
            yMax: result.boundingbox[3],
          })),
          isLoading: false,
          value: data.value,
        });
      });
    }, 300);
  }, []);

  //           title:
  //             `${result.address.road !== undefined ? `${result.address.road}, ` : ''}` +
  //             `${result.address.town !== undefined ? `${result.address.town}, ` : ''}` +
  //             `${result.address.city !== undefined ? `${result.address.city}, ` : ''}` +
  //             `${result.address.village !== undefined ? `${result.address.village}, ` : ''}` +
  //             `${result.address.neighbourhood !== undefined ? `${result.address.neighbourhood}, ` : ''}` +
  //             `${result.address.suburb !== undefined ? `${result.address.suburb}, ` : ''}`,
  //           description:
  //             `${result.address.state_district !== undefined ? `${result.address.state_district}, ` : ''}` +
  //             `${result.address.country !== undefined ? `${result.address.country}` : ''}`,
  //           id: index,

  const resultHandle = data => {
    props.map.flyToBounds(
      [
        [data.result.xMin, data.result.yMin],
        [data.result.xMax, data.result.yMax],
      ],
      {
        animate: true,
        duration: 3,
      }
    );
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef);
    };
  }, []);

  return (
    <Search
      onSearchChange={searchHandle}
      results={searchValues.results}
      loading={searchValues.isLoading}
      onResultSelect={(e, data) => resultHandle(data)}
    />
  );
};

export default MapSearch;
