<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
         "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html ng-app="myApp">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Angular Test</title>
    
    <r:require modules="myApp"/>
    <link rel="stylesheet" type="text/css" href="css/main.css" rel="stylesheet"/>
    
    <g:javascript library="jquery" plugin="jquery"/>
    <r:layoutResources/>
  </head>

  <body>
     <div style="padding: 10px;" ng-view></div>
     <r:layoutResources/>    
  </body>
</html>