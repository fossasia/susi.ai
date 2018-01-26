package com.zooracle.view.swing;

import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingConstants;

public class IndividualDataPanel extends JPanel
{
	
	private JLabel labelName;
	private JLabel labelComment;
	private JLabel labelGender;
	private JLabel labelMetaData;
	
	private JTextField textFieldName;
	private JComboBox comboBoxGender;
	private JTextArea  textAreaComment;
	
	private JList metaList;
	private ZooracleContentPanel zooracleContentPanel;
	
	private int lw = GUISettings.defaultLabelWidth;
	private int lh = GUISettings.defaultLabelHeight;
	private int a = SwingConstants.RIGHT;
	private int va = SwingConstants.TOP;
	
	
	public IndividualDataPanel(ZooracleContentPanel zooracleContentPanel)
	{
		this.zooracleContentPanel = zooracleContentPanel;
		
		labelName     = GUISettings.getDefaultLabel(Locale.labelName, lw, lh, a, va); 
		labelGender   = GUISettings.getDefaultLabel(Locale.labelSex, lw, lh, a, va);
		labelComment  = GUISettings.getDefaultLabel(Locale.labelComment, lw, 80, a, va);
		labelMetaData = GUISettings.getDefaultLabel(Locale.labelMetaData, lw, 100, a, va);
		
		textFieldName = new JTextField("");   textFieldName.setPreferredSize(new Dimension(200, 30)); textFieldName.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textAreaComment = new JTextArea();  textAreaComment.setPreferredSize(new Dimension(200, 80)); 
		textAreaComment.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		
		comboBoxGender = new JComboBox(); 
//		comboBoxGender.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		for (Object item : Locale.dropDownGenders)
			comboBoxGender.addItem(item);
		
		// Create some items to add to the list
		String listData[] =
		{
			"BT_1.1",
			"BT_1.2",
			"BT_1.3",
			"BT_1.4"
		};
		
		metaList = new JList(listData);
		JScrollPane metaScrollPane = new JScrollPane(metaList, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		metaScrollPane.setPreferredSize(new Dimension(200, 100));
		
		
		this.setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
		
		JPanel panelName     = new JPanel(new FlowLayout(FlowLayout.LEFT)); 
		JPanel panelGender   = new JPanel(new FlowLayout(FlowLayout.LEFT));
		JPanel panelComment  = new JPanel(new FlowLayout(FlowLayout.LEFT));
		JPanel panelMetaList = new JPanel(new FlowLayout(FlowLayout.LEFT));
		
		
		panelName.add(labelName);
		panelName.add(textFieldName);

		panelGender.add(labelGender);
		panelGender.add(comboBoxGender);

		panelComment.add(labelComment);
		panelComment.add(textAreaComment);

		panelMetaList.add(labelMetaData);
		panelMetaList.add(metaScrollPane);
		
		this.add(panelName);
		this.add(panelGender);
		this.add(panelComment);
		this.add(panelMetaList);
		
		this.setBackground(GUISettings.windowColor);
		this.setForeground(GUISettings.windowColor);
		
		this.setMinimumSize(new Dimension(300, 500));
		
		
	}

}
