import { apiRequest } from "./queryClient";

// Google Drive API interface
export interface GoogleDriveApi {
  saveLetterToDrive: (params: SaveLetterParams) => Promise<SaveLetterResponse>;
}

export interface SaveLetterParams {
  letterId: string;
  title: string;
  content: string;
  fileName: string;
  convertToGoogleDocs: boolean;
}

export interface SaveLetterResponse {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  message?: string;
}

// Implementation for Google Drive API
export const googleDriveApi: GoogleDriveApi = {
  saveLetterToDrive: async (params: SaveLetterParams): Promise<SaveLetterResponse> => {
    try {
      const response = await apiRequest('POST', '/api/drive/save', params);
      return await response.json();
    } catch (error) {
      console.error("Error saving letter to Drive:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
};
