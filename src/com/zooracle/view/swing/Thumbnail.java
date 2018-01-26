package com.zooracle.view.swing;

import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.EventListener;

import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JPanel;

import com.zooracle.main.ThumbnailCaller;
import com.zooracle.model.MetaData;

import tools.ImgUtils;

public class Thumbnail extends JPanel
{
	public static int width = 150;
	public static int height = 200;
	
	Image resizedImage = null;
	Image resizedImageHover = null;
	private MetaData metaData;
	private ImageIcon icon;
	private JLabel imgLabel;
	private ThumbnailCaller caller;
	
	public Thumbnail(MetaData metaData, ThumbnailCaller caller)
	{
		this.metaData = metaData;
		imgLabel = new JLabel();
		this.caller = caller;
		
		BufferedImage img = null;
		resizedImage = ImgUtils.getThumbnailAsImage(metaData.getFileName(), width, height);
				
		if (resizedImage!=null)
		{
			icon = new ImageIcon(resizedImage);
			imgLabel.setIcon(icon);
		}
		else
		{
			imgLabel.setBackground(Color.GREEN);
		}
		
        imgLabel.addMouseListener(new MouseListener()
		{
			public void mouseReleased(MouseEvent e){}
			public void mousePressed(MouseEvent e) {}
			public void mouseExited(MouseEvent e)
			{
				setCursor(Cursor.getDefaultCursor());
			}
			public void mouseEntered(MouseEvent e)
			{
				Cursor cursor = Cursor.getPredefinedCursor(Cursor.HAND_CURSOR); 
				setCursor(cursor);
			}
			public void mouseClicked(MouseEvent e)
			{
				if (Thumbnail.this.caller!=null)
					Thumbnail.this.caller.thumbnailClicked(Thumbnail.this);
			}
		});        
        imgLabel.setPreferredSize(new Dimension(width, height));
        imgLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        this.add(imgLabel);
	}
	
	public MetaData getMetaData() {
		return metaData;
	}

}
