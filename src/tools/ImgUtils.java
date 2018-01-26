package tools;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.WritableRaster;
import java.io.File;

import javax.imageio.ImageIO;

public class ImgUtils {
	
    public static int byteToGray(int byteColor)
    {
    	return ((byteColor & 0xff) + ((byteColor & 0xff00) >> 8) + ((byteColor & 0xff0000) >> 16)) / 3;
    }
    
    public static int[] getPixels(BufferedImage image) {
			int[]pixels = new int[image.getWidth() * image.getHeight()];
			image.getRGB(0, 0, image.getWidth(), image.getHeight(), pixels, 0, image.getWidth());
		return pixels;
	}
    
    public static Image getImageFromArray(int[] pixels, int width, int height) {
        BufferedImage image = new BufferedImage(width, height+1, BufferedImage.TYPE_INT_ARGB);
        WritableRaster raster = (WritableRaster) image.getData();
        System.out.println("px;" + pixels.length + " as opposed to " + (height*width));
        raster.setPixels(0,0,width,height-1,pixels);
        
        return image;
    }
    
    /**
     * Convert image into BufferedImage
     *
     * @param img The Image to be converted
     * @return The converted BufferedImage
     */
    public static BufferedImage toBufferedImage(Image img)
    {
        if (img instanceof BufferedImage)
        {
            return (BufferedImage) img;
        }

        // Create a buffered image with transparency
        BufferedImage bimage = new BufferedImage(img.getWidth(null), img.getHeight(null), BufferedImage.TYPE_INT_ARGB);

        // Draw the image on to the buffered image
        Graphics2D bGr = bimage.createGraphics();
        bGr.drawImage(img, 0, 0, null);
        bGr.dispose();

        // Return the buffered image
        return bimage;
    }

	public static Image getThumbnailAsImage(String originalFileName, int width, int height) {
		
		String outputFileName = originalFileName.substring(0, originalFileName.length()-4) + ".tn.jpg";
		Image thumbnailImage = null;
		
		try{
			File thumbnailFile = new File(outputFileName);
			if (thumbnailFile.exists())
				thumbnailImage = ImageIO.read(thumbnailFile);
			else
			{
				BufferedImage img = ImageIO.read(new File(originalFileName));
				thumbnailImage = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);
				ImageIO.write(ImgUtils.toBufferedImage(thumbnailImage), "jpg", thumbnailFile);
			}
			return thumbnailImage;
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}
}
