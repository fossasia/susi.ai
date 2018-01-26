package com.zooracle.main;

import javax.swing.JPanel;

import com.zooracle.view.swing.MainWindow;

public class ZooracleModule extends JPanel
{
	private Controller controller;
	public static String moduleTitle;
	protected boolean unsavedChange = false;

	public ZooracleModule(Controller controller)
	{
		this.controller = controller;
	}
	
	public Controller getMainWindow()
	{
		return controller;
	}
	
	public void setMainWindow(Controller controller)
	{
		this.controller = controller;
	}
	
	public void setModuleTitle(String moduleTitle)
	{
		this.moduleTitle = moduleTitle;
	}
	
	public String getModuleTitle()
	{
		return this.moduleTitle;
	}

	public boolean isUnsavedChange() {
		return unsavedChange;
	}

	public void setUnsavedChange(boolean unsavedChange) {
		this.unsavedChange = unsavedChange;
	}
	

}
