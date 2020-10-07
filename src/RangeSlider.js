import React, { Component } from "react";
import RangeSlider from 'react-bootstrap-range-slider';
 
const RangeSlider = () => {
 
  const [ value, setValue ] = useState(50); 
 
  return (
    <RangeSlider
      value={value}
      onChange={changeEvent => setValue(changeEvent.target.value)}
      tooltipLabel={currentValue => `${currentValue}%`}
      tooltip='on'

    />
  );
 
};

export default RangeSlider;
