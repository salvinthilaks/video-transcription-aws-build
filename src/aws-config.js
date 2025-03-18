// AWS Configuration
import { Amplify } from 'aws-amplify';

// Configure Amplify with v6 format
Amplify.configure({
  Auth: {
    Cognito: {
      // Identity Pools, NOT User Pools
      identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // ← This is the correct format
      region: 'us-east-1'
    }
  },
  Storage: {
    S3: {
      bucket: 'salvin-nlp-project',
      region: 'us-east-1'
    }
  }
});

export default Amplify; 