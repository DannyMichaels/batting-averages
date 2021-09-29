import { useState, useMemo } from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// optimize input onChange event
const debounce = (callback, wait, timeoutId = null) => {
  const debounceFn = (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };

  debounceFn.cancel = () => window.clearTimeout(timeoutId);

  return debounceFn;
};

// css for this is in index.css
export default function AutoComplete({
  fullWidth,
  setFilterValue,
  options,
  valueProp,
  placeholder,
}) {
  const [userInput, setUserInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  // optimize to not lag with debounce
  const onChange = debounce((e) => {
    const userInput = e.target.value;

    setFilterValue(userInput); // using the setFilterValue from props, setting playerId  to e.target.value

    const newFilteredOptions = options.filter((option) =>
      option.toLowerCase().includes(userInput.toLowerCase())
    );

    setFilteredOptions(newFilteredOptions);
    setShowOptions(true);
  }, 300);

  const handleReset = () => {
    setFilterValue('');

    setFilteredOptions([]);
    setShowOptions(false);
    setUserInput('');
  };

  const handleClickOption = (e) => {
    setFilterValue(e.target.innerText);
    setFilteredOptions([]);
    setShowOptions(false);
    setUserInput(e.target.innerText);
  };

  const queriedOptions = useMemo(
    () =>
      filteredOptions.map((option, key) => (
        <li
          key={key}
          aria-label={option}
          className="autocomplete option"
          onClick={handleClickOption}>
          {option}
        </li>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredOptions]
  );

  const autoCompleteJSX = useMemo(() => {
    if (showOptions && userInput) {
      if (queriedOptions.length) {
        return <ul className="autocomplete options">{queriedOptions}</ul>;
      } else {
        return (
          <div className="autocomplete no-options">
            <em>No Option!</em>
          </div>
        );
      }
    }
  }, [queriedOptions, userInput, showOptions]);

  return (
    <>
      <div className="autocomplete search">
        <Input
          fullWidth={fullWidth ? true : false}
          type="text"
          className="autocomplete search-box"
          onChange={(e) => {
            // set user input before onChange because onchange uses debounce and debounce can't access e.target
            setUserInput(e.currentTarget.value);
            onChange(e);
          }}
          value={userInput || ''}
          placeholder={placeholder}
          endAdornment={
            valueProp ? (
              <InputAdornment position="end">
                <IconButton onClick={handleReset}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }
        />
      </div>
      {autoCompleteJSX}
    </>
  );
}
