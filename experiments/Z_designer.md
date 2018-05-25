Experiment Designer
---

### Create your own data acquisition sequence

The Experiment Designer allows you to define the control and readback sequences of parameters and execute them, explained below
using Transistor CE characteristics as an example.

To plot Vc vs Ic, we need to:
1. Select a base current by setting the value of PV2.
2. Sweep PV1 from 0 to 5V in steps and read CH1 (Vc) in each step.
3. Calculate Ic by the equation (PV1 - CH1)/Rc
4. Plot CH1 vs Ic

Step 1: Select PV2 for manual control and PV1 for sweep as shown below.
Add a derived parameter for Ic using the format I = (PV1() - CH1())/1000, the empty parantheses are necessary in the equation.

### Screenshots

#### Help file for the diode IV experiment shown alongside the designer
![](https://fossasia.github.io/pslab-experiments/images/screenshots/design1.png)

#### Set up the experiment
![](https://fossasia.github.io/pslab-experiments/images/screenshots/design2.png)
* Select PV1 as a sweep channel that will be set to 100 equally spaced values between 0V and 5V
* Select CH1 as a readback channel to read the voltage drop across the diode
* add a derived channel Ic , `(PV1() - CH1())/1000` . This equation calculates the current flow for us
* Click on the `Prepare Experiment` button

#### Make the measurements
![](https://fossasia.github.io/pslab-experiments/images/screenshots/design3.png)
* Click on Evaluate all rows to get the entire dataset.
* Select CH1, current(Ic) columns, and click on the plot button. Hold down the `ctrl` key to select multiple columns. You can also drag across the title bars to select adjacent columns

#### Plotting the columns
![](https://fossasia.github.io/pslab-experiments/images/screenshots/design4.png)
* If the order of the selected columns should be reversed, you can specify that at this point

#### Your plot is ready!
![](https://fossasia.github.io/pslab-experiments/images/screenshots/design5.png)

#### Use the save option to view raw data as well as save it to csv,txt,png,svg... formats
![](https://fossasia.github.io/pslab-experiments/images/screenshots/design6.png)

