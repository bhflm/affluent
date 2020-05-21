exports.prepareUsersRawData = rawData =>
  rawData.map(each => {
    const userValues = Object.values(each);
    // User ID is the first value, and as is already
    // settled as autoincremental @ the db, we do not need it
    return userValues.slice(1, userValues.length);
  });

exports.prepareMetricsData = data => data.split('\t');
