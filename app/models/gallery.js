import DS from 'ember-data';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;
inflector.irregular('gallery', 'gallery');
inflector.uncountable('gallery');

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  allowVideo: DS.attr('boolean', {
    defaultValue: 'true'
  }),
  allowImage: DS.attr('boolean', {
    defaultValue: 'true'
  }),
  tags: DS.attr(),
  linkPermanent: DS.attr(),
  metadata: DS.attr(),
  contents: DS.hasMany('gallery-content', {
    async: true,
    inverse:'gallery'
  }),
  date: DS.attr('date'),
  setAlias: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});