/*
 * 
 *                  xxxxxxx      xxxxxxx
 *                   x:::::x    x:::::x 
 *                    x:::::x  x:::::x  
 *                     x:::::xx:::::x   
 *                      x::::::::::x    
 *                       x::::::::x     
 *                       x::::::::x     
 *                      x::::::::::x    
 *                     x:::::xx:::::x   
 *                    x:::::x  x:::::x  
 *                   x:::::x    x:::::x 
 *              THE xxxxxxx      xxxxxxx TOOLKIT
 *                    
 *                  http://www.goXTK.com
 *                   
 * Copyright (c) 2012 The X Toolkit Developers <dev@goXTK.com>
 *                   
 *    The X Toolkit (XTK) is licensed under the MIT License:
 *      http://www.opensource.org/licenses/mit-license.php
 * 
 *      'Free software' is a matter of liberty, not price.
 *      'Free' as in 'free speech', not as in 'free beer'.
 *                                         - Richard M. Stallman
 * 
 * 
 * CREDITS: Thank you to Thomas J. Re for his initial implementation.
 *
 */
// provides
goog.provide('X.parserDCM');
// requires
goog.require('X.event');
goog.require('X.object');
goog.require('X.parser');
goog.require('X.triplets');
goog.require('goog.math.Vec3');
goog.require('X.volume');
goog.require('goog.array');


/**
 * Create a parser for DICOM files.
 * 
 * @constructor
 * @extends X.parser
 */
X.parserDCM = function() {
  //
  // call the standard constructor of X.parser
  goog.base(this);
  //
  // class attributes
  /**
   * @inheritDoc
   * @const
   */
  this._classname = 'parserDCM';
};
// inherit from X.parser
goog.inherits(X.parserDCM, X.parser);


/**
 * @inheritDoc
 */
X.parserDCM.prototype.parse = function(container, object, data, flag) {
  // X.TIMER(this._classname + '.parse');
  // needed, for renderer2d and 3d legacy...
  object.MRI = {};
  object.MRI.loaded_files = 0;
  object.isMultiframeDicom = false;
//window.console.log("\n\nBegin parse");
  // parse the byte stream
  this.parseStream(data, object);

  // return;
  // X.TIMERSTOP(this._classname + '.parse');
  // check if all slices were completed loaded
  if (!goog.isDefAndNotNull(object._file.length) || object.slices.length == object._file.length) {

    // needed, for renderer2d and 3d legacy...
    object.MRI.loaded_files = object._file.length;

    //************************************
    //
    // ErasmusMC addition (start)
    //
    //------------------------------------
    // Explanation of addition:
    //
    // Removes any secondary DICOMs that cannot be displayed by checking for empty slice data.
    // When not removed, the imaging data cannot be displayed.
    // It also throws an error if this leads to a set of empty slices.
    //************************************

    // Find slices with no imaging data
    var slicesToRemove = new Array();
    for (var i = 0; i < object.slices.length; i++) {
        if (object.slices[i].data == null)
                slicesToRemove.push(i);
    }

    // Remove these slices
    for (var i = 0; i < slicesToRemove.length; i++) {
        object.slices.splice(slicesToRemove[i], 1);
    }

    // Check for empty imaging datasets
    if (object.slices.length == 0) {
        throw new Error('This scan does not contain imaging data that can be visualized.');
    }

    try {

       this.doSlicing(container, object, data, flag);
 
    } catch (e) {

       // The slicer has problems with some orientations that need to be tracked down.  Try slicer again specifying default orientation for all slices.
       console.log("ERROR: Slicer exception.  Trying again using default image orientation",e);
       var default_orientation;
       // try to improve chances of picking the actual orientation.
       if (Math.abs(object.slices[0]['image_orientation_patient'][1])>Math.abs(object.slices[0]['image_orientation_patient'][0])) {
          default_orientation = [0, 1, 0, 0, 0, -1];
       } else if (Math.abs(object.slices[0]['image_orientation_patient'][4])>Math.abs(object.slices[0]['image_orientation_patient'][5])) {
          default_orientation = [1, 0, 0, 0, 1, 0];
       } else {
          default_orientation = [1, 0, 0, 0, 0, -1];
       }
       for (var i = 0; i < object.slices.length; i++) {
           var slice = object.slices[i];
           slice['image_orientation_patient'] = default_orientation;
       }
       this.doSlicing(container, object, data, flag);
       // TODO:  XImgView specific code here. Would be better to move this out of the Xtk code, but we need to warn users.
       if (typeof xiv !== 'undefined' && typeof xiv.ui !== 'undefined' && typeof xiv.ui.ViewBoxDialogs !== 'undefined') {
           var ele = document.getElementsByClassName('xiv-ui-viewbox-viewframe');
           if (ele.length>0) {
              setTimeout(function(){
                 xiv.ui.ViewBoxDialogs.createModalOkDialog("WARNING:  Display orientation for this image could not be reliably determined.", ele[0], null)
              },1000);
           }
       }
    }

  }
      
  // the object should be set up here, so let's fire a modified event
  var modifiedEvent = new X.event.ModifiedEvent();
  modifiedEvent._object = object;
  modifiedEvent._container = container;
  this.dispatchEvent(modifiedEvent);

}


X.parserDCM.prototype.doSlicing = function(container, object, data, flag) {

    //************************************
    //
    // ErasmusMC addition (end)
    //
    //************************************

    // sort slices per series
    var series = {};
    var imageSeriesPushed = {};
    for (var i = 0; i < object.slices.length; i++) {

      // series undefined yet
      if(!series.hasOwnProperty(object.slices[i]['series_instance_uid'])){
        
        series[object.slices[i]['series_instance_uid']] = new Array();
        imageSeriesPushed[object.slices[i]['series_instance_uid']] = {};

      }
      
      // push image if it has not been pushed yet
      if(!imageSeriesPushed[object.slices[i]['series_instance_uid']].hasOwnProperty(object.slices[i]['sop_instance_uid'])){
        // Multiframe DICOM will need to continue pushing series
        if (!object.isMultiframeDicom) {
          imageSeriesPushed[object.slices[i]['series_instance_uid']][object.slices[i]['sop_instance_uid']] = true;
        }
        series[object.slices[i]['series_instance_uid']].push(object.slices[i]);

      } 

    }

    ////////////////////////////////////////////////////////////////////////
    // At this point:
    // -> slices are ordered by series
    // -> slices within a series are unique
    ////////////////////////////////////////////////////////////////////////

    // GLOBAL PARAMETERS
    // pointer to first image
    var seriesInstanceUID = Object.keys(series)[0];
    var first_image = series[seriesInstanceUID];



    // number of unique slices available
    var first_image_stacks = first_image.length;
    // container for volume specific information
    var volumeAttributes = {};


    ////////////////////////////////////////////////////////////////////////
    //
    // ORDER SLICES
    //
    ////////////////////////////////////////////////////////////////////////

    //
    // we can order slices based on
    //
    // image_position_patient:
    // -> each slice show have a different 'image_position_patient'
    // -> The Image Position (0020,0032) specifies the x, y, and z coordinates of
    // -> -> the upper left hand corner of the image; it is the center of the first
    // -> -> voxel transmitted. Image Orientation (0020,0037) specifies the direction
    // -> -> cosines of the first row and the first column with respect to the patient.
    // -> -> These Attributes shall be provide as a pair. Row value for the x, y, and
    // -> -> z axes respectively followed by the Column value for the x, y, and z axes
    // -> -> respectively.
    //
    // in some cases, such as diffusion, 'image_position_patient' is the same for all
    // slices. We should then use the instance_number to order the slices.
    // 
    // instance_number:
    // -> each slice show have a different 'instance_number'
    // -> A number that identifies this raw data. 
    // -> -> The value shall be unique within a series

    var _ordering = 'image_position_patient';

    if(first_image_stacks == 1){
        
        // ORDERING BASED ON IMAGE POSITION
        _ordering = 'image_position_patient';

        // set distance to 0
        series[seriesInstanceUID][0]['dist'] = 0;
	//window.console.log("ORDERING 0");

    }
    else if(first_image[0]['image_position_patient'][0] 
	    != first_image[1]['image_position_patient'][0] ||
	    first_image[0]['image_position_patient'][1] 
	    != first_image[1]['image_position_patient'][1] ||
	    first_image[0]['image_position_patient'][2] 
	    != first_image[1]['image_position_patient'][2]) {
        // ORDERING BASED ON IMAGE POSITION
        _ordering = 'image_position_patient';

        // set distances
        var _x_cosine = new goog.math.Vec3(
	    first_image[0]['image_orientation_patient'][0],
            first_image[0]['image_orientation_patient'][1], 
	    first_image[ 0 ]['image_orientation_patient'][2]);

        var _y_cosine = new goog.math.Vec3(
	    first_image[ 0 ]['image_orientation_patient'][3],
            first_image[ 0 ]['image_orientation_patient'][4], 
	    first_image[ 0 ]['image_orientation_patient'][5]);

        var _z_cosine = goog.math.Vec3.cross(_x_cosine, _y_cosine);

        function computeDistance(flag, arrelem){
            arrelem['dist'] = arrelem['image_position_patient'][0]*flag.x +
		arrelem['image_position_patient'][1]*flag.y +
		arrelem['image_position_patient'][2]*flag.z;
            return arrelem;
          }

      // compute dist in this series
      first_image.map(computeDistance.bind(null, _z_cosine));
      // order by dist
      first_image.sort(function(a,b){return a["dist"]-b["dist"]});
    }
    else if(first_image[0]['instance_number'] != 
	    first_image[1]['instance_number']){
	// ORDERING BASED ON instance number
	window.console.log('Ordering by instance number');
	_ordering = 'instance_number';
	first_image.sort(function(a,b){
	    return a["instance_number"]-b["instance_number"]});
    }
    else{

      window.console.log("Could not resolve the ordering mode");

    }
 
      //************************************
      //
      // Moka/NRG addition (start)
      // 
      //------------------------------------
      // Explanation of addition:
      //
      // If we find a distance equality we need to
      // put the order back to instance_number. 
      // We reserve this only for smaller stacks, 
      // like localizer stacks.
      //
      //************************************


      //************************************
      //
      // ErasmusMC change (start)
      //
      //------------------------------------
      // Explanation of change:
      //
      // For survey scans we also use the instance number for the ordering
      // Oldcode: if (_ordering == 'image_position_patient' && first_image_stacks < 5))  
      //
      //************************************
      
      if ((_ordering == 'image_position_patient' && first_image_stacks < 5) ||
          (object['series_description'] != undefined && object['series_description'].toLowerCase().search("survey") != -1 && first_image_stacks < 20)) {

          //************************************
          //
          // ErasmusMC addition (end)
          //
          //************************************

	  var i = 0;
	  var _switchToInstanceNumberOrdering = function(){
	      window.console.log('Warning: Although series was initially' +
				 ' ordered by "image_position_patient",' + 
				 ' positional overlaps were found.' + 
				 '\nSwitching to "instance_number"' + 
				 ' ordering as a result.');
	      _ordering = 'instance_number';
	  }
	  if (first_image_stacks == 1){
	      _switchToInstanceNumberOrdering();
	      object[X.volume.SINGLE_FRAME_SCAN] = true;
	  }
	  else {
	      for(; i<first_image_stacks-1; i++){
		  //window.console.log(
		  //first_image[i]['dist'], first_image[i+1]['dist'])
		  if ((first_image[i]['dist'] - first_image[i+1]['dist']) 
		      < 0.01){
		      _switchToInstanceNumberOrdering();
		      first_image.sort(function(a,b){
			  return a["instance_number"]-b["instance_number"]});
		  }
	      }
	  }
      }
      //************************************
      //
      // Moka/NRG addition (end)
      // 
      //************************************



      //************************************
      //
      // Moka/NRG addition (start)
      // 
      //------------------------------------
      // Explanation of addition:
      //
      // For debugging purposes.
      //
      //************************************
      /*
      var _deb = true;
      if (_deb){
	  var i = 0;
	  var len = first_image.length;
	  for (; i<len; i++){
	      window.console.log(
		  '\n',
		  i,
		  '\nInstance number:',
		  first_image[i]['image_orientation_patient'], 
		  '\nImage Orientation Patient:' , 
		  first_image[i]['instance_number'], 
		  '\nImage Position Patient:',
		  first_image[i]['image_position_patient'], 
		  '\nPixel Spacing:' , 
		  first_image[i]['pixel_spacing'], 
		  '\nInitial Ordering:', 
		  _ordering);
	  }
      }
      */
      //************************************
      //
      // Moka/NRG addition (end)
      // 
      //************************************


    ////////////////////////////////////////////////////////////////////////
    // At this point:
    // -> slices are ordered by series
    // -> slices within a series are unique
    ////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////
    //
    // COMPUTE SPACING
    //
    ////////////////////////////////////////////////////////////////////////

    if(isNaN(first_image[0]['pixel_spacing'][0])){

      first_image[0]['pixel_spacing'][0] = 1.;

    }

    if(isNaN(first_image[0]['pixel_spacing'][1])){

      first_image[0]['pixel_spacing'][1] = 1.;

    }



      //************************************
      //
      // Moka/NRG addition (start)
      // 
      //------------------------------------
      // Explanation of addition:
      //
      // Occasionally there are ordering errors when "image_position_patient" 
      // approach above (the first else-if statement) is applied to certain 
      // DICOMs; we have to catch for that. Errors generally appear along the 
      // lines of:
      //
      // "Uncaught RangeError: Source is too large" 
      //
      // To avoid such errors, we occasionally have to force "instance_number" 
      // ordering when the "image_position_patient" yields unsorted
      // "instance_number" slices.
      //
      //************************************
      if (first_image.length > 1){

	  var j = 0;
	  var len = first_image.length;
	  var _isUnorderedByInstanceNumber = false;

	  //
	  // Instance ordering function, taken from above
	  //
	  function forceInstanceNumberOrdering(){
	      //
	      // Set the _ordering variable accordingly.
	      //
	      // WARNING: this is has consequences in the rest of the function.
	      //
	      _ordering = 'instance_number';

	      //
	      // Conduct the sort
	      //
	      first_image.sort(function(a,b){
		  return a["instance_number"]-b["instance_number"]});

	      //
	      // Custom tag
	      //
	      first_image["forced_instance_ordering"] = true;

	      //
	      // Output warning
	      //
	      var warningStr = 
		  "Warning: Slices were found unordered after " + 
		  "XTK \"image_position_patient\" sorting. " +
		  "Forcing \"instance_number\" reordering.";
	      window.console.log(warningStr);

	      //
	      // Check for overlaps in the instance ordering scheme
	      //
	      var j = 0;
	      var instanceOverlapsFound = false;
	      for (; j<len-1; j++){
		  if (Math.abs(first_image[j]['instance_number'] - 
			       first_image[j+1]['instance_number']) == 0){
		      instanceOverlapsFound = true;
		      break;
		  }
	      }
	      
	      //
	      // Re-input in the instance data if there were overlaps
	      //
	      if (instanceOverlapsFound){
		  //
		  // Output warning
		  //
		  var warningStr = 
		      "Warning: After forcing \"instance_number\" ordering " + 
		      "overlaps were found. " +
		      "Rewriting \"instance_number\" data for every slice.";
		  window.console.log(warningStr);

		  for (j=0; j<len; j++){
		      first_image[j]['instance_number'] = j;
		  }

	      }
	  }
	      

	  //
	  // Determine if the 'instance_number's are out of order.
	  // If it is, proceed to force instance ordering.
	  //
	  for (; j<len-1; j++){
	      if (Math.abs(first_image[j]['instance_number'] - 
			   first_image[j+1]['instance_number']) != 1){
		  //alert("FORCE!");
		  forceInstanceNumberOrdering(_isUnorderedByInstanceNumber);
		  break;
	      }
	  }
	  //window.console.log("FORCING!!!");
	  //forceInstanceNumberOrdering(_isUnorderedByInstanceNumber);
      }
      //************************************
      //
      // Moka/NRG addition (end)
      // 
      //************************************


    if( first_image_stacks > 1) {

      switch(_ordering){
        case 'image_position_patient':
          // We work only on 2 first slices
          var _first_position = first_image[ 0 ]
	  ['image_position_patient'];
          var _second_image_position = first_image[ 1 ]
	  ['image_position_patient'];
          var _x = _second_image_position[0] - _first_position[0];
          var _y = _second_image_position[1] - _first_position[1];
          var _z = _second_image_position[2] - _first_position[2];

          first_image[0]['pixel_spacing'][2] = 
	      Math.sqrt(_x*_x + _y*_y  + _z*_z);	  
	  break;
        case 'instance_number':



	  //************************************
	  //
	  // Moka/NRG addition (start)
	  //
	  //------------------------------------
	  // Previous code:
	  // 
	  // first_image[0]['pixel_spacing'][2] = 1.0;
	  //
	  //------------------------------------
	  // Explanation of changes:
	  //
	  //
	  //************************************

	  //
	  // Default value of spacing
	  //
	  var _spacing = 1.0;

	  //
	  // Special case for forced_instance_ordering
	  //
	  if (first_image['forced_instance_ordering'] === true){
	      //
	      // Check for the first inequality in position
	      //
	      var i = 1;
	      var len = first_image.length;
              var _firstPos = first_image[ 0 ]['image_position_patient'];
	      var _positionInequalityFound = false;
	      var _secondPos;
	      for (; i<len; i++){
		  _secondPos = first_image[ i ]['image_position_patient'];
		  if (_firstPos[0] != _secondPos[0] ||
		      _firstPos[1] != _secondPos[1] ||
		      _firstPos[2] != _secondPos[2]){	
		      _positionInequalityFound = true;
		      break;
		  }	  
	      }

	      //
	      // Only proceed if the positions are different, otherwise
	      // rely on the default above
	      //
	      if (_positionInequalityFound){
		  //window.console.log(_firstPos, _secondPos);
		  window.console.log(
		      "Warning: Setting pixel_spacing " + 
			  "according to \"image_position_patient\" even " + 
			  "though \"forced_instance_ordering\" is used.");

		  //var _secondPos = first_image[ 0 ]['image_position_patient'];
		  var _x = _secondPos[0] - _firstPos[0];
		  var _y = _secondPos[1] - _firstPos[1];
		  var _z = _secondPos[2] - _firstPos[2];
		  _spacing = (Math.sqrt(_x*_x + _y*_y  + _z*_z));
	      }
	  }
	  
	  //
	  // Set the spacing
	  //
          first_image[0]['pixel_spacing'][2] = _spacing;
	  
	  //************************************
	  //
	  // Moka/NRG addition (end)
	  // 
	  //************************************
          break;
        default:
          window.console.log("Unkown ordering mode - returning: " + _ordering);
          break;
      }

    }
    else {

      first_image[0]['pixel_spacing'][2] = 1.0;

    }


    ////////////////////////////////////////////////////////////////////////
    // At this point:
    // -> slices are ordered by series
    // -> slices within a series are unique
    // -> we estimated the spacing in all directions
    ////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////
    //
    // Estimate number of slices we are expecting
    //
    ////////////////////////////////////////////////////////////////////////

    // we execpt at least one image :)
    var first_image_expected_nb_slices = 1;
    switch(_ordering){
      case 'image_position_patient':
        // get distance between 2 points
        var _first_position = first_image[ 0 ]['image_position_patient'];
        var _last_image_position = first_image[ first_image_stacks - 1]['image_position_patient'];
        var _x = _last_image_position[0] - _first_position[0];
        var _y = _last_image_position[1] - _first_position[1];
        var _z = _last_image_position[2] - _first_position[2];
 	var _distance_position = Math.sqrt(_x*_x + _y*_y  + _z*_z);
        first_image_expected_nb_slices 
	    += Math.round(_distance_position/first_image[0]['pixel_spacing'][2]);
        break;
      case 'instance_number':
        first_image_expected_nb_slices += 
	Math.abs(first_image[ first_image_stacks - 1]['instance_number'] - 
		 first_image[0]['instance_number']);
        break;
      default:
        window.console.log("Unkown ordering mode - returning: " + _ordering);
        break;
    }

      //************************************
      //
      // Moka/NRG addition (start)
      //
      //------------------------------------
      //
      //************************************
      if (object['reslicing'].toString() == 'false'){
	  window.console.log("Forcing expexted slices to length " + 
			     "of files because " + 
			     "volume's \"reslicing\" property is set " + 
			     "to false.");     
	  first_image_expected_nb_slices = first_image_stacks;
	  window.console.log("Expected slices:", 
			     first_image_expected_nb_slices);

	  window.console.log('Ordering:', _ordering);
      }
      //************************************
      //
      // Moka/NRG addition (end)
      //
      //************************************


    var first_slice_size = first_image[0]['columns'] * first_image[0]['rows'];
    var first_image_size = first_slice_size * first_image_expected_nb_slices;


      //************************************
      //
      // Moka/NRG addition (start)
      // 
      //------------------------------------
      // Explanation of addition:
      //
      // There are instances where images in a series are of varying
      // dimensions.  This tracks to see if there were dimensional
      // inequalities found.
      //
      //************************************
      var _dimInequalities = false;
      var i = 0;
      var len = first_image.length;
      var _maxRows = 0;
      var _maxCols = 0;
      for (; i<len; i++){
	  if (first_image[i]['columns'] > _maxCols){
	      _maxCols = first_image[i]['columns'];
	  }
	  if (first_image[i]['rows'] > _maxRows){
	      _maxRows = first_image[i]['rows'];
	  }
      }

      if ((_maxCols * _maxRows) > first_slice_size){
	  first_slice_size = _maxCols * _maxRows;
	  first_image_size = first_slice_size * first_image_expected_nb_slices;
	  _dimInequalities = true;
	  window.console.log("Warning: Dimensional inequalities found " + 
			     "in image sizes.");
      }

      //************************************
      //
      // Moka/NRG addition (end)
      //
      //************************************



    ////////////////////////////////////////////////////////////////////////
    // At this point:
    // -> slices are ordered by series
    // -> slices within a series are unique
    // -> we estimated the spacing in all directions
    // -> we know how many slices we expect in the best case
    ////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////
    //
    // Prepare and fill data container
    //
    ////////////////////////////////////////////////////////////////////////

    var first_image_data = null;

      window.console.log(first_image[0].bits_allocated);
      // create data container
    switch (first_image[0].bits_allocated) {
      case 8:
        first_image_data = new Uint8Array(first_image_size);
	window.console.log("Using a Uint8Array.");
        break;
      case 16:
        first_image_data = new Uint16Array(first_image_size);
	window.console.log("Using a Uint16Array.");
        break;
      case 32:
        first_image_data = new Uint32Array(first_image_size);
	window.console.log("Using a Uint32Array.");
      default:
        window.console.log("Unknown number of bits allocated " + 
			   "- using default: 32 bits");
        first_image_data = new Uint32Array(first_image_size);
        break;
    }



    object._spacing = first_image[0]['pixel_spacing'];

    // fill data container
    // by pushing slices where we expect them
    // 
    // for instance, we have 3 non-consecutive slices
    // we are expecting 4 slices, the 3rd one is missing
    //
    // BEFORE:
    //
    // 0000000
    // 0000000
    // 0000000
    // 0000000
    //
    // AFTER:
    //
    // 1234123 -> first slice
    // 1234211 -> second slice
    // 0000000
    // 1232414 -> third slice


      //
      // Moka
      //
      var _maxVal = 0;
    for (var _i = 0; _i < first_image_stacks; _i++) {
      // get data
      var _data = first_image[_i].data;
      var _distance_position = 0;

      switch(_ordering){
        case 'image_position_patient':
          var _x = first_image[_i]['image_position_patient'][0] - 
	      first_image[0]['image_position_patient'][0];
          var _y = first_image[_i]['image_position_patient'][1] - 
	      first_image[0]['image_position_patient'][1];
          var _z = first_image[_i]['image_position_patient'][2] - 
	      first_image[0]['image_position_patient'][2];

	  _distance_position = Math.sqrt(_x*_x + _y*_y  + _z*_z)/
	      first_image[0]['pixel_spacing'][2]

          break;
        case 'instance_number':
          _distance_position = first_image[_i]['instance_number'] - 
	      first_image[0]['instance_number'];
          break;
        default:
          window.console.log("Unkown ordering mode - returning: " + _ordering);
          break;
      }



	//************************************
	//
	// Moka/NRG change (start)
	//
	//------------------------------------
	// Previous code:
	//
	// first_image_data.set(_data, 
	//	_distance_position * first_slice_size)
	//
	//------------------------------------
	// Explanation of change: 
	//
	// 1) We need to account for series with dimensional inequalities
	// in their images.  In order to do this, we basically create new
	// image data that is maxColumnsInSeries * maxRowsInSeries.  If the
	// image data is too small for this dmension, we 'fill' the empty
	// array indices with the value 0, or black.
	//
	// 2) Not rounding distance_position creates errors 
	// when setting the array data (eg. first_image_data.set( ... ))
	// because it's expecting rounded numbers.  Therefore, while
	// we want to maintain '_distance_position' for geometric
	// measurement, we need to round it for allocating memory 
	// into the buffer.
	//
	// Example:
	//
	// _distance_position = 28.000823915786 <-- Bad, errors
	// _distance_position = 28 <-- Good, no errors
	//
	//************************************
	//window.console.log("_distance_position: ", _distance_position);
	//window.console.log("first_slice_size: ", first_slice_size);
	if (_dimInequalities){
	    var oldCols = first_image[_i]['columns'];
	    var oldRows = first_image[_i]['rows'];
	    var counter = 0;
	    // Create the new image buffer with the max dimensions,
	    // 'filling' each value with 0
	    var newData = goog.array.repeat(0, _maxRows * _maxCols); 
	    // Allows for centering of the image vertically and horizontally
	    var startColumn = Math.round((_maxCols - oldCols)/2);
	    var endColumn = oldCols + startColumn;
	    var startRow = Math.round((_maxRows - oldRows)/2);
	    var endRow = oldRows + startRow;
	    //
	    // Fill the the center of the empty data with the image
	    //
	    var i, j;
	    for (i = startRow; i < endRow; i++){
		for (j = startColumn; j < endColumn; j++){
		    newData[_maxCols * i + j] = _data[counter];
		    counter++;
		}
	    }
	    _data = newData;
	}
	
	first_image_data.set(
	    _data, Math.round(_distance_position) * first_slice_size);

	//************************************
	//
	// Moka/NRG change (end)
	//
	//************************************
    }

    volumeAttributes.data = first_image_data;
    object._data = first_image_data;

    ////////////////////////////////////////////////////////////////////////
    // At this point:
    // -> slices are ordered by series
    // -> slices within a series are unique
    // -> we estimated the spacing in all directions
    // -> we know how many slices we expect in the best case
    // -> data container contains ordered data!
    ////////////////////////////////////////////////////////////////////////

    // IJK image dimensions
    // NOTE:
    // colums is index 0
      // rows is index 1
      //alert(first_image_expected_nb_slices)

    object._dimensions = [
	first_image[0]['columns'], 
	first_image[0]['rows'], 
	first_image_expected_nb_slices];


      //************************************
      //
      // Moka/NRG addition (start)
      //
      //------------------------------------
      // Explanation of addition: 
      //
      // If there are dimensional inequalities, we have to 
      // adjust the volume's dimenensions as well to fit the maximums.
      //************************************
      if (_dimInequalities){
	  //window.console.log('Changing image dimensions from:\n', 
	  //object._dimensions);
	  object._dimensions = [
	      _maxCols, 
	      _maxRows,
	      first_image_expected_nb_slices];
	  //window.console.log('to:\n', object._dimensions)
      }
      //************************************
      //
      // Moka/NRG change (end)
      //
      //************************************


    volumeAttributes.dimensions = object._dimensions;

    // get the min and max intensities
    //******************************************
    // NRG addition (start) (MRH:  2016/10/20)
    // ----------------------------------------
    // Explanation of addition.  The standard arrayMinMax method returned outrageous values for some images which caused
    // issues with the sliders and histogram in the UI, and ultimately the display, becase the UI gets populated
    // based on the range between minimum and maximum values.   We're creating a new arrayMinMax function to remove 
    // outlier values.
    // ****************************************
    var min_max = this.arrayMinMaxRemoveOutliers(first_image_data, first_image_expected_nb_slices);
    //******************************************
    //
    // NRG addition (end) 
    //
    //******************************************
    var min = min_max[0];
    var max = min_max[1];
    //window.console.log("MIN MAZX", min, max);

      
    // attach the scalar range to the volume
    volumeAttributes.min = object._min = object._windowLow = min;
    volumeAttributes.max = object._max = object._windowHigh = max;
    // .. and set the default threshold
    // only if the threshold was not already set

      //
      // Moka / NRG Change (start)
      //
      /*
	if (object._lowerThreshold == -Infinity) {
	object._lowerThreshold = min;
	}
	if (object._upperThreshold == Infinity) {
	object._upperThreshold = max;
	}
      */
      if (object._lowerThreshold != min) {
	  object._lowerThreshold = min;
      }
      if (object._upperThreshold != max) {
	  object._upperThreshold = max;	  
      }

      //window.console.log('THRESH', object._upperThreshold);

    // Slices are ordered so
    // volume origin is the first slice position
    var _origin = first_image[0]['image_position_patient'];

    //
    // Generate IJK To RAS matrix and other utilities.
    //

    var IJKToRAS = goog.vec.Mat4.createFloat32();

    ////////////////////////////////////////////////////////////////////////
    //
    // IMPORTANT NOTE:
    //
    // '-' added for LPS to RAS conversion
    // IJKToRAS is Identity if we have a time series
    //
    ////////////////////////////////////////////////////////////////////////
    
    ////////////////////////////////////////////////////////////////////////
    //
    // IMPORTANT NOTE:
    //
    // '-' added for LPS to RAS conversion
    // IJKToRAS is Identity if we have a time series
    //
    ////////////////////////////////////////////////////////////////////////
    


      //************************************
      //
      // Moka/NRG change (start)
      //
      //------------------------------------
      // Previous parserDCM.js:
      //
      // NOTE: this loads non-resliced scans, but the anatomical 
      // planes are incorrect and the images are rotated.  
      // 
      //------------------------------------
      //
      // Explanation of changes: 
      //
      //
      // If we set the 'reslicing' property of the volume to false,
      // the previous code loads the non-resliced scan without issue, 
      // but the rendered slice is rotated and oriented incorrectly. 
      // The chosen solution is to apply an orthogonal 
      // transform to the scan, leveraging the above code, however 
      // we round the numbers so that they are either 1 or 0, yielding 
      // purely orthogonal transform.
      //
      //************************************
      if(object['reslicing'].toString() == 'false'){

	  //
	  // IMAGE_POSITION_PATIENT or FORCED_INSTANCE
	  //
	  if ((_ordering == 'image_position_patient' || 
	       first_image['forced_instance_ordering'])){


	      //
	      // Output warning
	      //
	      window.console.log("NRG modification: " + 
				 "Running an orthogonal transform because the " + 
				 "volume's" +
				 " \"reslicing\" property is set to false.");

	      //
	      // Acquire the x and y cosines of the patient orientation
	      //
              var _x_cosine = new goog.math.Vec3(
		  first_image[0]['image_orientation_patient'][0],
		  first_image[ 0 ]['image_orientation_patient'][1], 
		  first_image[ 0 ]['image_orientation_patient'][2]);
              var _y_cosine = new goog.math.Vec3(
		  first_image[ 0 ]['image_orientation_patient'][3],
		  first_image[ 0 ]['image_orientation_patient'][4], 
		  first_image[ 0 ]['image_orientation_patient'][5]);

	      //
	      // Derive the z cosine from the x and y above.
	      //
              var _z_cosine = goog.math.Vec3.cross(_x_cosine, _y_cosine);

	      //
	      // NECESSARY: otherwise the z-axis is angled according to the
	      // perscribed plane, which defeats the purpose of an ortho-transform
	      //
	      _z_cosine.x = Math.round(_z_cosine.x);
	      _z_cosine.y = Math.round(_z_cosine.y);
	      _z_cosine.z = Math.round(_z_cosine.z);

	      
	      //-------------------------------
	      // IMPORTANT. PLEASE READ!
	      //
	      // This sets the transformation matrix as it pertains to RAS space.
	      // The pixel_spacing values are necessary so that slices are appropriately
	      // distanced from one another.
	      //-------------------------------
              goog.vec.Mat4.setRowValues(
		  IJKToRAS, 0,
		      -Math.round(first_image[0]['image_orientation_patient'][0])
		      *first_image[0]['pixel_spacing'][0],
		      -Math.round(first_image[0]['image_orientation_patient'][3])
		      *first_image[0]['pixel_spacing'][1],
		      -_z_cosine.x*first_image[0]['pixel_spacing'][2],
		      -_origin[0]);

              goog.vec.Mat4.setRowValues(
		  IJKToRAS,1,
		      -Math.round(first_image[ 0 ]['image_orientation_patient'][1])
		      *first_image[0]['pixel_spacing'][0],
		      -Math.round(first_image[ 0 ]['image_orientation_patient'][4])
		      *first_image[0]['pixel_spacing'][1],
		      -_z_cosine.y*first_image[0]['pixel_spacing'][2],
		      -_origin[1]);

              goog.vec.Mat4.setRowValues(
		  IJKToRAS, 2,
		  Math.round(first_image[ 0 ]['image_orientation_patient'][2])
		      *first_image[0]['pixel_spacing'][0],
		  Math.round(first_image[ 0 ]['image_orientation_patient'][5])
		      *first_image[0]['pixel_spacing'][1],
		  _z_cosine.z*first_image[0]['pixel_spacing'][2],
		  _origin[2]);

              goog.vec.Mat4.setRowValues(IJKToRAS, 3,0,0,0,1);
	      
	      window.console.log('IJKToRAS transform:\n', IJKToRAS);

	      //-------------------------------
	      // IMPORTANT. PLEASE READ!
	      //
	      // We also want to save the pure ortho transform matrix (without
	      // the pixel sapacing information) for later use.  We have to apply
	      // this matrix on the assessed dimensions of the volume, which
	      // occurs below.
	      //-------------------------------
	      var _pureOrthoTransform = goog.vec.Mat4.createFloat32();
              goog.vec.Mat4.setRowValues(
		  _pureOrthoTransform, 0,
		      -Math.round(first_image[0]['image_orientation_patient'][0]),
		      -Math.round(first_image[0]['image_orientation_patient'][3]),
		      -_z_cosine.x,
		      0);
              goog.vec.Mat4.setRowValues(
		  _pureOrthoTransform,1,
		      -Math.round(first_image[ 0 ]['image_orientation_patient'][1]),
		      -Math.round(first_image[ 0 ]['image_orientation_patient'][4]),
		      -_z_cosine.y,
		      0);
              goog.vec.Mat4.setRowValues(
		  _pureOrthoTransform, 2,
		  Math.round(first_image[ 0 ]['image_orientation_patient'][2]),
		  Math.round(first_image[ 0 ]['image_orientation_patient'][5]),
		  _z_cosine.z,
		  0);
              goog.vec.Mat4.setRowValues(_pureOrthoTransform, 3,0,0,0,1);
	      object[X.volume.REORIENT_TRANSFORM_KEY] = _pureOrthoTransform;
	      window.console.log('Orthogonal Transform:\n', 
				 _pureOrthoTransform);
					 
	  }
	  else if (_ordering == 'instance_number'){

	      //
	      // Apply the base transform to the object 
	      // (see above for explanation)
	      //
              goog.vec.Mat4.setRowValues(IJKToRAS, 0,-1,0,0,-_origin[0]);
              goog.vec.Mat4.setRowValues(IJKToRAS, 1,-0,-1,-0,-_origin[1]);
              goog.vec.Mat4.setRowValues(IJKToRAS, 2,0,0,1,_origin[2]);
              goog.vec.Mat4.setRowValues(IJKToRAS, 3,0,0,0,1);   

	      //
	      // Also save the pure ortho transform to the object
	      // (see above for explanation)
	      //
	      var _pureOrthoTransform = goog.vec.Mat4.createFloat32();
	      goog.vec.Mat4.setRowValues(_pureOrthoTransform, 0,-1,0,0,0);
	      goog.vec.Mat4.setRowValues(_pureOrthoTransform, 1,-0,-1,-0,0);
	      goog.vec.Mat4.setRowValues(_pureOrthoTransform, 2,0,0,1,0);
	      goog.vec.Mat4.setRowValues(_pureOrthoTransform, 3,0,0,0,1);   
	      goog.vec.Mat4.setRowValues(_pureOrthoTransform, 3,0,0,0,1);
	      object[X.volume.REORIENT_TRANSFORM_KEY] = _pureOrthoTransform;
		  
	      
          }
          else {
              window.console.log("Unkown ordering mode - returning: " 
				 + _ordering);
	  }
      }
      //************************************
      //
      // Moka/NRG change (end)
      //
      //************************************


    else{
      switch(_ordering){
        case 'image_position_patient':

          var _x_cosine = new goog.math.Vec3(first_image[0]['image_orientation_patient'][0],
            first_image[ 0 ]['image_orientation_patient'][1], first_image[ 0 ]['image_orientation_patient'][2]);
          var _y_cosine = new goog.math.Vec3(first_image[ 0 ]['image_orientation_patient'][3],
            first_image[ 0 ]['image_orientation_patient'][4], first_image[ 0 ]['image_orientation_patient'][5]);
          var _z_cosine = goog.math.Vec3.cross(_x_cosine, _y_cosine);

          goog.vec.Mat4.setRowValues(IJKToRAS,
            0,
            -first_image[ 0 ]['image_orientation_patient'][0]*first_image[0]['pixel_spacing'][0],
            -first_image[ 0 ]['image_orientation_patient'][3]*first_image[0]['pixel_spacing'][1],
            -_z_cosine.x*first_image[0]['pixel_spacing'][2],
            -_origin[0]);
            // - first_image[0]['pixel_spacing'][0]/2);
          goog.vec.Mat4.setRowValues(IJKToRAS,
            1,
            -first_image[ 0 ]['image_orientation_patient'][1]*first_image[0]['pixel_spacing'][0],
            -first_image[ 0 ]['image_orientation_patient'][4]*first_image[0]['pixel_spacing'][1],
            -_z_cosine.y*first_image[0]['pixel_spacing'][2],
            -_origin[1]);
            // - first_image[0]['pixel_spacing'][1]/2);
          goog.vec.Mat4.setRowValues(IJKToRAS,
            2,
            first_image[ 0 ]['image_orientation_patient'][2]*first_image[0]['pixel_spacing'][0],
            first_image[ 0 ]['image_orientation_patient'][5]*first_image[0]['pixel_spacing'][1],
            _z_cosine.z*first_image[0]['pixel_spacing'][2],
            _origin[2]);
            // + first_image[0]['pixel_spacing'][2]/2);
          goog.vec.Mat4.setRowValues(IJKToRAS,
            3,0,0,0,1);
          break;
        case 'instance_number':
          goog.vec.Mat4.setRowValues(IJKToRAS,
            0,-1,0,0,-_origin[0]);
          goog.vec.Mat4.setRowValues(IJKToRAS,
            1,-0,-1,-0,-_origin[1]);
          goog.vec.Mat4.setRowValues(IJKToRAS,
            2,0,0,1,_origin[2]);
          goog.vec.Mat4.setRowValues(IJKToRAS,
            3,0,0,0,1);

	  
          break;
        default:
          window.console.log("Unkown ordering mode - returning: " + _ordering);
          break;
      }
    }

    volumeAttributes.IJKToRAS = IJKToRAS;
    volumeAttributes.RASToIJK = goog.vec.Mat4.createFloat32();
    goog.vec.Mat4.invert(volumeAttributes.IJKToRAS, volumeAttributes.RASToIJK);

    ////////////////////////////////////////////////////////////////////////
    // At this point:
    // -> slices are ordered by series
    // -> slices within a series are unique
    // -> we estimated the spacing in all directions
    // -> we know how many slices we expect in the best case
    // -> data container contains ordered data!
    // -> IJK To RAS (and invert) matrices
    ////////////////////////////////////////////////////////////////////////
  
    //
    // compute last required information for reslicing
    //

    // get RAS spacing
    //
    var tar = goog.vec.Vec4.createFloat32FromValues(0, 0, 0, 1);
    var res = goog.vec.Vec4.createFloat32();
    goog.vec.Mat4.multVec4(IJKToRAS, tar, res);

    var tar2 = goog.vec.Vec4.createFloat32FromValues(1, 1, 1, 1);
    var res2 = goog.vec.Vec4.createFloat32();
    goog.vec.Mat4.multVec4(IJKToRAS, tar2, res2);

      volumeAttributes.RASSpacing = [res2[0] - res[0], res2[1] - res[1], res2[2] - res[2]];
  
      // get RAS Boundung Box
      //
      var _rasBB = X.parser.computeRASBBox(IJKToRAS, [object._dimensions[0], object._dimensions[1], object._dimensions[2]]);
      // grab the RAS Dimensions
      volumeAttributes.RASDimensions = [_rasBB[1] - _rasBB[0] + 1, _rasBB[3] - _rasBB[2] + 1, _rasBB[5] - _rasBB[4] + 1];
      
      // get RAS Origin
      // (it is actually RAS min x, min y and min z)
      //
      volumeAttributes.RASOrigin = [_rasBB[0], _rasBB[2], _rasBB[4]];

      //******************************
      //
      // Moka / NRG addition (start)
      //
      //------------------------------
      // Explanation of Addition:
      //
      // If the volume's "reslicing" property is set to false, 
      // we have to make some adjustments to the RAS-space calculations
      // above, as there is some amount of shifting that occurs, 
      // resulting is a limited range of visibility (off by 1, ususually)
      // with the above scans.
      //******************************
      if (object['reslicing'].toString() == 'false'){

	  /*
	  window.console.log("\n\nOBJ DIM:", object._dimensions);
	  window.console.log('_rasBB (before)', _rasBB);
  	  window.console.log("RASSpacing", volumeAttributes.RASSpacing);
	  window.console.log("RASDimensions", volumeAttributes.RASDimensions);
	  window.console.log("RASOrigin", volumeAttributes.RASOrigin);
	  */

	  //
	  // Create a vector of the untransformed dimensions of the scan.
	  // obkect._dimensions pertains to volume information of the
	  // non-oriented scan.  For instance, if a scan is oriented 
	  // sagitally, then its raw dimensions are:
	  //
	  // object._dimensions[0] <-- The sagittal pixel columns
	  // object._dimensions[1] <-- The sagittal pixel rows
	  // object._dimensions[2] <-- The number of images / files
	  //
	  var _untransformedDims = goog.vec.Vec4.createFloat32FromValues(
	      object._dimensions[0], 
	      object._dimensions[1], 
	      object._dimensions[2], 1);

	  //
	  // Re-orient the dimensions of the volume by applying
	  // the pure orthogonal transform to the untransformed
	  // dimensions.
	  //
	  var _transformedDims = goog.vec.Vec4.createFloat32();
	  goog.vec.Mat4.multVec4(object[X.volume.REORIENT_TRANSFORM_KEY], 
	      _untransformedDims, 
	      _transformedDims);
	  _transformedDims[0] = Math.abs(_transformedDims[0]);
	  _transformedDims[1] = Math.abs(_transformedDims[1]);
	  _transformedDims[2] = Math.abs(_transformedDims[2]);

	  //
	  // Store the orthogonal transformed dimensions
	  // as a property within the volume itself
	  //
	  object[X.volume.REORIENTED_DIMENSIONS_KEY] = 
	      _transformedDims;

          if (_transformedDims[0] !== first_image_stacks && _transformedDims[1] !== first_image_stacks && _transformedDims[2] !== first_image_stacks) {
             throw new Error("ERROR:  No transformed dimension matches the expected dimensions");
          }

	  //
	  // Determine the anatomical orientation of the 
	  // volume based on the _transformedDims array.
	  // Apply the appropriate 'hacks' to adjust shifting
	  // that occurs to preserve the acquired set.
	  //
	  if (_transformedDims[0] == object._dimensions[2]){
	      //
	      // Store orientation
	      //
	      object[X.volume.ORIENTATION_KEY] = 'sagittal';

	      //
	      // Adjust the RASDimensions
	      //
	      volumeAttributes.RASDimensions[0] += 
	      1 * first_image[0]['pixel_spacing'][2];

	      //
	      // Adjust the RASSpacing
	      //
	      volumeAttributes.RASSpacing[0] = 
		  volumeAttributes.RASDimensions[0] / 
		  (first_image.length + 1);


	      //
	      // Adjust the RASSpacing
	      //
	      //volumeAttributes.RASOrigin[0] -= 
	      //first_image[0]['pixel_spacing'][2];
	  }
	  else if (_transformedDims[1] == object._dimensions[2]){

	      //
	      // Store orientation
	      //
	      object[X.volume.ORIENTATION_KEY] = 'coronal';

	      //
	      // Adjust the RASDimensions
	      //
	      volumeAttributes.RASDimensions[1] += 
	      1 * first_image[0]['pixel_spacing'][2];

	      //
	      // Adjust the RASSpacing
	      //
	      volumeAttributes.RASOrigin[1] -= 
		  1 * first_image[0]['pixel_spacing'][2];
	  }
	  else {
	      //
	      // Store orientation
	      //
	      object[X.volume.ORIENTATION_KEY] = 'transverse';

	      //
	      // Adjust the RASDimensions
	      //
	      volumeAttributes.RASDimensions[2] += 
	      2*first_image[0]['pixel_spacing'][2];

	      //
	      // Adjust the RASSpacing
	      //
	      volumeAttributes.RASSpacing[2] = 
		  volumeAttributes.RASDimensions[2] / 
		  (first_image.length + 1);

	      //
	      // Adjust the RASOrigin
	      //
	      volumeAttributes.RASOrigin[2] -= 
		  first_image[0]['pixel_spacing'][2];
	  } 

	  //
	  // Output messages as necessary
	  //
	  var _msg = 
	      "Assessed volume orientation: " + 
	      object[X.volume.ORIENTATION_KEY] + '\n' +
	      "XTK Modifications may be applied to restore " + 
	      "acquired properties."
	  window.console.log(_msg);

	  window.console.log("_transformedDims", _transformedDims);
 	  window.console.log("RASSpacing", volumeAttributes.RASSpacing);
	  window.console.log("RASDimensions", volumeAttributes.RASDimensions);
	  window.console.log("RASOrigin", volumeAttributes.RASOrigin);
      }
      //******************************
      //
      // Moka / NRG Addition (end)
      //
      //******************************

    // create the volume object
    object.create_(volumeAttributes);

    // re-slice the data in SAGITTAL, CORONAL and AXIAL directions

      object._image = this.reslice(object);

};



/**
 * Default behavior if tag group/elements do not have to be processed.
 * 
 * @param {!number} _bytes The data stream.
 * @param {!number} _bytePointer The parent object.
 * @param {!number} _VR The data stream.
 * @param {!number} _VL The parent object.
 * @return {number} The new bytePointer.
 */
 X.parserDCM.prototype.handleDefaults = function(_bytes, _bytePointer, _VR, _VL) {
    switch (_VR){
        // OB
      case 16975:
        // OW
      case 22351:
        // SQ
      case 20819:
        // UN
      case 20053:
        // UT
      case 21589:
// See ftp://dicom.nema.org/medical/Dicom/2013/output/chtml/part05/chapter_7.html (See 7.1.2).  2016/11/28 - added UT
//  to previous list to fix issues with some images.  It appears that the following two values should also be added
//  to this list, but adding UL caused issues with some images, and the code seems to be reading those fine without passing
//  through here, so I'm leaving both commented out for now.  
//        // OF
//      case 17999:
//        // UL
//      case 19541:

        // bytes to bits
        function byte2bits(a)
          {
            var tmp = "";
            for(var i = 128; i >= 1; i /= 2)
                tmp += a&i?'1':'0';
            return tmp;
          }

        _VL = _bytes[_bytePointer++];
        var _VLT = _bytes[_bytePointer++];

        var _b0 = _VL & 0x00FF;
        var _b1 = (_VL & 0xFF00) >> 8;

        var _b2 = _VLT & 0x00FF;
        var _b3 = (_VLT & 0xFF00) >> 8;

        var _VLb0 = byte2bits(_b0);
        var _VLb1 = byte2bits(_b1);
        var _VLb = _VLb1 + _VLb0;

        var _VLTb0 = byte2bits(_b2);
        var _VLTb1 = byte2bits(_b3);
        var _VLTb = _VLTb1 + _VLTb0;

        var _VL2 =  _VLTb + _VLb ;
        _VL = parseInt(_VL2, 2);

        // flag undefined sequence length (int)
        if(_VL == 4294967295){
          _VL = 0;
        }

        //console.log("Computed VL=", _VL);
        _bytePointer+=_VL/2;
      break;

    default:
      _bytePointer+=_VL/2;
        break;
    }
  //******************************************
  // NRG addition (start) (MRH:  2016/05/03)
  // ----------------------------------------
  // Explanation of addition.  Some values were being returned as decimal values here.  Let's make sure that doesn't happen.
  // ****************************************
  if (_bytePointer % 1 !== 0) {
    //console.log("WARNING:  Decimal pointer - rounded");
    _bytePointer = Math.round(_bytePointer);
  }
  //******************************************
  //
  // NRG addition (end) 
  //
  //******************************************
  return _bytePointer;
}

/**
 * Parse the data stream according to the .nii/.nii.gz file format and return an
 * MRI structure which holds all parsed information.
 * 
 * @param {!ArrayBuffer}
 *          data The data stream.
 * @param {!X.object}
 *          object The parent object.
 * @return {Object} The MRI structure which holds all parsed information.
 */
X.parserDCM.prototype.parseStream = function(data, object) {

  // attach the given data
  this._data = data;

  if( typeof(object.slices) == "undefined" || object.slices == null ){
    object.slices = new Array();
  }

  // set slice default minimum required parameters
  var slice = {};
  slice['pixel_spacing'] = [.1, .1, Infinity];
  slice['image_orientation_patient'] = [1, 0, 0, 0, 1, 0];
  slice['image_position_patient']  = [0, 0, 0];
  //************************************
  //
  // Moka/NRG addition (start)  (MRH: 2016/10/28)
  //
  //------------------------------------
  // Explanation of addition:
  // Capture an array of image_orientation_patient and image_position_patient values for use in multi-frame DICOM
  //------------------------------------
  slice['image_orientation_patient_arr'] = [];
  slice['image_position_patient_arr'] = [];
  //************************************
  //
  // Moka/NRG addition (end)
  //
  //************************************
  slice['counter'] = 0;
  // Transfer syntax UIDs
  // 1.2.840.10008.1.2: Implicit VR Little Endian
  // 1.2.840.10008.1.2.1: Explicit VR Little Endian
  // 1.2.840.10008.1.2.2: Explicit VT Big Endian
  slice['transfer_syntax_uid'] = "no_transfer_syntax_uid";

  // scan the whole file as short (2 bytes)
  var _bytes = this.scan('ushort', this._data.byteLength);
  var _bytePointer = 66; // skip the 132 byte preamble
  var _tagGroup = null;
  var _tagElement = null;
  var _VR = null;
  var _VL = null;


    //************************************
    //
    // Moka/NRG addition (start)
    //
    //------------------------------------
    // Explanation of addition:
    //
    // Depending on the type of DICOM, there are certain metadata 
    // memory-address pairs that cause X.parserDCM.prototype.parseStream 
    // to fail.  Consequently, we need to skip these 
    // addresses when we hit them.
    // 
    // The easiest way to determine a bad address:
    //
    // 1) As this function is parsing, output the addresses to the console
    //
    //    Example:
    //    window.console.log("Current memory address ", 
    //    '(0x' + _tagGroup.toString(16) + ', 0x' 
    //	         + _tagElement.toString(16) +')');
    //
    // 2) Use pydicom to print the the attributes of said DICOM and verify 
    //    the bad address.
    //
    //    Example:
    //    import dicom
    //    f = "path/to/dicom/file1.dcm"
    //    dcmRead = dicom.read_file(f);
    //    print dcmRead
    //
    //
    // The skip pairs are as follows:
    // (NOTE: This is likely an ongoing list)
    //
    //  Little Endian Implicit:
    //       [0x0012, 0x0064], [0x0008, 0x1110],[0x0008, 0x1120]
    //
    //
    //************************************
    var _skipCurrent = false;
    var _dicomTypeLogged = false;
    var _dicomType;

    var _skippables = {};
    // For DICOMs w/ Little Endian Explicit
    _skippables.LEE = [
        // NOTE:  Commenting this out.  0x0008,0x1140 is required for proper multi-frame DICOM support.  I believe this change was made in response to XNAT-3257.
        // The session in that ticket currently loads with this commented out.
	//[0x0008, 0x1140],
	[0x0009, 0x7770],
	[0x0088, 0x0200],	
    ]
    // For DIOCMs w/ Little Endian Implcit
    _skippables.LEI = [
	[0x0012, 0x0064], 
	[0x0023, 0x1080],
	[0x0040, 0x0275],
	[0x0008, 0x1110],
	[0x0008, 0x1120],
	[0x0088, 0x0200],
    ];
    var i, len;
    //************************************
    //
    // Moka/NRG addition (end)
    //
    //************************************
    
  var _prevPixelData = false;
  var _inImageInfo = false;
  while (_bytePointer <  _bytes.length) {

      _tagGroup = _bytes[_bytePointer++];
      _tagElement = _bytes[_bytePointer++];

      _VR = _bytes[_bytePointer++];
      _VL = _bytes[_bytePointer++];


      //************************************
      //
      // ErasmusMC addition (start)
      //
      //------------------------------------
      // Explanation of addition:
      //
      // Certain DICOMS contain sequential items (SQ/subtags). When not handled, it cannot load them properly.
      // The parsing algorithm assumes that each DICOM field contains the size of the value.
      // When not handled properly, the algorithm skips the remainder of the DICOM and thus fails to load the imaging data.
      // Therefore we check the subtags and step correctly to the next bytes.
      // Note the different scanners create SQ differently. Some add zero's to the end of the SQ.
      // Also see DICOM documentation e.g. https://www.leadtools.com/sdk/medical/dicom-spec10.htm
      //************************************

      if (_VR == 0xFFFF && _VL == 0xFFFF) {
          // Detected possible SQ begin (subtag/sequence)
          // Check for the DICOM SQ qualifier
          if (_bytes[_bytePointer] == 0xFFFE && _bytes[_bytePointer + 1] == 0xE000) {
              // Found SQ, skip another 4 bytes we found + another 4 bytes and continue
              // byteStream reads 2 bytes for ushort per step, step for 8 bytes we increment with 4
              _bytePointer += 4;
              continue;
          }
          // Check for nested DICOM SQ qualifier)
          if (_bytes[_bytePointer] == 0xFFFE && _bytes[_bytePointer + 1] == 0xE0DD) {
              // Found SQ, skip another 4 bytes we found + another 4 bytes and continue
              // byteStream reads 2 bytes for ushort per step, step for 8 bytes we increment with 4
              _bytePointer += 4;
              continue;
          }
      }

      if ((_tagGroup == 0xFFFE && _tagElement == 0xE00D) || (_tagGroup == 0xFFFE && _tagElement == 0xE0DD)) {
         if (_VR == 0x0000 && _VL == 0x0000) {
              // Found end of SQ, if zero's are encountered, skip to next bytesequence.
              continue;
          }
      }

      //************************************
      //
      // ErasmusMC addition (end)
      //
      //************************************
      
      //******************************************
      // NRG addition (start) (MRH:  2016/05/03)
      // ----------------------------------------
      // Explanation of addition.  Some DICOM contains a tag that indicates the start of pixel data.  These DICOM are likely padded 
      // at the end of the file.  The image viewer displayed these as split images because prior behavior was to just read
      // pixel data back from the end of the file.  We use information from this tag to determine the start of pixel data when it's 
      // available.
      // ****************************************
      if (_tagGroup == 0x7FE0) {
        // Group of DICOM meta info header
        if (_tagElement == 0x0010) {
            //console.log("PixelData - 7fe0,0010 - " + _bytePointer);
            slice['pixel_data_start'] = _bytePointer * 2 + 6;
            _bytePointer+=_VL/2;
            _prevPixelData = true;
            _inImageInfo = false;
        }
      }
      //******************************************
      //
      // NRG addition (end) 
      //
      //******************************************

      // Implicit VR Little Endian case
      if((slice['transfer_syntax_uid'] == '1.2.840.10008.1.2') && (_VL == 0)){
	  _VL = _VR;
      }

      //************************************
      //
      // Moka/NRG addition (start)
      //
      //------------------------------------
      // Explanation of addition:
      //
      // Certain memory pointers of DICOMS throw a wrench the parsing mechanism.
      // As a result, we have to skip them.  Skipping said addresses does not
      // usually affect the rendering.
      //
      // Example (print from pydicom):
      /**

(0008, 0008) Image Type                          CS: ['ORIGINAL', 'PRIMARY', 'M', 'ND', 'NORM']
(0008, 0012) Instance Creation Date              DA: '*******'
(0008, 0013) Instance Creation Time              TM: '*******'
(0008, 0016) SOP Class UID                       UI: MR Image Storage
(0008, 0018) SOP Instance UID                    UI: *****************************************************
(0008, 0020) Study Date                          DA: '********'
(0008, 0021) Series Date                         DA: '********'
(0008, 0022) Acquisition Date                    DA: '********'
(0008, 0023) Content Date                        DA: '********'
(0008, 0030) Study Time                          TM: '******.***'
(0008, 0031) Series Time                         TM: '******.***'
(0008, 0032) Acquisition Time                    TM: '******.******'
(0008, 0033) Content Time                        TM: '******.******'
(0008, 0040) Data Set Type                       US: 0
(0008, 0041) Data Set Subtype                    LO: 'IMA NONE'
(0008, 0060) Modality                            CS: 'MR'
(0008, 0070) Manufacturer                        LO: 'SIEMENS'
(0008, 0080) Institution Name                    LO: '*'
(0008, 1010) Station Name                        SH: '*'
(0008, 1030) Study Description                   LO: '*'
(0008, 103e) Series Description                  LO: 'T1 BLADE SAG'
(0008, 1070) Operators' Name                     PN: ' '
(0008, 1090) Manufacturer's Model Name           LO: 'SymphonyTim'
(0010, 0010) Patient's Name                      PN: '******'
(0010, 0020) Patient ID                          LO: '******'
(0010, 0040) Patient's Sex                       CS: '******'
(0010, 1030) Patient's Weight                    DS: '******'
(0012, 0062) Patient Identity Removed            CS: '***'
(0012, 0063) De-identification Method            LO: '******'



We would want to skip this (0012, 0064)
    | 
    |
    V

(0012, 0064)  De-identification Method Code Sequence   11 item(s) ---- 
   (0008, 0100) Code Value                          SH: '******'
   (0008, 0102) Coding Scheme Designator            SH: 'DCM'
   (0008, 0104) Code Meaning                        LO: 'Basic Application Confidentiality Profile'
   ---------
   (0008, 0100) Code Value                          SH: '******'
   (0008, 0102) Coding Scheme Designator            SH: 'DCM'
   (0008, 0104) Code Meaning                        LO: 'Clean Pixel Data Option'
   ---------
   (0008, 0100) Code Value                          SH: '******'
   (0008, 0102) Coding Scheme Designator            SH: 'DCM'
   (0008, 0104) Code Meaning                        LO: 'Clean Graphics Option'
   ---------
   ---
      */
     //************************************
      _skipCurrent = false;
      if (_tagGroup !== undefined && _tagElement !== undefined){

	  /*
	   */
	  //window.console.log(slice['transfer_syntax_uid']);
	  switch(slice['transfer_syntax_uid']){

	  case '1.2.840.10008.1.2.1':
	      _dicomType = "Little Endian Explicit";

	      i = 0;
	      len = _skippables.LEE.length;
	      for (; i < len; i++){
		  if ((_tagGroup === _skippables.LEE[i][0]) && 
		      (_tagElement === _skippables.LEE[i][1])){
		      _skipCurrent = true;
		      break;
		  }
	      }
	      break;
	      
	  case '1.2.840.10008.1.2.2':
	      _dicomType = "Big Endian Explicit";
	      break;
	      
	  case '1.2.840.10008.1.2':
	      _dicomType = "Little Endian Implicit";

	      i = 0;
	      len = _skippables.LEI.length;
	      for (; i < len; i++){
		  if ((_tagGroup === _skippables.LEI[i][0]) && 
		      (_tagElement === _skippables.LEI[i][1])){
		      _skipCurrent = true;
		      break;
		  }
	      }
	      
	      break;
	  }

	  /*
	  window.console.log(
	      "Current memory address ", _dicomType, '(0x' 
		  + _tagGroup.toString(16) + ', 0x' 
		  + _tagElement.toString(16) +'), VR=' + _VR + ", VL=" + _VL);
	  */
	  //window.console.log('DICOM type:', _dicomType);
	  
	  if (_skipCurrent){
	      var _msg = "parserDCM.js: Identified " + _dicomType + 
		  ". Skipping DICOM adddress " +  '(0x' +
		  _tagGroup.toString(16) + ', 0x' +
		  _tagElement.toString(16) +')' + 
		  _tagGroup + ' ' +  _tagElement;
	      //window.console.log(_msg);

	      if ((_tagGroup == 0x0008 && _tagElement == 0x1140) || 
		  (_tagGroup == 0x0009 && _tagElement == 0x7770)){
		  var c = 0;
		  while (1) {
		      _newTagGroup = _bytes[_bytePointer++];
		      //_newTagElement = _bytes[_bytePointer++];
		      var _msg = "\t" + c + ": " + 
			  "Skipping DICOM adddress " +  '(0x' +
			  _newTagGroup.toString(16) + ')' + 
			  _newTagGroup;
		      //window.console.log(_msg);

		      var _diff = parseInt(_newTagGroup.toString(16), 10) - 
			  parseInt(_tagGroup.toString(16), 10);
		      
		      if (_diff < 3 && _diff > 0){

			  _newTagElement = _bytes[_bytePointer++]
			  var _msg = "\t\tPossibleBreak?: \n" +
			      "\t\t" +
			      "Skipping DICOM adddress " +  '(0x' +
			      _newTagGroup.toString(16) + ', 0x' +
			      _newTagElement.toString(16) +')' + 
			      _newTagGroup + ' ' +  _newTagElement;
			  //window.console.log(_msg);

			  if (parseInt(_newTagElement.toString(16), 10) == 10){
			      _bytePointer--;
			      _bytePointer--;
			      break;
			  }
			  else {
			      _bytePointer--;
			  }
			  //_bytePointer--;
			  //_bytePointer--;
			  //c = -1;
		      }
		      c++;
		  }
	      }
	      continue;
	  }
      }
      //************************************
      //
      // Moka/NRG addition (end)
      //
      //************************************

    var _clearPrevPixelDataAndInImageInfo = function() {
       if (_prevPixelData && _inImageInfo) {
           _inImageInfo = false;
           _prevPixelData = false;
       } 
    }

    switch (_tagGroup) {
      case 0x0002:
        // Group of DICOM meta info header
        switch (_tagElement) {
          case 0x0010:
            if (typeof slice['transfer_syntax_uid'] == 'undefined' || slice['transfer_syntax_uid'] == "no_transfer_syntax_uid") {
              // TransferSyntaxUID
              var _transfer_syntax_uid = '';
              // pixel spacing is a delimited string (ASCII)
              var i = 0;
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                _transfer_syntax_uid += String.fromCharCode(_b0);
                _transfer_syntax_uid += String.fromCharCode(_b1);
              }
              slice['transfer_syntax_uid'] = _transfer_syntax_uid.replace(/\0/g,'');
            } else {
               //console.log("WARNING:  ALREADY DEFINED - slice['transfer_syntax_uid']",slice['transfer_syntax_uid']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          default:
            _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;

      case 0x0028:
      // Group of IMAGE INFO
        _inImageInfo = true;
        switch (_tagElement) {
          case 0x0008:
            if (_prevPixelData || typeof slice['number_of_frames'] == 'undefined') {
              var _position = '';
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                _position += String.fromCharCode(_b0);
                _position += String.fromCharCode(_b1);
              }
              if (!isNaN(parseInt(_position,10))) {
                slice['number_of_frames'] = parseInt(_position, 10); 
              }
            } else {
               window.console.log("WARNING:  ALREADY DEFINED - slice['number_of_frames']",slice['number_of_frames']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          case 0x0009:
            if (_prevPixelData || typeof slice['frame_increment_pointer'] == 'undefined') {
              var _position = '';
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                _position += String.fromCharCode(_b0);
                _position += String.fromCharCode(_b1);
              }
              if (!isNaN(parseInt(_position,10))) {
                slice['frame_increment_pointer'] = parseInt(_position, 10); 
              }
            } else {
               window.console.log("WARNING:  ALREADY DEFINED - slice['frame_increment_pointer']",slice['frame_increment_pointer']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          case 0x0010:
            if (_prevPixelData || typeof slice['rows'] == 'undefined') {
              // rows
              slice['rows'] = _bytes[_bytePointer];
              _bytePointer+=_VL/2;
            } else {
               window.console.log("WARNING:  ALREADY DEFINED - slice['rows']",slice['rows']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          case 0x0011:
            // cols
            if (_prevPixelData || typeof slice['columns'] == 'undefined') {
              slice['columns'] = _bytes[_bytePointer];
              _bytePointer+=_VL/2;
            } else {
               window.console.log("WARNING:  ALREADY DEFINED - slice['columns']",slice['columns']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          case 0x0100:
            // bits allocated
	    //window.console.log('\nprev:', slice.bits_allocated)
            slice.bits_allocated = _bytes[_bytePointer];
	    //window.console.log('Raw bits allocated:', 
	    //_bytes[_bytePointer]);
            _bytePointer+=_VL/2;
            break;
          case 0x0101:
            // bits stored
            if (_prevPixelData || typeof slice['bits_stored'] == 'undefined') {
              slice['bits_stored'] = _bytes[_bytePointer];
              _bytePointer+=_VL/2;
            } else {
               window.console.log("WARNING:  ALREADY DEFINED - slice['bits_stored']",slice['bits_stored']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          case 0x0002:
            // number of images
            if (_prevPixelData || typeof slice['number_of_images'] == 'undefined') {
              slice['number_of_images'] = _bytes[_bytePointer];
              _bytePointer+=_VL/2;
            } else {
               //console.log("WARNING:  ALREADY DEFINED - slice['number_of_images']",slice['number_of_images']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          case 0x0030:
            // pixel spacing
            //if (typeof slice['pixel_spacing'] == 'undefined') {
              var _pixel_spacing = '';
              // pixel spacing is a delimited string (ASCII)
              var i = 0;
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                _pixel_spacing += String.fromCharCode(_b0);
                _pixel_spacing += String.fromCharCode(_b1);
              }
              _pixel_spacing = _pixel_spacing.split("\\");
              slice['pixel_spacing'] = [ parseFloat(_pixel_spacing[0]), parseFloat(_pixel_spacing[1]), Infinity ];
            //} else {
            //   window.console.log("WARNING:  ALREADY DEFINED - slice['pixel_spacing']",slice['pixel_spacing']);
            //   _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            //}
            break;

          case 0x1052: // rescale intercept
          case 0x1053: // rescale slope
          case 0x1050: // WindowCenter
          case 0x1051: // WindowWidth
          case 0x0004: // "Photometric Interpretation"
          case 0x0102: // "High Bit"
          case 0x0103: // "Pixel Representation"
          case 0x1054: // "Rescale Type"
          case 0x2110: // "Lossy Image Compression"

          default:
            _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;
      
      case 0x0020:
        _clearPrevPixelDataAndInImageInfo();
        // Group of SLICE INFO
        switch (_tagElement) {
          case 0x000e:
            // Series instance UID
            if (typeof slice['series_instance_uid'] == 'undefined') {
              slice['series_instance_uid'] = "";
              var i = 0;
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                slice['series_instance_uid'] += String.fromCharCode(_b0);
                slice['series_instance_uid'] += String.fromCharCode(_b1);
              }
            } else {
               window.console.log("WARNING:  ALREADY DEFINED - slice['series_instance_uid']",slice['series_instance_uid']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;
          case 0x0013:
            if (typeof slice['instance_number'] == 'undefined' || slice['instance_number'] == 0) {
              var _position = '';
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                _position += String.fromCharCode(_b0);
                _position += String.fromCharCode(_b1);
              }
              if (!isNaN(parseInt(_position,10))) {
                slice['instance_number'] = parseInt(_position, 10); 
              }
            } else {
               window.console.log("WARNING:  ALREADY DEFINED - slice['instance_number']",slice['instance_number']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            } 
            break;
          case 0x0032:
            //if (typeof slice['image_position_patient'] == 'undefined' || slice['image_position_patient'].toString() == ([0, 0, 0]).toString()) {
              // image position
              var _image_position = '';
              var i = 0;
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                _image_position += String.fromCharCode(_b0);
                _image_position += String.fromCharCode(_b1);
              }
              _image_position = _image_position.split("\\");
              slice['image_position_patient'] = [ parseFloat(_image_position[0]), parseFloat(_image_position[1]),
                  parseFloat(_image_position[2]) ];
              //************************************
              //
              // Moka/NRG addition (start)  (MRH:2016/10/28)
              //
              //------------------------------------
              // Explanation of addition:
              // Capture an array of image_orientation_patient and image_position_patient values for use in multi-frame DICOM
              //------------------------------------
              slice['image_position_patient_arr'].push(slice['image_position_patient']);
              //************************************
              //
              // Moka/NRG addition (end)
              //
              //************************************
              // _tagCount--;
            //} else {
            //   window.console.log("WARNING:  ALREADY DEFINED - slice['image_position_patient']",slice['image_position_patient']);
            //   _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            //}
            break;
          case 0x0037:
            //if (typeof slice['image_orientation_patient'] == 'undefined') {
              // image orientation
              // pixel spacing
              var _image_orientation = '';
              // pixel spacing is a delimited string (ASCII)
              var i = 0;
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                _image_orientation += String.fromCharCode(_b0);
                _image_orientation += String.fromCharCode(_b1);
              }
              _image_orientation = _image_orientation.split("\\");
              slice['image_orientation_patient'] = [ parseFloat(_image_orientation[0]),
                  parseFloat(_image_orientation[1]), parseFloat(_image_orientation[2]),
                  parseFloat(_image_orientation[3]), parseFloat(_image_orientation[4]),
                  parseFloat(_image_orientation[5]) ];
              //************************************
              //
              // Moka/NRG addition (start)  (MRH:2016/10/28)
              //
              //------------------------------------
              // Explanation of addition:
              // Capture an array of image_orientation_patient and image_position_patient values for use in multi-frame DICOM
              //------------------------------------
              slice['image_orientation_patient_arr'].push(slice['image_orientation_patient']);
              //************************************
              //
              // Moka/NRG addition (end)
              //
              //************************************
              // _tagCount--;
            //} else {
            //   window.console.log("WARNING:  ALREADY DEFINED - slice['image_orientation_patient']",slice['image_orientation_patient']);
            //   _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            //}
            break;

          default:
            _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;

    case 0xfffe:
        _clearPrevPixelDataAndInImageInfo();
        // Group of undefined item
        // here we are only interested in the InstanceNumber
        switch (_tagElement) {
          case 0xe000:
          // start item
          case 0xe00d:
          // end item
          case 0xe0dd:
          // end sequence
          default:
            _VL = 0;
            _bytePointer+=_VL/2;
            break;
          }

        break;

    case 0x0008:
        _clearPrevPixelDataAndInImageInfo();
        // Group of SLICE INFO
        // here we are only interested in the InstanceNumber
        switch (_tagElement) {
          case 0x0018:
            // Image instance UID
            if (typeof slice['sop_instance_uid'] == 'undefined') {
              slice['sop_instance_uid'] = "";
              var i = 0;
              for (i = 0; i < _VL / 2; i++) {
                var _short = _bytes[_bytePointer++];
                var _b0 = _short & 0x00FF;
                var _b1 = (_short & 0xFF00) >> 8;
                slice['sop_instance_uid'] += String.fromCharCode(_b0);
                slice['sop_instance_uid'] += String.fromCharCode(_b1);
              }
            } else {
               //console.log("WARNING:  ALREADY DEFINED - slice['sop_instance_uid']",slice['sop_instance_uid']);
               _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;

          //************************************
          //
          // ErasmusMC addition (start)
          //
          //------------------------------------
          // Explanation of addition:
          //
          // We include the series description so we can check later if we are dealing with a survey scan, which requires special handling.
          //************************************          

          case 0x103E:
              if (typeof slice['series_description'] == 'undefined') {
                object['series_description'] = "";
                var i = 0;
                for (i = 0; i < _VL / 2; i++) {
                  var _short = _bytes[_bytePointer++];
                  var _b0 = _short & 0x00FF;
                  var _b1 = (_short & 0xFF00) >> 8;
                  object['series_description'] += String.fromCharCode(_b0);
                  object['series_description'] += String.fromCharCode(_b1);
                }
              } else {
                 window.console.log("WARNING:  ALREADY DEFINED - slice['series_description']",slice['series_description']);
                 _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
              }
              break;

          //************************************
          //
          // ErasmusMC addition (end)
          //
          //************************************

          default:
            _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;


    case 0x0010:
        _clearPrevPixelDataAndInImageInfo();
        // Group of SLICE INFO
        // here we are only interested in the InstanceNumber
        switch (_tagElement) {
          case 0x2210:
            if (typeof _anatomical_orientation == 'undefined') {
               // anatomical orientation
               // pixel spacing
               var _anatomical_orientation = '';
               // pixel spacing is a delimited string (ASCII)
               var i = 0;
               for (i = 0; i < _VL / 2; i++) {
                 var _short = _bytes[_bytePointer++];
                 var _b0 = _short & 0x00FF;
                 var _b1 = (_short & 0xFF00) >> 8;
                 _anatomical_orientation += String.fromCharCode(_b0);
                 _anatomical_orientation += String.fromCharCode(_b1);
               }
            } else {
                 window.console.log("WARNING:  ALREADY DEFINED - _anatomical_orientation",_anatomical_orientation);
                 _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            }
            break;

          default:
            _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;
          // We should parse the data like that...

/**
    case 0x7fe0:
	//     // Group of SLICE INFO
	//     // here we are only interested in the InstanceNumber
        switch (_tagElement) {
        case 0x0010:
            var _data = null;
            switch (slice.bits_allocated) {
            case 8:
                slice.data = new Uint8Array(slice.columns * slice.rows);
                slice.data = this.scan('uchar', slice.columns * slice.rows);
                break;
            case 16:
                slice.data = new Uint16Array(slice.columns * slice.rows);
                slice.data = this.scan('ushort', slice.columns * slice.rows);
                break;
            case 32:
                slice.data = new Uint32Array(slice.columns * slice.rows);
                slice.data = this.scan('uint', slice.columns * slice.rows);
                break;
            }
	}
        break;
*/

    //       default:
    //         _bytePointer = X.parserDCM.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
    //         break;
    //       }

      default:
        _clearPrevPixelDataAndInImageInfo();
        _bytePointer = X.parserDCM.prototype.handleDefaults(
	     _bytes, _bytePointer, _VR, _VL);
        //******************************************
        // NRG addition (start) (MRH:  2016/05/05)
        // ----------------------------------------
        // Explanation of addition:  Let's try not to parse into the pixel data for images where we don't have a tag telling
        // us where it is.  It is not uncommon to hit random sequences that look like the DICOM tags we're parsing for, and
        // this was causing some issues.  This should be a conservative estimate of the location of the data, assuming it's
        // at the end of the file and using image size and number of frames, when we have it, to determine the staring point.
        // ****************************************
        if (typeof slice['columns'] !== 'undefined' && typeof slice['rows'] !== 'undefined') {
          var imgSize = slice['columns'] * slice['rows'] * 2;
          var nFrames = slice['number_of_frames'];
          if (typeof nFrames == 'undefined' || isNaN(parseInt(nFrames))) {
             nFrames = 1;
          } 
          var estPixelDataStart = this._data.byteLength - imgSize * nFrames;
          // Shouldn't be necessary to add 10 here.  Just adding a small measure of safety.
          if (_bytePointer > (estPixelDataStart+10)) {
             //window.console.log("DICOM PARSE:  Hit pixel data [_bytePointer=" + _bytePointer + "].  Stop parsing.");
             _bytePointer = Number.MAX_VALUE;
          }
        }
        //******************************************
        //
        // NRG addition (end) 
        //
        //******************************************
        break;
      }

    }
    //window.console.log('Slice bits', slice.bits_allocated);

    switch (slice.bits_allocated) {
      case 8:
        slice.data = new Uint8Array(slice['columns'] * slice['rows']);
        break;
      case 16:
        slice.data = new Uint16Array(slice['columns'] * slice['rows']);
        break;
      case 32:
        slice.data = new Uint32Array(slice['columns'] * slice['rows']);
        break;
    }

  // no need to jump anymore, parse data as any DICOM field.
        
  //******************************************
  // NRG changes (start) (MRH:  2016/05/XX)
  // ----------------------------------------
  // Explanation of changes.  This section has been modified to support multi-frame DICOM and to use the DICOM 0x7FE0, 0x0010
  // tag to locate pixel data where it is available.  Previous versions had just read from the end of the file.
  // ****************************************

  var imgSize = slice['columns'] * slice['rows'] * 2;
  var nFrames = slice['number_of_frames'];
  if (typeof nFrames == 'undefined' || isNaN(parseInt(nFrames))) {
     nFrames = 1;
  } else if (nFrames > 1) {
     object.isMultiframeDicom = true;
  } 

  var pixelDataStart = slice['pixel_data_start'];

  var iopos;
  var ippos;
  var ippos_prev;
  for (var i=nFrames; i>0; i--) {

    var thisSlice = (nFrames<=1) ? slice : JSON.parse(JSON.stringify(slice)); 
    
     // jump to the beginning of the pixel data
    if (typeof pixelDataStart !== 'undefined') {
      this.jumpTo(pixelDataStart + (imgSize*nFrames) - (imgSize*i));
      //window.console.log("DICOM PARSE:  Using pixelDataStart for selection of pixel data");
    } else {
      this.jumpTo(this._data.byteLength - imgSize * i);
      //window.console.log("DICOM PARSE:  Using _data.byteLength for selection of pixel data");
    }
    // check for data type and parse accordingly
    var _data = null;
  
    switch (thisSlice.bits_allocated) {
    case 8:
      _data = this.scan('uchar', thisSlice['columns'] * thisSlice['rows']);
      break;
    case 16:
       _data = this.scan('ushort', thisSlice['columns'] * thisSlice['rows']);
      break;
    case 32:
      _data = this.scan('uint', thisSlice['columns'] * thisSlice['rows']);
      break;
    }
    
    //window.console.log("END\n\n");
    thisSlice['data'] = _data;

    if (nFrames>1) {
      thisSlice['instance_number'] = nFrames-i+1;
    }
    
    // MRH:  2016/10/28
    // Pull slice image_orientation_patient and image_position patient from the array of values collected earlier
    // NOTE:  some of the values are getting skipped.  I'm not sure why.  Here, we're doing the best we can to 
    // match values up with values from the arrays.  Using the values allows us to determine orientation
    // UPDATE:  I believe fix for XNAT-4568 (2016/11/10) fixes the issue of some tags being skipped.
    if (slice['image_orientation_patient_arr'].length>1) {
      if (slice['image_orientation_patient_arr'].length<nFrames) {
         iopos = Math.round((i-1)*(slice['image_orientation_patient_arr'].length/nFrames));
         if (iopos>=nFrames) {
            iopos--;
         } 
      } else {
         iopos = i;
      }
      ippos = (slice['image_orientation_patient_arr'].length*2<=slice['image_position_patient_arr'].length) ? iopos*2 : iopos;
      if (ippos==ippos_prev && ippos>0) {
        ippos--;
      }
      iopos = (iopos>=0 && iopos<thisSlice["image_orientation_patient_arr"].length) ? iopos : ((iopos>=0) ? thisSlice["image_orientation_patient_arr"].length-1 : 0); 
      ippos = (ippos>=0 && ippos<thisSlice["image_position_patient_arr"].length) ? ippos : ((ippos>=0) ? thisSlice["image_position_patient_arr"].length-1 : 0); 
      thisSlice["image_orientation_patient"]=(thisSlice["image_orientation_patient_arr"])[iopos];
      thisSlice["image_position_patient"]=(thisSlice["image_position_patient_arr"])[ippos];
      ippos_prev = ippos;
    }
    object.slices.push(thisSlice);
        
  //******************************************
  // 
  // NRG changes (end) 
  // 
  // ****************************************
  } 

  return object;
};

// export symbols (required for advanced compilation)
goog.exportSymbol('X.parserDCM', X.parserDCM);
goog.exportSymbol('X.parserDCM.prototype.parse', X.parserDCM.prototype.parse);


