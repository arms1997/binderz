const signUp = function (data) {
  return $.ajax({
    method:"POST",
    url: "/api/users/register",
    data
  });
}

const logIn = function(data) {
  return $.ajax({
    method:"POST",
    url: "/api/users/login",
    data
  });
}

const logOut = function() {
  return $.ajax({
    method: "POST",
    url: "/api/users/logout"
  })
}

const updateRatingCall = function(data, newRating) {
  data.newRating = newRating
  return $.ajax({
    method: "POST",
    url: `/api/users/${data.resource.id}/rating`,
    data
  })
}

function getAllResources() {
  console.log()
}

function addResource() {
  console.log('Add resource');
  return $.ajax({
    method: "POST",
    url: "/api/resources",
    data: formContent,
  });
}

function addComment(comment,data) {
  return $.ajax({
    method: 'POST',
    url: `/api/resources/${comment['resource'].id}/comment`,
    data: data
  })
    .done(() => console.log('Comment has been added'))
    .fail(() => console.log('Comment has not been added NOOOO'))

}

function addFullHeart(resource) {

  return $.ajax({
    method: 'POST',
    url: `/api/resources/${resource['resource'].id}/liked`,
  })
    .done(() => console.log('done'))
    .fail(() => console.log('an error has occured for liking'));
}

function addEmptyHeart(resource) {

  return $.ajax({
    method: "DELETE",
    url: `/api/resources/${resource['resource'].id}/liked`,
  })
    .done(() => console.log('done'))
    .fail(() => console.log('an error has occured for unliking'));
}

function getMyDetails() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/api/users/me",
  });
}

function getAllTopics() {
  return $.ajax({
    url: "/api/resources/topics"
  })
}

const updateUser = function (newName) {
  console.log(newName, "IN THE USER CALL")
  return $.ajax({
    method: "POST",
    url: "/api/users/me",
    data: newName
  })
}
