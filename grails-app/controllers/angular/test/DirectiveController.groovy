package angular.test

class DirectiveController {

    def index() { render "<div>index</div>" }
    
    def d1() {
        log.debug "d1"
        render """\
<div>
        <h1>Template: D1</h1>
        <inner name="D1" templates="['d4', 'd5', 'd6']"/>
</div>
"""
    }
    
    def d2() {
        log.debug "d2"
       render """\
<div>
        <h1>Template: D2</h1>
        <inner name="D2" templates="['d4', 'd5', 'd6']"/>
</div>
"""
    }
    
    def d3() {
        log.debug "d3"
       render """\
<div>
        <h1>Template: D3</h1>
        <inner name="D3" templates="['d4', 'd5', 'd6']"/>
</div>
"""    }
    
    def d4() {
        log.debug "d4"
       render """\
<div>
        <h1>Template: D4</h1>
</div>
"""
    }
    
    def d5() {
        log.debug "d5"
       render """\
<div>
        <h1>Template: D5</h1>
</div>
"""
    }

    def d6() {
        log.debug "d6"
       render """\
<div>
        <h1>Template: D6</h1>
</div>
"""
    }
}
