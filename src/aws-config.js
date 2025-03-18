// AWS Configuration
import { Amplify } from 'aws-amplify';
import { resourceConfig } from 'aws-amplify';

// Configure resource config for S3
resourceConfig.configure({
  Storage: {
    S3: {
      bucket: 'salvin-nlp-project',
      region: 'us-east-1'
    }
  }
});

// Configure Amplify with v6 format
Amplify.configure({
  Auth: {
    Cognito: {
      // Identity Pools, NOT User Pools
      identityPoolId: 'us-east-1:04681bd1-0509-430b-8dd2-cb20d10091dc', // Your actual Identity Pool ID
      region: 'us-east-1'
    }
  }
});

export default Amplify;