import { Amplify } from 'aws-amplify';
import { getUrl, list } from 'aws-amplify/storage';

// S3 bucket name
const BUCKET_NAME = 'salvin-nlp-project';

export default class S3Service {
  /**
   * Get a signed URL for a video from S3
   * @param {string} key - S3 object key (filename)
   * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
   * @returns {Promise<string>} - Signed URL
   */
  static async getSignedUrl(key, expiresIn = 3600) {
    try {
      console.log('Fetching S3 URL for:', key, 'from bucket:', BUCKET_NAME);
      
      // Get a signed URL from S3
      const result = await getUrl({
        key,
        options: {
          expiresIn,
          bucket: BUCKET_NAME // Explicitly specify bucket
        }
      });
      
      console.log('S3 result:', result);
      return result.url;
    } catch (error) {
      console.error('Error getting signed URL from S3:', error);
      throw error;
    }
  }

  /**
   * List videos in S3 bucket
   * @param {string} path - Path prefix to list
   * @returns {Promise<Array>} - List of S3 objects
   */
  static async listVideos(path = '') {
    try {
      console.log('Listing S3 objects with prefix:', path, 'from bucket:', BUCKET_NAME);
      
      const result = await list({
        prefix: path,
        options: {
          bucket: BUCKET_NAME // Explicitly specify bucket
        }
      });
      
      console.log('S3 list result:', result);
      return result.items || [];
    } catch (error) {
      console.error('Error listing videos from S3:', error);
      throw error;
    }
  }
} 