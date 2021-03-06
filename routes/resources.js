const express = require('express');
const router  = express.Router();
const request = require('request');

module.exports = (db) => {
  router.get('/', (req, res) => {
    if (req.query.user_id) {
      req.query.user_id = req.session.userId;
    }

    db.getAllResources(req.query, 100)
      .then(resources => {
        res.json({ resources });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get('/topics', (req, res) => {
    db.getTopics()
      .then(response => res.json(response))
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get('/likedresources', (req, res) => {
    const userId = req.session.userId;

    //user needs to be logged in to see their liked resources
    if (!userId) {
      res.error('error');
      return;
    }

    db.getAllLikedResources(userId)
      .then(resources => {
        res.json({ resources });
      })
      .catch((err) => {
        console.error(err);
        res.json({ error: err.message });
      });
  });

  router.get('/:resources_id', (req, res) => {
    const userId = req.session.userId;
    const specificResource = req.params.resources_id;

    Promise.all([db.getSpecificResource(userId, specificResource), db.getComments(specificResource), db.likeCounter(specificResource)])
      .then((data) => {
        res.json({ resource: data[0], comments: data[1], likeCount: data[2] });
      })
      .catch((err) =>  {
        console.error(err);
        res.json({ error: err.message });
      });
  });

  router.get('/:resources_id/likes', (req, res) => {
    const specificResource = req.params.resources_id;

    db.likeCounter(specificResource)
      .then((data) => {
        res.json({ data });
      })
      .catch((err) => {
        console.error(err);
        res.json({ error: err.message });
      });

  });

  router.post('/', (req, res) => {
    const userId = req.session.userId;
    // user needs to be logged in to create a new resource
    if (!userId) {
      res.error('error');
      return;
    }

    db.addResource({...req.body, user_id: userId})
      .then(resource => {
        res.json({ resource });
      })
      .catch(err => {
        console.error(err);
        res.json({ error: err.message });
      });
  });


  router.post('/:resources_id/liked', (req, res) => {
    const userId = req.session.userId;
    const specificResource = req.params.resources_id;
    db.addLike(userId, specificResource)
      .then(likedResource => {
        res.json({ likedResource });
      })
      .catch(err => {
        console.error(err);
        res.json({error: err.message });
      });

  });

  router.get('/:resource_id/comments', (req, res) => {
    const resourceId = req.params.resource_id;

    db.getComments(resourceId)
      .then(comments => res.json(comments))
      .catch(err => {
        console.error(err);
        res.json({error: err.message });
      });
  });


  router.post('/:resources_id/comment', (req, res) => {
    const userId = req.session.userId;
    const specificResource = req.params.resources_id;
    const commentFromUser = req.body["comment-from-user"];
    db.addComment(userId, specificResource, commentFromUser)
      .then(comment => {
        res.json({ comment });
      })
      .catch(err => {
        console.error(err);
        res.json({ error: err.message });
      });

  });

  router.delete('/:resources_id/liked', (req,res) => {
    const userId = req.session.userId;
    const specificResource = req.params.resources_id;

    db.removeLike(userId, specificResource)
      .then(resource => {
        res.json({ resource });
      })
      .catch(err => {
        console.error(err);
        res.json({error: err.message });
      });

  });

  router.post('/urlTest', (req, res) => {
    request(`${req.body.url}`, (error, response, body) => {
      if (error) {
        res.status(500).send({error: error.message});
        return;
      }

      res.send(response);
    });
  });

  return router;
};
