import Ember from 'ember';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';

import {
  // computed,
  observer
} from '@ember/object';

export default Ember.Component.extend({
  store: service('store'),

  queryError: 'queryError',

  galleryId: null,
  contents: Ember.A([]),
  sortProperties: ['weight:desc', 'id:desc'],
  sortedContents: Ember.computed.sort('contents', 'sortProperties'),

  addContentFormOpen: false,
  newContent: null,

  classNames: ['gallery-contents'],

  isVisible: false,
  loading: false,

  galleryIdChanged: on('init', observer('galleryId', function() {
    return this.onUpdateGalleryId();
  })),

  onUpdateGalleryId() {
    const galleryId = this.get('galleryId');

    console.log('rodo:', galleryId);

    if (galleryId) {
      this.set('isVisible', true);
      this.set('loading', true);

      setTimeout(()=> {
        this.reloadGaleryContents(galleryId);
      }, 800);
    } else {
      this.set('isVisible', false);
      return this.clearData();
    }
  },

  clearData() {
    this.set('contents', Ember.A());
    this.set('newContent', null)
  },

  reloadGaleryContents(galleryId) {
    this.clearData();

    this.loadGallery(galleryId)
    .then((gallery)=> {
      if (!gallery || !gallery.id) return null;
      return this.loadGalleryContents(galleryId);
    })
    .then( ()=> {
      this.set('loading', false);
      return null;
    })
    .catch( (err)=> {
      this.set('loading', false);
      this.send('queryError', err);
      return null;
    });
  },

  loadGallery(galleryId) {
    return new Promise( (resolve, reject)=> {
      const store = this.get('store');

      let gallery = store.peekRecord('gallery', galleryId);
      if (gallery) {
        this.set('gallery', gallery);
        return resolve(gallery);
      }

      store.findRecord('gallery-content', galleryId)
      .then( (gallery)=> {
        this.set('gallery', gallery);
        resolve(gallery);
        return null;
      })
      .catch(reject);
    });
  },
  loadGalleryContents(galleryId) {
    return new Promise( (resolve, reject)=> {
      return this.get('store').query('gallery-content', {
        galleryId: galleryId
      })
      .then( (r)=> {
        this.set('contents', r.toArray());
        return resolve(r);
      })
      .catch(reject);
    });
  },

  actions: {
    addContent(type) {
      if (!type) type = 'image';

      const galleryId = this.get('galleryId');
      if (!galleryId) return null;

      let gallery = this.get('gallery');

      let r = this.get('store').createRecord('gallery-content', {
        type: type,
        gallery: gallery
      });

      this.set('newContent', r);
    },

    saveContent(content) {
      return content.save().then( (r)=> {
        this.set('loading', false);
        const contents = this.get('contents');
        contents.pushObject(r);

        this.set('loading', false);
        this.set('newContent', null);
      })
      .catch( (err)=> {
        this.set('loading', false);
        this.send('queryError', err);
        return null;
      });
    },
    updateContent(content) {
      return content.save().then(()=> {
        this.set('loading', false);
      })
      .catch( (err)=> {
        this.set('loading', false);
        this.send('queryError', err);
        return null;
      });
    },

    destroyContent(content) {
      if (confirm('Tem certeza que deseja deletar esse conteúdo da galeria?')) {
        this.get('contents').removeObject(content);
        content.destroyRecord();
      }
    },

    increaseWeight(content) {
      content.incrementProperty('weight');
      content.save();
    },
    decreaseWeight(content) {
      content.decrementProperty('weight');
      content.save();
    },

    cancelAddContent() {
      let newContent = this.get('newContent');
      newContent.deleteRecord();
      this.set('newContent', null);
    },

    queryError(err) {
      this.sendAction('queryError', err);
    }
  }
});
