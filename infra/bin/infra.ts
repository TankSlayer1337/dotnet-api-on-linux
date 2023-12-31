#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'dotnet-api-on-linux', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-north-1' }
});