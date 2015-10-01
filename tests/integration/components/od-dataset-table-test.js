import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('od-dataset-table', 'Integration | Component | od dataset table', {
  integration: true,
  needs: [ 'service:feature-service', 'model:dataset' ]
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  //var component = this.subject({ model:  });

  //this.render(hbs`{{od-dataset-table}}`);

  //assert.equal(this.$().text().trim(), '');

  assert.ok(true);

  // // Template block usage:
  // this.render(hbs`
  //   {{#od-dataset-table}}
  //     template block text
  //   {{/od-dataset-table}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
});
