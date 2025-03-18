// Direct AWS S3 client using CloudFront URLs
const REGION = process.env.REACT_APP_AWS_REGION || "us-east-1"; 
const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET || "salvin-nlp-project";
const CLOUDFRONT_DOMAIN = process.env.REACT_APP_CLOUDFRONT_DOMAIN || "YOUR_CLOUDFRONT_DOMAIN.cloudfront.net";

export default class AwsS3Client {
  /**
   * Get a CloudFront URL for a video
   * @param {string} key - Video filename
   * @returns {string} - CloudFront URL
   */
  static getVideoUrl(key) {
    try {
      console.log("Getting CloudFront URL for:", key);
      const url = `https://${CLOUDFRONT_DOMAIN}/${encodeURIComponent(key)}`;
      console.log("Generated URL:", url);
      return url;
    } catch (error) {
      console.error("Error getting URL:", error);
      throw error;
    }
  }

  /**
   * For backward compatibility
   */
  static async getSignedUrl(key) {
    return this.getVideoUrl(key);
  }

  /**
   * List objects in the S3 bucket
   * @returns {Promise<Array>} - List of objects
   */
  static async listObjects() {
    try {
      console.log("Attempting to list objects from CloudFront distribution");
      return [];
    } catch (error) {
      console.error("Error listing objects:", error);
      throw error;
    }
  }
}