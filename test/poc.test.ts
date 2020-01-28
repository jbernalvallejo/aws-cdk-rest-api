import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Poc = require('../lib/poc-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Poc.PocStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
