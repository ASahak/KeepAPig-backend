export default {
  NAME: {
    min: 3,
    max: 30,
    pattern: /.*?([a-zA-Z0-9]+)_([a-zA-Z0-9]+).*/,
    onlyLatinPattern: /[a-zA-Z]/,
  },
  PASSWORD: {
    min: 8,
    max: 20,
    passwordAZ: /[a-zA-Z]/,
    passwordValidatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*\\-\\_\\?])(?=.{8,20})/,
    upperCaseLowerCasePattern: /([a-z].*[A-Z])|([A-Z].*[a-z])/,
    digitPattern: /\d+/i,
    symbolPattern: /^(?=.*[!@#\\$%\\^&\\*\\-\\_\\?])/i
  },
  EMAIL: {
    max: 255,
    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i
  }
};
