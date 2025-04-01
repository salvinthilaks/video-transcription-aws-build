# Video Transcription Dashboard

A React-based web application that provides a dashboard interface for video transcription services using AWS services.

## Overview

This project is a web-based dashboard that allows users to:

- Upload videos for transcription
- View transcription results
- Search through transcribed content
- Extract and analyze keywords from transcriptions
- Visualize transcription data

## Features

- **Video Upload**: Direct upload interface for video files
- **Transcription Viewer**: Clean interface to read transcribed content
- **Search Functionality**: Search through transcribed content
- **Keyword Analysis**: Extract and view important keywords from transcriptions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React.js
- **Styling**: CSS with modern design principles
- **Cloud Services**: AWS (Amazon Web Services)
  - S3 for storage
  - Transcribe for video-to-text conversion
  - Lambda for serverless functions

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/salvinthilaks/video-transcription-aws-build.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Building the Project

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` directory.

## Deployment

This repository contains the production build files ready for deployment. The application can be deployed to any static hosting service or AWS S3.

## License

MIT License

## Author

Salvin Thilak Sadasivan
