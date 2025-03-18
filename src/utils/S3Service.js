import { Amplify } from 'aws-amplify';
import { getUrl, list } from 'aws-amplify/storage';

export default class S3Service {
  /**
   * Get a signed URL for a video from S3
   * @param {string} key - S3 object key (filename)
   * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
   * @returns {Promise<string>} - Signed URL
   */
  static async getSignedUrl(key, expiresIn = 3600) {
    try {
      // Get a signed URL from S3
      const signedURL = await getUrl({
        key: key,
        options: {
          expiresIn: expiresIn,
          validateObjectExistence: true
        }
      });
      return signedURL.url;
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
      const result = await list({
        prefix: path,
        options: {
          pageSize: 100
        }
      });
      return result.items;
    } catch (error) {
      console.error('Error listing videos from S3:', error);
      throw error;
    }
  }
} 