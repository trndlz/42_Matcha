import React from 'react';
import Autosuggest from 'react-autosuggest';
import {Link} from 'react-router-dom';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function renderSectionTitle(section) {
  return (
    <strong></strong>
  );
}

function getSectionSuggestions(section) {
  return section.options;
}

export class BwmAutocomplete extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };    
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    this.onSuccess(newValue)
  };
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuccess(value){
    const {input: {onChange}} = this.props;
    onChange(value);
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('^' + escapedValue, 'i');
  
    return this.props.groupedOptions
      .map(section => {
        return {
          title: section.title,
          options: section.options.filter(option => regex.test(option.label))
        };
      })
      .filter(section => section.options.length > 0);
  }

  renderSuggestion = (suggestion) =>{
    if (suggestion.profile_img){
      return (
        <Link to={`/profile/${suggestion.label}`}>
            {/* <img  src={imgPath(suggestion.profile_img)} alt="profile_img" /> */}
          <span>{suggestion.label}</span>
        </Link>
      );
    }
    else{
      return (
          <span>{suggestion.label}</span>
      );
    }
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Search ...",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest 
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps} />
    );
  }
}