package tools;

import java.awt.Component;
import java.io.File;
import java.util.ArrayList;

import javax.swing.JFileChooser;
import javax.swing.filechooser.FileFilter;

public class FileUtils
{

	public static void getImages(String directoryName, ArrayList<File> files, boolean selectZoo)
	{
		File directory = new File(directoryName);
		File[] fList = directory.listFiles();
		for (File file : fList)
		{
			if (file.isFile())
			{
				if (file.getName().toLowerCase().endsWith(".kp") || file.getName().toLowerCase().endsWith(".dsc") || file.getName().toLowerCase().contains(".compare"))
					continue;
				
				if ((file.getName().toLowerCase().contains(".png")) ||
					(file.getName().toLowerCase().contains(".jpg")) ||
					(file.getName().toLowerCase().contains(".jpeg")) ||
					(file.getName().toLowerCase().contains(".bmp")))
				{
					if (selectZoo)
					{
						if (file.getName().toLowerCase().contains(".zoo"))
							files.add(file);
					}
					else
					{
						if (!file.getName().toLowerCase().contains(".zoo"))
							files.add(file);
					}
				}
			}
			else if (file.isDirectory())
			{
				getImages(file.getAbsolutePath(), files, selectZoo);
			}
		}
	}

	public static String selectDirectory(Component component, String choosertitle)
	{
		JFileChooser chooser = new JFileChooser(); 
	    chooser.setCurrentDirectory(new java.io.File("."));
	    chooser.setDialogTitle(choosertitle);
	    chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
	    chooser.setAcceptAllFileFilterUsed(false);
	    
	    if (chooser.showOpenDialog(component) == JFileChooser.APPROVE_OPTION) { 
	      System.out.println("getCurrentDirectory(): "  +  chooser.getCurrentDirectory());
	      System.out.println("getSelectedFile() : "  +  chooser.getSelectedFile());
	      return chooser.getSelectedFile().toString();
	      }
	    else {
	      System.out.println("No Selection ");
	      return null;
	      }
	    
	}
	
	public static String selectFile(Component component, String choosertitle, String startDirectory)
	{
		JFileChooser chooser = new JFileChooser(); 
		chooser.setCurrentDirectory(new File(startDirectory!=null?".":startDirectory));
		chooser.setDialogTitle(choosertitle);
		chooser.setFileFilter(new FileFilter() {
			@Override
			public String getDescription() {
				return "batch list XML file";
			}
			@Override
			public boolean accept(File f) {
				if (f.isFile())
				{
					if (f.toString().toLowerCase().endsWith("xml"))
						return true;
				}
				return false;
			}
		});
		chooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
		chooser.setAcceptAllFileFilterUsed(false);
		
		if (chooser.showOpenDialog(component) == JFileChooser.APPROVE_OPTION) { 
			System.out.println("getCurrentDirectory(): "  +  chooser.getCurrentDirectory());
			System.out.println("getSelectedFile() : "  +  chooser.getSelectedFile());
			return chooser.getSelectedFile().toString();
		}
		else {
			System.out.println("No Selection ");
			return null;
		}
		
	}
	
	public static String saveFile(Component component, String choosertitle, String startDirectory)
	{
		JFileChooser chooser = new JFileChooser(); 
		chooser.setCurrentDirectory(new java.io.File(startDirectory!=null?".":startDirectory));
		chooser.setDialogTitle(choosertitle);
		chooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
		chooser.setAcceptAllFileFilterUsed(false);
		
		if (chooser.showSaveDialog(component) == JFileChooser.APPROVE_OPTION) { 
			System.out.println("getCurrentDirectory(): "  +  chooser.getCurrentDirectory());
			System.out.println("getSelectedFile() : "  +  chooser.getSelectedFile());
			return chooser.getSelectedFile().toString();
		}
		else {
			System.out.println("No Selection ");
			return null;
		}
		
	}

}
