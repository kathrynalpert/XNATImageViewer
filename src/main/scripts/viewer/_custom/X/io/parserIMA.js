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





//****************************************************
//
// MOKA CREATIVE LLC ADD 
//
// Example of a working fsge3d .IMA file:
//
//****************************************************

/*
  (0008, 0005) Specific Character Set              CS: 'ISO_IR 100'
  (0008, 0008) Image Type                          CS: ['ORIGINAL', 'PRIMARY']
  (0008, 0016) SOP Class UID                       UI: MR Image Storage
  (0008, 0018) SOP Instance UID                    UI: 1.2.840.113619.2.1.1.2703111462.985.1148036686.766
  (0008, 0020) Study Date                          DA: '20060703'
  (0008, 0021) Series Date                         DA: '20060703'
  (0008, 0023) Content Date                        DA: '20060703'
  (0008, 0030) Study Time                          TM: '091845.000000'
  (0008, 0031) Series Time                         TM: '121923'
  (0008, 0033) Content Time                        TM: '121923'
  (0008, 0050) Accession Number                    SH: '7706910'
  (0008, 0060) Modality                            CS: 'MR'
  (0008, 0070) Manufacturer                        LO: 'GE MEDICAL SYSTEMS'
  (0008, 1030) Study Description                   LO: 'IGT_GLIOMA'
  (0008, 103e) Series Description                  LO: '3D SPGR VOLUME'
  (0008, 1090) Manufacturer's Model Name           LO: 'GENESIS_SIGNA'
  (0008, 1110)  Referenced Study Sequence   3 item(s) ---- 
  (0008, 1150) Referenced SOP Class UID            UI: Detached Study Management SOP Class
  (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70326.15254269
  ---------
      (0008, 1150) Referenced SOP Class UID            UI: Detached Study Management SOP Class
      (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70327.15254270
  ---------
      (0008, 1150) Referenced SOP Class UID            UI: Detached Study Management SOP Class
      (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70327.15254271
  ---------
  (0008, 1120)  Referenced Patient Sequence   1 item(s) ---- 
      (0008, 1150) Referenced SOP Class UID            UI: Detached Patient Management SOP Class
      (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70118.15254262
  ---------
  (0009, 0010) Private Creator                     OB: 'GEIIS '
  (0009, 1010) Private tag data                    OB: Array of 1188 bytes
  (0009, 1012) Private tag data                    OB: '1 '
  (0010, 0010) Patient's Name                      PN: 'case27'
  (0010, 0020) Patient ID                          LO: '00027'
  (0010, 0021) Issuer of Patient ID                LO: '001R74:20050625:205502036:195212'
  (0010, 1010) Patient's Age                       AS: '100Y'
  (0018, 0010) Contrast/Bolus Agent                LO: 'NONE'
  (0018, 0020) Scanning Sequence                   CS: 'GR'
  (0018, 0021) Sequence Variant                    CS: ['SS', 'SP', 'SK']
  (0018, 0022) Scan Options                        CS: ['FAST_GEMS', 'GRAPH_GEMS', 'EDR_GEMS']
  (0018, 0023) MR Acquisition Type                 CS: '3D'
  (0018, 0024) Sequence Name                       SH: 'fgre3d'
  (0018, 0025) Angio Flag                          CS: 'Y'
  (0018, 0050) Slice Thickness                     DS: '2.500000'
  (0018, 0080) Repetition Time                     DS: '28.799999'
  (0018, 0081) Echo Time                           DS: '12.500000'
  (0018, 0083) Number of Averages                  DS: '1.000000'
  (0018, 0084) Imaging Frequency                   DS: '21.3063660000'
  (0018, 0085) Imaged Nucleus                      SH: 'H1'
  (0018, 0086) Echo Number(s)                      IS: '1'
  (0018, 0087) Magnetic Field Strength             DS: '5000'
  (0018, 0088) Spacing Between Slices              DS: '2.500000'
  (0018, 0091) Echo Train Length                   IS: '0'
  (0018, 0093) Percent Sampling                    DS: '100.000000'
  (0018, 0094) Percent Phase Field of View         DS: '100.000000'
  (0018, 0095) Pixel Bandwidth                     DS: '56.250000'
  (0018, 1020) Software Version(s)                 LO: '04'
  (0018, 1050) Spatial Resolution                  DS: '0.859375'
  (0018, 1062) Nominal Interval                    IS: '28'
  (0018, 1088) Heart Rate                          IS: '0'
  (0018, 1090) Cardiac Number of Images            IS: '0'
  (0018, 1094) Trigger Window                      IS: '0'
  (0018, 1100) Reconstruction Diameter             DS: '220.0000000000'
  (0018, 1250) Receive Coil Name                   SH: 'FLEX3'
  (0018, 1310) Acquisition Matrix                  US: [256, 0, 0, 128]
  (0018, 1314) Flip Angle                          DS: '30'
  (0018, 1315) Variable Flip Angle Flag            CS: 'N'
  (0018, 1316) SAR                                 DS: '0.000272'
  (0018, 5100) Patient Position                    CS: 'HFDL'
  (0020, 000d) Study Instance UID                  UI: 1.2.124.113932.1.170.223.162.178.20060703.70326.15254269
  (0020, 000e) Series Instance UID                 UI: 1.2.840.113619.2.1.1.2703111462.985.1148036686.707
  (0020, 0010) Study ID                            SH: 'MR1'
  (0020, 0011) Series Number                       IS: ' 8'
  (0020, 0012) Acquisition Number                  IS: '1'
  (0020, 0013) Instance Number                     IS: '59'
  (0020, 0032) Image Position (Patient)            DS: ['-140.000000', '91.000000', '71.500000']
  (0020, 0037) Image Orientation (Patient)         DS: ['0.000000', '-1.000000', '0.000000', '1.000000', '0.000000', '0.000000']
  (0020, 0060) Laterality                          CS: ''
  (0020, 1040) Position Reference Indicator        LO: 'NA'
  (0020, 1041) Slice Location                      DS: '71.5000000000'
  (0028, 0002) Samples per Pixel                   US: 1
  (0028, 0004) Photometric Interpretation          CS: 'MONOCHROME2'
  (0028, 0010) Rows                                US: 256
  (0028, 0011) Columns                             US: 256
  (0028, 0030) Pixel Spacing                       DS: ['0.8593750000', '0.8593750000']
  (0028, 0100) Bits Allocated                      US: 16
  (0028, 0101) Bits Stored                         US: 16
  (0028, 0102) High Bit                            US: 15
  (0028, 0103) Pixel Representation                US: 1
  (0029, 0010) Private Creator                     OB: Array of 22 bytes
  (0029, 1001) [Unknown]                           OB: '189 '
  (0029, 1002) [Unknown]                           OB: '94'
  (0029, 1003) [Unknown]                           OB: 'F '
  (0032, 000a) Study Status ID                     CS: 'COMPLETED'
  (0032, 000c) Study Priority ID                   CS: 'LOW'
  (0032, 1030) Reason for Study                    LO: ['RT. TEMPORAL TUMOR
  RT. TEMPORAL TUMOR 
  disk # 126A. Gad. 20cc Lot: 53022B exp: 08/08 NV. ', ' 
  ']
  (0032, 4000) Study Comments                      LT: 'C'
  (0038, 0300) Current Patient Location            LO: 'PRIVATE'
  (0040, 1001) Requested Procedure ID              SH: '7706910'
  (0905, 0010) Private Creator                     OB: 'GEIIS '
  (0905, 1030) Private tag data                    OB: Array of 32 bytes
  (7fd1, 0010) Private Creator                     OW or OB: 'GEIIS '
  (7fd1, 1010) Private tag data                    OB: '\x00\x00\x00\x00'
  (7fe0, 0010) Pixel Data                          OW or OB: Array of 131072 bytes


*/


//****************************************************
//
// MOKA CREATIVE LLC ADD - IMA SPECIFIC
//
//****************************************************










// provides
goog.provide('X.parserIMA');
// requires
goog.require('X.event');
goog.require('X.object');
goog.require('X.parser');
goog.require('X.triplets');
goog.require('goog.math.Vec3');
goog.require('goog.string');




//****************************************************
//
// MOKA CREATIVE LLC ADD - IMA SPECIFIC
//
//****************************************************

//------------------
// ADD CUSTOM XTK PARSERS
//
// Add filetypes that XTK's 'X.loader.extensions' 
// doesn't default include and link them to their parser.
//------------------ 

//
// NOTE: If using a custom parser, need to make sure to 
// include in the 'xtk-custom-deps.js' file!
//
goog.require('X.loader');


//****************************************************
//
// MOKA CREATIVE LLC ADD - IMA SPECIFIC
//
//****************************************************






/**
 * Create a parser for DICOM files.
 * 
 * @constructor
 * @extends X.parser
 */
X.parserIMA = function() {
  //
  // call the standard constructor of X.parser
  goog.base(this);
  //
  // class attributes
  /**
   * @inheritDoc
   * @const
   */
  this._classname = 'parserIMA';
};
// inherit from X.parser
goog.inherits(X.parserIMA, X.parser);
/**
 * @inheritDoc
 */
X.parserIMA.prototype.parse = function(container, object, data, flag) {
  // X.TIMER(this._classname + '.parse');
  // needed, for renderer2d and 3d legacy...
  object.MRI = {};
  object.MRI.loaded_files = 0;

  // parse the byte stream
  this.parseStream(data, object);


    //console.log(object, container, data);
  // return;
  // X.TIMERSTOP(this._classname + '.parse');
  // check if all slices were completed loaded
  if (!goog.isDefAndNotNull(object._file.length) || object.slices.length == object._file.length) {

    // needed, for renderer2d and 3d legacy...
    object.MRI.loaded_files = object._file.length;

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

        imageSeriesPushed[object.slices[i]['series_instance_uid']][object.slices[i]['sop_instance_uid']] = true;
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
      console.log("FIRST IMAGE", first_image, series, seriesInstanceUID);
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
    //var _ordering = 'instance_number';

    if(first_image_stacks == 1){
        
        // ORDERING BASED ON IMAGE POSITION
        _ordering = 'image_position_patient';

        // set distance to 0
        series[seriesInstanceUID][0]['dist'] = 0;

    }
    else if(first_image[0]['image_position_patient'][0] != first_image[1]['image_position_patient'][0] ||
      first_image[0]['image_position_patient'][1] != first_image[1]['image_position_patient'][1] ||
      first_image[0]['image_position_patient'][2] != first_image[1]['image_position_patient'][2]){

        // ORDERING BASED ON IMAGE POSITION
        _ordering = 'image_position_patient';

        // set distances
        var _x_cosine = new goog.math.Vec3(first_image[0]['image_orientation_patient'][0],
          first_image[0]['image_orientation_patient'][1], first_image[ 0 ]['image_orientation_patient'][2]);
        var _y_cosine = new goog.math.Vec3(first_image[ 0 ]['image_orientation_patient'][3],
          first_image[ 0 ]['image_orientation_patient'][4], first_image[ 0 ]['image_orientation_patient'][5]);
        var _z_cosine = goog.math.Vec3.cross(_x_cosine, _y_cosine);

        function computeDistance(flag, arrelem)
          {
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
    else if(first_image[0]['instance_number'] != first_image[1]['instance_number']){
    
      // ORDERING BASED ON instance number
      _ordering = 'instance_number';
      first_image.sort(function(a,b){return a["instance_number"]-b["instance_number"]});
    
    }
    else{

      window.console.log("Could not resolve the ordering mode");

    }
      


      //****************************************************
      //
      // MOKA CREATIVE LLC ADD - IMA SPECIFIC
      //
      //****************************************************

      
      //
      // LOCALIZER or certain SequenceNames need to be ordered
      // by instance number.
      //
      console.log("SEQUENCE NAME", "'" + first_image[0]['sequence_name'] + "'")

      var instanceNumberTypes = ['fgre', 'memp', 'fse'];
      if (instanceNumberTypes.indexOf(first_image[0]['sequence_name']) > -1) {
	  window.console.log(first_image[0]['sequence_name'], "reordering...");
	  //window.console.log(first_image[0])
	  _ordering = 'instance_number';
	  first_image.sort(function(a,b){return a["instance_number"]-b["instance_number"]});
      }
      //****************************************************
      //
      // MOKA CREATIVE LLC ADD - IMA SPECIFIC
      //
      //****************************************************






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

    if( first_image_stacks > 1) {

      switch(_ordering){
        case 'image_position_patient':
          // We work only on 2 first slices
          var _first_position = first_image[ 0 ]['image_position_patient'];
          var _second_image_position = first_image[ 1 ]['image_position_patient'];
          var _x = _second_image_position[0] - _first_position[0];
          var _y = _second_image_position[1] - _first_position[1];
          var _z = _second_image_position[2] - _first_position[2];
          first_image[0]['pixel_spacing'][2] = Math.sqrt(_x*_x + _y*_y  + _z*_z);
          //first_image[0]['pixel_spacing'][2] = 200;//Math.sqrt(_x*_x + _y*_y  + _z*_z);
          break;
        case 'instance_number':
          first_image[0]['pixel_spacing'][2] = 1.0;
	  console.log("INSTANCE NUMBER SPACING");
          //first_image[0]['pixel_spacing'][2] = first_image[0]['slice_thickness'];
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
        //normalize by z spacing
        first_image_expected_nb_slices += Math.round(_distance_position/first_image[0]['pixel_spacing'][2]);
        break;
      case 'instance_number':
        first_image_expected_nb_slices += Math.abs(first_image[ first_image_stacks - 1]['instance_number'] - first_image[0]['instance_number']);
        break;
      default:
        window.console.log("Unkown ordering mode - returning: " + _ordering);
        break;
    }

    var first_slice_size = first_image[0]['columns'] * first_image[0]['rows'];
    var first_image_size = first_slice_size * (first_image_expected_nb_slices);

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

    // create data container
    switch (first_image[0].bits_allocated) {
      case 8:
        first_image_data = new Uint8Array(first_image_size);
        break;
      case 16:
	first_image_data = new Uint16Array(first_image_size);
        break;
      case 32:
        first_image_data = new Uint32Array(first_image_size);
      default:
        window.console.log("Unknown number of bits allocated - using default: 32 bits");
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

    for (var _i = 0; _i < first_image_stacks; _i++) {
      // get data
      var _data = first_image[_i].data;
      var _distance_position = 0;
	
      switch(_ordering){
        case 'image_position_patient':
          var _x = first_image[_i]['image_position_patient'][0] - first_image[0]['image_position_patient'][0];
          var _y = first_image[_i]['image_position_patient'][1] - first_image[0]['image_position_patient'][1];
          var _z = first_image[_i]['image_position_patient'][2] - first_image[0]['image_position_patient'][2];
	  //console.log("PIXEL SPACING:", first_image[0]['pixel_spacing'][2]);
          _distance_position = Math.sqrt(_x*_x + _y*_y  + _z*_z)/first_image[0]['pixel_spacing'][2];
          break;
        case 'instance_number':
	  //console.log("INSTANCES", _i, first_image[_i]['instance_number'], first_image[0]['instance_number'])
          _distance_position = (first_image[_i]['instance_number'] - first_image[0]['instance_number']);// * Math.floor(first_image[0]['slice_thickness']);
          break;
        default:
          window.console.log("Unkown ordering mode - returning: " + _ordering);
          break;
      }


	//console.log("_distance_position", _distance_position, "\tfirst_slice_size:", first_slice_size, '\tmult', multiplyer);
	first_image_data.set(_data, _distance_position * first_slice_size);


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

    object._dimensions = [first_image[0]['columns'], first_image[0]['rows'], first_image_expected_nb_slices ];
    volumeAttributes.dimensions = object._dimensions;


    // get the min and max intensities
    var min_max = this.arrayMinMax(first_image_data);
    var min = min_max[0];
    var max = min_max[1];

    // attach the scalar range to the volume
    volumeAttributes.min = object._min = object._windowLow = min;
    volumeAttributes.max = object._max = object._windowHigh = max;
    // .. and set the default threshold
    // only if the threshold was not already set
    if (object._lowerThreshold == -Infinity) {

      object._lowerThreshold = min;

    }
    if (object._upperThreshold == Infinity) {

      object._upperThreshold = max;

    }

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
    
    switch(_ordering){
      case 'image_position_patient':
	console.log("ORIENTATION", first_image[0]['image_orientation_patient']);
	//var or2 = ['0.074862', '-0.997194', '0.000000', '0.993633', '0.074619', '-0.084415']
	//first_image[0]['image_orientation_patient'] = [0, -1, 0, 1, 0, 0];
	//first_image[0]['image_orientation_patient'] = [1, -1, 1, 1, 1, 1];
	//console.log("ORIENTATION", first_image[0]['image_orientation_patient']);
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


	if (first_image[0]['sequence_name'] === 'memp' || first_image[0]['sequence_name'] === 'fse'){
            var _x_cosine = new goog.math.Vec3(first_image[0]['image_orientation_patient'][0],
					       first_image[ 0 ]['image_orientation_patient'][1], first_image[ 0 ]['image_orientation_patient'][2]);
            var _y_cosine = new goog.math.Vec3(first_image[ 0 ]['image_orientation_patient'][3],
					       first_image[ 0 ]['image_orientation_patient'][4], first_image[ 0 ]['image_orientation_patient'][5]);
            var _z_cosine = goog.math.Vec3.cross(_x_cosine, _y_cosine);

            goog.vec.Mat4.setRowValues(IJKToRAS,
				       0,
				       -first_image[ 0 ]['image_orientation_patient'][0] * first_image[0]['pixel_spacing'][0],
				       -first_image[ 0 ]['image_orientation_patient'][3] * first_image[0]['pixel_spacing'][1],
				       -_z_cosine.x*first_image[0]['pixel_spacing'][2] * first_image[0]['slice_thickness'],
				       -_origin[0]);

            goog.vec.Mat4.setRowValues(IJKToRAS,
				       1,
				       -first_image[ 0 ]['image_orientation_patient'][1]*first_image[0]['pixel_spacing'][0],
				       -first_image[ 0 ]['image_orientation_patient'][4]*first_image[0]['pixel_spacing'][1],
				       -_z_cosine.y*first_image[0]['pixel_spacing'][2] * first_image[0]['slice_thickness'],
				       -_origin[1]);
            // - first_image[0]['pixel_spacing'][1]/2);
            goog.vec.Mat4.setRowValues(IJKToRAS,
				       2,
				       first_image[ 0 ]['image_orientation_patient'][2] * first_image[0]['pixel_spacing'][0],
				       first_image[ 0 ]['image_orientation_patient'][5] * first_image[0]['pixel_spacing'][1],
				       _z_cosine.z*first_image[0]['pixel_spacing'][2] * first_image[0]['slice_thickness'],
				       _origin[2]);
	}

	else {
            goog.vec.Mat4.setRowValues(IJKToRAS, 0,1,0,0,-_origin[0]);
	    goog.vec.Mat4.setRowValues(IJKToRAS, 1, 0,-1,-0,-_origin[1]);
	    goog.vec.Mat4.setRowValues(IJKToRAS, 2,0,0,1,_origin[2]);
        }

	goog.vec.Mat4.setRowValues(IJKToRAS, 3,0,0,0,1);
        break;
      default:
        window.console.log("Unkown ordering mode - returning: " + _ordering);
        break;
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

    // create the volume object
    object.create_(volumeAttributes);

    // re-slice the data in SAGITTAL, CORONAL and AXIAL directions
    object._image = this.reslice(object);

  }

  // the object should be set up here, so let's fire a modified event
  var modifiedEvent = new X.event.ModifiedEvent();
  modifiedEvent._object = object;
  modifiedEvent._container = container;
  this.dispatchEvent(modifiedEvent);

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
 X.parserIMA.prototype.handleDefaults = function(_bytes, _bytePointer, _VR, _VL) {
     //console.log('\t\t_VR', _VR);
     //console.log('\t\t_VL', _VL);
     //console.log("\t\t\tBYTEPT BEF:", _bytePointer);
    switch (_VR){
      case 16975:
        // UL
      case 20819:
        // SQ
      case 20053:
        // UN
      case 22351:
        // OW
	//console.log('\t\t\t22351');
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

        // flag undefined sequence length
        if(_VL == 4294967295){
          _VL = 0;
        }

        _bytePointer+=_VL/2;
      break;

    default:
	//console.log("\t\t\tBYTEPT: MID", _bytePointer);
      _bytePointer+=_VL/2;
        break;
    }
     //console.log("\t\t\tBYTEPT: AFT", _bytePointer);
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
X.parserIMA.prototype.parseStream = function(data, object) {

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
  // Transfer syntax UIDs
  // 1.2.840.10008.1.2: Implicit VR Little Endian
  // 1.2.840.10008.1.2.1: Explicit VR Little Endian
  // 1.2.840.10008.1.2.2: Explicit VT Big Endian
  slice['transfer_syntax_uid'] = "no_transfer_syntax_uid";

  // scan the whole file as short (2 bytes)
    //console.log(this._data.byteLength);
  var _bytes = this.scan('ushort', this._data.byteLength);
    //var _bytes = this.scan('sshort', this._data.byteLength);

  //var _bytePointer = 66; // skip the 132 byte preamble
  var _bytePointer = 66; // skip the 132 byte preamble
  var _tagGroup = null;
  var _tagElement = null;
  var _VR = null;
  var _VL = null;
//console.log(_bytes);





    //****************************************************
    //
    // MOKA CREATIVE LLC ADD - IMA SPECIFIC
    //
    //****************************************************
    var skipPairs = [[0x0008, 0x1110],[0x0008, 0x1120]];
    var skipCurrent = false;
    //****************************************************
    //
    // MOKA CREATIVE LLC ADD - IMA SPECIFIC
    //
    //****************************************************





  while (_bytePointer <  _bytes.length) {
      
    _tagGroup = _bytes[_bytePointer++];
    _tagElement = _bytes[_bytePointer++];
    _VR = _bytes[_bytePointer++];
    _VL = _bytes[_bytePointer++];


      //****************************************************
      //
      // MOKA CREATIVE LLC ADD - IMA SPECIFIC
      //
      //****************************************************

      //
      // These byte pointers screw up the parsing and it appears
      // to be an IMA specifc thing related to these memory addresses, 
      // specifically:
      //
      // [0x0008, 0x1110]
      // [0x0008, 0x1120]
      //
      //
      // Here's a sample of whay pydicom.read_file spits out at a given
      // IMA file:
      //
      //(0008, 1110)  Referenced Study Sequence   3 item(s) ---- 
      //   (0008, 1150) Referenced SOP Class UID            UI: Detached Study Management SOP Class
      //   (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70326.15254269
      //   ---------
      //   (0008, 1150) Referenced SOP Class UID            UI: Detached Study Management SOP Class
      //   (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70327.15254270
      //   ---------
      //   (0008, 1150) Referenced SOP Class UID            UI: Detached Study Management SOP Class
      //   (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70327.15254271
      //   ---------
      //(0008, 1120)  Referenced Patient Sequence   1 item(s) ---- 
      //   (0008, 1150) Referenced SOP Class UID            UI: Detached Patient Management SOP Class
      //   (0008, 1155) Referenced SOP Instance UID         UI: 1.2.124.113932.1.170.223.162.178.20060703.70118.15254262
      //
      //
      // We basically need to skip:
      // [0x0008, 0x1110]
      // [0x0008, 0x1120]
      //
      // 
      //
      //console.log(_bytePointer, _bytes.length)
      //console.log(_tagGroup);
      //console.log(_bytePointer);
      skipCurrent = false;
      for (var i=0, len = skipPairs.length; i < len; i++){
	  if ((_tagGroup === skipPairs[i][0]) && (_tagElement === skipPairs[i][1])){
	      skipCurrent = true;
	      break;
	  }
      }
      if (skipCurrent){
	  window.console.log("Skipping ", '(' + _tagGroup.toString(16) + ',' + _tagElement.toString(16) +')');
	  continue;
      }
      //****************************************************
      //
      // MOKA CREATIVE LLC ADD - IMA SPECIFIC
      //
      //****************************************************







      //if ((_tagGroup !== undefined) && (_tagElement !== undefined)){
	  //window.console.log( '(' + _tagGroup.toString(16) + ',' + _tagElement.toString(16) +')');
      //}

      // var _b0 = _VR & 0x00FF;
      // var _b1 = (_VR & 0xFF00) >> 8;
      // window.console.log('_VR: '+_VR+' - ' + String.fromCharCode( _b0 ) + String.fromCharCode( _b1 ));
      // window.console.log('_VL: ' + _VL);




      // Implicit VR Little Endian case
      if((slice['transfer_syntax_uid'] == '1.2.840.10008.1.2') && (_VL == 0)){
	  
	  _VL = _VR;

      }

      switch (_tagGroup) {










      case 0x0002:
	//console.log('0x0002');
        // Group of DICOM meta info header
        switch (_tagElement) {
          case 0x0010:
	    //console.log('tag 0x0010');
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
            break;
          default:
            _bytePointer = X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;

      case 0x0028:
      // Group of IMAGE INFO
	//console.log('0x0028', _tagElement.toString(16));
        switch (_tagElement) {
          case 0x0010:
            // rows
	    //console.log('\t TAG: 0x0010');
            slice['rows'] = _bytes[_bytePointer];
            _bytePointer+=_VL/2;
            break;
          case 0x0011:
            // cols
            slice['columns'] = _bytes[_bytePointer];
            _bytePointer+=_VL/2;
            break;
          case 0x0100:
            // bits allocated
            slice.bits_allocated = _bytes[_bytePointer];
            _bytePointer+=_VL/2;
            break;
          case 0x0101:
            // bits stored
            slice['bits_stored'] = _bytes[_bytePointer];
            _bytePointer+=_VL/2;
            break;
          case 0x0002:
            // number of images
            slice['number_of_images'] = _bytes[_bytePointer];
            _bytePointer+=_VL/2;
            break;
          case 0x0030:
            // pixel spacing
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
            _bytePointer = X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;
      
      case 0x0020:
        // Group of SLICE INFO
        switch (_tagElement) {
          case 0x000e:
            // Series instance UID
            slice['series_instance_uid'] = "";
            var i = 0;
            for (i = 0; i < _VL / 2; i++) {
              var _short = _bytes[_bytePointer++];
              var _b0 = _short & 0x00FF;
              var _b1 = (_short & 0xFF00) >> 8;
              slice['series_instance_uid'] += String.fromCharCode(_b0);
              slice['series_instance_uid'] += String.fromCharCode(_b1);
            }
            break;
          case 0x0013:
	    //console.log("*****************************0x0013");
            var _position = '';
            for (i = 0; i < _VL / 2; i++) {
              var _short = _bytes[_bytePointer++];
              var _b0 = _short & 0x00FF;
              var _b1 = (_short & 0xFF00) >> 8;
              _position += String.fromCharCode(_b0);
              _position += String.fromCharCode(_b1);
            }
	    //alert(parseInt(_position, 10));
            slice['instance_number'] = parseInt(_position, 10); 
            break;
          case 0x0032:
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
            // _tagCount--;
            break;
          case 0x0037:
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
            // _tagCount--;
            break;

          default:
            _bytePointer = X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;





	//****************************************************
	//
	// MOKA CREATIVE LLC ADD - IMA SPECIFIC
	//
	//****************************************************
    case 0x0018:
	//
        // Sequence Name
	//
        switch (_tagElement) {


        case 0x0024:
            slice['sequence_name'] = "";
            var i = 0;
            for (i = 0; i < _VL / 2; i++) {
		var _short = _bytes[_bytePointer++];
		var _b0 = _short & 0x00FF;
		var _b1 = (_short & 0xFF00) >> 8;
		slice['sequence_name'] += String.fromCharCode(_b0);
		slice['sequence_name'] += String.fromCharCode(_b1);
            }
	    slice['sequence_name'] = goog.string.trimLeft(slice['sequence_name']);
	    slice['sequence_name'] = goog.string.trimRight(slice['sequence_name']);

            break;


        case 0x0050:
            slice['slice_thickness'] = "";
            var i = 0;
            for (i = 0; i < _VL / 2; i++) {
		var _short = _bytes[_bytePointer++];
		var _b0 = _short & 0x00FF;
		var _b1 = (_short & 0xFF00) >> 8;
		slice['slice_thickness'] += String.fromCharCode(_b0);
		slice['slice_thickness'] += String.fromCharCode(_b1);
            }
	    slice['slice_thickness'] = parseFloat(slice['slice_thickness']);
            break;
        default:
	    _bytePointer =X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
	}
	//****************************************************
	//
	// MOKA CREATIVE LLC ADD - IMA SPECIFIC
	//
	//****************************************************





    case 0xfffe:
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
        // Group of SLICE INFO
        // here we are only interested in the InstanceNumber
	//console.log('\tETNERING 0x0008');
        switch (_tagElement) {
          case 0x0018:
            // Image instance UID
            slice['sop_instance_uid'] = "";
            var i = 0;
            for (i = 0; i < _VL / 2; i++) {
              var _short = _bytes[_bytePointer++];
              var _b0 = _short & 0x00FF;
              var _b1 = (_short & 0xFF00) >> 8;
              slice['sop_instance_uid'] += String.fromCharCode(_b0);
              slice['sop_instance_uid'] += String.fromCharCode(_b1);
            }
            break;


          default:
	    //console.log("\t\t08 default", _bytePointer, _tagElement.toString(16));
	    //if  (_tagElement.toString(16) !== '1110') {
		_bytePointer = X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
	    //}
	    //else {
	    //	console.log("here2?");
	    //}
	    //console.log("\t\t", _bytePointer);
            break;
          }

        break;


    case 0x0010:
        // Group of SLICE INFO
        // here we are only interested in the InstanceNumber
        switch (_tagElement) {
          case 0x2210:
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
            break;

          default:
            _bytePointer = X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
            break;
          }

        break;
          // We should parse the data like that...
            // case 0x7fe0:
    //     // Group of SLICE INFO
    //     // here we are only interested in the InstanceNumber
    //     switch (_tagElement) {
    //       case 0x0010:
    //         var _data = null;
    //         switch (slice.bits_allocated) {
    //           case 8:
    //             slice.data = new Uint8Array(slice.columns * slice.rows);
    //             slice.data = this.scan('uchar', slice.columns * slice.rows);
    //             break;
    //           case 16:
    //             slice.data = new Uint16Array(slice.columns * slice.rows);
    //             slice.data = this.scan('ushort', slice.columns * slice.rows);
    //             break;
    //           case 32:
    //             slice.data = new Uint32Array(slice.columns * slice.rows);
    //             slice.data = this.scan('uint', slice.columns * slice.rows);
    //             break;
    //         }

    //         break;

    //       default:
    //         _bytePointer = X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
    //         break;
    //       }

      default:
        _bytePointer = X.parserIMA.prototype.handleDefaults(_bytes, _bytePointer, _VR, _VL);
        break;
      }

    }



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
  // jump to the beginning of the pixel data
  this.jumpTo(this._data.byteLength - slice['columns'] * slice['rows'] * 2);
  // check for data type and parse accordingly
  var _data = null;

  switch (slice.bits_allocated) {
  case 8:
    _data = this.scan('uchar', slice['columns'] * slice['rows']);
    break;
  case 16:
    _data = this.scan('ushort', slice['columns'] * slice['rows']);

    break;
  case 32:
    _data = this.scan('uint', slice['columns'] * slice['rows']);
    break;
  }

  slice['data'] = _data;

  object.slices.push(slice);

  return object;
};

// export symbols (required for advanced compilation)
goog.exportSymbol('X.parserIMA', X.parserIMA);
goog.exportSymbol('X.parserIMA.prototype.parse', X.parserIMA.prototype.parse);
