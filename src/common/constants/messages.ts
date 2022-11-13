import { VALIDATORS } from '@/common/constants';

export const SEND_EMAIL = {
  SUBJECT: 'Password Recovery: KeepAPig',
  LINK: 'Click on the link to reset your password.',
};

export const USER = {
  USER_EXIST: 'A user has already been created with this email address.',
  USER_DOES_NOT_EXIST: "User doesn't exist!",
  USER_PASSWORD_OR_EMAIL_IS_WRONG: 'User e-mail or password is wrong.',
  NO_USER: 'There is no user.',
  WRONG_TOKEN: "Token doesn't match",
};

export const HTTP_EXCEPTION = {
  SMTH_WRONG: 'Something went wrong.',
  SENDGRID_FAILURE: 'There was an failure regarding sendgrid API',
};

export const VALIDATIONS = {
  FULL_NAME_IS_REQUIRED: 'FullName is required',
  FULL_NAME_MIN: `FullName must contain at least ${VALIDATORS.NAME.min} characters.`,
  FULL_NAME_MAX: `Full name must contain max ${VALIDATORS.NAME.max} characters.`,
  FULL_NAME_ONLY_LATIN_PATTERN: 'FullName can only contain latin letters.',
  FULL_NAME_PATTERN: 'Please write your name in format: John_Doe',
  EMAIL_IS_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Email is not valid.',
  TOKEN_IS_NOT_BE_EMPTY: 'You should pass a token',
  PASSWORD_ONLY_LATIN_CHARACTERS: 'Password can only contain Latin letters.',
  PASSWORD_SYMBOL_REQUIRED: 'Password must contain at least one symbol.',
  PASSWORD_DIGIT_REQUIRED: 'Password must contain at least one digit.',
  PASSWORD_LOWERCASE_UPPERCASE_REQUIRED:
    'Password must contain at least one uppercase and one lowercase character.',
  PASSWORD_IS_NOT_BE_EMPTY: 'Password should not be empty.',
  PASSWORD_HAS_MIN: `Password should has min ${VALIDATORS.PASSWORD.min} characters.`,
  PASSWORD_HAS_MAX: `Password should not has more than ${VALIDATORS.PASSWORD.max} characters.`,
};
