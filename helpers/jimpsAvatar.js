const Jimp = require('jimp');

const jimpsAvatar = async path => {
  const avatar = await Jimp.read(path);
  await avatar.resize(250, 250).writeAsync(path);
};

module.exports = { jimpsAvatar };