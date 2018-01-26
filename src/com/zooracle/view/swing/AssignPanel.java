package com.zooracle.view.swing;

import java.awt.Dimension;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JPanel;

public class AssignPanel extends JPanel{
	
	private ZooracleContentPanel zooracleContentPanel;

	public AssignPanel(ZooracleContentPanel zooracleContentPanel) {
		
		this.zooracleContentPanel = zooracleContentPanel;
		
		this.setBackground(GUISettings.windowColor);
		this.setForeground(GUISettings.windowColor);
		this.setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
		
//		this.setBorder(BorderFactory.createEtchedBorder());
		
		this.setPreferredSize(new Dimension(300, 500));
		this.setMinimumSize(new Dimension(300, 500));
	}
	

}
