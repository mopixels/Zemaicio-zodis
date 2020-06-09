import { CHANGE_SEARCH_FIELD,
        CHANGE_INPUT_LANGUAGE,
        CHANGE_DISPLAY_LANGUAGE,
     } from '../constants';

export const setSearchField = (text) => ({
    type: CHANGE_SEARCH_FIELD,
    payload: text
})

export const setInputLanguage = (value) => ({
    type: CHANGE_INPUT_LANGUAGE,
    payload: value
})

export const setDisplayLanguage = (value) => ({
    type: CHANGE_DISPLAY_LANGUAGE,
    payload: value
})