package com.zooracle.view.swing;

import javax.swing.BorderFactory;
import javax.swing.JPanel;

import com.zooracle.main.ZooracleModule;
import com.zooracle.view.swing.MainWindow;

public class ZooracleContentPanel extends JPanel
{
	public MainWindow mainWindow;
	public static String contentTitle;
	protected boolean unsavedChange = false;
	protected ZooracleModule module;

	public ZooracleContentPanel(MainWindow mainWindow)
	{
		this.mainWindow = mainWindow;
		this.setBackground(GUISettings.windowColor);
		this.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
	}
	
	public MainWindow getMainWindow()
	{
		return mainWindow;
	}
	
	public void setMainWindow(MainWindow mainWindow)
	{
		this.mainWindow = mainWindow;
	}
	
	public void setContentTitle(String moduleTitle)
	{
		this.contentTitle = moduleTitle;
	}
	
	public String getContentTitle()
	{
		return this.contentTitle;
	}

	public boolean isUnsavedChange() {
		return unsavedChange;
	}

	public void setUnsavedChange(boolean unsavedChange) {
		this.unsavedChange = unsavedChange;
	}
	

}
