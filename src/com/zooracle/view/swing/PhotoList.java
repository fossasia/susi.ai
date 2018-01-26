package com.zooracle.view.swing;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.util.ArrayList;
import java.util.Random;

import javax.swing.BoxLayout;
import javax.swing.DefaultListCellRenderer;
import javax.swing.DefaultListSelectionModel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;

//import main.ImageEditor;

public class PhotoList extends JPanel
{

	private int lastSelectionIndex = -1;

	private JPanel topPanel;
	private JTable table;
	private JScrollPane scrollPane;
	private ZooracleContentPanel zooracleContentPanel;

	private boolean maximized = false;

	private DefaultListSelectionModel selectionModel;

	private DefaultTableModel model;

//	private String columnNames[] = new String[] { Locale.labelAlias, Locale.labelId, Locale.labelPhotoName };
	private String columnNames[] = new String[] { Locale.labelPhotoName };
	
	private ArrayList<Integer> itemEdited = new ArrayList<Integer>();

	// Constructor of main frame
	public PhotoList(ZooracleContentPanel zooracleContentPanel)
	{

		this.setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
		this.zooracleContentPanel = zooracleContentPanel;
		// Set the frame characteristics
//		setSize(150, 600);
		setBackground(Color.gray);

		// Create a panel to hold all other components
		topPanel = new JPanel();
		topPanel.setLayout(new BoxLayout(topPanel, BoxLayout.Y_AXIS));

		this.add(topPanel);


		// Create some data
//		String dataValues[][] = { { "12", "234", "67" }, { "-123", "43", "853" }, { "93", "89.2", "109" }, { "279", "9033", "3092" } };

		// Create a new table instance
		table = new JTable(null, columnNames);
//		table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);

//		table.setMinimumSize(new Dimension(150, 600));
//		table.setPreferredSize(new Dimension(150, 600));

		// table.setD
		selectionModel = new DefaultListSelectionModel();
		
		model = new DefaultTableModel();
		

		// table.setC
		selectionModel.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
		selectionModel.addListSelectionListener(new ListSelectionListener()
		{

			public void valueChanged(ListSelectionEvent e)
			{
				int selectionIndex = table.getSelectedRow();
				if (lastSelectionIndex != selectionIndex)
				{
					
					lastSelectionIndex = selectionIndex;
					
					if (selectionIndex==-1)
						return;
					System.out.println(table.getValueAt(selectionIndex, 0));
					System.out.println("sele:" + selectionIndex);
					
					if (PhotoList.this.zooracleContentPanel instanceof ImportView)
					{
						((ImportView)(PhotoList.this.zooracleContentPanel)).setCurrentPhoto(selectionIndex);
					}
//					if (selectionIndex > 2)
//						PhotoList.this.maximize(false);
				}
			}
		});
		// table.setDefaultRenderer(Object.class, new EditedCellRenderer(this));
		table.setSelectionModel(selectionModel);
		table.setDefaultRenderer(String.class, new BoardTableCellRenderer());
		table.setDefaultRenderer(Object.class, new BoardTableCellRenderer());
		
		table.setModel(model);
//		table.setMaximumSize(new Dimension(100, 300));
		

		// Add the table to a scrolling pane
		scrollPane = new JScrollPane();
//		scrollPane.add(table.getTableHeader());
//		scrollPane.add(table);
//		topPanel.add(scrollPane);
		
		topPanel.add(table.getTableHeader());
		topPanel.add(new JScrollPane(table));
	}
	//
	// // Main entry point for this example
	// public static void main(String args[])
	// {
	// // Create an instance of the test application
	// PhotoList mainFrame = new PhotoList();
	//
	// mainFrame.setVisible(true);
	// }

	public void maximize(boolean b)
	{
		this.maximized = b;
		if (b)
		{
			topPanel.setMinimumSize(new Dimension(900, 600));
			topPanel.setPreferredSize(new Dimension(900, 600));
			topPanel.setMaximumSize(new Dimension(900, 600));

		} else
		{

			topPanel.setMinimumSize(new Dimension(180, 600));
			topPanel.setPreferredSize(new Dimension(180, 600));
			topPanel.setMaximumSize(new Dimension(190, 600));
		}
		// System.out.println("repaintin");
		this.revalidate();
		this.repaint();
	}
	
	public DefaultListSelectionModel getSelectionModel() {
		return selectionModel;
	}

	public void setData(Object[][] data)
	{
		Object[][] fileNameData = new Object[data.length][1];
		for (int i = 0; i < data.length; i++)
			fileNameData[i][0] = data[i][2];
			
		itemEdited.clear();
		model.setDataVector(fileNameData, columnNames);
		
		scrollPane.revalidate();
		this.revalidate();
		this.repaint();
//		for (int i = model.getMaxSelectionIndex(); i > 0; i--)
//		{
//		if (model.getRowCount() > 0) {
//		    for (int i = myTableModel.getRowCount() - 1; i > -1; i--) {
//		        myTableModel.removeRow(i);
//		    }
//		}
		
//		model.removeIndexInterval(index0, index1);
//		}

		// model.r
	}

	class BoardTableCellRenderer extends DefaultTableCellRenderer
	{

		private static final long serialVersionUID = 1L;

		public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int col)
		{

			Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, col);
			Object valueAt = table.getModel().getValueAt(row, col);
			String s = "";
			if (valueAt != null)
			{
				s = valueAt.toString();
			}

//			if (s.contains("0"))
			if (isSelected)
			{
				c.setForeground(GUISettings.itemSelectedForegroundColor);
				c.setBackground(GUISettings.itemSelectedBackgroundColor);
				if (!itemEdited.contains(row))
					itemEdited.add(row);
			} else
			{
				if (itemEdited.contains(row))
				{
					c.setForeground(GUISettings.itemEditedForegroundColor);
					c.setBackground(GUISettings.itemEditedBackgroundColor);
				}
				else
				{
					c.setForeground(Color.black);
					c.setBackground(Color.white);	
				}
			}

			return c;
		}
	}

}
