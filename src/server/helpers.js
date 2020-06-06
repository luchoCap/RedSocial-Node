const moment = require('moment') //biblioteca moment
const helpers = {};

helpers.timeago = timestamp => {
    return moment(timestamp).startOf('minute').fromNow();//desde el momento en que se publico te devuelve el tiempo
};

module.exports = helpers;