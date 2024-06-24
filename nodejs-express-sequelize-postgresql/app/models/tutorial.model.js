module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    },
    date: {
      type: Sequelize.DATE
    },
    APR: {
      type: Sequelize.STRING
    },
    MAY: {
      type: Sequelize.STRING
    },
    JUN: {
      type: Sequelize.STRING
    },
    JUL: {
      type: Sequelize.STRING
    },
    AUG: {
      type: Sequelize.STRING
    },
    SEP: {
      type: Sequelize.STRING
    },
    OCT: {
      type: Sequelize.STRING
    },
    NOV: {
      type: Sequelize.STRING
    },
    DEC: {
      type: Sequelize.STRING
    },
    JAN: {
      type: Sequelize.STRING
    },
    FEB: {
      type: Sequelize.STRING
    },
    MAR: {
      type: Sequelize.STRING
    }
  });

  return Tutorial;
};
