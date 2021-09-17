import { useState, Children } from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// css for this is in index.css

export default function AutoComplete({
  fullWidth,
  handleChange,
  options,
  valueProp,
  displayKey,
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

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(userInput.toLowerCase())
    );

    setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value,
    });
  };

  const handleReset = () => {
    handleChange('');

    setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: '',
    });
  };

  const handleClickOption = (e) => {
    handleChange(e.currentTarget.innerText);

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
        onClick={handleClickOption}>
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
          value={valueProp || ''}
          placeholder={placeholder}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleReset}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
      {autoCompleteJSX}
    </>
  );
}
