'use strict';

//
// Filters are used in a template within a {{substitution}} variable and resemble Unix style commands piped together, e.g.,
//
// {{phone.connectivity.infrared | checkmark}}
//
// where "phone.connectivity.infrared" is a variable on the scope and "checkmark" is a filter function. The filter is
// passed the scope variable, transforms its value is some way and returns the transformed value. If more than one 
// filter is specified the results of the first filter is passed to the second and so on until all filters have been
// executed. The final value is used during interpolation of the substitution variable.
//
// For more information see: http://docs.angularjs.org/guide/dev_guide.templates.filters.creating_filters
//

//
// Converts a true or false value into a green or red unicode checkmark.
//
sluiApp.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
