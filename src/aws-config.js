// AWS Configuration
import { Amplify } from 'aws-amplify';

const awsConfig = {
  // Your AWS Region
  region: 'us-east-1', // Your actual AWS region
  
  // Amazon S3 configurations
  Storage: {
    AWSS3: {
      bucket: 'your-actual-bucket-name', // Your actual S3 bucket name
      region: 'us-east-1', // Your actual AWS region
    }
  },
  
  // Auth configurations
  Auth: {
    identityPoolId: 'your-actual-identity-pool-id',
    region: 'us-east-1',
  }
};

// Configure Amplify with our settings
Amplify.configure(awsConfig);

export default awsConfig; 