import React from 'react';

// Compare function needed by the Sort component
const compareByType =(a, b) => {
    return a.props["type"] > b.props["type"] ? 1 : a.props["type"] < b.props["type"] ? -1 : 0;
}

const compareByName =(a, b) => {
    return a.props["title"] > b.props["title"] ? 1 : a.props["title"] < b.props["title"] ? -1 : 0;
}

const compareByDefault =(a, b) => {
    return a.props["order"] - b.props["order"];
}

export const Sort = (props) => {
    if (props.by === "title") 
        return React.Children.toArray(props.children).sort(compareByName);
    else if (props.by === "type")
        return React.Children.toArray(props.children).sort(compareByType);
    else
        return React.Children.toArray(props.children).sort(compareByDefault);
}