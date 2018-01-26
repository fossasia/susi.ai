package com.zooracle.view.swing;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;

import com.zooracle.main.Controller;
import com.zooracle.model.AnimalDatabase;
import com.zooracle.model.FilterSettings;
import com.zooracle.model.ToadDataPanel;
import com.zooracle.view.swing.MetaDataPanel.DisplayMode;

public class DatabaseManagerView  extends ZooracleContentPanel
{

	private JPanel browserFrame;
	private JPanel compareView;
	private MetaDataPanel currentCompareFrom;
	private MetaDataPanel currentCompareTo;
	private ThumbnailList thumbnailList;
	private ThumbnailFilter thumbnailFilter;

	public DatabaseManagerView(MainWindow mainWindow)
	{
		super(mainWindow);
		if (Controller.currentDB!=null)
		{
			
		}
		
		browserFrame = new JPanel();
		browserFrame.setBorder(BorderFactory.createTitledBorder(new LineBorder(Color.BLACK), Locale.labelBrowser));
		browserFrame.setLayout(new BorderLayout());
		
		thumbnailList = new ThumbnailList();
		thumbnailFilter = new ThumbnailFilter(thumbnailList);
		
		browserFrame.add(thumbnailFilter, BorderLayout.NORTH);
		browserFrame.add(thumbnailList, BorderLayout.CENTER);
				
		compareView = new JPanel();
		
		currentCompareFrom = new ToadDataPanel(DisplayMode.vertical_align_right);
		currentCompareTo = new ToadDataPanel(DisplayMode.vertical_align_left);
		currentCompareTo.setBackground(new Color(100,100,100));
		currentCompareTo.setLabelsVisible(false);
		
		
		currentCompareTo.setBorder(BorderFactory.createLineBorder(Color.BLACK, 1, true));
		currentCompareTo.getDataPanel().setBackground(Color.RED);
		currentCompareTo.getDataPanel().revalidate();
		currentCompareTo.getDataPanel().repaint();
		
		compareView.add(currentCompareFrom);
		compareView.add(currentCompareTo);
		compareView.setBorder(BorderFactory.createTitledBorder(new LineBorder(Color.BLACK), Locale.labelCompareView));
		
		this.add(browserFrame);
		this.add(compareView);
		resizeComponents();
		
		this.addComponentListener(new ComponentListener() {
			public void componentShown(ComponentEvent e) {}
			public void componentResized(ComponentEvent e) {
				resizeComponents();
			}
			public void componentMoved(ComponentEvent e) {}
			public void componentHidden(ComponentEvent e) {}
		});
	}
	
	public void resizeComponents()
	{
		browserFrame.setPreferredSize(new Dimension(mainWindow.getWidth()/ 4-30, mainWindow.getHeight() - 120));
		compareView.setPreferredSize(new Dimension(3*mainWindow.getWidth()/ 4-30, mainWindow.getHeight()  - 120));
	}

	public void setFilter(FilterSettings importFilterSettings) {
		this.thumbnailFilter.setFilterSettings(importFilterSettings);
		
	}
	
	

}
