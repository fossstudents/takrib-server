const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Event Schema
 * @private
 */
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 255,
    required: true,
    index: true,
    trim: true,
  },
  description: {
    type: String,
    index: true,
    required: true,
    trim: true,
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    maxlength: 255,
    index: true,
    trim: true,
  },
  org_name: {
    type: String,
    maxlength: 255,
    index: true,
    trim: true,
  },
  org_description: {
    type: String,
    index: true,
    trim: true,
  },
  code_of_conduct: {
    type: String,
    index: true,
    trim: true,
  },
  logo_url: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  banner_url: {
    type: String,
    maxlength: 255,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - virtuals
 */
eventSchema.pre('save', async (next) => {
  try {
    // todo
    console.log('pre-save hook event');
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
eventSchema.method({
  transform() {
    const transformed = {};
    const fields = ['name', 'description', 'startdate', 'enddate', 'location', 'org_name', 'org_description', 'code_of_conduct', 'logo_url', 'banner_url', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
eventSchema.statics = {

  /**
     * Get event
     *
     * @param {ObjectId} id - The objectId of event.
     * @returns {Promise<Event, APIError>}
     */
  async get(id) {
    try {
      let event;

      if (mongoose.Types.ObjectId.isValid(id)) {
        event = await this.findById(id).exec();
      }
      if (event) {
        return event;
      }

      throw new APIError({
        message: 'Event does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
     * List events in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of events to be skipped.
     * @param {number} limit - Limit number of events to be returned.
     * @returns {Promise<Event[]>}
     */
  list({
    page = 1, perPage = 20, name, description, startdate, enddate,
  }) {
    const options = omitBy({
      name, description, startdate, enddate,
    }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Event
 */
module.exports = mongoose.model('Event', eventSchema);
