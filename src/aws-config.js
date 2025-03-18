// AWS Configuration
import { Amplify } from 'aws-amplify';

// Configure Amplify
Amplify.configure({
  // Auth configuration
  Auth: {
    // For unauthenticated access to S3 bucket
    identityPoolId: 'your-identity-pool-id', // Replace with your actual identity pool ID
    region: 'us-east-1', // Replace with your actual region
  },
  // Storage configuration
  Storage: {
    AWSS3: {
      bucket: 'your-s3-bucket-name', // Replace with your actual S3 bucket name
      region: 'us-east-1', // Replace with your actual region
      level: 'public', // This specifies that we're using the public access level
      customPrefix: {
        public: '' // Don't add any prefix to public items
      }
    }
  }
});

export default Amplify; 