function formatLike(value) {
  return `${value} Likes`;
}

function getUsernameFromEmail(email) {
  return email.split("@")[0].toUpperCase();
}

module.exports = { formatLike, getUsernameFromEmail };
