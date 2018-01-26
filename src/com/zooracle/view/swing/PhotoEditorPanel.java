package com.zooracle.view.swing;

import java.awt.BasicStroke;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import javax.imageio.ImageIO;
import javax.swing.DefaultListModel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ListSelectionModel;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import com.zooracle.model.ColorRange;
import com.zooracle.model.ColorRangePreset;
import com.zooracle.model.ColorRangeYBT;
import com.zooracle.model.MetaData;

import tools.OpenCVUtils;

public class PhotoEditorPanel extends JPanel
{

	private int eW = 720;
	private int eH = 720;
	private static int width = 768;
	private static int height = 720;
	private int margin = 80;

	private BufferedImage currentImage;
	private MetaData currentMetaData;
	public static String moduleTitle = "Image Editor";
	private BufferedImage selectedImage;

	private boolean debugLoad = false;

	private BufferedImage imageBuffer;
	private Graphics2D imageBufferGraphics;
	private int ow;
	private int oh;
	private int ol;
	private int os;
	private int shortSide;
	private int zoom = 100;
	private int angle = 0;
	private int posX = width / 2;
	private int posY = height / 2;

	private int imgOffsetX = 0;
	private int imgOffsetY = 0;
	private int oldImgOffsetX = 0;
	private int oldImgOffsetY = 0;

	private int fw = 300;
	private int fh = 500;
	private int fm = 75;

	private int oldX = 0;
	private int oldY = 0;

	private int hl = 0;
	private int sl = 0;
	private int vl = 0;
	private int hh = 0;
	private int sh = 0;
	private int vh = 0;

	private boolean dragging = false;
	protected int mouseButton;
	protected int oldZoom;
	protected int oldAngle;
	private AffineTransform standardTransform;
	private int zw;
	private int zh;
	protected int oldPosX;
	protected int oldPosY;
	private Color bgcolor = new Color(150, 190, 160);
	protected boolean selected;

	private boolean copyMade = false;
	private String currentFile = "images/bt/2006/Ballertasche2006_1.JPG";

	private JPanel sidePanel;

	private boolean shiftDown = false;

	private File zooFile;
	private boolean listOpened = false;
	public int contrast;

	private Font font = new Font(Font.MONOSPACED, Font.PLAIN, 20);
	public boolean controlDown;
	private PhotoEditorToolPanel colorParameterWindow;
	private boolean blur;
	private ImageEditorKeyListener keyListener;

	private HashMap<Integer, Integer> listID;

	private ColorRangePreset colorRangePreset = new ColorRangeYBT();
	private boolean unsavedChange = false;

	public PhotoEditorPanel(ZooracleContentPanel zooracleContentPanel)
	{
		keyListener = new ImageEditorKeyListener();
//		this.addKeyListener(keyListener);
		this.setLayout(new BorderLayout());

		this.setBackground(bgcolor.darker());
		this.width = eW - margin;
		this.height = eH - margin;
		this.posX = width / 2;
		this.posY = height / 2;
		System.out.println("w:" + width);
		System.out.println("h:" + height);
		this.shortSide = Math.min(width, height);

		updateImageBuffer(width, height);

		this.addMouseListener(new MouseListener()
		{
			public void mouseReleased(MouseEvent arg0)
			{
				dragging = false;
			}

			public void mousePressed(MouseEvent e)
			{
				requestFocus();
				mouseButton = e.getButton();
				dragging = true;
				oldX = e.getX();
				oldY = e.getY();
				oldZoom = zoom;
				oldAngle = angle;
				oldPosX = posX;
				oldPosY = posY;
				oldImgOffsetX = imgOffsetX;
				oldImgOffsetY = imgOffsetY;
			}

			public void mouseExited(MouseEvent arg0)
			{
			}

			public void mouseEntered(MouseEvent arg0)
			{
			}

			public void mouseClicked(MouseEvent arg0)
			{
			}
		});

		this.addMouseMotionListener(new MouseMotionListener()
		{
			public void mouseMoved(MouseEvent e)
			{
			}

			public void mouseDragged(MouseEvent e)
			{
				if (selected)
					return;
				if (dragging)
				{
					if (shiftDown)
					{
						updateOffset(oldImgOffsetX - (oldX - e.getX()), oldImgOffsetY - (oldY - e.getY()));
						repaint();
					} else
					{
						if (mouseButton == MouseEvent.BUTTON3 || controlDown)
						{
							updateZoomAndAngle(oldZoom - (oldY - e.getY()), oldAngle - (oldX - e.getX()));
							repaint();
						} else if (mouseButton == MouseEvent.BUTTON1)
						{
							updatePos(oldPosX - (oldX - e.getX()), oldPosY - (oldY - e.getY()));
							repaint();
						}
					}
					unsavedChange = true;
				}
			}
		});
		zooracleContentPanel.getMainWindow().addKeyListener(keyListener);
		this.addKeyListener(keyListener);
		

		colorParameterWindow = new PhotoEditorToolPanel(this);
		this.add(colorParameterWindow,BorderLayout.EAST);
		
		
		setFocusable(true);
		this.requestFocus();

	}

	protected void updateOffset(int x, int y)
	{
		imgOffsetX = x;
		imgOffsetY = y;
	}

	protected void updatePos(int x, int y)
	{
		posX = x;
		posY = y;

		if (posX < fw / 2)
			posX = fw / 2;
		if (posY < fh / 2)
			posY = fh / 2;

		if (posX > shortSide - fw / 2 - 1)
			posX = shortSide - fw / 2 - 1;
		if (posY > shortSide - fh / 2 - 1)
			posY = shortSide - fh / 2 - 1;

	}

	protected void updateZoomAndAngle(int z, int a)
	{
		zoom = z;
		angle = a;
		if (zoom < 10)
			zoom = 10;
		if (zoom > 330)
			zoom = 330;
		zw = (int) (ow * (double) zoom / 100d);
		zh = (int) (oh * (double) zoom / 100d);
	}

	public void updateImageBuffer(int width, int height)
	{
		this.imageBuffer = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		this.imageBufferGraphics = (Graphics2D) imageBuffer.getGraphics();

		RenderingHints rh = new RenderingHints(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		this.imageBufferGraphics.setFont(font);

		imageBufferGraphics.setRenderingHints(rh);
		standardTransform = imageBufferGraphics.getTransform();
	}

	public boolean setCurrentImage(String imageString)
	{
		File file = new File(imageString);
		System.out.println(imageString);
		try
		{
			currentImage = ImageIO.read(file);
		} catch (Exception e)
		{
			e.printStackTrace();
			this.currentImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			return false;
		}

		this.ow = this.currentImage.getWidth();
		this.oh = this.currentImage.getHeight();
		this.ol = Math.max(this.ow, this.oh);
		this.os = Math.min(this.ow, this.oh);

		zoom = (int) (((double) shortSide / (double) ow) * 100);
		zw = (int) (ow * (double) zoom / 100d);
		zh = (int) (oh * (double) zoom / 100d);

		return true;

	}

	@Override
	public void paint(Graphics g)
	{
		super.paint(g);

		this.imageBufferGraphics.setColor(bgcolor);
		this.imageBufferGraphics.fillRect(0, 0, this.ow, this.oh);

		if (this.currentMetaData == null)
			return;

		AffineTransform transform = new AffineTransform();
		transform.translate(-zw / 2 + imgOffsetX, -zh / 2 + imgOffsetY);
		transform.rotate(Math.toRadians(angle), shortSide / 2 + zw / 2, shortSide / 2 + zh / 2);
		this.imageBufferGraphics.transform(transform);
		this.imageBufferGraphics.drawImage(currentImage, shortSide / 2, shortSide / 2, zw, zh, null);
		this.imageBufferGraphics.setTransform(standardTransform);

		if (!this.selected)
		{
			this.imageBufferGraphics.setColor(new Color(0, 0, 220));
			this.imageBufferGraphics.setStroke(new BasicStroke(2f));
			this.imageBufferGraphics.drawRect(posX - fw / 2, posY - fh / 2, fw, fh);
			this.imageBufferGraphics.setColor(new Color(0, 122, 220));
			this.imageBufferGraphics.drawRect(posX - fw / 2 + fm / 2, posY - fh / 2 + fm / 2, fw - fm, fh - fm);
		} else
		{
			
			this.imageBufferGraphics.setColor(new Color(0, 0, 0, 150));
			this.imageBufferGraphics.fillRect(0, 0, posX - fw / 2, shortSide);
			this.imageBufferGraphics.fillRect(posX + fw / 2, 0, shortSide - posX, shortSide);

			this.imageBufferGraphics.fillRect(posX - fw / 2, 0, fw, posY - fh / 2);
			this.imageBufferGraphics.fillRect(posX - fw / 2, posY + fh / 2, fw, shortSide - posY);

			if (!copyMade)
			{
				selectedImage = this.imageBuffer.getSubimage(posX - fw / 2, posY - fh / 2, fw, fh);
				Mat img = OpenCVUtils.img2Mat(selectedImage);
				img.convertTo(img, -1, 1.1 + contrast * .015625, 0 - contrast * 3);

				Imgproc.cvtColor(img, img, Imgproc.COLOR_RGB2HSV);
				Mat imgFinal = img.clone();

				int n = 0;
				for (ColorRange colorRange : currentMetaData.getImageSettings().getColorRanges())
				{
					if (colorRange.getMode() > 0)
					{
						Mat imgRange = img.clone();
						Scalar low = new Scalar(colorRange.getHl(), colorRange.getSl(), colorRange.getVl());
						Scalar high = new Scalar(colorRange.getHh(), colorRange.getSh(), colorRange.getVh());
						System.out.println();

						Core.inRange(imgRange, low, high, imgRange);

						if (n == 0)
							imgFinal = imgRange;
						else
						{
							if (colorRange.getMode() > 1)
								Core.subtract(imgFinal, imgRange, imgFinal);
							else
								Core.add(imgFinal, imgRange, imgFinal);
						}

						n++;
					}
				}
				img = imgFinal;

				Imgproc.cvtColor(img, img, Imgproc.COLOR_GRAY2RGB);

				if (blur)
					Imgproc.blur(img, img, new Size(2d, 2d));

				Imgproc.cvtColor(img, img, Imgproc.COLOR_RGB2GRAY);
				Imgproc.threshold(img, img, 127, 255, Imgproc.THRESH_OTSU);

				selectedImage = OpenCVUtils.mat2Img(img);
				this.imageBufferGraphics.drawImage(selectedImage, posX - fw / 2, posY - fh / 2, null);
				
				try
				{
					String outputFileName = currentFile.substring(0, currentFile.length()-4) + ".zoo.png";
					zooFile = new File(outputFileName);
					if (zooFile.exists())
					{
						zooFile.delete();
						if (!zooFile.exists())
							System.out.println("deleted, but now...");
					}
					ImageIO.write(selectedImage, "png", zooFile = new File(outputFileName));
					currentMetaData.setZooName(zooFile.toString());
					
				} catch (Exception exception)
				{
					exception.printStackTrace();
				}

				copyMade = true;
			} else
			{
				if ((this.zooFile != null) && this.zooFile.exists())
					this.imageBufferGraphics.drawImage(selectedImage, posX - fw / 2, posY - fh / 2, null);

			}
		}
		this.imageBufferGraphics.setColor(new Color(0, 0, 0, 130));
		this.imageBufferGraphics.fillRect(0, shortSide - 70, shortSide, 70);
		this.imageBufferGraphics.setColor(Color.WHITE);
		this.imageBufferGraphics.drawString(currentMetaData.getFileName(), 10, shortSide - 47);
		this.imageBufferGraphics.drawString("contrast: " + contrast, 10, shortSide - 25);
		this.imageBufferGraphics.drawString("blur: " + (blur ? "yes" : "no"), 200, shortSide - 25);
		g.drawImage(imageBuffer, 0, 0, shortSide, shortSide, 0, 0, shortSide, shortSide, null);
	}

	public ImageEditorKeyListener getKeyListener()
	{
		return keyListener;
	}

	public void setContrast(int contrast)
	{
		this.contrast = contrast;
	}

	public void updateColorRange(int hl, int sl, int vl, int hh, int sh, int vh)
	{
		this.hl = hl;
		this.sl = sl;
		this.vl = vl;

		this.hh = hh;
		this.sh = sh;
		this.vh = vh;

		copyMade = false;
		repaint();
	}

	public void updateColorRange()
	{
		this.copyMade = false;
		this.repaint();
	}

	class ImageEditorKeyListener implements KeyListener
	{

		public void keyTyped(KeyEvent arg0)
		{
		}

		public void keyReleased(KeyEvent e)
		{
			
			copyMade = false;
			if (e.getKeyCode() == KeyEvent.VK_SPACE)
			{
//				System.out.println("k:"+selected);

				selected = !selected;
				System.out.println("hit space" + selected);
				unsavedChange = true;
				repaint();
			}
			if (e.getKeyCode() == KeyEvent.VK_ESCAPE)
			{
				selected = false;
				repaint();
			}
			if (e.getKeyCode() == KeyEvent.VK_SHIFT)
			{
				shiftDown = false;
			}
			if (e.getKeyCode() == KeyEvent.VK_CONTROL)
			{
				controlDown = false;
			}
			if ((e.getKeyCode() == KeyEvent.VK_PLUS) || (e.getKeyCode() == KeyEvent.VK_ADD))
			{
				contrast++;
				repaint();
				copyMade = false;
			}
			if ((e.getKeyCode() == KeyEvent.VK_MINUS) || (e.getKeyCode() == KeyEvent.VK_SUBTRACT))
			{
				contrast--;
				repaint();
				copyMade = false;
			}
			if (e.getKeyCode() == KeyEvent.VK_MULTIPLY)
			{
				blur = !blur;
				repaint();
				copyMade = false;
			}

		}

		public void keyPressed(KeyEvent e)
		{
			if (e.getKeyCode() == KeyEvent.VK_SHIFT)
			{
				shiftDown = true;
			}
			if (e.getKeyCode() == KeyEvent.VK_CONTROL)
			{
				controlDown = true;
			}

		}
		
	}
	public void setPhoto(MetaData metaData)
	{
			this.currentMetaData = metaData;
			if (metaData.getZooName()==null)
			{
				this.zooFile = null;
				this.selected = false;
			}
			else
			{
				this.zooFile = new File(metaData.getZooName());
			}
			this.currentFile = metaData.getFileName();
//			this.colorParameterWindow.set
			colorParameterWindow.setColorSettings(this.currentMetaData.getImageSettings().getColorRanges(), contrast = this.currentMetaData.getImageSettings().getContrast());
			setCurrentImage(currentMetaData.getFileName());
			updateColorRange();
	}
	

}
