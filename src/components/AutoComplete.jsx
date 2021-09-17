import { useState, Children } from 'react';
import Input from '@mui/material/Input';

export default function AutoComplete({
  fullWidth,
  handleChange,
  options,
  valueProp,
  displayKey,
  valueKey,
  placeholder,
}) {
  const [state, setState] = useState({
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: '',
  });

  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    handleChange(userInput); // using the handleChange from props, setting name to e.target.value

    const filteredOptions = options.filter((option) => {
      // prettier-ignore
      const filterOption = typeof option === 'string' ? option : option[displayKey];
      return filterOption?.toLowerCase().indexOf(userInput.toLowerCase()) > -1;
    });

    this.setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value,
    });
  };

  const onClick = (e) => {
    handleChange(e.currentTarget.innerText, e.currentTarget.id);

    setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText,
    });
  };

  const { filteredOptions, showOptions, userInput } = state;

  const queriedOptions = Children.toArray(
    filteredOptions.map((option) => (
      <li
        aria-label={option[displayKey]}
        className="autocomplete option"
        onClick={onClick}
        id={typeof option === 'string' ? option : option[valueKey]}>
        {typeof option === 'string' ? option : option[displayKey]}
      </li>
    ))
  );

  let autoCompleteJSX;
  if (showOptions && userInput) {
    if (filteredOptions.length) {
      autoCompleteJSX = (
        <ul className="autocomplete options">{queriedOptions}</ul>
      );
    } else {
      autoCompleteJSX = (
        <div className="autocomplete no-options">
          <em>No Option!</em>
        </div>
      );
    }
  }
  return (
    <>
      <div className="autocomplete search">
        <Input
          fullWidth={fullWidth ? true : false}
          type="text"
          className="autocomplete search-box"
          onChange={onChange}
          value={valueProp}
          placeholder={placeholder}
        />
      </div>
      {autoCompleteJSX}
    </>
  );
}
