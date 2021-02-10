$(function () {
  $( window ).resize(() => {
    imagesLoaded(document.querySelector('#main-container'), function(){
      masonaryResize()
    })
  })

  const masonaryResize = function(){
    const $masonary = $('#main-container');
    const $masonaryBrick = $('.block');
    const $viewportWidth = $(window).width();

    let masonaryHeight = 0;

    for(let i = 0; i < $masonaryBrick.length; i++){
      masonaryHeight += $masonaryBrick[i].offsetHeight + 15;
    }

    if($viewportWidth >= 1024){
      console.log(1024)
      $masonary.height(masonaryHeight/4 + masonaryHeight/($masonaryBrick.length +1))
    }else if($viewportWidth < 1024 && $viewportWidth >= 800){
      console.log(800)
      $masonary.height(masonaryHeight/3 + masonaryHeight/($masonaryBrick.length +1))
    }else{
      console.log('<800')
      $masonary.height(masonaryHeight/2 + masonaryHeight/($masonaryBrick.length +1))
    }
  }

  window.masonaryResize = masonaryResize

  const createResource = function (resource) {
    let resourceHTML = `
      <div class="block">
        <div class="img-container">
          <img src="${resource.image_src}" />
          <a href= "${resource.url}">
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
        <div class="content">
          <p>${resource.title}</p>
        </div>
      </div>
    `;

    return resourceHTML;
  }
  window.masonaryResize = masonaryResize;
  const createModalResource = function (resourceObj) {

    let modalResourceHTML = `
      <div class="modal-resource-content">
        <div class="left-container">
          <div class="modal-img-show">
            <img id="resource-img" src="${resourceObj["resource"].image_src}" alt="" />
          </div>
          <div class="below-img">
            <div class="likes">
              <a>COUNTER</a>
            </div>
            <div class="rating">
              <span id="1" class="fa fa-star"></span>
              <span id="2" class="fa fa-star"></span>
              <span id="3" class="fa fa-star"></span>
              <span id="4" class="fa fa-star"></span>
              <span id="5" class="fa fa-star"></span>
            </div>
          </div>
        </div>
        <div class="view-resource-info">
          <div class="view-title">
            <span>${resourceObj["resource"].title}</span>
          </div>
          <div class="view-description">
            <a><p>
            ${resourceObj["resource"].description}
            </p></a>
          </div>
          <div class="add-comment-form">
            <form class="add-comment method="POST" action="/api/resources">
              <label for="add-comment">Add Comment</label>
              <input class ="form-control" type="text" name="comment-from-user" placeholder="Enter comment here" required />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div class="view-comments">
            <h3>Comments</h3>
            <div class="comments">
            </div>
          </div>
        </div>
        <span class="modal-resource-close">X</span>
      </div>
    `;

    return modalResourceHTML;
  }

//render the base modal without comments
  const renderModal = function(resource) {
    $('.modal-bg1').empty();
    const newModal = createModalResource(resource);
    $('.modal-bg1').append(newModal);

    $(".modal-resource-close").on("click", function() {
      console.log(resource)
      updateRatingCall(resource, currentRating)
      .then(() => {
        console.log('here')
        $(".modal-bg1").removeClass("bg-active");
        $('.img-container').removeClass('change-order')
      })
      .catch((err) => console.log(err))
    })

    let currentRating;
    $('#1').on('click', function () {
      ratings(1);
      currentRating = 1;
    })
    $('#2').on('click', function () {
      ratings(2);
      currentRating = 2;
    })
    $('#3').on('click', function () {
      ratings(3)
      currentRating = 3;
    })
    $('#4').on('click', function () {
      ratings(4)
      currentRating = 4;
    })
    $('#5').on('click', function () {
      ratings(5)
      currentRating = 5;
    })



  }
  //render comments ontop of base modal
  const loadComments = function(commentsObj) {

    for (const comm of commentsObj["comments"]) {

      const newComment = `
      <div class="comment">
        <p class="user-name">${comm.name}</p>
        <p>${comm.comment}</p>
      </div>
      `;

      $('.comments').prepend(newComment);

    }

    $('.add-comment').on('submit', function(event) {

      event.preventDefault();
      $.ajax({
        method: 'POST',
        url: `/api/resources/${commentsObj['resource'].id}/comment`,
        data: $(this).serialize()
      })
        .done(() => console.log('comment has been added'))
        .fail(() => console.log("comment has not been added NOOOO"))
    })

  }

  const loadLikeStatus = function(resourceObj) {

    if (!resourceObj["resource"].likes) {
      $('.likes').append('<i id="heart-btn" class="far fa-heart fa-2x"></i>');
    } else {
      $('.likes').append('<i id="heart-btn" class="fas fa-heart fa-2x"></i>');
    }

    $('#heart-btn').on("click", function() {
      console.log('resourceObj', resourceObj)
      if ($('#heart-btn').hasClass('far')) {
        $.ajax({
          method: 'POST',
          url: `/api/resources/${resourceObj['resource'].id}/liked`,
        })
          .done(() => console.log('done'))
          .fail(() => console.log('an error has occured for liking'));

        $('#heart-btn').attr('class', 'fas fa-heart fa-2x');

      } else if ($('#heart-btn').hasClass('fas')) {

        $.ajax({
          method: "DELETE",
          url: `/api/resources/${resourceObj['resource'].id}/liked`,
        })
          .done(() => console.log('done'))
          .fail(() => console.log('an error has occured for unliking'));

        $('#heart-btn').attr('class', 'far fa-heart fa-2x');
      }

    })

  }

  function loadResources () {
    $.ajax({
      url: '/api/resources',
      method: 'GET'
    })
      .done((data) => {
        renderResources(data.resources);
        imagesLoaded(document.querySelector('#main-container'), function(){
          masonaryResize()
        })
      })
      .fail(() => console.log('An error has occurred'))
      .always(() => console.log('Succesful request'));
  }

  window.loadResources = loadResources;

  const renderResources = function(resources){
    $('#main-container').empty();

    for (let resource of resources) {
      const newResource = createResource(resource);

      $('#main-container').prepend(newResource);
      $('#main-container .block').first().data(resource)
    }

    $('.block').on('click', function(){
      const data = $(this).data()
      $('.modal-bg1').addClass('bg-active');
      $('.img-container').addClass('change-order');
      $.ajax({
        url: `/api/resources/${data.id}`,
        method: 'GET'
      })
        .done((data) => {
          console.log('data', data);
          renderModal(data);
          loadComments(data);
          loadLikeStatus(data);
          loadCurrentRating(data);
        })
        .fail(() => console.log('an error has occured'))
        .always(() => console.log("successful request of modal"));
    })
    masonaryResize();
  }

  window.renderResources = renderResources

  loadResources();

  const createTopicHTML = (topic) => {
    const topicHTML = `
      <option value="${topic.id}">${topic.topic}</option>
    `
    return topicHTML;
  }

  const renderTopics = (topics) => {
    for(let topic of topics){
      const newTopic = createTopicHTML(topic);

      $('#topic option:eq(0)').after(newTopic)
      $('#resource-modal-topic option:eq(0)').after(newTopic)
    }
  }

  const loadTopics = () => {
    getAllTopics()
    .done(res => renderTopics(res))
    .fail(err => console.error(err))
  }

  loadTopics();
})
