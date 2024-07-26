import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize


const Kosts = db.define('kosts', {
    place_name: {
        type: DataTypes.STRING
    },
    owner: {
        type: DataTypes.STRING
    },
    contact: {
        type: DataTypes.INTEGER
    },
    price: {
        type: DataTypes.DOUBLE
    },
    rating: {
        type: DataTypes.DOUBLE
    },
    description: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.STRING
    },
});

export default Kosts;
