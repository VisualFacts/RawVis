const pageStateReducer = (state = 1, action) => {
  switch (action.type) {
    case 'SET_NUMBER':
      return (state = action.payload);
    default:
      return state;
  }
};

export default pageStateReducer;
