"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
/**
 * @description = This is the sport schema
 * The full description of each property is referenced in the Sport interface
 */
var sportSchema = new mongoose_1.Schema({
    // This is the name of the sport
    name: {
        type: String,
        required: true
    },
    // These are the details for the game modes for each sport such as "1v1", "2v2", etc., also contains the minimum players required and maximum players required for each game mode under a specific sport
    gameModes: [{
            modeNames: {
                type: String,
                required: true,
                "default": "1V1"
            },
            requiredPlayers: {
                type: Number,
                required: true,
                "default": 2
            }
        }],
    // This is where we keep records for leaderboard purposes
    records: [{
            playerName: String,
            win: Number,
            lose: Number,
            draw: Number,
            unfinished: Number
        }]
});
/**
 * @description
 * The model for the Sport collection.
 */
var SportModel = mongoose_1.models["sports"] || (0, mongoose_1.model)("sports", sportSchema);
exports["default"] = SportModel;
