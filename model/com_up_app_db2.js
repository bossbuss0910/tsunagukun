var Sequelize = require ('sequelize');
var sequelize = new Sequelize('com_up_app', 'root', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
});

var User = sequelize.define('slack_line_ids', {
  slack_id: {
    type: Sequelize.STRING
  },
  line_id: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  }
}, {
    freezeTableName: true
   }
);
User.sync();

exports.User = User;
