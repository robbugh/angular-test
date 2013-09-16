import java.util.logging.Logger;

import org.springframework.context.annotation.DependsOn;

import grails.util.Environment

def dev  = grails.util.GrailsUtil.isDevelopmentEnv()
def test = Environment.current == Environment.TEST
def isDevOrTestEnvironment = (dev || test)
def minifiedSuffix = isDevOrTestEnvironment ? "" : ".min"

modules = {
    log.debug "Using ${isDevOrTestEnvironment ? 'un-' : ''}minified Angular libs."
    
    application {
        resource url:'js/application.js'
    }

    slui {
        dependsOn 'jquery, angular, angularResource'
        resource url: 'js/slui/app.js'
    }
    
    angularResource {
        dependsOn 'angular'
        resource id: 'js', url: [dir: 'js/angular', file: "angular-resource${minifiedSuffix}.js"], nominify: true
    }

    angular {
        resource id: 'js', url: [dir: 'js/angular', file: "angular${minifiedSuffix}.js"], nominify: true
        resource id: 'js', url: [dir: 'js/angular', file: "angular-cookies${minifiedSuffix}.js"], nominify: true
    }
}