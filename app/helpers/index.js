const transformJSDateToMYSQL = jsDate => new Date(Date.parse(jsDate)).toISOString().slice(0, 19).replace('T', ' ');

exports.prepareUsersRawData = rawData =>
  rawData.map(each => {
    const userValues = Object.values(each);
    // User ID is the first value, and as is already
    // settled as autoincremental @ the db, we do not need it
    return userValues.slice(1, userValues.length);
  });

exports.prepareMetricsData = data => {
	const row = data.split('\t');
	return [
		transformJSDateToMYSQL(row[0]),
		row[1].replace('$',''),
		row[2],
		row[3],
		row[4],
		row[5].replace('$',''),
		row[6],
		row[7].replace('%','')
	];
};
