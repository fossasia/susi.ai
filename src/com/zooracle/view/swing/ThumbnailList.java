package com.zooracle.view.swing;

import java.awt.Color;
import java.util.ArrayList;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ScrollPaneConstants;

import com.zooracle.main.ThumbnailCaller;
import com.zooracle.model.MetaData;

public class ThumbnailList extends JScrollPane implements ThumbnailCaller
{
	private ArrayList<MetaData> metaDataEntries;
	
	private JPanel content;
//	private JScrollPane thumbnailScrollPane;
	
	public ThumbnailList()
	{
		metaDataEntries = new ArrayList<MetaData>();
		
		
		content = new JPanel();
		content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
		
//		thumbnailScrollPane = new JScrollPane(content);
		content.setBackground(new Color(133,133,133));
		this.setViewportView(content);
		this.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);
		this.setBorder(BorderFactory.createLineBorder(Color.BLACK));
	}
	
	public void updateThumbnails(ArrayList<MetaData> metaDataEntries)
	{
		this.metaDataEntries.clear();
		this.metaDataEntries = metaDataEntries;
		this.content.removeAll();
		
		for (MetaData metaData : metaDataEntries)
		{
			this.content.add(new Thumbnail(metaData, ThumbnailList.this));
		}
		this.revalidate();
		
		
		
		
	}

	public void thumbnailClicked(Thumbnail thumbnail) {
		System.out.println(thumbnail.getMetaData() + " selected.");
	}

}
