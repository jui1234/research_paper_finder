// Utility function to download files, handling cross-origin URLs
export async function downloadFile(url: string, filename?: string) {
  try {
    // Check if URL is a PDF file or webpage
    const isPDF = url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf');
    
    // If it's not a PDF, it's likely a webpage - open in new tab
    if (!isPDF && !url.includes('application/pdf')) {
      window.open(url, '_blank');
      return;
    }

    // For same-origin URLs or relative paths, try direct download
    if (url.startsWith('/') || url.includes(window.location.origin)) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || url.split('/').pop() || 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For cross-origin URLs, fetch and create blob
    // Note: This will only work if the server allows CORS
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const blob = await response.blob();
    
    // Check if the response is actually a PDF
    if (blob.type && !blob.type.includes('pdf') && !blob.type.includes('octet-stream')) {
      // Not a PDF, open in new tab instead
      window.open(url, '_blank');
      return;
    }

    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || url.split('/').pop() || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
}

