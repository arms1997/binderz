const signUp = function (data) {
  return $.ajax({
    method:"POST",
    url: "/api/users/me",
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
