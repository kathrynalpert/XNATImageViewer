KA added: 

https://wiki.xnat.org/display/XNAT16/XNAT+Configuration+Framework

```
[tomcat@opera ~]$ curl -b JSESSIONID=$jses "$NUNDA_HOST/data/projects/ka_test/config/XImgView/experimentReconstructions/filters?inbody=true" -d @recon.json -X PUT
[tomcat@opera ~]$ cat recon.json 
{ "/.*/": [ "/.*nii.*/" ] }

tomcat@opera ~]$ curl -b JSESSIONID=$jses "$NUNDA_HOST/data/projects/ka_test/config/XImgView/experimentResources/filters?inbody=true" -d @res.json -X PUT
[tomcat@opera ~]$ cat res.json 
{ "/NIFTI/": [ "/.*/" ] }

select c.tool, c.path, c.status, c.unversioned, c.reason, d.contents from xhbm_configuration c, xhbm_configuration_data d where c.tool = ‘toolName' and c.path = 'path' and c.config_data = d.id;
```

_Creating a New Configuration_
The REST URL for creating a new configuration is:
PUT http://server/data/config/toolName/path?inbody=true
Where:
server is the address to your XNAT server (you may also have a path on the server for /xnat or something similar)
toolName is the feature or tool that will use the configuration you're storing
path is an arbitrary path on the URL; these paths are used to distinguish multiple configurations for the same tool
You'll need to specify the contents of your configuration in the request body. Note that the format of the configuration contents is completely dependent on the needs of the tool you're configuring. The configuration service itself doesn't really care what those contents are.

_Enabling and Disabling an Existing Configuration_
To enable or disable a configuration, you just need to make a PUT call to the REST URL for the configuration with the query variable status set to the state you want:
PUT http://server/data/config/toolName/path?status=[enabled|disabled]
You can check the configuration again to make sure everything is set properly. You can toggle the enabled and disabled states by calling these successively.


The XNATImageViewer is the official HTML5 web neuroimage viewing module for [XNAT](http://www.xnat.org/).  It's built on [XTK](https://github.com/xtk/X#readme), [Google Closure](https://developers.google.com/closure/), [JSZip](http://stuk.github.io/jszip/), and [Sass](http://sass-lang.com/).

Demo
--------------
[![Demo](https://raw.githubusercontent.com/MokaCreativeLLC/XNATImageViewer/master/src/main/images/viewer/xiv/ui/Demo/Demo-orig.jpg)](http://mokacreativellc.github.io/XNATImageViewer/Demo.html)
[Click here or on image](http://mokacreativellc.github.io/XNATImageViewer/Demo.html).

Features
----
* Visualize and interact XNAT-hosted image sets in 2D and 3D directly from XNAT.
* Visualize Slicer scenes (.mrb), and their views.
* Visualize DICOM that were previously unsupported in XTK.

Installation
------------

To install the XNAT image viewer into an XNAT installation:

1. Make sure that you have an XNAT 1.6.4 or later installation or have updated your xnat_builder to 1.6.4 or later (if you've updated just your builder, it would be a good idea to first [update your XNAT installation](https://wiki.xnat.org/display/XNAT16/How+to+Upgrade+XNAT#HowtoUpgradeXNAT-NewReleaseOldDatabase) without the XNAT image viewer module and make sure the upgraded XNAT works properly).

2. Clone the [XNAT image viewer github repository](https://github.com/NrgXnat/XNATImageViewer).

3. Change directory to the cloned repository folder.

4. Run a maven package operation:

        mvn clean package

5. Copy the resulting **target/xnatx-ximgview-*version*.jar** file to your xnat_builder's modules folder (this is either a folder named **modules** directly under the xnat_builder folder or specified by the **xdat.modules.location** variable in your **build.properties** file).

6. Run the update script to install the module in your deployed web application.

7. Start Tomcat, log into your XNAT server, and browse to any of your MR sessions. You should now see an action labeled **View Images** to view the image over in the Actions box.

8. The older ImageJ-based image viewer also may have an actions link labeled **View Images**.  You may want to relabel that link, by editing the relevant data types (e.g. MR Session) through the **Administer-->Data Types** link.

