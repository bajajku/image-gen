export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
};

export const downloadAllImages = async (imageUrls: string[]) => {
  try {
    // Create a zip file if multiple images
    if (imageUrls.length > 1) {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Fetch all images and add them to zip
      const promises = imageUrls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(`generated-image-${index + 1}.png`, blob);
      });
      
      await Promise.all(promises);
      
      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      const zipUrl = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = 'generated-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(zipUrl);
    } else {
      // Download single image
      await downloadImage(imageUrls[0], 'generated-image.png');
    }
  } catch (error) {
    console.error('Error downloading images:', error);
    throw new Error('Failed to download images');
  }
}; 