const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());
const hotDevClientPath = require.resolve('react-dev-utils/webpackHotDevClient');

function entryWithApp(entry) {
  if (typeof entry === 'string') {
    if (path.isAbsolute(entry)) {
      return entry;
    }
    return path.resolve(appDirectory, entry);
  } else if (Array.isArray(entry)) {
    return entry.map((file) => entryWithApp(file));
  }
}

function unshiftEntryChunk(entry, chunk) {
  if (typeof entry === 'string') {
    return [chunk, entry];
  } else if (Array.isArray(entry)) {
    return [chunk, ...entry];
  }
}

function enhanceEntries(entries, chunk) {
  const hotEntries = {};

  Object.keys(entries).forEach((key) => {
    hotEntries[key] = unshiftEntryChunk(entries[key], chunk);
  });

  return hotEntries;
}

module.exports = (entry) => {
  // 需要区分项目类型，新版的项目直接返回 src/index.js
  let entries = {};
  if (Array.isArray(entry) || typeof entry === 'string') {
    entries = {
      index: entryWithApp(entry),
    };
  } else {
    Object.keys(entry).forEach((key) => {
      entries[key] = entryWithApp(entry[key]);
    });
  }
  if (process.env.NODE_ENV !== 'production') {
    entries = enhanceEntries(entries, hotDevClientPath);
  }  
  //.log(process.env.NODE_ENV,'23131--midd',entries);
  return entries;
};