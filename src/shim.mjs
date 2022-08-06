export {DurableObjectExample} from "./index"
  
export default {
  async fetch(request, env /*, ctx*/) {
    //Response class must be a promise
    try {
      if (request.method === "OPTIONS")
        return new Response(`preflight response for POST`, {
          status: 200,
          message: `preflight response for POST`,
          headers: {
            "Access-Control-Allow-Headers": [
              //"Access-Control-Allow-Origin",
              "Access-Control-Allow-Methods",
              "Content-Type"
              //"Origin",
              //"X-Requested-With",
              //"Accept"
            ],
            "Access-Control-Allow-Methods": ["POST", "OPTIONS"]
          }
        });
      return await noException(request, env);
      // wrap the body of your callback in a try/catch block to ensure it cannot throw an exception.
      // is return, "the body?"
    } catch (e) {
      return new Response(e.message);
    }
  }
};
const noaccess = (origin) =>
  new Response(
    JSON.stringify(`{error:${"no access for this origin- " + origin}}`),
    {
      status: 400,
      message: "no access for this origin: " + origin
      //headers: { "Content-Type": "application/json" }
    }
  );
async function noException(req, env) {
  // key => Object ID; return new Response(JSON.stringify(backbank));
  // boot instance, if necessary //https://<worker-name>.<your-namespace>.workers.dev/
  //https://linc.sh/blog/durable-objects-in-production
  //const clientId = request.headers.get("cf-connecting-ip");
  var allowedOrigins = [
    "https://vau.money",
    "https://jwi5k.csb.app",
    "https://mastercard-backbank.backbank.workers.dev"
  ];
  
  const urlObject = new URL(req.url); //.pathname;//path
  var origin = urlObject.origin; // request.headers.get("Origin");
  
  if (allowedOrigins.indexOf(origin) === -1) return noaccess(origin);
  
  console.log("env", env, origin, ": making example class durable object");
  
  //  return await ((eo) => eo.get(eo.idFromName(urlObject.href)))(
  //  env.REQUIRE_CLASS_DURABLE_OBJECT).fetch(req).then(async (requir) => {console.log(requir);
  
  const href = urlObject.searchParams.get("name");
  return await ((eo=env.EXAMPLE_CLASS_DURABLE_OBJECT) => eo.get(eo.idFromName(href)))()
    .fetch(req)
    // , {headers: {"Content-Type": "application/octet-stream" //"application/json"},
    // method: "POST",body: requir.arrayBuffer()}
    // Forward the current HTTP request to it
    .then(async (res) => {
      console.log("response from worker object", res);
      return res; //await res.json();
    })
    .then((r) => {
      console.log("fetched EXAMPLE_CLASS_DURABLE_OBJECT : ", r);
      // return new Response(`{ok: true,data: ${r} }`);
      const dataHead = {
          "Content-Type": "application/json"
        },
        R = (ok, keyValue, opts) => {
          //`{\nsuccess: ${ok},\n${keyValue.success=ok}\n}`
          const R = JSON.stringify({ success: ok, ...keyValue });
          return new Response(R, {
            status: opts[0],
            message: opts[1],
            headers: opts[2]
          });
        },
        Y = (m) => (() => true)(m);
      var t = {};
      Y((t.opts = [])) && (t.obj = {});
      if (!r) {
        t.opts = [400, "no Response from durable object chain", dataHead];
        t.obj = { data: {} };
        return R(false, t.obj, t.opts);
      }
      if (!r.data) {
        t.opts = [
          r.status,
          "no data on Response: " + r.statusText ? r.statusText : r.message,
          dataHead
        ];
        t.obj = { response: r };
        return R(false, t.obj, t.opts);
      }
      t.opts = [200, `success: ${req.url}`, dataHead];
      t.obj = { true: JSON.stringify(r.data) };
      return R(true, t.obj, t.opts);
    }); 
  //});
  //new Response({})
}
//new instance class fetch waits without await
//Non-Durable-Object-Worker protocol:
// Send a non-blocking POST request.
// ~> Completes before the Worker exits.
/*ctx.waitUntil(
  fetch('https://.../logs', {
    method: 'POST',
    body: JSON.stringify({
      url: req.url,
      // ...
    })
  })
);*/

/*import buffer from 'buffer/';
import assert from 'assert/';
import crypto from "crypto-browserify";
import http from "stream-http";
import https from "https-browserify";
import path from "path-browserify";
import querystring from "querystring-es3";
import stream from "stream-browserify";
import url from 'url/';
import util from 'util/';
import zlib from "browserify-zlib";*/
//import { createRequire } from 'module'
//const handlers = bundle.handlers;
//const require = createRequire(import.meta.url);
/*
const buffer = require('buffer/');
const assert = require('assert/');
const crypto = require("crypto-browserify");
const http = require("stream-http");
const https = require("https-browserify");
const path = require("path-browserify");
const querystring = require("querystring-es3");
const stream = require("stream-browserify");
const url = require('url/');
const util = require('util/');
const zlib = require("browserify-zlib");
*/

/*export class Stripe {
    checkout: typeof checkout
    constructor(
        stripe_secret: string,
        params?: {
            apiVersion?: string
            fetch?: Function
            userAgent?: string
        },
    ) {
        let client = new HTTPClient(
            stripe_secret,
            params?.apiVersion,
            params?.userAgent,
            params?.fetch,
        )
        this.checkout = checkout
        this.checkout.client = client.request
    }
}*/
//var work = require('webworkify');
//var worker = work(handlers);//require('./worker.js')
/*w.addEventListener('message', function (ev) {
    console.log(ev.data);
});*/
//w.postMessage(4); // send the worker a message
/*export { 
  DurableObjectExample as default,
  /*assert,
  buffer,
  crypto,
  http,
  https,
  path,
  querystring,
  stream,
  url,
  util,
  zlib*
}*/
