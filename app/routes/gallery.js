import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  actions: {
    deleteRecord(record) {
      if (confirm(`Tem certeza que deseja deletar a galeria "${record.get('name')}"? \nEssa ação não pode ser desfeita.`)) {
        record.destroyRecord()
        .then( ()=> {
          this.get('notifications').success(`A galeria "${record.get('name')}" foi deletada.`);
          this.transitionTo('gallery.index');
          return null;
        });
      }
    },
    changePublishedStatus(record, status) {
      Ember.set(record, 'published', status);
      if (status) {
        Ember.set(record, 'publishedAt', new Date());
      } else {
        Ember.set(record, 'publishedAt', null);
      }

      record.save()
      .then( (r)=> {
        if (status) {
          this.get('notifications').success('Galeria publicada.');
        } else {
          this.get('notifications').success('Galeria despublicada.');
        }
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    },
    save(record, alias) {
      record.save()
      .then( function saveAlias(content) {
        return alias.save()
        .then( ()=> {
          return content;
        });
      })
      .then( (r)=> {
        this.get('notifications').success('Galeria salva.');
        // move scroll to top:
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
        return err;
      });
    }
  }
});
