import translation from '../translation';

export const GET = 'TRANSLATION_GET';
export const PENDING = 'PENDING';
export const FRENCH = 'TRANSLATION_FRENCH';
export const ENGLISH = 'TRANSLATION_ENGLISH';

export const pending = () => ({
  type: PENDING,
});

export const displayTranslation = () => ({
  type: GET,
  payload: translation,
});

export const toFrench = () => ({
  type: FRENCH,
  payload: translation,
});

export const toEnglish = () => ({
  type: ENGLISH,
  payload: translation,
});
