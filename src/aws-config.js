// AWS Configuration
import { Amplify } from 'aws-amplify';

// Configure Amplify
Amplify.configure({
  // Auth configuration
  Auth: {
    Cognito: {
      identityPoolId: 'us-east-1_bcSgjqGPL', // Replace with your identity pool ID
      region: 'us-east-1', // Replace with your region
    }
  },
  // Storage configuration
  Storage: {
    S3: {
      bucket: 'salvin-nlp-project', // Replace with your S3 bucket name
      region: 'us-east-1', // Replace with your region
    }
  }
});

export default Amplify; 