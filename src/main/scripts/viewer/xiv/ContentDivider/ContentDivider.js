/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.events');
goog.require('goog.fx');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.array');

// utils
goog.require('utils.dom');
goog.require('utils.string');
goog.require('utils.style');
goog.require('utils.events.EventManager');

// xiv
goog.require('xiv.Widget');
goog.require('xiv');
goog.require('xiv.ViewBoxTabs');




/**
 * xiv.ContentDivider is the divider object that
 * separates the xiv.ViewBoxTabs from the Holder objects.
 * When the user drags the Content Divider up and down,
 * the xiv.ViewBoxTabs and Holder objects resize themselves 
 * according.
 *
 * @constructor
 * @extends {xiv.Widget}
 */
goog.provide('xiv.ContentDivider');
xiv.ContentDivider = function () {
    
    goog.base(this);
    


    /**
     * @private
     * @type {!Element}
     */
    this.containment_ = goog.dom.createDom("div", {
	'id' : 'xiv.ContentDividerContainment_' + 
	    goog.string.createUniqueString(),
	'class': xiv.ContentDivider.CONTAINMENT_CLASS
    });
    
    

    /**
     * @private
     * @type {!Element}
     */
    this.icon_ = goog.dom.createDom("img", {
	'id' : 'xiv.ContentDividerIcon_' + goog.string.createUniqueString(),
	'class':  xiv.ContentDivider.ICON_CLASS,
	'src': 'Toggle-ContentDivider.png',
    });		

    
    // Event manager
    utils.events.EventManager.addEventManager(this, 
					      xiv.ContentDivider.EventType);

    // Appends
    goog.dom.append(this.getElement(), this.icon_);

    // Inits
    this.setDefaultDragMethods_();
    this.updateStyle();
    
}
goog.inherits(xiv.ContentDivider, xiv.Widget);
goog.exportSymbol('xiv.ContentDivider', xiv.ContentDivider);



/**
 * @inheritDoc
 */
xiv.ContentDivider.prototype.updateIconSrcFolder = function() {
    this.icon_.src = goog.string.path.join(this.iconUrl, 
					utils.string.basename(this.icon_.src));
}




/**
 * @const
 * @public
 */
xiv.ContentDivider.CONTENT_DIVIDER_HEIGHT = 4


/**
 * @const
 * @public
 */
xiv.ContentDivider.ANIM_MED = 400



/**
 * @type {!string} 
 * @const
 * @expose
 */
xiv.ContentDivider.ID_PREFIX =  'xiv.ContentDivider';



/**
 * @type {!string} 
 * @const
*/
xiv.ContentDivider.CSS_CLASS_PREFIX =
    xiv.ContentDivider.ID_PREFIX.toLowerCase().replace(/\./g,'-');



/**
 * @type {string} 
 * @const
 */
xiv.ContentDivider.ELEMENT_CLASS =  
    goog.getCssName(xiv.ContentDivider.CSS_CLASS_PREFIX, '');


/**
 * @type {string} 
 * @const
 */
xiv.ContentDivider.CONTAINMENT_CLASS =  
goog.getCssName(xiv.ContentDivider.CSS_CLASS_PREFIX, 'containment');



/**
 * @type {string} 
 * @const
 */
xiv.ContentDivider.ICON_CLASS =  
    goog.getCssName(xiv.ContentDivider.CSS_CLASS_PREFIX, 'icon');



/**
 * Event types.
 * @enum {string}
 */
xiv.ContentDivider.EventType = {
  DRAGEND: goog.events.getUniqueId('dragend'),
  DRAGSTART: goog.events.getUniqueId('dragstart'),
  DRAG: goog.events.getUniqueId('drag'),
};



/**
 * @type {!boolean}
 * @private
 */
xiv.ContentDivider.prototype.dragging_ = false;



/**
 * @type {!number}
 * @private
 */
xiv.ContentDivider.prototype.prevY_ = 0;



/**
 * @type {!number}
 * @private
 */
xiv.ContentDivider.prototype.currY_ = 0;



/**
 * @return {!string}  The drag direction
 * @public
 */
xiv.ContentDivider.prototype.getDragDirection = function() {
    var diff = /**@type {number}*/  this.currY_ - this.prevY_;
    if (diff > 0) {
	return 'down';
    }
    else if (diff == 0) { 
	return 'neutral'; 
    }
    return 'up';
}



/**
 * @return {!Element}  The divider's containment element.
 * @public
 */
xiv.ContentDivider.prototype.getContainment = function() {
    return this.containment_;
}




/**
 * @return {!boolean} Whether the divider is in a 
 *    dragging state.
 * @public
 */
xiv.ContentDivider.prototype.isDragging = function() {
    return this.dragging_;
}




/**
 * For the xiv.ViewBoxTabs.  When the user moves or clicks
 * on the content divider, there's a maximum "top" it can go to,
 * which is defined by the containment_ element's top.
 *
 * @return {!number} The containment value (top, px) of the divider.
 * @public
 */
xiv.ContentDivider.prototype.getUpperLimit = function() {
    return utils.style.dims(this.containment_, 'top');
} 




/**
 * @return {!number} The position value (top, px) of the divider.
 * @public
 */
xiv.ContentDivider.prototype.getY = function() {
    return utils.style.dims(this.getElement(), 'top'); 
} 





/**
 * When the user moves or clicks
 * on the content divider, there's a minimum "bottom" it can go to,
 * which is defined by the containment_ element's top + height.
 *
 * @return {!number}
 * @public
 */
xiv.ContentDivider.prototype.getLowerLimit = function() {
    return utils.style.dims(this.containment_, 'top') + 
	utils.style.dims(this.containment_, 'height') - 
	utils.style.dims(this.getElement(), 'height');
} 




/**
* Defines the dragging behavior of the Content Divider
* at a high level.  
* @private
*/ 
xiv.ContentDivider.prototype.setDefaultDragMethods_ = function() {    


    //------------------
    // On Mousedown...
    //------------------
    goog.events.listen(this.getElement(), goog.events.EventType.MOUSEDOWN, 
		       function(e) {
	
	// Stop propagation.
	utils.dom.stopPropagation(e);
	

	// Params.
	var cDims = utils.style.dims(this.containment_);
	var d = new goog.fx.Dragger(this.getElement(), null, 
		new goog.math.Rect(0, cDims['top'], 0, 
			cDims['height'] 
		        - xiv.ContentDivider.CONTENT_DIVIDER_HEIGHT));
	this.dragging_ = true;	


	// Clear params when done dragging.
	d.addEventListener(goog.fx.Dragger.EventType.START, function(e) {
	    this.dragging_ = true;
	    this.prevY_ = this.getY();
	    this.currY_ = this.prevY_;
	    this['EVENTS'].runEvent('DRAGSTART', this);	
	}.bind(this));

	
	// Run drag callbacks on drag.
	d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
	    utils.dom.stopPropagation(e);


	    this.prevY_ = this.currY_;
	    this.currY_ = this.getY();
	    this['EVENTS'].runEvent('DRAG', this);	
	}.bind(this));
	

	// Clear params when done dragging.
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
	    this.dragging_ = false;
	    this['EVENTS'].runEvent('DRAGEND', this);
	    d.dispose();
	}.bind(this));


	// Call goog.fx.Dragger.startDrag
	d.startDrag(e);	
    }.bind(this));
}




/**
 * Programmatically allows the content divider to slide
 * to a new 'top' position.
 *
 * @param {!number} newTop
 * @param {boolean=} opt_animate
 */
xiv.ContentDivider.prototype.slideTo = function(newTop, opt_animate) {
    
    window.console.log("SLIDE TO", newTop);
    var dims = utils.style.dims(this.getElement());
    var slide = new goog.fx.dom.Slide(this.getElement(), 
				      [dims.left, dims.top], [0, newTop], 
				      xiv.ContentDivider.ANIM_MED, 
				      goog.fx.easing.easeOut);

    //------------------
    // Callbacks dor the animation events (BEGIN, ANIMATE, END).
    //------------------
    goog.events.listen(slide, goog.fx.Animation.EventType.BEGIN, function() {

	this.prevY_ = this.getY();
	this.currY_ = this.prevY_;
	this['EVENTS'].runEvent('DRAGSTART', this);		
    }.bind(this));


    goog.events.listen(slide, goog.fx.Animation.EventType.ANIMATE, function() {

	this.prevY_ = this.currY_;
	this.currY_ = this.getY();
	window.console.log('DRAG', this.currY_, this.prevY_);
	this['EVENTS'].runEvent('DRAG', this);			
    }.bind(this));


    goog.events.listen(slide, goog.fx.Animation.EventType.END, function() {
	this['EVENTS'].runEvent('DRAGEND', this);		
    }.bind(this));


    //------------------
    // Play animation.
    //------------------
    slide.play();	
} 



/**
 * Determines if the divider is within 3 pixels of the lower limit.
 * @return {!boolean} Whether at or near lower limit.
 * @public
 */
xiv.ContentDivider.prototype.isNearLowerLimit = function() {
    return Math.abs(utils.style.dims(this.getElement(), 'top') -
		    this.getLowerLimit()) < 3
}



/**
 * @inheritDoc
 */
xiv.ContentDivider.prototype.updateStyle = function (opt_args) {

    window.console.log(opt_args);
    if (opt_args) { 
	this.setArgs(opt_args) 
    }
}





