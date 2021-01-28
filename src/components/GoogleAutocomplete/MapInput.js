import React from 'react';
import { Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

function MapInput(props) {
    return (

        <GooglePlacesAutocomplete
            placeholder='Search'
            placeholderTextColor="#000"
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key 
            listViewDisplayed={null}    // true/false/undefined
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                props.notifyChange(details.geometry.location);
            }}

            query={{
                key: 'AIzaSyB12tR2B1s4TGPG5zwoJ-w1MEH3gh-FLuU',
                language: 'vi',
                components: 'country:vi',
            }}
            textInputProps={{
                onFocus: props.focus,
                onBlur: props.blur,
                placeholderTextColor: 'gray',
                numberOfLines: 1,
                selection: props.selection,
                autoCorrect: false
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={300}
            styles={{
                textInput: {
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                },
                predefinedPlacesDescription: {
                    color: '#1faadb',
                },
            }}
        />
    );
}
export default MapInput;