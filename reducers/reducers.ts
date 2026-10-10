import { CHANGE_SEARCH_FIELD,
         CHANGE_INPUT_LANGUAGE,
         CHANGE_DISPLAY_LANGUAGE,
        } from '../constants';
import type { Language } from '../types';

type SearchAction = { type: typeof CHANGE_SEARCH_FIELD; payload: string };
type InputLanguageAction = { type: typeof CHANGE_INPUT_LANGUAGE; payload: boolean };
type DisplayLanguageAction = { type: typeof CHANGE_DISPLAY_LANGUAGE; payload: Language };

const initialState = {
    searchField: '',
}

    export const searchDictionary = (state = initialState, action: SearchAction) => {
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

    export const inputLanguage = (state = inputLanguageState, action: InputLanguageAction) => {
        switch (action.type) {
            case CHANGE_INPUT_LANGUAGE:
                return { ...state, isZmt: action.payload };
            default: 
                return state;
        }
    }

const selectedLanguage: { language: Language } = {
    language: 'zmt',
}

    export const displayLanguage = (state = selectedLanguage, action: DisplayLanguageAction) => {
        switch (action.type) {
            case CHANGE_DISPLAY_LANGUAGE:
                return { ...state, language: action.payload };
            default: 
                return state;
        }
    }
