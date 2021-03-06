import Ember from 'ember';
import { initialize } from '../../../initializers/ember-feature-flags';
import { module, test } from 'qunit';
import config from "dummy/config/environment";

var container, application, oldFeatureFlagsService;

module('EmberFeatureFlagsInitializer', {
  beforeEach: function() {
    oldFeatureFlagsService = config.featureFlagsService;
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  },
  afterEach: function() {
    config.featureFlagsService = oldFeatureFlagsService;
  }
});

test('service is registered', function(assert) {
  initialize(container, application);
  var service = container.lookup('features:-main');
  assert.ok(service, 'service is registered');
});

test('service has application injected', function(assert) {
  initialize(container, application);
  var service = container.lookup('features:-main');
  assert.ok(service.application, 'service has application');
});

['route', 'controller', 'component'].forEach(function(type){
  test(type+' has service injected', function(assert) {
    initialize(container, application);
    container.register(type+':main', Ember.Object.extend());
    var instance = container.lookup(type+':main');
    assert.ok(instance.features, 'service is injected');
  });
});

['route', 'controller', 'component'].forEach(function(type){
  test(type+' has service injected with custom name', function(assert) {
    config.featureFlagsService = 'wackyWhoop';
    initialize(container, application);
    container.register(type+':main', Ember.Object.extend());
    var instance = container.lookup(type+':main');
    assert.ok(instance.wackyWhoop, 'service is injected');
  });
});
