const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('123456789', 9);

module.exports = {
  nanoid
}