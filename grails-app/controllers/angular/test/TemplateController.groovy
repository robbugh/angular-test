package angular.test

class TemplateController {

    def index() {
        render """\
<div>
        <h1>Front Page</h1>
        This page contain a directive &lt;inner/&gt;
        <inner name="Top" templates="{{templates}}"/>
</div>
"""
    }
    
    def "template-1"() {
        log.debug "template-1"
        render """\
<div>
        <h1>Template: 1</h1>
        <p>This template contains an &lt;inner/&gt; directive as well</p>
        <inner name="D1" templates="['template-4', 'template-5', 'template-6']"/>
</div>
"""
    }
    
    def "template-2"() {
        log.debug "template-2"
       render """\
<div>
        <h1>Template: 2</h1>
        <p>This template contains an &lt;inner/&gt; directive as well</p>
        <inner name="D2" templates="['template-4', 'template-5', 'template-6']"/>
</div>
"""
    }
    
    def "template-3"() {
        log.debug "template-3"
       render """\
<div>
        <h1>Template: 3</h1>
        <p>This template contains an &lt;inner/&gt; directive as well</p>
        <inner name="D3" templates="['template-4', 'template-5', 'template-6']"/>
</div>
"""    }
    
    def "template-4"() {
        log.debug "template-4"
       render """\
<div>
        <h1>Template: 4</h1>
        <p>This template does not contain a directive</p>
</div>
"""
    }
    
    def "template-5"() {
        log.debug "template-5"
       render """\
<div>
        <h1>Template: 5</h1>
        <p>This template does not contain a directive</p>
</div>
"""
    }

    def "template-6"() {
        log.debug "template-6"
       render """\
<div>
        <h1>Template: 6</h1>
        <p>This template does not contain a directive</p>
</div>
"""
    }
}
