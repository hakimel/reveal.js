// Mock feedback data for testing

export const mockFeedbackItem = {
  id: '1',
  presentationId: 'ai-for-product-discovery',
  slideNumber: 5,
  type: 'issue',
  description: 'The slide transition animation is too slow',
  timestamp: '2024-01-15T10:30:00.000Z',
  screenshot: null,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
};

export const mockFeedbackWithScreenshot = {
  id: '2',
  presentationId: 'ai-for-product-discovery',
  slideNumber: 10,
  type: 'suggestion',
  description: 'Consider adding more visual examples for this concept',
  timestamp: '2024-01-15T11:45:00.000Z',
  screenshot: 'uploads/screenshot-2-1705318500000.png',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
};

export const mockFeedbackList = [
  {
    id: '1',
    presentationId: 'ai-for-product-discovery',
    slideNumber: 5,
    type: 'issue',
    description: 'Text is too small on mobile',
    timestamp: '2024-01-15T10:30:00.000Z',
    screenshot: null,
  },
  {
    id: '2',
    presentationId: 'ai-for-product-discovery',
    slideNumber: 5,
    type: 'suggestion',
    description: 'Add animation to this slide',
    timestamp: '2024-01-15T10:35:00.000Z',
    screenshot: null,
  },
  {
    id: '3',
    presentationId: 'ai-for-product-discovery',
    slideNumber: 10,
    type: 'issue',
    description: 'Code snippet has syntax error',
    timestamp: '2024-01-15T11:00:00.000Z',
    screenshot: 'uploads/screenshot-3.png',
  },
  {
    id: '4',
    presentationId: 'ai-for-product-discovery',
    slideNumber: 15,
    type: 'suggestion',
    description: 'Include link to documentation',
    timestamp: '2024-01-15T11:30:00.000Z',
    screenshot: null,
  },
];

export const mockMultiplePresentations = [
  ...mockFeedbackList,
  {
    id: '5',
    presentationId: 'another-presentation',
    slideNumber: 3,
    type: 'issue',
    description: 'Audio not working',
    timestamp: '2024-01-15T12:00:00.000Z',
    screenshot: null,
  },
];

export const invalidFeedbackMissingRequired = {
  presentationId: 'ai-for-product-discovery',
  // Missing slideNumber, type, description
};

export const invalidFeedbackWrongType = {
  presentationId: 'ai-for-product-discovery',
  slideNumber: 5,
  type: 'invalid-type', // Should be 'issue' or 'suggestion'
  description: 'Some description',
};

export const invalidFeedbackEmptyDescription = {
  presentationId: 'ai-for-product-discovery',
  slideNumber: 5,
  type: 'issue',
  description: '', // Empty description
};

export const mockLargeFile = {
  fieldname: 'screenshot',
  originalname: 'large-screenshot.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 15 * 1024 * 1024, // 15MB - exceeds typical 10MB limit
  buffer: Buffer.alloc(15 * 1024 * 1024),
};

export const mockValidFile = {
  fieldname: 'screenshot',
  originalname: 'screenshot.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 2 * 1024 * 1024, // 2MB
  buffer: Buffer.alloc(2 * 1024 * 1024),
};

export const mockInvalidFileType = {
  fieldname: 'screenshot',
  originalname: 'malicious.exe',
  encoding: '7bit',
  mimetype: 'application/x-msdownload',
  size: 1024,
  buffer: Buffer.alloc(1024),
};

// Helper function to create feedback with custom fields
export function createMockFeedback(overrides = {}) {
  return {
    ...mockFeedbackItem,
    id: `mock-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

// Helper function to group feedback by slide
export function groupFeedbackBySlide(feedbackList) {
  return feedbackList.reduce((acc, feedback) => {
    const slide = feedback.slideNumber;
    if (!acc[slide]) {
      acc[slide] = [];
    }
    acc[slide].push(feedback);
    return acc;
  }, {});
}

// Helper function to filter feedback by presentation
export function filterByPresentation(feedbackList, presentationId) {
  return feedbackList.filter((f) => f.presentationId === presentationId);
}
