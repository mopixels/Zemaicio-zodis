import { CHANGE_SEARCH_FIELD,
        CHANGE_INPUT_LANGUAGE,
        CHANGE_DISPLAY_LANGUAGE,
     } from '../constants';
import type { Language } from '../types';

export const setSearchField = (text: string) => ({
    type: CHANGE_SEARCH_FIELD,
    payload: text
})

export const setInputLanguage = (value: boolean) => ({
    type: CHANGE_INPUT_LANGUAGE,
    payload: value
})

export const setDisplayLanguage = (value: Language) => ({
    type: CHANGE_DISPLAY_LANGUAGE,
    payload: value
})
