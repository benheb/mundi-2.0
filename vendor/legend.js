//! legend.js
//! version : 0.01
//! author : Brendan Heberton
//!license : MIT 
(function(window){
  'use strict';

  var Legend = function Legend( container, options ) {
    console.log('init Legend, options: ', options);
    var self = this;

    //store options 
    this.options = options;

    //UI defaults 
    this.width = options.width || 239;
    this.height = options.height || 'auto';
    this.container = container;
    this._handlers = {};
    this.state = {};
    this.state.editable = options.editable || false;

    this.layers = options.layers || [];
    
    this._buildUI(); 

    if ( this.layers.length ) {
      this.layers.forEach(function(layer) {
        self.addLayer(layer, true);
      });
    }

    this._sortIt();
  }

  Legend.prototype._buildUI = function() {

    var container = document.getElementById( this.container );
    var innerContainer = document.createElement( 'div' );
    container.appendChild( innerContainer ).id = 'legend-component';

    var content = document.createElement( 'ul' );
    innerContainer.appendChild( content ).id = 'legend-component-content';

  }




  Legend.prototype.addLayer = function(layer, blockEventing) {
    console.log('add layer: ', layer);
    var el = document.getElementById( 'legend-component-content' );
    var item = this._createElement('li', el, layer.id, '', 'legend-item', true);

    this.populateLayerItem(item, layer, blockEventing);

    if ( Sortable ) {
      var items = document.getElementsByClassName( 'legend-item' );
      for (var i=0; i< items.length; i++ ) {
        items[i].classList.add('sortable');
      }
    }
  }



  Legend.prototype.updateLayer = function(layer) {
    var self = this;
    var exists = false;

    //make sure we already have the layer 
    this.layers.forEach(function(l, i) {
      if ( layer.id === l.id ) { exists = true; }
    });

    if ( !exists ) { 
      this.addLayer(layer); 
    } else {
      
      var el = document.getElementById( layer.id );
      el.innerHTML = '';
      this.populateLayerItem( el, layer, true );

    }
  }



  Legend.prototype.populateLayerItem = function(el, layer, blockEventing) {
    var self = this;
    //if can remove layer, add option to UI
    var editable = ( this.state.editable ) ? 'block' : 'none';
    
    var title = this._formatTitle(layer.name);
    var top = this._createElement('div', el, 'top-'+layer.id, '', 'legend-top-row');

    //title
    var titleEl = this._createElement('div', top, 'title-'+layer.id, '<div class="legend-title-text">'+title+'</div>', 'legend-title');
  
    //add editor     
    var editor = this._createElement('div', top, 'edit-tools-'+layer.id, '', 'legend-edit-tools');
    editor.style.display = editable;

    //create editor elements 
    var removeEl = this._createElement('div', editor, 'close-'+layer.id, '&#x2715;', 'legend-tool legend-remove-layer');
    var editEl = this._createElement('div', editor, 'edit-'+layer.id, '&#x270E;', 'legend-tool legend-edit-layer');

    //add color ramps IF choropleth 
    if ( layer.renderer.visualVariables && !layer.renderer.classBreakInfos ) {
      
      //simple color ramp
      var renderer = layer.renderer.visualVariables[0];
      var keyContainer = this._createElement('div', el, 'key-container-'+layer.id, '', 'key-container');
      var field = this._createElement('div', keyContainer, 'field-'+layer.id, 'Styled by '+renderer.field, 'legend-field');
      this._buildColorRamp(keyContainer, renderer.stops, layer.id);

    } else if ( layer.renderer.classBreakInfos ) {
      
      //TODO just graduated 
      var renderer = layer.renderer.classBreakInfos;
      var colors = ( layer.renderer.visualVariables ) ? layer.renderer.visualVariables : null;
      var keyContainer = this._createElement('div', el, 'key-container-'+layer.id, '', 'key-container');
      var field = this._createElement('div', keyContainer, 'field-'+layer.id, 'Styled by '+layer.renderer.field, 'legend-field');
      this._buildGraduatedRamp(keyContainer, renderer, layer.id, colors);

    } else if ( !layer.renderer.visualVariables && !layer.renderer.classBreakInfos ) {
      
      //simple symbols!
      el.style['padding-top'] = '0px';
      this._buildSimpleSymbol(titleEl, layer.renderer, layer.id);

    }

    if ( !blockEventing ) {
      this.layers.push(layer);
    }

    this._addEventToElement('click', removeEl, '_onRemoveLayer');
    this._addEventToElement('click', editEl, '_onLayerEdit' );

  }



  Legend.prototype.disableEdit = function() {
    this.state.editable = false;
    
    var items = document.getElementsByClassName( 'legend-edit-tools' );
    for(var i=0;i<items.length;i++){
      items[i].style.display = 'none';
    }

  }


  Legend.prototype.enableEdit = function() {
    this.state.editable = true;

    var items = document.getElementsByClassName( 'legend-edit-tools' );
    for(var i=0;i<items.length;i++){
      items[i].style.display = 'block';
    }
  }



  Legend.prototype._formatTitle = function(title) {
    title = title.replace(/_/g, ' ');

    return title;
  }


  Legend.prototype._dojoColorToRgba = function(c) {
    var color = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
    return color;
  }




  Legend.prototype._buildSimpleSymbol = function(el, renderer, id) {
    
    el.classList.add('single-color');
    var color = this._dojoColorToRgba(renderer.symbol.color);
    var stroke = this._dojoColorToRgba(renderer.symbol.outline.color);
    var symbol = this._createElement('div', el, 'symbol-'+id, '', 'legend-simple-symbol', true);
    symbol.style.background = color; 
    symbol.style.border = '1px solid '+stroke;

    //circle or square? 
    if ( renderer.symbol.style === 'esriSMSCircle') {
      symbol.classList.add('circle');
    }
  }




  Legend.prototype._buildGraduatedRamp = function(el, stops, id, colors) {
    console.log('BUILD GRADUATED renderer', stops, 'colors', colors);
    var self = this;

    if ( colors ) {
      colors = colors[0].stops;
    }

    var color, stroke;
    stops.forEach(function(stop, i) {
      var width = 272 / stops.length; 
      var height = width; 

      if ( colors ) {
        color = self._dojoColorToRgba(colors[i].color); 
      } else {
        color = self._dojoColorToRgba(stop.symbol.color); 
      }
      
      stroke = stop.symbol.outline.color;
      stroke = self._dojoColorToRgba(stroke); //'rgb('+stroke.r+','+stroke.g+','+stroke.b+')';

      var item = document.createElement('div');
      el.appendChild( item ).className = 'legend-graduated-symbol-container';
      item.style.width = width + 'px';

      var circle = document.createElement('div');
      item.appendChild(circle).className = 'legend-graduated-symbol';
      circle.style.background = color;
      circle.style.border = '1px solid '+stroke;
        
      var max = width; 
      
      width = width / ( stops.length / (i + 1 )); 
      circle.style.width = width + 'px';
      circle.style.height = width + 'px';
      
      var margin = (max - width) / 2;
      circle.style['margin-top'] = margin + 'px';
    });

    var min = stops[0].label;
    var max = stops[stops.length - 1].label;

    var values = this._createElement('div', el, 'values-'+id, '', 'legend-key');
    this._createElement('div', values, 'min-'+id, min, 'legend-min-value');
    this._createElement('div', values, 'max-'+id, max, 'legend-max-value legend-max-graduated');

  }




  Legend.prototype._buildColorRamp = function(el, stops, id) {
    var self = this;
    var width = 272 / stops.length; 

    stops.forEach(function(stop) {
      var color = self._dojoColorToRgba(stop.color);
      var item = document.createElement('div'); 
      el.appendChild( item ).className = 'legend-color-swatch';
      
      item.style.background = color;
      item.style.width = width + 'px';
    });

    var min = stops[0].value.toFixed(2);
    var max = stops[stops.length - 1].value.toFixed(2);
    min = parseFloat(min).toLocaleString();
    max = parseFloat(max).toLocaleString();

    var values = this._createElement('div', el, 'values-'+id, '', 'legend-key');
    this._createElement('div', values, 'min-'+id, min, 'legend-min-value');
    this._createElement('div', values, 'max-'+id, max, 'legend-max-value');
  }




  /*
  * creates a generic element, and appends to 'parent' div 
  * @param {String}   type of HTML element to create 
  * @param {String}   parent element to append created element to 
  * @param {String}   id of newly created element 
  * @param {String}   any text one wishes to append to new element 
  * @param {String}   optional classname for new element 
  */
  Legend.prototype._createElement = function(type, parent, id, html, className, prepend ) {

    var el = document.createElement( type ); 
    if ( prepend ) {
      parent.insertBefore( el, parent.firstChild ).id = id;
    } else {
      parent.appendChild( el ).id = id;
    }
    el.innerHTML = html;
    document.getElementById( id ).className = className;

    return el;
  }



  Legend.prototype._addEventToElement = function(eventName, el, fnName) {
    var self = this;
    el.addEventListener( eventName , function(e) { self[ fnName ].call(self, e) });
  }


  /*
  * Event builder for ids 
  * @param {String}     eventName, type of event 
  * @param {String}     id, what element are we binding to
  * @param {String}     fnName, what action (function to call) when event fires 
  *
  */
  Legend.prototype._idEventBuilder = function(eventName, id, fnName ) {
    var self = this; 
    
    var linkEl = document.getElementById( id );
    if(linkEl.addEventListener){
      linkEl.addEventListener(eventName, function(e) { self[ fnName ].call(self, e) });
    } else {
      linkEl.attachEvent('on'+eventName, function(e) { self[ fnName ].call(self, e) });
    }

  }




  Legend.prototype._sortIt = function() {
    var self = this;

    if ( Sortable ) {
      var list = document.getElementById("legend-component-content");
      var items = document.getElementsByClassName( 'legend-item' );
      for (var i=0; i< items.length; i++ ) {
        items[i].classList.add('sortable');
      }
      
      Sortable.create(list, {
        onUpdate: function (evt/**Event*/){
           var item = evt.item.id; // the current dragged HTMLElement
            for (var i=0; i< items.length; i++ ) {
              var id = items[i].id;
              var index = ( (items.length - 1) - i );
              //console.log('index', i, index);
              self.emit('reorder-layers', {id: id, index: index});
            }
        }
      }); // That's all.
    }
  }



  Legend.prototype.removeLayer = function(e) {
    var self = this;

    var id = e.target.id.replace(/close-/, '');
    
    //remove from dom
    var el = document.getElementById(id);
    el.classList.add('removing');
    setTimeout(function() {
      el.parentNode.removeChild(el);
    },400);

    //remove from layers list 
    this.layers.forEach(function(layer, i) {
      if ( layer.id === id ) { self.layers.splice(i, 1); }
    });

    //emit removal event
    this.emit('remove-layer', id);
  }



  Legend.prototype.editLayer = function(e) {
    var id = e.target.id.replace(/edit-/, '');
    var el = document.getElementById(id);
    var selected = false; 
    
    if ( el.classList.contains('selected') ) {
      selected = true;
    }

    var items = document.getElementsByClassName( 'legend-item' );
    for(var i=0;i<items.length;i++){
      items[i].classList.remove('selected');
    }

    if ( !selected ) {
      el.classList.add('selected');
      this.emit('edit-layer', id);
    } else {
      this.emit('edit-layer-end', id);
    }
  }


  /************* EVENTS **************/

  /*
  * Register Malette events 
  * 
  */
  Legend.prototype.on = function(eventName, handler){
    this._handlers[ eventName ] = handler; 
  };


  // trigger callback 
  Legend.prototype.emit = function(eventName, val) {
    if (this._handlers[ eventName ]){
      this._handlers[ eventName ](val);
    }
  };


  Legend.prototype._onRemoveLayer = function(e) {
    this.removeLayer(e);
  }

  Legend.prototype._onLayerEdit = function(e) {
    this.editLayer(e);
  }


  window.Legend = Legend;

})(window);