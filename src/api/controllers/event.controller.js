const httpStatus = require('http-status');
const Event = require('../models/event.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load event and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const event = await Event.get(id);
    req.locals = { event };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get event
 * @public
 */
exports.get = (req, res) => res.json(req.locals.event.transform());

/**
 * Create new event
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(httpStatus.CREATED);
    res.json(savedEvent.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Replace existing event
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { event } = req.locals;
    const newEvent = new Event(req.body);
    const newEventObject = newEvent.toObject();
    await event.update(newEventObject, { override: true, upsert: true });
    const savedEvent = await Event.findById(event._id);

    res.json(savedEvent.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Update existing event
 * @public
 */
exports.update = (req, res, next) => {
  const event = Object.assign(req.locals.event, req.body);
  event.save()
    .then(savedEvent => res.json(savedEvent.transform()))
    .catch(e => next(e));
};

/**
 * Get event list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const events = await Event.list(req.query);
    const transformedEvents = events.map(event => event.transform());
    res.json(transformedEvents);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event
 * @public
 */
exports.remove = (req, res, next) => {
  const { event } = req.locals;

  event.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
