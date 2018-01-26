package tools;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.xml.bind.DatatypeConverter;

import jdk.nashorn.internal.parser.JSONParser;

import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.Point;
import org.opencv.features2d.KeyPoint;
import org.opencv.highgui.Highgui;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;


public class OpenCVUtils {

	static int windowNo = 0;
	   /**
     * Display image in a frame
     *
     * @param title
     * @param img
     */
    public static void imshow(String title, Mat img) {
    	 
        
        // Convert image Mat to a jpeg
        MatOfByte imageBytes = new MatOfByte();
        Highgui.imencode(".jpg", img, imageBytes);
        
        try {
            // Put the jpeg bytes into a JFrame window and show.
            JFrame frame = new JFrame(title);
            frame.getContentPane().add(new JLabel(new ImageIcon(ImageIO.read(new ByteArrayInputStream(imageBytes.toArray())))));
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setVisible(true);
            frame.setLocation(30 + (windowNo*20), 30 + (windowNo*20));
            windowNo++;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public static String matToJson(Mat mat){        
        JsonObject obj = new JsonObject();

        if(mat.isContinuous()){
            int cols = mat.cols();
            int rows = mat.rows();
            int elemSize = (int) mat.elemSize();    

            byte[] data = new byte[cols * rows * elemSize];

            mat.get(0, 0, data);

            obj.addProperty("rows", mat.rows()); 
            obj.addProperty("cols", mat.cols()); 
            obj.addProperty("type", mat.type());

            // We cannot set binary data to a json object, so:
            // Encoding data byte array to Base64.
            String dataString = DatatypeConverter.printBase64Binary(data);
//            String dataString = new String(Base64.encode(data, Base64.DEFAULT));

            obj.addProperty("data", dataString);            

            Gson gson = new Gson();
            String json = gson.toJson(obj);

            return json;
        } else {
            System.err.println("mat not continuous");
        }
        return "{}";
    }

    public static Mat matFromJson(String json){
        JsonParser parser = new JsonParser();
        JsonObject JsonObject = parser.parse(json).getAsJsonObject();

        int rows = JsonObject.get("rows").getAsInt();
        int cols = JsonObject.get("cols").getAsInt();
        int type = JsonObject.get("type").getAsInt();

        String dataString = JsonObject.get("data").getAsString();       
        byte[] data = DatatypeConverter.parseBase64Binary(dataString);
//        byte[] data = Base64.decode(dataString.getBytes(), Base64.DEFAULT); 

        Mat mat = new Mat(rows, cols, type);
        mat.put(0, 0, data);

        return mat;
    }
    
    public static double euclideanDist(double[] array1, double[] array2)
    {
        double Sum = 0.0;
        for(int i=0;i<array1.length;i++) {
           Sum = Sum + (array1[i]-array2[i])*(array1[i]-array2[i]);
        }
        return Math.sqrt(Sum);
    }
    
    public static boolean saveMatToFile(File file, Mat mat)
    {
	    Writer fw = null;
	    try
	    {
	      fw = new FileWriter( file );
	      String jsonString = matToJson(mat);
	      System.out.println("json string:" + jsonString);
	      fw.write( jsonString );
	      fw.append( System.getProperty("line.separator") ); // e.g. "\n"
	    }
	    catch ( Exception e ) {
	      System.err.println( "I/O error" );
	      e.printStackTrace();
	    }
	    finally {
	      if ( fw != null )
	        try { fw.close(); System.out.println("wrote file...");return true; } catch ( IOException e ) { e.printStackTrace(); }
	    }
    	
    	return false;
    	
    }
    
    
    public static Mat loadMatFromFile(File file)
    {
    	BufferedReader br;
    	Mat mat = null;
		try {
			br = new BufferedReader(new FileReader(file));
			String line;
			String jsonString= "";
			while((line = br.readLine()) != null) {
				jsonString+=line;
			}
			mat = matFromJson(jsonString);
			br.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	    return mat;
    	
    }   
    
    public static double getEuclideanDistance(Point a, Point b)
    {
    	return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
    }
    
    public static MatOfKeyPoint loadKeyPointsFromFile(File file)
    {
    	BufferedReader br;
    	Mat mat = null;
    	String jsonString= "";
		try {
			br = new BufferedReader(new FileReader(file));
			String line;
			while((line = br.readLine()) != null) {
				jsonString+=line;
			}
			br.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return keypointsFromJson(jsonString);
    }
    
    public static boolean saveKeyPointsToFile(File file, MatOfKeyPoint matOfKeyPoint)
    {
	    Writer fw = null;
	    try
	    {
	      fw = new FileWriter( file );
	      String jsonString = keypointsToJson(matOfKeyPoint);
	      System.out.println("json string:" + jsonString);
	      fw.write( jsonString );
	      fw.append( System.getProperty("line.separator") ); // e.g. "\n"
	    }
	    catch ( Exception e ) {
	      System.err.println( "I/O error" );
	      e.printStackTrace();
	    }
	    finally {
	      if ( fw != null )
	        try { fw.close(); System.out.println("wrote file...");return true; } catch ( IOException e ) { e.printStackTrace(); }
	    }
    	
    	return false;
    	
    }
    
    public static String keypointsToJson(MatOfKeyPoint mat){
        if(mat!=null && !mat.empty()){          
            Gson gson = new Gson();

            JsonArray jsonArr = new JsonArray();            

            KeyPoint[] array = mat.toArray();
            for(int i=0; i<array.length; i++){
                KeyPoint kp = array[i];

                JsonObject obj = new JsonObject();

                obj.addProperty("class_id", kp.class_id); 
                obj.addProperty("x",        kp.pt.x);
                obj.addProperty("y",        kp.pt.y);
                obj.addProperty("size",     kp.size);
                obj.addProperty("angle",    kp.angle);                          
                obj.addProperty("octave",   kp.octave);
                obj.addProperty("response", kp.response);

                jsonArr.add(obj);               
            }

            String json = gson.toJson(jsonArr);         

            return json;
        }
        return "{}";
    }

    public static MatOfKeyPoint keypointsFromJson(String json){
        MatOfKeyPoint result = new MatOfKeyPoint();

        JsonParser parser = new JsonParser();
        JsonArray jsonArr = parser.parse(json).getAsJsonArray();        

        int size = jsonArr.size();

        KeyPoint[] kpArray = new KeyPoint[size];

        for(int i=0; i<size; i++){
            KeyPoint kp = new KeyPoint(); 

            JsonObject obj = (JsonObject) jsonArr.get(i);

            Point point = new Point( 
                    obj.get("x").getAsDouble(), 
                    obj.get("y").getAsDouble() 
            );          

            kp.pt       = point;
            kp.class_id = obj.get("class_id").getAsInt();
            kp.size     =     obj.get("size").getAsFloat();
            kp.angle    =    obj.get("angle").getAsFloat();
            kp.octave   =   obj.get("octave").getAsInt();
            kp.response = obj.get("response").getAsFloat();

            kpArray[i] = kp;
        }

        result.fromArray(kpArray);

        return result;
    }
    
	public static BufferedImage mat2Img(Mat in)
    {
        BufferedImage out;
        int w = in.cols();
        int h = in.rows();
        
        byte[] data = new byte[w * h * (int)in.elemSize()];
        int type;
        in.get(0, 0, data);

        if(in.channels() == 1)
            type = BufferedImage.TYPE_BYTE_GRAY;
        else
            type = BufferedImage.TYPE_3BYTE_BGR;

        out = new BufferedImage(w, h, type);

        out.getRaster().setDataElements(0, 0, w, h, data);
        return out;
    }
	
	public static Mat img2Mat(BufferedImage in)
    {
          Mat out;
          byte[] data;
          int r, g, b;
          int w = in.getWidth();
          int h = in.getHeight();

//          if(in.getType() == BufferedImage.TYPE_INT_BGR)
//          if(in.getType() == BufferedImage.TYPE_INT_RGB)
    	  if(in.getType() == BufferedImage.TYPE_INT_ARGB)
          {
              out = new Mat(h, w, CvType.CV_8UC3);
              data = new byte[w * h * (int)out.elemSize()];
              int[] dataBuff = in.getRGB(0, 0, w, h, null, 0, w);
              for(int i = 0; i < dataBuff.length; i++)
              {
                  data[i*3] = (byte) ((dataBuff[i] >> 16) & 0xFF);
                  data[i*3 + 1] = (byte) ((dataBuff[i] >> 8) & 0xFF);
                  data[i*3 + 2] = (byte) ((dataBuff[i] >> 0) & 0xFF);
                  
//                  data[i*3] = (byte) ((dataBuff[i] >> 24) & 0xFF);
//                  data[i*3 + 1] = (byte) ((dataBuff[i] >> 16) & 0xFF);
//                  data[i*3 + 2] = (byte) ((dataBuff[i] >> 8) & 0xFF);
                  
//                  data[i*3] = (byte) ((dataBuff[i] >> 16) & 0xFF);
//                  data[i*3 + 1] = (byte) ((dataBuff[i] >> 8) & 0xFF);
//                  data[i*3 + 2] = (byte) ((dataBuff[i] >> 0) & 0xFF);
              }
          }
          else
          {
        	  System.out.println("bw");
              out = new Mat(h, w, CvType.CV_8UC1);
              data = new byte[w * h * (int)out.elemSize()];
              int[] dataBuff = in.getRGB(0, 0, w, h, null, 0, w);
              for(int i = 0; i < dataBuff.length; i++)
              {
            	  r = (byte) ((dataBuff[i] >> 24) & 0xFF);
            	  g = (byte) ((dataBuff[i] >> 16) & 0xFF);
            	  b = (byte) ((dataBuff[i] >> 8) & 0xFF);
//                r = (byte) ((dataBuff[i] >> 16) & 0xFF);
//                g = (byte) ((dataBuff[i] >> 8) & 0xFF);
//                b = (byte) ((dataBuff[i] >> 0) & 0xFF);
                data[i] = (byte)((0.21 * r) + (0.71 * g) + (0.07 * b)); //luminosity
              }
           }
           out.put(0, 0, data);
           return out;
     } 
    
    
}
