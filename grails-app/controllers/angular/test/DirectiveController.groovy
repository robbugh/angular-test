package angular.test

class DirectiveController {

    def index() { render "<div>index</div>" }
    
    def d1() {
        log.debug "d1"
        render """\
<div>
        <h1>Directive-1</h1>
        <select ng-model="view" ng-options="v for v in views"></select>
        <br>
        <inner template="d4"/>
</div>
"""
    }
    
    def d2() {
        log.debug "d2"
       render """\
<div>
        <h1>Directive-2</h1>
        <select ng-model="view" ng-options="v for v in views"></select>
        <br>
        <inner template="d4"/>
</div>
"""
    }
    
    def d3() {
        log.debug "d3"
       render """\
<div>
        <h1>Directive-3</h1>
        <select ng-model="view" ng-options="v for v in views"></select>
        <br>
        <inner template="d4"/>
</div>
"""    }
    
    def d4() {
        log.debug "d4"
       render """\
<div>
        <h1>Directive-4</h1>
        <select ng-model="view" ng-options="v for v in views"></select>
</div>
"""
    }
    
    def d5() {
        log.debug "d5"
       render """\
<div>
        <h1>Directive-5</h1>
        <select ng-model="view" ng-options="v for v in views"></select>
</div>
"""
    }

    def d6() {
        log.debug "d6"
       render """\
<div>
        <h1>Directive-6</h1>
        <select ng-model="view" ng-options="v for v in views"></select>
</div>
"""
    }
}
