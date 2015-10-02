import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('radio-button', 'Integration | Component | radio button', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(8);

  this.set('annotationType', 'marker');  
  this.render(hbs`{{ radio-button name='annotation-type' value='marker' groupValue=annotationType }}`);

  assert.equal(this.$('input').attr('type'), 'radio');
  assert.equal(this.$('input').attr('name'), 'annotation-type');
  assert.equal(this.$('input').attr('value'), 'marker');
  assert.ok(this.$('input').prop('checked'));

  this.set('annotationType', 'feature');
  this.render(hbs`{{ radio-button name='annotation-type' value='marker' groupValue=annotationType }}`);
  
  assert.equal(this.$('input').attr('type'), 'radio');
  assert.equal(this.$('input').attr('name'), 'annotation-type');
  assert.equal(this.$('input').attr('value'), 'marker');
  assert.ok(!this.$('input').prop('checked'));

});

test('clicking the radio button updates the groupValue', function(assert) {
  assert.expect(5);

  this.set('annotationType', 'feature');

  this.render(hbs`{{ radio-button name='annotation-type' value='marker' groupValue=annotationType action="onChange" }}`);

  //check initial values
  assert.equal(this.get('annotationType'), 'feature');
  assert.ok(!this.$('input').prop('checked'));

  this.on('onChange', a => {
    //clicking should update the annotationType and the checked attribute
    assert.equal(a, 'marker');

    assert.equal(this.get('annotationType'), 'marker');
    assert.ok(this.$('input').prop('checked'));
  });
  
  this.$('input').click();

});
