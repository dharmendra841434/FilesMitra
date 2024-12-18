export function sortObjectsByName(arr) {
  return arr.sort((a, b) => {
    if (a.folderName.toLowerCase() < b.folderName.toLowerCase()) {
      return -1;
    }
    if (a.folderName.toLowerCase() > b.folderName.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}

export function addEllipsis(str, maxLength) {
  if (str?.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  } else {
    return str;
  }
}

export function removeWordFromPath(path, word) {
  // Construct the suffix to remove ("/" + word)
  const suffix = '/' + word;

  // Check if the input path ends with the specified suffix
  if (path.endsWith(suffix)) {
    // Remove the suffix from the end of the path
    return path.slice(0, -suffix.length);
  }
  // Return the path unchanged if it does not end with the suffix
  return path;
}

export function getPrevFolderPath(path) {
  // Find the index of the last slash in the path
  const lastSlashIndex = path.lastIndexOf('/');

  // If a slash is found, remove the last segment
  if (lastSlashIndex !== -1) {
    return path.slice(0, lastSlashIndex);
  }

  // If no slash is found, return the path unchanged
  return path;
}

export function toggleArrayItem(array, item) {
  const index = array.indexOf(item);
  if (index === -1) {
    // Item not in the array, so add it
    array.push(item);
  } else {
    // Item already in the array, so remove it
    array.splice(index, 1);
  }
  return array;
}
export function convertDate(dateString) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Parse the input date string
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Return the formatted date
  return `${day} ${month} ${year}`;
}

export function isImageFile(filename) {
  // Define valid image extensions
  const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'tiff',
    'svg',
  ];

  // Extract the file extension
  const extension = filename.split('.').pop().toLowerCase();

  // Check if the extension is in the list of image extensions
  return imageExtensions.includes(extension);
}
