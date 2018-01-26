package tools;

import java.awt.Color;

public class ColorUtils {
	
	public static Color getRGB(int h, int s, int b)
	{
		int rgb = Color.HSBtoRGB((float)h/180f, (float)s/255f, (float)b/255f);
	    int red = (rgb >> 16) & 0xFF;
	    int green = (rgb >> 8) & 0xFF;
	    int blue = rgb & 0xFF;
	    		
	    
		return new Color(red,green,blue);
	}

}
