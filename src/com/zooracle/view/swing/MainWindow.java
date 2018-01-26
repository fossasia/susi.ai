package com.zooracle.view.swing;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.swing.BorderFactory;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;

import org.opencv.core.Core;

import com.zooracle.main.AnimalDatabaseManager;
import com.zooracle.main.SQLiteInterface;
import com.zooracle.main.Settings;
import com.zooracle.main.ZooracleModule;
import com.zooracle.model.AnimalDatabase;
import com.zooracle.model.FilterSettings;
import com.zooracle.model.Individual;
import com.zooracle.model.MetaData;
import com.zooracle.model.ToadData;
import com.zooracle.model.ToadDatabase;

import tools.legacy.ImageEditorIO;


public class MainWindow extends JFrame
{
	public static void main(String[] args) {
		
	}
	
	
	private static MainWindow instance = null;

	public static MainWindow getInstance()
	{
		if (instance == null)
			instance = new MainWindow();
		return instance;
	}
	
	
	private static int width = 1280;
	private static int height = 720;
	private ZooracleContentPanel content;
	private JMenuBar menu;
	private JLabel infoPanel;
	private String currentInfo;
	private String defaultTitle = "Zooracle Desktop V 1.0";
	private String currentTitle = defaultTitle;
	
	private JMenu menuFile;
	private JMenu menuBatch;
	private JMenu menuHelp;
	
	private JMenuItem menuBatchLoadList;
	private JMenuItem menuBatchSaveList;
	private JMenuItem menuBatchScan;
	private JMenuItem menuGenerate;
	
	private boolean unsavedChange = false;
	
	
	
	protected Locale locale = new Locale();
//	public static AnimalDatabase animalDB;
//	public static AnimalDatabase getAnimalDB() {
//		return animalDB;
//	}
	
	
	
	public MainWindow()
	{
		System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
		
		this.setBackground(GUISettings.windowColor);
//		System.loadLibrary(System.getProperty("java.library.path") + "\\" + Core.NATIVE_LIBRARY_NAME);
		
		this.setTitle(currentTitle);
		this.menu = new JMenuBar();
		
		this.menuFile = new JMenu(locale.menuFile);
		this.menuBatch = new JMenu(locale.menuBatch);
		this.menuHelp = new JMenu(locale.menuHelp);
		
		initBatchMenu();
		
		this.menuBatch.add(menuGenerate);
		this.menuBatch.add(menuBatchLoadList);
		this.menuBatch.add(menuBatchSaveList);
		this.menuBatch.add(menuBatchScan);
		
		this.menu.add(menuFile);
		this.menu.add(menuBatch);
		this.menu.add(menuHelp);
		
		
		this.infoPanel = new JLabel(locale.ZooracleFooterNotice);
		this.infoPanel.setBorder(BorderFactory.createLoweredSoftBevelBorder());
		this.infoPanel.setBackground(new Color(170,170,170));
		
		this.setSize(width, height);
//		this.setLocationRelativeTo(null);
//		this.setLocation(0,0);
//		this.setLocation(this.getLocation().x-250, this.getLocation().y);
		
		this.setLayout(new BorderLayout());
		
		this.setJMenuBar(this.menu);
		
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		this.content = new ZooracleContentPanel(this);
//		this.content.setBackground(new Color(150,150,160));
		
		this.add(this.content,BorderLayout.CENTER);
		this.add(this.infoPanel, BorderLayout.SOUTH);
		
//		this.setResizable(false);
		this.setVisible(true);
		
//		this.setLocation(1400, 0);
	}

	private void initBatchMenu() {
		
		this.menuBatchLoadList = new JMenuItem(locale.menuBatchLoadList);
		this.menuBatchSaveList = new JMenuItem(locale.menuBatchSaveList);
		this.menuBatchScan = new JMenuItem(locale.menuBatchScan);
		this.menuGenerate = new JMenuItem(locale.menuGenerate);
		
	}
	
	public void setCurrentInfo(String currentInfo)
	{
		this.currentInfo = currentInfo;
		this.infoPanel.setText(currentInfo);
	}
	
	public void setContent(ZooracleContentPanel content)
	{
		this.remove(this.content);
		this.content = content;
		this.add(this.content,BorderLayout.CENTER);
		this.updateTitle(content.getContentTitle());
		this.validate();
	}

	private void updateTitle(String moduleTitle)
	{
		this.currentTitle = defaultTitle + " " + moduleTitle;
		this.setTitle(currentTitle);		
	}
	
	
	
	
}
