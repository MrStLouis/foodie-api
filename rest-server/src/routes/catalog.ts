import * as express from 'express';
import isLoggedIn from '../middleware/isLoggedIn';
import { getRestaurant, postRestaurant } from '../serverControllers/restaurantController';
import { getRecipe, postRecipe } from '../serverControllers/recipeController';
import { getUser, postUser, postComment } from '../serverControllers/userController';
import { getSubscriptions, postSubscription, isSubscribed, delSubscription } from "../serverControllers/subscriptionController";
import { getPosts } from '../serverControllers/postController';

const router = express.Router();

router.route('/restaurants')
  .get(getRestaurant)
  .post(isLoggedIn, postRestaurant)

router.route('/recipes')
  .get(getRecipe)
  .post(isLoggedIn, postRecipe)

router.route('/users')
  .get(getUser)
  .post(isLoggedIn, postUser)

router.route('/subscriptions')
  .get(getSubscriptions)
  .post(isLoggedIn, postSubscription);

router.post('/unsubscribe', delSubscription);

router.get('/isSubbed', isSubscribed);

router.get('/posts', getPosts);
router.post('/comment', postComment);

export default router;
