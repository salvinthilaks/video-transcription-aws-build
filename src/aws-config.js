// AWS Configuration
import { Amplify } from 'aws-amplify';

// Configure Amplify
Amplify.configure({
  // Auth configuration
  Auth: {
    // For unauthenticated access to S3 bucket
    identityPoolId: 'us-east-1_bcSgjqGPL', // Replace this with your actual Cognito Identity Pool ID
    region: 'us-east-1',
  },
  // Storage configuration
  Storage: {
    AWSS3: {
      bucket: 'salvin-nlp-project', // Replace with your actual S3 bucket name
      region: 'us-east-1',
      level: 'public',
      customPrefix: {
        public: ''
      }
    }
  }
});

export default Amplify; 