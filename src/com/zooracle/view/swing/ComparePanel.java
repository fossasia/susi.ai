package com.zooracle.view.swing;

import java.util.Date;

import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSpinner;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SpinnerDateModel;

public class ComparePanel extends JPanel
{
	private JTextField name;
	private JSpinner dateSpinner;
	private JSpinner timeSpinner;
	private JComboBox<String> view;
	
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
	
	
	public ComparePanel()
	{
		dateSpinner = new JSpinner( new SpinnerDateModel() );
		JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(dateSpinner, "dd.MM.yyyy");
		dateSpinner.setEditor(dateEditor);
		dateSpinner.setValue(new Date()); 
		timeSpinner = new JSpinner( new SpinnerDateModel() );
		JSpinner.DateEditor timeEditor = new JSpinner.DateEditor(timeSpinner, "HH:mm:ss");
		timeSpinner.setEditor(timeEditor);
		timeSpinner.setValue(new Date()); 
		
	}

}
