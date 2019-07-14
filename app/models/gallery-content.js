import DS from 'ember-data';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;
inflector.irregular('gallery-content', 'gallery-content');
inflector.uncountable('gallery-content');

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  type: DS.attr('string', {
    defaultValue: 'image'
  }),
  videoUrl: DS.attr('string'),
  videoThumbnailUrl: DS.attr('string'),
  weight: DS.attr('number'),
  image: DS.attr('array'),
  linkPermanent: DS.attr(),
  metadata: DS.attr(),
  gallery: DS.belongsTo('gallery', {
    async: true,
    inverse:'contents'
  }),
  setAlias: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});