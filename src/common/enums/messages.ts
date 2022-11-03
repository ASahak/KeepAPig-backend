export const enum SEND_EMAIL {
  SUBJECT = 'Password Recovery: KeepAPig',
  LINK = 'Click on the link to reset your password.',
}

export const enum USER {
  USER_EXIST = 'A user has already been created with this email address.',
  USER_DOES_NOT_EXIST = "User doesn't exist!",
  USER_PASSWORD_OR_EMAIL_IS_WRONG = "User e-mail or password is wrong.",
  NO_USER = 'There is no user.',
  WRONG_TOKEN = 'Token doesn\'t match',
}

export const enum HTTP_EXCEPTION {
  SENDGRID_FAILURE = 'There was an failure regarding sendgrid API',
}
