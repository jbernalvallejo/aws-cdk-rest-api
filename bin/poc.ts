#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { OctankPocStack } from '../lib/octank-poc-stack';

const app = new cdk.App();
new OctankPocStack(app, 'OctankPocStack');
