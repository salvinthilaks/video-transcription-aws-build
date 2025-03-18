// AWS Configuration
import { Amplify } from 'aws-amplify';

const awsConfig = {
  // Your AWS Region
  region: 'us-east-1', // Your actual AWS region
  
  // Amazon S3 configurations
  Storage: {
    AWSS3: {
      bucket: 'salvin-nlp-project', // Your actual S3 bucket name
      region: 'us-east-1', // Your actual AWS region
    }
  },
  
  // Auth configurations
  Auth: {
    identityPoolId: 'us-east-1_bcSgjqGPL',
    region: 'us-east-1',
  }
};

// Configure Amplify with our settings
Amplify.configure(awsConfig);

export default awsConfig; 