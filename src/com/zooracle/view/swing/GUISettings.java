package com.zooracle.view.swing;

import java.awt.Color;
import java.awt.Dimension;

import javax.swing.JLabel;
import javax.swing.SwingConstants;

public class GUISettings
{
	
	public static Color windowColor = new Color(140,170,180);
	public static int defaultLabelWidth = 100;
	public static int defaultLabelHeight = 25;
	public static int defaultInputWidth = 180;
	public static int defaultPanelWidth = 500;
	public static int defaultPanelHeight = 500;
	
	public static int defaultImageCompareWidth = 300;
	
	
	public static Color itemEditedForegroundColor = new Color(0,0,0);
	public static Color itemEditedBackgroundColor = new Color(255,255,170);
	public static Color itemSelectedForegroundColor = new Color(0,0,0);
	public static Color itemSelectedBackgroundColor = new Color(220,220,150);
	
	public static JLabel getDefaultLabel(String title, int width, int height, int align, int valign)
	{
		JLabel label = new JLabel(" " + title + " ", align);
		label.setPreferredSize(new Dimension(width, height));
		label.setVerticalAlignment(valign);
		return label;
	}

}
