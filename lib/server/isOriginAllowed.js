const { parse } = require("url");

const isString = s => {
  return typeof s === "string" || s instanceof String;
};

const isOriginAllowed = (origin, allowedOrigin) => {
  if (Array.isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  } else if (isString(allowedOrigin)) {
    return parse(origin).hostname === parse(allowedOrigin).hostname;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  } else {
    return !!allowedOrigin;
  }
};

module.exports = isOriginAllowed;
