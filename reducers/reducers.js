import { CHANGE_SEARCH_FIELD,
         CHANGE_INPUT_LANGUAGE,
         CHANGE_DISPLAY_LANGUAGE,
        } from '../constants';

const initialState = {
    searchField: '',
}

    export const searchDictionary = (state = initialState, action) => {
        switch(action.type) {
            case CHANGE_SEARCH_FIELD: 
                return  { ...state, searchField: action.payload }
            default: 
                return state;
        }
    }

const inputLanguageState = {
    isZmt: true,
}

    export const inputLanguage = (state=inputLanguageState, action) => {
        switch (action.type) {
            case CHANGE_INPUT_LANGUAGE:
                return { ...state, isZmt: action.payload };
            default: 
                return state;
        }
    }

const selectedLanguage = {
    language: 'zmt',
}

    export const displayLanguage = (state = selectedLanguage, action) => {
        switch (action.type) {
            case CHANGE_DISPLAY_LANGUAGE:
                return { ...state, language: action.payload };
            default: 
                return state;
        }
    }