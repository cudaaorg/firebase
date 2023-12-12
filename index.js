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
        return response(400).send("no data");
      }
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        jsonData = data;
      }
      logger.info(jsonData.uid, {structuredData: true});
      logger.info(jsonData, {structuredData: true});
      if (jsonData.uid) {
        const ref = admin.database().ref("user/" + jsonData.uid);
        ref.once("value", (snapshot) => {
          logger.info(snapshot.val(), {structuredData: true});
          response.send(snapshot.val());
        });
      } else {
        response(400).send("uid not found");
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
        return response(400).send("no data");
      }
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        jsonData = data;
      }
      logger.info(jsonData.uid + " " + jsonData.data, {structuredData: true});
      logger.info(jsonData, {structuredData: true});
      if (jsonData.uid) {
        const ref = admin.database().ref("user/");
        const userRef = ref.child(jsonData.uid);
        userRef.update(jsonData.data);
        return response.send("ok");
      }
      return response(400).send("uid not found");
    });
