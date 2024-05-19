export function convertToWeekday(dateString) {
	const date = new Date(dateString);
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	return days[date.getDay()];
}

export function formatLocation(locationString) {
	// Remove duplication in location name,
	// e.g Madrid, Madrid, Spain -> Madrid, Spain

	// Remove empty string
	// e.g Warsaw, , Poland -> Warsaw, Poland

	const array = locationString.split(', ');

	const uniquesArray = [...new Set(array)];

	let formated = '';
	uniquesArray.forEach((element, index) => {
		formated += element;
		if (index !== uniquesArray.length - 1 && element !== '') formated += ', ';
	});

	return formated;
}
