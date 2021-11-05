import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './upload-reducer';

const LeftMenu = () => {
  const dispatch = useDispatch();
  const activeItem = useSelector((state: Actions.RootState) => state.uploadState.activeMenu);

  return (
    <div>
      <Menu vertical fluid>
        <Menu.Item
          name="New Dataset"
          active={activeItem === 'New Dataset'}
          onClick={() => {
            dispatch(Actions.setMenuItem('New Dataset'));
            activeItem !== 'New Dataset' && dispatch(Actions.addData([]));
            dispatch(Actions.setEditbutton(false));
          }}
        />
        <Menu.Item
          name="Open Dataset"
          active={activeItem === 'Open Dataset'}
          onClick={() => {
            dispatch(Actions.setMenuItem('Open Dataset'));
            activeItem !== 'Open Dataset' && dispatch(Actions.addData([]));
            dispatch(Actions.fetchEntitiesList());
          }}
        />
      </Menu>
    </div>
  );
};

export default LeftMenu;