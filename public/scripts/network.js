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

function getMyDetails() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/api/users/me",
  });
}
