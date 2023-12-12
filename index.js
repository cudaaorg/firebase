/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
// const functions = require('firebase-functions');
const admin = require("firebase-admin");
// const express = require('express');
// const functions = require("firebase-functions");

admin.initializeApp();

// const app = express();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Parun!");
});

exports.doQuery = onRequest({cors: [/webflow\.io$/]}
    , (request, response) => {
      logger.info(request.body, {structuredData: true});
      const data = request.body;
      if (!data) {
        const result = {
          error: "no data",
        };
        return response(400).send(result);
      }
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        jsonData = data;
      }
      logger.info(jsonData.collection + " " + jsonData.key,
          {structuredData: true});
      if (jsonData.collection && jsonData.key) {
        const ref = admin.database().ref(jsonData.collection+"/"+jsonData.key);
        ref.once("value", (snapshot) => {
          logger.info(snapshot.val(), {structuredData: true});
          const result = {
            key: jsonData.key,
            data: snapshot.val(),
          };
          response.send(result);
        });
      } else {
        const result = {
          error: "key not found",
        };
        response(400).send(result);
      }
      return;
    });

//  exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
//  const {uid, email, displayName, nickName} = user;
//  logger.info("User Created " + uid + " " + email + " " + displayName +
//  " " + nickName, {structuredData: true});
//  });

exports.doSetQuery = onRequest({cors: [/webflow\.io$/]}
    , (request, response) => {
      const data = request.body;
      if (!data) {
        const result = {
          error: "no data",
        };
        return response(400).send(result);
      }
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        jsonData = data;
      }
      logger.info(jsonData.collection + " " + jsonData.key,
          {structuredData: true});
      if (jsonData.collection && jsonData.key) {
        const ref = admin.database().ref(jsonData.collection+"/"+jsonData.key);
        ref.update(jsonData.data).then(() => {
          const result = {
            error: "no error",
          };
          response.send(result);
        }).catch((err) => {
          const result = {
            error: err,
          };
          response.send(result);
        });
      } else {
        const result = {
          error: "key not found",
        };
        response(400).send(result);
      }
      return;
    });
