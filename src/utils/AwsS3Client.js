// Direct AWS S3 client using AWS SDK (without Cognito Identity Pool)
import { S3Client, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration
const REGION = 'us-east-1';
const BUCKET_NAME = 'salvin-nlp-project';

// Create S3 client using default credentials provider
const s3Client = new S3Client({
  region: REGION,
});

export default class AwsS3Client {
  /**
   * Get a signed URL for a video in S3
   * @param {string} key - Video filename
   * @param {number} expiresIn - URL expiration time in seconds
   * @returns {Promise<string>} - Signed URL
   */
  static async getSignedUrl(key, expiresIn = 3600) {
    try {
      console.log('Getting signed URL for:', key);

      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });
      console.log('Generated URL for S3 object:', url);

      return url;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }

  /**
   * List objects in the S3 bucket
   * @param {string} prefix - Prefix to filter objects
   * @returns {Promise<Array>} - List of objects
   */
  static async listObjects(prefix = '') {
    try {
      console.log('Listing objects with prefix:', prefix);

      const command = new ListObjectsCommand({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
      });

      const response = await s3Client.send(command);
      console.log('S3 list response:', response);

      return response.Contents || [];
    } catch (error) {
      console.error('Error listing objects:', error);
      throw error;
    }
  }
}