import { get } from "@vercel/blob";
import { getProjectAccess } from "./access";

/**
 * Generates a temporary, signed URL for a Vercel Blob file.
 * Access is restricted based on the user's project tier.
 *
 * @param clerkUserId The Clerk user ID
 * @param projectId The project ID
 * @param blobUrl The original Vercel Blob URL
 * @param minTier The minimum tier required to access this file
 * @returns The signed URL or null if access is denied
 */
export async function getPremiumBlobUrl(
  clerkUserId: string | null,
  projectId: string,
  blobUrl: string,
  minTier: number
) {
  const userTierLevel = await getProjectAccess(clerkUserId, projectId);

  if (userTierLevel >= minTier) {
    try {
      const blobResult = await get(blobUrl, {
        access: 'private'
      });

      // Based on the GetBlobResult type, the blob metadata is in blobResult.blob
      return blobResult?.blob?.url || null;
    } catch (error) {
      console.error('Error accessing Blob:', error);
      return null;
    }
  }

  return null;
}
