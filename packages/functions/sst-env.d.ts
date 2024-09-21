/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
    "API": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "ClerkIssuer": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ClerkPublishableKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ClerkSecretKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DatabaseURL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GenerateMessageResponseQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "OpenAIAPIKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Realtime": {
      "authorizer": string
      "endpoint": string
      "type": "sst.aws.Realtime"
    }
    "Web": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
  }
}
