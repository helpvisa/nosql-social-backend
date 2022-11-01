// checks to see if a user is already on friend list, avoiding duplicates
function checkFriend(arr, id) {
    let foundFriend = false;

    // can't break / return from a forEach? maybe standard for is better
    arr.forEach(friend => {
        if (friend.toString() === id) {
            foundFriend = true;
        }
    });

    return foundFriend;
}

// export
module.exports = { checkFriend };