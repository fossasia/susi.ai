package com.zooracle.view.swing;

import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Image;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JSpinner;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SpinnerDateModel;
import javax.swing.SwingConstants;

import com.zooracle.main.Settings;
import com.zooracle.model.MetaData;
import com.zooracle.model.ToadDataPanel;
import com.zooracle.view.swing.MetaDataPanel.DisplayMode;

import tools.ImgUtils;

public class MetaDataPanel extends JPanel
{
	
//	protected MetaData metaData;
//	protected MetaData originalMetaData;
	
	protected boolean dataChanged = false;
	
	protected JLabel labelName;
	protected JLabel labelComment;
	protected JLabel labelView;
	protected JLabel labelGPS;
	protected JLabel labelLattitude;
	protected JLabel labelLongitude;
	protected JLabel labelValidFromDate;
	protected JLabel labelValidFromTime;
	
 	protected JTextField textFieldName;
	protected JTextArea  textAreaComment;
	protected JTextField textFieldLat;
	protected JTextField textFieldLon;
	protected JComboBox comboBoxView;
//	protected JList metaList;
	
	protected JButton buttonEdit;
	protected JButton buttonDelete;
	
//	protected ZooracleContentPanel zooracleContentPanel;
	
	protected int lw = GUISettings.defaultLabelWidth;
	protected int lh = GUISettings.defaultLabelHeight;
	protected int a = SwingConstants.RIGHT;
	protected int va = SwingConstants.TOP;
	protected int iw = GUISettings.defaultInputWidth;
	protected int dpw = GUISettings.defaultPanelWidth;
	protected int dph = GUISettings.defaultPanelHeight;
	
	protected ArrayList<Component> inputComponents = new ArrayList<Component>();
	protected ArrayList<JLabel> inputLabels = new ArrayList<JLabel>();
	protected JSpinner dateSpinner;
	protected JSpinner timeSpinner;
	protected JPanel dataPanel;
	
	protected MetaData currentData;

	protected ImageIcon icon;

	private ImageIcon iconHover;
	public static enum DisplayMode { horizontal , vertical_align_left , vertical_align_right };
	protected DisplayMode currentDisplayMode;

	protected int orientation;

	private JPanel zooPanel;

	private JLabel imgLabel;

	private boolean imgHoverEnabled;

//	public MetaDataPanel(ZooracleContentPanel zooracleContentPanel)
//	{
////		if (display)
////		this.currentDisplayMode = displayMode; 
//		this(zooracleContentPanel, DisplayMode.horizontal);
//	}
	public MetaDataPanel(DisplayMode displayMode)
	{
		
		this.currentDisplayMode = displayMode; 
		orientation = FlowLayout.LEFT;
		if (displayMode.equals(DisplayMode.horizontal))
		{
			this.setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		}
		else
		{
			this.setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
			if (displayMode.equals(DisplayMode.vertical_align_right))
				orientation = FlowLayout.RIGHT;
		}
		
		dataPanel = new JPanel(); 
		dataPanel.setLayout(new BoxLayout(dataPanel, BoxLayout.Y_AXIS));
		
		zooPanel = new JPanel(new FlowLayout(orientation)); 

		BufferedImage img = null;
		Image resizedImage = null;
		Image resizedImageHover = null;
		try
		{
			img = ImageIO.read(new File("C:/temp/zimg/2014_by_falk/14Ba_0021.zoo.png"));
			resizedImage = img.getScaledInstance(150, 250, Image.SCALE_SMOOTH);
			img = ImageIO.read(new File("C:/temp/zimg/2014_by_falk/14Ba_0006.zoo.png"));
			resizedImageHover = img.getScaledInstance(150, 250, Image.SCALE_SMOOTH);
//			img.getGraphics().drawImage(resizedImage, 0,0,null);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		icon = new ImageIcon(resizedImage);
        iconHover = new ImageIcon(resizedImageHover);

        imgHoverEnabled = true;
		imgLabel = new JLabel(icon);
        imgLabel.addMouseListener(new MouseListener()
		{
			public void mouseReleased(MouseEvent e){}
			public void mousePressed(MouseEvent e)
			{
			}
			public void mouseExited(MouseEvent e)
			{
				if (imgHoverEnabled)
				{
					imgLabel.setIcon(icon);
					setCursor(Cursor.getDefaultCursor());
				}
			}
			public void mouseEntered(MouseEvent e)
			{
				if (imgHoverEnabled)
				{
					Cursor cursor = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR); 
					setCursor(cursor);
					imgLabel.setIcon(iconHover);
				}
			}
			public void mouseClicked(MouseEvent e){}
		});        
        
        imgLabel.setPreferredSize(new Dimension(iw, 268));
        imgLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        zooPanel.add(imgLabel);
		
//		this.zooracleContentPanel = zooracleContentPanel;
		
		labelValidFromDate = GUISettings.getDefaultLabel(Locale.labelValidFromDate, lw, lh, a, va);  
		labelName     =      GUISettings.getDefaultLabel(Locale.labelName, lw, lh, a, va);  
		labelView     =      GUISettings.getDefaultLabel(Locale.labelView, lw, lh, a, va);  
		labelComment  =      GUISettings.getDefaultLabel(Locale.labelComment, lw, 80, a, va);  
		labelLattitude =     GUISettings.getDefaultLabel(Locale.labelLatitude, lw, lh, a, va);  
		labelLongitude =     GUISettings.getDefaultLabel(Locale.labelLongitude, lw, lh, a, va);  
		
		textFieldName = new JTextField("");   textFieldName.setPreferredSize(new Dimension(iw, 30)); textFieldName.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textAreaComment = new JTextArea();  textAreaComment.setPreferredSize(new Dimension(iw, 80)); 
		textAreaComment.setBorder(BorderFactory.createLineBorder(Color.BLACK));

		textFieldLat = new JTextField(" 52° 31' 27.36\" N");
		textFieldLat.setPreferredSize(new Dimension(iw, 30));
		textFieldLat.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textFieldLat.setEditable(false);

		textFieldLon = new JTextField(" 13° 24' 22.64\" E");
		textFieldLon.setPreferredSize(new Dimension(iw, 30));
		textFieldLon.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textFieldLon.setEditable(false);

		comboBoxView = new JComboBox(); 
		for (Object item : Locale.dropDownViews)
			comboBoxView.addItem(item);
		comboBoxView.setPreferredSize(new Dimension(iw, 30)); 
		
		dateSpinner = new JSpinner( new SpinnerDateModel() );
		JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(dateSpinner, "dd.MM.yyyy");
		dateSpinner.setEditor(dateEditor);
		dateSpinner.setValue(new Date()); 
		timeSpinner = new JSpinner( new SpinnerDateModel() );
		JSpinner.DateEditor timeEditor = new JSpinner.DateEditor(timeSpinner, "HH:mm:ss");
		timeSpinner.setEditor(timeEditor);
		timeSpinner.setValue(new Date()); 
		
		inputComponents.add(textAreaComment);
		inputComponents.add(textFieldLat);
		inputComponents.add(textFieldLon);
		inputComponents.add(textFieldName);
		inputComponents.add(dateSpinner);
		inputComponents.add(timeSpinner);
		inputComponents.add(comboBoxView);
		
		inputLabels.add(labelName);
		inputLabels.add(labelView);
		inputLabels.add(labelComment);
		inputLabels.add(labelLattitude);
		inputLabels.add(labelLongitude);
		inputLabels.add(labelValidFromDate);
		
		JPanel panelName              = new JPanel(new FlowLayout(orientation)); 
		JPanel panelView              = new JPanel(new FlowLayout(orientation));
		JPanel panelComment           = new JPanel(new FlowLayout(orientation));
		JPanel panelLattitude         = new JPanel(new FlowLayout(orientation));
		JPanel panelLongitude         = new JPanel(new FlowLayout(orientation));
		JPanel panelValidFromDateTimeWithLabel = new JPanel(new FlowLayout(orientation));
		
		JPanel panelValidFromDateTimeWithout = new JPanel(new FlowLayout(orientation) );
		panelValidFromDateTimeWithout.setPreferredSize(new Dimension(iw, 30));
		
		panelValidFromDateTimeWithLabel.setMinimumSize(new Dimension(iw, 30));
		
		if (currentDisplayMode.equals(DisplayMode.vertical_align_left))
		{
			panelName.add(textFieldName);
			panelName.add(labelName);
			panelView.add(comboBoxView);
			panelView.add(labelView);
			panelComment.add(textAreaComment);
			panelComment.add(labelComment);
			panelLattitude.add(textFieldLat);
			panelLattitude.add(labelLattitude);
			panelLongitude.add(textFieldLon);
			panelLongitude.add(labelLongitude);
			
			panelValidFromDateTimeWithout.add(dateSpinner);
			panelValidFromDateTimeWithout.add(timeSpinner);
			panelValidFromDateTimeWithLabel.add(panelValidFromDateTimeWithout);
			panelValidFromDateTimeWithLabel.add(labelValidFromDate);
		}
		else
		{
			panelName.add(labelName);
			panelName.add(textFieldName);
			panelView.add(labelView);
			panelView.add(comboBoxView);
			panelComment.add(labelComment);
			panelComment.add(textAreaComment);
			panelLattitude.add(labelLattitude);
			panelLattitude.add(textFieldLat);
			panelLongitude.add(labelLongitude);
			panelLongitude.add(textFieldLon);
			
			panelValidFromDateTimeWithout.add(timeSpinner);
			panelValidFromDateTimeWithout.add(dateSpinner);
			panelValidFromDateTimeWithLabel.add(labelValidFromDate);
			panelValidFromDateTimeWithLabel.add(panelValidFromDateTimeWithout);
		}
		
		dataPanel.add(panelName);
		dataPanel.add(panelValidFromDateTimeWithLabel);
		dataPanel.add(panelView);
		dataPanel.add(panelLattitude);
		dataPanel.add(panelLongitude);
		dataPanel.add(panelComment);

		dataPanel.setMinimumSize(new Dimension(250, 100));
		dataPanel.setMaximumSize(new Dimension(310, 100));
		
//		for (Component c : inputComponents)
//			c.setEnabled(false);
		
//		if (currentDisplayMode.equals(DisplayMode.horizontal))
////			this.setMinimumSize(new Dimension(dpw, dph));
//		else
//		{
////			this.setMinimumSize(new Dimension(100, 500));
////			this.setMaximumSize(new Dimension(100, 500));
//		}
		
		this.add(zooPanel);
		this.add(dataPanel);
		
		
	}
	
	public void setData(MetaData data)
	{
		if (currentData!=null)
		{
			currentData.setName(textFieldName.getText());
			currentData.setComment(textAreaComment.getText());
		}
		
		currentData = data;
		
		textFieldName.setText(data.getName());
		textAreaComment.setText(data.getComment());
		
		BufferedImage img = null;
		Image resizedImage = null;
		Image resizedImageHover = null;
		try
		{
			if (currentData.getThumbnail()==null)
			{
				String outputFileName = currentData.getFileName().substring(0, currentData.getFileName().length()-4) + ".tn.jpg";
				
				resizedImage = ImgUtils.getThumbnailAsImage(outputFileName, Thumbnail.width, Thumbnail.height);
				currentData.setThumbnail(outputFileName);
			}
			else
			{
				System.out.println("loading from existing file");
				resizedImage = ImageIO.read(new File(currentData.getThumbnail()));
			}
			
			if (currentData.getZooName()!=null)
			{
				img = ImageIO.read(new File(currentData.getZooName()));
				resizedImageHover = img.getScaledInstance(150, 250, Image.SCALE_SMOOTH);
			}
			else
				resizedImageHover = resizedImage;
			
			icon.setImage(resizedImage);
			iconHover.setImage(resizedImageHover);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		
	}
	
	public void setLabelsVisible(boolean visible)
	{
		for (JLabel label : inputLabels)
			label.setVisible(visible);
	}
	
	public void showData()
	{
		dataPanel.setVisible(true);
		imgLabel.setVisible(false);
	}
	
	public JPanel getDataPanel() {
		return dataPanel;
	}
	
	public void maximizeImage(boolean b)
	{
		if (b)
		{
			Image resizedImage = null;
			Image img = null;
			try
			{
				//TODO
				if (currentData==null)
					img = ImageIO.read(new File(Settings.imgPath + "/bt/2014/BauchbilderBa_BIL1/05_BauchbilderBa_16_05_2014_BIL/14Ba_0021.JPG"));
				else
					img = ImageIO.read(new File(currentData.getFileName()));
				
				resizedImage = img.getScaledInstance(GUISettings.defaultImageCompareWidth, dph, Image.SCALE_SMOOTH);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
			icon.setImage(resizedImage);
			
			imgLabel.setPreferredSize(new Dimension(GUISettings.defaultImageCompareWidth, dph));
			imgHoverEnabled = false;
			this.dataPanel.setVisible(false);
			
		}
		else
		{
			imgHoverEnabled = true;
			imgLabel.setPreferredSize(new Dimension(iw, 268));
			this.dataPanel.setVisible(false);
		}
		this.revalidate();
		this.repaint();
//		this.zooPanel.setMinimumSize(new Dimension(dpw, dph));
//		this.zooPanel.setPreferredSize(new Dimension(dpw, dph));
	}

}
